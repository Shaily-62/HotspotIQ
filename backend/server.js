const express = require("express");
const cors = require('cors');

const dashboardRoutes = require('./routes/dashboardRoutes');
const hotspotRoutes = require('./routes/hotspotRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const locationRoutes = require('./routes/locationRoutes');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/hotspots', hotspotRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/analytics', analyticsRoutes)
app.use('/api/locations', locationRoutes)

//health route
app.get("/", (req, res) => {
  res.json({
    status: "Backend Running",
    project: "AI Parking Intelligence System"
  });
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
})

//error handling middleware
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });
});