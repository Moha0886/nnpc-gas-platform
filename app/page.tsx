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
  CheckCircle,
  Filter,
  Download,
  FileText,
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
  const [timeRange, setTimeRange] = useState<"today" | "7days" | "30days">("today");
  const [selectedSector, setSelectedSector] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);

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
    acc.dcq += offtaker.contractualDemand || offtaker.firmAndEffective || 0;
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

  // Generate time-series data for capacity request vs delivery (last 14 days)
  const generateTimeSeriesData = () => {
    const data = [];
    const today = new Date();

    for (let i = 13; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      // Simulate historical data with some variation
      const baseNominated = 1200 + Math.random() * 100;
      const baseReceived = baseNominated * (0.92 + Math.random() * 0.06); // 92-98% fulfillment

      // Add some realistic fluctuations
      const dayOfWeek = date.getDay();
      const weekendFactor = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.85 : 1.0;

      data.push({
        date: dateStr,
        shortDate: `${date.getMonth() + 1}/${date.getDate()}`,
        nominated: Math.round(baseNominated * weekendFactor),
        received: Math.round(baseReceived * weekendFactor),
        gap: Math.round((baseNominated - baseReceived) * weekendFactor),
      });
    }

    return data;
  };

  const timeSeriesData = generateTimeSeriesData();

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

  // Export handler
  const handleExport = (format: 'csv' | 'pdf') => {
    const data = {
      gasDay: currentGasDay,
      corridor: selectedCorridor,
      sector: selectedSector,
      timeRange,
      metrics: {
        produced: balance.produced,
        delivered: balance.delivered,
        ufg: ufgPercent,
        networkUtilization,
        facilityUtilization,
        customerUtilization,
        supplyUtilization,
      }
    };

    if (format === 'csv') {
      // Create CSV content
      const csvContent = [
        ['NNPC Gas Performance Platform - Executive Overview'],
        ['Generated:', new Date().toISOString()],
        ['Gas Day:', currentGasDay],
        ['Corridor:', selectedCorridor],
        [''],
        ['Key Metrics'],
        ['Metric', 'Value', 'Unit'],
        ['Produced', balance.produced.toString(), 'MMscf/d'],
        ['Delivered', balance.delivered.toString(), 'MMscf/d'],
        ['UFG %', ufgPercent.toFixed(1), '%'],
        ['Network Utilization', networkUtilization.toFixed(1), '%'],
        ['Facility Utilization', facilityUtilization.toFixed(1), '%'],
        ['Customer Utilization', customerUtilization.toFixed(1), '%'],
        ['Supply Performance', supplyUtilization.toFixed(1), '%'],
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `executive-overview-${currentGasDay}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  // Get available sectors
  const sectors = ["All", "Power", "Fertiliser", "Petrochemical", "LDC / distributor", "LNG feedstock"];

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
      {/* Enhanced Header with Filters and Export */}
      <div className="bg-white border-b border-line px-8 py-4 sticky top-0 z-20 shadow-sm">
        <div className="flex flex-col gap-4">
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
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-3 py-2 border rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  showFilters ? 'bg-primary text-white border-primary' : 'border-line text-ink hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
              </button>
              <button
                onClick={() => handleExport('csv')}
                className="px-3 py-2 border border-line rounded-lg text-sm font-medium text-ink hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="border-t border-line pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Time Range Filter */}
                <div>
                  <label className="block text-xs font-medium text-ink/60 mb-2">Time Range</label>
                  <div className="flex gap-2">
                    {(['today', '7days', '30days'] as const).map((range) => (
                      <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          timeRange === range
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-ink hover:bg-gray-200'
                        }`}
                      >
                        {range === 'today' ? 'Today' : range === '7days' ? '7 Days' : '30 Days'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Corridor Filter */}
                <div>
                  <label className="block text-xs font-medium text-ink/60 mb-2">Corridor</label>
                  <select
                    value={selectedCorridor}
                    onChange={(e) => setSelectedCorridor(e.target.value as Corridor | "All")}
                    className="w-full px-3 py-1.5 border border-line rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="All">All Corridors</option>
                    <option value="Eastern">Eastern</option>
                    <option value="Western">Western</option>
                    <option value="Northern">Northern</option>
                    <option value="Lagos">Lagos</option>
                  </select>
                </div>

                {/* Sector Filter */}
                <div>
                  <label className="block text-xs font-medium text-ink/60 mb-2">Sector</label>
                  <select
                    value={selectedSector}
                    onChange={(e) => setSelectedSector(e.target.value)}
                    className="w-full px-3 py-1.5 border border-line rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {sectors.map((sector) => (
                      <option key={sector} value={sector}>
                        {sector}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active Filters Display */}
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs text-ink/60">Active Filters:</span>
                {selectedCorridor !== "All" && (
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full flex items-center gap-1">
                    Corridor: {selectedCorridor}
                    <button onClick={() => setSelectedCorridor("All")} className="hover:text-primary-600">×</button>
                  </span>
                )}
                {selectedSector !== "All" && (
                  <span className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full flex items-center gap-1">
                    Sector: {selectedSector}
                    <button onClick={() => setSelectedSector("All")} className="hover:text-accent-600">×</button>
                  </span>
                )}
                {timeRange !== "today" && (
                  <span className="px-2 py-1 bg-flare/10 text-flare text-xs rounded-full flex items-center gap-1">
                    Range: {timeRange === '7days' ? '7 Days' : '30 Days'}
                    <button onClick={() => setTimeRange("today")} className="hover:text-flare-600">×</button>
                  </span>
                )}
                {(selectedCorridor !== "All" || selectedSector !== "All" || timeRange !== "today") && (
                  <button
                    onClick={() => {
                      setSelectedCorridor("All");
                      setSelectedSector("All");
                      setTimeRange("today");
                    }}
                    className="text-xs text-primary hover:underline ml-2"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-8">
        {/* Cross-BU Value Chain - Executive Command Center */}
        <div className="bg-gradient-to-r from-[#1B5E3E] to-[#2B5F75] rounded-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold">NNPC Gas Value Chain - Live Operations</h3>
              <p className="text-white/80 mt-1 text-sm">End-to-end gas flow across all business units</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">All Systems Operational</span>
            </div>
          </div>

          {/* Flow Visualization */}
          <div className="grid grid-cols-5 gap-3 mb-6">
            {/* Step 1: NGPIS Production */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all group">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#1B5E3E] flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
                <div className="flex-1">
                  <p className="text-xs text-white/70">NGPIS</p>
                  <p className="font-semibold text-sm">Production</p>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-white/70">Upstream</span>
                  <span className="text-lg font-bold tabular-nums">795.3</span>
                </div>
                <p className="text-xs text-white/50">MMscfd</p>
              </div>
              <a href="/operations/production-dashboard" className="text-xs text-[#F9A825] hover:underline mt-2 inline-block opacity-0 group-hover:opacity-100 transition-opacity">
                View Dashboard →
              </a>
            </div>

            {/* Arrow */}
            <div className="flex items-center justify-center">
              <div className="text-white/40 text-2xl">→</div>
            </div>

            {/* Step 2: NGPIS Processing */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all group">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#2B5F75] flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
                <div className="flex-1">
                  <p className="text-xs text-white/70">NGPIS</p>
                  <p className="font-semibold text-sm">Processing</p>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-white/70">Plants</span>
                  <span className="text-lg font-bold tabular-nums">780.5</span>
                </div>
                <p className="text-xs text-white/50">MMscfd · 98.1% eff</p>
              </div>
              <a href="/operations/production-dashboard" className="text-xs text-[#F9A825] hover:underline mt-2 inline-block opacity-0 group-hover:opacity-100 transition-opacity">
                View Dashboard →
              </a>
            </div>

            {/* Arrow */}
            <div className="flex items-center justify-center">
              <div className="text-white/40 text-2xl">→</div>
            </div>

            {/* Step 3: NGIC Transmission */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all group">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#F9A825] flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
                <div className="flex-1">
                  <p className="text-xs text-white/70">NGIC</p>
                  <p className="font-semibold text-sm">Transmission</p>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-white/70">Delivered</span>
                  <span className="text-lg font-bold tabular-nums">771.5</span>
                </div>
                <p className="text-xs text-white/50">MMscfd to network</p>
              </div>
              <a href="/operations/daily-situation" className="text-xs text-[#F9A825] hover:underline mt-2 inline-block opacity-0 group-hover:opacity-100 transition-opacity">
                View Report →
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Step 4: NGML Allocation */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-sm">
                    4
                  </div>
                  <div>
                    <p className="text-xs text-white/70">NGML</p>
                    <p className="font-semibold">Allocation Decision</p>
                  </div>
                </div>
                <a href="/allocation" className="text-xs text-[#F9A825] hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                  View Performance →
                </a>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-white/70 mb-1">Nomination</p>
                  <p className="text-xl font-bold tabular-nums">892.4</p>
                  <p className="text-xs text-white/50">MMscfd</p>
                </div>
                <div>
                  <p className="text-xs text-white/70 mb-1">Allocated</p>
                  <p className="text-xl font-bold tabular-nums">771.5</p>
                  <p className="text-xs text-white/50">MMscfd</p>
                </div>
                <div>
                  <p className="text-xs text-white/70 mb-1">Shortfall</p>
                  <p className="text-xl font-bold tabular-nums text-yellow-300">120.9</p>
                  <p className="text-xs text-white/50">MMscfd (13.5%)</p>
                </div>
              </div>
            </div>

            {/* Step 5: Customer Delivery */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    5
                  </div>
                  <div>
                    <p className="text-xs text-white/70">NGIC</p>
                    <p className="font-semibold">Customer Delivery</p>
                  </div>
                </div>
                <a href="/operations/daily-situation" className="text-xs text-[#F9A825] hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                  Daily Report →
                </a>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-white/70 mb-1">Offtakers</p>
                  <p className="text-xl font-bold tabular-nums">50</p>
                  <p className="text-xs text-white/50">Stations</p>
                </div>
                <div>
                  <p className="text-xs text-white/70 mb-1">Actual</p>
                  <p className="text-xl font-bold tabular-nums">759.2</p>
                  <p className="text-xs text-white/50">MMscfd</p>
                </div>
                <div>
                  <p className="text-xs text-white/70 mb-1">Performance</p>
                  <p className="text-xl font-bold tabular-nums text-green-300">98.4%</p>
                  <p className="text-xs text-white/50">vs Allocation</p>
                </div>
              </div>
            </div>
          </div>

          {/* Overall Efficiency */}
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-xs text-white/70 mb-1">End-to-End Efficiency</p>
                <p className="text-2xl font-bold tabular-nums text-green-300">95.5%</p>
                <p className="text-xs text-white/50">Production to Delivery</p>
              </div>
              <div>
                <p className="text-xs text-white/70 mb-1">Network Losses (UFG)</p>
                <p className="text-2xl font-bold tabular-nums">12.3</p>
                <p className="text-xs text-white/50">MMscfd (1.6%)</p>
              </div>
              <div>
                <p className="text-xs text-white/70 mb-1">Capacity Utilization</p>
                <p className="text-2xl font-bold tabular-nums">76.2%</p>
                <p className="text-xs text-white/50">Network-wide</p>
              </div>
              <div>
                <p className="text-xs text-white/70 mb-1">Stations Online</p>
                <p className="text-2xl font-bold tabular-nums text-green-300">48/50</p>
                <p className="text-xs text-white/50">96% Availability</p>
              </div>
            </div>
          </div>
        </div>

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

        {/* Customer Capacity Performance - DCQ vs Offtaken */}
        <div className="kpi-card mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-ink">Customer Capacity Performance</h3>
              <p className="text-sm text-ink/60 mt-1">Daily Contract Quantity vs Actual Offtaken by Customer</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={offtakers
                .filter(o => !o.parentOfftakerId) // Only main offtakers
                .map(offtaker => {
                  const flow = offtakerFlows.find(f => f.offtakerId === offtaker.id);
                  const dcq = offtaker.contractualDemand || offtaker.firmAndEffective || 0;
                  const offtaken = flow?.offtaken || 0;
                  const utilization = dcq > 0 ? (offtaken / dcq) * 100 : 0;

                  return {
                    name: offtaker.name.length > 20 ? offtaker.name.substring(0, 18) + '...' : offtaker.name,
                    DCQ: dcq,
                    Offtaken: offtaken,
                    Unused: Math.max(0, dcq - offtaken),
                    utilization,
                    sector: offtaker.sector,
                  };
                })
                .sort((a, b) => b.DCQ - a.DCQ) // Sort by DCQ descending
              }
              layout="vertical"
              margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#DCDAD2" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11 }}
                width={140}
              />
              <Tooltip
                formatter={(value) => formatNumber(Number(value) || 0, 0) + ' MMscf/d'}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border border-line rounded-lg shadow-lg">
                        <p className="font-semibold text-ink mb-2">{data.name}</p>
                        <p className="text-xs text-ink/60 mb-2">{data.sector}</p>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between gap-4">
                            <span className="text-ink/60">DCQ:</span>
                            <span className="font-semibold">{formatNumber(data.DCQ, 0)} MMscf/d</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-ink/60">Offtaken:</span>
                            <span className="font-semibold text-primary">{formatNumber(data.Offtaken, 0)} MMscf/d</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-ink/60">Unused:</span>
                            <span className="font-semibold text-alert">{formatNumber(data.Unused, 0)} MMscf/d</span>
                          </div>
                          <div className="flex justify-between gap-4 pt-1 border-t border-line">
                            <span className="text-ink/60">Utilization:</span>
                            <span className={`font-semibold ${
                              data.utilization >= 80 ? 'text-primary' :
                              data.utilization >= 60 ? 'text-flare' : 'text-alert'
                            }`}>
                              {data.utilization.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Bar dataKey="Offtaken" stackId="a" fill="#0172CB" name="Offtaken" />
              <Bar dataKey="Unused" stackId="a" fill="#DCDAD2" name="Unused Capacity" />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top Performers */}
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <h4 className="font-semibold text-ink mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                Top Performers (≥80% Utilization)
              </h4>
              <div className="space-y-1 text-xs">
                {offtakers
                  .filter(o => !o.parentOfftakerId)
                  .map(offtaker => {
                    const flow = offtakerFlows.find(f => f.offtakerId === offtaker.id);
                    const dcq = offtaker.contractualDemand || offtaker.firmAndEffective || 0;
                    const offtaken = flow?.offtaken || 0;
                    const utilization = dcq > 0 ? (offtaken / dcq) * 100 : 0;
                    return { ...offtaker, utilization, dcq, offtaken };
                  })
                  .filter(o => o.utilization >= 80)
                  .sort((a, b) => b.utilization - a.utilization)
                  .slice(0, 5)
                  .map(offtaker => (
                    <div key={offtaker.id} className="flex justify-between items-center py-1">
                      <span className="text-ink/70">{offtaker.name}</span>
                      <span className="font-semibold text-primary tabular-nums">
                        {offtaker.utilization.toFixed(1)}%
                      </span>
                    </div>
                  ))
                }
                {offtakers
                  .filter(o => !o.parentOfftakerId)
                  .map(offtaker => {
                    const flow = offtakerFlows.find(f => f.offtakerId === offtaker.id);
                    const dcq = offtaker.contractualDemand || offtaker.firmAndEffective || 0;
                    const offtaken = flow?.offtaken || 0;
                    const utilization = dcq > 0 ? (offtaken / dcq) * 100 : 0;
                    return utilization;
                  })
                  .filter(u => u >= 80).length === 0 && (
                    <p className="text-ink/50 italic">No customers above 80%</p>
                  )
                }
              </div>
            </div>

            {/* Underutilizers */}
            <div className="p-3 bg-alert/5 border border-alert/20 rounded-lg">
              <h4 className="font-semibold text-ink mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-alert" />
                Underutilizers (&lt;60% Utilization)
              </h4>
              <div className="space-y-1 text-xs">
                {offtakers
                  .filter(o => !o.parentOfftakerId)
                  .map(offtaker => {
                    const flow = offtakerFlows.find(f => f.offtakerId === offtaker.id);
                    const dcq = offtaker.contractualDemand || offtaker.firmAndEffective || 0;
                    const offtaken = flow?.offtaken || 0;
                    const utilization = dcq > 0 ? (offtaken / dcq) * 100 : 0;
                    const unused = dcq - offtaken;
                    return { ...offtaker, utilization, dcq, offtaken, unused };
                  })
                  .filter(o => o.utilization < 60)
                  .sort((a, b) => b.unused - a.unused) // Sort by unused capacity
                  .slice(0, 5)
                  .map(offtaker => (
                    <div key={offtaker.id} className="flex justify-between items-center py-1">
                      <span className="text-ink/70">{offtaker.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-alert/70 tabular-nums">
                          -{formatNumber(offtaker.unused, 0)} MMscf/d
                        </span>
                        <span className="font-semibold text-alert tabular-nums">
                          ({offtaker.utilization.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  ))
                }
                {offtakers
                  .filter(o => !o.parentOfftakerId)
                  .map(offtaker => {
                    const flow = offtakerFlows.find(f => f.offtakerId === offtaker.id);
                    const dcq = offtaker.contractualDemand || offtaker.firmAndEffective || 0;
                    const offtaken = flow?.offtaken || 0;
                    const utilization = dcq > 0 ? (offtaken / dcq) * 100 : 0;
                    return utilization;
                  })
                  .filter(u => u < 60).length === 0 && (
                    <p className="text-ink/50 italic">No customers below 60%</p>
                  )
                }
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-ink/70">
              <strong>Note:</strong> Unused capacity represents contracted but not utilized DCQ. High unused capacity may indicate overcapacity contracts or customer operational constraints. Consider contract renegotiation for persistent underutilizers.
            </p>
          </div>
        </div>

        {/* Time Series: Customer Requests vs Delivery */}
        <div className="kpi-card mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-ink">Customer Capacity Request vs Delivery Trend</h3>
              <p className="text-sm text-ink/60 mt-1">14-day trend showing nominated capacity vs actual received (MMscf/d)</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={timeSeriesData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#DCDAD2" />
              <XAxis
                dataKey="shortDate"
                tick={{ fontSize: 11 }}
                height={40}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                label={{ value: 'Driver gas pressure [MPa]', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#666' } }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border border-line rounded-lg shadow-lg">
                        <p className="font-semibold text-ink mb-2">{data.date}</p>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between gap-4">
                            <span className="text-ink/60">Nominated:</span>
                            <span className="font-semibold text-alert">{formatNumber(data.nominated, 0)} MMscf/d</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-ink/60">Received:</span>
                            <span className="font-semibold text-primary">{formatNumber(data.received, 0)} MMscf/d</span>
                          </div>
                          <div className="flex justify-between gap-4 pt-1 border-t border-line">
                            <span className="text-ink/60">Gap:</span>
                            <span className="font-semibold text-flare">{formatNumber(data.gap, 0)} MMscf/d</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-ink/60">Fulfillment:</span>
                            <span className="font-semibold text-primary">
                              {((data.received / data.nominated) * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />
              <Line
                type="monotone"
                dataKey="nominated"
                stroke="#CC3311"
                strokeWidth={2}
                name="Nominated (Requested)"
                dot={{ fill: '#CC3311', r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="received"
                stroke="#0077BB"
                strokeWidth={2}
                name="Received (Delivered)"
                dot={{ fill: '#0077BB', r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-xs text-ink/60 mb-1">Average Fulfillment Rate</p>
              <p className="text-2xl font-bold text-primary tabular-nums">
                {(
                  (timeSeriesData.reduce((sum, d) => sum + d.received, 0) /
                  timeSeriesData.reduce((sum, d) => sum + d.nominated, 0)) * 100
                ).toFixed(1)}%
              </p>
            </div>
            <div className="p-3 bg-flare/5 border border-flare/20 rounded-lg">
              <p className="text-xs text-ink/60 mb-1">Average Daily Gap</p>
              <p className="text-2xl font-bold text-flare tabular-nums">
                {formatNumber(timeSeriesData.reduce((sum, d) => sum + d.gap, 0) / timeSeriesData.length, 0)} MMscf/d
              </p>
            </div>
            <div className="p-3 bg-accent/5 border border-accent/20 rounded-lg">
              <p className="text-xs text-ink/60 mb-1">Total Unfulfilled (14 days)</p>
              <p className="text-2xl font-bold text-accent tabular-nums">
                {formatNumber(timeSeriesData.reduce((sum, d) => sum + d.gap, 0), 0)} MMscf
              </p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <p className="text-xs text-ink/70">
              <strong>Analysis:</strong> The red line shows total customer nominated capacity (what they requested). The blue line shows actual received capacity (what was delivered). The gap represents unfulfilled nominations due to capacity constraints, maintenance, or supply issues.
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
                  formatter={(value) => formatNumber(Math.abs(Number(value) || 0), 0)}
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
                <Tooltip formatter={(value) => formatNumber(Number(value) || 0, 0)} />
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
