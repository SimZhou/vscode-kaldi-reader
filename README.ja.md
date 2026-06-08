<p align="center">
  <img src="https://raw.githubusercontent.com/SimZhou/vscode-kaldi-reader/main/logo/vscode-kaldi-reader.LOGO.v1.sticker.png" alt="Kaldi Reader" width="180">
</p>

<h1 align="center">Kaldi Reader - SCP & ARK Viewer</h1>

<p align="center">
  <a href="https://github.com/SimZhou/vscode-kaldi-reader/blob/main/README.md">English</a> | <a href="https://github.com/SimZhou/vscode-kaldi-reader/blob/main/README.zh-CN.md">简体中文</a> | 日本語
</p>

---

Kaldi Reader は、VS Code で Kaldi の `.scp` ファイルを開き、`.ark:<offset>` 参照をクリックして実際の entry を確認するための拡張です。トレーニングデータ、feature matrix、alignment vector、wav ark に格納された音声片段の確認に使えます。

対応している Kaldi ark entry:

- `wav.ark:<offset>`: offset が `RIFF/WAVE` を指すことを確認し、[AudioLens](https://github.com/SimZhou/vscode-audiolens) で音声を開きます。
- `FloatMatrix(FM)`: 全 matrix を raw text として開きます。
- `CompressedMatrix(CM / CM2 / CM3)`: entry を展開し、全 matrix を raw text として開きます。
- `Int32Vector`: alignment でよく使われる整数列を raw text として開きます。

## インストール

Visual Studio Marketplace からインストールできます:

https://marketplace.visualstudio.com/items?itemName=simzhou.kaldi-reader

Open VSX からもインストールできます:

https://open-vsx.org/extension/simzhou/kaldi-reader

通常の `.wav`、`.flac`、`.mp3`、`.pcm`、`.raw` などの音声ファイルパスもクリックして開きたい場合は、音声ビューア拡張の [AudioLens](https://github.com/SimZhou/vscode-audiolens) もインストールしてください:

https://marketplace.visualstudio.com/items?itemName=simzhou.audiolens

## 使い方

Kaldi の `.scp` ファイルを開きます。例:

```text
utt001 /data/train/feats.ark:12345
utt002 feats.ark:67890
utt003 ali.ark:345
```

Kaldi Reader は `*.ark:<offset>` 参照をクリック可能なリンクにします。リンクをクリックすると:

- wav ark entry は [AudioLens](https://github.com/SimZhou/vscode-audiolens) で開きます。
- feature matrix entry は raw matrix text として開きます。
- alignment / int-vector entry は raw integer sequence text として開きます。

Kaldi Reader は workspace extension なので、ローカル workspace と Remote SSH workspace の両方で動作します。`.scp` ファイルと参照先の `.ark` ファイルがリモートマシン上にある場合、解析と読み込みはリモート側の extension host で行われます。

## パス解決

相対 ark パスは、次の 2 つの安定した基準で解決します:

1. 現在の `.scp` ファイルがあるディレクトリ。
2. 現在の workspace root。

暗黙の CWD に依存するパスは自動では推測しません。大きなトレーニングデータディレクトリでは同名ファイルが多いため、誤った ark ファイルを開くことを避けるためです。

## 通常の音声パス

Kaldi Reader が処理するのは `*.ark:<offset>` だけです。通常の音声パス、例えば:

```text
/data/audio/utt001.wav
utt002 /data/audio/utt002.flac
```

[AudioLens](https://github.com/SimZhou/vscode-audiolens) を使ってください。AudioLens はテキストファイル内の通常の音声パスをクリック可能なリンクにできます。

## VSIX からインストール

```bash
code --install-extension dist/kaldi-reader-0.1.2.vsix
```

## 開発

```bash
npm install
npm run build
npm run typecheck
npm run package
```

VS Code で `F5` を押して extension development host を起動し、Kaldi `.scp` ファイルを開いて ark entry リンクをクリックします。

## 作者

SimZhou: https://simzhou.com/en/about/

## Copyright

Copyright (c) 2026 SimZhou. All rights reserved.
