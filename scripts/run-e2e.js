#!/usr/bin/env node
// Wrapper to require a setup ponyfill for web-streams and then execute Playwright
// without leaking NODE_OPTIONS to child processes (which causes Electron warnings).

const path = require('path');
const { spawnSync } = require('child_process');

// Require the setup file (polyfills TransformStream into global)
const setupPath = path.resolve(__dirname, '../tests/e2e/setup-webstreams.js');
try {
  require(setupPath);
  console.log('[run-e2e] loaded setup:', setupPath);
} catch (err) {
  console.error('[run-e2e] failed to load setup file:', setupPath);
  console.error(err);
  process.exit(1);
}

// Remove NODE_OPTIONS from environment so child/browser processes don't see it
const env = Object.assign({}, process.env);
if (env.NODE_OPTIONS) {
  delete env.NODE_OPTIONS;
}

// Build the app to ensure production assets (service worker, precache, etc.) are available.
// You can skip the build by setting SKIP_BUILD=1 in the environment.
if (!env.SKIP_BUILD) {
  console.log('[run-e2e] running build (SKIP_BUILD not set)');
  const buildResult = spawnSync('npm', ['run', 'build'], { env, stdio: 'inherit', shell: true });
  if (buildResult.status !== 0) {
    console.error('[run-e2e] build failed, aborting E2E run');
    process.exit(buildResult.status || 1);
  }
} else {
  console.log('[run-e2e] SKIP_BUILD set, skipping build step');
}

// Forward any args the user passed to this script to playwright
const args = ['playwright', 'test'].concat(process.argv.slice(2));
const result = spawnSync('npx', args, {
  env,
  stdio: 'inherit',
  shell: true,
});

process.exit(result.status || 0);

