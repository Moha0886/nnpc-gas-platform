// ============================================================================
// NNPC Gas Platform - Mock Data for NNPC Reports
// Sample data matching the exact structure from NNPC workbooks
// ============================================================================

import {
  StationMaster,
  GasProducerMaster,
  StationDailyData,
  ProducerDailyData,
  ProducerWeeklyData,
  OfftakerWeeklyData,
} from "./nnpc-types";
import { GDZ, NETWORK, CUSTOMER_TYPE, FRANCHISE } from "./nomenclature";

// ---------- Station Master Data ----------

export const stationsMaster: StationMaster[] = [
  // NGIC Stations - Lagos Region
  {
    id: "st-001",
    name: "Egbin Power Plant",
    region: "Lagos",
    customerType: "Direct Power Customer",
    designCapacity: 120,
    contractualDemand: 115,
  },
  {
    id: "st-002",
    name: "Omotosho Power",
    region: "Lagos",
    customerType: "NPDC Power Customers",
    designCapacity: 85,
    contractualDemand: 80,
  },
  {
    id: "st-003",
    name: "Dangote Cement Obajana",
    region: "Lagos",
    customerType: "Commercial Customer",
    designCapacity: 45,
    contractualDemand: 42,
  },

  // NGIC Stations - Western Region
  {
    id: "st-004",
    name: "Geregu Power Plant",
    region: "Western",
    customerType: "Direct Power Customer",
    designCapacity: 140,
    contractualDemand: 135,
  },
  {
    id: "st-005",
    name: "Olorunsogo Power",
    region: "Western",
    customerType: "7 Energy Power Customers",
    designCapacity: 90,
    contractualDemand: 88,
  },

  // NGIC Stations - Eastern Region
  {
    id: "st-006",
    name: "Afam Power Station",
    region: "Eastern",
    customerType: "Direct Power Customer",
    designCapacity: 130,
    contractualDemand: 125,
  },
  {
    id: "st-007",
    name: "Rivers IPP",
    region: "Eastern",
    customerType: "NPDC Power Customers",
    designCapacity: 75,
    contractualDemand: 72,
  },

  // NGML Stations - REGIONAL GAS DISTRIBUTION LAGOS
  {
    id: "st-101",
    name: "LPL G/PWR (RCCG)",
    gdz: GDZ.LAGOS,
    franchise: "NGML-NIPCO UJV",
    designCapacity: 12,
    contractualDemand: 10,
  },
  {
    id: "st-102",
    name: "OLAM",
    gdz: GDZ.LAGOS,
    franchise: "NGML-NIPCO UJV",
    designCapacity: 8,
    contractualDemand: 7,
  },
  {
    id: "st-103",
    name: "BREEZE IND LTD",
    gdz: GDZ.LAGOS,
    franchise: "NGML-NIPCO UJV",
    designCapacity: 5,
    contractualDemand: 4,
  },
  {
    id: "st-104",
    name: "NESTLE",
    gdz: GDZ.LAGOS,
    franchise: "NGML-NIPCO UJV",
    designCapacity: 15,
    contractualDemand: 14,
  },
  {
    id: "st-105",
    name: "APPLE&PEARS",
    gdz: GDZ.LAGOS,
    franchise: "TRANSIT GAS FRANCHISE",
    designCapacity: 6,
    contractualDemand: 5,
  },
  {
    id: "st-106",
    name: "WASIL",
    gdz: GDZ.LAGOS,
    franchise: "TRANSIT GAS FRANCHISE",
    designCapacity: 4,
    contractualDemand: 3,
  },
  {
    id: "st-107",
    name: "URAGA POWER",
    gdz: GDZ.LAGOS,
    franchise: "TRANSIT GAS FRANCHISE",
    designCapacity: 20,
    contractualDemand: 18,
  },

  // NGML Stations - REGIONAL GAS DISTRIBUTION DELTA
  {
    id: "st-201",
    name: "GASLINK",
    gdz: GDZ.DELTA,
    designCapacity: 22,
    contractualDemand: 20,
  },
  {
    id: "st-202",
    name: "WAPCO Sagamu",
    gdz: GDZ.DELTA,
    designCapacity: 18,
    contractualDemand: 16,
  },
  {
    id: "st-203",
    name: "WAPCO Ewekoro",
    gdz: GDZ.DELTA,
    designCapacity: 16,
    contractualDemand: 14,
  },
  {
    id: "st-204",
    name: "Notore Chemicals",
    gdz: GDZ.DELTA,
    designCapacity: 25,
    contractualDemand: 23,
  },

  // NGML Stations - REGIONAL GAS DISTRIBUTION EAST
  {
    id: "st-301",
    name: "SNG",
    gdz: GDZ.EAST,
    designCapacity: 30,
    contractualDemand: 28,
  },
  {
    id: "st-302",
    name: "GEL",
    gdz: GDZ.EAST,
    designCapacity: 12,
    contractualDemand: 11,
  },
  {
    id: "st-303",
    name: "Quadrant IPP2",
    gdz: GDZ.EAST,
    designCapacity: 45,
    contractualDemand: 42,
  },
  {
    id: "st-304",
    name: "Premium Steel",
    gdz: GDZ.EAST,
    designCapacity: 35,
    contractualDemand: 32,
  },

  // NGML Stations - REGIONAL GAS DISTRIBUTION NORTH
  {
    id: "st-401",
    name: "NIXIN PAPER MILLS",
    gdz: GDZ.NORTH,
    franchise: "ENTEC GAS FRANCHISE",
    designCapacity: 7,
    contractualDemand: 6,
  },
  {
    id: "st-402",
    name: "FLEX FILMS",
    gdz: GDZ.NORTH,
    franchise: "ENTEC GAS FRANCHISE",
    designCapacity: 5,
    contractualDemand: 4,
  },
];

