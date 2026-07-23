const sessions = new Map();

const SESSION_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

function createSession(sessionId) {
  const session = {
    sessionId,
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_TTL_MS,
    repo: null,
    fileTree: null,
    analysis: null,
    task: null,
    plan: null,
    generation: null,
    review: null,
    documentation: null,
  };
  sessions.set(sessionId, session);
  return session;
}

function getSession(sessionId) {
  return sessions.get(sessionId) || null;
}

function updateSession(sessionId, updates) {
  const session = sessions.get(sessionId);
  if (!session) return null;
  Object.assign(session, updates);
  sessions.set(sessionId, session);
  return session;
}

function deleteSession(sessionId) {
  sessions.delete(sessionId);
}

// Clean up expired sessions every 30 minutes
setInterval(() => {
  const now = Date.now();
  for (const [id, session] of sessions.entries()) {
    if (session.expiresAt < now) {
      sessions.delete(id);
    }
  }
}, 30 * 60 * 1000);

module.exports = {
  createSession,
  getSession,
  updateSession,
  deleteSession,
};
