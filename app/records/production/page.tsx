"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Save, Send, TrendingUp, Upload as UploadIcon } from "lucide-react";
import Link from "next/link";
import { processingPlants } from "@/lib/data";
import type { Corridor } from "@/lib/types";
import FileUpload from "@/components/FileUpload";

export default function ProductionRecordPage() {
  const [activeTab, setActiveTab] = useState<"upload" | "manual">("upload");
  const [existingData, setExistingData] = useState<any[]>([]);

  // Load existing data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('production-records');
    if (saved) {
      setExistingData(JSON.parse(saved));
    } else {
      // Initialize with sample data
      const sampleData = [
        { Week: "Week 29 (Jul 15-21)", Producer: "Shell Petroleum", "Volume (MMscf)": "850.5", status: "approved" },
        { Week: "Week 29 (Jul 15-21)", Producer: "NLNG Supply", "Volume (MMscf)": "1250.3", status: "approved" },
        { Week: "Week 30 (Jul 22-28)", Producer: "Shell Petroleum", "Volume (MMscf)": "820.2", status: "pending" },
        { Week: "Week 30 (Jul 22-28)", Producer: "NLNG Supply", "Volume (MMscf)": "1180.7", status: "pending" },
      ];
      setExistingData(sampleData);
      localStorage.setItem('production-records', JSON.stringify(sampleData));
    }
  }, []);

  const handleUploadSuccess = (data: any[], overwriteDuplicates: boolean) => {
    console.log("Uploaded weekly supply records:", data);
    alert(`Successfully uploaded ${data.length} weekly gas supply records!`);
    const newData = data.map(d => ({ ...d, status: "pending" }));
    const updated = [...existingData, ...newData];
    setExistingData(updated);
    localStorage.setItem('production-records', JSON.stringify(updated));
  };

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    facilityId: "",
    facilityType: "field" as "field" | "well" | "plant",
    operator: "",
    corridor: "" as Corridor | "",
    production: "",
    capacity: "",
    nglProduction: "",
    lpgProduction: "",
    flareVolume: "",
  });

  const [status, setStatus] = useState<"draft" | "submitting" | "submitted">("draft");

  const corridors: Corridor[] = ["Eastern", "Western", "Northern", "Lagos"];

  const handleSubmit = async (e: React.FormEvent, saveType: "draft" | "submit") => {
    e.preventDefault();
    setStatus("submitting");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Production Record:", {
      ...formData,
      production: parseFloat(formData.production),
      capacity: parseFloat(formData.capacity),
      nglProduction: formData.nglProduction ? parseFloat(formData.nglProduction) : undefined,
      lpgProduction: formData.lpgProduction ? parseFloat(formData.lpgProduction) : undefined,
      flareVolume: formData.flareVolume ? parseFloat(formData.flareVolume) : undefined,
      utilization: (parseFloat(formData.production) / parseFloat(formData.capacity)) * 100,
      saveType,
    });

    setStatus("submitted");
    alert(saveType === "draft" ? "Saved as draft" : "Submitted for approval");
  };

  const utilization = formData.production && formData.capacity
    ? ((parseFloat(formData.production) / parseFloat(formData.capacity)) * 100).toFixed(1)
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
            <h2 className="text-2xl font-bold text-ink">Weekly Gas Supply Report</h2>
            <p className="text-sm text-ink/60 mt-1">
              {activeTab === "upload"
                ? "Upload weekly gas supply data from producers"
                : "Record gas production received from upstream facilities"}
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
              <TrendingUp className="w-5 h-5" />
              Manual Entry
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "upload" ? (
          <div className="kpi-card">
            <h3 className="text-lg font-semibold text-ink mb-4">Upload Weekly Gas Supply Data</h3>
            <p className="text-sm text-ink/60 mb-6">
              Upload weekly gas supply data from all producers. This matches the format of "Weekly MOR Gas Supply & Offtake" Excel file.
            </p>

            <FileUpload
              templateType="production"
              existingData={existingData}
              identifierFields={["Week", "Producer"]}
              requiredFields={["Week", "Producer", "Volume (MMscf)"]}
              onUploadSuccess={handleUploadSuccess}
            />

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-ink/70">
                <strong className="text-gasblue">Tip:</strong> Upload weekly supply data for all gas producers at once.
                The template matches your existing Weekly MOR Excel report format.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={(e) => handleSubmit(e, "submit")}>
          {/* Date & Facility Information */}
          <div className="kpi-card mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-accent/10">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-ink">Facility Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  Gas Day Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  Facility Type *
                </label>
                <select
                  required
                  value={formData.facilityType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      facilityType: e.target.value as "field" | "well" | "plant",
                    })
                  }
                  className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="field">Field</option>
                  <option value="well">Well</option>
                  <option value="plant">Processing Plant</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  Facility ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., plant-obiafu"
                  value={formData.facilityId}
                  onChange={(e) => setFormData({ ...formData, facilityId: e.target.value })}
                  className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  Operator *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Shell, NGIC, NLNG"
                  value={formData.operator}
                  onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
                  className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  Corridor
                </label>
                <select
                  value={formData.corridor}
                  onChange={(e) =>
                    setFormData({ ...formData, corridor: e.target.value as Corridor })
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
            </div>
          </div>

          {/* Production Volumes */}
          <div className="kpi-card mb-6">
            <h3 className="text-lg font-semibold text-ink mb-4">Production Volumes</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  Gas Production (MMscf/d) *
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  placeholder="0.00"
                  value={formData.production}
                  onChange={(e) => setFormData({ ...formData, production: e.target.value })}
                  className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary tabular-nums"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  Facility Capacity (MMscf/d) *
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  placeholder="0.00"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary tabular-nums"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  NGL Production (barrels/day)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.nglProduction}
                  onChange={(e) => setFormData({ ...formData, nglProduction: e.target.value })}
                  className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary tabular-nums"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  LPG Production (MT/day)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.lpgProduction}
                  onChange={(e) => setFormData({ ...formData, lpgProduction: e.target.value })}
                  className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary tabular-nums"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  Flare Volume (MMscf/d)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.flareVolume}
                  onChange={(e) => setFormData({ ...formData, flareVolume: e.target.value })}
                  className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary tabular-nums"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  Utilization %
                </label>
                <div className="px-4 py-2 border border-line rounded-lg bg-gray-50 text-ink font-semibold tabular-nums">
                  {utilization}%
                </div>
              </div>
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
              <strong className="text-primary">Maker-Checker Workflow:</strong> This
              record will be submitted for review. A checker must approve before it
              appears in dashboards. You will receive a notification when reviewed.
            </p>
          </div>
        </form>
        )}

        {/* Recent Records Table */}
        {existingData.length > 0 && (
          <div className="kpi-card mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-ink">
                Recent Production Records ({existingData.length})
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-line">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-ink uppercase tracking-wider">
                      Week/Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-ink uppercase tracking-wider">
                      Producer/Facility
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-ink uppercase tracking-wider">
                      Volume (MMscf)
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
                        {record.Week || record.date || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-ink font-medium">
                        {record.Producer || record.facilityId || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-ink text-right tabular-nums">
                        {record["Volume (MMscf)"] || record.production || "—"}
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
