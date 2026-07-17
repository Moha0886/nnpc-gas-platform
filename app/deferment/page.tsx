"use client";

import { useState } from "react";
import { assets } from "@/lib/data";
import { formatNumber, formatCurrency } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import type { Corridor, DefermentCause } from "@/lib/types";

export default function DefermentPage() {
  const [selectedCorridor, setSelectedCorridor] = useState<Corridor | "All">("All");

  // Mock deferment data
  const defermentEvents = [
    {
      asset: "ELPS",
      corridor: "Western" as Corridor,
      cause: "planned maintenance" as DefermentCause,
      volume: 320,
      value: 1200000,
      mtbf: 720,
      mttr: 48,
    },
    {
      asset: "OB3",
      corridor: "Eastern" as Corridor,
      cause: "unplanned breakdown" as DefermentCause,
      volume: 185,
      value: 695000,
      mtbf: 480,
      mttr: 72,
    },
    {
      asset: "Obiafu-Obrikom",
      corridor: "Eastern" as Corridor,
      cause: "third-party interference" as DefermentCause,
      volume: 95,
      value: 357000,
      mtbf: 1200,
      mttr: 24,
    },
    {
      asset: "Utorogu",
      corridor: "Western" as Corridor,
      cause: "upstream supply shortfall" as DefermentCause,
      volume: 142,
      value: 533000,
      mtbf: 960,
      mttr: 36,
    },
  ].filter((e) => selectedCorridor === "All" || e.corridor === selectedCorridor);

  const corridors: Array<Corridor | "All"> = ["All", "Eastern", "Western", "Northern"];

  // Attribution data
  const attributionData = [
    { name: "Planned Maintenance", value: 320, color: "#2E6FA3" },
    { name: "Unplanned Breakdown", value: 185, color: "#B3402A" },
    { name: "Third-party", value: 95, color: "#D98E04" },
    { name: "Upstream Shortfall", value: 142, color: "#DCDAD2" },
  ];

  // Bad actor ranking
  const badActors = [...defermentEvents]
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 5);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-line px-8 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-ink">Deferment Tracking</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-ink/70 mr-2">Corridor:</span>
            {corridors.map((corridor) => (
              <button
                key={corridor}
                onClick={() => setSelectedCorridor(corridor)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedCorridor === corridor
                    ? "bg-pine text-white"
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
        {/* Attribution Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="kpi-card">
            <h3 className="text-lg font-semibold text-ink mb-4">
              Deferment Attribution (MMscf)
            </h3>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={250}>
                <PieChart>
                  <Pie
                    data={attributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                  >
                    {attributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {attributionData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-semibold tabular-nums">
                      {formatNumber(item.value, 0)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bad Actor Ranking */}
          <div className="kpi-card">
            <h3 className="text-lg font-semibold text-ink mb-4">Bad Actor Ranking</h3>
            <div className="space-y-3">
              {badActors.map((actor, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-alert">#{idx + 1}</span>
                    <div>
                      <p className="font-medium text-ink">{actor.asset}</p>
                      <p className="text-xs text-ink/60">{actor.cause}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-alert tabular-nums">
                      {formatNumber(actor.volume, 0)} MMscf
                    </p>
                    <p className="text-xs text-ink/60">
                      {formatCurrency(actor.value, "USD", 0)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Deferment Events Table */}
        <div className="kpi-card">
          <h3 className="text-lg font-semibold text-ink mb-4">Deferment Events</h3>

          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="text-left">Asset</th>
                  <th className="text-left">Corridor</th>
                  <th className="text-left">Cause</th>
                  <th className="text-right">Volume (MMscf)</th>
                  <th className="text-right">Value Lost (USD)</th>
                  <th className="text-right">MTBF (hrs)</th>
                  <th className="text-right">MTTR (hrs)</th>
                </tr>
              </thead>
              <tbody>
                {defermentEvents.map((event, idx) => (
                  <tr key={idx}>
                    <td className="font-medium">{event.asset}</td>
                    <td>
                      <span className="badge-operational">{event.corridor}</span>
                    </td>
                    <td>
                      <span
                        className={
                          event.cause.includes("unplanned") || event.cause.includes("breakdown")
                            ? "badge-alert"
                            : "badge-warning"
                        }
                      >
                        {event.cause}
                      </span>
                    </td>
                    <td className="text-right">{formatNumber(event.volume, 0)}</td>
                    <td className="text-right text-alert font-semibold">
                      {formatCurrency(event.value, "USD", 0)}
                    </td>
                    <td className="text-right">{formatNumber(event.mtbf, 0)}</td>
                    <td className="text-right">{formatNumber(event.mttr, 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Note */}
        <div className="mt-6 p-4 bg-alert/10 border border-alert/20 rounded-lg">
          <p className="text-sm text-ink/70">
            <strong>MTBF / MTTR:</strong> Mean Time Between Failures / Mean Time To Repair.
            Maintenance-attributable causes highlighted in amber.
          </p>
        </div>
      </div>
    </div>
  );
}
