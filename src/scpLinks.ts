import * as path from "node:path";
import * as vscode from "vscode";
import { messages } from "./i18n";
import { findArkReferences, formatArkLocation, resolveArkLocationFromBases } from "./kaldiPath";

interface OpenArkEntryArgument {
  location: string;
  originalLocation: string;
  sourceScp: string;
  unresolved?: boolean;
  key?: string;
}

export class ScpDocumentLinkProvider implements vscode.DocumentLinkProvider {
  provideDocumentLinks(document: vscode.TextDocument): vscode.DocumentLink[] {
    const links: vscode.DocumentLink[] = [];
    const baseDirs = getRelativeBaseDirs(document.uri);

    for (let lineNumber = 0; lineNumber < document.lineCount; lineNumber += 1) {
      const line = document.lineAt(lineNumber);
      const key = getScpKey(line.text);

      for (const reference of findArkReferences(line.text)) {
        const resolved = resolveArkLocationFromBases(reference.token, baseDirs);

        const range = new vscode.Range(
          lineNumber,
          reference.start,
          lineNumber,
          reference.end
        );
        const argument: OpenArkEntryArgument = {
          location: resolved ? formatArkLocation(resolved) : reference.token,
          originalLocation: reference.token,
          sourceScp: document.uri.fsPath,
          unresolved: resolved === undefined,
          key
        };
        const link = new vscode.DocumentLink(range, buildCommandUri(argument));
        link.tooltip = resolved
          ? messages().documentLinkOpen(reference.token)
          : messages().documentLinkResolve(reference.token);
        links.push(link);
      }
    }

    return links;
  }
}

function getRelativeBaseDirs(uri: vscode.Uri): string[] {
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

function getScpKey(line: string): string | undefined {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) {
    return undefined;
  }

  return trimmed.split(/\s+/, 1)[0];
}

function buildCommandUri(argument: OpenArkEntryArgument): vscode.Uri {
  return vscode.Uri.parse(
    `command:kaldiReader.openArkEntry?${encodeURIComponent(JSON.stringify([argument]))}`
  );
}
