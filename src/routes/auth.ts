import { Router, Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();
const authService = new AuthService();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({
        error: 'Username, email, and password are required',
      });
      return;
    }

    const user = await authService.registerUser(username, email, password);

    const userObject = user.toObject();
    delete userObject.password;

    res.status(201).json({
      message: 'User registered successfully',
      user: userObject,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/auth/login
 * Login a user
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      res.status(400).json({
        error: 'Username/email and password are required',
      });
      return;
    }

    const { user, token } = await authService.loginUser(usernameOrEmail, password);

    const userObject = user.toObject();
    delete userObject.password;

    res.json({
      message: 'Login successful',
      user: userObject,
      token,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    const userObject = user.toObject();
    delete userObject.password;

    res.json({
      user: userObject,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

