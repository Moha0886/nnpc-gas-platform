"use client";

import { useState } from "react";
import { producersWestern } from "@/lib/nnpc-seed-data";

// Mock weekly data - in production, fetch from API
const mockWeeklyData = {
  weekOf: "November 1-7, 2024",
  producers: [
    {
      id: "prod-w-001",
      name: "CNL-Escravos",
      currentWeek: { volume: 330.09, pressure: 82.10 },
      priorWeek: { volume: 352.96, pressure: 81.83 },
      contractualRange: { min: 80, max: 85 },
      sourceOfAllocation: "GASLINK, Falcon, Industrial Customers",
    },
    {
      id: "prod-w-002",
      name: "NEPL/NDW Utorogu",
      currentWeek: { volume: 183.73, pressure: 54.08 },
      priorWeek: { volume: 201.89, pressure: 53.56 },
      contractualRange: { min: 72, max: 76.9 },
      sourceOfAllocation: "Power Stations, NGML Customers",
    },
    {
      id: "prod-w-003",
      name: "NEPL Oredo FST3 (OGPOOC)",
      currentWeek: { volume: 16.15, pressure: 38.19 },
      priorWeek: { volume: 14.91, pressure: 54.40 },
      contractualRange: { min: 55, max: 70 },
      sourceOfAllocation: "Various NGML Customers",
    },
    {
      id: "prod-w-004",
      name: "NEPL Oredo (IGHF)",
      currentWeek: { volume: 35.16, pressure: 49.60 },
      priorWeek: { volume: 45.34, pressure: 43.67 },
      contractualRange: { min: 55, max: 70 },
      sourceOfAllocation: "Mixed Customers",
    },
    {
      id: "prod-w-005",
      name: "Pan Ocean",
      currentWeek: { volume: 96.75, pressure: 72.02 },
      priorWeek: { volume: 108.15, pressure: 72.22 },
      contractualRange: { min: 55, max: 70 },
      sourceOfAllocation: "Industrial Customers",
    },
    {
      id: "prod-w-006",
      name: "Seplat Oben",
      currentWeek: { volume: 300.59, pressure: 56.31 },
      priorWeek: { volume: 290.81, pressure: 55.54 },
      contractualRange: { min: 57, max: 75 },
      sourceOfAllocation: "NGML Franchise Customers",
    },
    {
      id: "prod-w-007",
      name: "SPDC - Tunu/FYIP/Otumara",
      currentWeek: { volume: 77.14, pressure: 79.96 },
      priorWeek: { volume: 27.39, pressure: 81.89 },
      contractualRange: { min: 70, max: 80 },
      sourceOfAllocation: "NPDC JV, SPDC Customers",
    },
    {
      id: "prod-w-008",
      name: "NEPL/Neconde Odidi",
      currentWeek: { volume: 0, pressure: 0 },
      priorWeek: { volume: 0, pressure: 0 },
      contractualRange: null,
      sourceOfAllocation: "On Shutdown",
    },
    {
      id: "prod-w-009",
      name: "AHL",
      currentWeek: { volume: 272.16, pressure: 71.42 },
      priorWeek: { volume: 292.33, pressure: 71.26 },
      contractualRange: { min: 50, max: 78 },
      sourceOfAllocation: "NPDC JV, CNL, Seplat customers",
    },
    {
      id: "prod-w-010",
      name: "Platform Petroleum",
      currentWeek: { volume: 17.90, pressure: 55.73 },
      priorWeek: { volume: 18.22, pressure: 58.93 },
      contractualRange: { min: 50, max: 60 },
      sourceOfAllocation: "Ughelli East customers",
    },
    {
      id: "prod-w-011",
      name: "Xenergi",
      currentWeek: { volume: 17.37, pressure: 59.31 },
      priorWeek: { volume: 16.67, pressure: 62.97 },
      contractualRange: { min: 70, max: 85 },
      sourceOfAllocation: "NPDC JV, MSN/Raffles/Oceandiare",
    },
    {
      id: "prod-w-012",
      name: "NEPL Ughelli",
      currentWeek: { volume: 43.01, pressure: 24.21 },
      priorWeek: { volume: 47.60, pressure: 24.21 },
      contractualRange: null, // Low pressure line
      sourceOfAllocation: "Transcorp Ughelli (dedicated)",
    },
    {
      id: "prod-w-013",
      name: "Chorus Energy",
      currentWeek: { volume: 16.81, pressure: 60.39 },
      priorWeek: { volume: 16.82, pressure: 64.01 },
      contractualRange: { min: 70, max: 85 },
      sourceOfAllocation: "NPDC JV customers",
    },
  ],
};

