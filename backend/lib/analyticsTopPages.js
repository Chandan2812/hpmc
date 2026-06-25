const analyticsClient = require("./googleAnalytics");

const getTopPages = async () => {
  const [response] = await analyticsClient.runReport({
    property: `properties/${process.env.GA_PROPERTY_ID}`,

    dateRanges: [
      {
        startDate: "30daysAgo",
        endDate: "today",
      },
    ],

    dimensions: [
      {
        name: "pagePath",
      },
    ],

    metrics: [
      {
        name: "screenPageViews",
      },
    ],

    orderBys: [
      {
        metric: {
          metricName: "screenPageViews",
        },
        desc: true,
      },
    ],

    limit: 10,
  });

  return response;
};

module.exports = getTopPages;
