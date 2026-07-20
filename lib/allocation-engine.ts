// ============================================================================
// NNPC Gas Platform - Allocation Engine
// Based on reverse-engineered algorithm from NGML Daily Gas Situation Report
// Source: NNPC_Allocation_Engine_Addendum.md
// ============================================================================

/**
 * Allocation Engine Configuration
 * These inputs must be versioned so any historical gas day is reproducible
 */
export interface AllocationEngineConfig {
  version: string; // e.g., "2026-07-01" - effective date of this config
  demandWeights: Map<string, number>; // customerId -> demand weight
  firmCustomers: Set<string>; // customerIds that receive 100% allocation
  exchangeRate?: number; // Optional FX rate for reporting
  effectiveFrom: string; // ISO date string
  effectiveUntil?: string; // ISO date string (null = current)
  createdBy?: string; // For audit trail
  approvedBy?: string; // For maker-checker
}

/**
 * Allocation Engine Inputs
 */
export interface AllocationInputs {
  ngmlNomination: number; // Total NGML nominated to NGIC (MMscf/d)
  allocationFromNGIC: number; // What NGIC actually allocated (MMscf/d)
  config: AllocationEngineConfig; // Versioned configuration
}

/**
 * Per-customer allocation output
 */
export interface CustomerAllocation {
  customerId: string;
  customerName: string;
  demandWeight: number;
  isFirm: boolean;
  nomination: number; // MMscf/d
  allocation: number; // MMscf/d
  curtailmentApplied: number; // curtailment factor applied (1.0 = none, 0.9174 = 8.26% cut)
}

/**
 * Allocation Engine Output
 */
export interface AllocationOutput {
  // Pools
  firmTotal: number; // MMscf/d carved out for firm customers
  nominationPool: number; // ngmlNomination - firmTotal
  allocationPool: number; // allocationFromNGIC - firmTotal

  // Key metric
  curtailmentFactor: number; // allocationPool / nominationPool (e.g., 0.9174 = 91.74%)

  // Per-customer results
  customerAllocations: CustomerAllocation[];

  // Totals
  totalNomination: number;
  totalAllocation: number;

  // Metadata
  computedAt: string; // ISO timestamp
  configVersion: string;
}

/**
 * The Allocation Algorithm
 *
 * From NGML November 1 workbook (numerically verified):
 *
 * 1. Firm customers (SNG, Obajana Cement, BUA Cement) receive exactly what they
 *    nominate, regardless of shortfall. They do not participate in pro-rata.
 *
 * 2. Two pools:
 *    - nominationPool = ngmlNomination - firmTotal
 *    - allocationPool = allocationFromNGIC - firmTotal
 *
 * 3. Each non-firm customer's nomination is pro-rata on its demand weight:
 *    nomination[i] = demandWeight[i] × nominationPool / Σ demandWeight
 *
 * 4. Allocation applies a single curtailment factor to every non-firm nomination:
 *    curtailmentFactor = allocationPool / nominationPool
 *    allocation[i] = nomination[i] × curtailmentFactor
 *
 * 5. Firm customers pass through untouched:
 *    allocation[firm] = nomination[firm]
 *
 * Example (Nov 1):
 *   ngmlNomination = 377.00
 *   allocationFromNGIC = 353.55
 *   firmTotal = 93.0 (SNG 10, Obajana 50, BUA 33)
 *   nominationPool = 284.00
 *   allocationPool = 260.55
 *   curtailmentFactor = 0.9174 (91.74%)
 *
 * Non-firm customers receive 91.74% of their pro-rata nomination.
 * Firm customers receive 100%.
 */
export function calculateAllocation(
  inputs: AllocationInputs,
  customerMaster: Map<string, { name: string; nominations?: number }>
): AllocationOutput {
  const { ngmlNomination, allocationFromNGIC, config } = inputs;
  const { demandWeights, firmCustomers } = config;

  // Step 1: Calculate firm customer total
  let firmTotal = 0;
  const firmNominations = new Map<string, number>();

  for (const customerId of Array.from(firmCustomers)) {
    const customer = customerMaster.get(customerId);
    if (!customer) continue;

    // Firm customers' nominations come from their data or defaults
    const nomination = customer.nominations || 0;
    firmNominations.set(customerId, nomination);
    firmTotal += nomination;
  }

  // Step 2: Calculate pools
  const nominationPool = ngmlNomination - firmTotal;
  const allocationPool = allocationFromNGIC - firmTotal;

  // Step 3: Calculate total demand weight for non-firm customers
  let totalWeight = 0;
  for (const [customerId, weight] of Array.from(demandWeights.entries())) {
    if (!firmCustomers.has(customerId)) {
      totalWeight += weight;
    }
  }

  // Step 4: Calculate curtailment factor
  const curtailmentFactor = nominationPool > 0 ? allocationPool / nominationPool : 1.0;

  // Step 5: Calculate per-customer allocations
  const customerAllocations: CustomerAllocation[] = [];
  let totalNomination = 0;
  let totalAllocation = 0;

  for (const [customerId, weight] of Array.from(demandWeights.entries())) {
    const customer = customerMaster.get(customerId);
    if (!customer) continue;

    const isFirm = firmCustomers.has(customerId);

    let nomination: number;
    let allocation: number;
    let curtailmentApplied: number;

    if (isFirm) {
      // Firm customers: pass through untouched
      nomination = firmNominations.get(customerId) || 0;
      allocation = nomination;
      curtailmentApplied = 1.0; // No curtailment
    } else {
      // Non-firm customers: pro-rata nomination, then curtail
      nomination = totalWeight > 0 ? (weight * nominationPool) / totalWeight : 0;
      allocation = nomination * curtailmentFactor;
      curtailmentApplied = curtailmentFactor;
    }

    customerAllocations.push({
      customerId,
      customerName: customer.name,
      demandWeight: weight,
      isFirm,
      nomination,
      allocation,
      curtailmentApplied,
    });

    totalNomination += nomination;
    totalAllocation += allocation;
  }

  return {
    firmTotal,
    nominationPool,
    allocationPool,
    curtailmentFactor,
    customerAllocations,
    totalNomination,
    totalAllocation,
    computedAt: new Date().toISOString(),
    configVersion: config.version,
  };
}

