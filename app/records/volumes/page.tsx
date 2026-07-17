"use client";

import { useState } from "react";
import { ArrowLeft, Save, Send, Activity } from "lucide-react";
import Link from "next/link";

export default function VolumeRecordPage() {
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
              Record daily gas balance across the value chain
            </p>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-4xl mx-auto">
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
      </div>
    </div>
  );
}
