import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import express from 'express';
import type { Request, Response } from 'express';
import {
  collectWorkspaceFiles,
  getRedirectUri,
  parseCookies,
  resolveListenOptions,
  sealToken,
  unsealToken,
  validateRepoName,
} from './server/githubLogic.ts';

dotenv.config({ quiet: true });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { port: PORT, host: HOST } = resolveListenOptions(
  process.argv.slice(2),
  process.env
);
const COOKIE_SECRET =
  process.env.OAUTH_COOKIE_SECRET || crypto.randomBytes(32).toString('hex');

const TOKEN_COOKIE = 'gh_oauth_session';
const STATE_COOKIE = 'gh_oauth_state';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: 'none' as const,
  path: '/',
  maxAge: 1000 * 60 * 60 * 24,
};

function isOAuthConfigured(): boolean {
  return Boolean(
    process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
  );
}

function getSessionToken(req: Request): string | null {
  const cookies = parseCookies(req.headers.cookie);
  const raw = cookies[TOKEN_COOKIE];
  if (!raw) return null;
  return unsealToken(raw, COOKIE_SECRET);
}

async function githubFetch(
  url: string,
  token: string,
  init: RequestInit = {}
): Promise<globalThis.Response> {
  return fetch(url, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'User-Agent': 'manjit-kaur-portfolio-app',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init.headers || {}),
    },
  });
}

async function waitForBranchRef(
  owner: string,
  repo: string,
  branch: string,
  token: string
): Promise<string> {
  let lastStatus = 0;
  for (let attempt = 0; attempt < 6; attempt++) {
    const res = await githubFetch(
      `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/git/ref/heads/${encodeURIComponent(branch)}`,
      token
    );
    lastStatus = res.status;
    if (res.ok) {
      const data = (await res.json()) as { object?: { sha?: string } };
      if (data.object?.sha) {
        return data.object.sha;
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 450));
  }
  throw new Error(
    `Repository branch initialization timed out (HTTP ${lastStatus}).`
  );
}

