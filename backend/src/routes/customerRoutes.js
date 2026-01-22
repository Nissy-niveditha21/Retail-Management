const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const Bill = require('../models/Bill');

// GET all
router.get('/', async (req, res) => {
  const customers = await Customer.find();
  res.json(customers);
});

// POST create
router.post('/', async (req, res) => {
  const customer = new Customer(req.body);
  await customer.save();
  res.json(customer);
});

// PUT update
router.put('/:id', async (req, res) => {
  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(customer);
});

// DELETE customer + bills
router.delete('/:id', async (req, res) => {
  await Bill.deleteMany({ customer: req.params.id });
  await Customer.findByIdAndDelete(req.params.id);
  res.json({ message: 'Customer and bills deleted' });
});

module.exports = router;
