const shortid = require("shortid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res){
    const body = req.body;
    if(!body.url) return res.status(400).json({error: "url is required"})
    const shortID = shortid();
    
    await URL.create({
        shortID: shortID,
        redirectURL: body.url,
        visitHistory: []
    })

    // return res.json({ id: shortID });

    return res.render("home.ejs", {
        id: shortID,
    });
    
}

async function handleGetAnalytics(req, res){
    const shortId = req.params.shortId;
    const result = await URL.findOne({shortID: shortId});

    return res.json({
        totalClicks: result.visitHistory.length, 
        visitHistory: result.visitHistory
    });
}

module.exports ={
    handleGenerateNewShortURL, 
    handleGetAnalytics,
};