#!/usr/bin/env bash
# Deploy Soroban contracts to testnet
# Requires: stellar CLI, NGO_SECRET_KEY env var

set -e

cd "$(dirname "$0")/../contracts"

echo "Building contracts..."
make build

echo "Deploying oracle contract..."
ORACLE_ID=$(stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/oracle.wasm \
  --source-account "$NGO_SECRET_KEY" \
  --network testnet)
echo "ORACLE_CONTRACT_ID=$ORACLE_ID"

echo "Deploying escrow contract..."
ESCROW_ID=$(stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/escrow.wasm \
  --source-account "$NGO_SECRET_KEY" \
  --network testnet)
echo "ESCROW_CONTRACT_ID=$ESCROW_ID"

echo ""
echo "Add these to your .env:"
echo "ORACLE_CONTRACT_ID=$ORACLE_ID"
echo "ESCROW_CONTRACT_ID=$ESCROW_ID"
