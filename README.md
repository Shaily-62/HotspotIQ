# 🚦HotspotIQ

HotspotIQ is an enterprise-grade Smart City Geospatial Traffic Analytics & Tactical Enforcement Dispatch platform. The system ingests large-scale traffic telemetry and localized citation data to compute real-time congestion scores, detect infrastructure hazards, identify repeat offenders, and generate automated tactical operator protocols for emergency dispatch interception.

---

## 🏛️ System Architecture Overview

The application is structured as a decoupled monorepo containing an optimized Node.js analytical data pipeline engine and a highly responsive React/Vite dashboard interface.

```text
HotspotIQ/
├── backend/               # Node.js REST API & Data Engine
│   ├── controllers/      # Route logic handlers
│   ├── data/             # Geospatial telemetry & data lakes (Ignored by Git)
│   ├── routes/           # Express API endpoints
│   ├── services/         # Core analytical algorithm processors
│   └── server.js         # Production server entry point
├── frontend/              # React + Vite Client Dashboard
│   ├── public/           # Static asset assets
│   └── src/
│       ├── components/   # UI Layout & Leaflet Map wrappers
│       ├── pages/        # Dashboard metrics & analytics canvas
│       └── services/     # Axios API configuration instances
└── .gitignore            # Cross-platform environment safety rules

---

## ⚡ Core Features

* **Enforcement Recommendations Matrix:** High-performance data grid dynamically prioritizing locations via custom composite variables (violations, avg_severity, junction_ratio, and congestion_score).
* **Automated Operator Protocol:** AI-generated tactical directives instructing operators when to deploy active patrol interceptors to critical traffic chokes.
* **Geospatial Hotspot Analysis:** Interactive Leaflet map canvas rendering density marker nodes with real-time sidebar injection showing specific sector details upon node interaction.
* **Traffic Network Analytics:** Descriptive data visualization layouts utilizing Recharts to track hourly chronological timelines, vehicle type proportions, and jurisdictional police station enforcement indices.

---

## 🛠️ Tech Stack

* **Frontend:** React 18, Vite, Tailwind CSS, Leaflet Maps, Recharts Component Layer
* **Backend:** Node.js, Express.js, Safe Stream CSV Parser Engine
* **Analytical Engine Formulas:** The tactical congestion index is determined using multi-variable weighting parameters:
  Congestion Score = (w1 * Violations) + (w2 * Avg Severity) + (w3 * Junction Ratio)

---

## 🚀 Getting Started

### 📦 Prerequisites
Ensure you have **Node.js (v18+)** installed globally on your machine.

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend

2. Install dependencies:
npm install

3. To Start Server:
npm run dev

The API engine will initialize at: http://localhost:3000

### 1. Frontend Setup
Open a new terminal tab and navigate to the frontend directory:Bashcd frontend
Install dashboard packages:npm install
Boot up the Vite client development engine:npm run dev
Open your browser and navigate to: http://localhost:5173

## 🌐 Core REST API EndpointsMethodEndpointDescription
Method,Endpoint,Description
GET,/api/hotspots,Extracts complete filtered analytical matrix arrays.
GET,/api/analytics,"Compiles vehicle type ratios, timeline segments, and station ranks."
