const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'EICE API',
    description: 'Elpo Interview Coaching Experts API - Candidates and Questions'
  },
  host: 'localhost:8080',
  schemes: ['http', 'https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// Generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);