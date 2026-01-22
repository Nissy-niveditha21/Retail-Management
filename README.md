
🧾 Retail Management System (Voice-Enabled)

A full-stack Retail Management System built with MERN stack, designed specifically for small retail businesses.
The system includes a voice-only admin interface for effortless daily operations and a structured backend for customer, billing, and expense management.

🚀 Key Features
👩‍💼 Admin (Shop Owner – Voice Only)

🎤 Voice-controlled payment updates

🧾 Automatic bill payment recording

🔊 Spoken confirmations (no typing required)

👵 Senior-friendly UI (minimal buttons, no forms)

👥 Customers

Ledger-style bill tracking

Automatic due calculation

Secure backend-driven updates

📊 Business Analytics

Total revenue

Pending dues

Expenses by category

🧠 Why Voice-First?

This system is intentionally designed for non-technical users:

No keyboards

No typing

Fewer errors

Faster daily operations

Perfect for parents, shop owners, and small businesses.

🏗️ Tech Stack
Frontend

React (Vite)

Axios

Web Speech API (SpeechRecognition + SpeechSynthesis)

Backend

Node.js

Express.js

MongoDB + Mongoose

Tools

MongoDB Compass

Nodemon

Vite Dev Server

📁 Project Structure
retail-management-system/
│
├── backend/
│   ├── routes/
│   ├── src/
│   │   ├── models/
│   │   ├── config/
│   ├── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── AdminVoice.jsx
│   │   ├── api/
│   │   │   └── axios.js
│   │   └── App.jsx
│
└── README.md

⚙️ Setup Instructions
1️⃣ Clone Repository
git clone <your-repo-url>
cd retail-management-system

2️⃣ Backend Setup
cd backend
npm install


Create .env file:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/retail_db


Run backend:

npm run dev

3️⃣ Frontend Setup
cd ../frontend
npm install
npm run dev


Frontend runs on:

http://localhost:5173

🎤 How Voice Admin Works

Click Speak

Say:

“Anjali paid 500 today”

System asks for confirmation

Select customer → Confirm

Database updates automatically

System responds with voice feedback

🔍 Verifying Data in Database
MongoDB Compass

Database: retail_db

Collection: bills

Check:

paidAmount

updatedAt

📌 Current Status

✅ Backend APIs stable

✅ MongoDB integrated

✅ React frontend functional

✅ Voice-only admin interface live

🚧 Advanced NLP (future scope)

🌱 Future Enhancements

Hindi / Hinglish voice support

Undo last payment

Daily voice summary

Customer SMS notifications

Role-based dashboards

🧠 Learning Outcomes

REST API design

MERN full-stack architecture

Voice-driven UI design

Real-world business logic

Clean component separation

👤 Author

Built with ❤️ for real-world retail use.
