"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Save, Send, Activity, Upload as UploadIcon } from "lucide-react";
import Link from "next/link";
import { assets } from "@/lib/data";
import type { Corridor } from "@/lib/types";
import FileUpload from "@/components/FileUpload";

export default function FlowsRecordPage() {
  const [activeTab, setActiveTab] = useState<"upload" | "manual">("upload");
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

  const handleUploadSuccess = (data: any[], overwriteDuplicates: boolean) => {
    console.log("Uploaded weekly volume & pressure records:", data);
    alert(`Successfully uploaded ${data.length} weekly volume & pressure records!`);
    const newData = data.map(d => ({ ...d, status: "pending" }));
    const updated = [...existingData, ...newData];
    setExistingData(updated);
    localStorage.setItem('flow-records', JSON.stringify(updated));
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
  };

  const utilizationPercent = selectedPipeline?.nameplate && formData.currentFlow
    ? ((parseFloat(formData.currentFlow) / selectedPipeline.nameplate) * 100).toFixed(1)
    : "—";

  const pressureDrop = formData.inletPressure && formData.outletPressure
    ? (parseFloat(formData.inletPressure) - parseFloat(formData.outletPressure)).toFixed(1)
    : "—";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-line px-8 py-4">
        <div className="flex items-center gap-4">
          <Link href="/records" className="text-ink/60 hover:text-ink">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-ink">Weekly Volume & Pressure Report</h2>
            <p className="text-sm text-ink/60 mt-1">
              {activeTab === "upload"
                ? "Upload weekly volume and pressure data from producers"
                : "Record current flow, pressure, and temperature in pipelines"}
            </p>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-4xl mx-auto">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-line mb-6">
          <div className="flex border-b border-line">
            <button
              onClick={() => setActiveTab("upload")}
              className={`flex-1 px-6 py-4 font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === "upload"
                  ? "text-primary border-b-2 border-primary bg-primary/5"
                  : "text-ink/60 hover:text-ink hover:bg-gray-50"
              }`}
            >
              <UploadIcon className="w-5 h-5" />
              Bulk Upload (Recommended)
            </button>
            <button
              onClick={() => setActiveTab("manual")}
              className={`flex-1 px-6 py-4 font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === "manual"
                  ? "text-primary border-b-2 border-primary bg-primary/5"
                  : "text-ink/60 hover:text-ink hover:bg-gray-50"
              }`}
            >
              <Activity className="w-5 h-5" />
              Manual Entry
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "upload" ? (
          <div className="kpi-card">
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
          <form onSubmit={(e) => handleSubmit(e, "submit")}>
          {/* Reading Information */}
          <div className="kpi-card mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-accent/10">
                <Activity className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-ink">Reading Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  Timestamp *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.timestamp}
                  onChange={(e) => setFormData({ ...formData, timestamp: e.target.value })}
                  className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-ink/60 mt-1">
                  Record hourly readings from SCADA
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  Data Source *
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
                  className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="scada">SCADA System</option>
                  <option value="metering-station">Metering Station</option>
                  <option value="manual">Manual Reading</option>
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
                    setFormData({
                      ...formData,
                      corridor: e.target.value as Corridor,
                      pipelineId: "",
                    })
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
                  Pipeline *
                </label>
                <select
                  required
                  value={formData.pipelineId}
                  onChange={(e) => setFormData({ ...formData, pipelineId: e.target.value })}
                  className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  Operator Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Name of person recording"
                  value={formData.operatorName}
                  onChange={(e) => setFormData({ ...formData, operatorName: e.target.value })}
                  className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Flow & Pressure Readings */}
          <div className="kpi-card mb-6">
            <h3 className="text-lg font-semibold text-ink mb-4">Flow & Pressure Readings</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  Current Flow (MMscf/d) *
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  placeholder="0.00"
                  value={formData.currentFlow}
                  onChange={(e) => setFormData({ ...formData, currentFlow: e.target.value })}
                  className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary tabular-nums"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  Pipeline Utilization
                </label>
                <div className="px-4 py-2 border border-line rounded-lg bg-gray-50 text-ink font-semibold tabular-nums">
                  {utilizationPercent}%
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  Inlet Pressure (PSI) *
                </label>
                <input
                  type="number"
                  required
                  step="0.1"
                  placeholder="0.0"
                  value={formData.inletPressure}
                  onChange={(e) => setFormData({ ...formData, inletPressure: e.target.value })}
                  className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary tabular-nums"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  Outlet Pressure (PSI) *
                </label>
                <input
                  type="number"
                  required
                  step="0.1"
                  placeholder="0.0"
                  value={formData.outletPressure}
                  onChange={(e) => setFormData({ ...formData, outletPressure: e.target.value })}
                  className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary tabular-nums"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  Pressure Drop (PSI)
                </label>
                <div className="px-4 py-2 border border-line rounded-lg bg-gray-50 text-ink font-semibold tabular-nums">
                  {pressureDrop} PSI
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  Temperature (°C) *
                </label>
                <input
                  type="number"
                  required
                  step="0.1"
                  placeholder="0.0"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                  className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary tabular-nums"
                />
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="kpi-card mb-6">
            <h3 className="text-lg font-semibold text-ink mb-4">Additional Information</h3>

            <div>
              <label className="block text-sm font-medium text-ink/70 mb-2">
                Notes / Observations
              </label>
              <textarea
                rows={4}
                placeholder="Enter any anomalies, observations, or notes about this reading..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <Link
              href="/records"
              className="px-6 py-2 border border-line rounded-lg text-ink hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>

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
              <strong className="text-primary">Recording Guidelines:</strong> Hourly flow
              readings should be recorded from SCADA systems. Manual readings require
              supervisor approval before publication.
            </p>
          </div>
        </form>
        )}

        {/* Recent Records Table */}
        {existingData.length > 0 && (
          <div className="kpi-card mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-ink">
                Recent Flow Records ({existingData.length})
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-line">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-ink uppercase tracking-wider">
                      Week/Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-ink uppercase tracking-wider">
                      Producer/Pipeline
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-ink uppercase tracking-wider">
                      Avg Volume (MMscf/d)
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-ink uppercase tracking-wider">
                      Pressure (barg)
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
                        {record.Week || record.timestamp || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-ink font-medium">
                        {record.Producer || record.pipelineId || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-ink text-right tabular-nums">
                        {record["Avg Volume (MMscf/d)"] || record.currentFlow || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-ink text-right tabular-nums">
                        {record["Pressure (barg)"] || record.inletPressure || "—"}
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
