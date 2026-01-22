const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');
const Customer = require('../models/Customer');

// GET all bills
router.get('/', async (req, res) => {
  const bills = await Bill.find().populate('customer');
  res.json(bills);
});

// POST create bill
router.post('/', async (req, res) => {
  const bill = new Bill(req.body);
  await bill.save();

  // Update customer totalDue
  const dueDiff = bill.totalAmount - bill.paidAmount;
  await Customer.findByIdAndUpdate(bill.customer, { $inc: { totalDue: dueDiff } });

  res.json(bill);
});

// PUT pay bill
router.put('/:id/pay', async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) return res.status(404).json({ message: 'Bill not found' });

    const { paidAmount } = req.body;
    bill.paidAmount += paidAmount;
    bill.status = bill.paidAmount >= bill.totalAmount ? 'PAID' : 'PENDING';
    await bill.save();

    const dueDiff = Math.min(paidAmount, bill.totalAmount - (bill.paidAmount - paidAmount));
    await Customer.findByIdAndUpdate(bill.customer, { $inc: { totalDue: -dueDiff } });

    res.json(bill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE bill
router.delete('/:id', async (req, res) => {
  const bill = await Bill.findById(req.params.id);
  if (!bill) return res.status(404).json({ message: 'Bill not found' });

  const dueDiff = bill.totalAmount - bill.paidAmount;
  await Customer.findByIdAndUpdate(bill.customer, { $inc: { totalDue: -dueDiff } });
  await Bill.findByIdAndDelete(req.params.id);
  res.json({ message: 'Bill deleted' });
});

module.exports = router;


