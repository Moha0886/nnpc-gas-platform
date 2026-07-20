"use client";

import { useState } from "react";

// Mock data - in production, fetch from API based on uploaded/created production records
const mockWeeklySupplyData = {
  weekOf: "November 1-7, 2024",
  // Left side: GAS SUPPLY SITUATION
  gasSupply: {
    producers: [
      { sn: 1, name: "CNL- Escravos", volume: 2310.63 },
      { sn: 2, name: "NEPL/NDW Utorogu", volume: 1286.12 },
      { sn: 3, name: "NEPL Oredo FST3 (OGPOOC)", volume: 113.03 },
      { sn: 4, name: "NEPL Oredo (IGHF)", volume: 246.11 },
      { sn: 5, name: "Pan Ocean", volume: 677.26 },
      { sn: 6, name: "Seplat Oben", volume: 2104.11 },
      { sn: 7, name: "SPDC - Tunu/FYIP/Otumara", volume: 540.0 },
      { sn: 8, name: "NEPL/Neconde Odidi", volume: 0 },
      { sn: 9, name: "AHL", volume: 1905.12 },
      { sn: 10, name: "Platform", volume: 125.29 },
      { sn: 11, name: "Xenergi", volume: 121.57 },
      { sn: 12, name: "NEPL Ughelli", volume: 301.04 },
      { sn: 13, name: "CHORUS", volume: 117.70 },
    ],
    total: 9847.96,
  },
  // Right side: ALLOCATION & OFFTAKE SITUATION
  allocationOfftake: {
    offtakers: [
      {
        offtaker: "",
        sourceOfAllocation: "CNL, NPDC JV",
        allocation: 852.0,
        actualOfftake: 720.84,
      },
      {
        offtaker: "",
        sourceOfAllocation: "CNL, NPDC JV, NPDC Oredo, POOC, Seplat, AHL, Platform, Gashub, Xenergi",
        allocation: 3694.0,
        actualOfftake: 2760.11,
      },
      {
        offtaker: "",
        sourceOfAllocation: "CNL, NPDC JV, NPDC Neconde",
        allocation: 1014.5,
        actualOfftake: 1022.64,
      },
      {
        offtaker: "",
        sourceOfAllocation: "CNL, NPDC Oredo, Tunu, Utorogu",
        allocation: 1018.0,
        actualOfftake: 1093.69,
      },
      {
        offtaker: "",
        sourceOfAllocation: "CNL, PPL, POOC",
        allocation: 32.0,
        actualOfftake: 83.81,
      },
      {
        offtaker: "",
        sourceOfAllocation: "",
        allocation: 0,
        actualOfftake: 0.0,
      },
      {
        offtaker: "",
        sourceOfAllocation: "NPDC JV, SPDC Otumara & SPDC Forcados Yokri",
        allocation: 320.0,
        actualOfftake: 307.76,
      },
      {
        offtaker: "",
        sourceOfAllocation: "",
        allocation: 0,
        actualOfftake: 0.0,
      },
      {
        offtaker: "",
        sourceOfAllocation: "NPDC JV, CNL, Seplat",
        allocation: 70.0,
        actualOfftake: 107.19,
      },
      {
        offtaker: "",
        sourceOfAllocation: "Ughelli East",
        allocation: 315.0,
        actualOfftake: 0,
      },
      {
        offtaker: "",
        sourceOfAllocation: "NPDC JV, MSN/Raffles/Oceandiare",
        allocation: 189.0,
        actualOfftake: 230.18,
      },
      {
        offtaker: "",
        sourceOfAllocation: "NPDC JV, MSN/Raffles/Oceandiare",
        allocation: 189.0,
        actualOfftake: 184.75,
      },
      {
        offtaker: "",
        sourceOfAllocation: "NPDC JV",
        allocation: 9.1,
        actualOfftake: 10.2,
      },
      {
        offtaker: "",
        sourceOfAllocation: "Seplat",
        allocation: 675.08,
        actualOfftake: 655.28,
      },
      {
        offtaker: "",
        sourceOfAllocation: "Seplat & POOC",
        allocation: 351.0,
        actualOfftake: 490.49,
      },
      {
        offtaker: "",
        sourceOfAllocation: "Seplat",
        allocation: 22.0,
        actualOfftake: 24.94,
      },
      {
        offtaker: "",
        sourceOfAllocation: "POOC",
        allocation: 143.5,
        actualOfftake: 112.0,
      },
      {
        offtaker: "",
        sourceOfAllocation: "Seplat",
        allocation: 0,
        actualOfftake: 0,
      },
      {
        offtaker: "",
        sourceOfAllocation: "CNL, SPDC (Tunu), Seplat, NPDC, Pan Ocean",
        allocation: 0.0,
        actualOfftake: 0.0,
      },
      {
        offtaker: "",
        sourceOfAllocation: "",
        allocation: 0.0,
        actualOfftake: 0.0,
      },
      {
        offtaker: "",
        sourceOfAllocation: "",
        allocation: 175.0,
        actualOfftake: 122.18,
      },
      {
        offtaker: "",
        sourceOfAllocation: "",
        allocation: 385.0,
        actualOfftake: 341.5,
      },
      {
        offtaker: "",
        sourceOfAllocation: "",
        allocation: 0.0,
        actualOfftake: 0.0,
      },
      {
        offtaker: "",
        sourceOfAllocation: "Gashub",
        allocation: 28.0,
        actualOfftake: 0.0,
      },
      {
        offtaker: "",
        sourceOfAllocation: "",
        allocation: 126.0,
        actualOfftake: 83.81,
      },
    ],
    total: {
      allocation: 9608.18,
      actualOfftake: 8351.36,
    },
  },
  materialBalance: 1496.61,
  remarks: "",
};

