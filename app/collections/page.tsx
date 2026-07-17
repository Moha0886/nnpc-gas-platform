"use client";

import { useState } from "react";
import { DollarSign, AlertTriangle, TrendingDown, TrendingUp, Clock } from "lucide-react";
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
import type { Sector } from "@/lib/types";

// Overall receivables summary
const receivablesSummary = {
  totalReceivables: 2847500, // ₦ thousands (₦2.8 trillion)
  currentMonth: 125300,
  days30: 185600,
  days60: 245800,
  days90: 380200,
  over90: 1910600, // Bulk of power sector debt
  collectionRate: 38.5, // % collected vs billed
  badDebtProvision: 1423750, // 50% provision
};

// Receivables by sector
const receivablesBySector = [
  {
    sector: "Power",
    totalReceivables: 2450000, // ₦2.45 trillion
    current: 85000,
    days30: 125000,
    days60: 180000,
    days90: 295000,
    over90: 1765000,
    dso: 285, // Days Sales Outstanding
    collectionRate: 25.3,
    status: "critical",
  },
  {
    sector: "Fertiliser",
    totalReceivables: 125000,
    current: 15000,
    days30: 25000,
    days60: 30000,
    days90: 35000,
    over90: 20000,
    dso: 68,
    collectionRate: 72.5,
    status: "watch",
  },
  {
    sector: "Petrochemical",
    totalReceivables: 95000,
    current: 12000,
    days30: 18000,
    days60: 20000,
    days90: 25000,
    over90: 20000,
    dso: 58,
    collectionRate: 85.2,
    status: "good",
  },
  {
    sector: "Cement",
    totalReceivables: 85000,
    current: 8000,
    days30: 10000,
    days60: 12000,
    days90: 15000,
    over90: 40000,
    dso: 65,
    collectionRate: 78.5,
    status: "watch",
  },
  {
    sector: "LDC / distributor",
    totalReceivables: 65500,
    current: 4500,
    days30: 6500,
    days60: 3000,
    days90: 8500,
    over90: 43000,
    dso: 95,
    collectionRate: 62.8,
    status: "watch",
  },
  {
    sector: "Other industry",
    totalReceivables: 27000,
    current: 800,
    days30: 1100,
    days60: 800,
    days90: 2200,
    over90: 22100,
    dso: 115,
    collectionRate: 55.5,
    status: "watch",
  },
];

// Monthly collection trend
const collectionTrend = [
  { month: "Aug '25", billed: 125000, collected: 45000, collectionRate: 36.0 },
  { month: "Sep '25", billed: 128000, collected: 48000, collectionRate: 37.5 },
  { month: "Oct '25", billed: 130000, collected: 47000, collectionRate: 36.2 },
  { month: "Nov '25", billed: 132000, collected: 51000, collectionRate: 38.6 },
  { month: "Dec '25", billed: 135000, collected: 49000, collectionRate: 36.3 },
  { month: "Jan '26", billed: 128000, collected: 50000, collectionRate: 39.1 },
  { month: "Feb '26", billed: 126000, collected: 48000, collectionRate: 38.1 },
  { month: "Mar '26", billed: 129000, collected: 49000, collectionRate: 38.0 },
  { month: "Apr '26", billed: 131000, collected: 50000, collectionRate: 38.2 },
  { month: "May '26", billed: 133000, collected: 51000, collectionRate: 38.3 },
  { month: "Jun '26", billed: 134000, collected: 52000, collectionRate: 38.8 },
  { month: "Jul '26", billed: 136000, collected: 52500, collectionRate: 38.6 },
];

// Aging breakdown (pie chart)
const agingData = [
  { name: "Current", value: receivablesSummary.currentMonth, color: "#00AD51" },
  { name: "1-30 days", value: receivablesSummary.days30, color: "#0D5EBA" },
  { name: "31-60 days", value: receivablesSummary.days60, color: "#D98E04" },
  { month: "61-90 days", value: receivablesSummary.days90, color: "#B3402A" },
  { name: "Over 90 days", value: receivablesSummary.over90, color: "#5A1A0D" },
];

