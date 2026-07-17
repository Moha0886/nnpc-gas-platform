"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  Plus,
  FileSpreadsheet,
  FileText as FilePdf,
  Filter,
  AlertTriangle,
} from "lucide-react";
import type { Corridor } from "@/lib/types";

// Mock historical deferment records data
const mockDefermentRecords = [
  {
    id: "def-001",
    startDate: "2026-07-15",
    endDate: "2026-07-16",
    facilityId: "elps-001",
    facilityName: "ELPS",
    facilityType: "Pipeline",
    operator: "NGIC",
    corridor: "Eastern",
    cause: "Unplanned Breakdown",
    deferredVolume: 125.5,
    cumulativeVolume: 251.0,
    gasPrice: 3.5,
    valueUSD: 878.5,
    status: "Resolved",
  },
  {
    id: "def-002",
    startDate: "2026-07-14",
    endDate: "",
    facilityId: "plant-utorogu",
    facilityName: "Utorogu Gas Plant",
    facilityType: "Processing Plant",
    operator: "NGML",
    corridor: "Western",
    cause: "Planned Maintenance",
    deferredVolume: 85.3,
    cumulativeVolume: 255.9,
    gasPrice: 3.5,
    valueUSD: 895.65,
    status: "Ongoing",
  },
  {
    id: "def-003",
    startDate: "2026-07-13",
    endDate: "2026-07-13",
    facilityId: "comp-obite",
    facilityName: "Obite Compressor Station",
    facilityType: "Compressor Station",
    operator: "NLNG",
    corridor: "Lagos",
    cause: "Third-Party Interference",
    deferredVolume: 220.0,
    cumulativeVolume: 176.0,
    gasPrice: 3.5,
    valueUSD: 616.0,
    status: "Resolved",
  },
  {
    id: "def-004",
    startDate: "2026-07-12",
    endDate: "2026-07-14",
    facilityId: "field-jones-creek",
    facilityName: "Jones Creek Field",
    facilityType: "Field",
    operator: "Shell",
    corridor: "Lagos",
    cause: "Upstream Supply Shortfall",
    deferredVolume: 95.2,
    cumulativeVolume: 285.6,
    gasPrice: 3.5,
    valueUSD: 999.6,
    status: "Resolved",
  },
  {
    id: "def-005",
    startDate: "2026-07-10",
    endDate: "2026-07-11",
    facilityId: "plant-obiafu",
    facilityName: "Obiafu-Obrikom Gas Plant",
    facilityType: "Processing Plant",
    operator: "NGIC",
    corridor: "Eastern",
    cause: "Offtaker Rejection",
    deferredVolume: 68.5,
    cumulativeVolume: 137.0,
    gasPrice: 3.5,
    valueUSD: 479.5,
    status: "Resolved",
  },
];

