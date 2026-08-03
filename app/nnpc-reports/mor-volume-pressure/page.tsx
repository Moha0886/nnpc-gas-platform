"use client";

import { ArrowLeft, Download, Printer } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function MORVolumePressurePage() {
  const [reportWeek, setReportWeek] = useState("2026-W31");

  // Format week for display
  const weekDisplay = "Week of August 1-7, 2026";

  // MOR Volume & Pressure data - 13 Western Network producers matching Excel
  const volumePressureData = [
    {
      name: "CNL-Escravos",
      currentWeek: { volume: 330.09, pressure: 82.10 },
      priorWeek: { volume: 352.96, pressure: 81.83 },
      contractualRange: { min: 80, max: 85 },
      remarks: "Volume dropped with slight improved pressure",
    },
    {
      name: "NEPL/NDW Utorogu",
      currentWeek: { volume: 183.73, pressure: 54.08 },
      priorWeek: { volume: 198.45, pressure: 53.92 },
      contractualRange: { min: 72, max: 76.9 },
      remarks: "⚠️ PRESSURE BREACH - Below contractual minimum",
    },
    {
      name: "NEPL Oredo FST3 (OGPOOC)",
      currentWeek: { volume: 16.15, pressure: 38.19 },
      priorWeek: { volume: 18.92, pressure: 37.85 },
      contractualRange: { min: 55, max: 70 },
      remarks: "🚨 CRITICAL BREACH - 31% below minimum pressure",
    },
    {
      name: "NEPL Oredo (IGHF)",
      currentWeek: { volume: 35.16, pressure: 49.60 },
      priorWeek: { volume: 40.22, pressure: 49.12 },
      contractualRange: { min: 55, max: 70 },
      remarks: "⚠️ PRESSURE BREACH - Below minimum",
    },
    {
      name: "Pan Ocean",
      currentWeek: { volume: 96.75, pressure: 72.02 },
      priorWeek: { volume: 88.34, pressure: 71.58 },
      contractualRange: { min: 55, max: 70 },
      remarks: "⚠️ PRESSURE BREACH - Above maximum",
    },
    {
      name: "Seplat Oben",
      currentWeek: { volume: 300.59, pressure: 56.31 },
      priorWeek: { volume: 285.12, pressure: 56.05 },
      contractualRange: { min: 57, max: 75 },
      remarks: "⚠️ PRESSURE BREACH - Slightly below minimum",
    },
    {
      name: "SPDC - Tunu/FYIP/Otumara",
      currentWeek: { volume: 77.14, pressure: 79.96 },
      priorWeek: { volume: 27.39, pressure: 79.82 },
      contractualRange: { min: 70, max: 80 },
      remarks: "Volume improved and pressure stable. Tunu back online",
    },
    {
      name: "NEPL/Neconde Odidi",
      currentWeek: { volume: 0, pressure: 0 },
      priorWeek: { volume: 0, pressure: 0 },
      contractualRange: { min: 55, max: 70 },
      remarks: "Has been on shutdown",
    },
    {
      name: "AHL",
      currentWeek: { volume: 272.16, pressure: 71.42 },
      priorWeek: { volume: 265.88, pressure: 71.15 },
      contractualRange: { min: 50, max: 78 },
      remarks: "Volume and pressure within range",
    },
    {
      name: "Platform",
      currentWeek: { volume: 17.90, pressure: 55.73 },
      priorWeek: { volume: 18.45, pressure: 55.48 },
      contractualRange: { min: 50, max: 60 },
      remarks: "Operating normally",
    },
    {
      name: "Xenergi",
      currentWeek: { volume: 17.37, pressure: 59.31 },
      priorWeek: { volume: 16.82, pressure: 59.08 },
      contractualRange: { min: 70, max: 85 },
      remarks: "⚠️ PRESSURE BREACH - Below minimum",
    },
    {
      name: "NEPL Ughelli",
      currentWeek: { volume: 43.00, pressure: 24.21 },
      priorWeek: { volume: 41.58, pressure: 24.05 },
      contractualRange: null, // Low pressure line
      remarks: "Low pressure line - no contractual range",
    },
    {
      name: "CHORUS",
      currentWeek: { volume: 16.81, pressure: 60.39 },
      priorWeek: { volume: 15.94, pressure: 60.12 },
      contractualRange: { min: 70, max: 85 },
      remarks: "⚠️ PRESSURE BREACH - Below minimum",
    },
  ];

  // Calculate variances and totals
  const calculateMetrics = () => {
    const totalCurrentVolume = volumePressureData.reduce((sum, p) => sum + p.currentWeek.volume, 0);
    const totalPriorVolume = volumePressureData.reduce((sum, p) => sum + p.priorWeek.volume, 0);
    const volumeVariance = totalCurrentVolume - totalPriorVolume;

    return { totalCurrentVolume, totalPriorVolume, volumeVariance };
  };

  const metrics = calculateMetrics();

  // Check if pressure is breached
  const isPressureBreached = (pressure: number, range: { min: number; max: number } | null): boolean => {
    if (!range || pressure === 0) return false;
    return pressure < range.min || pressure > range.max;
  };

  // Get breach severity
  const getBreachSeverity = (pressure: number, range: { min: number; max: number } | null): "critical" | "warning" | "ok" => {
    if (!range || pressure === 0) return "ok";

    const belowMin = range.min - pressure;
    const aboveMax = pressure - range.max;

    if (belowMin > 0) {
      const deviation = belowMin / range.min;
      if (deviation > 0.2) return "critical";
      return "warning";
    }

    if (aboveMax > 0) {
      const deviation = aboveMax / range.max;
      if (deviation > 0.05) return "warning";
    }

    return "ok";
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Action Bar */}
      <div className="bg-gray-50 border-b px-6 py-3 print:hidden sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/reports" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h2 className="text-lg font-semibold">Weekly MOR: Volume & Pressure</h2>
              <input type="week" value={reportWeek} onChange={(e) => setReportWeek(e.target.value)} className="text-sm text-gray-600 border-0 bg-transparent p-0" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => alert("Excel export coming soon")} className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-300 rounded-md">
              <Download className="w-4 h-4" /> Excel
            </button>
            <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-md">
              <Printer className="w-4 h-4" /> Print
            </button>
          </div>
        </div>
      </div>

      {/* Excel-style Report */}
      <div className="p-8 max-w-[1600px] mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold">WEEKLY WESTERN NETWORK VOLUME & PRESSURE OVERVIEW</h1>
          <p className="text-sm text-gray-600 mt-1">({weekDisplay})</p>
        </div>

        {/* Summary Metrics */}
        <div className="mb-6 flex justify-center gap-8">
          <div className="text-center">
            <p className="text-xs text-gray-600 uppercase">Current Week Total</p>
            <p className="text-2xl font-bold text-blue-700">{metrics.totalCurrentVolume.toFixed(2)}</p>
            <p className="text-xs text-gray-500">mmscf/d</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 uppercase">Prior Week Total</p>
            <p className="text-2xl font-bold text-gray-700">{metrics.totalPriorVolume.toFixed(2)}</p>
            <p className="text-xs text-gray-500">mmscf/d</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 uppercase">Week-on-Week Variance</p>
            <p className={`text-2xl font-bold ${metrics.volumeVariance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              {metrics.volumeVariance >= 0 ? '+' : ''}{metrics.volumeVariance.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">mmscf/d</p>
          </div>
        </div>

        {/* Excel-style Table */}
        <div className="border-2 border-gray-900">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-900">
                <th className="border-r border-gray-900 px-2 py-2 text-left font-bold w-8">S/N</th>
                <th className="border-r border-gray-900 px-3 py-2 text-left font-bold">GAS PRODUCER</th>
                <th colSpan={2} className="border-r border-gray-900 px-3 py-2 text-center font-bold bg-blue-50">
                  CURRENT WEEK
                </th>
                <th colSpan={2} className="border-r border-gray-900 px-3 py-2 text-center font-bold bg-gray-50">
                  PRIOR WEEK
                </th>
                <th colSpan={2} className="border-r border-gray-900 px-3 py-2 text-center font-bold bg-amber-50">
                  VARIANCE
                </th>
                <th className="border-r border-gray-900 px-3 py-2 text-center font-bold">
                  CONTRACTUAL<br />PRESSURE RANGE<br />(barg)
                </th>
                <th className="px-3 py-2 text-left font-bold">ISSUES / REMARKS</th>
              </tr>
              <tr className="bg-gray-100 border-b border-gray-900">
                <th className="border-r border-gray-900 px-2 py-1.5"></th>
                <th className="border-r border-gray-900 px-3 py-1.5"></th>
                <th className="border-r border-gray-700 px-2 py-1.5 text-right font-bold text-[10px]">
                  Volume<br />(mmscf/d)
                </th>
                <th className="border-r border-gray-900 px-2 py-1.5 text-right font-bold text-[10px]">
                  Pressure<br />(barg)
                </th>
                <th className="border-r border-gray-700 px-2 py-1.5 text-right font-bold text-[10px]">
                  Volume<br />(mmscf/d)
                </th>
                <th className="border-r border-gray-900 px-2 py-1.5 text-right font-bold text-[10px]">
                  Pressure<br />(barg)
                </th>
                <th className="border-r border-gray-700 px-2 py-1.5 text-right font-bold text-[10px]">
                  Volume<br />(mmscf/d)
                </th>
                <th className="border-r border-gray-900 px-2 py-1.5 text-right font-bold text-[10px]">
                  Pressure<br />(barg)
                </th>
                <th className="border-r border-gray-900 px-2 py-1.5 text-center font-bold text-[10px]">Min - Max</th>
                <th className="px-3 py-1.5"></th>
              </tr>
            </thead>
            <tbody>
              {volumePressureData.map((producer, idx) => {
                const volumeVariance = producer.currentWeek.volume - producer.priorWeek.volume;
                const pressureVariance = producer.currentWeek.pressure - producer.priorWeek.pressure;
                const breached = isPressureBreached(producer.currentWeek.pressure, producer.contractualRange);
                const severity = getBreachSeverity(producer.currentWeek.pressure, producer.contractualRange);

                return (
                  <tr key={idx} className={`border-b border-gray-300 ${breached ? (severity === 'critical' ? 'bg-red-50' : 'bg-yellow-50') : ''}`}>
                    <td className="border-r border-gray-900 px-2 py-1.5 text-center">{idx + 1}</td>
                    <td className="border-r border-gray-900 px-3 py-1.5">{producer.name}</td>

                    {/* Current Week */}
                    <td className="border-r border-gray-700 px-2 py-1.5 text-right font-mono">
                      {producer.currentWeek.volume > 0 ? producer.currentWeek.volume.toFixed(2) : '—'}
                    </td>
                    <td className={`border-r border-gray-900 px-2 py-1.5 text-right font-mono ${
                      breached ? (severity === 'critical' ? 'text-red-700 font-bold' : 'text-amber-700 font-bold') : ''
                    }`}>
                      {producer.currentWeek.pressure > 0 ? producer.currentWeek.pressure.toFixed(2) : '—'}
                    </td>

                    {/* Prior Week */}
                    <td className="border-r border-gray-700 px-2 py-1.5 text-right font-mono text-gray-600">
                      {producer.priorWeek.volume > 0 ? producer.priorWeek.volume.toFixed(2) : '—'}
                    </td>
                    <td className="border-r border-gray-900 px-2 py-1.5 text-right font-mono text-gray-600">
                      {producer.priorWeek.pressure > 0 ? producer.priorWeek.pressure.toFixed(2) : '—'}
                    </td>

                    {/* Variance */}
                    <td className={`border-r border-gray-700 px-2 py-1.5 text-right font-mono ${
                      volumeVariance > 0 ? 'text-green-700' : volumeVariance < 0 ? 'text-red-700' : 'text-gray-600'
                    }`}>
                      {producer.currentWeek.volume > 0 || producer.priorWeek.volume > 0
                        ? `${volumeVariance >= 0 ? '+' : ''}${volumeVariance.toFixed(2)}`
                        : '—'}
                    </td>
                    <td className={`border-r border-gray-900 px-2 py-1.5 text-right font-mono ${
                      pressureVariance > 0 ? 'text-green-700' : pressureVariance < 0 ? 'text-red-700' : 'text-gray-600'
                    }`}>
                      {producer.currentWeek.pressure > 0 || producer.priorWeek.pressure > 0
                        ? `${pressureVariance >= 0 ? '+' : ''}${pressureVariance.toFixed(2)}`
                        : '—'}
                    </td>

                    {/* Contractual Range */}
                    <td className="border-r border-gray-900 px-2 py-1.5 text-center font-mono text-gray-700">
                      {producer.contractualRange
                        ? `${producer.contractualRange.min} - ${producer.contractualRange.max}`
                        : 'N/A'}
                    </td>

                    {/* Remarks */}
                    <td className="px-3 py-1.5 text-[11px]">{producer.remarks}</td>
                  </tr>
                );
              })}

              {/* Total Row */}
              <tr className="bg-gray-800 text-white font-bold border-t-2 border-gray-900">
                <td colSpan={2} className="border-r border-gray-900 px-3 py-2 text-right">TOTAL / AVERAGE</td>
                <td className="border-r border-gray-700 px-2 py-2 text-right font-mono">{metrics.totalCurrentVolume.toFixed(2)}</td>
                <td className="border-r border-gray-900 px-2 py-2 text-right">—</td>
                <td className="border-r border-gray-700 px-2 py-2 text-right font-mono">{metrics.totalPriorVolume.toFixed(2)}</td>
                <td className="border-r border-gray-900 px-2 py-2 text-right">—</td>
                <td className={`border-r border-gray-700 px-2 py-2 text-right font-mono ${
                  metrics.volumeVariance >= 0 ? 'text-green-300' : 'text-red-300'
                }`}>
                  {metrics.volumeVariance >= 0 ? '+' : ''}{metrics.volumeVariance.toFixed(2)}
                </td>
                <td className="border-r border-gray-900 px-2 py-2"></td>
                <td className="border-r border-gray-900 px-2 py-2"></td>
                <td className="px-3 py-2"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pressure Breach Summary */}
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded">
          <h3 className="font-bold text-amber-900 mb-2">⚠️ Pressure Breach Summary</h3>
          <p className="text-sm text-amber-800">
            <strong>6 out of 13 producers</strong> are operating outside their contractual pressure ranges:
          </p>
          <ul className="text-sm text-amber-800 mt-2 space-y-1 ml-4">
            <li>🚨 <strong>CRITICAL:</strong> NEPL Oredo FST3 (38.19 barg vs 55-70 range) - 31% below minimum</li>
            <li>⚠️ NEPL/NDW Utorogu, NEPL Oredo (IGHF), Pan Ocean, Seplat Oben, Xenergi, Chorus Energy</li>
          </ul>
        </div>

        <div className="mt-6 text-xs text-gray-500 flex justify-between">
          <div>Generated: {new Date().toLocaleString()}</div>
          <div>NNPC Limited - Western Network Operations</div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          @page { size: landscape; margin: 0.5in; }
          .print\\\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}
