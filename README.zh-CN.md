<p align="center">
  <img src="https://raw.githubusercontent.com/SimZhou/vscode-kaldi-reader/main/logo/vscode-kaldi-reader.LOGO.v1.sticker.png" alt="Kaldi Reader" width="180">
</p>

<h1 align="center">Kaldi Reader - SCP & ARK Viewer</h1>

<p align="center">
  <a href="https://github.com/SimZhou/vscode-kaldi-reader/blob/main/README.md">English</a> | 简体中文 | <a href="https://github.com/SimZhou/vscode-kaldi-reader/blob/main/README.ja.md">日本語</a>
</p>

---

Kaldi Reader 让你可以直接在 VS Code 里打开 Kaldi `.scp` 文件，并点击其中的 `.ark:<offset>` 引用查看对应数据。它适合查看训练数据、特征矩阵、alignment 序列，以及打包在 wav ark 里的音频片段。

当前支持的 Kaldi ark entry：

- `wav.ark:<offset>`：校验 offset 处是否为 `RIFF/WAVE`，然后用 [AudioLens](https://github.com/SimZhou/vscode-audiolens) 打开音频。
- `FloatMatrix(FM)`：以 raw 矩阵文本显示全部数据。
- `CompressedMatrix(CM / CM2 / CM3)`：解压后以 raw 矩阵文本显示全部数据。
- `Int32Vector`：以 raw 整数序列显示全部数据，常用于 alignment。

## 安装

从 Visual Studio Marketplace 安装：

https://marketplace.visualstudio.com/items?itemName=simzhou.kaldi-reader

也可以从 Open VSX 安装：

https://open-vsx.org/extension/simzhou/kaldi-reader

如果你需要点击普通 `.wav`、`.flac`、`.mp3`、`.pcm`、`.raw` 等音频文件路径，推荐同时安装音频查看扩展 [AudioLens](https://github.com/SimZhou/vscode-audiolens)：

https://marketplace.visualstudio.com/items?itemName=simzhou.audiolens

## 使用方法

打开一个 Kaldi `.scp` 文件，例如：

```text
utt001 /data/train/feats.ark:12345
utt002 feats.ark:67890
utt003 ali.ark:345
```

Kaldi Reader 会把 `*.ark:<offset>` 变成可点击链接。点击后：

- 如果 entry 是 wav ark，插件会调用 [AudioLens](https://github.com/SimZhou/vscode-audiolens) 打开音频。
- 如果 entry 是 feature matrix，插件会直接打开一份 raw 矩阵文本。
- 如果 entry 是 alignment / int vector，插件会直接打开一份 raw 整数序列文本。

这个扩展是 workspace extension，支持本地工作区和 Remote SSH 工作区。远程机器上的 `.scp` 指向远程机器上的 `.ark` 时，会在远程扩展宿主里解析和读取。

## 路径解析

相对 ark 路径只支持两类稳定基准：

1. 当前 `.scp` 文件所在目录。
2. 当前 workspace 根目录。

其他隐含 CWD 的路径不会自动猜测。这样可以避免在训练数据目录很大、文件名重复很多时误打开错误的 ark 文件。

## 普通音频路径

Kaldi Reader 只处理 `*.ark:<offset>`。如果文本里是普通音频路径，例如：

```text
/data/audio/utt001.wav
utt002 /data/audio/utt002.flac
```

请使用 [AudioLens](https://github.com/SimZhou/vscode-audiolens) 打开。AudioLens 可以把文本文件中的普通音频路径转换成可点击链接。

## 从 VSIX 安装

```bash
code --install-extension dist/kaldi-reader-0.1.2.vsix
```

## 开发

```bash
npm install
npm run build
npm run typecheck
npm run package
```

在 VS Code 中按 `F5` 启动扩展开发宿主，然后打开 Kaldi `.scp` 文件并点击 ark entry 链接。

## 作者

SimZhou: https://simzhou.com/en/about/

## 版权

Copyright (c) 2026 SimZhou. All rights reserved.
