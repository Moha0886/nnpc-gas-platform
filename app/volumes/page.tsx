"use client";

import { useState } from "react";
import Link from "next/link";
import { getGasDayBalance, getOfftakerFlows, offtakers } from "@/lib/data";
import { formatNumber } from "@/lib/utils";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Download,
  Plus,
  Calendar as CalendarIcon,
  Droplet,
  Zap,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  BarChart2,
  Clock
} from "lucide-react";
import type { Corridor } from "@/lib/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";

// Mock historical data for trends
const last7DaysData = [
  { day: "Jul 14", produced: 2920, delivered: 2485, ufg: 16.2, ufgPercent: 0.62 },
  { day: "Jul 15", produced: 2780, delivered: 2380, ufg: 10.0, ufgPercent: 0.41 },
  { day: "Jul 16", produced: 2850, delivered: 2420, ufg: 11.9, ufgPercent: 0.47 },
  { day: "Jul 17", produced: 2815, delivered: 2398, ufg: 13.2, ufgPercent: 0.53 },
  { day: "Jul 18", produced: 2895, delivered: 2456, ufg: 14.8, ufgPercent: 0.58 },
  { day: "Jul 19", produced: 2840, delivered: 2410, ufg: 12.5, ufgPercent: 0.50 },
  { day: "Jul 20", produced: 2870, delivered: 2435, ufg: 11.3, ufgPercent: 0.46 },
];

// Mock 30-day data for current month (July 2026)
const generateMonthData = () => {
  const data = [];
  for (let i = 1; i <= 20; i++) {
    const baseProduced = 2850 + Math.sin(i / 3) * 100 + (Math.random() - 0.5) * 50;
    const delivered = baseProduced * (0.85 - Math.random() * 0.02);
    const ufg = (baseProduced - delivered) * 0.15;
    data.push({
      date: i,
      day: `Jul ${i}`,
      produced: Math.round(baseProduced),
      delivered: Math.round(delivered),
      ufg: Math.round(ufg),
      ufgPercent: (ufg / baseProduced) * 100,
    });
  }
  return data;
};

const currentMonthData = generateMonthData();

// Previous month data (June 2026) - for comparison
const previousMonthTotals = {
  totalProduced: 84500,
  totalDelivered: 71825,
  avgUfgPercent: 0.52,
  avgNetworkEfficiency: 94.2,
};

