"use client";

import { ArrowLeft, Download, Printer } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function MORSupplyPage() {
  const [reportWeek, setReportWeek] = useState("2026-W31");

  // Format week for display
  const weekDisplay = "Week of August 1-7, 2026";

  // MOR Supply data - matching Excel two-column layout
  const supplyData = {
    producers: [
      { name: "CNL-Escravos", volume: 2310.625 },
      { name: "NEPL/NDW Utorogu", volume: 1286.12 },
      { name: "NEPL Oredo FST3 (OGPOOC)", volume: 113.028 },
      { name: "NEPL Oredo (IGHF)", volume: 246.11 },
      { name: "Pan Ocean", volume: 677.26 },
      { name: "Seplat Oben", volume: 2104.108 },
      { name: "SPDC - Tunu/FYIP/Otumara", volume: 540 },
      { name: "NEPL/Neconde Odidi", volume: 0 },
      { name: "AHL", volume: 1905.12 },
      { name: "Platform", volume: 125.286 },
      { name: "Xenergi", volume: 121.57 },
      { name: "NEPL Ughelli", volume: 301.04 },
      { name: "CHORUS", volume: 117.697 },
    ],
    offtakers: [
      { name: "GASLINK, FALCON, etc.", source: "CNL, NPDC JV", allocation: 1250.5, offtake: 1185.2 },
      { name: "Power Plants (Western)", source: "CNL, NEPL, Seplat", allocation: 2840.0, offtake: 2650.8 },
      { name: "Power Plants (Eastern)", source: "TEPNG, NAOC", allocation: 1580.0, offtake: 1420.5 },
      { name: "Dangote Fertiliser", source: "NEPL, Seplat", allocation: 1365.0, offtake: 1320.8 },
      { name: "Indorama", source: "TEPNG, NAOC", allocation: 1015.5, offtake: 975.2 },
      { name: "WAGP", source: "CNL, SPDC", allocation: 840.0, offtake: 798.9 },
    ],
  };

  const totalSupply = supplyData.producers.reduce((sum, p) => sum + p.volume, 0);
  const totalAllocation = supplyData.offtakers.reduce((sum, o) => sum + o.allocation, 0);
  const totalOfftake = supplyData.offtakers.reduce((sum, o) => sum + o.offtake, 0);
  const materialBalance = totalSupply - totalOfftake;

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
              <h2 className="text-lg font-semibold">Weekly MOR Supply Report</h2>
              <input type="week" value={reportWeek} onChange={(e) => setReportWeek(e.target.value)} className="text-sm text-gray-600 border-0 bg-transparent p-0" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-md">
              <Printer className="w-4 h-4" /> Print
            </button>
          </div>
        </div>
      </div>

      {/* Excel-style Report */}
      <div className="p-8 max-w-[1400px] mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold">WEEKLY GAS SUPPLY, ALLOCATIONS & OFFTAKE OVERVIEW</h1>
          <p className="text-sm text-gray-600 mt-1">({weekDisplay})</p>
        </div>

        {/* Two-column layout matching Excel */}
        <div className="grid grid-cols-2 gap-6">
          {/* LEFT COLUMN - GAS SUPPLY SITUATION */}
          <div className="border-2 border-gray-900">
            <div className="bg-blue-600 text-white px-3 py-2 font-bold text-center">GAS SUPPLY SITUATION</div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-900">
                  <th className="border-r border-gray-700 px-2 py-2 text-left w-12">S/N</th>
                  <th className="border-r border-gray-700 px-2 py-2 text-left">GAS PRODUCER</th>
                  <th className="px-2 py-2 text-right">VOLUME (MMscf)</th>
                </tr>
              </thead>
              <tbody>
                {supplyData.producers.map((producer, idx) => (
                  <tr key={idx} className="border-b border-gray-300">
                    <td className="border-r border-gray-300 px-2 py-1.5 text-center">{idx + 1}</td>
                    <td className="border-r border-gray-300 px-2 py-1.5">{producer.name}</td>
                    <td className="px-2 py-1.5 text-right font-mono">{producer.volume.toFixed(3)}</td>
                  </tr>
                ))}
                <tr className="bg-gray-800 text-white font-bold border-t-2 border-gray-900">
                  <td colSpan={2} className="border-r border-gray-700 px-2 py-2 text-right">TOTAL SUPPLY</td>
                  <td className="px-2 py-2 text-right font-mono">{totalSupply.toFixed(3)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* RIGHT COLUMN - ALLOCATION & OFFTAKE */}
          <div className="border-2 border-gray-900">
            <div className="bg-green-700 text-white px-3 py-2 font-bold text-center">ALLOCATION & OFFTAKE SITUATION</div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-900">
                  <th className="border-r border-gray-700 px-2 py-2 text-left w-12">S/N</th>
                  <th className="border-r border-gray-700 px-2 py-2 text-left">OFFTAKER</th>
                  <th className="border-r border-gray-700 px-2 py-2 text-left text-xs">SOURCE OF ALLOCATION</th>
                  <th className="border-r border-gray-700 px-2 py-2 text-right text-xs">ALLOCATION (MMscf)</th>
                  <th className="px-2 py-2 text-right text-xs">ACTUAL OFFTAKE (MMscf)</th>
                </tr>
              </thead>
              <tbody>
                {supplyData.offtakers.map((offtaker, idx) => (
                  <tr key={idx} className="border-b border-gray-300">
                    <td className="border-r border-gray-300 px-2 py-1.5 text-center">{idx + 1}</td>
                    <td className="border-r border-gray-300 px-2 py-1.5 text-xs">{offtaker.name}</td>
                    <td className="border-r border-gray-300 px-2 py-1.5 text-xs">{offtaker.source}</td>
                    <td className="border-r border-gray-300 px-2 py-1.5 text-right font-mono">{offtaker.allocation.toFixed(3)}</td>
                    <td className="px-2 py-1.5 text-right font-mono">{offtaker.offtake.toFixed(3)}</td>
                  </tr>
                ))}
                <tr className="bg-gray-800 text-white font-bold border-t-2 border-gray-900">
                  <td colSpan={3} className="border-r border-gray-700 px-2 py-2 text-right">TOTAL</td>
                  <td className="border-r border-gray-700 px-2 py-2 text-right font-mono">{totalAllocation.toFixed(3)}</td>
                  <td className="px-2 py-2 text-right font-mono">{totalOfftake.toFixed(3)}</td>
                </tr>
                <tr className="bg-blue-900 text-white font-bold border-t border-gray-700">
                  <td colSpan={4} className="border-r border-gray-600 px-2 py-2 text-right">MATERIAL BALANCE / LINE PACK</td>
                  <td className="px-2 py-2 text-right font-mono">{materialBalance.toFixed(3)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 text-xs text-gray-500 flex justify-between">
          <div>Generated: {new Date().toLocaleString()}</div>
          <div>NNPC Limited</div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          @page { size: landscape; margin: 0.5in; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}
