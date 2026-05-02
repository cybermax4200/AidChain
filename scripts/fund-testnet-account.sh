#!/usr/bin/env bash
# Fund a Stellar testnet account using Friendbot
# Usage: ./scripts/fund-testnet-account.sh <PUBLIC_KEY>

set -e

PUBLIC_KEY="${1:?Usage: $0 <PUBLIC_KEY>}"

echo "Funding $PUBLIC_KEY via Friendbot..."
curl -s "https://friendbot.stellar.org?addr=${PUBLIC_KEY}" | python3 -m json.tool
echo "Done."
