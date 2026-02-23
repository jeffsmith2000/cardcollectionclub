#!/bin/bash
# CCC Deploy Script — auto commit + push + deploy
# Usage: ./deploy.sh "commit message"

set -e
cd "$(dirname "$0")"

MSG="${1:-Update site}"

echo "📦 Committing changes..."
git add -A
git commit -m "$MSG" || echo "Nothing to commit"

echo "🚀 Pushing to GitHub..."
git push origin main

echo "🌐 Deploying to Netlify..."
netlify deploy --prod --dir . --site eb131c0c-5b40-4666-bb91-decf30fd170e

echo "✅ Done! Live at https://cardcollectionclub.com"
