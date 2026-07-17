"use client";

import { useState } from "react";
import { FileCheck, AlertCircle, DollarSign, TrendingDown } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { Corridor, Sector } from "@/lib/types";

// Take-or-Pay contracts with shortfall tracking
const topContracts = [
  {
    id: "top-001",
    contractNumber: "GSA-EGBIN-2024",
    customer: "Egbin Power Station",
    corridor: "Eastern" as Corridor,
    sector: "Power" as Sector,
    topObligation: 80, // % of DCQ
    dcq: 125.0, // MMscf/d
    topVolume: 100.0, // MMscf/d (80% of 125)
    actualOfftake: 72.5, // MMscf/d
    shortfall: 27.5, // MMscf/d
    shortfallValue: 82500, // USD (27.5 MMscf/d × $3.00/MMBtu × 30 days)
    invoiced: true,
    paymentStatus: "unpaid",
    waiverRequested: false,
  },
  {
    id: "top-002",
    contractNumber: "GSA-OLORUNSOGO-2024",
    customer: "Olorunsogo Power Plant",
    corridor: "Western" as Corridor,
    sector: "Power" as Sector,
    topObligation: 80,
    dcq: 95.0,
    topVolume: 76.0,
    actualOfftake: 68.3,
    shortfall: 7.7,
    shortfallValue: 23100,
    invoiced: true,
    paymentStatus: "unpaid",
    waiverRequested: true,
  },
  {
    id: "top-003",
    contractNumber: "GSA-NOTORE-2023",
    customer: "Notore Fertilizer",
    corridor: "Western" as Corridor,
    sector: "Fertiliser" as Sector,
    topObligation: 85,
    dcq: 45.0,
    topVolume: 38.25,
    actualOfftake: 42.1,
    shortfall: 0,
    shortfallValue: 0,
    invoiced: false,
    paymentStatus: "n/a",
    waiverRequested: false,
  },
  {
    id: "top-004",
    contractNumber: "GSA-DANGOTE-2024",
    customer: "Dangote Cement",
    corridor: "Northern" as Corridor,
    sector: "Cement" as Sector,
    topObligation: 75,
    dcq: 35.0,
    topVolume: 26.25,
    actualOfftake: 21.8,
    shortfall: 4.45,
    shortfallValue: 16020,
    invoiced: true,
    paymentStatus: "paid",
    waiverRequested: false,
  },
  {
    id: "top-005",
    contractNumber: "GSA-INDORAMA-2023",
    customer: "Indorama Petrochemical",
    corridor: "Eastern" as Corridor,
    sector: "Petrochemical" as Sector,
    topObligation: 90,
    dcq: 55.0,
    topVolume: 49.5,
    actualOfftake: 52.3,
    shortfall: 0,
    shortfallValue: 0,
    invoiced: false,
    paymentStatus: "n/a",
    waiverRequested: false,
  },
  {
    id: "top-006",
    contractNumber: "GSA-GASLINK-2024",
    customer: "Gaslink Nigeria (LDC)",
    corridor: "Lagos" as Corridor,
    sector: "LDC / distributor" as Sector,
    topObligation: 80,
    dcq: 28.0,
    topVolume: 22.4,
    actualOfftake: 18.5,
    shortfall: 3.9,
    shortfallValue: 11700,
    invoiced: true,
    paymentStatus: "partial",
    waiverRequested: false,
  },
];

// Monthly TOP shortfall trend
const monthlyShortfall = [
  { month: "Aug '25", shortfallVolume: 38.5, shortfallValue: 115500 },
  { month: "Sep '25", shortfallVolume: 41.2, shortfallValue: 123600 },
  { month: "Oct '25", shortfallVolume: 45.8, shortfallValue: 137400 },
  { month: "Nov '25", shortfallVolume: 42.1, shortfallValue: 126300 },
  { month: "Dec '25", shortfallVolume: 39.6, shortfallValue: 118800 },
  { month: "Jan '26", shortfallVolume: 44.3, shortfallValue: 132900 },
  { month: "Feb '26", shortfallVolume: 46.8, shortfallValue: 140400 },
  { month: "Mar '26", shortfallVolume: 48.2, shortfallValue: 144600 },
  { month: "Apr '26", shortfallVolume: 45.9, shortfallValue: 137700 },
  { month: "May '26", shortfallVolume: 44.1, shortfallValue: 132300 },
  { month: "Jun '26", shortfallVolume: 42.7, shortfallValue: 128100 },
  { month: "Jul '26", shortfallVolume: 43.5, shortfallValue: 130500 },
];

