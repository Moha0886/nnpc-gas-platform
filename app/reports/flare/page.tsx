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
  Flame,
} from "lucide-react";
import type { Corridor } from "@/lib/types";

// Mock historical flare records data
const mockFlareRecords = [
  {
    id: "flare-001",
    eventDate: "2026-07-16",
    facilityId: "plant-obiafu",
    facilityName: "Obiafu-Obrikom Gas Plant",
    operator: "NGIC",
    corridor: "Eastern",
    startTime: "14:30",
    endTime: "16:45",
    flareReason: "Operational",
    flareVolume: 12.3,
    duration: 2.25,
    penaltyNGN: 61500,
    penaltyUSD: 41.0,
    reportedBy: "John Eze",
  },
  {
    id: "flare-002",
    eventDate: "2026-07-16",
    facilityId: "plant-utorogu",
    facilityName: "Utorogu Gas Plant",
    operator: "NGML",
    corridor: "Western",
    startTime: "10:15",
    endTime: "11:30",
    flareReason: "Safety",
    flareVolume: 8.7,
    duration: 1.25,
    penaltyNGN: 43500,
    penaltyUSD: 29.0,
    reportedBy: "Amina Hassan",
  },
  {
    id: "flare-003",
    eventDate: "2026-07-15",
    facilityId: "field-jones-creek",
    facilityName: "Jones Creek Field",
    operator: "Shell",
    corridor: "Lagos",
    startTime: "08:00",
    endTime: "12:45",
    flareReason: "Unplanned Breakdown",
    flareVolume: 22.1,
    duration: 4.75,
    penaltyNGN: 110500,
    penaltyUSD: 73.67,
    reportedBy: "Victor Amadi",
  },
  {
    id: "flare-004",
    eventDate: "2026-07-15",
    facilityId: "plant-obiafu",
    facilityName: "Obiafu-Obrikom Gas Plant",
    operator: "NGIC",
    corridor: "Eastern",
    startTime: "22:00",
    endTime: "23:15",
    flareReason: "Emergency",
    flareVolume: 15.2,
    duration: 1.25,
    penaltyNGN: 76000,
    penaltyUSD: 50.67,
    reportedBy: "John Eze",
  },
  {
    id: "flare-005",
    eventDate: "2026-07-14",
    facilityId: "plant-utorogu",
    facilityName: "Utorogu Gas Plant",
    operator: "NGML",
    corridor: "Western",
    startTime: "15:30",
    endTime: "16:45",
    flareReason: "Routine",
    flareVolume: 6.5,
    duration: 1.25,
    penaltyNGN: 32500,
    penaltyUSD: 21.67,
    reportedBy: "Amina Hassan",
  },
  {
    id: "flare-006",
    eventDate: "2026-07-14",
    facilityId: "plant-obiafu",
    facilityName: "Obiafu-Obrikom Gas Plant",
    operator: "NGIC",
    corridor: "Eastern",
    startTime: "19:00",
    endTime: "20:30",
    flareReason: "Technical",
    flareVolume: 10.8,
    duration: 1.5,
    penaltyNGN: 54000,
    penaltyUSD: 36.0,
    reportedBy: "Mary Okafor",
  },
];

