import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/beneficiary/:publicKey/balance
router.get('/:publicKey/balance', async (req, res) => {
  try {
    const { publicKey } = req.params;
    const beneficiary = await prisma.beneficiary.findUnique({
      where: { publicKey },
    });
    if (!beneficiary) return res.status(404).json({ error: 'Beneficiary not found' });

    // TODO: Also fetch live claimable balance from Stellar Horizon
    res.json({
      allocatedAmount: beneficiary.allocatedAmount,
      claimedAmount: beneficiary.claimedAmount,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});

// GET /api/beneficiary/:publicKey/history
router.get('/:publicKey/history', async (req, res) => {
  try {
    const { publicKey } = req.params;
    const beneficiary = await prisma.beneficiary.findUnique({
      where: { publicKey },
      include: { conditions: true },
    });
    if (!beneficiary) return res.status(404).json({ error: 'Beneficiary not found' });
    res.json(beneficiary.conditions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// TODO: POST /:publicKey/claim - Trigger claimable balance claim on Stellar

export default router;
