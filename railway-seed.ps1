$env:DATABASE_URL = 'postgresql://postgres:YKUjuIaqyrcLykgTPCNiCfSYaOHzMZGW@caboose.proxy.rlwy.net:51319/railway'

Write-Host "Running prisma migrate deploy..."
npx prisma migrate deploy

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Migration successful! Now running seed..."
    npx prisma db seed
} else {
    Write-Host "Migration failed with exit code $LASTEXITCODE"
}
