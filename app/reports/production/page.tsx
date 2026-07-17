"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  Plus,
  Download,
  FileSpreadsheet,
  FileText as FilePdf,
  Filter,
  TrendingUp,
} from "lucide-react";
import type { Corridor } from "@/lib/types";

// Mock historical production data
const mockProductionRecords = [
  {
    id: "prod-001",
    gasDay: "2026-07-16",
    facilityType: "Plant",
    facilityId: "plant-obiafu",
    facilityName: "Obiafu-Obrikom Gas Plant",
    operator: "NGIC",
    corridor: "Eastern",
    gasProduction: 450.5,
    facilityCapacity: 600,
    nglProduction: 1200,
    lpgProduction: 180,
    flareVolume: 12.3,
    utilization: 75.1,
  },
  {
    id: "prod-002",
    gasDay: "2026-07-16",
    facilityType: "Plant",
    facilityId: "plant-utorogu",
    facilityName: "Utorogu Gas Plant",
    operator: "NGML",
    corridor: "Western",
    gasProduction: 380.2,
    facilityCapacity: 500,
    nglProduction: 950,
    lpgProduction: 145,
    flareVolume: 8.7,
    utilization: 76.0,
  },
  {
    id: "prod-003",
    gasDay: "2026-07-15",
    facilityType: "Plant",
    facilityId: "plant-obiafu",
    facilityName: "Obiafu-Obrikom Gas Plant",
    operator: "NGIC",
    corridor: "Eastern",
    gasProduction: 425.8,
    facilityCapacity: 600,
    nglProduction: 1150,
    lpgProduction: 165,
    flareVolume: 15.2,
    utilization: 71.0,
  },
  {
    id: "prod-004",
    gasDay: "2026-07-15",
    facilityType: "Plant",
    facilityId: "plant-utorogu",
    facilityName: "Utorogu Gas Plant",
    operator: "NGML",
    corridor: "Western",
    gasProduction: 392.5,
    facilityCapacity: 500,
    nglProduction: 980,
    lpgProduction: 150,
    flareVolume: 6.5,
    utilization: 78.5,
  },
  {
    id: "prod-005",
    gasDay: "2026-07-14",
    facilityType: "Field",
    facilityId: "field-jones-creek",
    facilityName: "Jones Creek Field",
    operator: "Shell",
    corridor: "Lagos",
    gasProduction: 180.5,
    facilityCapacity: 250,
    nglProduction: 0,
    lpgProduction: 0,
    flareVolume: 22.1,
    utilization: 72.2,
  },
  {
    id: "prod-006",
    gasDay: "2026-07-14",
    facilityType: "Plant",
    facilityId: "plant-obiafu",
    facilityName: "Obiafu-Obrikom Gas Plant",
    operator: "NGIC",
    corridor: "Eastern",
    gasProduction: 438.7,
    facilityCapacity: 600,
    nglProduction: 1180,
    lpgProduction: 172,
    flareVolume: 10.8,
    utilization: 73.1,
  },
  {
    id: "prod-007",
    gasDay: "2026-07-13",
    facilityType: "Plant",
    facilityId: "plant-utorogu",
    facilityName: "Utorogu Gas Plant",
    operator: "NGML",
    corridor: "Western",
    gasProduction: 365.3,
    facilityCapacity: 500,
    nglProduction: 920,
    lpgProduction: 138,
    flareVolume: 11.2,
    utilization: 73.1,
  },
  {
    id: "prod-008",
    gasDay: "2026-07-13",
    facilityType: "Field",
    facilityId: "field-obite",
    facilityName: "Obite Gas Field",
    operator: "NLNG",
    corridor: "Lagos",
    gasProduction: 520.8,
    facilityCapacity: 750,
    nglProduction: 0,
    lpgProduction: 0,
    flareVolume: 5.4,
    utilization: 69.4,
  },
];

