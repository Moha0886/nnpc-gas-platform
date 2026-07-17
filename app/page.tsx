"use client";

import { useState } from "react";
import Header from "@/components/Header";
import KPICard from "@/components/KPICard";
import CorridorFilter from "@/components/CorridorFilter";
import {
  Activity,
  TrendingUp,
  Flame,
  AlertTriangle,
  DollarSign,
  Gauge,
  Calendar,
  Zap,
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

  // Get data
  const balance = getGasDayBalance();

  // Calculate KPIs
  const ufgPercent = (balance.ufg / balance.receivedIntoTransmission) * 100;
  const networkUtilization = (balance.delivered / 6600) * 100; // Assuming total capacity of 6,600 MMscf/d
  const flareIntensity = 2.4; // Mock value as percentage of production

  // Supply Waterfall Data (starts at production now)
  const waterfallData = [
    { name: "Produced", value: balance.produced, color: "#2E6FA3" },
    { name: "NGL Extracted", value: -balance.nglExtracted, color: "#D98E04" },
    {
      name: "Into Transmission",
      value: balance.receivedIntoTransmission,
      color: "#2E6FA3",
    },
    { name: "Fuel Gas", value: -balance.fuelGas, color: "#D98E04" },
    { name: "Line Pack Δ", value: -balance.linePackChange, color: "#DCDAD2" },
    { name: "Delivered", value: balance.delivered, color: "#0F4C42" },
    { name: "UFG", value: -balance.ufg, color: "#B3402A" },
  ];

  // Flare Intensity Trend (mock 7-day trend)
  const flareTrend = [
    { day: "Day -6", intensity: 2.8 },
    { day: "Day -5", intensity: 2.6 },
    { day: "Day -4", intensity: 2.7 },
    { day: "Day -3", intensity: 2.5 },
    { day: "Day -2", intensity: 2.3 },
    { day: "Day -1", intensity: 2.5 },
    { day: "Today", intensity: 2.4 },
  ];

  // Deferment Attribution (mock)
  const defermentData = [
    { name: "Planned Maintenance", value: 320, color: "#2E6FA3" },
    { name: "Unplanned Breakdown", value: 185, color: "#B3402A" },
    { name: "Third-party", value: 95, color: "#D98E04" },
    { name: "Upstream Shortfall", value: 142, color: "#DCDAD2" },
    { name: "Offtaker Rejection", value: 78, color: "#0F4C42" },
  ];

  return (
    <div className="min-h-screen">
      {/* Header with Corridor Filter */}
      <div className="bg-white border-b border-line px-8 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-ink">Executive Overview</h2>
          <CorridorFilter onChange={setSelectedCorridor} />
        </div>
      </div>

      <div className="p-8">
        {/* KPI Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Produced (Gas Day)"
            value={formatNumber(balance.produced, 0)}
            unit="MMscf/d"
            icon={Activity}
            color="accent"
            trend={{ value: 2.3, isPositive: true }}
          />
          <KPICard
            title="Delivered"
            value={formatNumber(balance.delivered, 0)}
            unit="MMscf/d"
            icon={TrendingUp}
            color="primary"
            trend={{ value: 1.8, isPositive: true }}
          />
          <KPICard
            title="UFG %"
            value={ufgPercent.toFixed(1)}
            unit="%"
            icon={AlertTriangle}
            color="alert"
            trend={{ value: -0.3, isPositive: true }}
          />
          <KPICard
            title="Network Utilisation"
            value={networkUtilization.toFixed(1)}
            unit="%"
            icon={Gauge}
            color="primary"
            trend={{ value: 0.5, isPositive: true }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Flare Intensity"
            value={flareIntensity.toFixed(1)}
            unit="% of production"
            icon={Flame}
            color="flare"
            trend={{ value: -0.4, isPositive: true }}
          />
          <KPICard
            title="Deferment QTD"
            value={formatNumber(820, 0)}
            unit="MMscf"
            icon={AlertTriangle}
            color="alert"
          />
          <KPICard
            title="Receivables"
            value={formatNumber(2450, 0)}
            unit="₦M"
            icon={DollarSign}
            color="alert"
          />
          <KPICard
            title="DSO (Power Sector)"
            value="143"
            unit="days"
            icon={Calendar}
            color="alert"
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

          {/* Flare Intensity Trend */}
          <div className="kpi-card">
            <h3 className="text-lg font-semibold text-ink mb-4">
              Flare Intensity Trend (% of Production)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={flareTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DCDAD2" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  domain={[0, 4]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                <Line
                  type="monotone"
                  dataKey="intensity"
                  stroke="#D98E04"
                  strokeWidth={3}
                  dot={{ fill: "#D98E04", r: 4 }}
                />
              </LineChart>
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
