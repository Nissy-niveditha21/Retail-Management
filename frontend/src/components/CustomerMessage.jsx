import { useState } from "react";
import api from "../api/axios";

export default function CustomerMessage({ customerId }) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) {
      return alert("Message cannot be empty");
    }

    try {
      setSending(true);
      await api.post("/messages", {
        customerId,
        message,
      });
      alert("Message sent to admin");
      setMessage("");
    } catch (err) {
      console.error(err);
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Send Message to Shop</h3>

      <textarea
        rows="4"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: "100%" }}
      />

      <button onClick={handleSend} disabled={sending}>
        {sending ? "Sending..." : "Send Message"}
      </button>
    </div>
  );
}
