const axios = require('axios');

const BILL_ID = '6964b4ea0d74157d6703abb5'; // your bill _id
const BASE_URL = 'http://localhost:5000/api/bills';

const run = async () => {
  try {
    const res = await axios.put(`${BASE_URL}/${BILL_ID}/pay`, { paidAmount: 10000 });
    console.log('Bill after payment:', res.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
};

run();
