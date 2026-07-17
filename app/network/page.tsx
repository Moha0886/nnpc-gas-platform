"use client";

import { useState } from "react";
import PipelineMap from "@/components/PipelineMap";
import NetworkLegend from "@/components/NetworkLegend";
import { Network, Download, FileText, AlertTriangle, Activity, TrendingUp, Gauge } from "lucide-react";
import Link from "next/link";
import {
  allAssets,
  pipelines,
  getTotalDeferment,
  getAssetsByStatus,
} from "@/lib/pipeline-network-data";
import { getActiveIncidents } from "@/lib/incident-data";

export default function PipelineNetworkPage() {
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

  // Calculate network statistics
  const totalCapacity = pipelines.reduce((sum, p) => sum + p.properties.capacity, 0);
  const totalFlow = pipelines.reduce((sum, p) => sum + p.properties.currentFlow, 0);
  const avgUtilization = ((totalFlow / totalCapacity) * 100).toFixed(1);
  const totalDeferment = getTotalDeferment();
  const activeIncidents = getActiveIncidents();
  const criticalIncidents = activeIncidents.filter((i) => i.severity === "critical");

  const operationalAssets = getAssetsByStatus("operational").length;
  const totalAssets = allAssets.length;
  const networkHealth = ((operationalAssets / totalAssets) * 100).toFixed(1);

  // Pipeline operational status
  const operationalPipelines = pipelines.filter((p) => p.properties.status === "operational").length;
  const totalPipelines = pipelines.length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Network className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-ink">
              Pipeline Network Infrastructure
            </h1>
          </div>
          <p className="text-ink/60">
            Real-time visualization of Nigerian gas transmission network
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-line rounded-lg text-ink hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Network Data
          </button>
          <Link
            href="/incidents"
            className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" />
            Report Incident
          </Link>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Network Report
          </button>
        </div>
      </div>

      {/* Network KPI Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Network Health */}
        <div className="kpi-card">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Gauge className="w-5 h-5 text-primary" />
            </div>
            <div className="flex items-center gap-1 text-xs">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-ink/60">Live</span>
            </div>
          </div>
          <p className="text-sm text-ink/60 mb-1">Network Health</p>
          <p className={`text-2xl font-bold tabular-nums ${parseFloat(networkHealth) >= 90 ? "text-primary" : parseFloat(networkHealth) >= 75 ? "text-flare" : "text-alert"}`}>
            {networkHealth}%
          </p>
          <p className="text-xs text-ink/50 mt-1">
            {operationalAssets}/{totalAssets} assets operational
          </p>
        </div>

        {/* Total Capacity */}
        <div className="kpi-card">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-secondary/10 rounded-lg">
              <Activity className="w-5 h-5 text-secondary" />
            </div>
          </div>
          <p className="text-sm text-ink/60 mb-1">Total Capacity</p>
          <p className="text-2xl font-bold text-secondary tabular-nums">
            {totalCapacity.toLocaleString()}
          </p>
          <p className="text-xs text-ink/50 mt-1">MMscf/d capacity</p>
        </div>

        {/* Current Flow */}
        <div className="kpi-card">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
          </div>
          <p className="text-sm text-ink/60 mb-1">Current Flow</p>
          <p className="text-2xl font-bold text-accent tabular-nums">
            {totalFlow.toLocaleString()}
          </p>
          <p className="text-xs text-ink/50 mt-1">MMscf/d flowing</p>
        </div>

        {/* Utilization */}
        <div className="kpi-card">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Gauge className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className="text-sm text-ink/60 mb-1">Avg Utilization</p>
          <p className={`text-2xl font-bold tabular-nums ${parseFloat(avgUtilization) >= 85 ? "text-alert" : parseFloat(avgUtilization) >= 70 ? "text-flare" : "text-primary"}`}>
            {avgUtilization}%
          </p>
          <p className="text-xs text-ink/50 mt-1">
            {operationalPipelines}/{totalPipelines} pipelines active
          </p>
        </div>

        {/* Active Deferment */}
        <div className="kpi-card">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-alert/10 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-alert" />
            </div>
            {criticalIncidents.length > 0 && (
              <div className="px-2 py-0.5 bg-alert/20 text-alert text-xs rounded-full font-medium">
                {criticalIncidents.length} Critical
              </div>
            )}
          </div>
          <p className="text-sm text-ink/60 mb-1">Total Deferment</p>
          <p className="text-2xl font-bold text-alert tabular-nums">
            {totalDeferment.toFixed(1)}
          </p>
          <p className="text-xs text-ink/50 mt-1">MMscf/d deferred</p>
        </div>
      </div>

      {/* Interactive Map + Legend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{ height: "calc(100vh - 300px)", minHeight: "700px" }}>
            <PipelineMap onAssetClick={setSelectedAssetId} />
          </div>
        </div>

        {/* Legend Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-6" style={{ maxHeight: "calc(100vh - 300px)", overflowY: "auto" }}>
            <NetworkLegend onAssetClick={setSelectedAssetId} />
          </div>
        </div>
      </div>
    </div>
  );
}
