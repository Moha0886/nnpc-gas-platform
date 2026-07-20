"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, Download, Search, Filter, Calendar } from "lucide-react";
import type { AuditLog } from "@/lib/auth-types";

export default function AuditLogsPage() {
  const { user, auditLogs } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAction, setFilterAction] = useState<AuditLog["action"] | "all">("all");
  const [filterBU, setFilterBU] = useState<string>("all");

  // Permission check
  if (!user || !user.permissions.canViewAuditLogs) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-ink/30 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-ink mb-2">Access Denied</h1>
          <p className="text-ink/70">
            You do not have permission to view audit logs.
          </p>
        </div>
      </div>
    );
  }

  // Filter logs
  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      searchQuery === "" ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAction = filterAction === "all" || log.action === filterAction;
    const matchesBU = filterBU === "all" || log.businessUnit === filterBU;

    return matchesSearch && matchesAction && matchesBU;
  });

  // Get unique BUs from logs
  const businessUnits = Array.from(new Set(auditLogs.map((log) => log.businessUnit)));

  const exportToCSV = () => {
    const csv = [
      ["Timestamp", "User", "Business Unit", "Action", "Resource", "Details"].join(","),
      ...filteredLogs.map((log) =>
        [
          log.timestamp,
          log.userName,
          log.businessUnit,
          log.action,
          log.resource,
          log.details || "",
        ]
          .map((field) => `"${field}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const getActionColor = (action: AuditLog["action"]) => {
    switch (action) {
      case "create":
        return "bg-success/10 text-success";
      case "update":
        return "bg-gasblue/10 text-gasblue";
      case "delete":
        return "bg-alert/10 text-alert";
      case "approve":
        return "bg-success/10 text-success";
      case "reject":
        return "bg-alert/10 text-alert";
      case "export":
        return "bg-pine/10 text-pine";
      case "view":
        return "bg-ink/10 text-ink";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-line px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ink">Audit Logs</h1>
            <p className="text-ink/70 mt-1">System activity and user actions</p>
          </div>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        {/* Filters */}
        <div className="bg-white rounded-lg border border-line p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-ink/70 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
                <input
                  type="text"
                  placeholder="Search user, resource, or details..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Action Filter */}
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-2">
                Action
              </label>
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value as AuditLog["action"] | "all")}
                className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Actions</option>
                <option value="create">Create</option>
                <option value="update">Update</option>
                <option value="delete">Delete</option>
                <option value="approve">Approve</option>
                <option value="reject">Reject</option>
                <option value="export">Export</option>
                <option value="view">View</option>
              </select>
            </div>

            {/* BU Filter */}
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-2">
                Business Unit
              </label>
              <select
                value={filterBU}
                onChange={(e) => setFilterBU(e.target.value)}
                className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All BUs</option>
                {businessUnits.map((bu) => (
                  <option key={bu} value={bu}>
                    {bu}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-ink/60">
              Showing {filteredLogs.length} of {auditLogs.length} logs
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setFilterAction("all");
                setFilterBU("all");
              }}
              className="text-sm text-primary hover:underline"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-lg border border-line overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-line">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-ink uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-ink uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-ink uppercase tracking-wider">
                    BU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-ink uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-ink uppercase tracking-wider">
                    Resource
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-ink uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-ink/60">
                      No audit logs found
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-ink whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-ink">
                        {log.userName}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-pine/10 text-pine rounded">
                          {log.businessUnit}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getActionColor(log.action)}`}>
                          {log.action.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-ink font-mono">
                        {log.resource}
                        {log.resourceId && <span className="text-ink/60"> #{log.resourceId}</span>}
                      </td>
                      <td className="px-6 py-4 text-sm text-ink/70">
                        {log.details || "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
