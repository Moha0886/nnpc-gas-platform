"use client";

import { useState } from "react";
import { ArrowLeft, Save, Send, TrendingUp } from "lucide-react";
import Link from "next/link";
import { processingPlants } from "@/lib/data";
import type { Corridor } from "@/lib/types";

export default function ProductionRecordPage() {
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
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-line px-8 py-4">
        <div className="flex items-center gap-4">
          <Link href="/records" className="text-ink/60 hover:text-ink">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-ink">Daily Production Record</h2>
            <p className="text-sm text-ink/60 mt-1">
              Record gas production received from upstream facilities
            </p>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-4xl">
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
      </div>
    </div>
  );
}
