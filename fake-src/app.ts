import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors'

const corsOptions = {
  origin: '*', // Add other allowed origins as needed
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200, // Set the appropriate success status for preflight requests
};

import express from 'express';
import { authRouter } from './routes/auth';
import { routinesRouter } from './routes/routines';
import { taskRouter } from './routes/tasks';

const app = express();
const port = process.env.PORT || 3000;
// Enable CORS for all routes or for specific routes as needed

import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './config/swagger.json';  // Adjust the path accordingly
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(cors());
// Middleware to parse JSON requests
app.use(express.json());

// Use the defined router
app.use('/auth', authRouter);
app.use('/routines', routinesRouter);
app.use('/tasks', taskRouter);


app.get('/', (req, res) => {
  res.redirect('/api-docs');
})

// Start the Express server
app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
