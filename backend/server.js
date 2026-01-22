const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');

const Customer = require('./src/models/Customer');
const Bill = require('./src/models/Bill');
const Expense = require('./src/models/Expense');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// ------------------- CUSTOMER ROUTES -------------------

// GET all customers
app.get('/api/customers', async (req, res) => {
  const customers = await Customer.find();
  res.json(customers);
});

// GET single customer by ID
app.get('/api/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ------------------- BILL ROUTES -------------------

// GET all bills for a customer
app.get('/api/bills/customer/:customerId', async (req, res) => {
  try {
    const bills = await Bill.find({ customer: req.params.customerId });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ------------------- ANALYTICS -------------------
app.get('/api/stats', async (req, res) => {
  try {
    const totalRevenue = await Bill.aggregate([
      { $group: { _id: null, revenue: { $sum: "$paidAmount" } } }
    ]);

    const totalPending = await Customer.aggregate([
      { $group: { _id: null, pending: { $sum: "$totalDue" } } }
    ]);

    const totalExpenses = await Expense.aggregate([
      { $group: { _id: "$category", total: { $sum: "$amount" } } }
    ]);

    res.json({
      revenue: totalRevenue[0]?.revenue || 0,
      pending: totalPending[0]?.pending || 0,
      expensesByCategory: totalExpenses
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ------------------- START SERVER -------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


