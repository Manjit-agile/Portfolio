import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {
  collectWorkspaceFiles,
  getRedirectUri,
  isExcludedPath,
  parseCookies,
  resolveListenOptions,
  sealToken,
  unsealToken,
  validateRepoName,
} from './githubLogic.ts';

test('getRedirectUri strips trailing slashes and appends /auth/callback', () => {
  assert.equal(
    getRedirectUri('https://example.run.app/'),
    'https://example.run.app/auth/callback'
  );
  assert.equal(getRedirectUri(undefined), 'http://localhost:3000/auth/callback');
});

test('validateRepoName enforces GitHub naming constraints', () => {
  assert.equal(validateRepoName('mona-dhillon-portfolio').valid, true);
  assert.equal(validateRepoName('portfolio_2026.web').valid, true);
  assert.equal(validateRepoName('').valid, false);
  assert.equal(validateRepoName('my repo').valid, false);
  assert.equal(validateRepoName('.hidden').valid, false);
  assert.equal(validateRepoName('repo.git').valid, false);
});

test('parseCookies extracts decoded cookie key-value pairs', () => {
  const parsed = parseCookies('a=1; gh_session=hello%20world; empty=');
  assert.equal(parsed.a, '1');
  assert.equal(parsed.gh_session, 'hello world');
  assert.equal(parsed.empty, '');
});

test('sealToken and unsealToken round-trip and reject tampering', () => {
  const secret = 'test-secret-key-for-unit-tests';
  const sealed = sealToken('gho_sample_token_123', secret);
  assert.notEqual(sealed.includes('gho_sample_token_123'), true);
  assert.equal(unsealToken(sealed, secret), 'gho_sample_token_123');
  assert.equal(unsealToken(`${sealed}x`, secret), null);
  assert.equal(unsealToken(sealed, 'wrong-secret'), null);
});

test('isExcludedPath keeps source files and excludes secrets and build artifacts', () => {
  assert.equal(isExcludedPath('src/App.tsx'), false);
  assert.equal(isExcludedPath('.env.example'), false);
  assert.equal(isExcludedPath('server.ts'), false);
  assert.equal(isExcludedPath('.env'), true);
  assert.equal(isExcludedPath('.env.local'), true);
  assert.equal(isExcludedPath('node_modules/react/index.js'), true);
  assert.equal(isExcludedPath('dist/assets/main.js'), true);
  assert.equal(isExcludedPath('.playwright-cli/r1-desktop.png'), true);
  assert.equal(isExcludedPath('.git/HEAD'), true);
});

test('collectWorkspaceFiles skips excluded directories and returns deterministic sorted paths', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'gh-collect-'));
  try {
    await fs.mkdir(path.join(tmpDir, 'src'), { recursive: true });
    await fs.mkdir(path.join(tmpDir, 'node_modules/pkg'), { recursive: true });
    await fs.writeFile(path.join(tmpDir, 'package.json'), '{"name":"demo"}');
    await fs.writeFile(path.join(tmpDir, '.env'), 'SECRET=123');
    await fs.writeFile(path.join(tmpDir, '.env.example'), 'SECRET=YOUR_SECRET');
    await fs.writeFile(path.join(tmpDir, 'src/index.ts'), 'export const x = 1;');
    await fs.writeFile(path.join(tmpDir, 'node_modules/pkg/a.js'), 'ignored');

    const files = await collectWorkspaceFiles(tmpDir);
    assert.deepEqual(
      files.map((f) => f.path),
      ['.env.example', 'package.json', 'src/index.ts']
    );
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
});

test('resolveListenOptions honors CLI flags and avoids nginx port collision in dev', () => {
  assert.deepEqual(
    resolveListenOptions(['--port', '3000', '--host', '0.0.0.0'], {
      PORT: '8080',
      NGINX_PORT: '8080',
      DEFAULT_APP_PORT: '3000',
    }),
    { port: 3000, host: '0.0.0.0' }
  );
  assert.deepEqual(
    resolveListenOptions(['--port=3100', '--host=127.0.0.1'], { PORT: '3000' }),
    { port: 3100, host: '127.0.0.1' }
  );
  assert.deepEqual(
    resolveListenOptions([], {
      NODE_ENV: 'development',
      PORT: '8080',
      NGINX_PORT: '8080',
      DEFAULT_APP_PORT: '3000',
    }),
    { port: 3000, host: '0.0.0.0' }
  );
  assert.deepEqual(
    resolveListenOptions([], {
      NODE_ENV: 'production',
      PORT: '8080',
      NGINX_PORT: '8080',
      DEFAULT_APP_PORT: '3000',
    }),
    { port: 8080, host: '0.0.0.0' }
  );
});
