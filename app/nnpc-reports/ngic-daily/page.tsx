"use client";

import { ArrowLeft, Download, Printer } from "lucide-react";
import Link from "next/link";

export default function NGICDailyReportPage() {
  const reportDate = "November 15, 2024";

  // Mock data for NGIC daily report
  const ngicData = {
    summary: {
      totalReceipt: 1245.8,
      totalDelivered: 1198.4,
      linepack: 47.4,
      networkEfficiency: 96.2,
    },
    receipts: [
      { source: "CNL Escravos", volume: 385.2, pressure: 1233, temperature: 32 },
      { source: "NEPL Utorogu", volume: 298.5, pressure: 1205, temperature: 31 },
      { source: "Seplat Oben", volume: 156.3, pressure: 1180, temperature: 30 },
      { source: "SPDC Forcados", volume: 245.8, pressure: 1215, temperature: 33 },
      { source: "Pan Ocean", volume: 89.6, pressure: 1165, temperature: 29 },
      { source: "NPDC/Eland JV", volume: 70.4, pressure: 1190, temperature: 31 },
    ],
    deliveries: [
      { customer: "Egbin Power", contracted: 215, delivered: 198, variance: -17, performance: 92.1 },
      { customer: "Olorunsogo Power", contracted: 140, delivered: 134, variance: -6, performance: 95.7 },
      { customer: "Paras Energy", contracted: 125, delivered: 120, variance: -5, performance: 96.0 },
      { customer: "Okpai Power", contracted: 78, delivered: 70, variance: -8, performance: 89.7 },
      { customer: "Afam VI Power", contracted: 102, delivered: 94, variance: -8, performance: 92.2 },
      { customer: "Dangote Fertilizer", contracted: 195, delivered: 195, variance: 0, performance: 100.0 },
      { customer: "Indorama Eleme", contracted: 145, delivered: 145, variance: 0, performance: 100.0 },
      { customer: "Shell LDC Lagos", contracted: 85, delivered: 76, variance: -9, performance: 89.4 },
      { customer: "Axxela LDC Lagos", contracted: 72, delivered: 65, variance: -7, performance: 90.3 },
      { customer: "Others", contracted: 51, delivered: 101.4, variance: 50.4, performance: 198.8 },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-line px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/reports" className="text-ink/60 hover:text-ink">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h2 className="text-2xl font-bold text-ink">NGIC Daily Gas Operations Report</h2>
              <p className="text-sm text-ink/60 mt-1">
                {reportDate}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-line rounded-lg text-ink hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Excel
            </button>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="kpi-card">
            <p className="text-sm text-ink/60 mb-1">Total Receipt</p>
            <p className="text-2xl font-bold text-gasblue">{ngicData.summary.totalReceipt.toFixed(1)}</p>
            <p className="text-xs text-ink/60">MMscf/d</p>
          </div>
          <div className="kpi-card">
            <p className="text-sm text-ink/60 mb-1">Total Delivered</p>
            <p className="text-2xl font-bold text-pine">{ngicData.summary.totalDelivered.toFixed(1)}</p>
            <p className="text-xs text-ink/60">MMscf/d</p>
          </div>
          <div className="kpi-card">
            <p className="text-sm text-ink/60 mb-1">Linepack</p>
            <p className="text-2xl font-bold text-amber-600">{ngicData.summary.linepack.toFixed(1)}</p>
            <p className="text-xs text-ink/60">MMscf/d</p>
          </div>
          <div className="kpi-card">
            <p className="text-sm text-ink/60 mb-1">Network Efficiency</p>
            <p className="text-2xl font-bold text-ink">{ngicData.summary.networkEfficiency.toFixed(1)}%</p>
            <p className="text-xs text-ink/60">Delivered / Receipt</p>
          </div>
        </div>

        {/* Gas Receipts Table */}
        <div className="kpi-card">
          <h3 className="text-lg font-semibold text-ink mb-4">Gas Receipts into NGIC System</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-line">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-ink">Source</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-ink">Volume (MMscf/d)</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-ink">Pressure (PSI)</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-ink">Temp (°C)</th>
                </tr>
              </thead>
              <tbody>
                {ngicData.receipts.map((receipt, idx) => (
                  <tr key={idx} className="border-b border-line hover:bg-gray-50">
                    <td className="py-3 px-4 text-ink">{receipt.source}</td>
                    <td className="py-3 px-4 text-right font-mono text-ink">{receipt.volume.toFixed(1)}</td>
                    <td className="py-3 px-4 text-right font-mono text-ink/70">{receipt.pressure}</td>
                    <td className="py-3 px-4 text-right font-mono text-ink/70">{receipt.temperature}</td>
                  </tr>
                ))}
                <tr className="bg-gasblue/10 font-semibold">
                  <td className="py-3 px-4 text-ink">TOTAL RECEIPT</td>
                  <td className="py-3 px-4 text-right font-mono text-gasblue">
                    {ngicData.summary.totalReceipt.toFixed(1)}
                  </td>
                  <td className="py-3 px-4"></td>
                  <td className="py-3 px-4"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Gas Deliveries Table */}
        <div className="kpi-card">
          <h3 className="text-lg font-semibold text-ink mb-4">Gas Deliveries from NGIC System</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-line">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-ink">Customer</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-ink">Contracted (MMscf/d)</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-ink">Delivered (MMscf/d)</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-ink">Variance</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-ink">Performance (%)</th>
                </tr>
              </thead>
              <tbody>
                {ngicData.deliveries.map((delivery, idx) => (
                  <tr key={idx} className="border-b border-line hover:bg-gray-50">
                    <td className="py-3 px-4 text-ink">{delivery.customer}</td>
                    <td className="py-3 px-4 text-right font-mono text-ink/70">{delivery.contracted}</td>
                    <td className="py-3 px-4 text-right font-mono text-ink">{delivery.delivered}</td>
                    <td className={`py-3 px-4 text-right font-mono ${delivery.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {delivery.variance > 0 ? '+' : ''}{delivery.variance}
                    </td>
                    <td className={`py-3 px-4 text-right font-mono ${delivery.performance >= 95 ? 'text-green-600' : delivery.performance >= 90 ? 'text-amber-600' : 'text-red-600'}`}>
                      {delivery.performance.toFixed(1)}%
                    </td>
                  </tr>
                ))}
                <tr className="bg-pine/10 font-semibold">
                  <td className="py-3 px-4 text-ink">TOTAL DELIVERED</td>
                  <td className="py-3 px-4 text-right font-mono text-ink/70">
                    {ngicData.deliveries.reduce((sum, d) => sum + d.contracted, 0)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-pine">
                    {ngicData.summary.totalDelivered.toFixed(1)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-red-600">
                    {(ngicData.summary.totalDelivered - ngicData.deliveries.reduce((sum, d) => sum + d.contracted, 0)).toFixed(1)}
                  </td>
                  <td className="py-3 px-4"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Note */}
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg text-sm text-ink/70">
          <p><strong className="text-primary">Report Generated:</strong> {new Date().toLocaleString()}</p>
          <p className="mt-2">
            <strong>Note:</strong> This report shows daily gas operations for Nigerian Gas Integrated Company (NGIC).
            All volumes are in Million Standard Cubic Feet per Day (MMscf/d). Network efficiency calculated as Total Delivered / Total Receipt × 100.
          </p>
        </div>
      </div>
    </div>
  );
}
