const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api'; // make sure your backend routes start with /api

const run = async () => {
  try {
    const customers = [
      { name: "Anjali Sharma", phone: "9876543210", address: "Delhi, India" },
      { name: "Rohit Verma", phone: "9123456780", address: "Mumbai, India" },
      { name: "Sonal Patel", phone: "9988776655", address: "Ahmedabad, India" },
    ];

    // 1️⃣ Create Customers
    let createdCustomers = [];
    for (let c of customers) {
      const res = await axios.post(`${BASE_URL}/customers`, c);
      createdCustomers.push(res.data);
      console.log('Customer Created:', res.data.name);
    }

    // 2️⃣ Create Bills
    for (let customer of createdCustomers) {
      const bill = await axios.post(`${BASE_URL}/bills`, {
        customer: customer._id,
        items: [{ name: "Silk Saree", price: 3000 }],
        totalAmount: 3000,
        paidAmount: 1000,
        dueDate: "2026-01-20",
      });
      console.log(`Bill created for ${customer.name}`);
    }

    // 3️⃣ Create Expenses
    const expenses = [
      { amount: 1500, category: "Inventory", notes: "Bought new silk fabrics" },
      { amount: 2000, category: "Rent", notes: "Shop rent for January" }
    ];

    for (let exp of expenses) {
      const res = await axios.post(`${BASE_URL}/expenses`, exp);
      console.log('Expense Created:', exp.category);
    }

    // 4️⃣ Fetch all customers to verify totalDue
    const allCustomers = await axios.get(`${BASE_URL}/customers`);
    console.log('All Customers with updated totalDue:');
    console.log(allCustomers.data);

  } catch (err) {
    console.error('Error Status:', err.response?.status);
    console.error('Error Data:', err.response?.data);
    console.error('Error Message:', err.message);
  }
};

run();
