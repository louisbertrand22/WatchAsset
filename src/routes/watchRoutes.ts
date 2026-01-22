import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /watches - Get all watches with their price history
router.get('/', async (req: Request, res: Response) => {
  try {
    const watches = await prisma.watch.findMany({
      include: {
        prices: {
          orderBy: {
            date: 'desc'
          }
        }
      },
      orderBy: {
        brand: 'asc'
      }
    });

    // Calculate current price and price change for each watch
    const watchesWithStats = watches.map(watch => {
      const prices = watch.prices;
      const currentPrice = prices.length > 0 && prices[0] ? prices[0].price : 0;
      const previousPrice = prices.length > 1 && prices[1] ? prices[1].price : currentPrice;
      const priceChange = currentPrice - previousPrice;
      const priceChangePercent = previousPrice > 0 ? (priceChange / previousPrice) * 100 : 0;

      return {
        ...watch,
        currentPrice,
        priceChange,
        priceChangePercent
      };
    });

    res.json(watchesWithStats);
  } catch (error) {
    console.error('Error fetching watches:', error);
    res.status(500).json({ error: 'Failed to fetch watches' });
  }
});

// GET /watches/:id - Get a single watch with full price history
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : undefined;
    if (!id) {
      return res.status(400).json({ error: 'Invalid watch ID' });
    }

    const watch = await prisma.watch.findUnique({
      where: { id },
      include: {
        prices: {
          orderBy: {
            date: 'asc'
          }
        }
      }
    });

    if (!watch) {
      return res.status(404).json({ error: 'Watch not found' });
    }

    res.json(watch);
  } catch (error) {
    console.error('Error fetching watch:', error);
    res.status(500).json({ error: 'Failed to fetch watch' });
  }
});

export default router;
