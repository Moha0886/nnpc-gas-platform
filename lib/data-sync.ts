// Data synchronization layer for hybrid approach
// OPERATIONS pages (manual entry) → save here → Reporting dashboards (read from here)

import type { StationDailyData, ProducerDailyData, OfftakerWeeklyData } from "./nnpc-types";

const STORAGE_KEYS = {
  stationDaily: "nnpc-station-daily-data",
  producerDaily: "nnpc-producer-daily-data",
  offtakerWeekly: "nnpc-offtaker-weekly-data",
} as const;

// ============================================================================
// Station Daily Data (from Daily Situation Report)
// ============================================================================

export function getStationDailyRecords(date?: string): StationDailyData[] {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(STORAGE_KEYS.stationDaily);
  const allData: StationDailyData[] = stored ? JSON.parse(stored) : [];

  if (date) {
    return allData.filter(d => d.date === date);
  }
  return allData;
}

export function saveStationDailyRecord(record: StationDailyData): void {
  if (typeof window === "undefined") return;

  const allData = getStationDailyRecords();

  // Remove existing record for same date + station
  const filtered = allData.filter(
    d => !(d.date === record.date && d.stationId === record.stationId)
  );

  // Add new record
  filtered.push(record);

  localStorage.setItem(STORAGE_KEYS.stationDaily, JSON.stringify(filtered));
}

export function saveStationDailyBulk(records: StationDailyData[]): void {
  if (typeof window === "undefined") return;

  const allData = getStationDailyRecords();

  // Get dates being updated
  const dates = new Set(records.map(r => r.date));

  // Remove all records for those dates
  const filtered = allData.filter(d => !dates.has(d.date));

  // Add all new records
  filtered.push(...records);

  localStorage.setItem(STORAGE_KEYS.stationDaily, JSON.stringify(filtered));
}

// ============================================================================
// Producer Daily Data (from Production Dashboard)
// ============================================================================

export function getProducerDailyRecords(date?: string): ProducerDailyData[] {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(STORAGE_KEYS.producerDaily);
  const allData: ProducerDailyData[] = stored ? JSON.parse(stored) : [];

  if (date) {
    return allData.filter(d => d.date === date);
  }
  return allData;
}

export function saveProducerDailyRecord(record: ProducerDailyData): void {
  if (typeof window === "undefined") return;

  const allData = getProducerDailyRecords();

  // Remove existing record for same date + producer
  const filtered = allData.filter(
    d => !(d.date === record.date && d.producerId === record.producerId)
  );

  // Add new record
  filtered.push(record);

  localStorage.setItem(STORAGE_KEYS.producerDaily, JSON.stringify(filtered));
}

export function saveProducerDailyBulk(records: ProducerDailyData[]): void {
  if (typeof window === "undefined") return;

  const allData = getProducerDailyRecords();

  // Get dates being updated
  const dates = new Set(records.map(r => r.date));

  // Remove all records for those dates
  const filtered = allData.filter(d => !dates.has(d.date));

  // Add all new records
  filtered.push(...records);

  localStorage.setItem(STORAGE_KEYS.producerDaily, JSON.stringify(filtered));
}

// ============================================================================
// Offtaker Weekly Data (aggregated from daily data)
// ============================================================================

export function getOfftakerWeeklyRecords(weekOf?: string): OfftakerWeeklyData[] {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(STORAGE_KEYS.offtakerWeekly);
  const allData: OfftakerWeeklyData[] = stored ? JSON.parse(stored) : [];

  if (weekOf) {
    return allData.filter(d => d.weekOf === weekOf);
  }
  return allData;
}

export function saveOfftakerWeeklyRecord(record: OfftakerWeeklyData): void {
  if (typeof window === "undefined") return;

  const allData = getOfftakerWeeklyRecords();

  // Remove existing record for same week + offtaker
  const filtered = allData.filter(
    d => !(d.weekOf === record.weekOf && d.offtakerId === record.offtakerId)
  );

  // Add new record
  filtered.push(record);

  localStorage.setItem(STORAGE_KEYS.offtakerWeekly, JSON.stringify(filtered));
}

// ============================================================================
// Utility: Aggregate daily data to weekly
// ============================================================================

export function aggregateDailyToWeekly(
  dailyRecords: StationDailyData[],
  weekEndingDate: string
): OfftakerWeeklyData[] {
  // Group by stationId
  const groupedByStation = dailyRecords.reduce((acc, record) => {
    if (!acc[record.stationId]) {
      acc[record.stationId] = [];
    }
    acc[record.stationId].push(record);
    return acc;
  }, {} as Record<string, StationDailyData[]>);

  // Calculate weekly aggregates
  return Object.entries(groupedByStation).map(([stationId, records]) => {
    const totalAllocation = records.reduce((sum, r) => sum + (r.allocation || 0), 0);
    const totalOfftake = records.reduce((sum, r) => sum + (r.offtake || 0), 0);

    return {
      weekOf: weekEndingDate,
      offtakerId: stationId,
      allocation: totalAllocation,
      actualOfftake: totalOfftake,
      sourceOfAllocation: "ELPS", // Default, could be enhanced
    };
  });
}

// ============================================================================
// Data Export (for backing up to files)
// ============================================================================

export function exportAllDataToJSON(): string {
  return JSON.stringify({
    stationDaily: getStationDailyRecords(),
    producerDaily: getProducerDailyRecords(),
    offtakerWeekly: getOfftakerWeeklyRecords(),
    exportedAt: new Date().toISOString(),
  }, null, 2);
}

export function importDataFromJSON(jsonString: string): void {
  try {
    const data = JSON.parse(jsonString);

    if (data.stationDaily) {
      localStorage.setItem(STORAGE_KEYS.stationDaily, JSON.stringify(data.stationDaily));
    }
    if (data.producerDaily) {
      localStorage.setItem(STORAGE_KEYS.producerDaily, JSON.stringify(data.producerDaily));
    }
    if (data.offtakerWeekly) {
      localStorage.setItem(STORAGE_KEYS.offtakerWeekly, JSON.stringify(data.offtakerWeekly));
    }
  } catch (error) {
    console.error("Failed to import data:", error);
    throw new Error("Invalid data format");
  }
}

// ============================================================================
// Clear all data (for testing/reset)
// ============================================================================

export function clearAllData(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(STORAGE_KEYS.stationDaily);
  localStorage.removeItem(STORAGE_KEYS.producerDaily);
  localStorage.removeItem(STORAGE_KEYS.offtakerWeekly);
}
