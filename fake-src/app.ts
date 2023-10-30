import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors'
const corsOptions = {
  origin: true, // Add other allowed origins as needed
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200, // Set the appropriate success status for preflight requests
};

// Enable CORS for all routes or for specific routes as needed
import express from 'express';
import { authRouter } from './routes/auth';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors(corsOptions));
// Middleware to parse JSON requests
app.use(express.json());

// Use the defined router
app.use('/auth', authRouter);

// Start the Express server
app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
