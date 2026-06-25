const getOverview = require("../lib/analyticsOverview");
const getVisitorsChart = require("../lib/analyticsVisitorsChart");
const getTopPages = require("../lib/analyticsTopPages");
const getCities = require("../lib/analyticsCities");
const getTrafficSources = require("../lib/analyticsTrafficSources");

exports.overview = async (req, res) => {
  try {
    const data = await getOverview();

    if (!data.rows || data.rows.length === 0) {
      return res.json({
        totalUsers: 0,
        activeUsers: 0,
        newUsers: 0,
        sessions: 0,
        pageViews: 0,
      });
    }

    const metrics = data.rows[0].metricValues;

    res.json({
      totalUsers: Number(metrics[0]?.value || 0),
      activeUsers: Number(metrics[1]?.value || 0),
      newUsers: Number(metrics[2]?.value || 0),
      sessions: Number(metrics[3]?.value || 0),
      pageViews: Number(metrics[4]?.value || 0),
    });
  } catch (err) {
    console.error("Analytics Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics data",
    });
  }
};

exports.visitorsChart = async (req, res) => {
  try {
    const data = await getVisitorsChart();

    if (!data.rows || data.rows.length === 0) {
      return res.json([]);
    }

    const chartData = data.rows.map((row) => ({
      date: row.dimensionValues[0].value,
      users: Number(row.metricValues[0].value),
    }));

    res.json(chartData);
  } catch (err) {
    console.error("Visitors Chart Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch visitors chart",
    });
  }
};

exports.topPages = async (req, res) => {
  try {
    const data = await getTopPages();

    if (!data.rows || data.rows.length === 0) {
      return res.json([]);
    }

    const pages = data.rows.map((row) => ({
      page: row.dimensionValues[0]?.value || "/",
      views: Number(row.metricValues[0]?.value || 0),
    }));

    res.json(pages);
  } catch (err) {
    console.error("Top Pages Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch top pages",
    });
  }
};

exports.cityVisitors = async (req, res) => {
  try {
    const data = await getCities();

    if (!data.rows || data.rows.length === 0) {
      return res.json([]);
    }

    const cities = data.rows.map((row) => ({
      city: row.dimensionValues[0]?.value || "Unknown",
      visitors: Number(row.metricValues[0]?.value || 0),
    }));

    res.json(cities);
  } catch (err) {
    console.error("City Analytics Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch city analytics",
    });
  }
};

exports.trafficSources = async (req, res) => {
  try {
    const data = await getTrafficSources();

    if (!data.rows || data.rows.length === 0) {
      return res.json([]);
    }

    const sources = data.rows.map((row) => ({
      source: row.dimensionValues[0]?.value || "Unknown",
      visitors: Number(row.metricValues[0]?.value || 0),
    }));

    res.json(sources);
  } catch (err) {
    console.error("Traffic Sources Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch traffic sources",
    });
  }
};
