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

  // ============================================================================
  // CUSTOMER DELIVERY PIPELINES - Connections to End Users
  // ============================================================================

  // ELPS to Egbin Power Station
  {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [3.3500, 6.6500], // ELPS Itoki Terminal
        [3.5000, 6.5800], // Egbin Power Station
      ],
    },
    properties: {
      id: "delivery-egbin",
      name: "ELPS → Egbin Power",
      network: "ELPS",
      pipelineType: "delivery",
      diameter: 20,
      length: 18,
      capacity: 215,
      currentFlow: 180,
      utilization: 83.7,
      pressure: 950,
      status: "operational",
      corridor: "Lagos",
      deferment: 0,
    },
  },

  // ELPS to Olorunsogo Power
  {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [3.2500, 6.8800], // ELPS Ogun section
        [3.2500, 6.8900], // Olorunsogo Power
      ],
    },
    properties: {
      id: "delivery-olorunsogo",
      name: "ELPS → Olorunsogo Power",
      network: "ELPS",
      pipelineType: "delivery",
      diameter: 18,
      length: 12,
      capacity: 140,
      currentFlow: 118,
      utilization: 84.3,
      pressure: 920,
      status: "operational",
      corridor: "Western",
      deferment: 0,
    },
  },

  // ELPS to Omotosho Power
  {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [5.6250, 6.3380], // ELPS Benin area
        [4.8400, 6.6600], // Omotosho Power
      ],
    },
    properties: {
      id: "delivery-omotosho",
      name: "ELPS → Omotosho Power",
      network: "ELPS",
      pipelineType: "delivery",
      diameter: 16,
      length: 45,
      capacity: 125,
      currentFlow: 105,
      utilization: 84.0,
      pressure: 900,
      status: "operational",
      corridor: "Western",
      deferment: 0,
    },
  },

  // ELPS to Delta/Ughelli Power
  {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [5.9938, 5.5002], // ELPS Ughelli/Delta
        [5.9151, 5.5399], // Delta Power Station
      ],
    },
    properties: {
      id: "delivery-delta",
      name: "ELPS → Delta Power",
      network: "ELPS",
      pipelineType: "delivery",
      diameter: 16,
      length: 8,
      capacity: 150,
      currentFlow: 125,
      utilization: 83.3,
      pressure: 950,
      status: "operational",
      corridor: "Western",
      deferment: 0,
    },
  },

  // ELPS to Sapele Power
  {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [5.7603, 5.5442], // ELPS Warri
        [5.7005, 5.8797], // Sapele Power
      ],
    },
    properties: {
      id: "delivery-sapele",
      name: "ELPS → Sapele Power",
      network: "ELPS",
      pipelineType: "delivery",
      diameter: 14,
      length: 35,
      capacity: 90,
      currentFlow: 72,
      utilization: 80.0,
      pressure: 880,
      status: "operational",
      corridor: "Western",
      deferment: 0,
    },
  },

  // ELPS to Ihovbor Power
  {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [5.6250, 6.3380], // ELPS Benin
        [5.6833, 6.4056], // Ihovbor Power
      ],
    },
    properties: {
      id: "delivery-ihovbor",
      name: "ELPS → Ihovbor Power (NIPP)",
      network: "ELPS",
      pipelineType: "delivery",
      diameter: 14,
      length: 8,
      capacity: 75,
      currentFlow: 62,
      utilization: 82.7,
      pressure: 910,
      status: "operational",
      corridor: "Western",
      deferment: 0,
    },
  },

  // Oben-Geregu to Geregu Power
  {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [7.3000, 7.8000], // Geregu pipeline endpoint
        [7.3000, 7.8000], // Geregu Power (same location)
      ],
    },
    properties: {
      id: "delivery-geregu",
      name: "Oben-Geregu → Geregu Power",
      network: "Oben-Geregu",
      pipelineType: "delivery",
      diameter: 20,
      length: 2,
      capacity: 170,
      currentFlow: 145,
      utilization: 85.3,
      pressure: 950,
      status: "operational",
      corridor: "Northern",
      deferment: 0,
    },
  },

  // OB3 to Okpai Power
  {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [6.9580, 5.4520], // OB3 Obite area
        [6.2400, 5.8500], // Okpai Power
      ],
    },
    properties: {
      id: "delivery-okpai",
      name: "OB3 → Okpai Power",
      network: "OB3",
      pipelineType: "delivery",
      diameter: 16,
      length: 65,
      capacity: 78,
      currentFlow: 68,
      utilization: 87.2,
      pressure: 890,
      status: "operational",
      corridor: "Eastern",
      deferment: 0,
    },
  },

  // Eastern Network to Afam VI
  {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [7.0100, 4.7500], // Alakiri
        [7.2400, 4.9400], // Afam VI
      ],
    },
    properties: {
      id: "delivery-afam",
      name: "Eastern Network → Afam VI",
      network: "Eastern",
      pipelineType: "delivery",
      diameter: 16,
      length: 25,
      capacity: 102,
      currentFlow: 88,
      utilization: 86.3,
      pressure: 910,
      status: "operational",
      corridor: "Eastern",
      deferment: 0,
    },
  },

  // Eastern Network to Alaoji
  {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [7.3500, 5.0600], // Obigbo
        [7.3500, 5.0800], // Alaoji
      ],
    },
    properties: {
      id: "delivery-alaoji",
      name: "Eastern Network → Alaoji NIPP",
      network: "Eastern",
      pipelineType: "delivery",
      diameter: 18,
      length: 5,
      capacity: 175,
      currentFlow: 148,
      utilization: 84.6,
      pressure: 930,
      status: "operational",
      corridor: "Eastern",
      deferment: 0,
    },
  },

  // ELPS to Dangote Fertiliser
  {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [3.3500, 6.6500], // ELPS Itoki
        [3.4100, 6.4300], // Dangote Fertiliser
      ],
    },
    properties: {
      id: "delivery-dangote-fert",
      name: "ELPS → Dangote Fertiliser",
      network: "ELPS",
      pipelineType: "delivery",
      diameter: 16,
      length: 24,
      capacity: 195,
      currentFlow: 165,
      utilization: 84.6,
      pressure: 920,
      status: "operational",
      corridor: "Lagos",
      deferment: 0,
    },
  },

  // ELPS to Dangote Refinery
  {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [3.3500, 6.6500], // ELPS Itoki
        [3.4050, 6.4280], // Dangote Refinery
      ],
    },
    properties: {
      id: "delivery-dangote-ref",
      name: "ELPS → Dangote Refinery",
      network: "ELPS",
      pipelineType: "delivery",
      diameter: 20,
      length: 25,
      capacity: 650,
      currentFlow: 500,
      utilization: 76.9,
      pressure: 940,
      status: "operational",
      corridor: "Lagos",
      deferment: 0,
    },
  },

  // OB3 to Indorama
  {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [7.0100, 4.7500], // Alakiri
        [7.1200, 4.7800], // Indorama
      ],
    },
    properties: {
      id: "delivery-indorama",
      name: "Eastern Network → Indorama",
      network: "Eastern",
      pipelineType: "delivery",
      diameter: 14,
      length: 12,
      capacity: 145,
      currentFlow: 125,
      utilization: 86.2,
      pressure: 900,
      status: "operational",
      corridor: "Eastern",
      deferment: 0,
    },
  },

  // OB3 to Notore
  {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [6.9580, 5.4520], // Obite
        [6.9500, 5.5800], // Notore
      ],
    },
    properties: {
      id: "delivery-notore",
      name: "OB3 → Notore Fertiliser",
      network: "OB3",
      pipelineType: "delivery",
      diameter: 10,
      length: 15,
      capacity: 35,
      currentFlow: 28,
      utilization: 80.0,
      pressure: 850,
      status: "operational",
      corridor: "Eastern",
      deferment: 0,
    },
  },

  // ELPS to WAPCO Shagamu
  {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [3.2500, 6.8800], // ELPS Ogun
        [3.6400, 6.8500], // WAPCO Shagamu
      ],
    },
    properties: {
      id: "delivery-wapco",
      name: "ELPS → WAPCO Cement",
      network: "ELPS",
      pipelineType: "delivery",
      diameter: 10,
      length: 28,
      capacity: 85,
      currentFlow: 70,
      utilization: 82.4,
      pressure: 870,
      status: "operational",
      corridor: "Western",
      deferment: 0,
    },
  },

  // ELPS to Warri Refinery
  {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [5.7603, 5.5442], // ELPS Warri
        [5.7600, 5.5500], // Warri Refinery
      ],
    },
    properties: {
      id: "delivery-wrpc",
      name: "ELPS → Warri Refinery",
      network: "ELPS",
      pipelineType: "delivery",
      diameter: 12,
      length: 3,
      capacity: 125,
      currentFlow: 95,
      utilization: 76.0,
      pressure: 890,
      status: "operational",
      corridor: "Western",
      deferment: 0,
    },
  },

  // Lagos Distribution to Shell LDC
  {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [3.3900, 6.4550], // Ijora
        [3.3700, 6.4900], // Shell LDC
      ],
    },
    properties: {
      id: "delivery-shell-ldc",
      name: "Lagos Network → Shell LDC",
      network: "Lagos",
      pipelineType: "delivery",
      diameter: 12,
      length: 5,
      capacity: 85,
      currentFlow: 72,
      utilization: 84.7,
      pressure: 920,
      status: "operational",
      corridor: "Lagos",
      deferment: 0,
    },
  },

  // Lagos Distribution to Axxela LDC
  {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [3.3900, 6.4550], // Ijora
        [3.4200, 6.4400], // Axxela LDC
      ],
    },
    properties: {
      id: "delivery-axxela-ldc",
      name: "Lagos Network → Axxela LDC",
      network: "Lagos",
      pipelineType: "delivery",
      diameter: 12,
      length: 4,
      capacity: 72,
      currentFlow: 65,
      utilization: 90.3,
      pressure: 910,
      status: "operational",
      corridor: "Lagos",
      deferment: 0,
    },
  },

  // Shell LDC to Sub-customers
  {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [3.3700, 6.4900], // Shell LDC
        [3.3350, 6.5550], // Ikeja Industrial
      ],
    },
    properties: {
      id: "delivery-ikeja",
      name: "Shell LDC → Ikeja Industrial",
      network: "Lagos",
      pipelineType: "flow",
      diameter: 8,
      length: 8,
      capacity: 22,
      currentFlow: 19,
      utilization: 86.4,
      pressure: 850,
      status: "operational",
      corridor: "Lagos",
      deferment: 0,
    },
  },

  {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [3.3700, 6.4900], // Shell LDC
        [3.3850, 6.4500], // Apapa
      ],
    },
    properties: {
      id: "delivery-apapa",
      name: "Shell LDC → Apapa Logistics",
      network: "Lagos",
      pipelineType: "flow",
      diameter: 8,
      length: 3,
      capacity: 18,
      currentFlow: 16,
      utilization: 88.9,
      pressure: 860,
      status: "operational",
      corridor: "Lagos",
      deferment: 0,
    },
  },

  {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [3.3700, 6.4900], // Shell LDC
        [3.4250, 6.4280], // VI Commercial
      ],
    },
    properties: {
      id: "delivery-vi",
      name: "Shell LDC → Victoria Island",
      network: "Lagos",
      pipelineType: "flow",
      diameter: 6,
      length: 6,
      capacity: 15,
      currentFlow: 13,
      utilization: 86.7,
      pressure: 840,
      status: "operational",
      corridor: "Lagos",
      deferment: 0,
    },
  },

  // Axxela LDC to Sub-customers
  {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [3.4200, 6.4400], // Axxela LDC
        [3.4700, 6.4200], // Lekki FTZ
      ],
    },
    properties: {
      id: "delivery-lekki",
      name: "Axxela LDC → Lekki FTZ",
      network: "Lagos",
      pipelineType: "flow",
      diameter: 8,
      length: 5,
      capacity: 28,
      currentFlow: 25,
      utilization: 89.3,
      pressure: 850,
      status: "operational",
      corridor: "Lagos",
      deferment: 0,
    },
  },

  {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [3.4200, 6.4400], // Axxela LDC
        [3.5100, 6.6100], // Ikorodu
      ],
    },
    properties: {
      id: "delivery-ikorodu",
      name: "Axxela LDC → Ikorodu Industrial",
      network: "Lagos",
      pipelineType: "flow",
      diameter: 8,
      length: 20,
      capacity: 19,
      currentFlow: 17,
      utilization: 89.5,
      pressure: 830,
      status: "operational",
      corridor: "Lagos",
      deferment: 0,
    },
  },

  // WAGP (West African Gas Pipeline) - International Export
  {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [3.3500, 6.6500], // Lagos/Badagry (Nigeria)
        [2.8800, 6.4400], // Entry to Benin
        [2.1000, 6.3500], // Benin coastal route
        [1.2500, 6.2000], // Togo coastal route
        [0.5000, 6.1000], // Entry to Ghana
        [-0.2000, 5.6000], // Tema (Ghana)
      ],
    },
    properties: {
      id: "wagp",
      name: "WAGP (West African Gas Pipeline)",
      network: "WAGP",
      pipelineType: "export",
      diameter: 20,
      length: 678,
      capacity: 170,
      currentFlow: 120,
      utilization: 70.6,
      pressure: 1100,
      status: "operational",
      corridor: "Western",
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
  // Western Corridor Power Plants
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
      corridor: "Western",
      deferment: 0,
      operator: "Egbin Power Plc",
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
      name: "Olorunsogo Power Station",
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
  // Northern Corridor Power Plants
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
  // Eastern Corridor Power Plants
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [6.2400, 5.8500],
    },
    properties: {
      id: "power-okpai",
      name: "Okpai Power Station",
      assetType: "power-plant",
      capacity: 480,
      currentOutput: 380,
      utilization: 79.2,
      status: "operational",
      corridor: "Eastern",
      deferment: 0,
      operator: "Agip (Eni)",
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [7.2400, 4.9400],
    },
    properties: {
      id: "power-afam-vi",
      name: "Afam VI Power Station",
      assetType: "power-plant",
      capacity: 650,
      currentOutput: 520,
      utilization: 80.0,
      status: "operational",
      corridor: "Eastern",
      deferment: 0,
      operator: "Sahara Power Group",
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [7.3500, 5.0800],
    },
    properties: {
      id: "power-alaoji",
      name: "Alaoji Power Station (NIPP)",
      assetType: "power-plant",
      capacity: 1074,
      currentOutput: 820,
      utilization: 76.3,
      status: "operational",
      corridor: "Eastern",
      deferment: 0,
      operator: "NIPP",
    },
  },
];

