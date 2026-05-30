const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connect } = require("./config/db");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send("API LIVE 🚀");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, async () => {
  try {
    await connect();
    console.log(`🚀 Server running on port ${PORT}`);
  } catch (error) {
    console.error("❌ Server start failed:", error);
  }
});
