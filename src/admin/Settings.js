import React, { useState, useEffect } from 'react';
import { loadSettingsFromStorage, saveSettingsToStorage, clearSettingsFromStorage } from './settingsStorage';
import { styles as S, colors } from './settingsStyles';
import './admin.css';

const TOKEN_RE = /^(ghp_[a-zA-Z0-9]{36,}|github_pat_[a-zA-Z0-9_]{22,})$/;
const TOKEN_URL = 'https://github.com/settings/tokens/new?scopes=repo&description=Hookie+CMS';

async function verify(token, owner, repo) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: { Accept: 'application/vnd.github.v3+json', Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) throw new Error('Token is invalid or expired.');
  if (res.status === 403) throw new Error('Token lacks required permissions.');
  if (res.status === 404) throw new Error(`Repository "${owner}/${repo}" not found or not accessible.`);
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  const d = await res.json();
  return { name: d.full_name, private: d.private };
}

const W = {
  steps: { display: 'flex', justifyContent: 'center', gap: '32px', marginBottom: '28px' },
  stepItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' },
  circle: { width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' },
  body: { display: 'flex', flexDirection: 'column', gap: '16px' },
  h2: { fontSize: '1.2rem', fontWeight: 700, color: colors.textDark, margin: 0 },
  p: { fontSize: '0.9rem', color: colors.textLight, margin: 0, lineHeight: 1.6 },
  link: { color: colors.primary, fontSize: '0.9rem', fontWeight: 600 },
  hint: { fontSize: '0.8rem', color: colors.danger },
  card: { display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' },
  dot: { width: '10px', height: '10px', borderRadius: '50%', backgroundColor: colors.success, flexShrink: 0 },
  row: { display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' },
};

const btn = (type) => ({ ...S.button, ...(type === 'p' ? S.primaryButton : S.secondaryButton) });

function Steps({ n }) {
  const labels = ['Token', 'Repository', 'Verify'];
  return (
    <div style={W.steps}>
      {labels.map((l, i) => (
        <div key={i} style={{ ...W.stepItem, opacity: i <= n ? 1 : 0.4 }}>
          <div style={{ ...W.circle, backgroundColor: i <= n ? colors.primary : colors.border, color: i <= n ? '#fff' : colors.textLight }}>{i < n ? '\u2713' : i + 1}</div>
          <span style={{ fontSize: '0.8rem', color: colors.textDark }}>{l}</span>
        </div>
      ))}
    </div>
  );
}

const Settings = ({ onUpdate, repoInfo }) => {
  const [step, setStep] = useState(0);
  const [token, setToken] = useState('');
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const s = loadSettingsFromStorage();
    if (s.token) setToken(s.token);
    if (s.owner) setOwner(s.owner);
    if (s.repo) setRepo(s.repo);
    if (s.token && s.owner && s.repo) { setDone(true); setStep(3); }
  }, []);

  useEffect(() => {
    if (repoInfo?.owner) setOwner(repoInfo.owner);
    if (repoInfo?.repo) setRepo(repoInfo.repo);
  }, [repoInfo]);

  const tokenOk = TOKEN_RE.test(token.trim());

  const run = async (saveAfter) => {
    setError(null); setResult(null); setBusy(true);
    try {
      const r = await verify(token.trim(), owner.trim(), repo.trim());
      setResult(r);
      if (saveAfter) {
        saveSettingsToStorage(token.trim(), owner.trim(), repo.trim());
        setDone(true); setStep(3);
        if (onUpdate) onUpdate({ owner: owner.trim(), repo: repo.trim() });
      }
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  };

  const reset = () => {
    clearSettingsFromStorage();
    setToken(''); setOwner(''); setRepo('');
    setStep(0); setDone(false); setResult(null); setError(null);
  };

  if (done && step === 3) {
    return (
      <div style={S.container}>
        <div style={S.header}><h1 style={S.title}>Settings</h1><p style={S.description}>GitHub connection configured</p></div>
        <div style={W.card}>
          <div style={W.dot} />
          <div>
            <div style={{ fontWeight: 600, color: colors.textDark }}>{owner}/{repo}</div>
            <div style={{ fontSize: '0.8rem', color: colors.textLight }}>{result ? `${result.private ? 'Private' : 'Public'} repository` : 'Connected'}</div>
          </div>
        </div>
        {error && <div style={{ ...S.errorAlert, marginTop: '12px' }}>{error}</div>}
        {result && !error && <div style={{ ...S.successAlert, marginTop: '12px' }}>Connection verified</div>}
        <div style={W.row}>
          <button style={btn('p')} onClick={() => run(false)} disabled={busy}>{busy ? 'Testing...' : 'Test Connection'}</button>
          <button style={btn('s')} onClick={() => { setStep(0); setDone(false); setResult(null); setError(null); }}>Edit Settings</button>
          <button style={{ ...btn('s'), color: colors.danger }} onClick={reset}>Disconnect</button>
        </div>
      </div>
    );
  }

  return (
    <div style={S.container}>
      <div style={S.header}><h1 style={S.title}>Setup</h1><p style={S.description}>Connect Hookie to your GitHub repository in 3 steps</p></div>
      <Steps n={step} />
      {error && <div style={{ ...S.errorAlert, marginBottom: '16px' }}>{error}</div>}

      {step === 0 && (
        <div style={W.body}>
          <h2 style={W.h2}>Connect your GitHub account</h2>
          <p style={W.p}>Hookie needs a Personal Access Token (PAT) to read and write content in your repository. A PAT is a secure key that grants specific permissions without sharing your password.</p>
          <a href={TOKEN_URL} target="_blank" rel="noopener noreferrer" style={W.link}>Create a token on GitHub (repo scope required)</a>
          <div style={S.formGroup}>
            <label style={S.label}>Personal Access Token</label>
            <input type="password" value={token} onChange={e => setToken(e.target.value)} placeholder="ghp_... or github_pat_..." style={S.input} />
            {token && !tokenOk && <div style={W.hint}>Token should start with ghp_ or github_pat_</div>}
          </div>
          <button style={{ ...btn('p'), marginTop: '8px' }} disabled={!tokenOk} onClick={() => { setError(null); setStep(1); }}>Next</button>
        </div>
      )}

      {step === 1 && (
        <div style={W.body}>
          <h2 style={W.h2}>Choose your repository</h2>
          <p style={W.p}>Enter the GitHub owner (username or org) and repository name where your content lives.</p>
          <div style={S.formGroup}><label style={S.label}>Owner</label><input type="text" value={owner} onChange={e => setOwner(e.target.value)} placeholder="your-username" style={S.input} /></div>
          <div style={S.formGroup}><label style={S.label}>Repository</label><input type="text" value={repo} onChange={e => setRepo(e.target.value)} placeholder="my-site" style={S.input} /></div>
          <div style={W.row}><button style={btn('s')} onClick={() => setStep(0)}>Back</button><button style={btn('p')} disabled={!owner.trim() || !repo.trim()} onClick={() => { setError(null); setStep(2); }}>Next</button></div>
        </div>
      )}

      {step === 2 && (
        <div style={W.body}>
          <h2 style={W.h2}>Verify connection</h2>
          <p style={W.p}>Confirm that your token can access <strong>{owner}/{repo}</strong>.</p>
          {result && <div style={S.successAlert}>Connected to {result.name} ({result.private ? 'private' : 'public'})</div>}
          <div style={W.row}><button style={btn('s')} onClick={() => setStep(1)}>Back</button><button style={btn('p')} onClick={() => run(true)} disabled={busy}>{busy ? 'Verifying...' : result ? 'Done' : 'Verify and Save'}</button></div>
        </div>
      )}
    </div>
  );
};

export default Settings;
