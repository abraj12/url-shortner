const { nanoid } = require("nanoid");
const URL = require("../models/url");

/* ===========================
   CREATE SHORT URL
=========================== */
async function handleGenerateNewShortURL(req, res) {
  try {
    const body = req.body;

    if (!body.url) {
      return res.status(400).json({ error: "URL IS REQUIRED" });
    }

    const shortID = nanoid(8);

    await URL.create({
      shortId: shortID,
      redirectURL: body.url,
      visitHistory: [],
    });

    return res.render("home", { id: shortID });
  } catch (err) {
    console.error("Create URL error:", err);
    return res.status(500).send("Server Error");
  }
}

/* ===========================
   GET ANALYTICS BY SHORT ID
=========================== */
async function handleGetAnalytics(req, res) {
  try {
    const shortId = req.params.shortId;

    const result = await URL.findOne({ shortId });

    if (!result) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    return res.json({
      totalClicks: result.visitHistory.length,
      analytics: result.visitHistory,
    });
  } catch (err) {
    console.error("Analytics error:", err);
    return res.status(500).send("Server Error");
  }
}

/* ===========================
   GET ALL URLS (DASHBOARD)
=========================== */
async function handleGetAllURLs(req, res) {
  try {
    const allUrls = await URL.find({});

    return res.render("analytics", {
      urls: allUrls,
    });
  } catch (err) {
    console.error("Fetch all URLs error:", err);
    return res.status(500).send("Server Error");
  }
}

/* ===========================
   EXPORT CONTROLLERS
=========================== */
module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
  handleGetAllURLs,
};