// ---------- Gas Producer Master Data ----------

export const producersMaster: GasProducerMaster[] = [
  // Western Network Producers
  {
    id: "prod-001",
    name: "SPDC - Forcados",
    network: NETWORK.WESTERN,
    contractualPressureRange: { min: 60, max: 75 },
  },
  {
    id: "prod-002",
    name: "TEPNG - Escravos",
    network: NETWORK.WESTERN,
    contractualPressureRange: { min: 55, max: 70 },
  },
  {
    id: "prod-003",
    name: "NAOC - Kwale",
    network: NETWORK.WESTERN,
    contractualPressureRange: { min: 58, max: 72 },
  },

  // Eastern Network Producers
  {
    id: "prod-101",
    name: "NEPL - Oredo FST3",
    network: NETWORK.EASTERN,
    contractualPressureRange: { min: 55, max: 70 },
  },
  {
    id: "prod-102",
    name: "SPDC - Utorogu",
    network: NETWORK.EASTERN,
    contractualPressureRange: { min: 62, max: 78 },
  },
  {
    id: "prod-103",
    name: "Chevron - Escravos",
    network: NETWORK.EASTERN,
    contractualPressureRange: { min: 60, max: 75 },
  },
];

// ---------- Station Daily Data (Sample for 2026-07-20) ----------

