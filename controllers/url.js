const {nanoid} = require("nanoid");
const URL= require('../models/url');

async function handleGenerateNewShortURL(req,res) {
    const body =req.body;
    if(!body.url)return res.status(400).json({error:"URL IS REQUIRED"});
    const shortID=nanoid(8);
    await URL.create({
        shortId: shortID,
        redirectURL: body.url,
        visitHistory:[],
    });
    return res.render("home",{id:shortID});
    
}

async function handleGetAnalytics(req,res) {
    const shortId=req.params.shortId;
    const result = await URL.findOne({shortId});
    return res.json({totalClicks:result.visitHistory.length,analytics:result.visitHistory,})
}

async function handleGetAllURLs(req, res) {
  const allUrls = await URL.find({});
  return res.render("analytics", {
    urls: allUrls,
  });
}




module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
  handleGetAllURLs,
};
