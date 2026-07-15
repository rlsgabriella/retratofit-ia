import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Sincroniza ou cria o usuário Clerk no banco local
router.post('/sync', async (req, res, next) => {
  try {
    const { userId } = req.auth;
    const { email, nome } = req.body;

    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: { email, nome },
      create: { clerkId: userId, email, nome },
    });

    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.get('/me', async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { clerkId: req.auth.userId } });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

export default router;
