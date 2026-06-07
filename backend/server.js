const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');

// Import models
const Customer = require('./src/models/Customer');
const Bill = require('./src/models/Bill');
const Expense = require('./src/models/Expense');
const VendorProfile = require('./src/models/VendorProfile');

// Import routes
const vendorRoutes = require('./src/routes/vendorRoutes');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------- HOME ROUTE -------------------
app.get('/', (req, res) => {
  res.json({
    message: 'Street Vendor Digitalization Agent API',
    version: '1.0.0',
    services: [
      'Vendor Profiles',
      'AI Agent Chat',
      'Knowledge Base',
      'Geolocation Insights',
      'Multi-Language Support'
    ],
    endpoints: {
      vendor: '/api/vendor',
      agent: '/api/agent',
      customers: '/api/customers',
      bills: '/api/bills'
    }
  });
});

// ------------------- VENDOR ROUTES -------------------
app.use('/api/vendor', vendorRoutes);

// ------------------- CUSTOMER ROUTES -------------------
app.get('/api/customers', async (req, res) => {
  const customers = await Customer.find();
  res.json(customers);
});

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

// ------------------- ERROR HANDLER -------------------
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// ------------------- START SERVER -------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n✅ Server running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🤖 Vendor Agent API: http://localhost:${PORT}/api/vendor`);
});


