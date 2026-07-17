"use client";

import { useState, Fragment } from "react";
import { getOfftakerFlows, offtakers } from "@/lib/data";
import { formatNumber } from "@/lib/utils";
import { FileText, AlertCircle } from "lucide-react";
import type { Corridor } from "@/lib/types";

export default function NominationsPage() {
  const [selectedCorridor, setSelectedCorridor] = useState<Corridor | "All">("All");

  const flows = getOfftakerFlows(
    undefined,
    selectedCorridor === "All" ? undefined : selectedCorridor
  );

  // Enrich flows with offtaker names
  const enrichedFlows = flows.map((flow) => {
    const offtaker = offtakers.find((o) => o.id === flow.offtakerId);
    return {
      ...flow,
      offtakerName: offtaker?.name || "Unknown",
      sector: offtaker?.sector || "Unknown",
    };
  });

  // Group by corridor
  const groupedFlows: Record<string, typeof enrichedFlows> = {};
  enrichedFlows.forEach((flow) => {
    if (!groupedFlows[flow.corridor]) {
      groupedFlows[flow.corridor] = [];
    }
    groupedFlows[flow.corridor].push(flow);
  });

  const corridors: Array<Corridor | "All"> = [
    "All",
    "Eastern",
    "Western",
    "Northern",
    "Lagos",
  ];

  // Calculate totals
  const totals = enrichedFlows.reduce(
    (acc, flow) => ({
      nominated: acc.nominated + flow.nominated,
      allocated: acc.allocated + flow.allocated,
      forecastSupply: acc.forecastSupply + flow.forecastSupply,
      received: acc.received + flow.received,
      offtaken: acc.offtaken + flow.offtaken,
      varianceNomination: acc.varianceNomination + flow.varianceNomination,
      varianceReceipt: acc.varianceReceipt + flow.varianceReceipt,
    }),
    {
      nominated: 0,
      allocated: 0,
      forecastSupply: 0,
      received: 0,
      offtaken: 0,
      varianceNomination: 0,
      varianceReceipt: 0,
    }
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-line px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-ink">Nominations & Gaps</h2>
            <p className="text-sm text-ink/60 mt-1">
              6-stage nomination cycle per delivery point
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-ink/70 mr-2">Corridor:</span>
            {corridors.map((corridor) => (
              <button
                key={corridor}
                onClick={() => setSelectedCorridor(corridor)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedCorridor === corridor
                    ? "bg-primary text-white"
                    : "bg-white border border-line text-ink/70 hover:bg-gray-50"
                }`}
              >
                {corridor}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="kpi-card">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-ink/60">Total Nominated</span>
            </div>
            <p className="text-3xl font-bold text-ink tabular-nums">
              {formatNumber(totals.nominated, 0)}
              <span className="text-lg text-ink/60 ml-2">MMscf/d</span>
            </p>
          </div>

          <div className="kpi-card">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-5 h-5 text-flare" />
              <span className="text-sm font-medium text-ink/60">
                Nomination Variance
              </span>
            </div>
            <p className="text-3xl font-bold text-flare tabular-nums">
              {formatNumber(totals.varianceNomination, 0)}
              <span className="text-lg text-ink/60 ml-2">MMscf/d</span>
            </p>
          </div>

          <div className="kpi-card">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-5 h-5 text-alert" />
              <span className="text-sm font-medium text-ink/60">Receipt Variance</span>
            </div>
            <p className="text-3xl font-bold text-alert tabular-nums">
              {formatNumber(totals.varianceReceipt, 0)}
              <span className="text-lg text-ink/60 ml-2">MMscf/d</span>
            </p>
          </div>
        </div>

        {/* Nominations Table - Grouped by Corridor */}
        <div className="kpi-card">
          <h3 className="text-lg font-semibold text-ink mb-4">
            Nomination Cycle by Delivery Point
            {selectedCorridor !== "All" && (
              <span className="text-sm font-normal text-ink/60 ml-2">
                ({selectedCorridor} Corridor)
              </span>
            )}
          </h3>

          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="text-left">Offtaker</th>
                  <th className="text-left">Sector</th>
                  <th className="text-left">Corridor</th>
                  <th className="text-right">Nominated</th>
                  <th className="text-right">Allocated</th>
                  <th className="text-right">Forecast</th>
                  <th className="text-right">Received</th>
                  <th className="text-right">Offtaken</th>
                  <th className="text-right bg-flare/10">
                    <div className="font-bold">Nom. Variance</div>
                    <div className="text-xs font-normal">(Nom − Rec)</div>
                  </th>
                  <th className="text-right bg-alert/10">
                    <div className="font-bold">Receipt Variance</div>
                    <div className="text-xs font-normal">(Rec − Off)</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedCorridor === "All"
                  ? Object.keys(groupedFlows)
                      .sort()
                      .map((corridor) => (
                        <Fragment key={`corridor-${corridor}`}>
                          <tr key={`header-${corridor}`} className="bg-gray-50">
                            <td
                              colSpan={10}
                              className="font-semibold text-primary py-2"
                            >
                              {corridor} Corridor
                            </td>
                          </tr>
                          {groupedFlows[corridor].map((flow) => (
                            <tr key={flow.offtakerId}>
                              <td className="font-medium">{flow.offtakerName}</td>
                              <td className="text-sm text-ink/70">{flow.sector}</td>
                              <td>
                                <span className="badge-operational">
                                  {flow.corridor}
                                </span>
                              </td>
                              <td className="text-right">
                                {formatNumber(flow.nominated, 0)}
                              </td>
                              <td className="text-right">
                                {formatNumber(flow.allocated, 0)}
                              </td>
                              <td className="text-right">
                                {formatNumber(flow.forecastSupply, 0)}
                              </td>
                              <td className="text-right">
                                {formatNumber(flow.received, 0)}
                              </td>
                              <td className="text-right">
                                {formatNumber(flow.offtaken, 0)}
                              </td>
                              <td className="text-right bg-flare/10 font-bold">
                                <span
                                  className={
                                    flow.varianceNomination > 5
                                      ? "text-flare"
                                      : "text-ink"
                                  }
                                >
                                  {formatNumber(flow.varianceNomination, 0)}
                                </span>
                              </td>
                              <td className="text-right bg-alert/10 font-bold">
                                <span
                                  className={
                                    flow.varianceReceipt > 3
                                      ? "text-alert"
                                      : "text-ink"
                                  }
                                >
                                  {formatNumber(flow.varianceReceipt, 0)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </Fragment>
                      ))
                  : enrichedFlows.map((flow) => (
                      <tr key={flow.offtakerId}>
                        <td className="font-medium">{flow.offtakerName}</td>
                        <td className="text-sm text-ink/70">{flow.sector}</td>
                        <td>
                          <span className="badge-operational">{flow.corridor}</span>
                        </td>
                        <td className="text-right">
                          {formatNumber(flow.nominated, 0)}
                        </td>
                        <td className="text-right">
                          {formatNumber(flow.allocated, 0)}
                        </td>
                        <td className="text-right">
                          {formatNumber(flow.forecastSupply, 0)}
                        </td>
                        <td className="text-right">
                          {formatNumber(flow.received, 0)}
                        </td>
                        <td className="text-right">
                          {formatNumber(flow.offtaken, 0)}
                        </td>
                        <td className="text-right bg-flare/10 font-bold">
                          <span
                            className={
                              flow.varianceNomination > 5 ? "text-flare" : "text-ink"
                            }
                          >
                            {formatNumber(flow.varianceNomination, 0)}
                          </span>
                        </td>
                        <td className="text-right bg-alert/10 font-bold">
                          <span
                            className={
                              flow.varianceReceipt > 3 ? "text-alert" : "text-ink"
                            }
                          >
                            {formatNumber(flow.varianceReceipt, 0)}
                          </span>
                        </td>
                      </tr>
                    ))}

                {/* Totals Row */}
                <tr className="bg-primary/5 font-bold border-t-2 border-primary">
                  <td colSpan={3}>TOTAL</td>
                  <td className="text-right">{formatNumber(totals.nominated, 0)}</td>
                  <td className="text-right">{formatNumber(totals.allocated, 0)}</td>
                  <td className="text-right">
                    {formatNumber(totals.forecastSupply, 0)}
                  </td>
                  <td className="text-right">{formatNumber(totals.received, 0)}</td>
                  <td className="text-right">{formatNumber(totals.offtaken, 0)}</td>
                  <td className="text-right bg-flare/20 text-flare">
                    {formatNumber(totals.varianceNomination, 0)}
                  </td>
                  <td className="text-right bg-alert/20 text-alert">
                    {formatNumber(totals.varianceReceipt, 0)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-sm text-ink/70">
            <strong>6-Stage Cycle:</strong> Nominated (offtaker request) → Allocated
            (NGML allocation) → Forecast supply (forward projection) → Received (metered
            delivery) → Offtaken (actual consumption).
          </p>
          <p className="text-sm text-ink/70 mt-2">
            <strong>Variances:</strong> Nomination variance = Nominated − Received.
            Receipt variance = Received − Offtaken. These are the two critical gaps the
            nominations desk monitors.
          </p>
        </div>
      </div>
    </div>
  );
}
