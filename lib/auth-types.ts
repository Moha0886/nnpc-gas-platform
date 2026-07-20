// ============================================================================
// NNPC Gas Platform - Authentication & Authorization Types
// Business Unit Segregation, Role-Based Access Control (RBAC)
// ============================================================================

import type { Subsidiary, GasDistributionZone, Corridor } from "./types";

// ---------- User Roles ----------

export type UserRole =
  | "executive"      // Cross-BU access, all dashboards
  | "bu-admin"       // Full access within their BU
  | "manager"        // Approve records, view reports within BU
  | "operator"       // Create/edit records within BU
  | "viewer";        // Read-only access within BU

// ---------- Departments ----------

export type Department =
  | "Operations"
  | "Commercial"
  | "Engineering"
  | "Finance"
  | "QHSSE"
  | "IT"
  | "Management";

// ---------- Permissions ----------

export interface Permissions {
  // Cross-BU access
  canViewCrossBU: boolean;
  canSwitchBU: boolean;

  // Data operations
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canApprove: boolean;
  canReject: boolean;

  // Reports & exports
  canViewReports: boolean;
  canExportData: boolean;
  canScheduleReports: boolean;

  // Admin functions
  canManageUsers: boolean;
  canConfigureSystem: boolean;
  canViewAuditLogs: boolean;

  // Specific modules
  canAccessAllocation: boolean;
  canAccessContracts: boolean;
  canAccessPricing: boolean;
  canAccessIncidents: boolean;
}

// ---------- User Profile ----------

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;

  // Organizational structure
  businessUnit: Subsidiary;
  department: Department;
  role: UserRole;

  // Geographic/operational scope
  gdz?: GasDistributionZone;        // For NGML users
  corridors?: Corridor[];            // Accessible corridors

  // Permissions (derived from role + BU)
  permissions: Permissions;

  // Session info
  lastLogin?: string;
  sessionExpiry?: string;
}

// ---------- Permission Presets by Role ----------

export const ROLE_PERMISSIONS: Record<UserRole, Permissions> = {
  executive: {
    canViewCrossBU: true,
    canSwitchBU: true,
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canApprove: true,
    canReject: true,
    canViewReports: true,
    canExportData: true,
    canScheduleReports: true,
    canManageUsers: false,
    canConfigureSystem: false,
    canViewAuditLogs: true,
    canAccessAllocation: true,
    canAccessContracts: true,
    canAccessPricing: true,
    canAccessIncidents: true,
  },
  "bu-admin": {
    canViewCrossBU: false,
    canSwitchBU: false,
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canApprove: true,
    canReject: true,
    canViewReports: true,
    canExportData: true,
    canScheduleReports: true,
    canManageUsers: true,
    canConfigureSystem: true,
    canViewAuditLogs: true,
    canAccessAllocation: true,
    canAccessContracts: true,
    canAccessPricing: true,
    canAccessIncidents: true,
  },
  manager: {
    canViewCrossBU: false,
    canSwitchBU: false,
    canCreate: true,
    canEdit: true,
    canDelete: false,
    canApprove: true,
    canReject: true,
    canViewReports: true,
    canExportData: true,
    canScheduleReports: false,
    canManageUsers: false,
    canConfigureSystem: false,
    canViewAuditLogs: false,
    canAccessAllocation: true,
    canAccessContracts: true,
    canAccessPricing: false,
    canAccessIncidents: true,
  },
  operator: {
    canViewCrossBU: false,
    canSwitchBU: false,
    canCreate: true,
    canEdit: true,
    canDelete: false,
    canApprove: false,
    canReject: false,
    canViewReports: true,
    canExportData: false,
    canScheduleReports: false,
    canManageUsers: false,
    canConfigureSystem: false,
    canViewAuditLogs: false,
    canAccessAllocation: false,
    canAccessContracts: false,
    canAccessPricing: false,
    canAccessIncidents: true,
  },
  viewer: {
    canViewCrossBU: false,
    canSwitchBU: false,
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canApprove: false,
    canReject: false,
    canViewReports: true,
    canExportData: false,
    canScheduleReports: false,
    canManageUsers: false,
    canConfigureSystem: false,
    canViewAuditLogs: false,
    canAccessAllocation: false,
    canAccessContracts: false,
    canAccessPricing: false,
    canAccessIncidents: false,
  },
};

// ---------- Mock Users (for development) ----------

