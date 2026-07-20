"use client";

import { useState } from "react";
import Link from "next/link";
import { assets } from "@/lib/data";
import { incidents } from "@/lib/incident-data";
import { formatNumber, formatCurrency } from "@/lib/utils";
import {
  AlertTriangle,
  TrendingDown,
  DollarSign,
  Clock,
  Activity,
  ExternalLink,
  Info,
  BarChart3,
  Target,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { cn } from "@/lib/utils";
import KPICard from "@/components/KPICard";
import type { Corridor, DefermentCause } from "@/lib/types";

export default function DefermentPage() {
  const [selectedCorridor, setSelectedCorridor] = useState<Corridor | "All">("All");
  const [timeframe, setTimeframe] = useState<"day" | "week" | "month">("day");

  // Link deferments to incidents - showing which incidents caused which deferments
  const defermentEvents = [
    {
      id: "def-001",
      asset: "ELPS",
      corridor: "Western" as Corridor,
      cause: "planned maintenance" as DefermentCause,
      volume: 320,
      value: 1200000,
      mtbf: 720,
      mttr: 48,
      incidentId: null, // Planned maintenance - no incident
      status: "ongoing" as const,
      startDate: "2026-07-15",
      impact: "Reduces transmission capacity by 12%"
    },
    {
      id: "def-002",
      asset: "OB3",
      corridor: "Eastern" as Corridor,
      cause: "unplanned breakdown" as DefermentCause,
      volume: 185,
      value: 695000,
      mtbf: 480,
      mttr: 72,
      incidentId: "inc-001", // Links to incident
      status: "ongoing" as const,
      startDate: "2026-07-16",
      impact: "Critical compressor failure affecting Eastern corridor"
    },
    {
      id: "def-003",
      asset: "Obiafu-Obrikom",
      corridor: "Eastern" as Corridor,
      cause: "third-party interference" as DefermentCause,
      volume: 95,
      value: 357000,
      mtbf: 1200,
      mttr: 24,
      incidentId: "inc-003", // Links to incident
      status: "resolved" as const,
      startDate: "2026-07-14",
      endDate: "2026-07-15",
      impact: "Pipeline vandalism - hot tap detected and isolated"
    },
    {
      id: "def-004",
      asset: "Utorogu",
      corridor: "Western" as Corridor,
      cause: "upstream supply shortfall" as DefermentCause,
      volume: 142,
      value: 533000,
      mtbf: 960,
      mttr: 36,
      incidentId: null,
      status: "ongoing" as const,
      startDate: "2026-07-17",
      impact: "Reduced feed gas from upstream producers"
    },
  ].filter((e) => selectedCorridor === "All" || e.corridor === selectedCorridor);

  const corridors: Array<Corridor | "All"> = ["All", "Eastern", "Western", "Northern"];

  // Calculate total impact on production
  const totalDeferment = defermentEvents.reduce((sum, e) => sum + e.volume, 0);
  const totalValue = defermentEvents.reduce((sum, e) => sum + e.value, 0);
  const ongoingCount = defermentEvents.filter(e => e.status === "ongoing").length;
  const incidentRelatedCount = defermentEvents.filter(e => e.incidentId !== null).length;

  // Production impact over time (mock data)
  const productionTrend = [
    { day: "Day -6", planned: 2850, actual: 2850, deferred: 0 },
    { day: "Day -5", planned: 2850, actual: 2820, deferred: 30 },
    { day: "Day -4", planned: 2850, actual: 2755, deferred: 95 },
    { day: "Day -3", planned: 2850, actual: 2708, deferred: 142 },
    { day: "Day -2", planned: 2850, actual: 2665, deferred: 185 },
    { day: "Day -1", planned: 2850, actual: 2530, deferred: 320 },
    { day: "Today", planned: 2850, actual: 2108, deferred: 742 },
  ];

  // Attribution data with accessible colors
  const attributionData = [
    { name: "Planned Maintenance", value: 320, color: "#0077BB", incidentLinked: false },
    { name: "Unplanned Breakdown", value: 185, color: "#CC3311", incidentLinked: true },
    { name: "Third-party Interference", value: 95, color: "#EE7733", incidentLinked: true },
    { name: "Upstream Shortfall", value: 142, color: "#DCDAD2", incidentLinked: false },
  ];

  // Calculate production efficiency
  const plannedProduction = 2850; // MMscf/d
  const actualProduction = plannedProduction - totalDeferment;
  const efficiencyPercent = (actualProduction / plannedProduction) * 100;

  // Find linked incident for a deferment
  const getLinkedIncident = (incidentId: string | null) => {
    if (!incidentId) return null;
    return incidents.find(inc => inc.id === incidentId);
  };

  return (
    <div className="min-h-screen">
      {/* Enhanced Header */}
      <div className="bg-white border-b border-line px-8 py-4 sticky top-0 z-20 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-ink">Deferment & Production Impact</h2>
            <p className="text-sm text-ink/60 mt-1">
              Track production losses and their root causes
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-ink/70 mr-2">Corridor:</span>
            {corridors.map((corridor) => (
              <button
                key={corridor}
                onClick={() => setSelectedCorridor(corridor)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                  selectedCorridor === corridor
                    ? "bg-primary text-white shadow-md"
                    : "bg-white border border-line text-ink/70 hover:bg-gray-50"
                )}
              >
                {corridor}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-8">
        {/* Impact KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <KPICard
            title="Total Deferment"
            value={formatNumber(totalDeferment, 0)}
            unit="MMscf/d"
            icon={TrendingDown}
            color="alert"
            contextText={`${ongoingCount} ongoing events`}
            status="live"
          />
          <KPICard
            title="Value Lost (Today)"
            value={formatCurrency(totalValue, "USD", 0)}
            unit=""
            icon={DollarSign}
            color="alert"
            contextText="Based on market prices"
            status="live"
          />
          <KPICard
            title="Production Efficiency"
            value={efficiencyPercent.toFixed(1)}
            unit="%"
            icon={Target}
            color={efficiencyPercent >= 95 ? "success" : efficiencyPercent >= 90 ? "flare" : "alert"}
            threshold={{ target: 95, tolerance: 5 }}
            contextText="Target: >95%"
            trend={{ value: -2.4, isPositive: false }}
            status="live"
          />
          <KPICard
            title="Incident-Related"
            value={incidentRelatedCount}
            unit={`of ${defermentEvents.length}`}
            icon={AlertTriangle}
            color="flare"
            contextText="Caused by incidents"
            status="live"
          />
        </div>

        {/* Production Impact Timeline */}
        <div className="kpi-card mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-ink">Production Impact Trend</h3>
            <div className="flex items-center gap-2 text-sm">
              <Activity className="w-4 h-4 text-primary" />
              <span className="text-ink/60">Planned vs Actual Production</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={productionTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DCDAD2" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} label={{ value: 'MMscf/d', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                formatter={(value) => formatNumber(Number(value) || 0, 0) + " MMscf/d"}
                contentStyle={{ backgroundColor: 'white', border: '1px solid #DCDAD2' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="planned"
                stroke="#0077BB"
                strokeWidth={2}
                name="Planned"
                strokeDasharray="5 5"
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#00AD51"
                strokeWidth={3}
                name="Actual"
              />
              <Line
                type="monotone"
                dataKey="deferred"
                stroke="#CC3311"
                strokeWidth={2}
                name="Deferred"
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 p-3 bg-alert/5 border border-alert/20 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-alert mt-0.5 flex-shrink-0" />
              <p className="text-sm text-ink/70">
                <strong className="text-alert">Accelerating trend:</strong> Deferment volumes have increased {formatNumber(742 - 0, 0)} MMscf/d over the past week,
                impacting {efficiencyPercent.toFixed(1)}% of planned production capacity.
              </p>
            </div>
          </div>
        </div>

        {/* Root Cause Attribution & Bad Actors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Attribution Chart */}
          <div className="kpi-card">
            <h3 className="text-lg font-semibold text-ink mb-4">
              Deferment Root Cause Analysis
            </h3>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={250}>
                <PieChart>
                  <Pie
                    data={attributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={(entry) => `${((entry.value / totalDeferment) * 100).toFixed(0)}%`}
                  >
                    {attributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatNumber(Number(value) || 0, 0) + " MMscf/d"} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {attributionData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: item.color }}
                      />
                      <div>
                        <span className="block">{item.name}</span>
                        {item.incidentLinked && (
                          <span className="text-xs text-alert flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Incident-linked
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="font-semibold tabular-nums">
                      {formatNumber(item.value, 0)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bad Actor Ranking */}
          <div className="kpi-card">
            <h3 className="text-lg font-semibold text-ink mb-4">
              Worst Performing Assets
            </h3>
            <div className="space-y-3">
              {[...defermentEvents]
                .sort((a, b) => b.volume - a.volume)
                .slice(0, 5)
                .map((actor, idx) => {
                  const linkedIncident = getLinkedIncident(actor.incidentId);
                  return (
                    <div
                      key={actor.id}
                      className={cn(
                        "flex items-center justify-between p-3 rounded transition-all",
                        linkedIncident
                          ? "bg-alert/10 border border-alert/20 hover:bg-alert/15"
                          : "bg-gray-50 hover:bg-gray-100"
                      )}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-lg font-bold text-alert">#{idx + 1}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-ink">{actor.asset}</p>
                            {actor.status === "ongoing" && (
                              <span className="badge-alert text-xs">ONGOING</span>
                            )}
                          </div>
                          <p className="text-xs text-ink/60 mt-0.5">{actor.cause}</p>
                          {linkedIncident && (
                            <Link
                              href="/incidents"
                              className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              View incident: {linkedIncident.title}
                            </Link>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-alert tabular-nums">
                          {formatNumber(actor.volume, 0)} MMscf/d
                        </p>
                        <p className="text-xs text-ink/60">
                          {formatCurrency(actor.value, "USD", 0)}
                        </p>
                        <div className="flex items-center gap-1 justify-end mt-1">
                          <Clock className="w-3 h-3 text-ink/40" />
                          <span className="text-xs text-ink/60">{actor.mttr}h MTTR</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Detailed Deferment Events Table */}
        <div className="kpi-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-ink">Active Deferment Events</h3>
            <div className="flex items-center gap-2 text-sm text-ink/60">
              <BarChart3 className="w-4 h-4" />
              <span>{defermentEvents.length} events tracked</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="text-left">Asset</th>
                  <th className="text-left">Corridor</th>
                  <th className="text-left">Root Cause</th>
                  <th className="text-left">Status</th>
                  <th className="text-right">Volume Loss</th>
                  <th className="text-right">Value Lost</th>
                  <th className="text-right">MTBF</th>
                  <th className="text-right">MTTR</th>
                  <th className="text-left">Linked Incident</th>
                </tr>
              </thead>
              <tbody>
                {defermentEvents.map((event) => {
                  const linkedIncident = getLinkedIncident(event.incidentId);
                  return (
                    <tr
                      key={event.id}
                      className={cn(
                        linkedIncident && "bg-alert/5"
                      )}
                    >
                      <td className="font-medium">{event.asset}</td>
                      <td>
                        <span className="badge-operational">{event.corridor}</span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "text-sm",
                              event.cause.includes("unplanned") || event.cause.includes("breakdown")
                                ? "badge-alert"
                                : event.cause.includes("third-party")
                                ? "badge-warning"
                                : "badge-operational"
                            )}
                          >
                            {event.cause}
                          </span>
                        </div>
                        <p className="text-xs text-ink/60 mt-1">{event.impact}</p>
                      </td>
                      <td>
                        {event.status === "ongoing" ? (
                          <span className="badge-alert">Ongoing</span>
                        ) : (
                          <span className="badge-success">Resolved</span>
                        )}
                      </td>
                      <td className="text-right">
                        <span className="text-alert font-semibold">{formatNumber(event.volume, 0)}</span>
                        <span className="text-xs text-ink/60 ml-1">MMscf/d</span>
                      </td>
                      <td className="text-right text-alert font-semibold">
                        {formatCurrency(event.value, "USD", 0)}
                      </td>
                      <td className="text-right tabular-nums">{formatNumber(event.mtbf, 0)} hrs</td>
                      <td className="text-right tabular-nums">{formatNumber(event.mttr, 0)} hrs</td>
                      <td>
                        {linkedIncident ? (
                          <Link
                            href="/incidents"
                            className="text-primary hover:underline flex items-center gap-1 text-sm"
                          >
                            <ExternalLink className="w-3 h-3" />
                            {linkedIncident.title.substring(0, 30)}...
                          </Link>
                        ) : (
                          <span className="text-ink/40 text-sm">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Explanation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <h4 className="font-semibold text-ink mb-2 flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              Understanding Deferments
            </h4>
            <ul className="space-y-1 text-sm text-ink/70">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong>Deferment:</strong> Reduction in planned production capacity due to operational constraints, incidents, or planned activities.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong>MTBF:</strong> Mean Time Between Failures - Average operational hours before equipment fails.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong>MTTR:</strong> Mean Time To Repair - Average hours needed to restore equipment to operation.
                </span>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-alert/10 border border-alert/20 rounded-lg">
            <h4 className="font-semibold text-alert mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Production Impact Chain
            </h4>
            <div className="space-y-2 text-sm text-ink/70">
              <div className="flex items-center gap-2">
                <span className="text-2xl">1️⃣</span>
                <span><strong>Incident occurs</strong> (equipment failure, leak, vandalism)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">2️⃣</span>
                <span><strong>Production deferred</strong> (capacity reduced by {formatNumber(totalDeferment, 0)} MMscf/d)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">3️⃣</span>
                <span><strong>Supply shortfall</strong> to downstream offtakers</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">4️⃣</span>
                <span><strong>Financial loss</strong> ({formatCurrency(totalValue, "USD", 0)}/day)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
