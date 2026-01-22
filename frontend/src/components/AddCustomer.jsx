import { useState } from "react";
import api from "../api/axios";

export default function AddCustomer({ onAdded }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone) {
      return alert("Name and phone are required");
    }

    try {
      setLoading(true);
      await api.post("/customers", { name, phone, address });
      setName("");
      setPhone("");
      setAddress("");
      onAdded();
    } catch (err) {
      console.error(err);
      alert("Failed to add customer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h3>Add Customer</h3>

      <input
        placeholder="Customer Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <input
        placeholder="Address (optional)"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Add Customer"}
      </button>
    </form>
  );
}

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  maxWidth: "300px",
};
