"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Save, Send, FileText, Upload as UploadIcon, Download, Plus, X, CheckCircle } from "lucide-react";
import Link from "next/link";
import { offtakers } from "@/lib/data";
import type { Corridor } from "@/lib/types";
import FileUpload from "@/components/FileUpload";

export default function NominationsRecordPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<"upload" | "manual" | null>(null);
  const [existingData, setExistingData] = useState<any[]>([]);

  // Load existing data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('nomination-records');
    if (saved) {
      setExistingData(JSON.parse(saved));
    } else {
      // Initialize with sample data
      const sampleData = [
        { Date: "2024-07-19", Offtaker: "Dangote Cement", "Allocation (MMscf)": "25.5", status: "approved" },
        { Date: "2024-07-19", Offtaker: "Lafarge Africa", "Allocation (MMscf)": "18.3", status: "approved" },
        { Date: "2024-07-20", Offtaker: "Dangote Cement", "Allocation (MMscf)": "26.0", status: "pending" },
        { Date: "2024-07-20", Offtaker: "Lafarge Africa", "Allocation (MMscf)": "19.0", status: "pending" },
      ];
      setExistingData(sampleData);
      localStorage.setItem('nomination-records', JSON.stringify(sampleData));
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
    console.log("Uploaded nomination/allocation records:", data);
    alert(`Successfully uploaded ${data.length} allocation records!`);
    const newData = data.map(d => ({ ...d, status: "pending" }));
    const updated = [...existingData, ...newData];
    setExistingData(updated);
    localStorage.setItem('nomination-records', JSON.stringify(updated));
    closeModal();
  };

  const [formData, setFormData] = useState({
    gasDay: new Date().toISOString().split("T")[0],
    offtakerId: "",
    corridor: "" as Corridor | "",
    nominated: "",
    allocated: "",
    forecastSupply: "",
    priorityLevel: "normal" as "high" | "normal" | "low",
    requestedBy: "",
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

    console.log("Nomination Record:", {
      ...formData,
      nominated: parseFloat(formData.nominated),
      allocated: parseFloat(formData.allocated),
      forecastSupply: parseFloat(formData.forecastSupply),
      offtakerName: selectedOfftaker?.name,
      dcq: selectedOfftaker?.contractualDemand || selectedOfftaker?.firmAndEffective,
      saveType,
    });

    setStatus("submitted");
    alert(saveType === "draft" ? "Saved as draft" : "Submitted for approval");

    if (saveType === "submit") {
      closeModal();
    }
  };

  const allocationPercent = selectedOfftaker?.contractualDemand || selectedOfftaker?.firmAndEffective && formData.allocated
    ? ((parseFloat(formData.allocated) / (selectedOfftaker.contractualDemand || selectedOfftaker.firmAndEffective || 1)) * 100).toFixed(1)
    : "—";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-line px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/records" className="text-ink/60 hover:text-ink">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h2 className="text-2xl font-bold text-ink">Customer Nomination Record</h2>
              <p className="text-sm text-ink/60 mt-1">
                Record customer gas demand and allocation requests
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
                      {selectedMethod === null ? "Create Nomination Record" : selectedMethod === "upload" ? "Bulk Upload" : "Manual Entry"}
                    </h2>
                    <p className="text-sm text-ink/60">
                      {selectedMethod === null ? "Choose how you'd like to add records" : "Enter nomination and allocation data"}
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
                            <span>Daily allocation report format</span>
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
                          <FileText className="w-8 h-8 text-[#2B5F75] group-hover:text-white transition-colors" />
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

                    <h3 className="text-lg font-semibold text-ink mb-4">Upload Nomination & Allocation Data</h3>
                    <p className="text-sm text-ink/60 mb-6">
                      Upload customer nomination and allocation records in bulk. This matches the format of your daily allocation reports.
                    </p>

                    <FileUpload
                      templateType="nominations"
                      existingData={existingData}
                      identifierFields={["Date", "Offtaker"]}
                      requiredFields={["Date", "Offtaker", "Allocation (MMscf)"]}
                      onUploadSuccess={handleUploadSuccess}
                    />

                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-ink/70">
                        <strong className="text-gasblue">Tip:</strong> Upload daily nomination and allocation data for all offtakers at once.
                        The template is designed to match your existing workflow.
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
                      {/* Gas Day & Offtaker Selection */}
                      <div className="kpi-card mb-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <h3 className="text-lg font-semibold text-ink">Nomination Details</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-ink/70 mb-2">
                              Gas Day Date *
                            </label>
                            <input
                              type="date"
                              required
                              value={formData.gasDay}
                              onChange={(e) => setFormData({ ...formData, gasDay: e.target.value })}
                              className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <p className="text-xs text-ink/60 mt-1">
                              Nominations must be submitted by D-1 18:00 WAT
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-ink/70 mb-2">
                              Priority Level *
                            </label>
                            <select
                              required
                              value={formData.priorityLevel}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  priorityLevel: e.target.value as "high" | "normal" | "low",
                                })
                              }
                              className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                              <option value="high">High - Critical Load</option>
                              <option value="normal">Normal - Standard Supply</option>
                              <option value="low">Low - Interruptible</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-ink/70 mb-2">
                              Corridor *
                            </label>
                            <select
                              required
                              value={formData.corridor}
                              onChange={(e) =>
                                setFormData({ ...formData, corridor: e.target.value as Corridor, offtakerId: "" })
                              }
                              className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
                            <label className="block text-sm font-medium text-ink/70 mb-2">
                              Offtaker / Customer *
                            </label>
                            <select
                              required
                              value={formData.offtakerId}
                              onChange={(e) => setFormData({ ...formData, offtakerId: e.target.value })}
                              className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
                                DCQ: {selectedOfftaker.contractualDemand || selectedOfftaker.firmAndEffective || 0} MMscf/d
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-ink/70 mb-2">
                              Requested By *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="Name of requestor"
                              value={formData.requestedBy}
                              onChange={(e) => setFormData({ ...formData, requestedBy: e.target.value })}
                              className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Nomination Volumes */}
                      <div className="kpi-card mb-6">
                        <h3 className="text-lg font-semibold text-ink mb-4">Nomination Cycle</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-ink/70 mb-2">
                              Nominated Volume (MMscf/d) *
                            </label>
                            <input
                              type="number"
                              required
                              step="0.01"
                              placeholder="0.00"
                              value={formData.nominated}
                              onChange={(e) => setFormData({ ...formData, nominated: e.target.value })}
                              className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary tabular-nums"
                            />
                            <p className="text-xs text-ink/60 mt-1">Customer request</p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-ink/70 mb-2">
                              Allocated Volume (MMscf/d) *
                            </label>
                            <input
                              type="number"
                              required
                              step="0.01"
                              placeholder="0.00"
                              value={formData.allocated}
                              onChange={(e) => setFormData({ ...formData, allocated: e.target.value })}
                              className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary tabular-nums"
                            />
                            <p className="text-xs text-ink/60 mt-1">NGML allocation</p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-ink/70 mb-2">
                              Forecast Supply (MMscf/d) *
                            </label>
                            <input
                              type="number"
                              required
                              step="0.01"
                              placeholder="0.00"
                              value={formData.forecastSupply}
                              onChange={(e) => setFormData({ ...formData, forecastSupply: e.target.value })}
                              className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary tabular-nums"
                            />
                            <p className="text-xs text-ink/60 mt-1">Projected delivery</p>
                          </div>

                          {selectedOfftaker && (
                            <div className="col-span-3">
                              <label className="block text-sm font-medium text-ink/70 mb-2">
                                Allocation vs DCQ
                              </label>
                              <div className="px-4 py-2 border border-line rounded-lg bg-gray-50">
                                <span className="text-ink font-semibold tabular-nums">
                                  {allocationPercent}% of DCQ
                                </span>
                                <span className="text-ink/60 text-sm ml-2">
                                  ({formData.allocated || "0"} / {selectedOfftaker.contractualDemand || selectedOfftaker.firmAndEffective || 0} MMscf/d)
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Additional Notes */}
                      <div className="kpi-card mb-6">
                        <h3 className="text-lg font-semibold text-ink mb-4">Additional Information</h3>

                        <div>
                          <label className="block text-sm font-medium text-ink/70 mb-2">
                            Notes / Special Conditions
                          </label>
                          <textarea
                            rows={4}
                            placeholder="Enter any special conditions, constraints, or notes about this nomination..."
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                          />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={closeModal}
                          className="px-6 py-2 border border-line rounded-lg text-ink hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>

                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={(e) => handleSubmit(e as any, "draft")}
                            disabled={status === "submitting"}
                            className="px-6 py-2 border border-line rounded-lg text-ink hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                          >
                            <Save className="w-4 h-4" />
                            Save as Draft
                          </button>

                          <button
                            type="submit"
                            disabled={status === "submitting"}
                            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                          >
                            <Send className="w-4 h-4" />
                            {status === "submitting" ? "Submitting..." : "Submit for Approval"}
                          </button>
                        </div>
                      </div>

                      {/* Workflow Notice */}
                      <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                        <p className="text-sm text-ink/70">
                          <strong className="text-primary">Nomination Workflow:</strong> Customer
                          nominations must be submitted by D-1 18:00 WAT. This record will be reviewed
                          by the nominations desk before allocation is confirmed.
                        </p>
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
          <div className="kpi-card mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-ink">
                Recent Nomination Records ({existingData.length})
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-line">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-ink uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-ink uppercase tracking-wider">
                      Offtaker
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-ink uppercase tracking-wider">
                      Allocation (MMscf)
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-ink uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {existingData.map((record, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-ink">
                        {record.Date || record.gasDay || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-ink font-medium">
                        {record.Offtaker || record.offtakerId || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-ink text-right tabular-nums">
                        {record["Allocation (MMscf)"] || record.allocated || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                          record.status === "approved"
                            ? "bg-success/10 text-success"
                            : "bg-primary/10 text-primary"
                        }`}>
                          {record.status === "approved" ? "Approved" : "Pending Approval"}
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
