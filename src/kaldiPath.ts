import * as path from "node:path";
import { existsSync } from "node:fs";

export interface ArkLocation {
  arkPath: string;
  offset: number;
}

export interface ResolvedArkLocation extends ArkLocation {
  original: string;
  baseDir?: string;
}

const ARK_LOCATION_PATTERN = /^(.*\.ark):(\d+)$/i;
const ARK_TOKEN_PATTERN = /[^\s]+\.ark:\d+/gi;

export function parseArkLocation(value: string): ArkLocation | undefined {
  const match = ARK_LOCATION_PATTERN.exec(value.trim());
  if (!match) {
    return undefined;
  }

  const offset = Number(match[2]);
  if (!Number.isSafeInteger(offset) || offset < 0) {
    return undefined;
  }

  return { arkPath: match[1], offset };
}

export function formatArkLocation(location: ArkLocation): string {
  return `${location.arkPath}:${location.offset}`;
}

export function resolveArkLocation(value: string, baseDir?: string): ResolvedArkLocation | undefined {
  return resolveArkLocationFromBases(value, baseDir ? [baseDir] : []);
}

export function resolveArkLocationFromBases(
  value: string,
  baseDirs: readonly string[]
): ResolvedArkLocation | undefined {
  const parsed = parseArkLocation(value);
  if (!parsed) {
    return undefined;
  }

  if (path.isAbsolute(parsed.arkPath)) {
    return {
      arkPath: parsed.arkPath,
      offset: parsed.offset,
      original: value
    };
  }

  const uniqueBaseDirs = uniqueStrings(baseDirs);
  const existingPath = uniqueBaseDirs
    .map((baseDir) => ({ baseDir, arkPath: path.resolve(baseDir, parsed.arkPath) }))
    .find((candidate) => existsSync(candidate.arkPath));

  if (!existingPath) {
    return undefined;
  }

  return {
    arkPath: existingPath.arkPath,
    offset: parsed.offset,
    original: value,
    baseDir: existingPath.baseDir
  };
}

function uniqueStrings(values: readonly string[]): string[] {
  return Array.from(new Set(values.filter((value) => value.length > 0)));
}

export interface ArkReference {
  token: string;
  start: number;
  end: number;
}

export function findArkReferences(line: string): ArkReference[] {
  const references: ArkReference[] = [];
  for (const match of line.matchAll(ARK_TOKEN_PATTERN)) {
    const start = match.index;
    if (start === undefined) {
      continue;
    }

    references.push({
      token: match[0],
      start,
      end: start + match[0].length
    });
  }

  return references;
}
