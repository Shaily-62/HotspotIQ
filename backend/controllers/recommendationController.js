const readCSV = require("../services/csvServices");

const getRecommendations = async (req, res) => {

    try {

        const hotspots = await readCSV(
            "./data/hotspot_intelligence.csv"
        );

        const recommendations =
            hotspots.filter(
                h => h.risk_level === "Critical"
            );

        res.json(recommendations);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getRecommendations
};