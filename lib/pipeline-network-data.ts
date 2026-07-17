// Nigerian Domestic Gas Pipeline Network - Accurate GeoJSON Data
// Based on NNPC/NGPTC infrastructure as of 2026

export type AssetStatus = "operational" | "partial-outage" | "under-construction" | "maintenance";
export type PipelineType = "trunk" | "flow" | "export" | "delivery";
export type AssetType =
  | "compressor"
  | "processing-plant"
  | "metering-station"
  | "terminal"
  | "storage"
  | "power-plant"
  | "industrial"
  | "city-gate";

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

// ============================================================================
// DOMESTIC GAS PIPELINES - Major Nigerian Transmission Lines
// ============================================================================

export const pipelines: PipelineFeature[] = [
  // 1. ELPS (Escravos-Lagos Pipeline System) - Western Network
  {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [5.2010, 5.6113], // Escravos Gas Plant
        [5.7603, 5.5442], // Warri
        [5.9938, 5.5002], // Ughelli/Delta
        [5.6250, 6.3380], // Benin
        [3.2500, 6.8800], // Ogun State
        [3.3500, 6.6500], // Itoki, Lagos
      ],
    },
    properties: {
      id: "elps",
      name: "ELPS (Escravos-Lagos Pipeline System)",
      network: "ELPS",
      pipelineType: "trunk",
      diameter: 36,
      length: 340,
      capacity: 2200,
      currentFlow: 1850.5,
      utilization: 84.1,
      pressure: 1250,
      status: "operational",
      corridor: "Western",
      deferment: 0,
    },
  },

  // 2. OB3 (Obiafu-Obrikom-Oben) - East-West Connector
  {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [6.8200, 5.2800], // Obiafu-Obrikom, Rivers
        [6.9580, 5.4520], // Obite area
        [5.9000, 5.7000], // Oben, Delta/Edo
      ],
    },
    properties: {
      id: "ob3",
      name: "OB3 (Obiafu-Obrikom-Oben)",
      network: "OB3",
      pipelineType: "trunk",
      diameter: 48,
      length: 127,
      capacity: 2000,
      currentFlow: 1620.3,
      utilization: 81.0,
      pressure: 1300,
      status: "operational",
      corridor: "Eastern",
      deferment: 0,
    },
  },

  // 3. Oben-Geregu Pipeline - Northern Supply Route
  {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [5.9000, 5.7000], // Oben
        [6.5950, 6.3400], // Ajaokuta
        [7.3000, 7.8000], // Geregu, Kogi
      ],
    },
    properties: {
      id: "oben-geregu",
      name: "Oben-Geregu Pipeline",
      network: "Oben-Geregu",
      pipelineType: "trunk",
      diameter: 36,
      length: 196,
      capacity: 1200,
      currentFlow: 850.0,
      utilization: 70.8,
      pressure: 1180,
      status: "operational",
      corridor: "Northern",
      deferment: 0,
    },
  },

  // 4. AKK (Ajaokuta-Kaduna-Kano) - Northern Network
  {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [6.5950, 6.3400], // Ajaokuta
        [7.3986, 9.0765], // Abuja
        [7.4400, 10.5200], // Kaduna
        [8.4300, 11.1100], // Zaria
        [8.5200, 12.0000], // Kano
      ],
    },
    properties: {
      id: "akk",
      name: "AKK (Ajaokuta-Kaduna-Kano)",
      network: "AKK",
      pipelineType: "trunk",
      diameter: 40,
      length: 614,
      capacity: 3500,
      currentFlow: 450.0,
      utilization: 12.9,
      pressure: 1200,
      status: "under-construction",
      corridor: "Northern",
      deferment: 0,
    },
  },

  // 5. Alakiri-Obigbo-Ikot Abasi - Eastern Network
  {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [7.0100, 4.7500], // Alakiri, Rivers
        [7.3500, 5.0600], // Obigbo, Rivers
        [7.5400, 4.5700], // Ikot Abasi, Akwa Ibom
      ],
    },
    properties: {
      id: "alakiri-obigbo",
      name: "Alakiri-Obigbo-Ikot Abasi Pipeline",
      network: "Eastern",
      pipelineType: "trunk",
      diameter: 24,
      length: 117,
      capacity: 395,
      currentFlow: 320.5,
      utilization: 81.1,
      pressure: 1050,
      status: "operational",
      corridor: "Eastern",
      deferment: 0,
    },
  },

  // 6. ANOH-OB3 CTMS Pipeline
  {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [7.0300, 5.4800], // ANOH, Imo State
        [6.8200, 5.2800], // OB3 CTMS Junction
      ],
    },
    properties: {
      id: "anoh-ob3",
      name: "ANOH-OB3 CTMS Pipeline",
      network: "ANOH",
      pipelineType: "delivery",
      diameter: 36,
      length: 23,
      capacity: 500,
      currentFlow: 280.0,
      utilization: 56.0,
      pressure: 1100,
      status: "operational",
      corridor: "Eastern",
      deferment: 0,
    },
  },

  // 7. Trans-Niger Pipeline (to NLNG)
  {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [6.9580, 5.4520], // Obiafu
        [7.2800, 5.1200], // Rumuekpe
        [7.1616, 4.4184], // Bonny NLNG
      ],
    },
    properties: {
      id: "trans-niger",
      name: "Trans-Niger Pipeline (NLNG Feed)",
      network: "Trans-Niger",
      pipelineType: "export",
      diameter: 48,
      length: 150,
      capacity: 2000,
      currentFlow: 1750.2,
      utilization: 87.5,
      pressure: 1280,
      status: "operational",
      corridor: "Eastern",
      deferment: 50.0,
    },
  },

  // 8. Lagos Gas Distribution Network
  {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [3.3900, 6.4550], // Ijora, Lagos
        [3.3616, 6.5964], // Ikeja
        [3.3500, 6.6500], // Itoki Terminal
      ],
    },
    properties: {
      id: "lagos-network",
      name: "Lagos Gas Distribution Network",
      network: "Lagos",
      pipelineType: "delivery",
      diameter: 24,
      length: 45,
      capacity: 450,
      currentFlow: 380.5,
      utilization: 84.6,
      pressure: 980,
      status: "operational",
      corridor: "Lagos",
      deferment: 0,
    },
  },
];