export default function SupplyPage() {
  const [selectedWeek, setSelectedWeek] = useState("current");

  const supplyData = mockWeeklySupplyData;
  const { gasSupply, allocationOfftake, materialBalance } = supplyData;

  return (
    <div className="min-h-screen bg-paper p-8">
      <div className="max-w-[1800px] mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-ink">
            Weekly Gas Supply, Allocations & Offtake Overview
          </h1>
          <p className="text-ink/70 mt-2">
            Complete supply-to-offtake chain — from upstream operators through NGIC transmission to
            customer delivery
          </p>
        </div>

        {/* Week Selector */}
        <div className="bg-white border border-line rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-ink">Week of:</label>
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
                className="px-4 py-2 border border-line rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pine"
              >
                <option value="current">{supplyData.weekOf} (Current)</option>
                <option value="prior">October 25-31, 2024</option>
                <option value="w-2">October 18-24, 2024</option>
              </select>
            </div>
            <button className="px-4 py-2 bg-pine text-white rounded-md text-sm font-medium hover:bg-pine-dark transition-colors">
              + Upload Production Records
            </button>
          </div>
        </div>

        {/* Key Metrics Dashboard */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white border border-pine/30 rounded-lg p-6 bg-pine/5">
            <p className="text-sm text-ink/70">Total Gas Supply</p>
            <p className="text-3xl font-bold font-mono text-pine mt-2">
              {gasSupply.total.toFixed(2)}
            </p>
            <p className="text-xs text-ink/60 mt-1">MMscf received into transmission</p>
          </div>

          <div className="bg-white border border-line rounded-lg p-6">
            <p className="text-sm text-ink/70">Total Allocation</p>
            <p className="text-3xl font-bold font-mono text-ink mt-2">
              {allocationOfftake.total.allocation.toFixed(2)}
            </p>
            <p className="text-xs text-ink/60 mt-1">MMscf allocated to customers</p>
          </div>

          <div className="bg-white border border-line rounded-lg p-6">
            <p className="text-sm text-ink/70">Total Actual Offtake</p>
            <p className="text-3xl font-bold font-mono text-ink mt-2">
              {allocationOfftake.total.actualOfftake.toFixed(2)}
            </p>
            <p className="text-xs text-ink/60 mt-1">MMscf consumed by customers</p>
          </div>

          <div className="bg-white border border-gasblue/30 rounded-lg p-6 bg-gasblue/5">
            <p className="text-sm text-ink/70">Material Balance / Line Pack</p>
            <p className="text-3xl font-bold font-mono text-gasblue mt-2">
              {materialBalance.toFixed(2)}
            </p>
            <p className="text-xs text-ink/60 mt-1">
              MMscf (Supply {gasSupply.total.toFixed(0)} − Offtake{" "}
              {allocationOfftake.total.actualOfftake.toFixed(0)})
            </p>
          </div>
        </div>

        {/* Main Two-Column Report */}
        <div className="bg-white border border-line rounded-lg overflow-hidden">
          {/* Report Header */}
          <div className="px-6 py-4 border-b border-line bg-pine/5">
            <h2 className="text-lg font-semibold text-ink uppercase text-center">
              Weekly Gas Supply, Allocations & Offtake Overview (Week of {supplyData.weekOf})
            </h2>
          </div>

          {/* Two-Column Layout */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              {/* Column Headers */}
              <thead>
                <tr className="bg-pine/10 border-b-2 border-pine">
                  <th
                    className="px-4 py-3 text-center font-bold text-ink border-r-2 border-pine"
                    colSpan={3}
                  >
                    GAS SUPPLY SITUATION
                  </th>
                  <th className="px-4 py-3 text-center font-bold text-ink" colSpan={4}>
                    ALLOCATION & OFFTAKE SITUATION
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-ink">REMARKS</th>
                </tr>
                <tr className="bg-pine/5 border-b border-line text-xs">
                  <th className="px-3 py-2 text-center font-semibold text-ink border-r border-line w-12">
                    S/N
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-ink border-r border-line">
                    GAS PRODUCERS
                  </th>
                  <th className="px-4 py-2 text-right font-semibold text-ink border-r-2 border-pine">
                    VOLUME
                    <br />
                    (MMscf)
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-ink border-r border-line">
                    Offtakers
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-ink border-r border-line">
                    Source of Allocation
                  </th>
                  <th className="px-4 py-2 text-right font-semibold text-ink border-r border-line">
                    Allocation
                    <br />
                    (MMscf)
                  </th>
                  <th className="px-4 py-2 text-right font-semibold text-ink border-r border-line">
                    Actual Offtake
                    <br />
                    (MMscf)
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-ink"></th>
                </tr>
              </thead>

              {/* Data Rows */}
              <tbody>
                {gasSupply.producers.map((producer, idx) => {
                  const offtakeRow = allocationOfftake.offtakers[idx];
                  const isShutdown = producer.volume === 0;

                  return (
                    <tr
                      key={producer.sn}
                      className={`border-t border-line/30 hover:bg-pine/5 transition-colors ${
                        isShutdown ? "bg-ink/5" : ""
                      }`}
                    >
                      {/* Left Side: Gas Supply */}
                      <td className="px-3 py-3 text-center font-mono text-ink/70 border-r border-line">
                        {producer.sn}
                      </td>
                      <td className="px-4 py-3 text-ink font-medium border-r border-line">
                        {producer.name}
                        {isShutdown && (
                          <span className="ml-2 inline-block px-2 py-0.5 text-xs font-medium bg-ink/10 text-ink/60 rounded">
                            SHUTDOWN
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-ink font-semibold border-r-2 border-pine">
                        {producer.volume > 0 ? producer.volume.toFixed(2) : "-"}
                      </td>

                      {/* Right Side: Allocation & Offtake */}
                      <td className="px-4 py-3 text-sm text-ink/70 border-r border-line">
                        {offtakeRow?.offtaker || ""}
                      </td>
                      <td className="px-4 py-3 text-sm text-ink border-r border-line">
                        {offtakeRow?.sourceOfAllocation || ""}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-ink border-r border-line">
                        {offtakeRow?.allocation > 0 ? offtakeRow.allocation.toFixed(2) : ""}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-ink font-semibold border-r border-line">
                        {offtakeRow?.actualOfftake > 0 ? offtakeRow.actualOfftake.toFixed(2) : ""}
                      </td>
                      <td className="px-4 py-3 text-sm text-ink/70"></td>
                    </tr>
                  );
                })}

                {/* TOTAL Row */}
                <tr className="bg-pine/10 border-t-2 border-pine font-bold">
                  <td colSpan={2} className="px-4 py-4 text-ink uppercase border-r border-line">
                    TOTAL
                  </td>
                  <td className="px-4 py-4 text-right font-mono text-ink border-r-2 border-pine">
                    {gasSupply.total.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 border-r border-line"></td>
                  <td className="px-4 py-4 text-right font-mono text-ink border-r border-line">
                    Total
                  </td>
                  <td className="px-4 py-4 text-right font-mono text-ink border-r border-line">
                    {allocationOfftake.total.allocation.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 text-right font-mono text-ink border-r border-line">
                    {allocationOfftake.total.actualOfftake.toFixed(2)}
                  </td>
                  <td className="px-4 py-4"></td>
                </tr>

                {/* Material Balance Row */}
                <tr className="bg-gasblue/10 border-t-2 border-gasblue">
                  <td colSpan={3} className="border-r-2 border-pine"></td>
                  <td className="px-4 py-4 border-r border-line"></td>
                  <td className="px-4 py-4 text-right font-bold text-ink border-r border-line">
                    Material Balance / Line Pack
                  </td>
                  <td className="px-4 py-4 border-r border-line"></td>
                  <td className="px-4 py-4 text-right font-mono text-gasblue font-bold text-lg border-r border-line">
                    {materialBalance.toFixed(2)}
                  </td>
                  <td className="px-4 py-4"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Data Source Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
              ℹ
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Production Records Data Source
              </h3>
              <p className="text-sm text-blue-800 mb-3">
                This report displays data from uploaded/created production records. The system
                automatically calculates:
              </p>
              <ul className="space-y-1 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>
                    <strong>Gas Supply Total:</strong> Sum of all volumes received from upstream
                    operators (SPDC, CNL, NEPL, Seplat, etc.) into NGIC transmission network
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>
                    <strong>Allocation Total:</strong> Sum of all gas allocated to customers based
                    on nominations and capacity
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>
                    <strong>Actual Offtake Total:</strong> Sum of all metered customer consumption
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>
                    <strong>Material Balance / Line Pack:</strong> Computed as Supply Total −
                    Actual Offtake Total (cannot be manually edited)
                  </span>
                </li>
              </ul>
              <p className="text-sm text-blue-800 mt-3">
                Click{" "}
                <span className="font-semibold">&quot;+ Upload Production Records&quot;</span> to import
                weekly production data from upstream operators.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white border border-line rounded-lg p-6">
          <h3 className="text-lg font-semibold text-ink mb-4">
            Understanding the Supply-to-Offtake Chain
          </h3>
          <div className="space-y-3 text-sm text-ink/80">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-pine text-white flex items-center justify-center text-xs font-bold">
                1
              </div>
              <p>
                <strong>Upstream operators produce gas</strong> at their fields and plants (SPDC,
                CNL, NEPL, Seplat, Pan Ocean, AHL, Platform, Xenergi, Chorus)
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-pine text-white flex items-center justify-center text-xs font-bold">
                2
              </div>
              <p>
                <strong>NGIC receives gas into transmission network</strong> — the &quot;Volume (MMscf)&quot;
                column shows what NGIC took from each operator. Example: SPDC supplied 540.00 MMscf,
                CNL supplied 2,310.63 MMscf
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-pine text-white flex items-center justify-center text-xs font-bold">
                3
              </div>
              <p>
                <strong>Source of Allocation tracks the flow</strong> — shows which producer
                sources supply which customer groups. Example: &quot;CNL, NPDC JV, NPDC Oredo, POOC,
                Seplat, AHL, Platform, Gashub, Xenergi&quot; means these 9 producers collectively supply
                that customer group
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-pine text-white flex items-center justify-center text-xs font-bold">
                4
              </div>
              <p>
                <strong>Material Balance / Line Pack</strong> = Supply − Offtake. This{" "}
                {materialBalance.toFixed(2)} MMscf represents gas accumulating in the pipeline
                system (positive) or draining from it (negative). Computed automatically, cannot be
                mis-typed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
