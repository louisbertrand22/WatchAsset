import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

// Extend Request interface to include userId
interface AuthenticatedRequest extends Request {
  userId?: string;
}

// Middleware to extract and validate user ID from Authorization header
const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
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
  (req as AuthenticatedRequest).userId = 'mock-user-id';
  next();
};

interface UserWatch {
  id: string;
  userId: string;
  watchId: string;
  purchasePrice: number | null;
  purchaseDate: string | null;
  createdAt: string;
}

// Mock data storage (in production, this would use Prisma with database)
const mockUserWatches: UserWatch[] = [];

// GET /user-watches - Get all watches for the authenticated user
router.get('/', authenticateUser, async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    
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
    const userId = (req as AuthenticatedRequest).userId;
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
    
    // Parse and validate purchase price
    let validatedPrice: number | null = null;
    if (purchasePrice !== undefined && purchasePrice !== null && purchasePrice !== '') {
      const parsed = parseFloat(purchasePrice);
      if (isNaN(parsed) || parsed < 0) {
        return res.status(400).json({ error: 'Prix d\'achat invalide' });
      }
      validatedPrice = parsed;
    }
    
    // Create new user watch
    const newUserWatch: UserWatch = {
      id: `user-watch-${Date.now()}`,
      userId: userId!,
      watchId,
      purchasePrice: validatedPrice,
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
    const userId = (req as AuthenticatedRequest).userId;
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
