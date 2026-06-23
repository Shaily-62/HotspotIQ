import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Dashboard from "./pages/Dashboard";
import Hotspots from "./pages/Hotspots";
import Analytics from "./pages/Analytics";
import Recommendations from "./pages/Recommendation";
import LocationMap from "./pages/LocationMap";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/hotspots" element={<Hotspots />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/map" element={<LocationMap />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App