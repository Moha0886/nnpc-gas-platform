"use client";

import { useState } from "react";
import { ArrowLeft, Save, Send, Gauge } from "lucide-react";
import Link from "next/link";
import { offtakers } from "@/lib/data";
import type { Corridor } from "@/lib/types";

export default function DeliveriesRecordPage() {
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
  };

  const dcqPercent = selectedOfftaker?.dcq && formData.receivedVolume
    ? ((parseFloat(formData.receivedVolume) / selectedOfftaker.dcq) * 100).toFixed(1)
    : "—";

  const varianceReceipt = formData.receivedVolume && formData.offtakenVolume
    ? (parseFloat(formData.receivedVolume) - parseFloat(formData.offtakenVolume)).toFixed(2)
    : "—";

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-line px-8 py-4">
        <div className="flex items-center gap-4">
          <Link href="/records" className="text-ink/60 hover:text-ink">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-ink">Delivery Point Record</h2>
            <p className="text-sm text-ink/60 mt-1">
              Record metered volumes delivered to offtakers
            </p>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-4xl">
        <form onSubmit={(e) => handleSubmit(e, "submit")}>
          {/* Delivery Point Information */}
          <div className="kpi-card mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Gauge className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-ink">Delivery Point Details</h3>
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
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  Meter Status *
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
                  className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="operational">Operational</option>
                  <option value="degraded">Degraded</option>
                  <option value="failed">Failed</option>
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
                      offtakerId: "",
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
                  Offtaker / Customer *
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
                    DCQ: {selectedOfftaker.dcq} MMscf/d | Delivery Point: {selectedOfftaker.deliveryPointId}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  Delivery Point ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., dp-egbin"
                  value={formData.deliveryPointId}
                  onChange={(e) => setFormData({ ...formData, deliveryPointId: e.target.value })}
                  className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  readOnly={!!selectedOfftaker}
                />
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

          {/* Volume Readings */}
          <div className="kpi-card mb-6">
            <h3 className="text-lg font-semibold text-ink mb-4">Volume Readings</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  Received Volume (MMscf/d) *
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  placeholder="0.00"
                  value={formData.receivedVolume}
                  onChange={(e) => setFormData({ ...formData, receivedVolume: e.target.value })}
                  className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary tabular-nums"
                />
                <p className="text-xs text-ink/60 mt-1">Metered delivery to point</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  Offtaken Volume (MMscf/d) *
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  placeholder="0.00"
                  value={formData.offtakenVolume}
                  onChange={(e) => setFormData({ ...formData, offtakenVolume: e.target.value })}
                  className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary tabular-nums"
                />
                <p className="text-xs text-ink/60 mt-1">Actually consumed by customer</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  Receipt Variance (MMscf/d)
                </label>
                <div className="px-4 py-2 border border-line rounded-lg bg-gray-50 text-ink font-semibold tabular-nums">
                  {varianceReceipt} MMscf/d
                </div>
                <p className="text-xs text-ink/60 mt-1">Received - Offtaken</p>
              </div>

              {selectedOfftaker && (
                <div>
                  <label className="block text-sm font-medium text-ink/70 mb-2">
                    Delivery vs DCQ
                  </label>
                  <div className="px-4 py-2 border border-line rounded-lg bg-gray-50 text-ink font-semibold tabular-nums">
                    {dcqPercent}% of DCQ
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Meter & Conditions */}
          <div className="kpi-card mb-6">
            <h3 className="text-lg font-semibold text-ink mb-4">Meter & Operating Conditions</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  Meter Reading *
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  placeholder="0.00"
                  value={formData.meterReading}
                  onChange={(e) => setFormData({ ...formData, meterReading: e.target.value })}
                  className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary tabular-nums"
                />
                <p className="text-xs text-ink/60 mt-1">Cumulative reading</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  Delivery Pressure (PSI) *
                </label>
                <input
                  type="number"
                  required
                  step="0.1"
                  placeholder="0.0"
                  value={formData.pressure}
                  onChange={(e) => setFormData({ ...formData, pressure: e.target.value })}
                  className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary tabular-nums"
                />
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
                Notes / Meter Issues
              </label>
              <textarea
                rows={4}
                placeholder="Enter any meter issues, calibration notes, or delivery observations..."
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
              <strong className="text-primary">Custody Transfer:</strong> Delivery records
              at custody-transfer points are used for billing. All records require checker
              approval before being used in commercial calculations.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
