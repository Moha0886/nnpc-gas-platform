"use client";

import { useState } from "react";
import { offtakers, getOfftakerFlows } from "@/lib/data";
import { formatNumber } from "@/lib/utils";
import { ChevronDown, ChevronRight, Network, AlertTriangle, CheckCircle, Gauge } from "lucide-react";
import type { Corridor } from "@/lib/types";

export default function OfftakersPage() {
  const [expandedMain, setExpandedMain] = useState<Set<string>>(new Set());
  const [selectedCorridor, setSelectedCorridor] = useState<Corridor | "All">("All");

  const flows = getOfftakerFlows(
    undefined,
    selectedCorridor === "All" ? undefined : selectedCorridor
  );

  // Get main offtakers (no parent)
  const mainOfftakers = offtakers.filter(
    (o) =>
      !o.parentOfftakerId &&
      (selectedCorridor === "All" || o.corridor === selectedCorridor)
  );

  // Get sub-offtakers for a main offtaker
  const getSubOfftakers = (mainId: string) => {
    return offtakers.filter((o) => o.parentOfftakerId === mainId);
  };

  // Get flow data for an offtaker
  const getFlowData = (offtakerId: string) => {
    return flows.find((f) => f.offtakerId === offtakerId);
  };

  // Toggle expand/collapse
  const toggleExpand = (mainId: string) => {
    const newExpanded = new Set(expandedMain);
    if (newExpanded.has(mainId)) {
      newExpanded.delete(mainId);
    } else {
      newExpanded.add(mainId);
    }
    setExpandedMain(newExpanded);
  };

  // Calculate reconciliation for main offtaker
  const calculateReconciliation = (mainId: string) => {
    const mainFlow = getFlowData(mainId);
    const subs = getSubOfftakers(mainId);
    const subTotal = subs.reduce((sum, sub) => {
      const subFlow = getFlowData(sub.id);
      return sum + (subFlow?.offtaken || 0);
    }, 0);

    const parentCustodyMeter = mainFlow?.received || 0;
    const difference = parentCustodyMeter - subTotal;
    const diffPercent = parentCustodyMeter > 0 ? (difference / parentCustodyMeter) * 100 : 0;

    return {
      parentCustodyMeter,
      subTotal,
      difference,
      diffPercent,
      status: Math.abs(diffPercent) < 2 ? "OK" : Math.abs(diffPercent) < 5 ? "Warning" : "Alert",
    };
  };

  const corridors: Array<Corridor | "All"> = ["All", "Eastern", "Western", "Northern", "Lagos"];

  // Calculate overall capacity utilization metrics
  const utilizationMetrics = mainOfftakers.reduce(
    (acc, offtaker) => {
      const flow = getFlowData(offtaker.id);
      const dcq = offtaker.contractualDemand || offtaker.firmAndEffective || 0;
      const offtaken = flow?.offtaken || 0;

      acc.totalDCQ += dcq;
      acc.totalOfftaken += offtaken;

      if (dcq > 0) {
        acc.count += 1;
        const utilization = (offtaken / dcq) * 100;
        if (utilization >= 80) acc.highUtil += 1;
        else if (utilization >= 60) acc.moderateUtil += 1;
        else acc.lowUtil += 1;
      }

      return acc;
    },
    { totalDCQ: 0, totalOfftaken: 0, count: 0, highUtil: 0, moderateUtil: 0, lowUtil: 0 }
  );

  const overallUtilization = utilizationMetrics.totalDCQ > 0
    ? (utilizationMetrics.totalOfftaken / utilizationMetrics.totalDCQ) * 100
    : 0;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-line px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-ink">Offtaker Capacity & Hierarchy</h2>
            <p className="text-sm text-ink/60 mt-1">
              Customer capacity utilization with sub-offtaker reconciliation
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
        {/* Capacity Utilization Summary Cards */}
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
              {formatNumber(utilizationMetrics.totalOfftaken, 0)} / {formatNumber(utilizationMetrics.totalDCQ, 0)} MMscf/d
            </p>
          </div>

          <div className="kpi-card">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-ink/60">High Utilization</span>
            </div>
            <p className="text-3xl font-bold text-primary tabular-nums">
              {utilizationMetrics.highUtil}
            </p>
            <p className="text-xs text-ink/50 mt-1">≥80% of DCQ</p>
          </div>

          <div className="kpi-card">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-flare" />
              <span className="text-sm font-medium text-ink/60">Moderate Utilization</span>
            </div>
            <p className="text-3xl font-bold text-flare tabular-nums">
              {utilizationMetrics.moderateUtil}
            </p>
            <p className="text-xs text-ink/50 mt-1">60-79% of DCQ</p>
          </div>

          <div className="kpi-card">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-alert" />
              <span className="text-sm font-medium text-ink/60">Low Utilization</span>
            </div>
            <p className="text-3xl font-bold text-alert tabular-nums">
              {utilizationMetrics.lowUtil}
            </p>
            <p className="text-xs text-ink/50 mt-1">&lt;60% of DCQ</p>
          </div>
        </div>

        <div className="space-y-6">
        {mainOfftakers.length === 0 ? (
          <div className="kpi-card text-center py-12">
            <Network className="w-12 h-12 text-ink/30 mx-auto mb-3" />
            <p className="text-ink/60">No main offtakers in selected corridor</p>
          </div>
        ) : (
          mainOfftakers.map((main) => {
            const subs = getSubOfftakers(main.id);
            const hasSubs = subs.length > 0;
            const isExpanded = expandedMain.has(main.id);
            const mainFlow = getFlowData(main.id);
            const recon = hasSubs ? calculateReconciliation(main.id) : null;

            return (
              <div key={main.id} className="kpi-card">
                {/* Main Offtaker Row */}
                <div
                  className={`flex items-center justify-between p-4 ${
                    hasSubs ? "cursor-pointer hover:bg-gray-50" : ""
                  } rounded-lg transition-colors`}
                  onClick={() => hasSubs && toggleExpand(main.id)}
                >
                  <div className="flex items-center gap-4 flex-1">
                    {hasSubs ? (
                      isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-primary" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-ink/40" />
                      )
                    ) : (
                      <div className="w-5 h-5" />
                    )}

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-lg font-semibold text-ink">{main.name}</h4>
                        <span className="badge-operational">{main.corridor}</span>
                        <span className="text-sm text-ink/60 bg-gray-100 px-2 py-0.5 rounded">
                          {main.sector}
                        </span>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <span className="text-ink/60">
                          DCQ: <span className="tabular-nums font-medium">{main.contractualDemand || main.firmAndEffective}</span>{" "}
                          MMscf/d
                        </span>
                        <span className="text-ink/60">
                          Delivery Point: {main.deliveryPointId}
                        </span>
                        {hasSubs && (
                          <span className="text-primary font-medium">
                            {subs.length} sub-offtaker{subs.length > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Main Offtaker Volumes */}
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-xs text-ink/60 mb-1">Received</p>
                      <p className="text-xl font-bold text-accent tabular-nums">
                        {formatNumber(mainFlow?.received || 0, 0)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-ink/60 mb-1">Offtaken</p>
                      <p className="text-xl font-bold text-primary tabular-nums">
                        {formatNumber(mainFlow?.offtaken || 0, 0)}
                      </p>
                    </div>
                    <div className="text-right min-w-[120px]">
                      <p className="text-xs text-ink/60 mb-1">Capacity Utilization</p>
                      {(() => {
                        const dcq = main.contractualDemand || main.firmAndEffective || 0;
                        const offtaken = mainFlow?.offtaken || 0;
                        const utilization = dcq > 0 ? (offtaken / dcq) * 100 : 0;
                        const utilizationColor =
                          utilization >= 80 ? "text-primary" :
                          utilization >= 60 ? "text-flare" :
                          "text-alert";

                        return (
                          <div>
                            <p className={`text-xl font-bold tabular-nums ${utilizationColor}`}>
                              {utilization.toFixed(1)}%
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div
                                className={`h-2 rounded-full ${
                                  utilization >= 80 ? "bg-primary" :
                                  utilization >= 60 ? "bg-flare" :
                                  "bg-alert"
                                }`}
                                style={{ width: `${Math.min(utilization, 100)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Sub-offtakers (expanded) */}
                {hasSubs && isExpanded && (
                  <div className="mt-4 pl-12 border-t border-line pt-4">
                    <div className="space-y-3 mb-4">
                      {subs.map((sub) => {
                        const subFlow = getFlowData(sub.id);
                        return (
                          <div
                            key={sub.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <Network className="w-4 h-4 text-ink/40" />
                                <h5 className="font-medium text-ink">{sub.name}</h5>
                                <span className="text-xs text-ink/60 bg-white px-2 py-0.5 rounded">
                                  {sub.sector}
                                </span>
                              </div>
                              <p className="text-xs text-ink/60 ml-7">
                                DCQ: {sub.contractualDemand || sub.firmAndEffective || 0} MMscf/d · {sub.deliveryPointId}
                              </p>
                            </div>

                            <div className="flex items-center gap-6">
                              <div className="text-right">
                                <p className="text-xs text-ink/60">Received</p>
                                <p className="text-base font-semibold text-ink tabular-nums">
                                  {formatNumber(subFlow?.received || 0, 0)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-ink/60">Offtaken</p>
                                <p className="text-base font-semibold text-ink tabular-nums">
                                  {formatNumber(subFlow?.offtaken || 0, 0)}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Reconciliation Summary */}
                    {recon && (
                      <div
                        className={`p-4 rounded-lg border-2 ${
                          recon.status === "OK"
                            ? "bg-primary/5 border-pine/20"
                            : recon.status === "Warning"
                            ? "bg-flare/5 border-flare/20"
                            : "bg-alert/5 border-alert/20"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {recon.status === "OK" ? (
                              <CheckCircle className="w-5 h-5 text-primary" />
                            ) : (
                              <AlertTriangle
                                className={`w-5 h-5 ${
                                  recon.status === "Warning" ? "text-flare" : "text-alert"
                                }`}
                              />
                            )}
                            <div>
                              <p className="font-semibold text-ink">
                                Reconciliation {recon.status}
                              </p>
                              <p className="text-xs text-ink/60 mt-1">
                                Parent custody meter vs sum of sub-offtaker takes
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-8">
                            <div className="text-right">
                              <p className="text-xs text-ink/60">Custody Meter</p>
                              <p className="text-lg font-bold text-ink tabular-nums">
                                {formatNumber(recon.parentCustodyMeter, 0)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-ink/60">Sub-offtaker Sum</p>
                              <p className="text-lg font-bold text-ink tabular-nums">
                                {formatNumber(recon.subTotal, 0)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-ink/60">Difference</p>
                              <p
                                className={`text-lg font-bold tabular-nums ${
                                  recon.status === "OK"
                                    ? "text-primary"
                                    : recon.status === "Warning"
                                    ? "text-flare"
                                    : "text-alert"
                                }`}
                              >
                                {formatNumber(Math.abs(recon.difference), 0)}
                                <span className="text-sm ml-1">
                                  ({Math.abs(recon.diffPercent).toFixed(2)}%)
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}

        </div>

        {/* Notes */}
        <div className="p-4 bg-primary/5 border border-pine/20 rounded-lg mt-6">
          <p className="text-sm text-ink/70">
            <strong>Capacity Utilization:</strong> High (≥80% of DCQ) = Efficient use of contracted capacity.
            Moderate (60-79%) = Room for improvement. Low (&lt;60%) = Significant underutilization.
            Utilization % = Offtaken / DCQ.
          </p>
          <p className="text-sm text-ink/70 mt-2">
            <strong>Reconciliation Status:</strong> OK ({"<"}2% difference), Warning (2-5%
            difference), Alert ({">"}5% difference). Sub-offtaker volumes must reconcile to
            the parent custody meter.
          </p>
          <p className="text-sm text-ink/70 mt-2">
            <strong>Lagos LDC Branches:</strong> Shell Nigeria Gas and Axxela distribute to
            metered sub-offtakers in Ikeja, Apapa, Victoria Island, Lekki FTZ, and Ikorodu.
          </p>
        </div>
      </div>
    </div>
  );
}
