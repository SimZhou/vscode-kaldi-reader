import { open } from "node:fs/promises";
import { messages } from "./i18n";
import { ArkLocation } from "./kaldiPath";

const BINARY_HEADER = Buffer.from([0x00, 0x42]);
const BASIC_TYPE_INT32_SIZE = 4;
const COMPRESSED_GLOBAL_HEADER_BYTES_IN_FILE = 16;
const COMPRESSED_PER_COL_HEADER_BYTES = 8;

export type KaldiArkEntry = FloatMatrixEntry | Int32VectorEntry | UnknownEntry;

export interface FloatMatrixEntry {
  kind: "float-matrix";
  rows: number;
  cols: number;
  rowsData: number[][];
}

export interface Int32VectorEntry {
  kind: "int32-vector";
  size: number;
  values: number[];
}

export interface UnknownEntry {
  kind: "unknown";
  reason: string;
}

export async function readKaldiArkEntry(
  location: ArkLocation
): Promise<KaldiArkEntry> {
  const handle = await open(location.arkPath, "r");
  try {
    const prefix = await readExact(handle.fd, location.offset, 16);
    if (!prefix.subarray(0, 2).equals(BINARY_HEADER)) {
      return { kind: "unknown", reason: messages().binaryOnly };
    }

    const payloadOffset = location.offset + 2;
    const firstPayloadByte = prefix[2];
    if (firstPayloadByte === BASIC_TYPE_INT32_SIZE) {
      return await readInt32Vector(handle.fd, payloadOffset);
    }

    const token = readBinaryToken(prefix, 2);
    if (token.value === "FM") {
      return await readFloatMatrix(handle.fd, location.offset + 2 + token.bytesRead);
    }
    if (token.value === "CM" || token.value === "CM2" || token.value === "CM3") {
      return await readCompressedMatrix(
        handle.fd,
        location.offset + 2 + token.bytesRead,
        getCompressedMatrixFormat(token.value)
      );
    }

    return { kind: "unknown", reason: messages().unsupportedBinaryToken(token.value) };
  } finally {
    await handle.close();
  }
}

async function readFloatMatrix(fd: number, offset: number): Promise<FloatMatrixEntry> {
  const dims = await readExact(fd, offset, 10);
  const rows = readTaggedInt32(dims, 0);
  const cols = readTaggedInt32(dims, 5);
  const data = await readExact(fd, offset + 10, rows * cols * 4);
  const rowsData: number[][] = [];

  for (let row = 0; row < rows; row += 1) {
    const values: number[] = [];
    for (let col = 0; col < cols; col += 1) {
      values.push(data.readFloatLE((row * cols + col) * 4));
    }
    rowsData.push(values);
  }

  return { kind: "float-matrix", rows, cols, rowsData };
}

interface CompressedMatrixHeader {
  format: number;
  minValue: number;
  range: number;
  rows: number;
  cols: number;
}

async function readCompressedMatrix(
  fd: number,
  offset: number,
  format: number
): Promise<FloatMatrixEntry> {
  const headerBuffer = await readExact(fd, offset, COMPRESSED_GLOBAL_HEADER_BYTES_IN_FILE);
  const header: CompressedMatrixHeader = {
    format,
    minValue: headerBuffer.readFloatLE(0),
    range: headerBuffer.readFloatLE(4),
    rows: headerBuffer.readInt32LE(8),
    cols: headerBuffer.readInt32LE(12)
  };

  validateMatrixShape(header.rows, header.cols);
  if (header.rows === 0 || header.cols === 0) {
    return { kind: "float-matrix", rows: header.rows, cols: header.cols, rowsData: [] };
  }

  const data = await readExact(
    fd,
    offset + COMPRESSED_GLOBAL_HEADER_BYTES_IN_FILE,
    getCompressedMatrixDataSize(header)
  );

  if (header.format === 1) {
    return decodeOneByteWithColHeaders(header, data);
  }
  if (header.format === 2) {
    return decodeTwoByteCompressedMatrix(header, data);
  }
  if (header.format === 3) {
    return decodeOneByteCompressedMatrix(header, data);
  }

  throw new Error(messages().unsupportedBinaryToken(`CM format ${header.format}`));
}

function decodeOneByteWithColHeaders(
  header: CompressedMatrixHeader,
  data: Buffer
): FloatMatrixEntry {
  const rowsData = createRows(header.rows, header.cols);
  const byteDataOffset = header.cols * COMPRESSED_PER_COL_HEADER_BYTES;

  for (let col = 0; col < header.cols; col += 1) {
    const headerOffset = col * COMPRESSED_PER_COL_HEADER_BYTES;
    const p0 = uint16ToFloat(header, data.readUInt16LE(headerOffset));
    const p25 = uint16ToFloat(header, data.readUInt16LE(headerOffset + 2));
    const p75 = uint16ToFloat(header, data.readUInt16LE(headerOffset + 4));
    const p100 = uint16ToFloat(header, data.readUInt16LE(headerOffset + 6));
    const columnOffset = byteDataOffset + col * header.rows;

    for (let row = 0; row < header.rows; row += 1) {
      rowsData[row][col] = charToFloat(p0, p25, p75, p100, data[columnOffset + row]);
    }
  }

  return { kind: "float-matrix", rows: header.rows, cols: header.cols, rowsData };
}

