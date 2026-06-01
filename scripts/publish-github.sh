#!/usr/bin/env bash
# Push updates to https://github.com/grizz6/grizgaj
set -euo pipefail
cd "$(dirname "$0")/.."

git remote set-url origin https://github.com/grizz6/grizgaj.git
git push origin main

echo "Repo: https://github.com/grizz6/grizgaj"
echo "Site: https://grizz6.github.io/grizgaj/"
