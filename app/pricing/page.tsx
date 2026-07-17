"use client";

import { useState } from "react";
import { DollarSign, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
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
} from "recharts";
import type { Sector } from "@/lib/types";

// Pricing tiers by sector
const pricingBySector = [
  {
    sector: "Power",
    priceType: "Regulated",
    currentPrice: 2.18, // USD/MMBtu
    currency: "USD",
    regulatedRate: true,
    lastUpdate: "Jan 2026",
    priceNGN: 3270, // NGN/MMBtu at ₦1500/USD
    escalation: "Fixed by FGN",
  },
  {
    sector: "Fertiliser",
    priceType: "Regulated",
    currentPrice: 2.50,
    currency: "USD",
    regulatedRate: true,
    lastUpdate: "Jan 2026",
    priceNGN: 3750,
    escalation: "CPI-linked",
  },
  {
    sector: "Petrochemical",
    priceType: "Market-based",
    currentPrice: 4.20,
    currency: "USD",
    regulatedRate: false,
    lastUpdate: "Jul 2026",
    priceNGN: 6300,
    escalation: "Henry Hub + 15%",
  },
  {
    sector: "Cement",
    priceType: "Market-based",
    currentPrice: 3.80,
    currency: "USD",
    regulatedRate: false,
    lastUpdate: "Jul 2026",
    priceNGN: 5700,
    escalation: "Negotiated annually",
  },
  {
    sector: "LDC / distributor",
    priceType: "Regulated",
    currentPrice: 2.90,
    currency: "USD",
    regulatedRate: true,
    lastUpdate: "Jan 2026",
    priceNGN: 4350,
    escalation: "NMDPRA formula",
  },
  {
    sector: "LNG feedstock",
    priceType: "Export parity",
    currentPrice: 5.50,
    currency: "USD",
    regulatedRate: false,
    lastUpdate: "Jul 2026",
    priceNGN: 8250,
    escalation: "Brent-linked",
  },
  {
    sector: "Other industry",
    priceType: "Market-based",
    currentPrice: 3.50,
    currency: "USD",
    regulatedRate: false,
    lastUpdate: "Jul 2026",
    priceNGN: 5250,
    escalation: "Negotiated",
  },
];

// Historical pricing trend (12 months)
const pricingTrend = [
  { month: "Aug '25", power: 2.18, industrial: 3.80, lng: 5.20 },
  { month: "Sep '25", power: 2.18, industrial: 3.85, lng: 5.35 },
  { month: "Oct '25", power: 2.18, industrial: 3.90, lng: 5.40 },
  { month: "Nov '25", power: 2.18, industrial: 3.95, lng: 5.45 },
  { month: "Dec '25", power: 2.18, industrial: 4.00, lng: 5.50 },
  { month: "Jan '26", power: 2.18, industrial: 4.05, lng: 5.55 },
  { month: "Feb '26", power: 2.18, industrial: 4.10, lng: 5.50 },
  { month: "Mar '26", power: 2.18, industrial: 4.15, lng: 5.45 },
  { month: "Apr '26", power: 2.18, industrial: 4.18, lng: 5.48 },
  { month: "May '26", power: 2.18, industrial: 4.20, lng: 5.50 },
  { month: "Jun '26", power: 2.18, industrial: 4.20, lng: 5.52 },
  { month: "Jul '26", power: 2.18, industrial: 4.20, lng: 5.50 },
];

// Volume-weighted average pricing
const volumeWeightedPricing = {
  totalVolume: 2850.5, // MMscf/d
  powerVolume: 1250.0,
  industrialVolume: 895.3,
  lngVolume: 705.2,
  weightedAvgPrice: 3.24, // USD/MMBtu
  totalRevenue: 9234.6, // USD thousands per day
};

