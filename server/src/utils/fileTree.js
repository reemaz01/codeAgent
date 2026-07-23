const fs = require('fs');
const path = require('path');

// Folders/files we never want to show or read into memory
const EXCLUDED_NAMES = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  'coverage',
]);

const EXCLUDED_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico',
  '.woff', '.woff2', '.ttf', '.eot',
  '.zip', '.tar', '.gz',
  '.lock', // e.g. package-lock.json content is huge and not useful to read
]);

const MAX_FILES = 500;

function buildFileTree(rootDir) {
  let fileCount = 0;

  function walk(currentPath, relativePath) {
    const stats = fs.statSync(currentPath);

    if (stats.isDirectory()) {
      const name = path.basename(currentPath);
      if (EXCLUDED_NAMES.has(name)) return null;

      const entries = fs.readdirSync(currentPath);
      const children = [];

      for (const entry of entries) {
        if (fileCount >= MAX_FILES) break;
        const childPath = path.join(currentPath, entry);
        const childRelative = path.join(relativePath, entry);
        const childNode = walk(childPath, childRelative);
        if (childNode) children.push(childNode);
      }

      return {
        name,
        path: relativePath,
        type: 'directory',
        children,
      };
    } else {
      const ext = path.extname(currentPath).toLowerCase();
      if (EXCLUDED_EXTENSIONS.has(ext)) return null;

      fileCount++;
      return {
        name: path.basename(currentPath),
        path: relativePath,
        type: 'file',
        children: null,
      };
    }
  }

  const rootName = path.basename(rootDir);
  const tree = walk(rootDir, '');
  return { ...tree, name: rootName, fileCount };
}

module.exports = { buildFileTree, MAX_FILES };