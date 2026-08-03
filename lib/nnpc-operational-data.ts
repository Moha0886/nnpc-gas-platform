// ============================================================================
// NNPC Operational Data - Seed Data Matching Sample Reports
// Based on actual NNPC performance reports (Sample reports.pptx.pdf)
// ============================================================================

import type {
  NationalGasUtilization,
  ELPSPressureData,
  GasBalanceIndex,
  ProducerContribution,
  WeeklyVariance,
  Producer,
  MeteringProject,
} from "./types";
import { calculateNationalUtilization, calculateProducerContribution } from "./gas-utils";

// ============================================================================
// NATIONAL GAS PRODUCTION & UTILIZATION
// Matching Sample Report Page 2: National Daily Average Production
// ============================================================================

export const nationalProduction: NationalGasUtilization = calculateNationalUtilization(
  7.78, // Total production: 7.78 Bcfd (7,780 MMscfd)
  1.95, // Domestic: 24% (1,950 MMscfd)
  3.17, // Export: 41% (3,170 MMscfd) - mainly NLNG
  1.78, // Reinjection: 23% (1,780 MMscfd)
  0.64  // Flared: 8% (640 MMscfd)
);

// ============================================================================
// PRODUCER DATA WITH CATEGORIES
// Matching Sample Report Page 2: Production Contribution
// JV: 57%, PSC: 25%, NEPL+IND: 18%
// ============================================================================

