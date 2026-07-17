"use client";

import { useState } from "react";
import { ArrowLeft, Save, Send, FileText } from "lucide-react";
import Link from "next/link";
import { offtakers } from "@/lib/data";
import type { Corridor } from "@/lib/types";

export default function NominationsRecordPage() {
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
      dcq: selectedOfftaker?.dcq,
      saveType,
    });

    setStatus("submitted");
    alert(saveType === "draft" ? "Saved as draft" : "Submitted for approval");
  };

  const allocationPercent = selectedOfftaker?.dcq && formData.allocated
    ? ((parseFloat(formData.allocated) / selectedOfftaker.dcq) * 100).toFixed(1)
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
            <h2 className="text-2xl font-bold text-ink">Customer Nomination Record</h2>
            <p className="text-sm text-ink/60 mt-1">
              Record customer gas demand and allocation requests
            </p>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-4xl">
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
                    DCQ: {selectedOfftaker.dcq} MMscf/d
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
                      ({formData.allocated || "0"} / {selectedOfftaker.dcq} MMscf/d)
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
              <strong className="text-primary">Nomination Workflow:</strong> Customer
              nominations must be submitted by D-1 18:00 WAT. This record will be reviewed
              by the nominations desk before allocation is confirmed.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
