// ============================================================================
// NNPC Gas Performance Platform - Type Definitions
// Based on the canonical data model from the build specification
// ============================================================================

// ---------- Core Types ----------

export type Corridor = "Eastern" | "Western" | "Northern" | "Lagos";

export type Subsidiary = "NGIC" | "NGML";

export type AssetClass =
  | "Pipeline"
  | "Processing plant"
  | "Compressor station"
  | "Metering station"
  | "CNG station"
  | "LPG facility";

export type AssetStatus =
  | "Operational"
  | "Partial outage"
  | "Under maintenance"
  | "Under construction";

export type Sector =
  | "Power"
  | "Fertiliser"
  | "Petrochemical"
  | "Cement"
  | "LDC / distributor"
  | "LNG feedstock"
  | "Other industry";

export type CustomerStatus = "active" | "inactive" | "suspended" | "pending";

export type GasType = "AG" | "NAG" | "Both";

// ---------- Master Data ----------

export interface Asset {
  id: string;
  name: string;
  subsidiary: Subsidiary;
  cls: AssetClass;
  corridor?: Corridor;
  nameplate: number; // MMscf/d
  diameterIn?: number; // pipelines
  lengthKm?: number; // pipelines
  designPressure?: string; // e.g. "98 barg"
  inletPressure?: number; // PSI - for pipelines
  outletPressure?: number; // PSI - for pipelines
  status: AssetStatus;
  commissioned?: number;
  source?: string; // provenance for seed data
}

export interface ProcessingPlant extends Asset {
  gasType: GasType;
  products: string[]; // ["Lean gas", "LPG", "Condensate"]
  pipelineConnection: string;
}

// ---------- Offtaker Hierarchy ----------

export type ProductType = "Lean gas" | "Rich gas" | "LPG" | "Condensate" | "LNG feedstock" | "Mixed";

export interface Offtaker {
  id: string;
  name: string;
  corridor: Corridor;
  sector: Sector;
  productType?: ProductType; // Type of gas product they take
  parentOfftakerId?: string; // null = main offtaker; set = sub-offtaker
  deliveryPointId: string; // custody-transfer point that meters it
  dcq?: number; // Daily Contract Quantity, MMscf/d
  contractId?: string;
}

// ---------- Volumetric - Gas Day Chain ----------

export interface GasDayBalance {
  gasDay: string; // 06:00–06:00 WAT
  produced: number; // Start of chain
  nglExtracted: number; // Liquids removed at plants
  receivedIntoTransmission: number; // = produced − nglExtracted − losses
  fuelGas: number;
  linePackChange: number;
  delivered: number;
  ufg: number; // computed: received − fuelGas − linePack − delivered
}

export interface OfftakerFlow {
  gasDay: string;
  offtakerId: string;
  corridor: Corridor;
  nominated: number; // what the offtaker requested
  allocated: number; // what NGML allocated (was "confirmed")
  forecastSupply: number; // forward projection
  received: number; // metered delivery to the point
  offtaken: number; // what the offtaker actually took
  varianceNomination: number; // nominated − received
  varianceReceipt: number; // received − offtaken
}

// ---------- Operations Data ----------

export interface FlareRecord {
  id: string;
  facility: string;
  facilityId: string;
  operator: string;
  corridor?: Corridor;
  date: string;
  flareVolume: number; // MMSCF
  intensity?: number; // percentage
  reason: "operational" | "safety" | "emergency" | "routine" | "technical";
  duration: number; // hours
  penaltyExposure?: {
    ngn: number;
    usd: number;
  };
  status: "reported" | "under-review" | "approved" | "penalty-applied";
}

export type DefermentCause =
  | "planned maintenance"
  | "unplanned breakdown"
  | "third-party interference"
  | "upstream supply shortfall"
  | "offtaker rejection";

export interface DefermentEvent {
  id: string;
  facilityId: string;
  facilityName: string;
  facilityType: string;
  operator: string;
  corridor?: Corridor;
  startDate: string;
  endDate?: string;
  cause: DefermentCause;
  deferredVolume: number; // MMscf/d
  cumulativeVolume: number; // MMscf
  valueOfDeferredVolume?: number; // USD or NGN
  mtbf?: number; // Mean Time Between Failures (hours)
  mttr?: number; // Mean Time To Repair (hours)
  status: "ongoing" | "resolved";
  description: string;
}

export interface Contract {
  id: string;
  contractNumber: string;
  contractName: string;
  type: "gsa" | "gpa" | "gta" | "top" | "sop"; // Gas Supply Agreement, Gas Purchase Agreement, Gas Transportation Agreement, Take-or-Pay, Ship-or-Pay
  supplier: string;
  buyer: string;
  corridor?: Corridor;
  sector?: Sector;
  startDate: string;
  endDate: string;
  status: "active" | "expired" | "terminated" | "suspended";
  dcq: number; // Daily Contract Quantity, MMscf/d
  acq?: number; // Annual Contract Quantity, BCF
  dcqDeliveryPercent?: number; // Delivery percentage against DCQ
  takeOrPay?: number; // percentage
  shipOrPay?: number; // percentage
  dso?: number; // Days Sales Outstanding
  ragStatus?: "red" | "amber" | "green"; // RAG status
}

export interface CustomerScore {
  id: string;
  customerId: string;
  customerName: string;
  corridor: Corridor;
  sector: Sector;
  dso: number; // Days Sales Outstanding
  takeReliability: number; // percentage
  margin: number; // profitability metric
  sectorRisk: "low" | "medium" | "high";
  compositeScore: number; // 0-100
}

export interface CapacityRecord {
  id: string;
  assetId: string;
  assetName: string;
  corridor?: Corridor;
  date: string;
  nameplate: number; // MMscf/d
  available: number; // MMscf/d (after maintenance/outages)
  contracted: number; // MMscf/d (committed capacity)
  actual: number; // MMscf/d (actual flow)
  utilization: number; // percentage (actual / available)
}

// ---------- Network & Infrastructure ----------

export interface Location {
  lat: number;
  lng: number;
}

export interface Pipeline extends Asset {
  type: "transmission" | "gathering" | "distribution";
  route?: Location[];
  fromFacility?: string;
  toFacility?: string;
  currentFlow?: number; // MMscf/d
  pressure?: {
    inlet: number; // PSI
    outlet: number; // PSI
  };
}

export interface MeteringStation {
  id: string;
  name: string;
  location: Location;
  corridor: Corridor;
  type: "custody-transfer" | "fiscal" | "allocation";
  flow: number; // MMscf/d
  pressure: number; // PSI
  temperature: number; // Celsius
  lastCalibration: string;
  nextCalibration: string;
  accuracy: number; // percentage
  status: AssetStatus;
}

// ---------- Production Data ----------

export interface ProductionRecord {
  id: string;
  date: string;
  facilityId: string;
  facilityName: string;
  facilityType: "field" | "well" | "plant";
  operator: string;
  corridor?: Corridor;
  production: number; // MMscf/d
  capacity: number; // MMscf/d
  utilization: number; // percentage
  nglProduction?: number; // barrels/day
  lpgProduction?: number; // MT/day
  flareVolume?: number; // MMscf/d
}

// ---------- UI State ----------

export interface CorridorFilter {
  selected: Corridor | "All";
}

export interface DateRange {
  start: string;
  end: string;
}
