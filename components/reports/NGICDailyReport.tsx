"use client";

import { NGICDailyReport, NGICRegion, NGICCustomerType, NGICStation } from "@/lib/nnpc-types";
import { NGIC_COLUMNS, REPORT_HEADERS, deriveStationStatus } from "@/lib/nomenclature";

interface NGICDailyReportProps {
  report: NGICDailyReport;
  onExportExcel?: () => void;
  onExportPDF?: () => void;
}

export function NGICDailyReportComponent({ report, onExportExcel, onExportPDF }: NGICDailyReportProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-xl font-semibold text-ink">{REPORT_HEADERS.ngicDaily.line1}</h1>
        <p className="text-sm text-ink/70">{REPORT_HEADERS.ngicDaily.line2}</p>
        <h2 className="text-lg font-medium text-ink">
          {REPORT_HEADERS.ngicDaily.line3(report.month, report.year)}
        </h2>
        <p className="text-sm text-ink/60">Date: {report.date}</p>
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
              <th className="px-4 py-3 text-left font-semibold text-ink">{NGIC_COLUMNS.region}</th>
              <th className="px-4 py-3 text-left font-semibold text-ink">{NGIC_COLUMNS.customerType}</th>
              <th className="px-4 py-3 text-left font-semibold text-ink">{NGIC_COLUMNS.stations}</th>
              <th className="px-4 py-3 text-right font-semibold text-ink">{NGIC_COLUMNS.allocation}</th>
              <th className="px-4 py-3 text-right font-semibold text-ink">{NGIC_COLUMNS.offtake}</th>
              <th className="px-4 py-3 text-right font-semibold text-ink">{NGIC_COLUMNS.pressure}</th>
              <th className="px-4 py-3 text-left font-semibold text-ink">{NGIC_COLUMNS.remarks}</th>
              <th className="px-4 py-3 text-right font-semibold text-ink">{NGIC_COLUMNS.megawatts}</th>
            </tr>
          </thead>
          <tbody>
            {report.regions.map((region, regionIdx) => (
              <RegionSection key={regionIdx} region={region} />
            ))}

            {/* Grand Total */}
            <tr className="bg-pine/10 border-t-2 border-pine font-semibold">
              <td colSpan={3} className="px-4 py-3 text-ink">
                GRAND TOTAL
              </td>
              <td className="px-4 py-3 text-right font-mono text-ink">
                {report.grandTotal.allocation.toFixed(2)}
              </td>
              <td className="px-4 py-3 text-right font-mono text-ink">
                {report.grandTotal.offtake.toFixed(2)}
              </td>
              <td className="px-4 py-3"></td>
              <td className="px-4 py-3"></td>
              <td className="px-4 py-3 text-right font-mono text-ink">
                {report.grandTotal.megawatts?.toFixed(0) || "-"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RegionSection({ region }: { region: NGICRegion }) {
  return (
    <>
      {region.customerTypes.map((customerType, ctIdx) => (
        <CustomerTypeSection
          key={ctIdx}
          customerType={customerType}
          regionName={region.region}
          showRegionName={ctIdx === 0}
        />
      ))}

      {/* Region Total */}
      <tr className="bg-pine/5 border-t border-line font-semibold">
        <td className="px-4 py-3 text-ink">{region.region}</td>
        <td colSpan={2} className="px-4 py-3 text-ink">
          Total
        </td>
        <td className="px-4 py-3 text-right font-mono text-ink">
          {region.total.allocation.toFixed(2)}
        </td>
        <td className="px-4 py-3 text-right font-mono text-ink">
          {region.total.offtake.toFixed(2)}
        </td>
        <td className="px-4 py-3"></td>
        <td className="px-4 py-3"></td>
        <td className="px-4 py-3 text-right font-mono text-ink">
          {region.total.megawatts?.toFixed(0) || "-"}
        </td>
      </tr>
    </>
  );
}

function CustomerTypeSection({
  customerType,
  regionName,
  showRegionName,
}: {
  customerType: NGICCustomerType;
  regionName: string;
  showRegionName: boolean;
}) {
  return (
    <>
      {customerType.stations.map((station, stIdx) => (
        <StationRow
          key={station.id}
          station={station}
          regionName={regionName}
          customerTypeName={customerType.customerType}
          showRegion={showRegionName && stIdx === 0}
          showCustomerType={stIdx === 0}
        />
      ))}

      {/* Customer Type Sub-Total */}
      <tr className="bg-gray-50 border-t border-line/50">
        <td className="px-4 py-3"></td>
        <td colSpan={2} className="px-4 py-3 text-ink/70 italic">
          Sub-Total
        </td>
        <td className="px-4 py-3 text-right font-mono text-ink/70">
          {customerType.subTotal.allocation.toFixed(2)}
        </td>
        <td className="px-4 py-3 text-right font-mono text-ink/70">
          {customerType.subTotal.offtake.toFixed(2)}
        </td>
        <td className="px-4 py-3"></td>
        <td className="px-4 py-3"></td>
        <td className="px-4 py-3 text-right font-mono text-ink/70">
          {customerType.subTotal.megawatts?.toFixed(0) || "-"}
        </td>
      </tr>
    </>
  );
}

function StationRow({
  station,
  regionName,
  customerTypeName,
  showRegion,
  showCustomerType,
}: {
  station: NGICStation;
  regionName: string;
  customerTypeName: string;
  showRegion: boolean;
  showCustomerType: boolean;
}) {
  const status = station.status || deriveStationStatus(station.offtake, station.pressure);

  // Color code based on status
  const statusColor =
    status === "STATION ON STREAM"
      ? "text-pine"
      : status === "STATION ON STANDBY"
        ? "text-flare"
        : "text-alert";

  return (
    <tr className="border-t border-line/30 hover:bg-pine/5 transition-colors">
      <td className="px-4 py-3 text-ink/80">{showRegion ? regionName : ""}</td>
      <td className="px-4 py-3 text-ink/80">{showCustomerType ? customerTypeName : ""}</td>
      <td className="px-4 py-3 text-ink">{station.name}</td>
      <td className="px-4 py-3 text-right font-mono text-ink">
        {station.allocation.toFixed(2)}
      </td>
      <td className="px-4 py-3 text-right font-mono text-ink">
        {station.offtake.toFixed(2)}
      </td>
      <td className="px-4 py-3 text-right font-mono text-ink">
        {station.pressure.toFixed(1)}
      </td>
      <td className={`px-4 py-3 text-sm ${statusColor}`}>
        {station.remarks || status}
      </td>
      <td className="px-4 py-3 text-right font-mono text-ink">
        {station.megawatts?.toFixed(0) || "-"}
      </td>
    </tr>
  );
}
