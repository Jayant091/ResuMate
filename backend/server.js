import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

// ✅ Load environment variables
dotenv.config();

// ✅ Debug environment variable loading
console.log('🔍 Environment variables check:');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Not set');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Not set');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✅ Set' : '❌ Not set');

// ✅ Connect to MongoDB
connectDB();

// ✅ Initialize Express app
const app = express();

// ✅ Port (Render provides it automatically)
const PORT = process.env.PORT || 5000;

// ✅ Allowed frontend URLs (CORS)
const allowedOrigins = new Set([
  'https://resu-mate-nu.vercel.app',   // your deployed frontend
  'https://resu-mate.vercel.app',      // optional alternate
  'http://localhost:5173',             // local dev
  'https://resumate-4wr1.onrender.com' // backend domain (for internal use)
]);

// ✅ CORS setup
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
      } else {
        console.warn(`❌ CORS blocked request from: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// ✅ Body parser
app.use(express.json({ limit: '2mb' }));

// ✅ Health check route
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'resumate-backend' });
});

// ✅ Import routes
import authRouter from './routes/authRoutes.js';
import resumeRouter from './routes/resumeRoutes.js';
import aiRouter from './routes/aiRoutes.js';

// ✅ Use routes
app.use('/api/auth', authRouter);
app.use('/api/resumes', resumeRouter);
app.use('/api', aiRouter);

// ✅ Handle undefined routes gracefully
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.originalUrl });
});

// ✅ Global error handler (for debugging)
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.message);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 ResuMate backend running on port ${PORT}`);
});
