import React, { useEffect } from 'react';
import { useMachine } from '@xstate/react';
import { settingsMachine } from '../machines/settingsMachine';
import { loadSettingsFromStorage, saveSettingsToStorage, clearSettingsFromStorage } from './settingsStorage';
import * as github from '../lib/github';
import './admin.css';

const TOKEN_URL = 'https://github.com/settings/tokens/new?scopes=repo&description=Hookie+CMS';
const NEW_REPO_URL = 'https://github.com/new';

const DEFAULT_LAYOUT = {
  version: '1.0.0',
  site: { title: 'My Hookie Site', description: 'Built with Hookie CMS', theme: 'light' },
  header: { enabled: true, height: 64, backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', padding: '0.75rem 2rem', items: [{ type: 'logo', text: 'My Site' }, { type: 'nav', links: [{ label: 'Home', path: '#/' }, { label: 'About', path: '#/pages/about' }] }] },
  footer: { enabled: true, backgroundColor: '#1e293b', color: '#94a3b8', padding: '2rem', sections: [{ title: 'Links', links: [{ label: 'Home', path: '#/' }] }, { title: 'Legal', text: 'All rights reserved.' }] },
  colors: { primary: '#2563eb', secondary: '#7c3aed', success: '#10b981', background: '#ffffff', surface: '#f8fafc', text: '#1e293b' },
  typography: { fontFamily: 'system-ui, -apple-system, sans-serif' },
};

async function verify(token, owner, repo) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers: { Accept: 'application/vnd.github.v3+json', Authorization: `Bearer ${token}` } });
  if (res.status === 401) throw new Error('Token is invalid or expired.');
  if (res.status === 403) throw new Error('Token lacks repo read/write permissions.');
  if (res.status === 404) throw new Error(`Repository "${owner}/${repo}" not found.`);
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  const d = await res.json();
  return { name: d.full_name, private: d.private };
}

async function initRepo(token, owner, repo) {
  const headers = { Accept: 'application/vnd.github.v3+json', Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  const encode = (s) => btoa(unescape(encodeURIComponent(s)));
  const tryCreate = async (path, content, message) => {
    const check = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, { headers });
    if (check.status === 200) return;
    await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, { method: 'PUT', headers, body: JSON.stringify({ message, content: encode(content) }) });
  };
  await tryCreate('content/layout.json', JSON.stringify(DEFAULT_LAYOUT, null, 2), 'Initialize Hookie site layout');
  await tryCreate('content/pages/home.json', JSON.stringify({ name: 'home', title: 'Home', components: [{ id: 'hero-1', type: 'Hero', props: { headline: 'Welcome to My Site', subheadline: 'Built with Hookie CMS', ctaText: 'Learn More', ctaHref: '#/pages/about' }, style: {}, children: [] }] }, null, 2), 'Initialize home page');
}