// ============================================================================
// GAS PROCESSING PLANTS
// ============================================================================

export const processingPlants: AssetFeature[] = [
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [5.2010, 5.6113],
    },
    properties: {
      id: "plant-escravos",
      name: "Escravos Gas Plant",
      assetType: "processing-plant",
      capacity: 680,
      currentOutput: 620,
      utilization: 91.2,
      status: "operational",
      corridor: "Western",
      deferment: 0,
      operator: "Chevron Nigeria Limited",
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [5.9367, 5.5145],
    },
    properties: {
      id: "plant-utorogu",
      name: "Utorogu Gas Plant",
      assetType: "processing-plant",
      capacity: 300,
      currentOutput: 265,
      utilization: 88.3,
      status: "operational",
      corridor: "Western",
      deferment: 0,
      operator: "ND Western/NPDC JV",
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [5.9000, 5.7000],
    },
    properties: {
      id: "plant-oben",
      name: "Oben Gas Plant",
      assetType: "processing-plant",
      capacity: 525,
      currentOutput: 480,
      utilization: 91.4,
      status: "operational",
      corridor: "Eastern",
      deferment: 0,
      operator: "Seplat Energy",
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [6.9580, 5.4520],
    },
    properties: {
      id: "plant-obiafu",
      name: "Obiafu Gas Plant",
      assetType: "processing-plant",
      capacity: 800,
      currentOutput: 720,
      utilization: 90.0,
      status: "operational",
      corridor: "Eastern",
      deferment: 0,
      operator: "TotalEnergies E&P Nigeria",
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [7.1616, 4.4184],
    },
    properties: {
      id: "plant-bonny",
      name: "Bonny NLNG Plant",
      assetType: "processing-plant",
      capacity: 22000,
      currentOutput: 18700,
      utilization: 85.0,
      status: "operational",
      corridor: "Eastern",
      deferment: 0,
      operator: "NLNG Limited",
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [7.0300, 5.4800],
    },
    properties: {
      id: "plant-anoh",
      name: "ANOH Gas Processing Plant",
      assetType: "processing-plant",
      capacity: 300,
      currentOutput: 280,
      utilization: 93.3,
      status: "operational",
      corridor: "Eastern",
      deferment: 0,
      operator: "AGPC (Seplat/NGC JV)",
    },
  },
];