export default function FlareReportsPage() {
  const searchParams = useSearchParams();
  const fromParam = searchParams.get("from") || "";
  const toParam = searchParams.get("to") || new Date().toISOString().split("T")[0];
  const corridorParam = searchParams.get("corridor") || "All";

  const [dateFrom, setDateFrom] = useState(fromParam);
  const [dateTo, setDateTo] = useState(toParam);
  const [selectedCorridor, setSelectedCorridor] = useState<Corridor | "All">(
    corridorParam as Corridor | "All"
  );
  const [selectedReason, setSelectedReason] = useState<string>("All");
  const [selectedOperator, setSelectedOperator] = useState<string>("All");

  const corridors: Array<Corridor | "All"> = ["All", "Eastern", "Western", "Northern", "Lagos"];
  const reasons = ["All", "Operational", "Safety", "Emergency", "Routine", "Technical"];
  const operators = ["All", "NGIC", "NGML", "NLNG", "Shell"];

  // Filter records
  const filteredRecords = useMemo(() => {
    return mockFlareRecords.filter((record) => {
      if (dateFrom && record.eventDate < dateFrom) return false;
      if (dateTo && record.eventDate > dateTo) return false;
      if (selectedCorridor !== "All" && record.corridor !== selectedCorridor) return false;
      if (selectedReason !== "All" && record.flareReason !== selectedReason) return false;
      if (selectedOperator !== "All" && record.operator !== selectedOperator) return false;
      return true;
    });
  }, [dateFrom, dateTo, selectedCorridor, selectedReason, selectedOperator]);

  // Calculate summary stats
  const totalFlareVolume = filteredRecords.reduce((sum, r) => sum + r.flareVolume, 0);
  const totalPenaltyNGN = filteredRecords.reduce((sum, r) => sum + r.penaltyNGN, 0);
  const totalPenaltyUSD = filteredRecords.reduce((sum, r) => sum + r.penaltyUSD, 0);
  const totalDuration = filteredRecords.reduce((sum, r) => sum + r.duration, 0);

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
              <h2 className="text-2xl font-bold text-ink">Flare Events Reports</h2>
              <p className="text-sm text-ink/60 mt-1">Flare volumes and penalty exposure</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-line rounded-lg text-ink hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload
            </button>
            <Link
              href="/records/flare"
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
          <div className="kpi-card bg-flare/5">
            <div className="flex items-center gap-3 mb-2">
              <Flame className="w-5 h-5 text-flare" />
              <h4 className="text-sm font-medium text-ink/70">Total Events</h4>
            </div>
            <p className="text-2xl font-bold text-ink tabular-nums">{filteredRecords.length}</p>
          </div>

          <div className="kpi-card">
            <h4 className="text-sm font-medium text-ink/70 mb-2">Total Flare Volume</h4>
            <p className="text-2xl font-bold text-flare tabular-nums">
              {totalFlareVolume.toFixed(1)}
            </p>
            <p className="text-xs text-ink/60 mt-1">MMscf</p>
          </div>

          <div className="kpi-card">
            <h4 className="text-sm font-medium text-ink/70 mb-2">Total Penalty (NGN)</h4>
            <p className="text-2xl font-bold text-alert tabular-nums">
              ₦{totalPenaltyNGN.toLocaleString()}
            </p>
          </div>

          <div className="kpi-card">
            <h4 className="text-sm font-medium text-ink/70 mb-2">Total Penalty (USD)</h4>
            <p className="text-2xl font-bold text-alert tabular-nums">
              ${totalPenaltyUSD.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="kpi-card mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-flare/10">
              <Filter className="w-5 h-5 text-flare" />
            </div>
            <h3 className="text-lg font-semibold text-ink">Filters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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

            <div>
              <label className="block text-sm font-medium text-ink/70 mb-2">Flare Reason</label>
              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {reasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink/70 mb-2">Operator</label>
              <select
                value={selectedOperator}
                onChange={(e) => setSelectedOperator(e.target.value)}
                className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {operators.map((operator) => (
                  <option key={operator} value={operator}>
                    {operator}
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
                    Event Date
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-ink">Facility</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-ink">Operator</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-ink">Corridor</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-ink">Reason</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-ink">
                    Start - End
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">
                    Duration (hrs)
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">
                    Volume (MMscf)
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">
                    Penalty (NGN)
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">
                    Penalty (USD)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-primary">
                      {record.eventDate}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink">{record.facilityName}</td>
                    <td className="px-4 py-3 text-sm text-ink/70">{record.operator}</td>
                    <td className="px-4 py-3 text-sm text-ink/70">{record.corridor}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                          record.flareReason === "Emergency"
                            ? "bg-alert/10 text-alert"
                            : record.flareReason === "Safety"
                            ? "bg-flare/10 text-flare"
                            : "bg-accent/10 text-accent"
                        }`}
                      >
                        {record.flareReason}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-ink/70">
                      {record.startTime} - {record.endTime}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink/70 text-right tabular-nums">
                      {record.duration.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-flare font-semibold text-right tabular-nums">
                      {record.flareVolume.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-sm text-alert font-semibold text-right tabular-nums">
                      ₦{record.penaltyNGN.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-alert font-semibold text-right tabular-nums">
                      ${record.penaltyUSD.toFixed(2)}
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
