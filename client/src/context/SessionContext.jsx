/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [sessionId, setSessionId] = useState(null);
  const [fileTree, setFileTree] = useState(null);
  const [repoInfo, setRepoInfo] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  const value = {
    sessionId,
    setSessionId,
    fileTree,
    setFileTree,
    repoInfo,
    setRepoInfo,
    currentStep,
    setCurrentStep,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used inside a SessionProvider');
  }
  return context;
}