export const producers: Producer[] = [
  // JV (Joint Venture) Producers - 57% of 7,796 MMscfd = 4,444 MMscfd
  {
    id: "prod-cnl-escravos",
    name: "CNL-Escravos",
    network: "Western Network",
    category: "JV",
    plantCapacity: 680,
    productionForecast: 650,
    averageDailyProduction: 620,
    contributionPercentage: 7.95,
    contractualPressureRange: { min: 80, max: 85 },
    contractualPressureRangeStr: "80 - 85",
    remarks: "Stable production",
  },
  {
    id: "prod-spdc-utorogu",
    name: "SPDC Utorogu Gas Plant",
    network: "Western Network",
    category: "JV",
    plantCapacity: 300,
    productionForecast: 280,
    averageDailyProduction: 265,
    contributionPercentage: 3.40,
    contractualPressureRange: { min: 75, max: 80 },
    contractualPressureRangeStr: "75 - 80",
    remarks: "Routine maintenance scheduled",
  },
  {
    id: "prod-tepng-obiafu",
    name: "TotalEnergies E&P Nigeria - Obiafu",
    network: "Eastern Network",
    category: "JV",
    plantCapacity: 800,
    productionForecast: 750,
    averageDailyProduction: 720,
    contributionPercentage: 9.23,
    contractualPressureRange: { min: 85, max: 90 },
    contractualPressureRangeStr: "85 - 90",
    remarks: "Peak performance",
  },
  {
    id: "prod-naoc-kwale",
    name: "NAOC Gas Plant",
    network: "Eastern Network",
    category: "JV",
    plantCapacity: 450,
    productionForecast: 420,
    averageDailyProduction: 410,
    contributionPercentage: 5.26,
    contractualPressureRange: { min: 78, max: 83 },
    contractualPressureRangeStr: "78 - 83",
    remarks: "Normal operations",
  },
  {
    id: "prod-npdc-utorogu",
    name: "NPDC Utorogu JV",
    network: "Western Network",
    category: "JV",
    plantCapacity: 420,
    productionForecast: 400,
    averageDailyProduction: 385,
    contributionPercentage: 4.94,
    contractualPressureRange: { min: 72, max: 78 },
    contractualPressureRangeStr: "72 - 78",
    remarks: "Slight underperformance",
  },
  {
    id: "prod-spdc-sapele",
    name: "SPDC Sapele",
    network: "Western Network",
    category: "JV",
    plantCapacity: 380,
    productionForecast: 360,
    averageDailyProduction: 350,
    contributionPercentage: 4.49,
    contractualPressureRange: { min: 70, max: 75 },
    contractualPressureRangeStr: "70 - 75",
    remarks: "Stable operations",
  },
  {
    id: "prod-nlng-feedstock",
    name: "NLNG Bonny Feedstock (Multiple JVs)",
    network: "Eastern Network",
    category: "JV",
    plantCapacity: 2200,
    productionForecast: 2100,
    averageDailyProduction: 2044,
    contributionPercentage: 26.22,
    contractualPressureRange: { min: 88, max: 95 },
    contractualPressureRangeStr: "88 - 95",
    remarks: "Export priority",
  },

  // PSC (Production Sharing Contract) Producers - 25% of 7,796 = 1,949 MMscfd
  {
    id: "prod-seplat-oben",
    name: "Seplat Energy - Oben Gas Plant",
    network: "Western Network",
    category: "PSC",
    plantCapacity: 525,
    productionForecast: 500,
    averageDailyProduction: 480,
    contributionPercentage: 6.16,
    contractualPressureRange: { min: 82, max: 88 },
    contractualPressureRangeStr: "82 - 88",
    remarks: "Strong performance",
  },
  {
    id: "prod-seplat-sapele",
    name: "Seplat Sapele Plant",
    network: "Western Network",
    category: "PSC",
    plantCapacity: 380,
    productionForecast: 350,
    averageDailyProduction: 340,
    contributionPercentage: 4.36,
    contractualPressureRange: { min: 75, max: 82 },
    contractualPressureRangeStr: "75 - 82",
    remarks: "Normal operations",
  },
  {
    id: "prod-first-e-and-p",
    name: "First E&P - Anyala-Madu",
    network: "Eastern Network",
    category: "PSC",
    plantCapacity: 280,
    productionForecast: 260,
    averageDailyProduction: 248,
    contributionPercentage: 3.18,
    contractualPressureRange: { min: 70, max: 78 },
    contractualPressureRangeStr: "70 - 78",
    remarks: "Ramping up production",
  },
  {
    id: "prod-aiteo-nembe",
    name: "Aiteo - Nembe Creek",
    network: "Eastern Network",
    category: "PSC",
    plantCapacity: 310,
    productionForecast: 290,
    averageDailyProduction: 275,
    contributionPercentage: 3.53,
    contractualPressureRange: { min: 68, max: 75 },
    contractualPressureRangeStr: "68 - 75",
    remarks: "Minor operational challenges",
  },
  {
    id: "prod-waltersmith",
    name: "Waltersmith Petroman - Ibigwe",
    network: "Eastern Network",
    category: "PSC",
    plantCapacity: 180,
    productionForecast: 165,
    averageDailyProduction: 158,
    contributionPercentage: 2.03,
    contractualPressureRange: { min: 65, max: 72 },
    contractualPressureRangeStr: "65 - 72",
    remarks: "Consistent output",
  },
  {
    id: "prod-addax-anoh",
    name: "Addax/SPDC - Ebocha",
    network: "Eastern Network",
    category: "PSC",
    plantCapacity: 290,
    productionForecast: 270,
    averageDailyProduction: 258,
    contributionPercentage: 3.31,
    contractualPressureRange: { min: 72, max: 80 },
    contractualPressureRangeStr: "72 - 80",
    remarks: "Stable production",
  },

  // NEPL+IND (Independent Producers) - 18% of 7,796 = 1,403 MMscfd
  {
    id: "prod-nepl-oredo",
    name: "NEPL Oredo FST3",
    network: "Western Network",
    category: "NEPL+IND",
    plantCapacity: 420,
    productionForecast: 400,
    averageDailyProduction: 385,
    contributionPercentage: 4.94,
    contractualPressureRange: { min: 75, max: 82 },
    contractualPressureRangeStr: "75 - 82",
    remarks: "High efficiency operations",
  },
  {
    id: "prod-nepl-ughelli",
    name: "NEPL Ughelli East",
    network: "Western Network",
    category: "NEPL+IND",
    plantCapacity: 310,
    productionForecast: 290,
    averageDailyProduction: 278,
    contributionPercentage: 3.57,
    contractualPressureRange: { min: 70, max: 78 },
    contractualPressureRangeStr: "70 - 78",
    remarks: "Performing well",
  },
  {
    id: "prod-agpc-anoh",
    name: "AGPC (Seplat/NGC JV) - ANOH",
    network: "Eastern Network",
    category: "NEPL+IND",
    plantCapacity: 300,
    productionForecast: 285,
    averageDailyProduction: 280,
    contributionPercentage: 3.59,
    contractualPressureRange: { min: 80, max: 88 },
    contractualPressureRangeStr: "80 - 88",
    remarks: "New plant, ramping up",
  },
  {
    id: "prod-seven-energy",
    name: "Seven Energy - Uquo",
    network: "Eastern Network",
    category: "NEPL+IND",
    plantCapacity: 220,
    productionForecast: 200,
    averageDailyProduction: 192,
    contributionPercentage: 2.46,
    contractualPressureRange: { min: 68, max: 75 },
    contractualPressureRangeStr: "68 - 75",
    remarks: "Steady operations",
  },
  {
    id: "prod-oando-ebegoro",
    name: "Oando Energy - Ebegoro",
    network: "Western Network",
    category: "NEPL+IND",
    plantCapacity: 180,
    productionForecast: 170,
    averageDailyProduction: 165,
    contributionPercentage: 2.12,
    contractualPressureRange: { min: 65, max: 72 },
    contractualPressureRangeStr: "65 - 72",
    remarks: "Normal production",
  },
  {
    id: "prod-platform-ehugbo",
    name: "Platform Petroleum - Ehugbo",
    network: "Eastern Network",
    category: "NEPL+IND",
    plantCapacity: 120,
    productionForecast: 110,
    averageDailyProduction: 103,
    contributionPercentage: 1.32,
    contractualPressureRange: { min: 60, max: 68 },
    contractualPressureRangeStr: "60 - 68",
    remarks: "Consistent performer",
  },
];

