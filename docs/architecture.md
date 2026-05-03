# AidChain Architecture

## Overview

AidChain uses a three-layer architecture:

1. **Stellar Network** — settlement layer (claimable balances, USDC transfers)
2. **Soroban Contracts** — programmable conditions (oracle + escrow)
3. **Backend API** — off-chain coordination, database, notifications

## Contract Interaction Flow

```
Field Officer
    │
    ▼
POST /api/conditions/fulfill
    │
    ├─► PostgreSQL: mark condition fulfilled
    │
    └─► oracle.fulfill_condition() [Soroban RPC]
            │
            ▼
        escrow.release_funds() [triggered by backend]
            │
            ▼
        Beneficiary receives USDC
```

## Data Flow

See README.md for the full system architecture diagram.

## Open Questions for Contributors

- Should escrow release be triggered automatically by the oracle event, or explicitly by the backend?
- How should we handle partial condition fulfillment (e.g., 3 of 5 school visits)?
- ZK proof integration for privacy-preserving condition verification (roadmap item)
