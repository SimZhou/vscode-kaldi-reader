<p align="center">
  <img src="https://raw.githubusercontent.com/SimZhou/vscode-kaldi-reader/main/logo/kaldi-reader-logo-placeholder.svg" alt="Kaldi Reader" width="180">
</p>

<h1 align="center">Kaldi Reader</h1>

<p align="center">
  <a href="https://github.com/SimZhou/vscode-kaldi-reader/blob/main/README.md">English</a> | <a href="https://github.com/SimZhou/vscode-kaldi-reader/blob/main/README.zh-CN.md">简体中文</a> | 日本語
</p>

---

Kaldi Reader は、Kaldi の `.scp` / `.ark` データを読み取り、適切なビューアへ振り分ける Visual Studio Code 拡張です。Kaldi ark entry に集中し、通常の音声ファイルパスのリンク化は AudioLens に任せます。

## Highlights

- Kaldi `.scp` ファイル内の `*.ark:<offset>` 参照を検出し、クリック可能なリンクにします。
- wav ark entry の offset が `RIFF/WAVE` を指すことを確認し、AudioLens で開きます。
- Kaldi binary `FloatMatrix(FM)` を raw matrix text として出力します。
- Kaldi binary `Int32Vector` を raw integer vector text として出力します。
- 相対 ark パスは、まず `.scp` ファイルのディレクトリ、次に現在の workspace root から解決します。
- ローカルおよび Remote SSH workspace で動作する workspace extension です。
- VS Code の表示言語に従います。

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

## Install From VSIX

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

## Author

SimZhou: https://simzhou.com/en/about/

## Copyright

Copyright (c) 2026 SimZhou. All rights reserved.
