const path = require('path');
const fs = require('fs');
const os = require('os');
const simpleGit = require('simple-git');
const AdmZip = require('adm-zip');
const { buildFileTree, MAX_FILES } = require('../utils/fileTree');

const TEMP_ROOT = path.join(os.tmpdir(), 'codeagent-sessions');

// Basic validation: must look like a public GitHub repo URL
function isValidGitHubUrl(url) {
  return /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/.test(url.trim());
}

function getSessionDir(sessionId) {
  return path.join(TEMP_ROOT, sessionId);
}

async function ingestFromUrl(sessionId, url) {
  if (!isValidGitHubUrl(url)) {
    const err = new Error('That doesn\'t look like a valid public GitHub repository URL.');
    err.code = 'INVALID_URL';
    err.status = 400;
    throw err;
  }

  const targetDir = getSessionDir(sessionId);
  fs.mkdirSync(targetDir, { recursive: true });

  try {
    const git = simpleGit();
    await git.clone(url, targetDir, ['--depth', '1']);
  } catch (cloneErr) {
    const err = new Error('We couldn\'t clone that repository. It may be private, deleted, or the URL is incorrect.');
    err.code = 'REPO_NOT_FOUND';
    err.status = 404;
    throw err;
  }

  return finishIngestion(targetDir, url, 'url');
}

async function ingestFromZip(sessionId, zipBuffer) {
  const targetDir = getSessionDir(sessionId);
  fs.mkdirSync(targetDir, { recursive: true });

  try {
    const zip = new AdmZip(zipBuffer);
    // adm-zip safely strips path traversal ("..") entries by default on extractAllTo
    zip.extractAllTo(targetDir, true);
  } catch (zipErr) {
    const err = new Error('That ZIP file could not be read. Make sure it\'s a valid, non-corrupted archive.');
    err.code = 'INVALID_ZIP';
    err.status = 400;
    throw err;
  }

  return finishIngestion(targetDir, null, 'zip');
}

function finishIngestion(targetDir, originalUrl, source) {
  const tree = buildFileTree(targetDir);
  if (originalUrl) {
    const match = originalUrl.match(/\/([\w.-]+?)\/?$/);
    if (match) tree.name = match[1];
  }

  if (tree.fileCount >= MAX_FILES) {
    const err = new Error(`This repository has too many files (limit: ${MAX_FILES}). Try a smaller repository.`);
    err.code = 'REPO_TOO_LARGE';
    err.status = 413;
    throw err;
  }

  return {
    repo: {
      source,
      originalUrl,
      tempDirPath: targetDir,
      fileCount: tree.fileCount,
    },
    fileTree: tree,
  };
}

module.exports = { ingestFromUrl, ingestFromZip, isValidGitHubUrl };