export default function DefermentReportsPage() {
  const searchParams = useSearchParams();
  const fromParam = searchParams.get("from") || "";
  const toParam = searchParams.get("to") || new Date().toISOString().split("T")[0];
  const corridorParam = searchParams.get("corridor") || "All";

  const [dateFrom, setDateFrom] = useState(fromParam);
  const [dateTo, setDateTo] = useState(toParam);
  const [selectedCorridor, setSelectedCorridor] = useState<Corridor | "All">(
    corridorParam as Corridor | "All"
  );
  const [selectedCause, setSelectedCause] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedFacilityType, setSelectedFacilityType] = useState<string>("All");

  const corridors: Array<Corridor | "All"> = ["All", "Eastern", "Western", "Northern", "Lagos"];
  const causes = [
    "All",
    "Planned Maintenance",
    "Unplanned Breakdown",
    "Third-Party Interference",
    "Upstream Supply Shortfall",
    "Offtaker Rejection",
  ];
  const statuses = ["All", "Ongoing", "Resolved"];
  const facilityTypes = ["All", "Pipeline", "Processing Plant", "Compressor Station", "Field"];

  // Filter records
  const filteredRecords = useMemo(() => {
    return mockDefermentRecords.filter((record) => {
      if (dateFrom && record.startDate < dateFrom) return false;
      if (dateTo && record.startDate > dateTo) return false;
      if (selectedCorridor !== "All" && record.corridor !== selectedCorridor) return false;
      if (selectedCause !== "All" && record.cause !== selectedCause) return false;
      if (selectedStatus !== "All" && record.status !== selectedStatus) return false;
      if (selectedFacilityType !== "All" && record.facilityType !== selectedFacilityType)
        return false;
      return true;
    });
  }, [dateFrom, dateTo, selectedCorridor, selectedCause, selectedStatus, selectedFacilityType]);

  // Calculate summary stats
  const totalCumulativeVolume = filteredRecords.reduce((sum, r) => sum + r.cumulativeVolume, 0);
  const totalValueUSD = filteredRecords.reduce((sum, r) => sum + r.valueUSD, 0);
  const ongoingEvents = filteredRecords.filter((r) => r.status === "Ongoing").length;
  const resolvedEvents = filteredRecords.filter((r) => r.status === "Resolved").length;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-line px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/reports" className="text-ink/60 hover:text-ink">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h2 className="text-2xl font-bold text-ink">Deferment Events Reports</h2>
              <p className="text-sm text-ink/60 mt-1">Deferments, causes, and value impact</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-line rounded-lg text-ink hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload
            </button>
            <Link
              href="/records/deferment"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Record
            </Link>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="kpi-card bg-alert/5">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-alert" />
              <h4 className="text-sm font-medium text-ink/70">Total Events</h4>
            </div>
            <p className="text-2xl font-bold text-ink tabular-nums">{filteredRecords.length}</p>
            <p className="text-xs text-ink/60 mt-1">
              {ongoingEvents} ongoing, {resolvedEvents} resolved
            </p>
          </div>

          <div className="kpi-card">
            <h4 className="text-sm font-medium text-ink/70 mb-2">Total Deferred Volume</h4>
            <p className="text-2xl font-bold text-alert tabular-nums">
              {totalCumulativeVolume.toFixed(1)}
            </p>
            <p className="text-xs text-ink/60 mt-1">MMscf</p>
          </div>

          <div className="kpi-card">
            <h4 className="text-sm font-medium text-ink/70 mb-2">Total Value Impact</h4>
            <p className="text-2xl font-bold text-alert tabular-nums">
              ${totalValueUSD.toFixed(2)}
            </p>
            <p className="text-xs text-ink/60 mt-1">USD</p>
          </div>

          <div className="kpi-card">
            <h4 className="text-sm font-medium text-ink/70 mb-2">Ongoing Events</h4>
            <p
              className={`text-2xl font-bold tabular-nums ${
                ongoingEvents > 0 ? "text-alert" : "text-primary"
              }`}
            >
              {ongoingEvents}
            </p>
            <p className="text-xs text-ink/60 mt-1">Require attention</p>
          </div>
        </div>

        {/* Filters */}
        <div className="kpi-card mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-alert/10">
              <Filter className="w-5 h-5 text-alert" />
            </div>
            <h3 className="text-lg font-semibold text-ink">Filters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-2">Date From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink/70 mb-2">Date To</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink/70 mb-2">Corridor</label>
              <select
                value={selectedCorridor}
                onChange={(e) => setSelectedCorridor(e.target.value as Corridor | "All")}
                className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {corridors.map((corridor) => (
                  <option key={corridor} value={corridor}>
                    {corridor}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-2">Deferment Cause</label>
              <select
                value={selectedCause}
                onChange={(e) => setSelectedCause(e.target.value)}
                className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {causes.map((cause) => (
                  <option key={cause} value={cause}>
                    {cause}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink/70 mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink/70 mb-2">Facility Type</label>
              <select
                value={selectedFacilityType}
                onChange={(e) => setSelectedFacilityType(e.target.value)}
                className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {facilityTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-ink/60">
            Showing <span className="font-semibold text-ink">{filteredRecords.length}</span>{" "}
            records
          </p>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-line rounded-lg text-ink hover:bg-gray-50 transition-colors flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4" />
              Export Excel
            </button>
            <button className="px-4 py-2 border border-line rounded-lg text-ink hover:bg-gray-50 transition-colors flex items-center gap-2">
              <FilePdf className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>

        {/* Records Table */}
        <div className="kpi-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-line">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-ink">
                    Start Date
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-ink">End Date</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-ink">Facility</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-ink">Type</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-ink">Operator</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-ink">Corridor</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-ink">Cause</th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">
                    Deferred (MMscf/d)
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">
                    Cumulative (MMscf)
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">
                    Value (USD)
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-ink">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-primary">
                      {record.startDate}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink/70">
                      {record.endDate || "Ongoing"}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink">{record.facilityName}</td>
                    <td className="px-4 py-3 text-sm text-ink/70">{record.facilityType}</td>
                    <td className="px-4 py-3 text-sm text-ink/70">{record.operator}</td>
                    <td className="px-4 py-3 text-sm text-ink/70">{record.corridor}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="inline-flex px-2 py-1 rounded text-xs font-medium bg-alert/10 text-alert">
                        {record.cause}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-ink/70 text-right tabular-nums">
                      {record.deferredVolume.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-sm text-alert font-semibold text-right tabular-nums">
                      {record.cumulativeVolume.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-sm text-alert font-semibold text-right tabular-nums">
                      ${record.valueUSD.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                          record.status === "Ongoing"
                            ? "bg-alert/10 text-alert"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRecords.length === 0 && (
            <div className="text-center py-12">
              <p className="text-ink/60">No records found matching your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
