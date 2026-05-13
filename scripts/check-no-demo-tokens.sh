#!/usr/bin/env bash
set -e

PATTERNS=(
  "DEMO_TOKEN_FOR_TEST_ONLY"
  "type=preview"
  "sk_live_[a-zA-Z0-9]"
  "ghp_[a-zA-Z0-9]{36}"
  "AKIA[0-9A-Z]{16}"
  "AIza[0-9A-Za-z_-]{35}"
)

FILES=$(git diff --cached --name-only --diff-filter=ACM 2>/dev/null)
if [ -z "$FILES" ]; then
  FILES=$(git ls-files)
fi

FOUND=0

for pattern in "${PATTERNS[@]}"; do
  matches=$(echo "$FILES" | xargs grep -lE "$pattern" 2>/dev/null | grep -v "scripts/check-no-demo-tokens.sh" || true)
  if [ -n "$matches" ]; then
    echo "⚠️  Pattern '$pattern' found in:"
    echo "$matches" | sed 's/^/    /'
    FOUND=1
  fi
done

if [ "$FOUND" -eq 1 ]; then
  echo "❌ Demo tokens or secrets detected. Blocked."
  exit 1
fi

echo "✅ No demo tokens or secrets found."
