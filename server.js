const express = require('express');
const mongodb = require('./db/connect');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json'); // We will generate this file in the next step!

const app = express();
const port = process.env.PORT || 8080;

// Middleware for parsing JSON bodies
app.use(express.json()); 

// Swagger UI Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API Routes
app.use('/', require('./routes'));

// Initialize database connection and start server
mongodb.initDb((err, mongodb) => {
  if (err) {
    console.log('Error connecting to the database:', err);
  } else {
    app.listen(port, () => {
      console.log(`Connected to DB and listening on port ${port}`);
    });
  }
});