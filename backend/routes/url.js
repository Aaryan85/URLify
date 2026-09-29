const express = require("express");
const router = express.Router();
const {
    handelGenerateNewShortUrl,
    handleGetAnalytics,
    handleGetAllUrls,
    handleDeleteUrl,
} = require("../controller/url");
const URL = require("../model/url");

router.post("/", handelGenerateNewShortUrl);
router.get("/all", handleGetAllUrls);
router.get("/:shortId/analytics", handleGetAnalytics);
router.delete("/:shortId", handleDeleteUrl);

router.get("/:shortId", async (req, res) => {
    try {
        const shortId = req.params.shortId;

        const entry = await URL.findOneAndUpdate(
            { shortId },
            {
                $push: {
                    visitHistory: {
                        timestamp: Date.now(),
                    },
                },
            }
        );

        if (!entry) {
            return res.status(404).json({ error: "Short URL not found" });
        }

        let destination = entry.redirectUrl;
        if (!/^https?:\/\//i.test(destination)) {
            destination = "https://" + destination;
        }

        return res.redirect(destination);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;