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
  FileText,
} from "lucide-react";
import type { Corridor } from "@/lib/types";

// Mock historical nominations data
const mockNominationsRecords = [
  {
    id: "nom-001",
    gasDay: "2026-07-16",
    corridor: "Eastern",
    offtaker: "Egbin Power Station",
    dcq: 125.0,
    priorityLevel: "High",
    requestedBy: "John Okafor",
    nominatedVolume: 120.5,
    allocatedVolume: 120.5,
    forecastSupply: 118.2,
    allocationVsDcq: 96.4,
  },
  {
    id: "nom-002",
    gasDay: "2026-07-16",
    corridor: "Western",
    offtaker: "Olorunsogo Power Plant",
    dcq: 95.0,
    priorityLevel: "Normal",
    requestedBy: "Amina Hassan",
    nominatedVolume: 88.3,
    allocatedVolume: 88.3,
    forecastSupply: 90.1,
    allocationVsDcq: 92.9,
  },
  {
    id: "nom-003",
    gasDay: "2026-07-15",
    corridor: "Eastern",
    offtaker: "Egbin Power Station",
    dcq: 125.0,
    priorityLevel: "High",
    requestedBy: "John Okafor",
    nominatedVolume: 125.0,
    allocatedVolume: 122.0,
    forecastSupply: 120.5,
    allocationVsDcq: 97.6,
  },
  {
    id: "nom-004",
    gasDay: "2026-07-15",
    corridor: "Lagos",
    offtaker: "NLNG Bonny",
    dcq: 450.0,
    priorityLevel: "High",
    requestedBy: "Sarah Adewale",
    nominatedVolume: 445.0,
    allocatedVolume: 445.0,
    forecastSupply: 442.8,
    allocationVsDcq: 98.9,
  },
  {
    id: "nom-005",
    gasDay: "2026-07-14",
    corridor: "Western",
    offtaker: "Olorunsogo Power Plant",
    dcq: 95.0,
    priorityLevel: "Normal",
    requestedBy: "Amina Hassan",
    nominatedVolume: 92.0,
    allocatedVolume: 88.0,
    forecastSupply: 87.5,
    allocationVsDcq: 92.6,
  },
  {
    id: "nom-006",
    gasDay: "2026-07-14",
    corridor: "Northern",
    offtaker: "Calabar Cement Plant",
    dcq: 35.0,
    priorityLevel: "Low",
    requestedBy: "Ibrahim Musa",
    nominatedVolume: 28.5,
    allocatedVolume: 28.5,
    forecastSupply: 28.5,
    allocationVsDcq: 81.4,
  },
  {
    id: "nom-007",
    gasDay: "2026-07-13",
    corridor: "Eastern",
    offtaker: "Egbin Power Station",
    dcq: 125.0,
    priorityLevel: "High",
    requestedBy: "John Okafor",
    nominatedVolume: 118.0,
    allocatedVolume: 118.0,
    forecastSupply: 116.3,
    allocationVsDcq: 94.4,
  },
  {
    id: "nom-008",
    gasDay: "2026-07-13",
    corridor: "Lagos",
    offtaker: "NLNG Bonny",
    dcq: 450.0,
    priorityLevel: "High",
    requestedBy: "Sarah Adewale",
    nominatedVolume: 450.0,
    allocatedVolume: 448.0,
    forecastSupply: 445.2,
    allocationVsDcq: 99.6,
  },
];

