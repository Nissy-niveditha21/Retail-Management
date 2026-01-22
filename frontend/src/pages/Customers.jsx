import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // make sure this import exists
import api from "../api/axios";

export default function Customers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    api.get("/customers")
      .then(res => setCustomers(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Customers</h2>
      {customers.length === 0 ? (
        <p>No customers found</p>
      ) : (
        <ul>
          {customers.map(c => (
            <li key={c._id}>
              {/* Wrap name in Link to go to ledger */}
              <Link to={`/customers/${c._id}`} style={{ textDecoration: 'none', color: 'blue' }}>
                {c.name}
              </Link> — Due: ₹{c.totalDue}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