export default function VolumesPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedCorridor, setSelectedCorridor] = useState<Corridor | "All">("All");
  const [viewMode, setViewMode] = useState<"daily" | "monthly">("daily");

  const balance = getGasDayBalance();
  const flows = getOfftakerFlows(undefined, selectedCorridor === "All" ? undefined : selectedCorridor);

  // Calculate key metrics for daily view
  const networkEfficiency = ((balance.delivered / balance.receivedIntoTransmission) * 100);
  const ufgPercent = ((balance.ufg / balance.receivedIntoTransmission) * 100);
  const utilizationRate = ((balance.receivedIntoTransmission / balance.produced) * 100);

  // Calculate Month-to-Date metrics
  const mtdTotalProduced = currentMonthData.reduce((sum, d) => sum + d.produced, 0);
  const mtdTotalDelivered = currentMonthData.reduce((sum, d) => sum + d.delivered, 0);
  const mtdAvgUfgPercent = currentMonthData.reduce((sum, d) => sum + d.ufgPercent, 0) / currentMonthData.length;
  const mtdAvgNetworkEfficiency = (mtdTotalDelivered / mtdTotalProduced) * 100;

  // Month-over-Month comparisons
  const momProductionChange = ((mtdTotalProduced - previousMonthTotals.totalProduced) / previousMonthTotals.totalProduced) * 100;
  const momDeliveryChange = ((mtdTotalDelivered - previousMonthTotals.totalDelivered) / previousMonthTotals.totalDelivered) * 100;
  const momUfgChange = mtdAvgUfgPercent - previousMonthTotals.avgUfgPercent;
  const momEfficiencyChange = mtdAvgNetworkEfficiency - previousMonthTotals.avgNetworkEfficiency;

  // Prepare waterfall data for chart
  const waterfallData = [
    {
      name: "Production",
      value: balance.produced,
      fill: "#003D29",
      display: formatNumber(balance.produced, 0)
    },
    {
      name: "NGL Extracted",
      value: -balance.nglExtracted,
      fill: "#D45B13",
      display: `-${formatNumber(balance.nglExtracted, 0)}`
    },
    {
      name: "Into Transmission",
      value: balance.receivedIntoTransmission,
      fill: "#134B70",
      display: formatNumber(balance.receivedIntoTransmission, 0)
    },
    {
      name: "Fuel Gas",
      value: -balance.fuelGas,
      fill: "#D45B13",
      display: `-${formatNumber(balance.fuelGas, 0)}`
    },
    {
      name: "Delivered",
      value: balance.delivered,
      fill: "#003D29",
      display: formatNumber(balance.delivered, 0)
    },
    {
      name: "UFG",
      value: -balance.ufg,
      fill: "#C13333",
      display: `-${formatNumber(balance.ufg, 0)}`
    },
  ];

  // Power plant deliveries
  const powerOfftakers = offtakers.filter((o) => o.sector === "Power");
  const powerDeliveries = flows
    .filter((f) => powerOfftakers.some((p) => p.id === f.offtakerId))
    .map((flow) => {
      const offtaker = offtakers.find((o) => o.id === flow.offtakerId);
      return {
        ...flow,
        offtakerName: offtaker?.name || "Unknown",
        dcq: offtaker?.contractualDemand || offtaker?.firmAndEffective || 0,
      };
    });

  const corridors: Array<Corridor | "All"> = ["All", "Eastern", "Western", "Northern", "Lagos"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Header with Gradient */}
      <div className="bg-gradient-to-r from-pine to-gasblue text-white px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
              <Activity className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">National Gas Balance</h1>
              <p className="text-white/80 mt-1">
                {viewMode === "daily" ? "Daily volume tracking and accountability" : "Monthly analytics and performance trends"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm p-1 rounded-lg">
              <button
                onClick={() => setViewMode("daily")}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-2 ${
                  viewMode === "daily"
                    ? "bg-white text-pine shadow-md"
                    : "text-white/80 hover:text-white"
                }`}
              >
                <Clock className="w-4 h-4" />
                Daily
              </button>
              <button
                onClick={() => setViewMode("monthly")}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-2 ${
                  viewMode === "monthly"
                    ? "bg-white text-pine shadow-md"
                    : "text-white/80 hover:text-white"
                }`}
              >
                <BarChart2 className="w-4 h-4" />
                Monthly
              </button>
            </div>

            {viewMode === "daily" && (
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <CalendarIcon className="w-4 h-4" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent border-none text-white font-medium focus:outline-none"
                />
              </div>
            )}

            <Link
              href="/records/volumes"
              className="px-6 py-3 bg-white text-pine rounded-lg hover:bg-gray-100 transition-all flex items-center gap-2 font-semibold shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Enter Daily Balance
            </Link>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-[1600px] mx-auto">
        {/* Key Metrics Cards */}
        {viewMode === "daily" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Production */}
            <div className="bg-white rounded-xl shadow-sm border border-line p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-pine/10 rounded-lg">
                  <Droplet className="w-6 h-6 text-pine" />
                </div>
                <span className="text-xs font-semibold text-pine bg-pine/10 px-2 py-1 rounded">TODAY</span>
              </div>
              <div className="text-3xl font-bold text-ink mb-1 tabular-nums">
                {formatNumber(balance.produced, 0)}
              </div>
              <p className="text-sm text-ink/60">Total Production (MMscf/d)</p>
              <div className="mt-3 flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-green-600 font-semibold">+2.3%</span>
                <span className="text-ink/60">vs yesterday</span>
              </div>
            </div>

            {/* Delivered */}
            <div className="bg-white rounded-xl shadow-sm border border-line p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gasblue/10 rounded-lg">
                  <Zap className="w-6 h-6 text-gasblue" />
                </div>
                <span className="text-xs font-semibold text-gasblue bg-gasblue/10 px-2 py-1 rounded">DELIVERED</span>
              </div>
              <div className="text-3xl font-bold text-ink mb-1 tabular-nums">
                {formatNumber(balance.delivered, 0)}
              </div>
              <p className="text-sm text-ink/60">Customer Deliveries (MMscf/d)</p>
              <div className="mt-3 flex items-center gap-2 text-sm">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gasblue rounded-full h-2"
                    style={{ width: `${(balance.delivered / balance.produced) * 100}%` }}
                  />
                </div>
                <span className="text-ink/60 text-xs">{((balance.delivered / balance.produced) * 100).toFixed(1)}%</span>
              </div>
            </div>

            {/* Network Efficiency */}
            <div className="bg-white rounded-xl shadow-sm border border-line p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">EFFICIENCY</span>
              </div>
              <div className="text-3xl font-bold text-ink mb-1 tabular-nums">
                {networkEfficiency.toFixed(1)}%
              </div>
              <p className="text-sm text-ink/60">Network Efficiency</p>
              <div className="mt-3">
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
                  networkEfficiency >= 95 ? 'bg-green-50 text-green-700' :
                  networkEfficiency >= 90 ? 'bg-amber-50 text-amber-700' :
                  'bg-red-50 text-red-700'
                }`}>
                  {networkEfficiency >= 95 ? '✓ Excellent' : networkEfficiency >= 90 ? '⚠ Good' : '✗ Below Target'}
                </div>
              </div>
            </div>

            {/* UFG */}
            <div className="bg-white rounded-xl shadow-sm border border-line p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-red-50 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">UFG</span>
              </div>
              <div className="text-3xl font-bold text-ink mb-1 tabular-nums">
                {ufgPercent.toFixed(2)}%
              </div>
              <p className="text-sm text-ink/60">Unaccounted For Gas</p>
              <div className="mt-3 text-sm">
                <span className="text-ink/60">{formatNumber(balance.ufg, 1)} MMscf/d</span>
                <span className={`ml-2 ${ufgPercent <= 0.5 ? 'text-green-600' : 'text-red-600'}`}>
                  {ufgPercent <= 0.5 ? '✓ Within limit' : '⚠ Above target'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Monthly View - MTD Metrics */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* MTD Production */}
            <div className="bg-white rounded-xl shadow-sm border border-line p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-pine/10 rounded-lg">
                  <Droplet className="w-6 h-6 text-pine" />
                </div>
                <span className="text-xs font-semibold text-pine bg-pine/10 px-2 py-1 rounded">MTD</span>
              </div>
              <div className="text-3xl font-bold text-ink mb-1 tabular-nums">
                {formatNumber(mtdTotalProduced, 0)}
              </div>
              <p className="text-sm text-ink/60">Total Production (MMscf)</p>
              <div className="mt-3 flex items-center gap-2 text-sm">
                {momProductionChange >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className={`font-semibold ${momProductionChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {momProductionChange >= 0 ? '+' : ''}{momProductionChange.toFixed(1)}%
                </span>
                <span className="text-ink/60">vs last month</span>
              </div>
            </div>

            {/* MTD Delivered */}
            <div className="bg-white rounded-xl shadow-sm border border-line p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gasblue/10 rounded-lg">
                  <Zap className="w-6 h-6 text-gasblue" />
                </div>
                <span className="text-xs font-semibold text-gasblue bg-gasblue/10 px-2 py-1 rounded">MTD</span>
              </div>
              <div className="text-3xl font-bold text-ink mb-1 tabular-nums">
                {formatNumber(mtdTotalDelivered, 0)}
              </div>
              <p className="text-sm text-ink/60">Total Delivered (MMscf)</p>
              <div className="mt-3 flex items-center gap-2 text-sm">
                {momDeliveryChange >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className={`font-semibold ${momDeliveryChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {momDeliveryChange >= 0 ? '+' : ''}{momDeliveryChange.toFixed(1)}%
                </span>
                <span className="text-ink/60">vs last month</span>
              </div>
            </div>

            {/* MTD Network Efficiency */}
            <div className="bg-white rounded-xl shadow-sm border border-line p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">AVG</span>
              </div>
              <div className="text-3xl font-bold text-ink mb-1 tabular-nums">
                {mtdAvgNetworkEfficiency.toFixed(1)}%
              </div>
              <p className="text-sm text-ink/60">Avg Network Efficiency</p>
              <div className="mt-3 flex items-center gap-2 text-sm">
                {momEfficiencyChange >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className={`font-semibold ${momEfficiencyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {momEfficiencyChange >= 0 ? '+' : ''}{momEfficiencyChange.toFixed(1)}%
                </span>
                <span className="text-ink/60">vs last month</span>
              </div>
            </div>

            {/* MTD UFG */}
            <div className="bg-white rounded-xl shadow-sm border border-line p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-red-50 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">AVG</span>
              </div>
              <div className="text-3xl font-bold text-ink mb-1 tabular-nums">
                {mtdAvgUfgPercent.toFixed(2)}%
              </div>
              <p className="text-sm text-ink/60">Avg UFG Percentage</p>
              <div className="mt-3 flex items-center gap-2 text-sm">
                {momUfgChange <= 0 ? (
                  <TrendingDown className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingUp className="w-4 h-4 text-red-600" />
                )}
                <span className={`font-semibold ${momUfgChange <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {momUfgChange >= 0 ? '+' : ''}{momUfgChange.toFixed(2)}%
                </span>
                <span className="text-ink/60">vs last month</span>
              </div>
            </div>
          </div>
        )}

        {/* Gas Flow Waterfall Chart - Daily View Only */}
        {viewMode === "daily" && (
        <div className="bg-white rounded-xl shadow-sm border border-line p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-ink">Gas Flow Balance</h2>
              <p className="text-sm text-ink/60 mt-1">Production through delivery chain (MMscf/d)</p>
            </div>
            <button className="px-4 py-2 border border-line rounded-lg text-ink hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>

          {/* Visual Flow Diagram */}
          <div className="space-y-3 mb-8">
            {/* Production */}
            <div className="flex items-center gap-4">
              <div className="w-48 text-sm font-semibold text-ink">Gas Production</div>
              <div className="flex-1 flex items-center gap-3">
                <div className="relative flex-1 h-16 bg-gradient-to-r from-pine to-pine/80 rounded-lg flex items-center px-6">
                  <span className="text-2xl font-bold text-white tabular-nums">
                    {formatNumber(balance.produced, 0)}
                  </span>
                  <span className="text-white/80 ml-2 text-sm">MMscf/d</span>
                </div>
              </div>
            </div>

            {/* Arrow + NGL */}
            <div className="flex items-center gap-4 ml-12">
              <ChevronRight className="w-6 h-6 text-ink/30" />
              <div className="flex items-center gap-2 text-sm bg-flare/10 px-4 py-2 rounded-lg border border-flare/20">
                <TrendingDown className="w-4 h-4 text-flare" />
                <span className="font-semibold text-flare">-{formatNumber(balance.nglExtracted, 0)}</span>
                <span className="text-ink/60">NGL extracted (LPG + Condensate)</span>
              </div>
            </div>

            {/* Into Transmission */}
            <div className="flex items-center gap-4">
              <div className="w-48 text-sm font-semibold text-ink">Into Transmission</div>
              <div className="flex-1 flex items-center gap-3">
                <div className="relative flex-1 h-16 bg-gradient-to-r from-gasblue to-gasblue/80 rounded-lg flex items-center px-6">
                  <span className="text-2xl font-bold text-white tabular-nums">
                    {formatNumber(balance.receivedIntoTransmission, 0)}
                  </span>
                  <span className="text-white/80 ml-2 text-sm">MMscf/d</span>
                </div>
              </div>
            </div>

            {/* Arrow + Fuel + Line Pack */}
            <div className="flex items-center gap-4 ml-12">
              <ChevronRight className="w-6 h-6 text-ink/30" />
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm bg-amber-50 px-4 py-2 rounded-lg border border-amber-200">
                  <span className="font-semibold text-amber-700">-{formatNumber(balance.fuelGas, 0)}</span>
                  <span className="text-ink/60">Fuel gas</span>
                </div>
                <div className="flex items-center gap-2 text-sm bg-gray-100 px-4 py-2 rounded-lg border border-gray-200">
                  <span className="font-semibold text-ink">{balance.linePackChange >= 0 ? '+' : ''}{formatNumber(balance.linePackChange, 0)}</span>
                  <span className="text-ink/60">Line pack Δ</span>
                </div>
              </div>
            </div>

            {/* Delivered */}
            <div className="flex items-center gap-4">
              <div className="w-48 text-sm font-semibold text-ink">Customer Delivery</div>
              <div className="flex-1 flex items-center gap-3">
                <div className="relative flex-1 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center px-6">
                  <span className="text-2xl font-bold text-white tabular-nums">
                    {formatNumber(balance.delivered, 0)}
                  </span>
                  <span className="text-white/80 ml-2 text-sm">MMscf/d</span>
                </div>
              </div>
            </div>

            {/* UFG */}
            <div className="flex items-center gap-4 ml-12">
              <ChevronRight className="w-6 h-6 text-ink/30" />
              <div className="flex items-center gap-2 text-sm bg-red-50 px-4 py-2 rounded-lg border border-red-200">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="font-semibold text-red-600">-{formatNumber(balance.ufg, 0)}</span>
                <span className="text-ink/60">UFG ({ufgPercent.toFixed(2)}%)</span>
              </div>
            </div>
          </div>

          {/* Bottom note */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-ink/70">
              <strong className="text-gasblue">Mass Balance Check:</strong>{' '}
              Production ({formatNumber(balance.produced, 0)}) - NGL ({formatNumber(balance.nglExtracted, 0)})
              - Fuel Gas ({formatNumber(balance.fuelGas, 0)}) - UFG ({formatNumber(balance.ufg, 0)})
              {balance.linePackChange >= 0 ? ' - ' : ' + '}Line Pack ({formatNumber(Math.abs(balance.linePackChange), 0)})
              = {formatNumber(balance.delivered, 0)} MMscf/d delivered ✓
            </p>
          </div>
        </div>
        )}

        {viewMode === "daily" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* 7-Day Trend */}
            <div className="bg-white rounded-xl shadow-sm border border-line p-6">
              <h3 className="text-lg font-bold text-ink mb-4">7-Day Production & Delivery Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={last7DaysData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E3DC" />
                  <XAxis dataKey="day" stroke="#5A564C" fontSize={12} />
                  <YAxis stroke="#5A564C" fontSize={12} />
                  <Tooltip
                    contentStyle={{ background: 'white', border: '1px solid #DCDAD2', borderRadius: '8px' }}
                    formatter={(value) => formatNumber(Number(value), 0) + ' MMscf/d'}
                  />
                  <Area type="monotone" dataKey="produced" stroke="#003D29" fill="#003D29" fillOpacity={0.2} name="Production" />
                  <Area type="monotone" dataKey="delivered" stroke="#134B70" fill="#134B70" fillOpacity={0.2} name="Delivered" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* UFG Trend */}
            <div className="bg-white rounded-xl shadow-sm border border-line p-6">
              <h3 className="text-lg font-bold text-ink mb-4">UFG Percentage Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={last7DaysData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E3DC" />
                  <XAxis dataKey="day" stroke="#5A564C" fontSize={12} />
                  <YAxis stroke="#5A564C" fontSize={12} domain={[0, 1]} tickFormatter={(value) => `${value.toFixed(1)}%`} />
                  <Tooltip
                    contentStyle={{ background: 'white', border: '1px solid #DCDAD2', borderRadius: '8px' }}
                    formatter={(value) => `${Number(value).toFixed(2)}%`}
                  />
                  <Line type="monotone" dataKey="ufgPercent" stroke="#C13333" strokeWidth={3} name="UFG %" dot={{ fill: '#C13333', r: 4 }} />
                  {/* Target line at 0.5% */}
                  <Line type="monotone" dataKey={() => 0.5} stroke="#5A564C" strokeDasharray="5 5" strokeWidth={1} name="Target (0.5%)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <>
            {/* Monthly Trend Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-line p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-ink">Monthly Trend Analysis</h2>
                  <p className="text-sm text-ink/60 mt-1">Daily production and delivery for July 2026</p>
                </div>
                <button className="px-4 py-2 border border-line rounded-lg text-ink hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export Chart
                </button>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={currentMonthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E3DC" />
                  <XAxis dataKey="day" stroke="#5A564C" fontSize={11} />
                  <YAxis stroke="#5A564C" fontSize={11} />
                  <Tooltip
                    contentStyle={{ background: 'white', border: '1px solid #DCDAD2', borderRadius: '8px' }}
                    formatter={(value) => formatNumber(Number(value), 0) + ' MMscf/d'}
                  />
                  <Area type="monotone" dataKey="produced" stroke="#003D29" fill="#003D29" fillOpacity={0.2} name="Production" />
                  <Area type="monotone" dataKey="delivered" stroke="#134B70" fill="#134B70" fillOpacity={0.2} name="Delivered" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Month-over-Month Comparison */}
            <div className="bg-white rounded-xl shadow-sm border border-line p-6 mb-8">
              <h2 className="text-2xl font-bold text-ink mb-6">Month-over-Month Comparison</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Production Comparison */}
                <div className="p-5 bg-gradient-to-br from-pine/5 to-pine/10 rounded-xl border border-pine/20">
                  <p className="text-sm font-semibold text-ink/60 mb-3">Total Production</p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-ink/50">July 2026 (MTD)</p>
                      <p className="text-2xl font-bold text-pine tabular-nums">{formatNumber(mtdTotalProduced, 0)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-ink/50">June 2026</p>
                      <p className="text-xl font-semibold text-ink/60 tabular-nums">{formatNumber(previousMonthTotals.totalProduced, 0)}</p>
                    </div>
                    <div className="pt-2 border-t border-pine/20">
                      <div className="flex items-center gap-2">
                        {momProductionChange >= 0 ? (
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-600" />
                        )}
                        <span className={`text-lg font-bold ${momProductionChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {momProductionChange >= 0 ? '+' : ''}{momProductionChange.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Comparison */}
                <div className="p-5 bg-gradient-to-br from-gasblue/5 to-gasblue/10 rounded-xl border border-gasblue/20">
                  <p className="text-sm font-semibold text-ink/60 mb-3">Total Delivered</p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-ink/50">July 2026 (MTD)</p>
                      <p className="text-2xl font-bold text-gasblue tabular-nums">{formatNumber(mtdTotalDelivered, 0)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-ink/50">June 2026</p>
                      <p className="text-xl font-semibold text-ink/60 tabular-nums">{formatNumber(previousMonthTotals.totalDelivered, 0)}</p>
                    </div>
                    <div className="pt-2 border-t border-gasblue/20">
                      <div className="flex items-center gap-2">
                        {momDeliveryChange >= 0 ? (
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-600" />
                        )}
                        <span className={`text-lg font-bold ${momDeliveryChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {momDeliveryChange >= 0 ? '+' : ''}{momDeliveryChange.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Efficiency Comparison */}
                <div className="p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                  <p className="text-sm font-semibold text-ink/60 mb-3">Network Efficiency</p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-ink/50">July 2026 (Avg)</p>
                      <p className="text-2xl font-bold text-green-700 tabular-nums">{mtdAvgNetworkEfficiency.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-ink/50">June 2026 (Avg)</p>
                      <p className="text-xl font-semibold text-ink/60 tabular-nums">{previousMonthTotals.avgNetworkEfficiency.toFixed(1)}%</p>
                    </div>
                    <div className="pt-2 border-t border-green-200">
                      <div className="flex items-center gap-2">
                        {momEfficiencyChange >= 0 ? (
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-600" />
                        )}
                        <span className={`text-lg font-bold ${momEfficiencyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {momEfficiencyChange >= 0 ? '+' : ''}{momEfficiencyChange.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* UFG Comparison */}
                <div className="p-5 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200">
                  <p className="text-sm font-semibold text-ink/60 mb-3">UFG Percentage</p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-ink/50">July 2026 (Avg)</p>
                      <p className="text-2xl font-bold text-red-700 tabular-nums">{mtdAvgUfgPercent.toFixed(2)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-ink/50">June 2026 (Avg)</p>
                      <p className="text-xl font-semibold text-ink/60 tabular-nums">{previousMonthTotals.avgUfgPercent.toFixed(2)}%</p>
                    </div>
                    <div className="pt-2 border-t border-red-200">
                      <div className="flex items-center gap-2">
                        {momUfgChange <= 0 ? (
                          <TrendingDown className="w-5 h-5 text-green-600" />
                        ) : (
                          <TrendingUp className="w-5 h-5 text-red-600" />
                        )}
                        <span className={`text-lg font-bold ${momUfgChange <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {momUfgChange >= 0 ? '+' : ''}{momUfgChange.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar View */}
            <div className="bg-white rounded-xl shadow-sm border border-line p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-ink">July 2026 Calendar View</h2>
                  <p className="text-sm text-ink/60 mt-1">Daily production volumes by date</p>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-3">
                {/* Day headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center text-xs font-semibold text-ink/60 py-2">
                    {day}
                  </div>
                ))}

                {/* Empty cells for days before month starts (July 1, 2026 is a Wednesday) */}
                {[...Array(3)].map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {/* Calendar days */}
                {currentMonthData.map((dayData) => {
                  const performanceRatio = dayData.delivered / dayData.produced;
                  const bgColor =
                    performanceRatio >= 0.87 ? 'bg-green-100 border-green-300' :
                    performanceRatio >= 0.84 ? 'bg-amber-100 border-amber-300' :
                    'bg-red-100 border-red-300';

                  return (
                    <div
                      key={dayData.date}
                      className={`aspect-square p-2 rounded-lg border-2 ${bgColor} hover:shadow-md transition-all cursor-pointer`}
                    >
                      <div className="flex flex-col h-full">
                        <span className="text-xs font-bold text-ink mb-1">{dayData.date}</span>
                        <div className="flex-1 flex flex-col justify-center">
                          <p className="text-xs font-semibold text-pine tabular-nums">{formatNumber(dayData.produced, 0)}</p>
                          <p className="text-[10px] text-ink/60">MMscf/d</p>
                          <p className="text-[10px] text-gasblue font-semibold mt-1 tabular-nums">
                            {(performanceRatio * 100).toFixed(0)}% eff
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-6 flex items-center gap-6 justify-center p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-green-100 border-2 border-green-300"></div>
                  <span className="text-sm text-ink/70">≥87% Efficiency</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-amber-100 border-2 border-amber-300"></div>
                  <span className="text-sm text-ink/70">84-86% Efficiency</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-red-100 border-2 border-red-300"></div>
                  <span className="text-sm text-ink/70">&lt;84% Efficiency</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Power Plant Deliveries */}
        <div className="bg-white rounded-xl shadow-sm border border-line p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-ink">Power Sector Deliveries</h2>
              <p className="text-sm text-ink/60 mt-1">Gas-to-power deliveries by corridor</p>
            </div>
            <div className="flex items-center gap-2">
              {corridors.map((corridor) => (
                <button
                  key={corridor}
                  onClick={() => setSelectedCorridor(corridor)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCorridor === corridor
                      ? "bg-gasblue text-white shadow-md"
                      : "bg-gray-100 text-ink/70 hover:bg-gray-200"
                  }`}
                >
                  {corridor}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-line">
                  <th className="text-left py-4 px-4 text-sm font-bold text-ink">Power Station</th>
                  <th className="text-center py-4 px-4 text-sm font-bold text-ink">Corridor</th>
                  <th className="text-right py-4 px-4 text-sm font-bold text-ink">DCQ</th>
                  <th className="text-right py-4 px-4 text-sm font-bold text-ink">Received</th>
                  <th className="text-right py-4 px-4 text-sm font-bold text-ink">Offtaken</th>
                  <th className="text-right py-4 px-4 text-sm font-bold text-ink">Performance</th>
                  <th className="text-center py-4 px-4 text-sm font-bold text-ink">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {powerDeliveries.length > 0 ? (
                  powerDeliveries.map((delivery) => {
                    const deliveryPercent = delivery.dcq ? (delivery.received / delivery.dcq) * 100 : 0;
                    const performance = delivery.allocated ? (delivery.offtaken / delivery.allocated) * 100 : 0;
                    const status =
                      deliveryPercent >= 90 ? "Optimal" :
                      deliveryPercent >= 70 ? "Suboptimal" : "Critical";

                    return (
                      <tr key={delivery.offtakerId} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-semibold text-ink">{delivery.offtakerName}</div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            delivery.corridor === 'Western' ? 'bg-gasblue/20 text-gasblue' :
                            delivery.corridor === 'Eastern' ? 'bg-pine/20 text-pine' :
                            delivery.corridor === 'Northern' ? 'bg-amber-100 text-amber-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {delivery.corridor}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right font-mono text-ink/70">{formatNumber(delivery.dcq, 0)}</td>
                        <td className="py-4 px-4 text-right font-mono text-ink font-semibold">{formatNumber(delivery.received, 0)}</td>
                        <td className="py-4 px-4 text-right font-mono text-gasblue font-bold">{formatNumber(delivery.offtaken, 0)}</td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  performance >= 95 ? 'bg-green-500' :
                                  performance >= 80 ? 'bg-amber-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${Math.min(performance, 100)}%` }}
                              />
                            </div>
                            <span className="font-semibold text-ink tabular-nums w-12 text-right">{performance.toFixed(0)}%</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                            status === "Optimal" ? "bg-green-100 text-green-700" :
                            status === "Suboptimal" ? "bg-amber-100 text-amber-700" :
                            "bg-red-100 text-red-700"
                          }`}>
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-ink/60">
                      No power deliveries found for {selectedCorridor} corridor
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {powerDeliveries.length > 0 && (
            <div className="mt-6 flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-8">
                <div>
                  <p className="text-sm text-ink/60">Total Capacity (DCQ)</p>
                  <p className="text-xl font-bold text-ink tabular-nums">
                    {formatNumber(powerDeliveries.reduce((sum, d) => sum + d.dcq, 0), 0)} MMscf/d
                  </p>
                </div>
                <div>
                  <p className="text-sm text-ink/60">Total Delivered</p>
                  <p className="text-xl font-bold text-gasblue tabular-nums">
                    {formatNumber(powerDeliveries.reduce((sum, d) => sum + d.offtaken, 0), 0)} MMscf/d
                  </p>
                </div>
                <div>
                  <p className="text-sm text-ink/60">Avg Performance</p>
                  <p className="text-xl font-bold text-ink tabular-nums">
                    {(powerDeliveries.reduce((sum, d) => sum + ((d.offtaken / d.allocated) * 100), 0) / powerDeliveries.length).toFixed(1)}%
                  </p>
                </div>
              </div>
              <Link
                href="/nominations"
                className="px-6 py-3 bg-gasblue text-white rounded-lg hover:bg-gasblue/90 transition-colors flex items-center gap-2 font-semibold"
              >
                View All Offtakers
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
