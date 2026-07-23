import { SessionProvider, useSession } from './context/SessionContext';
import RepoInput from './components/RepoInput';
import './App.css';

function StepIndicator() {
  const { currentStep } = useSession();
  return (
    <div style={{ textAlign: 'center', padding: '1rem', color: '#aaa' }}>
      Step {currentStep} of 9
    </div>
  );
}

function StepContent() {
  const { currentStep, fileTree, repoInfo } = useSession();

  if (currentStep === 1) {
    return <RepoInput />;
  }

  // Placeholder for Step 2 onward — real Analysis screen built Day 4
  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', textAlign: 'center' }}>
      <h2>Repository loaded ✅</h2>
      <p>Source: {repoInfo?.source} — {repoInfo?.fileCount} file(s)</p>
      <pre style={{ textAlign: 'left', background: '#16213e', padding: '1rem', borderRadius: '8px', overflow: 'auto' }}>
        {JSON.stringify(fileTree, null, 2)}
      </pre>
    </div>
  );
}

function App() {
  return (
    <SessionProvider>
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <h1>CodeAgent</h1>
        <StepIndicator />
        <StepContent />
      </div>
    </SessionProvider>
  );
}

export default App;