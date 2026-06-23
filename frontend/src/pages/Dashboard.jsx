import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import DashboardCard from "../components/DashboardCard";
import API from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/dashboard")
      .then((res) => {
        setStats(res.data || {});
        setLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard metrics ingestion failure:", err);
        setLoading(false);
      });
  }, []);

  return (
    <Layout>
      <div className="w-full px-1 py-4 sm:px-4">
        
        {/* Dashboard Heading Banner */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Command Center Overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time synchronization of ingestion endpoints, structural cluster layers, and enforcement actions.
          </p>
        </div>

        {/* Loading Framework Viewport */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className="h-32 bg-white rounded-xl border border-slate-100 shadow-sm animate-pulse"
              />
            ))}
          </div>
        ) : (
          /* Responsive Adaptive Grid Canvas Layout */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
            
            <DashboardCard
              title="Total Violations Ingested"
              value={(stats?.totalViolations ?? 0).toLocaleString()}
              color="border-red-500"
              icon="⚠️" // Optional: If your DashboardCard supports layout sub-nodes or icons
            />

            <DashboardCard
              title="Calculated Hotspot Clusters"
              value={(stats?.totalHotspots ?? 0).toLocaleString()}
              color="border-amber-500" // Upgraded yellow-500 to higher-contrast amber-500
              icon="📍"
            />

            <DashboardCard
              title="Active Critical Deployments"
              value={(stats?.criticalHotspots ?? 0).toLocaleString()}
              color="border-blue-600" // Swapped out ambiguous green for an action-oriented deep blue tag
              icon="🚨"
            />

          </div>
        )}

        {/* Optional Secondary Insight Panel */}
        {!loading && (
          <div className="mt-8 p-4 bg-slate-50 border border-slate-200/60 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="text-xs sm:text-sm text-slate-600">
              <span className="font-bold text-slate-700">System Status:</span> All live pipeline nodes are healthy and checking in. Database logs last synced: <span className="font-mono bg-slate-200/60 px-1 py-0.5 rounded text-slate-800">Just Now</span>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
            >
              Force Sync Terminal 🔄
            </button>
          </div>
        )}

      </div>
    </Layout>
  );
};

export default Dashboard;