export const stationDailyData: StationDailyData[] = [
  // NGIC Stations
  {
    date: "2026-07-20",
    stationId: "st-001",
    allocation: 115,
    offtake: 112,
    pressure: 45,
    remarks: "Station on stream",
    megawatts: 560,
  },
  {
    date: "2026-07-20",
    stationId: "st-002",
    allocation: 80,
    offtake: 78,
    pressure: 42,
    remarks: "Station on stream",
    megawatts: 390,
  },
  {
    date: "2026-07-20",
    stationId: "st-003",
    allocation: 42,
    offtake: 40,
    pressure: 38,
    remarks: "Station on stream",
  },
  {
    date: "2026-07-20",
    stationId: "st-004",
    allocation: 135,
    offtake: 132,
    pressure: 48,
    remarks: "Station on stream",
    megawatts: 660,
  },
  {
    date: "2026-07-20",
    stationId: "st-005",
    allocation: 88,
    offtake: 0,
    pressure: 35,
    remarks: "On Standby (customer on mtce shutdown)",
    megawatts: 0,
  },
  {
    date: "2026-07-20",
    stationId: "st-006",
    allocation: 125,
    offtake: 120,
    pressure: 44,
    remarks: "Station on stream",
    megawatts: 600,
  },
  {
    date: "2026-07-20",
    stationId: "st-007",
    allocation: 72,
    offtake: 0,
    pressure: 0,
    remarks: "Station on shutdown for rehabilitation",
    megawatts: 0,
  },

  // NGML Stations
  {
    date: "2026-07-20",
    stationId: "st-101",
    allocation: 10,
    nominations: 10,
    offtake: 9.5,
    pressureInlet: 28,
    pressureOutlet: 12,
    remarks: "Station on stream",
  },
  {
    date: "2026-07-20",
    stationId: "st-102",
    allocation: 7,
    nominations: 7,
    offtake: 6.8,
    pressureInlet: 27,
    pressureOutlet: 11,
    remarks: "Station on stream",
  },
  {
    date: "2026-07-20",
    stationId: "st-103",
    allocation: 4,
    nominations: 5,
    offtake: 3.9,
    pressureInlet: 26,
    pressureOutlet: 10,
    remarks: "Station on stream",
  },
  {
    date: "2026-07-20",
    stationId: "st-104",
    allocation: 14,
    nominations: 15,
    offtake: 13.2,
    pressureInlet: 29,
    pressureOutlet: 13,
    remarks: "Station on stream",
  },
  {
    date: "2026-07-20",
    stationId: "st-105",
    allocation: 5,
    nominations: 5,
    offtake: 4.8,
    pressureInlet: 25,
    pressureOutlet: 9,
    remarks: "Station on stream",
  },
  {
    date: "2026-07-20",
    stationId: "st-106",
    allocation: 3,
    nominations: 3,
    offtake: 0,
    pressureInlet: 24,
    pressureOutlet: 8,
    remarks: "On Standby (customer yet to commence gas offtake)",
  },
  {
    date: "2026-07-20",
    stationId: "st-107",
    allocation: 18,
    nominations: 20,
    offtake: 17.5,
    pressureInlet: 30,
    pressureOutlet: 14,
    remarks: "Station on stream",
  },
  {
    date: "2026-07-20",
    stationId: "st-201",
    allocation: 20,
    nominations: 22,
    offtake: 19.2,
    pressureInlet: 32,
    pressureOutlet: 15,
    remarks: "Station on stream",
  },
  {
    date: "2026-07-20",
    stationId: "st-202",
    allocation: 16,
    nominations: 18,
    offtake: 15.5,
    pressureInlet: 31,
    pressureOutlet: 14,
    remarks: "Station on stream",
  },
  {
    date: "2026-07-20",
    stationId: "st-203",
    allocation: 14,
    nominations: 16,
    offtake: 13.8,
    pressureInlet: 30,
    pressureOutlet: 13,
    remarks: "Station on stream",
  },
  {
    date: "2026-07-20",
    stationId: "st-204",
    allocation: 23,
    nominations: 25,
    offtake: 22.5,
    pressureInlet: 33,
    pressureOutlet: 16,
    remarks: "Station on stream",
  },
  {
    date: "2026-07-20",
    stationId: "st-301",
    allocation: 28,
    nominations: 30,
    offtake: 27.2,
    pressureInlet: 35,
    pressureOutlet: 18,
    remarks: "Station on stream",
  },
  {
    date: "2026-07-20",
    stationId: "st-302",
    allocation: 11,
    nominations: 12,
    offtake: 10.8,
    pressureInlet: 28,
    pressureOutlet: 12,
    remarks: "Station on stream",
  },
  {
    date: "2026-07-20",
    stationId: "st-303",
    allocation: 42,
    nominations: 45,
    offtake: 0,
    pressureInlet: 36,
    pressureOutlet: 19,
    remarks: "Station on standby",
  },
  {
    date: "2026-07-20",
    stationId: "st-304",
    allocation: 32,
    nominations: 35,
    offtake: 0,
    pressureInlet: 34,
    pressureOutlet: 17,
    remarks: "On Standby (customer's plant shutdown)",
  },
  {
    date: "2026-07-20",
    stationId: "st-401",
    allocation: 6,
    nominations: 7,
    offtake: 5.8,
    pressureInlet: 26,
    pressureOutlet: 10,
    remarks: "Station on stream",
  },
  {
    date: "2026-07-20",
    stationId: "st-402",
    allocation: 4,
    nominations: 5,
    offtake: 3.9,
    pressureInlet: 25,
    pressureOutlet: 9,
    remarks: "Station on stream",
  },
];

// ---------- Producer Daily Data (Sample for 2026-07-20) ----------

export const producerDailyData: ProducerDailyData[] = [
  { date: "2026-07-20", producerId: "prod-001", volume: 450, pressure: 68 },
  { date: "2026-07-20", producerId: "prod-002", volume: 380, pressure: 62 },
  { date: "2026-07-20", producerId: "prod-003", volume: 320, pressure: 65 },
  { date: "2026-07-20", producerId: "prod-101", volume: 420, pressure: 38 }, // Pressure breach!
  { date: "2026-07-20", producerId: "prod-102", volume: 510, pressure: 70 },
  { date: "2026-07-20", producerId: "prod-103", volume: 390, pressure: 67 },
];

// ---------- Producer Weekly Data (Week of 2026-07-14) ----------

