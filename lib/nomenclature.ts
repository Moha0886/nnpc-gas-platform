// ============================================================================
// NNPC Gas Platform - Nomenclature Module
// Single source of truth for user-facing strings
// Based on exact strings from 5 live NNPC workbooks
// ============================================================================

// ---------- Gas Distribution Zones (NGML) ----------

export const GDZ = {
  LAGOS: "REGIONAL GAS DISTRIBUTION LAGOS",
  NORTH: "REGIONAL GAS DISTRIBUTION NORTH",
  DELTA: "REGIONAL GAS DISTRIBUTION DELTA",
  EAST: "REGIONAL GAS DISTRIBUTION EAST",
  AGOT: "AGOT GDZ",
} as const;

export type GDZType = (typeof GDZ)[keyof typeof GDZ];

// ---------- Networks (MOR) ----------

export const NETWORK = {
  WESTERN: "Western Network",
  EASTERN: "Eastern Network",
} as const;

export type NetworkType = (typeof NETWORK)[keyof typeof NETWORK];

// ---------- Customer Types (NGIC) ----------

export const CUSTOMER_TYPE = [
  "NPDC Power Customers",
  "7 Energy Power Customers",
  "Direct Power Customer",
  "Commercial Customer",
  "Other Transmission",
  "Export",
] as const;

export type CustomerType = (typeof CUSTOMER_TYPE)[number];

// ---------- Franchises / UJVs (NGML) ----------

export const FRANCHISE = [
  "NGML-NIPCO UJV",
  "TRANSIT GAS FRANCHISE",
  "ENTEC GAS FRANCHISE",
  "GREEN FUELS UJV",
] as const;

export type FranchiseType = (typeof FRANCHISE)[number];

// ---------- Station Status (NGIC) ----------

export const STATION_STATUS = {
  ON_STREAM: "STATION ON STREAM",
  ON_STANDBY: "STATION ON STANDBY",
  ON_SHUTDOWN: "STATION ON SHUTDOWN",
} as const;

export type StationStatus = (typeof STATION_STATUS)[keyof typeof STATION_STATUS];

// ---------- Remarks (NGML - sentence case) ----------

export const REMARKS_PRESETS = [
  "Station on stream",
  "On Standby (customer yet to commence gas offtake)",
  "On Standby (customer on mtce shutdown)",
  "Station on standby",
  "Station on Mtce Shutdown (DD-MM-YYYY)",
  "Customer yet to commence gas offtake",
  "Station on standby (customer's plant shutdown)",
  "Station on stream (1 Kiln & 1 Turbine on mtce shutdown)",
  "Newly commissioned customer yet to commence gas offtake",
] as const;

// ---------- Labels & Section Headers ----------

export const LABEL = {
  // Core volumetric terms
  materialBalance: "Material Balance / Line Pack",
  actualSupply: "Actual Supply",
  actualOfftake: "Actual Offtake",
  designCapacity: "Design Capacity",
  contractualDemand: "Contractual Demand",
  supplyForecast: "Supply Forecast",
  productionForecast: "Production Forecast",

  // Section totals
  subTotal: "Sub-Total",
  subTotal1: "SUB -TOTAL 1", // Note the space before hyphen - from NGML
  total: "Total",
  grandTotal: "GRAND TOTAL",

  // NGML specific
  allocationFromNGIC: "ALLOCATION FROM NGIC",
  ngmlTotalAllocation: "NGML TOTAL ALLOCATION",
  ngmlNomination: "NGML NOMINATION",
  totalSupplyToAGOT: "Total Supply to AGOT GDZ",
  secondaryTariffCustomers: "SECONDARY TARIFF CUSTOMERS",

  // MOR specific
  gasSupplySituation: "GAS SUPPLY SITUATION",
  allocationAndOfftakeSituation: "ALLOCATION & OFFTAKE SITUATION",
  weekOnWeekVariance: "WEEK-ON-WEEK VARIANCE",
  contractualPressureRange: "CONTRACTUAL / EXPECTED PRESSURE RANGE",
  issuesRemarks: "ISSUES/REMARKS",

  // Other
  region: "Region",
  gasProducers: "GAS PRODUCERS",
  offtaker: "Offtaker",
  offtakersName: "OFFTAKERS NAME",
  customerType: "CUSTOMER TYPE",
  stations: "STATIONS",
  sourceOfAllocation: "Source of Allocation",
} as const;

// ---------- Column Headers - NGIC Daily ----------

export const NGIC_COLUMNS = {
  region: "REGION",
  customerType: "CUSTOMER TYPE",
  stations: "STATIONS",
  allocation: "ALLOCATION",
  offtake: "OFFTAKE (Mmscfd)", // Note: Mmscfd in NGIC report only
  pressure: "PRESSURE",
  remarks: "REMARKS",
  megawatts: "MEGAWATTS (MW)",
} as const;

// ---------- Column Headers - NGML Daily ----------

export const NGML_COLUMNS = {
  sn: "S/N",
  offtakersName: "OFFTAKERS NAME",
  designCapacity: "DESIGN CAPACITY (MMscfd)",
  nominations: "NOMINATIONS (MMscfd)",
  allocationWeekdays: "ALLOCATION (MMscfd) Weekdays",
  offtake: "OFFTAKE (MMscfd)",
  pressureInlet: "PRESSURE (BAR) [INLET",
  pressureOutlet: "OUTLET]",
  remarks: "REMARKS",
} as const;

