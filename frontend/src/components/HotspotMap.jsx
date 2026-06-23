import { MapContainer, TileLayer, CircleMarker, Popup, ScaleControl, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const HotspotMap = ({ hotspots = [], onMarkerClick }) => {

  const getMarkerStyle = (violations) => {
    const computedRadius = Math.max(6, Math.min(35, Math.sqrt(violations) * 0.35));

    if (violations > 10000) {
      return {
        color: "#b91c1c",
        fillColor: "#ef4444",
        radius: computedRadius + 8,
        weight: 3,
        dashArray: "5, 7"
      };
    }
    if (violations > 1000) {
      return {
        color: "#c2410c",
        fillColor: "#f97316",
        radius: computedRadius + 4,
        weight: 2,
        dashArray: null
      };
    }
    return {
      color: "#1d4ed8",
      fillColor: "#3b82f6",
      radius: computedRadius,
      weight: 1.5,
      dashArray: null
    };
  };

  return (
    <MapContainer
      center={[12.9716, 77.5946]}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      {hotspots.map((location, index) => {
        const count = Number(location.violation_count || location.violations || 0);
        const config = getMarkerStyle(count);
        const isHighRisk = count > 1000;
        
        // DYNAMIC ROOT: Read directly from backend computed payload key
        const areaName = location.display_name || `Sector Area #${location.cluster || index}`;

        return (
          <CircleMarker
            key={`marker-${index}`}
            center={[Number(location.latitude), Number(location.longitude)]}
            radius={config.radius}
            fillColor={config.fillColor}
            color={config.color}
            weight={config.weight}
            dashArray={config.dashArray}
            fillOpacity={isHighRisk ? 0.75 : 0.45}
            eventHandlers={{
              click: () => {
                if (onMarkerClick) onMarkerClick(location);
              }
            }}
          >
            <Tooltip 
              permanent={false} 
              direction="top" 
              offset={[0, -config.radius / 2]}
              className="bg-slate-950 border-l-4 border-red-500 text-white font-sans text-[11px] px-2 py-1 rounded shadow-xl font-medium border-none"
            >
              <div className="flex flex-col tracking-wide">
                <span className="font-bold text-amber-400">{areaName}</span>
                <span className="text-[10px] text-slate-200 font-mono mt-0.5">
                  {count.toLocaleString()} violations
                </span>
              </div>
            </Tooltip>

            <Popup>
              <div className="font-sans text-xs p-1 space-y-2 min-w-[210px]">
                <div className="flex flex-col border-b border-slate-100 pb-1.5">
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold block">Enforcement Jurisdiction</span>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    {areaName}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono italic">
                    Base Reference: Cluster #{location.cluster}
                  </span>
                </div>

                <div className="space-y-1 text-slate-600">
                  <p>
                    Violations:{" "}
                    <strong className={isHighRisk ? "text-red-600 text-sm font-black" : "text-slate-900"}>
                      {count.toLocaleString()}
                    </strong>
                  </p>
                </div>

                <div className="p-2 rounded text-[11px] font-medium leading-relaxed bg-red-50 border border-red-100 text-red-800">
                  🚨 <span className="font-bold">Dispatch Order:</span> Deploy units to <span className="underline font-bold">{areaName}</span> immediately. High citation rate hotspot.
                </div>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
      <ScaleControl position="bottomright" />
    </MapContainer>
  );
};

export default HotspotMap;