const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

const run = async () => {
  try {
    // 1️⃣ Create Customer
    let customer = await axios.post(`${BASE_URL}/customers`, {
      name: 'Anjali Sharma',
      phone: '9876543210',
      address: 'Delhi, India'
    });
    console.log('Customer Created:', customer.data);

    const customerId = customer.data._id;

    // 2️⃣ Create Bill
    let bill = await axios.post(`${BASE_URL}/bills`, {
      customer: customerId,
      items: [{ name: 'Silk Saree', price: 3000 }],
      totalAmount: 3000,
      paidAmount: 1000,
      dueDate: '2026-01-20'
    });
    console.log('Bill Created:', bill.data);

    // 3️⃣ Create Expense
    let expense = await axios.post(`${BASE_URL}/expenses`, {
      amount: 1500,
      category: 'Inventory',
      notes: 'Bought new silk fabrics'
    });
    console.log('Expense Created:', expense.data);

    // 4️⃣ Fetch all customers
    let allCustomers = await axios.get(`${BASE_URL}/customers`);
    console.log('All Customers:', allCustomers.data);
  } catch (err) {
    // Show full error
    console.error('Error Status:', err.response?.status);
    console.error('Error Data:', err.response?.data);
    console.error('Error Message:', err.message);
  }
};

run();

