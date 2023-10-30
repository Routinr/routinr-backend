import express, { Express } from 'express';
import { Router } from 'express';
import { authRouter } from './routes/auth';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port: number = parseInt(process.env.PORT as string, 10) || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Use the defined router
app.use('/auth', authRouter);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the Express server
app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
