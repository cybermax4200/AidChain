# AidChain — Conditional Cash Transfers on Stellar

> A decentralized aid disbursement platform enabling NGOs to distribute funds to beneficiaries with verifiable, on-chain conditions — powered by the Stellar network and Soroban smart contracts.

---

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Solution](#solution)
- [System Architecture](#system-architecture)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [Smart Contracts (Soroban)](#smart-contracts-soroban)
  - [Condition Oracle Contract](#condition-oracle-contract)
  - [Escrow Contract](#escrow-contract)
  - [Deploying Contracts](#deploying-contracts)
- [Stellar Primitives Used](#stellar-primitives-used)
  - [Claimable Balances](#claimable-balances)
  - [Custom Assets](#custom-assets)
  - [Multisig Accounts](#multisig-accounts)
- [API Reference](#api-reference)
  - [NGO Endpoints](#ngo-endpoints)
  - [Beneficiary Endpoints](#beneficiary-endpoints)
  - [Condition Endpoints](#condition-endpoints)
- [Wallet Integration](#wallet-integration)
- [Off-Ramp (Mobile Money)](#off-ramp-mobile-money)
- [Security Model](#security-model)
- [Audit Trail](#audit-trail)
- [Testing](#testing)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**AidChain** is an open-source platform that enables NGOs and humanitarian organizations to disburse conditional cash transfers (CCTs) to beneficiaries using the Stellar blockchain. Aid funds are locked in escrow and released only when real-world conditions — such as school attendance, health checkups, or job training completion — are verified and recorded on-chain.

Every transaction is transparent, auditable, and settled in seconds at near-zero cost.

---

## Problem Statement

Traditional aid distribution systems suffer from:

- **Leakage & corruption** — Funds are siphoned before reaching intended recipients
- **Lack of accountability** — Donors cannot verify how or whether funds were used
- **High intermediary fees** — Banks and remittance providers consume 5–15% of transfers
- **Exclusion of the unbanked** — ~1.4 billion adults globally lack bank accounts
- **No conditionality enforcement** — Cash grants lack programmatic controls to drive behavior change (school enrollment, vaccinations, etc.)

---

## Solution

AidChain solves these problems by:

1. **Escrow-first disbursement** — Funds are locked on-chain and only released when conditions are met
2. **Verifiable conditions** — Field officers or oracles write condition fulfillment proofs on-chain via Soroban contracts
3. **Transparent audit trail** — Every fund movement is recorded immutably on the Stellar ledger
4. **Near-zero fees** — Stellar transactions cost ~$0.00001, compared to 5–15% for wire transfers
5. **Mobile-first wallets** — Beneficiaries access funds via lightweight wallets, including feature phone support
6. **Local off-ramps** — Integration with mobile money providers (M-Pesa, MTN MoMo) for local cash-out

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        NGO Dashboard                        │
│         (Create programs, fund escrow, view reports)        │
└────────────────────────────┬────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   Backend API   │
                    │  (Node.js/Express│
                    └────────┬────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
 ┌────────▼────────┐ ┌───────▼───────┐ ┌───────▼───────┐
 │ Stellar Network │ │    Soroban    │ │   PostgreSQL  │
 │                 │ │   Contracts   │ │   (off-chain  │
 │ • Claimable Bal │ │               │ │    records)   │
 │ • USDC transfers│ │ • Oracle      │ └───────────────┘
 │ • Multisig acct │ │ • Escrow      │
 └────────┬────────┘ └───────┬───────┘
          │                  │
          └──────────────────┘
                    │
         ┌──────────▼──────────┐
         │  Beneficiary Wallet │
         │  (Freighter / LOBSTR│
         │   / Custodial PIN)  │
         └──────────┬──────────┘
                    │
         ┌──────────▼──────────┐
         │  Mobile Money       │
         │  Off-Ramp (SEP-24)  │
         │  M-Pesa / MTN MoMo  │
         └─────────────────────┘
```

### Flow Summary

1. NGO creates an aid program and funds an escrow account with USDC
2. Beneficiaries are enrolled with their Stellar public keys
3. Conditions are defined (time-based, oracle-verified, or admin-approved)
4. Field officers record condition fulfillment via the dashboard or mobile app
5. Oracle/Soroban contract validates and triggers fund release
6. Beneficiary claims their USDC via claimable balance
7. Beneficiary off-ramps to mobile money or spends at authorized merchants

---

## Key Features

- **Condition templates** — Predefined condition types: school attendance, health visits, job training, time-based, custom
- **Multi-tier approval** — M-of-N multisig for large disbursements requiring multiple NGO signers
- **Batch disbursement** — Enroll and fund hundreds of beneficiaries in a single transaction batch
- **Real-time dashboard** — NGOs see live fund status, condition completion rates, and disbursement history
- **SMS notifications** — Beneficiaries receive SMS alerts when funds are available for claim
- **Donor transparency portal** — Donors can track exactly how their contributions are used, down to the beneficiary level
- **Offline-first field app** — Field officers can record condition verifications offline, syncing when connected
- **Audit export** — Full transaction logs exportable as CSV or PDF for compliance reporting

---

## Tech Stack

| Layer | Technology |
|---|---|
| Blockchain | Stellar (Mainnet / Testnet) |
| Smart Contracts | Soroban (Rust) |
| Backend | Node.js, Express, TypeScript |
| Stellar SDK | `@stellar/stellar-sdk` |
| Database | PostgreSQL + Prisma ORM |
| Frontend | React, TypeScript, Tailwind CSS |
| Wallet | Freighter SDK, LOBSTR |
| Stablecoin | USDC (Circle, native on Stellar) |
| Off-ramp | Stellar Anchor (SEP-6 / SEP-24) |
| Auth | JWT + role-based access control |
| Notifications | Twilio SMS |
| DevOps | Docker, GitHub Actions |

---

## Project Structure

```
aidchain/
├── contracts/                  # Soroban smart contracts (Rust)
│   ├── oracle/                 # Condition oracle contract
│   │   ├── src/lib.rs
│   │   └── Cargo.toml
│   ├── escrow/                 # Escrow & release contract
│   │   ├── src/lib.rs
│   │   └── Cargo.toml
│   └── Makefile
├── backend/                    # Node.js API server
│   ├── src/
│   │   ├── routes/
│   │   │   ├── ngo.ts
│   │   │   ├── beneficiary.ts
│   │   │   └── conditions.ts
│   │   ├── services/
│   │   │   ├── stellar.ts      # Stellar SDK wrappers
│   │   │   ├── escrow.ts       # Claimable balance logic
│   │   │   └── oracle.ts       # Condition verification
│   │   ├── middleware/
│   │   └── index.ts
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
├── frontend/                   # React dashboard
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── NGODashboard.tsx
│   │   │   ├── BeneficiaryPortal.tsx
│   │   │   └── DonorTracker.tsx
│   │   └── App.tsx
│   └── package.json
├── field-app/                  # Offline-first field officer PWA
├── docs/                       # Architecture diagrams, API docs
├── scripts/                    # Deployment and utility scripts
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js >= 18.x
- Rust + `cargo` (for Soroban contracts)
- Docker + Docker Compose
- Stellar CLI (`stellar`)
- A funded Stellar Testnet account ([Friendbot](https://friendbot.stellar.org))

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/aidchain.git
cd aidchain

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install

# Install Stellar CLI (if not already installed)
cargo install --locked stellar-cli --features opt
```

### Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

```env
# Stellar Network
STELLAR_NETWORK=testnet                          # or 'mainnet'
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
STELLAR_RPC_URL=https://soroban-testnet.stellar.org

# NGO Master Account
NGO_PUBLIC_KEY=G...
NGO_SECRET_KEY=S...

# USDC Asset (Testnet)
USDC_ISSUER=GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5

# Soroban Contract IDs (set after deployment)
ORACLE_CONTRACT_ID=
ESCROW_CONTRACT_ID=

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/aidchain

# Auth
JWT_SECRET=your-secret-key

# Twilio (SMS notifications)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

### Running Locally

```bash
# Start PostgreSQL
docker-compose up -d postgres

# Run database migrations
cd backend && npx prisma migrate dev

# Start the backend API
npm run dev

# In a new terminal, start the frontend
cd ../frontend && npm run dev
```

The API will be available at `http://localhost:3001` and the dashboard at `http://localhost:3000`.

---

## Smart Contracts (Soroban)

### Condition Oracle Contract

The oracle contract stores condition fulfillment records written by authorized field officers. When a condition is met, it emits an event that triggers fund release.

```rust
// contracts/oracle/src/lib.rs

#[contractimpl]
impl OracleContract {
    /// Initialize the contract with authorized verifiers
    pub fn initialize(env: Env, admin: Address, verifiers: Vec<Address>) { ... }

    /// Record a condition as fulfilled for a beneficiary
    pub fn fulfill_condition(
        env: Env,
        verifier: Address,
        beneficiary: Address,
        program_id: Symbol,
        condition_type: Symbol,
        evidence_hash: BytesN<32>,  // IPFS hash of supporting evidence
    ) -> bool { ... }

    /// Check if a beneficiary's condition is met
    pub fn is_condition_met(
        env: Env,
        beneficiary: Address,
        program_id: Symbol,
    ) -> bool { ... }
}
```

### Escrow Contract

Manages fund locking and conditional release. Integrates with the oracle contract.

```rust
// contracts/escrow/src/lib.rs

#[contractimpl]
impl EscrowContract {
    /// Lock funds for a beneficiary with a condition
    pub fn lock_funds(
        env: Env,
        ngo: Address,
        beneficiary: Address,
        amount: i128,
        program_id: Symbol,
        oracle_contract: Address,
    ) { ... }

    /// Release funds after condition is verified
    pub fn release_funds(
        env: Env,
        beneficiary: Address,
        program_id: Symbol,
    ) -> i128 { ... }

    /// Reclaim unclaimed funds after expiry (NGO only)
    pub fn reclaim(env: Env, ngo: Address, program_id: Symbol) { ... }
}
```

### Deploying Contracts

```bash
# Build contracts
cd contracts && make build

# Deploy to testnet
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/oracle.wasm \
  --source-account $NGO_SECRET_KEY \
  --network testnet

# Copy the returned contract ID to your .env as ORACLE_CONTRACT_ID
# Repeat for escrow contract
```

---

## Stellar Primitives Used

### Claimable Balances

Used for simple time-based or admin-approved transfers. The NGO creates a claimable balance; the beneficiary claims it once conditions are met.

```javascript
import { Claimant, Asset, Operation, TransactionBuilder } from '@stellar/stellar-sdk';

const createAidBalance = async (beneficiaryPublicKey, amount, unlockTimestamp) => {
  const claimants = [
    new Claimant(
      beneficiaryPublicKey,
      Claimant.predicateNot(
        Claimant.predicateBeforeAbsoluteTime(unlockTimestamp.toString())
      )
    ),
    // NGO can reclaim if unclaimed after 90 days
    new Claimant(
      NGO_PUBLIC_KEY,
      Claimant.predicateBeforeRelativeTime('7776000')
    )
  ];

  const op = Operation.createClaimableBalance({
    asset: new Asset('USDC', USDC_ISSUER),
    amount: amount.toString(),
    claimants,
  });

  // Build and submit transaction...
};
```

### Custom Assets

Issue program-specific tokens (e.g., `AIDFOOD`, `AIDHEALTH`) for targeted disbursements redeemable only at authorized vendors.

```javascript
// Issue a custom aid token
const issueAidToken = async (assetCode, recipientKey, amount) => {
  const aidAsset = new Asset(assetCode, NGO_PUBLIC_KEY);
  // Establish trustline, then payment operation...
};
```

### Multisig Accounts

NGO escrow accounts require M-of-N signatures for large disbursements:

```javascript
// Set account to require 2-of-3 signers
const setMultisig = Operation.setOptions({
  masterWeight: 1,
  lowThreshold: 2,
  medThreshold: 2,
  highThreshold: 3,
  signer: { ed25519PublicKey: cosignerPublicKey, weight: 1 },
});
```

---

## API Reference

### NGO Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/ngo/programs` | Create a new aid program |
| `GET` | `/api/ngo/programs` | List all programs |
| `POST` | `/api/ngo/programs/:id/fund` | Fund escrow for a program |
| `POST` | `/api/ngo/beneficiaries` | Enroll a beneficiary |
| `GET` | `/api/ngo/beneficiaries` | List all beneficiaries |
| `GET` | `/api/ngo/reports` | Get disbursement reports |

### Beneficiary Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/beneficiary/:publicKey/balance` | Get claimable balance |
| `POST` | `/api/beneficiary/:publicKey/claim` | Claim available funds |
| `GET` | `/api/beneficiary/:publicKey/history` | Transaction history |

### Condition Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/conditions/fulfill` | Record condition fulfillment (field officer) |
| `GET` | `/api/conditions/:programId/:beneficiaryId` | Check condition status |
| `GET` | `/api/conditions/pending` | List pending verifications |

---

## Wallet Integration

**Freighter (Browser/Mobile)**
```javascript
import freighterApi from '@stellar/freighter-api';

const connectWallet = async () => {
  if (await freighterApi.isConnected()) {
    const publicKey = await freighterApi.getPublicKey();
    return publicKey;
  }
};
```

**Custodial PIN Wallet** (for feature phones / unbanked users)

For beneficiaries without smartphones, AidChain provides a custodial wallet accessible via USSD or SMS with a 6-digit PIN. Private keys are encrypted and stored server-side using envelope encryption (AES-256 + KMS).

---

## Off-Ramp (Mobile Money)

AidChain integrates with Stellar Anchors implementing **SEP-24** (interactive deposit/withdrawal) to enable beneficiaries to cash out to:

- **MTN Mobile Money** (Nigeria, Ghana, Uganda, Rwanda)
- **M-Pesa** (Kenya, Tanzania, Ethiopia)
- **Airtel Money** (Multiple African markets)

```javascript
// Initiate SEP-24 withdrawal
const initiateWithdrawal = async (anchorUrl, assetCode, amount) => {
  const toml = await StellarTomlResolver.resolve(anchorUrl);
  const transferServerUrl = toml.TRANSFER_SERVER_SEP0024;

  const response = await fetch(`${transferServerUrl}/transactions/withdraw/interactive`, {
    method: 'POST',
    body: JSON.stringify({ asset_code: assetCode, amount }),
  });

  const { url } = await response.json();
  // Redirect beneficiary to anchor's KYC/withdrawal UI
  window.open(url);
};
```

---

## Security Model

- **Multisig escrow** — No single party can unilaterally move funds
- **Oracle authorization** — Only whitelisted verifier addresses can fulfill conditions on-chain
- **Evidence hashing** — Condition fulfillment requires an IPFS content hash of supporting evidence (photos, forms, signatures)
- **Expiry & reclaim** — Unclaimed funds automatically become reclaimable by the NGO after a defined period, preventing permanent lockup
- **Role-based access** — NGO admins, field officers, auditors, and beneficiaries have distinct permission levels
- **KMS key management** — Custodial wallet keys encrypted with AWS KMS or HashiCorp Vault
- **Audit logging** — All administrative actions logged to immutable append-only store

---

## Audit Trail

Every disbursement generates a fully auditable chain of evidence:

```
Program Created        → Stellar tx hash + PostgreSQL record
Beneficiary Enrolled   → Stellar account creation tx
Funds Locked           → Claimable balance or Soroban escrow tx
Condition Verified     → Oracle contract invocation tx + IPFS evidence hash
Funds Released         → Soroban release or claimable balance claim tx
Off-ramp Initiated     → SEP-24 anchor tx
```

Donors can verify the entire chain for any beneficiary using the public **Donor Transparency Portal**, which resolves all hashes to human-readable records.

---

## Testing

```bash
# Run unit tests
cd backend && npm test

# Run integration tests against Stellar Testnet
npm run test:integration

# Test Soroban contracts
cd contracts && cargo test

# Run end-to-end tests
npm run test:e2e
```

---

## Deployment

```bash
# Build Docker images
docker-compose build

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d

# Run migrations in production
docker-compose exec backend npx prisma migrate deploy
```

For mainnet deployment, ensure:
- All Soroban contracts are audited before deployment
- NGO escrow accounts are set up with production multisig
- USDC issuer is Circle's mainnet address: `GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN`
- SEP-24 anchor integrations are tested end-to-end in staging

---

## Roadmap

- [x] Claimable balance disbursement
- [x] NGO dashboard (MVP)
- [x] Soroban oracle + escrow contracts
- [ ] Field officer mobile app (offline-first)
- [ ] SEP-24 mobile money off-ramp integration
- [ ] Donor transparency portal
- [ ] Multi-language support (French, Swahili, Hausa, Arabic)
- [ ] DAO governance for community-run programs
- [ ] ZK proof-based condition verification (privacy-preserving)
- [ ] Integration with national ID / biometric systems

---

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a PR.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

---

> Built with ❤️ to reduce poverty through transparent, accountable aid distribution on Stellar.

---

## Current Status

**v0.1.0 scaffold** — 20-day development sprint complete.

| Layer | Status |
|---|---|
| Oracle contract | ✅ 50% — initialize, fulfill, is_condition_met |
| Escrow contract | 🔲 0% — stubs only, open for contributors |
| Backend API | ✅ 50% — CRUD routes, Stellar service, Prisma schema |
| Frontend | ✅ 90% — NGO Dashboard, Beneficiary Portal, Donor Tracker |
| Field App | 🔲 scaffold only — open for contributors |

See [CONTRIBUTING.md](CONTRIBUTING.md) to pick up where we left off.