const Settings = ({ onUpdate, repoInfo }) => {
  const [state, send] = useMachine(settingsMachine);
  const ctx = state.context;

  useEffect(() => {
    const s = loadSettingsFromStorage();
    const owner = s.owner || import.meta.env.VITE_GITHUB_OWNER || '';
    const repo = s.repo || import.meta.env.VITE_GITHUB_REPO || '';
    if (s.token && owner && repo) send({ type: 'HAS_CONFIG', token: s.token, owner, repo });
    else if (owner && repo) send({ type: 'HAS_REPO', owner, repo });
    else send({ type: 'NO_CONFIG' });
  }, []);

  useEffect(() => {
    if (repoInfo?.owner) send({ type: 'SET_OWNER', owner: repoInfo.owner });
    if (repoInfo?.repo) send({ type: 'SET_REPO', repo: repoInfo.repo });
  }, [repoInfo]);

  const handleVerify = async (saveAfter) => {
    send({ type: 'VERIFY' });
    try {
      const r = await verify(ctx.token.trim(), ctx.owner.trim(), ctx.repo.trim());
      if (saveAfter) {
        saveSettingsToStorage(ctx.token.trim(), ctx.owner.trim(), ctx.repo.trim());
        if (onUpdate) onUpdate({ owner: ctx.owner.trim(), repo: ctx.repo.trim() });
      }
      send({ type: 'VERIFY_SUCCESS', result: r });
    } catch (e) { send({ type: 'VERIFY_ERROR', error: e.message }); }
  };

  const handleTest = async () => {
    try {
      const r = await verify(ctx.token.trim(), ctx.owner.trim(), ctx.repo.trim());
      send({ type: 'TEST_SUCCESS', result: r });
    } catch (e) { send({ type: 'TEST_ERROR', error: e.message }); }
  };

  const handleInit = async () => {
    try {
      await initRepo(ctx.token.trim(), ctx.owner.trim(), ctx.repo.trim());
      send({ type: 'INIT_SUCCESS' });
    } catch (e) { send({ type: 'INIT_ERROR', error: 'Init failed: ' + e.message }); }
  };

  const handleDisconnect = () => { clearSettingsFromStorage(); send({ type: 'DISCONNECT' }); };

  const stepIndex = state.matches('tokenStep') ? 0 : state.matches('repoStep') ? 1 : state.matches('verifyStep') || state.matches('verifying') ? 2 : 3;

  if (state.matches('connected')) {
    return (
      <div className="max-w-xl mx-auto p-4">
        <div className="mb-6"><h1 className="text-2xl font-extrabold text-content1 tracking-tight">Settings</h1><p className="text-sm text-content2">GitHub connection configured</p></div>
        <div className="alert alert-success flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-success shrink-0" />
          <div>
            <div className="font-semibold text-content1">{ctx.owner}/{ctx.repo}</div>
            <div className="text-xs text-content2">{ctx.result ? `${ctx.result.private ? 'Private' : 'Public'} repository` : 'Connected'}</div>
          </div>
        </div>
        {ctx.error && <div className="alert alert-error mt-3">{ctx.error}</div>}
        {ctx.initDone && <div className="alert alert-success mt-3">Repository initialized with starter content.</div>}
        <div className="flex flex-wrap gap-3 mt-4">
          <button className="btn btn-primary btn-sm" onClick={handleTest}>Test Connection</button>
          <button className="btn btn-outline btn-sm" onClick={handleInit}>Initialize Repo</button>
          <button className="btn btn-outline btn-sm" onClick={() => send({ type: 'EDIT' })}>Edit Settings</button>
          <button className="btn btn-outline btn-sm text-error" onClick={handleDisconnect}>Disconnect</button>
        </div>
        <div className="alert alert-info mt-5 text-sm">
          <div><strong>What Hookie stores in your repo:</strong><br/><code>content/pages/*.json</code> — your page content<br/><code>content/layout.json</code> — header, footer, colors, typography<br/><code>content/components/*.json</code> — custom component schemas</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="mb-6"><h1 className="text-2xl font-extrabold text-content1 tracking-tight">Setup</h1><p className="text-sm text-content2">{ctx.owner && ctx.repo ? `Adding token for ${ctx.owner}/${ctx.repo}` : 'Connect Hookie to your GitHub repository'}</p></div>
      {!(ctx.owner && ctx.repo) && <Steps n={stepIndex} />}
      {ctx.error && <div className="alert alert-error mb-4">{ctx.error}</div>}

      {state.matches('tokenStep') && (
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-content1">Connect your GitHub account</h2>
          {ctx.owner && ctx.repo ? (
            <div className="alert alert-success text-sm">
              <div>Editing <strong>{ctx.owner}/{ctx.repo}</strong> — just add your token to enable writes.</div>
            </div>
          ) : (
            <p className="text-sm text-content2 leading-relaxed">Hookie stores your content as JSON files in a GitHub repository. You need a Personal Access Token (PAT) so Hookie can read and write those files.</p>
          )}
          <div className="flex gap-3 flex-wrap"><a href={TOKEN_URL} target="_blank" rel="noopener noreferrer" className="link link-primary text-sm font-semibold">Create a PAT on GitHub →</a></div>
          <div className="alert alert-info text-sm"><div><strong>Classic token:</strong> needs <code>repo</code> scope<br/><strong>Fine-grained:</strong> needs <code>Contents: Read and write</code></div></div>
          <div className="form-group">
            <label className="form-label">Personal Access Token</label>
            <input type="password" value={ctx.token} onChange={e => send({ type: 'SET_TOKEN', token: e.target.value })} placeholder="ghp_... or github_pat_..." className="input input-bordered w-full" autoComplete="off" />
          </div>
          <button className="btn btn-primary mt-2" onClick={() => send({ type: 'NEXT' })}>Next →</button>
        </div>
      )}

      {state.matches('repoStep') && (
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-content1">Choose your repository</h2>
          <p className="text-sm text-content2 leading-relaxed">Enter your GitHub username (or organization) and the repository name.</p>
          <div className="form-group"><label className="form-label">Owner</label><input type="text" value={ctx.owner} onChange={e => send({ type: 'SET_OWNER', owner: e.target.value })} placeholder="your-username" className="input input-bordered w-full" /></div>
          <div className="form-group"><label className="form-label">Repository</label><input type="text" value={ctx.repo} onChange={e => send({ type: 'SET_REPO', repo: e.target.value })} placeholder="my-site" className="input input-bordered w-full" /></div>
          <div className="flex gap-3 mt-4"><button className="btn btn-outline" onClick={() => send({ type: 'BACK' })}>← Back</button><button className="btn btn-primary" onClick={() => send({ type: 'NEXT' })}>Next →</button></div>
        </div>
      )}

      {(state.matches('verifyStep') || state.matches('verifying')) && (
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-content1">Verify and save</h2>
          <p className="text-sm text-content2 leading-relaxed">Confirm that your token can access <strong>{ctx.owner}/{ctx.repo}</strong>.</p>
          {ctx.result && <div className="alert alert-success">Connected to {ctx.result.name} ({ctx.result.private ? 'private' : 'public'})</div>}
          <div className="flex gap-3 mt-4">
            <button className="btn btn-outline" onClick={() => send({ type: 'BACK' })}>← Back</button>
            <button className="btn btn-primary" onClick={() => handleVerify(true)} disabled={state.matches('verifying')}>{state.matches('verifying') ? 'Verifying...' : ctx.result ? 'Save & Continue' : 'Verify and Save'}</button>
          </div>
        </div>
      )}
    </div>
  );
};

function Steps({ n }) {
  const labels = ['Token', 'Repository', 'Verify'];
  return (
    <div className="flex justify-center gap-8 mb-7">
      {labels.map((l, i) => (
        <div key={i} className={`flex flex-col items-center gap-1.5 ${i <= n ? 'opacity-100' : 'opacity-40'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${i <= n ? 'bg-primary text-white' : 'bg-border1 text-content3'}`}>
            {i < n ? '✓' : i + 1}
          </div>
          <span className="text-xs text-content1">{l}</span>
        </div>
      ))}
    </div>
  );
}

export default Settings;
