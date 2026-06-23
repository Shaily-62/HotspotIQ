import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";
import HotspotMap from "../components/HotspotMap";

const LocationMap = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // API hitting standard uniform endpoints context channel
    API.get("/hotspots")
      .then((res) => {
        setLocations(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Geospatial Extraction Failure:", err);
        setLoading(false);
      });
  }, []);

  return (
    <Layout>
      <div className="w-full px-1 py-4 sm:px-4">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Geospatial Hotspot Analysis
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time coordinate tracking and enforcement dispatch mapping across the city network.
          </p>
        </div>

        {loading ? (
          <div className="w-full h-[600px] bg-white rounded-xl border border-slate-100 flex items-center justify-center shadow-sm">
            <p className="text-slate-400 font-medium animate-pulse">Assembling Map Framework Layers...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">

            {/* Interactive Sidebar Panel */}
            <div className="xl:col-span-1 bg-white p-4 rounded-xl border border-slate-100 shadow-sm h-auto xl:h-[700px] flex flex-col justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-800 mb-3 pb-2 border-b border-slate-100">
                  Cluster Registry Terminal
                </h2>
                {selectedLocation ? (
                  <div className="space-y-4 animate-fadeIn">
                    
                    {/* --- NEW: DYNAMIC LOCATION NAME BANNER --- */}
                    <div className="p-1">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block mb-0.5">
                        Selected Sector
                      </span>
                      <h3 className="text-xl font-extrabold text-slate-900 leading-tight">
                        {selectedLocation.display_name || `Zone Cluster Sector #${selectedLocation.cluster}`}
                      </h3>
                      <span className="text-xs text-slate-400 font-mono">Reference Index ID: #{selectedLocation.cluster}</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Target Coordinates</span>
                      <strong className="text-sm text-slate-700 font-mono">
                        {Number(selectedLocation.latitude).toFixed(5)}, {Number(selectedLocation.longitude).toFixed(5)}
                      </strong>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Total Infractions</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-slate-900">
                          {Number(selectedLocation.violations || selectedLocation.violation_count || 0).toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-400">tickets</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <div className="p-2 bg-slate-50/50 rounded border border-slate-100">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase block">Severity Index</span>
                        <span className="text-sm font-bold text-slate-800">
                          {Number(selectedLocation.avg_severity || 0).toFixed(2)}
                        </span>
                      </div>
                      <div className="p-2 bg-slate-50/50 rounded border border-slate-100">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase block">Risk Tier</span>
                        <span className={`text-xs font-bold block ${
                          selectedLocation.risk_level === 'Critical' ? 'text-red-600' : selectedLocation.risk_level === 'High' ? 'text-orange-500' : 'text-slate-700'
                        }`}>
                          {selectedLocation.risk_level || "Standard"}
                        </span>
                      </div>
                    </div>
                    
                    {/* Operational Directives Reference Box */}
                    {selectedLocation.recommendation && (
                      <div className="p-3 bg-blue-50/40 rounded-lg border border-blue-100 text-xs text-slate-600">
                        <span className="font-bold text-[9px] uppercase tracking-wider text-blue-500 block mb-1">AI Tactical Directive</span>
                        {selectedLocation.recommendation}
                      </div>
                    )}

                  </div>
                ) : (
                  <div className="text-center py-8 px-2 text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-xl">
                    Click on any active map hotspot marker node to load operational dispatch metrics.
                  </div>
                )}
              </div>

              {/* Legend Summary Box */}
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs space-y-2">
                <span className="font-semibold text-slate-500 block mb-1">Density Categories:</span>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#ef4444]" /> <span>Critical Choke (&gt;10k)</span></div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#f59e0b]" /> <span>High Intensity (&gt;1k)</span></div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#2563eb]" /> <span>Moderate Dense (&gt;100)</span></div>
              </div>
            </div>

            {/* Reusable Hotspot Component Injection */}
            <div className="xl:col-span-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="w-full h-[500px] sm:h-[670px] rounded-lg overflow-hidden border border-slate-200">
                
                <HotspotMap 
                  hotspots={locations} 
                  onMarkerClick={(location) => setSelectedLocation(location)} 
                />

              </div>
            </div>

          </div>
        )}
      </div>
    </Layout>
  );
};

export default LocationMap;