"use client";

import { useState, useEffect } from "react";
import KPICard from "@/components/KPICard";
import CorridorFilter from "@/components/CorridorFilter";
import {
  Activity,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Gauge,
  Calendar,
  RefreshCw,
  Clock,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getGasDayBalance, assets, offtakers, getOfftakerFlows } from "@/lib/data";
import { formatNumber, formatPercent } from "@/lib/utils";
import type { Corridor } from "@/lib/types";

export default function ExecutiveOverview() {
  const [selectedCorridor, setSelectedCorridor] = useState<Corridor | "All">("All");
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [timeAgo, setTimeAgo] = useState("just now");

  // Get data
  const balance = getGasDayBalance();
  const offtakerFlows = getOfftakerFlows();

  // Calculate KPIs
  const ufgPercent = (balance.ufg / balance.receivedIntoTransmission) * 100;
  const networkUtilization = (balance.delivered / 6600) * 100; // Assuming total capacity of 6,600 MMscf/d

  // Calculate comprehensive capacity utilization metrics
  // 1. NNPC Facility Capacity
  const facilityAssets = assets.filter(a =>
    a.cls === "Pipeline" || a.cls === "Processing plant" || a.cls === "Compressor station"
  );
  const facilityCapacity = facilityAssets.reduce((acc, asset) => {
    const availFactor = asset.cls === "Pipeline" ? 0.92 : asset.cls === "Processing plant" ? 0.88 : 0.90;
    const actualFactor = asset.cls === "Pipeline" ? 0.68 : asset.cls === "Processing plant" ? 0.65 : 0.70;

    acc.nameplate += asset.nameplate;
    acc.available += asset.nameplate * availFactor;
    acc.actual += asset.nameplate * actualFactor;
    return acc;
  }, { nameplate: 0, available: 0, actual: 0 });

  const facilityUtilization = facilityCapacity.available > 0
    ? (facilityCapacity.actual / facilityCapacity.available) * 100
    : 0;

  // 2. Customer Capacity Utilization
  const customerCapacity = offtakers.reduce((acc, offtaker) => {
    const flow = offtakerFlows.find(f => f.offtakerId === offtaker.id);
    acc.dcq += offtaker.dcq || 0;
    acc.offtaken += flow?.offtaken || 0;
    return acc;
  }, { dcq: 0, offtaken: 0 });

  const customerUtilization = customerCapacity.dcq > 0
    ? (customerCapacity.offtaken / customerCapacity.dcq) * 100
    : 0;

  // 3. Supply Capacity Match
  const supplyCapacity = offtakerFlows.reduce((acc, flow) => {
    acc.allocated += flow.allocated;
    acc.actualSupplied += flow.actualSupplied;
    return acc;
  }, { allocated: 0, actualSupplied: 0 });

  const supplyUtilization = supplyCapacity.allocated > 0
    ? (supplyCapacity.actualSupplied / supplyCapacity.allocated) * 100
    : 0;

  // Update time ago display
  useEffect(() => {
    const updateTimeAgo = () => {
      const now = new Date();
      const diffMs = now.getTime() - lastUpdated.getTime();
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 1) {
        setTimeAgo("just now");
      } else if (diffMins === 1) {
        setTimeAgo("1 min ago");
      } else if (diffMins < 60) {
        setTimeAgo(`${diffMins} mins ago`);
      } else {
        const diffHours = Math.floor(diffMins / 60);
        setTimeAgo(diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [lastUpdated]);

  // Refresh data handler
  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    setLastUpdated(new Date());
    setIsLoading(false);
  };

  // Format current gas day
  const currentGasDay = new Date().toISOString().split('T')[0];

  // Supply Waterfall Data with accessible colors
  const waterfallData = [
    { name: "Produced", value: balance.produced, color: "#0077BB" }, // chart-primary
    { name: "NGL Extracted", value: -balance.nglExtracted, color: "#EE7733" }, // chart-tertiary
    {
      name: "Into Transmission",
      value: balance.receivedIntoTransmission,
      color: "#0077BB", // chart-primary
    },
    { name: "Fuel Gas", value: -balance.fuelGas, color: "#EE7733" }, // chart-tertiary
    { name: "Line Pack Δ", value: -balance.linePackChange, color: "#DCDAD2" }, // chart-neutral
    { name: "Delivered", value: balance.delivered, color: "#009988" }, // chart-secondary (teal)
    { name: "UFG", value: -balance.ufg, color: "#CC3311" }, // chart-quaternary
  ];

  // Deferment Attribution with accessible, color-blind safe colors
  const defermentData = [
    { name: "Planned Maintenance", value: 320, color: "#0077BB" }, // Blue
    { name: "Unplanned Breakdown", value: 185, color: "#CC3311" }, // Red
    { name: "Third-party", value: 95, color: "#EE7733" }, // Orange
    { name: "Upstream Shortfall", value: 142, color: "#DCDAD2" }, // Neutral
    { name: "Offtaker Rejection", value: 78, color: "#009988" }, // Teal
  ];

  return (
    <div className="min-h-screen">
      {/* Enhanced Header with Timestamp and Refresh */}
      <div className="bg-white border-b border-line px-8 py-4 sticky top-0 z-20 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-ink">Executive Overview</h2>
            <div className="flex items-center gap-3 mt-1 text-sm">
              <div className="flex items-center gap-1.5 text-ink/60">
                <Calendar className="w-4 h-4" />
                <span>Gas Day: <span className="font-semibold text-ink">{currentGasDay}</span></span>
              </div>
              <div className="flex items-center gap-1.5 text-ink/60">
                <Clock className="w-4 h-4" />
                <span>Updated <span className="font-semibold text-ink">{timeAgo}</span></span>
              </div>
              <span className="pulse-live text-success text-xs font-medium">
                Live
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CorridorFilter onChange={setSelectedCorridor} />
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="btn-secondary flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-8">
        {/* Enhanced KPI Strip with new features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <KPICard
            title="Produced (Gas Day)"
            value={formatNumber(balance.produced, 0)}
            unit="MMscf/d"
            icon={Activity}
            color="accent"
            trend={{ value: 2.3, isPositive: true }}
            status={isLoading ? "loading" : "live"}
            lastUpdated={timeAgo}
          />
          <KPICard
            title="Delivered"
            value={formatNumber(balance.delivered, 0)}
            unit="MMscf/d"
            icon={TrendingUp}
            color="primary"
            trend={{ value: 1.8, isPositive: true }}
            status={isLoading ? "loading" : "live"}
            lastUpdated={timeAgo}
          />
          <KPICard
            title="UFG %"
            value={ufgPercent.toFixed(1)}
            unit="%"
            icon={AlertTriangle}
            color="alert"
            trend={{ value: -0.3, isPositive: true }}
            threshold={{ target: 2.0, tolerance: 0.5 }}
            contextText="Target: <2.0%"
            status={isLoading ? "loading" : "live"}
            lastUpdated={timeAgo}
          />
          <KPICard
            title="Network Utilisation"
            value={networkUtilization.toFixed(1)}
            unit="%"
            icon={Gauge}
            color="primary"
            trend={{ value: 0.5, isPositive: true }}
            status={isLoading ? "loading" : "live"}
            lastUpdated={timeAgo}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <KPICard
            title="Deferment QTD"
            value={formatNumber(820, 0)}
            unit="MMscf"
            icon={AlertTriangle}
            color="alert"
            status={isLoading ? "loading" : "live"}
            contextText="Quarter to date total"
          />
          <KPICard
            title="Receivables"
            value={formatNumber(2450, 0)}
            unit="₦M"
            icon={DollarSign}
            color="alert"
            status={isLoading ? "loading" : "live"}
            contextText="Outstanding payments"
          />
          <KPICard
            title="DSO (Power Sector)"
            value="143"
            unit="days"
            icon={Calendar}
            color="alert"
            status={isLoading ? "loading" : "live"}
            contextText="Days sales outstanding"
          />
        </div>

        {/* Comprehensive Capacity Utilization Overview */}
        <div className="kpi-card mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-ink">System-Wide Capacity Utilization</h3>
              <p className="text-sm text-ink/60 mt-1">
                Complete view across NNPC facilities, customer capacity, and supply performance
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* NNPC Facility Utilization */}
            <div className="border border-line rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Gauge className="w-5 h-5 text-primary" />
                <h4 className="font-semibold text-ink">NNPC Facility Utilization</h4>
              </div>
              <div className="mb-4">
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-bold tabular-nums ${
                    facilityUtilization >= 80 ? "text-primary" :
                    facilityUtilization >= 60 ? "text-flare" :
                    "text-alert"
                  }`}>
                    {facilityUtilization.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                  <div
                    className={`h-3 rounded-full ${
                      facilityUtilization >= 80 ? "bg-primary" :
                      facilityUtilization >= 60 ? "bg-flare" :
                      "bg-alert"
                    }`}
                    style={{ width: `${Math.min(facilityUtilization, 100)}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink/60">Available Capacity:</span>
                  <span className="font-semibold tabular-nums">{formatNumber(facilityCapacity.available, 0)} MMscf/d</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink/60">Actual Throughput:</span>
                  <span className="font-semibold tabular-nums">{formatNumber(facilityCapacity.actual, 0)} MMscf/d</span>
                </div>
                <div className="pt-2 border-t border-line text-xs text-ink/60">
                  Pipelines, processing plants & compressor stations
                </div>
              </div>
            </div>

            {/* Customer Capacity Utilization */}
            <div className="border border-line rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-5 h-5 text-accent" />
                <h4 className="font-semibold text-ink">Customer Utilization</h4>
              </div>
              <div className="mb-4">
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-bold tabular-nums ${
                    customerUtilization >= 80 ? "text-primary" :
                    customerUtilization >= 60 ? "text-flare" :
                    "text-alert"
                  }`}>
                    {customerUtilization.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                  <div
                    className={`h-3 rounded-full ${
                      customerUtilization >= 80 ? "bg-primary" :
                      customerUtilization >= 60 ? "bg-flare" :
                      "bg-alert"
                    }`}
                    style={{ width: `${Math.min(customerUtilization, 100)}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink/60">Total DCQ:</span>
                  <span className="font-semibold tabular-nums">{formatNumber(customerCapacity.dcq, 0)} MMscf/d</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink/60">Actual Offtaken:</span>
                  <span className="font-semibold tabular-nums">{formatNumber(customerCapacity.offtaken, 0)} MMscf/d</span>
                </div>
                <div className="pt-2 border-t border-line text-xs text-ink/60">
                  Offtaker contracted capacity usage
                </div>
              </div>
            </div>

            {/* Supply Performance */}
            <div className="border border-line rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-pine" />
                <h4 className="font-semibold text-ink">Supply Performance</h4>
              </div>
              <div className="mb-4">
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-bold tabular-nums ${
                    supplyUtilization >= 95 ? "text-primary" :
                    supplyUtilization >= 90 ? "text-flare" :
                    "text-alert"
                  }`}>
                    {supplyUtilization.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                  <div
                    className={`h-3 rounded-full ${
                      supplyUtilization >= 95 ? "bg-primary" :
                      supplyUtilization >= 90 ? "bg-flare" :
                      "bg-alert"
                    }`}
                    style={{ width: `${Math.min(supplyUtilization, 100)}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink/60">Allocated Volume:</span>
                  <span className="font-semibold tabular-nums">{formatNumber(supplyCapacity.allocated, 0)} MMscf/d</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink/60">Actual Supplied:</span>
                  <span className="font-semibold tabular-nums">{formatNumber(supplyCapacity.actualSupplied, 0)} MMscf/d</span>
                </div>
                <div className="pt-2 border-t border-line text-xs text-ink/60">
                  Allocation vs actual supply delivery
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <p className="text-xs text-ink/70">
              <strong>Utilization Targets:</strong> Facility & Customer (≥80% = High, 60-79% = Moderate, &lt;60% = Low) · Supply Performance (≥95% = Excellent, 90-94% = Good, &lt;90% = Needs Improvement)
            </p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Supply Waterfall */}
          <div className="kpi-card">
            <h3 className="text-lg font-semibold text-ink mb-4">
              Supply Waterfall (MMscf/d)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={waterfallData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DCDAD2" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  angle={-15}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number) => formatNumber(Math.abs(value), 0)}
                />
                <Bar dataKey="value">
                  {waterfallData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Deferment Attribution */}
        <div className="kpi-card">
          <h3 className="text-lg font-semibold text-ink mb-4">
            Deferment Attribution (MMscf)
          </h3>
          <div className="flex items-center gap-8">
            <ResponsiveContainer width="40%" height={300}>
              <PieChart>
                <Pie
                  data={defermentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {defermentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatNumber(value, 0)} />
              </PieChart>
            </ResponsiveContainer>

            <div className="flex-1 space-y-3">
              {defermentData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-ink">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-ink tabular-nums">
                    {formatNumber(item.value, 0)} MMscf
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-sm text-ink/70">
            <strong>Note:</strong> Data shown is from seed data / mock values. Replace
            with real NGIC/NGML figures for production use. Corridor filter will apply
            when integrated with live data feeds.
          </p>
        </div>
      </div>
    </div>
  );
}
