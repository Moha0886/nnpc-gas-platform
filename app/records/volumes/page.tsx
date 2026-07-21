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
  Calendar,
  Plus,
  X
} from "lucide-react";
import Link from "next/link";
import FileUpload from "@/components/FileUpload";

export default function VolumeRecordPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<"upload" | "manual" | null>(null);
  const [existingData, setExistingData] = useState<any[]>([]);

  // Load existing data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('volume-records');
    if (saved) {
      setExistingData(JSON.parse(saved));
    } else {
      // Initialize with sample data
      const sampleData = [
        { Date: "2024-07-18", "Produced (MMscf/d)": "2850.5", "NGL Extracted (MMscf/d)": "320.3", "Fuel Gas (MMscf/d)": "85.5", "Delivered (MMscf/d)": "2420.5", status: "approved" },
        { Date: "2024-07-19", "Produced (MMscf/d)": "2780.2", "NGL Extracted (MMscf/d)": "315.8", "Fuel Gas (MMscf/d)": "82.3", "Delivered (MMscf/d)": "2360.1", status: "approved" },
        { Date: "2024-07-20", "Produced (MMscf/d)": "2920.8", "NGL Extracted (MMscf/d)": "325.5", "Fuel Gas (MMscf/d)": "88.2", "Delivered (MMscf/d)": "2485.3", status: "pending" },
      ];
      setExistingData(sampleData);
      localStorage.setItem('volume-records', JSON.stringify(sampleData));
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
    console.log("Uploaded volume records:", data);
    console.log("Overwrite duplicates:", overwriteDuplicates);

    // In production, send to API
    alert(`Successfully uploaded ${data.length} volume balance records!`);

    // Update existing data
    const newData = data.map(d => ({ ...d, status: "pending" }));
    const updated = [...existingData, ...newData];
    setExistingData(updated);
    localStorage.setItem('volume-records', JSON.stringify(updated));
    closeModal();
  };

  const [formData, setFormData] = useState({
    gasDay: new Date().toISOString().split("T")[0],
    produced: "",
    nglExtracted: "",
    receivedIntoTransmission: "",
    fuelGas: "",
    linePackChange: "",
    delivered: "",
    ufg: "",
    remarks: "",
  });

  const [status, setStatus] = useState<"draft" | "submitting" | "submitted">("draft");

  const handleSubmit = async (e: React.FormEvent, saveType: "draft" | "submit") => {
    e.preventDefault();
    setStatus("submitting");

    // Calculate UFG percentage
    const receivedVal = parseFloat(formData.receivedIntoTransmission) || 0;
    const ufgVal = parseFloat(formData.ufg) || 0;
    const ufgPercent = receivedVal > 0 ? (ufgVal / receivedVal) * 100 : 0;

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Volume Balance Record:", {
      ...formData,
      produced: parseFloat(formData.produced),
      nglExtracted: parseFloat(formData.nglExtracted),
      receivedIntoTransmission: parseFloat(formData.receivedIntoTransmission),
      fuelGas: parseFloat(formData.fuelGas),
      linePackChange: parseFloat(formData.linePackChange),
      delivered: parseFloat(formData.delivered),
      ufg: parseFloat(formData.ufg),
      ufgPercent,
      saveType,
    });

    setStatus("submitted");
    alert(saveType === "draft" ? "Saved as draft" : "Submitted for approval");

    if (saveType === "submit") {
      closeModal();
    }
  };

  // Calculate derived values
  const produced = parseFloat(formData.produced) || 0;
  const nglExtracted = parseFloat(formData.nglExtracted) || 0;
  const calculatedTransmission = produced - nglExtracted;

  const receivedIntoTransmission = parseFloat(formData.receivedIntoTransmission) || 0;
  const fuelGas = parseFloat(formData.fuelGas) || 0;
  const linePackChange = parseFloat(formData.linePackChange) || 0;
  const delivered = parseFloat(formData.delivered) || 0;
  const calculatedUFG = receivedIntoTransmission - fuelGas - linePackChange - delivered;
  const ufgPercent = receivedIntoTransmission > 0 ? (calculatedUFG / receivedIntoTransmission) * 100 : 0;

  // Calculate stats
  const approvedCount = existingData.filter(d => d.status === "approved").length;
  const pendingCount = existingData.filter(d => d.status === "pending").length;
  const totalProduced = existingData.reduce((sum, d) => sum + parseFloat(d["Produced (MMscf/d)"] || d.produced || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-line px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Link href="/volumes" className="text-ink/60 hover:text-ink">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h2 className="text-2xl font-bold text-ink">Volume Balance Record</h2>
              <p className="text-sm text-ink/60 mt-1">
                Record daily gas balance across the value chain
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
              <p className="text-sm text-ink/60">Total Produced</p>
            </div>
            <p className="text-3xl font-bold text-primary tabular-nums">{totalProduced.toFixed(1)}</p>
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
                      {selectedMethod === null ? "Create Volume Balance Record" : selectedMethod === "upload" ? "Bulk Upload" : "Manual Entry"}
                    </h2>
                    <p className="text-sm text-ink/60">
                      {selectedMethod === null ? "Choose how you'd like to add records" : "Enter volume balance data for approval"}
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
                            <span>Upload CSV files with volume data</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm text-ink/70">
                            <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                            <span>Up to 31 days of data at once</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm text-ink/70">
                            <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                            <span>Auto-validation & duplicate detection</span>
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
                            <span>Real-time calculations</span>
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
                      templateType="volumes"
                      existingData={existingData}
                      identifierFields={["Date"]}
                      requiredFields={["Date", "Produced (MMscf/d)", "NGL Extracted (MMscf/d)", "Fuel Gas (MMscf/d)", "Delivered (MMscf/d)"]}
                      onUploadSuccess={handleUploadSuccess}
                    />

                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-ink/70">
                        <strong className="text-gasblue">Tip:</strong> You can upload up to 31 days of data at once.
                        The system will automatically validate all records and detect any duplicates.
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
                      {/* Gas Day */}
                      <div className="bg-gray-50 border border-line rounded-lg p-6 mb-6">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-2 rounded-lg bg-[#2B5F75]/10">
                            <Calendar className="w-5 h-5 text-[#2B5F75]" />
                          </div>
                          <h3 className="text-lg font-semibold text-ink">Gas Day</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-ink mb-2">
                              Date <span className="text-alert">*</span>
                            </label>
                            <input
                              type="date"
                              value={formData.gasDay}
                              onChange={(e) => setFormData({ ...formData, gasDay: e.target.value })}
                              className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3E] focus:border-[#1B5E3E] bg-white"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Production & Processing */}
                      <div className="bg-gray-50 border border-line rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-semibold text-ink mb-6">Production & Processing</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-semibold text-ink mb-2">
                              Gas Produced (MMscf/d) <span className="text-alert">*</span>
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              value={formData.produced}
                              onChange={(e) => setFormData({ ...formData, produced: e.target.value })}
                              className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3E] focus:border-[#1B5E3E] tabular-nums text-right bg-white"
                              placeholder="2850.5"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-ink mb-2">
                              NGL Extracted (MMscf/d) <span className="text-alert">*</span>
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              value={formData.nglExtracted}
                              onChange={(e) => setFormData({ ...formData, nglExtracted: e.target.value })}
                              className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3E] focus:border-[#1B5E3E] tabular-nums text-right bg-white"
                              placeholder="320.3"
                              required
                            />
                          </div>

                          <div className="md:col-span-2">
                            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                              <p className="text-sm text-ink/70">
                                <span className="font-semibold text-primary">Calculated Into Transmission:</span>{" "}
                                <span className="tabular-nums font-bold text-accent text-xl">
                                  {calculatedTransmission.toFixed(1)} MMscf/d
                                </span>
                                <span className="text-xs ml-2">(Produced - NGL Extracted)</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Transmission */}
                      <div className="bg-gray-50 border border-line rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-semibold text-ink mb-6">Transmission</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-semibold text-ink mb-2">
                              Received Into Transmission (MMscf/d) <span className="text-alert">*</span>
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              value={formData.receivedIntoTransmission}
                              onChange={(e) =>
                                setFormData({ ...formData, receivedIntoTransmission: e.target.value })
                              }
                              className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3E] focus:border-[#1B5E3E] tabular-nums text-right bg-white"
                              placeholder="2530.2"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-ink mb-2">
                              Fuel Gas (MMscf/d) <span className="text-alert">*</span>
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              value={formData.fuelGas}
                              onChange={(e) => setFormData({ ...formData, fuelGas: e.target.value })}
                              className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3E] focus:border-[#1B5E3E] tabular-nums text-right bg-white"
                              placeholder="85.5"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-ink mb-2">
                              Line Pack Change (MMscf/d)
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              value={formData.linePackChange}
                              onChange={(e) => setFormData({ ...formData, linePackChange: e.target.value })}
                              className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3E] focus:border-[#1B5E3E] tabular-nums text-right bg-white"
                              placeholder="12.3"
                            />
                            <p className="text-xs text-ink/60 mt-1">Positive = increase, Negative = decrease</p>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-ink mb-2">
                              Delivered (MMscf/d) <span className="text-alert">*</span>
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              value={formData.delivered}
                              onChange={(e) => setFormData({ ...formData, delivered: e.target.value })}
                              className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3E] focus:border-[#1B5E3E] tabular-nums text-right bg-white"
                              placeholder="2420.5"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* UFG Calculation */}
                      <div className="bg-gray-50 border border-line rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-semibold text-ink mb-6">Unaccounted For Gas (UFG)</h3>
                        <div className="p-5 bg-alert/5 border border-alert/20 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-ink">Calculated UFG:</span>
                            <span className="text-2xl font-bold text-alert tabular-nums">
                              {calculatedUFG.toFixed(1)} MMscf/d
                            </span>
                          </div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-ink">UFG Percentage:</span>
                            <span
                              className={`text-xl font-bold tabular-nums ${
                                ufgPercent > 0.5 ? "text-alert" : "text-primary"
                              }`}
                            >
                              {ufgPercent.toFixed(2)}%
                            </span>
                          </div>
                          <p className="text-xs text-ink/60 mt-2">
                            UFG = Received Into Transmission − Fuel Gas − Line Pack Δ − Delivered
                          </p>
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-semibold text-ink mb-2">
                            Actual UFG (if different from calculated)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            value={formData.ufg}
                            onChange={(e) => setFormData({ ...formData, ufg: e.target.value })}
                            className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3E] focus:border-[#1B5E3E] tabular-nums text-right bg-white"
                            placeholder={calculatedUFG.toFixed(1)}
                          />
                          <p className="text-xs text-ink/60 mt-1">
                            Leave blank to use calculated value
                          </p>
                        </div>
                      </div>

                      {/* Remarks */}
                      <div className="bg-gray-50 border border-line rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-semibold text-ink mb-6">Additional Information</h3>
                        <div>
                          <label className="block text-sm font-semibold text-ink mb-2">Remarks</label>
                          <textarea
                            value={formData.remarks}
                            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E3E] focus:border-[#1B5E3E] bg-white"
                            placeholder="Additional notes about this gas day (e.g., operational events, plant shutdowns, etc.)"
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
                            <p className="text-sm font-semibold text-ink mb-1">Maker-Checker Approval Workflow</p>
                            <p className="text-sm text-ink/70">
                              This record will be submitted for review by a checker. Once approved, it will appear in operational dashboards and reports. You will receive a notification when the review is complete.
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
                  Recent Volume Records
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
                    <th className="px-6 py-4 text-right text-xs font-bold text-ink uppercase tracking-wider">
                      Produced (MMscf/d)
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-ink uppercase tracking-wider">
                      NGL Extracted
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-ink uppercase tracking-wider">
                      Fuel Gas
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-ink uppercase tracking-wider">
                      Delivered
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
                      <td className="px-6 py-4 text-sm text-ink text-right tabular-nums font-semibold">
                        {record["Produced (MMscf/d)"] || record.produced || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-ink text-right tabular-nums font-semibold">
                        {record["NGL Extracted (MMscf/d)"] || record.nglExtracted || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-ink text-right tabular-nums font-semibold">
                        {record["Fuel Gas (MMscf/d)"] || record.fuelGas || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-ink text-right tabular-nums font-semibold">
                        {record["Delivered (MMscf/d)"] || record.delivered || "—"}
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
