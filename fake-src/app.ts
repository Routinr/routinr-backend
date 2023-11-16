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

const app = express();
const port = process.env.PORT || 3000;
// Enable CORS for all routes or for specific routes as needed

import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import * as swaggerDocument from './config/swagger.json';  // Adjust the path accordingly

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Routinr API',
      description: 'API documentation for the Routinr backend',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3000', // Adjust the URL as needed
        description: 'Development server',
      },
      {
        url: 'https://routinr-backend.onrender.com', // Adjust the URL as needed
        description: 'Production server',
      },
    ],
  },
  apis: [`${__dirname}/routes/*.js`], // Adjust the path pattern to match your route files
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(cors());
// Middleware to parse JSON requests
app.use(express.json());

// Use the defined router
app.use('/auth', authRouter);
app.use('/routines', routinesRouter);

app.get('/', (req, res) => {
  res.redirect('/api-docs');
})

// Start the Express server
app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
