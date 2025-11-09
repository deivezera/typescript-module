import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';

/**
 * Create Express application
 */
const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.use('/api/auth', authRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;

