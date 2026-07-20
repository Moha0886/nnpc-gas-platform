"use client";

import { NGMLDailyReport } from "@/lib/nnpc-types";
import { NGML_COLUMNS, REPORT_HEADERS, GDZ } from "@/lib/nomenclature";

interface NGMLDailyReportProps {
  report: NGMLDailyReport;
  onExportExcel?: () => void;
  onExportPDF?: () => void;
}

export function NGMLDailyReportComponent({ report, onExportExcel, onExportPDF }: NGMLDailyReportProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-xl font-semibold text-ink">{REPORT_HEADERS.ngmlDaily.line1}</h1>
        <h2 className="text-lg font-medium text-ink">{REPORT_HEADERS.ngmlDaily.line2}</h2>
        <p className="text-sm text-ink/70">
          {REPORT_HEADERS.ngmlDaily.line3(report.date, report.ngmlTotalAllocation)}
        </p>
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

      {/* Summary Section */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-ink">Summary</h3>
        <div className="border border-line rounded-lg overflow-hidden bg-white">
          <table className="w-full text-sm">
            <thead className="bg-pine/5 border-b border-line">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-ink">Gas Distribution Zone</th>
                <th className="px-4 py-3 text-right font-semibold text-ink">{NGML_COLUMNS.designCapacity}</th>
                <th className="px-4 py-3 text-right font-semibold text-ink">{NGML_COLUMNS.nominations}</th>
                <th className="px-4 py-3 text-right font-semibold text-ink">{NGML_COLUMNS.allocationWeekdays}</th>
                <th className="px-4 py-3 text-right font-semibold text-ink">{NGML_COLUMNS.offtake}</th>
              </tr>
            </thead>
            <tbody>
              {report.summary.zones.map((zone, idx) => (
                <tr key={idx} className="border-t border-line/30 hover:bg-pine/5 transition-colors">
                  <td className="px-4 py-3 text-ink">{zone.zone}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink">{zone.designCapacity.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink">{zone.nominations.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink">{zone.allocation.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink">{zone.offtake.toFixed(2)}</td>
                </tr>
              ))}

              {/* SUB -TOTAL 1 */}
              <tr className="bg-pine/5 border-t border-line font-semibold">
                <td className="px-4 py-3 text-ink">{report.summary.subTotal1.label}</td>
                <td className="px-4 py-3 text-right font-mono text-ink">
                  {report.summary.subTotal1.designCapacity.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-ink">
                  {report.summary.subTotal1.nominations.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-ink">
                  {report.summary.subTotal1.allocation.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-ink">
                  {report.summary.subTotal1.offtake.toFixed(2)}
                </td>
              </tr>

              {/* SECONDARY TARIFF CUSTOMERS */}
              <tr className="border-t border-line/30">
                <td className="px-4 py-3 text-ink">{report.summary.secondaryTariff.label}</td>
                <td className="px-4 py-3 text-right font-mono text-ink">
                  {report.summary.secondaryTariff.designCapacity.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-ink">
                  {report.summary.secondaryTariff.nominations.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-ink">
                  {report.summary.secondaryTariff.allocation.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-ink">
                  {report.summary.secondaryTariff.offtake.toFixed(2)}
                </td>
              </tr>

              {/* Total Supply to AGOT GDZ */}
              <tr className="border-t border-line/30">
                <td className="px-4 py-3 text-ink">{report.summary.totalSupplyToAGOT.label}</td>
                <td className="px-4 py-3 text-right font-mono text-ink">
                  {report.summary.totalSupplyToAGOT.designCapacity.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-ink">
                  {report.summary.totalSupplyToAGOT.nominations.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-ink">
                  {report.summary.totalSupplyToAGOT.allocation.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-ink">
                  {report.summary.totalSupplyToAGOT.offtake.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Section */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-ink">Station Detail</h3>
        <div className="border border-line rounded-lg overflow-hidden bg-white">
          <table className="w-full text-sm">
            <thead className="bg-pine/5 border-b border-line">
              <tr>
                <th className="px-3 py-3 text-center font-semibold text-ink w-12">{NGML_COLUMNS.sn}</th>
                <th className="px-3 py-3 text-center font-semibold text-ink w-12">{NGML_COLUMNS.sn}</th>
                <th className="px-4 py-3 text-left font-semibold text-ink">{NGML_COLUMNS.offtakersName}</th>
                <th className="px-4 py-3 text-right font-semibold text-ink w-28">{NGML_COLUMNS.designCapacity}</th>
                <th className="px-4 py-3 text-right font-semibold text-ink w-28">{NGML_COLUMNS.nominations}</th>
                <th className="px-4 py-3 text-right font-semibold text-ink w-32">{NGML_COLUMNS.allocationWeekdays}</th>
                <th className="px-4 py-3 text-right font-semibold text-ink w-28">{NGML_COLUMNS.offtake}</th>
                <th className="px-3 py-3 text-center font-semibold text-ink w-20">Inlet</th>
                <th className="px-3 py-3 text-center font-semibold text-ink w-20">Outlet</th>
                <th className="px-4 py-3 text-left font-semibold text-ink">{NGML_COLUMNS.remarks}</th>
              </tr>
            </thead>
            <tbody>
              {report.detail.zones.map((zone, zoneIdx) => (
                <ZoneDetailSection key={zoneIdx} zone={zone} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ZoneDetailSection({ zone }: { zone: any }) {
  return (
    <>
      {/* Zone Header */}
      <tr className="bg-pine/10 border-t-2 border-pine">
        <td colSpan={10} className="px-4 py-3 font-semibold text-ink">
          {zone.zone}
        </td>
      </tr>

      {/* Franchises/Stations */}
      {zone.franchises.map((franchise: any, franchiseIdx: number) => (
        <FranchiseSection key={franchiseIdx} franchise={franchise} />
      ))}

      {/* Zone Remarks (if any) */}
      {zone.zoneRemarks && (
        <tr className="bg-gray-50 border-t border-line">
          <td colSpan={10} className="px-4 py-2 text-sm italic text-ink/70">
            {zone.zoneRemarks}
          </td>
        </tr>
      )}
    </>
  );
}

function FranchiseSection({ franchise }: { franchise: any }) {
  return (
    <>
      {franchise.franchise && (
        <tr className="bg-pine/5 border-t border-line">
          <td colSpan={10} className="px-4 py-2 text-sm font-medium text-ink/80">
            {franchise.franchise}
          </td>
        </tr>
      )}

      {franchise.stations.map((station: any) => (
        <tr key={station.id} className="border-t border-line/30 hover:bg-pine/5 transition-colors">
          <td className="px-3 py-3 text-center font-mono text-ink/70 text-xs">{station.sn}</td>
          <td className="px-3 py-3 text-center font-mono text-ink/70 text-xs">{station.snZone}</td>
          <td className="px-4 py-3 text-ink">{station.name}</td>
          <td className="px-4 py-3 text-right font-mono text-ink">{station.designCapacity.toFixed(2)}</td>
          <td className="px-4 py-3 text-right font-mono text-ink">{station.nominations.toFixed(2)}</td>
          <td className="px-4 py-3 text-right font-mono text-ink">{station.allocation.toFixed(2)}</td>
          <td className="px-4 py-3 text-right font-mono text-ink">{station.offtake.toFixed(2)}</td>
          <td className="px-3 py-3 text-center font-mono text-ink text-xs">{station.pressureInlet.toFixed(1)}</td>
          <td className="px-3 py-3 text-center font-mono text-ink text-xs">{station.pressureOutlet.toFixed(1)}</td>
          <td className="px-4 py-3 text-sm text-ink/70">{station.remarks}</td>
        </tr>
      ))}
    </>
  );
}
