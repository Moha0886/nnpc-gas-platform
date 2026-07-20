// ============================================================================
// NNPC Gas Platform - NNPC-Specific Type Definitions
// Types for the four standard NNPC reports based on exact workbook structure
// ============================================================================

import {
  GDZType,
  NetworkType,
  CustomerType,
  FranchiseType,
  StationStatus,
} from "./nomenclature";

// ---------- NGIC Daily Gas Off-Take Report Types ----------

export interface NGICRegion {
  region: string; // e.g., "Lagos", "Western", "Eastern"
  customerTypes: NGICCustomerType[];
  total: NGICTotalRow;
}

export interface NGICCustomerType {
  customerType: CustomerType;
  stations: NGICStation[];
  subTotal: NGICTotalRow;
}

export interface NGICStation {
  id: string;
  name: string; // Station name
  allocation: number; // MMscfd
  offtake: number; // Mmscfd (note: special casing for NGIC)
  pressure: number; // BAR
  status?: StationStatus; // Derived from offtake & pressure
  remarks?: string;
  megawatts?: number; // Only for power customers
}

export interface NGICTotalRow {
  allocation: number;
  offtake: number;
  megawatts?: number;
}

export interface NGICDailyReport {
  date: string; // Or date range
  month: string; // e.g., "JUNE"
  year: number;
  regions: NGICRegion[];
  grandTotal: NGICTotalRow;
}

// ---------- NGML Daily Gas Situation Report Types ----------

export interface NGMLDailyReport {
  date: string;
  ngmlTotalAllocation: number;
  summary: NGMLSummarySection;
  detail: NGMLDetailSection;
}

export interface NGMLSummarySection {
  zones: NGMLZoneSummary[];
  subTotal1: NGMLSummaryRow;
  secondaryTariff: NGMLSummaryRow;
  totalSupplyToAGOT: NGMLSummaryRow;
}

export interface NGMLZoneSummary {
  zone: GDZType;
  designCapacity: number; // MMscfd
  nominations: number; // MMscfd
  allocation: number; // MMscfd (weekdays)
  offtake: number; // MMscfd
}

export interface NGMLSummaryRow {
  label: string;
  designCapacity: number;
  nominations: number;
  allocation: number;
  offtake: number;
}

export interface NGMLDetailSection {
  zones: NGMLZoneDetail[];
  poolBanner: {
    allocationFromNGIC: number;
    ngmlNomination: number;
  };
}

export interface NGMLZoneDetail {
  zone: GDZType;
  franchises: NGMLFranchise[];
  zoneRemarks?: string; // Aggregate zone-level remarks
}

export interface NGMLFranchise {
  franchise?: FranchiseType; // Optional - some stations are direct
  stations: NGMLStation[];
}

export interface NGMLStation {
  id: string;
  sn: number; // Continuous serial across whole report
  snZone: number; // Serial within zone
  name: string;
  designCapacity: number; // MMscfd
  nominations: number; // MMscfd
  allocation: number; // MMscfd (weekdays)
  offtake: number; // MMscfd
  pressureInlet: number; // BAR
  pressureOutlet: number; // BAR
  remarks: string;
}

// ---------- Weekly MOR - Supply, Allocation & Offtake Types ----------

export interface MORSupplyReport {
  weekOf: string; // Date string
  network: NetworkType;
  gasSupply: MORGasSupply;
  allocationAndOfftake: MORAllocationOfftake;
  remarks?: string;
}

export interface MORGasSupply {
  producers: MORProducer[];
  total: number; // MMscf
}

export interface MORProducer {
  sn: number;
  name: string; // Gas producer name
  volume: number; // MMscf (week total)
}

export interface MORAllocationOfftake {
  offtakers: MOROfftaker[];
  total: MOROfftakeTotal;
  materialBalance: number; // Material Balance / Line Pack
}

export interface MOROfftaker {
  sn: number;
  name: string;
  sourceOfAllocation: string; // e.g., "ELPS", "OB3"
  allocation: number; // MMscf
  actualOfftake: number; // MMscf
}

export interface MOROfftakeTotal {
  allocation: number;
  actualOfftake: number;
}

// ---------- Weekly MOR - Volume & Pressure Types ----------

export interface MORVolumePressureReport {
  weekOf: string;
  network: NetworkType;
  producers: MORProducerVolumePress[];
}

export interface MORProducerVolumePress {
  sn: number;
  name: string; // Gas producer name

  // Current week
  currentWeek: {
    avgVolume: number; // mmscf/d
    pressure: number; // barg
  };

  // Prior week
  priorWeek: {
    avgVolume: number; // mmscf/d
    pressure: number; // barg
  };

  // Week-on-week variance
  variance: {
    volume: number; // mmscf/d
    pressure: number; // barg
  };

  contractualPressureRange: string; // e.g., "55 - 70"
  pressureBreach?: boolean; // Auto-flagged if current pressure outside range
  issuesRemarks?: string;
}

// ---------- Station Master Data (underlying data model) ----------

export interface StationMaster {
  id: string;
  name: string;
  gdz?: GDZType; // For NGML stations
  region?: string; // For NGIC stations
  customerType?: CustomerType; // For NGIC
  franchise?: FranchiseType; // For NGML
  designCapacity: number; // MMscfd
  contractualDemand?: number; // Distinct from design capacity
  deliveryPointId?: string; // Metering/custody transfer point
}

// ---------- Gas Producer Master Data ----------

export interface GasProducerMaster {
  id: string;
  name: string;
  network: NetworkType;
  contractualPressureRange?: {
    min: number; // barg
    max: number; // barg
  };
}

// ---------- Daily Operations Data ----------

export interface StationDailyData {
  date: string;
  stationId: string;
  allocation: number;
  nominations?: number;
  offtake: number;
  pressureInlet?: number;
  pressureOutlet?: number;
  pressure?: number; // For NGIC (single pressure)
  remarks?: string;
  megawatts?: number; // For power stations
}

export interface ProducerDailyData {
  date: string;
  producerId: string;
  volume: number; // MMscf/d
  pressure: number; // barg
}

// ---------- Weekly Aggregated Data ----------

export interface ProducerWeeklyData {
  weekOf: string;
  producerId: string;
  avgVolume: number; // mmscf/d
  avgPressure: number; // barg
  totalVolume: number; // MMscf (week total)
}

export interface OfftakerWeeklyData {
  weekOf: string;
  offtakerId: string;
  allocation: number; // MMscf
  actualOfftake: number; // MMscf
  sourceOfAllocation: string;
}

// ---------- Report Configuration ----------

export interface ReportDateRange {
  start: string;
  end: string;
}

export interface ReportFilter {
  dateRange?: ReportDateRange;
  network?: NetworkType;
  gdz?: GDZType;
  region?: string;
}
