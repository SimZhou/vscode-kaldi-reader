import { open } from "node:fs/promises";
import { ArkLocation } from "./kaldiPath";

const RIFF = "RIFF";
const WAVE = "WAVE";

export async function isWavArkEntry(location: ArkLocation): Promise<boolean> {
  const handle = await open(location.arkPath, "r");
  try {
    const buffer = Buffer.alloc(12);
    const result = await handle.read(buffer, 0, buffer.length, location.offset);
    if (result.bytesRead < buffer.length) {
      return false;
    }

    return buffer.toString("ascii", 0, 4) === RIFF && buffer.toString("ascii", 8, 12) === WAVE;
  } finally {
    await handle.close();
  }
}
