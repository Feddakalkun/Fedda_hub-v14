# FEDDA Hub v14 Baseline Verification

Updated: 2026-05-23

This file tracks the clean-base install status before custom nodes and advanced workflow packs are introduced.

## Purpose

- Confirm the v14 baseline can install and start.
- Keep a reproducible checkpoint before adding optional complexity.
- Record environment facts useful for debugging future installer issues.

## Baseline Install Result

Log reviewed:

`H:\07-feddafront-v7\install-log-230526-1801.txt`

Status: PASS

Highlights:

- Bootstrap repo clone succeeded.
- ComfyUI clone succeeded.
- Embedded Python setup succeeded.
- ComfyUI requirements install succeeded.
- Torch fallback selected and installed: `cu124`.
- Installed runtime stack:
  - `torch 2.6.0+cu124`
  - `torchvision 0.21.0+cu124`
  - `torchaudio 2.6.0+cu124`
  - `xformers 0.0.29.post3`
- Smoke test output: `PyTorch 2.6.0+cu124 CUDA True`
- Frontend dependency install succeeded.
- Custom nodes were intentionally skipped.

Detected machine profile during this run:

- GPU: `NVIDIA GeForce RTX 3090`
- Driver: `596.36`
- RAM: `96 GB`
- Disk free on `H:`: `997 GB`

## Current Baseline Rules

1. Keep custom nodes out until core runtime stays stable.
2. Add custom nodes in small batches with verification after each batch.
3. Record failures and fixes before introducing new workflow packs.

## Quick Post-Install Checks

1. Start: `H:\07-feddafront-v7\Fedda_hub-v14-install\FEDDA_run-v14.bat`
2. Frontend: `http://localhost:5173`
3. Comfy health: `http://127.0.0.1:8199/system_stats`
4. Backend health: `http://127.0.0.1:8000/health` (if backend is expected on 8000 in current run profile)

## Notes

- PATH warnings for embedded Python scripts are expected in this portable layout.
- `scripts/install_base.ps1` now suppresses pip command chatter inside torch-install function so the "Torch source selected" line stays clean.
