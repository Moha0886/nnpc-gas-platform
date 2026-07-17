"use client";

import { useState } from "react";
import { ArrowLeft, Save, Send, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { assets, processingPlants } from "@/lib/data";
import type { Corridor } from "@/lib/types";

export default function DefermentRecordPage() {
  const [formData, setFormData] = useState({
    facilityId: "",
    facilityName: "",
    facilityType: "",
    operator: "",
    corridor: "" as Corridor | "",
    startDate: new Date().toISOString().split("T")[0],
    startTime: "",
    endDate: "",
    endTime: "",
    cause:
      "planned maintenance" as
        | "planned maintenance"
        | "unplanned breakdown"
        | "third-party interference"
        | "upstream supply shortfall"
        | "offtaker rejection",
    deferredVolume: "",
    cumulativeVolume: "",
    gasPrice: "3.50", // USD per MMscf
    description: "",
    reportedBy: "",
  });

  const [status, setStatus] = useState<"draft" | "submitting" | "submitted">("draft");

  const corridors: Corridor[] = ["Eastern", "Western", "Northern", "Lagos"];

  const handleSubmit = async (e: React.FormEvent, saveType: "draft" | "submit") => {
    e.preventDefault();
    setStatus("submitting");

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const eventStatus = formData.endDate ? "resolved" : "ongoing";

    console.log("Deferment Record:", {
      ...formData,
      deferredVolume: parseFloat(formData.deferredVolume),
      cumulativeVolume: parseFloat(formData.cumulativeVolume),
      valueOfDeferredVolume: parseFloat(formData.cumulativeVolume) * parseFloat(formData.gasPrice),
      status: eventStatus,
      saveType,
    });

    setStatus("submitted");
    alert(saveType === "draft" ? "Saved as draft" : "Submitted for approval");
  };

  const valueOfDeferred = formData.cumulativeVolume && formData.gasPrice
    ? (parseFloat(formData.cumulativeVolume) * parseFloat(formData.gasPrice)).toLocaleString(
        undefined,
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      )
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
            <h2 className="text-2xl font-bold text-ink">Deferment Event Record</h2>
            <p className="text-sm text-ink/60 mt-1">
              Record deferments, causes, and impact
            </p>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-4xl">
        <form onSubmit={(e) => handleSubmit(e, "submit")}>
          {/* Event Information */}
          <div className="kpi-card mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-alert/10">
                <AlertTriangle className="w-5 h-5 text-alert" />
              </div>
              <h3 className="text-lg font-semibold text-ink">Deferment Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  Deferment Cause *
                </label>
                <select
                  required
                  value={formData.cause}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cause: e.target.value as
                        | "planned maintenance"
                        | "unplanned breakdown"
                        | "third-party interference"
                        | "upstream supply shortfall"
                        | "offtaker rejection",
                    })
                  }
                  className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="planned maintenance">Planned Maintenance</option>
                  <option value="unplanned breakdown">Unplanned Breakdown</option>
                  <option value="third-party interference">Third-Party Interference</option>
                  <option value="upstream supply shortfall">Upstream Supply Shortfall</option>
                  <option value="offtaker rejection">Offtaker Rejection</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  Facility Type *
                </label>
                <select
                  required
                  value={formData.facilityType}
                  onChange={(e) => setFormData({ ...formData, facilityType: e.target.value })}
                  className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select type...</option>
                  <option value="Pipeline">Pipeline</option>
                  <option value="Processing plant">Processing Plant</option>
                  <option value="Compressor station">Compressor Station</option>
                  <option value="Metering station">Metering Station</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  Facility ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., elps-001"
                  value={formData.facilityId}
                  onChange={(e) => setFormData({ ...formData, facilityId: e.target.value })}
                  className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  Facility Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., ELPS"
                  value={formData.facilityName}
                  onChange={(e) => setFormData({ ...formData, facilityName: e.target.value })}
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
                  placeholder="e.g., NGIC, Shell"
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

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  Reported By *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Name of person reporting"
                  value={formData.reportedBy}
                  onChange={(e) => setFormData({ ...formData, reportedBy: e.target.value })}
                  className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="kpi-card mb-6">
            <h3 className="text-lg font-semibold text-ink mb-4">Event Timeline</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  Start Time *
                </label>
                <input
                  type="time"
                  required
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-ink/60 mt-1">Leave empty if ongoing</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Volume Impact */}
          <div className="kpi-card mb-6">
            <h3 className="text-lg font-semibold text-ink mb-4">Volume Impact</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  Deferred Volume (MMscf/d) *
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  placeholder="0.00"
                  value={formData.deferredVolume}
                  onChange={(e) => setFormData({ ...formData, deferredVolume: e.target.value })}
                  className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary tabular-nums"
                />
                <p className="text-xs text-ink/60 mt-1">Daily rate of deferred volume</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  Cumulative Volume (MMscf) *
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  placeholder="0.00"
                  value={formData.cumulativeVolume}
                  onChange={(e) =>
                    setFormData({ ...formData, cumulativeVolume: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary tabular-nums"
                />
                <p className="text-xs text-ink/60 mt-1">Total volume deferred</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  Gas Price (USD/MMscf)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="3.50"
                  value={formData.gasPrice}
                  onChange={(e) => setFormData({ ...formData, gasPrice: e.target.value })}
                  className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary tabular-nums"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  Value of Deferred Volume
                </label>
                <div className="px-4 py-2 border border-line rounded-lg bg-alert/5 text-alert font-bold tabular-nums">
                  ${valueOfDeferred}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="kpi-card mb-6">
            <h3 className="text-lg font-semibold text-ink mb-4">Event Description</h3>

            <div>
              <label className="block text-sm font-medium text-ink/70 mb-2">
                Description / Root Cause *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe the cause of deferment, actions taken, and expected resolution time..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
          <div className="mt-6 p-4 bg-alert/5 border border-alert/20 rounded-lg">
            <p className="text-sm text-ink/70">
              <strong className="text-alert">Impact Tracking:</strong> Deferment events
              impact production and revenue. Records will be analyzed for MTBF/MTTR metrics
              and bad-actor asset identification.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
