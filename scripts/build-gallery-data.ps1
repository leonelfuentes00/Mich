param(
    [string]$SourceRoot = "E:\Media\Heartopia\Michelle\extracted",
    [string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
)

$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$albumsTarget = Join-Path $ProjectRoot "assets\photos\albums"
$dataTarget = Join-Path $ProjectRoot "data\gallery-data.json"

New-Item -ItemType Directory -Force -Path $albumsTarget | Out-Null
Get-ChildItem -Path $albumsTarget -Directory -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force

function Get-NumericPrefix([string]$name) {
    if ($name -match "^(\d+)") {
        return [int]$matches[1]
    }
    return [int]::MaxValue
}

$sourceAlbums = Get-ChildItem -Path $SourceRoot -Directory | Sort-Object @{ Expression = { Get-NumericPrefix $_.Name } }, Name
$albumObjects = @()
$totalImages = 0

for ($albumIndex = 0; $albumIndex -lt $sourceAlbums.Count; $albumIndex++) {
    $album = $sourceAlbums[$albumIndex]
    $albumNumber = $albumIndex + 1
    $albumId = "album-{0:d2}" -f $albumNumber
    $albumLabel = "Capitulo {0:d2}" -f $albumNumber
    $albumTarget = Join-Path $albumsTarget $albumId
    New-Item -ItemType Directory -Force -Path $albumTarget | Out-Null

    $sourceImages = Get-ChildItem -Path $album.FullName -Recurse -File -Include *.jpg, *.jpeg | Sort-Object FullName
    $imageObjects = @()

    for ($imageIndex = 0; $imageIndex -lt $sourceImages.Count; $imageIndex++) {
        $image = $sourceImages[$imageIndex]
        $destinationName = "{0:d3}{1}" -f ($imageIndex + 1), $image.Extension.ToLowerInvariant()
        $destinationPath = Join-Path $albumTarget $destinationName
        Copy-Item -Path $image.FullName -Destination $destinationPath -Force

        $bitmap = [System.Drawing.Image]::FromFile($destinationPath)
        $width = $bitmap.Width
        $height = $bitmap.Height
        $bitmap.Dispose()

        $relativeSrc = ("assets/photos/albums/{0}/{1}" -f $albumId, $destinationName).Replace("\", "/")

        $imageObjects += [PSCustomObject]@{
            id          = "{0}-{1:d3}" -f $albumId, ($imageIndex + 1)
            src         = $relativeSrc
            width       = $width
            height      = $height
            title       = "{0} · Recuerdo {1:d2}" -f $albumLabel, ($imageIndex + 1)
            alt         = "Recuerdo {0:d2} de {1}" -f ($imageIndex + 1), $albumLabel
            photoNumber = $imageIndex + 1
        }
    }

    $totalImages += $imageObjects.Count

    $albumObjects += [PSCustomObject]@{
        id     = $albumId
        label  = $albumLabel
        source = $album.Name
        count  = $imageObjects.Count
        cover  = $imageObjects[0].src
        images = $imageObjects
    }
}

$payload = [PSCustomObject]@{
    title       = "Michelle"
    generatedAt = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssK")
    totalImages = $totalImages
    albums      = $albumObjects
}

$json = $payload | ConvertTo-Json -Depth 6
[System.IO.File]::WriteAllText($dataTarget, $json, [System.Text.Encoding]::UTF8)

Write-Host "Catalogo generado en $dataTarget con $totalImages imagenes."
