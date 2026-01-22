const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  amount: Number,
  category: String,
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
