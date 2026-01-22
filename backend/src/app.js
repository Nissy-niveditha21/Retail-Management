const dotenv = require('dotenv');
dotenv.config(); // must be called before anything that uses process.env

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// DB Connection
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/bills', require('./routes/billRoutes'));

app.get('/', (req, res) => {
  res.send('Retail Management API Running');
});

module.exports = app;
