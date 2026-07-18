"use client";

import { useState, Fragment, useMemo } from "react";
import Link from "next/link";
import { getOfftakerFlows, offtakers } from "@/lib/data";
import { formatNumber } from "@/lib/utils";
import { FileText, AlertCircle, Upload, Plus, Download } from "lucide-react";
import type { Corridor } from "@/lib/types";
import UploadModal from "@/components/UploadModal";
import { useReportUpload } from "@/lib/use-report-upload";
import { REPORT_CONFIGS } from "@/lib/report-upload-configs";
import { formatDateForCSV } from "@/lib/csv-utils";

// Mock historical nomination snapshots
const mockNominationSnapshots = [
  {
    id: "nom-snap-001",
    gasDay: "2026-07-16",
    corridor: "All",
    offtaker: "System Total",
    dcq: 2500.0,
    priorityLevel: "Normal",
    requestedBy: "System",
    nominatedVolume: 2420.5,
    allocatedVolume: 2380.2,
    forecastSupply: 2350.8,
    allocationVsDcq: 95.2,
  },
  {
    id: "nom-snap-002",
    gasDay: "2026-07-15",
    corridor: "All",
    offtaker: "System Total",
    dcq: 2500.0,
    priorityLevel: "Normal",
    requestedBy: "System",
    nominatedVolume: 2385.3,
    allocatedVolume: 2340.5,
    forecastSupply: 2315.2,
    allocationVsDcq: 93.6,
  },
  {
    id: "nom-snap-003",
    gasDay: "2026-07-14",
    corridor: "All",
    offtaker: "System Total",
    dcq: 2500.0,
    priorityLevel: "Normal",
    requestedBy: "System",
    nominatedVolume: 2455.8,
    allocatedVolume: 2420.3,
    forecastSupply: 2398.5,
    allocationVsDcq: 96.8,
  },
];

