cd "C:\Users\santi\OneDrive\Documents\devv\practica_hospital\AppHUSRT_Integrado\frontend\src\app\Components\mesaServicios\"

Get-ChildItem -Recurse -Filter "*.ts" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $content = $content -replace "from '../../services/", "from '../../../Services/mesaServicios/"
    $content = $content -replace "from '../../models/", "from '../../../models/mesaServicios/"
    $content = $content -replace "from '../environments/environment'", "from '../../../../environments/environment'"
    Set-Content -Path $_.FullName -Value $content -NoNewline
}

Write-Host "Import paths fixed successfully!"
