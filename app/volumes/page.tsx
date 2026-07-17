"use client";

import { useState } from "react";
import { getGasDayBalance, getOfftakerFlows, offtakers } from "@/lib/data";
import { formatNumber } from "@/lib/utils";
import { Activity, ArrowRight, TrendingDown } from "lucide-react";
import type { Corridor } from "@/lib/types";

export default function VolumesPage() {
  const [selectedCorridor, setSelectedCorridor] = useState<Corridor | "All">("All");

  const balance = getGasDayBalance();
  const flows = getOfftakerFlows(undefined, selectedCorridor === "All" ? undefined : selectedCorridor);

  // Calculate power plant deliveries from offtaker flows
  const powerOfftakers = offtakers.filter((o) => o.sector === "Power");
  const powerDeliveries = flows
    .filter((f) => powerOfftakers.some((p) => p.id === f.offtakerId))
    .map((flow) => {
      const offtaker = offtakers.find((o) => o.id === flow.offtakerId);
      return {
        ...flow,
        offtakerName: offtaker?.name || "Unknown",
        dcq: offtaker?.dcq || 0,
      };
    });

  const corridors: Array<Corridor | "All"> = ["All", "Eastern", "Western", "Northern", "Lagos"];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-line px-8 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-ink">Volumes & Balancing</h2>
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
        {/* Supply Waterfall - Full Chain */}
        <div className="kpi-card mb-8">
          <h3 className="text-lg font-semibold text-ink mb-6">
            National Gas Balance - Full Value Chain (MMscf/d)
          </h3>

          <div className="space-y-4">
            {/* Produced */}
            <div className="flex items-center gap-4">
              <div className="w-48 text-sm font-medium text-ink">Gas Production</div>
              <div className="flex-1 flex items-center gap-3">
                <div className="bg-gasblue text-white px-6 py-3 rounded-lg font-bold tabular-nums">
                  {formatNumber(balance.produced, 0)}
                </div>
                <span className="text-sm text-ink/60">MMscf/d from fields & JVs</span>
              </div>
            </div>

            <div className="flex items-center gap-4 ml-8">
              <ArrowRight className="w-5 h-5 text-ink/40" />
              <TrendingDown className="w-5 h-5 text-flare" />
              <div className="text-sm text-ink/70">
                <span className="font-semibold text-flare tabular-nums">
                  {formatNumber(balance.nglExtracted, 0)}
                </span>{" "}
                MMscf/d NGL extracted at processing plants (LPG, condensate)
              </div>
            </div>

            {/* Into Transmission */}
            <div className="flex items-center gap-4 border-t border-line pt-4">
              <div className="w-48 text-sm font-medium text-ink">Into Transmission</div>
              <div className="flex-1 flex items-center gap-3">
                <div className="bg-gasblue text-white px-6 py-3 rounded-lg font-bold tabular-nums">
                  {formatNumber(balance.receivedIntoTransmission, 0)}
                </div>
                <span className="text-sm text-ink/60">
                  Lean gas enters NGIC trunk lines
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 ml-8">
              <ArrowRight className="w-5 h-5 text-ink/40" />
              <TrendingDown className="w-5 h-5 text-flare" />
              <div className="text-sm text-ink/70">
                <span className="font-semibold text-flare tabular-nums">
                  {formatNumber(balance.fuelGas, 0)}
                </span>{" "}
                MMscf/d fuel gas (compressor stations)
              </div>
            </div>

            <div className="flex items-center gap-4 ml-8">
              <ArrowRight className="w-5 h-5 text-ink/40" />
              <TrendingDown className="w-5 h-5 text-ink/40" />
              <div className="text-sm text-ink/70">
                <span className="font-semibold tabular-nums">
                  {formatNumber(balance.linePackChange, 0)}
                </span>{" "}
                MMscf/d line pack change
              </div>
            </div>

            {/* Delivered */}
            <div className="flex items-center gap-4 border-t border-line pt-4">
              <div className="w-48 text-sm font-medium text-ink">Delivered to Offtakers</div>
              <div className="flex-1 flex items-center gap-3">
                <div className="bg-pine text-white px-6 py-3 rounded-lg font-bold tabular-nums">
                  {formatNumber(balance.delivered, 0)}
                </div>
                <span className="text-sm text-ink/60">NGML sales to customers</span>
              </div>
            </div>

            {/* UFG */}
            <div className="flex items-center gap-4 border-t border-line pt-4">
              <div className="w-48 text-sm font-medium text-alert">
                Unaccounted For Gas (UFG)
              </div>
              <div className="flex-1 flex items-center gap-3">
                <div className="bg-alert text-white px-6 py-3 rounded-lg font-bold tabular-nums">
                  {formatNumber(balance.ufg, 0)}
                </div>
                <span className="text-sm text-ink/60">
                  {((balance.ufg / balance.receivedIntoTransmission) * 100).toFixed(2)}% of
                  transmission volume
                </span>
              </div>
            </div>
          </div>

          {/* NGL Removed Summary */}
          <div className="mt-6 p-4 bg-flare/10 border border-flare/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ink">
                  NGL Removed (LPG + Condensate)
                </p>
                <p className="text-xs text-ink/60 mt-1">
                  Extracted at Obiafu-Obrikom, Oben, Utorogu plants
                </p>
              </div>
              <div className="text-2xl font-bold text-flare tabular-nums">
                {formatNumber(balance.nglExtracted, 0)} MMscf/d
              </div>
            </div>
          </div>
        </div>

        {/* Deliveries to Power Plants Table */}
        <div className="kpi-card">
          <h3 className="text-lg font-semibold text-ink mb-4">
            Deliveries to Power Plants
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
                  <th>Power Station</th>
                  <th>Corridor</th>
                  <th>DCQ (MMscf/d)</th>
                  <th>Received</th>
                  <th>Offtaken</th>
                  <th>Delivery %</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {powerDeliveries.length > 0 ? (
                  powerDeliveries.map((delivery) => {
                    const deliveryPercent = delivery.dcq
                      ? (delivery.received / delivery.dcq) * 100
                      : 0;
                    const status =
                      deliveryPercent >= 90
                        ? "Optimal"
                        : deliveryPercent >= 70
                        ? "Suboptimal"
                        : "Critical";

                    return (
                      <tr key={delivery.offtakerId}>
                        <td className="font-medium">{delivery.offtakerName}</td>
                        <td>
                          <span className="badge-operational">{delivery.corridor}</span>
                        </td>
                        <td>{formatNumber(delivery.dcq, 0)}</td>
                        <td>{formatNumber(delivery.received, 0)}</td>
                        <td>{formatNumber(delivery.offtaken, 0)}</td>
                        <td>{deliveryPercent.toFixed(1)}%</td>
                        <td>
                          <span
                            className={
                              status === "Optimal"
                                ? "badge-operational"
                                : status === "Suboptimal"
                                ? "badge-warning"
                                : "badge-alert"
                            }
                          >
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center text-ink/60">
                      No power deliveries in selected corridor
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Note */}
        <div className="mt-6 p-4 bg-pine/5 border border-pine/20 rounded-lg">
          <p className="text-sm text-ink/70">
            <strong>Note:</strong> UFG is computed as: Received − Fuel Gas − Line Pack Δ
            − Delivered. Gas day is 06:00–06:00 WAT.
          </p>
        </div>
      </div>
    </div>
  );
}
