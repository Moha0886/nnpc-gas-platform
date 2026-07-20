"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Save, Send, Activity, Upload as UploadIcon } from "lucide-react";
import Link from "next/link";
import FileUpload from "@/components/FileUpload";

export default function VolumeRecordPage() {
  const [activeTab, setActiveTab] = useState<"upload" | "manual">("upload");
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
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-line px-8 py-4">
        <div className="flex items-center gap-4">
          <Link href="/volumes" className="text-ink/60 hover:text-ink">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-ink">Volume Balance Record</h2>
            <p className="text-sm text-ink/60 mt-1">
              {activeTab === "upload"
                ? "Upload bulk volume data from CSV file"
                : "Record daily gas balance across the value chain"}
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
            <h3 className="text-lg font-semibold text-ink mb-4">Upload Volume Balance Data</h3>
            <p className="text-sm text-ink/60 mb-6">
              Upload daily or monthly volume balance records in bulk using a CSV file.
              Download the template, fill it with your data, and upload it here.
            </p>

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
          <form onSubmit={(e) => e.preventDefault()}>
          {/* Gas Day */}
          <div className="kpi-card mb-6">
            <h3 className="text-lg font-semibold text-ink mb-4">Gas Day</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  Date <span className="text-alert">*</span>
                </label>
                <input
                  type="date"
                  value={formData.gasDay}
                  onChange={(e) => setFormData({ ...formData, gasDay: e.target.value })}
                  className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>
          </div>

          {/* Production & Processing */}
          <div className="kpi-card mb-6">
            <h3 className="text-lg font-semibold text-ink mb-4">Production & Processing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  Gas Produced (MMscf/d) <span className="text-alert">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.produced}
                  onChange={(e) => setFormData({ ...formData, produced: e.target.value })}
                  className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="2850.5"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  NGL Extracted (MMscf/d) <span className="text-alert">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.nglExtracted}
                  onChange={(e) => setFormData({ ...formData, nglExtracted: e.target.value })}
                  className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="320.3"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm text-ink/70">
                    <span className="font-semibold text-primary">Calculated Into Transmission:</span>{" "}
                    <span className="tabular-nums font-bold text-accent">
                      {calculatedTransmission.toFixed(1)} MMscf/d
                    </span>
                    <span className="text-xs ml-2">(Produced - NGL Extracted)</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Transmission */}
          <div className="kpi-card mb-6">
            <h3 className="text-lg font-semibold text-ink mb-4">Transmission</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  Received Into Transmission (MMscf/d) <span className="text-alert">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.receivedIntoTransmission}
                  onChange={(e) =>
                    setFormData({ ...formData, receivedIntoTransmission: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="2530.2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  Fuel Gas (MMscf/d) <span className="text-alert">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.fuelGas}
                  onChange={(e) => setFormData({ ...formData, fuelGas: e.target.value })}
                  className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="85.5"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  Line Pack Change (MMscf/d)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.linePackChange}
                  onChange={(e) => setFormData({ ...formData, linePackChange: e.target.value })}
                  className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="12.3"
                />
                <p className="text-xs text-ink/60 mt-1">Positive = increase, Negative = decrease</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  Delivered (MMscf/d) <span className="text-alert">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.delivered}
                  onChange={(e) => setFormData({ ...formData, delivered: e.target.value })}
                  className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="2420.5"
                  required
                />
              </div>
            </div>
          </div>

          {/* UFG Calculation */}
          <div className="kpi-card mb-6">
            <h3 className="text-lg font-semibold text-ink mb-4">Unaccounted For Gas (UFG)</h3>
            <div className="p-4 bg-alert/5 border border-alert/20 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-ink">Calculated UFG:</span>
                <span className="text-2xl font-bold text-alert tabular-nums">
                  {calculatedUFG.toFixed(1)} MMscf/d
                </span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-ink">UFG Percentage:</span>
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
              <label className="block text-sm font-medium text-ink/70 mb-2">
                Actual UFG (if different from calculated)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.ufg}
                onChange={(e) => setFormData({ ...formData, ufg: e.target.value })}
                className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={calculatedUFG.toFixed(1)}
              />
              <p className="text-xs text-ink/60 mt-1">
                Leave blank to use calculated value
              </p>
            </div>
          </div>

          {/* Remarks */}
          <div className="kpi-card mb-6">
            <h3 className="text-lg font-semibold text-ink mb-4">Additional Information</h3>
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-2">Remarks</label>
              <textarea
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Additional notes about this gas day (e.g., operational events, plant shutdowns, etc.)"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3">
            <Link
              href="/volumes"
              className="px-6 py-2 border border-line rounded-lg text-ink hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="button"
              onClick={(e) => handleSubmit(e as any, "draft")}
              disabled={status === "submitting"}
              className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {status === "submitting" ? "Saving..." : "Save Draft"}
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e as any, "submit")}
              disabled={status === "submitting"}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {status === "submitting" ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
        )}

        {/* Recent Records Table */}
        {existingData.length > 0 && (
          <div className="kpi-card mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-ink">
                Recent Volume Records ({existingData.length})
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-line">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-ink uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-ink uppercase tracking-wider">
                      Produced (MMscf/d)
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-ink uppercase tracking-wider">
                      NGL Extracted
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-ink uppercase tracking-wider">
                      Fuel Gas
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-ink uppercase tracking-wider">
                      Delivered
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
                      <td className="px-4 py-3 text-sm text-ink text-right tabular-nums">
                        {record["Produced (MMscf/d)"] || record.produced || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-ink text-right tabular-nums">
                        {record["NGL Extracted (MMscf/d)"] || record.nglExtracted || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-ink text-right tabular-nums">
                        {record["Fuel Gas (MMscf/d)"] || record.fuelGas || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-ink text-right tabular-nums">
                        {record["Delivered (MMscf/d)"] || record.delivered || "—"}
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