/**
 * Create a new allocation configuration
 * Must be versioned for historical reproducibility
 */
export function createAllocationConfig(
  version: string,
  demandWeights: Record<string, number>,
  firmCustomerIds: string[],
  effectiveFrom: string,
  metadata?: {
    createdBy?: string;
    approvedBy?: string;
    effectiveUntil?: string;
  }
): AllocationEngineConfig {
  return {
    version,
    demandWeights: new Map(Object.entries(demandWeights)),
    firmCustomers: new Set(firmCustomerIds),
    effectiveFrom,
    effectiveUntil: metadata?.effectiveUntil,
    createdBy: metadata?.createdBy,
    approvedBy: metadata?.approvedBy,
  };
}

/**
 * Get the active configuration for a given date
 * In production, this would query a versioned config store
 */
export function getActiveConfig(
  gasDay: string,
  configs: AllocationEngineConfig[]
): AllocationEngineConfig | null {
  // Sort configs by effectiveFrom descending
  const sorted = configs.sort((a, b) => b.effectiveFrom.localeCompare(a.effectiveFrom));

  for (const config of sorted) {
    if (gasDay >= config.effectiveFrom) {
      if (!config.effectiveUntil || gasDay <= config.effectiveUntil) {
        return config;
      }
    }
  }

  return null;
}

/**
 * Validate allocation output against known totals
 * Useful for testing and verification
 */
export function validateAllocation(
  output: AllocationOutput,
  expected: {
    totalNomination?: number;
    totalAllocation?: number;
    curtailmentFactor?: number;
  },
  tolerance: number = 0.01
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (expected.totalNomination !== undefined) {
    const diff = Math.abs(output.totalNomination - expected.totalNomination);
    if (diff > tolerance) {
      errors.push(
        `Total nomination mismatch: expected ${expected.totalNomination}, got ${output.totalNomination}`
      );
    }
  }

  if (expected.totalAllocation !== undefined) {
    const diff = Math.abs(output.totalAllocation - expected.totalAllocation);
    if (diff > tolerance) {
      errors.push(
        `Total allocation mismatch: expected ${expected.totalAllocation}, got ${output.totalAllocation}`
      );
    }
  }

  if (expected.curtailmentFactor !== undefined) {
    const diff = Math.abs(output.curtailmentFactor - expected.curtailmentFactor);
    if (diff > tolerance) {
      errors.push(
        `Curtailment factor mismatch: expected ${expected.curtailmentFactor}, got ${output.curtailmentFactor}`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// Example Usage & Test Data
// ============================================================================

/**
 * Example configuration from November 1, 2024 workbook
 */
export const EXAMPLE_CONFIG_NOV_2024 = createAllocationConfig(
  "2024-11-01",
  {
    "cust-gaslink": 228,
    "cust-falcon": 43,
    "cust-wapco-ewekoro": 115,
    "cust-ibeshe": 280,
    "cust-nestle": 1,
    "cust-rite-foods": 6.5,
    // ... remaining customers with their demand weights
  },
  ["cust-sng", "cust-obajana", "cust-bua"], // Firm customers
  "2024-11-01",
  {
    createdBy: "system",
    approvedBy: "NGML-Operations",
  }
);

/**
 * Example calculation
 */
export function runExampleCalculation(): AllocationOutput {
  const customerMaster = new Map([
    ["cust-gaslink", { name: "GASLINK", nominations: 82.47 }],
    ["cust-falcon", { name: "FALCON", nominations: 15.55 }],
    ["cust-wapco-ewekoro", { name: "WAPCO EWEKORO", nominations: 41.6 }],
    ["cust-ibeshe", { name: "IBESHE CEMENT", nominations: 101.28 }],
    ["cust-nestle", { name: "NESTLE", nominations: 0.36 }],
    ["cust-rite-foods", { name: "RITE FOODS", nominations: 2.35 }],
    ["cust-sng", { name: "SNG", nominations: 10.0 }],
    ["cust-obajana", { name: "Obajana Cement", nominations: 50.0 }],
    ["cust-bua", { name: "BUA Cement", nominations: 33.0 }],
  ]);

  const inputs: AllocationInputs = {
    ngmlNomination: 377.0,
    allocationFromNGIC: 353.55,
    config: EXAMPLE_CONFIG_NOV_2024,
  };

  return calculateAllocation(inputs, customerMaster);
}
