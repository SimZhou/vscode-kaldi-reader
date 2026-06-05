import { open } from "node:fs/promises";
import { messages } from "./i18n";
import { ArkLocation } from "./kaldiPath";

const BINARY_HEADER = Buffer.from([0x00, 0x42]);
const BASIC_TYPE_INT32_SIZE = 4;

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
