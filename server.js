const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// 🔹 MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err.message));

// 🔹 Test route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// 🔹 Schema
const requestSchema = new mongoose.Schema({
  name: String,
  email: String,
  service: String,
  message: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 🔹 Model
const Request = mongoose.model("Request", requestSchema);

// 🔹 POST API (save to DB)
app.post("/submit", async (req, res) => {
  try {
    const newRequest = new Request(req.body);
    await newRequest.save();
    res.status(201).json({ message: "Saved to DB" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 GET API (fetch from DB)
app.get("/requests", async (req, res) => {
  const data = await Request.find();
  res.json(data);
});

// server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
