"use client";

import { useState } from "react";
import { ArrowLeft, Save, Send, Activity } from "lucide-react";
import Link from "next/link";
import { assets } from "@/lib/data";
import type { Corridor } from "@/lib/types";

export default function FlowsRecordPage() {
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
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-line px-8 py-4">
        <div className="flex items-center gap-4">
          <Link href="/records" className="text-ink/60 hover:text-ink">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-ink">Pipeline Flow Reading</h2>
            <p className="text-sm text-ink/60 mt-1">
              Record current flow, pressure, and temperature in pipelines
            </p>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-4xl">
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
      </div>
    </div>
  );
}
