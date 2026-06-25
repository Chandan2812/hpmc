const { BetaAnalyticsDataClient } = require("@google-analytics/data");

const analyticsClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GA_CLIENT_EMAIL,
    private_key: process.env.GA_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});

module.exports = analyticsClient;