// ============================================================================
// PRODUCER CONTRIBUTION BY CATEGORY
// ============================================================================

export const producerContributions: ProducerContribution[] = [
  calculateProducerContribution(
    "JV",
    4444, // Current week
    4380, // Previous week
    7796  // Total production
  ),
  calculateProducerContribution(
    "PSC",
    1949,
    1925,
    7796
  ),
  calculateProducerContribution(
    "NEPL+IND",
    1403,
    1385,
    7796
  ),
];

// ============================================================================
// ELPS PRESSURE MONITORING DATA
// Matching Sample Report Page 1: ELPS Pressure @ WGTP and Itoki
// ============================================================================

export const elpsPressureData: ELPSPressureData[] = [
  {
    timestamp: "2026-08-01T06:00:00Z",
    wgtpPressure: 68.5,
    wgtpMin: 65.0,
    itokiPressure: 72.3,
    itokiMin: 70.0,
    status: "normal",
  },
  {
    timestamp: "2026-08-01T12:00:00Z",
    wgtpPressure: 67.8,
    wgtpMin: 65.0,
    itokiPressure: 71.8,
    itokiMin: 70.0,
    status: "normal",
  },
  {
    timestamp: "2026-08-01T18:00:00Z",
    wgtpPressure: 66.2,
    wgtpMin: 65.0,
    itokiPressure: 70.5,
    itokiMin: 70.0,
    status: "low",
  },
  {
    timestamp: "2026-08-02T00:00:00Z",
    wgtpPressure: 68.1,
    wgtpMin: 65.0,
    itokiPressure: 71.9,
    itokiMin: 70.0,
    status: "normal",
  },
  {
    timestamp: "2026-08-02T06:00:00Z",
    wgtpPressure: 69.2,
    wgtpMin: 65.0,
    itokiPressure: 72.5,
    itokiMin: 70.0,
    status: "normal",
  },
];

// ============================================================================
// GAS BALANCE INDEX (GBI)
// Matching Sample Report Page 1: Power Market Performance
// ============================================================================

export const gasBalanceIndexData: GasBalanceIndex[] = [
  {
    date: "2026-07-28",
    region: "Western/North",
    nomination: 420,
    allocation: 425,
    actualOfftake: 383.34,
    gbi: 0.902, // 383.34 / 425
    variance: 41.66,
    variancePercent: -9.8,
  },
  {
    date: "2026-07-28",
    region: "Eastern",
    nomination: 165,
    allocation: 172,
    actualOfftake: 151.36,
    gbi: 0.880, // 151.36 / 172
    variance: 20.64,
    variancePercent: -12.0,
  },
];

// ============================================================================
// WEEKLY VARIANCE DATA
// Matching Sample Report Page 2: Week-over-week changes
// ============================================================================

export const weeklyVarianceData: WeeklyVariance[] = [
  {
    metric: "Total Gas Production",
    currentWeek: 7796,
    priorWeek: 7554,
    variance: 242,
    variancePercent: 3.2,
    trend: "up",
  },
  {
    metric: "Power Offtake",
    currentWeek: 723,
    priorWeek: 658,
    variance: 65,
    variancePercent: 9.9,
    trend: "up",
  },
  {
    metric: "Industries Offtake",
    currentWeek: 854,
    priorWeek: 887,
    variance: -33,
    variancePercent: -3.7,
    trend: "down",
  },
  {
    metric: "WAGP Export",
    currentWeek: 124,
    priorWeek: 116,
    variance: 8,
    variancePercent: 6.9,
    trend: "up",
  },
  {
    metric: "Domestic Supply",
    currentWeek: 1835,
    priorWeek: 1776,
    variance: 59,
    variancePercent: 3.3,
    trend: "up",
  },
  {
    metric: "Export (NLNG)",
    currentWeek: 3352,
    priorWeek: 3260,
    variance: 92,
    variancePercent: 2.8,
    trend: "up",
  },
  {
    metric: "Reinjection",
    currentWeek: 1839,
    priorWeek: 1703,
    variance: 136,
    variancePercent: 8.0,
    trend: "up",
  },
  {
    metric: "Gas Flared",
    currentWeek: 471,
    priorWeek: 475,
    variance: -4,
    variancePercent: -0.8,
    trend: "stable",
  },
];

// ============================================================================
// METERING PROJECTS
// CTM, VFC, CM tracking based on NGIC pipeline network diagram
// ============================================================================

