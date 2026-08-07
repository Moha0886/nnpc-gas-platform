import React from "react";
import { Info, Building2, MapPin, Gauge, FileText, Zap } from "lucide-react";
import type { Offtaker } from "@/lib/types";

interface EnhancedCustomerInfoProps {
  offtaker: Offtaker;
  className?: string;
}

export function EnhancedCustomerInfo({ offtaker, className = "" }: EnhancedCustomerInfoProps) {
  // Calculate utilization if design capacity is available
  const utilizationPercent =
    offtaker.designCapacity && offtaker.contractualDemand
      ? ((offtaker.contractualDemand / offtaker.designCapacity) * 100).toFixed(1)
      : null;

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="p-2 rounded-lg bg-blue-100">
          <Building2 className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-ink text-base">{offtaker.name}</h4>
          <p className="text-sm text-ink/60">{offtaker.sector}</p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
        {/* Corridor */}
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-ink/60 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-ink/60 font-medium">Corridor</p>
            <p className="text-ink font-semibold">{offtaker.corridor}</p>
          </div>
        </div>

        {/* GDZ (if available) */}
        {offtaker.gdz && (
          <div className="flex items-start gap-2 col-span-2">
            <MapPin className="w-4 h-4 text-ink/60 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-ink/60 font-medium">Gas Distribution Zone</p>
              <p className="text-ink font-semibold text-xs">{offtaker.gdz}</p>
            </div>
          </div>
        )}

        {/* Design Capacity */}
        {offtaker.designCapacity && (
          <div className="flex items-start gap-2">
            <Gauge className="w-4 h-4 text-ink/60 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-ink/60 font-medium">Design Capacity</p>
              <p className="text-ink font-semibold">{offtaker.designCapacity.toFixed(1)} MMscfd</p>
            </div>
          </div>
        )}

        {/* Contractual Demand */}
        <div className="flex items-start gap-2">
          <FileText className="w-4 h-4 text-ink/60 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-ink/60 font-medium">Contractual Demand (DCQ)</p>
            <p className="text-ink font-semibold">
              {(offtaker.contractualDemand || offtaker.firmAndEffective || 0).toFixed(1)} MMscfd
            </p>
          </div>
        </div>

        {/* Utilization (if calculable) */}
        {utilizationPercent && (
          <div className="flex items-start gap-2">
            <Zap className="w-4 h-4 text-ink/60 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-ink/60 font-medium">Contract Utilization</p>
              <p className="text-ink font-semibold">{utilizationPercent}%</p>
            </div>
          </div>
        )}

        {/* Customer Class (if available) */}
        {offtaker.customerClass && (
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-ink/60 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-ink/60 font-medium">Customer Class</p>
              <p className="text-ink font-semibold">{offtaker.customerClass}</p>
            </div>
          </div>
        )}

        {/* Delivery Point */}
        <div className="flex items-start gap-2 col-span-2">
          <FileText className="w-4 h-4 text-ink/60 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-ink/60 font-medium">Delivery Point</p>
            <p className="text-ink font-mono text-xs">{offtaker.deliveryPointId}</p>
          </div>
        </div>

        {/* Product Type */}
        {offtaker.productType && (
          <div className="flex items-start gap-2 col-span-2">
            <Info className="w-4 h-4 text-ink/60 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-ink/60 font-medium">Product Type</p>
              <p className="text-ink font-semibold">{offtaker.productType}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
