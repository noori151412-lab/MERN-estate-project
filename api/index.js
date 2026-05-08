import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import { setServers } from 'node:dns/promises';

setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();

app.use(express.json());

mongoose.connect(process.env.DB)
  .then(() => console.log('✅ MongoDB Connected!'))
  .catch((err) => console.log('❌ MongoDB Error:', err));

  app.use("/api/user", userRouter);
  app.use('/api/auth', authRouter);

  app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
  
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });