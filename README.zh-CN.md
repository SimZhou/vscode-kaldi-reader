<p align="center">
  <img src="https://raw.githubusercontent.com/SimZhou/vscode-kaldi-reader/main/logo/vscode-kaldi-reader.LOGO.v1.sticker.png" alt="Kaldi Reader" width="180">
</p>

<h1 align="center">Kaldi Reader - SCP & ARK Viewer</h1>

<p align="center">
  <a href="https://github.com/SimZhou/vscode-kaldi-reader/blob/main/README.md">English</a> | 简体中文 | <a href="https://github.com/SimZhou/vscode-kaldi-reader/blob/main/README.ja.md">日本語</a>
</p>

---

Kaldi Reader 是一个用于在 VS Code 中读取 Kaldi `.scp` 文件并查看 `.ark` entry 的扩展。它专注处理 Kaldi ark entry，普通音频路径链接交给 AudioLens。

## 功能亮点

- 识别 Kaldi `.scp` 文件中的 `*.ark:<offset>` 引用并生成可点击链接。
- 校验 wav ark offset 处是否为 `RIFF/WAVE`，并调用 AudioLens 打开。
- 将 Kaldi binary `FloatMatrix(FM)` 读取为 raw 矩阵文本。
- 将 Kaldi binary `Int32Vector` 读取为 raw 整数向量文本。
- 相对 ark 路径先按 `.scp` 文件所在目录解析，再按当前 workspace 根目录解析。
- 作为 workspace extension 支持本地和 Remote SSH 工作区。
- 默认跟随 VS Code 显示语言。

## 职责范围

Kaldi Reader 负责 Kaldi ark offset 链接：

```text
wav.ark:12345
feats.ark:12345
ali.ark:12345
```

AudioLens 负责文本文件中的普通音频路径，例如 `.wav`、`.flac`、`.mp3`、`.pcm`、`.raw`。AudioLens 仍然可以直接打开 `.ark` 文件，但 `*.ark:<offset>` 的文本链接检测由 Kaldi Reader 负责。

## 相对 Ark 路径

相对 ark 路径只支持两类稳定基准：

1. 当前 `.scp` 文件所在目录。
2. 当前 workspace 根目录。

其他隐含 CWD 的路径不会自动猜测。

## 测试数据

仓库内包含本地样本：

- `tests/kaldi-wavark`：wav ark 和 `.scp` 样本。
- `tests/repacked`：feats 和 alignment ark 样本。
- `tests/normal_wavlist_and_wavscp`：普通音频路径列表样本，作为 AudioLens 交接上下文。

## 从 VSIX 安装

```bash
code --install-extension dist/kaldi-reader-0.1.0.vsix
```

## 开发

```bash
npm install
npm run build
npm run typecheck
npm run package
```

在 VS Code 中按 `F5` 启动扩展开发宿主，然后打开 `tests/` 里的 `.scp` 文件并点击 ark entry 链接。

## 作者

SimZhou: https://simzhou.com/en/about/

## 版权

Copyright (c) 2026 SimZhou. All rights reserved.
