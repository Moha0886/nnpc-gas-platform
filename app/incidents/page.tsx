"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Plus,
  Filter,
  MapPin,
  Calendar,
  DollarSign,
  Activity,
  Upload,
  Download,
} from "lucide-react";
import {
  incidents,
  getIncidentStats,
  type Incident,
  type IncidentStatus,
  type IncidentSeverity,
} from "@/lib/incident-data";
import UploadModal from "@/components/UploadModal";
import { useReportUpload } from "@/lib/use-report-upload";
import { REPORT_CONFIGS } from "@/lib/report-upload-configs";
import { formatDateForCSV } from "@/lib/csv-utils";

export default function IncidentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | "all">("all");
  const [severityFilter, setSeverityFilter] = useState<IncidentSeverity | "all">("all");
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  // Upload/Export functionality
  const config = REPORT_CONFIGS.incidents;
  const {
    data: incidentData,
    uploadModalOpen,
    setUploadModalOpen,
    handleUpload,
    handleExport,
  } = useReportUpload(incidents, config);

  const stats = getIncidentStats();

  // Filter incidents
  const filteredIncidents = incidentData.filter((incident) => {
    const matchesSearch =
      incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.facilityName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || incident.status === statusFilter;
    const matchesSeverity =
      severityFilter === "all" || incident.severity === severityFilter;
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  // Status badge styling
  const getStatusBadge = (status: IncidentStatus) => {
    const styles = {
      open: "bg-alert/20 text-alert",
      "under-investigation": "bg-flare/20 text-flare",
      resolved: "bg-accent/20 text-accent",
      closed: "bg-primary/20 text-primary",
    };
    return styles[status];
  };

  // Severity badge styling
  const getSeverityBadge = (severity: IncidentSeverity) => {
    const styles = {
      critical: "bg-alert text-white",
      high: "bg-flare text-white",
      medium: "bg-accent text-white",
      low: "bg-secondary text-white",
    };
    return styles[severity];
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-8 h-8 text-alert" />
            <h1 className="text-2xl font-bold text-ink">Incident Reporting</h1>
          </div>
          <p className="text-ink/60">
            Track and manage HSE incidents across gas infrastructure
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleExport(filteredIncidents, `incidents_${formatDateForCSV(new Date())}.csv`)}
            className="px-4 py-2 border border-line rounded-lg text-ink hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={() => setUploadModalOpen(true)}
            className="px-4 py-2 border border-line rounded-lg text-ink hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload CSV
          </button>
          <Link
            href="/records/incidents"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Report Incident
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-ink/60">Total Incidents</h3>
            <FileText className="w-5 h-5 text-secondary" />
          </div>
          <p className="text-3xl font-bold text-ink tabular-nums">{stats.total}</p>
          <div className="flex gap-2 mt-2 text-xs">
            <span className="text-alert">Critical: {stats.critical}</span>
            <span className="text-flare">High: {stats.high}</span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-ink/60">Open</h3>
            <XCircle className="w-5 h-5 text-alert" />
          </div>
          <p className="text-3xl font-bold text-alert tabular-nums">{stats.open}</p>
          <p className="text-xs text-ink/60 mt-2">Require immediate attention</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-ink/60">Under Investigation</h3>
            <Clock className="w-5 h-5 text-flare" />
          </div>
          <p className="text-3xl font-bold text-flare tabular-nums">
            {stats.underInvestigation}
          </p>
          <p className="text-xs text-ink/60 mt-2">In progress</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-ink/60">Resolved</h3>
            <CheckCircle className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-primary tabular-nums">
            {stats.resolved + stats.closed}
          </p>
          <p className="text-xs text-ink/60 mt-2">Closed successfully</p>
        </div>
      </div>

      {/* Deferment & Loss Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-alert/10 border border-alert/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-alert" />
            <h3 className="font-bold text-alert">Production Deferment</h3>
          </div>
          <p className="text-3xl font-bold text-alert tabular-nums">
            {stats.totalDeferment.toFixed(1)} <span className="text-base">MMscf/d</span>
          </p>
          <p className="text-sm text-ink/60 mt-1">From active incidents</p>
        </div>

        <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-secondary" />
            <h3 className="font-bold text-secondary">Estimated Loss</h3>
          </div>
          <p className="text-3xl font-bold text-secondary tabular-nums">
            ${(stats.totalLoss / 1000000).toFixed(2)}
            <span className="text-base">M</span>
          </p>
          <p className="text-sm text-ink/60 mt-1">
            Total: ${stats.totalLoss.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
              <input
                type="text"
                placeholder="Search incidents or facilities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="under-investigation">Under Investigation</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as any)}
              className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Severity</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary/5 border-b border-line">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-bold text-ink">
                Date
              </th>
              <th className="text-left px-4 py-3 text-sm font-bold text-ink">
                Title
              </th>
              <th className="text-left px-4 py-3 text-sm font-bold text-ink">
                Facility
              </th>
              <th className="text-left px-4 py-3 text-sm font-bold text-ink">
                Category
              </th>
              <th className="text-left px-4 py-3 text-sm font-bold text-ink">
                Severity
              </th>
              <th className="text-left px-4 py-3 text-sm font-bold text-ink">
                Status
              </th>
              <th className="text-right px-4 py-3 text-sm font-bold text-ink">
                Deferment
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filteredIncidents.map((incident) => (
              <tr
                key={incident.id}
                className="hover:bg-primary/5 cursor-pointer transition-colors"
                onClick={() => setSelectedIncident(incident)}
              >
                <td className="px-4 py-3 text-sm text-ink/70 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(incident.dateReported).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-ink">{incident.title}</p>
                  <p className="text-xs text-ink/60 mt-0.5">
                    {incident.description.substring(0, 80)}...
                  </p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-ink/40" />
                    <div>
                      <p className="text-sm text-ink/70">{incident.facilityName}</p>
                      <p className="text-xs text-ink/50">{incident.corridor}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-ink/70 capitalize">
                  {incident.category.replace("-", " ")}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex px-2 py-1 rounded text-xs font-medium capitalize ${getSeverityBadge(
                      incident.severity
                    )}`}
                  >
                    {incident.severity}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex px-2 py-1 rounded text-xs font-medium capitalize ${getStatusBadge(
                      incident.status
                    )}`}
                  >
                    {incident.status.replace("-", " ")}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-sm tabular-nums">
                  {incident.deferment > 0 ? (
                    <span className="text-alert font-medium">
                      {incident.deferment} MMscf/d
                    </span>
                  ) : (
                    <span className="text-ink/40">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredIncidents.length === 0 && (
          <div className="py-12 text-center text-ink/40">
            <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No incidents found matching your filters</p>
          </div>
        )}
      </div>

      {/* Incident Details Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-line p-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-ink">
                  {selectedIncident.title}
                </h2>
                <p className="text-sm text-ink/60 mt-1">
                  {selectedIncident.facilityName} • {selectedIncident.corridor}
                </p>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="text-ink/40 hover:text-ink"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status & Severity */}
              <div className="flex gap-4">
                <div>
                  <p className="text-xs text-ink/60 mb-1">Severity</p>
                  <span
                    className={`inline-flex px-3 py-1 rounded text-sm font-medium capitalize ${getSeverityBadge(
                      selectedIncident.severity
                    )}`}
                  >
                    {selectedIncident.severity}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-ink/60 mb-1">Status</p>
                  <span
                    className={`inline-flex px-3 py-1 rounded text-sm font-medium capitalize ${getStatusBadge(
                      selectedIncident.status
                    )}`}
                  >
                    {selectedIncident.status.replace("-", " ")}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-ink/60 mb-1">Category</p>
                  <span className="inline-flex px-3 py-1 rounded text-sm font-medium bg-secondary/10 text-secondary capitalize">
                    {selectedIncident.category.replace("-", " ")}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-bold text-ink mb-2">Description</h3>
                <p className="text-ink/70">{selectedIncident.description}</p>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-ink/60 mb-1">Date Occurred</p>
                  <p className="text-sm text-ink font-medium">
                    {new Date(selectedIncident.dateOccurred).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-ink/60 mb-1">Date Reported</p>
                  <p className="text-sm text-ink font-medium">
                    {new Date(selectedIncident.dateReported).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Impact */}
              {selectedIncident.deferment > 0 && (
                <div className="bg-alert/10 border border-alert/20 rounded-lg p-4">
                  <h3 className="font-bold text-alert mb-2">Production Impact</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-ink/60 mb-1">Deferment</p>
                      <p className="text-2xl font-bold text-alert tabular-nums">
                        {selectedIncident.deferment} MMscf/d
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-ink/60 mb-1">Estimated Loss</p>
                      <p className="text-2xl font-bold text-alert tabular-nums">
                        ${selectedIncident.estimatedLoss.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* HSE Impact */}
              {selectedIncident.hseImpact && (
                <div>
                  <h3 className="font-bold text-ink mb-2">HSE Impact</h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-ink/60">Injuries</p>
                      <p className="font-medium">{selectedIncident.hseImpact.injuries}</p>
                    </div>
                    <div>
                      <p className="text-ink/60">Fatalities</p>
                      <p className="font-medium">
                        {selectedIncident.hseImpact.fatalities}
                      </p>
                    </div>
                    <div>
                      <p className="text-ink/60">Environmental Damage</p>
                      <p className="font-medium">
                        {selectedIncident.hseImpact.environmentalDamage ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Root Cause */}
              {selectedIncident.rootCause && (
                <div>
                  <h3 className="font-bold text-ink mb-2">Root Cause</h3>
                  <p className="text-ink/70">{selectedIncident.rootCause}</p>
                </div>
              )}

              {/* Corrective Actions */}
              {selectedIncident.correctiveActions &&
                selectedIncident.correctiveActions.length > 0 && (
                  <div>
                    <h3 className="font-bold text-ink mb-2">Corrective Actions</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedIncident.correctiveActions.map((action, idx) => (
                        <li key={idx} className="text-ink/70">
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Remarks */}
              {selectedIncident.remarks.length > 0 && (
                <div>
                  <h3 className="font-bold text-ink mb-2">Remarks</h3>
                  <div className="space-y-2">
                    {selectedIncident.remarks.map((remark, idx) => (
                      <div
                        key={idx}
                        className="bg-secondary/5 border-l-4 border-secondary p-3 text-sm text-ink/70"
                      >
                        {remark}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Assignment */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-ink/60 mb-1">Reported By</p>
                  <p className="font-medium text-ink">{selectedIncident.reportedBy}</p>
                </div>
                {selectedIncident.assignedTo && (
                  <div>
                    <p className="text-ink/60 mb-1">Assigned To</p>
                    <p className="font-medium text-ink">
                      {selectedIncident.assignedTo}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        templateType={config.templateType}
        title="Upload Incident Data"
        existingData={incidentData}
        identifierFields={config.identifierFields}
        requiredFields={config.requiredFields}
        onUploadSuccess={handleUpload}
      />
    </div>
  );
}
