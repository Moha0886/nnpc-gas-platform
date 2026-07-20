"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getBUDisplayName, getRoleDisplayName } from "@/lib/auth-types";
import { LogOut, ChevronDown, Building2, Shield, Check } from "lucide-react";
import type { Subsidiary } from "@/lib/types";

export default function UserMenu() {
  const { user, logout, activeBU, switchBU } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showBUSwitch, setShowBUSwitch] = useState(false);

  if (!user) return null;

  const canSwitchBU = user.permissions.canSwitchBU;
  const businessUnits: Subsidiary[] = ["NGIC", "NGML", "NGPIS"];

  return (
    <div className="relative">
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 rounded-lg hover:bg-pine/5 transition-colors border border-line flex items-center gap-3 group"
      >
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pine to-gasblue flex items-center justify-center text-white font-bold">
            {user.name.charAt(0)}
          </div>
        </div>
        <div className="flex-1 text-left overflow-hidden">
          <p className="font-semibold text-ink text-sm truncate">{user.name}</p>
          <p className="text-xs text-ink/60 truncate">{getRoleDisplayName(user.role)}</p>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-ink/60 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setIsOpen(false);
              setShowBUSwitch(false);
            }}
          />

          {/* Menu */}
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-line rounded-lg shadow-2xl z-50 overflow-hidden">
            {/* User Info */}
            <div className="p-4 border-b border-line bg-gray-50">
              <p className="font-semibold text-ink">{user.name}</p>
              <p className="text-xs text-ink/60 mt-1">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 text-xs bg-pine/10 text-pine px-2 py-1 rounded">
                  <Building2 className="w-3 h-3" />
                  {user.businessUnit}
                </div>
                <div className="flex items-center gap-1 text-xs bg-gasblue/10 text-gasblue px-2 py-1 rounded">
                  <Shield className="w-3 h-3" />
                  {user.role}
                </div>
              </div>
              {user.department && (
                <p className="text-xs text-ink/60 mt-1">Department: {user.department}</p>
              )}
            </div>

            {/* BU Switcher (for executives) */}
            {canSwitchBU && (
              <div className="border-b border-line">
                <button
                  onClick={() => setShowBUSwitch(!showBUSwitch)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-ink/60" />
                    <span className="text-sm text-ink">Active BU: {activeBU}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-ink/60 transition-transform ${
                      showBUSwitch ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showBUSwitch && (
                  <div className="bg-gray-50 border-t border-line">
                    {businessUnits.map((bu) => (
                      <button
                        key={bu}
                        onClick={() => {
                          switchBU(bu);
                          setShowBUSwitch(false);
                          setIsOpen(false);
                        }}
                        className="w-full px-8 py-2 text-left hover:bg-white transition-colors flex items-center justify-between text-sm"
                      >
                        <span className={activeBU === bu ? "text-primary font-medium" : "text-ink"}>
                          {getBUDisplayName(bu)}
                        </span>
                        {activeBU === bu && <Check className="w-4 h-4 text-primary" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Logout */}
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors flex items-center gap-2 text-alert"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
