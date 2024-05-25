const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./auth-services/routes/userRoutes');
const { pool } = require('./auth-services/config/database');

const app = express();
app.use(bodyParser.json());
app.use('/api/auth', userRoutes);

const PORT = process.env.PORT || 3002;

pool.connect((err) => {
  if (err) {
    console.error('Connection error', err.stack);
  } else {
    console.log('Connected to database');
    app.listen(PORT, () => console.log(`http listening on port http://localhost:${PORT}`));
  }
});
