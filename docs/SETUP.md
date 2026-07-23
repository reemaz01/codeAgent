# SETUP.md — codeAgent

*How to get the full project running locally from scratch.*

## Prerequisites

| Tool | Version Used | Why |
|---|---|---|
| Node.js | v22.14.0 | JavaScript runtime for both frontend and backend |
| npm | v11.4.1 | Package manager, ships with Node |
| Git | any recent version | Needed by the backend to clone submitted repos, and for your own version control |
| VS Code (recommended) | latest | Editor used throughout this project |

## 1. Clone the repository

```powershell
git clone https://github.com/reemaz01/codeAgent.git
cd codeAgent
```

## 2. Backend setup

```powershell
cd server
npm install
```

Create `server/.env` (gitignored, never commit this):
```
ANTHROPIC_API_KEY=your_key_here
PORT=5000
```

Start the backend:
```powershell
npm run dev
```
Confirm it's running: visit `http://localhost:5000/api/health` — should return `{"status":"ok","message":"CodeAgent server running"}`.

## 3. Frontend setup

Open a second terminal:
```powershell
cd client
npm install
npm run dev
```
Visit `http://localhost:5173/` — you should see the CodeAgent Step 1 screen (GitHub URL / Upload ZIP input).

## 4. Verify full connectivity

With both servers running, submit a public GitHub URL (e.g. `https://github.com/octocat/Hello-World`) on the Step 1 screen. You should see it advance to a "Repository loaded ✅" screen showing the file tree.

## Common Issues

- **"Cannot find module '...vite.js'"** → `node_modules` is corrupted/incomplete. Fix: delete it and reinstall.
  ```powershell
  Remove-Item -Recurse -Force node_modules
  npm install
  ```
- **Wrong working directory** → this project may be nested (e.g. `codeAgent/codeAgent/`). Always confirm with `ls` that you see `package.json`, `src/`, etc. before running npm commands.
- **PowerShell `-Form` parameter not found** → your PowerShell version doesn't support `Invoke-RestMethod -Form`. Use `curl.exe` instead (not plain `curl`, which PowerShell aliases to something else).
- **OneDrive-redirected Desktop** → on some Windows setups, `Desktop` actually lives at `C:\Users\<you>\OneDrive\Desktop`, not `C:\Users\<you>\Desktop`. Check both if a file "isn't found."
