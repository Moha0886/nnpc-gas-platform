"use client";

import { MORVolumePressureReport } from "@/lib/nnpc-types";
import { MOR_VOLUME_PRESSURE_COLUMNS, REPORT_HEADERS } from "@/lib/nomenclature";

interface WeeklyMORVolumePressureReportProps {
  report: MORVolumePressureReport;
  onExportExcel?: () => void;
  onExportPDF?: () => void;
}

export function WeeklyMORVolumePressureReportComponent({
  report,
  onExportExcel,
  onExportPDF,
}: WeeklyMORVolumePressureReportProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-lg font-semibold text-ink">
          {REPORT_HEADERS.morVolumePressure.title(report.network)}
        </h1>
        <p className="text-sm text-ink/60">Week of {report.weekOf}</p>
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

      {/* Report Table */}
      <div className="border border-line rounded-lg overflow-hidden bg-white">
        <table className="w-full text-sm">
          <thead className="bg-pine/5 border-b border-line">
            <tr>
              <th rowSpan={2} className="px-3 py-3 text-center font-semibold text-ink border-r border-line w-12">
                {MOR_VOLUME_PRESSURE_COLUMNS.sn}
              </th>
              <th rowSpan={2} className="px-4 py-3 text-left font-semibold text-ink border-r border-line">
                {MOR_VOLUME_PRESSURE_COLUMNS.gasProducers}
              </th>

              {/* Current Week */}
              <th colSpan={2} className="px-4 py-2 text-center font-semibold text-ink border-r border-line bg-gasblue/5">
                Current Week
              </th>

              {/* Prior Week */}
              <th colSpan={2} className="px-4 py-2 text-center font-semibold text-ink border-r border-line bg-pine/5">
                Prior Week
              </th>

              {/* Week-on-Week Variance */}
              <th colSpan={2} className="px-4 py-2 text-center font-semibold text-ink border-r border-line bg-flare/5">
                Week-on-Week Variance
              </th>

              <th rowSpan={2} className="px-4 py-3 text-center font-semibold text-ink border-r border-line w-32">
                {MOR_VOLUME_PRESSURE_COLUMNS.contractualPressureRange}
              </th>
              <th rowSpan={2} className="px-4 py-3 text-left font-semibold text-ink">
                {MOR_VOLUME_PRESSURE_COLUMNS.issuesRemarks}
              </th>
            </tr>
            <tr className="border-t border-line/50">
              {/* Current Week Sub-headers */}
              <th className="px-3 py-2 text-center font-medium text-ink text-xs bg-gasblue/5">
                Volume<br />(mmscf/d)
              </th>
              <th className="px-3 py-2 text-center font-medium text-ink text-xs border-r border-line bg-gasblue/5">
                Pressure<br />(barg)
              </th>

              {/* Prior Week Sub-headers */}
              <th className="px-3 py-2 text-center font-medium text-ink text-xs bg-pine/5">
                Volume<br />(mmscf/d)
              </th>
              <th className="px-3 py-2 text-center font-medium text-ink text-xs border-r border-line bg-pine/5">
                Pressure<br />(barg)
              </th>

              {/* Variance Sub-headers */}
              <th className="px-3 py-2 text-center font-medium text-ink text-xs bg-flare/5">
                Volume<br />(mmscf/d)
              </th>
              <th className="px-3 py-2 text-center font-medium text-ink text-xs border-r border-line bg-flare/5">
                Pressure<br />(barg)
              </th>
            </tr>
          </thead>
          <tbody>
            {report.producers.map((producer) => {
              const pressureBreach = producer.pressureBreach || false;

              return (
                <tr
                  key={producer.sn}
                  className={`border-t border-line/30 hover:bg-pine/5 transition-colors ${
                    pressureBreach ? "bg-alert/5" : ""
                  }`}
                >
                  <td className="px-3 py-3 text-center font-mono text-ink/70 text-xs border-r border-line">
                    {producer.sn}
                  </td>
                  <td className="px-4 py-3 text-ink border-r border-line">
                    {producer.name}
                    {pressureBreach && (
                      <span className="ml-2 text-xs text-alert font-medium">⚠ BREACH</span>
                    )}
                  </td>

                  {/* Current Week */}
                  <td className="px-3 py-3 text-center font-mono text-ink">
                    {producer.currentWeek.avgVolume.toFixed(2)}
                  </td>
                  <td className={`px-3 py-3 text-center font-mono border-r border-line ${
                    pressureBreach ? "text-alert font-semibold" : "text-ink"
                  }`}>
                    {producer.currentWeek.pressure.toFixed(2)}
                  </td>

                  {/* Prior Week */}
                  <td className="px-3 py-3 text-center font-mono text-ink">
                    {producer.priorWeek.avgVolume.toFixed(2)}
                  </td>
                  <td className="px-3 py-3 text-center font-mono text-ink border-r border-line">
                    {producer.priorWeek.pressure.toFixed(2)}
                  </td>

                  {/* Variance */}
                  <td className={`px-3 py-3 text-center font-mono ${
                    producer.variance.volume >= 0 ? "text-success" : "text-alert"
                  }`}>
                    {producer.variance.volume >= 0 ? "+" : ""}
                    {producer.variance.volume.toFixed(2)}
                  </td>
                  <td className={`px-3 py-3 text-center font-mono border-r border-line ${
                    producer.variance.pressure >= 0 ? "text-success" : "text-alert"
                  }`}>
                    {producer.variance.pressure >= 0 ? "+" : ""}
                    {producer.variance.pressure.toFixed(2)}
                  </td>

                  <td className="px-4 py-3 text-center font-mono text-ink text-xs border-r border-line">
                    {producer.contractualPressureRange}
                  </td>
                  <td className="px-4 py-3 text-sm text-ink/70">
                    {producer.issuesRemarks || "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex gap-6 text-xs text-ink/60">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gasblue/20 border border-gasblue/40 rounded"></div>
          <span>Current Week</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-pine/20 border border-pine/40 rounded"></div>
          <span>Prior Week</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-flare/20 border border-flare/40 rounded"></div>
          <span>Variance</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-alert/20 border border-alert rounded"></div>
          <span>Pressure Breach</span>
        </div>
      </div>
    </div>
  );
}
