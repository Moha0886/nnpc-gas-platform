/**
 * Mock Data Layer - NNPC Gas Performance Platform
 *
 * This file contains seed data from the spec (Section 6).
 * Each export will be replaced with Route Handlers in app/api
 * that query the governed data platform.
 */

import type {
  Asset,
  ProcessingPlant,
  Offtaker,
  GasDayBalance,
  OfftakerFlow,
  FlareRecord,
  DefermentEvent,
  Contract,
  CustomerScore,
  CapacityRecord,
  ProductionRecord,
  Corridor,
} from "./types";
import { getCurrentGasDay } from "./utils";

const TODAY = getCurrentGasDay();

// ============================================================================
// ASSETS - Seed data from NNPC_Gas_Asset_Inventory.xlsx
// ============================================================================

export const assets: Asset[] = [
  // Pipelines
  {
    id: "elps-001",
    name: "ELPS (Escravos-Lagos Pipeline System)",
    subsidiary: "NGIC",
    cls: "Pipeline",
    corridor: "Western",
    nameplate: 2200,
    diameterIn: 36,
    lengthKm: 514,
    designPressure: { value: 85, unit: "barg" },
    operatingPressure: {
      inlet: { value: 1233, unit: "psi" }, // 85 barg
      outlet: { value: 1050, unit: "psi" }, // ~15% pressure drop over 514km
    },
    status: "Operational",
    commissioned: 1989,
    source: "NNPC Gas Asset Inventory",
  },
  {
    id: "ob3-001",
    name: "OB3 (Obiafu-Obrikom to Oben)",
    subsidiary: "NGIC",
    cls: "Pipeline",
    corridor: "Interconnector", // East-West connector
    nameplate: 2000,
    diameterIn: 48,
    lengthKm: 130,
    designPressure: { value: 90, unit: "barg" },
    operatingPressure: {
      inlet: { value: 1305, unit: "psi" }, // 90 barg
      outlet: { value: 1200, unit: "psi" }, // ~8% pressure drop over 130km
    },
    status: "Operational",
    commissioned: 2010,
    source: "NNPC Gas Asset Inventory",
  },
  {
    id: "oben-geregu-001",
    name: "Oben-Geregu Pipeline",
    subsidiary: "NGIC",
    cls: "Pipeline",
    corridor: "Northern", // Key northern supply route
    nameplate: 1200,
    diameterIn: 36,
    lengthKm: 196,
    designPressure: { value: 85, unit: "barg" },
    operatingPressure: {
      inlet: { value: 1233, unit: "psi" }, // 85 barg design, ~70-80% operating
      outlet: { value: 1050, unit: "psi" }, // ~15% pressure drop over 196km
    },
    status: "Operational",
    commissioned: 2011,
    source: "Nigerian Gas Infrastructure Report",
  },
  {
    id: "akk-001",
    name: "AKK (Ajaokuta-Kaduna-Kano)",
    subsidiary: "NGIC",
    cls: "Pipeline",
    corridor: "Northern",
    nameplate: 2200,
    diameterIn: 40,
    lengthKm: 614,
    designPressure: { value: 98, unit: "barg" },
    operatingPressure: {
      inlet: { value: 1421, unit: "psi" }, // 98 barg
      outlet: { value: 1180, unit: "psi" }, // ~17% pressure drop over 614km
    },
    status: "Under construction",
    commissioned: 2025,
    source: "NNPC Gas Asset Inventory",
  },
];

