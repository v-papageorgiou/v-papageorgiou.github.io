import { cp, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const packageRoot = path.dirname(require.resolve('pdfjs-dist/package.json'));
const destination = path.resolve('public/_pdfjs');
await mkdir(destination, { recursive: true });
await cp(path.join(packageRoot, 'build/pdf.worker.min.mjs'), path.join(destination, 'pdf.worker.min.mjs'));
for (const directory of ['cmaps', 'standard_fonts', 'wasm']) {
  await cp(path.join(packageRoot, directory), path.join(destination, directory), { recursive: true });
}
await cp(path.join(packageRoot, 'LICENSE'), path.join(destination, 'LICENSE'));
