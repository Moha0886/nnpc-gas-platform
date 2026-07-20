"use client";

import { ArrowLeft, Download, Printer } from "lucide-react";
import Link from "next/link";

export default function NGMLDailyReportPage() {
  const reportDate = "November 15, 2024";

  // Mock data for NGML daily report (aggregated allocation and offtake)
  const ngmlData = {
    summary: {
      totalNomination: 1298.0,
      totalAllocation: 1208.0,
      totalOfftake: 1198.4,
      curtailmentFactor: 0.931, // Allocation / Nomination
      performanceFactor: 0.992, // Offtake / Allocation
    },
    customers: [
      {
        name: "Egbin Power",
        sector: "Power",
        nomination: 215,
        allocation: 210,
        offtake: 198,
        dcq: 215,
        perfFactor: 0.943,
      },
      {
        name: "Olorunsogo Power",
        sector: "Power",
        nomination: 140,
        allocation: 138,
        offtake: 134,
        dcq: 140,
        perfFactor: 0.971,
      },
      {
        name: "Paras Energy",
        sector: "Power",
        nomination: 125,
        allocation: 125,
        offtake: 120,
        dcq: 125,
        perfFactor: 0.960,
      },
      {
        name: "Okpai Power",
        sector: "Power",
        nomination: 78,
        allocation: 75,
        offtake: 70,
        dcq: 78,
        perfFactor: 0.933,
      },
      {
        name: "Afam VI Power",
        sector: "Power",
        nomination: 102,
        allocation: 100,
        offtake: 94,
        dcq: 102,
        perfFactor: 0.940,
      },
      {
        name: "Dangote Fertilizer",
        sector: "Industrial",
        nomination: 195,
        allocation: 195,
        offtake: 195,
        dcq: 195,
        perfFactor: 1.000,
      },
      {
        name: "Indorama Eleme",
        sector: "Industrial",
        nomination: 145,
        allocation: 145,
        offtake: 145,
        dcq: 145,
        perfFactor: 1.000,
      },
      {
        name: "Shell LDC Lagos",
        sector: "Commercial",
        nomination: 85,
        allocation: 82,
        offtake: 76,
        dcq: 85,
        perfFactor: 0.927,
      },
      {
        name: "Axxela LDC Lagos",
        sector: "Commercial",
        nomination: 72,
        allocation: 70,
        offtake: 65,
        dcq: 72,
        perfFactor: 0.929,
      },
      {
        name: "Others (Various)",
        sector: "Mixed",
        nomination: 141,
        allocation: 68,
        offtake: 101.4,
        dcq: 151,
        perfFactor: 1.491,
      },
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
              <h2 className="text-2xl font-bold text-ink">NGML Daily Allocation & Offtake Report</h2>
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="kpi-card">
            <p className="text-sm text-ink/60 mb-1">Total Nomination</p>
            <p className="text-2xl font-bold text-ink">{ngmlData.summary.totalNomination.toFixed(1)}</p>
            <p className="text-xs text-ink/60">MMscf/d</p>
          </div>
          <div className="kpi-card">
            <p className="text-sm text-ink/60 mb-1">Total Allocation</p>
            <p className="text-2xl font-bold text-gasblue">{ngmlData.summary.totalAllocation.toFixed(1)}</p>
            <p className="text-xs text-ink/60">MMscf/d</p>
          </div>
          <div className="kpi-card">
            <p className="text-sm text-ink/60 mb-1">Total Offtake</p>
            <p className="text-2xl font-bold text-pine">{ngmlData.summary.totalOfftake.toFixed(1)}</p>
            <p className="text-xs text-ink/60">MMscf/d</p>
          </div>
          <div className="kpi-card">
            <p className="text-sm text-ink/60 mb-1">Curtailment Factor</p>
            <p className="text-2xl font-bold text-amber-600">{ngmlData.summary.curtailmentFactor.toFixed(3)}</p>
            <p className="text-xs text-ink/60">Allocation / Nomination</p>
          </div>
          <div className="kpi-card">
            <p className="text-sm text-ink/60 mb-1">Performance Factor</p>
            <p className="text-2xl font-bold text-green-600">{ngmlData.summary.performanceFactor.toFixed(3)}</p>
            <p className="text-xs text-ink/60">Offtake / Allocation</p>
          </div>
        </div>

        {/* Customer Allocations Table */}
        <div className="kpi-card">
          <h3 className="text-lg font-semibold text-ink mb-4">Customer Nominations, Allocations & Offtake</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-line">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-ink">Customer</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-ink">Sector</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-ink">DCQ</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-ink">Nomination</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-ink">Allocation</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-ink">Offtake</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-ink">Perf</th>
                </tr>
              </thead>
              <tbody>
                {ngmlData.customers.map((customer, idx) => (
                  <tr key={idx} className="border-b border-line hover:bg-gray-50">
                    <td className="py-3 px-4 text-ink">{customer.name}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2 py-0.5 text-xs rounded ${
                        customer.sector === 'Power' ? 'bg-gasblue/20 text-gasblue' :
                        customer.sector === 'Industrial' ? 'bg-pine/20 text-pine' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {customer.sector}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-ink/60 text-sm">{customer.dcq}</td>
                    <td className="py-3 px-4 text-right font-mono text-ink">{customer.nomination}</td>
                    <td className="py-3 px-4 text-right font-mono text-gasblue">{customer.allocation}</td>
                    <td className="py-3 px-4 text-right font-mono text-pine font-semibold">{customer.offtake}</td>
                    <td className={`py-3 px-4 text-right font-mono ${
                      customer.perfFactor >= 0.95 ? 'text-green-600' :
                      customer.perfFactor >= 0.90 ? 'text-amber-600' :
                      'text-red-600'
                    }`}>
                      {customer.perfFactor.toFixed(3)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-primary/5 font-semibold border-t-2 border-primary">
                  <td className="py-3 px-4 text-ink">TOTAL</td>
                  <td className="py-3 px-4"></td>
                  <td className="py-3 px-4 text-right font-mono text-ink/60">
                    {ngmlData.customers.reduce((sum, c) => sum + c.dcq, 0)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-ink">
                    {ngmlData.summary.totalNomination.toFixed(1)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-gasblue">
                    {ngmlData.summary.totalAllocation.toFixed(1)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-pine font-semibold">
                    {ngmlData.summary.totalOfftake.toFixed(1)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-green-600">
                    {ngmlData.summary.performanceFactor.toFixed(3)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Sector Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="kpi-card">
            <h4 className="text-sm font-semibold text-ink/70 mb-2">Power Sector</h4>
            <p className="text-xl font-bold text-gasblue">
              {ngmlData.customers.filter(c => c.sector === 'Power').reduce((sum, c) => sum + c.offtake, 0).toFixed(1)}
            </p>
            <p className="text-xs text-ink/60">MMscf/d offtake</p>
          </div>
          <div className="kpi-card">
            <h4 className="text-sm font-semibold text-ink/70 mb-2">Industrial Sector</h4>
            <p className="text-xl font-bold text-pine">
              {ngmlData.customers.filter(c => c.sector === 'Industrial').reduce((sum, c) => sum + c.offtake, 0).toFixed(1)}
            </p>
            <p className="text-xs text-ink/60">MMscf/d offtake</p>
          </div>
          <div className="kpi-card">
            <h4 className="text-sm font-semibold text-ink/70 mb-2">Commercial Sector</h4>
            <p className="text-xl font-bold text-amber-600">
              {ngmlData.customers.filter(c => c.sector === 'Commercial' || c.sector === 'Mixed').reduce((sum, c) => sum + c.offtake, 0).toFixed(1)}
            </p>
            <p className="text-xs text-ink/60">MMscf/d offtake</p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg text-sm text-ink/70">
          <p><strong className="text-primary">Report Generated:</strong> {new Date().toLocaleString()}</p>
          <p className="mt-2">
            <strong>Note:</strong> This report shows daily allocation and offtake for Nigeria Gas Marketing Limited (NGML).
            All volumes are in Million Standard Cubic Feet per Day (MMscf/d). Perf = Actual Offtake ÷ Allocation.
            Curtailment Factor = Allocation ÷ Nomination.
          </p>
        </div>
      </div>
    </div>
  );
}
