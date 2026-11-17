import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

export interface WorkspaceFileEntry {
  path: string;
  contentBase64: string;
}

const EXCLUDED_DIRS = new Set([
  'node_modules',
  'dist',
  'build',
  'coverage',
  '.git',
  '.playwright-cli',
  '.aistudio',
]);

const EXCLUDED_FILES = new Set([
  '.DS_Store',
  'bun.lock',
  'package-lock.json',
  'server.js',
]);

export function getRedirectUri(appUrl?: string): string {
  const base = (appUrl && appUrl.trim()) || 'http://localhost:3000';
  return `${base.replace(/\/+$/, '')}/auth/callback`;
}

export function validateRepoName(rawName: string): {
  valid: boolean;
  normalized: string;
  error?: string;
} {
  const trimmed = rawName.trim();
  if (!trimmed) {
    return { valid: false, normalized: '', error: 'Repository name is required.' };
  }
  if (trimmed.length > 100) {
    return {
      valid: false,
      normalized: trimmed,
      error: 'Repository name must be 100 characters or fewer.',
    };
  }
  if (trimmed === '.' || trimmed === '..' || trimmed.endsWith('.git')) {
    return {
      valid: false,
      normalized: trimmed,
      error: 'Repository name cannot be ".", "..", or end with ".git".',
    };
  }
  if (!/^[A-Za-z0-9._-]+$/.test(trimmed)) {
    return {
      valid: false,
      normalized: trimmed,
      error: 'Use only letters, numbers, hyphens (-), underscores (_), or periods (.).',
    };
  }
  if (/^[.-]|[.-]$/.test(trimmed)) {
    return {
      valid: false,
      normalized: trimmed,
      error: 'Repository name cannot start or end with a period or hyphen.',
    };
  }
  return { valid: true, normalized: trimmed };
}

export function parseCookies(cookieHeader?: string): Record<string, string> {
  if (!cookieHeader) return {};
  const result: Record<string, string> = {};
  for (const part of cookieHeader.split(';')) {
    const idx = part.indexOf('=');
    if (idx <= 0) continue;
    const key = part.slice(0, idx).trim();
    const val = part.slice(idx + 1).trim();
    if (key) {
      try {
        result[key] = decodeURIComponent(val);
      } catch {
        result[key] = val;
      }
    }
  }
  return result;
}

function deriveKey(secret: string): Buffer {
  return crypto.createHash('sha256').update(secret).digest();
}

export function sealToken(plaintext: string, secret: string): string {
  const key = deriveKey(secret);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('base64url')}.${tag.toString('base64url')}.${encrypted.toString('base64url')}`;
}

export function unsealToken(sealed: string, secret: string): string | null {
  try {
    const parts = sealed.split('.');
    if (parts.length !== 3) return null;
    const [ivStr, tagStr, encStr] = parts;
    const key = deriveKey(secret);
    const iv = Buffer.from(ivStr, 'base64url');
    const tag = Buffer.from(tagStr, 'base64url');
    const encrypted = Buffer.from(encStr, 'base64url');
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString('utf8');
  } catch {
    return null;
  }
}

export function isExcludedPath(relPath: string): boolean {
  const normalized = relPath.replace(/\\/g, '/').replace(/^\/+/, '');
  if (!normalized) return true;
  const segments = normalized.split('/');
  for (const seg of segments.slice(0, -1)) {
    if (EXCLUDED_DIRS.has(seg)) return true;
  }
  const baseName = segments[segments.length - 1];
  if (EXCLUDED_DIRS.has(baseName)) return true;
  if (EXCLUDED_FILES.has(baseName)) return true;
  if (baseName.endsWith('.log')) return true;
  if (baseName.startsWith('.env') && baseName !== '.env.example') return true;
  return false;
}

export async function collectWorkspaceFiles(
  rootDir: string,
  maxBytesPerFile = 8 * 1024 * 1024
): Promise<WorkspaceFileEntry[]> {
  const entries: WorkspaceFileEntry[] = [];

  async function walk(currentDir: string, relPrefix: string): Promise<void> {
    const dirItems = await fs.readdir(currentDir, { withFileTypes: true });
    for (const item of dirItems) {
      const relPath = relPrefix ? `${relPrefix}/${item.name}` : item.name;
      if (isExcludedPath(relPath)) continue;
      const fullPath = path.join(currentDir, item.name);
      if (item.isDirectory()) {
        await walk(fullPath, relPath);
      } else if (item.isFile()) {
        const stat = await fs.stat(fullPath);
        if (stat.size <= maxBytesPerFile) {
          const buf = await fs.readFile(fullPath);
          entries.push({
            path: relPath,
            contentBase64: buf.toString('base64'),
          });
        }
      }
    }
  }

  await walk(rootDir, '');
  entries.sort((a, b) => a.path.localeCompare(b.path));
  return entries;
}

export function resolveListenOptions(
  argv: string[],
  env: Record<string, string | undefined>
): { port: number; host: string } {
  let cliPort: string | undefined;
  let cliHost: string | undefined;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--port' && argv[i + 1]) {
      cliPort = argv[++i];
    } else if (arg.startsWith('--port=')) {
      cliPort = arg.slice('--port='.length);
    } else if (arg === '--host' && argv[i + 1]) {
      cliHost = argv[++i];
    } else if (arg.startsWith('--host=')) {
      cliHost = arg.slice('--host='.length);
    }
  }

  const parsePort = (raw?: string): number | undefined => {
    if (!raw) return undefined;
    const n = Number(raw);
    return Number.isInteger(n) && n > 0 && n <= 65535 ? n : undefined;
  };

  let port = parsePort(cliPort);
  if (port === undefined) {
    const isDev = env.NODE_ENV !== 'production';
    const collidesWithNginx =
      isDev &&
      Boolean(env.NGINX_PORT) &&
      env.PORT === env.NGINX_PORT &&
      Boolean(env.DEFAULT_APP_PORT);
    port = collidesWithNginx
      ? parsePort(env.DEFAULT_APP_PORT) ?? 3000
      : parsePort(env.PORT) ?? parsePort(env.DEFAULT_APP_PORT) ?? 3000;
  }

  const host = (cliHost && cliHost.trim()) || (env.HOST && env.HOST.trim()) || '0.0.0.0';
  return { port, host };
}
