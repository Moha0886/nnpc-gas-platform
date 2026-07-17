"use client";

import { useState } from "react";
import PipelineMap from "@/components/PipelineMap";
import NetworkLegend from "@/components/NetworkLegend";
import { Network, MapPin } from "lucide-react";

export default function PipelineNetworkPage() {
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

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
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <span className="text-ink/60">Live Data</span>
        </div>
      </div>

      {/* Interactive Map + Legend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{ height: "calc(100vh - 200px)", minHeight: "600px" }}>
            <PipelineMap onAssetClick={setSelectedAssetId} />
          </div>
        </div>

        {/* Legend Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-6" style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
            <NetworkLegend onAssetClick={setSelectedAssetId} />
          </div>
        </div>
      </div>

      {/* Information Panel */}
      <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-6">
        <h2 className="font-bold text-ink mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-secondary" />
          Nigerian Gas Network Infrastructure
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-bold text-ink mb-2">Major Pipeline Networks</h3>
            <ul className="space-y-2 text-ink/70">
              <li>
                <span className="font-medium">ELPS</span> - Escravos-Lagos Pipeline
                System: 680km trunk line delivering gas from the Niger Delta to Lagos
                and western states
              </li>
              <li>
                <span className="font-medium">OB3</span> - Oben Pipeline: 120km system
                connecting major gas fields in the western corridor
              </li>
              <li>
                <span className="font-medium">AKK</span> - Ajaokuta-Kaduna-Kano: 614km
                pipeline under construction to deliver gas to northern Nigeria
              </li>
              <li>
                <span className="font-medium">Trans-Niger</span> - Export pipeline
                serving NLNG and eastern region
              </li>
              <li>
                <span className="font-medium">Trans-Forcados</span> - Western corridor
                delivery system
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-ink mb-2">Infrastructure Components</h3>
            <ul className="space-y-2 text-ink/70">
              <li>
                <span className="font-medium">Processing Plants</span> - Gas processing
                facilities at Escravos, Oben, Obiafu, and Bonny
              </li>
              <li>
                <span className="font-medium">Compressor Stations</span> - Pressure
                boosting stations at strategic points along trunk lines
              </li>
              <li>
                <span className="font-medium">Metering Stations</span> - Custody
                transfer and measurement points for fiscal accounting
              </li>
              <li>
                <span className="font-medium">Export Terminals</span> - LNG export
                facilities and domestic delivery terminals
              </li>
              <li>
                <span className="font-medium">Storage Facilities</span> - Strategic gas
                storage for supply reliability
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Network Challenges */}
      <div className="bg-alert/5 border border-alert/20 rounded-lg p-6">
        <h2 className="font-bold text-alert mb-4">Network Challenges</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h3 className="font-bold text-ink mb-2">Security & Vandalism</h3>
            <p className="text-ink/70">
              Pipeline vandalism and illegal taps remain major challenges, causing
              production deferments and safety hazards
            </p>
          </div>
          <div>
            <h3 className="font-bold text-ink mb-2">Aging Infrastructure</h3>
            <p className="text-ink/70">
              Some pipelines commissioned in the 1980s-1990s require integrity
              management and replacement programs
            </p>
          </div>
          <div>
            <h3 className="font-bold text-ink mb-2">Right-of-Way Issues</h3>
            <p className="text-ink/70">
              Community relations and land access challenges affect maintenance
              activities and new pipeline construction
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
