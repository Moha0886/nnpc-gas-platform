"use client";

import { ArrowLeft, Download, Printer } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function NGMLDailyReportPage() {
  const [reportDate, setReportDate] = useState("2026-08-01");

  // Format date for display
  const displayDate = new Date(reportDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // NGML Daily Report data - matching Excel structure
  const ngmlData = {
    allocationFromNGIC: 353.55,
    ngmlNomination: 377.0,

    // Regional Gas Distribution zones
    rgdZones: [
      { name: "REGIONAL GAS DISTRIBUTION LAGOS", allocation: 85.2, offtake: 78.5 },
      { name: "REGIONAL GAS DISTRIBUTION CALABAR", allocation: 62.0, offtake: 57.3 },
      { name: "REGIONAL GAS DISTRIBUTION ABUJA", allocation: 45.8, offtake: 42.1 },
      { name: "REGIONAL GAS DISTRIBUTION PORT HARCOURT", allocation: 38.5, offtake: 35.9 },
    ],

    // Industrial customers
    industrial: [
      { name: "GASLINK", designCapacity: 95.0, nominations: 82.47, allocation: 82.47, offtake: 56.80, pressure: "52/34", status: "ON STREAM" },
      { name: "FALCON", designCapacity: 20.0, nominations: 15.55, allocation: 15.55, offtake: 13.11, pressure: "52/34", status: "ON STREAM" },
      { name: "SNG", designCapacity: 10.0, nominations: 10.0, allocation: 10.0, offtake: 10.0, pressure: "52/34", status: "ON STREAM (FIRM)" },
      { name: "WAPCO SHAG", designCapacity: 2.5, nominations: 0.43, allocation: 0.43, offtake: 0.43, pressure: "52/34", status: "ON STREAM" },
      { name: "WAPCO EWEK", designCapacity: 50.0, nominations: 41.60, allocation: 41.60, offtake: 40.60, pressure: "52/34", status: "ON STREAM" },
      { name: "IBESHE CEMENT", designCapacity: 110.0, nominations: 101.28, allocation: 0, offtake: 0, pressure: "0/0", status: "STATION ON STANDBY" },
    ],

    // NGML-NIPCO UJV Franchise
    nipcoUjv: [
      { name: "LPL G/PWR", designCapacity: 12.0, nominations: 10.5, allocation: 10.5, offtake: 9.8, pressure: "45/30", status: "ON STREAM" },
      { name: "OLAM", designCapacity: 8.5, nominations: 7.2, allocation: 7.2, offtake: 6.9, pressure: "45/30", status: "ON STREAM" },
      { name: "BREEZE", designCapacity: 5.0, nominations: 4.5, allocation: 4.5, offtake: 4.2, pressure: "45/30", status: "ON STREAM" },
      { name: "NESTLE", designCapacity: 15.0, nominations: 13.8, allocation: 13.8, offtake: 13.5, pressure: "45/30", status: "ON STREAM" },
      { name: "AIML", designCapacity: 6.0, nominations: 5.3, allocation: 5.3, offtake: 4.9, pressure: "45/30", status: "ON STREAM" },
    ],

    // TRANSIT GAS FRANCHISE
    transitGas: [
      { name: "APPLE&PEARS", designCapacity: 3.5, nominations: 2.8, allocation: 2.8, offtake: 2.6, pressure: "40/28", status: "ON STREAM" },
      { name: "WASIL", designCapacity: 4.0, nominations: 3.5, allocation: 3.5, offtake: 3.2, pressure: "40/28", status: "ON STREAM" },
      { name: "URAGA POWER", designCapacity: 8.0, nominations: 7.0, allocation: 7.0, offtake: 6.8, pressure: "40/28", status: "ON STREAM" },
      { name: "EMZOR", designCapacity: 2.5, nominations: 2.1, allocation: 2.1, offtake: 2.0, pressure: "40/28", status: "ON STREAM" },
      { name: "RITE FOODS", designCapacity: 5.5, nominations: 4.8, allocation: 4.8, offtake: 4.5, pressure: "40/28", status: "ON STREAM" },
    ],
  };

  // Calculate totals
  const calculateTotals = () => {
    const rgdTotal = {
      allocation: ngmlData.rgdZones.reduce((sum, z) => sum + z.allocation, 0),
      offtake: ngmlData.rgdZones.reduce((sum, z) => sum + z.offtake, 0),
    };

    const industrialTotal = {
      designCapacity: ngmlData.industrial.reduce((sum, c) => sum + c.designCapacity, 0),
      nominations: ngmlData.industrial.reduce((sum, c) => sum + c.nominations, 0),
      allocation: ngmlData.industrial.reduce((sum, c) => sum + c.allocation, 0),
      offtake: ngmlData.industrial.reduce((sum, c) => sum + c.offtake, 0),
    };

    const nipcoTotal = {
      designCapacity: ngmlData.nipcoUjv.reduce((sum, c) => sum + c.designCapacity, 0),
      nominations: ngmlData.nipcoUjv.reduce((sum, c) => sum + c.nominations, 0),
      allocation: ngmlData.nipcoUjv.reduce((sum, c) => sum + c.allocation, 0),
      offtake: ngmlData.nipcoUjv.reduce((sum, c) => sum + c.offtake, 0),
    };

    const transitTotal = {
      designCapacity: ngmlData.transitGas.reduce((sum, c) => sum + c.designCapacity, 0),
      nominations: ngmlData.transitGas.reduce((sum, c) => sum + c.nominations, 0),
      allocation: ngmlData.transitGas.reduce((sum, c) => sum + c.allocation, 0),
      offtake: ngmlData.transitGas.reduce((sum, c) => sum + c.offtake, 0),
    };

    const grandTotal = {
      designCapacity: industrialTotal.designCapacity + nipcoTotal.designCapacity + transitTotal.designCapacity,
      nominations: industrialTotal.nominations + nipcoTotal.nominations + transitTotal.nominations,
      allocation: industrialTotal.allocation + nipcoTotal.allocation + transitTotal.allocation,
      offtake: industrialTotal.offtake + nipcoTotal.offtake + transitTotal.offtake,
    };

    return { rgdTotal, industrialTotal, nipcoTotal, transitTotal, grandTotal };
  };

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-white">
      {/* Action Bar - Hidden in print */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 print:hidden sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/reports" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">NGML Daily Report</h2>
              <input
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className="text-sm text-gray-600 border-0 bg-transparent p-0 focus:ring-0"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert("Excel export coming soon")}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Download className="w-4 h-4" />
              Excel
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>
      </div>

      {/* Report Content - Excel-style layout */}
      <div className="p-8 max-w-[1400px] mx-auto">
        {/* Header - Matching Excel exactly */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-gray-900 mb-1">
            NNPC GAS MARKETING LIMITED
          </h1>
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Daily Gas Situation Report
          </h2>
          <p className="text-sm text-gray-600">Date: {displayDate}</p>
        </div>

        {/* Key Metrics Row */}
        <div className="mb-6 flex justify-center gap-12">
          <div className="text-center">
            <p className="text-xs text-gray-600 uppercase">Allocation from NGIC</p>
            <p className="text-2xl font-bold text-blue-700">{ngmlData.allocationFromNGIC.toFixed(2)}</p>
            <p className="text-xs text-gray-500">MMscfd</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 uppercase">NGML Nomination</p>
            <p className="text-2xl font-bold text-green-700">{ngmlData.ngmlNomination.toFixed(2)}</p>
            <p className="text-xs text-gray-500">MMscfd</p>
          </div>
        </div>

        {/* Excel-style Table */}
        <div className="border-2 border-gray-900 overflow-hidden mb-6">
          <table className="w-full text-sm">
            {/* Table Header */}
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-900">
                <th className="border-r border-gray-900 px-2 py-2 text-left font-bold w-10">S/N</th>
                <th className="border-r border-gray-900 px-2 py-2 text-left font-bold w-10">S/N</th>
                <th className="border-r border-gray-900 px-3 py-2 text-left font-bold">CUSTOMER NAME</th>
                <th className="border-r border-gray-900 px-3 py-2 text-right font-bold">
                  DESIGN<br />CAPACITY<br />(MMscfd)
                </th>
                <th className="border-r border-gray-900 px-3 py-2 text-right font-bold">
                  NOMINATIONS<br />(MMscfd)
                </th>
                <th className="border-r border-gray-900 px-3 py-2 text-right font-bold">
                  ALLOCATION<br />(MMscfd)
                </th>
                <th className="border-r border-gray-900 px-3 py-2 text-right font-bold">
                  OFFTAKE<br />(MMscfd)
                </th>
                <th className="border-r border-gray-900 px-3 py-2 text-center font-bold">
                  PRESSURE<br />(BAR)
                </th>
                <th className="px-3 py-2 text-left font-bold">REMARKS/STATUS</th>
              </tr>
            </thead>

            <tbody>
              {/* RGD Zones Summary */}
              {ngmlData.rgdZones.map((zone, idx) => (
                <tr key={`rgd-${idx}`} className="border-b border-gray-300 bg-blue-50">
                  <td className="border-r border-gray-900 px-2 py-1.5 text-center">{idx + 1}</td>
                  <td className="border-r border-gray-900 px-2 py-1.5 text-center">{idx + 1}</td>
                  <td className="border-r border-gray-900 px-3 py-1.5 font-semibold">{zone.name}</td>
                  <td className="border-r border-gray-900 px-3 py-1.5 text-right font-mono">—</td>
                  <td className="border-r border-gray-900 px-3 py-1.5 text-right font-mono">—</td>
                  <td className="border-r border-gray-900 px-3 py-1.5 text-right font-mono">{zone.allocation.toFixed(3)}</td>
                  <td className="border-r border-gray-900 px-3 py-1.5 text-right font-mono">{zone.offtake.toFixed(3)}</td>
                  <td className="border-r border-gray-900 px-3 py-1.5 text-center">—</td>
                  <td className="px-3 py-1.5">Regional Distribution</td>
                </tr>
              ))}

              {/* SUB -TOTAL 1 (note the space before hyphen) */}
              <tr className="bg-blue-200 border-t-2 border-b-2 border-gray-900 font-bold">
                <td colSpan={5} className="border-r border-gray-900 px-3 py-2 text-right">SUB -TOTAL 1</td>
                <td className="border-r border-gray-900 px-3 py-2 text-right font-mono">{totals.rgdTotal.allocation.toFixed(3)}</td>
                <td className="border-r border-gray-900 px-3 py-2 text-right font-mono">{totals.rgdTotal.offtake.toFixed(3)}</td>
                <td className="border-r border-gray-900 px-3 py-2"></td>
                <td className="px-3 py-2"></td>
              </tr>

              {/* Industrial Customers */}
              {ngmlData.industrial.map((customer, idx) => (
                <tr key={`ind-${idx}`} className="border-b border-gray-300">
                  <td className="border-r border-gray-900 px-2 py-1.5 text-center">{5 + idx + 1}</td>
                  <td className="border-r border-gray-900 px-2 py-1.5 text-center">{idx + 1}</td>
                  <td className="border-r border-gray-900 px-3 py-1.5">{customer.name}</td>
                  <td className="border-r border-gray-900 px-3 py-1.5 text-right font-mono">{customer.designCapacity.toFixed(3)}</td>
                  <td className="border-r border-gray-900 px-3 py-1.5 text-right font-mono">{customer.nominations.toFixed(3)}</td>
                  <td className="border-r border-gray-900 px-3 py-1.5 text-right font-mono">{customer.allocation.toFixed(3)}</td>
                  <td className="border-r border-gray-900 px-3 py-1.5 text-right font-mono">{customer.offtake.toFixed(3)}</td>
                  <td className="border-r border-gray-900 px-3 py-1.5 text-center font-mono">{customer.pressure}</td>
                  <td className="px-3 py-1.5">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        customer.status.includes("FIRM")
                          ? "bg-green-100 text-green-800"
                          : customer.status === "ON STREAM"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>
                </tr>
              ))}

              {/* Industrial Subtotal */}
              <tr className="bg-gray-100 border-t border-b border-gray-900 font-semibold">
                <td colSpan={3} className="border-r border-gray-900 px-3 py-2 text-right">Sub-Total (Industrial)</td>
                <td className="border-r border-gray-900 px-3 py-2 text-right font-mono">{totals.industrialTotal.designCapacity.toFixed(3)}</td>
                <td className="border-r border-gray-900 px-3 py-2 text-right font-mono">{totals.industrialTotal.nominations.toFixed(3)}</td>
                <td className="border-r border-gray-900 px-3 py-2 text-right font-mono">{totals.industrialTotal.allocation.toFixed(3)}</td>
                <td className="border-r border-gray-900 px-3 py-2 text-right font-mono">{totals.industrialTotal.offtake.toFixed(3)}</td>
                <td className="border-r border-gray-900 px-3 py-2"></td>
                <td className="px-3 py-2"></td>
              </tr>

              {/* NGML-NIPCO UJV Franchise Header */}
              <tr className="bg-purple-100 border-b border-gray-700">
                <td colSpan={9} className="px-3 py-2 font-bold text-purple-900">NGML-NIPCO UJV</td>
              </tr>

              {/* NIPCO UJV Customers */}
              {ngmlData.nipcoUjv.map((customer, idx) => (
                <tr key={`nipco-${idx}`} className="border-b border-gray-300">
                  <td className="border-r border-gray-900 px-2 py-1.5 text-center">{11 + idx + 1}</td>
                  <td className="border-r border-gray-900 px-2 py-1.5 text-center">{idx + 1}</td>
                  <td className="border-r border-gray-900 px-3 py-1.5">{customer.name}</td>
                  <td className="border-r border-gray-900 px-3 py-1.5 text-right font-mono">{customer.designCapacity.toFixed(3)}</td>
                  <td className="border-r border-gray-900 px-3 py-1.5 text-right font-mono">{customer.nominations.toFixed(3)}</td>
                  <td className="border-r border-gray-900 px-3 py-1.5 text-right font-mono">{customer.allocation.toFixed(3)}</td>
                  <td className="border-r border-gray-900 px-3 py-1.5 text-right font-mono">{customer.offtake.toFixed(3)}</td>
                  <td className="border-r border-gray-900 px-3 py-1.5 text-center font-mono">{customer.pressure}</td>
                  <td className="px-3 py-1.5">
                    <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">{customer.status}</span>
                  </td>
                </tr>
              ))}

              {/* NIPCO Subtotal */}
              <tr className="bg-purple-50 border-t border-b border-gray-900 font-semibold">
                <td colSpan={3} className="border-r border-gray-900 px-3 py-2 text-right">Sub-Total (NGML-NIPCO UJV)</td>
                <td className="border-r border-gray-900 px-3 py-2 text-right font-mono">{totals.nipcoTotal.designCapacity.toFixed(3)}</td>
                <td className="border-r border-gray-900 px-3 py-2 text-right font-mono">{totals.nipcoTotal.nominations.toFixed(3)}</td>
                <td className="border-r border-gray-900 px-3 py-2 text-right font-mono">{totals.nipcoTotal.allocation.toFixed(3)}</td>
                <td className="border-r border-gray-900 px-3 py-2 text-right font-mono">{totals.nipcoTotal.offtake.toFixed(3)}</td>
                <td className="border-r border-gray-900 px-3 py-2"></td>
                <td className="px-3 py-2"></td>
              </tr>

              {/* TRANSIT GAS FRANCHISE Header */}
              <tr className="bg-orange-100 border-b border-gray-700">
                <td colSpan={9} className="px-3 py-2 font-bold text-orange-900">TRANSIT GAS FRANCHISE</td>
              </tr>

              {/* Transit Gas Customers */}
              {ngmlData.transitGas.map((customer, idx) => (
                <tr key={`transit-${idx}`} className="border-b border-gray-300">
                  <td className="border-r border-gray-900 px-2 py-1.5 text-center">{17 + idx + 1}</td>
                  <td className="border-r border-gray-900 px-2 py-1.5 text-center">{idx + 1}</td>
                  <td className="border-r border-gray-900 px-3 py-1.5">{customer.name}</td>
                  <td className="border-r border-gray-900 px-3 py-1.5 text-right font-mono">{customer.designCapacity.toFixed(3)}</td>
                  <td className="border-r border-gray-900 px-3 py-1.5 text-right font-mono">{customer.nominations.toFixed(3)}</td>
                  <td className="border-r border-gray-900 px-3 py-1.5 text-right font-mono">{customer.allocation.toFixed(3)}</td>
                  <td className="border-r border-gray-900 px-3 py-1.5 text-right font-mono">{customer.offtake.toFixed(3)}</td>
                  <td className="border-r border-gray-900 px-3 py-1.5 text-center font-mono">{customer.pressure}</td>
                  <td className="px-3 py-1.5">
                    <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">{customer.status}</span>
                  </td>
                </tr>
              ))}

              {/* Transit Gas Subtotal */}
              <tr className="bg-orange-50 border-t border-b border-gray-900 font-semibold">
                <td colSpan={3} className="border-r border-gray-900 px-3 py-2 text-right">Sub-Total (TRANSIT GAS FRANCHISE)</td>
                <td className="border-r border-gray-900 px-3 py-2 text-right font-mono">{totals.transitTotal.designCapacity.toFixed(3)}</td>
                <td className="border-r border-gray-900 px-3 py-2 text-right font-mono">{totals.transitTotal.nominations.toFixed(3)}</td>
                <td className="border-r border-gray-900 px-3 py-2 text-right font-mono">{totals.transitTotal.allocation.toFixed(3)}</td>
                <td className="border-r border-gray-900 px-3 py-2 text-right font-mono">{totals.transitTotal.offtake.toFixed(3)}</td>
                <td className="border-r border-gray-900 px-3 py-2"></td>
                <td className="px-3 py-2"></td>
              </tr>

              {/* Grand Total Row */}
              <tr className="bg-gray-800 text-white border-t-2 border-gray-900 font-bold">
                <td colSpan={3} className="border-r border-gray-900 px-3 py-3 text-right text-base">GRAND TOTAL</td>
                <td className="border-r border-gray-900 px-3 py-3 text-right font-mono text-base">{totals.grandTotal.designCapacity.toFixed(3)}</td>
                <td className="border-r border-gray-900 px-3 py-3 text-right font-mono text-base">{totals.grandTotal.nominations.toFixed(3)}</td>
                <td className="border-r border-gray-900 px-3 py-3 text-right font-mono text-base">{totals.grandTotal.allocation.toFixed(3)}</td>
                <td className="border-r border-gray-900 px-3 py-3 text-right font-mono text-base">{totals.grandTotal.offtake.toFixed(3)}</td>
                <td className="border-r border-gray-900 px-3 py-3"></td>
                <td className="px-3 py-3"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer - Print info */}
        <div className="mt-6 text-xs text-gray-500 flex justify-between">
          <div>Generated: {new Date().toLocaleString()}</div>
          <div>NNPC Gas Marketing Limited</div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: landscape;
            margin: 0.5in;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
