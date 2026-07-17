"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  FileText,
  Activity,
  Gauge,
  Flame,
  AlertTriangle,
  Download,
  Calendar,
  Filter,
} from "lucide-react";
import type { Corridor } from "@/lib/types";

const reportTypes = [
  {
    id: "production",
    name: "Production Reports",
    description: "Daily production records from upstream facilities",
    icon: TrendingUp,
    href: "/reports/production",
    color: "bg-accent/10 text-accent",
    recordCount: 245,
  },
  {
    id: "nominations",
    name: "Nominations Reports",
    description: "Customer gas demand and allocation records",
    icon: FileText,
    href: "/reports/nominations",
    color: "bg-primary/10 text-primary",
    recordCount: 312,
  },
  {
    id: "flows",
    name: "Flow Readings Reports",
    description: "Pipeline flow, pressure, and temperature data",
    icon: Activity,
    href: "/reports/flows",
    color: "bg-accent/10 text-accent",
    recordCount: 1856,
  },
  {
    id: "deliveries",
    name: "Delivery Records Reports",
    description: "Metered volumes delivered to offtakers",
    icon: Gauge,
    href: "/reports/deliveries",
    color: "bg-primary/10 text-primary",
    recordCount: 428,
  },
  {
    id: "flare",
    name: "Flare Events Reports",
    description: "Flare volumes and penalty exposure",
    icon: Flame,
    href: "/reports/flare",
    color: "bg-flare/10 text-flare",
    recordCount: 67,
  },
  {
    id: "deferment",
    name: "Deferment Events Reports",
    description: "Deferments, causes, and value impact",
    icon: AlertTriangle,
    href: "/reports/deferment",
    color: "bg-alert/10 text-alert",
    recordCount: 89,
  },
];

export default function ReportsPage() {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState(new Date().toISOString().split("T")[0]);
  const [selectedCorridor, setSelectedCorridor] = useState<Corridor | "All">("All");

  const corridors: Array<Corridor | "All"> = ["All", "Eastern", "Western", "Northern", "Lagos"];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-line px-8 py-4">
        <h2 className="text-2xl font-bold text-ink">Reports & Analytics</h2>
        <p className="text-sm text-ink/60 mt-1">
          Generate and export operations reports by type, date range, and corridor
        </p>
      </div>

      <div className="p-8">
        {/* Global Filters */}
        <div className="kpi-card mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Filter className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-ink">Global Filters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-2">
                Date From
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink/70 mb-2">
                Date To
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink/70 mb-2">
                Corridor
              </label>
              <select
                value={selectedCorridor}
                onChange={(e) => setSelectedCorridor(e.target.value as Corridor | "All")}
                className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {corridors.map((corridor) => (
                  <option key={corridor} value={corridor}>
                    {corridor}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="text-xs text-ink/60 mt-3">
            These filters will be applied to all report types below
          </p>
        </div>

        {/* Report Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            return (
              <Link
                key={report.id}
                href={`${report.href}?from=${dateFrom}&to=${dateTo}&corridor=${selectedCorridor}`}
                className="kpi-card hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${report.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-ink group-hover:text-primary transition-colors">
                      {report.name}
                    </h3>
                    <p className="text-sm text-ink/60 mt-1">
                      {report.description}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-2xl font-bold text-primary tabular-nums">
                        {report.recordCount}
                      </span>
                      <span className="text-xs text-ink/60">records</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="kpi-card bg-primary/5">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-primary" />
              <h4 className="font-semibold text-ink">Daily Summary</h4>
            </div>
            <p className="text-sm text-ink/60 mb-3">
              Generate consolidated daily operations report
            </p>
            <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-600 transition-colors w-full">
              Generate Today's Summary
            </button>
          </div>

          <div className="kpi-card bg-accent/5">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-5 h-5 text-accent" />
              <h4 className="font-semibold text-ink">Monthly Dashboard</h4>
            </div>
            <p className="text-sm text-ink/60 mb-3">
              Executive monthly performance dashboard
            </p>
            <button className="px-4 py-2 bg-accent text-white rounded-lg text-sm hover:bg-accent-600 transition-colors w-full">
              Generate Monthly Report
            </button>
          </div>

          <div className="kpi-card bg-flare/5">
            <div className="flex items-center gap-3 mb-2">
              <Download className="w-5 h-5 text-flare" />
              <h4 className="font-semibold text-ink">Bulk Export</h4>
            </div>
            <p className="text-sm text-ink/60 mb-3">
              Export all records within date range
            </p>
            <button className="px-4 py-2 bg-flare text-white rounded-lg text-sm hover:bg-flare-600 transition-colors w-full">
              Export All Data
            </button>
          </div>
        </div>

        {/* Report Guidelines */}
        <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <h4 className="font-semibold text-ink mb-2">Report Generation Guidelines</h4>
          <ul className="space-y-1 text-sm text-ink/70">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>
                <strong>Date Range:</strong> Select date from/to to filter records. Leave "Date From" empty for all historical records.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>
                <strong>Export Formats:</strong> All reports can be exported to Excel (.xlsx) or PDF.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>
                <strong>Scheduling:</strong> Set up automated daily/weekly/monthly email reports (coming soon).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>
                <strong>Access Control:</strong> Report access is role-based. You can only view records for your assigned corridors.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
