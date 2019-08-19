const express = require('express');
const cors = require('cors');
const setupRoutes = require('./routes');
const morgan = require('morgan');

const app = express();

// Configuration and middleware:
const port = process.env.PORT || 5000;
// see: https://github.com/expressjs/cors
app.use(cors({ credentials: true }));
// enable parsing of JSON in POST request bodies
app.use(express.json());
// add logging
app.use(morgan('common'));

// Routes:
setupRoutes(app);

// Start server:
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Starting server on port ${port}...`));
}

module.exports = app;
