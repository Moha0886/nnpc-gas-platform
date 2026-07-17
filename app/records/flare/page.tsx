"use client";

import { useState } from "react";
import { ArrowLeft, Save, Send, Flame } from "lucide-react";
import Link from "next/link";
import { processingPlants } from "@/lib/data";
import type { Corridor } from "@/lib/types";

export default function FlareRecordPage() {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    facilityId: "",
    facilityName: "",
    operator: "",
    corridor: "" as Corridor | "",
    flareVolume: "",
    duration: "",
    reason: "operational" as "operational" | "safety" | "emergency" | "routine" | "technical",
    description: "",
    startTime: "",
    endTime: "",
    reportedBy: "",
  });

  const [status, setStatus] = useState<"draft" | "submitting" | "submitted">("draft");

  const corridors: Corridor[] = ["Eastern", "Western", "Northern", "Lagos"];

  const handleSubmit = async (e: React.FormEvent, saveType: "draft" | "submit") => {
    e.preventDefault();
    setStatus("submitting");

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Calculate penalty exposure (simplified)
    const flareVolumeMM = parseFloat(formData.flareVolume);
    const penaltyRatePerMMscf = 5000; // NGN per MMscf (example)
    const penaltyNGN = flareVolumeMM * penaltyRatePerMMscf;
    const penaltyUSD = penaltyNGN / 1500; // Example exchange rate

    console.log("Flare Record:", {
      ...formData,
      flareVolume: flareVolumeMM,
      duration: parseFloat(formData.duration),
      penaltyExposure: {
        ngn: penaltyNGN,
        usd: penaltyUSD,
      },
      status: "reported",
      saveType,
    });

    setStatus("submitted");
    alert(saveType === "draft" ? "Saved as draft" : "Submitted for approval");
  };

  const penaltyNGN = formData.flareVolume
    ? (parseFloat(formData.flareVolume) * 5000).toLocaleString()
    : "—";

  const penaltyUSD = formData.flareVolume
    ? ((parseFloat(formData.flareVolume) * 5000) / 1500).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
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
            <h2 className="text-2xl font-bold text-ink">Flare Event Record</h2>
            <p className="text-sm text-ink/60 mt-1">
              Record flare volumes, reasons, and duration
            </p>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-4xl">
        <form onSubmit={(e) => handleSubmit(e, "submit")}>
          {/* Event Information */}
          <div className="kpi-card mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-flare/10">
                <Flame className="w-5 h-5 text-flare" />
              </div>
              <h3 className="text-lg font-semibold text-ink">Event Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  Event Date *
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
                  Flare Reason *
                </label>
                <select
                  required
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      reason: e.target.value as
                        | "operational"
                        | "safety"
                        | "emergency"
                        | "routine"
                        | "technical",
                    })
                  }
                  className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="operational">Operational</option>
                  <option value="safety">Safety</option>
                  <option value="emergency">Emergency</option>
                  <option value="routine">Routine</option>
                  <option value="technical">Technical Issue</option>
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
                  Facility Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Obiafu-Obrikom Gas Plant"
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
                  placeholder="e.g., NGIC, Shell, NLNG"
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
                  End Time
                </label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-ink/60 mt-1">Leave empty if ongoing</p>
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

          {/* Volume & Duration */}
          <div className="kpi-card mb-6">
            <h3 className="text-lg font-semibold text-ink mb-4">Volume & Duration</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  Flare Volume (MMscf) *
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  placeholder="0.00"
                  value={formData.flareVolume}
                  onChange={(e) => setFormData({ ...formData, flareVolume: e.target.value })}
                  className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary tabular-nums"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  Duration (hours) *
                </label>
                <input
                  type="number"
                  required
                  step="0.1"
                  placeholder="0.0"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary tabular-nums"
                />
              </div>
            </div>
          </div>

          {/* Penalty Exposure */}
          <div className="kpi-card mb-6 bg-alert/5">
            <h3 className="text-lg font-semibold text-ink mb-4">Estimated Penalty Exposure</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  Penalty (NGN)
                </label>
                <div className="px-4 py-2 border border-line rounded-lg bg-white text-alert font-bold tabular-nums">
                  ₦{penaltyNGN}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">
                  Penalty (USD)
                </label>
                <div className="px-4 py-2 border border-line rounded-lg bg-white text-alert font-bold tabular-nums">
                  ${penaltyUSD}
                </div>
              </div>
            </div>

            <p className="text-xs text-ink/60 mt-3">
              * Estimated at ₦5,000/MMscf. Actual penalty depends on regulatory limits and
              exemptions.
            </p>
          </div>

          {/* Description */}
          <div className="kpi-card mb-6">
            <h3 className="text-lg font-semibold text-ink mb-4">Event Description</h3>

            <div>
              <label className="block text-sm font-medium text-ink/70 mb-2">
                Description / Cause *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe the cause of flaring, actions taken, and any mitigation measures..."
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
              <strong className="text-alert">Regulatory Compliance:</strong> Flare events
              must be reported immediately. Records will be reviewed for regulatory
              compliance and penalty assessment by the environmental team.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
