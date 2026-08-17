import fs from "fs";
import path from "path";

/**
 * Copia só o mínimo que MicVAD precisa em /vad/.
 * Antes: dumpia todo onnxruntime-web/dist (~90MB+) → cold start e scan do public lentos.
 */
const root = process.cwd();
const dest = path.join(root, "public", "vad");
const wasmDir = path.join(root, "node_modules/onnxruntime-web/dist");

const vadCopies = [
  [
    "node_modules/@ricky0123/vad-web/dist/vad.worklet.bundle.min.js",
    "vad.worklet.bundle.min.js",
  ],
  [
    "node_modules/@ricky0123/vad-web/dist/silero_vad_legacy.onnx",
    "silero_vad_legacy.onnx",
  ],
  [
    "node_modules/@ricky0123/vad-web/dist/silero_vad_v5.onnx",
    "silero_vad_v5.onnx",
  ],
];

/** Apenas runtime WASM SIMD threaded (path que ort.env.wasm.wasmPaths usa). */
const ORT_ALLOW = new Set([
  "ort-wasm-simd-threaded.wasm",
  "ort-wasm-simd-threaded.mjs",
  "ort-wasm-simd-threaded.js",
  // fallbacks curtos se a build do ort pedir
  "ort-wasm-simd.wasm",
  "ort-wasm-simd.mjs",
  "ort-wasm.wasm",
  "ort-wasm.mjs",
]);

fs.mkdirSync(dest, { recursive: true });

// remove lixo de cópias antigas (webgpu/jsep/all/bundle…)
for (const file of fs.readdirSync(dest)) {
  const full = path.join(dest, file);
  if (!fs.statSync(full).isFile()) continue;
  const keepVad = vadCopies.some(([, name]) => name === file);
  const keepOrt = ORT_ALLOW.has(file);
  if (!keepVad && !keepOrt) {
    fs.unlinkSync(full);
  }
}

for (const [src, name] of vadCopies) {
  fs.copyFileSync(path.join(root, src), path.join(dest, name));
}

let ortCopied = 0;
if (fs.existsSync(wasmDir)) {
  for (const file of fs.readdirSync(wasmDir)) {
    if (!ORT_ALLOW.has(file)) continue;
    fs.copyFileSync(path.join(wasmDir, file), path.join(dest, file));
    ortCopied += 1;
  }
}

const totalMb = (
  fs
    .readdirSync(dest)
    .map((f) => fs.statSync(path.join(dest, f)).size)
    .reduce((a, b) => a + b, 0) / (1024 * 1024)
).toFixed(1);

console.log(
  `VAD assets slim → public/vad/ (${ortCopied} ort files, ${totalMb} MB total)`,
);