export default function PricingPage() {
  const [selectedView, setSelectedView] = useState<"sector" | "trend">("sector");

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-line px-8 py-4">
        <h2 className="text-2xl font-bold text-ink">Gas Pricing Dashboard</h2>
        <p className="text-sm text-ink/60 mt-1">
          Current gas prices by sector - Regulated, Market-based & Export parity
        </p>
      </div>

      <div className="p-8">
        {/* Summary KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="kpi-card bg-primary/5">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <h4 className="text-sm font-medium text-ink/70">Weighted Avg Price</h4>
            </div>
            <p className="text-2xl font-bold text-primary tabular-nums">
              ${volumeWeightedPricing.weightedAvgPrice.toFixed(2)}
            </p>
            <p className="text-xs text-ink/60 mt-1">USD/MMBtu</p>
          </div>

          <div className="kpi-card">
            <h4 className="text-sm font-medium text-ink/70 mb-2">Power Sector Price</h4>
            <p className="text-2xl font-bold text-alert tabular-nums">$2.18</p>
            <p className="text-xs text-ink/60 mt-1">USD/MMBtu (Regulated)</p>
          </div>

          <div className="kpi-card">
            <h4 className="text-sm font-medium text-ink/70 mb-2">Industrial Avg</h4>
            <p className="text-2xl font-bold text-accent tabular-nums">$4.20</p>
            <p className="text-xs text-ink/60 mt-1">USD/MMBtu (Market)</p>
          </div>

          <div className="kpi-card">
            <h4 className="text-sm font-medium text-ink/70 mb-2">LNG Feedstock</h4>
            <p className="text-2xl font-bold text-ink tabular-nums">$5.50</p>
            <p className="text-xs text-ink/60 mt-1">USD/MMBtu (Export parity)</p>
          </div>
        </div>

        {/* Pricing by Sector Table */}
        <div className="kpi-card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-ink">Current Pricing by Sector</h3>
            <div className="text-xs text-ink/60">
              Exchange Rate: ₦1,500/USD | Last Updated: July 2026
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-line">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-ink">Sector</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-ink">
                    Price Type
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">
                    Price (USD/MMBtu)
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-ink">
                    Price (NGN/MMBtu)
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-ink">
                    Escalation Formula
                  </th>
                  <th className="text-center px-4 py-3 text-sm font-semibold text-ink">
                    Last Update
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {pricingBySector.map((item) => (
                  <tr key={item.sector} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-ink">{item.sector}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                          item.regulatedRate
                            ? "bg-alert/10 text-alert"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {item.priceType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-primary font-bold text-right tabular-nums">
                      ${item.currentPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink/70 text-right tabular-nums">
                      ₦{item.priceNGN.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink/70">{item.escalation}</td>
                    <td className="px-4 py-3 text-sm text-ink/70 text-center">
                      {item.lastUpdate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Price Trend Chart */}
        <div className="kpi-card mb-6">
          <h3 className="text-lg font-semibold text-ink mb-4">
            12-Month Price Trend by Category
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={pricingTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DCDAD2" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                domain={[0, 6]}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}/MMBtu`} />
              <Legend />
              <Line
                type="monotone"
                dataKey="power"
                stroke="#B3402A"
                strokeWidth={3}
                name="Power (Regulated)"
                dot={{ fill: "#B3402A", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="industrial"
                stroke="#00AD51"
                strokeWidth={3}
                name="Industrial (Market)"
                dot={{ fill: "#00AD51", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="lng"
                stroke="#0D5EBA"
                strokeWidth={3}
                name="LNG (Export parity)"
                dot={{ fill: "#0D5EBA", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Volume-Weighted Revenue */}
        <div className="kpi-card mb-6">
          <h3 className="text-lg font-semibold text-ink mb-4">
            Daily Revenue by Price Category
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-alert/5 rounded-lg">
              <p className="text-sm text-ink/70 mb-1">Power Sector</p>
              <p className="text-xl font-bold text-alert tabular-nums">
                {volumeWeightedPricing.powerVolume.toFixed(0)} MMscf/d
              </p>
              <p className="text-sm text-ink/70 mt-2">
                Revenue: ${(volumeWeightedPricing.powerVolume * 2.18).toFixed(0)}k/day
              </p>
            </div>

            <div className="p-4 bg-primary/5 rounded-lg">
              <p className="text-sm text-ink/70 mb-1">Industrial</p>
              <p className="text-xl font-bold text-primary tabular-nums">
                {volumeWeightedPricing.industrialVolume.toFixed(0)} MMscf/d
              </p>
              <p className="text-sm text-ink/70 mt-2">
                Revenue: ${(volumeWeightedPricing.industrialVolume * 4.2).toFixed(0)}k/day
              </p>
            </div>

            <div className="p-4 bg-accent/5 rounded-lg">
              <p className="text-sm text-ink/70 mb-1">LNG Feedstock</p>
              <p className="text-xl font-bold text-accent tabular-nums">
                {volumeWeightedPricing.lngVolume.toFixed(0)} MMscf/d
              </p>
              <p className="text-sm text-ink/70 mt-2">
                Revenue: ${(volumeWeightedPricing.lngVolume * 5.5).toFixed(0)}k/day
              </p>
            </div>

            <div className="p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-ink/70 mb-1">Total Daily Revenue</p>
              <p className="text-2xl font-bold text-ink tabular-nums">
                ${volumeWeightedPricing.totalRevenue.toFixed(0)}k
              </p>
              <p className="text-sm text-ink/70 mt-2">
                ~${(volumeWeightedPricing.totalRevenue * 30).toFixed(0)}k/month
              </p>
            </div>
          </div>
        </div>

        {/* Regulatory & Market Context */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="kpi-card bg-alert/5 border border-alert/20">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-alert" />
              <h3 className="text-lg font-semibold text-ink">Regulated Pricing Issues</h3>
            </div>
            <ul className="space-y-3 text-sm text-ink/70">
              <li className="flex items-start gap-2">
                <span className="text-alert font-bold">•</span>
                <span>
                  <strong>Power Sector:</strong> Price fixed at $2.18/MMBtu since 2020,
                  significantly below market rates causing revenue shortfalls
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-alert font-bold">•</span>
                <span>
                  <strong>Cost Recovery:</strong> Regulated prices do not cover full
                  transportation and delivery costs
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-alert font-bold">•</span>
                <span>
                  <strong>FX Risk:</strong> Naira depreciation increases cost of operations while
                  USD prices remain fixed
                </span>
              </li>
            </ul>
          </div>

          <div className="kpi-card bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold text-ink">Market-Based Opportunities</h3>
            </div>
            <ul className="space-y-3 text-sm text-ink/70">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong>Industrial Demand:</strong> Growing demand from cement, fertilizer, and
                  petrochemical sectors at market rates
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong>LNG Export:</strong> Export parity pricing provides higher margins
                  (currently $5.50/MMBtu)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong>Price Indexation:</strong> Industrial contracts linked to Henry Hub or
                  Brent provide inflation protection
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Pricing Framework Note */}
        <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <h4 className="font-semibold text-ink mb-2">Nigerian Gas Pricing Framework</h4>
          <ul className="space-y-2 text-sm text-ink/70">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>
                <strong>Power Sector:</strong> Price regulated by Federal Government (currently
                $2.18/MMBtu) to support electricity affordability
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>
                <strong>Industrial:</strong> Market-determined pricing through bilateral
                negotiations, typically $3.50-$4.50/MMBtu
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>
                <strong>LNG Feedstock:</strong> Export parity pricing linked to international
                benchmarks (Brent crude or Henry Hub)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>
                <strong>Transportation Tariffs:</strong> Regulated by NMDPRA based on distance,
                capacity, and investment recovery
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
