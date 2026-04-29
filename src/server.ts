import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import prisma from './config/prisma';
import redis from './config/redis';
import postRoutes from './routes/post.routes';
import authRoutes from './routes/auth.routes';
import mediaRoutes from './routes/media.routes';
import userRoutes from './routes/user.routes';
import categoryRoutes from './routes/category.routes';
import questionRoutes from './routes/question.routes';
import notificationRoutes from './routes/notification.routes';
import { logRequest } from './middleware/log.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

app.use(logRequest);
app.use(helmet());

// 2. Rate limit: 100 requests / 15 phút / IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: { message: 'Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau 15 phút' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// 3. CORS chỉ cho phép domain frontend
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(cors({
  origin: frontendUrl,
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/media', mediaRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/questions', questionRoutes);
app.use('/api/v1/notifications', notificationRoutes);

// Health check route
app.get('/api/health', async (req: Request, res: Response) => {
  let dbStatus = 'OK';
  let redisStatus = 'OK';

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error: any) {
    console.error('Database health check failed:', error);
    dbStatus = 'ERROR';
  }

  try {
    const ping = await redis.ping();
    if (ping !== 'PONG') redisStatus = 'ERROR';
  } catch (error) {
    redisStatus = 'ERROR';
  }

  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    services: {
      database: dbStatus,
      redis: redisStatus
    }
  });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Secure Server is running on port ${PORT}`);
});

export default app;
