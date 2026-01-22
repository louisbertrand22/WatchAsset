import express, { Request, Response } from 'express';

const router = express.Router();

// Middleware to extract and validate user ID from Authorization header
const authenticateUser = (req: Request, res: Response, next: any) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token d\'accès manquant ou invalide' });
  }
  
  const accessToken = authHeader.substring(7).trim();
  
  if (!accessToken) {
    return res.status(401).json({ error: 'Token d\'accès vide' });
  }
  
  // In a real implementation, we would validate the JWT token here
  // and extract the user ID (sub) from it
  // For now, we'll use a mock user ID
  // @ts-ignore
  req.userId = 'mock-user-id';
  next();
};

// Mock data storage (in production, this would use Prisma with database)
const mockUserWatches: any[] = [];

// GET /user-watches - Get all watches for the authenticated user
router.get('/', authenticateUser, async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.userId;
    
    // Filter user watches by userId and return with watch details
    const userWatches = mockUserWatches.filter(uw => uw.userId === userId);
    
    res.json(userWatches);
  } catch (error) {
    console.error('Error fetching user watches:', error);
    res.status(500).json({ error: 'Failed to fetch user watches' });
  }
});

// POST /user-watches - Add a watch to user's collection
router.post('/', authenticateUser, async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.userId;
    const { watchId, purchasePrice, purchaseDate } = req.body;
    
    if (!watchId) {
      return res.status(400).json({ error: 'watchId is required' });
    }
    
    // Check if user already has this watch
    const existingWatch = mockUserWatches.find(
      uw => uw.userId === userId && uw.watchId === watchId
    );
    
    if (existingWatch) {
      return res.status(400).json({ error: 'Cette montre est déjà dans votre collection' });
    }
    
    // Create new user watch
    const newUserWatch = {
      id: `user-watch-${Date.now()}`,
      userId,
      watchId,
      purchasePrice: purchasePrice ? parseFloat(purchasePrice) : null,
      purchaseDate: purchaseDate || null,
      createdAt: new Date().toISOString()
    };
    
    mockUserWatches.push(newUserWatch);
    
    res.status(201).json(newUserWatch);
  } catch (error) {
    console.error('Error adding user watch:', error);
    res.status(500).json({ error: 'Failed to add watch to collection' });
  }
});

// DELETE /user-watches/:id - Remove a watch from user's collection
router.delete('/:id', authenticateUser, async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.userId;
    const { id } = req.params;
    
    const index = mockUserWatches.findIndex(
      uw => uw.id === id && uw.userId === userId
    );
    
    if (index === -1) {
      return res.status(404).json({ error: 'Watch not found in your collection' });
    }
    
    mockUserWatches.splice(index, 1);
    
    res.status(204).send();
  } catch (error) {
    console.error('Error removing user watch:', error);
    res.status(500).json({ error: 'Failed to remove watch from collection' });
  }
});

export default router;
