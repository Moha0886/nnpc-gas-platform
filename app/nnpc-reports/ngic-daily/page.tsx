"use client";

import { ArrowLeft, Download, Printer } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function NGICDailyReportPage() {
  const [reportDate, setReportDate] = useState("2026-08-01");

  // Format date for display
  const displayDate = new Date(reportDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const monthYear = new Date(reportDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  }).toUpperCase();

  // Sample data matching NGIC Excel structure: Region → Customer Type → Station
  const ngicData = {
    regions: [
      {
        region: "AOW", // Implied - shown in data but not as header in Excel
        customerTypes: [
          {
            type: "NPDC Power Customers",
            stations: [
              { name: "Transcorp Ughelli", allocation: 51.548, offtake: 51.548, pressure: "52/34", megawatts: 193.54, status: "STATION ON STREAM" },
            ],
          },
          {
            type: "NDPHC Power Customers",
            stations: [
              { name: "NIPP Olorunsogo", allocation: 52.000, offtake: 27.562, pressure: "64/55", megawatts: 103.73, status: "STATION ON STREAM" },
              { name: "NIPP Ihovbor", allocation: 52.000, offtake: 0, pressure: "52/34", megawatts: 0, status: "STATION ON STANDBY" },
              { name: "NIPP Omotosho", allocation: 49.000, offtake: 22.174, pressure: "55/43", megawatts: 83.35, status: "STATION ON STREAM" },
              { name: "NIPP Geregu", allocation: 65.000, offtake: 16.510, pressure: "60/50", megawatts: 62.08, status: "STATION ON STREAM" },
              { name: "NIPP Sapele", allocation: 30.000, offtake: 0, pressure: "52/34", megawatts: 0, status: "STATION ON STANDBY" },
              { name: "Azura Power", allocation: 100.000, offtake: 95.004, pressure: "58/46", megawatts: 400.24, status: "STATION ON STREAM" },
            ],
          },
          {
            type: "Industrial Customers",
            stations: [
              { name: "GASLINK", allocation: 82.470, offtake: 56.800, pressure: "52/34", status: "STATION ON STREAM" },
              { name: "Falcon Petroleum Limited", allocation: 15.550, offtake: 13.110, pressure: "52/34", status: "STATION ON STREAM" },
              { name: "WAPCO Sagamu", allocation: 0.430, offtake: 0.430, pressure: "52/34", status: "STATION ON STREAM" },
              { name: "WAPCO Ewekoro", allocation: 41.600, offtake: 40.600, pressure: "52/34", status: "STATION ON STREAM" },
            ],
          },
          {
            type: "Other Transmission",
            stations: [
              { name: "SNG", allocation: 10.000, offtake: 10.000, pressure: "52/34", status: "STATION ON STREAM" },
              { name: "SPDC Edjeba", allocation: 15.000, offtake: 15.000, pressure: "52/34", status: "STATION ON STREAM" },
              { name: "DFL (Dangote fertilizer limited)", allocation: 195.000, offtake: 188.962, pressure: "52/34", status: "STATION ON STREAM" },
              { name: "SPDC Ogunu", allocation: 8.000, offtake: 8.000, pressure: "52/34", status: "STATION ON STREAM" },
            ],
          },
          {
            type: "Export",
            stations: [
              { name: "WAGP", allocation: 130.189, offtake: 130.189, pressure: "52/34", status: "STATION ON STREAM" },
            ],
          },
        ],
      },
      {
        region: "AOE",
        customerTypes: [
          {
            type: "7 Energy Power Customers",
            stations: [
              { name: "NDPHC Calabar", allocation: 62.000, offtake: 57.277, pressure: "54/42", status: "STATION ON STREAM" },
            ],
          },
          {
            type: "Direct Power Customer",
            stations: [
              { name: "Trans-Afam", allocation: 20.000, offtake: 12.935, pressure: "56/44", status: "STATION ON STREAM" },
              { name: "ALAOJI", allocation: 175.000, offtake: 0, pressure: "0/0", megawatts: 0, status: "STATION ON STANDBY" },
            ],
          },
          {
            type: "Commercial Customer",
            stations: [
              { name: "Gel Utility Limited", allocation: 5.000, offtake: 1.606, pressure: "52/34", status: "STATION ON STREAM" },
            ],
          },
        ],
      },
    ],
  };

  // Calculate totals
  const calculateTotals = () => {
    let totalAllocation = 0;
    let totalOfftake = 0;
    let totalMegawatts = 0;

    ngicData.regions.forEach((region) => {
      region.customerTypes.forEach((ct) => {
        ct.stations.forEach((station) => {
          totalAllocation += station.allocation;
          totalOfftake += station.offtake;
          if (station.megawatts) totalMegawatts += station.megawatts;
        });
      });
    });

    return { totalAllocation, totalOfftake, totalMegawatts };
  };

  const totals = calculateTotals();

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert("Excel export coming soon");
  };

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
              <h2 className="text-lg font-semibold text-gray-900">NGIC Daily Report</h2>
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
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Download className="w-4 h-4" />
              Excel
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>
      </div>

      {/* Report Content - Excel-style layout */}
      <div className="p-8 max-w-[1200px] mx-auto">
        {/* Header - Matching Excel exactly */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-gray-900 mb-1">
            NNPC GAS INFRASTRUCTURE COMPANY LIMITED
          </h1>
          <p className="text-sm text-gray-700 mb-4">
            (A Subsidiary of Nigerian National Petroleum Company Limited)
          </p>
          <h2 className="text-lg font-bold text-gray-900">
            GAS OFF-TAKE FOR {monthYear}
          </h2>
          <p className="text-sm text-gray-600 mt-1">Date: {displayDate}</p>
        </div>

        {/* Excel-style Table */}
        <div className="border border-gray-900 overflow-hidden">
          <table className="w-full text-sm">
            {/* Table Header */}
            <thead>
              <tr className="bg-gray-100 border-b border-gray-900">
                <th className="border-r border-gray-900 px-3 py-2 text-left font-bold">REGION</th>
                <th className="border-r border-gray-900 px-3 py-2 text-left font-bold">CUSTOMER TYPE</th>
                <th className="border-r border-gray-900 px-3 py-2 text-left font-bold">STATION NAME</th>
                <th className="border-r border-gray-900 px-3 py-2 text-right font-bold">
                  ALLOCATION<br />(Mmscfd)
                </th>
                <th className="border-r border-gray-900 px-3 py-2 text-right font-bold">
                  OFFTAKE<br />(Mmscfd)
                </th>
                <th className="border-r border-gray-900 px-3 py-2 text-center font-bold">
                  PRESSURE<br />(bar)
                </th>
                <th className="border-r border-gray-900 px-3 py-2 text-right font-bold">
                  MEGAWATTS<br />(MW)
                </th>
                <th className="px-3 py-2 text-left font-bold">REMARKS/STATUS</th>
              </tr>
            </thead>

            <tbody>
              {ngicData.regions.map((region, regionIdx) => (
                <>
                  {region.customerTypes.map((customerType, ctIdx) => (
                    <>
                      {customerType.stations.map((station, stationIdx) => {
                        const isFirstInCustomerType = stationIdx === 0;
                        const rowspan = customerType.stations.length;

                        return (
                          <tr key={`${regionIdx}-${ctIdx}-${stationIdx}`} className="border-b border-gray-300">
                            {/* Region - only show on first station of first customer type */}
                            {ctIdx === 0 && stationIdx === 0 && (
                              <td
                                rowSpan={region.customerTypes.reduce((sum, ct) => sum + ct.stations.length, 0)}
                                className="border-r border-gray-900 px-3 py-2 font-semibold align-top bg-gray-50"
                              >
                                {region.region}
                              </td>
                            )}

                            {/* Customer Type - show on first station only */}
                            {isFirstInCustomerType && (
                              <td
                                rowSpan={rowspan}
                                className="border-r border-gray-900 px-3 py-2 align-top bg-blue-50"
                              >
                                {customerType.type}
                              </td>
                            )}

                            {/* Station Name */}
                            <td className="border-r border-gray-900 px-3 py-2">{station.name}</td>

                            {/* Allocation */}
                            <td className="border-r border-gray-900 px-3 py-2 text-right font-mono">
                              {station.allocation.toFixed(3)}
                            </td>

                            {/* Offtake */}
                            <td className="border-r border-gray-900 px-3 py-2 text-right font-mono">
                              {station.offtake.toFixed(3)}
                            </td>

                            {/* Pressure */}
                            <td className="border-r border-gray-900 px-3 py-2 text-center font-mono">
                              {station.pressure}
                            </td>

                            {/* Megawatts */}
                            <td className="border-r border-gray-900 px-3 py-2 text-right font-mono">
                              {station.megawatts ? station.megawatts.toFixed(2) : "-"}
                            </td>

                            {/* Status */}
                            <td className="px-3 py-2">
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  station.status === "STATION ON STREAM"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {station.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}

                      {/* Subtotal Row per Customer Type */}
                      <tr className="bg-blue-100 border-t border-b border-gray-900 font-semibold">
                        <td colSpan={3} className="border-r border-gray-900 px-3 py-2 text-right">
                          Sub-Total ({customerType.type})
                        </td>
                        <td className="border-r border-gray-900 px-3 py-2 text-right font-mono">
                          {customerType.stations.reduce((sum, s) => sum + s.allocation, 0).toFixed(3)}
                        </td>
                        <td className="border-r border-gray-900 px-3 py-2 text-right font-mono">
                          {customerType.stations.reduce((sum, s) => sum + s.offtake, 0).toFixed(3)}
                        </td>
                        <td className="border-r border-gray-900 px-3 py-2"></td>
                        <td className="border-r border-gray-900 px-3 py-2 text-right font-mono">
                          {customerType.stations.reduce((sum, s) => sum + (s.megawatts || 0), 0).toFixed(2)}
                        </td>
                        <td className="px-3 py-2"></td>
                      </tr>
                    </>
                  ))}
                </>
              ))}

              {/* Grand Total Row */}
              <tr className="bg-gray-800 text-white border-t-2 border-gray-900 font-bold">
                <td colSpan={3} className="border-r border-gray-900 px-3 py-3 text-right text-base">
                  GRAND TOTAL
                </td>
                <td className="border-r border-gray-900 px-3 py-3 text-right font-mono text-base">
                  {totals.totalAllocation.toFixed(3)}
                </td>
                <td className="border-r border-gray-900 px-3 py-3 text-right font-mono text-base">
                  {totals.totalOfftake.toFixed(3)}
                </td>
                <td className="border-r border-gray-900 px-3 py-3"></td>
                <td className="border-r border-gray-900 px-3 py-3 text-right font-mono text-base">
                  {totals.totalMegawatts.toFixed(2)}
                </td>
                <td className="px-3 py-3"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer - Print info */}
        <div className="mt-6 text-xs text-gray-500 flex justify-between">
          <div>
            Generated: {new Date().toLocaleString()}
          </div>
          <div>
            NNPC Gas Infrastructure Company Limited
          </div>
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
