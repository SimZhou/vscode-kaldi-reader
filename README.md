<p align="center">
  <img src="https://raw.githubusercontent.com/SimZhou/vscode-kaldi-reader/main/logo/vscode-kaldi-reader.LOGO.v1.sticker.png" alt="Kaldi Reader" width="180">
</p>

<h1 align="center">Kaldi Reader - SCP & ARK Viewer</h1>

<p align="center">
  English | <a href="https://github.com/SimZhou/vscode-kaldi-reader/blob/main/README.zh-CN.md">简体中文</a> | <a href="https://github.com/SimZhou/vscode-kaldi-reader/blob/main/README.ja.md">日本語</a>
</p>

---

Kaldi Reader lets you open Kaldi `.scp` files in VS Code and click `.ark:<offset>` references to inspect the actual entry. It is built for browsing training data, feature matrices, alignment vectors, and audio segments packed in wav ark files.

Supported Kaldi ark entries:

- `wav.ark:<offset>`: validates `RIFF/WAVE` at the offset and opens the audio with [AudioLens](https://github.com/SimZhou/vscode-audiolens).
- `FloatMatrix(FM)`: opens the full matrix as raw text.
- `CompressedMatrix(CM / CM2 / CM3)`: decompresses the entry and opens the full matrix as raw text.
- `Int32Vector`: opens the full integer sequence as raw text, commonly used for alignments.

## Install

Install from the Visual Studio Marketplace:

https://marketplace.visualstudio.com/items?itemName=simzhou.kaldi-reader

Or from Open VSX:

https://open-vsx.org/extension/simzhou/kaldi-reader

For ordinary audio file paths such as `.wav`, `.flac`, `.mp3`, `.pcm`, and `.raw`, install [AudioLens](https://github.com/SimZhou/vscode-audiolens), the companion audio viewer extension:

https://marketplace.visualstudio.com/items?itemName=simzhou.audiolens

## Usage

Open a Kaldi `.scp` file, for example:

```text
utt001 /data/train/feats.ark:12345
utt002 feats.ark:67890
utt003 ali.ark:345
```

Kaldi Reader turns `*.ark:<offset>` references into clickable links. When you click a link:

- wav ark entries open in [AudioLens](https://github.com/SimZhou/vscode-audiolens).
- feature matrix entries open as raw matrix text.
- alignment / int-vector entries open as raw integer sequence text.

Kaldi Reader is a workspace extension and works in both local and Remote SSH workspaces. If the `.scp` file and the referenced `.ark` file are on a remote machine, parsing and reading happen in the remote extension host.

## Path Resolution

Relative ark paths are resolved with two stable bases:

1. The directory of the current `.scp` file.
2. The current workspace root.

Other implicit CWD-based paths are not guessed automatically. This avoids opening the wrong ark file in large training directories where duplicate file names are common.

## Ordinary Audio Paths

Kaldi Reader only handles `*.ark:<offset>`. For ordinary audio paths such as:

```text
/data/audio/utt001.wav
utt002 /data/audio/utt002.flac
```

Use [AudioLens](https://github.com/SimZhou/vscode-audiolens). AudioLens can turn ordinary audio paths in text files into clickable links.

## Install From VSIX

Install a local packaged build with:

```bash
code --install-extension dist/kaldi-reader-0.1.1.vsix
```

## Development

```bash
npm install
npm run build
npm run typecheck
npm run package
```

Press `F5` in VS Code and choose the extension development host. Open a Kaldi `.scp` file and click an ark entry link.

## Author

SimZhou: https://simzhou.com/en/about/

## Copyright

Copyright (c) 2026 SimZhou. All rights reserved.
