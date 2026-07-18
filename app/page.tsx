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
import { getGasDayBalance } from "@/lib/data";
import { formatNumber, formatPercent } from "@/lib/utils";
import type { Corridor } from "@/lib/types";

export default function ExecutiveOverview() {
  const [selectedCorridor, setSelectedCorridor] = useState<Corridor | "All">("All");
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [timeAgo, setTimeAgo] = useState("just now");

  // Get data
  const balance = getGasDayBalance();

  // Calculate KPIs
  const ufgPercent = (balance.ufg / balance.receivedIntoTransmission) * 100;
  const networkUtilization = (balance.delivered / 6600) * 100; // Assuming total capacity of 6,600 MMscf/d

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
