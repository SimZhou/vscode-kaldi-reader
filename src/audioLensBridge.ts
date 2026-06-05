import * as vscode from "vscode";
import { messages } from "./i18n";
import { ArkLocation } from "./kaldiPath";

const AUDIO_LENS_VIEW_TYPE = "audiolens.audioPreview";
const ARK_OFFSET_QUERY_KEY = "arkOffset";

export async function openWithAudioLens(location: ArkLocation): Promise<void> {
  const target = withArkOffset(vscode.Uri.file(location.arkPath), location.offset);
  try {
    await vscode.commands.executeCommand("vscode.openWith", target, AUDIO_LENS_VIEW_TYPE);
  } catch (error) {
    vscode.window.showWarningMessage(messages().audioLensOpenFailed(getErrorMessage(error)));
  }
}

function withArkOffset(uri: vscode.Uri, offset: number): vscode.Uri {
  const params = new URLSearchParams(uri.query);
  params.set(ARK_OFFSET_QUERY_KEY, String(offset));
  return uri.with({ query: params.toString(), fragment: "" });
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
