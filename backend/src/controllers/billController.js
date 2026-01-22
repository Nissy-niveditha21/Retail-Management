const Bill = require('../models/Bill');
const Customer = require('../models/Customer');

exports.createBill = async (req, res) => {
  try {
    const { customer, totalAmount, paidAmount = 0 } = req.body;

    const bill = await Bill.create(req.body);

    const due = totalAmount - paidAmount;

    if (due > 0) {
      await Customer.findByIdAndUpdate(customer, {
        $inc: { totalDue: due }
      });
    }

    res.status(201).json(bill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getBills = async (req, res) => {
  try {
    const bills = await Bill.find().populate('customer');
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
