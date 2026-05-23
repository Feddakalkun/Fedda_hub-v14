# FEDDA Hub v14 Handover Log

This file is the working memory and handover document for any LLM agent continuing FEDDA Hub v14 work.

Always update this file after meaningful work: setup changes, installer changes, test results, design decisions, bug fixes, new assumptions, or user direction. Keep it practical, chronological, and explicit enough that another agent can continue without guessing.

## User Intent

The user wanted a fresh start after many local FEDDA/FeddaFront project folders had accumulated. Most code was believed to be pushed to GitHub, but the user was worried about losing important unpushed work, generated images, output folders, or useful local state.

After cleanup, the user wanted a new v14 built step by step:

- Preserve the UI/design direction from recent versions, especially v13/v11.
- Keep the ComfyUI install approach that has worked well.
- Avoid installing all custom nodes at once.
- Add custom nodes and workflows one at a time only when needed.
- Use two v14 folders:
  - one clean repo folder used for GitHub pushes,
  - one install/test folder that can contain ComfyUI, embedded Python, models, outputs, custom nodes, logs, and other runtime files.
- Use `github-feddafront-clones` as reference material for pulling files and ideas from earlier versions.

The user may later continue with Gemini or another LLM, so this file must serve as the shared continuity log.

## Current Workspace

Workspace root:

```text
H:\07-feddafront-v7
```

Important folders:

```text
H:\07-feddafront-v7\Fedda_hub-v14-repo
H:\07-feddafront-v7\Fedda_hub-v14-install
H:\07-feddafront-v7\github-feddafront-clones
H:\07-feddafront-v7\KEEP_BEFORE_DELETE_2026-05-23
H:\07-feddafront-v7\git-repo-bat
```

Clean source repo:

```text
H:\07-feddafront-v7\Fedda_hub-v14-repo
```

Install/test workspace:

```text
H:\07-feddafront-v7\Fedda_hub-v14-install
H:\07-feddafront-v7\Fedda_hub-v14-install\comfyuifeddafront
```

GitHub repo:

```text
https://github.com/Feddakalkun/Fedda_hub-v14
```

## Cleanup And Backup History

Before deleting the old local workspace, an inventory was run across `H:\07-feddafront-v7`.

Findings:

- Existing GitHub-tracked repos with upstreams had no ahead commits at that point.
- Several repos had local modified or untracked files.
- Output/media folders existed and could contain generated images worth preserving.
- Large local folders mostly contained models, ComfyUI installs, embedded Python, archives, custom nodes, and dependencies.

A safety backup folder was created:

```text
H:\07-feddafront-v7\KEEP_BEFORE_DELETE_2026-05-23
```

It contains:

```text
git_dirty_files
output_and_visuals
_git_status_and_patches
README_WHAT_WAS_SAVED.txt
```

Approximate saved sizes:

- `git_dirty_files`: 78 files/folders, about 26.7 MB
- `output_and_visuals`: 71 files, about 146 MB
- `_git_status_and_patches`: 13 files, about 0.68 MB

Important saved dirty/source areas included:

- `230526-v13\comfyuifeddafront`
- `Fedda_hub-v13-github\Fedda_hub-v13`
- `Fedda_hub-v11-installfolder\comfyuifeddafront`
- `Fedda_hub-v12`
- `Fedda_hub-v11`
- `v11-testfolderinstall\comfyuifeddafront`

Important saved output/visual areas included:

- `230526-v13\comfyuifeddafront\ComfyUI\output`
- `Fedda_hub-v11-installfolder\comfyuifeddafront\ComfyUI\output`
- `v12-install\comfyuifeddafront\ComfyUI\output`
- `Fedda_hub-v12-1\comfyuifeddafront\ComfyUI\output`
- `v11-testfolderinstall\comfyuifeddafront\ComfyUI\output`
- `v10-visuals`
- `_local_tools\card-forge`

The user then manually deleted most old folders. The agent did not delete anything.

## GitHub Reference Clone History

The user had a local overview folder:

```text
H:\07-feddafront-v7\git-repo-bat
```

Files there included:

- `repo_github_status.csv`
- `github_likely_pushed.csv`
- `github_needs_check.csv`
- helper clone/delete scripts

The CSVs were parsed to identify FeddaFront/FEDDA Hub-related repos. Fresh GitHub metadata was checked for likely relevant repos.

Most relevant versions by recency:

```text
Feddakalkun/Fedda_hub-v13  pushed 2026-05-23 02:08
Feddakalkun/Fedda_hub-v11  pushed 2026-05-23 01:52
Feddakalkun/Fedda_hub-v12  pushed 2026-05-17 04:32
Feddakalkun/Fedda_hub-v10  pushed 2026-04-25 05:25
Feddakalkun/Fedda_hub-v7   pushed 2026-04-22 04:19
Feddakalkun/Fedda_hub-v9   pushed 2026-04-14 05:43
```

