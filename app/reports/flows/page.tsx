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
  Activity,
} from "lucide-react";
import type { Corridor } from "@/lib/types";
import UploadModal from "@/components/UploadModal";
import { useReportUpload } from "@/lib/use-report-upload";
import { REPORT_CONFIGS } from "@/lib/report-upload-configs";
import { formatDateForCSV } from "@/lib/csv-utils";

// Mock historical flow readings data
const mockFlowRecords = [
  {
    id: "flow-001",
    timestamp: "2026-07-16 14:00",
    corridor: "Eastern",
    pipeline: "ELPS",
    dataSource: "SCADA",
    operator: "NGIC Control Room",
    currentFlow: 850.5,
    pipelineCapacity: 1200,
    inletPressure: 1233,
    outletPressure: 1050,
    temperature: 28.5,
    utilization: 70.9,
    pressureDrop: 183,
  },
  {
    id: "flow-002",
    timestamp: "2026-07-16 14:00",
    corridor: "Western",
    pipeline: "OB3",
    dataSource: "SCADA",
    operator: "NGML Control Room",
    currentFlow: 720.3,
    pipelineCapacity: 1000,
    inletPressure: 1305,
    outletPressure: 1200,
    temperature: 30.2,
    utilization: 72.0,
    pressureDrop: 105,
  },
  {
    id: "flow-003",
    timestamp: "2026-07-16 13:00",
    corridor: "Eastern",
    pipeline: "ELPS",
    dataSource: "SCADA",
    operator: "NGIC Control Room",
    currentFlow: 845.2,
    pipelineCapacity: 1200,
    inletPressure: 1228,
    outletPressure: 1045,
    temperature: 28.8,
    utilization: 70.4,
    pressureDrop: 183,
  },
  {
    id: "flow-004",
    timestamp: "2026-07-16 12:00",
    corridor: "Northern",
    pipeline: "AKK",
    dataSource: "Metering Station",
    operator: "NGIC Field Team",
    currentFlow: 215.8,
    pipelineCapacity: 2200,
    inletPressure: 1421,
    outletPressure: 1180,
    temperature: 32.1,
    utilization: 9.8,
    pressureDrop: 241,
  },
  {
    id: "flow-005",
    timestamp: "2026-07-15 14:00",
    corridor: "Eastern",
    pipeline: "ELPS",
    dataSource: "SCADA",
    operator: "NGIC Control Room",
    currentFlow: 862.1,
    pipelineCapacity: 1200,
    inletPressure: 1240,
    outletPressure: 1055,
    temperature: 27.9,
    utilization: 71.8,
    pressureDrop: 185,
  },
  {
    id: "flow-006",
    timestamp: "2026-07-15 12:00",
    corridor: "Western",
    pipeline: "OB3",
    dataSource: "SCADA",
    operator: "NGML Control Room",
    currentFlow: 705.5,
    pipelineCapacity: 1000,
    inletPressure: 1298,
    outletPressure: 1195,
    temperature: 29.5,
    utilization: 70.6,
    pressureDrop: 103,
  },
];

