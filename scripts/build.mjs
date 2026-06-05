import esbuild from "esbuild";

const watch = process.argv.includes("--watch");

const options = {
  entryPoints: ["src/extension.ts"],
  bundle: true,
  outfile: "dist/extension.js",
  platform: "node",
  format: "cjs",
  external: ["vscode"],
  sourcemap: false,
  target: "node16",
  logLevel: "info"
};

if (watch) {
  const context = await esbuild.context(options);
  await context.watch();
  console.log("Watching Kaldi Reader extension...");
} else {
  await esbuild.build(options);
}
