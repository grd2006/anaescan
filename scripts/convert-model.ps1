param(
  [string]$Python = "python"
)

$ErrorActionPreference = "Stop"

$model = Join-Path $PSScriptRoot "..\models\conjuctiva.keras"
$output = Join-Path $PSScriptRoot "..\public\models\conjuctiva"

if (-not (Test-Path $model)) {
  throw "The source model was not found at models/conjuctiva.keras. Run git lfs pull first."
}

New-Item -ItemType Directory -Force -Path $output | Out-Null

& $Python -m tensorflowjs.converters.converter `
  --input_format=keras `
  $model `
  $output

if ($LASTEXITCODE -ne 0) {
  throw "TensorFlow.js conversion failed with exit code $LASTEXITCODE."
}

Write-Host "Converted model written to public/models/conjuctiva"