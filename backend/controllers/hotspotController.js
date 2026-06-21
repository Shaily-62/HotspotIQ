const readCSV = require("../services/csvServices");

const getHotspots = async (req, res) => {

    try {

        const hotspots = await readCSV(
            "./data/hotspot_intelligence.csv"
        );

        const sorted = hotspots.sort(
            (a, b) =>
                Number(b.congestion_score)
                - Number(a.congestion_score)
        );

        res.json(sorted.slice(0, 20));

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getHotspots
};