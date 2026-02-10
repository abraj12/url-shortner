// const express = require("express");
// const {handleGenerateNewShortURL,handleGetAnalytics}= require("../controllers/url");
// const router = express.Router();

// router.post("/",handleGenerateNewShortURL);

// router.get('/analytics/:shortId',handleGetAnalytics)

// router.get("/all", handleGetAllURLs);

// module.exports=router;



const express = require("express");
const {
  handleGenerateNewShortURL,
  handleGetAnalytics,
  handleGetAllURLs,
} = require("../controllers/url");

const router = express.Router();

router.post("/", handleGenerateNewShortURL);
router.get("/analytics/:shortId", handleGetAnalytics);
router.get("/all", handleGetAllURLs);

module.exports = router;
