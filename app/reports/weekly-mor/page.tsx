"use client";

import { useState, useMemo } from "react";
import { Calendar, Download, Printer, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import {
  producers,
  producerContributions,
  nationalProduction,
  weeklyVarianceData,
  elpsPressureData,
} from "@/lib/nnpc-operational-data";
import {
  producersMaster,
  producerWeeklyData,
  getProducerWeeklyData,
} from "@/lib/nnpc-data";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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

export default function WeeklyMORPage() {
  const [weekEnding, setWeekEnding] = useState("2026-07-14");
  const [activeTab, setActiveTab] = useState<"supply" | "balance" | "pressure">("supply");

  // Format date for display
  const displayDate = new Date(weekEnding).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Compute supply data
  const supplyData = useMemo(() => {
    // Group producers by category
    const jvProducers = producers.filter(p => p.category === "JV");
    const pscProducers = producers.filter(p => p.category === "PSC");
    const neplProducers = producers.filter(p => p.category === "NEPL+IND");

    // Get contribution summaries
    const jvContribution = producerContributions.find(c => c.category === "JV");
    const pscContribution = producerContributions.find(c => c.category === "PSC");
    const neplContribution = producerContributions.find(c => c.category === "NEPL+IND");

    return {
      jv: {
        producers: jvProducers,
        summary: jvContribution,
      },
      psc: {
        producers: pscProducers,
        summary: pscContribution,
      },
      nepl: {
        producers: neplProducers,
        summary: neplContribution,
      },
    };
  }, [weekEnding]);

  // Compute volume balance data
  const volumeBalanceData = useMemo(() => {
    // This would typically come from a volume accounting data source
    // For now, using nationalProduction
    const produced = nationalProduction.totalProduction * 1000; // Convert to MMscfd
    const nglExtracted = produced * 0.05; // Estimate 5% NGL extraction
    const intoTransmission = produced - nglExtracted;
    const fuelGas = intoTransmission * 0.03; // Estimate 3% fuel gas
    const linePackChange = 0; // Assume no line pack change
    const delivered = nationalProduction.domestic.volume * 1000 + nationalProduction.export.volume * 1000;
    const ufg = intoTransmission - fuelGas - linePackChange - delivered;
    const ufgPercent = (ufg / intoTransmission) * 100;

    return {
      produced,
      nglExtracted,
      receivedIntoTransmission: intoTransmission,
      fuelGas,
      linePackChange,
      delivered,
      ufg,
      ufgPercent,
    };
  }, []);

  // Compute pressure data (weekly averages)
  const pressureManagementData = useMemo(() => {
    // Group producers by network and check pressure compliance
    const westernProducers = producersMaster.filter(p => p.network === "Western Network");
    const easternProducers = producersMaster.filter(p => p.network === "Eastern Network");

    const checkPressureCompliance = (producerId: string) => {
      const producer = producersMaster.find(p => p.id === producerId);
      const weekData = getProducerWeeklyData(weekEnding, producerId);

      if (!producer || !weekData) return null;

      const avgPressure = weekData.avgPressure;
      const minPressure = producer.contractualPressureRange?.min || 0;
      const maxPressure = producer.contractualPressureRange?.max || 100;

      const isBreach = avgPressure < minPressure || avgPressure > maxPressure;

      return {
        producerName: producer.name,
        avgPressure,
        minPressure,
        maxPressure,
        avgVolume: weekData.avgVolume,
        isBreach,
      };
    };

    const westernData = westernProducers
      .map(p => checkPressureCompliance(p.id))
      .filter(Boolean);

    const easternData = easternProducers
      .map(p => checkPressureCompliance(p.id))
      .filter(Boolean);

    return {
      western: westernData,
      eastern: easternData,
      elpsData: elpsPressureData,
    };
  }, [weekEnding]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1B5E3E] to-[#2B5F75] text-white px-8 py-6 print:bg-white print:text-ink">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Weekly Management Operating Report (MOR)</h1>
            <p className="text-white/90 mt-1 print:text-ink/70">Week ending {displayDate}</p>
          </div>
          <div className="flex items-center gap-3 print:hidden">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <input
                type="date"
                value={weekEnding}
                onChange={(e) => setWeekEnding(e.target.value)}
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
            <TabsTrigger value="supply" active={activeTab === "supply"} onClick={() => setActiveTab("supply")}>
              Supply & Production
            </TabsTrigger>
            <TabsTrigger value="balance" active={activeTab === "balance"} onClick={() => setActiveTab("balance")}>
              Volume Balance
            </TabsTrigger>
            <TabsTrigger value="pressure" active={activeTab === "pressure"} onClick={() => setActiveTab("pressure")}>
              Pressure Management
            </TabsTrigger>
          </TabsList>

          {/* Supply & Production Tab */}
          <TabsContent value="supply" activeValue={activeTab}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-ink mb-2">Gas Supply & Production</h2>
              <p className="text-sm text-ink/60">Weekly producer performance by category (JV, PSC, NEPL+IND)</p>
            </div>

            {/* Production Summary Cards */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-[#1B5E3E]/10 to-[#1B5E3E]/5 border-2 border-[#1B5E3E] rounded-lg p-6">
                <p className="text-sm font-medium text-ink/60 mb-2">Total Production</p>
                <p className="text-4xl font-bold text-[#1B5E3E] tabular-nums">
                  {nationalProduction.totalProduction.toFixed(2)}
                </p>
                <p className="text-xs text-ink/50 mt-1">Bcfd</p>
              </div>
              <div className="bg-gradient-to-br from-purple-600/10 to-purple-600/5 border-2 border-purple-600 rounded-lg p-6">
                <p className="text-sm font-medium text-ink/60 mb-2">JV Contribution</p>
                <p className="text-4xl font-bold text-purple-600 tabular-nums">
                  {supplyData.jv.summary?.percentage.toFixed(0)}%
                </p>
                <p className="text-xs text-ink/50 mt-1">{((supplyData.jv.summary?.currentWeek || 0) / 1000).toFixed(2)} Bcfd</p>
              </div>
              <div className="bg-gradient-to-br from-blue-600/10 to-blue-600/5 border-2 border-blue-600 rounded-lg p-6">
                <p className="text-sm font-medium text-ink/60 mb-2">PSC Contribution</p>
                <p className="text-4xl font-bold text-blue-600 tabular-nums">
                  {supplyData.psc.summary?.percentage.toFixed(0)}%
                </p>
                <p className="text-xs text-ink/50 mt-1">{((supplyData.psc.summary?.currentWeek || 0) / 1000).toFixed(2)} Bcfd</p>
              </div>
              <div className="bg-gradient-to-br from-teal-600/10 to-teal-600/5 border-2 border-teal-600 rounded-lg p-6">
                <p className="text-sm font-medium text-ink/60 mb-2">NEPL+IND Contribution</p>
                <p className="text-4xl font-bold text-teal-600 tabular-nums">
                  {supplyData.nepl.summary?.percentage.toFixed(0)}%
                </p>
                <p className="text-xs text-ink/50 mt-1">{((supplyData.nepl.summary?.currentWeek || 0) / 1000).toFixed(2)} Bcfd</p>
              </div>
            </div>

            {/* JV Producers */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-ink mb-4 px-4 py-2 bg-purple-600/10 rounded-lg flex items-center justify-between">
                <span>Joint Venture (JV) Producers</span>
                <span className="text-sm font-normal text-ink/60">
                  {supplyData.jv.summary?.percentage.toFixed(1)}% of total production
                </span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border border-line">
                  <thead className="bg-purple-600/5">
                    <tr className="border-b border-line">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-ink">Producer</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-ink">Network</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-ink">Plant Capacity</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-ink">Forecast</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-ink">Avg Daily</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-ink">Contribution %</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-ink">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplyData.jv.producers.map((producer, idx) => (
                      <tr key={idx} className="border-b border-line hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-ink font-medium">{producer.name}</td>
                        <td className="px-4 py-3 text-sm text-ink/70">{producer.network}</td>
                        <td className="px-4 py-3 text-sm text-ink text-right tabular-nums">
                          {producer.plantCapacity.toFixed(0)} MMscfd
                        </td>
                        <td className="px-4 py-3 text-sm text-ink text-right tabular-nums">
                          {producer.productionForecast.toFixed(0)} MMscfd
                        </td>
                        <td className="px-4 py-3 text-sm text-right tabular-nums">
                          <span className="text-[#1B5E3E] font-semibold">
                            {producer.averageDailyProduction.toFixed(0)} MMscfd
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-purple-600 font-semibold text-right tabular-nums">
                          {(producer.contributionPercentage || 0).toFixed(2)}%
                        </td>
                        <td className="px-4 py-3 text-xs">
                          <span className="px-2 py-1 rounded bg-success/10 text-success">
                            {producer.remarks}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PSC Producers */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-ink mb-4 px-4 py-2 bg-blue-600/10 rounded-lg flex items-center justify-between">
                <span>Production Sharing Contract (PSC) Producers</span>
                <span className="text-sm font-normal text-ink/60">
                  {supplyData.psc.summary?.percentage.toFixed(1)}% of total production
                </span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border border-line">
                  <thead className="bg-blue-600/5">
                    <tr className="border-b border-line">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-ink">Producer</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-ink">Network</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-ink">Plant Capacity</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-ink">Forecast</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-ink">Avg Daily</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-ink">Contribution %</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-ink">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplyData.psc.producers.map((producer, idx) => (
                      <tr key={idx} className="border-b border-line hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-ink font-medium">{producer.name}</td>
                        <td className="px-4 py-3 text-sm text-ink/70">{producer.network}</td>
                        <td className="px-4 py-3 text-sm text-ink text-right tabular-nums">
                          {producer.plantCapacity.toFixed(0)} MMscfd
                        </td>
                        <td className="px-4 py-3 text-sm text-ink text-right tabular-nums">
                          {producer.productionForecast.toFixed(0)} MMscfd
                        </td>
                        <td className="px-4 py-3 text-sm text-right tabular-nums">
                          <span className="text-[#1B5E3E] font-semibold">
                            {producer.averageDailyProduction.toFixed(0)} MMscfd
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-blue-600 font-semibold text-right tabular-nums">
                          {(producer.contributionPercentage || 0).toFixed(2)}%
                        </td>
                        <td className="px-4 py-3 text-xs">
                          <span className="px-2 py-1 rounded bg-success/10 text-success">
                            {producer.remarks}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* NEPL+IND Producers */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-ink mb-4 px-4 py-2 bg-teal-600/10 rounded-lg flex items-center justify-between">
                <span>NEPL + Independent Producers</span>
                <span className="text-sm font-normal text-ink/60">
                  {supplyData.nepl.summary?.percentage.toFixed(1)}% of total production
                </span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border border-line">
                  <thead className="bg-teal-600/5">
                    <tr className="border-b border-line">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-ink">Producer</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-ink">Network</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-ink">Plant Capacity</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-ink">Forecast</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-ink">Avg Daily</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-ink">Contribution %</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-ink">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplyData.nepl.producers.map((producer, idx) => (
                      <tr key={idx} className="border-b border-line hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-ink font-medium">{producer.name}</td>
                        <td className="px-4 py-3 text-sm text-ink/70">{producer.network}</td>
                        <td className="px-4 py-3 text-sm text-ink text-right tabular-nums">
                          {producer.plantCapacity.toFixed(0)} MMscfd
                        </td>
                        <td className="px-4 py-3 text-sm text-ink text-right tabular-nums">
                          {producer.productionForecast.toFixed(0)} MMscfd
                        </td>
                        <td className="px-4 py-3 text-sm text-right tabular-nums">
                          <span className="text-[#1B5E3E] font-semibold">
                            {producer.averageDailyProduction.toFixed(0)} MMscfd
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-teal-600 font-semibold text-right tabular-nums">
                          {(producer.contributionPercentage || 0).toFixed(2)}%
                        </td>
                        <td className="px-4 py-3 text-xs">
                          <span className="px-2 py-1 rounded bg-success/10 text-success">
                            {producer.remarks}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Volume Balance Tab */}
          <TabsContent value="balance" activeValue={activeTab}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-ink mb-2">Gas Volume Balance & Accounting</h2>
              <p className="text-sm text-ink/60">Weekly volume accounting from production to delivery</p>
            </div>

            {/* Volume Flow Diagram */}
            <div className="mb-8 bg-gradient-to-r from-blue-50 to-teal-50 border-2 border-[#1B5E3E] rounded-lg p-8">
              <h3 className="text-xl font-bold text-ink mb-6 text-center">Volume Flow - Week ending {displayDate}</h3>

              <div className="space-y-4">
                {/* Produced */}
                <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-line">
                  <span className="font-semibold text-ink">Produced</span>
                  <span className="text-2xl font-bold text-[#1B5E3E] tabular-nums">
                    {volumeBalanceData.produced.toFixed(0)} MMscfd
                  </span>
                </div>

                {/* NGL Extracted */}
                <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-line ml-8">
                  <span className="font-medium text-ink">➖ NGL Extracted</span>
                  <span className="text-xl font-bold text-amber-600 tabular-nums">
                    {volumeBalanceData.nglExtracted.toFixed(0)} MMscfd
                  </span>
                </div>

                {/* Into Transmission */}
                <div className="flex items-center justify-between bg-white rounded-lg p-4 border-2 border-blue-600 ml-8">
                  <span className="font-semibold text-ink">Received into Transmission</span>
                  <span className="text-2xl font-bold text-blue-600 tabular-nums">
                    {volumeBalanceData.receivedIntoTransmission.toFixed(0)} MMscfd
                  </span>
                </div>

                {/* Fuel Gas */}
                <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-line ml-16">
                  <span className="font-medium text-ink">➖ Fuel Gas</span>
                  <span className="text-xl font-bold text-purple-600 tabular-nums">
                    {volumeBalanceData.fuelGas.toFixed(0)} MMscfd
                  </span>
                </div>

                {/* Line Pack Change */}
                <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-line ml-16">
                  <span className="font-medium text-ink">± Line Pack Change</span>
                  <span className={`text-xl font-bold tabular-nums ${volumeBalanceData.linePackChange >= 0 ? 'text-success' : 'text-alert'}`}>
                    {volumeBalanceData.linePackChange >= 0 ? '+' : ''}{volumeBalanceData.linePackChange.toFixed(0)} MMscfd
                  </span>
                </div>

                {/* Delivered */}
                <div className="flex items-center justify-between bg-white rounded-lg p-4 border-2 border-[#1B5E3E] ml-16">
                  <span className="font-semibold text-ink">Delivered</span>
                  <span className="text-2xl font-bold text-[#1B5E3E] tabular-nums">
                    {volumeBalanceData.delivered.toFixed(0)} MMscfd
                  </span>
                </div>

                {/* UFG */}
                <div className="flex items-center justify-between bg-white rounded-lg p-4 border-2 border-alert ml-16">
                  <div>
                    <span className="font-semibold text-ink">Unaccounted for Gas (UFG)</span>
                    <p className="text-xs text-ink/60 mt-1">
                      {volumeBalanceData.ufgPercent.toFixed(2)}% of gas into transmission
                    </p>
                  </div>
                  <span className="text-2xl font-bold text-alert tabular-nums">
                    {volumeBalanceData.ufg.toFixed(0)} MMscfd
                  </span>
                </div>
              </div>
            </div>

            {/* Volume Balance Table */}
            <div className="overflow-x-auto">
              <table className="w-full border border-line">
                <thead className="bg-[#1B5E3E]/5">
                  <tr className="border-b-2 border-line">
                    <th className="px-6 py-4 text-left text-sm font-bold text-ink">Volume Component</th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-ink">Volume (MMscfd)</th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-ink">% of Produced</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-line bg-[#1B5E3E]/10">
                    <td className="px-6 py-4 text-sm font-bold text-ink">Produced</td>
                    <td className="px-6 py-4 text-sm font-bold text-[#1B5E3E] text-right tabular-nums">
                      {volumeBalanceData.produced.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-[#1B5E3E] text-right tabular-nums">
                      100.00%
                    </td>
                  </tr>
                  <tr className="border-b border-line">
                    <td className="px-6 py-4 text-sm text-ink pl-12">NGL Extracted</td>
                    <td className="px-6 py-4 text-sm text-amber-600 font-semibold text-right tabular-nums">
                      {volumeBalanceData.nglExtracted.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-amber-600 font-semibold text-right tabular-nums">
                      {((volumeBalanceData.nglExtracted / volumeBalanceData.produced) * 100).toFixed(2)}%
                    </td>
                  </tr>
                  <tr className="border-b border-line bg-blue-600/10">
                    <td className="px-6 py-4 text-sm font-bold text-ink">Received into Transmission</td>
                    <td className="px-6 py-4 text-sm font-bold text-blue-600 text-right tabular-nums">
                      {volumeBalanceData.receivedIntoTransmission.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-blue-600 text-right tabular-nums">
                      {((volumeBalanceData.receivedIntoTransmission / volumeBalanceData.produced) * 100).toFixed(2)}%
                    </td>
                  </tr>
                  <tr className="border-b border-line">
                    <td className="px-6 py-4 text-sm text-ink pl-12">Fuel Gas</td>
                    <td className="px-6 py-4 text-sm text-purple-600 font-semibold text-right tabular-nums">
                      {volumeBalanceData.fuelGas.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-purple-600 font-semibold text-right tabular-nums">
                      {((volumeBalanceData.fuelGas / volumeBalanceData.produced) * 100).toFixed(2)}%
                    </td>
                  </tr>
                  <tr className="border-b border-line">
                    <td className="px-6 py-4 text-sm text-ink pl-12">Line Pack Change</td>
                    <td className={`px-6 py-4 text-sm font-semibold text-right tabular-nums ${volumeBalanceData.linePackChange >= 0 ? 'text-success' : 'text-alert'}`}>
                      {volumeBalanceData.linePackChange >= 0 ? '+' : ''}{volumeBalanceData.linePackChange.toFixed(2)}
                    </td>
                    <td className={`px-6 py-4 text-sm font-semibold text-right tabular-nums ${volumeBalanceData.linePackChange >= 0 ? 'text-success' : 'text-alert'}`}>
                      {((Math.abs(volumeBalanceData.linePackChange) / volumeBalanceData.produced) * 100).toFixed(2)}%
                    </td>
                  </tr>
                  <tr className="border-b border-line bg-[#1B5E3E]/10">
                    <td className="px-6 py-4 text-sm font-bold text-ink pl-12">Delivered</td>
                    <td className="px-6 py-4 text-sm font-bold text-[#1B5E3E] text-right tabular-nums">
                      {volumeBalanceData.delivered.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-[#1B5E3E] text-right tabular-nums">
                      {((volumeBalanceData.delivered / volumeBalanceData.produced) * 100).toFixed(2)}%
                    </td>
                  </tr>
                  <tr className="border-b-2 border-line bg-alert/10">
                    <td className="px-6 py-4 text-sm font-bold text-ink pl-12">Unaccounted for Gas (UFG)</td>
                    <td className="px-6 py-4 text-sm font-bold text-alert text-right tabular-nums">
                      {volumeBalanceData.ufg.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-alert text-right tabular-nums">
                      {volumeBalanceData.ufgPercent.toFixed(2)}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Pressure Management Tab */}
          <TabsContent value="pressure" activeValue={activeTab}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-ink mb-2">Pressure Management</h2>
              <p className="text-sm text-ink/60">Weekly average pressure monitoring across producer networks and ELPS</p>
            </div>

            {/* ELPS Pressure Chart */}
            <div className="mb-8 bg-white border border-line rounded-lg p-6">
              <h3 className="text-lg font-bold text-ink mb-4">ELPS Pressure @ WGTP and Itoki</h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={pressureManagementData.elpsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DCDAD2" />
                  <XAxis
                    dataKey="timestamp"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  />
                  <YAxis tick={{ fontSize: 12 }} domain={[55, 85]} />
                  <Tooltip
                    labelFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                    formatter={(value: any) => [value.toFixed(1) + " bar", ""]}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="wgtpPressure" stroke="#0077BB" strokeWidth={2} name="Pressure @ WGTP" dot={{ fill: '#0077BB', r: 3 }} />
                  <Line type="monotone" dataKey="wgtpMin" stroke="#0077BB" strokeWidth={1} strokeDasharray="5 5" name="WGTP Min." dot={false} />
                  <Line type="monotone" dataKey="itokiPressure" stroke="#CC3311" strokeWidth={2} name="Pressure @ Itoki" dot={{ fill: '#CC3311', r: 3 }} />
                  <Line type="monotone" dataKey="itokiMin" stroke="#CC3311" strokeWidth={1} strokeDasharray="5 5" name="Itoki Min." dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Western Network Pressure */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-ink mb-4 px-4 py-2 bg-[#1B5E3E]/10 rounded-lg">
                Western Network - Producer Pressure Compliance
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border border-line">
                  <thead className="bg-[#1B5E3E]/5">
                    <tr className="border-b border-line">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-ink">Producer</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-ink">Avg Pressure (bar)</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-ink">Contractual Range (bar)</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-ink">Avg Volume (MMscfd)</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-ink">Compliance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pressureManagementData.western.map((data: any, idx: number) => (
                      <tr key={idx} className="border-b border-line hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-ink font-medium">{data.producerName}</td>
                        <td className="px-4 py-3 text-sm text-right tabular-nums">
                          <span className={data.isBreach ? "text-alert font-bold" : "text-[#1B5E3E] font-semibold"}>
                            {data.avgPressure.toFixed(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-ink/60 text-center tabular-nums">
                          {data.minPressure} - {data.maxPressure}
                        </td>
                        <td className="px-4 py-3 text-sm text-ink text-right tabular-nums">
                          {data.avgVolume.toFixed(0)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {data.isBreach ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-alert/10 text-alert text-xs font-semibold">
                              <AlertTriangle className="w-3 h-3" />
                              BREACH
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded bg-success/10 text-success text-xs font-semibold">
                              COMPLIANT
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Eastern Network Pressure */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-ink mb-4 px-4 py-2 bg-[#2B5F75]/10 rounded-lg">
                Eastern Network - Producer Pressure Compliance
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border border-line">
                  <thead className="bg-[#2B5F75]/5">
                    <tr className="border-b border-line">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-ink">Producer</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-ink">Avg Pressure (bar)</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-ink">Contractual Range (bar)</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-ink">Avg Volume (MMscfd)</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-ink">Compliance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pressureManagementData.eastern.map((data: any, idx: number) => (
                      <tr key={idx} className="border-b border-line hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-ink font-medium">{data.producerName}</td>
                        <td className="px-4 py-3 text-sm text-right tabular-nums">
                          <span className={data.isBreach ? "text-alert font-bold" : "text-[#1B5E3E] font-semibold"}>
                            {data.avgPressure.toFixed(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-ink/60 text-center tabular-nums">
                          {data.minPressure} - {data.maxPressure}
                        </td>
                        <td className="px-4 py-3 text-sm text-ink text-right tabular-nums">
                          {data.avgVolume.toFixed(0)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {data.isBreach ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-alert/10 text-alert text-xs font-semibold">
                              <AlertTriangle className="w-3 h-3" />
                              BREACH
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded bg-success/10 text-success text-xs font-semibold">
                              COMPLIANT
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 flex items-center justify-between text-xs text-ink/50 border-t border-line pt-4">
          <p>Generated: {new Date().toLocaleString()}</p>
          <div className="flex items-center gap-2">
            <img src="/nnpc-logo.png" alt="NNPC" className="h-6 opacity-50" onError={(e) => e.currentTarget.style.display = 'none'} />
            <span>NNPC Limited - Weekly Management Operating Report</span>
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
