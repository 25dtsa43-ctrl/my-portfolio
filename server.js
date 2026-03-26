require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve frontend (VERY IMPORTANT)
app.use(express.static(path.join(__dirname, "../client")));

// ✅ Database connection (TiDB)
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    minVersion: "TLSv1.2",
    rejectUnauthorized: true,
  },
});

// Connect DB
db.connect((err) => {
  if (err) {
    console.log("❌ DB Error:", err);
  } else {
    console.log("✅ Connected to TiDB 🚀");
  }
});

// ✅ API route
app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;

  db.query(
    "INSERT INTO messages (name,email,message) VALUES (?,?,?)",
    [name, email, message],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error saving");
      }
      res.send("Saved successfully");
    }
  );
});

// ✅ Show homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

// ✅ IMPORTANT for Render
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});