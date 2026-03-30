#!/bin/zsh
set -euo pipefail

ROOT_DIR="/Users/levvasilev/Documents/Codex/kartochka"
PROJECT_NAME="kartochka-local-sync"
PROJECT_ID="prj_ybbIo2hojGSYVvNQyVEUiI9qBg3x"
ORG_ID="team_Ij15tBri7fro3O5JkaSzM4uP"
SCOPE="levvasilev0330-8433s-projects"

cd "$ROOT_DIR"

set -a
[ -f .env ] && source .env
[ -f .env.local ] && source .env.local
set +a

tmpdir=$(mktemp -d /tmp/kartochka-local-sync.XXXXXX)

cleanup() {
  rm -rf "$tmpdir"
}
trap cleanup EXIT

rsync -a \
  --exclude ".git" \
  --exclude "node_modules" \
  --exclude ".env" \
  --exclude ".env.local" \
  --exclude ".DS_Store" \
  --exclude ".vercel/output" \
  --exclude "server/data/*.json" \
  "$ROOT_DIR"/ "$tmpdir"/

mkdir -p "$tmpdir/.vercel"
cat > "$tmpdir/.vercel/project.json" <<EOF
{
  "projectId": "$PROJECT_ID",
  "orgId": "$ORG_ID",
  "projectName": "$PROJECT_NAME"
}
EOF

cd "$tmpdir"

npx vercel build --prod --scope "$SCOPE"
npx vercel deploy --prebuilt --archive=tgz --prod --yes --scope "$SCOPE"