export default function NominationsPage() {
  const [selectedCorridor, setSelectedCorridor] = useState<Corridor | "All">("All");

  // Upload/Export functionality for historical snapshots
  const config = REPORT_CONFIGS.nominations;
  const {
    data: nominationSnapshots,
    uploadModalOpen,
    setUploadModalOpen,
    handleUpload,
    handleExport,
  } = useReportUpload(mockNominationSnapshots, config);

  const flows = getOfftakerFlows(
    undefined,
    selectedCorridor === "All" ? undefined : selectedCorridor
  );

  // Enrich flows with offtaker names
  const enrichedFlows = flows.map((flow) => {
    const offtaker = offtakers.find((o) => o.id === flow.offtakerId);
    return {
      ...flow,
      offtakerName: offtaker?.name || "Unknown",
      sector: offtaker?.sector || "Unknown",
    };
  });

  // Group by corridor
  const groupedFlows: Record<string, typeof enrichedFlows> = {};
  enrichedFlows.forEach((flow) => {
    if (!groupedFlows[flow.corridor]) {
      groupedFlows[flow.corridor] = [];
    }
    groupedFlows[flow.corridor].push(flow);
  });

  const corridors: Array<Corridor | "All"> = [
    "All",
    "Eastern",
    "Western",
    "Northern",
    "Lagos",
  ];

  // Calculate totals
  const totals = enrichedFlows.reduce(
    (acc, flow) => ({
      nominated: acc.nominated + flow.nominated,
      allocated: acc.allocated + flow.allocated,
      forecastSupply: acc.forecastSupply + flow.forecastSupply,
      actualSupplied: acc.actualSupplied + flow.actualSupplied,
      received: acc.received + flow.received,
      offtaken: acc.offtaken + flow.offtaken,
      varianceAllocation: acc.varianceAllocation + flow.varianceAllocation,
      varianceSupply: acc.varianceSupply + flow.varianceSupply,
      varianceTransmission: acc.varianceTransmission + flow.varianceTransmission,
      varianceOfftake: acc.varianceOfftake + flow.varianceOfftake,
      varianceNomination: acc.varianceNomination + flow.varianceNomination,
      varianceReceipt: acc.varianceReceipt + flow.varianceReceipt,
    }),
    {
      nominated: 0,
      allocated: 0,
      forecastSupply: 0,
      actualSupplied: 0,
      received: 0,
      offtaken: 0,
      varianceAllocation: 0,
      varianceSupply: 0,
      varianceTransmission: 0,
      varianceOfftake: 0,
      varianceNomination: 0,
      varianceReceipt: 0,
    }
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-line px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-ink">Nominations & Variance Tracking</h2>
            <p className="text-sm text-ink/60 mt-1">
              Complete plan-to-actual flow with variance tracking at every stage
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleExport(nominationSnapshots, `nominations_${formatDateForCSV(new Date())}.csv`)}
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
              href="/records/nominations"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Record
            </Link>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="kpi-card">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-ink/60">Total Nominated</span>
            </div>
            <p className="text-2xl font-bold text-ink tabular-nums">
              {formatNumber(totals.nominated, 0)}
              <span className="text-sm text-ink/60 ml-1">MMscf/d</span>
            </p>
          </div>

          <div className="kpi-card">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-medium text-ink/60">Allocation Gap</span>
            </div>
            <p className="text-2xl font-bold text-amber-500 tabular-nums">
              {formatNumber(totals.varianceAllocation, 0)}
              <span className="text-sm text-ink/60 ml-1">MMscf/d</span>
            </p>
            <p className="text-xs text-ink/50 mt-1">Nom - Alloc</p>
          </div>

          <div className="kpi-card">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-5 h-5 text-flare" />
              <span className="text-sm font-medium text-ink/60">Supply Gap</span>
            </div>
            <p className="text-2xl font-bold text-flare tabular-nums">
              {formatNumber(totals.varianceSupply, 0)}
              <span className="text-sm text-ink/60 ml-1">MMscf/d</span>
            </p>
            <p className="text-xs text-ink/50 mt-1">Alloc - Supply</p>
          </div>

          <div className="kpi-card">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium text-ink/60">Transmission Loss</span>
            </div>
            <p className="text-2xl font-bold text-orange-500 tabular-nums">
              {formatNumber(totals.varianceTransmission, 0)}
              <span className="text-sm text-ink/60 ml-1">MMscf/d</span>
            </p>
            <p className="text-xs text-ink/50 mt-1">Supply - Received</p>
          </div>

          <div className="kpi-card">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-5 h-5 text-alert" />
              <span className="text-sm font-medium text-ink/60">Offtake Gap</span>
            </div>
            <p className="text-2xl font-bold text-alert tabular-nums">
              {formatNumber(totals.varianceOfftake, 0)}
              <span className="text-sm text-ink/60 ml-1">MMscf/d</span>
            </p>
            <p className="text-xs text-ink/50 mt-1">Received - Offtaken</p>
          </div>
        </div>

        {/* Nominations Table - Grouped by Corridor */}
        <div className="kpi-card">
          <h3 className="text-lg font-semibold text-ink mb-4">
            Nomination Cycle by Delivery Point
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
                  <th className="text-left">Gas Day</th>
                  <th className="text-left">Offtaker</th>
                  <th className="text-left">Sector</th>
                  <th className="text-left">Corridor</th>
                  <th className="text-right bg-blue-50">
                    <div className="font-bold">Nominated</div>
                    <div className="text-xs font-normal">(Plan)</div>
                  </th>
                  <th className="text-right bg-blue-50">
                    <div className="font-bold">Allocated</div>
                    <div className="text-xs font-normal">(Plan)</div>
                  </th>
                  <th className="text-right bg-blue-50">
                    <div className="font-bold">Forecast</div>
                    <div className="text-xs font-normal">(Plan)</div>
                  </th>
                  <th className="text-right bg-green-50">
                    <div className="font-bold">Actual Supplied</div>
                    <div className="text-xs font-normal">(Actual)</div>
                  </th>
                  <th className="text-right bg-green-50">
                    <div className="font-bold">Received</div>
                    <div className="text-xs font-normal">(Actual)</div>
                  </th>
                  <th className="text-right bg-green-50">
                    <div className="font-bold">Offtaken</div>
                    <div className="text-xs font-normal">(Actual)</div>
                  </th>
                  <th className="text-right bg-amber-100">
                    <div className="font-bold">Alloc Gap</div>
                    <div className="text-xs font-normal">(N-A)</div>
                  </th>
                  <th className="text-right bg-orange-100">
                    <div className="font-bold">Supply Gap</div>
                    <div className="text-xs font-normal">(A-S)</div>
                  </th>
                  <th className="text-right bg-yellow-100">
                    <div className="font-bold">Trans Loss</div>
                    <div className="text-xs font-normal">(S-R)</div>
                  </th>
                  <th className="text-right bg-red-100">
                    <div className="font-bold">Offtake Gap</div>
                    <div className="text-xs font-normal">(R-O)</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedCorridor === "All"
                  ? Object.keys(groupedFlows)
                      .sort()
                      .map((corridor) => (
                        <Fragment key={`corridor-${corridor}`}>
                          <tr key={`header-${corridor}`} className="bg-gray-50">
                            <td
                              colSpan={14}
                              className="font-semibold text-primary py-2"
                            >
                              {corridor} Corridor
                            </td>
                          </tr>
                          {groupedFlows[corridor].map((flow) => (
                            <tr key={flow.offtakerId}>
                              <td className="text-sm font-medium text-primary">{flow.gasDay}</td>
                              <td className="font-medium">{flow.offtakerName}</td>
                              <td className="text-sm text-ink/70">{flow.sector}</td>
                              <td>
                                <span className="badge-operational">
                                  {flow.corridor}
                                </span>
                              </td>
                              <td className="text-right bg-blue-50">
                                {formatNumber(flow.nominated, 0)}
                              </td>
                              <td className="text-right bg-blue-50">
                                {formatNumber(flow.allocated, 0)}
                              </td>
                              <td className="text-right bg-blue-50">
                                {formatNumber(flow.forecastSupply, 0)}
                              </td>
                              <td className="text-right bg-green-50 font-semibold">
                                {formatNumber(flow.actualSupplied, 0)}
                              </td>
                              <td className="text-right bg-green-50">
                                {formatNumber(flow.received, 0)}
                              </td>
                              <td className="text-right bg-green-50">
                                {formatNumber(flow.offtaken, 0)}
                              </td>
                              <td className="text-right bg-amber-100 font-bold">
                                <span
                                  className={
                                    flow.varianceAllocation > 3
                                      ? "text-amber-700"
                                      : "text-ink"
                                  }
                                >
                                  {formatNumber(flow.varianceAllocation, 0)}
                                </span>
                              </td>
                              <td className="text-right bg-orange-100 font-bold">
                                <span
                                  className={
                                    flow.varianceSupply > 3
                                      ? "text-orange-700"
                                      : "text-ink"
                                  }
                                >
                                  {formatNumber(flow.varianceSupply, 0)}
                                </span>
                              </td>
                              <td className="text-right bg-yellow-100 font-bold">
                                <span
                                  className={
                                    flow.varianceTransmission > 2
                                      ? "text-yellow-700"
                                      : "text-ink"
                                  }
                                >
                                  {formatNumber(flow.varianceTransmission, 0)}
                                </span>
                              </td>
                              <td className="text-right bg-red-100 font-bold">
                                <span
                                  className={
                                    flow.varianceOfftake > 3
                                      ? "text-red-700"
                                      : "text-ink"
                                  }
                                >
                                  {formatNumber(flow.varianceOfftake, 0)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </Fragment>
                      ))
                  : enrichedFlows.map((flow) => (
                      <tr key={flow.offtakerId}>
                        <td className="text-sm font-medium text-primary">{flow.gasDay}</td>
                        <td className="font-medium">{flow.offtakerName}</td>
                        <td className="text-sm text-ink/70">{flow.sector}</td>
                        <td>
                          <span className="badge-operational">{flow.corridor}</span>
                        </td>
                        <td className="text-right bg-blue-50">
                          {formatNumber(flow.nominated, 0)}
                        </td>
                        <td className="text-right bg-blue-50">
                          {formatNumber(flow.allocated, 0)}
                        </td>
                        <td className="text-right bg-blue-50">
                          {formatNumber(flow.forecastSupply, 0)}
                        </td>
                        <td className="text-right bg-green-50 font-semibold">
                          {formatNumber(flow.actualSupplied, 0)}
                        </td>
                        <td className="text-right bg-green-50">
                          {formatNumber(flow.received, 0)}
                        </td>
                        <td className="text-right bg-green-50">
                          {formatNumber(flow.offtaken, 0)}
                        </td>
                        <td className="text-right bg-amber-100 font-bold">
                          <span
                            className={
                              flow.varianceAllocation > 3 ? "text-amber-700" : "text-ink"
                            }
                          >
                            {formatNumber(flow.varianceAllocation, 0)}
                          </span>
                        </td>
                        <td className="text-right bg-orange-100 font-bold">
                          <span
                            className={
                              flow.varianceSupply > 3 ? "text-orange-700" : "text-ink"
                            }
                          >
                            {formatNumber(flow.varianceSupply, 0)}
                          </span>
                        </td>
                        <td className="text-right bg-yellow-100 font-bold">
                          <span
                            className={
                              flow.varianceTransmission > 2 ? "text-yellow-700" : "text-ink"
                            }
                          >
                            {formatNumber(flow.varianceTransmission, 0)}
                          </span>
                        </td>
                        <td className="text-right bg-red-100 font-bold">
                          <span
                            className={
                              flow.varianceOfftake > 3 ? "text-red-700" : "text-ink"
                            }
                          >
                            {formatNumber(flow.varianceOfftake, 0)}
                          </span>
                        </td>
                      </tr>
                    ))}

                {/* Totals Row */}
                <tr className="bg-primary/5 font-bold border-t-2 border-primary">
                  <td colSpan={4}>TOTAL</td>
                  <td className="text-right bg-blue-100">{formatNumber(totals.nominated, 0)}</td>
                  <td className="text-right bg-blue-100">{formatNumber(totals.allocated, 0)}</td>
                  <td className="text-right bg-blue-100">
                    {formatNumber(totals.forecastSupply, 0)}
                  </td>
                  <td className="text-right bg-green-100">{formatNumber(totals.actualSupplied, 0)}</td>
                  <td className="text-right bg-green-100">{formatNumber(totals.received, 0)}</td>
                  <td className="text-right bg-green-100">{formatNumber(totals.offtaken, 0)}</td>
                  <td className="text-right bg-amber-200 text-amber-700">
                    {formatNumber(totals.varianceAllocation, 0)}
                  </td>
                  <td className="text-right bg-orange-200 text-orange-700">
                    {formatNumber(totals.varianceSupply, 0)}
                  </td>
                  <td className="text-right bg-yellow-200 text-yellow-700">
                    {formatNumber(totals.varianceTransmission, 0)}
                  </td>
                  <td className="text-right bg-red-200 text-red-700">
                    {formatNumber(totals.varianceOfftake, 0)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-sm text-ink/70">
            <strong>Complete Nomination-to-Delivery Flow:</strong> This table tracks the entire gas flow from offtaker request to final consumption, separating <span className="font-semibold">PLAN</span> from <span className="font-semibold">ACTUAL</span>.
          </p>
          <p className="text-sm text-ink/70 mt-2">
            <strong>Plan Stage (Blue):</strong> Nominated (offtaker request) → Allocated (what we can service based on capacity) → Forecast Supply (planned supply projection).
          </p>
          <p className="text-sm text-ink/70 mt-2">
            <strong>Actual Stage (Green):</strong> Actual Supplied (what we put into the system) → Received (metered at custody transfer point) → Offtaken (what offtaker consumed).
          </p>
          <p className="text-sm text-ink/70 mt-2">
            <strong>Complete Variance Chain:</strong> The system tracks gaps at every stage:
          </p>
          <ul className="text-sm text-ink/70 mt-2 ml-6 space-y-1">
            <li><strong>Allocation Gap</strong> (Nominated − Allocated): Shortfall between request and capacity allocation</li>
            <li><strong>Supply Gap</strong> (Allocated − Actual Supplied): Difference between planned allocation and actual supply</li>
            <li><strong>Transmission Loss</strong> (Actual Supplied − Received): Gas lost during transmission</li>
            <li><strong>Offtake Gap</strong> (Received − Offtaken): Difference between delivery and consumption (line pack or rejection)</li>
          </ul>
        </div>

        {/* Historical Nomination Snapshots */}
        <div className="kpi-card mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-ink">Historical Nomination Snapshots</h3>
            <p className="text-sm text-ink/60">
              Showing <span className="font-semibold text-ink">{nominationSnapshots.length}</span> records
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-line">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-ink">Gas Day</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-ink">Offtaker</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-ink">Corridor</th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">DCQ (MMscf/d)</th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">Nominated</th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">Allocated</th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">Forecast</th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">Allocation vs DCQ (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {nominationSnapshots.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-primary">{record.gasDay}</td>
                    <td className="px-4 py-3 text-sm text-ink">{record.offtaker}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="badge-operational">{record.corridor}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-ink/70 text-right tabular-nums">
                      {formatNumber(record.dcq, 1)}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink text-right tabular-nums">
                      {formatNumber(record.nominatedVolume, 1)}
                    </td>
                    <td className="px-4 py-3 text-sm text-primary font-semibold text-right tabular-nums">
                      {formatNumber(record.allocatedVolume, 1)}
                    </td>
                    <td className="px-4 py-3 text-sm text-accent text-right tabular-nums">
                      {formatNumber(record.forecastSupply, 1)}
                    </td>
                    <td className={`px-4 py-3 text-sm font-semibold text-right tabular-nums ${
                      record.allocationVsDcq >= 95 ? 'text-primary' : record.allocationVsDcq >= 85 ? 'text-flare' : 'text-alert'
                    }`}>
                      {record.allocationVsDcq.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {nominationSnapshots.length === 0 && (
            <div className="text-center py-12">
              <p className="text-ink/60">No historical nomination records found</p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        templateType={config.templateType}
        title="Upload Nomination Data"
        existingData={nominationSnapshots}
        identifierFields={config.identifierFields}
        requiredFields={config.requiredFields}
        onUploadSuccess={handleUpload}
      />
    </div>
  );
}
