"use client";

import {
  allAssets,
  pipelines,
  getTotalDeferment,
  getAssetsByStatus,
  type AssetStatus,
} from "@/lib/pipeline-network-data";
import { AlertTriangle, CheckCircle, Construction, Wrench } from "lucide-react";

interface NetworkLegendProps {
  onAssetClick?: (assetId: string) => void;
}

export default function NetworkLegend({ onAssetClick }: NetworkLegendProps) {
  const totalDeferment = getTotalDeferment();
  const offlineAssets = getAssetsByStatus("partial-outage");
  const maintenanceAssets = getAssetsByStatus("maintenance");
  const operationalAssets = getAssetsByStatus("operational");
  const underConstructionAssets = getAssetsByStatus("under-construction");

  // Count by asset type
  const assetCounts = allAssets.reduce((acc, asset) => {
    const type = asset.properties.assetType;
    if (!acc[type]) acc[type] = { total: 0, operational: 0 };
    acc[type].total++;
    if (asset.properties.status === "operational") acc[type].operational++;
    return acc;
  }, {} as Record<string, { total: number; operational: number }>);

  // Pipeline statistics
  const pipelineStats = {
    total: pipelines.length,
    operational: pipelines.filter((p) => p.properties.status === "operational").length,
    totalCapacity: pipelines.reduce((sum, p) => sum + p.properties.capacity, 0),
    totalFlow: pipelines.reduce((sum, p) => sum + p.properties.currentFlow, 0),
  };

  const avgUtilization = (
    (pipelineStats.totalFlow / pipelineStats.totalCapacity) *
    100
  ).toFixed(1);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-lg font-bold text-ink">Network Overview</h2>
        <p className="text-sm text-ink/60">Real-time pipeline infrastructure status</p>
      </div>

      {/* Total Deferment Alert */}
      {totalDeferment > 0 && (
        <div className="bg-alert/10 border border-alert rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-alert" />
            <h3 className="font-bold text-alert">Active Deferments</h3>
          </div>
          <p className="text-2xl font-bold text-alert tabular-nums">
            {totalDeferment.toFixed(1)} <span className="text-sm">MMscf/d</span>
          </p>
          <p className="text-xs text-ink/60 mt-1">Total lost production</p>
        </div>
      )}

      {/* Pipeline Statistics */}
      <div>
        <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
          <div className="w-3 h-3 bg-primary rounded"></div>
          Pipeline Network
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-ink/60">Total Pipelines:</span>
            <span className="font-medium tabular-nums">
              {pipelineStats.operational}/{pipelineStats.total}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink/60">Total Capacity:</span>
            <span className="font-medium tabular-nums">
              {pipelineStats.totalCapacity.toLocaleString()} MMscf/d
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink/60">Current Flow:</span>
            <span className="font-medium tabular-nums">
              {pipelineStats.totalFlow.toLocaleString()} MMscf/d
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink/60">Avg Utilization:</span>
            <span className="font-medium tabular-nums">{avgUtilization}%</span>
          </div>
        </div>
      </div>

      {/* Asset Counts */}
      <div>
        <h3 className="font-bold text-sm mb-3">Assets by Type</h3>
        <div className="space-y-2 text-sm">
          {Object.entries(assetCounts).map(([type, counts]) => (
            <div key={type} className="flex justify-between items-center">
              <span className="text-ink/60 capitalize">
                {type.replace("-", " ")}:
              </span>
              <div className="flex items-center gap-2">
                <span className="font-medium tabular-nums">
                  {counts.operational}/{counts.total}
                </span>
                {counts.operational === counts.total ? (
                  <CheckCircle className="w-4 h-4 text-primary" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-alert" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Summary */}
      <div>
        <h3 className="font-bold text-sm mb-3">Status Summary</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-primary/10 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span className="text-xs text-ink/60">Operational</span>
            </div>
            <p className="text-xl font-bold text-primary tabular-nums">
              {operationalAssets.length}
            </p>
          </div>
          <div className="bg-alert/10 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-alert" />
              <span className="text-xs text-ink/60">Outage</span>
            </div>
            <p className="text-xl font-bold text-alert tabular-nums">
              {offlineAssets.length}
            </p>
          </div>
          <div className="bg-flare/10 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Wrench className="w-4 h-4 text-flare" />
              <span className="text-xs text-ink/60">Maintenance</span>
            </div>
            <p className="text-xl font-bold text-flare tabular-nums">
              {maintenanceAssets.length}
            </p>
          </div>
          <div className="bg-accent/10 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Construction className="w-4 h-4 text-accent" />
              <span className="text-xs text-ink/60">Construction</span>
            </div>
            <p className="text-xl font-bold text-accent tabular-nums">
              {underConstructionAssets.length}
            </p>
          </div>
        </div>
      </div>

      {/* Offline Assets List */}
      {offlineAssets.length > 0 && (
        <div>
          <h3 className="font-bold text-sm mb-3 text-alert flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Assets with Issues
          </h3>
          <div className="space-y-2">
            {offlineAssets.map((asset) => (
              <div
                key={asset.properties.id}
                className="bg-alert/5 border border-alert/20 rounded p-3 cursor-pointer hover:bg-alert/10 transition-colors"
                onClick={() => onAssetClick?.(asset.properties.id)}
              >
                <div className="flex justify-between items-start mb-1">
                  <p className="text-sm font-medium text-ink">
                    {asset.properties.name}
                  </p>
                  <span className="text-xs px-2 py-0.5 bg-alert/20 text-alert rounded">
                    {asset.properties.status}
                  </span>
                </div>
                <p className="text-xs text-ink/60 capitalize mb-1">
                  {asset.properties.assetType.replace("-", " ")}
                </p>
                {asset.properties.deferment > 0 && (
                  <p className="text-xs text-alert font-medium">
                    Deferment: {asset.properties.deferment} MMscf/d
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assets with Deferment */}
      {pipelines.some((p) => p.properties.deferment > 0) && (
        <div>
          <h3 className="font-bold text-sm mb-3 text-alert">
            Pipelines with Deferment
          </h3>
          <div className="space-y-2">
            {pipelines
              .filter((p) => p.properties.deferment > 0)
              .map((pipeline) => (
                <div
                  key={pipeline.properties.id}
                  className="bg-alert/5 border border-alert/20 rounded p-3"
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-medium text-ink">
                      {pipeline.properties.name}
                    </p>
                  </div>
                  <p className="text-xs text-alert font-medium">
                    Deferment: {pipeline.properties.deferment} MMscf/d
                  </p>
                  <p className="text-xs text-ink/60 mt-1">
                    Flow: {pipeline.properties.currentFlow} /{" "}
                    {pipeline.properties.capacity} MMscf/d (
                    {pipeline.properties.utilization}%)
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div>
        <h3 className="font-bold text-sm mb-3">Legend</h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span>Operational</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-flare rounded-full"></div>
            <span>Partial Outage</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#FFBF00] rounded-full"></div>
            <span>Maintenance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-alert rounded-full"></div>
            <span>Under Construction</span>
          </div>
        </div>

        <div className="mt-4 space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-[#0172CB]"></div>
            <span>Trunk Pipeline</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-[#EF4444]"></div>
            <span>Export Pipeline</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-[#10B981]"></div>
            <span>Delivery Pipeline</span>
          </div>
        </div>
      </div>
    </div>
  );
}
