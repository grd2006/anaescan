param(
  [string]$Python = "python"
)

$ErrorActionPreference = "Stop"

$model = Join-Path $PSScriptRoot "..\models\conjuctiva.keras"
$output = Join-Path $PSScriptRoot "..\public\models\conjuctiva.tflite"

if (-not (Test-Path $model)) {
  throw "The source model was not found at models/conjuctiva.keras. Run git lfs pull first."
}

New-Item -ItemType Directory -Force -Path $output | Out-Null

& $Python -c "import keras, tensorflow as tf; model=keras.saving.load_model(r'$model', compile=False); converter=tf.lite.TFLiteConverter.from_keras_model(model); open(r'$output','wb').write(converter.convert())"

if ($LASTEXITCODE -ne 0) {
  throw "TensorFlow.js conversion failed with exit code $LASTEXITCODE."
}

Write-Host "Converted model written to public/models/conjuctiva.tflite"