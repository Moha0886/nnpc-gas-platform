"use client";

import { useState } from "react";
import { assets } from "@/lib/data";
import { formatNumber } from "@/lib/utils";
import { Gauge } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { Corridor } from "@/lib/types";

export default function CapacityPage() {
  const [selectedCorridor, setSelectedCorridor] = useState<Corridor | "All">("All");

  // Mock capacity data for pipelines
  const capacityData = assets
    .filter((a) => a.cls === "Pipeline")
    .filter((a) => selectedCorridor === "All" || a.corridor === selectedCorridor)
    .map((asset) => ({
      name: asset.name.replace("(", "").replace(")", "").split(" ").slice(0, 2).join(" "),
      corridor: asset.corridor,
      nameplate: asset.nameplate,
      available: asset.nameplate * 0.92, // Mock: 92% available
      contracted: asset.nameplate * 0.75, // Mock: 75% contracted
      actual: asset.nameplate * 0.68, // Mock: 68% actual flow
      utilization: 68, // Mock: 68% utilization
    }));

  const corridors: Array<Corridor | "All"> = ["All", "Eastern", "Western", "Northern", "Lagos"];

  // Chart data
  const chartData = capacityData.map((d) => ({
    name: d.name,
    Nameplate: d.nameplate,
    Available: d.available,
    Contracted: d.contracted,
    Actual: d.actual,
  }));

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-line px-8 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-ink">Capacity Utilisation</h2>
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
        {/* Chart */}
        <div className="kpi-card mb-8">
          <h3 className="text-lg font-semibold text-ink mb-4">
            Pipeline Capacity by Corridor (MMscf/d)
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DCDAD2" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Nameplate" fill="#DCDAD2" />
              <Bar dataKey="Available" fill="#2E6FA3" />
              <Bar dataKey="Contracted" fill="#D98E04" />
              <Bar dataKey="Actual" fill="#0F4C42" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Table */}
        <div className="kpi-card">
          <h3 className="text-lg font-semibold text-ink mb-4">
            Per-Asset Utilisation
          </h3>

          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="text-left">Asset</th>
                  <th className="text-left">Corridor</th>
                  <th className="text-right">Nameplate</th>
                  <th className="text-right">Available</th>
                  <th className="text-right">Contracted</th>
                  <th className="text-right">Actual Flow</th>
                  <th className="text-right">Utilisation %</th>
                  <th className="text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {capacityData.map((asset, idx) => {
                  const status =
                    asset.utilization >= 80
                      ? "High"
                      : asset.utilization >= 60
                      ? "Moderate"
                      : "Low";

                  return (
                    <tr key={idx}>
                      <td className="font-medium">{asset.name}</td>
                      <td>
                        <span className="badge-operational">{asset.corridor}</span>
                      </td>
                      <td className="text-right">{formatNumber(asset.nameplate, 0)}</td>
                      <td className="text-right">{formatNumber(asset.available, 0)}</td>
                      <td className="text-right">{formatNumber(asset.contracted, 0)}</td>
                      <td className="text-right">{formatNumber(asset.actual, 0)}</td>
                      <td className="text-right font-semibold">{asset.utilization}%</td>
                      <td>
                        <span
                          className={
                            status === "High"
                              ? "badge-operational"
                              : status === "Moderate"
                              ? "badge-warning"
                              : "text-ink/60"
                          }
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Note */}
        <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-sm text-ink/70">
            <strong>Capacity Layers:</strong> Nameplate (installed), Available (after
            maintenance/outages), Contracted (committed capacity), Actual (current flow).
            Utilization = Actual / Available.
          </p>
        </div>
      </div>
    </div>
  );
}