export default function FlowReportsPage() {
  const searchParams = useSearchParams();
  const fromParam = searchParams.get("from") || "";
  const toParam = searchParams.get("to") || new Date().toISOString().split("T")[0];
  const corridorParam = searchParams.get("corridor") || "All";

  const [dateFrom, setDateFrom] = useState(fromParam);
  const [dateTo, setDateTo] = useState(toParam);
  const [selectedCorridor, setSelectedCorridor] = useState<Corridor | "All">(
    corridorParam as Corridor | "All"
  );
  const [selectedPipeline, setSelectedPipeline] = useState<string>("All");
  const [selectedDataSource, setSelectedDataSource] = useState<string>("All");

  // Upload/Export functionality
  const config = REPORT_CONFIGS.flows;
  const {
    data: flowsData,
    uploadModalOpen,
    setUploadModalOpen,
    handleUpload,
    handleExport,
  } = useReportUpload(mockFlowRecords, config);

  const corridors: Array<Corridor | "All"> = ["All", "Eastern", "Western", "Northern", "Lagos"];
  const pipelines = ["All", "ELPS", "OB3", "AKK"];
  const dataSources = ["All", "SCADA", "Metering Station", "Manual"];

  // Filter records
  const filteredRecords = useMemo(() => {
    return flowsData.filter((record) => {
      const recordDate = record.timestamp.split(" ")[0];
      if (dateFrom && recordDate < dateFrom) return false;
      if (dateTo && recordDate > dateTo) return false;
      if (selectedCorridor !== "All" && record.corridor !== selectedCorridor) return false;
      if (selectedPipeline !== "All" && record.pipeline !== selectedPipeline) return false;
      if (selectedDataSource !== "All" && record.dataSource !== selectedDataSource) return false;
      return true;
    });
  }, [dateFrom, dateTo, selectedCorridor, selectedPipeline, selectedDataSource]);

  // Calculate summary stats
  const avgFlow =
    filteredRecords.length > 0
      ? filteredRecords.reduce((sum, r) => sum + r.currentFlow, 0) / filteredRecords.length
      : 0;
  const avgUtilization =
    filteredRecords.length > 0
      ? filteredRecords.reduce((sum, r) => sum + r.utilization, 0) / filteredRecords.length
      : 0;
  const avgPressureDrop =
    filteredRecords.length > 0
      ? filteredRecords.reduce((sum, r) => sum + r.pressureDrop, 0) / filteredRecords.length
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
              <h2 className="text-2xl font-bold text-ink">Flow Readings Reports</h2>
              <p className="text-sm text-ink/60 mt-1">
                Pipeline flow, pressure, and temperature data
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleExport(filteredRecords, `flows_report_${formatDateForCSV(new Date())}.csv`)}
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
              href="/records/flows"
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
          <div className="kpi-card bg-accent/5">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-5 h-5 text-accent" />
              <h4 className="text-sm font-medium text-ink/70">Total Readings</h4>
            </div>
            <p className="text-2xl font-bold text-ink tabular-nums">{filteredRecords.length}</p>
          </div>

          <div className="kpi-card">
            <h4 className="text-sm font-medium text-ink/70 mb-2">Avg Flow Rate</h4>
            <p className="text-2xl font-bold text-primary tabular-nums">{avgFlow.toFixed(1)}</p>
            <p className="text-xs text-ink/60 mt-1">MMscf/d</p>
          </div>

          <div className="kpi-card">
            <h4 className="text-sm font-medium text-ink/70 mb-2">Avg Utilization</h4>
            <p className="text-2xl font-bold text-accent tabular-nums">
              {avgUtilization.toFixed(1)}%
            </p>
          </div>

          <div className="kpi-card">
            <h4 className="text-sm font-medium text-ink/70 mb-2">Avg Pressure Drop</h4>
            <p className="text-2xl font-bold text-ink/70 tabular-nums">
              {avgPressureDrop.toFixed(0)}
            </p>
            <p className="text-xs text-ink/60 mt-1">PSI</p>
          </div>
        </div>

        {/* Filters */}
        <div className="kpi-card mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-accent/10">
              <Filter className="w-5 h-5 text-accent" />
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
              <label className="block text-sm font-medium text-ink/70 mb-2">Pipeline</label>
              <select
                value={selectedPipeline}
                onChange={(e) => setSelectedPipeline(e.target.value)}
                className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {pipelines.map((pipeline) => (
                  <option key={pipeline} value={pipeline}>
                    {pipeline}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink/70 mb-2">Data Source</label>
              <select
                value={selectedDataSource}
                onChange={(e) => setSelectedDataSource(e.target.value)}
                className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {dataSources.map((source) => (
                  <option key={source} value={source}>
                    {source}
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
                  <th className="text-left px-4 py-3 text-sm font-semibold text-ink">Timestamp</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-ink">Pipeline</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-ink">Corridor</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-ink">
                    Data Source
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">
                    Flow (MMscf/d)
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">
                    Utilization %
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">
                    Inlet (PSI)
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">
                    Outlet (PSI)
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">
                    Pressure Drop
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">Temp (°C)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-primary">
                      {record.timestamp}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink">{record.pipeline}</td>
                    <td className="px-4 py-3 text-sm text-ink/70">{record.corridor}</td>
                    <td className="px-4 py-3 text-sm text-ink/70">{record.dataSource}</td>
                    <td className="px-4 py-3 text-sm text-ink text-right tabular-nums">
                      {record.currentFlow.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right tabular-nums">
                      <span
                        className={`font-semibold ${
                          record.utilization >= 70
                            ? "text-primary"
                            : record.utilization >= 50
                            ? "text-accent"
                            : "text-alert"
                        }`}
                      >
                        {record.utilization.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-ink/70 text-right tabular-nums">
                      {record.inletPressure.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink/70 text-right tabular-nums">
                      {record.outletPressure.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-accent font-semibold text-right tabular-nums">
                      {record.pressureDrop}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink/70 text-right tabular-nums">
                      {record.temperature.toFixed(1)}
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

      {/* Upload Modal */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        templateType={config.templateType}
        title="Upload Flow Readings Data"
        existingData={flowsData}
        identifierFields={config.identifierFields}
        requiredFields={config.requiredFields}
        onUploadSuccess={handleUpload}
      />
    </div>
  );
}
