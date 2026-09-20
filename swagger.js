const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'EICE API',
    description: 'Elpo Interview Coaching Experts API - Candidates and Questions'
  },
  host: 'eice-api.onrender.com',
  schemes: ['https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// Generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);