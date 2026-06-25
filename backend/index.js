const express = require("express");
const cors = require("cors");
const { connect } = require("./config/db");
const settingsRoutes = require("./routes/settings.routes");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/lead", require("./routes/lead.route"));
app.use("/client", require("./routes/client.route"));
app.use("/subscribers", require("./routes/subscriber.route"));
app.use("/newsletter", require("./routes/newsletter.route"));
app.use("/blog", require("./routes/blog.route"));
app.use("/sitevisit", require("./routes/sitevisit.route"));
app.use("/agent", require("./routes/agent.route"));
app.use("/vendor", require("./routes/vendor.route"));
app.use("/career", require("./routes/career.route"));
app.use("/job-application", require("./routes/jobApplication.route"));
app.use("/employee", require("./routes/employee.routes"));
app.use("/api/settings", settingsRoutes);
app.use("/analytics", require("./routes/analytics.route"));

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
