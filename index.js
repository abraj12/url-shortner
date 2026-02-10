// const express= require("express");
// const path =require('path');
// const {connetToMongoDB} = require("./connect");
// const urlRoute = require("./routes/url");
// const URL =require('./models/url');

// const staticRoute = require("./routes/staticsRouter");

// const app = express();
// const PORT=8001;

// connetToMongoDB(process.env.MONGO_URL)

// // connetToMongoDB("mongodb://localhost:27017/short-url")
// .then(()=>console.log("MongoDB connected"));


// app.set("view engine","ejs");
// app.set('views',path.resolve("./views"));


// //middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// app.use("/url",urlRoute);
// app.use("/url",staticRoute);


// app.get('/url/:shortId',async(req,res)=>{
//     const shortId=req.params.shortId;
//     const entry = await URL.findOneAndUpdate({
//         shortId

//     } ,{$push: {
//         visitHistory: {timestamp: Date.now()},
//     },
// }
// );
// res.redirect(entry.redirectURL);
// });

// app.listen(PORT, () => console.log(`Server Started At Port: ${PORT}`));




require("dotenv").config();

const express = require("express");
const path = require("path");
const { connetToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticsRouter");
const URL = require("./models/url");

const app = express();

/* =====================
   PORT (RENDER SAFE)
===================== */
const PORT = process.env.PORT || 8001;

/* =====================
   MONGODB CONNECTION
===================== */
if (!process.env.MONGO_URL) {
  console.error("❌ MONGO_URL is not defined");
  process.exit(1);
}

connetToMongoDB(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });

/* =====================
   VIEW ENGINE
===================== */
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

/* =====================
   GLOBAL MIDDLEWARE
===================== */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* Base URL for EJS (works locally + Render) */
app.use((req, res, next) => {
  res.locals.baseUrl = `${req.protocol}://${req.get("host")}`;
  next();
});

/* =====================
   ROUTES
===================== */
app.use("/url", urlRoute);
app.use("/url", staticRoute);

/* =====================
   REDIRECT SHORT URL
===================== */
app.get("/url/:shortId", async (req, res) => {
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
    res.status(500).send("Server Error");
  }
});

/* =====================
   START SERVER
===================== */
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
