require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ TiDB Connection (Fixed)
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT), // important
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    minVersion: "TLSv1.2",
    rejectUnauthorized: true
  },
  connectTimeout: 10000
});

// ✅ Connect DB
db.connect((err) => {
  if (err) {
    console.log("❌ DB ERROR:");
    console.log(err.code, err.message);
  } else {
    console.log("✅ Connected to TiDB 🚀");
  }
});

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// ✅ Contact API
app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const sql = "INSERT INTO messages (name, email, message) VALUES (?, ?, ?)";

  db.query(sql, [name, email, message], (err, result) => {
    if (err) {
      console.log("❌ Insert Error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({ success: true, message: "Saved successfully 🚀" });
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});