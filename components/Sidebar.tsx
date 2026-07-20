"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Activity,
  FileText,
  Gauge,
  AlertTriangle,
  FileCheck,
  Database,
  Network,
  BarChart3,
  GitBranch,
  Siren,
  Menu,
  X,
  ChevronDown,
  PieChart,
  FileBarChart,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Grouped navigation structure for better information architecture
const navigationGroups = [
  {
    label: "OPERATIONS",
    items: [
      { name: "Executive Dashboard", href: "/", icon: LayoutDashboard },
      { name: "Volumes & Balance", href: "/volumes", icon: Activity },
      { name: "Allocation", href: "/allocation", icon: PieChart },
      { name: "Nominations", href: "/nominations", icon: FileText },
      { name: "Capacity", href: "/capacity", icon: Gauge },
    ],
  },
  {
    label: "ISSUES & TRACKING",
    items: [
      { name: "Deferments", href: "/deferment", icon: AlertTriangle },
      { name: "Incidents", href: "/incidents", icon: Siren },
    ],
  },
  {
    label: "COMMERCIAL",
    items: [
      { name: "Contracts", href: "/contracts", icon: FileCheck },
    ],
  },
  {
    label: "INFRASTRUCTURE",
    items: [
      { name: "Assets", href: "/assets", icon: Database },
      { name: "Offtakers", href: "/offtakers", icon: Network },
      { name: "Network Map", href: "/network", icon: GitBranch },
    ],
  },
  {
    label: "NNPC REPORTS",
    items: [
      { name: "NGIC Daily Report", href: "/nnpc-reports/ngic-daily", icon: FileBarChart },
      { name: "NGML Daily Report", href: "/nnpc-reports/ngml-daily", icon: FileBarChart },
      { name: "Weekly MOR Supply", href: "/nnpc-reports/mor-supply", icon: FileBarChart },
      { name: "Weekly MOR Volume/Pressure", href: "/nnpc-reports/mor-volume-pressure", icon: FileBarChart },
    ],
  },
  {
    label: "REPORTING",
    items: [
      { name: "Reports", href: "/reports", icon: BarChart3 },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (label: string) => {
    const newCollapsed = new Set(collapsedGroups);
    if (newCollapsed.has(label)) {
      newCollapsed.delete(label);
    } else {
      newCollapsed.add(label);
    }
    setCollapsedGroups(newCollapsed);
  };

  const SidebarContent = () => (
    <>
      {/* Logo/Header */}
      <div className="p-6 border-b border-line">
        <div className="flex items-center gap-3 mb-3">
          <Image
            src="/nnpc-logo.png"
            alt="NNPC Logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <div>
            <h1 className="text-ink text-base font-bold">NNPC Gas</h1>
            <p className="text-ink/60 text-xs">Performance Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation - Grouped */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {navigationGroups.map((group) => {
          const isCollapsed = collapsedGroups.has(group.label);

          return (
            <div key={group.label} className="space-y-1">
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(group.label)}
                className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-semibold text-ink/50 hover:text-ink/70 transition-colors"
              >
                <span>{group.label}</span>
                <ChevronDown
                  className={cn(
                    "w-3 h-3 transition-transform",
                    isCollapsed && "-rotate-90"
                  )}
                />
              </button>

              {/* Group Items */}
              {!isCollapsed && (
                <div className="space-y-0.5 animate-slide-in">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "sidebar-link",
                          isActive
                            ? "sidebar-link-active"
                            : "sidebar-link-inactive"
                        )}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span className="truncate">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-line">
        <p className="text-ink/50 text-xs">
          NGIC · NGML · NGPIS
        </p>
        <p className="text-ink/50 text-xs mt-1">
          Build v0.3 - NNPC Conformance
        </p>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-line hover:bg-gray-50 transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-ink" />
        ) : (
          <Menu className="w-6 h-6 text-ink" />
        )}
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white min-h-screen flex-col border-r border-line">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar - Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 bg-ink/50 z-40 animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Sidebar Panel */}
          <aside className="lg:hidden fixed top-0 left-0 bottom-0 w-64 bg-white z-50 flex flex-col border-r border-line shadow-xl animate-slide-in">
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
}
