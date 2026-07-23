const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { ingestFromUrl, ingestFromZip } = require('../services/ingestionService');
const { createSession, getSession, updateSession } = require('../store/sessionStore');

const router = express.Router();

// Store uploaded ZIP in memory (small files only, enforced below)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB max
});

// Helper: get sessionId from header, or create a new session if none provided
function resolveSessionId(req) {
  const existing = req.headers['x-session-id'];
  if (existing && getSession(existing)) return existing;
  const newId = uuidv4();
  createSession(newId);
  return newId;
}

router.post('/from-url', async (req, res) => {
  const { url } = req.body;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({
      error: { code: 'MISSING_URL', message: 'Please provide a GitHub repository URL.' },
    });
  }

  const sessionId = resolveSessionId(req);

  try {
    const result = await ingestFromUrl(sessionId, url);
    updateSession(sessionId, result);
    res.status(201).json({ sessionId, ...result });
  } catch (err) {
    res.status(err.status || 500).json({
      error: { code: err.code || 'INGESTION_FAILED', message: err.message },
    });
  }
});

router.post('/from-zip', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      error: { code: 'MISSING_FILE', message: 'Please upload a ZIP file.' },
    });
  }

  const sessionId = resolveSessionId(req);

  try {
    const result = await ingestFromZip(sessionId, req.file.buffer);
    updateSession(sessionId, result);
    res.status(201).json({ sessionId, ...result });
  } catch (err) {
    res.status(err.status || 500).json({
      error: { code: err.code || 'INGESTION_FAILED', message: err.message },
    });
  }
});

module.exports = router;
