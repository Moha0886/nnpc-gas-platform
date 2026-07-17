import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format number with commas and optional decimal places
 */
export function formatNumber(
  value: number,
  decimals: number = 0
): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format number as percentage
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${formatNumber(value, decimals)}%`;
}

/**
 * Format volume with unit (MMscf/d, BCF, etc.)
 */
export function formatVolume(
  value: number,
  unit: string = "MMscf/d",
  decimals: number = 0
): string {
  return `${formatNumber(value, decimals)} ${unit}`;
}

/**
 * Format currency (NGN or USD)
 */
export function formatCurrency(
  value: number,
  currency: "NGN" | "USD" = "USD",
  decimals: number = 0
): string {
  const symbol = currency === "NGN" ? "₦" : "$";
  return `${symbol}${formatNumber(value, decimals)}`;
}

/**
 * Format date as YYYY-MM-DD
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString().split("T")[0];
}

/**
 * Get today's gas day (06:00 - 06:00 WAT)
 * Gas day starts at 06:00, so before 06:00 today is yesterday's gas day
 */
export function getCurrentGasDay(): string {
  const now = new Date();
  const hour = now.getHours();

  // If before 06:00, use yesterday's date
  if (hour < 6) {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    return formatDate(yesterday);
  }

  return formatDate(now);
}

/**
 * Calculate UFG (Unaccounted For Gas)
 * UFG = received - fuelGas - linePackChange - delivered
 */
export function calculateUFG(
  received: number,
  fuelGas: number,
  linePackChange: number,
  delivered: number
): number {
  return received - fuelGas - linePackChange - delivered;
}

/**
 * Calculate utilization percentage
 */
export function calculateUtilization(actual: number, capacity: number): number {
  if (capacity === 0) return 0;
  return (actual / capacity) * 100;
}

/**
 * Get RAG (Red-Amber-Green) status based on percentage threshold
 */
export function getRAGStatus(
  value: number,
  greenThreshold: number = 90,
  amberThreshold: number = 70
): "red" | "amber" | "green" {
  if (value >= greenThreshold) return "green";
  if (value >= amberThreshold) return "amber";
  return "red";
}

/**
 * Get color class for RAG status
 */
export function getRAGColor(
  status: "red" | "amber" | "green"
): string {
  switch (status) {
    case "green":
      return "text-pine bg-pine/10";
    case "amber":
      return "text-flare bg-flare/10";
    case "red":
      return "text-alert bg-alert/10";
  }
}

/**
 * Generate a unique ID (simple implementation)
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}
