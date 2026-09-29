const shortid = require("shortid");
const URL = require("../model/url");

async function handelGenerateNewShortUrl(req, res) {
    try {
        const body = req.body;

        if (!body.url) {
            return res.status(400).json({
                error: "URL is required",
            });
        }

        const shortID = shortid();

        const entry = await URL.create({
            shortId: shortID,
            redirectUrl: body.url,
            visitHistory: [],
        });

        return res.status(201).json({
            id: shortID,
            entry: entry,
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "Internal Server Error",
        });
    }
}

async function handleGetAnalytics(req, res) {
    try {
        const shortId = req.params.shortId;
        const result = await URL.findOne({ shortId });

        if (!result) {
            return res.status(404).json({ error: "Short URL not found" });
        }

        return res.json({
            shortId: result.shortId,
            redirectUrl: result.redirectUrl,
            totalClicks: result.visitHistory ? result.visitHistory.length : 0,
            analytics: result.visitHistory || [],
            createdAt: result.createdAt,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

async function handleGetAllUrls(req, res) {
    try {
        const allUrls = await URL.find({}).sort({ createdAt: -1 });
        return res.json(allUrls);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

async function handleDeleteUrl(req, res) {
    try {
        const shortId = req.params.shortId;
        const deleted = await URL.findOneAndDelete({ shortId });
        if (!deleted) {
            return res.status(404).json({ error: "Short URL not found" });
        }
        return res.json({ message: "URL deleted successfully", shortId });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {
    handelGenerateNewShortUrl,
    handleGetAnalytics,
    handleGetAllUrls,
    handleDeleteUrl,
};