function decodeTwoByteCompressedMatrix(
  header: CompressedMatrixHeader,
  data: Buffer
): FloatMatrixEntry {
  const rowsData = createRows(header.rows, header.cols);
  const increment = header.range * (1.0 / 65535.0);

  for (let row = 0; row < header.rows; row += 1) {
    for (let col = 0; col < header.cols; col += 1) {
      const value = data.readUInt16LE((row * header.cols + col) * 2);
      rowsData[row][col] = header.minValue + value * increment;
    }
  }

  return { kind: "float-matrix", rows: header.rows, cols: header.cols, rowsData };
}

function decodeOneByteCompressedMatrix(
  header: CompressedMatrixHeader,
  data: Buffer
): FloatMatrixEntry {
  const rowsData = createRows(header.rows, header.cols);
  const increment = header.range * (1.0 / 255.0);

  for (let row = 0; row < header.rows; row += 1) {
    for (let col = 0; col < header.cols; col += 1) {
      rowsData[row][col] = header.minValue + data[row * header.cols + col] * increment;
    }
  }

  return { kind: "float-matrix", rows: header.rows, cols: header.cols, rowsData };
}

async function readInt32Vector(fd: number, offset: number): Promise<Int32VectorEntry> {
  const sizeBuffer = await readExact(fd, offset, 5);
  const size = readTaggedInt32(sizeBuffer, 0);
  const data = await readExact(fd, offset + 5, size * 5);
  const values: number[] = [];

  for (let index = 0; index < size; index += 1) {
    values.push(readTaggedInt32(data, index * 5));
  }

  return { kind: "int32-vector", size, values };
}

function getCompressedMatrixFormat(token: string): number {
  if (token === "CM") {
    return 1;
  }
  if (token === "CM2") {
    return 2;
  }
  return 3;
}

function getCompressedMatrixDataSize(header: CompressedMatrixHeader): number {
  if (header.format === 1) {
    return header.cols * (COMPRESSED_PER_COL_HEADER_BYTES + header.rows);
  }
  if (header.format === 2) {
    return 2 * header.rows * header.cols;
  }
  if (header.format === 3) {
    return header.rows * header.cols;
  }

  throw new Error(messages().unsupportedBinaryToken(`CM format ${header.format}`));
}

function createRows(rows: number, cols: number): number[][] {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0));
}

function validateMatrixShape(rows: number, cols: number): void {
  if (!Number.isSafeInteger(rows) || rows < 0 || !Number.isSafeInteger(cols) || cols < 0) {
    throw new Error(`Invalid matrix shape: ${rows} x ${cols}`);
  }
}

function uint16ToFloat(header: CompressedMatrixHeader, value: number): number {
  return header.minValue + header.range * value * (1.0 / 65535.0);
}

function charToFloat(p0: number, p25: number, p75: number, p100: number, value: number): number {
  if (value <= 64) {
    return p0 + (p25 - p0) * value * (1.0 / 64.0);
  }
  if (value <= 192) {
    return p25 + (p75 - p25) * (value - 64) * (1.0 / 128.0);
  }
  return p75 + (p100 - p75) * (value - 192) * (1.0 / 63.0);
}

function readBinaryToken(buffer: Buffer, offset: number): { value: string; bytesRead: number } {
  const end = buffer.indexOf(0x20, offset);
  if (end < 0) {
    throw new Error(messages().readBinaryTokenFailed);
  }

  return {
    value: buffer.toString("ascii", offset, end),
    bytesRead: end - offset + 1
  };
}

function readTaggedInt32(buffer: Buffer, offset: number): number {
  const size = buffer[offset];
  if (size !== BASIC_TYPE_INT32_SIZE) {
    throw new Error(messages().unsupportedBasicTypeSize(size));
  }

  return buffer.readInt32LE(offset + 1);
}

async function readExact(fd: number, offset: number, length: number): Promise<Buffer> {
  const buffer = Buffer.alloc(length);
  const result = await new Promise<{ bytesRead: number }>((resolve, reject) => {
    const fs = require("node:fs") as typeof import("node:fs");
    fs.read(fd, buffer, 0, length, offset, (error, bytesRead) => {
      if (error) {
        reject(error);
        return;
      }
      resolve({ bytesRead });
    });
  });

  if (result.bytesRead !== length) {
    throw new Error(messages().incompleteArkEntry(length, result.bytesRead));
  }

  return buffer;
}
