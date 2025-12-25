#!/bin/sh

# --- KONFIGURASI SULTAN ---
REPO_URL="https://github.com/cendikiawanstudios/dieHantar-frontend.git"
COMMIT_MSG="Update by Sultan - $(date +'%Y-%m-%d %H:%M:%S')"
BACKUP_DIR="/sdcard/Download"

echo "👑 [SULTAN DEPLOY ENGINE STARTING...]"

# 1. BUNGKUS ZIP (Backup Lokal)
echo "📦 Membungkus kado ZIP..."
zip -r dieHantar_Backup.zip . -x "node_modules/*" ".git/*" "deploy.sh"
cp dieHantar_Backup.zip $BACKUP_DIR/
echo "✅ Backup tersimpan di folder Download HP."

# 2. PUSH KE GITHUB
echo "🚀 Mengunggah ke GitHub..."
if [ ! -d ".git" ]; then
    git init
    git remote add origin $REPO_URL
fi

git add .
git commit -m "$COMMIT_MSG"
git branch -M main
git push -u origin main

echo "✨ [DEPLOY SELESAI! SEMUA BERES BEB!]"