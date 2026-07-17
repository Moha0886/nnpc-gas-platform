"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  pipelines,
  allAssets,
  networks,
  getTotalDeferment,
  getAssetsByStatus,
  type AssetStatus,
  type PipelineFeature,
  type AssetFeature,
} from "@/lib/pipeline-network-data";
import { getActiveIncidents, type Incident } from "@/lib/incident-data";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

interface PipelineMapProps {
  onAssetClick?: (assetId: string) => void;
}

export default function PipelineMap({ onAssetClick }: PipelineMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeNetworks, setActiveNetworks] = useState<string[]>(
    networks.map((n) => n.id)
  );
  const [mapStyle, setMapStyle] = useState("mapbox://styles/mapbox/light-v11");
  const [lightPreset, setLightPreset] = useState<"day" | "night" | "dusk" | "dawn">("day");

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [6.5, 6.5], // Center on Nigeria
      zoom: 6,
      pitch: 45, // 3D tilt
      bearing: 0,
    });

    map.current.on("load", () => {
      setMapLoaded(true);

      // Add navigation controls
      map.current!.addControl(new mapboxgl.NavigationControl(), "top-right");

      // Add pipelines
      addPipelines();

      // Add assets
      addAssets();

      // Add incident markers
      addIncidents();
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update map style
  useEffect(() => {
    if (map.current && mapLoaded) {
      map.current.setStyle(mapStyle);
      map.current.once("styledata", () => {
        addPipelines();
        addAssets();
        addIncidents();
      });
    }
  }, [mapStyle]);

  // Add pipeline layers
  const addPipelines = () => {
    if (!map.current) return;

    // Add pipeline source
    if (!map.current.getSource("pipelines")) {
      map.current.addSource("pipelines", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: pipelines,
        },
      });
    }

    // Pipeline layers by type
    const pipelineTypes = [
      { type: "trunk", color: "#0172CB", width: 4, dasharray: [2, 2] },
      { type: "export", color: "#EF4444", width: 3.5, dasharray: null },
      { type: "delivery", color: "#10B981", width: 3, dasharray: null },
      { type: "flow", color: "#F59E0B", width: 2.5, dasharray: null },
    ];

    pipelineTypes.forEach(({ type, color, width, dasharray }) => {
      const layerId = `pipeline-${type}`;

      if (!map.current!.getLayer(layerId)) {
        map.current!.addLayer({
          id: layerId,
          type: "line",
          source: "pipelines",
          filter: ["==", ["get", "pipelineType"], type],
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": [
              "case",
              ["==", ["get", "status"], "operational"],
              color,
              ["==", ["get", "status"], "partial-outage"],
              "#F59E0B",
              ["==", ["get", "status"], "maintenance"],
              "#FFBF00",
              "#BD1B00", // under-construction
            ],
            "line-width": width,
            "line-opacity": [
              "case",
              ["in", ["get", "network"], ["literal", activeNetworks]],
              0.9,
              0.2,
            ],
            ...(dasharray && { "line-dasharray": dasharray }),
          },
        });

        // Add click handler
        map.current!.on("click", layerId, (e) => {
          if (e.features && e.features[0]) {
            const feature = e.features[0] as any;
            const props = feature.properties;

            new mapboxgl.Popup()
              .setLngLat(e.lngLat)
              .setHTML(`
                <div class="p-3">
                  <h3 class="font-bold text-sm mb-2">${props.name}</h3>
                  <div class="text-xs space-y-1">
                    <div><span class="text-ink/60">Network:</span> <span class="font-medium">${props.network}</span></div>
                    <div><span class="text-ink/60">Status:</span> <span class="font-medium capitalize">${props.status.replace("-", " ")}</span></div>
                    <div><span class="text-ink/60">Flow:</span> <span class="font-medium">${props.currentFlow} / ${props.capacity} MMscf/d</span></div>
                    <div><span class="text-ink/60">Utilization:</span> <span class="font-medium">${props.utilization}%</span></div>
                    <div><span class="text-ink/60">Pressure:</span> <span class="font-medium">${props.pressure} PSI</span></div>
                    ${props.deferment > 0 ? `<div class="text-alert"><span class="text-ink/60">Deferment:</span> <span class="font-medium">${props.deferment} MMscf/d</span></div>` : ""}
                  </div>
                </div>
              `)
              .addTo(map.current!);
          }
        });

        // Change cursor on hover
        map.current!.on("mouseenter", layerId, () => {
          map.current!.getCanvas().style.cursor = "pointer";
        });
        map.current!.on("mouseleave", layerId, () => {
          map.current!.getCanvas().style.cursor = "";
        });
      }
    });
  };

  // Add asset markers
  const addAssets = () => {
    if (!map.current) return;

    allAssets.forEach((asset) => {
      const { id, name, assetType, status, currentOutput, capacity, utilization, deferment } = asset.properties;

      // Create custom marker element
      const el = document.createElement("div");
      el.className = "asset-marker";
      el.style.width = "24px";
      el.style.height = "24px";
      el.style.borderRadius = "50%";
      el.style.cursor = "pointer";
      el.style.border = "2px solid white";
      el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";

      // Color based on status
      const statusColors = {
        operational: "#00AD51",
        "partial-outage": "#F59E0B",
        maintenance: "#FFBF00",
        "under-construction": "#BD1B00",
      };
      el.style.backgroundColor = statusColors[status];

      // Icon based on asset type
      const assetIcons: Record<string, string> = {
        compressor: "⚙️",
        "processing-plant": "🏭",
        "metering-station": "📊",
        terminal: "🚢",
        storage: "🛢️",
      };
      el.innerHTML = `<div style="font-size: 12px; text-align: center; line-height: 20px;">${assetIcons[assetType] || "📍"}</div>`;

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-3">
          <h3 class="font-bold text-sm mb-2">${name}</h3>
          <div class="text-xs space-y-1">
            <div><span class="text-ink/60">Type:</span> <span class="font-medium capitalize">${assetType.replace("-", " ")}</span></div>
            <div><span class="text-ink/60">Status:</span> <span class="font-medium capitalize">${status.replace("-", " ")}</span></div>
            <div><span class="text-ink/60">Output:</span> <span class="font-medium">${currentOutput} / ${capacity} MMscf/d</span></div>
            <div><span class="text-ink/60">Utilization:</span> <span class="font-medium">${utilization}%</span></div>
            ${deferment > 0 ? `<div class="text-alert"><span class="text-ink/60">Deferment:</span> <span class="font-medium">${deferment} MMscf/d</span></div>` : ""}
          </div>
        </div>
      `);

      // Add marker to map
      new mapboxgl.Marker(el)
        .setLngLat(asset.geometry.coordinates as [number, number])
        .setPopup(popup)
        .addTo(map.current!);

      // Click handler
      el.addEventListener("click", () => {
        onAssetClick?.(id);
      });
    });
  };

  // Add incident markers
  const addIncidents = () => {
    if (!map.current) return;

    const activeIncidents = getActiveIncidents();

    activeIncidents.forEach((incident) => {
      // Create incident marker element
      const el = document.createElement("div");
      el.className = "incident-marker";
      el.style.width = "32px";
      el.style.height = "32px";
      el.style.borderRadius = "50%";
      el.style.cursor = "pointer";
      el.style.border = "3px solid white";
      el.style.boxShadow = "0 3px 6px rgba(0,0,0,0.4)";
      el.style.display = "flex";
      el.style.alignItems = "center";
      el.style.justifyContent = "center";
      el.style.fontSize = "16px";
      el.style.animation = "pulse 2s infinite";

      // Color and icon based on severity
      const severityStyles = {
        critical: { bg: "#BD1B00", icon: "⚠️" },
        high: { bg: "#D98E04", icon: "⚠️" },
        medium: { bg: "#0D5EBA", icon: "ℹ️" },
        low: { bg: "#00246B", icon: "ℹ️" },
      };
      const style = severityStyles[incident.severity];
      el.style.backgroundColor = style.bg;
      el.innerHTML = style.icon;

      // Create detailed popup
      const statusBadges = {
        open: '<span class="bg-alert/20 text-alert px-2 py-0.5 rounded text-xs">Open</span>',
        "under-investigation": '<span class="bg-flare/20 text-flare px-2 py-0.5 rounded text-xs">Investigating</span>',
        resolved: '<span class="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs">Resolved</span>',
        closed: '<span class="bg-secondary/20 text-secondary px-2 py-0.5 rounded text-xs">Closed</span>',
      };

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-3 max-w-sm">
          <div class="flex items-start justify-between gap-2 mb-2">
            <h3 class="font-bold text-sm text-alert">${incident.title}</h3>
            ${statusBadges[incident.status]}
          </div>
          <div class="text-xs space-y-1 mb-3">
            <div><span class="text-ink/60">Facility:</span> <span class="font-medium">${incident.facilityName}</span></div>
            <div><span class="text-ink/60">Category:</span> <span class="font-medium capitalize">${incident.category.replace("-", " ")}</span></div>
            <div><span class="text-ink/60">Date:</span> <span class="font-medium">${new Date(incident.dateOccurred).toLocaleDateString()}</span></div>
            ${incident.deferment > 0 ? `<div class="text-alert"><span class="text-ink/60">Deferment:</span> <span class="font-medium">${incident.deferment} MMscf/d</span></div>` : ""}
          </div>
          <p class="text-xs text-ink/70">${incident.description.substring(0, 120)}...</p>
        </div>
      `);

      // Add marker to map
      new mapboxgl.Marker(el)
        .setLngLat(incident.location.coordinates)
        .setPopup(popup)
        .addTo(map.current!);
    });

    // Add CSS for pulse animation
    const style = document.createElement("style");
    style.textContent = `
      @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.8; transform: scale(1.1); }
      }
    `;
    if (!document.querySelector('style[data-incident-pulse]')) {
      style.setAttribute('data-incident-pulse', 'true');
      document.head.appendChild(style);
    }
  };

  // Toggle network visibility
  const toggleNetwork = (networkId: string) => {
    setActiveNetworks((prev) =>
      prev.includes(networkId)
        ? prev.filter((id) => id !== networkId)
        : [...prev, networkId]
    );
  };

  // Fly to network
  const flyToNetwork = (networkId: string) => {
    const networkPipelines = pipelines.filter(
      (p) => p.properties.network === networkId
    );
    if (networkPipelines.length > 0 && map.current) {
      const coords = networkPipelines[0].geometry.coordinates;
      const midpoint = coords[Math.floor(coords.length / 2)];
      map.current.flyTo({
        center: midpoint as [number, number],
        zoom: 8,
        duration: 2000,
      });
    }
  };

  // Update pipeline visibility based on active networks
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    ["trunk", "export", "delivery", "flow"].forEach((type) => {
      const layerId = `pipeline-${type}`;
      if (map.current!.getLayer(layerId)) {
        map.current!.setPaintProperty(layerId, "line-opacity", [
          "case",
          ["in", ["get", "network"], ["literal", activeNetworks]],
          0.9,
          0.2,
        ]);
      }
    });
  }, [activeNetworks, mapLoaded]);

  return (
    <div className="relative w-full h-full">
      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Map Controls */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 space-y-4 max-w-xs">
        <div>
          <h3 className="font-bold text-sm mb-2">Map Style</h3>
          <div className="flex gap-2 flex-wrap">
            {[
              { name: "Light", value: "mapbox://styles/mapbox/light-v11" },
              { name: "Dark", value: "mapbox://styles/mapbox/dark-v11" },
              { name: "Satellite", value: "mapbox://styles/mapbox/satellite-streets-v12" },
            ].map((style) => (
              <button
                key={style.value}
                onClick={() => setMapStyle(style.value)}
                className={`px-3 py-1 text-xs rounded ${
                  mapStyle === style.value
                    ? "bg-primary text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {style.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-sm mb-2">Networks</h3>
          <div className="space-y-2">
            {networks.map((network) => (
              <div key={network.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`network-${network.id}`}
                  checked={activeNetworks.includes(network.id)}
                  onChange={() => toggleNetwork(network.id)}
                  className="rounded"
                />
                <label
                  htmlFor={`network-${network.id}`}
                  className="text-xs flex-1 cursor-pointer"
                >
                  {network.name}
                </label>
                <button
                  onClick={() => flyToNetwork(network.id)}
                  className="text-xs text-primary hover:underline"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
