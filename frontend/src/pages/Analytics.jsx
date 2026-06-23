import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/analytics")
      .then((res) => {
        setAnalytics(res.data || {});
        setLoading(false);
      })
      .catch((err) => {
        console.error("Analytics API Extraction Error:", err);
        setLoading(false);
      });
  }, []);

  if (loading || !analytics) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <h2 className="text-xl font-semibold text-slate-600 animate-pulse">
            Loading System Analytics...
          </h2>
        </div>
      </Layout>
    );
  }

  // --- SAFE PARSING ENGINE WITH FALLBACKS ---
  
  // 1. Vehicle Types Processing
  const vehicleData = Object.entries(analytics.vehicleTypes || {}).map(([name, value]) => ({
    name: name.toUpperCase().replace(/_/g, " "),
    value: Number(value || 0)
  }));

  const totalVehicleViolations = vehicleData.reduce((acc, curr) => acc + curr.value, 0);

  // 2. Hourly Violations Sequential Realignment (Chronological 00 to 23)
  const hourlyData = Object.entries(analytics.hourlyViolations || {})
    .map(([hour, count]) => ({
      hour: hour.padStart(2, "0") + ":00",
      count: Number(count || 0),
      sortKey: parseInt(hour, 10)
    }))
    .sort((a, b) => a.sortKey - b.sortKey);

  // 3. Police Stations Processing (Top 10)
  const policeData = Object.entries(analytics.policeStations || {})
    .map(([station, count]) => ({
      station: station.toUpperCase(),
      count: Number(count || 0)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const COLORS = ["#2563eb", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316"];

  return (
    <Layout>
      <div className="w-full px-1 py-4 sm:px-4">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Traffic Network Analytics
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            System-wide metric visualization derived from edge enforcement cameras and registry data.
          </p>
        </div>

        {/* Top Split Canvas Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          
          {/* Vehicle Distribution Card */}
          <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-lg font-bold text-slate-800">
                  Vehicle Type Distribution
                </h2>
                <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded">
                  {totalVehicleViolations.toLocaleString()} Total
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4">Proportional split of standard transport profiles breaching parameters.</p>
            </div>
            <div className="w-full h-[300px] sm:h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vehicleData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="45%"
                    outerRadius="75%"
                    innerRadius="40%"
                    paddingAngle={3}
                  >
                    {vehicleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0f172a", color: "#fff", borderRadius: "8px" }}
                    formatter={(value) => [value.toLocaleString(), "Violations"]}
                  />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Hourly Timeline Wave Card */}
          <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-1">
                Hourly Violations Trend
              </h2>
              <p className="text-xs text-slate-400 mb-4">Chronological density waves recorded over standard 24-hour cycles.</p>
            </div>
            <div className="w-full h-[300px] sm:h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="hour" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0f172a", color: "#fff", borderRadius: "8px" }}
                    formatter={(value) => [value.toLocaleString(), "Violations"]}
                  />
                  <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Full-Width Base Column Row */}
        <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-slate-100 mt-6 w-full">
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-1">
              Top 10 Enforced Police Stations
            </h2>
            <p className="text-xs text-slate-400 mb-6">Jurisdictional zones mapping out highest cumulative volume indices.</p>
          </div>
          <div className="w-full h-[350px] sm:h-[420px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={policeData} margin={{ top: 10, right: 10, left: -15, bottom: 45 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="station"
                  stroke="#64748b"
                  fontSize={10}
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                  tickLine={false}
                />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", color: "#fff", borderRadius: "8px" }}
                  formatter={(value) => [value.toLocaleString(), "Violations"]}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;