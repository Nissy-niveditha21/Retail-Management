import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function CustomerDetails() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [bills, setBills] = useState([]);
  const [amount, setAmount] = useState("");

  const fetchData = () => {
    api.get(`/customers/${id}`).then(res => setCustomer(res.data));
    api.get(`/bills/customer/${id}`).then(res => setBills(res.data));
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handlePay = (billId) => {
    api.put(`/bills/${billId}/pay`, { paidAmount: Number(amount) })
      .then(() => fetchData())
      .catch(err => console.error(err));
  };

  if (!customer) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{customer.name}</h2>
      <p>Phone: {customer.phone}</p>
      <p>Total Due: ₹{customer.totalDue}</p>

      <h3>Bills</h3>
      {bills.length === 0 ? (
        <p>No bills found</p>
      ) : (
        <ul>
          {bills.map(b => (
            <li key={b._id}>
              ₹{b.totalAmount} | Paid: ₹{b.paidAmount} | {b.status}
              <br />
              <input
                type="number"
                placeholder="Pay amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{ width: 100, marginRight: 10 }}
              />
              <button onClick={() => handlePay(b._id)}>Pay</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


