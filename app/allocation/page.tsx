"use client";

import { useState } from "react";
import {
  calculateAllocation,
  AllocationOutput,
  EXAMPLE_CONFIG_NOV_2024,
} from "@/lib/allocation-engine";

export default function AllocationPage() {
  // Initial state from Nov 1, 2024 example
  const [ngmlNomination, setNgmlNomination] = useState(377.0);
  const [allocationFromNGIC, setAllocationFromNGIC] = useState(353.55);
  const [output, setOutput] = useState<AllocationOutput | null>(null);

  // Customer master data (in production, fetch from API)
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

  // Calculate allocation
  const handleCalculate = () => {
    const result = calculateAllocation(
      {
        ngmlNomination,
        allocationFromNGIC,
        config: EXAMPLE_CONFIG_NOV_2024,
      },
      customerMaster
    );
    setOutput(result);
  };

  // Auto-calculate on mount
  useState(() => {
    handleCalculate();
  });

  const shortfall = ngmlNomination - allocationFromNGIC;
  const shortfallPct = ((shortfall / ngmlNomination) * 100).toFixed(2);

  return (
    <div className="min-h-screen bg-paper p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-ink">Gas Allocation Engine</h1>
          <p className="text-ink/70 mt-2">
            NGML daily allocation computation — the decision that determines who gets gas when
            there isn't enough
          </p>
        </div>

        {/* What-If Controls */}
        <div className="bg-white border border-line rounded-lg p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-ink mb-4">What-If Analysis</h2>
            <p className="text-sm text-ink/70 mb-6">
              Adjust allocation from NGIC and watch every customer's allocation recompute live
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* NGML Nomination */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-ink">
                NGML Nomination (MMscf/d)
              </label>
              <input
                type="number"
                value={ngmlNomination}
                onChange={(e) => setNgmlNomination(parseFloat(e.target.value) || 0)}
                onBlur={handleCalculate}
                className="w-full px-4 py-3 border border-line rounded-md font-mono text-lg focus:outline-none focus:ring-2 focus:ring-pine"
              />
              <p className="text-xs text-ink/60">Total NGML nominated to NGIC</p>
            </div>

            {/* Allocation from NGIC */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-ink">
                Allocation from NGIC (MMscf/d)
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="250"
                  max="400"
                  step="0.1"
                  value={allocationFromNGIC}
                  onChange={(e) => {
                    setAllocationFromNGIC(parseFloat(e.target.value));
                    handleCalculate();
                  }}
                  className="w-full h-2 bg-line rounded-lg appearance-none cursor-pointer accent-pine"
                />
                <input
                  type="number"
                  value={allocationFromNGIC}
                  onChange={(e) => setAllocationFromNGIC(parseFloat(e.target.value) || 0)}
                  onBlur={handleCalculate}
                  className="w-full px-4 py-3 border border-line rounded-md font-mono text-lg focus:outline-none focus:ring-2 focus:ring-pine"
                />
              </div>
              <p className="text-xs text-ink/60">What NGIC actually allocated (use slider to adjust)</p>
            </div>
          </div>

          {/* Shortfall Indicator */}
          <div className={`p-4 rounded-md ${shortfall > 0 ? "bg-alert/10" : "bg-success/10"}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ink">
                  {shortfall > 0 ? "Shortfall" : "Surplus"}
                </p>
                <p className="text-xs text-ink/70 mt-1">
                  Nomination vs Allocation
                </p>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-bold font-mono ${shortfall > 0 ? "text-alert" : "text-success"}`}>
                  {Math.abs(shortfall).toFixed(2)} MMscf/d
                </p>
                <p className={`text-sm font-mono ${shortfall > 0 ? "text-alert" : "text-success"}`}>
                  {shortfallPct}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Allocation Breakdown */}
        {output && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white border border-line rounded-lg p-6">
                <p className="text-sm text-ink/70">Firm Customer Total</p>
                <p className="text-3xl font-bold font-mono text-ink mt-2">
                  {output.firmTotal.toFixed(2)}
                </p>
                <p className="text-xs text-ink/60 mt-1">MMscf/d (carved out first)</p>
              </div>

              <div className="bg-white border border-line rounded-lg p-6">
                <p className="text-sm text-ink/70">Nomination Pool</p>
                <p className="text-3xl font-bold font-mono text-ink mt-2">
                  {output.nominationPool.toFixed(2)}
                </p>
                <p className="text-xs text-ink/60 mt-1">MMscf/d (for non-firm)</p>
              </div>

              <div className="bg-white border border-line rounded-lg p-6">
                <p className="text-sm text-ink/70">Allocation Pool</p>
                <p className="text-3xl font-bold font-mono text-ink mt-2">
                  {output.allocationPool.toFixed(2)}
                </p>
                <p className="text-xs text-ink/60 mt-1">MMscf/d (available)</p>
              </div>

              <div className="bg-white border border-pine/30 rounded-lg p-6 bg-pine/5">
                <p className="text-sm text-ink/70">Curtailment Factor</p>
                <p className="text-3xl font-bold font-mono text-pine mt-2">
                  {(output.curtailmentFactor * 100).toFixed(2)}%
                </p>
                <p className="text-xs text-ink/60 mt-1">
                  {output.curtailmentFactor >= 1.0
                    ? "No curtailment"
                    : `${((1 - output.curtailmentFactor) * 100).toFixed(2)}% cut`}
                </p>
              </div>
            </div>

            {/* Customer Allocations Table */}
            <div className="bg-white border border-line rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-line">
                <h2 className="text-lg font-semibold text-ink">Per-Customer Allocations</h2>
                <p className="text-sm text-ink/70 mt-1">
                  Demand weight → Nomination → Allocation → Perf
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-pine/5 border-b border-line">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold text-ink">Customer</th>
                      <th className="px-6 py-3 text-center font-semibold text-ink">Type</th>
                      <th className="px-6 py-3 text-right font-semibold text-ink">
                        Demand Weight
                      </th>
                      <th className="px-6 py-3 text-right font-semibold text-ink">
                        Nomination
                      </th>
                      <th className="px-6 py-3 text-right font-semibold text-ink">
                        Allocation
                      </th>
                      <th className="px-6 py-3 text-center font-semibold text-ink">
                        Curtailment
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {output.customerAllocations.map((customer) => (
                      <tr
                        key={customer.customerId}
                        className={`border-t border-line/30 hover:bg-pine/5 transition-colors ${
                          customer.isFirm ? "bg-success/5" : ""
                        }`}
                      >
                        <td className="px-6 py-4 text-ink font-medium">
                          {customer.customerName}
                          {customer.isFirm && (
                            <span className="ml-2 inline-block px-2 py-0.5 text-xs font-medium bg-success/20 text-success rounded">
                              FIRM
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                              customer.isFirm
                                ? "bg-success/10 text-success"
                                : "bg-flare/10 text-flare"
                            }`}
                          >
                            {customer.isFirm ? "Firm" : "Non-Firm"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-mono text-ink">
                          {customer.demandWeight.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right font-mono text-ink">
                          {customer.nomination.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right font-mono text-ink font-semibold">
                          {customer.allocation.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`font-mono text-sm ${
                              customer.curtailmentApplied >= 1.0
                                ? "text-success"
                                : "text-alert"
                            }`}
                          >
                            {(customer.curtailmentApplied * 100).toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-pine/10 border-t-2 border-pine">
                    <tr className="font-semibold">
                      <td colSpan={3} className="px-6 py-4 text-ink">
                        TOTAL
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-ink">
                        {output.totalNomination.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-ink">
                        {output.totalAllocation.toFixed(2)}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Algorithm Explanation */}
            <div className="bg-white border border-line rounded-lg p-6">
              <h3 className="text-lg font-semibold text-ink mb-4">How It Works</h3>
              <div className="space-y-3 text-sm text-ink/80">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-pine text-white flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <p>
                    <strong>Firm customers</strong> (SNG, Obajana, BUA) receive exactly what they
                    nominate, regardless of shortfall. Total:{" "}
                    <span className="font-mono">{output.firmTotal.toFixed(2)} MMscf/d</span>
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-pine text-white flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <p>
                    <strong>Two pools:</strong> Nomination pool (
                    <span className="font-mono">{output.nominationPool.toFixed(2)}</span>) and
                    allocation pool (
                    <span className="font-mono">{output.allocationPool.toFixed(2)}</span>) after
                    firm carve-out
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-pine text-white flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <p>
                    <strong>Pro-rata nominations:</strong> Each non-firm customer's nomination is
                    proportional to their demand weight
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-pine text-white flex items-center justify-center text-xs font-bold">
                    4
                  </div>
                  <p>
                    <strong>Curtailment applied:</strong> All non-firm allocations multiplied by
                    the curtailment factor (
                    <span className="font-mono">
                      {(output.curtailmentFactor * 100).toFixed(2)}%
                    </span>
                    )
                  </p>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="text-xs text-ink/50 text-center">
              Computed at {new Date(output.computedAt).toLocaleString()} · Config version:{" "}
              {output.configVersion}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