async function startServer(): Promise<void> {
  const app = express();
  app.set('trust proxy', 1);
  app.use(express.json({ limit: '2mb' }));

  app.get('/api/github/status', async (req: Request, res: Response) => {
    const configured = isOAuthConfigured();
    const callbackUrl = getRedirectUri(process.env.APP_URL);
    const token = getSessionToken(req);

    if (!token) {
      res.json({
        configured,
        connected: false,
        callbackUrl,
        user: null,
        repos: [],
      });
      return;
    }

    try {
      const [userRes, reposRes] = await Promise.all([
        githubFetch('https://api.github.com/user', token),
        githubFetch(
          'https://api.github.com/user/repos?sort=updated&per_page=6',
          token
        ),
      ]);

      if (userRes.status === 401) {
        res.clearCookie(TOKEN_COOKIE, COOKIE_OPTIONS);
        res.json({
          configured,
          connected: false,
          callbackUrl,
          user: null,
          repos: [],
        });
        return;
      }

      if (!userRes.ok) {
        res.status(502).json({
          error: 'Failed to fetch GitHub profile.',
        });
        return;
      }

      const ghUser = (await userRes.json()) as {
        login: string;
        name?: string | null;
        avatar_url: string;
        html_url: string;
        public_repos: number;
      };

      const rawRepos = reposRes.ok
        ? ((await reposRes.json()) as Array<{
            id: number;
            name: string;
            description: string | null;
            language: string | null;
            stargazers_count: number;
            forks_count: number;
            html_url: string;
            private: boolean;
          }>)
        : [];

      res.json({
        configured,
        connected: true,
        callbackUrl,
        user: {
          login: ghUser.login,
          name: ghUser.name || ghUser.login,
          avatarUrl: ghUser.avatar_url,
          htmlUrl: ghUser.html_url,
          publicRepos: ghUser.public_repos,
        },
        repos: rawRepos.slice(0, 4).map((repo) => ({
          id: String(repo.id),
          name: repo.name,
          description: repo.description || 'Repository connected from GitHub.',
          language: repo.language || 'TypeScript',
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          htmlUrl: repo.html_url,
          isPrivate: repo.private,
        })),
      });
    } catch {
      res.status(500).json({ error: 'Unable to verify GitHub session.' });
    }
  });

  app.get('/api/auth/github/url', (_req: Request, res: Response) => {
    if (!isOAuthConfigured()) {
      res.status(503).json({
        error:
          'GitHub OAuth is not configured yet. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in AI Studio Secrets.',
        callbackUrl: getRedirectUri(process.env.APP_URL),
      });
      return;
    }

    const state = crypto.randomBytes(24).toString('hex');
    const redirectUri = getRedirectUri(process.env.APP_URL);
    res.cookie(STATE_COOKIE, sealToken(state, COOKIE_SECRET), {
      ...COOKIE_OPTIONS,
      maxAge: 1000 * 60 * 10,
    });

    const params = new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID!,
      redirect_uri: redirectUri,
      scope: 'repo read:user',
      state,
    });

    res.json({
      url: `https://github.com/login/oauth/authorize?${params.toString()}`,
    });
  });

  const handleOAuthCallback = async (req: Request, res: Response) => {
    const code = typeof req.query.code === 'string' ? req.query.code : '';
    const state = typeof req.query.state === 'string' ? req.query.state : '';
    const oauthError =
      typeof req.query.error === 'string' ? req.query.error : '';

    if (oauthError) {
      res.status(400).send(`
        <html>
          <body style="font-family: system-ui, sans-serif; padding: 24px;">
            <p>GitHub authorization was cancelled or denied.</p>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR', error: ${JSON.stringify(oauthError)} }, '*');
                window.close();
              }
            </script>
          </body>
        </html>
      `);
      return;
    }

    const cookies = parseCookies(req.headers.cookie);
    const expectedState = cookies[STATE_COOKIE]
      ? unsealToken(cookies[STATE_COOKIE], COOKIE_SECRET)
      : null;

    if (!code || !state || !expectedState || state !== expectedState) {
      res.status(400).send('Invalid or expired OAuth state parameter.');
      return;
    }

    res.clearCookie(STATE_COOKIE, COOKIE_OPTIONS);

    if (!isOAuthConfigured()) {
      res.status(500).send('GitHub OAuth credentials are missing on server.');
      return;
    }

    try {
      const tokenResponse = await fetch(
        'https://github.com/login/oauth/access_token',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code,
            redirect_uri: getRedirectUri(process.env.APP_URL),
          }),
        }
      );

      const tokenJson = (await tokenResponse.json()) as {
        access_token?: string;
        error_description?: string;
        error?: string;
      };

      if (!tokenResponse.ok || !tokenJson.access_token) {
        res
          .status(400)
          .send(
            tokenJson.error_description ||
              tokenJson.error ||
              'Failed to exchange GitHub authorization code.'
          );
        return;
      }

      res.cookie(
        TOKEN_COOKIE,
        sealToken(tokenJson.access_token, COOKIE_SECRET),
        COOKIE_OPTIONS
      );

      res.send(`
        <html>
          <body style="font-family: system-ui, sans-serif; padding: 24px; background: #030617; color: #f8fafc;">
            <p>GitHub connected. Returning to portfolio...</p>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
          </body>
        </html>
      `);
    } catch {
      res.status(500).send('Unexpected error during GitHub token exchange.');
    }
  };

  app.get(['/auth/callback', '/auth/callback/'], handleOAuthCallback);

  app.post('/api/github/disconnect', (_req: Request, res: Response) => {
    res.clearCookie(TOKEN_COOKIE, COOKIE_OPTIONS);
    res.json({ disconnected: true });
  });

  app.post('/api/github/publish', async (req: Request, res: Response) => {
    const token = getSessionToken(req);
    if (!token) {
      res.status(401).json({
        error: 'Connect your GitHub account before publishing.',
      });
      return;
    }

    const rawName =
      typeof req.body?.repoName === 'string' ? req.body.repoName : '';
    const validation = validateRepoName(rawName);
    if (!validation.valid) {
      res.status(400).json({ error: validation.error });
      return;
    }

    const description =
      typeof req.body?.description === 'string' && req.body.description.trim()
        ? req.body.description.trim().slice(0, 300)
        : 'Frontend Engineer portfolio built with React, TypeScript, Tailwind CSS, and Express.';
    const isPrivate = Boolean(req.body?.isPrivate);

    try {
      const userRes = await githubFetch('https://api.github.com/user', token);
      if (!userRes.ok) {
        res.status(401).json({ error: 'GitHub session expired. Please reconnect.' });
        return;
      }
      const user = (await userRes.json()) as { login: string };

      const createRepoRes = await githubFetch(
        'https://api.github.com/user/repos',
        token,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: validation.normalized,
            description,
            private: isPrivate,
            auto_init: true,
          }),
        }
      );

      if (!createRepoRes.ok) {
        const errPayload = (await createRepoRes.json().catch(() => ({}))) as {
          message?: string;
          errors?: Array<{ message?: string }>;
        };
        const detail =
          errPayload.errors?.[0]?.message ||
          errPayload.message ||
          `GitHub returned HTTP ${createRepoRes.status}`;
        res.status(createRepoRes.status).json({ error: detail });
        return;
      }

      const repoData = (await createRepoRes.json()) as {
        name: string;
        full_name: string;
        html_url: string;
        default_branch?: string;
      };

      const owner = user.login;
      const repo = repoData.name;
      const branch = repoData.default_branch || 'main';

      const baseCommitSha = await waitForBranchRef(owner, repo, branch, token);
      const baseCommitRes = await githubFetch(
        `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/git/commits/${baseCommitSha}`,
        token
      );
      if (!baseCommitRes.ok) {
        throw new Error('Could not read initial commit tree.');
      }
      const baseCommit = (await baseCommitRes.json()) as {
        tree: { sha: string };
      };

      const files = await collectWorkspaceFiles(__dirname);
      const treeEntries: Array<{
        path: string;
        mode: string;
        type: string;
        sha: string;
      }> = [];

      const BATCH_SIZE = 8;
      for (let i = 0; i < files.length; i += BATCH_SIZE) {
        const chunk = files.slice(i, i + BATCH_SIZE);
        const createdBlobs = await Promise.all(
          chunk.map(async (file) => {
            const blobRes = await githubFetch(
              `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/git/blobs`,
              token,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  content: file.contentBase64,
                  encoding: 'base64',
                }),
              }
            );
            if (!blobRes.ok) {
              throw new Error(`Failed to upload blob for ${file.path}`);
            }
            const blobJson = (await blobRes.json()) as { sha: string };
            return {
              path: file.path,
              mode: '100644',
              type: 'blob',
              sha: blobJson.sha,
            };
          })
        );
        treeEntries.push(...createdBlobs);
      }

      const treeRes = await githubFetch(
        `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/git/trees`,
        token,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            base_tree: baseCommit.tree.sha,
            tree: treeEntries,
          }),
        }
      );
      if (!treeRes.ok) {
        throw new Error('Failed to create Git tree on GitHub.');
      }
      const treeJson = (await treeRes.json()) as { sha: string };

      const commitRes = await githubFetch(
        `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/git/commits`,
        token,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: 'Add portfolio website codebase',
            tree: treeJson.sha,
            parents: [baseCommitSha],
          }),
        }
      );
      if (!commitRes.ok) {
        throw new Error('Failed to create commit on GitHub.');
      }
      const commitJson = (await commitRes.json()) as { sha: string };

      const updateRefRes = await githubFetch(
        `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/git/refs/heads/${encodeURIComponent(branch)}`,
        token,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sha: commitJson.sha,
          }),
        }
      );
      if (!updateRefRes.ok) {
        throw new Error('Failed to update branch reference on GitHub.');
      }

      res.json({
        repoUrl: repoData.html_url,
        fullName: repoData.full_name,
        branch,
        fileCount: files.length,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to publish project to GitHub.';
      res.status(500).json({ error: message });
    }
  });

  const isProd = process.env.NODE_ENV === 'production';
  let vitePromise: Promise<import('vite').ViteDevServer> | null = null;

  const getVite = () => {
    if (!vitePromise) {
      const disableHmr = process.env.DISABLE_HMR === 'true';
      vitePromise = import('vite').then(({ createServer: createViteServer }) =>
        createViteServer({
          server: {
            middlewareMode: true,
            ...(disableHmr ? { hmr: false, ws: false } : {}),
          },
          appType: 'spa',
        })
      );
      vitePromise.catch((err) => {
        console.error('Failed to initialize Vite dev middleware:', err);
      });
    }
    return vitePromise;
  };

  if (!isProd) {
    app.use((req, res, next) => {
      getVite()
        .then((vite) => vite.middlewares(req, res, next))
        .catch(next);
    });
  } else {
    const distDir = path.join(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  const server = app.listen(PORT, HOST, () => {
    console.log(`Server listening on http://${HOST}:${PORT}`);
    if (!isProd) {
      setImmediate(() => {
        void getVite();
      });
    }
  });

  server.on('error', (err) => {
    console.error(`Failed to bind ${HOST}:${PORT}:`, err);
    process.exit(1);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
