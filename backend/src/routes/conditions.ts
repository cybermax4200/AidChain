import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// POST /api/conditions/fulfill
router.post('/fulfill', async (req, res) => {
  try {
    const { programId, beneficiaryId, conditionType, evidenceHash, verifiedBy } = req.body;

    const condition = await prisma.condition.upsert({
      where: {
        // TODO: Add @@unique([programId, beneficiaryId, conditionType]) to schema
        id: req.body.id || '',
      },
      update: {
        isFulfilled: true,
        evidenceHash,
        verifiedBy,
        verifiedAt: new Date(),
      },
      create: {
        programId,
        beneficiaryId,
        conditionType,
        evidenceHash,
        verifiedBy,
        isFulfilled: true,
        verifiedAt: new Date(),
      },
    });

    // TODO: Invoke oracle Soroban contract to record on-chain
    // TODO: Trigger fund release if condition met

    res.json(condition);
  } catch (error) {
    res.status(500).json({ error: 'Failed to record condition fulfillment' });
  }
});

// GET /api/conditions/:programId/:beneficiaryId
router.get('/:programId/:beneficiaryId', async (req, res) => {
  try {
    const { programId, beneficiaryId } = req.params;
    const conditions = await prisma.condition.findMany({
      where: { programId, beneficiaryId },
    });
    res.json(conditions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch conditions' });
  }
});

// GET /api/conditions/pending
router.get('/pending', async (_req, res) => {
  try {
    const pending = await prisma.condition.findMany({
      where: { isFulfilled: false },
      include: { beneficiary: true, program: true },
    });
    res.json(pending);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pending conditions' });
  }
});

export default router;

// NOTE for contributors: mount /pending before /:programId/:beneficiaryId in Express
// to avoid Express treating "pending" as a programId param.
// In index.ts, ensure conditionRoutes are registered correctly.