export const processingPlants: ProcessingPlant[] = [
  {
    id: "plant-obiafu",
    name: "Obiafu-Obrikom Gas Plant",
    subsidiary: "NGIC",
    cls: "Processing plant",
    corridor: "Eastern",
    nameplate: 1000,
    designPressure: { value: 75, unit: "barg" },
    status: "Operational",
    commissioned: 2003,
    gasType: "AG",
    products: ["Lean gas", "LPG", "Condensate"],
    pipelineConnection: "OB3",
    source: "NNPC Gas Asset Inventory",
  },
  {
    id: "plant-oben",
    name: "Oben Gas Plant",
    subsidiary: "NGIC",
    cls: "Processing plant",
    corridor: "Western", // Western terminus of OB3, key ELPS supply point
    nameplate: 300,
    designPressure: { value: 70, unit: "barg" },
    status: "Operational",
    commissioned: 1998,
    gasType: "AG",
    products: ["Lean gas", "LPG"],
    pipelineConnection: "OB3",
    source: "NNPC Gas Asset Inventory",
  },
  {
    id: "plant-utorogu",
    name: "Utorogu Gas Plant",
    subsidiary: "NGIC",
    cls: "Processing plant",
    corridor: "Western",
    nameplate: 510,
    designPressure: { value: 72, unit: "barg" },
    status: "Operational",
    commissioned: 1991,
    gasType: "AG",
    products: ["Lean gas", "Condensate"],
    pipelineConnection: "ELPS",
    source: "NNPC Gas Asset Inventory",
  },
];

// ============================================================================
// OFFTAKERS - Main and sub-offtakers
// ============================================================================

export const offtakers: Offtaker[] = [
  // Power - Western
  {
    id: "off-egbin",
    name: "Egbin Power Station",
    corridor: "Western",
    sector: "Power",
    productType: "Lean gas",
    deliveryPointId: "dp-egbin",
    contractualDemand: 215,
    contractId: "gsa-egbin-001",
  },
  {
    id: "off-olorunsogo",
    name: "Olorunsogo Power Station",
    corridor: "Western",
    sector: "Power",
    productType: "Lean gas",
    deliveryPointId: "dp-olorunsogo",
    contractualDemand: 140,
    contractId: "gsa-olorunsogo-001",
  },
  {
    id: "off-omotosho",
    name: "Omotosho Power Station",
    corridor: "Western",
    sector: "Power",
    productType: "Lean gas",
    deliveryPointId: "dp-omotosho",
    contractualDemand: 125,
    contractId: "gsa-omotosho-001",
  },

  // Power - Eastern
  {
    id: "off-okpai",
    name: "Okpai Power Station",
    corridor: "Eastern",
    sector: "Power",
    productType: "Lean gas",
    deliveryPointId: "dp-okpai",
    contractualDemand: 78,
    contractId: "gsa-okpai-001",
  },
  {
    id: "off-afam-vi",
    name: "Afam VI Power Station",
    corridor: "Eastern",
    sector: "Power",
    productType: "Lean gas",
    deliveryPointId: "dp-afam-vi",
    contractualDemand: 102,
    contractId: "gsa-afam-vi-001",
  },
  {
    id: "off-alaoji",
    name: "Alaoji Power Station",
    corridor: "Eastern",
    sector: "Power",
    productType: "Lean gas",
    deliveryPointId: "dp-alaoji",
    contractualDemand: 175,
    contractId: "gsa-alaoji-001",
  },

  // Industrial - Western
  {
    id: "off-dangote-fert",
    name: "Dangote Fertiliser",
    corridor: "Western",
    sector: "Fertiliser",
    productType: "Lean gas",
    deliveryPointId: "dp-dangote-fert",
    contractualDemand: 195,
    contractId: "gsa-dangote-001",
  },

  // Industrial - Eastern
  {
    id: "off-indorama",
    name: "Indorama Eleme",
    corridor: "Eastern",
    sector: "Fertiliser",
    productType: "Lean gas",
    deliveryPointId: "dp-indorama",
    contractualDemand: 145,
    contractId: "gsa-indorama-001",
  },
  {
    id: "off-notore",
    name: "Notore Fertiliser",
    corridor: "Eastern",
    sector: "Fertiliser",
    productType: "Lean gas",
    deliveryPointId: "dp-notore",
    contractualDemand: 35,
    contractId: "gsa-notore-001",
  },

  // LDC - Lagos (Main offtaker with sub-offtakers)
  {
    id: "off-shell-ldc",
    name: "Shell Nigeria Gas (LDC)",
    corridor: "Lagos",
    sector: "LDC / distributor",
    productType: "Lean gas",
    deliveryPointId: "dp-shell-ldc",
    contractualDemand: 85,
    contractId: "gsa-shell-ldc-001",
  },
  {
    id: "off-shell-sub-01",
    name: "Ikeja Industrial Estate",
    corridor: "Lagos",
    sector: "LDC / distributor",
    productType: "Lean gas",
    parentOfftakerId: "off-shell-ldc",
    deliveryPointId: "dp-shell-sub-01",
    contractualDemand: 22,
  },
  {
    id: "off-shell-sub-02",
    name: "Apapa Logistics Hub",
    corridor: "Lagos",
    sector: "LDC / distributor",
    productType: "Lean gas",
    parentOfftakerId: "off-shell-ldc",
    deliveryPointId: "dp-shell-sub-02",
    contractualDemand: 18,
  },
  {
    id: "off-shell-sub-03",
    name: "Victoria Island Commercial",
    corridor: "Lagos",
    sector: "LDC / distributor",
    productType: "Lean gas",
    parentOfftakerId: "off-shell-ldc",
    deliveryPointId: "dp-shell-sub-03",
    contractualDemand: 15,
  },

  // Axxela LDC (Main offtaker with sub-offtakers)
  {
    id: "off-axxela-ldc",
    name: "Axxela Gas Distribution",
    corridor: "Lagos",
    sector: "LDC / distributor",
    productType: "Lean gas",
    deliveryPointId: "dp-axxela-ldc",
    contractualDemand: 72,
    contractId: "gsa-axxela-ldc-001",
  },
  {
    id: "off-axxela-sub-01",
    name: "Lekki FTZ Customers",
    corridor: "Lagos",
    sector: "LDC / distributor",
    productType: "Lean gas",
    parentOfftakerId: "off-axxela-ldc",
    deliveryPointId: "dp-axxela-sub-01",
    contractualDemand: 28,
  },
  {
    id: "off-axxela-sub-02",
    name: "Ikorodu Industrial",
    corridor: "Lagos",
    sector: "LDC / distributor",
    productType: "Lean gas",
    parentOfftakerId: "off-axxela-ldc",
    deliveryPointId: "dp-axxela-sub-02",
    contractualDemand: 19,
  },
];

