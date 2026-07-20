// ============================================================================
// Flare Penalty Calculation
// Based on correct rates: $2.00/Mscf for producers ≥10k bpd, $0.50/Mscf below
// ============================================================================

/**
 * Flare penalty configuration
 * Rates are stored per Mscf (1,000 scf) in USD
 */
export interface FlarePenaltyConfig {
  /** Rate for producers with ≥10,000 bpd production */
  rateHighProduction: number; // USD per Mscf
  /** Rate for producers with <10,000 bpd production */
  rateLowProduction: number; // USD per Mscf
  /** Production threshold in barrels per day */
  productionThreshold: number; // bpd
  /** Exchange rate NGN to USD (configurable per period) */
  exchangeRate: number; // NGN per USD
}

/**
 * Default flare penalty configuration
 * Rates: $2.00/Mscf for ≥10k bpd, $0.50/Mscf for <10k bpd
 */
export const DEFAULT_FLARE_PENALTY_CONFIG: FlarePenaltyConfig = {
  rateHighProduction: 2.0, // $2.00 per Mscf
  rateLowProduction: 0.5, // $0.50 per Mscf
  productionThreshold: 10000, // 10,000 bpd
  exchangeRate: 1580, // Example rate - should be fetched from system
};

/**
 * Calculate flare penalty for a facility
 *
 * @param flareVolume - Flare volume in MMscf (million standard cubic feet)
 * @param productionRate - Production rate in barrels per day (bpd)
 * @param config - Flare penalty configuration (optional, uses defaults if not provided)
 * @returns Penalty exposure in both NGN and USD
 */
export function calculateFlarePenalty(
  flareVolume: number, // MMscf
  productionRate: number, // bpd
  config: FlarePenaltyConfig = DEFAULT_FLARE_PENALTY_CONFIG
): { ngn: number; usd: number } {
  // Convert MMscf to Mscf (1 MMscf = 1,000 Mscf)
  const flareVolumeMscf = flareVolume * 1000;

  // Determine which rate to apply based on production threshold
  const ratePerMscf =
    productionRate >= config.productionThreshold
      ? config.rateHighProduction
      : config.rateLowProduction;

  // Calculate penalty in USD
  const penaltyUSD = flareVolumeMscf * ratePerMscf;

  // Convert to NGN using exchange rate
  const penaltyNGN = penaltyUSD * config.exchangeRate;

  return {
    usd: Math.round(penaltyUSD * 100) / 100, // Round to 2 decimal places
    ngn: Math.round(penaltyNGN * 100) / 100,
  };
}

/**
 * Calculate flare penalty rate (per MMscf) for display purposes
 *
 * @param productionRate - Production rate in barrels per day (bpd)
 * @param config - Flare penalty configuration
 * @returns Rate in USD per MMscf
 */
export function getFlarePenaltyRate(
  productionRate: number,
  config: FlarePenaltyConfig = DEFAULT_FLARE_PENALTY_CONFIG
): number {
  const ratePerMscf =
    productionRate >= config.productionThreshold
      ? config.rateHighProduction
      : config.rateLowProduction;

  // Convert from per Mscf to per MMscf (multiply by 1,000)
  return ratePerMscf * 1000;
}

/**
 * Example usage:
 *
 * // For a high-production facility (≥10k bpd)
 * const penalty1 = calculateFlarePenalty(5.2, 15000);
 * // flareVolume: 5.2 MMscf
 * // productionRate: 15,000 bpd (≥10k threshold)
 * // Rate: $2.00/Mscf × 5,200 Mscf = $10,400 USD
 * // At ₦1,580/USD = ₦16,432,000 NGN
 *
 * // For a low-production facility (<10k bpd)
 * const penalty2 = calculateFlarePenalty(3.8, 7500);
 * // flareVolume: 3.8 MMscf
 * // productionRate: 7,500 bpd (<10k threshold)
 * // Rate: $0.50/Mscf × 3,800 Mscf = $1,900 USD
 * // At ₦1,580/USD = ₦3,002,000 NGN
 */