// ============================================================================
// POWER PLANTS (Gas-Fired)
// ============================================================================

export const powerPlants: AssetFeature[] = [
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [3.5000, 6.5800],
    },
    properties: {
      id: "power-egbin",
      name: "Egbin Power Station",
      assetType: "power-plant",
      capacity: 1320,
      currentOutput: 950,
      utilization: 72.0,
      status: "operational",
      corridor: "Lagos",
      deferment: 0,
      operator: "Egbin Power Plc",
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [7.3000, 7.8000],
    },
    properties: {
      id: "power-geregu",
      name: "Geregu Power Complex (I & II)",
      assetType: "power-plant",
      capacity: 848,
      currentOutput: 680,
      utilization: 80.2,
      status: "operational",
      corridor: "Northern",
      deferment: 0,
      operator: "Geregu Power Plc / NIPP",
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [3.2500, 6.8900],
    },
    properties: {
      id: "power-olorunsogo",
      name: "Olorunsogo Power Complex (I & II)",
      assetType: "power-plant",
      capacity: 1010,
      currentOutput: 750,
      utilization: 74.3,
      status: "operational",
      corridor: "Western",
      deferment: 0,
      operator: "Olorunsogo Power Plc / NIPP",
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [4.8400, 6.6600],
    },
    properties: {
      id: "power-omotosho",
      name: "Omotosho Power Complex (I & II)",
      assetType: "power-plant",
      capacity: 785,
      currentOutput: 580,
      utilization: 73.9,
      status: "operational",
      corridor: "Western",
      deferment: 0,
      operator: "Omotosho Power Plc / NIPP",
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [5.9151, 5.5399],
    },
    properties: {
      id: "power-delta",
      name: "Delta/Ughelli Power Station",
      assetType: "power-plant",
      capacity: 942,
      currentOutput: 720,
      utilization: 76.4,
      status: "operational",
      corridor: "Western",
      deferment: 0,
      operator: "Transcorp Power",
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [5.7005, 5.8797],
    },
    properties: {
      id: "power-sapele",
      name: "Sapele Power Station",
      assetType: "power-plant",
      capacity: 450,
      currentOutput: 320,
      utilization: 71.1,
      status: "operational",
      corridor: "Western",
      deferment: 0,
      operator: "Sapele Power Plc",
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [5.6833, 6.4056],
    },
    properties: {
      id: "power-ihovbor",
      name: "Ihovbor Power Station (NIPP)",
      assetType: "power-plant",
      capacity: 450,
      currentOutput: 340,
      utilization: 75.6,
      status: "operational",
      corridor: "Western",
      deferment: 0,
      operator: "NIPP",
    },
  },
];

// ============================================================================
// INDUSTRIAL OFF-TAKERS
// ============================================================================