Reference clones were created here:

```text
H:\07-feddafront-v7\github-feddafront-clones
```

Key clones:

```text
01-Fedda_hub-v13
02-Fedda_hub-v11
03-Fedda_hub-v12
04-Fedda_hub-v10
05-Fedda_hub-v9
06-Fedda_hub-v8
07-Fedda_hub-v7
08-Fedda_hub-v6
09-Fedda_hub-v4
10-Fedda_hub-v3
11-Fedda_hub-v2
12-comfyuifeddafront
13-comfyuifeddafront-nonportable
14-comfyuifeddafront-docker
15-Fedda_ltx-UI
16-FeddaComfyui
17-final_comfyuibackend_feddakalkun
18-frontendUI-feddakalkun
19-comfyfrontend
20-comfyfrontend-updates
21-Fedda_hub-v7-0
22-Fedda_hub-v9-0
23-Fedda_hub-v9-0-updates
```

No clone failures were found in `CLONE_LOG.txt`.

## V14 Setup History

The user created a clean GitHub repo:

```text
https://github.com/Feddakalkun/Fedda_hub-v14
```

The repo was initially empty.

Two local v14 folders were created:

```text
H:\07-feddafront-v7\Fedda_hub-v14-repo
H:\07-feddafront-v7\Fedda_hub-v14-install
```

`Fedda_hub-v14-repo` was cloned from GitHub and is the clean source-of-truth repo.

`Fedda_hub-v14-install` is the disposable local install/test workspace.

The v14 source baseline was seeded from:

```text
H:\07-feddafront-v7\github-feddafront-clones\01-Fedda_hub-v13
```

Excluded during copy:

- `.git`
- `.npm-cache`
- `node_modules`
- `dist`
- `build`
- `ComfyUI`
- `python_embeded`
- `venv`
- `models`
- `output`
- `logs`
- `cache`

The install workspace copy was placed at:

```text
H:\07-feddafront-v7\Fedda_hub-v14-install\comfyuifeddafront
```

This install copy does not have `.git`.

## V14 Files Added Or Changed

Created or changed:

```text
README.md
docs/V14_REBUILD_PLAN.md
scripts/install_base.ps1
FEDDA_OneClick_Installer-v14.bat
FEDDA_Update-v14.bat
.gitignore
GEMINI.md
```

Removed from v14 source:

```text
FEDDA_OneClick_Installer-v11.bat
FEDDA_Update-v11.bat
```

Important note:

`run.bat` is still from the v13 baseline and has not yet been fully cleaned/slimmed for v14. It may reference older assumptions and should be reviewed after the base installer test.

## Installer Design

The v13/v11 installer was inspected. It still pointed to:

```text
https://github.com/Feddakalkun/Fedda_hub-v11
branch v11-main
```

Therefore it was not safe to merely rename it to v14.

The v12 bootstrap installer pattern was chosen as the cleaner base because it supports:

- a hidden bootstrap repo,
- a separate install root,
- a generated run launcher,
- a generated update launcher.

New v14 installer:

```text
FEDDA_OneClick_Installer-v14.bat
```

Behavior:

- Clones or updates bootstrap repo:

```text
%ROOT%\_fedda_hub_v14_repo
```

- Uses repo:

```text
https://github.com/Feddakalkun/Fedda_hub-v14.git
branch main
```

- Installs runtime into:

```text
%ROOT%\comfyuifeddafront
```

- Runs:

```text
%BOOTSTRAP_DIR%\scripts\install_base.ps1 -InstallRoot "%INSTALL_ROOT%"
```

- Creates:

```text
FEDDA_Update-v14.bat
FEDDA_run-v14.bat
```

New v14 update wrapper:

```text
FEDDA_Update-v14.bat
```

Behavior:

- Updates `_fedda_hub_v14_repo` from origin/main.
- Resets bootstrap repo hard to origin/main.
- Cleans untracked bootstrap files.
- Runs `scripts/install_base.ps1` again against the install root.

## Base Install Script

`scripts/install_base.ps1` was copied from v12 and modified for v14.

Current behavior:

- Checks system basics.
- Clones/updates ComfyUI.
- Installs embedded Python.
- Installs ComfyUI requirements.
- Installs Torch stack based on detected NVIDIA GPU series.
- Installs frontend dependencies.
- Runs a torch/CUDA smoke test.
- Does not install custom/base nodes by default.

New switch:

```powershell
-InstallBaseNodes
```

