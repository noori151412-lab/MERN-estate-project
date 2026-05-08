import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import { setServers } from 'node:dns/promises';

setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();

mongoose.connect(process.env.DB)
  .then(() => console.log('✅ MongoDB Connected!'))
  .catch((err) => console.log('❌ MongoDB Error:', err));

app.listen(3000, () => {
  console.log('Server is running on port 3000!');
});
