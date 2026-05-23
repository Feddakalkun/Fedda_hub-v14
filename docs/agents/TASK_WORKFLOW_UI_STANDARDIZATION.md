# TASK - Workflow UI Standardization

## Goal

Create a standardized UI system for workflow pages so all present and future workflow UIs feel consistent, while still allowing each workflow to expose unique controls.

This should reduce one-off page code, improve maintainability, and speed up new workflow page creation.

## In Scope

- Audit current workflow pages under `frontend/src/pages/`.
- Identify repeated layout and control patterns.
- Define shared UI primitives for workflow pages.
- Implement a reusable workflow page scaffold/shell.
- Migrate at least 2 representative workflow pages to the new pattern.
- Keep existing behavior intact where possible.

## Out Of Scope

- Rewriting backend workflow execution logic.
- Changing model/workflow semantics.
- Massive visual redesign of the entire app.
- Installing new runtime dependencies unless truly needed.

## Constraints

- Preserve FEDDA visual identity and existing UX direction.
- Favor composition over page-specific duplication.
- Keep accessibility and mobile layout in mind.
- Avoid breaking existing routes.

## Candidate Shared Components

- `WorkflowPageShell`
- `WorkflowSection`
- `WorkflowFieldRow`
- `WorkflowFieldGrid`
- `WorkflowActionBar`
- `WorkflowStatusBanner`
- `WorkflowPreviewPanel`

## Suggested File Targets

- `frontend/src/components/layout/` (new shared workflow layout components)
- `frontend/src/components/ui/` (new field/action primitives)
- `frontend/src/pages/` (migrate selected pages)
- `frontend/src/config/` (optional shared UI metadata if useful)

## Acceptance Criteria

1. At least 2 workflow pages use the same standardized shell/components.
2. Common controls (prompt/seed/steps/CFG/action buttons/status) follow consistent structure.
3. No route regressions for migrated pages.
4. Mobile and desktop layout remain usable.
5. Code duplication is measurably reduced in migrated pages.

## Verification

- Build frontend successfully.
- Manually open migrated workflow pages and compare layout consistency.
- Confirm action flow still triggers expected UI state updates.

## Progress Log

- `[x]` Audit current workflow page patterns
- `[x]` Define shared component contracts
- `[x]` Implement shared components
- `[x]` Migrate first workflow page
- `[x]` Migrate second workflow page
- `[x]` Run verification and summarize

### Migration Notes (2026-05-23)

- Audited `frontend/src/pages/` and selected WAN pair as representative migration targets:
  - `frontend/src/pages/wan22/Wan22Img2Vid.tsx`
  - `frontend/src/pages/wan22/Wan22Vid2Vid.tsx`
- Added shared workflow scaffold components in:
  - `frontend/src/components/layout/WorkflowPageShell.tsx`
- Migrated both WAN pages to use shared shell primitives:
  - `WorkflowPageShell`
  - `WorkflowPreviewPanel`
  - `WorkflowStatusBanner`
- Kept existing generation behavior, routing, and backend call semantics intact.
- Verification:
  - `npm run build` in `frontend/` passed successfully.

Notes:

- This task is high priority for long-term maintainability.
- Keep changes incremental and easy to review.