function checkPressureBreach(
  current: number,
  range: { min: number; max: number } | null
): "critical" | "warning" | "ok" {
  if (!range || current === 0) return "ok";

  const deviation =
    current < range.min
      ? (range.min - current) / range.min
      : current > range.max
      ? (current - range.max) / range.max
      : 0;

  if (deviation > 0.2) return "critical"; // >20% deviation
  if (deviation > 0.05) return "warning"; // >5% deviation
  return "ok";
}

export default function SupplyPage() {
  const [selectedWeek, setSelectedWeek] = useState("current");

  // Calculate totals
  const totalCurrentVolume = mockWeeklyData.producers.reduce(
    (sum, p) => sum + p.currentWeek.volume,
    0
  );
  const totalPriorVolume = mockWeeklyData.producers.reduce(
    (sum, p) => sum + p.priorWeek.volume,
    0
  );
  const volumeVariance = totalCurrentVolume - totalPriorVolume;
  const volumeVariancePct = ((volumeVariance / totalPriorVolume) * 100).toFixed(2);

  // Count pressure breaches
  const breachCount = mockWeeklyData.producers.filter(
    (p) => checkPressureBreach(p.currentWeek.pressure, p.contractualRange) !== "ok"
  ).length;

  return (
    <div className="min-h-screen bg-paper p-8">
      <div className="max-w-[1800px] mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-ink">Gas Supply Situation</h1>
          <p className="text-ink/70 mt-2">
            Western Network — Weekly gas received from upstream operators into NGIC transmission
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white border border-line rounded-lg p-6">
            <p className="text-sm text-ink/70">Total Volume (Current Week)</p>
            <p className="text-3xl font-bold font-mono text-ink mt-2">
              {totalCurrentVolume.toFixed(2)}
            </p>
            <p className="text-xs text-ink/60 mt-1">mmscf/d</p>
          </div>

          <div
            className={`bg-white border rounded-lg p-6 ${
              volumeVariance >= 0 ? "border-success/30 bg-success/5" : "border-alert/30 bg-alert/5"
            }`}
          >
            <p className="text-sm text-ink/70">Week-on-Week Variance</p>
            <p
              className={`text-3xl font-bold font-mono mt-2 ${
                volumeVariance >= 0 ? "text-success" : "text-alert"
              }`}
            >
              {volumeVariance >= 0 ? "+" : ""}
              {volumeVariance.toFixed(2)}
            </p>
            <p className="text-xs text-ink/60 mt-1">
              mmscf/d ({volumeVariance >= 0 ? "+" : ""}
              {volumeVariancePct}%)
            </p>
          </div>

          <div
            className={`bg-white border rounded-lg p-6 ${
              breachCount > 0 ? "border-alert/30 bg-alert/5" : "border-success/30 bg-success/5"
            }`}
          >
            <p className="text-sm text-ink/70">Pressure Breaches</p>
            <p
              className={`text-3xl font-bold font-mono mt-2 ${
                breachCount > 0 ? "text-alert" : "text-success"
              }`}
            >
              {breachCount}
            </p>
            <p className="text-xs text-ink/60 mt-1">
              {breachCount > 0 ? "producers outside range" : "all within range"}
            </p>
          </div>

          <div className="bg-white border border-line rounded-lg p-6">
            <p className="text-sm text-ink/70">Active Producers</p>
            <p className="text-3xl font-bold font-mono text-ink mt-2">
              {mockWeeklyData.producers.filter((p) => p.currentWeek.volume > 0).length}
            </p>
            <p className="text-xs text-ink/60 mt-1">of 13 producing</p>
          </div>
        </div>

        {/* Week Selector */}
        <div className="bg-white border border-line rounded-lg p-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-ink">Week of:</label>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="px-4 py-2 border border-line rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pine"
            >
              <option value="current">{mockWeeklyData.weekOf} (Current)</option>
              <option value="prior">October 25-31, 2024 (Prior)</option>
              <option value="w-2">October 18-24, 2024</option>
            </select>
          </div>
        </div>

        {/* Gas Producers Table */}
        <div className="bg-white border border-line rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-line bg-pine/5">
            <h2 className="text-lg font-semibold text-ink">
              Weekly Western Network Volume & Pressure Overview
            </h2>
            <p className="text-sm text-ink/70 mt-1">
              Gas received from upstream operators (SPDC, CNL, NEPL, Seplat, etc.)
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-pine/10 border-b-2 border-pine">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-ink w-8">S/N</th>
                  <th className="px-4 py-3 text-left font-semibold text-ink">Gas Producers</th>
                  <th className="px-4 py-3 text-right font-semibold text-ink" colSpan={2}>
                    Current Week
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-ink" colSpan={2}>
                    Prior Week
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-ink" colSpan={2}>
                    Week-on-Week Variance
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-ink">
                    Contractual Pressure Range
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-ink">
                    Source of Allocation
                  </th>
                </tr>
                <tr className="bg-pine/5 border-b border-line text-xs">
                  <th></th>
                  <th></th>
                  <th className="px-4 py-2 text-right font-medium text-ink/70">
                    Volume
                    <br />
                    (mmscf/d)
                  </th>
                  <th className="px-4 py-2 text-right font-medium text-ink/70">
                    Pressure
                    <br />
                    (barg)
                  </th>
                  <th className="px-4 py-2 text-right font-medium text-ink/70">
                    Volume
                    <br />
                    (mmscf/d)
                  </th>
                  <th className="px-4 py-2 text-right font-medium text-ink/70">
                    Pressure
                    <br />
                    (barg)
                  </th>
                  <th className="px-4 py-2 text-right font-medium text-ink/70">
                    Volume
                    <br />
                    (mmscf/d)
                  </th>
                  <th className="px-4 py-2 text-right font-medium text-ink/70">
                    Pressure
                    <br />
                    (barg)
                  </th>
                  <th className="px-4 py-2 text-center font-medium text-ink/70">(barg)</th>
                  <th className="px-4 py-2 text-left font-medium text-ink/70">
                    Customers Supplied
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockWeeklyData.producers.map((producer, idx) => {
                  const volumeVar = producer.currentWeek.volume - producer.priorWeek.volume;
                  const pressureVar = producer.currentWeek.pressure - producer.priorWeek.pressure;
                  const breachStatus = checkPressureBreach(
                    producer.currentWeek.pressure,
                    producer.contractualRange
                  );

                  return (
                    <tr
                      key={producer.id}
                      className={`border-t border-line/30 hover:bg-pine/5 transition-colors ${
                        breachStatus === "critical"
                          ? "bg-alert/5"
                          : breachStatus === "warning"
                          ? "bg-flare/5"
                          : ""
                      }`}
                    >
                      <td className="px-4 py-4 text-ink/70 font-mono">{idx + 1}</td>
                      <td className="px-4 py-4 text-ink font-medium">
                        {producer.name}
                        {producer.currentWeek.volume === 0 && (
                          <span className="ml-2 inline-block px-2 py-0.5 text-xs font-medium bg-ink/10 text-ink/60 rounded">
                            SHUTDOWN
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-right font-mono text-ink">
                        {producer.currentWeek.volume.toFixed(2)}
                      </td>
                      <td
                        className={`px-4 py-4 text-right font-mono ${
                          breachStatus === "critical"
                            ? "text-alert font-bold"
                            : breachStatus === "warning"
                            ? "text-flare font-semibold"
                            : "text-ink"
                        }`}
                      >
                        {producer.currentWeek.pressure.toFixed(2)}
                        {breachStatus !== "ok" && (
                          <span className="ml-1 text-alert">⚠</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-right font-mono text-ink/70">
                        {producer.priorWeek.volume.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 text-right font-mono text-ink/70">
                        {producer.priorWeek.pressure.toFixed(2)}
                      </td>
                      <td
                        className={`px-4 py-4 text-right font-mono ${
                          volumeVar >= 0 ? "text-success" : "text-alert"
                        }`}
                      >
                        {volumeVar >= 0 ? "+" : ""}
                        {volumeVar.toFixed(2)}
                      </td>
                      <td
                        className={`px-4 py-4 text-right font-mono ${
                          Math.abs(pressureVar) > 5
                            ? pressureVar >= 0
                              ? "text-success"
                              : "text-alert"
                            : "text-ink/70"
                        }`}
                      >
                        {pressureVar >= 0 ? "+" : ""}
                        {pressureVar.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 text-center font-mono text-sm">
                        {producer.contractualRange ? (
                          <span
                            className={
                              breachStatus === "critical"
                                ? "text-alert font-semibold"
                                : breachStatus === "warning"
                                ? "text-flare font-medium"
                                : "text-ink/70"
                            }
                          >
                            {producer.contractualRange.min} - {producer.contractualRange.max}
                          </span>
                        ) : (
                          <span className="text-ink/40 italic text-xs">Low pressure line</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-ink/80">
                        {producer.sourceOfAllocation}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-pine/10 border-t-2 border-pine">
                <tr className="font-semibold">
                  <td colSpan={2} className="px-4 py-4 text-ink">
                    TOTAL
                  </td>
                  <td className="px-4 py-4 text-right font-mono text-ink">
                    {totalCurrentVolume.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 text-right font-mono text-ink/70">—</td>
                  <td className="px-4 py-4 text-right font-mono text-ink/70">
                    {totalPriorVolume.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 text-right font-mono text-ink/70">—</td>
                  <td
                    className={`px-4 py-4 text-right font-mono ${
                      volumeVariance >= 0 ? "text-success" : "text-alert"
                    }`}
                  >
                    {volumeVariance >= 0 ? "+" : ""}
                    {volumeVariance.toFixed(2)}
                  </td>
                  <td colSpan={3}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Pressure Breach Alert */}
        {breachCount > 0 && (
          <div className="bg-alert/10 border border-alert/30 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-alert text-white flex items-center justify-center text-sm font-bold">
                !
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-alert mb-2">
                  {breachCount} Pressure Breach{breachCount > 1 ? "es" : ""} Detected
                </h3>
                <p className="text-sm text-ink/80 mb-3">
                  The following producers are operating outside their contractual pressure ranges:
                </p>
                <ul className="space-y-2">
                  {mockWeeklyData.producers
                    .filter(
                      (p) =>
                        checkPressureBreach(p.currentWeek.pressure, p.contractualRange) !== "ok"
                    )
                    .map((p) => {
                      const deviation =
                        p.contractualRange &&
                        (p.currentWeek.pressure < p.contractualRange.min
                          ? ((p.contractualRange.min - p.currentWeek.pressure) /
                              p.contractualRange.min) *
                            100
                          : ((p.currentWeek.pressure - p.contractualRange.max) /
                              p.contractualRange.max) *
                            100);

                      return (
                        <li key={p.id} className="flex items-center gap-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded font-mono text-xs font-semibold ${
                              checkPressureBreach(p.currentWeek.pressure, p.contractualRange) ===
                              "critical"
                                ? "bg-alert text-white"
                                : "bg-flare text-white"
                            }`}
                          >
                            {deviation && Math.abs(deviation).toFixed(0)}% deviation
                          </span>
                          <span className="font-medium">{p.name}</span>
                          <span className="text-ink/60">
                            Current: {p.currentWeek.pressure.toFixed(2)} barg | Expected:{" "}
                            {p.contractualRange?.min}-{p.contractualRange?.max} barg
                          </span>
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* How It Works */}
        <div className="bg-white border border-line rounded-lg p-6">
          <h3 className="text-lg font-semibold text-ink mb-4">How Gas Supply Works</h3>
          <div className="space-y-3 text-sm text-ink/80">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-pine text-white flex items-center justify-center text-xs font-bold">
                1
              </div>
              <p>
                <strong>Upstream operators produce gas</strong> at their fields and plants (SPDC,
                CNL, NEPL, Seplat, Pan Ocean, etc.)
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-pine text-white flex items-center justify-center text-xs font-bold">
                2
              </div>
              <p>
                <strong>NGIC receives gas into transmission network</strong> — the "Volume (mmscf)"
                column shows what NGIC took from each producer
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-pine text-white flex items-center justify-center text-xs font-bold">
                3
              </div>
              <p>
                <strong>NGIC allocates to customers</strong> — tracked via "Source of Allocation"
                (which producers supply which customers)
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-pine text-white flex items-center justify-center text-xs font-bold">
                4
              </div>
              <p>
                <strong>Automatic pressure monitoring</strong> — breaches flagged instantly (NEPL
                Oredo FST3 at 38.19 barg vs expected 55-70 = critical breach)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
