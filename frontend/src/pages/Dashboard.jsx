import { useEffect, useState } from "react";
import { getStats } from "../api/stats";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getStats().then(setStats);
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Dashboard</h2>

      <div style={{ display: "flex", gap: 20 }}>
        <div>
          <h4>Total Sales</h4>
          <p>₹{stats.totalSales}</p>
        </div>

        <div>
          <h4>Total Expenses</h4>
          <p>₹{stats.totalExpenses}</p>
        </div>

        <div>
          <h4>Total Due</h4>
          <p>₹{stats.totalDue}</p>
        </div>
      </div>
    </div>
  );
}
