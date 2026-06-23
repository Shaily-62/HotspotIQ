import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";

const Recommendations = () => {
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [riskFilter, setRiskFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    API.get("/hotspots")
      .then((res) => {
        setHotspots(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Analytical engine pipeline failure:", err);
        setLoading(false);
      });
  }, []);

  const sortedHotspots = [...hotspots].sort(
    (a, b) => Number(b.congestion_score || 0) - Number(a.congestion_score || 0)
  );

  // Summary Metrics Targets linked to your exact CSV header naming conventions
  const highestViolation = sortedHotspots.length > 0
    ? [...sortedHotspots].sort((a, b) => Number(b.violations || 0) - Number(a.violations || 0))[0]
    : null;

  const highestSeverity = sortedHotspots.length > 0 
    ? [...sortedHotspots].sort((a, b) => Number(b.avg_severity || 0) - Number(a.avg_severity || 0))[0]
    : null;

  const highestJunction = sortedHotspots.length > 0
    ? [...sortedHotspots].sort((a, b) => Number(b.junction_ratio || 0) - Number(a.junction_ratio || 0))[0]
    : null;

  // --- DYNAMIC FILTER ENGINE ---
  const filteredHotspots = sortedHotspots.filter((h) => {
    const matchesRisk = riskFilter === "All" || h.risk_level === riskFilter;
    
    const areaTextName = (h.display_name || "").toLowerCase();
    const matchesSearch = String(h.cluster || "").includes(search) || 
                          areaTextName.includes(search.toLowerCase());
                          
    return matchesRisk && matchesSearch;
  });

  const getRiskColor = (risk) => {
    switch (risk) {
      case "Critical": return "border-red-500 bg-red-50/40";
      case "High": return "border-orange-500 bg-orange-50/40";
      case "Medium": return "border-blue-500 bg-blue-50/40";
      default: return "border-green-500 bg-green-50/40";
    }
  };

  return (
    <Layout>
      <div className="w-full px-1 py-4 sm:px-4">
        
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Enforcement Recommendations Matrix
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            AI-generated tactical directives computed against localized multi-variable density parameters.
          </p>
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-28 bg-white border border-slate-100 rounded-xl animate-pulse" />
            <div className="h-96 bg-white border border-slate-100 rounded-xl animate-pulse" />
          </div>
        ) : (
          <>
            {/* Top Insight Cards Summary Grid */}
            {highestViolation && highestSeverity && highestJunction && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                
                <div className="bg-gradient-to-br from-red-50 to-white p-5 rounded-xl border border-red-100 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider block mb-1">Peak Volume</span>
                    <h3 className="font-bold text-slate-800 text-lg">Most Congested Hotspot</h3>
                  </div>
                  <div className="mt-4 flex flex-col gap-1">
                    <span className="text-sm font-bold text-slate-800 truncate">
                      {highestViolation.display_name || `Cluster #${highestViolation.cluster}`}
                    </span>
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-slate-400">ID: #{highestViolation.cluster}</span>
                      <span className="text-xl font-black text-red-600">
                        {Number(highestViolation.violations || 0).toLocaleString()} <span className="text-xs font-normal text-slate-400">tickets</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-white p-5 rounded-xl border border-amber-100 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block mb-1">Enforcement Threat</span>
                    <h3 className="font-bold text-slate-800 text-lg">Highest Severity Area</h3>
                  </div>
                  <div className="mt-4 flex flex-col gap-1">
                    <span className="text-sm font-bold text-slate-800 truncate">
                      {highestSeverity.display_name || `Cluster #${highestSeverity.cluster}`}
                    </span>
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-slate-400">ID: #{highestSeverity.cluster}</span>
                      <span className="text-xl font-black text-amber-600">{Number(highestSeverity.avg_severity || 0).toFixed(2)} <span className="text-xs font-normal text-slate-400">/ 5.00</span></span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-xl border border-blue-100 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider block mb-1">Infrastructure Hazard</span>
                    <h3 className="font-bold text-slate-800 text-lg">Junction Risk Zone</h3>
                  </div>
                  <div className="mt-4 flex flex-col gap-1">
                    <span className="text-sm font-bold text-slate-800 truncate">
                      {highestJunction.display_name || `Cluster #${highestJunction.cluster}`}
                    </span>
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-slate-400">ID: #{highestJunction.cluster}</span>
                      <span className="text-xl font-black text-blue-600">{(Number(highestJunction.junction_ratio || 0) * 100).toFixed(1)}% <span className="text-xs font-normal text-slate-400">prox.</span></span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Interactive Search Filters */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200/60 mb-6">
              <div className="w-full sm:w-72 relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-xs pointer-events-none">🔍</span>
                <input
                  type="text"
                  placeholder="Search Location or Cluster ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-700 shadow-sm"
                />
              </div>

              <div className="w-full sm:w-48 flex items-center gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Risk Layer:</label>
                <select
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-slate-700 cursor-pointer"
                >
                  <option value="All">All Classifications</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            {/* Matrix Data Cards Output */}
            {filteredHotspots.length === 0 ? (
              <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">
                No active hotspot profiles match the specified filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                {filteredHotspots.slice(0, 20).map((spot, index) => {
                  const currentAreaName = spot.display_name || `Cluster Vector #${spot.cluster}`;
                  const isCritical = spot.risk_level === 'Critical' || (Number(spot.violations) > 10000);

                  return (
                    <div
                      key={`spot-${index}`}
                      className={`bg-white border border-slate-100 border-l-[6px] ${getRiskColor(spot.risk_level).split(' ')[0]} rounded-xl shadow-sm p-5 flex flex-col justify-between transition-all hover:shadow-md`}
                    >
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-3">
                          <div className="flex flex-col">
                            <h2 className="font-extrabold text-slate-900 text-base tracking-tight">
                              {currentAreaName}
                            </h2>
                            <span className="text-[11px] font-mono text-slate-400">
                              System Reference Vector: Cluster #{spot.cluster}
                            </span>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider whitespace-nowrap ${
                            isCritical ? 'bg-red-600 text-white' : spot.risk_level === 'High' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {spot.risk_level || (isCritical ? "Critical" : "Low")}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-4 bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                          <p>Violations: <strong className="text-slate-900">{Number(spot.violations || 0).toLocaleString()}</strong></p>
                          <p>Severity: <strong className="text-slate-900">{Number(spot.avg_severity || 0).toFixed(2)}</strong></p>
                          <p>Junction Ratio: <strong className="text-slate-900">{(Number(spot.junction_ratio || 0) * 100).toFixed(1)}%</strong></p>
                          <p>Congestion Index: <strong className="text-slate-900 text-blue-600">{Number(spot.congestion_score || 0).toFixed(2)}</strong></p>
                        </div>
                      </div>

                      <div className={`p-3 border-l-2 rounded text-xs leading-relaxed ${
                        isCritical ? "bg-red-50 border-red-500 text-red-800" : "bg-slate-50 border-slate-400 text-slate-700"
                      }`}>
                        <span className="font-bold text-[9px] uppercase tracking-wider block text-slate-400 mb-0.5">
                          Automated Operator Protocol
                        </span>
                        {isCritical ? (
                          <span>🚨 <span className="font-bold">Immediate deployment order:</span> Dispatch patrol interceptors to <span className="underline font-bold">{currentAreaName}</span> immediately. High severity traffic choke.</span>
                        ) : spot.recommendation ? (
                          spot.recommendation
                        ) : (
                          "Maintain standard operational baseline watch monitoring protocols."
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Recommendations;