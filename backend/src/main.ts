import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './infrastructure/db/connect';
import authRoutes from './interfaces/routes/auth.route';
import noteRoutes from './interfaces/routes/note.route';

dotenv.config();

const app = express();

// === Middleware ===
app.use(cors({
  origin: ['https://note-app-kappa-nine.vercel.app'],
  credentials: true
}));
app.use(express.json());

// === Routes ===
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// === Health check ===
app.get('/', (req: Request, res: Response) => {
  res.send('Note Taking API is running...');
});

// === Global Error Handler (optional) ===
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// === MongoDB Connection ===
connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`🚀 Server running at http://localhost:${process.env.PORT}`);
  });
});
