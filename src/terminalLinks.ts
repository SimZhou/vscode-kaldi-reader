import * as vscode from "vscode";
import { messages } from "./i18n";
import { findArkReferences } from "./kaldiPath";

class ArkTerminalLink extends vscode.TerminalLink {
  constructor(
    startIndex: number,
    length: number,
    readonly location: string,
    readonly baseDir?: string
  ) {
    super(startIndex, length, messages().documentLinkOpen(location));
  }
}

export class ArkTerminalLinkProvider implements vscode.TerminalLinkProvider<ArkTerminalLink> {
  provideTerminalLinks(context: vscode.TerminalLinkContext): ArkTerminalLink[] {
    return findArkReferences(context.line).map(
      (reference) =>
        new ArkTerminalLink(
          reference.start,
          reference.end - reference.start,
          reference.token,
          getTerminalCwd(context.terminal)
        )
    );
  }

  async handleTerminalLink(link: ArkTerminalLink): Promise<void> {
    await vscode.commands.executeCommand("kaldiReader.openArkEntry", {
      location: link.location,
      baseDir: link.baseDir
    });
  }
}

function getTerminalCwd(terminal: vscode.Terminal): string | undefined {
  const options = terminal.creationOptions;
  if (!("cwd" in options) || !options.cwd) {
    return undefined;
  }

  return typeof options.cwd === "string" ? options.cwd : options.cwd.fsPath;
}
