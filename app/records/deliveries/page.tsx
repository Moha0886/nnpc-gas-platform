"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Save,
  Send,
  Gauge,
  Upload as UploadIcon,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Calendar,
  Plus,
  X
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { offtakers } from "@/lib/data";
import type { Corridor } from "@/lib/types";
import FileUpload from "@/components/FileUpload";

export default function DeliveriesRecordPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<"upload" | "manual" | null>(null);
  const [existingData, setExistingData] = useState<any[]>([]);

  // Load existing data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('delivery-records');
    if (saved) {
      setExistingData(JSON.parse(saved));
    } else {
      // Initialize with sample data
      const sampleData = [
        { Date: "2024-07-19", Station: "Egbin Power", "Allocation (MMscf)": "150.5", "Offtake (MMscf)": "148.2", Pressure: "650", status: "approved" },
        { Date: "2024-07-19", Station: "Olorunsogo Power", "Allocation (MMscf)": "85.3", "Offtake (MMscf)": "84.1", Pressure: "620", status: "approved" },
        { Date: "2024-07-20", Station: "Egbin Power", "Allocation (MMscf)": "152.0", "Offtake (MMscf)": "150.5", Pressure: "655", status: "pending" },
        { Date: "2024-07-20", Station: "Olorunsogo Power", "Allocation (MMscf)": "87.0", "Offtake (MMscf)": "85.8", Pressure: "625", status: "pending" },
      ];
      setExistingData(sampleData);
      localStorage.setItem('delivery-records', JSON.stringify(sampleData));
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
    console.log("Uploaded delivery/offtake records:", data);
    alert(`Successfully uploaded ${data.length} daily offtake records!`);
    const newData = data.map(d => ({ ...d, status: "pending" }));
    const updated = [...existingData, ...newData];
    setExistingData(updated);
    localStorage.setItem('delivery-records', JSON.stringify(updated));
    closeModal();
  };

  const [formData, setFormData] = useState({
    gasDay: new Date().toISOString().split("T")[0],
    offtakerId: "",
    corridor: "" as Corridor | "",
    deliveryPointId: "",
    receivedVolume: "",
    offtakenVolume: "",
    pressure: "",
    temperature: "",
    meterReading: "",
    meterStatus: "operational" as "operational" | "degraded" | "failed",
    operatorName: "",
    notes: "",
  });

  const [status, setStatus] = useState<"draft" | "submitting" | "submitted">("draft");

  const corridors: Corridor[] = ["Eastern", "Western", "Northern", "Lagos"];

  const filteredOfftakers = formData.corridor
    ? offtakers.filter((o) => o.corridor === formData.corridor)
    : offtakers;

  const selectedOfftaker = offtakers.find((o) => o.id === formData.offtakerId);

  const handleSubmit = async (e: React.FormEvent, saveType: "draft" | "submit") => {
    e.preventDefault();
    setStatus("submitting");

    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Delivery Record:", {
      ...formData,
      receivedVolume: parseFloat(formData.receivedVolume),
      offtakenVolume: parseFloat(formData.offtakenVolume),
      pressure: parseFloat(formData.pressure),
      temperature: parseFloat(formData.temperature),
      meterReading: parseFloat(formData.meterReading),
      varianceReceipt: parseFloat(formData.receivedVolume) - parseFloat(formData.offtakenVolume),
      offtakerName: selectedOfftaker?.name,
      saveType,
    });

    setStatus("submitted");
    alert(saveType === "draft" ? "Saved as draft" : "Submitted for approval");

    if (saveType === "submit") {
      closeModal();
    }
  };

  const dcqPercent = (selectedOfftaker?.contractualDemand || selectedOfftaker?.firmAndEffective) && formData.receivedVolume
    ? ((parseFloat(formData.receivedVolume) / (selectedOfftaker.contractualDemand || selectedOfftaker.firmAndEffective || 1)) * 100).toFixed(1)
    : "—";

  const varianceReceipt = formData.receivedVolume && formData.offtakenVolume
    ? (parseFloat(formData.receivedVolume) - parseFloat(formData.offtakenVolume)).toFixed(2)
    : "—";

  // Calculate stats
  const approvedCount = existingData.filter(d => d.status === "approved").length;
  const pendingCount = existingData.filter(d => d.status === "pending").length;
  const totalOfftake = existingData.reduce((sum, d) => sum + parseFloat(d["Offtake (MMscf)"] || d.offtakenVolume || 0), 0);

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
                Daily Gas Offtake Report Management System
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/records"
              className="flex items-center gap-2 text-ink/60 hover:text-ink transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Records</span>
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
              <div className="p-2 rounded-lg bg-primary/10">
                <Gauge className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm text-ink/60">Total Offtake</p>
            </div>
            <p className="text-3xl font-bold text-primary tabular-nums">{totalOfftake.toFixed(1)}</p>
            <p className="text-xs text-ink/40 mt-1">MMscf</p>
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
                      {selectedMethod === null ? "Create Delivery Record" : selectedMethod === "upload" ? "Bulk Upload" : "Manual Entry"}
                    </h2>
                    <p className="text-sm text-ink/60">
                      {selectedMethod === null ? "Choose how you'd like to add records" : "Enter daily gas offtake data for approval"}
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
                            <span>Daily Offtake Report format supported</span>
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
                          <Gauge className="w-8 h-8 text-[#2B5F75] group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="text-xl font-bold text-ink mb-2">Manual Entry</h3>
                        <p className="text-sm text-ink/60 mb-4">Single record input</p>
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
                      templateType="deliveries"
                      existingData={existingData}
                      identifierFields={["Date", "Station"]}
                      requiredFields={["Date", "Station", "Allocation (MMscf)", "Offtake (MMscf)", "Pressure"]}
                      onUploadSuccess={handleUploadSuccess}
                    />

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-blue-100">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-blue-900 mb-1">Daily Offtake Format</p>
                            <p className="text-xs text-blue-700">
                              Upload using your existing Daily Gas Offtake Excel report template.
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
                      {/* Delivery Point Information */}
                      <div className="bg-gray-50 border border-line rounded-lg p-6 mb-6">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-2 rounded-lg bg-[#2B5F75]/10">
                            <Gauge className="w-5 h-5 text-[#2B5F75]" />
                          </div>
                          <h3 className="text-lg font-semibold text-ink">Delivery Point Details</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-semibold text-ink mb-2">
                              Gas Day Date <span className="text-alert">*</span>
                            </label>
                            <div className="relative">
                              <input
                                type="date"
                                required
                                value={formData.gasDay}
                                onChange={(e) => setFormData({ ...formData, gasDay: e.target.value })}
                                className="w-full px-4 py-3 pl-10 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3E] focus:border-[#1B5E3E] bg-white"
                              />
                              <Calendar className="w-4 h-4 text-ink/40 absolute left-3 top-1/2 -translate-y-1/2" />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-ink mb-2">
                              Meter Status <span className="text-alert">*</span>
                            </label>
                            <select
                              required
                              value={formData.meterStatus}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  meterStatus: e.target.value as "operational" | "degraded" | "failed",
                                })
                              }
                              className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3E] focus:border-[#1B5E3E] bg-white"
                            >
                              <option value="operational">Operational</option>
                              <option value="degraded">Degraded</option>
                              <option value="failed">Failed</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-ink mb-2">
                              Corridor <span className="text-alert">*</span>
                            </label>
                            <select
                              required
                              value={formData.corridor}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  corridor: e.target.value as Corridor,
                                  offtakerId: "",
                                })
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
                              Offtaker / Customer <span className="text-alert">*</span>
                            </label>
                            <select
                              required
                              value={formData.offtakerId}
                              onChange={(e) => {
                                const offtaker = offtakers.find((o) => o.id === e.target.value);
                                setFormData({
                                  ...formData,
                                  offtakerId: e.target.value,
                                  deliveryPointId: offtaker?.deliveryPointId || "",
                                });
                              }}
                              className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3E] focus:border-[#1B5E3E] bg-white"
                              disabled={!formData.corridor}
                            >
                              <option value="">Select offtaker...</option>
                              {filteredOfftakers.map((offtaker) => (
                                <option key={offtaker.id} value={offtaker.id}>
                                  {offtaker.name} ({offtaker.sector})
                                </option>
                              ))}
                            </select>
                            {selectedOfftaker && (
                              <p className="text-xs text-ink/60 mt-1">
                                DCQ: {selectedOfftaker.contractualDemand || selectedOfftaker.firmAndEffective || 0} MMscf/d | Delivery Point: {selectedOfftaker.deliveryPointId}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-ink mb-2">
                              Delivery Point ID <span className="text-alert">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g., dp-egbin"
                              value={formData.deliveryPointId}
                              onChange={(e) => setFormData({ ...formData, deliveryPointId: e.target.value })}
                              className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3E] focus:border-[#1B5E3E] bg-white"
                              readOnly={!!selectedOfftaker}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-ink mb-2">
                              Operator Name <span className="text-alert">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="Name of person recording"
                              value={formData.operatorName}
                              onChange={(e) => setFormData({ ...formData, operatorName: e.target.value })}
                              className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3E] focus:border-[#1B5E3E] bg-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Volume Readings */}
                      <div className="bg-gray-50 border border-line rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-semibold text-ink mb-6">Volume Readings</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-semibold text-ink mb-2">
                              Received Volume (MMscf/d) <span className="text-alert">*</span>
                            </label>
                            <input
                              type="number"
                              required
                              step="0.01"
                              placeholder="0.00"
                              value={formData.receivedVolume}
                              onChange={(e) => setFormData({ ...formData, receivedVolume: e.target.value })}
                              className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3E] focus:border-[#1B5E3E] tabular-nums text-right bg-white"
                            />
                            <p className="text-xs text-ink/60 mt-1">Metered delivery to point</p>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-ink mb-2">
                              Offtaken Volume (MMscf/d) <span className="text-alert">*</span>
                            </label>
                            <input
                              type="number"
                              required
                              step="0.01"
                              placeholder="0.00"
                              value={formData.offtakenVolume}
                              onChange={(e) => setFormData({ ...formData, offtakenVolume: e.target.value })}
                              className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3E] focus:border-[#1B5E3E] tabular-nums text-right bg-white"
                            />
                            <p className="text-xs text-ink/60 mt-1">Actually consumed by customer</p>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-ink mb-2">
                              Receipt Variance (MMscf/d)
                            </label>
                            <div className="px-4 py-3 border-2 border-[#2B5F75]/20 rounded-lg bg-[#2B5F75]/5">
                              <span className="text-2xl font-bold text-[#2B5F75] tabular-nums">
                                {varianceReceipt}
                              </span>
                              <span className="text-sm text-ink/60 ml-2">MMscf/d</span>
                            </div>
                            <p className="text-xs text-ink/60 mt-1">Received - Offtaken</p>
                          </div>

                          {selectedOfftaker && (
                            <div>
                              <label className="block text-sm font-semibold text-ink mb-2">
                                Delivery vs DCQ
                              </label>
                              <div className="px-4 py-3 border-2 border-[#1B5E3E]/20 rounded-lg bg-[#1B5E3E]/5">
                                <span className="text-2xl font-bold text-[#1B5E3E] tabular-nums">
                                  {dcqPercent}%
                                </span>
                                <span className="text-sm text-ink/60 ml-2">of DCQ</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Meter & Conditions */}
                      <div className="bg-gray-50 border border-line rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-semibold text-ink mb-6">Meter & Operating Conditions</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <label className="block text-sm font-semibold text-ink mb-2">
                              Meter Reading <span className="text-alert">*</span>
                            </label>
                            <input
                              type="number"
                              required
                              step="0.01"
                              placeholder="0.00"
                              value={formData.meterReading}
                              onChange={(e) => setFormData({ ...formData, meterReading: e.target.value })}
                              className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3E] focus:border-[#1B5E3E] tabular-nums text-right bg-white"
                            />
                            <p className="text-xs text-ink/60 mt-1">Cumulative reading</p>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-ink mb-2">
                              Delivery Pressure (PSI) <span className="text-alert">*</span>
                            </label>
                            <input
                              type="number"
                              required
                              step="0.1"
                              placeholder="0.0"
                              value={formData.pressure}
                              onChange={(e) => setFormData({ ...formData, pressure: e.target.value })}
                              className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3E] focus:border-[#1B5E3E] tabular-nums text-right bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-ink mb-2">
                              Temperature (°C) <span className="text-alert">*</span>
                            </label>
                            <input
                              type="number"
                              required
                              step="0.1"
                              placeholder="0.0"
                              value={formData.temperature}
                              onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                              className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3E] focus:border-[#1B5E3E] tabular-nums text-right bg-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Additional Notes */}
                      <div className="bg-gray-50 border border-line rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-semibold text-ink mb-6">Additional Information</h3>

                        <div>
                          <label className="block text-sm font-semibold text-ink mb-2">
                            Notes / Meter Issues
                          </label>
                          <textarea
                            rows={4}
                            placeholder="Enter any meter issues, calibration notes, or delivery observations..."
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
                      <div className="mt-6 p-5 bg-gradient-to-r from-[#1B5E3E]/10 to-[#2B5F75]/10 border-l-4 border-[#1B5E3E] rounded-lg">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-[#1B5E3E] flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-ink mb-1">Custody Transfer Notice</p>
                            <p className="text-sm text-ink/70">
                              Delivery records at custody-transfer points are used for billing. All records require checker approval before being used in commercial calculations.
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
                  Recent Delivery Records
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
                      Station/Customer
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-ink uppercase tracking-wider">
                      Allocation (MMscf)
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-ink uppercase tracking-wider">
                      Offtake (MMscf)
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-ink uppercase tracking-wider">
                      Pressure (PSI)
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-ink uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {existingData.map((record, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-ink">
                        {record.Date || record.gasDay || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-ink">
                        {record.Station || record.offtakerId || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-ink text-right tabular-nums font-semibold">
                        {record["Allocation (MMscf)"] || record.receivedVolume || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-ink text-right tabular-nums font-semibold">
                        {record["Offtake (MMscf)"] || record.offtakenVolume || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-ink text-right tabular-nums font-semibold">
                        {record.Pressure || record.pressure || "—"}
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
                              Pending Approval
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
