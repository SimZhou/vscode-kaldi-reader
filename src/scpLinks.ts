import * as vscode from "vscode";
import { messages } from "./i18n";
import { findArkReferences } from "./kaldiPath";

interface OpenArkEntryArgument {
  location: string;
  originalLocation?: string;
  sourceScp: string;
  unresolved?: boolean;
  key?: string;
}

export class ScpDocumentLinkProvider implements vscode.DocumentLinkProvider {
  provideDocumentLinks(document: vscode.TextDocument): vscode.DocumentLink[] {
    const links: vscode.DocumentLink[] = [];

    for (let lineNumber = 0; lineNumber < document.lineCount; lineNumber += 1) {
      const line = document.lineAt(lineNumber);

      for (const reference of findArkReferences(line.text)) {
        const range = new vscode.Range(
          lineNumber,
          reference.start,
          lineNumber,
          reference.end
        );
        const argument: OpenArkEntryArgument = {
          location: reference.token,
          sourceScp: document.uri.fsPath
        };
        const link = new vscode.DocumentLink(range, buildCommandUri(argument));
        link.tooltip = messages().documentLinkOpen(reference.token);
        links.push(link);
      }
    }

    return links;
  }
}

function buildCommandUri(argument: OpenArkEntryArgument): vscode.Uri {
  return vscode.Uri.parse(
    `command:kaldiReader.openArkEntry?${encodeURIComponent(JSON.stringify([argument]))}`
  );
}
