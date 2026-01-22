import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <h3>Loading dashboard...</h3>;
  if (!stats) return <h3>No data available</h3>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <div style={cardStyle}>
          <h3>Total Revenue</h3>
          <p>₹ {stats.revenue}</p>
        </div>

        <div style={cardStyle}>
          <h3>Total Pending</h3>
          <p>₹ {stats.pending}</p>
        </div>
      </div>

      <h2 style={{ marginTop: "30px" }}>Expenses by Category</h2>

      {stats.expensesByCategory.length === 0 ? (
        <p>No expenses recorded</p>
      ) : (
        <ul>
          {stats.expensesByCategory.map((exp) => (
            <li key={exp._id}>
              {exp._id}: ₹ {exp.total}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const cardStyle = {
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "20px",
  minWidth: "200px",
};
