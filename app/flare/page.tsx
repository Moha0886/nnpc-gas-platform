"use client";

import { useState } from "react";
import { processingPlants } from "@/lib/data";
import { formatNumber, formatCurrency } from "@/lib/utils";
import { Flame } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { Corridor } from "@/lib/types";

export default function FlarePage() {
  const [selectedCorridor, setSelectedCorridor] = useState<Corridor | "All">("All");

  // Mock flare data
  const flareData = processingPlants
    .filter((p) => selectedCorridor === "All" || p.corridor === selectedCorridor)
    .map((plant) => ({
      facility: plant.name,
      corridor: plant.corridor,
      flareVolume: Math.round(plant.nameplate * 0.024), // Mock: 2.4% flare rate
      intensity: 2.4,
      penaltyNGN: Math.round(plant.nameplate * 0.024 * 850000), // Mock penalty
      penaltyUSD: Math.round((plant.nameplate * 0.024 * 850000) / 750),
      status: "reported" as const,
    }));

  const corridors: Array<Corridor | "All"> = ["All", "Eastern", "Western", "Northern"];

  // Trend data (mock 7-day)
  const trendData = [
    { day: "Day -6", intensity: 2.8 },
    { day: "Day -5", intensity: 2.6 },
    { day: "Day -4", intensity: 2.7 },
    { day: "Day -3", intensity: 2.5 },
    { day: "Day -2", intensity: 2.3 },
    { day: "Day -1", intensity: 2.5 },
    { day: "Today", intensity: 2.4 },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-line px-8 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-ink">Flare Monitoring</h2>
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
        {/* Trend Chart */}
        <div className="kpi-card mb-8">
          <h3 className="text-lg font-semibold text-ink mb-4">
            Flare Intensity Trend (% of Production)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DCDAD2" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} domain={[0, 4]} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
              <Line
                type="monotone"
                dataKey="intensity"
                stroke="#D98E04"
                strokeWidth={3}
                dot={{ fill: "#D98E04", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Flare Register */}
        <div className="kpi-card">
          <h3 className="text-lg font-semibold text-ink mb-4">Flare Register by Facility</h3>

          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="text-left">Facility</th>
                  <th className="text-left">Corridor</th>
                  <th className="text-right">Flared Volume (MMscf)</th>
                  <th className="text-right">Intensity %</th>
                  <th className="text-right">Penalty (NGN)</th>
                  <th className="text-right">Penalty (USD)</th>
                  <th className="text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {flareData.map((record, idx) => (
                  <tr key={idx}>
                    <td className="font-medium">{record.facility}</td>
                    <td>
                      <span className="badge-operational">{record.corridor}</span>
                    </td>
                    <td className="text-right">{formatNumber(record.flareVolume, 0)}</td>
                    <td className="text-right">{record.intensity.toFixed(1)}%</td>
                    <td className="text-right text-flare font-semibold">
                      {formatCurrency(record.penaltyNGN, "NGN", 0)}
                    </td>
                    <td className="text-right text-flare font-semibold">
                      {formatCurrency(record.penaltyUSD, "USD", 0)}
                    </td>
                    <td>
                      <span className="badge-warning">{record.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Note */}
        <div className="mt-6 p-4 bg-flare/10 border border-flare/20 rounded-lg">
          <p className="text-sm text-ink/70">
            <strong>Flare Penalty:</strong> Calculated based on DPR regulations. Intensity
            is flared volume as percentage of total production. Target: {"<"}1%.
          </p>
        </div>
      </div>
    </div>
  );
}
