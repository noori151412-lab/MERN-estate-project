import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import { setServers } from 'node:dns/promises';
import listingRouter from './routes/listing.route.js';

setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173', 
    process.env.FRONTEND_URL 
  ].filter(Boolean), 
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

mongoose.connect(process.env.DB)
  .then(() => console.log('✅ MongoDB Connected!'))
  .catch((err) => console.log('❌ MongoDB Error:', err));

app.use("/api/user", userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
}

export default app;