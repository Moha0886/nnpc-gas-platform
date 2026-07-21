"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Save,
  Send,
  Activity,
  Upload as UploadIcon,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Plus,
  X
} from "lucide-react";
import Link from "next/link";
import { assets } from "@/lib/data";
import type { Corridor } from "@/lib/types";
import FileUpload from "@/components/FileUpload";

export default function FlowsRecordPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<"upload" | "manual" | null>(null);
  const [existingData, setExistingData] = useState<any[]>([]);

  // Load existing data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('flow-records');
    if (saved) {
      setExistingData(JSON.parse(saved));
    } else {
      // Initialize with sample data
      const sampleData = [
        { Week: "Week 29 (Jul 15-21)", Producer: "Escravos-Lagos Pipeline", "Avg Volume (MMscf/d)": "750.5", "Pressure (barg)": "65.3", status: "approved" },
        { Week: "Week 29 (Jul 15-21)", Producer: "OB3 Pipeline", "Avg Volume (MMscf/d)": "450.2", "Pressure (barg)": "58.7", status: "approved" },
        { Week: "Week 30 (Jul 22-28)", Producer: "Escravos-Lagos Pipeline", "Avg Volume (MMscf/d)": "720.8", "Pressure (barg)": "64.1", status: "pending" },
        { Week: "Week 30 (Jul 22-28)", Producer: "OB3 Pipeline", "Avg Volume (MMscf/d)": "425.5", "Pressure (barg)": "57.2", status: "pending" },
      ];
      setExistingData(sampleData);
      localStorage.setItem('flow-records', JSON.stringify(sampleData));
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
    console.log("Uploaded weekly volume & pressure records:", data);
    alert(`Successfully uploaded ${data.length} weekly volume & pressure records!`);
    const newData = data.map(d => ({ ...d, status: "pending" }));
    const updated = [...existingData, ...newData];
    setExistingData(updated);
    localStorage.setItem('flow-records', JSON.stringify(updated));
    closeModal();
  };

  const [formData, setFormData] = useState({
    timestamp: new Date().toISOString().slice(0, 16),
    pipelineId: "",
    corridor: "" as Corridor | "",
    currentFlow: "",
    inletPressure: "",
    outletPressure: "",
    temperature: "",
    source: "scada" as "scada" | "manual" | "metering-station",
    operatorName: "",
    notes: "",
  });

  const [status, setStatus] = useState<"draft" | "submitting" | "submitted">("draft");

  const corridors: Corridor[] = ["Eastern", "Western", "Northern", "Lagos"];

  const pipelines = assets.filter((a) => a.cls === "Pipeline");
  const filteredPipelines = formData.corridor
    ? pipelines.filter((p) => p.corridor === formData.corridor)
    : pipelines;

  const selectedPipeline = pipelines.find((p) => p.id === formData.pipelineId);

  const handleSubmit = async (e: React.FormEvent, saveType: "draft" | "submit") => {
    e.preventDefault();
    setStatus("submitting");

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const pressureDrop = formData.inletPressure && formData.outletPressure
      ? parseFloat(formData.inletPressure) - parseFloat(formData.outletPressure)
      : 0;

    console.log("Flow Record:", {
      ...formData,
      currentFlow: parseFloat(formData.currentFlow),
      inletPressure: parseFloat(formData.inletPressure),
      outletPressure: parseFloat(formData.outletPressure),
      temperature: parseFloat(formData.temperature),
      pressureDrop,
      pipelineName: selectedPipeline?.name,
      saveType,
    });

    setStatus("submitted");
    alert(saveType === "draft" ? "Saved as draft" : "Submitted for approval");

    if (saveType === "submit") {
      closeModal();
    }
  };

  const utilizationPercent = selectedPipeline?.nameplate && formData.currentFlow
    ? ((parseFloat(formData.currentFlow) / selectedPipeline.nameplate) * 100).toFixed(1)
    : "—";

  const pressureDrop = formData.inletPressure && formData.outletPressure
    ? (parseFloat(formData.inletPressure) - parseFloat(formData.outletPressure)).toFixed(1)
    : "—";

  // Calculate stats
  const approvedCount = existingData.filter(d => d.status === "approved").length;
  const pendingCount = existingData.filter(d => d.status === "pending").length;
  const totalVolume = existingData.reduce((sum, d) => sum + parseFloat(d["Avg Volume (MMscf/d)"] || d.currentFlow || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-line px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Link href="/records" className="text-ink/60 hover:text-ink">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h2 className="text-2xl font-bold text-ink">Weekly Volume & Pressure Report</h2>
              <p className="text-sm text-ink/60 mt-1">
                Record weekly volume and pressure data from producers and pipeline flows
              </p>
            </div>
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
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm text-ink/60">Total Volume</p>
            </div>
            <p className="text-3xl font-bold text-primary tabular-nums">{totalVolume.toFixed(1)}</p>
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
                      {selectedMethod === null ? "Create Flow Record" : selectedMethod === "upload" ? "Bulk Upload" : "Manual Entry"}
                    </h2>
                    <p className="text-sm text-ink/60">
                      {selectedMethod === null ? "Choose how you'd like to add records" : "Enter flow and pressure data for approval"}
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
                            <span>Weekly MOR format supported</span>
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
                          <Activity className="w-8 h-8 text-[#2B5F75] group-hover:text-white transition-colors" />
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

                    <h3 className="text-lg font-semibold text-ink mb-4">Upload Weekly Volume & Pressure Data</h3>
                    <p className="text-sm text-ink/60 mb-6">
                      Upload weekly volume and pressure data from all producers. This matches the format of "Weekly MOR Volume & Pressure" Excel file.
                    </p>

                    <FileUpload
                      templateType="flows"
                      existingData={existingData}
                      identifierFields={["Week", "Producer"]}
                      requiredFields={["Week", "Producer", "Avg Volume (MMscf/d)", "Pressure (barg)"]}
                      onUploadSuccess={handleUploadSuccess}
                    />

                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-ink/70">
                        <strong className="text-gasblue">Tip:</strong> Upload weekly volume and pressure data for all gas producers at once.
                        The template matches your existing Weekly MOR Excel report format.
                      </p>
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
                      {/* Reading Information */}
                      <div className="bg-gray-50 border border-line rounded-lg p-6 mb-6">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-2 rounded-lg bg-[#2B5F75]/10">
                            <Activity className="w-5 h-5 text-[#2B5F75]" />
                          </div>
                          <h3 className="text-lg font-semibold text-ink">Reading Details</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-semibold text-ink mb-2">
                              Timestamp <span className="text-alert">*</span>
                            </label>
                            <input
                              type="datetime-local"
                              required
                              value={formData.timestamp}
                              onChange={(e) => setFormData({ ...formData, timestamp: e.target.value })}
                              className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3E] focus:border-[#1B5E3E] bg-white"
                            />
                            <p className="text-xs text-ink/60 mt-1">
                              Record hourly readings from SCADA
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-ink mb-2">
                              Data Source <span className="text-alert">*</span>
                            </label>
                            <select
                              required
                              value={formData.source}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  source: e.target.value as "scada" | "manual" | "metering-station",
                                })
                              }
                              className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3E] focus:border-[#1B5E3E] bg-white"
                            >
                              <option value="scada">SCADA System</option>
                              <option value="metering-station">Metering Station</option>
                              <option value="manual">Manual Reading</option>
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
                                  pipelineId: "",
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
                              Pipeline <span className="text-alert">*</span>
                            </label>
                            <select
                              required
                              value={formData.pipelineId}
                              onChange={(e) => setFormData({ ...formData, pipelineId: e.target.value })}
                              className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3E] focus:border-[#1B5E3E] bg-white"
                              disabled={!formData.corridor}
                            >
                              <option value="">Select pipeline...</option>
                              {filteredPipelines.map((pipeline) => (
                                <option key={pipeline.id} value={pipeline.id}>
                                  {pipeline.name}
                                </option>
                              ))}
                            </select>
                            {selectedPipeline && (
                              <p className="text-xs text-ink/60 mt-1">
                                Nameplate: {selectedPipeline.nameplate} MMscf/d | {selectedPipeline.diameterIn}"
                              </p>
                            )}
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

                      {/* Flow & Pressure Readings */}
                      <div className="bg-gray-50 border border-line rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-semibold text-ink mb-6">Flow & Pressure Readings</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-semibold text-ink mb-2">
                              Current Flow (MMscf/d) <span className="text-alert">*</span>
                            </label>
                            <input
                              type="number"
                              required
                              step="0.01"
                              placeholder="0.00"
                              value={formData.currentFlow}
                              onChange={(e) => setFormData({ ...formData, currentFlow: e.target.value })}
                              className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3E] focus:border-[#1B5E3E] tabular-nums text-right bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-ink mb-2">
                              Pipeline Utilization
                            </label>
                            <div className="px-4 py-3 border-2 border-[#1B5E3E]/20 rounded-lg bg-[#1B5E3E]/5">
                              <span className="text-2xl font-bold text-[#1B5E3E] tabular-nums">
                                {utilizationPercent}%
                              </span>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-ink mb-2">
                              Inlet Pressure (PSI) <span className="text-alert">*</span>
                            </label>
                            <input
                              type="number"
                              required
                              step="0.1"
                              placeholder="0.0"
                              value={formData.inletPressure}
                              onChange={(e) => setFormData({ ...formData, inletPressure: e.target.value })}
                              className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3E] focus:border-[#1B5E3E] tabular-nums text-right bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-ink mb-2">
                              Outlet Pressure (PSI) <span className="text-alert">*</span>
                            </label>
                            <input
                              type="number"
                              required
                              step="0.1"
                              placeholder="0.0"
                              value={formData.outletPressure}
                              onChange={(e) => setFormData({ ...formData, outletPressure: e.target.value })}
                              className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3E] focus:border-[#1B5E3E] tabular-nums text-right bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-ink mb-2">
                              Pressure Drop (PSI)
                            </label>
                            <div className="px-4 py-3 border border-line rounded-lg bg-gray-50 text-ink font-semibold tabular-nums">
                              {pressureDrop} PSI
                            </div>
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
                        <h3 className="text-lg font-semibold text-ink mb-4">Additional Information</h3>

                        <div>
                          <label className="block text-sm font-semibold text-ink mb-2">
                            Notes / Observations
                          </label>
                          <textarea
                            rows={4}
                            placeholder="Enter any anomalies, observations, or notes about this reading..."
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
                            <p className="text-sm font-semibold text-ink mb-1">Recording Guidelines</p>
                            <p className="text-sm text-ink/70">
                              Hourly flow readings should be recorded from SCADA systems. Manual readings require supervisor approval before publication.
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

        {/* Recent Records Table */}
        {existingData.length > 0 && (
          <div className="bg-white border border-line rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-line bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-ink">
                  Recent Flow Records
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
                      Week/Time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-ink uppercase tracking-wider">
                      Producer/Pipeline
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-ink uppercase tracking-wider">
                      Avg Volume (MMscf/d)
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-ink uppercase tracking-wider">
                      Pressure (barg)
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
                        {record.Week || record.timestamp || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-ink">
                        {record.Producer || record.pipelineId || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-ink text-right tabular-nums font-semibold">
                        {record["Avg Volume (MMscf/d)"] || record.currentFlow || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-ink text-right tabular-nums font-semibold">
                        {record["Pressure (barg)"] || record.inletPressure || "—"}
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
