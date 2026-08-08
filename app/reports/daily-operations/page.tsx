"use client";

import { useState, useMemo } from "react";
import { Calendar, Download, Printer, TrendingUp, TrendingDown } from "lucide-react";
import { stationsMaster, stationDailyData, getStationData, getStationsByRegion } from "@/lib/nnpc-data";

// Tabs component
function Tabs({ value, onValueChange, children }: any) {
  return <div>{children}</div>;
}

function TabsList({ children }: any) {
  return <div className="flex gap-2 border-b border-line mb-6">{children}</div>;
}

function TabsTrigger({ value, active, onClick, children }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 font-medium transition-colors ${
        active
          ? "text-[#1B5E3E] border-b-2 border-[#1B5E3E]"
          : "text-ink/60 hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function TabsContent({ value, activeValue, children }: any) {
  if (value !== activeValue) return null;
  return <div>{children}</div>;
}

export default function DailyOperationsPage() {
  const [reportDate, setReportDate] = useState("2026-07-20");
  const [activeTab, setActiveTab] = useState<"ngic" | "ngml">("ngic");

  // Format date for display
  const displayDate = new Date(reportDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Compute NGIC view data (grouped by customer type)
  const ngicData = useMemo(() => {
    // Group power stations by region
    const regions = ["Western", "Eastern", "Lagos", "Northern"];

    return regions.map(region => {
      const regionStations = stationsMaster.filter(
        s => s.region === region && s.customerType
      );

      // Group by customer type
      const customerTypes = Array.from(
        new Set(regionStations.map(s => s.customerType).filter(Boolean))
      );

      return {
        region,
        customerTypes: customerTypes.map(customerType => {
          const stations = regionStations
            .filter(s => s.customerType === customerType)
            .map(station => {
              const dailyData = getStationData(reportDate, station.id);
              return {
                name: station.name,
                allocation: dailyData?.allocation || station.contractualDemand || 0,
                offtake: dailyData?.offtake || 0,
                pressure: dailyData?.pressure ? `${dailyData.pressure}/0` : "0/0",
                megawatts: dailyData?.megawatts || 0,
                status: dailyData?.remarks || "NO DATA",
              };
            });

          return {
            type: customerType,
            stations,
          };
        }),
      };
    }).filter(r => r.customerTypes.length > 0); // Only regions with data
  }, [reportDate]);

  // Compute NGML view data (grouped by GDZ)
  const ngmlData = useMemo(() => {
    const gdzRegions = ["REGIONAL GAS DISTRIBUTION LAGOS", "REGIONAL GAS DISTRIBUTION DELTA", "REGIONAL GAS DISTRIBUTION EAST", "REGIONAL GAS DISTRIBUTION NORTH"];

    return gdzRegions.map(gdz => {
      const gdzStations = stationsMaster.filter(s => s.gdz === gdz);

      const stations = gdzStations.map(station => {
        const dailyData = getStationData(reportDate, station.id);
        return {
          name: station.name,
          franchise: station.franchise || "Direct",
          nominations: dailyData?.nominations || station.contractualDemand || 0,
          allocation: dailyData?.allocation || station.contractualDemand || 0,
          offtake: dailyData?.offtake || 0,
          pressureInlet: dailyData?.pressureInlet || 0,
          pressureOutlet: dailyData?.pressureOutlet || 0,
          status: dailyData?.remarks || "NO DATA",
        };
      });

      return {
        gdz,
        stations,
      };
    }).filter(g => g.stations.length > 0); // Only GDZs with stations
  }, [reportDate]);

  // Calculate totals for NGIC view
  const ngicTotals = useMemo(() => {
    let totalAllocation = 0;
    let totalOfftake = 0;

    ngicData.forEach(region => {
      region.customerTypes.forEach(ct => {
        ct.stations.forEach(station => {
          totalAllocation += station.allocation;
          totalOfftake += station.offtake;
        });
      });
    });

    return { totalAllocation, totalOfftake };
  }, [ngicData]);

  // Calculate totals for NGML view
  const ngmlTotals = useMemo(() => {
    let totalNominations = 0;
    let totalAllocation = 0;
    let totalOfftake = 0;

    ngmlData.forEach(gdz => {
      gdz.stations.forEach(station => {
        totalNominations += station.nominations;
        totalAllocation += station.allocation;
        totalOfftake += station.offtake;
      });
    });

    return { totalNominations, totalAllocation, totalOfftake };
  }, [ngmlData]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1B5E3E] to-[#2B5F75] text-white px-8 py-6 print:bg-white print:text-ink">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Daily Gas Operations Report</h1>
            <p className="text-white/90 mt-1 print:text-ink/70">{displayDate}</p>
          </div>
          <div className="flex items-center gap-3 print:hidden">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <input
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className="px-3 py-2 rounded bg-white/20 border border-white/30 text-white"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded border border-white/30">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded border border-white/30">
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-[1600px] mx-auto">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="ngic" active={activeTab === "ngic"} onClick={() => setActiveTab("ngic")}>
              NGIC View (By Customer Type)
            </TabsTrigger>
            <TabsTrigger value="ngml" active={activeTab === "ngml"} onClick={() => setActiveTab("ngml")}>
              NGML View (By GDZ)
            </TabsTrigger>
          </TabsList>

          {/* NGIC View */}
          <TabsContent value="ngic" activeValue={activeTab}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-ink mb-2">NGIC Daily Gas Offtake Report</h2>
              <p className="text-sm text-ink/60">Grouped by Region and Customer Type</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-[#1B5E3E]/10 to-[#1B5E3E]/5 border-2 border-[#1B5E3E] rounded-lg p-6">
                <p className="text-sm font-medium text-ink/60 mb-2">Total Allocation</p>
                <p className="text-4xl font-bold text-[#1B5E3E] tabular-nums">
                  {ngicTotals.totalAllocation.toFixed(2)}
                </p>
                <p className="text-xs text-ink/50 mt-1">MMscf/d</p>
              </div>
              <div className="bg-gradient-to-br from-[#2B5F75]/10 to-[#2B5F75]/5 border-2 border-[#2B5F75] rounded-lg p-6">
                <p className="text-sm font-medium text-ink/60 mb-2">Total Offtake</p>
                <p className="text-4xl font-bold text-[#2B5F75] tabular-nums">
                  {ngicTotals.totalOfftake.toFixed(2)}
                </p>
                <p className="text-xs text-ink/50 mt-1">MMscf/d</p>
              </div>
              <div className="bg-gradient-to-br from-purple-600/10 to-purple-600/5 border-2 border-purple-600 rounded-lg p-6">
                <p className="text-sm font-medium text-ink/60 mb-2">Delivery Efficiency</p>
                <p className="text-4xl font-bold text-purple-600 tabular-nums">
                  {ngicTotals.totalAllocation > 0
                    ? ((ngicTotals.totalOfftake / ngicTotals.totalAllocation) * 100).toFixed(1)
                    : "0.0"}%
                </p>
                <p className="text-xs text-ink/50 mt-1">Actual / Allocated</p>
              </div>
            </div>

            {/* NGIC Data Tables by Region */}
            {ngicData.map((region, regionIdx) => (
              <div key={regionIdx} className="mb-8">
                <h3 className="text-xl font-bold text-ink mb-4 px-4 py-2 bg-[#1B5E3E]/10 rounded-lg">
                  {region.region} Region
                </h3>

                {region.customerTypes.map((customerType, ctIdx) => (
                  <div key={ctIdx} className="mb-6">
                    <h4 className="text-lg font-semibold text-ink/80 mb-3 px-3 py-1 bg-blue-50 rounded">
                      {customerType.type}
                    </h4>

                    <div className="overflow-x-auto">
                      <table className="w-full border border-line">
                        <thead className="bg-[#1B5E3E]/5">
                          <tr className="border-b border-line">
                            <th className="px-4 py-3 text-left text-sm font-semibold text-ink">Station</th>
                            <th className="px-4 py-3 text-right text-sm font-semibold text-ink">Allocation (MMscf/d)</th>
                            <th className="px-4 py-3 text-right text-sm font-semibold text-ink">Offtake (MMscf/d)</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-ink">Pressure (PSI)</th>
                            {customerType.stations.some(s => s.megawatts > 0) && (
                              <th className="px-4 py-3 text-right text-sm font-semibold text-ink">MW</th>
                            )}
                            <th className="px-4 py-3 text-left text-sm font-semibold text-ink">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {customerType.stations.map((station, stIdx) => (
                            <tr key={stIdx} className="border-b border-line hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-ink font-medium">{station.name}</td>
                              <td className="px-4 py-3 text-sm text-ink text-right tabular-nums">
                                {station.allocation.toFixed(3)}
                              </td>
                              <td className="px-4 py-3 text-sm text-right tabular-nums">
                                <span className={station.offtake === 0 ? "text-alert font-semibold" : "text-[#1B5E3E] font-semibold"}>
                                  {station.offtake.toFixed(3)}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-ink text-center tabular-nums">
                                {station.pressure}
                              </td>
                              {customerType.stations.some(s => s.megawatts > 0) && (
                                <td className="px-4 py-3 text-sm text-ink text-right tabular-nums">
                                  {station.megawatts > 0 ? station.megawatts.toFixed(2) : "—"}
                                </td>
                              )}
                              <td className="px-4 py-3 text-xs">
                                <span className={`px-2 py-1 rounded ${
                                  station.status.includes("STREAM") ? "bg-success/10 text-success" :
                                  station.status.includes("STANDBY") ? "bg-amber-500/10 text-amber-700" :
                                  "bg-gray-100 text-ink/60"
                                }`}>
                                  {station.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </TabsContent>

          {/* NGML View */}
          <TabsContent value="ngml" activeValue={activeTab}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-ink mb-2">NGML Daily Operations Report</h2>
              <p className="text-sm text-ink/60">Grouped by Gas Distribution Zone (GDZ)</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-600/10 to-blue-600/5 border-2 border-blue-600 rounded-lg p-6">
                <p className="text-sm font-medium text-ink/60 mb-2">Total Nominations</p>
                <p className="text-4xl font-bold text-blue-600 tabular-nums">
                  {ngmlTotals.totalNominations.toFixed(2)}
                </p>
                <p className="text-xs text-ink/50 mt-1">MMscf/d</p>
              </div>
              <div className="bg-gradient-to-br from-[#1B5E3E]/10 to-[#1B5E3E]/5 border-2 border-[#1B5E3E] rounded-lg p-6">
                <p className="text-sm font-medium text-ink/60 mb-2">Total Allocation</p>
                <p className="text-4xl font-bold text-[#1B5E3E] tabular-nums">
                  {ngmlTotals.totalAllocation.toFixed(2)}
                </p>
                <p className="text-xs text-ink/50 mt-1">MMscf/d</p>
              </div>
              <div className="bg-gradient-to-br from-[#2B5F75]/10 to-[#2B5F75]/5 border-2 border-[#2B5F75] rounded-lg p-6">
                <p className="text-sm font-medium text-ink/60 mb-2">Total Offtake</p>
                <p className="text-4xl font-bold text-[#2B5F75] tabular-nums">
                  {ngmlTotals.totalOfftake.toFixed(2)}
                </p>
                <p className="text-xs text-ink/50 mt-1">MMscf/d</p>
              </div>
              <div className="bg-gradient-to-br from-purple-600/10 to-purple-600/5 border-2 border-purple-600 rounded-lg p-6">
                <p className="text-sm font-medium text-ink/60 mb-2">Delivery Efficiency</p>
                <p className="text-4xl font-bold text-purple-600 tabular-nums">
                  {ngmlTotals.totalAllocation > 0
                    ? ((ngmlTotals.totalOfftake / ngmlTotals.totalAllocation) * 100).toFixed(1)
                    : "0.0"}%
                </p>
                <p className="text-xs text-ink/50 mt-1">Actual / Allocated</p>
              </div>
            </div>

            {/* NGML Data Tables by GDZ */}
            {ngmlData.map((gdz, gdzIdx) => (
              <div key={gdzIdx} className="mb-8">
                <h3 className="text-xl font-bold text-ink mb-4 px-4 py-2 bg-[#2B5F75]/10 rounded-lg">
                  {gdz.gdz}
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full border border-line">
                    <thead className="bg-[#2B5F75]/5">
                      <tr className="border-b border-line">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-ink">Customer</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-ink">Franchise</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-ink">Nominations</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-ink">Allocation</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-ink">Offtake</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-ink">Pressure (In/Out)</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-ink">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gdz.stations.map((station, stIdx) => (
                        <tr key={stIdx} className="border-b border-line hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-ink font-medium">{station.name}</td>
                          <td className="px-4 py-3 text-sm text-ink/70">{station.franchise}</td>
                          <td className="px-4 py-3 text-sm text-ink text-right tabular-nums">
                            {station.nominations.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm text-ink text-right tabular-nums">
                            {station.allocation.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right tabular-nums">
                            <span className={station.offtake === 0 ? "text-alert font-semibold" : "text-[#1B5E3E] font-semibold"}>
                              {station.offtake.toFixed(2)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-ink text-center tabular-nums">
                            {station.pressureInlet}/{station.pressureOutlet}
                          </td>
                          <td className="px-4 py-3 text-xs">
                            <span className={`px-2 py-1 rounded ${
                              station.status.includes("stream") || station.status.includes("STREAM") ? "bg-success/10 text-success" :
                              station.status.includes("standby") || station.status.includes("STANDBY") ? "bg-amber-500/10 text-amber-700" :
                              "bg-gray-100 text-ink/60"
                            }`}>
                              {station.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 flex items-center justify-between text-xs text-ink/50 border-t border-line pt-4">
          <p>Generated: {new Date().toLocaleString()}</p>
          <div className="flex items-center gap-2">
            <img src="/nnpc-logo.png" alt="NNPC" className="h-6 opacity-50" onError={(e) => e.currentTarget.style.display = 'none'} />
            <span>NNPC Limited - Gas Infrastructure Company (NGIC) / Gas Marketing Limited (NGML)</span>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page { size: landscape; margin: 0.5in; }
          .print\\:hidden { display: none !important; }
          .print\\:bg-white { background: white !important; }
          .print\\:text-ink { color: #1a1a1a !important; }
        }
      `}</style>
    </div>
  );
}
