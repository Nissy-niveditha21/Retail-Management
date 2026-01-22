import { useEffect, useState } from "react";
import api from "../api/axios";

export default function CustomerList({ onSelect }) {
  const [customers, setCustomers] = useState([]);

  const loadCustomers = async () => {
    const res = await api.get("/customers");
    setCustomers(res.data);
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  return (
    <div>
      <h3>Customers</h3>

      {customers.length === 0 && <p>No customers yet</p>}

      <ul>
        {customers.map((c) => (
          <li
            key={c._id}
            style={{ cursor: "pointer" }}
            onClick={() => onSelect(c._id)}
          >
            {c.name} — {c.phone}
          </li>
        ))}
      </ul>
    </div>
  );
}
