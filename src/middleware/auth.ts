import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { IUser } from '../models/User';

/**
 * Extended Request interface to include user
 */
export interface AuthRequest extends Request {
  user?: IUser;
}

/**
 * Authentication middleware to verify JWT tokens
 */
export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    const authHeaderValue = Array.isArray(authHeader) ? authHeader[0] : authHeader;

    if (!authHeaderValue) {
      res.status(401).json({ error: 'Authentication token required' });
      return;
    }

    if (!authHeaderValue.startsWith('Bearer ')) {
      res.status(401).json({ 
        error: 'Invalid authorization header format. Use: Bearer <token>' 
      });
      return;
    }

    const token = authHeaderValue.substring(7).trim();

    if (!token) {
      res.status(401).json({ error: 'Authentication token is empty' });
      return;
    }

    const authService = new AuthService();
    const payload = authService.verifyToken(token);

    const user = await authService.getUserById(payload.userId);
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof Error) {
      console.error('Authentication error:', error.message);
      res.status(403).json({ error: error.message });
      return;
    }
    res.status(403).json({ error: 'Invalid token' });
  }
};

