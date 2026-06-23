const readCSV = require("../services/csvServices");

const getHotspots = async (req, res) => {
    try {
        const hotspots = await readCSV("./data/hotspot_intelligence.csv");

        // Congestion score ke basis par highest points dynamic shorting
        const sorted = hotspots.sort(
            (a, b) => Number(b.congestion_score || 0) - Number(a.congestion_score || 0)
        );

        const processed = sorted.map((spot) => {
            return {
                ...spot,
                // Colab se enriched hoke aaya hua real text address (e.g. Shivajinagar)
                display_name: spot.locations || `Cluster Sector #${spot.cluster}`
            };
        });

        res.json(processed.slice(0, 20));

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getHotspots };