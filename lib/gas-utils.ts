// ============================================================================
// Gas Operations Utilities
// Transformations, calculations, and validators for Nigerian Gas Platform
// ============================================================================

import type {
  NationalGasUtilization,
  GasBalanceIndex,
  WeeklyVariance,
  ProducerContribution,
  ProducerCategory,
  ELPSPressureData,
  Pressure,
  PressureUnit,
} from "./types";

// ============================================================================
// UNIT CONVERSIONS
// ============================================================================

/**
 * Convert MMscfd to Bcfd (Billion cubic feet per day)
 */
export function mmscfdToBcfd(mmscfd: number): number {
  return mmscfd / 1000;
}

/**
 * Convert Bcfd to MMscfd (Million cubic feet per day)
 */
export function bcfdToMmscfd(bcfd: number): number {
  return bcfd * 1000;
}

/**
 * Convert MMscf to Bcf (for weekly totals)
 */
export function mmscfToBcf(mmscf: number): number {
  return mmscf / 1000;
}

/**
 * Convert pressure between different units
 */
export function convertPressure(
  value: number,
  from: PressureUnit,
  to: PressureUnit
): number {
  // Convert to PSI first (base unit)
  let psi: number;

  switch (from) {
    case "psi":
      psi = value;
      break;
    case "bar":
    case "barg":
      psi = value * 14.5038; // 1 bar = 14.5038 psi
      break;
    case "kPa":
      psi = value * 0.145038; // 1 kPa = 0.145038 psi
      break;
    default:
      throw new Error(`Unsupported pressure unit: ${from}`);
  }

  // Convert from PSI to target unit
  switch (to) {
    case "psi":
      return psi;
    case "bar":
    case "barg":
      return psi / 14.5038;
    case "kPa":
      return psi / 0.145038;
    default:
      throw new Error(`Unsupported pressure unit: ${to}`);
  }
}

/**
 * Format pressure with unit
 */
