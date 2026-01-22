import express, { Request, Response } from 'express';

const router = express.Router();

// Mock data for demonstration
const mockWatches = [
  {
    id: 'watch1',
    brand: 'Rolex',
    model: 'Submariner Date',
    reference: '126610LN',
    imageUrl: 'https://images.rolex.com/submariner_126610ln.jpg',
    createdAt: new Date(),
    prices: [
      { id: 'price3', watchId: 'watch1', price: 14850, source: 'Chrono24', date: '2026-01-10' },
      { id: 'price2', watchId: 'watch1', price: 14200, source: 'Chrono24', date: '2025-09-15' },
      { id: 'price1', watchId: 'watch1', price: 13500, source: 'Chrono24', date: '2025-06-01' },
    ],
    currentPrice: 14850,
    priceChange: 650,
    priceChangePercent: 4.58
  },
  {
    id: 'watch2',
    brand: 'Patek Philippe',
    model: 'Nautilus Blue Dial',
    reference: '5711/1A-010',
    imageUrl: 'https://patek.com/nautilus_5711.jpg',
    createdAt: new Date(),
    prices: [
      { id: 'price6', watchId: 'watch2', price: 122000, source: 'Collector Square', date: '2026-01-15' },
      { id: 'price5', watchId: 'watch2', price: 115000, source: 'Collector Square', date: '2025-11-20' },
      { id: 'price4', watchId: 'watch2', price: 110000, source: 'Collector Square', date: '2025-05-01' },
    ],
    currentPrice: 122000,
    priceChange: 7000,
    priceChangePercent: 6.09
  },
  {
    id: 'watch3',
    brand: 'Audemars Piguet',
    model: 'Royal Oak Selfwinding',
    reference: '15500ST',
    imageUrl: 'https://audemarspiguet.com/royaloak.jpg',
    createdAt: new Date(),
    prices: [
      { id: 'price9', watchId: 'watch3', price: 44000, source: 'eBay Luxury', date: '2026-01-05' },
      { id: 'price8', watchId: 'watch3', price: 41500, source: 'eBay Luxury', date: '2025-10-01' },
      { id: 'price7', watchId: 'watch3', price: 42000, source: 'eBay Luxury', date: '2025-07-01' },
    ],
    currentPrice: 44000,
    priceChange: 2500,
    priceChangePercent: 6.02
  }
];

// GET /watches - Get all watches with their price history
router.get('/', async (req: Request, res: Response) => {
  try {
    // Return mock data
    res.json(mockWatches);
  } catch (error) {
    console.error('Error fetching watches:', error);
    res.status(500).json({ error: 'Failed to fetch watches' });
  }
});

// GET /watches/:id - Get a single watch with full price history
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const watch = mockWatches.find(w => w.id === id);

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
