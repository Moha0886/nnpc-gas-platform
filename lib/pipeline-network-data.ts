// Nigerian Gas Pipeline Network - GeoJSON Data
// Coordinates are approximate locations of major gas infrastructure

export type AssetStatus = "operational" | "partial-outage" | "under-construction" | "maintenance";
export type PipelineType = "trunk" | "flow" | "export" | "delivery";
export type AssetType = "compressor" | "processing-plant" | "metering-station" | "terminal" | "storage";

export interface PipelineProperties {
  id: string;
  name: string;
  network: string;
  pipelineType: PipelineType;
  diameter: number; // inches
  length: number; // km
  capacity: number; // MMscf/d
  currentFlow: number; // MMscf/d
  utilization: number; // %
  pressure: number; // PSI
  status: AssetStatus;
  corridor: string;
  deferment: number; // MMscf/d
}

export interface AssetProperties {
  id: string;
  name: string;
  assetType: AssetType;
  capacity: number;
  currentOutput: number;
  utilization: number;
  status: AssetStatus;
  corridor: string;
  deferment: number;
  operator: string;
}

export interface PipelineFeature {
  type: "Feature";
  geometry: {
    type: "LineString";
    coordinates: number[][];
  };
  properties: PipelineProperties;
}

export interface AssetFeature {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: number[];
  };
  properties: AssetProperties;
}

// PIPELINES - Major Nigerian Gas Transmission Lines
export const pipelines: PipelineFeature[] = [
  {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [5.7600, 5.5200], // Escravos
        [5.8900, 5.6800], // Warri area
        [6.3380, 5.6250], // Benin
        [6.5950, 6.3400], // Ajaokuta
        [7.4900, 9.0820], // Abuja
      ],
    },
    properties: {
      id: "elps",
      name: "ELPS (Escravos-Lagos Pipeline System)",
      network: "ELPS",
      pipelineType: "trunk",
      diameter: 48,
      length: 680,
      capacity: 1200,
      currentFlow: 850.5,
      utilization: 70.9,
      pressure: 1233,
      status: "operational",
      corridor: "Eastern",
      deferment: 0,
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [7.4900, 9.0820], // Abuja (Ajaokuta)
        [8.5200, 11.9950], // Kaduna
        [11.9680, 13.1580], // Kano
      ],
    },
    properties: {
      id: "akk",
      name: "AKK (Ajaokuta-Kaduna-Kano)",
      network: "AKK",
      pipelineType: "trunk",
      diameter: 40,
      length: 614,
      capacity: 2200,
      currentFlow: 450.0,
      utilization: 20.5,
      pressure: 1180,
      status: "under-construction",
      corridor: "Northern",
      deferment: 0,
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [4.7523, 6.9270], // Oben
        [5.7600, 5.5200], // Escravos area
      ],
    },
    properties: {
      id: "ob3",
      name: "OB3 (Oben-Escravos Pipeline)",
      network: "OB3",
      pipelineType: "trunk",
      diameter: 36,
      length: 120,
      capacity: 660,
      currentFlow: 520.3,
      utilization: 78.8,
      pressure: 1150,
      status: "operational",
      corridor: "Eastern",
      deferment: 25.0,
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [6.9580, 5.4520], // Obiafu
        [6.8200, 5.2800], // Obrikom
        [5.0800, 5.5300], // Forcados Terminal
      ],
    },
    properties: {
      id: "trans-forcados",
      name: "Trans-Forcados Pipeline",
      network: "Trans-Forcados",
      pipelineType: "export",
      diameter: 32,
      length: 180,
      capacity: 450,
      currentFlow: 320.8,
      utilization: 71.3,
      pressure: 1100,
      status: "operational",
      corridor: "Western",
      deferment: 0,
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [6.9580, 5.4520], // Obiafu
        [7.2800, 5.1200], // Rumuekpe
        [7.0330, 4.8160], // Bonny NLNG
      ],
    },
    properties: {
      id: "trans-niger",
      name: "Trans-Niger Pipeline",
      network: "Trans-Niger",
      pipelineType: "export",
      diameter: 48,
      length: 150,
      capacity: 2000,
      currentFlow: 1650.2,
      utilization: 82.5,
      pressure: 1280,
      status: "operational",
      corridor: "Eastern",
      deferment: 50.0,
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [3.3900, 6.4550], // Lagos (Ijora)
        [3.6000, 6.6000], // Ikeja area
        [3.9500, 7.3800], // Abeokuta
      ],
    },
    properties: {
      id: "lagos-network",
      name: "Lagos Gas Distribution Network",
      network: "Lagos",
      pipelineType: "delivery",
      diameter: 24,
      length: 85,
      capacity: 350,
      currentFlow: 285.5,
      utilization: 81.6,
      pressure: 950,
      status: "operational",
      corridor: "Lagos",
      deferment: 0,
    },
  },
];

// COMPRESSOR STATIONS
export const compressorStations: AssetFeature[] = [
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [6.3380, 5.6250], // Benin
    },
    properties: {
      id: "cs-benin",
      name: "Benin Compressor Station",
      assetType: "compressor",
      capacity: 1200,
      currentOutput: 850,
      utilization: 70.8,
      status: "operational",
      corridor: "Eastern",
      deferment: 0,
      operator: "NGIC",
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [6.5950, 6.3400], // Ajaokuta
    },
    properties: {
      id: "cs-ajaokuta",
      name: "Ajaokuta Compressor Station",
      assetType: "compressor",
      capacity: 2200,
      currentOutput: 450,
      utilization: 20.5,
      status: "under-construction",
      corridor: "Northern",
      deferment: 0,
      operator: "NGIC",
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [8.5200, 11.9950], // Kaduna
    },
    properties: {
      id: "cs-kaduna",
      name: "Kaduna Compressor Station",
      assetType: "compressor",
      capacity: 2200,
      currentOutput: 0,
      utilization: 0,
      status: "under-construction",
      corridor: "Northern",
      deferment: 0,
      operator: "NGIC",
    },
  },
];

