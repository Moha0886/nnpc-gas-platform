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
  Gauge,
} from "lucide-react";
import type { Corridor } from "@/lib/types";
import UploadModal from "@/components/UploadModal";
import { useReportUpload } from "@/lib/use-report-upload";
import { REPORT_CONFIGS } from "@/lib/report-upload-configs";
import { formatDateForCSV } from "@/lib/csv-utils";

// Mock historical delivery records data
const mockDeliveryRecords = [
  {
    id: "del-001",
    gasDay: "2026-07-16",
    corridor: "Eastern",
    offtaker: "Egbin Power Station",
    dcq: 125.0,
    deliveryPointId: "MP-EGBIN-001",
    meterStatus: "Operational",
    operator: "Mary Eze",
    receivedVolume: 120.5,
    offtakenVolume: 119.8,
    meterReading: 45678.5,
    deliveryPressure: 850,
    temperature: 26.5,
    receiptVariance: 0.7,
    deliveryVsDcq: 95.8,
  },
  {
    id: "del-002",
    gasDay: "2026-07-16",
    corridor: "Western",
    offtaker: "Olorunsogo Power Plant",
    dcq: 95.0,
    deliveryPointId: "MP-OLORU-001",
    meterStatus: "Operational",
    operator: "Ibrahim Sule",
    receivedVolume: 88.3,
    offtakenVolume: 88.0,
    meterReading: 32145.8,
    deliveryPressure: 780,
    temperature: 28.2,
    receiptVariance: 0.3,
    deliveryVsDcq: 92.6,
  },
  {
    id: "del-003",
    gasDay: "2026-07-15",
    corridor: "Eastern",
    offtaker: "Egbin Power Station",
    dcq: 125.0,
    deliveryPointId: "MP-EGBIN-001",
    meterStatus: "Operational",
    operator: "Mary Eze",
    receivedVolume: 122.0,
    offtakenVolume: 121.5,
    meterReading: 45559.2,
    deliveryPressure: 855,
    temperature: 25.8,
    receiptVariance: 0.5,
    deliveryVsDcq: 97.2,
  },
  {
    id: "del-004",
    gasDay: "2026-07-15",
    corridor: "Lagos",
    offtaker: "NLNG Bonny",
    dcq: 450.0,
    deliveryPointId: "MP-NLNG-001",
    meterStatus: "Operational",
    operator: "Victor Amadi",
    receivedVolume: 445.0,
    offtakenVolume: 444.2,
    meterReading: 125678.9,
    deliveryPressure: 920,
    temperature: 24.5,
    receiptVariance: 0.8,
    deliveryVsDcq: 98.7,
  },
  {
    id: "del-005",
    gasDay: "2026-07-14",
    corridor: "Western",
    offtaker: "Olorunsogo Power Plant",
    dcq: 95.0,
    deliveryPointId: "MP-OLORU-001",
    meterStatus: "Degraded",
    operator: "Ibrahim Sule",
    receivedVolume: 88.0,
    offtakenVolume: 86.5,
    meterReading: 32058.2,
    deliveryPressure: 775,
    temperature: 29.1,
    receiptVariance: 1.5,
    deliveryVsDcq: 91.1,
  },
  {
    id: "del-006",
    gasDay: "2026-07-14",
    corridor: "Northern",
    offtaker: "Calabar Cement Plant",
    dcq: 35.0,
    deliveryPointId: "MP-CALABAR-001",
    meterStatus: "Operational",
    operator: "Grace Okon",
    receivedVolume: 28.5,
    offtakenVolume: 28.5,
    meterReading: 8945.6,
    deliveryPressure: 650,
    temperature: 30.5,
    receiptVariance: 0.0,
    deliveryVsDcq: 81.4,
  },
];