export default function ProductionReportsPage() {
  const searchParams = useSearchParams();
  const fromParam = searchParams.get("from") || "";
  const toParam = searchParams.get("to") || new Date().toISOString().split("T")[0];
  const corridorParam = searchParams.get("corridor") || "All";

  const [dateFrom, setDateFrom] = useState(fromParam);
  const [dateTo, setDateTo] = useState(toParam);
  const [selectedCorridor, setSelectedCorridor] = useState<Corridor | "All">(
    corridorParam as Corridor | "All"
  );
  const [selectedFacilityType, setSelectedFacilityType] = useState<string>("All");
  const [selectedOperator, setSelectedOperator] = useState<string>("All");

  const corridors: Array<Corridor | "All"> = ["All", "Eastern", "Western", "Northern", "Lagos"];
  const facilityTypes = ["All", "Plant", "Field", "Well"];
  const operators = ["All", "NGIC", "NGML", "NLNG", "Shell"];

  // Filter records
  const filteredRecords = useMemo(() => {
    return mockProductionRecords.filter((record) => {
      // Date filter
      if (dateFrom && record.gasDay < dateFrom) return false;
      if (dateTo && record.gasDay > dateTo) return false;

      // Corridor filter
      if (selectedCorridor !== "All" && record.corridor !== selectedCorridor) return false;

      // Facility type filter
      if (selectedFacilityType !== "All" && record.facilityType !== selectedFacilityType)
        return false;

      // Operator filter
      if (selectedOperator !== "All" && record.operator !== selectedOperator) return false;

      return true;
    });
  }, [dateFrom, dateTo, selectedCorridor, selectedFacilityType, selectedOperator]);

  // Calculate summary stats
  const totalProduction = filteredRecords.reduce((sum, r) => sum + r.gasProduction, 0);
  const totalFlare = filteredRecords.reduce((sum, r) => sum + r.flareVolume, 0);
  const avgUtilization =
    filteredRecords.length > 0
      ? filteredRecords.reduce((sum, r) => sum + r.utilization, 0) / filteredRecords.length
      : 0;

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
              <h2 className="text-2xl font-bold text-ink">Production Reports</h2>
              <p className="text-sm text-ink/60 mt-1">
                Daily production records from upstream facilities
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-line rounded-lg text-ink hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload
            </button>
            <Link
              href="/records/production"
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
              <TrendingUp className="w-5 h-5 text-primary" />
              <h4 className="text-sm font-medium text-ink/70">Total Records</h4>
            </div>
            <p className="text-2xl font-bold text-ink tabular-nums">{filteredRecords.length}</p>
          </div>

          <div className="kpi-card">
            <h4 className="text-sm font-medium text-ink/70 mb-2">Total Production</h4>
            <p className="text-2xl font-bold text-primary tabular-nums">
              {totalProduction.toFixed(1)}
            </p>
            <p className="text-xs text-ink/60 mt-1">MMscf/d</p>
          </div>

          <div className="kpi-card">
            <h4 className="text-sm font-medium text-ink/70 mb-2">Avg Utilization</h4>
            <p className="text-2xl font-bold text-accent tabular-nums">
              {avgUtilization.toFixed(1)}%
            </p>
          </div>

          <div className="kpi-card">
            <h4 className="text-sm font-medium text-ink/70 mb-2">Total Flare</h4>
            <p className="text-2xl font-bold text-flare tabular-nums">{totalFlare.toFixed(1)}</p>
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

            <div>
              <label className="block text-sm font-medium text-ink/70 mb-2">Operator</label>
              <select
                value={selectedOperator}
                onChange={(e) => setSelectedOperator(e.target.value)}
                className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {operators.map((op) => (
                  <option key={op} value={op}>
                    {op}
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
                  <th className="text-left px-4 py-3 text-sm font-semibold text-ink">
                    Facility
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-ink">Type</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-ink">Operator</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-ink">Corridor</th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">
                    Production (MMscf/d)
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">
                    Capacity (MMscf/d)
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">
                    Utilization %
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">
                    NGL (bbl/d)
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">
                    Flare (MMscf/d)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-primary">
                      {record.gasDay}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink">{record.facilityName}</td>
                    <td className="px-4 py-3 text-sm text-ink/70">{record.facilityType}</td>
                    <td className="px-4 py-3 text-sm text-ink/70">{record.operator}</td>
                    <td className="px-4 py-3 text-sm text-ink/70">{record.corridor}</td>
                    <td className="px-4 py-3 text-sm text-ink text-right tabular-nums">
                      {record.gasProduction.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink/70 text-right tabular-nums">
                      {record.facilityCapacity.toFixed(0)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right tabular-nums">
                      <span
                        className={`font-semibold ${
                          record.utilization >= 80
                            ? "text-primary"
                            : record.utilization >= 60
                            ? "text-accent"
                            : "text-alert"
                        }`}
                      >
                        {record.utilization.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-ink/70 text-right tabular-nums">
                      {record.nglProduction > 0 ? record.nglProduction.toLocaleString() : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-flare text-right tabular-nums font-semibold">
                      {record.flareVolume.toFixed(1)}
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
