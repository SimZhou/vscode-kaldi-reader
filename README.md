# Kaldi Reader

Kaldi Reader 是一个 VS Code 扩展，用来浏览 Kaldi `.scp` 和 `.ark` 数据。当前初版先作为 Kaldi 数据分流器：

- 在 `.scp` 文件中识别 `*.ark:<offset>` 引用并生成可点击链接；
- 点击 wav ark 时读取 offset 处字节，确认 `RIFF/WAVE` 后调用 AudioLens；
- feats、alignment、int-vector 等非音频 ark 由 Kaldi Reader 接管；当前已支持 Kaldi binary `FloatMatrix(FM)` 和 `Int32Vector` 的 raw 文本输出。

## 测试数据

仓库内保留了几组本地样本：

- `tests/kaldi-wavark`：wav ark 和对应 `.scp`，来自 AudioLens 测试数据；
- `tests/repacked`：feats ark、alignment ark 和对应 `.scp`。
- `tests/normal_wavlist_and_wavscp`：普通音频路径列表样本，供 AudioLens 文本路径链接能力参考。

相对 ark 路径解析只支持两类稳定基准：先按 `.scp` 文件所在目录解析，再按当前 workspace 根目录解析。其他隐含 CWD 的相对路径不会自动猜测。

## Development

```bash
npm install
npm run build
npm run typecheck
npm run package
```
