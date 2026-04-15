# Vercel PostgreSQL Database Setup Script for Windows
# Usage: .\scripts\setup-vercel-db.ps1 "postgresql://..."

param(
    [Parameter(Mandatory=$false)]
    [string]$DatabaseUrl
)

Write-Host "`n╭─────────────────────────────────────────╮" -ForegroundColor Cyan
Write-Host "│  Seaquill - Vercel Database Setup       │" -ForegroundColor Cyan
Write-Host "╰─────────────────────────────────────────╯`n" -ForegroundColor Cyan

if ([string]::IsNullOrEmpty($DatabaseUrl)) {
    Write-Host "❌ DATABASE_URL not provided`n" -ForegroundColor Red
    Write-Host "Setup Instructions:`n" -ForegroundColor Yellow
    Write-Host "Option 1: Neon (Recommended)" -ForegroundColor Green
    Write-Host "  1. Go to https://console.neon.tech`n     Sign up / Login"
    Write-Host "  2. Create project > Name: 'seaquill' > Create"
    Write-Host "  3. Copy Connection String (URI format)"
    Write-Host "  4. Run: .\scripts\setup-vercel-db.ps1 'postgresql://...'" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Option 2: Supabase" -ForegroundColor Green
    Write-Host "  1. Go to https://supabase.com"
    Write-Host "  2. Create project > Name: 'seaquill' > Create"
    Write-Host "  3. Settings > Database > Copy URI"
    Write-Host "  4. Run: .\scripts\setup-vercel-db.ps1 'postgresql://...'" -ForegroundColor Cyan
    Write-Host ""
    exit 1
}

# Validate connection string
if ($DatabaseUrl -notmatch '^postgresql://') {
    Write-Host "❌ Invalid connection string format" -ForegroundColor Red
    Write-Host "Expected: postgresql://user:password@host/database`n" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Connection string validated" -ForegroundColor Green
Write-Host ""

# Set DATABASE_URL in Vercel
Write-Host "🔧 Setting DATABASE_URL in Vercel..." -ForegroundColor Yellow
$process = Start-Process -FilePath "vercel" -ArgumentList "env", "add", "DATABASE_URL" -NoNewWindow -PassThru
$process.WaitForExit()

if ($process.ExitCode -eq 0) {
    Write-Host "✅ DATABASE_URL added to Vercel" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to add DATABASE_URL" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🚀 Deploying to Vercel with new database..." -ForegroundColor Yellow
vercel deploy --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "╭──────────────────────────────────────────╮" -ForegroundColor Green
    Write-Host "│  ✅ Deployment Complete!                 │" -ForegroundColor Green
    Write-Host "├──────────────────────────────────────────┤" -ForegroundColor Green
    Write-Host "│  • DATABASE_URL configured               │" -ForegroundColor Green
    Write-Host "│  • Prisma migrations running on deploy   │" -ForegroundColor Green
    Write-Host "│  • Admin CMS ready                       │" -ForegroundColor Green
    Write-Host "╰──────────────────────────────────────────╯" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "❌ Deployment failed" -ForegroundColor Red
    exit 1
}
