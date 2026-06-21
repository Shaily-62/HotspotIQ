const readCSV = require("../services/csvServices");
const path = require("path");

const getLocations = async (req, res) => {
  try {
    const locations = await readCSV(
      path.join(__dirname, "../data/location_intelligence.csv")
    );

    const limit = parseInt(req.query.limit) || 100;

    res.json(locations.slice(0, limit));

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = { getLocations };