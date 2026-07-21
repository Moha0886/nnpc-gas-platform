"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Save,
  Send,
  AlertTriangle,
  Upload as UploadIcon,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Calendar,
  Plus,
  X,
  TrendingDown
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { assets, processingPlants } from "@/lib/data";
import type { Corridor } from "@/lib/types";
import FileUpload from "@/components/FileUpload";

export default function DefermentRecordPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<"upload" | "manual" | null>(null);
  const [existingData, setExistingData] = useState<any[]>([]);

  // Load existing data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('deferment-records');
    if (saved) {
      setExistingData(JSON.parse(saved));
    } else {
      // Initialize with sample data
      const sampleData = [
        { Date: "2024-07-18", Facility: "Obiafu Gas Plant", Cause: "Compressor Failure", "Volume Deferred (MMscf/d)": "150.5", status: "approved", date: "2024-07-18" },
        { Date: "2024-07-19", Facility: "Escravos Pipeline", Cause: "Scheduled Maintenance", "Volume Deferred (MMscf/d)": "85.2", status: "approved", date: "2024-07-19" },
        { Date: "2024-07-20", Facility: "Obite Gas Plant", Cause: "Power Outage", "Volume Deferred (MMscf/d)": "120.8", status: "pending", date: "2024-07-20" },
      ];
      setExistingData(sampleData);
      localStorage.setItem('deferment-records', JSON.stringify(sampleData));
    }
  }, []);

  const openCreateModal = () => {
    setShowModal(true);
    setSelectedMethod(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMethod(null);
  };

  const selectMethod = (method: "upload" | "manual") => {
    setSelectedMethod(method);
  };

  const handleUploadSuccess = (data: any[], overwriteDuplicates: boolean) => {
    console.log("Uploaded deferment records:", data);
    alert(`Successfully uploaded ${data.length} deferment records!`);
    const newData = data.map(d => ({ ...d, status: "pending" }));
    const updated = [...existingData, ...newData];
    setExistingData(updated);
    localStorage.setItem('deferment-records', JSON.stringify(updated));
    closeModal();
  };

  const [formData, setFormData] = useState({
    facilityId: "",
    facilityName: "",
    facilityType: "",
    operator: "",
    corridor: "" as Corridor | "",
    startDate: new Date().toISOString().split("T")[0],
    startTime: "",
    endDate: "",
    endTime: "",
    cause:
      "planned maintenance" as
        | "planned maintenance"
        | "unplanned breakdown"
        | "third-party interference"
        | "upstream supply shortfall"
        | "offtaker rejection",
    deferredVolume: "",
    cumulativeVolume: "",
    gasPrice: "3.50", // USD per MMscf
    description: "",
    reportedBy: "",
  });

  const [status, setStatus] = useState<"draft" | "submitting" | "submitted">("draft");

  const corridors: Corridor[] = ["Eastern", "Western", "Northern", "Lagos"];

  const handleSubmit = async (e: React.FormEvent, saveType: "draft" | "submit") => {
    e.preventDefault();
    setStatus("submitting");

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const eventStatus = formData.endDate ? "resolved" : "ongoing";

    console.log("Deferment Record:", {
      ...formData,
      deferredVolume: parseFloat(formData.deferredVolume),
      cumulativeVolume: parseFloat(formData.cumulativeVolume),
      valueOfDeferredVolume: parseFloat(formData.cumulativeVolume) * parseFloat(formData.gasPrice),
      status: eventStatus,
      saveType,
    });

    setStatus("submitted");
    alert(saveType === "draft" ? "Saved as draft" : "Submitted for approval");

    if (saveType === "submit") {
      closeModal();
    }
  };

  const valueOfDeferred = formData.cumulativeVolume && formData.gasPrice
    ? (parseFloat(formData.cumulativeVolume) * parseFloat(formData.gasPrice)).toLocaleString(
        undefined,
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      )
    : "—";

  // Calculate stats
  const approvedCount = existingData.filter(d => d.status === "approved").length;
  const pendingCount = existingData.filter(d => d.status === "pending").length;
  const totalDeferment = existingData.reduce((sum, d) => sum + parseFloat(d["Volume Deferred (MMscf/d)"] || d.deferredVolume || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with NNPC Branding */}
      <div className="bg-white border-b border-line px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Image src="/nnpc-logo.png" alt="NNPC Logo" width={60} height={60} />
            <div>
              <h1 className="text-2xl font-bold text-[#1B5E3E]">
                NNPC GAS PROCESSING & INFRASTRUCTURE SERVICES
              </h1>
              <p className="text-sm text-ink/60">
                Deferment Records Management System
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-ink/60 hover:text-ink transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Dashboard</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-line rounded-lg text-ink hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Export Records</span>
            </button>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#1B5E3E] text-white rounded-lg font-semibold hover:bg-[#1B5E3E]/90 transition-colors shadow-md"
            >
              <Plus className="w-5 h-5" />
              <span>Create Record</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-line rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-[#1B5E3E]/10">
                <FileText className="w-5 h-5 text-[#1B5E3E]" />
              </div>
              <p className="text-sm text-ink/60">Total Records</p>
            </div>
            <p className="text-3xl font-bold text-ink tabular-nums">{existingData.length}</p>
          </div>

          <div className="bg-white border border-line rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-success/10">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <p className="text-sm text-ink/60">Approved</p>
            </div>
            <p className="text-3xl font-bold text-success tabular-nums">{approvedCount}</p>
          </div>

          <div className="bg-white border border-line rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <p className="text-sm text-ink/60">Pending</p>
            </div>
            <p className="text-3xl font-bold text-yellow-600 tabular-nums">{pendingCount}</p>
          </div>

          <div className="bg-white border border-line rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-alert/10">
                <TrendingDown className="w-5 h-5 text-alert" />
              </div>
              <p className="text-sm text-ink/60">Total Deferment</p>
            </div>
            <p className="text-3xl font-bold text-alert tabular-nums">{totalDeferment.toFixed(1)}</p>
            <p className="text-xs text-ink/40 mt-1">MMscf/d</p>
          </div>
        </div>

        {/* Create Record Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-line bg-gradient-to-r from-[#1B5E3E]/5 to-[#2B5F75]/5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-[#1B5E3E]/10">
                    <Plus className="w-6 h-6 text-[#1B5E3E]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-ink">
                      {selectedMethod === null ? "Create Deferment Record" : selectedMethod === "upload" ? "Bulk Upload" : "Manual Entry"}
                    </h2>
                    <p className="text-sm text-ink/60">
                      {selectedMethod === null ? "Choose how you'd like to add records" : "Enter deferment event data for approval"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-6 h-6 text-ink/60" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
                {selectedMethod === null ? (
                  /* Method Selection */
                  <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Bulk Upload Option */}
                      <button
                        onClick={() => selectMethod("upload")}
                        className="group text-left p-8 border-2 border-line rounded-xl hover:border-[#1B5E3E] hover:shadow-lg transition-all bg-white"
                      >
                        <div className="p-4 rounded-xl bg-[#1B5E3E]/10 w-fit mb-4 group-hover:bg-[#1B5E3E] transition-colors">
                          <UploadIcon className="w-8 h-8 text-[#1B5E3E] group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="text-xl font-bold text-ink mb-2">Bulk Upload</h3>
                        <p className="text-sm text-ink/60 mb-4">Recommended for multiple records</p>
                        <ul className="space-y-2 mb-6">
                          <li className="flex items-start gap-2 text-sm text-ink/70">
                            <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                            <span>Upload CSV or Excel files</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm text-ink/70">
                            <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                            <span>Track multiple deferment events</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm text-ink/70">
                            <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                            <span>Auto-validation & error checking</span>
                          </li>
                        </ul>
                        <div className="flex items-center gap-2 text-[#1B5E3E] font-semibold group-hover:gap-3 transition-all">
                          <span>Select this method</span>
                          <ArrowLeft className="w-4 h-4 rotate-180" />
                        </div>
                      </button>

                      {/* Manual Entry Option */}
                      <button
                        onClick={() => selectMethod("manual")}
                        className="group text-left p-8 border-2 border-line rounded-xl hover:border-[#2B5F75] hover:shadow-lg transition-all bg-white"
                      >
                        <div className="p-4 rounded-xl bg-[#2B5F75]/10 w-fit mb-4 group-hover:bg-[#2B5F75] transition-colors">
                          <AlertTriangle className="w-8 h-8 text-[#2B5F75] group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="text-xl font-bold text-ink mb-2">Manual Entry</h3>
                        <p className="text-sm text-ink/60 mb-4">Single deferment event input</p>
                        <ul className="space-y-2 mb-6">
                          <li className="flex items-start gap-2 text-sm text-ink/70">
                            <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                            <span>Guided form interface</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm text-ink/70">
                            <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                            <span>Real-time field validation</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm text-ink/70">
                            <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                            <span>Save as draft or submit</span>
                          </li>
                        </ul>
                        <div className="flex items-center gap-2 text-[#2B5F75] font-semibold group-hover:gap-3 transition-all">
                          <span>Select this method</span>
                          <ArrowLeft className="w-4 h-4 rotate-180" />
                        </div>
                      </button>
                    </div>
                  </div>
                ) : selectedMethod === "upload" ? (
                  /* Bulk Upload Content */
                  <div className="p-8">
                    <div className="mb-6">
                      <button
                        onClick={() => setSelectedMethod(null)}
                        className="flex items-center gap-2 text-ink/60 hover:text-ink transition-colors text-sm font-medium"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back to options
                      </button>
                    </div>

                    <FileUpload
                      templateType="deferment"
                      existingData={existingData}
                      identifierFields={["Date", "Facility"]}
                      requiredFields={["Date", "Facility", "Planned (MMscf/d)", "Actual (MMscf/d)", "Deferred (MMscf/d)"]}
                      onUploadSuccess={handleUploadSuccess}
                    />

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-blue-100">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-blue-900 mb-1">Deferment Event Format</p>
                            <p className="text-xs text-blue-700">
                              Upload deferment events for all facilities. Track volume impacts from maintenance and breakdowns.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-green-100">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-green-900 mb-1">Auto-Validation</p>
                            <p className="text-xs text-green-700">
                              System automatically validates data and highlights any errors before upload.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Manual Entry Content */
                  <div className="p-8">
                    <div className="mb-6">
                      <button
                        type="button"
                        onClick={() => setSelectedMethod(null)}
                        className="flex items-center gap-2 text-ink/60 hover:text-ink transition-colors text-sm font-medium"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back to options
                      </button>
                    </div>

                    <form onSubmit={(e) => handleSubmit(e, "submit")}>
                      {/* Event Information */}
                      <div className="bg-gray-50 border border-line rounded-lg p-6 mb-6">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-2 rounded-lg bg-alert/10">
                            <AlertTriangle className="w-5 h-5 text-alert" />
                          </div>
                          <h3 className="text-lg font-semibold text-ink">Deferment Details</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-semibold text-ink mb-2">
                              Deferment Cause <span className="text-alert">*</span>
                            </label>
                            <select
                              required
                              value={formData.cause}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  cause: e.target.value as
                                    | "planned maintenance"
                                    | "unplanned breakdown"
                                    | "third-party interference"
                                    | "upstream supply shortfall"
                                    | "offtaker rejection",
                                })
                              }
                              className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3E] focus:border-[#1B5E3E] bg-white"
                            >
                              <option value="planned maintenance">Planned Maintenance</option>
                              <option value="unplanned breakdown">Unplanned Breakdown</option>
                              <option value="third-party interference">Third-Party Interference</option>
                              <option value="upstream supply shortfall">Upstream Supply Shortfall</option>
                              <option value="offtaker rejection">Offtaker Rejection</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-ink mb-2">
                              Facility Type <span className="text-alert">*</span>
                            </label>
                            <select
                              required
                              value={formData.facilityType}
                              onChange={(e) => setFormData({ ...formData, facilityType: e.target.value })}
                              className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3E] focus:border-[#1B5E3E] bg-white"
                            >
                              <option value="">Select type...</option>
                              <option value="Pipeline">Pipeline</option>
                              <option value="Processing plant">Processing Plant</option>
                              <option value="Compressor station">Compressor Station</option>
                              <option value="Metering station">Metering Station</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-ink mb-2">
                              Facility ID <span className="text-alert">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g., elps-001"
                              value={formData.facilityId}
                              onChange={(e) => setFormData({ ...formData, facilityId: e.target.value })}
                              className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3E] focus:border-[#1B5E3E] bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-ink mb-2">
                              Facility Name <span className="text-alert">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g., ELPS"
                              value={formData.facilityName}
                              onChange={(e) => setFormData({ ...formData, facilityName: e.target.value })}
                              className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3E] focus:border-[#1B5E3E] bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-ink mb-2">
                              Operator <span className="text-alert">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g., NGIC, Shell"
                              value={formData.operator}
                              onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
                              className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3E] focus:border-[#1B5E3E] bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-ink mb-2">
                              Corridor
                            </label>
                            <select
                              value={formData.corridor}
                              onChange={(e) =>
                                setFormData({ ...formData, corridor: e.target.value as Corridor })
                              }
                              className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3E] focus:border-[#1B5E3E] bg-white"
                            >
                              <option value="">Select corridor...</option>
                              {corridors.map((corridor) => (
                                <option key={corridor} value={corridor}>
                                  {corridor}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-ink mb-2">
                              Reported By <span className="text-alert">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="Name of person reporting"
                              value={formData.reportedBy}
                              onChange={(e) => setFormData({ ...formData, reportedBy: e.target.value })}
                              className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3E] focus:border-[#1B5E3E] bg-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="bg-gray-50 border border-line rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-semibold text-ink mb-6">Event Timeline</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-semibold text-ink mb-2">
                              Start Date <span className="text-alert">*</span>
                            </label>
                            <div className="relative">
                              <input
                                type="date"
                                required
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="w-full px-4 py-3 pl-10 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3E] focus:border-[#1B5E3E] bg-white"
                              />
                              <Calendar className="w-4 h-4 text-ink/40 absolute left-3 top-1/2 -translate-y-1/2" />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-ink mb-2">
                              Start Time <span className="text-alert">*</span>
                            </label>
                            <input
                              type="time"
                              required
                              value={formData.startTime}
                              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                              className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3E] focus:border-[#1B5E3E] bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-ink mb-2">
                              End Date
                            </label>
                            <input
                              type="date"
                              value={formData.endDate}
                              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                              className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3E] focus:border-[#1B5E3E] bg-white"
                            />
                            <p className="text-xs text-ink/60 mt-1">Leave empty if ongoing</p>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-ink mb-2">
                              End Time
                            </label>
                            <input
                              type="time"
                              value={formData.endTime}
                              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                              className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3E] focus:border-[#1B5E3E] bg-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Volume Impact */}
                      <div className="bg-gray-50 border border-line rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-semibold text-ink mb-6">Volume Impact</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-semibold text-ink mb-2">
                              Deferred Volume (MMscf/d) <span className="text-alert">*</span>
                            </label>
                            <input
                              type="number"
                              required
                              step="0.01"
                              placeholder="0.00"
                              value={formData.deferredVolume}
                              onChange={(e) => setFormData({ ...formData, deferredVolume: e.target.value })}
                              className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3E] focus:border-[#1B5E3E] tabular-nums text-right bg-white"
                            />
                            <p className="text-xs text-ink/60 mt-1">Daily rate of deferred volume</p>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-ink mb-2">
                              Cumulative Volume (MMscf) <span className="text-alert">*</span>
                            </label>
                            <input
                              type="number"
                              required
                              step="0.01"
                              placeholder="0.00"
                              value={formData.cumulativeVolume}
                              onChange={(e) =>
                                setFormData({ ...formData, cumulativeVolume: e.target.value })
                              }
                              className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3E] focus:border-[#1B5E3E] tabular-nums text-right bg-white"
                            />
                            <p className="text-xs text-ink/60 mt-1">Total volume deferred</p>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-ink mb-2">
                              Gas Price (USD/MMscf)
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              placeholder="3.50"
                              value={formData.gasPrice}
                              onChange={(e) => setFormData({ ...formData, gasPrice: e.target.value })}
                              className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3E] focus:border-[#1B5E3E] tabular-nums text-right bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-ink mb-2">
                              Value of Deferred Volume
                            </label>
                            <div className="px-4 py-3 border-2 border-alert/20 rounded-lg bg-alert/5">
                              <span className="text-2xl font-bold text-alert tabular-nums">
                                ${valueOfDeferred}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="bg-gray-50 border border-line rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-semibold text-ink mb-6">Event Description</h3>

                        <div>
                          <label className="block text-sm font-semibold text-ink mb-2">
                            Description / Root Cause <span className="text-alert">*</span>
                          </label>
                          <textarea
                            required
                            rows={4}
                            placeholder="Describe the cause of deferment, actions taken, and expected resolution time..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3E] focus:border-[#1B5E3E] resize-none bg-white"
                          />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between bg-gray-50 border border-line rounded-lg p-6">
                        <button
                          type="button"
                          onClick={closeModal}
                          className="px-6 py-3 border-2 border-line rounded-lg text-ink font-semibold hover:bg-gray-100 transition-colors"
                        >
                          Cancel
                        </button>

                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={(e) => handleSubmit(e as any, "draft")}
                            disabled={status === "submitting"}
                            className="px-6 py-3 border-2 border-[#2B5F75] text-[#2B5F75] rounded-lg font-semibold hover:bg-[#2B5F75]/5 transition-colors flex items-center gap-2 disabled:opacity-50"
                          >
                            <Save className="w-5 h-5" />
                            Save as Draft
                          </button>

                          <button
                            type="submit"
                            disabled={status === "submitting"}
                            className="px-6 py-3 bg-[#1B5E3E] text-white rounded-lg font-semibold hover:bg-[#1B5E3E]/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                          >
                            <Send className="w-5 h-5" />
                            {status === "submitting" ? "Submitting..." : "Submit for Approval"}
                          </button>
                        </div>
                      </div>

                      {/* Workflow Notice */}
                      <div className="mt-6 p-5 bg-gradient-to-r from-[#1B5E3E]/10 to-[#2B5F75]/10 border-l-4 border-alert rounded-lg">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-alert flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-ink mb-1">Impact Tracking</p>
                            <p className="text-sm text-ink/70">
                              Deferment events impact production and revenue. Records will be analyzed for MTBF/MTTR metrics and bad-actor asset identification. This record will be submitted for review by a checker.
                            </p>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Recent Records Table - Enhanced */}
        {existingData.length > 0 && (
          <div className="bg-white border border-line rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-line bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-ink">
                  Recent Deferment Records
                </h3>
                <span className="px-3 py-1 bg-[#1B5E3E]/10 text-[#1B5E3E] text-sm font-semibold rounded-full">
                  {existingData.length} Records
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b-2 border-[#1B5E3E]/20">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-ink uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-ink uppercase tracking-wider">
                      Facility
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-ink uppercase tracking-wider">
                      Cause
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-ink uppercase tracking-wider">
                      Volume Deferred (MMscf/d)
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-ink uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {existingData.map((record, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-ink">
                        {record.Date || record.startDate ? new Date(record.Date || record.startDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        }) : "—"}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-ink">
                        {record.Facility || record.facilityName || record.facilityId || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-ink">
                        {record.Cause || record.cause || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-ink text-right tabular-nums font-semibold">
                        {record["Volume Deferred (MMscf/d)"] || record.deferredVolume || "—"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-full ${
                          record.status === "approved"
                            ? "bg-success/10 text-success border border-success/30"
                            : "bg-yellow-500/10 text-yellow-700 border border-yellow-500/30"
                        }`}>
                          {record.status === "approved" ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5" />
                              Approved
                            </>
                          ) : (
                            <>
                              <Clock className="w-3.5 h-3.5" />
                              Pending Review
                            </>
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
