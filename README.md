<p align="center">
  <img src="https://raw.githubusercontent.com/SimZhou/vscode-kaldi-reader/main/logo/kaldi-reader-logo-placeholder.png" alt="Kaldi Reader" width="180">
</p>

<h1 align="center">Kaldi Reader</h1>

<p align="center">
  English | <a href="https://github.com/SimZhou/vscode-kaldi-reader/blob/main/README.zh-CN.md">简体中文</a> | <a href="https://github.com/SimZhou/vscode-kaldi-reader/blob/main/README.ja.md">日本語</a>
</p>

---

Kaldi Reader is a Visual Studio Code extension for reading and routing Kaldi `.scp` and `.ark` data. It focuses on Kaldi archive entries and keeps ordinary audio path linking in AudioLens.

## Highlights

- Detects `*.ark:<offset>` references in Kaldi `.scp` files and turns them into clickable links.
- Validates wav ark entries at the byte offset and opens them with AudioLens.
- Reads Kaldi binary `FloatMatrix(FM)` entries as raw matrix text.
- Reads Kaldi binary `Int32Vector` entries as raw integer vector text.
- Resolves relative ark paths from the `.scp` file directory first, then from the current workspace root.
- Works as a workspace extension for local and Remote SSH workspaces.
- Follows the VS Code display language by default.

## Scope

Kaldi Reader handles Kaldi ark offset links:

```text
wav.ark:12345
feats.ark:12345
ali.ark:12345
```

AudioLens handles ordinary audio paths in text files, such as `.wav`, `.flac`, `.mp3`, `.pcm`, and `.raw`. AudioLens can still open `.ark` files directly, but Kaldi Reader owns text-link detection for `*.ark:<offset>`.

## Relative Ark Paths

Relative ark paths are resolved with two stable bases:

1. The directory of the current `.scp` file.
2. The current workspace root.

Other implicit CWD-based paths are not guessed automatically.

## Test Data

The repository includes local samples:

- `tests/kaldi-wavark`: wav ark and `.scp` cases.
- `tests/repacked`: feats and alignment ark cases.
- `tests/normal_wavlist_and_wavscp`: ordinary audio path list samples for AudioLens handoff context.

## Install From VSIX

Install a local packaged build with:

```bash
code --install-extension dist/kaldi-reader-0.1.0.vsix
```

## Development

```bash
npm install
npm run build
npm run typecheck
npm run package
```

Press `F5` in VS Code and choose the extension development host. Open one of the `.scp` files in `tests/` and click an ark entry link.

## Author

SimZhou: https://simzhou.com/en/about/

## Copyright

Copyright (c) 2026 SimZhou. All rights reserved.
