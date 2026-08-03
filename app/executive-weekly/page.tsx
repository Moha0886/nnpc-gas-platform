"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, Calendar, Download, Printer } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { nationalProduction, elpsPressureData } from "@/lib/nnpc-operational-data";

export default function ExecutiveWeeklyDashboard() {
  const [weekEnding, setWeekEnding] = useState("2026-08-03");

  // Sample data matching the PDF - Week ending Aug 3, 2026
  const weeklyData = {
    totalProduction: 7.78, // Bcfd
    productionChange: 0.046, // Bcfd (0.6% w/w)
    productionChangePercent: 0.6,

    elpsSupply: 1.44, // Bcfd
    elpsSupplyChange: 0.7,
    elpsOfftake: 1.25, // Bcfd
    elpsOfftakeChange: 3.7,

    utilization: {
      domestic: { volume: 1.835, change: 59, changePercent: 3.3, percentage: 24 },
      export: { volume: 3.352, change: 92, changePercent: 2.8, percentage: 43 },
      reinjection: { volume: 1.839, change: 136, changePercent: 8.0, percentage: 24 },
      flared: { volume: 0.471, change: -4, changePercent: -0.8, percentage: 6 },
      linePack: { percentage: 3 },
    },

    production: {
      jv: { current: 57, previous: 56 },
      psc: { current: 25, previous: 25 },
      neplInd: { current: 18, previous: 19 },
    },

    subCategories: {
      power: { volume: 534.70, change: 26.2, changePercent: 4.9 },
      dfl: { volume: 176.87, change: 7.6, changePercent: 4.4 },
      indorama: { volume: 174.97, change: 6.1, changePercent: 3.6 },
    },

    powerWestNorth: [
      { name: "Transcorp Ughelli", allocation: 51.5, offtake: 51.5 },
      { name: "NIPP Olorunsogo", allocation: 52.0, offtake: 27.6 },
      { name: "NIPP Omotosho", allocation: 49.0, offtake: 22.2 },
      { name: "NIPP Geregu", allocation: 65.0, offtake: 16.5 },
      { name: "Azura Power", allocation: 100.0, offtake: 95.0 },
      { name: "NIPP Sapele", allocation: 30.0, offtake: 0 },
    ],

    powerEastern: [
      { name: "TRANS AFAM", allocation: 20.0, offtake: 12.9 },
      { name: "NDPHC CALABAR", allocation: 62.0, offtake: 57.3 },
      { name: "FIPL AFAM", allocation: 95.0, offtake: 0 },
      { name: "AFAM VI", allocation: 180.0, offtake: 57.6 },
      { name: "OKPAI -PHASE 1", allocation: 170.0, offtake: 23.6 },
    ],

    ngmlSales: [
      { date: "22-May", allocation: 520, offtake: 378 },
      { date: "23-May", allocation: 536, offtake: 320 },
      { date: "24-May", allocation: 528, offtake: 450 },
      { date: "25-May", allocation: 510, offtake: 302 },
      { date: "26-May", allocation: 558, offtake: 337 },
      { date: "27-May", allocation: 545, offtake: 332 },
      { date: "28-May", allocation: 550, offtake: 403 },
    ],

    highlights: [
      "Average weekly gas production was 7.80Bcfd compared to 7.55Bcfd produced the previous week",
      "This translated to an average gas production increase of 242mmscfd, driven by Producer CNL-Escravos and Seplat Oben",
      "Gas supply to export increased by 92mmscfd, mainly driven by NLNG",
      "Supply to domestic increased by 59mmscfd, driven by improved injection from NEPL Utorogu",
      "Power Plant Offtake ⇒ 27% of domestic gas supply, with Western/North at 90% of allocation",
      "DFL: 4.4% w/w to 176.87MMscfd (1.24Bcf); 98% of allocation",
      "Indorama: 3.6% w/w to 174.97MMscfd (1.22Bcf) driven by NEPL/Oando JV",
    ],
  };

  // Calculate GBI (Gas Balance Index)
  const calculateGBI = (data: typeof weeklyData.powerWestNorth) => {
    const totalAllocation = data.reduce((sum, item) => sum + item.allocation, 0);
    const totalOfftake = data.reduce((sum, item) => sum + item.offtake, 0);
    return totalAllocation > 0 ? (totalOfftake / totalAllocation) * 100 : 0;
  };

  const gbiWestNorth = calculateGBI(weeklyData.powerWestNorth);
  const gbiEastern = calculateGBI(weeklyData.powerEastern);

  // GBI Trend data (7-day mock data)
  const gbiTrendData = [
    { date: "1-Jan", nomination: 250, allocation: 220, offtake: 200 },
    { date: "1-Feb", nomination: 245, allocation: 225, offtake: 210 },
    { date: "1-Mar", nomination: 260, allocation: 240, offtake: 220 },
    { date: "30-Apr", nomination: 265, allocation: 245, offtake: 225 },
    { date: "30-May", nomination: 270, allocation: 250, offtake: 230 },
  ];

  const TrendBadge = ({ value, isPositive }: { value: number; isPositive?: boolean }) => {
    const positive = isPositive !== undefined ? isPositive : value >= 0;
    return (
      <span className={`inline-flex items-center gap-1 font-bold ${positive ? 'text-success' : 'text-alert'}`}>
        {positive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
        {positive ? '+' : ''}{value.toFixed(1)}% w/w
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1B5E3E] to-[#2B5F75] text-white px-8 py-6 print:bg-white print:text-ink">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Domestic Market Performance</h1>
            <p className="text-white/90 mt-1 print:text-ink/70">Week-ending {new Date(weekEnding).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
          </div>
          <div className="flex items-center gap-3 print:hidden">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <input
                type="date"
                value={weekEnding}
                onChange={(e) => setWeekEnding(e.target.value)}
                className="px-3 py-2 rounded bg-white/20 border border-white/30 text-white"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded border border-white/30">
              <Download className="w-4 h-4" />
              Excel
            </button>
            <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded border border-white/30">
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-[1600px] mx-auto">
        {/* Top Hero Metrics Row */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {/* Total Gas Production */}
          <div className="bg-white border-2 border-[#1B5E3E] rounded-lg p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-ink/60 mb-2">Total Gas Production</p>
              <div className="mb-2">
                <span className="text-6xl font-bold text-[#1B5E3E] tabular-nums">{weeklyData.totalProduction}</span>
                <span className="text-2xl font-bold text-[#1B5E3E]">Bcfd</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <TrendBadge value={weeklyData.productionChangePercent} />
              </div>
              <p className="text-sm text-ink/50 mt-1">YTD Avg. 7.66Bcfd</p>
            </div>
            <div className="mt-4 pt-4 border-t border-line">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#1B5E3E]/5 px-2 py-1 rounded">
                  <p className="text-ink/60">Domestic</p>
                  <p className="font-bold text-[#1B5E3E]">{weeklyData.utilization.domestic.percentage}%</p>
                  <p className="text-[10px]">{weeklyData.utilization.domestic.volume.toFixed(2)}Bcfd</p>
                </div>
                <div className="bg-blue-500/5 px-2 py-1 rounded">
                  <p className="text-ink/60">Export</p>
                  <p className="font-bold text-blue-600">{weeklyData.utilization.export.percentage}%</p>
                  <p className="text-[10px]">{weeklyData.utilization.export.volume.toFixed(2)}Bcfd</p>
                </div>
                <div className="bg-amber-500/5 px-2 py-1 rounded">
                  <p className="text-ink/60">Reinjection</p>
                  <p className="font-bold text-amber-600">{weeklyData.utilization.reinjection.percentage}%</p>
                  <p className="text-[10px]">{weeklyData.utilization.reinjection.volume.toFixed(2)}Bcfd</p>
                </div>
                <div className="bg-alert/5 px-2 py-1 rounded">
                  <p className="text-ink/60">Flared</p>
                  <p className="font-bold text-alert">{weeklyData.utilization.flared.percentage}%</p>
                  <p className="text-[10px]">{weeklyData.utilization.flared.volume.toFixed(2)}Bcfd</p>
                </div>
              </div>
            </div>
          </div>

          {/* ELPS Gas Supply */}
          <div className="bg-white border-2 border-[#2B5F75] rounded-lg p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-ink/60 mb-2">ELPS Gas Supply</p>
              <div className="mb-2">
                <span className="text-6xl font-bold text-[#2B5F75] tabular-nums">{weeklyData.elpsSupply}</span>
                <span className="text-2xl font-bold text-[#2B5F75]">Bcfd</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <TrendBadge value={weeklyData.elpsSupplyChange} />
              </div>
              <p className="text-sm text-ink/50 mt-1">74% of domestic supply</p>
            </div>
          </div>

          {/* ELPS Offtake */}
          <div className="bg-white border-2 border-[#F9A825] rounded-lg p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-ink/60 mb-2">Offtake (ELPS)</p>
              <div className="mb-2">
                <span className="text-6xl font-bold text-[#F9A825] tabular-nums">{weeklyData.elpsOfftake}</span>
                <span className="text-2xl font-bold text-[#F9A825]">Bcfd</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <TrendBadge value={weeklyData.elpsOfftakeChange} />
              </div>
              <p className="text-sm text-ink/50 mt-1">YTD Avg. 1.299Bcfd/1.39Bcfd</p>
              <p className="text-xs text-ink/40 mt-1">87% of actual supply</p>
            </div>
          </div>

          {/* Production Contribution */}
          <div className="bg-white border-2 border-purple-600 rounded-lg p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-ink/60 mb-3">% Production Contribution</p>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs text-ink/60">JV</span>
                    <span className="text-3xl font-bold text-purple-600 tabular-nums">{weeklyData.production.jv.current}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600" style={{ width: `${weeklyData.production.jv.current}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs text-ink/60">PSC</span>
                    <span className="text-3xl font-bold text-blue-600 tabular-nums">{weeklyData.production.psc.current}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600" style={{ width: `${weeklyData.production.psc.current}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs text-ink/60">NEPL+IND</span>
                    <span className="text-3xl font-bold text-teal-600 tabular-nums">{weeklyData.production.neplInd.current}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-600" style={{ width: `${weeklyData.production.neplInd.current}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ELPS Pressure Chart */}
        <div className="bg-white border border-line rounded-lg p-6 mb-8">
          <h3 className="text-lg font-bold text-ink mb-4">ELPS Pressure (Bar) @ WGTP and Itoki</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={elpsPressureData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DCDAD2" />
              <XAxis
                dataKey="timestamp"
                tick={{ fontSize: 11 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              />
              <YAxis tick={{ fontSize: 12 }} domain={[55, 85]} />
              <Tooltip
                labelFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                formatter={(value: any) => [value.toFixed(1) + " bar", ""]}
              />
              <Legend />
              <Line type="monotone" dataKey="wgtpPressure" stroke="#0077BB" strokeWidth={2} name="Pressure @ WGTP" dot={false} />
              <Line type="monotone" dataKey="wgtpMin" stroke="#0077BB" strokeWidth={1} strokeDasharray="5 5" name="WGTP Min." dot={false} />
              <Line type="monotone" dataKey="itokiPressure" stroke="#CC3311" strokeWidth={2} name="Pressure @ Itoki" dot={false} />
              <Line type="monotone" dataKey="itokiMin" stroke="#CC3311" strokeWidth={1} strokeDasharray="5 5" name="Itoki Min." dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Power Markets Row */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Power: West/North Market */}
          <div className="bg-white border border-line rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-ink">Power: West/North Market</h3>
                <p className="text-sm text-success mt-1">
                  Offtake: 5.1% w/w to 383.34MMscfd (2.68Bcf); 90% of allocation
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-ink/60">GBI</p>
                <p className="text-3xl font-bold text-[#1B5E3E] tabular-nums">{(gbiWestNorth / 100).toFixed(2)}</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={weeklyData.powerWestNorth} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#DCDAD2" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={120} />
                <Tooltip formatter={(value: any) => value.toFixed(1) + " MMscfd"} />
                <Legend />
                <Bar dataKey="allocation" fill="#88C9A1" name="Allocation" />
                <Bar dataKey="offtake" fill="#1B5E3E" name="Offtake" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Power: Eastern Market */}
          <div className="bg-white border border-line rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-ink">Power: Eastern Market</h3>
                <p className="text-sm text-success mt-1">
                  Offtake: 4.4% w/w to 151.36MMscfd (1.06Bcf)
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-ink/60">GBI</p>
                <p className="text-3xl font-bold text-[#2B5F75] tabular-nums">{(gbiEastern / 100).toFixed(2)}</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={weeklyData.powerEastern} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#DCDAD2" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={120} />
                <Tooltip formatter={(value: any) => value.toFixed(1) + " MMscfd"} />
                <Legend />
                <Bar dataKey="allocation" fill="#7DB8D4" name="Allocation" />
                <Bar dataKey="offtake" fill="#2B5F75" name="Offtake" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GBI Trend Chart */}
        <div className="bg-white border border-line rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-ink">GBI Trend - Gas Balance Index</h3>
            <p className="text-sm text-ink/60">Nomination • Allocation • Actual Offtake</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={gbiTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DCDAD2" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: any) => value.toFixed(0) + " MMscfd"} />
              <Legend />
              <Line type="monotone" dataKey="nomination" stroke="#CC3311" strokeWidth={2} name="Nomination" dot={{ fill: '#CC3311', r: 4 }} />
              <Line type="monotone" dataKey="allocation" stroke="#F9A825" strokeWidth={2} name="Allocation" dot={{ fill: '#F9A825', r: 4 }} />
              <Line type="monotone" dataKey="offtake" stroke="#1B5E3E" strokeWidth={2} name="Actual Offtake" dot={{ fill: '#1B5E3E', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* NGML Gas Sales Volume */}
        <div className="bg-white border border-line rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-ink">NGML Gas Sales Volume (MMscfd)</h3>
              <p className="text-sm text-success mt-1">
                483.00MMscfd (8.8% w/w) ⇒ XX% of allocation & XXX% of 2026 target
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeklyData.ngmlSales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DCDAD2" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: any) => value.toFixed(0) + " MMscfd"} />
              <Legend />
              <Bar dataKey="allocation" fill="#88C9A1" name="Allocation" />
              <Bar dataKey="offtake" fill="#1B5E3E" name="Offtake" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Key Offtakers Performance */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Power */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-600 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-blue-900">Power Plant Offtake</p>
              <TrendBadge value={weeklyData.subCategories.power.changePercent} />
            </div>
            <div className="mb-2">
              <span className="text-5xl font-bold text-blue-900 tabular-nums">{weeklyData.subCategories.power.volume.toFixed(0)}</span>
              <span className="text-xl font-bold text-blue-700 ml-1">MMscfd</span>
            </div>
            <p className="text-xs text-blue-700">
              ▲ {weeklyData.subCategories.power.change.toFixed(0)} MMscfd • 27% of domestic gas supply
            </p>
            <div className="mt-3 pt-3 border-t border-blue-300">
              <p className="text-xs text-blue-800">
                3.74Bcf (week total)
              </p>
            </div>
          </div>

          {/* DFL */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-600 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-purple-900">DFL (Dangote Fertilizer)</p>
              <TrendBadge value={weeklyData.subCategories.dfl.changePercent} />
            </div>
            <div className="mb-2">
              <span className="text-5xl font-bold text-purple-900 tabular-nums">{weeklyData.subCategories.dfl.volume.toFixed(0)}</span>
              <span className="text-xl font-bold text-purple-700 ml-1">MMscfd</span>
            </div>
            <p className="text-xs text-purple-700">
              ▲ {weeklyData.subCategories.dfl.change.toFixed(1)} MMscfd • 98% of allocation
            </p>
            <div className="mt-3 pt-3 border-t border-purple-300">
              <p className="text-xs text-purple-800">
                1.24Bcf (week total)
              </p>
            </div>
          </div>

          {/* Indorama */}
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 border-2 border-teal-600 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-teal-900">Indorama</p>
              <TrendBadge value={weeklyData.subCategories.indorama.changePercent} />
            </div>
            <div className="mb-2">
              <span className="text-5xl font-bold text-teal-900 tabular-nums">{weeklyData.subCategories.indorama.volume.toFixed(0)}</span>
              <span className="text-xl font-bold text-teal-700 ml-1">MMscfd</span>
            </div>
            <p className="text-xs text-teal-700">
              ▲ {weeklyData.subCategories.indorama.change.toFixed(1)} MMscfd • Driven by NEPL/Oando JV
            </p>
            <div className="mt-3 pt-3 border-t border-teal-300">
              <p className="text-xs text-teal-800">
                1.22Bcf (week total)
              </p>
            </div>
          </div>
        </div>

        {/* Highlights Section */}
        <div className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-[#1B5E3E] rounded-lg p-6">
          <h3 className="text-xl font-bold text-[#1B5E3E] mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-[#1B5E3E] rounded-full animate-pulse"></span>
            Highlights
          </h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {weeklyData.highlights.map((highlight, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="text-[#1B5E3E] font-bold mt-0.5">•</span>
                <p className="text-sm text-ink/80 leading-relaxed">{highlight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-between text-xs text-ink/50">
          <p>Generated: {new Date().toLocaleString()}</p>
          <div className="flex items-center gap-2">
            <img src="/nnpc-logo.png" alt="NNPC" className="h-6 opacity-50" onError={(e) => e.currentTarget.style.display = 'none'} />
            <span>NNPC Limited - Gas Value Chain</span>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page { size: landscape; margin: 0.5in; }
          .print\\:hidden { display: none !important; }
          .print\\:bg-white { background: white !important; }
          .print\\:text-ink { color: #1a1a1a !important; }
        }
      `}</style>
    </div>
  );
}