export default function TakeOrPayPage() {
  const [selectedCorridor, setSelectedCorridor] = useState<Corridor | "All">("All");

  const totalShortfall = topContracts.reduce((sum, c) => sum + c.shortfall, 0);
  const totalValue = topContracts.reduce((sum, c) => sum + c.shortfallValue, 0);
  const invoicedValue = topContracts
    .filter((c) => c.invoiced)
    .reduce((sum, c) => sum + c.shortfallValue, 0);
  const paidValue = topContracts
    .filter((c) => c.paymentStatus === "paid")
    .reduce((sum, c) => sum + c.shortfallValue, 0);
  const waiverCount = topContracts.filter((c) => c.waiverRequested).length;

  const filteredContracts =
    selectedCorridor === "All"
      ? topContracts
      : topContracts.filter((c) => c.corridor === selectedCorridor);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-line px-8 py-4">
        <h2 className="text-2xl font-bold text-ink">Take-or-Pay Enforcement Tracker</h2>
        <p className="text-sm text-ink/60 mt-1">
          Monitoring shortfall volumes, TOP invoicing and payment status
        </p>
      </div>

      <div className="p-8">
        {/* Summary KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <div className="kpi-card bg-alert/5">
            <div className="flex items-center gap-3 mb-2">
              <TrendingDown className="w-5 h-5 text-alert" />
              <h4 className="text-sm font-medium text-ink/70">Total Shortfall</h4>
            </div>
            <p className="text-2xl font-bold text-alert tabular-nums">
              {totalShortfall.toFixed(1)}
            </p>
            <p className="text-xs text-ink/60 mt-1">MMscf/d</p>
          </div>

          <div className="kpi-card">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <h4 className="text-sm font-medium text-ink/70">TOP Value (Month)</h4>
            </div>
            <p className="text-2xl font-bold text-primary tabular-nums">
              ${(totalValue / 1000).toFixed(0)}K
            </p>
            <p className="text-xs text-ink/60 mt-1">USD</p>
          </div>

          <div className="kpi-card">
            <h4 className="text-sm font-medium text-ink/70 mb-2">Invoiced</h4>
            <p className="text-2xl font-bold text-accent tabular-nums">
              ${(invoicedValue / 1000).toFixed(0)}K
            </p>
            <p className="text-xs text-ink/60 mt-1">
              {topContracts.filter((c) => c.invoiced).length} contracts
            </p>
          </div>

          <div className="kpi-card bg-primary/5">
            <h4 className="text-sm font-medium text-ink/70 mb-2">Collected</h4>
            <p className="text-2xl font-bold text-primary tabular-nums">
              ${(paidValue / 1000).toFixed(0)}K
            </p>
            <p className="text-xs text-ink/60 mt-1">
              {((paidValue / invoicedValue) * 100).toFixed(0)}% of invoiced
            </p>
          </div>

          <div className="kpi-card">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-5 h-5 text-flare" />
              <h4 className="text-sm font-medium text-ink/70">Waiver Requests</h4>
            </div>
            <p className="text-2xl font-bold text-flare tabular-nums">{waiverCount}</p>
            <p className="text-xs text-ink/60 mt-1">Pending review</p>
          </div>
        </div>

        {/* Monthly Shortfall Trend */}
        <div className="kpi-card mb-6">
          <h3 className="text-lg font-semibold text-ink mb-4">
            12-Month TOP Shortfall Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyShortfall}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DCDAD2" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 12 }}
                label={{ value: "MMscf/d", angle: -90, position: "insideLeft" }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12 }}
                label={{ value: "USD", angle: 90, position: "insideRight" }}
              />
              <Tooltip />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="shortfallVolume"
                fill="#B3402A"
                name="Shortfall Volume (MMscf/d)"
              />
              <Bar
                yAxisId="right"
                dataKey="shortfallValue"
                fill="#0D5EBA"
                name="Shortfall Value (USD)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Corridor Filter */}
        <div className="mb-4 flex items-center gap-4">
          <span className="text-sm text-ink/70 font-medium">Filter by Corridor:</span>
          {(["All", "Eastern", "Western", "Northern", "Lagos"] as Array<Corridor | "All">).map(
            (corridor) => (
              <button
                key={corridor}
                onClick={() => setSelectedCorridor(corridor)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCorridor === corridor
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-ink/70 hover:bg-gray-200"
                }`}
              >
                {corridor}
              </button>
            )
          )}
        </div>

        {/* TOP Contracts Table */}
        <div className="kpi-card mb-6">
          <h3 className="text-lg font-semibold text-ink mb-4">
            Take-or-Pay Contract Performance
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-line">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-ink">
                    Contract #
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-ink">Customer</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-ink">Sector</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-ink">Corridor</th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">
                    TOP Obligation
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">
                    DCQ (MMscf/d)
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">
                    TOP Volume
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">
                    Actual Offtake
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">
                    Shortfall
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">
                    Value (USD)
                  </th>
                  <th className="text-center px-4 py-3 text-sm font-semibold text-ink">
                    Invoiced
                  </th>
                  <th className="text-center px-4 py-3 text-sm font-semibold text-ink">
                    Payment
                  </th>
                  <th className="text-center px-4 py-3 text-sm font-semibold text-ink">
                    Waiver
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredContracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-primary">
                      {contract.contractNumber}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink">{contract.customer}</td>
                    <td className="px-4 py-3 text-sm text-ink/70">{contract.sector}</td>
                    <td className="px-4 py-3 text-sm text-ink/70">{contract.corridor}</td>
                    <td className="px-4 py-3 text-sm text-right tabular-nums">
                      {contract.topObligation}%
                    </td>
                    <td className="px-4 py-3 text-sm text-right tabular-nums">
                      {contract.dcq.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-sm text-accent font-semibold text-right tabular-nums">
                      {contract.topVolume.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right tabular-nums">
                      {contract.actualOfftake.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right tabular-nums">
                      <span
                        className={`font-bold ${
                          contract.shortfall > 0 ? "text-alert" : "text-primary"
                        }`}
                      >
                        {contract.shortfall > 0 ? contract.shortfall.toFixed(1) : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-alert font-bold text-right tabular-nums">
                      {contract.shortfallValue > 0
                        ? `$${contract.shortfallValue.toLocaleString()}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {contract.invoiced ? (
                        <span className="inline-flex px-2 py-1 rounded text-xs font-medium bg-accent/10 text-accent">
                          Yes
                        </span>
                      ) : (
                        <span className="text-xs text-ink/40">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {contract.paymentStatus !== "n/a" ? (
                        <span
                          className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                            contract.paymentStatus === "paid"
                              ? "bg-primary/10 text-primary"
                              : contract.paymentStatus === "partial"
                              ? "bg-flare/10 text-flare"
                              : "bg-alert/10 text-alert"
                          }`}
                        >
                          {contract.paymentStatus.toUpperCase()}
                        </span>
                      ) : (
                        <span className="text-xs text-ink/40">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {contract.waiverRequested ? (
                        <span className="inline-flex px-2 py-1 rounded text-xs font-medium bg-flare/10 text-flare">
                          Requested
                        </span>
                      ) : (
                        <span className="text-xs text-ink/40">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Enforcement Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="kpi-card bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-3 mb-4">
              <FileCheck className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold text-ink">TOP Enforcement Process</h3>
            </div>
            <ul className="space-y-3 text-sm text-ink/70">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">1.</span>
                <span>
                  <strong>Monthly Calculation:</strong> Compare actual offtake vs TOP obligation
                  (typically 75-85% of DCQ)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">2.</span>
                <span>
                  <strong>Shortfall Invoice:</strong> Issue invoice for unlifted TOP volumes at
                  contract price within 15 days
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">3.</span>
                <span>
                  <strong>Payment Term:</strong> 30-day payment term from invoice date (as per GSA
                  terms)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">4.</span>
                <span>
                  <strong>Waiver Review:</strong> Commercial team reviews waiver requests (force
                  majeure, upstream issues)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">5.</span>
                <span>
                  <strong>Escalation:</strong> Unpaid invoices after 60 days escalated to Legal
                  for recovery
                </span>
              </li>
            </ul>
          </div>

          <div className="kpi-card bg-alert/5 border border-alert/20">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-alert" />
              <h3 className="text-lg font-semibold text-ink">Challenges & Risks</h3>
            </div>
            <ul className="space-y-3 text-sm text-ink/70">
              <li className="flex items-start gap-2">
                <span className="text-alert font-bold">•</span>
                <span>
                  <strong>Power Sector:</strong> GenCos unable to pay TOP charges due to
                  liquidity issues (tariff shortfalls)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-alert font-bold">•</span>
                <span>
                  <strong>Upstream Constraints:</strong> Customers claim inability to offtake due
                  to supply shortfalls
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-alert font-bold">•</span>
                <span>
                  <strong>Force Majeure:</strong> Frequent FM claims due to pipeline vandalism,
                  upstream shutdowns
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-alert font-bold">•</span>
                <span>
                  <strong>Legal Enforcement:</strong> Lengthy court processes for contract
                  enforcement in Nigeria
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-alert font-bold">•</span>
                <span>
                  <strong>Make-Up Gas:</strong> Complexity in allowing customers to take makeup
                  volumes in future months
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Policy Note */}
        <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <h4 className="font-semibold text-ink mb-2">Take-or-Pay Policy Framework</h4>
          <ul className="space-y-2 text-sm text-ink/70">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>
                <strong>Definition:</strong> TOP clause requires customer to pay for minimum
                volume (e.g., 80% of DCQ) even if not taken
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>
                <strong>Purpose:</strong> Protects NGML revenue and ensures capacity reservation
                is compensated
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>
                <strong>Make-Up Rights:</strong> Most GSAs allow customers to take shortfall
                volumes in future months (typically 12-24 month window)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>
                <strong>Industry Standard:</strong> Nigerian gas contracts typically have 75-85%
                TOP, vs 85-90% internationally
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
