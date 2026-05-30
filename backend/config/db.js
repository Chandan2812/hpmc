const mongoose = require("mongoose");

const connect = async () => {
  try {
    const MongoURL = process.env.MONGO_URI;
    const DB = process.env.DB;

    await mongoose.connect(`${MongoURL}/${DB}`);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = { connect };
