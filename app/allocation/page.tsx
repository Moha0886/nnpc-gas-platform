"use client";

import React, { useState, useEffect } from "react";
import {
  calculateAllocation,
  AllocationOutput,
  CustomerAllocation,
  EXAMPLE_CONFIG_NOV_2024,
} from "@/lib/allocation-engine";
import { Download, Printer, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import Image from "next/image";

// Performance data types
interface PerformanceRecord {
  date: string;
  customer: string;
  nomination: number;
  allocation: number;
  actual: number;
  variance: number;
  variancePct: number;
  region: string;
  category: string;
}

// Generate sample performance data
function generateSamplePerformanceData(date: string): PerformanceRecord[] {
  const customers = [
    // Lagos
    { customer: "Transcorp Ughelli", region: "Lagos", category: "Power", nomination: 47.6, allocation: 47.6 },
    { customer: "Azura Power", region: "Lagos", category: "Power", nomination: 97.24, allocation: 97.24 },
    { customer: "NIPP Olorunsogo", region: "Lagos", category: "Power", nomination: 27.0, allocation: 27.0 },
    { customer: "GASLINK", region: "Lagos", category: "Commercial", nomination: 53.8, allocation: 53.8 },
    { customer: "Dangote Fertilizer", region: "Lagos", category: "Industrial", nomination: 186.0, allocation: 186.0 },
    { customer: "WAGP", region: "Lagos", category: "Export", nomination: 150.0, allocation: 150.0 },
    // East
    { customer: "NDPHC Calabar", region: "East", category: "Power", nomination: 57.277, allocation: 57.277 },
    { customer: "Trans-Afam", region: "East", category: "Power", nomination: 12.935, allocation: 12.935 },
    { customer: "Notore Chemical", region: "East", category: "Industrial", nomination: 1.51, allocation: 1.51 },
    // North
    { customer: "Dangote Obajana", region: "North", category: "Industrial", nomination: 82.0, allocation: 82.0 },
    { customer: "BUA Cement", region: "North", category: "Industrial", nomination: 32.5, allocation: 32.5 },
    { customer: "Paras Energy", region: "North", category: "Power", nomination: 11.2, allocation: 11.2 },
    // Delta
    { customer: "Okpai Power", region: "Delta", category: "Power", nomination: 68.5, allocation: 68.5 },
    { customer: "Indorama Eleme", region: "Delta", category: "Industrial", nomination: 42.5, allocation: 42.5 },
    { customer: "Delta IV IPP", region: "Delta", category: "Power", nomination: 24.0, allocation: 24.0 },
  ];

  return customers.map((c) => {
    // Add realistic variance (-10% to +5%)
    const varianceFactor = 0.95 + (Math.random() * 0.15);
    const actual = c.allocation * varianceFactor;
    const variance = actual - c.allocation;
    const variancePct = (variance / c.allocation) * 100;

    return {
      date,
      customer: c.customer,
      nomination: c.nomination,
      allocation: c.allocation,
      actual: parseFloat(actual.toFixed(3)),
      variance: parseFloat(variance.toFixed(3)),
      variancePct: parseFloat(variancePct.toFixed(2)),
      region: c.region,
      category: c.category,
    };
  });
}

export default function AllocationPage() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"engine" | "performance">("performance");

  // Initial state from Nov 1, 2024 example
  const [ngmlNomination, setNgmlNomination] = useState(377.0);
  const [allocationFromNGIC, setAllocationFromNGIC] = useState(353.55);
  const [output, setOutput] = useState<AllocationOutput | null>(null);

  // Performance tracking state
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [performanceData, setPerformanceData] = useState<PerformanceRecord[]>([]);

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

  // Load performance data
  useEffect(() => {
    const saved = localStorage.getItem(`allocation-performance-${selectedDate}`);
    if (saved) {
      setPerformanceData(JSON.parse(saved));
    } else {
      // Initialize with sample data
      const sampleData = generateSamplePerformanceData(selectedDate);
      setPerformanceData(sampleData);
      localStorage.setItem(`allocation-performance-${selectedDate}`, JSON.stringify(sampleData));
    }
  }, [selectedDate]);

  const shortfall = ngmlNomination - allocationFromNGIC;
  const shortfallPct = ((shortfall / ngmlNomination) * 100).toFixed(2);

  // Calculate performance metrics
  const totalNomination = performanceData.reduce((sum, r) => sum + r.nomination, 0);
  const totalAllocation = performanceData.reduce((sum, r) => sum + r.allocation, 0);
  const totalActual = performanceData.reduce((sum, r) => sum + r.actual, 0);
  const totalVariance = totalActual - totalAllocation;
  const totalVariancePct = totalAllocation > 0 ? ((totalVariance / totalAllocation) * 100) : 0;

  // Group by region
  const byRegion = performanceData.reduce((acc, record) => {
    if (!acc[record.region]) {
      acc[record.region] = {
        nomination: 0,
        allocation: 0,
        actual: 0,
        variance: 0,
      };
    }
    acc[record.region].nomination += record.nomination;
    acc[record.region].allocation += record.allocation;
    acc[record.region].actual += record.actual;
    acc[record.region].variance += record.variance;
    return acc;
  }, {} as Record<string, any>);

  // Render tabs
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-line px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Image src="/nnpc-logo.png" alt="NNPC Logo" width={60} height={60} />
            <div>
              <h1 className="text-2xl font-bold text-[#1B5E3E]">
                NNPC GAS MARKETING LIMITED
              </h1>
              <p className="text-sm text-ink/60">
                Allocation Management & Performance Tracking
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 border-b border-line">
          <button
            onClick={() => setActiveTab("performance")}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === "performance"
                ? "border-primary text-primary"
                : "border-transparent text-ink/60 hover:text-ink"
            }`}
          >
            Performance Tracking
          </button>
          <button
            onClick={() => setActiveTab("engine")}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === "engine"
                ? "border-primary text-primary"
                : "border-transparent text-ink/60 hover:text-ink"
            }`}
          >
            Allocation Engine
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "performance" ? (
        <PerformanceTrackingView
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          performanceData={performanceData}
          totalNomination={totalNomination}
          totalAllocation={totalAllocation}
          totalActual={totalActual}
          totalVariance={totalVariance}
          totalVariancePct={totalVariancePct}
          byRegion={byRegion}
        />
      ) : (
        <AllocationEngineView
          ngmlNomination={ngmlNomination}
          setNgmlNomination={setNgmlNomination}
          allocationFromNGIC={allocationFromNGIC}
          setAllocationFromNGIC={setAllocationFromNGIC}
          handleCalculate={handleCalculate}
          shortfall={shortfall}
          shortfallPct={shortfallPct}
          output={output}
        />
      )}
    </div>
  );
}

