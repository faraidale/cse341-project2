const express = require('express');
const mongodb = require('./db/connect');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json'); // We will generate this file in the next step!
const session = require('express-session');
const passport = require('./auth');

const app = express();
const port = process.env.PORT || 8080;

app.set('trust proxy', 1);

// Middleware for parsing JSON bodies
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'local-development-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  }
}));
app.use(passport.initialize());
app.use(passport.session());

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