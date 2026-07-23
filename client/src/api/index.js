const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function request(path, options = {}, sessionId = null) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (sessionId) headers['x-session-id'] = sessionId;

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.message || 'Something went wrong. Please try again.');
  }
  return data;
}

export function ingestFromUrl(url) {
  return request('/repo/from-url', {
    method: 'POST',
    body: JSON.stringify({ url }),
  });
}

export function ingestFromZip(file, sessionId) {
  const formData = new FormData();
  formData.append('file', file);

  const headers = {};
  if (sessionId) headers['x-session-id'] = sessionId;

  return fetch(`${API_BASE_URL}/repo/from-zip`, {
    method: 'POST',
    body: formData,
    headers,
  }).then(async (res) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message || 'Upload failed. Please try again.');
    return data;
  });
}

export function checkHealth() {
  return request('/health');
}