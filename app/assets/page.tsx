"use client";

import { useState } from "react";
import { assets, processingPlants, offtakers } from "@/lib/data";
import { formatNumber } from "@/lib/utils";
import { Database, Filter } from "lucide-react";
import type { Corridor } from "@/lib/types";

type AssetFilter = "All" | "Pipelines" | "Processing Plants" | "Power Offtakers" | "Industrial Offtakers";

export default function AssetsPage() {
  const [filter, setFilter] = useState<AssetFilter>("All");
  const [selectedCorridor, setSelectedCorridor] = useState<Corridor | "All">("All");

  // Get filtered assets
  const getFilteredAssets = () => {
    let filtered: any[] = [];

    if (filter === "All" || filter === "Pipelines") {
      const pipelines = assets
        .filter((a) => a.cls === "Pipeline")
        .filter((a) => selectedCorridor === "All" || a.corridor === selectedCorridor);
      filtered = [...filtered, ...pipelines];
    }

    if (filter === "All" || filter === "Processing Plants") {
      const plants = processingPlants.filter(
        (p) => selectedCorridor === "All" || p.corridor === selectedCorridor
      );
      filtered = [...filtered, ...plants];
    }

    if (filter === "Power Offtakers" || filter === "All") {
      const powerOfftakers = offtakers
        .filter((o) => o.sector === "Power")
        .filter((o) => selectedCorridor === "All" || o.corridor === selectedCorridor);
      filtered = [...filtered, ...powerOfftakers];
    }

    if (filter === "Industrial Offtakers" || filter === "All") {
      const industrialOfftakers = offtakers
        .filter(
          (o) =>
            o.sector === "Fertiliser" ||
            o.sector === "Petrochemical" ||
            o.sector === "Cement" ||
            o.sector === "Other industry"
        )
        .filter((o) => selectedCorridor === "All" || o.corridor === selectedCorridor);
      filtered = [...filtered, ...industrialOfftakers];
    }

    return filtered;
  };

  const filteredAssets = getFilteredAssets();
  const corridors: Array<Corridor | "All"> = ["All", "Eastern", "Western", "Northern", "Lagos"];
  const filters: AssetFilter[] = [
    "All",
    "Pipelines",
    "Processing Plants",
    "Power Offtakers",
    "Industrial Offtakers",
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-line px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-ink">Asset Registry</h2>
            <p className="text-sm text-ink/60 mt-1">
              Master data foundation - NNPC Gas Asset Inventory
            </p>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Filters */}
        <div className="kpi-card mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-ink/60" />
              <span className="text-sm font-medium text-ink/70 mr-2">Asset Type:</span>
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filter === f
                      ? "bg-pine text-white"
                      : "bg-white border border-line text-ink/70 hover:bg-gray-50"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

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

        {/* Assets Table */}
        <div className="kpi-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-ink">
              {filter === "All" ? "All Assets" : filter}{" "}
              <span className="text-sm font-normal text-ink/60">
                ({filteredAssets.length} {filteredAssets.length === 1 ? "asset" : "assets"})
              </span>
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="text-left">Asset Name</th>
                  <th className="text-left">Type</th>
                  <th className="text-left">Subsidiary</th>
                  <th className="text-left">Corridor</th>
                  <th className="text-right">Capacity</th>
                  <th className="text-left">Specs</th>
                  <th className="text-left">Status</th>
                  <th className="text-left">Commissioned</th>
                  <th className="text-left">Source</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.length > 0 ? (
                  filteredAssets.map((asset: any) => (
                    <tr key={asset.id}>
                      <td className="font-medium">{asset.name}</td>
                      <td className="text-sm">
                        {asset.cls || asset.sector || "Offtaker"}
                      </td>
                      <td>
                        <span className="badge-operational">
                          {asset.subsidiary || "NGML"}
                        </span>
                      </td>
                      <td>
                        {asset.corridor ? (
                          <span className="badge-operational">{asset.corridor}</span>
                        ) : (
                          <span className="text-ink/40">—</span>
                        )}
                      </td>
                      <td className="text-right">
                        {asset.nameplate || asset.dcq
                          ? formatNumber(asset.nameplate || asset.dcq, 0)
                          : "—"}
                      </td>
                      <td className="text-sm text-ink/70">
                        {asset.diameterIn && asset.lengthKm
                          ? `${asset.diameterIn}" × ${asset.lengthKm} km`
                          : asset.designPressure || asset.gasType || "—"}
                      </td>
                      <td>
                        <span
                          className={
                            asset.status === "Operational"
                              ? "badge-operational"
                              : asset.status === "Under construction"
                              ? "badge-warning"
                              : "badge-alert"
                          }
                        >
                          {asset.status || "Active"}
                        </span>
                      </td>
                      <td className="text-sm tabular-nums">
                        {asset.commissioned || "—"}
                      </td>
                      <td className="text-xs text-ink/60">
                        {asset.source || "Seed data"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center text-ink/60 py-8">
                      <Database className="w-8 h-8 text-ink/30 mx-auto mb-2" />
                      No assets found matching the selected filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          <div className="kpi-card">
            <p className="text-sm text-ink/60 mb-1">Total Pipelines</p>
            <p className="text-2xl font-bold text-pine">
              {assets.filter((a) => a.cls === "Pipeline").length}
            </p>
          </div>
          <div className="kpi-card">
            <p className="text-sm text-ink/60 mb-1">Processing Plants</p>
            <p className="text-2xl font-bold text-pine">{processingPlants.length}</p>
          </div>
          <div className="kpi-card">
            <p className="text-sm text-ink/60 mb-1">Power Offtakers</p>
            <p className="text-2xl font-bold text-pine">
              {offtakers.filter((o) => o.sector === "Power").length}
            </p>
          </div>
          <div className="kpi-card">
            <p className="text-sm text-ink/60 mb-1">Industrial Offtakers</p>
            <p className="text-2xl font-bold text-pine">
              {
                offtakers.filter(
                  (o) =>
                    o.sector === "Fertiliser" ||
                    o.sector === "Petrochemical" ||
                    o.sector === "Cement" ||
                    o.sector === "Other industry"
                ).length
              }
            </p>
          </div>
        </div>

        {/* Note */}
        <div className="mt-6 p-4 bg-pine/5 border border-pine/20 rounded-lg">
          <p className="text-sm text-ink/70">
            <strong>Seed Data:</strong> Loaded from NNPC_Gas_Asset_Inventory.xlsx equivalent.
            Capacities are nameplate/installed; replace with contracted/DCQ values from
            NGIC/NGML during discovery.
          </p>
        </div>
      </div>
    </div>
  );
}