// ============================================================================
// GAS DAY BALANCE - Production to Delivery
// ============================================================================

export const getGasDayBalance = (gasDay: string = TODAY): GasDayBalance => {
  return {
    gasDay,
    produced: 5040, // Total daily production
    nglExtracted: 185, // Liquids removed at plants
    receivedIntoTransmission: 4795, // produced - nglExtracted - losses
    fuelGas: 142,
    linePackChange: 23,
    delivered: 4520,
    ufg: 110, // computed: 4795 - 142 - 23 - 4520 = 110
  };
};

// ============================================================================
// OFFTAKER FLOWS - 6-stage nomination cycle
// ============================================================================

export const getOfftakerFlows = (
  gasDay: string = TODAY,
  corridor?: Corridor | "All"
): OfftakerFlow[] => {
  const flows: OfftakerFlow[] = [
    // Western corridor
    {
      gasDay,
      offtakerId: "off-egbin",
      corridor: "Western",
      nominated: 215,
      allocated: 210,
      forecastSupply: 208,
      actualSupplied: 207,
      received: 205,
      offtaken: 198,
      perf: 0.943, // offtaken / allocated = 198 / 210
      varianceAllocation: 5, // nominated - allocated
      varianceSupply: 3, // allocated - actualSupplied
      varianceTransmission: 2, // actualSupplied - received (transmission loss)
      varianceOfftake: 7, // received - offtaken
      varianceNomination: 10, // nominated - received (overall gap)
      varianceReceipt: 7, // received - offtaken
    },
    {
      gasDay,
      offtakerId: "off-olorunsogo",
      corridor: "Western",
      nominated: 140,
      allocated: 138,
      forecastSupply: 138,
      actualSupplied: 137,
      received: 136,
      offtaken: 134,
      perf: 0.971, // offtaken / allocated = 134 / 138
      varianceAllocation: 2,
      varianceSupply: 1,
      varianceTransmission: 1,
      varianceOfftake: 2,
      varianceNomination: 4,
      varianceReceipt: 2,
    },
    {
      gasDay,
      offtakerId: "off-dangote-fert",
      corridor: "Western",
      nominated: 195,
      allocated: 195,
      forecastSupply: 195,
      actualSupplied: 195,
      received: 195,
      offtaken: 195,
      perf: 1.000, // offtaken / allocated = 195 / 195
      varianceAllocation: 0,
      varianceSupply: 0,
      varianceTransmission: 0,
      varianceOfftake: 0,
      varianceNomination: 0,
      varianceReceipt: 0,
    },

    // Eastern corridor
    {
      gasDay,
      offtakerId: "off-okpai",
      corridor: "Eastern",
      nominated: 78,
      allocated: 75,
      forecastSupply: 74,
      actualSupplied: 73,
      received: 72,
      offtaken: 70,
      perf: 0.933, // offtaken / allocated = 70 / 75
      varianceAllocation: 3,
      varianceSupply: 2,
      varianceTransmission: 1,
      varianceOfftake: 2,
      varianceNomination: 6,
      varianceReceipt: 2,
    },
    {
      gasDay,
      offtakerId: "off-afam-vi",
      corridor: "Eastern",
      nominated: 102,
      allocated: 100,
      forecastSupply: 98,
      actualSupplied: 97,
      received: 96,
      offtaken: 94,
      perf: 0.940, // offtaken / allocated = 94 / 100
      varianceAllocation: 2,
      varianceSupply: 3,
      varianceTransmission: 1,
      varianceOfftake: 2,
      varianceNomination: 6,
      varianceReceipt: 2,
    },
    {
      gasDay,
      offtakerId: "off-indorama",
      corridor: "Eastern",
      nominated: 145,
      allocated: 145,
      forecastSupply: 145,
      actualSupplied: 145,
      received: 145,
      offtaken: 145,
      perf: 1.000, // offtaken / allocated = 145 / 145
      varianceAllocation: 0,
      varianceSupply: 0,
      varianceTransmission: 0,
      varianceOfftake: 0,
      varianceNomination: 0,
      varianceReceipt: 0,
    },

    // Lagos corridor
    {
      gasDay,
      offtakerId: "off-shell-ldc",
      corridor: "Lagos",
      nominated: 85,
      allocated: 82,
      forecastSupply: 80,
      actualSupplied: 80,
      received: 79,
      offtaken: 76,
      perf: 0.927, // offtaken / allocated = 76 / 82
      varianceAllocation: 3,
      varianceSupply: 2,
      varianceTransmission: 1,
      varianceOfftake: 3,
      varianceNomination: 6,
      varianceReceipt: 3,
    },
    {
      gasDay,
      offtakerId: "off-axxela-ldc",
      corridor: "Lagos",
      nominated: 72,
      allocated: 70,
      forecastSupply: 68,
      actualSupplied: 68,
      received: 67,
      offtaken: 65,
      perf: 0.929, // offtaken / allocated = 65 / 70
      varianceAllocation: 2,
      varianceSupply: 2,
      varianceTransmission: 1,
      varianceOfftake: 2,
      varianceNomination: 5,
      varianceReceipt: 2,
    },
  ];

  if (corridor && corridor !== "All") {
    return flows.filter((f) => f.corridor === corridor);
  }

  return flows;
};

// ============================================================================
// EXPORTS
// ============================================================================

export { TODAY as CURRENT_GAS_DAY };