export const MOCK_USERS: UserProfile[] = [
  {
    id: "user-1",
    email: "executive@nnpc.com",
    name: "Chief Operations Officer",
    businessUnit: "NGIC",
    department: "Management",
    role: "executive",
    permissions: ROLE_PERMISSIONS.executive,
    avatar: "/avatars/executive.png",
  },
  {
    id: "user-2",
    email: "ngic.admin@nnpc.com",
    name: "NGIC Operations Manager",
    businessUnit: "NGIC",
    department: "Operations",
    role: "bu-admin",
    corridors: ["Western", "Eastern", "Northern", "Lagos"],
    permissions: ROLE_PERMISSIONS["bu-admin"],
    avatar: "/avatars/ngic-admin.png",
  },
  {
    id: "user-3",
    email: "ngml.admin@nnpc.com",
    name: "NGML Distribution Manager",
    businessUnit: "NGML",
    department: "Operations",
    role: "bu-admin",
    gdz: "REGIONAL GAS DISTRIBUTION LAGOS",
    permissions: ROLE_PERMISSIONS["bu-admin"],
    avatar: "/avatars/ngml-admin.png",
  },
  {
    id: "user-4",
    email: "ngic.operator@nnpc.com",
    name: "NGIC Field Operator",
    businessUnit: "NGIC",
    department: "Operations",
    role: "operator",
    corridors: ["Western"],
    permissions: ROLE_PERMISSIONS.operator,
    avatar: "/avatars/operator.png",
  },
  {
    id: "user-5",
    email: "ngml.operator@nnpc.com",
    name: "NGML Allocation Officer",
    businessUnit: "NGML",
    department: "Commercial",
    role: "operator",
    gdz: "REGIONAL GAS DISTRIBUTION LAGOS",
    permissions: ROLE_PERMISSIONS.operator,
    avatar: "/avatars/ngml-operator.png",
  },
  {
    id: "user-6",
    email: "commercial.manager@nnpc.com",
    name: "Commercial Manager",
    businessUnit: "NGML",
    department: "Commercial",
    role: "manager",
    permissions: ROLE_PERMISSIONS.manager,
    avatar: "/avatars/manager.png",
  },
  {
    id: "user-7",
    email: "viewer@nnpc.com",
    name: "Finance Analyst",
    businessUnit: "NGIC",
    department: "Finance",
    role: "viewer",
    permissions: ROLE_PERMISSIONS.viewer,
    avatar: "/avatars/viewer.png",
  },
];

// ---------- Audit Log ----------

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  businessUnit: Subsidiary;
  action: "create" | "update" | "delete" | "approve" | "reject" | "export" | "view";
  resource: string; // e.g., "production-record", "contract", "allocation"
  resourceId?: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
}

// ---------- Helper Functions ----------

/**
 * Get permissions for a given role
 */
export function getPermissionsForRole(role: UserRole): Permissions {
  return ROLE_PERMISSIONS[role];
}

/**
 * Check if user has specific permission
 */
export function hasPermission(
  user: UserProfile,
  permission: keyof Permissions
): boolean {
  return user.permissions[permission];
}

/**
 * Check if user can access a specific BU
 */
export function canAccessBU(user: UserProfile, bu: Subsidiary): boolean {
  if (user.permissions.canViewCrossBU) return true;
  return user.businessUnit === bu;
}

/**
 * Get display name for role
 */
export function getRoleDisplayName(role: UserRole): string {
  const roleNames: Record<UserRole, string> = {
    executive: "Executive",
    "bu-admin": "Business Unit Administrator",
    manager: "Manager",
    operator: "Operator",
    viewer: "Viewer",
  };
  return roleNames[role];
}

/**
 * Get display name for BU
 */
export function getBUDisplayName(bu: Subsidiary): string {
  const buNames: Record<Subsidiary, string> = {
    NGIC: "NGIC - Gas Infrastructure",
    NGML: "NGML - Gas Marketing",
    NGPIS: "NGPIS - Processing & Infrastructure Services",
  };
  return buNames[bu];
}

/**
 * Create audit log entry
 */
export function createAuditLog(
  user: UserProfile,
  action: AuditLog["action"],
  resource: string,
  resourceId?: string,
  details?: string
): AuditLog {
  return {
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    userId: user.id,
    userName: user.name,
    businessUnit: user.businessUnit,
    action,
    resource,
    resourceId,
    details,
  };
}
