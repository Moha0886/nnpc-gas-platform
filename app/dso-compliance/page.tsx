"use client";

import { useState } from "react";
import { AlertTriangle, TrendingUp, TrendingDown, CheckCircle, XCircle } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { Corridor } from "@/lib/types";

// Mock DSO data
const currentMonthDSO = {
  totalAGProduction: 2850.5, // MMscf/d Associated Gas
  domesticSupply: 1795.3, // MMscf/d
  exportSupply: 1055.2, // MMscf/d (to NLNG)
  domesticPercent: 63.0,
  requiredPercent: 60.0,
  status: "compliant" as "compliant" | "non-compliant",
  variance: 3.0, // percentage points above/below requirement
};

// Historical DSO compliance (last 12 months)
const historicalCompliance = [
  { month: "Aug '25", domestic: 58.2, export: 41.8, compliant: false },
  { month: "Sep '25", domestic: 59.1, export: 40.9, compliant: false },
  { month: "Oct '25", domestic: 60.5, export: 39.5, compliant: true },
  { month: "Nov '25", domestic: 61.2, export: 38.8, compliant: true },
  { month: "Dec '25", domestic: 59.8, export: 40.2, compliant: false },
  { month: "Jan '26", domestic: 62.1, export: 37.9, compliant: true },
  { month: "Feb '26", domestic: 61.5, export: 38.5, compliant: true },
  { month: "Mar '26", domestic: 60.8, export: 39.2, compliant: true },
  { month: "Apr '26", domestic: 62.3, export: 37.7, compliant: true },
  { month: "May '26", domestic: 61.9, export: 38.1, compliant: true },
  { month: "Jun '26", domestic: 62.7, export: 37.3, compliant: true },
  { month: "Jul '26", domestic: 63.0, export: 37.0, compliant: true },
];

// Corridor breakdown
const corridorBreakdown = [
  {
    corridor: "Eastern",
    agProduction: 1250.5,
    domestic: 825.3,
    export: 425.2,
    domesticPercent: 66.0,
    status: "compliant",
  },
  {
    corridor: "Western",
    agProduction: 980.2,
    domestic: 598.7,
    export: 381.5,
    domesticPercent: 61.1,
    status: "compliant",
  },
  {
    corridor: "Lagos",
    agProduction: 450.8,
    domestic: 258.3,
    export: 192.5,
    domesticPercent: 57.3,
    status: "non-compliant",
  },
  {
    corridor: "Northern",
    agProduction: 169.0,
    domestic: 113.0,
    export: 56.0,
    domesticPercent: 66.9,
    status: "compliant",
  },
];

// Penalty exposure (if non-compliant)
const penaltyCalculation = {
  shortfallVolume: 0, // MMscf/d (if domestic < 60%)
  penaltyRate: 10000, // NGN per MMscf/d per day
  dailyPenalty: 0,
  monthlyPenalty: 0,
};

