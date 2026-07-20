"use client";

import React, { useState, useEffect } from "react";
import { Download, Printer, Save, Calendar, TrendingUp, AlertCircle } from "lucide-react";
import Image from "next/image";

// Data types
interface ProductionSource {
  id: string;
  operator: string;
  field: string;
  designCapacity: number;
  nomination: number;
  actualProduction: number;
  toProcessing: number;
  status: "producing" | "down" | "maintenance";
  remarks: string;
  gasPlant?: string;
}

interface ProcessingPlant {
  id: string;
  name: string;
  location: string;
  gasFeed: number;
  processedGas: number;
  toPipeline: number;
  efficiency: number;
  status: "online" | "offline" | "degraded";
  remarks: string;
}

interface PipelineInjection {
  id: string;
  injectionPoint: string;
  pipeline: string;
  volume: number;
  pressure: number;
  destination: string;
}

export default function ProductionDashboard() {
  const [reportDate, setReportDate] = useState(new Date().toISOString().split("T")[0]);
  const [productionData, setProductionData] = useState<ProductionSource[]>([]);
  const [processingData, setProcessingData] = useState<ProcessingPlant[]>([]);
  const [injectionData, setInjectionData] = useState<PipelineInjection[]>([]);
  const [isEditing, setIsEditing] = useState(true);

  // Load data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`ngpis-production-${reportDate}`);
    if (saved) {
      const data = JSON.parse(saved);
      setProductionData(data.production || []);
      setProcessingData(data.processing || []);
      setInjectionData(data.injection || []);
    } else {
      const initialData = getInitialData();
      setProductionData(initialData.production);
      setProcessingData(initialData.processing);
      setInjectionData(initialData.injection);
    }
  }, [reportDate]);

  // Save data
  const saveData = () => {
    const data = {
      production: productionData,
      processing: processingData,
      injection: injectionData,
    };
    localStorage.setItem(`ngpis-production-${reportDate}`, JSON.stringify(data));
    alert("Production report saved successfully!");
  };

  // Update production field
  const updateProduction = (id: string, field: keyof ProductionSource, value: any) => {
    setProductionData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // Update processing field
  const updateProcessing = (id: string, field: keyof ProcessingPlant, value: any) => {
    setProcessingData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // Calculate totals
  const totalProduction = productionData.reduce((sum, p) => sum + p.actualProduction, 0);
  const totalNomination = productionData.reduce((sum, p) => sum + p.nomination, 0);
  const totalToProcessing = productionData.reduce((sum, p) => sum + p.toProcessing, 0);
  const totalProcessed = processingData.reduce((sum, p) => sum + p.processedGas, 0);
  const totalToPipeline = processingData.reduce((sum, p) => sum + p.toPipeline, 0);
  const totalInjected = injectionData.reduce((sum, i) => sum + i.volume, 0);

  const productionVsNomination = totalNomination > 0 ? ((totalProduction / totalNomination) * 100) : 0;
  const processingEfficiency = totalToProcessing > 0 ? ((totalProcessed / totalToProcessing) * 100) : 0;

  // Status badge
  const getStatusBadge = (status: string) => {
    const badges = {
      producing: "bg-success/10 text-success border-success/30",
      online: "bg-success/10 text-success border-success/30",
      down: "bg-alert/10 text-alert border-alert/30",
      offline: "bg-alert/10 text-alert border-alert/30",
      maintenance: "bg-yellow-500/10 text-yellow-700 border-yellow-500/30",
      degraded: "bg-yellow-500/10 text-yellow-700 border-yellow-500/30",
    };
    const labels = {
      producing: "PRODUCING",
      online: "ONLINE",
      down: "DOWN",
      offline: "OFFLINE",
      maintenance: "MAINTENANCE",
      degraded: "DEGRADED",
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-line px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Image src="/nnpc-logo.png" alt="NNPC Logo" width={60} height={60} />
            <div>
              <h1 className="text-2xl font-bold text-[#1B5E3E]">
                NNPC GAS PROCESSING & INFRASTRUCTURE SERVICES
              </h1>
              <p className="text-sm text-ink/60">
                Daily Production & Processing Report
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-ink">Production Dashboard</h2>
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
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">
              <Download className="w-4 h-4" />
              Export Excel
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-line rounded hover:bg-gray-50">
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 max-w-[1800px] mx-auto space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-6 gap-4">
          <div className="bg-white border border-line rounded-lg p-4">
            <p className="text-sm text-ink/60">Total Production</p>
            <p className="text-2xl font-bold text-[#1B5E3E] mt-1 tabular-nums">
              {totalProduction.toFixed(2)}
            </p>
            <p className="text-xs text-ink/40 mt-1">MMscfd</p>
          </div>
          <div className="bg-white border border-line rounded-lg p-4">
            <p className="text-sm text-ink/60">Nomination</p>
            <p className="text-2xl font-bold text-ink mt-1 tabular-nums">
              {totalNomination.toFixed(2)}
            </p>
            <p className="text-xs text-ink/40 mt-1">MMscfd</p>
          </div>
          <div className="bg-white border border-line rounded-lg p-4">
            <p className="text-sm text-ink/60">Production %</p>
            <p className={`text-2xl font-bold mt-1 tabular-nums ${
              productionVsNomination >= 95 ? "text-success" : productionVsNomination >= 80 ? "text-yellow-600" : "text-alert"
            }`}>
              {productionVsNomination.toFixed(1)}%
            </p>
            <p className="text-xs text-ink/40 mt-1">vs Nomination</p>
          </div>
          <div className="bg-white border border-line rounded-lg p-4">
            <p className="text-sm text-ink/60">To Processing</p>
            <p className="text-2xl font-bold text-primary mt-1 tabular-nums">
              {totalToProcessing.toFixed(2)}
            </p>
            <p className="text-xs text-ink/40 mt-1">MMscfd</p>
          </div>
          <div className="bg-white border border-line rounded-lg p-4">
            <p className="text-sm text-ink/60">Processed Gas</p>
            <p className="text-2xl font-bold text-accent mt-1 tabular-nums">
              {totalProcessed.toFixed(2)}
            </p>
            <p className="text-xs text-ink/40 mt-1">MMscfd</p>
          </div>
          <div className="bg-white border border-line rounded-lg p-4">
            <p className="text-sm text-ink/60">To Pipeline</p>
            <p className="text-2xl font-bold text-success mt-1 tabular-nums">
              {totalToPipeline.toFixed(2)}
            </p>
            <p className="text-xs text-ink/40 mt-1">MMscfd</p>
          </div>
        </div>

        {/* Section 1: Gas Production (Upstream) */}
        <div className="bg-white border border-line rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-line bg-[#1B5E3E] text-white">
            <h3 className="text-lg font-bold">GAS PRODUCTION - UPSTREAM OPERATORS</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b border-line">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-ink">Operator</th>
                  <th className="px-4 py-3 text-left font-semibold text-ink">Field/Asset</th>
                  <th className="px-4 py-3 text-right font-semibold text-ink">Design Capacity</th>
                  <th className="px-4 py-3 text-right font-semibold text-ink">Nomination</th>
                  <th className="px-4 py-3 text-right font-semibold text-ink">Actual Production</th>
                  <th className="px-4 py-3 text-right font-semibold text-ink">To Processing</th>
                  <th className="px-4 py-3 text-left font-semibold text-ink">Gas Plant</th>
                  <th className="px-4 py-3 text-left font-semibold text-ink">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-ink">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {productionData.map((source) => (
                  <tr key={source.id} className="border-b border-line hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-ink">{source.operator}</td>
                    <td className="px-4 py-3 text-ink">{source.field}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-ink">
                      {source.designCapacity.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-ink">
                      {source.nomination.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.01"
                          value={source.actualProduction}
                          onChange={(e) =>
                            updateProduction(source.id, "actualProduction", parseFloat(e.target.value) || 0)
                          }
                          className="w-24 px-2 py-1 text-right border border-line rounded tabular-nums"
                        />
                      ) : (
                        <span className="text-ink font-semibold">{source.actualProduction.toFixed(2)}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.01"
                          value={source.toProcessing}
                          onChange={(e) =>
                            updateProduction(source.id, "toProcessing", parseFloat(e.target.value) || 0)
                          }
                          className="w-24 px-2 py-1 text-right border border-line rounded tabular-nums"
                        />
                      ) : (
                        <span className="text-ink">{source.toProcessing.toFixed(2)}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-ink/70">{source.gasPlant}</td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <select
                          value={source.status}
                          onChange={(e) => updateProduction(source.id, "status", e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-line rounded"
                        >
                          <option value="producing">Producing</option>
                          <option value="down">Down</option>
                          <option value="maintenance">Maintenance</option>
                        </select>
                      ) : (
                        getStatusBadge(source.status)
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={source.remarks}
                          onChange={(e) => updateProduction(source.id, "remarks", e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-line rounded"
                          placeholder="Remarks..."
                        />
                      ) : (
                        <span className="text-xs text-ink/60">{source.remarks}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-[#1B5E3E]/10 font-bold">
                <tr>
                  <td colSpan={2} className="px-4 py-3 text-ink">TOTAL</td>
                  <td className="px-4 py-3 text-right tabular-nums text-ink">
                    {productionData.reduce((sum, p) => sum + p.designCapacity, 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-ink">
                    {totalNomination.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-ink">
                    {totalProduction.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-ink">
                    {totalToProcessing.toFixed(2)}
                  </td>
                  <td colSpan={3}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Section 2: Gas Processing Plants */}
        <div className="bg-white border border-line rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-line bg-[#2B5F75] text-white">
            <h3 className="text-lg font-bold">GAS PROCESSING PLANTS</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b border-line">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-ink">Plant Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-ink">Location</th>
                  <th className="px-4 py-3 text-right font-semibold text-ink">Gas Feed (MMscfd)</th>
                  <th className="px-4 py-3 text-right font-semibold text-ink">Processed Gas</th>
                  <th className="px-4 py-3 text-right font-semibold text-ink">To Pipeline</th>
                  <th className="px-4 py-3 text-right font-semibold text-ink">Efficiency %</th>
                  <th className="px-4 py-3 text-left font-semibold text-ink">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-ink">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {processingData.map((plant) => (
                  <tr key={plant.id} className="border-b border-line hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-ink">{plant.name}</td>
                    <td className="px-4 py-3 text-ink/70">{plant.location}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-ink">
                      {plant.gasFeed.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.01"
                          value={plant.processedGas}
                          onChange={(e) =>
                            updateProcessing(plant.id, "processedGas", parseFloat(e.target.value) || 0)
                          }
                          className="w-24 px-2 py-1 text-right border border-line rounded tabular-nums"
                        />
                      ) : (
                        <span className="text-ink font-semibold">{plant.processedGas.toFixed(2)}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.01"
                          value={plant.toPipeline}
                          onChange={(e) =>
                            updateProcessing(plant.id, "toPipeline", parseFloat(e.target.value) || 0)
                          }
                          className="w-24 px-2 py-1 text-right border border-line rounded tabular-nums"
                        />
                      ) : (
                        <span className="text-ink">{plant.toPipeline.toFixed(2)}</span>
                      )}
                    </td>
                    <td className={`px-4 py-3 text-right tabular-nums font-semibold ${
                      plant.efficiency >= 95 ? "text-success" : plant.efficiency >= 85 ? "text-yellow-600" : "text-alert"
                    }`}>
                      {plant.efficiency.toFixed(1)}%
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <select
                          value={plant.status}
                          onChange={(e) => updateProcessing(plant.id, "status", e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-line rounded"
                        >
                          <option value="online">Online</option>
                          <option value="degraded">Degraded</option>
                          <option value="offline">Offline</option>
                        </select>
                      ) : (
                        getStatusBadge(plant.status)
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={plant.remarks}
                          onChange={(e) => updateProcessing(plant.id, "remarks", e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-line rounded"
                          placeholder="Remarks..."
                        />
                      ) : (
                        <span className="text-xs text-ink/60">{plant.remarks}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-[#2B5F75]/10 font-bold">
                <tr>
                  <td colSpan={2} className="px-4 py-3 text-ink">TOTAL</td>
                  <td className="px-4 py-3 text-right tabular-nums text-ink">
                    {processingData.reduce((sum, p) => sum + p.gasFeed, 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-ink">
                    {totalProcessed.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-ink">
                    {totalToPipeline.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-ink">
                    {processingEfficiency.toFixed(1)}%
                  </td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Section 3: Pipeline Injection Points */}
        <div className="bg-white border border-line rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-line bg-[#F9A825] text-white">
            <h3 className="text-lg font-bold">PIPELINE INJECTION POINTS</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b border-line">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-ink">Injection Point</th>
                  <th className="px-4 py-3 text-left font-semibold text-ink">Pipeline</th>
                  <th className="px-4 py-3 text-right font-semibold text-ink">Volume (MMscfd)</th>
                  <th className="px-4 py-3 text-right font-semibold text-ink">Pressure (bar)</th>
                  <th className="px-4 py-3 text-left font-semibold text-ink">Destination</th>
                </tr>
              </thead>
              <tbody>
                {injectionData.map((injection) => (
                  <tr key={injection.id} className="border-b border-line hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-ink">{injection.injectionPoint}</td>
                    <td className="px-4 py-3 text-ink/70">{injection.pipeline}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-ink font-semibold">
                      {injection.volume.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-ink">
                      {injection.pressure}
                    </td>
                    <td className="px-4 py-3 text-ink/70">{injection.destination}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-[#F9A825]/10 font-bold">
                <tr>
                  <td colSpan={2} className="px-4 py-3 text-ink">TOTAL INJECTION</td>
                  <td className="px-4 py-3 text-right tabular-nums text-ink">
                    {totalInjected.toFixed(2)}
                  </td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Production Flow Summary */}
        <div className="bg-white border-2 border-[#1B5E3E] rounded-lg p-6">
          <h3 className="text-lg font-bold text-ink mb-4">Production Flow Summary</h3>
          <div className="grid grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-12 h-12 rounded-full bg-[#1B5E3E] text-white flex items-center justify-center text-xl font-bold">
                  1
                </div>
              </div>
              <p className="text-sm font-medium text-ink">Gas Production</p>
              <p className="text-2xl font-bold text-[#1B5E3E] mt-2 tabular-nums">
                {totalProduction.toFixed(2)}
              </p>
              <p className="text-xs text-ink/40 mt-1">MMscfd from {productionData.length} sources</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-12 h-12 rounded-full bg-[#2B5F75] text-white flex items-center justify-center text-xl font-bold">
                  2
                </div>
              </div>
              <p className="text-sm font-medium text-ink">Gas Processing</p>
              <p className="text-2xl font-bold text-[#2B5F75] mt-2 tabular-nums">
                {totalProcessed.toFixed(2)}
              </p>
              <p className="text-xs text-ink/40 mt-1">MMscfd at {processingData.length} plants</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-12 h-12 rounded-full bg-[#F9A825] text-white flex items-center justify-center text-xl font-bold">
                  3
                </div>
              </div>
              <p className="text-sm font-medium text-ink">Pipeline Injection</p>
              <p className="text-2xl font-bold text-[#F9A825] mt-2 tabular-nums">
                {totalInjected.toFixed(2)}
              </p>
              <p className="text-xs text-ink/40 mt-1">MMscfd to NGIC network</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-12 h-12 rounded-full bg-success text-white flex items-center justify-center text-xl font-bold">
                  ✓
                </div>
              </div>
              <p className="text-sm font-medium text-ink">Overall Efficiency</p>
              <p className="text-2xl font-bold text-success mt-2 tabular-nums">
                {totalProduction > 0 ? ((totalInjected / totalProduction) * 100).toFixed(1) : 0}%
              </p>
              <p className="text-xs text-ink/40 mt-1">Production to Pipeline</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Initial sample data
function getInitialData() {
  return {
    production: [
      {
        id: "prod-1",
        operator: "Shell Petroleum Development Company (SPDC)",
        field: "Soku",
        designCapacity: 150.0,
        nomination: 150.0,
        actualProduction: 147.5,
        toProcessing: 147.5,
        status: "producing" as const,
        remarks: "",
        gasPlant: "Soku Gas Plant",
      },
      {
        id: "prod-2",
        operator: "Nigerian Agip Oil Company (NAOC)",
        field: "Obiafu/Obrikom",
        designCapacity: 200.0,
        nomination: 200.0,
        actualProduction: 198.3,
        toProcessing: 198.3,
        status: "producing" as const,
        remarks: "",
        gasPlant: "Obiafu Gas Plant",
      },
      {
        id: "prod-3",
        operator: "Total E&P Nigeria",
        field: "Obite",
        designCapacity: 120.0,
        nomination: 120.0,
        actualProduction: 115.8,
        toProcessing: 115.8,
        status: "producing" as const,
        remarks: "",
        gasPlant: "Obite Gas Plant",
      },
      {
        id: "prod-4",
        operator: "Chevron Nigeria Limited (CNL)",
        field: "Escravos",
        designCapacity: 180.0,
        nomination: 180.0,
        actualProduction: 176.2,
        toProcessing: 176.2,
        status: "producing" as const,
        remarks: "",
        gasPlant: "Escravos Gas Plant",
      },
      {
        id: "prod-5",
        operator: "ExxonMobil (MPN)",
        field: "Oso Condensate",
        designCapacity: 90.0,
        nomination: 90.0,
        actualProduction: 85.4,
        toProcessing: 85.4,
        status: "producing" as const,
        remarks: "Slight production deferment",
        gasPlant: "Oso Gas Plant",
      },
      {
        id: "prod-6",
        operator: "NPDC",
        field: "OML 26/30",
        designCapacity: 75.0,
        nomination: 75.0,
        actualProduction: 72.1,
        toProcessing: 72.1,
        status: "producing" as const,
        remarks: "",
        gasPlant: "Kwale Gas Plant",
      },
    ],
    processing: [
      {
        id: "plant-1",
        name: "Soku Gas Plant",
        location: "Rivers State",
        gasFeed: 147.5,
        processedGas: 145.2,
        toPipeline: 143.8,
        efficiency: 98.5,
        status: "online" as const,
        remarks: "",
      },
      {
        id: "plant-2",
        name: "Obiafu Gas Plant",
        location: "Rivers State",
        gasFeed: 198.3,
        processedGas: 195.4,
        toPipeline: 193.2,
        efficiency: 98.5,
        status: "online" as const,
        remarks: "",
      },
      {
        id: "plant-3",
        name: "Obite Gas Plant",
        location: "Rivers State",
        gasFeed: 115.8,
        processedGas: 113.5,
        toPipeline: 112.1,
        efficiency: 98.0,
        status: "online" as const,
        remarks: "",
      },
      {
        id: "plant-4",
        name: "Escravos Gas Plant",
        location: "Delta State",
        gasFeed: 176.2,
        processedGas: 172.8,
        toPipeline: 170.5,
        efficiency: 98.1,
        status: "online" as const,
        remarks: "",
      },
      {
        id: "plant-5",
        name: "Oso Gas Plant",
        location: "Akwa Ibom",
        gasFeed: 85.4,
        processedGas: 83.2,
        toPipeline: 82.1,
        efficiency: 97.4,
        status: "online" as const,
        remarks: "Minor equipment degradation",
      },
      {
        id: "plant-6",
        name: "Kwale Gas Plant",
        location: "Delta State",
        gasFeed: 72.1,
        processedGas: 70.5,
        toPipeline: 69.8,
        efficiency: 97.8,
        status: "online" as const,
        remarks: "",
      },
    ],
    injection: [
      {
        id: "inj-1",
        injectionPoint: "Soku IP",
        pipeline: "Eastern Gas Gathering System (EGGS)",
        volume: 143.8,
        pressure: 45,
        destination: "Lagos/East Corridor",
      },
      {
        id: "inj-2",
        injectionPoint: "Obiafu IP",
        pipeline: "Obiafu-Obrikom-Oben (OB3) Pipeline",
        volume: 193.2,
        pressure: 50,
        destination: "Delta/Lagos Corridor",
      },
      {
        id: "inj-3",
        injectionPoint: "Obite IP",
        pipeline: "OB3 Pipeline",
        volume: 112.1,
        pressure: 48,
        destination: "Lagos Corridor",
      },
      {
        id: "inj-4",
        injectionPoint: "Escravos IP",
        pipeline: "Escravos-Lagos Pipeline System (ELPS)",
        volume: 170.5,
        pressure: 52,
        destination: "Lagos Corridor",
      },
      {
        id: "inj-5",
        injectionPoint: "Oso IP",
        pipeline: "Eastern Gas Network",
        volume: 82.1,
        pressure: 42,
        destination: "East Corridor",
      },
      {
        id: "inj-6",
        injectionPoint: "Kwale IP",
        pipeline: "Western Gas Network",
        volume: 69.8,
        pressure: 40,
        destination: "Delta Corridor",
      },
    ],
  };
}
