// const express = require("express");

// const router = express.Router();
// router.get("/",(req,res)=>{
//     return res.render("home");
// });

// module.exports=router;


const express = require("express");
const URL = require("../models/url");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("home");
});

router.get("/all", async (req, res) => {
  const urls = await URL.find({});
  res.render("analytics", { urls });
});

module.exports = router;