export const industrialOfftakers: AssetFeature[] = [
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [3.4050, 6.4280],
    },
    properties: {
      id: "ind-dangote-refinery",
      name: "Dangote Petroleum Refinery",
      assetType: "industrial",
      capacity: 650,
      currentOutput: 500,
      utilization: 76.9,
      status: "operational",
      corridor: "Lagos",
      deferment: 0,
      operator: "Dangote Industries",
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [3.4100, 6.4300],
    },
    properties: {
      id: "ind-dangote-fertilizer",
      name: "Dangote Fertiliser Plant",
      assetType: "industrial",
      capacity: 380,
      currentOutput: 320,
      utilization: 84.2,
      status: "operational",
      corridor: "Lagos",
      deferment: 0,
      operator: "Dangote Industries",
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [3.6400, 6.8500],
    },
    properties: {
      id: "ind-wapco-shagamu",
      name: "WAPCO Cement Plant (Shagamu)",
      assetType: "industrial",
      capacity: 85,
      currentOutput: 70,
      utilization: 82.4,
      status: "operational",
      corridor: "Western",
      deferment: 0,
      operator: "Lafarge Africa (WAPCO)",
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [5.7600, 5.5500],
    },
    properties: {
      id: "ind-wrpc",
      name: "Warri Refinery & Petrochemicals",
      assetType: "industrial",
      capacity: 125,
      currentOutput: 95,
      utilization: 76.0,
      status: "operational",
      corridor: "Western",
      deferment: 0,
      operator: "NNPC Limited",
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [6.5950, 6.3400],
    },
    properties: {
      id: "ind-ajaokuta-steel",
      name: "Ajaokuta Steel Complex",
      assetType: "industrial",
      capacity: 200,
      currentOutput: 0,
      utilization: 0,
      status: "maintenance",
      corridor: "Northern",
      deferment: 200,
      operator: "Federal Government",
    },
  },
];

// ============================================================================
// COMPRESSOR STATIONS
// ============================================================================

export const compressorStations: AssetFeature[] = [
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [5.6250, 6.3380],
    },
    properties: {
      id: "cs-benin",
      name: "Benin Compressor Station",
      assetType: "compressor",
      capacity: 2200,
      currentOutput: 1850,
      utilization: 84.1,
      status: "operational",
      corridor: "Western",
      deferment: 0,
      operator: "NGPTC",
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [6.5950, 6.3400],
    },
    properties: {
      id: "cs-ajaokuta",
      name: "Ajaokuta Compressor Station",
      assetType: "compressor",
      capacity: 3500,
      currentOutput: 450,
      utilization: 12.9,
      status: "under-construction",
      corridor: "Northern",
      deferment: 0,
      operator: "NGPTC",
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [7.4400, 10.5200],
    },
    properties: {
      id: "cs-kaduna",
      name: "Kaduna Compressor Station",
      assetType: "compressor",
      capacity: 3500,
      currentOutput: 0,
      utilization: 0,
      status: "under-construction",
      corridor: "Northern",
      deferment: 0,
      operator: "NGPTC",
    },
  },
];

// ============================================================================
// METERING & CUSTODY TRANSFER STATIONS
// ============================================================================

export const meteringStations: AssetFeature[] = [
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [3.3900, 6.4550],
    },
    properties: {
      id: "meter-ijora",
      name: "Ijora Metering Station",
      assetType: "metering-station",
      capacity: 450,
      currentOutput: 380,
      utilization: 84.4,
      status: "operational",
      corridor: "Lagos",
      deferment: 0,
      operator: "Gaslink Nigeria",
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [5.7603, 5.5442],
    },
    properties: {
      id: "meter-warri",
      name: "Warri Metering Station",
      assetType: "metering-station",
      capacity: 2200,
      currentOutput: 1850,
      utilization: 84.1,
      status: "operational",
      corridor: "Western",
      deferment: 0,
      operator: "NGPTC",
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [6.8200, 5.2800],
    },
    properties: {
      id: "meter-anoh-ob3",
      name: "ANOH-OB3 CTMS",
      assetType: "metering-station",
      capacity: 500,
      currentOutput: 280,
      utilization: 56.0,
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
      coordinates: [7.3986, 9.0765],
    },
    properties: {
      id: "meter-abuja",
      name: "Abuja Terminal Gas Station",
      assetType: "metering-station",
      capacity: 3500,
      currentOutput: 450,
      utilization: 12.9,
      status: "under-construction",
      corridor: "Northern",
      deferment: 0,
      operator: "NGPTC",
    },
  },
];

// ============================================================================
// CITY GATE STATIONS
// ============================================================================

