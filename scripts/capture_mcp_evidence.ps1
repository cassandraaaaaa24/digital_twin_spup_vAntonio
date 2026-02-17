param(
  [string]$Query = "What is my degree?",
  [int]$K = 3,
  [string]$OutDir = "evidence"
)

if (-not (Test-Path $OutDir)) { New-Item -ItemType Directory -Path $OutDir | Out-Null }

$ts = Get-Date -Format "yyyyMMdd_HHmmss"
Write-Output "Timestamp: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

$body = @{ query = $Query; k = $K } | ConvertTo-Json
try {
  $response = Invoke-RestMethod -Method POST -Uri http://localhost:4000/mcp/query -ContentType 'application/json' -Body $body -ErrorAction Stop
} catch {
  Write-Error "Request failed: $($_.Exception.Message)"
  exit 1
}

$outFile = Join-Path $OutDir ("mcp_response_$ts.json")
$response | ConvertTo-Json -Depth 10 | Out-File -FilePath $outFile -Encoding utf8
Write-Output "Saved response to $outFile"
Get-Content $outFile
