"use client";

import React, { useState, useEffect } from "react";
import { Download, Printer, Save, Calendar, RefreshCw } from "lucide-react";
import Image from "next/image";
import * as XLSX from "xlsx";

// Data types
interface OfftakerStation {
  id: string;
  name: string;
  designCapacity: number;
  nomination: number;
  allocation: number;
  offtake: number;
  pressureInlet: number;
  pressureOutlet: number;
  status: "on-stream" | "standby" | "shutdown";
  remarks: string;
  megawatts?: number;
}

interface CustomerCategory {
  id: string;
  name: string;
  stations: OfftakerStation[];
}

interface RegionalData {
  region: "Lagos" | "North" | "East" | "Delta";
  categories: CustomerCategory[];
}

export default function DailySituationReport() {
  const [reportDate, setReportDate] = useState(new Date().toISOString().split("T")[0]);
  const [regionalData, setRegionalData] = useState<RegionalData[]>([]);
  const [isEditing, setIsEditing] = useState(true);

  // Load data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`daily-situation-${reportDate}`);
    if (saved) {
      setRegionalData(JSON.parse(saved));
    } else {
      // Initialize with sample data matching Image 5
      setRegionalData(getInitialData());
    }
  }, [reportDate]);

  // Save data to localStorage
  const saveData = () => {
    localStorage.setItem(`daily-situation-${reportDate}`, JSON.stringify(regionalData));
    alert("Report saved successfully!");
  };

  // Update offtaker field
  const updateStation = (
    region: string,
    categoryId: string,
    stationId: string,
    field: keyof OfftakerStation,
    value: any
  ) => {
    setRegionalData((prev) =>
      prev.map((r) => {
        if (r.region !== region) return r;
        return {
          ...r,
          categories: r.categories.map((cat) => {
            if (cat.id !== categoryId) return cat;
            return {
              ...cat,
              stations: cat.stations.map((st) => {
                if (st.id !== stationId) return st;
                return { ...st, [field]: value };
              }),
            };
          }),
        };
      })
    );
  };

  // Calculate totals
  const calculateRegionalTotal = (region: RegionalData) => {
    let totalDesignCapacity = 0;
    let totalNomination = 0;
    let totalAllocation = 0;
    let totalOfftake = 0;

    region.categories.forEach((cat) => {
      cat.stations.forEach((st) => {
        totalDesignCapacity += st.designCapacity;
        totalNomination += st.nomination;
        totalAllocation += st.allocation;
        totalOfftake += st.offtake;
      });
    });

    return { totalDesignCapacity, totalNomination, totalAllocation, totalOfftake };
  };

  const calculateGrandTotal = () => {
    let grandTotalDesignCapacity = 0;
    let grandTotalNomination = 0;
    let grandTotalAllocation = 0;
    let grandTotalOfftake = 0;

    regionalData.forEach((region) => {
      const totals = calculateRegionalTotal(region);
      grandTotalDesignCapacity += totals.totalDesignCapacity;
      grandTotalNomination += totals.totalNomination;
      grandTotalAllocation += totals.totalAllocation;
      grandTotalOfftake += totals.totalOfftake;
    });

    return {
      grandTotalDesignCapacity,
      grandTotalNomination,
      grandTotalAllocation,
      grandTotalOfftake,
    };
  };

  // Status badge
  const getStatusBadge = (status: string) => {
    const badges = {
      "on-stream": "bg-success/10 text-success border-success/30",
      standby: "bg-yellow-500/10 text-yellow-700 border-yellow-500/30",
      shutdown: "bg-alert/10 text-alert border-alert/30",
    };
    const labels = {
      "on-stream": "STATION ON STREAM",
      standby: "STATION ON STANDBY",
      shutdown: "STATION ON SHUTDOWN",
    };
    return (
      <span
        className={`inline-block px-2 py-1 text-xs font-medium rounded border ${
          badges[status as keyof typeof badges]
        }`}
      >
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  // Print to PDF
  const handlePrint = () => {
    window.print();
  };

  // Export to Excel
  const exportToExcel = () => {
    // Create workbook
    const wb = XLSX.utils.book_new();

    // Prepare data array
    const data: any[][] = [];

    // Header rows
    data.push(["NNPC GAS INFRASTRUCTURE COMPANY LIMITED"]);
    data.push(["(A Subsidiary of Nigerian National Petroleum Company Limited)"]);
    data.push([]);
    data.push(["DAILY GAS SITUATION REPORT"]);
    data.push([`Date: ${new Date(reportDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`]);
    data.push([]);

    // Column headers
    data.push([
      "REGION",
      "CUSTOMER TYPE",
      "STATIONS",
      "DESIGN CAPACITY",
      "NOMINATIONS (MMscfd)",
      "ALLOCATION",
      "OFFTAKE (MMscfd)",
      "PRESSURE (IN/OUT)",
      "STATUS",
      "REMARKS",
      "MEGAWATTS (MW)",
    ]);

    // Add data for each region
    regionalData.forEach((region) => {
      region.categories.forEach((category, catIdx) => {
        category.stations.forEach((station, stIdx) => {
          data.push([
            catIdx === 0 && stIdx === 0 ? `${region.region.toUpperCase()} REGION` : "",
            stIdx === 0 ? category.name : "",
            station.name,
            station.designCapacity,
            station.nomination,
            station.allocation,
            station.offtake,
            `${station.pressureInlet}/${station.pressureOutlet}`,
            station.status === "on-stream" ? "ON STREAM" : station.status === "standby" ? "STANDBY" : "SHUTDOWN",
            station.remarks,
            station.megawatts || "",
          ]);
        });

        // Category subtotal
        const categoryOfftake = category.stations.reduce((sum, st) => sum + st.offtake, 0);
        const categoryMegawatts = category.stations.reduce((sum, st) => sum + (st.megawatts || 0), 0);
        data.push([
          "",
          "",
          "Sub-Total",
          "",
          "",
          "",
          categoryOfftake,
          "",
          "",
          "",
          categoryMegawatts,
        ]);
      });

      // Regional total
      const regionTotal = calculateRegionalTotal(region);
      data.push([
        "",
        "",
        `${region.region.toUpperCase()} TOTAL`,
        regionTotal.totalDesignCapacity,
        regionTotal.totalNomination,
        regionTotal.totalAllocation,
        regionTotal.totalOfftake,
        "",
        "",
        "",
        "",
      ]);
      data.push([]); // Empty row between regions
    });

    // Grand totals
    const grandTotal = calculateGrandTotal();
    data.push([]);
    data.push(["GRAND TOTALS"]);
    data.push([
      "Total Design Capacity:",
      grandTotal.grandTotalDesignCapacity.toFixed(2),
      "MMscfd",
    ]);
    data.push([
      "Total Nominations:",
      grandTotal.grandTotalNomination.toFixed(2),
      "MMscfd",
    ]);
    data.push([
      "Total Allocation:",
      grandTotal.grandTotalAllocation.toFixed(2),
      "MMscfd",
    ]);
    data.push([
      "Total Offtake:",
      grandTotal.grandTotalOfftake.toFixed(2),
      "MMscfd",
    ]);
    data.push([
      "Utilization Rate:",
      `${((grandTotal.grandTotalOfftake / grandTotal.grandTotalDesignCapacity) * 100).toFixed(1)}%`,
      "of Capacity",
    ]);

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Set column widths
    ws["!cols"] = [
      { wch: 15 }, // Region
      { wch: 25 }, // Customer Type
      { wch: 35 }, // Stations
      { wch: 18 }, // Design Capacity
      { wch: 20 }, // Nominations
      { wch: 15 }, // Allocation
      { wch: 18 }, // Offtake
      { wch: 18 }, // Pressure
      { wch: 15 }, // Status
      { wch: 40 }, // Remarks
      { wch: 18 }, // Megawatts
    ];

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Daily Situation Report");

    // Generate filename with date
    const filename = `NGIC_Daily_Situation_Report_${reportDate}.xlsx`;

    // Download file
    XLSX.writeFile(wb, filename);
  };

  const grandTotal = calculateGrandTotal();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }

          /* Hide interactive elements when printing */
          .no-print {
            display: none !important;
          }

          /* Page settings */
          @page {
            size: A4 landscape;
            margin: 1cm;
          }

          /* Header styling for print */
          .print-header {
            page-break-after: avoid;
            margin-bottom: 20px;
          }

          /* Regional sections */
          .regional-section {
            page-break-inside: avoid;
            margin-bottom: 30px;
          }

          /* Tables */
          table {
            page-break-inside: auto;
            border-collapse: collapse;
            width: 100%;
          }

          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }

          thead {
            display: table-header-group;
          }

          tfoot {
            display: table-footer-group;
          }

          /* Ensure colors print */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Grand total section */
          .grand-total-section {
            page-break-before: avoid;
            margin-top: 20px;
          }
        }
      `}</style>

      {/* Header */}
      <div className="bg-white border-b border-line px-8 py-6 print-header">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Image src="/nnpc-logo.png" alt="NNPC Logo" width={60} height={60} />
            <div>
              <h1 className="text-2xl font-bold text-[#1B5E3E]">
                NNPC GAS INFRASTRUCTURE COMPANY LIMITED
              </h1>
              <p className="text-sm text-ink/60">
                (A Subsidiary of Nigerian National Petroleum Company Limited)
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-ink">Daily Gas Situation Report</h2>
            <p className="text-sm text-ink/60 mt-1">
              Report Date: {new Date(reportDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
            <div className="flex items-center gap-4 mt-2 no-print">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-ink/60" />
                <input
                  type="date"
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
                  className="px-3 py-1 border border-line rounded text-sm"
                />
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  isEditing
                    ? "bg-primary/10 text-primary border border-primary"
                    : "bg-gray-100 text-ink border border-line"
                }`}
              >
                {isEditing ? "📝 Editing Mode" : "👁️ View Mode"}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 no-print">
            <button
              onClick={saveData}
              className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded hover:bg-success/90"
            >
              <Save className="w-4 h-4" />
              Save Report
            </button>
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              <Download className="w-4 h-4" />
              Export Excel
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 border border-line rounded hover:bg-gray-50"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 max-w-[1800px] mx-auto">
        {regionalData.map((region) => {
          const regionTotal = calculateRegionalTotal(region);
          return (
            <div key={region.region} className="mb-8 regional-section">
              {/* Regional Header */}
              <div className="bg-[#1B5E3E] text-white px-6 py-3 rounded-t-lg">
                <h3 className="text-lg font-bold">
                  REGIONAL GAS DISTRIBUTION {region.region.toUpperCase()}
                </h3>
              </div>

              {/* Regional Table */}
              <div className="bg-white border border-line rounded-b-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 border-b border-line">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-ink">
                          CUSTOMER TYPE
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-ink">STATIONS</th>
                        <th className="px-4 py-3 text-right font-semibold text-ink">
                          DESIGN CAPACITY
                        </th>
                        <th className="px-4 py-3 text-right font-semibold text-ink">
                          NOMINATIONS (MMscfd)
                        </th>
                        <th className="px-4 py-3 text-right font-semibold text-ink">
                          ALLOCATION
                        </th>
                        <th className="px-4 py-3 text-right font-semibold text-ink">
                          OFFTAKE (MMscfd)
                        </th>
                        <th className="px-4 py-3 text-center font-semibold text-ink">
                          PRESSURE
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-ink">REMARKS</th>
                        <th className="px-4 py-3 text-right font-semibold text-ink">
                          MEGAWATTS (MW)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {region.categories.map((category) => (
                        <React.Fragment key={category.id}>
                          {category.stations.map((station, idx) => (
                            <tr
                              key={station.id}
                              className="border-b border-line hover:bg-gray-50"
                            >
                              {idx === 0 && (
                                <td
                                  rowSpan={category.stations.length + 1}
                                  className="px-4 py-3 font-medium text-ink border-r border-line bg-gray-50"
                                >
                                  {category.name}
                                </td>
                              )}
                              <td className="px-4 py-3 text-ink">{station.name}</td>
                              <td className="px-4 py-3 text-right tabular-nums text-ink">
                                {station.designCapacity.toFixed(3)}
                              </td>
                              <td className="px-4 py-3 text-right tabular-nums text-ink">
                                {station.nomination.toFixed(3)}
                              </td>
                              <td className="px-4 py-3 text-right tabular-nums text-ink">
                                {station.allocation.toFixed(3)}
                              </td>
                              <td className="px-4 py-3 text-right tabular-nums">
                                {isEditing ? (
                                  <input
                                    type="number"
                                    step="0.001"
                                    value={station.offtake}
                                    onChange={(e) =>
                                      updateStation(
                                        region.region,
                                        category.id,
                                        station.id,
                                        "offtake",
                                        parseFloat(e.target.value) || 0
                                      )
                                    }
                                    className="w-24 px-2 py-1 text-right border border-line rounded tabular-nums"
                                  />
                                ) : (
                                  <span className="text-ink">{station.offtake.toFixed(3)}</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-center">
                                {isEditing ? (
                                  <div className="flex gap-1 justify-center">
                                    <input
                                      type="number"
                                      placeholder="In"
                                      value={station.pressureInlet || ""}
                                      onChange={(e) =>
                                        updateStation(
                                          region.region,
                                          category.id,
                                          station.id,
                                          "pressureInlet",
                                          parseFloat(e.target.value) || 0
                                        )
                                      }
                                      className="w-16 px-2 py-1 text-center border border-line rounded text-xs"
                                    />
                                    <span className="text-ink/40">/</span>
                                    <input
                                      type="number"
                                      placeholder="Out"
                                      value={station.pressureOutlet || ""}
                                      onChange={(e) =>
                                        updateStation(
                                          region.region,
                                          category.id,
                                          station.id,
                                          "pressureOutlet",
                                          parseFloat(e.target.value) || 0
                                        )
                                      }
                                      className="w-16 px-2 py-1 text-center border border-line rounded text-xs"
                                    />
                                  </div>
                                ) : (
                                  <span className="text-ink tabular-nums">
                                    {station.pressureInlet}/{station.pressureOutlet}
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                {isEditing ? (
                                  <div className="space-y-1">
                                    <select
                                      value={station.status}
                                      onChange={(e) =>
                                        updateStation(
                                          region.region,
                                          category.id,
                                          station.id,
                                          "status",
                                          e.target.value
                                        )
                                      }
                                      className="w-full px-2 py-1 text-xs border border-line rounded"
                                    >
                                      <option value="on-stream">On Stream</option>
                                      <option value="standby">Standby</option>
                                      <option value="shutdown">Shutdown</option>
                                    </select>
                                    <input
                                      type="text"
                                      placeholder="Additional remarks..."
                                      value={station.remarks}
                                      onChange={(e) =>
                                        updateStation(
                                          region.region,
                                          category.id,
                                          station.id,
                                          "remarks",
                                          e.target.value
                                        )
                                      }
                                      className="w-full px-2 py-1 text-xs border border-line rounded"
                                    />
                                  </div>
                                ) : (
                                  <div className="space-y-1">
                                    {getStatusBadge(station.status)}
                                    {station.remarks && (
                                      <p className="text-xs text-ink/60">{station.remarks}</p>
                                    )}
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-3 text-right tabular-nums text-ink">
                                {station.megawatts ? station.megawatts.toFixed(3) : "—"}
                              </td>
                            </tr>
                          ))}
                          {/* Category Subtotal */}
                          <tr className="bg-gray-100 font-semibold border-b border-line">
                            <td className="px-4 py-2 text-right" colSpan={5}>
                              Sub-Total
                            </td>
                            <td className="px-4 py-2 text-right tabular-nums text-ink">
                              {category.stations
                                .reduce((sum, st) => sum + st.offtake, 0)
                                .toFixed(3)}
                            </td>
                            <td className="px-4 py-2"></td>
                            <td className="px-4 py-2"></td>
                            <td className="px-4 py-2 text-right tabular-nums text-ink">
                              {category.stations
                                .reduce((sum, st) => sum + (st.megawatts || 0), 0)
                                .toFixed(3)}
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                    {/* Regional Total */}
                    <tfoot>
                      <tr className="bg-[#1B5E3E]/10 font-bold text-ink">
                        <td className="px-4 py-3" colSpan={2}>
                          Total
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {regionTotal.totalDesignCapacity.toFixed(3)}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {regionTotal.totalNomination.toFixed(3)}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {regionTotal.totalAllocation.toFixed(3)}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {regionTotal.totalOfftake.toFixed(3)}
                        </td>
                        <td colSpan={3}></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          );
        })}

        {/* Grand Total */}
        <div className="bg-white border-2 border-[#1B5E3E] rounded-lg p-6 grand-total-section">
          <div className="grid grid-cols-5 gap-4">
            <div className="text-center">
              <p className="text-sm text-ink/60 mb-1">Total Design Capacity</p>
              <p className="text-2xl font-bold text-[#1B5E3E] tabular-nums">
                {grandTotal.grandTotalDesignCapacity.toFixed(2)}
              </p>
              <p className="text-xs text-ink/40">MMscfd</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-ink/60 mb-1">Total Nominations</p>
              <p className="text-2xl font-bold text-[#1B5E3E] tabular-nums">
                {grandTotal.grandTotalNomination.toFixed(2)}
              </p>
              <p className="text-xs text-ink/40">MMscfd</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-ink/60 mb-1">Total Allocation</p>
              <p className="text-2xl font-bold text-[#1B5E3E] tabular-nums">
                {grandTotal.grandTotalAllocation.toFixed(2)}
              </p>
              <p className="text-xs text-ink/40">MMscfd</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-ink/60 mb-1">Total Offtake</p>
              <p className="text-2xl font-bold text-primary tabular-nums">
                {grandTotal.grandTotalOfftake.toFixed(2)}
              </p>
              <p className="text-xs text-ink/40">MMscfd</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-ink/60 mb-1">Utilization</p>
              <p className="text-2xl font-bold text-accent tabular-nums">
                {((grandTotal.grandTotalOfftake / grandTotal.grandTotalDesignCapacity) * 100).toFixed(
                  1
                )}
                %
              </p>
              <p className="text-xs text-ink/40">of Capacity</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Initial sample data matching Image 5
function getInitialData(): RegionalData[] {
  return [
    {
      region: "Lagos",
      categories: [
        {
          id: "lagos-power",
          name: "NPDC Power Customers",
          stations: [
            {
              id: "transcorp",
              name: "Transcorp Ughelli",
              designCapacity: 47.6,
              nomination: 47.6,
              allocation: 47.6,
              offtake: 51.548,
              pressureInlet: 24,
              pressureOutlet: 0,
              status: "on-stream",
              remarks: "",
              megawatts: 193.54,
            },
          ],
        },
        {
          id: "lagos-nipp",
          name: "NDPHC",
          stations: [
            {
              id: "olorunsogo",
              name: "NIPP Olorunsogo",
              designCapacity: 27.0,
              nomination: 27.0,
              allocation: 27.0,
              offtake: 26.858,
              pressureInlet: 33,
              pressureOutlet: 31,
              status: "on-stream",
              remarks: "",
              megawatts: 103.73,
            },
            {
              id: "ihovbor",
              name: "NIPP Ihovbor",
              designCapacity: 0.0,
              nomination: 0.0,
              allocation: 0.0,
              offtake: 0.0,
              pressureInlet: 52,
              pressureOutlet: 34,
              status: "standby",
              remarks: "",
              megawatts: 0.0,
            },
            {
              id: "omotosho",
              name: "NIPP Omotosho",
              designCapacity: 13.0,
              nomination: 13.0,
              allocation: 13.0,
              offtake: 5.849,
              pressureInlet: 44,
              pressureOutlet: 40,
              status: "on-stream",
              remarks: "",
              megawatts: 83.35,
            },
            {
              id: "geregu",
              name: "NIPP Geregu",
              designCapacity: 30.0,
              nomination: 30.0,
              allocation: 30.0,
              offtake: 18.746,
              pressureInlet: 59,
              pressureOutlet: 34,
              status: "on-stream",
              remarks: "",
              megawatts: 62.083,
            },
            {
              id: "sapele",
              name: "NIPP Sapele",
              designCapacity: 0.0,
              nomination: 0.0,
              allocation: 0.0,
              offtake: 0.0,
              pressureInlet: 57,
              pressureOutlet: 0,
              status: "standby",
              remarks: "",
              megawatts: 0.0,
            },
            {
              id: "azura",
              name: "Azura Power West Africa",
              designCapacity: 97.24,
              nomination: 97.24,
              allocation: 97.24,
              offtake: 95.004,
              pressureInlet: 53,
              pressureOutlet: 23,
              status: "on-stream",
              remarks: "",
              megawatts: 400.24,
            },
          ],
        },
        {
          id: "lagos-commercial",
          name: "Commercial Customer",
          stations: [
            {
              id: "gaslink",
              name: "GAS LINK",
              designCapacity: 53.8,
              nomination: 53.8,
              allocation: 53.8,
              offtake: 53.8,
              pressureInlet: 26,
              pressureOutlet: 18,
              status: "on-stream",
              remarks: "",
            },
            {
              id: "falcon",
              name: "Falcon Petroleum Limited",
              designCapacity: 10.112,
              nomination: 10.112,
              allocation: 10.112,
              offtake: 10.112,
              pressureInlet: 30,
              pressureOutlet: 10,
              status: "on-stream",
              remarks: "",
            },
            {
              id: "wapco-sagamu",
              name: "WAPCO Sagamu",
              designCapacity: 0.021,
              nomination: 0.021,
              allocation: 0.021,
              offtake: 0.021,
              pressureInlet: 32,
              pressureOutlet: 8,
              status: "on-stream",
              remarks: "",
            },
            {
              id: "wapco-ewekoro",
              name: "WAPCO Ewekoro",
              designCapacity: 28.955,
              nomination: 28.955,
              allocation: 28.955,
              offtake: 28.955,
              pressureInlet: 28,
              pressureOutlet: 15,
              status: "on-stream",
              remarks: "",
            },
            {
              id: "cf-feed",
              name: "CF FEED",
              designCapacity: 0.009,
              nomination: 0.009,
              allocation: 0.009,
              offtake: 0.009,
              pressureInlet: 19,
              pressureOutlet: 4,
              status: "on-stream",
              remarks: "",
            },
            {
              id: "sunlight",
              name: "SUNLIGHT RESOURCES",
              designCapacity: 0.0,
              nomination: 0.0,
              allocation: 0.0,
              offtake: 0.0,
              pressureInlet: 18,
              pressureOutlet: 4,
              status: "standby",
              remarks: "",
            },
          ],
        },
        {
          id: "lagos-industrial",
          name: "Industrial",
          stations: [
            {
              id: "beta-glass",
              name: "BETA Glass",
              designCapacity: 1.89,
              nomination: 1.89,
              allocation: 1.89,
              offtake: 1.89,
              pressureInlet: 24,
              pressureOutlet: 0,
              status: "on-stream",
              remarks: "",
            },
          ],
        },
        {
          id: "lagos-transmission",
          name: "Other Transmission",
          stations: [
            {
              id: "sng",
              name: "SNG",
              designCapacity: 51.0,
              nomination: 51.0,
              allocation: 51.0,
              offtake: 46.412,
              pressureInlet: 28,
              pressureOutlet: 0,
              status: "on-stream",
              remarks: "",
            },
            {
              id: "spdc-edjeba",
              name: "SPDC Edjeba",
              designCapacity: 1.0,
              nomination: 1.0,
              allocation: 1.0,
              offtake: 0.962,
              pressureInlet: 21,
              pressureOutlet: 15,
              status: "on-stream",
              remarks: "",
            },
            {
              id: "dfl",
              name: "DFL (Dangote fertilizer limited)",
              designCapacity: 186.0,
              nomination: 186.0,
              allocation: 186.0,
              offtake: 188.962,
              pressureInlet: 31,
              pressureOutlet: 29,
              status: "on-stream",
              remarks: "",
            },
            {
              id: "spdc-ogunu",
              name: "SPDC Ogunu",
              designCapacity: 0.3,
              nomination: 0.3,
              allocation: 0.3,
              offtake: 0.405,
              pressureInlet: 21,
              pressureOutlet: 21,
              status: "on-stream",
              remarks: "",
              megawatts: 0.0,
            },
          ],
        },
        {
          id: "lagos-export",
          name: "Export",
          stations: [
            {
              id: "wagp",
              name: "WAGP",
              designCapacity: 150.0,
              nomination: 150.0,
              allocation: 150.0,
              offtake: 130.189,
              pressureInlet: 35,
              pressureOutlet: 0,
              status: "on-stream",
              remarks: "",
              megawatts: 0.0,
            },
          ],
        },
      ],
    },
    {
      region: "East",
      categories: [
        {
          id: "east-power",
          name: "7 Energy Power Customers",
          stations: [
            {
              id: "calabar",
              name: "NDPHC Calabar",
              designCapacity: 57.277,
              nomination: 57.277,
              allocation: 57.277,
              offtake: 57.277,
              pressureInlet: 35,
              pressureOutlet: 0,
              status: "on-stream",
              remarks: "",
            },
          ],
        },
        {
          id: "east-direct",
          name: "Direct Power Customer",
          stations: [
            {
              id: "trans-afam",
              name: "Trans-Afam",
              designCapacity: 12.935,
              nomination: 12.935,
              allocation: 12.935,
              offtake: 12.935,
              pressureInlet: 23,
              pressureOutlet: 0,
              status: "on-stream",
              remarks: "",
            },
            {
              id: "alaoji",
              name: "ALAOJI",
              designCapacity: 0.0,
              nomination: 0.0,
              allocation: 0.0,
              offtake: 0.0,
              pressureInlet: 35,
              pressureOutlet: 0,
              status: "standby",
              remarks: "",
            },
          ],
        },
        {
          id: "east-fipl",
          name: "AOE",
          stations: [
            {
              id: "eleme",
              name: "ELEME (FIPL)",
              designCapacity: 0.0,
              nomination: 0.0,
              allocation: 0.0,
              offtake: 0.0,
              pressureInlet: 35,
              pressureOutlet: 0,
              status: "standby",
              remarks: "",
            },
            {
              id: "afam",
              name: "AFAM (FIPL)",
              designCapacity: 0.0,
              nomination: 0.0,
              allocation: 0.0,
              offtake: 0.0,
              pressureInlet: 0,
              pressureOutlet: 0,
              status: "standby",
              remarks: "",
            },
            {
              id: "amadi",
              name: "AMADI (FIPL)",
              designCapacity: 0.0,
              nomination: 0.0,
              allocation: 0.0,
              offtake: 0.0,
              pressureInlet: 30,
              pressureOutlet: 0,
              status: "standby",
              remarks: "",
            },
          ],
        },
        {
          id: "east-commercial",
          name: "Commercial Customer",
          stations: [
            {
              id: "gel",
              name: "Gel Utility Limited",
              designCapacity: 1.606,
              nomination: 1.606,
              allocation: 1.606,
              offtake: 1.606,
              pressureInlet: 38,
              pressureOutlet: 0,
              status: "on-stream",
              remarks: "",
            },
          ],
        },
        {
          id: "east-transmission",
          name: "Other Transmission",
          stations: [
            {
              id: "notore",
              name: "Notore Chemical Industries",
              designCapacity: 1.51,
              nomination: 1.51,
              allocation: 1.51,
              offtake: 1.51,
              pressureInlet: 35,
              pressureOutlet: 0,
              status: "on-stream",
              remarks: "",
            },
            {
              id: "denna",
              name: "Denna Rossi",
              designCapacity: 0.0,
              nomination: 0.0,
              allocation: 0.0,
              offtake: 0.0,
              pressureInlet: 0,
              pressureOutlet: 0,
              status: "shutdown",
              remarks: "",
            },
            {
              id: "aba-sng",
              name: "Aba-SNG",
              designCapacity: 2.41,
              nomination: 2.41,
              allocation: 2.41,
              offtake: 2.41,
              pressureInlet: 15,
              pressureOutlet: 0,
              status: "standby",
              remarks: "",
            },
            {
              id: "gpal",
              name: "GPAL",
              designCapacity: 0.0,
              nomination: 0.0,
              allocation: 0.0,
              offtake: 0.0,
              pressureInlet: 35,
              pressureOutlet: 0,
              status: "standby",
              remarks: "",
            },
          ],
        },
      ],
    },
    {
      region: "North",
      categories: [
        {
          id: "north-cement",
          name: "Cement Manufacturers",
          stations: [
            {
              id: "obajana",
              name: "Dangote Cement Obajana",
              designCapacity: 82.0,
              nomination: 82.0,
              allocation: 82.0,
              offtake: 78.456,
              pressureInlet: 42,
              pressureOutlet: 38,
              status: "on-stream",
              remarks: "",
            },
            {
              id: "bua-cement",
              name: "BUA Cement Sokoto",
              designCapacity: 32.5,
              nomination: 32.5,
              allocation: 32.5,
              offtake: 31.234,
              pressureInlet: 38,
              pressureOutlet: 35,
              status: "on-stream",
              remarks: "",
            },
            {
              id: "borkir",
              name: "Borkir Cement",
              designCapacity: 5.8,
              nomination: 5.8,
              allocation: 5.8,
              offtake: 5.8,
              pressureInlet: 35,
              pressureOutlet: 30,
              status: "on-stream",
              remarks: "",
            },
          ],
        },
        {
          id: "north-power",
          name: "Power Customers",
          stations: [
            {
              id: "paras-energy",
              name: "Paras Energy",
              designCapacity: 11.2,
              nomination: 11.2,
              allocation: 11.2,
              offtake: 10.845,
              pressureInlet: 40,
              pressureOutlet: 0,
              status: "on-stream",
              remarks: "",
              megawatts: 45.2,
            },
            {
              id: "geometric",
              name: "Geometric Power Aba",
              designCapacity: 8.5,
              nomination: 8.5,
              allocation: 8.5,
              offtake: 0.0,
              pressureInlet: 0,
              pressureOutlet: 0,
              status: "shutdown",
              remarks: "Awaiting maintenance",
            },
          ],
        },
        {
          id: "north-industrial",
          name: "Industrial Customers",
          stations: [
            {
              id: "peugeot",
              name: "Peugeot Automobile Nigeria",
              designCapacity: 1.2,
              nomination: 1.2,
              allocation: 1.2,
              offtake: 1.15,
              pressureInlet: 28,
              pressureOutlet: 0,
              status: "on-stream",
              remarks: "",
            },
            {
              id: "nigerian-breweries",
              name: "Nigerian Breweries Kaduna",
              designCapacity: 0.85,
              nomination: 0.85,
              allocation: 0.85,
              offtake: 0.82,
              pressureInlet: 30,
              pressureOutlet: 0,
              status: "on-stream",
              remarks: "",
            },
          ],
        },
        {
          id: "north-commercial",
          name: "Commercial Customer",
          stations: [
            {
              id: "wacl",
              name: "West African Ceramics Limited",
              designCapacity: 3.4,
              nomination: 3.4,
              allocation: 3.4,
              offtake: 3.35,
              pressureInlet: 32,
              pressureOutlet: 28,
              status: "on-stream",
              remarks: "",
            },
          ],
        },
      ],
    },
    {
      region: "Delta",
      categories: [
        {
          id: "delta-power",
          name: "Power Customers",
          stations: [
            {
              id: "okpai",
              name: "Okpai Power Station",
              designCapacity: 68.5,
              nomination: 68.5,
              allocation: 68.5,
              offtake: 64.234,
              pressureInlet: 48,
              pressureOutlet: 0,
              status: "on-stream",
              remarks: "",
              megawatts: 245.8,
            },
            {
              id: "delta-iv",
              name: "Delta IV Independent Power",
              designCapacity: 24.0,
              nomination: 24.0,
              allocation: 24.0,
              offtake: 22.567,
              pressureInlet: 42,
              pressureOutlet: 0,
              status: "on-stream",
              remarks: "",
              megawatts: 95.4,
            },
            {
              id: "sapele-steamer",
              name: "Sapele Steamer",
              designCapacity: 15.6,
              nomination: 15.6,
              allocation: 15.6,
              offtake: 14.234,
              pressureInlet: 38,
              pressureOutlet: 0,
              status: "on-stream",
              remarks: "",
              megawatts: 58.2,
            },
          ],
        },
        {
          id: "delta-industrial",
          name: "Industrial Customers",
          stations: [
            {
              id: "warri-refinery",
              name: "Warri Refinery",
              designCapacity: 12.8,
              nomination: 12.8,
              allocation: 12.8,
              offtake: 0.0,
              pressureInlet: 0,
              pressureOutlet: 0,
              status: "shutdown",
              remarks: "Refinery maintenance ongoing",
            },
            {
              id: "eleme-petrochemical",
              name: "Eleme Petrochemical",
              designCapacity: 8.4,
              nomination: 8.4,
              allocation: 8.4,
              offtake: 7.892,
              pressureInlet: 35,
              pressureOutlet: 0,
              status: "on-stream",
              remarks: "",
            },
            {
              id: "indorama",
              name: "Indorama Eleme Petrochemicals",
              designCapacity: 42.5,
              nomination: 42.5,
              allocation: 42.5,
              offtake: 41.234,
              pressureInlet: 40,
              pressureOutlet: 36,
              status: "on-stream",
              remarks: "",
            },
          ],
        },
        {
          id: "delta-commercial",
          name: "Commercial Customer",
          stations: [
            {
              id: "seaplast",
              name: "Seaplast Industries",
              designCapacity: 2.1,
              nomination: 2.1,
              allocation: 2.1,
              offtake: 2.05,
              pressureInlet: 28,
              pressureOutlet: 0,
              status: "on-stream",
              remarks: "",
            },
            {
              id: "presco",
              name: "Presco Industries",
              designCapacity: 3.8,
              nomination: 3.8,
              allocation: 3.8,
              offtake: 3.65,
              pressureInlet: 30,
              pressureOutlet: 0,
              status: "on-stream",
              remarks: "",
            },
          ],
        },
        {
          id: "delta-transmission",
          name: "Other Transmission",
          stations: [
            {
              id: "delta-sng",
              name: "Delta-SNG",
              designCapacity: 18.5,
              nomination: 18.5,
              allocation: 18.5,
              offtake: 17.834,
              pressureInlet: 32,
              pressureOutlet: 28,
              status: "on-stream",
              remarks: "",
            },
            {
              id: "rivers-gas",
              name: "Rivers Gas Company",
              designCapacity: 6.2,
              nomination: 6.2,
              allocation: 6.2,
              offtake: 5.987,
              pressureInlet: 35,
              pressureOutlet: 30,
              status: "on-stream",
              remarks: "",
            },
          ],
        },
      ],
    },
  ];
}
