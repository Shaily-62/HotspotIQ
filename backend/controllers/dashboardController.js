const readCSV = require("../services/csvServices");

const getDashboardSummary = async (req, res) => {

    try {

        const hotspots = await readCSV(
            "./data/hotspot_intelligence.csv"
        );

        const cleaned = await readCSV(
            "./data/cleaned_parking_violations.csv"
        );

        const totalViolations = cleaned.length;

        const totalHotspots = hotspots.length;

        const criticalHotspots = hotspots.filter(
            h => h.risk_level === "Critical"
        ).length;

        res.json({
            totalViolations,
            totalHotspots,
            criticalHotspots
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getDashboardSummary
};