// ---------- Column Headers - Weekly MOR Supply ----------

export const MOR_SUPPLY_COLUMNS = {
  sn: "S/N",
  gasProducers: "GAS PRODUCERS",
  volume: "VOLUME (MMscf)",
  offtakers: "Offtakers",
  sourceOfAllocation: "Source of Allocation",
  allocation: "Allocation (MMscf)",
  actualOfftake: "Actual Offtake (MMscf)",
  remarks: "REMARKS",
} as const;

// ---------- Column Headers - Weekly MOR Volume & Pressure ----------

export const MOR_VOLUME_PRESSURE_COLUMNS = {
  sn: "S/N",
  gasProducers: "GAS PRODUCERS",
  currentWeekAvgVolume: "AVERAGE VOLUME (mmscf/d)",
  currentWeekPressure: "PRESSURE (barg)",
  priorWeekAvgVolume: "AVERAGE VOLUME (mmscf/d)",
  priorWeekPressure: "PRESSURE (barg)",
  varianceVolume: "VOLUME (mmscf/d)",
  variancePressure: "PRESSURE (barg)",
  contractualPressureRange: "CONTRACTUAL / EXPECTED PRESSURE RANGE",
  issuesRemarks: "ISSUES/REMARKS",
} as const;

// ---------- Unit Notations ----------

export const UNITS = {
  // Daily rate - varies by report
  mmscfd: "MMscfd", // Standard
  mmscfdLower: "mmscf/d", // Weekly MOR
  mmscfdNGIC: "Mmscfd", // NGIC daily only

  // Period volume
  mmscf: "MMscf", // Weekly MOR

  // Pressure
  bar: "BAR", // NGML stations
  barg: "barg", // Producers (gauge pressure)
  psi: "PSI",

  // Power
  megawatts: "MEGAWATTS (MW)",
} as const;

// ---------- Report Headers ----------

export const REPORT_HEADERS = {
  ngicDaily: {
    line1: "NNPC GAS INFRASTRUCTURE COMPANY LIMITED",
    line2: "(A Subsidiary of Nigerian National Petroleum Company Limited)",
    line3: (month: string, year: number) => `GAS OFF-TAKE FOR ${month.toUpperCase()} ${year}`,
  },
  ngmlDaily: {
    line1: "NNPC GAS MARKETING LIMITED",
    line2: "Daily Gas Situation Report",
    line3: (date: string, allocation: number) =>
      `DATE: ${date}          NGML TOTAL ALLOCATION: ${allocation}`,
  },
  morSupply: {
    title: (weekOf: string) =>
      `WEEKLY GAS SUPPLY, ALLOCATIONS & OFFTAKE OVERVIEW (WEEK OF ${weekOf})`,
  },
  morVolumePressure: {
    title: (network: NetworkType) => `WEEKLY ${network.toUpperCase()} VOLUME & PRESSURE OVERVIEW`,
  },
} as const;

// ---------- Customer Alias Normalization ----------
// For ingestion - maps variants to canonical names

export const CUSTOMER_ALIASES: Record<string, string[]> = {
  GASLINK: ["GAS LINK", "GASLINK"],
  "WAPCO Sagamu": ["WAPCO Sagamu", "WAPCO SHAG"],
  "WAPCO Ewekoro": ["WAPCO Ewekoro", "WAPCO EWEK"],
  "Notore Chemicals": ["Notore Chemical Industries", "Notore Chemicals"],
  SNG: ["SNG", "SNG Aba", "Aba-SNG"], // TODO: Confirm if these are distinct stations
  NGML: ["NGML", "NGMC"], // NGMC is former name
};

// ---------- Helper Functions ----------

/**
 * Normalizes customer name to canonical form
 */
export function normalizeCustomerName(alias: string): string {
  for (const [canonical, aliases] of Object.entries(CUSTOMER_ALIASES)) {
    if (aliases.includes(alias)) {
      return canonical;
    }
  }
  return alias; // Return as-is if not in alias table
}

/**
 * Derives station status from offtake and pressure
 * Based on NGIC report formula (with bug fix)
 */
export function deriveStationStatus(offtake: number, pressure: number): StationStatus {
  if (offtake > 0) return STATION_STATUS.ON_STREAM;
  if (offtake === 0 && pressure > 0) return STATION_STATUS.ON_STANDBY;
  return STATION_STATUS.ON_SHUTDOWN;
}

/**
 * Generates zone-level aggregate remarks
 * e.g. "93 Stations on stream, 4 on shutdown, 7 on standby"
 */
export function generateZoneRollupRemarks(
  onStream: number,
  onStandby: number,
  onShutdown: number,
  namedExceptions?: string
): string {
  if (namedExceptions) {
    return namedExceptions;
  }

  const parts: string[] = [];
  if (onStream > 0) parts.push(`${onStream} Stations on stream`);
  if (onShutdown > 0) parts.push(`${onShutdown} on shutdown`);
  if (onStandby > 0) parts.push(`${onStandby} on standby`);

  return parts.join(", ");
}

/**
 * Formats unit based on report type
 */
export function getVolumeUnit(reportType: "ngic" | "ngml" | "mor-weekly"): string {
  switch (reportType) {
    case "ngic":
      return UNITS.mmscfdNGIC;
    case "ngml":
      return UNITS.mmscfd;
    case "mor-weekly":
      return UNITS.mmscf;
    default:
      return UNITS.mmscfd;
  }
}