// Performance Tracking View Component
function PerformanceTrackingView({
  selectedDate,
  setSelectedDate,
  performanceData,
  totalNomination,
  totalAllocation,
  totalActual,
  totalVariance,
  totalVariancePct,
  byRegion,
}: any) {
  return (
    <div className="p-8 max-w-[1800px] mx-auto space-y-6">
      {/* Date Selector and Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-ink">Allocation vs Actual Performance</h2>
          <p className="text-sm text-ink/60 mt-1">
            Track variance between allocated and actual offtake
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-line rounded"
          />
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-line rounded hover:bg-gray-50">
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white border border-line rounded-lg p-4">
          <p className="text-sm text-ink/60">Total Nomination</p>
          <p className="text-2xl font-bold text-ink mt-1 tabular-nums">
            {totalNomination.toFixed(2)}
          </p>
          <p className="text-xs text-ink/40 mt-1">MMscfd</p>
        </div>
        <div className="bg-white border border-line rounded-lg p-4">
          <p className="text-sm text-ink/60">Total Allocation</p>
          <p className="text-2xl font-bold text-ink mt-1 tabular-nums">
            {totalAllocation.toFixed(2)}
          </p>
          <p className="text-xs text-ink/40 mt-1">MMscfd</p>
        </div>
        <div className="bg-white border border-line rounded-lg p-4">
          <p className="text-sm text-ink/60">Total Actual</p>
          <p className="text-2xl font-bold text-primary mt-1 tabular-nums">
            {totalActual.toFixed(2)}
          </p>
          <p className="text-xs text-ink/40 mt-1">MMscfd</p>
        </div>
        <div className="bg-white border border-line rounded-lg p-4">
          <p className="text-sm text-ink/60">Variance</p>
          <p className={`text-2xl font-bold mt-1 tabular-nums ${
            totalVariance >= 0 ? "text-success" : "text-alert"
          }`}>
            {totalVariance >= 0 ? "+" : ""}{totalVariance.toFixed(2)}
          </p>
          <p className="text-xs text-ink/40 mt-1">MMscfd</p>
        </div>
        <div className="bg-white border border-line rounded-lg p-4">
          <p className="text-sm text-ink/60">Variance %</p>
          <p className={`text-2xl font-bold mt-1 tabular-nums ${
            totalVariancePct >= 0 ? "text-success" : "text-alert"
          }`}>
            {totalVariancePct >= 0 ? "+" : ""}{totalVariancePct.toFixed(1)}%
          </p>
          <p className="text-xs text-ink/40 mt-1">vs Allocation</p>
        </div>
      </div>

      {/* Regional Performance */}
      <div className="bg-white border border-line rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-line bg-gray-50">
          <h3 className="text-lg font-semibold text-ink">Performance by Region</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b border-line">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-ink">Region</th>
                <th className="px-6 py-3 text-right font-semibold text-ink">Nomination</th>
                <th className="px-6 py-3 text-right font-semibold text-ink">Allocation</th>
                <th className="px-6 py-3 text-right font-semibold text-ink">Actual</th>
                <th className="px-6 py-3 text-right font-semibold text-ink">Variance</th>
                <th className="px-6 py-3 text-right font-semibold text-ink">Variance %</th>
                <th className="px-6 py-3 text-center font-semibold text-ink">Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(byRegion).map(([region, data]: [string, any]) => {
                const variancePct = ((data.variance / data.allocation) * 100);
                return (
                  <tr key={region} className="border-b border-line hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-ink">{region}</td>
                    <td className="px-6 py-4 text-right tabular-nums text-ink">
                      {data.nomination.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right tabular-nums text-ink">
                      {data.allocation.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right tabular-nums text-ink font-semibold">
                      {data.actual.toFixed(2)}
                    </td>
                    <td className={`px-6 py-4 text-right tabular-nums font-semibold ${
                      data.variance >= 0 ? "text-success" : "text-alert"
                    }`}>
                      {data.variance >= 0 ? "+" : ""}{data.variance.toFixed(2)}
                    </td>
                    <td className={`px-6 py-4 text-right tabular-nums font-semibold ${
                      variancePct >= 0 ? "text-success" : "text-alert"
                    }`}>
                      {variancePct >= 0 ? "+" : ""}{variancePct.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 text-center">
                      {Math.abs(variancePct) <= 5 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-success/10 text-success rounded">
                          <TrendingUp className="w-3 h-3" />
                          On Track
                        </span>
                      ) : variancePct < -5 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-alert/10 text-alert rounded">
                          <TrendingDown className="w-3 h-3" />
                          Under
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-yellow-500/10 text-yellow-700 rounded">
                          <AlertTriangle className="w-3 h-3" />
                          Over
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Table */}
      <div className="bg-white border border-line rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-line bg-gray-50">
          <h3 className="text-lg font-semibold text-ink">Customer Performance Detail</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b border-line">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-ink">Customer</th>
                <th className="px-6 py-3 text-left font-semibold text-ink">Region</th>
                <th className="px-6 py-3 text-left font-semibold text-ink">Category</th>
                <th className="px-6 py-3 text-right font-semibold text-ink">Nomination</th>
                <th className="px-6 py-3 text-right font-semibold text-ink">Allocation</th>
                <th className="px-6 py-3 text-right font-semibold text-ink">Actual</th>
                <th className="px-6 py-3 text-right font-semibold text-ink">Variance</th>
                <th className="px-6 py-3 text-right font-semibold text-ink">Variance %</th>
              </tr>
            </thead>
            <tbody>
              {performanceData.map((record: PerformanceRecord, idx: number) => (
                <tr key={idx} className="border-b border-line hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-ink">{record.customer}</td>
                  <td className="px-6 py-4 text-ink/70">{record.region}</td>
                  <td className="px-6 py-4 text-ink/70">{record.category}</td>
                  <td className="px-6 py-4 text-right tabular-nums text-ink">
                    {record.nomination.toFixed(3)}
                  </td>
                  <td className="px-6 py-4 text-right tabular-nums text-ink">
                    {record.allocation.toFixed(3)}
                  </td>
                  <td className="px-6 py-4 text-right tabular-nums text-ink font-semibold">
                    {record.actual.toFixed(3)}
                  </td>
                  <td className={`px-6 py-4 text-right tabular-nums font-semibold ${
                    record.variance >= 0 ? "text-success" : "text-alert"
                  }`}>
                    {record.variance >= 0 ? "+" : ""}{record.variance.toFixed(3)}
                  </td>
                  <td className={`px-6 py-4 text-right tabular-nums font-semibold ${
                    record.variancePct >= 0 ? "text-success" : "text-alert"
                  }`}>
                    {record.variancePct >= 0 ? "+" : ""}{record.variancePct.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Allocation Engine View Component (existing content)
function AllocationEngineView({
  ngmlNomination,
  setNgmlNomination,
  allocationFromNGIC,
  setAllocationFromNGIC,
  handleCalculate,
  shortfall,
  shortfallPct,
  output,
}: any) {
  return (
    <div className="min-h-screen bg-paper p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-ink">Gas Allocation Engine</h1>
          <p className="text-ink/70 mt-2">
            NGML daily allocation computation — the decision that determines who gets gas when
            there isn&apos;t enough
          </p>
        </div>

        {/* What-If Controls */}
        <div className="bg-white border border-line rounded-lg p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-ink mb-4">What-If Analysis</h2>
            <p className="text-sm text-ink/70 mb-6">
              Adjust allocation from NGIC and watch every customer&apos;s allocation recompute live
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
                    {output.customerAllocations.map((customer: CustomerAllocation) => (
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
                    <strong>Pro-rata nominations:</strong> Each non-firm customer&apos;s nomination is
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
            <div className="text-xs text-ink/50 text-center" suppressHydrationWarning>
              Computed at {new Date(output.computedAt).toLocaleString()} · Config version:{" "}
              {output.configVersion}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
