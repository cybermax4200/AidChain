## Contributing to AidChain

Thank you for your interest in contributing! AidChain is open to contributions from the community.

### What needs to be built

#### Contracts (50% remaining)
- `contracts/escrow/src/lib.rs` — Implement `initialize`, `lock_funds`, `release_funds`, `reclaim`
- `contracts/oracle/src/lib.rs` — Add `add_verifier`, `remove_verifier`, `get_condition_record`, `transfer_admin`
- Add comprehensive contract tests

#### Backend (50% remaining)
- `backend/src/services/oracle.ts` — Soroban RPC integration for on-chain condition recording
- `backend/src/routes/ngo.ts` — `POST /programs/:id/fund` (Stellar claimable balance creation)
- `backend/src/routes/beneficiary.ts` — `POST /:publicKey/claim` (claim claimable balance)
- `backend/src/routes/conditions.ts` — Fix upsert logic, add `@@unique` constraint to schema
- Auth middleware (JWT verification)
- `backend/prisma/schema.prisma` — Add `Transaction`, `FieldOfficer`, `Donor` models
- SMS notifications via Twilio

#### Frontend (10% remaining)
- `frontend/src/lib/api.ts` — JWT interceptor
- `frontend/src/pages/BeneficiaryPortal.tsx` — Claim button + SEP-24 off-ramp flow
- `frontend/src/pages/DonorTracker.tsx` — Per-beneficiary drill-down, CSV/PDF export
- Freighter wallet connection (`connectFreighter` in `BeneficiaryPortal.tsx`)
- Create program modal in `NGODashboard.tsx`

#### Field App
- `field-app/` — Offline-first PWA for field officers (React + service worker)

### Getting Started

1. Fork the repo
2. `cd backend && npm install && cp .env.example .env`
3. `cd frontend && npm install && cp .env.example .env`
4. `docker-compose up -d postgres`
5. `cd backend && npx prisma migrate dev`
6. `npm run dev` in both `backend/` and `frontend/`

### Pull Request Guidelines
- One feature per PR
- Include tests for backend routes
- For contract changes, run `cd contracts && cargo test`
- Reference the relevant TODO comment in your PR description
