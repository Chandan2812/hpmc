const analyticsClient = require("./googleAnalytics");

const getOverview = async () => {
  const [response] = await analyticsClient.runReport({
    property: `properties/${process.env.GA_PROPERTY_ID}`,

    dateRanges: [
      {
        startDate: "30daysAgo",
        endDate: "today",
      },
    ],

    metrics: [
      { name: "totalUsers" },
      { name: "activeUsers" },
      { name: "newUsers" },
      { name: "sessions" },
      { name: "screenPageViews" },
    ],
  });

  return response;
};

module.exports = getOverview;
