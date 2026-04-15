#!/bin/bash
# Vercel PostgreSQL Database Setup Script
# Supports: Neon, Supabase, or manual connection string

set -e

echo "╭─────────────────────────────────────────╮"
echo "│  Seaquill - Vercel Database Setup       │"
echo "╰─────────────────────────────────────────╯"
echo ""

# Check if connection string is provided as argument
if [ $# -eq 0 ]; then
    echo "❌ DATABASE_URL not provided"
    echo ""
    echo "Usage:"
    echo "  Option 1 (Neon):"
    echo "    1. Go to https://console.neon.tech"
    echo "    2. Create project 'seaquill'"
    echo "    3. Copy connection string (URI format)"
    echo "    4. Run: ./scripts/setup-vercel-db.sh 'postgresql://...'"
    echo ""
    echo "  Option 2 (Supabase):"
    echo "    1. Go to https://supabase.com"
    echo "    2. Create project 'seaquill'"
    echo "    3. Copy connection string from Settings > Database"
    echo "    4. Run: ./scripts/setup-vercel-db.sh 'postgresql://...'"
    echo ""
    exit 1
fi

DATABASE_URL="$1"

# Validate connection string
if [[ ! $DATABASE_URL =~ ^postgresql:// ]]; then
    echo "❌ Invalid connection string format"
    echo "Expected: postgresql://user:password@host/database"
    exit 1
fi

echo "✅ Connection string validated"
echo ""

# Set DATABASE_URL in Vercel
echo "🔧 Setting DATABASE_URL in Vercel..."
vercel env add DATABASE_URL << EOF
$DATABASE_URL
a
EOF

if [ $? -eq 0 ]; then
    echo "✅ DATABASE_URL added to Vercel"
else
    echo "❌ Failed to add DATABASE_URL"
    exit 1
fi

echo ""
echo "🚀 Deploying to Vercel with new database..."
vercel deploy --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "╭──────────────────────────────────────────╮"
    echo "│  ✅ Deployment Complete!                 │"
    echo "├──────────────────────────────────────────┤"
    echo "│  • DATABASE_URL configured               │"
    echo "│  • Prisma migrations running on deploy   │"
    echo "│  • Admin CMS ready                       │"
    echo "╰──────────────────────────────────────────╯"
    echo ""
else
    echo "❌ Deployment failed"
    exit 1
fi
