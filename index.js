require("dotenv").config();

const express = require("express");
const path = require("path");
const { connetToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticsRouter");
const URL = require("./models/url");

const app = express();
const PORT = process.env.PORT || 8001;

/* MongoDB */
if (!process.env.MONGO_URL) {
  console.error("❌ MONGO_URL is not defined");
} else {
  connetToMongoDB(process.env.MONGO_URL)
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ MongoDB error:", err.message));
}

/* View engine */
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

/* Middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* Root redirect */
app.get("/", (req, res) => {
  res.redirect("/url");
});

/* Routes */
app.use("/url", urlRoute);
app.use("/url", staticRoute);

/* Redirect short URL */
app.get("/url/:shortId", async (req, res) => {
  const entry = await URL.findOneAndUpdate(
    { shortId: req.params.shortId },
    { $push: { visitHistory: { timestamp: Date.now() } } }
  );

  if (!entry) return res.status(404).send("URL not found");
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