export const meteringProjects: MeteringProject[] = [
  {
    id: "meter-proj-ctm-001",
    name: "Escravos Plant CTM",
    type: "CTM",
    status: "existing",
    stations: ["plant-escravos"],
    corridor: "Western",
    description: "Custody Transfer Metering at Escravos Gas Plant injection point",
  },
  {
    id: "meter-proj-ctm-002",
    name: "Otumara Plant CTM",
    type: "CTM",
    status: "existing",
    stations: ["plant-otumara"],
    corridor: "Western",
    description: "Custody Transfer Metering at Otumara Plant",
  },
  {
    id: "meter-proj-ctm-003",
    name: "NPDC Odidi CTM",
    type: "CTM",
    status: "existing",
    stations: ["plant-npdc-odidi"],
    corridor: "Western",
    description: "Custody Transfer Metering at NPDC Odidi Plant",
  },
  {
    id: "meter-proj-ctm-004",
    name: "Sapele MS CTM",
    type: "CTM",
    status: "existing",
    stations: ["meter-sapele"],
    corridor: "Western",
    description: "Custody Transfer Metering at Sapele Metering Station",
  },
  {
    id: "meter-proj-ctm-005",
    name: "ANOH-OB3 CTMS",
    type: "CTM",
    status: "existing",
    stations: ["meter-anoh-ob3"],
    corridor: "Eastern",
    description: "ANOH to OB3 Custody Transfer Metering System",
  },
  {
    id: "meter-proj-vfc-001",
    name: "ELPS Western VFC System",
    type: "VFC",
    status: "existing",
    stations: [
      "power-egbin",
      "power-olorunsogo",
      "power-omotosho",
      "power-delta",
      "power-sapele",
      "power-ihovbor",
    ],
    corridor: "Western",
    description: "Volumetric Flow Control for Western Power Plants on ELPS",
  },
  {
    id: "meter-proj-vfc-002",
    name: "Eastern Network VFC",
    type: "VFC",
    status: "ongoing",
    stations: ["power-afam-vi", "power-alaoji", "power-okpai"],
    corridor: "Eastern",
    completionDate: "2027-Q2",
    description: "VFC installation for Eastern power plants",
  },
  {
    id: "meter-proj-cm-001",
    name: "H/Complex TGS Check Metering",
    type: "CM",
    status: "existing",
    stations: ["terminal-hcomplex"],
    corridor: "Western",
    description: "Check Metering at H/Complex Terminal Gas Station",
  },
  {
    id: "meter-proj-cm-002",
    name: "WGTP Check Metering",
    type: "CM",
    status: "existing",
    stations: ["plant-wgtp"],
    corridor: "Western",
    description: "Warri Gas Treatment Plant Check Metering",
  },
  {
    id: "meter-proj-vfc-003",
    name: "Industrial Customers VFC Phase 1",
    type: "VFC",
    status: "planned",
    stations: [
      "ind-dangote-fertilizer",
      "ind-indorama",
      "ind-notore",
    ],
    corridor: "Lagos",
    completionDate: "2027-Q4",
    budget: 12500000,
    description: "VFC for major industrial gas customers - Phase 1",
  },
];

// ============================================================================
// ELPS SUPPLY DATA
// Matching Sample Report Page 1: ELPS Gas Supply = 1.44 Bcfd
// ============================================================================

export const elpsSupplyData = {
  date: "2026-07-28",
  totalSupply: 1440, // MMscfd (1.44 Bcfd)
  percentOfDomestic: 74, // 74% of domestic supply
  weekOverWeekChange: 10, // MMscfd
  weekOverWeekPercent: 0.7,
  ytdAverage: 1299, // MMscfd
  ytdTarget: 1390, // MMscfd
  achievementPercent: 93.5,
};

// ============================================================================
// MAJOR OFFTAKER PERFORMANCE
// Matching Sample Report Page 1
// ============================================================================

export const majorOfftakers = {
  dangoteFertilizer: {
    offtakerId: "ind-dangote-fertilizer",
    name: "Dangote Fertiliser (DFL)",
    allocation: 180,
    actualOfftake: 176.87,
    percentOfAllocation: 98,
    weekOverWeekChange: 7.65,
    weekOverWeekPercent: 4.4,
  },
  indorama: {
    offtakerId: "ind-indorama",
    name: "Indorama Eleme Petrochemicals",
    allocation: 180,
    actualOfftake: 174.97,
    percentOfAllocation: 97,
    weekOverWeekChange: 6.15,
    weekOverWeekPercent: 3.6,
  },
  ngmlGasSales: {
    date: "2026-07-28",
    allocation: 550,
    offtake: 483.0,
    percentOfAllocation: 87.8,
    percentOf2026Target: 65,
    weekOverWeekChange: 44.3,
    weekOverWeekPercent: 8.8,
  },
};
