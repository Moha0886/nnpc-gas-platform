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
  lightPreset?: "day" | "night" | "dusk" | "dawn";
  activeNetworks?: string[];
}

export default function PipelineMap({
  onAssetClick,
  lightPreset = "day",
  activeNetworks: externalActiveNetworks
}: PipelineMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const activeNetworks = externalActiveNetworks || networks.map((n) => n.id);

  const [baseMapStyle, setBaseMapStyle] = useState<"streets" | "satellite">("streets");

  // Map styles based on light preset and base style
  const mapStyles = {
    streets: {
      day: "mapbox://styles/mapbox/light-v11",
      night: "mapbox://styles/mapbox/dark-v11",
      dusk: "mapbox://styles/mapbox/navigation-night-v1",
      dawn: "mapbox://styles/mapbox/outdoors-v12",
    },
    satellite: {
      day: "mapbox://styles/mapbox/satellite-streets-v12",
      night: "mapbox://styles/mapbox/satellite-streets-v12",
      dusk: "mapbox://styles/mapbox/satellite-streets-v12",
      dawn: "mapbox://styles/mapbox/satellite-streets-v12",
    },
  };
  const mapStyle = mapStyles[baseMapStyle][lightPreset];

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [8.6753, 9.0820], // Center on Nigeria (more accurate)
      zoom: 5.5,
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

  // Update map style when light preset or base style changes
  useEffect(() => {
    if (map.current && mapLoaded) {
      map.current.setStyle(mapStyle);
      map.current.once("styledata", () => {
        addPipelines();
        addAssets();
        addIncidents();
      });
    }
  }, [lightPreset, baseMapStyle, mapStyle, mapLoaded]);

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
      el.style.cursor = "pointer";
      el.style.transition = "filter 0.2s";

      // Color based on status
      const statusColors = {
        operational: "#00AD51",
        "partial-outage": "#F59E0B",
        maintenance: "#FFBF00",
        "under-construction": "#BD1B00",
      };
      const color = statusColors[status];

      // SVG icons based on asset type
      const assetIcons: Record<string, string> = {
        compressor: `
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" fill="${color}" stroke="white" stroke-width="2"/>
            <path d="M16 10v12m-4-8l4-4 4 4m-4 8l-4-4m8 0l-4 4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `,
        "processing-plant": `
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="16" fill="${color}" stroke="white" stroke-width="2.5"/>
            <rect x="10" y="14" width="4" height="10" fill="white" rx="1"/>
            <rect x="16" y="11" width="4" height="13" fill="white" rx="1"/>
            <rect x="22" y="14" width="4" height="10" fill="white" rx="1"/>
            <path d="M12 11v3m4-3v3m4-3v3" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        `,
        "metering-station": `
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <circle cx="15" cy="15" r="13" fill="${color}" stroke="white" stroke-width="2"/>
            <rect x="9" y="9" width="12" height="12" stroke="white" stroke-width="1.5" fill="none" rx="1"/>
            <path d="M9 13h12M9 17h12M13 9v12M17 9v12" stroke="white" stroke-width="1"/>
          </svg>
        `,
        terminal: `
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" fill="${color}" stroke="white" stroke-width="2"/>
            <rect x="8" y="12" width="16" height="8" stroke="white" stroke-width="1.5" fill="none" rx="1"/>
            <path d="M12 15l2 2-2 2m4-4h4" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `,
        storage: `
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" fill="${color}" stroke="white" stroke-width="2"/>
            <ellipse cx="16" cy="13" rx="7" ry="3" fill="white"/>
            <path d="M9 13v6c0 1.66 3.13 3 7 3s7-1.34 7-3v-6" stroke="white" stroke-width="1.5" fill="none"/>
          </svg>
        `,
        "power-plant": `
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
            <circle cx="17" cy="17" r="15" fill="${color}" stroke="white" stroke-width="2.5"/>
            <path d="M19 9l-6 10h6l-2 8 8-11h-6l4-7z" fill="white" stroke="white" stroke-width="0.5"/>
          </svg>
        `,
        "industrial": `
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" fill="${color}" stroke="white" stroke-width="2"/>
            <path d="M10 22V14l4 4V14l4 4V10h4v12H10z" fill="white"/>
          </svg>
        `,
        "city-gate": `
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <circle cx="15" cy="15" r="13" fill="${color}" stroke="white" stroke-width="2"/>
            <path d="M9 20V13l6-4 6 4v7" stroke="white" stroke-width="1.5" fill="none" stroke-linecap="round"/>
            <rect x="13" y="16" width="4" height="4" fill="white"/>
          </svg>
        `,
      };

      el.innerHTML = assetIcons[assetType] || `
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="12" fill="${color}" stroke="white" stroke-width="2"/>
          <circle cx="14" cy="14" r="4" fill="white"/>
        </svg>
      `;

      // Add hover effect
      el.addEventListener("mouseenter", () => {
        el.style.filter = "brightness(1.2) drop-shadow(0 0 8px rgba(0,0,0,0.3))";
        el.style.zIndex = "1000";
      });
      el.addEventListener("mouseleave", () => {
        el.style.filter = "";
        el.style.zIndex = "auto";
      });

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
  }, [activeNetworks, mapLoaded, externalActiveNetworks]);

  return (
    <div className="relative w-full h-full">
      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Map Style Switcher */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg overflow-hidden z-10">
        <button
          onClick={() => setBaseMapStyle("streets")}
          className={`px-4 py-2 text-sm font-medium transition-all ${
            baseMapStyle === "streets"
              ? "bg-primary text-white"
              : "bg-white text-ink hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Streets
          </div>
        </button>
        <button
          onClick={() => setBaseMapStyle("satellite")}
          className={`px-4 py-2 text-sm font-medium transition-all ${
            baseMapStyle === "satellite"
              ? "bg-primary text-white"
              : "bg-white text-ink hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Satellite
          </div>
        </button>
      </div>
    </div>
  );
}
