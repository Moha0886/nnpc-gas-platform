"use client";

import { ArrowLeft, Download, Printer } from "lucide-react";
import Link from "next/link";

export default function MORVolumePressurePage() {
  const reportWeek = "November 1-7, 2024";

  // Mock data for Weekly MOR Volume & Pressure report
  const volumePressureData = {
    pipelines: [
      {
        name: "ELPS (Escravos-Lagos)",
        corridor: "Western",
        avgVolume: 1842,
        peakVolume: 1956,
        avgInletPressure: 1233,
        avgOutletPressure: 1050,
        utilizationPct: 83.7,
        capacity: 2200,
      },
      {
        name: "OB3 (Obiafu-Obrikom-Oben)",
        corridor: "Interconnector",
        avgVolume: 1654,
        peakVolume: 1789,
        avgInletPressure: 1305,
        avgOutletPressure: 1200,
        utilizationPct: 82.7,
        capacity: 2000,
      },
      {
        name: "ONY-IKJ (Onne-Ikeja)",
        corridor: "Northern",
        avgVolume: 892,
        peakVolume: 1050,
        avgInletPressure: 1233,
        avgOutletPressure: 1050,
        utilizationPct: 74.3,
        capacity: 1200,
      },
      {
        name: "AKK (Ajaokuta-Kaduna-Kano)",
        corridor: "Northern",
        avgVolume: 0,
        peakVolume: 0,
        avgInletPressure: 0,
        avgOutletPressure: 0,
        utilizationPct: 0,
        capacity: 2200,
      },
    ],
    deliveryPoints: [
      {
        point: "Egbin Offtake",
        corridor: "Western",
        avgVolume: 198,
        avgPressure: 980,
        minPressure: 920,
        maxPressure: 1040,
      },
      {
        point: "Olorunsogo Offtake",
        corridor: "Western",
        avgVolume: 134,
        avgPressure: 965,
        minPressure: 910,
        maxPressure: 1020,
      },
      {
        point: "Paras Energy Offtake",
        corridor: "Western",
        avgVolume: 120,
        avgPressure: 970,
        minPressure: 915,
        maxPressure: 1025,
      },
      {
        point: "Dangote Fertilizer",
        corridor: "Western",
        avgVolume: 195,
        avgPressure: 985,
        minPressure: 950,
        maxPressure: 1035,
      },
      {
        point: "Okpai Power Offtake",
        corridor: "Eastern",
        avgVolume: 70,
        avgPressure: 890,
        minPressure: 850,
        maxPressure: 930,
      },
      {
        point: "Afam VI Offtake",
        corridor: "Eastern",
        avgVolume: 94,
        avgPressure: 905,
        minPressure: 865,
        maxPressure: 945,
      },
      {
        point: "Indorama Eleme",
        corridor: "Eastern",
        avgVolume: 145,
        avgPressure: 920,
        minPressure: 880,
        maxPressure: 960,
      },
      {
        point: "Shell LDC Lagos",
        corridor: "Lagos",
        avgVolume: 76,
        avgPressure: 850,
        minPressure: 800,
        maxPressure: 900,
      },
      {
        point: "Axxela LDC Lagos",
        corridor: "Lagos",
        avgVolume: 65,
        avgPressure: 845,
        minPressure: 795,
        maxPressure: 895,
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
              <h2 className="text-2xl font-bold text-ink">Weekly MOR: Volume & Pressure Report</h2>
              <p className="text-sm text-ink/60 mt-1">
                {reportWeek}
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
        {/* Pipeline Performance Table */}
        <div className="kpi-card">
          <h3 className="text-lg font-semibold text-ink mb-4">Transmission Pipeline Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-line">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-ink">Pipeline</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-ink">Corridor</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-ink">Capacity<br/>(MMscf/d)</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-ink">Avg Volume<br/>(MMscf/d)</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-ink">Peak Volume<br/>(MMscf/d)</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-ink">Utilization</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-ink">Avg Inlet<br/>(PSI)</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-ink">Avg Outlet<br/>(PSI)</th>
                </tr>
              </thead>
              <tbody>
                {volumePressureData.pipelines.map((pipeline, idx) => (
                  <tr key={idx} className="border-b border-line hover:bg-gray-50">
                    <td className="py-3 px-4 text-ink font-medium">{pipeline.name}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2 py-0.5 text-xs rounded ${
                        pipeline.corridor === 'Western' ? 'bg-gasblue/20 text-gasblue' :
                        pipeline.corridor === 'Eastern' ? 'bg-pine/20 text-pine' :
                        pipeline.corridor === 'Northern' ? 'bg-amber-100 text-amber-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {pipeline.corridor}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-ink/60">{pipeline.capacity}</td>
                    <td className="py-3 px-4 text-right font-mono text-ink font-semibold">{pipeline.avgVolume}</td>
                    <td className="py-3 px-4 text-right font-mono text-ink">{pipeline.peakVolume}</td>
                    <td className={`py-3 px-4 text-right font-mono ${
                      pipeline.utilizationPct >= 90 ? 'text-red-600' :
                      pipeline.utilizationPct >= 75 ? 'text-amber-600' :
                      pipeline.utilizationPct > 0 ? 'text-green-600' :
                      'text-ink/40'
                    }`}>
                      {pipeline.utilizationPct > 0 ? `${pipeline.utilizationPct.toFixed(1)}%` : '—'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-ink/70">
                      {pipeline.avgInletPressure > 0 ? pipeline.avgInletPressure : '—'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-ink/70">
                      {pipeline.avgOutletPressure > 0 ? pipeline.avgOutletPressure : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-900">
            <strong>Status:</strong> AKK Pipeline is under construction and not yet operational. Expected commissioning in 2025.
          </div>
        </div>

        {/* Delivery Points Pressure Table */}
        <div className="kpi-card">
          <h3 className="text-lg font-semibold text-ink mb-4">Delivery Point Volumes & Pressures</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-line">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-ink">Delivery Point</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-ink">Corridor</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-ink">Avg Volume<br/>(MMscf/d)</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-ink">Avg Pressure<br/>(PSI)</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-ink">Min Pressure<br/>(PSI)</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-ink">Max Pressure<br/>(PSI)</th>
                </tr>
              </thead>
              <tbody>
                {volumePressureData.deliveryPoints.map((point, idx) => (
                  <tr key={idx} className="border-b border-line hover:bg-gray-50">
                    <td className="py-3 px-4 text-ink">{point.point}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2 py-0.5 text-xs rounded ${
                        point.corridor === 'Western' ? 'bg-gasblue/20 text-gasblue' :
                        point.corridor === 'Eastern' ? 'bg-pine/20 text-pine' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {point.corridor}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-ink font-semibold">{point.avgVolume}</td>
                    <td className="py-3 px-4 text-right font-mono text-ink">{point.avgPressure}</td>
                    <td className={`py-3 px-4 text-right font-mono ${
                      point.minPressure < 800 ? 'text-red-600' :
                      point.minPressure < 850 ? 'text-amber-600' :
                      'text-green-600'
                    }`}>
                      {point.minPressure}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-ink/70">{point.maxPressure}</td>
                  </tr>
                ))}
                <tr className="bg-primary/5 font-semibold border-t-2 border-primary">
                  <td className="py-3 px-4 text-ink">TOTAL</td>
                  <td className="py-3 px-4"></td>
                  <td className="py-3 px-4 text-right font-mono text-ink">
                    {volumePressureData.deliveryPoints.reduce((sum, p) => sum + p.avgVolume, 0)}
                  </td>
                  <td className="py-3 px-4"></td>
                  <td className="py-3 px-4"></td>
                  <td className="py-3 px-4"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Corridor Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="kpi-card">
            <h4 className="text-sm font-semibold text-ink/70 mb-2">Western Corridor</h4>
            <p className="text-xl font-bold text-gasblue">
              {volumePressureData.deliveryPoints.filter(p => p.corridor === 'Western').reduce((sum, p) => sum + p.avgVolume, 0)}
            </p>
            <p className="text-xs text-ink/60">MMscf/d avg volume</p>
          </div>
          <div className="kpi-card">
            <h4 className="text-sm font-semibold text-ink/70 mb-2">Eastern Corridor</h4>
            <p className="text-xl font-bold text-pine">
              {volumePressureData.deliveryPoints.filter(p => p.corridor === 'Eastern').reduce((sum, p) => sum + p.avgVolume, 0)}
            </p>
            <p className="text-xs text-ink/60">MMscf/d avg volume</p>
          </div>
          <div className="kpi-card">
            <h4 className="text-sm font-semibold text-ink/70 mb-2">Lagos Corridor</h4>
            <p className="text-xl font-bold text-purple-600">
              {volumePressureData.deliveryPoints.filter(p => p.corridor === 'Lagos').reduce((sum, p) => sum + p.avgVolume, 0)}
            </p>
            <p className="text-xs text-ink/60">MMscf/d avg volume</p>
          </div>
          <div className="kpi-card">
            <h4 className="text-sm font-semibold text-ink/70 mb-2">Network Capacity</h4>
            <p className="text-xl font-bold text-ink">
              {volumePressureData.pipelines.reduce((sum, p) => sum + p.capacity, 0)}
            </p>
            <p className="text-xs text-ink/60">MMscf/d total capacity</p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg text-sm text-ink/70">
          <p><strong className="text-primary">Report Generated:</strong> {new Date().toLocaleString()}</p>
          <p className="mt-2">
            <strong>Note:</strong> This Weekly MOR (Management Operating Report) shows pipeline transmission volumes and pressure profiles across the NNPC gas network.
            All volumes are in Million Standard Cubic Feet per Day (MMscf/d). Pressures in PSI (Pounds per Square Inch).
            Minimum delivery pressure threshold is 800 PSI.
          </p>
        </div>
      </div>
    </div>
  );
}