export default function CollectionsPage() {
  const [selectedSector, setSelectedSector] = useState<Sector | "All">("All");

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-line px-8 py-4">
        <h2 className="text-2xl font-bold text-ink">Revenue Assurance & Collections</h2>
        <p className="text-sm text-ink/60 mt-1">
          Receivables aging analysis, collection performance & bad debt management
        </p>
      </div>

      <div className="p-8">
        {/* Critical Alert Banner */}
        <div className="mb-6 p-6 rounded-lg border-2 bg-alert/5 border-alert">
          <div className="flex items-center gap-4">
            <AlertTriangle className="w-12 h-12 text-alert" />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-alert">CRITICAL: Power Sector Receivables</h3>
              <p className="text-sm text-ink/70 mt-1">
                ₦2.45 trillion outstanding from power sector | 86% of total receivables | Average DSO: 285 days
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-ink/60">Collection Rate</p>
              <p className="text-3xl font-bold text-alert">25.3%</p>
            </div>
          </div>
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="kpi-card bg-alert/10 border border-alert/20">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-alert" />
              <h4 className="text-sm font-medium text-ink/70">Total Receivables</h4>
            </div>
            <p className="text-2xl font-bold text-alert tabular-nums">
              ₦{(receivablesSummary.totalReceivables / 1000).toFixed(2)}T
            </p>
            <p className="text-xs text-ink/60 mt-1">₦2.8 trillion outstanding</p>
          </div>

          <div className="kpi-card">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-alert" />
              <h4 className="text-sm font-medium text-ink/70">Over 90 Days</h4>
            </div>
            <p className="text-2xl font-bold text-alert tabular-nums">
              ₦{(receivablesSummary.over90 / 1000).toFixed(2)}T
            </p>
            <p className="text-xs text-ink/60 mt-1">67% of total</p>
          </div>

          <div className="kpi-card">
            <h4 className="text-sm font-medium text-ink/70 mb-2">Collection Rate</h4>
            <p className="text-2xl font-bold text-alert tabular-nums">
              {receivablesSummary.collectionRate.toFixed(1)}%
            </p>
            <p className="text-xs text-ink/60 mt-1">Collected vs Billed</p>
          </div>

          <div className="kpi-card">
            <h4 className="text-sm font-medium text-ink/70 mb-2">Bad Debt Provision</h4>
            <p className="text-2xl font-bold text-ink/70 tabular-nums">
              ₦{(receivablesSummary.badDebtProvision / 1000).toFixed(2)}T
            </p>
            <p className="text-xs text-ink/60 mt-1">50% provision</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Aging Breakdown */}
          <div className="kpi-card">
            <h3 className="text-lg font-semibold text-ink mb-4">Receivables Aging Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={agingData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {agingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `₦${(value / 1000).toFixed(1)}B`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Collection Trend */}
          <div className="kpi-card">
            <h3 className="text-lg font-semibold text-ink mb-4">
              Monthly Billing vs Collections
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={collectionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DCDAD2" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number) => `₦${(value / 1000).toFixed(1)}B`}
                />
                <Legend />
                <Bar dataKey="billed" fill="#B3402A" name="Billed" />
                <Bar dataKey="collected" fill="#00AD51" name="Collected" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Receivables by Sector */}
        <div className="kpi-card mb-6">
          <h3 className="text-lg font-semibold text-ink mb-4">
            Receivables Aging Analysis by Sector
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-line">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-ink">Sector</th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">
                    Total (₦M)
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">
                    Current
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">
                    1-30 Days
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">
                    31-60 Days
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">
                    61-90 Days
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">
                    Over 90 Days
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">DSO</th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">
                    Collection %
                  </th>
                  <th className="text-center px-4 py-3 text-sm font-semibold text-ink">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {receivablesBySector.map((item) => (
                  <tr key={item.sector} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-ink">{item.sector}</td>
                    <td className="px-4 py-3 text-sm text-alert font-bold text-right tabular-nums">
                      {item.totalReceivables.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-primary text-right tabular-nums">
                      {item.current.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink/70 text-right tabular-nums">
                      {item.days30.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink/70 text-right tabular-nums">
                      {item.days60.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-alert/70 text-right tabular-nums">
                      {item.days90.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-alert font-bold text-right tabular-nums">
                      {item.over90.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-right tabular-nums">
                      <span
                        className={`font-semibold ${
                          item.dso > 120
                            ? "text-alert"
                            : item.dso > 60
                            ? "text-flare"
                            : "text-primary"
                        }`}
                      >
                        {item.dso}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right tabular-nums">
                      <span
                        className={`font-semibold ${
                          item.collectionRate < 40
                            ? "text-alert"
                            : item.collectionRate < 70
                            ? "text-flare"
                            : "text-primary"
                        }`}
                      >
                        {item.collectionRate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === "critical"
                            ? "bg-alert/10 text-alert"
                            : item.status === "watch"
                            ? "bg-flare/10 text-flare"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Collection Initiatives */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="kpi-card bg-alert/5 border border-alert/20">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-alert" />
              <h3 className="text-lg font-semibold text-ink">Power Sector Recovery Plan</h3>
            </div>
            <ul className="space-y-3 text-sm text-ink/70">
              <li className="flex items-start gap-2">
                <span className="text-alert font-bold">1.</span>
                <span>
                  <strong>FGN Payment Plan:</strong> Negotiate quarterly payment schedule with
                  Ministry of Finance for outstanding ₦2.45T
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-alert font-bold">2.</span>
                <span>
                  <strong>NBET Securitization:</strong> Work with Nigerian Bulk Electricity Trader
                  to securitize future receivables
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-alert font-bold">3.</span>
                <span>
                  <strong>Prepayment Requirement:</strong> Enforce prepayment for GenCos with DSO
                  {'>'} 180 days
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-alert font-bold">4.</span>
                <span>
                  <strong>Supply Curtailment:</strong> Reduce allocation to chronic defaulters
                  (legal framework pending)
                </span>
              </li>
            </ul>
          </div>

          <div className="kpi-card bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold text-ink">Industrial Sector Performance</h3>
            </div>
            <ul className="space-y-3 text-sm text-ink/70">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong>Fertilizer:</strong> 72.5% collection rate | DSO 68 days | Bank
                  guarantees in place
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong>Petrochemical:</strong> 85.2% collection rate | DSO 58 days | Best
                  performing sector
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong>Cement:</strong> 78.5% collection rate | DSO 65 days | Letter of credit
                  arrangements
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong>Target:</strong> Increase industrial supply to compensate for power
                  sector shortfalls
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Actions & Recommendations */}
        <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <h4 className="font-semibold text-ink mb-2">Revenue Assurance Actions</h4>
          <ul className="space-y-2 text-sm text-ink/70">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>
                <strong>Weekly DSO Monitoring:</strong> Track Days Sales Outstanding by customer,
                escalate when DSO exceeds 60 days
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>
                <strong>Automated Invoicing:</strong> Ensure timely billing within 5 days of
                delivery (currently 12-day average)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>
                <strong>Payment Plans:</strong> Structured payment agreements with customers in
                financial distress
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>
                <strong>Legal Recovery:</strong> ₦385M currently in litigation, target 15%
                recovery
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
