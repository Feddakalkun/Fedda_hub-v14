# FEDDA Hub v14

FEDDA Hub v14 is the clean rebuild branch for the local FEDDA AI Studio.

The goal for v14 is to keep the working UI direction from v13/v11, keep the proven ComfyUI install flow, and rebuild the runtime in smaller steps instead of bundling every custom node and experiment at once.

## Workspace Split

- `H:\07-feddafront-v7\Fedda_hub-v14-repo` is the clean git repository used for source edits and GitHub pushes.
- `H:\07-feddafront-v7\Fedda_hub-v14-install` is the local install/test workspace. It can contain ComfyUI, embedded Python, custom nodes, models, generated output, logs, and other runtime files.

Keep generated/runtime files out of this repository. Promote only source changes back into the repo after they are understood.

## Starting Point

This repository starts from the v13 UI/source baseline, with v11/v12 available as installer and stability references in:

- `H:\07-feddafront-v7\github-feddafront-clones\01-Fedda_hub-v13`
- `H:\07-feddafront-v7\github-feddafront-clones\02-Fedda_hub-v11`
- `H:\07-feddafront-v7\github-feddafront-clones\03-Fedda_hub-v12`

## V14 Rules

- Keep the UI usable from the first screen.
- Preserve the FEDDA visual direction while cleaning the implementation.
- Install ComfyUI first, then add custom nodes one at a time.
- Add workflows only when their dependencies are explicit.
- Keep models, outputs, caches, and generated files outside git.
- Treat the install workspace as disposable and the repo workspace as clean.

## Structure

- `frontend/` - React + Vite + TypeScript UI
- `backend/` - FastAPI services, workflow routing, and app APIs
- `config/` - app configuration and workflow metadata
- `scripts/` - install, update, and maintenance scripts
- `docs/` - v14 planning and operational notes

## Current Status

V14 has been seeded from the v13 source baseline.

The initial v14 installer path is:

- `FEDDA_OneClick_Installer-v14.bat`
- `FEDDA_Update-v14.bat`
- `scripts/install_base.ps1`

This base installer intentionally skips custom/base node installation unless `scripts/install_base.ps1` is run with `-InstallBaseNodes`.
