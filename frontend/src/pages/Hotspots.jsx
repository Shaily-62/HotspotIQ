import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";

const Hotspots = () => {
    const [hotspots, setHotspots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        API.get("/hotspots")
            .then((res) => {
                setHotspots(res.data || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch spatial cluster telemetry:", err);
                setLoading(false);
            });
    }, []);

    const getRiskBadgeStyles = (risk) => {
        switch (risk) {
            case "Critical":
                return "bg-red-50 text-red-700 border border-red-200";
            case "High":
                return "bg-orange-50 text-orange-700 border border-orange-200";
            case "Medium":
                return "bg-amber-50 text-amber-700 border border-amber-200";
            default:
                return "bg-emerald-50 text-emerald-700 border border-emerald-200";
        }
    };

    const sortedData = [...hotspots].sort(
        (a, b) => Number(b.congestion_score || 0) - Number(a.congestion_score || 0)
    );

    // --- DYNAMIC SEARCH FILTER ---
    // Ab user area ke naam se bhi list ko globally search kar sakta hai!
    const filteredHotspots = sortedData.filter((spot) => {
        const clusterMatch = spot.cluster?.toString().includes(searchQuery);
        const recommendationMatch = spot.recommendation?.toLowerCase().includes(searchQuery.toLowerCase());
        const locationNameMatch = (spot.display_name || spot.locations || "").toLowerCase().includes(searchQuery.toLowerCase());
        
        return clusterMatch || recommendationMatch || locationNameMatch;
    });

    return (
        <Layout>
            <div className="w-full px-1 py-4 sm:px-4">

                {/* Dynamic Controls Header Group */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                            Cluster Register Terminal
                        </h1>
                        <p className="text-sm text-slate-500 mt-0.5">
                            Reviewing computed core parameters across active city sectors.
                        </p>
                    </div>

                    <div className="w-full sm:w-72">
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 text-sm">
                                🔍
                            </span>
                            <input
                                type="text"
                                placeholder="Search cluster, location, or directive..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-700 placeholder-slate-400 shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-3">
                        <div className="h-12 bg-white border border-slate-100 rounded-xl animate-pulse w-full" />
                        <div className="h-48 bg-white border border-slate-100 rounded-xl animate-pulse w-full" />
                    </div>
                ) : filteredHotspots.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200 text-slate-400 text-sm">
                        No matching hotspot registers found in the data pipeline.
                    </div>
                ) : (
                    <div>
                        {/* Desktop and Tablet Layout View */}
                        <div className="hidden md:block bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                                        <th className="p-4 font-semibold">Cluster ID</th>
                                        {/* Header renamed for clarity */}
                                        <th className="p-4 font-semibold text-center">Enforcement Location</th>
                                        <th className="p-4 font-semibold text-right">Violations</th>
                                        <th className="p-4 font-semibold text-center">Severity Index</th>
                                        <th className="p-4 font-semibold text-right">Congestion Score</th>
                                        <th className="p-4 font-semibold text-center">Risk Factor</th>
                                        <th className="p-4 font-semibold">Operational Action Protocol</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 text-sm text-slate-700">
                                    {filteredHotspots.slice(0, 50).map((spot, index) => (
                                        <tr key={`row-${index}`} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="p-4 font-mono font-medium text-slate-900">#{spot.cluster}</td>
                                            {/* DYNAMIC RENDER: Changed spot.locations to spot.display_name */}
                                            <td className="p-4 text-center text-slate-900 font-bold">
                                                {spot.display_name || `Zone Area #${spot.cluster}`}
                                            </td>
                                            <td className="p-4 text-right font-medium">{Number(spot.violations || 0).toLocaleString()}</td>
                                            <td className="p-4 text-center font-mono">{Number(spot.avg_severity || 0).toFixed(2)}</td>
                                            <td className="p-4 text-right font-bold text-slate-900 font-mono">{Number(spot.congestion_score || 0).toFixed(2)}</td>
                                            <td className="p-4 text-center">
                                                <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wide ${getRiskBadgeStyles(spot.risk_level)}`}>
                                                    {spot.risk_level || "Low"}
                                                </span>
                                            </td>
                                            <td className="p-4 text-slate-600 max-w-xs truncate" title={spot.recommendation}>
                                                {spot.recommendation}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile View Card Grid Layout */}
                        <div className="grid grid-cols-1 gap-4 md:hidden">
                            {filteredHotspots.slice(0, 50).map((spot, index) => (
                                <div
                                    key={`card-${index}`}
                                    className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 space-y-3"
                                >
                                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                                        {/* DYNAMIC TITLE ON MOBILE */}
                                        <span className="font-bold text-slate-900 text-base">
                                            {spot.display_name || `Sector Vector #${spot.cluster}`}
                                        </span>
                                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${getRiskBadgeStyles(spot.risk_level)}`}>
                                            {spot.risk_level || "Low"}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-x-2 gap-y-3 text-xs">
                                        <div>
                                            <span className="text-slate-400 font-medium block uppercase text-[9px] tracking-wider mb-0.5">Reference ID</span>
                                            <span className="text-slate-700 font-mono">Cluster #{spot.cluster}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-400 font-medium block uppercase text-[9px] tracking-wider mb-0.5">Total Tickets</span>
                                            <span className="text-slate-700 font-bold">{(spot.violations || 0).toLocaleString()}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-400 font-medium block uppercase text-[9px] tracking-wider mb-0.5">Avg Severity</span>
                                            <span className="text-slate-700 font-mono font-medium">{Number(spot.avg_severity || 0).toFixed(2)} / 5.00</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-400 font-medium block uppercase text-[9px] tracking-wider mb-0.5">Congestion Score</span>
                                            <span className="text-blue-600 font-bold font-mono">{Number(spot.congestion_score || 0).toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t border-slate-50 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                                        <span className="text-slate-400 font-bold block uppercase text-[9px] tracking-wider mb-1">
                                            Automated Enforcement Action
                                        </span>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            {spot.recommendation}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Hotspots;