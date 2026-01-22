import { useState, useEffect } from "react";
import api from "../api/axios";

export default function CustomerDetails({ customerId }) {
  const [customer, setCustomer] = useState(null);
  const [bills, setBills] = useState([]);
  const [paidAmounts, setPaidAmounts] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch customer & bills
  useEffect(() => {
    const fetchData = async () => {
      try {
        const custRes = await api.get(`/customers/${customerId}`);
        setCustomer(custRes.data);

        const billsRes = await api.get(`/bills/customer/${customerId}`);
        setBills(billsRes.data);
      } catch (err) {
        console.error("Error fetching customer data:", err);
      }
    };
    fetchData();
  }, [customerId]);

  const handlePay = async (billId) => {
    const amountToPay = Number(paidAmounts[billId]);
    if (!amountToPay) return alert("Enter amount to pay");

    try {
      setLoading(true);
      await api.put(`/bills/${billId}/pay`, { paidAmount: amountToPay });

      // Refresh data
      const [billsRes, custRes] = await Promise.all([
        api.get(`/bills/customer/${customerId}`),
        api.get(`/customers/${customerId}`)
      ]);
      setBills(billsRes.data);
      setCustomer(custRes.data);

      setPaidAmounts({ ...paidAmounts, [billId]: "" });
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  if (!customer) return <div>Loading customer...</div>;
  if (loading) return <div>Processing payment...</div>;

  return (
    <div>
      <h2>{customer.name} - Ledger</h2>
      <p>Total Due: {customer.totalDue}</p>

      <h3>Bills</h3>
      {bills.length === 0 && <p>No bills yet</p>}
      <ul>
        {bills.map((bill) => (
          <li key={bill._id}>
            {bill.description} | Amount: {bill.amount} | Paid: {bill.paidAmount || 0} | Due: {bill.amount - (bill.paidAmount || 0)}
            <div>
              <input
                type="number"
                placeholder="Enter payment"
                value={paidAmounts[bill._id] || ""}
                onChange={(e) =>
                  setPaidAmounts({ ...paidAmounts, [bill._id]: e.target.value })
                }
              />
              <button onClick={() => handlePay(bill._id)}>Pay</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

