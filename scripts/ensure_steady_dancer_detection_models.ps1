param(
    [switch]$SilentMode,
    [string]$InstallRoot
)

$ErrorActionPreference = "Stop"
$ScriptPath = $PSScriptRoot
$RootPath = Split-Path -Parent $ScriptPath
if ([string]::IsNullOrWhiteSpace($InstallRoot)) {
    $InstallRoot = $RootPath
}
$ComfyModels = Join-Path $InstallRoot "ComfyUI\models"
$DetectionDir = Join-Path $ComfyModels "detection"
$UnetDir = Join-Path $ComfyModels "unet"
$LorasDir = Join-Path $ComfyModels "loras"
$VaeDir = Join-Path $ComfyModels "vae"
$ClipDir = Join-Path $ComfyModels "clip"
$ClipVisionDir = Join-Path $ComfyModels "clip_vision"

function Write-Info {
    param([string]$Message, [string]$Color = "Gray")
    if (-not $SilentMode) {
        Write-Host $Message -ForegroundColor $Color
    }
}

function Ensure-File {
    param(
        [string]$Label,
        [string]$Url,
        [string]$DestPath,
        [long]$MinBytes = 1048576
    )
    $destDir = Split-Path -Parent $DestPath
    if (-not (Test-Path $destDir)) {
        New-Item -ItemType Directory -Path $destDir -Force | Out-Null
    }

    if ((Test-Path $DestPath) -and ((Get-Item $DestPath).Length -ge $MinBytes)) {
        Write-Info "  [OK] $Label already present" "Green"
        return
    }

    Write-Info "  [DL] $Label" "Yellow"
    & curl.exe -L -C - --retry 4 --retry-delay 3 --progress-bar -o "$DestPath" "$Url"
    if ($LASTEXITCODE -ne 0) {
        throw "Download failed for $Label (exit code $LASTEXITCODE)"
    }
    if (-not (Test-Path $DestPath) -or ((Get-Item $DestPath).Length -lt $MinBytes)) {
        throw "Downloaded file invalid for $Label"
    }
    Write-Info "  [OK] $Label ready" "Green"
}

Write-Info "`n[Steady Dancer] Ensuring required models..." "Cyan"

if (-not (Test-Path $DetectionDir)) {
    New-Item -ItemType Directory -Path $DetectionDir -Force | Out-Null
}

Ensure-File `
    -Label "WAN 2.1 Steady Dancer GGUF" `
    -Url "https://huggingface.co/MCG-NJU/SteadyDancer-GGUF/resolve/main/Wan21_I2V_SteadyDancer_fp16-Q6_K_fix_5d_tensor_from_fp8_e4m3fn_scaled_KJ.gguf" `
    -DestPath (Join-Path $UnetDir "Wan21_I2V_SteadyDancer_fp16-Q6_K_fix_5d_tensor_from_fp8_e4m3fn_scaled_KJ.gguf") `
    -MinBytes 1073741824

Ensure-File `
    -Label "LightX2V WAN 2.1 LoRA" `
    -Url "https://huggingface.co/Kijai/WanVideo_comfy/resolve/main/Lightx2v/lightx2v_I2V_14B_480p_cfg_step_distill_rank64_bf16.safetensors" `
    -DestPath (Join-Path $LorasDir "lightx2v_I2V_14B_480p_cfg_step_distill_rank64_bf16.safetensors") `
    -MinBytes 104857600

Ensure-File `
    -Label "WAN 2.1 VAE" `
    -Url "https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/resolve/main/split_files/vae/wan_2.1_vae.safetensors" `
    -DestPath (Join-Path $VaeDir "wan_2.1_vae.safetensors") `
    -MinBytes 104857600

Ensure-File `
    -Label "WAN UMT5 text encoder" `
    -Url "https://huggingface.co/Kijai/WanVideo_comfy/resolve/main/umt5-xxl-enc-bf16.safetensors" `
    -DestPath (Join-Path $ClipDir "umt5-xxl-enc-bf16.safetensors") `
    -MinBytes 1073741824

Ensure-File `
    -Label "WAN CLIP Vision H" `
    -Url "https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/resolve/main/split_files/clip_vision/clip_vision_h.safetensors" `
    -DestPath (Join-Path $ClipVisionDir "clip_vision_h.safetensors") `
    -MinBytes 104857600

Ensure-File `
    -Label "ViTPose vitpose-l-wholebody.onnx" `
    -Url "https://huggingface.co/JunkyByte/easy_ViTPose/resolve/main/onnx/wholebody/vitpose-l-wholebody.onnx" `
    -DestPath (Join-Path $DetectionDir "vitpose-l-wholebody.onnx") `
    -MinBytes 104857600

Ensure-File `
    -Label "YOLO yolov10m.onnx" `
    -Url "https://huggingface.co/onnx-community/yolov10m/resolve/main/onnx/model.onnx" `
    -DestPath (Join-Path $DetectionDir "yolov10m.onnx") `
    -MinBytes 10485760

Write-Info "[Steady Dancer] Required models ready." "Green"