export default function NominationsReportsPage() {
  const searchParams = useSearchParams();
  const fromParam = searchParams.get("from") || "";
  const toParam = searchParams.get("to") || new Date().toISOString().split("T")[0];
  const corridorParam = searchParams.get("corridor") || "All";

  const [dateFrom, setDateFrom] = useState(fromParam);
  const [dateTo, setDateTo] = useState(toParam);
  const [selectedCorridor, setSelectedCorridor] = useState<Corridor | "All">(
    corridorParam as Corridor | "All"
  );
  const [selectedPriority, setSelectedPriority] = useState<string>("All");
  const [selectedOfftaker, setSelectedOfftaker] = useState<string>("All");

  const corridors: Array<Corridor | "All"> = ["All", "Eastern", "Western", "Northern", "Lagos"];
  const priorities = ["All", "High", "Normal", "Low"];
  const offtakers = [
    "All",
    "Egbin Power Station",
    "Olorunsogo Power Plant",
    "NLNG Bonny",
    "Calabar Cement Plant",
  ];

  // Filter records
  const filteredRecords = useMemo(() => {
    return mockNominationsRecords.filter((record) => {
      if (dateFrom && record.gasDay < dateFrom) return false;
      if (dateTo && record.gasDay > dateTo) return false;
      if (selectedCorridor !== "All" && record.corridor !== selectedCorridor) return false;
      if (selectedPriority !== "All" && record.priorityLevel !== selectedPriority) return false;
      if (selectedOfftaker !== "All" && record.offtaker !== selectedOfftaker) return false;
      return true;
    });
  }, [dateFrom, dateTo, selectedCorridor, selectedPriority, selectedOfftaker]);

  // Calculate summary stats
  const totalNominated = filteredRecords.reduce((sum, r) => sum + r.nominatedVolume, 0);
  const totalAllocated = filteredRecords.reduce((sum, r) => sum + r.allocatedVolume, 0);
  const avgAllocationVsDcq =
    filteredRecords.length > 0
      ? filteredRecords.reduce((sum, r) => sum + r.allocationVsDcq, 0) / filteredRecords.length
      : 0;
  const shortfall = totalNominated - totalAllocated;

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
              <h2 className="text-2xl font-bold text-ink">Nominations Reports</h2>
              <p className="text-sm text-ink/60 mt-1">
                Customer gas demand and allocation records
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-line rounded-lg text-ink hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload
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
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="kpi-card bg-primary/5">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-primary" />
              <h4 className="text-sm font-medium text-ink/70">Total Records</h4>
            </div>
            <p className="text-2xl font-bold text-ink tabular-nums">{filteredRecords.length}</p>
          </div>

          <div className="kpi-card">
            <h4 className="text-sm font-medium text-ink/70 mb-2">Total Nominated</h4>
            <p className="text-2xl font-bold text-primary tabular-nums">
              {totalNominated.toFixed(1)}
            </p>
            <p className="text-xs text-ink/60 mt-1">MMscf/d</p>
          </div>

          <div className="kpi-card">
            <h4 className="text-sm font-medium text-ink/70 mb-2">Total Allocated</h4>
            <p className="text-2xl font-bold text-accent tabular-nums">
              {totalAllocated.toFixed(1)}
            </p>
            <p className="text-xs text-ink/60 mt-1">MMscf/d</p>
          </div>

          <div className="kpi-card">
            <h4 className="text-sm font-medium text-ink/70 mb-2">Shortfall</h4>
            <p
              className={`text-2xl font-bold tabular-nums ${
                shortfall > 0 ? "text-alert" : "text-primary"
              }`}
            >
              {shortfall.toFixed(1)}
            </p>
            <p className="text-xs text-ink/60 mt-1">MMscf/d</p>
          </div>
        </div>

        {/* Filters */}
        <div className="kpi-card mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Filter className="w-5 h-5 text-primary" />
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
              <label className="block text-sm font-medium text-ink/70 mb-2">Priority</label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {priorities.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink/70 mb-2">Offtaker</label>
              <select
                value={selectedOfftaker}
                onChange={(e) => setSelectedOfftaker(e.target.value)}
                className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {offtakers.map((offtaker) => (
                  <option key={offtaker} value={offtaker}>
                    {offtaker}
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
                  <th className="text-left px-4 py-3 text-sm font-semibold text-ink">Gas Day</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-ink">Offtaker</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-ink">Corridor</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-ink">Priority</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-ink">
                    Requested By
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">
                    DCQ (MMscf/d)
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">
                    Nominated (MMscf/d)
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">
                    Allocated (MMscf/d)
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">
                    Forecast (MMscf/d)
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">
                    Allocation vs DCQ %
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-primary">
                      {record.gasDay}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink">{record.offtaker}</td>
                    <td className="px-4 py-3 text-sm text-ink/70">{record.corridor}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                          record.priorityLevel === "High"
                            ? "bg-alert/10 text-alert"
                            : record.priorityLevel === "Normal"
                            ? "bg-accent/10 text-accent"
                            : "bg-gray-100 text-ink/60"
                        }`}
                      >
                        {record.priorityLevel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-ink/70">{record.requestedBy}</td>
                    <td className="px-4 py-3 text-sm text-ink/70 text-right tabular-nums">
                      {record.dcq.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink text-right tabular-nums">
                      {record.nominatedVolume.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-sm text-primary font-semibold text-right tabular-nums">
                      {record.allocatedVolume.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink/70 text-right tabular-nums">
                      {record.forecastSupply.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right tabular-nums">
                      <span
                        className={`font-semibold ${
                          record.allocationVsDcq >= 95
                            ? "text-primary"
                            : record.allocationVsDcq >= 85
                            ? "text-accent"
                            : "text-alert"
                        }`}
                      >
                        {record.allocationVsDcq.toFixed(1)}%
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
