"use client";

import { MORSupplyReport } from "@/lib/nnpc-types";
import { MOR_SUPPLY_COLUMNS, REPORT_HEADERS, LABEL } from "@/lib/nomenclature";

interface WeeklyMORSupplyReportProps {
  report: MORSupplyReport;
  onExportExcel?: () => void;
  onExportPDF?: () => void;
}

export function WeeklyMORSupplyReportComponent({
  report,
  onExportExcel,
  onExportPDF
}: WeeklyMORSupplyReportProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-lg font-semibold text-ink">
          {REPORT_HEADERS.morSupply.title(report.weekOf)}
        </h1>
        <p className="text-sm text-ink/60">{report.network}</p>
      </div>

      {/* Export Buttons */}
      <div className="flex gap-3 justify-end">
        {onExportExcel && (
          <button
            onClick={onExportExcel}
            className="px-4 py-2 text-sm font-medium text-pine bg-pine/10 hover:bg-pine/20 rounded-md transition-colors"
          >
            Export to Excel
          </button>
        )}
        {onExportPDF && (
          <button
            onClick={onExportPDF}
            className="px-4 py-2 text-sm font-medium text-pine bg-pine/10 hover:bg-pine/20 rounded-md transition-colors"
          >
            Export to PDF
          </button>
        )}
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Gas Supply Situation */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-ink uppercase">{LABEL.gasSupplySituation}</h2>
          <div className="border border-line rounded-lg overflow-hidden bg-white">
            <table className="w-full text-sm">
              <thead className="bg-pine/5 border-b border-line">
                <tr>
                  <th className="px-3 py-2 text-center font-semibold text-ink w-12">
                    {MOR_SUPPLY_COLUMNS.sn}
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-ink">
                    {MOR_SUPPLY_COLUMNS.gasProducers}
                  </th>
                  <th className="px-4 py-2 text-right font-semibold text-ink">
                    {MOR_SUPPLY_COLUMNS.volume}
                  </th>
                </tr>
              </thead>
              <tbody>
                {report.gasSupply.producers.map((producer) => (
                  <tr
                    key={producer.sn}
                    className="border-t border-line/30 hover:bg-pine/5 transition-colors"
                  >
                    <td className="px-3 py-2 text-center font-mono text-ink/70 text-xs">
                      {producer.sn}
                    </td>
                    <td className="px-4 py-2 text-ink">{producer.name}</td>
                    <td className="px-4 py-2 text-right font-mono text-ink">
                      {producer.volume.toFixed(2)}
                    </td>
                  </tr>
                ))}

                {/* Total */}
                <tr className="bg-pine/10 border-t-2 border-pine font-semibold">
                  <td className="px-3 py-2"></td>
                  <td className="px-4 py-2 text-ink">Total</td>
                  <td className="px-4 py-2 text-right font-mono text-ink">
                    {report.gasSupply.total.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Allocation & Offtake Situation */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-ink uppercase">
            {LABEL.allocationAndOfftakeSituation}
          </h2>
          <div className="border border-line rounded-lg overflow-hidden bg-white">
            <table className="w-full text-sm">
              <thead className="bg-pine/5 border-b border-line">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-ink">
                    {MOR_SUPPLY_COLUMNS.offtakers}
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-ink text-xs">
                    {MOR_SUPPLY_COLUMNS.sourceOfAllocation}
                  </th>
                  <th className="px-4 py-2 text-right font-semibold text-ink">
                    {MOR_SUPPLY_COLUMNS.allocation}
                  </th>
                  <th className="px-4 py-2 text-right font-semibold text-ink">
                    {MOR_SUPPLY_COLUMNS.actualOfftake}
                  </th>
                </tr>
              </thead>
              <tbody>
                {report.allocationAndOfftake.offtakers.map((offtaker) => (
                  <tr
                    key={offtaker.sn}
                    className="border-t border-line/30 hover:bg-pine/5 transition-colors"
                  >
                    <td className="px-4 py-2 text-ink">{offtaker.name}</td>
                    <td className="px-3 py-2 text-ink/70 text-xs">{offtaker.sourceOfAllocation}</td>
                    <td className="px-4 py-2 text-right font-mono text-ink">
                      {offtaker.allocation.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-right font-mono text-ink">
                      {offtaker.actualOfftake.toFixed(2)}
                    </td>
                  </tr>
                ))}

                {/* Total */}
                <tr className="bg-pine/5 border-t border-line font-semibold">
                  <td colSpan={2} className="px-4 py-2 text-ink">Total</td>
                  <td className="px-4 py-2 text-right font-mono text-ink">
                    {report.allocationAndOfftake.total.allocation.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-right font-mono text-ink">
                    {report.allocationAndOfftake.total.actualOfftake.toFixed(2)}
                  </td>
                </tr>

                {/* Material Balance / Line Pack */}
                <tr className="bg-pine/10 border-t-2 border-pine font-semibold">
                  <td colSpan={2} className="px-4 py-2 text-ink">{LABEL.materialBalance}</td>
                  <td colSpan={2} className="px-4 py-2 text-right font-mono text-ink">
                    {report.allocationAndOfftake.materialBalance.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Remarks */}
      {report.remarks && (
        <div className="space-y-2">
          <h3 className="text-base font-semibold text-ink uppercase">{MOR_SUPPLY_COLUMNS.remarks}</h3>
          <div className="border border-line rounded-lg p-4 bg-white">
            <p className="text-sm text-ink/80 whitespace-pre-wrap">{report.remarks}</p>
          </div>
        </div>
      )}
    </div>
  );
}
