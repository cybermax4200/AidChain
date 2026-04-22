import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// POST /api/ngo/programs
router.post('/programs', async (req, res) => {
  try {
    const { name, description, ngoId } = req.body;
    const program = await prisma.program.create({
      data: { name, description, ngoId },
    });
    res.status(201).json(program);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create program' });
  }
});

// GET /api/ngo/programs
router.get('/programs', async (_req, res) => {
  try {
    const programs = await prisma.program.findMany({
      include: { ngo: true, beneficiaries: true },
    });
    res.json(programs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch programs' });
  }
});

// POST /api/ngo/beneficiaries
router.post('/beneficiaries', async (req, res) => {
  try {
    const { publicKey, name, phoneNumber, programId, allocatedAmount } = req.body;
    const beneficiary = await prisma.beneficiary.create({
      data: { publicKey, name, phoneNumber, programId, allocatedAmount },
    });
    res.status(201).json(beneficiary);
  } catch (error) {
    res.status(500).json({ error: 'Failed to enroll beneficiary' });
  }
});

// GET /api/ngo/beneficiaries
router.get('/beneficiaries', async (_req, res) => {
  try {
    const beneficiaries = await prisma.beneficiary.findMany({
      include: { program: true },
    });
    res.json(beneficiaries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch beneficiaries' });
  }
});

// TODO: POST /programs/:id/fund - Fund escrow (Stellar claimable balance)
// TODO: GET /reports - Disbursement reports with aggregated stats

export default router;
