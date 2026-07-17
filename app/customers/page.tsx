"use client";

import { useState } from "react";
import { offtakers } from "@/lib/data";
import { formatNumber } from "@/lib/utils";
import { Users } from "lucide-react";
import type { Corridor } from "@/lib/types";

export default function CustomersPage() {
  const [selectedCorridor, setSelectedCorridor] = useState<Corridor | "All">("All");

  // Generate customer scores
  const customerScores = offtakers
    .filter((o) => selectedCorridor === "All" || o.corridor === selectedCorridor)
    .map((offtaker) => {
      const isDollarPaying =
        offtaker.sector === "Fertiliser" ||
        offtaker.sector === "Petrochemical" ||
        offtaker.sector === "Cement";

      // Industrial offtakers score higher
      const dso = isDollarPaying ? 15 + Math.random() * 20 : 120 + Math.random() * 60;
      const takeReliability = isDollarPaying ? 92 + Math.random() * 8 : 75 + Math.random() * 15;
      const margin = isDollarPaying ? 18 + Math.random() * 12 : 5 + Math.random() * 8;
      const sectorRisk = isDollarPaying
        ? "low"
        : offtaker.sector === "Power"
        ? "high"
        : "medium";

      // Composite score (0-100)
      const compositeScore =
        (100 - dso / 2) * 0.3 + takeReliability * 0.4 + margin * 2 * 0.2 + (sectorRisk === "low" ? 20 : sectorRisk === "medium" ? 10 : 0) * 0.1;

      return {
        id: offtaker.id,
        name: offtaker.name,
        corridor: offtaker.corridor,
        sector: offtaker.sector,
        dso: Math.round(dso),
        takeReliability: Math.round(takeReliability),
        margin: margin.toFixed(1),
        sectorRisk: sectorRisk as "low" | "medium" | "high",
        compositeScore: Math.round(compositeScore),
      };
    })
    .sort((a, b) => b.compositeScore - a.compositeScore);

  const corridors: Array<Corridor | "All"> = ["All", "Eastern", "Western", "Northern", "Lagos"];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-line px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-ink">Customer Scorecard</h2>
            <p className="text-sm text-ink/60 mt-1">
              Composite score: DSO + Take reliability + Margin + Sector risk
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
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="kpi-card">
            <p className="text-sm text-ink/60 mb-1">Top Performers (Score {"≥"}80)</p>
            <p className="text-3xl font-bold text-pine">
              {customerScores.filter((c) => c.compositeScore >= 80).length}
            </p>
          </div>
          <div className="kpi-card">
            <p className="text-sm text-ink/60 mb-1">Average Score</p>
            <p className="text-3xl font-bold text-ink">
              {Math.round(
                customerScores.reduce((sum, c) => sum + c.compositeScore, 0) /
                  customerScores.length
              )}
            </p>
          </div>
          <div className="kpi-card">
            <p className="text-sm text-ink/60 mb-1">Low DSO Customers ({"<"}45 days)</p>
            <p className="text-3xl font-bold text-pine">
              {customerScores.filter((c) => c.dso < 45).length}
            </p>
          </div>
        </div>

        {/* Scorecard Table */}
        <div className="kpi-card">
          <h3 className="text-lg font-semibold text-ink mb-4">
            Customer Rankings (By Composite Score)
          </h3>

          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="text-left">Rank</th>
                  <th className="text-left">Customer</th>
                  <th className="text-left">Sector</th>
                  <th className="text-left">Corridor</th>
                  <th className="text-right">DSO (days)</th>
                  <th className="text-right">Take Reliability %</th>
                  <th className="text-right">Margin %</th>
                  <th className="text-left">Sector Risk</th>
                  <th className="text-right">Composite Score</th>
                </tr>
              </thead>
              <tbody>
                {customerScores.map((customer, idx) => (
                  <tr key={customer.id}>
                    <td className="font-bold text-pine">#{idx + 1}</td>
                    <td className="font-medium">{customer.name}</td>
                    <td className="text-sm">{customer.sector}</td>
                    <td>
                      <span className="badge-operational">{customer.corridor}</span>
                    </td>
                    <td className="text-right">
                      <span
                        className={
                          customer.dso < 45
                            ? "text-pine font-semibold"
                            : customer.dso > 90
                            ? "text-alert font-semibold"
                            : ""
                        }
                      >
                        {customer.dso}
                      </span>
                    </td>
                    <td className="text-right">{customer.takeReliability}%</td>
                    <td className="text-right">{customer.margin}%</td>
                    <td>
                      <span
                        className={
                          customer.sectorRisk === "low"
                            ? "badge-operational"
                            : customer.sectorRisk === "medium"
                            ? "badge-warning"
                            : "badge-alert"
                        }
                      >
                        {customer.sectorRisk}
                      </span>
                    </td>
                    <td className="text-right">
                      <span
                        className={`font-bold text-lg ${
                          customer.compositeScore >= 80
                            ? "text-pine"
                            : customer.compositeScore >= 60
                            ? "text-ink"
                            : "text-alert"
                        }`}
                      >
                        {customer.compositeScore}
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
            <strong>Scoring Logic:</strong> DSO (30% weight, lower is better), Take
            reliability (40%), Margin (20%), Sector risk (10%). Dollar-paying industrials
            (Dangote, Indorama) score above long-DSO power offtakers.
          </p>
        </div>
      </div>
    </div>
  );
}