export function formatPressure(pressure: Pressure): string {
  return `${pressure.value.toFixed(1)} ${pressure.unit}`;
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate producer pressure is within contractual range
 */
export function validateProducerPressure(
  pressure: number,
  contractRange: { min: number; max: number }
): {
  valid: boolean;
  breach: boolean;
  message?: string;
} {
  if (pressure < contractRange.min) {
    return {
      valid: false,
      breach: true,
      message: `Pressure ${pressure} barg is below minimum ${contractRange.min} barg`,
    };
  }

  if (pressure > contractRange.max) {
    return {
      valid: false,
      breach: true,
      message: `Pressure ${pressure} barg exceeds maximum ${contractRange.max} barg`,
    };
  }

  return {
    valid: true,
    breach: false,
  };
}

/**
 * Validate ELPS pressure status
 */
export function getELPSPressureStatus(
  wgtpPressure: number,
  wgtpMin: number,
  itokiPressure: number,
  itokiMin: number
): "normal" | "low" | "critical" {
  const wgtpDiff = wgtpPressure - wgtpMin;
  const itokiDiff = itokiPressure - itokiMin;

  // Critical if either is below minimum
  if (wgtpPressure < wgtpMin || itokiPressure < itokiMin) {
    return "critical";
  }

  // Low if either is within 5% of minimum
  const wgtpThreshold = wgtpMin * 1.05;
  const itokiThreshold = itokiMin * 1.05;

  if (wgtpPressure < wgtpThreshold || itokiPressure < itokiThreshold) {
    return "low";
  }

  return "normal";
}

/**
 * Validate gas day balance (basic mass balance check)
 */
export function validateGasDayBalance(
  produced: number,
  nglExtracted: number,
  receivedIntoTransmission: number,
  fuelGas: number,
  linePackChange: number,
  delivered: number,
  ufg: number,
  tolerance: number = 0.02 // 2% tolerance
): { valid: boolean; error?: number } {
  // Mass balance: Produced - NGL = Received
  // Received - FuelGas - LinePack = Delivered + UFG

  const expectedReceived = produced - nglExtracted;
  const receivedError = Math.abs(receivedIntoTransmission - expectedReceived) / produced;

  const expectedDelivered = receivedIntoTransmission - fuelGas - linePackChange - ufg;
  const deliveredError = Math.abs(delivered - expectedDelivered) / receivedIntoTransmission;

  const maxError = Math.max(receivedError, deliveredError);

  return {
    valid: maxError <= tolerance,
    error: maxError,
  };
}

// ============================================================================
// CALCULATION UTILITIES
// ============================================================================

/**
 * Calculate Gas Balance Index (GBI)
 */
export function calculateGBI(allocation: number, actualOfftake: number): number {
  if (allocation === 0) return 0;
  return actualOfftake / allocation;
}

/**
 * Calculate variance percentage
 */
export function calculateVariancePercent(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Calculate week-over-week variance
 */
export function calculateWeeklyVariance(
  metric: string,
  currentWeek: number,
  priorWeek: number
): WeeklyVariance {
  const variance = currentWeek - priorWeek;
  const variancePercent = calculateVariancePercent(currentWeek, priorWeek);

  let trend: "up" | "down" | "stable";
  if (Math.abs(variancePercent) < 1) {
    trend = "stable";
  } else if (variance > 0) {
    trend = "up";
  } else {
    trend = "down";
  }

  return {
    metric,
    currentWeek,
    priorWeek,
    variance,
    variancePercent,
    trend,
  };
}

/**
 * Calculate national gas utilization breakdown
 */
export function calculateNationalUtilization(
  totalProduction: number, // Bcfd
  domestic: number,
  exportVolume: number,
  reinjection: number,
  flared: number
): NationalGasUtilization {
  const linePackOther = totalProduction - domestic - exportVolume - reinjection - flared;

  return {
    date: new Date().toISOString(),
    totalProduction,
    domestic: {
      volume: domestic,
      percentage: (domestic / totalProduction) * 100,
    },
    export: {
      volume: exportVolume,
      percentage: (exportVolume / totalProduction) * 100,
    },
    reinjection: {
      volume: reinjection,
      percentage: (reinjection / totalProduction) * 100,
    },
    flared: {
      volume: flared,
      percentage: (flared / totalProduction) * 100,
    },
    linePackOther: {
      volume: linePackOther,
      percentage: (linePackOther / totalProduction) * 100,
    },
  };
}

/**
 * Calculate GBI for a region
 */
export function calculateRegionalGBI(
  region: "Western/North" | "Eastern",
  date: string,
  nomination: number,
  allocation: number,
  actualOfftake: number
): GasBalanceIndex {
  const gbi = calculateGBI(allocation, actualOfftake);
  const variance = allocation - actualOfftake;
  const variancePercent = calculateVariancePercent(actualOfftake, allocation);

  return {
    date,
    region,
    nomination,
    allocation,
    actualOfftake,
    gbi,
    variance,
    variancePercent,
  };
}

/**
 * Calculate producer contribution by category
 */
export function calculateProducerContribution(
  category: ProducerCategory,
  currentWeekProduction: number,
  previousWeekProduction: number,
  totalProduction: number
): ProducerContribution {
  const percentage = (currentWeekProduction / totalProduction) * 100;
  const variance = currentWeekProduction - previousWeekProduction;

  return {
    category,
    currentWeek: currentWeekProduction,
    previousWeek: previousWeekProduction,
    percentage,
    variance,
  };
}

/**
 * Calculate power plant efficiency (MW per MMscfd)
 */
export function calculatePowerEfficiency(megawatts: number, gasOfftake: number): number {
  if (gasOfftake === 0) return 0;
  return megawatts / gasOfftake;
}

/**
 * Calculate capacity utilization
 */
export function calculateUtilization(actual: number, capacity: number): number {
  if (capacity === 0) return 0;
  return (actual / capacity) * 100;
}

/**
 * Calculate performance ratio (Perf = Actual Offtake / Allocation)
 */
export function calculatePerformanceRatio(actualOfftake: number, allocation: number): number {
  if (allocation === 0) return 0;
  return actualOfftake / allocation;
}

// ============================================================================
// DATA AGGREGATION UTILITIES
// ============================================================================

/**
 * Aggregate daily data to weekly totals
 */
export function aggregateToWeekly(dailyVolumes: number[]): {
  weekTotal: number;
  dailyAverage: number;
} {
  const weekTotal = dailyVolumes.reduce((sum, vol) => sum + vol, 0);
  const dailyAverage = weekTotal / dailyVolumes.length;

  return {
    weekTotal,
    dailyAverage,
  };
}

/**
 * Calculate material balance / line pack
 */
export function calculateMaterialBalance(
  totalSupply: number,
  totalOfftake: number
): number {
  return totalSupply - totalOfftake;
}

// ============================================================================
// FORMATTING UTILITIES
// ============================================================================

/**
 * Format volume with appropriate unit
 */
export function formatVolume(mmscfd: number, unit: "MMscfd" | "Bcfd" = "MMscfd"): string {
  if (unit === "Bcfd") {
    return `${mmscfdToBcfd(mmscfd).toFixed(2)} Bcfd`;
  }
  return `${mmscfd.toFixed(2)} MMscfd`;
}

/**
 * Format percentage
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format variance with sign
 */
export function formatVariance(variance: number, unit: string = ""): string {
  const sign = variance >= 0 ? "+" : "";
  return `${sign}${variance.toFixed(2)}${unit ? " " + unit : ""}`;
}

/**
 * Format trend indicator
 */
export function formatTrend(trend: "up" | "down" | "stable"): string {
  switch (trend) {
    case "up":
      return "▲";
    case "down":
      return "▼";
    case "stable":
      return "◆";
  }
}

// ============================================================================
// REPORT DATA TRANSFORMATIONS
// ============================================================================

/**
 * Transform daily data to NGIC report format
 */
export function transformToNGICReport(
  stations: Array<{
    id: string;
    name: string;
    allocation: number;
    offtake: number;
    pressure: number;
    megawatts?: number;
  }>
) {
  return stations.map((station) => ({
    ...station,
    status:
      station.offtake === 0
        ? ("offline" as const)
        : station.offtake < station.allocation * 0.5
        ? ("partial-outage" as const)
        : ("operational" as const),
    utilization: calculateUtilization(station.offtake, station.allocation),
    variance: station.allocation - station.offtake,
  }));
}

/**
 * Transform daily data to NGML report format
 */
export function transformToNGMLReport(
  stations: Array<{
    id: string;
    name: string;
    designCapacity: number;
    nominations: number;
    allocation: number;
    offtake: number;
    pressureInlet: number;
    pressureOutlet: number;
  }>
) {
  return stations.map((station) => ({
    ...station,
    utilization: calculateUtilization(station.offtake, station.designCapacity),
    performance: calculatePerformanceRatio(station.offtake, station.allocation),
    pressureDrop: station.pressureInlet - station.pressureOutlet,
  }));
}
