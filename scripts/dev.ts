import { execFileSync, spawn } from 'node:child_process';
import { mkdirSync, watch } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { blogDirectory } from './blog-assets';

const projectRequire = createRequire(path.resolve('package.json'));
function syncPreviewAssets() {
  // Load the current post parser on each save, just as Next does on hot reload.
  execFileSync(process.execPath, ['--import', 'tsx', 'scripts/prepare-blog-assets.ts', '--preview'], { stdio: 'inherit' });
}

mkdirSync(blogDirectory, { recursive: true });
syncPreviewAssets();

// Sync new, updated, renamed, and deleted figures while Next keeps serving.
// Debouncing accommodates editor saves that replace files in several steps.
let timer: ReturnType<typeof setTimeout> | undefined;
const watcher = watch(blogDirectory, { recursive: true }, () => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    try {
      syncPreviewAssets();
    } catch (error) {
      console.error('Unable to update blog assets:', error);
    }
  }, 150);
});
watcher.on('error', (error) => console.error('Blog asset watcher failed; restart npm run dev:', error));

const next = spawn(process.execPath, [
  projectRequire.resolve('next/dist/bin/next'), 'dev', '--turbopack', ...process.argv.slice(2),
], { stdio: 'inherit' });

function cleanup() {
  clearTimeout(timer);
  watcher.close();
}

next.on('error', (error) => {
  cleanup();
  console.error(error);
  process.exitCode = 1;
});
next.on('exit', (code, signal) => {
  cleanup();
  process.exitCode = code ?? (signal === 'SIGINT' || signal === 'SIGTERM' ? 0 : 1);
});
process.on('SIGINT', () => next.kill('SIGINT'));
process.on('SIGTERM', () => next.kill('SIGTERM'));
