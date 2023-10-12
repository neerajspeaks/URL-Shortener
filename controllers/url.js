const shortid = require('shortid');
const URL = require('../models/url');

const handleGenerateNewShortURL = async (req, res) => {
    const body = req.body;
    if (!body.url) {
        return res.status(400).jsonp({ 'error': 'url is required.' });
    } else {
        const shortID = shortid(8);
        await URL.create({
            shortId: shortID,
            redirectURL: body.url,
            visitedHistory: [],
            createdBy: req.user._id
        });
        return res.render('home', { id: shortID });
    }
};

const handleGetAnalytics = async (req, res) => {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });
    res.json({ totalClicks: result.visitHistory.length, analytics: result.visitHistory });
};

module.exports = { handleGenerateNewShortURL, handleGetAnalytics}