export const cityGates: AssetFeature[] = [
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [3.3616, 6.5964],
    },
    properties: {
      id: "citygate-ikeja",
      name: "Ikeja City Gate Station",
      assetType: "city-gate",
      capacity: 120,
      currentOutput: 95,
      utilization: 79.2,
      status: "operational",
      corridor: "Lagos",
      deferment: 0,
      operator: "Gaslink Nigeria",
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [7.4950, 9.0579],
    },
    properties: {
      id: "citygate-abuja-kubwa",
      name: "Abuja CNG Station (Kubwa)",
      assetType: "city-gate",
      capacity: 15,
      currentOutput: 12,
      utilization: 80.0,
      status: "operational",
      corridor: "Northern",
      deferment: 0,
      operator: "NNPC CNG",
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [7.3800, 9.0450],
    },
    properties: {
      id: "citygate-abuja-gwagwalada",
      name: "Abuja CNG Station (Gwagwalada)",
      assetType: "city-gate",
      capacity: 15,
      currentOutput: 11,
      utilization: 73.3,
      status: "operational",
      corridor: "Northern",
      deferment: 0,
      operator: "NNPC CNG",
    },
  },
];

// ============================================================================
// STORAGE FACILITIES
// ============================================================================

export const storageFacilities: AssetFeature[] = [
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [3.3959, 6.4474],
    },
    properties: {
      id: "storage-navgas",
      name: "NAVGAS LPG Terminal (Apapa)",
      assetType: "storage",
      capacity: 12000,
      currentOutput: 9500,
      utilization: 79.2,
      status: "operational",
      corridor: "Lagos",
      deferment: 0,
      operator: "NAVGAS",
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [3.4100, 6.4500],
    },
    properties: {
      id: "storage-techno-oil",
      name: "Techno Oil LPG Terminal (Kirikiri)",
      assetType: "storage",
      capacity: 8400,
      currentOutput: 6800,
      utilization: 81.0,
      status: "operational",
      corridor: "Lagos",
      deferment: 0,
      operator: "Techno Oil",
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [5.7500, 5.5300],
    },
    properties: {
      id: "storage-matrix-warri",
      name: "Matrix Energy LPG Facility (Warri)",
      assetType: "storage",
      capacity: 5000,
      currentOutput: 3800,
      utilization: 76.0,
      status: "operational",
      corridor: "Western",
      deferment: 0,
      operator: "Matrix Energy",
    },
  },
];

// ============================================================================
// TERMINALS
// ============================================================================

export const terminals: AssetFeature[] = [
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [7.1616, 4.4184],
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
      operator: "NLNG Limited",
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [3.3500, 6.6500],
    },
    properties: {
      id: "terminal-itoki",
      name: "Itoki Gas Terminal (Lagos)",
      assetType: "terminal",
      capacity: 2200,
      currentOutput: 1850,
      utilization: 84.1,
      status: "operational",
      corridor: "Lagos",
      deferment: 0,
      operator: "NGPTC",
    },
  },
];

// ============================================================================
// COMBINED ASSETS FOR MAP RENDERING
// ============================================================================

export const allAssets: AssetFeature[] = [
  ...processingPlants,
  ...powerPlants,
  ...industrialOfftakers,
  ...compressorStations,
  ...meteringStations,
  ...cityGates,
  ...storageFacilities,
  ...terminals,
];

// ============================================================================
// NETWORK DEFINITIONS FOR FILTERING
// ============================================================================

export const networks = [
  { id: "ELPS", name: "ELPS (Western Network)", color: "#0172CB" },
  { id: "OB3", name: "OB3 (East-West Connector)", color: "#F59E0B" },
  { id: "Oben-Geregu", name: "Oben-Geregu (Northern)", color: "#10B981" },
  { id: "AKK", name: "AKK (Northern Network)", color: "#9333EA" },
  { id: "Eastern", name: "Alakiri-Obigbo-Ikot Abasi", color: "#EF4444" },
  { id: "ANOH", name: "ANOH-OB3 CTMS", color: "#06B6D4" },
  { id: "Trans-Niger", name: "Trans-Niger (NLNG)", color: "#DC2626" },
  { id: "Lagos", name: "Lagos Distribution", color: "#3B82F6" },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

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

// Get assets by type
export const getAssetsByType = (assetType: AssetType) => {
  return allAssets.filter((asset) => asset.properties.assetType === assetType);
};