Custom/base nodes are skipped unless this switch is passed.

Reason:

The user explicitly wants to start clean and add custom nodes one by one after the core ComfyUI/app baseline works.

## Git History

Initial v14 commit was created and pushed:

```text
e2ac687 Seed FEDDA Hub v14 baseline
```

Branch:

```text
main
```

Remote:

```text
origin/main
```

The repo was clean after push:

```text
## main...origin/main
```

Follow-up documentation commit:

```text
pending: add GEMINI.md handover log
```

## Testing Status

Completed:

- PowerShell parse check for `scripts/install_base.ps1`: OK.
- Searched v14 wrapper files for old `v11`, `Fedda_hub-v11`, `v12`, and `Fedda_hub-v12` references: none found.
- Synced clean repo source into install workspace.

Not yet completed:

- The user has not yet run the v14 installer.
- No full install test has been completed.
- No frontend dev server test has been completed.
- No backend/ComfyUI integration test has been completed.
- `run.bat` has not been audited for v14 assumptions.

Expected next manual test:

```text
H:\07-feddafront-v7\Fedda_hub-v14-install\FEDDA_OneClick_Installer-v14.bat
```

This may download ComfyUI, embedded Python, pip, Torch/CUDA wheels, and npm packages, so it can take a while.

## Known Risks And Follow-Ups

1. `run.bat` is still inherited from v13 and may need v14 cleanup.
2. The frontend/backend may still assume custom nodes/workflows exist.
3. The baseline repo includes many workflows and UI pages from v13, even though the install does not install their node dependencies yet.
4. `scripts/install_lite.ps1` still exists from v13 and still installs many custom nodes from `config/nodes.json`; do not use it as the default v14 path yet.
5. `scripts/update_logic.ps1` and other legacy scripts may assume full v13/v11 install behavior.
6. Some tracked assets are large but were kept to preserve UI/design continuity.

Recommended next steps:

1. Run the v14 installer from the install workspace.
2. Capture installer errors/output.
3. Fix only the minimum needed for base install success.
4. Verify ComfyUI starts on port `8199`.
5. Verify frontend starts, likely on `5173`.
6. Audit `run.bat` and either simplify it for v14 or replace it with a generated v14 launcher pattern.
7. Only after baseline works, choose the first workflow/node package to bring up.

## Operating Instructions For Future Agents

- Do not delete user files unless the user explicitly asks.
- Keep `Fedda_hub-v14-repo` clean and source-only.
- Treat `Fedda_hub-v14-install` as disposable runtime/test state.
- Pull inspiration/files from `github-feddafront-clones`, but do not blindly copy old installer behavior.
- Prefer v13 for UI/design reference.
- Prefer v11 for stable runtime behavior reference.
- Prefer v12 for bootstrap/install separation reference.
- Keep custom nodes opt-in until proven needed.
- Update this `GEMINI.md` after every meaningful change or test result.
- Include user decisions and questions here when they affect direction.
- If committing code, mention the commit hash in this file.

## Conversation Summary So Far

User: wanted to delete the old workspace but feared losing unpushed work or generated output.

Agent: inventoried repos, dirty files, output folders, and large folders. Found no ahead commits for upstream-tracked repos but found local dirty/untracked files and media outputs.

User: asked agent to create a root backup folder and move/copy important things.

Agent: created `KEEP_BEFORE_DELETE_2026-05-23`, copied dirty files, patches/status, and outputs. Used copy, not move.

User: manually deleted most old files and felt relieved.

Agent: helped inspect `git-repo-bat` and identified GitHub FeddaFront/FEDDA Hub versions with push dates.

User: asked to clone all relevant versions.

Agent: created `github-feddafront-clones` and cloned 23 relevant repos.

User: proposed building a new v14 step by step while preserving UI/design and keeping ComfyUI install stable but custom nodes gradual.

Agent: agreed and proposed a clean staged rebuild.

User: wanted two v14 folders: clean push repo and install/test folder. User created `Feddakalkun/Fedda_hub-v14`.

Agent: created `Fedda_hub-v14-repo` and `Fedda_hub-v14-install`, seeded v14 from v13, added docs, created v14 installer/update scripts, modified base install to skip nodes by default, committed and pushed first baseline.

User: asked for this handover/log file for Gemini or any future LLM and asked that it be kept updated.

Agent: created this `GEMINI.md`.

## 2026-05-23 Update: Handover Log Added

Created `GEMINI.md` as the shared continuity document. It records the cleanup, backup, GitHub clone inventory, v14 repo/install split, installer design, current testing status, known risks, and instructions for future agents.

Important standing instruction:

Update this file after each meaningful change or test result.
