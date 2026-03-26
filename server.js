require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: true }
});

db.connect(err => {
  if (err) console.log(err);
  else console.log("DB Connected 🚀");
});

app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;

  db.query(
    "INSERT INTO messages (name,email,message) VALUES (?,?,?)",
    [name, email, message],
    () => res.send("Saved")
  );
});

app.listen(4000, () => console.log("Server running"));