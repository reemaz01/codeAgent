import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [status, setStatus] = useState('checking...');

  useEffect(() => {
    fetch('http://localhost:5000/api/health')
      .then((res) => res.json())
      .then((data) => setStatus(data.message))
      .catch(() => setStatus('Backend not reachable'));
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '4rem', color: '#fff' }}>
      <h1>CodeAgent</h1>
      <p>Backend status: <strong>{status}</strong></p>
    </div>
  );
}

export default App;