export default function DeliveriesReportsPage() {
  const searchParams = useSearchParams();
  const fromParam = searchParams.get("from") || "";
  const toParam = searchParams.get("to") || new Date().toISOString().split("T")[0];
  const corridorParam = searchParams.get("corridor") || "All";

  const [dateFrom, setDateFrom] = useState(fromParam);
  const [dateTo, setDateTo] = useState(toParam);
  const [selectedCorridor, setSelectedCorridor] = useState<Corridor | "All">(
    corridorParam as Corridor | "All"
  );
  const [selectedOfftaker, setSelectedOfftaker] = useState<string>("All");
  const [selectedMeterStatus, setSelectedMeterStatus] = useState<string>("All");

  const corridors: Array<Corridor | "All"> = ["All", "Eastern", "Western", "Northern", "Lagos"];
  const offtakers = [
    "All",
    "Egbin Power Station",
    "Olorunsogo Power Plant",
    "NLNG Bonny",
    "Calabar Cement Plant",
  ];
  const meterStatuses = ["All", "Operational", "Degraded", "Failed"];

  // Upload/Export functionality
  const config = REPORT_CONFIGS.deliveries;
  const {
    data: deliveriesData,
    uploadModalOpen,
    setUploadModalOpen,
    handleUpload,
    handleExport,
  } = useReportUpload(mockDeliveryRecords, config);

  // Filter records
  const filteredRecords = useMemo(() => {
    return deliveriesData.filter((record) => {
      if (dateFrom && record.gasDay < dateFrom) return false;
      if (dateTo && record.gasDay > dateTo) return false;
      if (selectedCorridor !== "All" && record.corridor !== selectedCorridor) return false;
      if (selectedOfftaker !== "All" && record.offtaker !== selectedOfftaker) return false;
      if (selectedMeterStatus !== "All" && record.meterStatus !== selectedMeterStatus)
        return false;
      return true;
    });
  }, [dateFrom, dateTo, selectedCorridor, selectedOfftaker, selectedMeterStatus]);

  // Calculate summary stats
  const totalReceived = filteredRecords.reduce((sum, r) => sum + r.receivedVolume, 0);
  const totalOfftaken = filteredRecords.reduce((sum, r) => sum + r.offtakenVolume, 0);
  const totalVariance = filteredRecords.reduce((sum, r) => sum + r.receiptVariance, 0);
  const avgDeliveryVsDcq =
    filteredRecords.length > 0
      ? filteredRecords.reduce((sum, r) => sum + r.deliveryVsDcq, 0) / filteredRecords.length
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
              <h2 className="text-2xl font-bold text-ink">Delivery Records Reports</h2>
              <p className="text-sm text-ink/60 mt-1">Metered volumes delivered to offtakers</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleExport(filteredRecords, `deliveries_report_${formatDateForCSV(new Date())}.csv`)}
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
              href="/records/deliveries"
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
              <Gauge className="w-5 h-5 text-primary" />
              <h4 className="text-sm font-medium text-ink/70">Total Records</h4>
            </div>
            <p className="text-2xl font-bold text-ink tabular-nums">{filteredRecords.length}</p>
          </div>

          <div className="kpi-card">
            <h4 className="text-sm font-medium text-ink/70 mb-2">Total Received</h4>
            <p className="text-2xl font-bold text-accent tabular-nums">
              {totalReceived.toFixed(1)}
            </p>
            <p className="text-xs text-ink/60 mt-1">MMscf/d</p>
          </div>

          <div className="kpi-card">
            <h4 className="text-sm font-medium text-ink/70 mb-2">Total Offtaken</h4>
            <p className="text-2xl font-bold text-primary tabular-nums">
              {totalOfftaken.toFixed(1)}
            </p>
            <p className="text-xs text-ink/60 mt-1">MMscf/d</p>
          </div>

          <div className="kpi-card">
            <h4 className="text-sm font-medium text-ink/70 mb-2">Total Variance</h4>
            <p className="text-2xl font-bold text-alert tabular-nums">
              {totalVariance.toFixed(1)}
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

            <div>
              <label className="block text-sm font-medium text-ink/70 mb-2">Meter Status</label>
              <select
                value={selectedMeterStatus}
                onChange={(e) => setSelectedMeterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {meterStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
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
                  <th className="text-left px-4 py-3 text-sm font-semibold text-ink">
                    Meter Status
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">
                    DCQ (MMscf/d)
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">
                    Received (MMscf/d)
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">
                    Offtaken (MMscf/d)
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">
                    Variance (MMscf/d)
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">
                    Delivery vs DCQ %
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
                          record.meterStatus === "Operational"
                            ? "bg-primary/10 text-primary"
                            : record.meterStatus === "Degraded"
                            ? "bg-alert/10 text-alert"
                            : "bg-gray-100 text-ink/60"
                        }`}
                      >
                        {record.meterStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-ink/70 text-right tabular-nums">
                      {record.dcq.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-sm text-accent font-semibold text-right tabular-nums">
                      {record.receivedVolume.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-sm text-primary font-semibold text-right tabular-nums">
                      {record.offtakenVolume.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right tabular-nums">
                      <span
                        className={`font-semibold ${
                          record.receiptVariance < 0.5
                            ? "text-primary"
                            : record.receiptVariance < 1.0
                            ? "text-accent"
                            : "text-alert"
                        }`}
                      >
                        {record.receiptVariance.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right tabular-nums">
                      <span
                        className={`font-semibold ${
                          record.deliveryVsDcq >= 95
                            ? "text-primary"
                            : record.deliveryVsDcq >= 85
                            ? "text-accent"
                            : "text-alert"
                        }`}
                      >
                        {record.deliveryVsDcq.toFixed(1)}%
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

      {/* Upload Modal */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        templateType={config.templateType}
        title="Upload Deliveries Data"
        existingData={deliveriesData}
        identifierFields={config.identifierFields}
        requiredFields={config.requiredFields}
        onUploadSuccess={handleUpload}
      />
    </div>
  );
}
