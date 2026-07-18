"use client";

import { useState } from "react";
import { assets } from "@/lib/data";
import { formatNumber } from "@/lib/utils";
import { Gauge } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { Corridor } from "@/lib/types";

export default function CapacityPage() {
  const [selectedCorridor, setSelectedCorridor] = useState<Corridor | "All">("All");
  const [selectedAssetType, setSelectedAssetType] = useState<string>("All");

  // Generate capacity data for all relevant assets
  const allCapacityData = assets
    .filter((a) => a.cls === "Pipeline" || a.cls === "Processing plant" || a.cls === "Compressor station")
    .filter((a) => selectedCorridor === "All" || a.corridor === selectedCorridor)
    .filter((a) => selectedAssetType === "All" || a.cls === selectedAssetType)
    .map((asset) => {
      // Different utilization profiles by asset type
      const utilizationProfile =
        asset.cls === "Pipeline" ? { avail: 0.92, contract: 0.75, actual: 0.68 } :
        asset.cls === "Processing plant" ? { avail: 0.88, contract: 0.70, actual: 0.65 } :
        { avail: 0.90, contract: 0.72, actual: 0.70 }; // Compressor station

      return {
        name: asset.name.replace("(", "").replace(")", "").split(" ").slice(0, 3).join(" "),
        type: asset.cls,
        corridor: asset.corridor,
        nameplate: asset.nameplate,
        available: asset.nameplate * utilizationProfile.avail,
        contracted: asset.nameplate * utilizationProfile.contract,
        actual: asset.nameplate * utilizationProfile.actual,
        utilization: Math.round((utilizationProfile.actual / utilizationProfile.avail) * 100),
      };
    });

  const capacityData = allCapacityData;

  const corridors: Array<Corridor | "All"> = ["All", "Eastern", "Western", "Northern", "Lagos"];
  const assetTypes = ["All", "Pipeline", "Processing plant", "Compressor station"];

  // Chart data
  const chartData = capacityData.map((d) => ({
    name: d.name,
    Nameplate: d.nameplate,
    Available: d.available,
    Contracted: d.contracted,
    Actual: d.actual,
  }));

  // Calculate summary metrics
  const summaryMetrics = capacityData.reduce(
    (acc, asset) => {
      acc.totalNameplate += asset.nameplate;
      acc.totalAvailable += asset.available;
      acc.totalContracted += asset.contracted;
      acc.totalActual += asset.actual;
      acc.count += 1;

      if (asset.utilization >= 80) acc.highUtil += 1;
      else if (asset.utilization >= 60) acc.moderateUtil += 1;
      else acc.lowUtil += 1;

      return acc;
    },
    { totalNameplate: 0, totalAvailable: 0, totalContracted: 0, totalActual: 0, count: 0, highUtil: 0, moderateUtil: 0, lowUtil: 0 }
  );

  const overallUtilization = summaryMetrics.totalAvailable > 0
    ? (summaryMetrics.totalActual / summaryMetrics.totalAvailable) * 100
    : 0;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-line px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-ink">NNPC Facility Capacity Utilisation</h2>
            <p className="text-sm text-ink/60 mt-1">
              Pipelines, processing plants, and compressor stations
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-ink/70 mr-1">Asset Type:</span>
              {assetTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedAssetType(type)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedAssetType === type
                      ? "bg-primary text-white"
                      : "bg-white border border-line text-ink/70 hover:bg-gray-50"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-ink/70 mr-1">Corridor:</span>
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
      </div>

      <div className="p-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="kpi-card">
            <div className="flex items-center gap-3 mb-2">
              <Gauge className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-ink/60">Overall Utilization</span>
            </div>
            <p className="text-3xl font-bold text-primary tabular-nums">
              {overallUtilization.toFixed(1)}
              <span className="text-lg text-ink/60 ml-1">%</span>
            </p>
            <p className="text-xs text-ink/50 mt-1">
              {formatNumber(summaryMetrics.totalActual, 0)} / {formatNumber(summaryMetrics.totalAvailable, 0)} MMscf/d
            </p>
          </div>

          <div className="kpi-card">
            <div className="flex items-center gap-3 mb-2">
              <Gauge className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-ink/60">High Utilization</span>
            </div>
            <p className="text-3xl font-bold text-primary tabular-nums">
              {summaryMetrics.highUtil}
            </p>
            <p className="text-xs text-ink/50 mt-1">≥80% of Available</p>
          </div>

          <div className="kpi-card">
            <div className="flex items-center gap-3 mb-2">
              <Gauge className="w-5 h-5 text-flare" />
              <span className="text-sm font-medium text-ink/60">Moderate Utilization</span>
            </div>
            <p className="text-3xl font-bold text-flare tabular-nums">
              {summaryMetrics.moderateUtil}
            </p>
            <p className="text-xs text-ink/50 mt-1">60-79% of Available</p>
          </div>

          <div className="kpi-card">
            <div className="flex items-center gap-3 mb-2">
              <Gauge className="w-5 h-5 text-alert" />
              <span className="text-sm font-medium text-ink/60">Low Utilization</span>
            </div>
            <p className="text-3xl font-bold text-alert tabular-nums">
              {summaryMetrics.lowUtil}
            </p>
            <p className="text-xs text-ink/50 mt-1">&lt;60% of Available</p>
          </div>
        </div>
        {/* Chart */}
        <div className="kpi-card mb-8">
          <h3 className="text-lg font-semibold text-ink mb-4">
            Facility Capacity Analysis (MMscf/d)
            {selectedAssetType !== "All" && (
              <span className="text-sm font-normal text-ink/60 ml-2">
                ({selectedAssetType}s only)
              </span>
            )}
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
                  <th className="text-left">Type</th>
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
                        <span className="text-xs text-ink/70 bg-gray-100 px-2 py-0.5 rounded">
                          {asset.type}
                        </span>
                      </td>
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
            <strong>Capacity Layers:</strong> Nameplate (installed capacity), Available (after
            maintenance/outages), Contracted (committed capacity), Actual (current throughput).
            Utilization = Actual / Available.
          </p>
          <p className="text-sm text-ink/70 mt-2">
            <strong>Asset Types:</strong> Pipelines transport gas, Processing Plants extract NGLs and condition gas,
            Compressor Stations boost pressure. Each has different utilization profiles based on operational requirements.
          </p>
          <p className="text-sm text-ink/70 mt-2">
            <strong>Utilization Status:</strong> High (≥80%) = Operating efficiently near capacity.
            Moderate (60-79%) = Operating below optimal levels. Low (&lt;60%) = Significant spare capacity or underutilization.
          </p>
        </div>
      </div>
    </div>
  );
}