// GAS PROCESSING PLANTS
export const processingPlants: AssetFeature[] = [
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [5.7600, 5.5200], // Escravos
    },
    properties: {
      id: "plant-escravos",
      name: "Escravos Gas Plant",
      assetType: "processing-plant",
      capacity: 1200,
      currentOutput: 980,
      utilization: 81.7,
      status: "operational",
      corridor: "Eastern",
      deferment: 0,
      operator: "Chevron",
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [4.7523, 6.9270], // Oben
    },
    properties: {
      id: "plant-oben",
      name: "Oben Gas Plant",
      assetType: "processing-plant",
      capacity: 660,
      currentOutput: 545,
      utilization: 82.6,
      status: "operational",
      corridor: "Eastern",
      deferment: 25.0,
      operator: "SPDC",
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [6.9580, 5.4520], // Obiafu
    },
    properties: {
      id: "plant-obiafu",
      name: "Obiafu Gas Plant",
      assetType: "processing-plant",
      capacity: 800,
      currentOutput: 720,
      utilization: 90.0,
      status: "operational",
      corridor: "Western",
      deferment: 0,
      operator: "Total",
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [7.0330, 4.8160], // Bonny
    },
    properties: {
      id: "plant-bonny",
      name: "Bonny Gas Plant (NLNG Feed)",
      assetType: "processing-plant",
      capacity: 2500,
      currentOutput: 2150,
      utilization: 86.0,
      status: "operational",
      corridor: "Eastern",
      deferment: 50.0,
      operator: "NLNG",
    },
  },
];

// METERING STATIONS
export const meteringStations: AssetFeature[] = [
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [3.3900, 6.4550], // Lagos Ijora
    },
    properties: {
      id: "meter-ijora",
      name: "Ijora Metering Station",
      assetType: "metering-station",
      capacity: 350,
      currentOutput: 285,
      utilization: 81.4,
      status: "operational",
      corridor: "Lagos",
      deferment: 0,
      operator: "Gaslink",
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [5.8900, 5.6800], // Warri
    },
    properties: {
      id: "meter-warri",
      name: "Warri Metering Station",
      assetType: "metering-station",
      capacity: 450,
      currentOutput: 380,
      utilization: 84.4,
      status: "operational",
      corridor: "Eastern",
      deferment: 0,
      operator: "NGIC",
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [7.4900, 9.0820], // Abuja
    },
    properties: {
      id: "meter-abuja",
      name: "Abuja Metering Station",
      assetType: "metering-station",
      capacity: 600,
      currentOutput: 420,
      utilization: 70.0,
      status: "operational",
      corridor: "Northern",
      deferment: 0,
      operator: "NGIC",
    },
  },
];

// TERMINALS
export const terminals: AssetFeature[] = [
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [7.0330, 4.8160], // Bonny
    },
    properties: {
      id: "terminal-bonny",
      name: "Bonny LNG Terminal",
      assetType: "terminal",
      capacity: 22000,
      currentOutput: 18700,
      utilization: 85.0,
      status: "operational",
      corridor: "Eastern",
      deferment: 0,
      operator: "NLNG",
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [5.0800, 5.5300], // Forcados
    },
    properties: {
      id: "terminal-forcados",
      name: "Forcados Export Terminal",
      assetType: "terminal",
      capacity: 450,
      currentOutput: 320,
      utilization: 71.1,
      status: "operational",
      corridor: "Western",
      deferment: 0,
      operator: "SPDC",
    },
  },
];

// STORAGE FACILITIES
export const storageFacilities: AssetFeature[] = [
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [3.6000, 6.6000], // Ikeja
    },
    properties: {
      id: "storage-ikeja",
      name: "Ikeja Gas Storage Facility",
      assetType: "storage",
      capacity: 500,
      currentOutput: 350,
      utilization: 70.0,
      status: "operational",
      corridor: "Lagos",
      deferment: 0,
      operator: "Gaslink",
    },
  },
];

// Combined assets for map rendering
export const allAssets: AssetFeature[] = [
  ...compressorStations,
  ...processingPlants,
  ...meteringStations,
  ...terminals,
  ...storageFacilities,
];

// Network definitions for filtering
export const networks = [
  { id: "ELPS", name: "ELPS", color: "#0172CB" },
  { id: "AKK", name: "AKK", color: "#9333EA" },
  { id: "OB3", name: "OB3", color: "#F59E0B" },
  { id: "Trans-Forcados", name: "Trans-Forcados", color: "#10B981" },
  { id: "Trans-Niger", name: "Trans-Niger", color: "#EF4444" },
  { id: "Lagos", name: "Lagos Network", color: "#3B82F6" },
];

// Calculate total deferment
export const getTotalDeferment = () => {
  const pipelineDeferment = pipelines.reduce((sum, p) => sum + p.properties.deferment, 0);
  const assetDeferment = allAssets.reduce((sum, a) => sum + a.properties.deferment, 0);
  return pipelineDeferment + assetDeferment;
};

// Get assets by status
export const getAssetsByStatus = (status: AssetStatus) => {
  return allAssets.filter((asset) => asset.properties.status === status);
};

// Get pipelines by network
export const getPipelinesByNetwork = (network: string) => {
  return pipelines.filter((pipeline) => pipeline.properties.network === network);
};
