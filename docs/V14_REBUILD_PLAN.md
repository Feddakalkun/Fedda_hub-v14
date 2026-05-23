# V14 Rebuild Plan

## Intent

Build FEDDA Hub v14 as a clean, staged version instead of carrying forward every installed node, model, and experiment from earlier folders.

## Source References

- v13: primary UI and latest app direction
- v11: stable installer/runtime reference
- v12: alternate installer structure and simplified repo layout
- older versions: reference only when a specific feature was better there

## Milestones

1. Clean source baseline
   - Seed the v14 repo with UI, backend, config, and scripts from the best current source.
   - Keep runtime files out of git.

2. Repo/install split
   - Use `Fedda_hub-v14-repo` for GitHub pushes.
   - Use `Fedda_hub-v14-install` for install testing.

3. Minimal install
   - Install ComfyUI and the app runtime.
   - Do not install custom nodes by default.
   - Confirm frontend, backend, and ComfyUI can start together.

4. UI preservation
   - Keep the v13 visual language, navigation, cards, and Image Studio direction.
   - Refactor only when it helps staged development.

5. Workflow bring-up
   - Add one workflow at a time.
   - Document required custom nodes before adding them.
   - Test each node package before making it part of the standard install.

6. Release path
   - Push source-only changes to GitHub.
   - Keep the install folder disposable.
   - Promote tested install changes back into scripts and docs.

## Do Not Commit

- `ComfyUI/`
- `python_embeded/`
- `venv/`
- `node_modules/`
- `models/`
- `output/`
- `logs/`
- downloaded custom node repositories unless explicitly promoted
- personal config, local memories, caches, or generated images
