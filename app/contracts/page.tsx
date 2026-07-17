"use client";

import { useState } from "react";
import { offtakers } from "@/lib/data";
import { formatNumber } from "@/lib/utils";
import { FileCheck } from "lucide-react";
import type { Corridor, Sector } from "@/lib/types";

export default function ContractsPage() {
  const [selectedCorridor, setSelectedCorridor] = useState<Corridor | "All">("All");
  const [selectedSector, setSelectedSector] = useState<Sector | "All">("All");

  // Mock contract data based on offtakers
  const contracts = offtakers
    .filter((o) => selectedCorridor === "All" || o.corridor === selectedCorridor)
    .filter((o) => selectedSector === "All" || o.sector === selectedSector)
    .map((offtaker) => {
      const deliveryPercent = 85 + Math.random() * 15; // Mock 85-100%
      const dso = offtaker.sector === "Power" ? 120 + Math.random() * 60 : 15 + Math.random() * 30;
      const ragStatus =
        deliveryPercent >= 95 && dso < 45
          ? "green"
          : deliveryPercent >= 85 || dso < 90
          ? "amber"
          : "red";

      return {
        id: offtaker.id,
        contractNumber: `GSA-${offtaker.id.split("-")[1]?.toUpperCase() || "001"}`,
        counterparty: offtaker.name,
        corridor: offtaker.corridor,
        sector: offtaker.sector,
        dcq: offtaker.dcq || 0,
        deliveryPercent,
        takeOrPay: 80,
        dso: Math.round(dso),
        ragStatus: ragStatus as "red" | "amber" | "green",
      };
    });

  const corridors: Array<Corridor | "All"> = ["All", "Eastern", "Western", "Northern", "Lagos"];
  const sectors: Array<Sector | "All"> = [
    "All",
    "Power",
    "Fertiliser",
    "Petrochemical",
    "LDC / distributor",
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-line px-8 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-ink">Contract Performance</h2>
          <div className="flex items-center gap-4">
            {/* Sector Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-ink/70">Sector:</span>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value as Sector | "All")}
                className="px-3 py-1.5 rounded-lg text-sm border border-line bg-white"
              >
                {sectors.map((sector) => (
                  <option key={sector} value={sector}>
                    {sector}
                  </option>
                ))}
              </select>
            </div>

            {/* Corridor Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-ink/70">Corridor:</span>
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
      </div>

      <div className="p-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="kpi-card">
            <p className="text-sm text-ink/60 mb-1">Total Contracts</p>
            <p className="text-3xl font-bold text-pine">{contracts.length}</p>
          </div>
          <div className="kpi-card">
            <p className="text-sm text-ink/60 mb-1">Green Status</p>
            <p className="text-3xl font-bold text-pine">
              {contracts.filter((c) => c.ragStatus === "green").length}
            </p>
          </div>
          <div className="kpi-card">
            <p className="text-sm text-ink/60 mb-1">Amber Status</p>
            <p className="text-3xl font-bold text-flare">
              {contracts.filter((c) => c.ragStatus === "amber").length}
            </p>
          </div>
          <div className="kpi-card">
            <p className="text-sm text-ink/60 mb-1">Red Status</p>
            <p className="text-3xl font-bold text-alert">
              {contracts.filter((c) => c.ragStatus === "red").length}
            </p>
          </div>
        </div>

        {/* Contracts Table */}
        <div className="kpi-card">
          <h3 className="text-lg font-semibold text-ink mb-4">Contract Register</h3>

          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="text-left">Contract #</th>
                  <th className="text-left">Counterparty</th>
                  <th className="text-left">Sector</th>
                  <th className="text-left">Corridor</th>
                  <th className="text-right">DCQ (MMscf/d)</th>
                  <th className="text-right">Delivery %</th>
                  <th className="text-right">Take-or-Pay %</th>
                  <th className="text-right">DSO (days)</th>
                  <th className="text-left">RAG Status</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((contract) => (
                  <tr key={contract.id}>
                    <td className="font-mono text-sm">{contract.contractNumber}</td>
                    <td className="font-medium">{contract.counterparty}</td>
                    <td className="text-sm">{contract.sector}</td>
                    <td>
                      <span className="badge-operational">{contract.corridor}</span>
                    </td>
                    <td className="text-right">{formatNumber(contract.dcq, 0)}</td>
                    <td className="text-right font-semibold">
                      {contract.deliveryPercent.toFixed(1)}%
                    </td>
                    <td className="text-right">{contract.takeOrPay}%</td>
                    <td className="text-right">
                      <span
                        className={contract.dso > 90 ? "text-alert font-semibold" : ""}
                      >
                        {contract.dso}
                      </span>
                    </td>
                    <td>
                      <span
                        className={
                          contract.ragStatus === "green"
                            ? "badge-operational"
                            : contract.ragStatus === "amber"
                            ? "badge-warning"
                            : "badge-alert"
                        }
                      >
                        {contract.ragStatus.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Note */}
        <div className="mt-6 p-4 bg-pine/5 border border-pine/20 rounded-lg">
          <p className="text-sm text-ink/70">
            <strong>RAG Status:</strong> Green ({"≥"}95% delivery, DSO {"<"}45 days), Amber
            ({"≥"}85% delivery OR DSO {"<"}90 days), Red (below thresholds).
          </p>
        </div>
      </div>
    </div>
  );
}