export default function DSOCompliancePage() {
  const [selectedPeriod, setSelectedPeriod] = useState<"month" | "quarter" | "year">("month");

  const pieData = [
    { name: "Domestic Supply", value: currentMonthDSO.domesticSupply, color: "#00AD51" },
    { name: "Export (NLNG)", value: currentMonthDSO.exportSupply, color: "#0D5EBA" },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-line px-8 py-4">
        <h2 className="text-2xl font-bold text-ink">Domestic Supply Obligation (DSO) Compliance</h2>
        <p className="text-sm text-ink/60 mt-1">
          Monitoring compliance with 60% domestic supply requirement for Associated Gas
        </p>
      </div>

      <div className="p-8">
        {/* Status Banner */}
        <div
          className={`mb-6 p-6 rounded-lg border-2 ${
            currentMonthDSO.status === "compliant"
              ? "bg-primary/5 border-primary"
              : "bg-alert/5 border-alert"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {currentMonthDSO.status === "compliant" ? (
                <CheckCircle className="w-12 h-12 text-primary" />
              ) : (
                <XCircle className="w-12 h-12 text-alert" />
              )}
              <div>
                <h3 className="text-2xl font-bold text-ink">
                  {currentMonthDSO.status === "compliant" ? "COMPLIANT" : "NON-COMPLIANT"}
                </h3>
                <p className="text-sm text-ink/70 mt-1">
                  Current Month: {currentMonthDSO.domesticPercent.toFixed(1)}% Domestic Supply
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-ink/60">Variance from Requirement</p>
              <div className="flex items-center gap-2 justify-end mt-1">
                {currentMonthDSO.variance >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-primary" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-alert" />
                )}
                <span
                  className={`text-2xl font-bold ${
                    currentMonthDSO.variance >= 0 ? "text-primary" : "text-alert"
                  }`}
                >
                  {currentMonthDSO.variance >= 0 ? "+" : ""}
                  {currentMonthDSO.variance.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="kpi-card">
            <h4 className="text-sm font-medium text-ink/70 mb-2">Total AG Production</h4>
            <p className="text-2xl font-bold text-ink tabular-nums">
              {currentMonthDSO.totalAGProduction.toFixed(1)}
            </p>
            <p className="text-xs text-ink/60 mt-1">MMscf/d</p>
          </div>

          <div className="kpi-card bg-primary/5">
            <h4 className="text-sm font-medium text-ink/70 mb-2">Domestic Supply</h4>
            <p className="text-2xl font-bold text-primary tabular-nums">
              {currentMonthDSO.domesticSupply.toFixed(1)}
            </p>
            <p className="text-xs text-ink/60 mt-1">
              MMscf/d ({currentMonthDSO.domesticPercent.toFixed(1)}%)
            </p>
          </div>

          <div className="kpi-card bg-accent/5">
            <h4 className="text-sm font-medium text-ink/70 mb-2">Export Supply (NLNG)</h4>
            <p className="text-2xl font-bold text-accent tabular-nums">
              {currentMonthDSO.exportSupply.toFixed(1)}
            </p>
            <p className="text-xs text-ink/60 mt-1">
              MMscf/d ({(100 - currentMonthDSO.domesticPercent).toFixed(1)}%)
            </p>
          </div>

          <div className="kpi-card">
            <h4 className="text-sm font-medium text-ink/70 mb-2">Required Domestic %</h4>
            <p className="text-2xl font-bold text-alert tabular-nums">
              {currentMonthDSO.requiredPercent.toFixed(0)}%
            </p>
            <p className="text-xs text-ink/60 mt-1">Regulatory minimum</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Domestic vs Export Split */}
          <div className="kpi-card">
            <h3 className="text-lg font-semibold text-ink mb-4">Current Month Split</h3>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `${value.toFixed(1)} MMscf/d`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Historical Compliance Trend */}
          <div className="kpi-card">
            <h3 className="text-lg font-semibold text-ink mb-4">
              12-Month Compliance Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicalCompliance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DCDAD2" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  domain={[50, 70]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                <Legend />
                {/* Reference line at 60% */}
                <Line
                  type="monotone"
                  dataKey="domestic"
                  stroke="#00AD51"
                  strokeWidth={3}
                  name="Domestic %"
                  dot={{ fill: "#00AD51", r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="export"
                  stroke="#0D5EBA"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Export %"
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-2 p-2 bg-primary/10 rounded text-xs text-ink/70 text-center">
              60% threshold line (green) | Compliant: {historicalCompliance.filter(m => m.compliant).length}/12 months
            </div>
          </div>
        </div>

        {/* Corridor Breakdown */}
        <div className="kpi-card mb-6">
          <h3 className="text-lg font-semibold text-ink mb-4">DSO Compliance by Corridor</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-line">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-ink">Corridor</th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">
                    AG Production (MMscf/d)
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">
                    Domestic (MMscf/d)
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">
                    Export (MMscf/d)
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">
                    Domestic %
                  </th>
                  <th className="text-center px-4 py-3 text-sm font-semibold text-ink">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {corridorBreakdown.map((corridor) => (
                  <tr key={corridor.corridor} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-ink">
                      {corridor.corridor}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink text-right tabular-nums">
                      {corridor.agProduction.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-sm text-primary font-semibold text-right tabular-nums">
                      {corridor.domestic.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-sm text-accent text-right tabular-nums">
                      {corridor.export.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right tabular-nums">
                      <span
                        className={`font-bold ${
                          corridor.domesticPercent >= 60 ? "text-primary" : "text-alert"
                        }`}
                      >
                        {corridor.domesticPercent.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          corridor.status === "compliant"
                            ? "bg-primary/10 text-primary"
                            : "bg-alert/10 text-alert"
                        }`}
                      >
                        {corridor.status === "compliant" ? "Compliant" : "Non-Compliant"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Penalty Information */}
        <div className="kpi-card bg-alert/5 border border-alert/20">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-alert" />
            <h3 className="text-lg font-semibold text-ink">Penalty Exposure (If Non-Compliant)</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-ink/70 mb-1">Shortfall Volume</p>
              <p className="text-xl font-bold text-alert tabular-nums">
                {penaltyCalculation.shortfallVolume.toFixed(1)} MMscf/d
              </p>
            </div>
            <div>
              <p className="text-sm text-ink/70 mb-1">Penalty Rate</p>
              <p className="text-xl font-bold text-ink tabular-nums">
                ₦{penaltyCalculation.penaltyRate.toLocaleString()}/MMscf/d
              </p>
            </div>
            <div>
              <p className="text-sm text-ink/70 mb-1">Daily Penalty</p>
              <p className="text-xl font-bold text-alert tabular-nums">
                ₦{penaltyCalculation.dailyPenalty.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-ink/70 mb-1">Monthly Exposure</p>
              <p className="text-xl font-bold text-alert tabular-nums">
                ₦{penaltyCalculation.monthlyPenalty.toLocaleString()}
              </p>
            </div>
          </div>
          <p className="text-xs text-ink/60 mt-4">
            * Penalties apply when domestic supply falls below 60% of AG production as per DPR/NUPRC regulations
          </p>
        </div>

        {/* Regulatory Notice */}
        <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <h4 className="font-semibold text-ink mb-2">Regulatory Framework</h4>
          <ul className="space-y-2 text-sm text-ink/70">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>
                <strong>Domestic Supply Obligation (DSO):</strong> Minimum 60% of Associated Gas
                must be supplied to the domestic market (DPR/NUPRC regulation)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>
                <strong>Measurement:</strong> Calculated monthly based on total AG production vs
                domestic allocation
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>
                <strong>Exemptions:</strong> Non-Associated Gas (NAG) and gas dedicated to LNG
                feedstock may have different obligations
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>
                <strong>Reporting:</strong> Monthly compliance reports must be submitted to
                NUPRC/DPR
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
