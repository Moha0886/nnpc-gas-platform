"use client";

import { useState } from "react";
import Link from "next/link";
import { getGasDayBalance, getOfftakerFlows, offtakers } from "@/lib/data";
import { formatNumber } from "@/lib/utils";
import { Activity, ArrowRight, TrendingDown, Upload, Plus, Download } from "lucide-react";
import type { Corridor } from "@/lib/types";
import UploadModal from "@/components/UploadModal";
import { useReportUpload } from "@/lib/use-report-upload";
import { REPORT_CONFIGS } from "@/lib/report-upload-configs";
import { formatDateForCSV } from "@/lib/csv-utils";

// Mock historical volume balance records
const mockVolumeRecords = [
  {
    id: "vol-001",
    gasDay: "2026-07-16",
    produced: 2850.5,
    nglExtracted: 320.3,
    receivedIntoTransmission: 2530.2,
    fuelGas: 85.5,
    linePackChange: 12.3,
    delivered: 2420.5,
    ufg: 11.9,
    ufgPercent: 0.47,
  },
  {
    id: "vol-002",
    gasDay: "2026-07-15",
    produced: 2780.2,
    nglExtracted: 315.8,
    receivedIntoTransmission: 2464.4,
    fuelGas: 82.8,
    linePackChange: -8.5,
    delivered: 2380.1,
    ufg: 10.0,
    ufgPercent: 0.41,
  },
  {
    id: "vol-003",
    gasDay: "2026-07-14",
    produced: 2920.8,
    nglExtracted: 325.5,
    receivedIntoTransmission: 2595.3,
    fuelGas: 88.2,
    linePackChange: 5.6,
    delivered: 2485.3,
    ufg: 16.2,
    ufgPercent: 0.62,
  },
  {
    id: "vol-004",
    gasDay: "2026-07-13",
    produced: 2735.4,
    nglExtracted: 310.2,
    receivedIntoTransmission: 2425.2,
    fuelGas: 81.5,
    linePackChange: -12.8,
    delivered: 2350.5,
    ufg: 6.0,
    ufgPercent: 0.25,
  },
  {
    id: "vol-005",
    gasDay: "2026-07-12",
    produced: 2888.9,
    nglExtracted: 318.7,
    receivedIntoTransmission: 2570.2,
    fuelGas: 86.9,
    linePackChange: 8.4,
    delivered: 2458.8,
    ufg: 16.1,
    ufgPercent: 0.63,
  },
];

export default function VolumesPage() {
  const [selectedCorridor, setSelectedCorridor] = useState<Corridor | "All">("All");

  // Upload/Export functionality
  const config = REPORT_CONFIGS.volumes;
  const {
    data: volumeData,
    uploadModalOpen,
    setUploadModalOpen,
    handleUpload,
    handleExport,
  } = useReportUpload(mockVolumeRecords, config);

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
          <div>
            <h2 className="text-2xl font-bold text-ink">Volumes & Balancing</h2>
            <p className="text-sm text-ink/60 mt-1">National gas balance and historical volume tracking</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleExport(volumeData, `volume_balance_${formatDateForCSV(new Date())}.csv`)}
              className="px-4 py-2 border border-line rounded-lg text-ink hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={() => setUploadModalOpen(true)}
              className="px-4 py-2 border border-line rounded-lg text-ink hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload CSV
            </button>
            <Link
              href="/records/volumes"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Record
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <span className="text-sm text-ink/70 mr-2">Filter Deliveries by Corridor:</span>
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
                <div className="bg-accent text-white px-6 py-3 rounded-lg font-bold tabular-nums">
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
                <div className="bg-accent text-white px-6 py-3 rounded-lg font-bold tabular-nums">
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
                <div className="bg-primary text-white px-6 py-3 rounded-lg font-bold tabular-nums">
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

        {/* Historical Volume Balance Records */}
        <div className="kpi-card mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-ink">Historical Volume Balance Records</h3>
            <p className="text-sm text-ink/60">
              Showing <span className="font-semibold text-ink">{volumeData.length}</span> records
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-line">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-ink">Gas Day</th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">Produced</th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">NGL Extracted</th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">Into Transmission</th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">Fuel Gas</th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">Line Pack Δ</th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">Delivered</th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">UFG</th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">UFG %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {volumeData.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-primary">{record.gasDay}</td>
                    <td className="px-4 py-3 text-sm text-ink text-right tabular-nums">
                      {formatNumber(record.produced, 1)}
                    </td>
                    <td className="px-4 py-3 text-sm text-flare text-right tabular-nums">
                      {formatNumber(record.nglExtracted, 1)}
                    </td>
                    <td className="px-4 py-3 text-sm text-accent font-semibold text-right tabular-nums">
                      {formatNumber(record.receivedIntoTransmission, 1)}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink/70 text-right tabular-nums">
                      {formatNumber(record.fuelGas, 1)}
                    </td>
                    <td className={`px-4 py-3 text-sm text-right tabular-nums ${
                      record.linePackChange >= 0 ? 'text-primary' : 'text-alert'
                    }`}>
                      {record.linePackChange >= 0 ? '+' : ''}{formatNumber(record.linePackChange, 1)}
                    </td>
                    <td className="px-4 py-3 text-sm text-primary font-semibold text-right tabular-nums">
                      {formatNumber(record.delivered, 1)}
                    </td>
                    <td className="px-4 py-3 text-sm text-alert font-semibold text-right tabular-nums">
                      {formatNumber(record.ufg, 1)}
                    </td>
                    <td className={`px-4 py-3 text-sm font-semibold text-right tabular-nums ${
                      record.ufgPercent > 0.5 ? 'text-alert' : 'text-primary'
                    }`}>
                      {record.ufgPercent.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {volumeData.length === 0 && (
            <div className="text-center py-12">
              <p className="text-ink/60">No volume balance records found</p>
            </div>
          )}
        </div>

        {/* Note */}
        <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-sm text-ink/70">
            <strong>Note:</strong> UFG is computed as: Received − Fuel Gas − Line Pack Δ
            − Delivered. Gas day is 06:00–06:00 WAT. All volumes in MMscf/d.
          </p>
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        templateType={config.templateType}
        title="Upload Volume Balance Data"
        existingData={volumeData}
        identifierFields={config.identifierFields}
        requiredFields={config.requiredFields}
        onUploadSuccess={handleUpload}
      />
    </div>
  );
}