export const producerWeeklyData: ProducerWeeklyData[] = [
  // Current week (2026-07-14)
  {
    weekOf: "2026-07-14",
    producerId: "prod-001",
    avgVolume: 445,
    avgPressure: 67,
    totalVolume: 3115,
  },
  {
    weekOf: "2026-07-14",
    producerId: "prod-002",
    avgVolume: 375,
    avgPressure: 61,
    totalVolume: 2625,
  },
  {
    weekOf: "2026-07-14",
    producerId: "prod-003",
    avgVolume: 318,
    avgPressure: 64,
    totalVolume: 2226,
  },
  {
    weekOf: "2026-07-14",
    producerId: "prod-101",
    avgVolume: 415,
    avgPressure: 38.19, // Pressure breach
    totalVolume: 2905,
  },
  {
    weekOf: "2026-07-14",
    producerId: "prod-102",
    avgVolume: 505,
    avgPressure: 69,
    totalVolume: 3535,
  },
  {
    weekOf: "2026-07-14",
    producerId: "prod-103",
    avgVolume: 385,
    avgPressure: 66,
    totalVolume: 2695,
  },

  // Prior week (2026-07-07)
  {
    weekOf: "2026-07-07",
    producerId: "prod-001",
    avgVolume: 440,
    avgPressure: 66,
    totalVolume: 3080,
  },
  {
    weekOf: "2026-07-07",
    producerId: "prod-002",
    avgVolume: 370,
    avgPressure: 60,
    totalVolume: 2590,
  },
  {
    weekOf: "2026-07-07",
    producerId: "prod-003",
    avgVolume: 315,
    avgPressure: 63,
    totalVolume: 2205,
  },
  {
    weekOf: "2026-07-07",
    producerId: "prod-101",
    avgVolume: 410,
    avgPressure: 42,
    totalVolume: 2870,
  },
  {
    weekOf: "2026-07-07",
    producerId: "prod-102",
    avgVolume: 500,
    avgPressure: 68,
    totalVolume: 3500,
  },
  {
    weekOf: "2026-07-07",
    producerId: "prod-103",
    avgVolume: 380,
    avgPressure: 65,
    totalVolume: 2660,
  },
];

// ---------- Offtaker Weekly Data (Week of 2026-07-14) ----------

export const offtakerWeeklyData: OfftakerWeeklyData[] = [
  {
    weekOf: "2026-07-14",
    offtakerId: "st-001",
    allocation: 805,
    actualOfftake: 784,
    sourceOfAllocation: "ELPS",
  },
  {
    weekOf: "2026-07-14",
    offtakerId: "st-002",
    allocation: 560,
    actualOfftake: 546,
    sourceOfAllocation: "ELPS",
  },
  {
    weekOf: "2026-07-14",
    offtakerId: "st-003",
    allocation: 294,
    actualOfftake: 280,
    sourceOfAllocation: "ELPS",
  },
  {
    weekOf: "2026-07-14",
    offtakerId: "st-004",
    allocation: 945,
    actualOfftake: 924,
    sourceOfAllocation: "ELPS",
  },
  {
    weekOf: "2026-07-14",
    offtakerId: "st-005",
    allocation: 616,
    actualOfftake: 0,
    sourceOfAllocation: "ELPS",
  },
  {
    weekOf: "2026-07-14",
    offtakerId: "st-006",
    allocation: 875,
    actualOfftake: 840,
    sourceOfAllocation: "OB3",
  },
  {
    weekOf: "2026-07-14",
    offtakerId: "st-007",
    allocation: 504,
    actualOfftake: 0,
    sourceOfAllocation: "OB3",
  },
];

// ---------- Helper Functions ----------

export function getStationData(date: string, stationId: string): StationDailyData | undefined {
  return stationDailyData.find((d) => d.date === date && d.stationId === stationId);
}

export function getProducerData(date: string, producerId: string): ProducerDailyData | undefined {
  return producerDailyData.find((d) => d.date === date && d.producerId === producerId);
}

export function getProducerWeeklyData(
  weekOf: string,
  producerId: string
): ProducerWeeklyData | undefined {
  return producerWeeklyData.find((d) => d.weekOf === weekOf && d.producerId === producerId);
}

export function getStationsByGDZ(gdz: string): StationMaster[] {
  return stationsMaster.filter((s) => s.gdz === gdz);
}

export function getStationsByRegion(region: string): StationMaster[] {
  return stationsMaster.filter((s) => s.region === region);
}

export function getProducersByNetwork(network: string): GasProducerMaster[] {
  return producersMaster.filter((p) => p.network === network);
}
