import express from 'express';
import { authRouter } from './routes/auth';

const app = express();
const port = process.env.PORT || 3000;


// Middleware to parse JSON requests
app.use(express.json());

// Use the defined router
app.use('/auth', authRouter);

// Start the Express server
app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
