require("dotenv").config();

const express = require("express");
const path = require("path");
const { connetToMongoDB } = require("./connect");

const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticsRouter");
const URL = require("./models/url");

const app = express();
const PORT = process.env.PORT || 8001;

/* ======================
   DATABASE CONNECTION
====================== */
if (!process.env.MONGO_URL) {
  console.error("❌ MONGO_URL is not defined");
} else {
  connetToMongoDB(process.env.MONGO_URL)
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ MongoDB error:", err.message));
}

/* ======================
   VIEW ENGINE
====================== */
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

/* ======================
   GLOBAL MIDDLEWARE
====================== */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* Base URL for EJS (Render + Local) */
app.use((req, res, next) => {
  res.locals.baseUrl = `${req.protocol}://${req.get("host")}`;
  next();
});

/* ======================
   ROOT REDIRECT
====================== */
app.get("/", (req, res) => {
  res.redirect("/url");
});

/* ======================
   PAGE & API ROUTES
====================== */
app.use("/url", staticRoute); // home + analytics
app.use("/url", urlRoute);    // create short URL

/* ======================
   SHORT URL REDIRECT
   (VERY IMPORTANT)
====================== */
app.get("/:shortId", async (req, res) => {
  try {
    const shortId = req.params.shortId;

    const entry = await URL.findOneAndUpdate(
      { shortId },
      { $push: { visitHistory: { timestamp: Date.now() } } },
      { new: true }
    );

    if (!entry) {
      return res.status(404).send("Short URL not found");
    }

    res.redirect(entry.redirectURL);
  } catch (err) {
    console.error("Redirect error:", err);
    res.status(500).send("Server error");
  }
});

/* ======================
   START SERVER
====================== */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
