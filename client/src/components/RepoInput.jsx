import { useState } from 'react';
import { useSession } from '../context/SessionContext';
import { ingestFromUrl, ingestFromZip } from '../api';

function RepoInput() {
  const [mode, setMode] = useState('url'); // 'url' or 'zip'
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { setSessionId, setFileTree, setRepoInfo, setCurrentStep } = useSession();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let result;
      if (mode === 'url') {
        if (!url.trim()) throw new Error('Please enter a GitHub URL.');
        result = await ingestFromUrl(url.trim());
      } else {
        if (!file) throw new Error('Please choose a ZIP file.');
        result = await ingestFromZip(file);
      }

      setSessionId(result.sessionId);
      setFileTree(result.fileTree);
      setRepoInfo(result.repo);
      setCurrentStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 500, margin: '4rem auto', textAlign: 'center' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={() => setMode('url')}
          style={{ fontWeight: mode === 'url' ? 'bold' : 'normal', marginRight: '1rem' }}
        >
          GitHub URL
        </button>
        <button
          onClick={() => setMode('zip')}
          style={{ fontWeight: mode === 'zip' ? 'bold' : 'normal' }}
        >
          Upload ZIP
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {mode === 'url' ? (
          <input
            type="text"
            placeholder="https://github.com/owner/repo"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}
          />
        ) : (
          <input
            type="file"
            accept=".zip"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        )}

        <button
          type="submit"
          disabled={loading}
          style={{ marginTop: '1.5rem', padding: '0.75rem 2rem', fontSize: '1rem' }}
        >
          {loading ? 'Analyzing...' : 'Analyze Repository →'}
        </button>
      </form>

      {error && (
        <p style={{ color: '#ff6b6b', marginTop: '1rem' }}>{error}</p>
      )}
    </div>
  );
}

export default RepoInput;
