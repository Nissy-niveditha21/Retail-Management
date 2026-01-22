const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  items: [{ name: String, price: Number }],
  totalAmount: Number,
  paidAmount: Number,
  status: { type: String, default: 'PENDING' },
  dueDate: Date
}, { timestamps: true });

module.exports = mongoose.model('Bill', billSchema);
