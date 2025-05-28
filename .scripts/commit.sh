#!/bin/sh
set -e

touch .gitcommit.md
touch .releasenotes.md

commitmsg="[$(date +%Y-%m-%d)] $(cat .gitcommit.md)"

echo "commit msg = ${commitmsg}"

git commit -m "${commitmsg}"

echo "
---

${commitmsg}" >> .releasenotes.md

echo "

Details:
- " > .gitcommit.md
