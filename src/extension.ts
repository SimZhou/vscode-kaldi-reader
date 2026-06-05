import * as path from "node:path";
import * as vscode from "vscode";
import { openWithAudioLens } from "./audioLensBridge";
import { messages } from "./i18n";
import { KaldiArkEntry, readKaldiArkEntry } from "./kaldiBinary";
import {
  formatArkLocation,
  parseArkLocation,
  resolveArkLocationFromBases,
  ResolvedArkLocation
} from "./kaldiPath";
import { ScpDocumentLinkProvider } from "./scpLinks";
import { isWavArkEntry } from "./wavArk";

interface OpenArkEntryArgument {
  location?: string;
  originalLocation?: string;
  sourceScp?: string;
  unresolved?: boolean;
  key?: string;
}

interface NormalizedOpenArkEntryArgument extends OpenArkEntryArgument {
  location: string;
}

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand("kaldiReader.openArkEntry", openArkEntry),
    vscode.languages.registerDocumentLinkProvider(
      { language: "kaldi-scp", scheme: "file" },
      new ScpDocumentLinkProvider()
    )
  );
}

export function deactivate(): void {
  // 当前没有需要释放的资源。
}

async function openArkEntry(input?: string | OpenArkEntryArgument): Promise<void> {
  const request = await normalizeOpenRequest(input);
  if (!request) {
    return;
  }

  const resolved = resolveOpenArkLocation(request);
  if (!resolved) {
    return;
  }

  let isWav = false;
  try {
    isWav = await isWavArkEntry(resolved);
  } catch (error) {
    vscode.window.showWarningMessage(messages().readArkEntryFailed(getErrorMessage(error)));
    return;
  }

  if (isWav) {
    await openWithAudioLens(resolved);
    return;
  }

  await showNonAudioArkPreview(resolved, request);
}

async function normalizeOpenRequest(
  input?: string | OpenArkEntryArgument
): Promise<NormalizedOpenArkEntryArgument | undefined> {
  if (typeof input === "object" && typeof input.location === "string") {
    return { ...input, location: input.location };
  }

  if (typeof input === "string" && input.trim().length > 0) {
    return { location: input.trim() };
  }

  const value = await vscode.window.showInputBox({
    title: messages().openArkInputTitle,
    prompt: messages().openArkInputPrompt,
    placeHolder: "/path/to/wav.ark:23252"
  });
  if (!value) {
    return undefined;
  }

  const resolved = resolveArkLocationFromBases(value.trim(), getActiveRelativeBaseDirs());
  if (!resolved && isRelativeArkInput(value.trim())) {
    showRelativePathResolveFailed(value.trim());
    return undefined;
  }

  return {
    location: resolved ? formatArkLocation(resolved) : value.trim(),
    originalLocation: value.trim()
  };
}

function getActiveRelativeBaseDirs(): string[] {
  const uri = vscode.window.activeTextEditor?.document.uri;
  if (!uri || uri.scheme !== "file") {
    return vscode.workspace.workspaceFolders?.map((folder) => folder.uri.fsPath) ?? [];
  }

  const baseDirs = [path.dirname(uri.fsPath)];
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
  if (workspaceFolder) {
    baseDirs.push(workspaceFolder.uri.fsPath);
  }
  for (const folder of vscode.workspace.workspaceFolders ?? []) {
    baseDirs.push(folder.uri.fsPath);
  }

  return baseDirs;
}

function resolveOpenArkLocation(request: NormalizedOpenArkEntryArgument): ResolvedArkLocation | undefined {
  const parsed = parseArkLocation(request.location);
  if (!parsed) {
    vscode.window.showWarningMessage(messages().invalidArkLocation(request.location));
    return undefined;
  }

  if (path.isAbsolute(parsed.arkPath) && !request.unresolved) {
    return {
      ...parsed,
      original: request.originalLocation ?? request.location
    };
  }

  const resolved = resolveArkLocationFromBases(
    request.originalLocation ?? request.location,
    getRequestRelativeBaseDirs(request)
  );
  if (!resolved) {
    showRelativePathResolveFailed(request.originalLocation ?? request.location);
    return undefined;
  }

  return resolved;
}

function getRequestRelativeBaseDirs(request: OpenArkEntryArgument): string[] {
  const baseDirs: string[] = [];
  if (request.sourceScp) {
    baseDirs.push(path.dirname(request.sourceScp));
  }
  for (const folder of vscode.workspace.workspaceFolders ?? []) {
    baseDirs.push(folder.uri.fsPath);
  }

  return baseDirs;
}

async function showNonAudioArkPreview(
  location: ResolvedArkLocation,
  request: OpenArkEntryArgument
): Promise<void> {
  const title = `${path.basename(location.arkPath)}:${location.offset}`;
  const entry = await readKaldiArkEntry(location);
  const document = await vscode.workspace.openTextDocument({
    language: "plaintext",
    content: formatRawEntry(entry)
  });

  await vscode.window.showTextDocument(document, { preview: true });
  vscode.window.showInformationMessage(formatRecognizedMessage(entry, title));
}

function formatRawEntry(entry: KaldiArkEntry): string {
  if (entry.kind === "float-matrix") {
    return entry.rowsData.map((row) => formatNumberRow(row)).join("\n");
  }

  if (entry.kind === "int32-vector") {
    return entry.values.join(" ") + "\n";
  }

  return `${messages().reason(entry.reason)}\n`;
}

function formatRecognizedMessage(entry: KaldiArkEntry, title: string): string {
  return `${messages().recognizedArkEntry(getEntryTypeName(entry), title)} · ${getEntrySummary(entry)}`;
}

function getEntryTypeName(entry: KaldiArkEntry): string {
  if (entry.kind === "float-matrix") {
    return "FloatMatrix";
  }

  if (entry.kind === "int32-vector") {
    return "Int32Vector";
  }

  return "ArkEntry";
}

function getEntrySummary(entry: KaldiArkEntry): string {
  if (entry.kind === "float-matrix") {
    return messages().shape(entry.rows, entry.cols);
  }

  if (entry.kind === "int32-vector") {
    return messages().length(entry.size);
  }

  return messages().reason(entry.reason);
}

function formatNumberRow(row: number[]): string {
  return row.map((value) => value.toString()).join(" ");
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function isRelativeArkInput(value: string): boolean {
  const parsed = parseArkLocation(value);
  return parsed !== undefined && !path.isAbsolute(parsed.arkPath);
}

function showRelativePathResolveFailed(location: string): void {
  vscode.window.showWarningMessage(messages().relativePathResolveFailed(location));
}