// ============================================================================
// INDUSTRIAL OFF-TAKERS
// ============================================================================

export const industrialOfftakers: AssetFeature[] = [
  // Lagos/Western Corridor
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
  // Eastern Corridor - Fertiliser Plants
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [7.1200, 4.7800],
    },
    properties: {
      id: "ind-indorama",
      name: "Indorama Eleme Petrochemicals",
      assetType: "industrial",
      capacity: 145,
      currentOutput: 125,
      utilization: 86.2,
      status: "operational",
      corridor: "Eastern",
      deferment: 0,
      operator: "Indorama Corporation",
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [6.9500, 5.5800],
    },
    properties: {
      id: "ind-notore",
      name: "Notore Fertiliser Plant",
      assetType: "industrial",
      capacity: 35,
      currentOutput: 28,
      utilization: 80.0,
      status: "operational",
      corridor: "Eastern",
      deferment: 0,
      operator: "Notore Chemical Industries",
    },
  },
  // Northern Corridor
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
  // LDC Main Distributors
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [3.3700, 6.4900],
    },
    properties: {
      id: "ind-shell-ldc",
      name: "Shell Nigeria Gas (LDC)",
      assetType: "industrial",
      capacity: 85,
      currentOutput: 72,
      utilization: 84.7,
      status: "operational",
      corridor: "Lagos",
      deferment: 0,
      operator: "Shell Nigeria Gas",
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [3.4200, 6.4400],
    },
    properties: {
      id: "ind-axxela-ldc",
      name: "Axxela Gas Distribution",
      assetType: "industrial",
      capacity: 72,
      currentOutput: 65,
      utilization: 90.3,
      status: "operational",
      corridor: "Lagos",
      deferment: 0,
      operator: "Axxela Limited",
    },
  },
  // LDC Sub-customers (Commercial/Industrial clusters)
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [3.3350, 6.5550],
    },
    properties: {
      id: "ind-ikeja-industrial",
      name: "Ikeja Industrial Estate",
      assetType: "industrial",
      capacity: 22,
      currentOutput: 19,
      utilization: 86.4,
      status: "operational",
      corridor: "Lagos",
      deferment: 0,
      operator: "Shell Nigeria Gas (sub)",
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [3.3850, 6.4500],
    },
    properties: {
      id: "ind-apapa-logistics",
      name: "Apapa Logistics Hub",
      assetType: "industrial",
      capacity: 18,
      currentOutput: 16,
      utilization: 88.9,
      status: "operational",
      corridor: "Lagos",
      deferment: 0,
      operator: "Shell Nigeria Gas (sub)",
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [3.4250, 6.4280],
    },
    properties: {
      id: "ind-vi-commercial",
      name: "Victoria Island Commercial",
      assetType: "industrial",
      capacity: 15,
      currentOutput: 13,
      utilization: 86.7,
      status: "operational",
      corridor: "Lagos",
      deferment: 0,
      operator: "Shell Nigeria Gas (sub)",
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [3.4700, 6.4200],
    },
    properties: {
      id: "ind-lekki-ftz",
      name: "Lekki FTZ Customers",
      assetType: "industrial",
      capacity: 28,
      currentOutput: 25,
      utilization: 89.3,
      status: "operational",
      corridor: "Lagos",
      deferment: 0,
      operator: "Axxela Limited (sub)",
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [3.5100, 6.6100],
    },
    properties: {
      id: "ind-ikorodu-industrial",
      name: "Ikorodu Industrial",
      assetType: "industrial",
      capacity: 19,
      currentOutput: 17,
      utilization: 89.5,
      status: "operational",
      corridor: "Lagos",
      deferment: 0,
      operator: "Axxela Limited (sub)",
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
  { id: "WAGP", name: "WAGP (West Africa Export)", color: "#F97316" },
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
