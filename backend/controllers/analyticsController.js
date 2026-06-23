const readCSV = require("../services/csvServices");
const path = require("path");

const getAnalytics = async (req, res) => {
  try {

    const data = await readCSV(
      path.join(__dirname, "../data/cleaned_parking_violations.csv")
    );

    const vehicleTypes = {};
    const violationTypes = {};
    const policeStations = {};
    const hourlyViolations = {};

    data.forEach((row) => {

      vehicleTypes[row.vehicle_type] =
        (vehicleTypes[row.vehicle_type] || 0) + 1;

      violationTypes[row.violation_type] =
        (violationTypes[row.violation_type] || 0) + 1;

      policeStations[row.police_station] =
        (policeStations[row.police_station] || 0) + 1;

      if (row.hour !== undefined) {
        hourlyViolations[row.hour] =
          (hourlyViolations[row.hour] || 0) + 1;
      }
    });

    res.json({
      vehicleTypes,
      violationTypes,
      policeStations,
      hourlyViolations
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};



module.exports = { getAnalytics };