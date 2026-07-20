"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { UserProfile, AuditLog, Permissions } from "@/lib/auth-types";
import { MOCK_USERS, createAuditLog, hasPermission, canAccessBU } from "@/lib/auth-types";
import type { Subsidiary } from "@/lib/types";

// ---------- Context Types ----------

interface AuthContextType {
  // User state
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (email: string) => Promise<void>;
  logout: () => void;
  switchBU: (bu: Subsidiary) => void;

  // Permissions helpers
  can: (permission: keyof Permissions) => boolean;
  canAccess: (bu: Subsidiary) => boolean;

  // Audit
  logAction: (
    action: AuditLog["action"],
    resource: string,
    resourceId?: string,
    details?: string
  ) => void;
  auditLogs: AuditLog[];

  // Active BU (for executives who can switch)
  activeBU: Subsidiary;
}

// ---------- Context Creation ----------

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ---------- Provider Component ----------

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [activeBU, setActiveBU] = useState<Subsidiary>("NGIC");

  // Initialize from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("nnpc-user");
    const storedBU = localStorage.getItem("nnpc-active-bu");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setActiveBU(storedBU ? (storedBU as Subsidiary) : parsedUser.businessUnit);
    }

    setIsLoading(false);
  }, []);

  // Login function (mock authentication)
  const login = async (email: string) => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Find user by email
    const foundUser = MOCK_USERS.find((u) => u.email === email);

    if (foundUser) {
      const userWithSession = {
        ...foundUser,
        lastLogin: new Date().toISOString(),
        sessionExpiry: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours
      };

      setUser(userWithSession);
      setActiveBU(userWithSession.businessUnit);
      localStorage.setItem("nnpc-user", JSON.stringify(userWithSession));
      localStorage.setItem("nnpc-active-bu", userWithSession.businessUnit);

      // Log login action
      const auditEntry = createAuditLog(
        userWithSession,
        "view",
        "authentication",
        undefined,
        "User logged in"
      );
      setAuditLogs((prev) => [auditEntry, ...prev]);
    } else {
      throw new Error("User not found");
    }

    setIsLoading(false);
  };

  // Logout function
  const logout = () => {
    if (user) {
      const auditEntry = createAuditLog(
        user,
        "view",
        "authentication",
        undefined,
        "User logged out"
      );
      setAuditLogs((prev) => [auditEntry, ...prev]);
    }

    setUser(null);
    setActiveBU("NGIC");
    localStorage.removeItem("nnpc-user");
    localStorage.removeItem("nnpc-active-bu");
  };

  // Switch BU (for executives only)
  const switchBU = (bu: Subsidiary) => {
    if (!user || !user.permissions.canSwitchBU) {
      console.warn("User does not have permission to switch BU");
      return;
    }

    setActiveBU(bu);
    localStorage.setItem("nnpc-active-bu", bu);

    const auditEntry = createAuditLog(
      user,
      "view",
      "bu-switch",
      bu,
      `Switched to ${bu}`
    );
    setAuditLogs((prev) => [auditEntry, ...prev]);
  };

  // Permission check helper
  const can = (permission: keyof Permissions): boolean => {
    if (!user) return false;
    return hasPermission(user, permission);
  };

  // BU access check helper
  const canAccess = (bu: Subsidiary): boolean => {
    if (!user) return false;
    return canAccessBU(user, bu);
  };

  // Log action helper
  const logAction = (
    action: AuditLog["action"],
    resource: string,
    resourceId?: string,
    details?: string
  ) => {
    if (!user) return;

    const auditEntry = createAuditLog(user, action, resource, resourceId, details);
    setAuditLogs((prev) => [auditEntry, ...prev]);

    // In production, send to backend
    console.log("Audit log:", auditEntry);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    switchBU,
    can,
    canAccess,
    logAction,
    auditLogs,
    activeBU,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ---------- Hook ----------

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// ---------- HOC for Protected Routes ----------

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredPermission?: keyof Permissions
) {
  return function AuthenticatedComponent(props: P) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-ink/70 mt-4">Loading...</p>
          </div>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-ink mb-2">Access Denied</h1>
            <p className="text-ink/70">Please log in to access this page.</p>
          </div>
        </div>
      );
    }

    if (requiredPermission && !hasPermission(user, requiredPermission)) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-ink mb-2">Insufficient Permissions</h1>
            <p className="text-ink/70">
              You do not have permission to access this resource.
            </p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
