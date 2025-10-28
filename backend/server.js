import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

// Load environment variables
dotenv.config();

// Debug: Check if environment variables are loaded
console.log('Environment variables check:');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Set' : 'Not set');

// Connect to MongoDB
connectDB();

// Config
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// App
const app = express();

// Middleware
app.use(cors({ origin: ["https://resu-mate-nu.vercel.app", "http://localhost:5173"], credentials: true }));
app.use(express.json({ limit: '2mb' }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'resumate-backend' });
});

// Routes
import authRouter from './routes/authRoutes.js';
import resumeRouter from './routes/resumeRoutes.js';
import aiRouter from './routes/aiRoutes.js';

app.use('/api/auth', authRouter);
app.use('/api/resumes', resumeRouter);
app.use('/api', aiRouter);

// Start server
app.listen(PORT, () => {
  console.log(`ResuMate backend listening on port ${PORT}`);
});



