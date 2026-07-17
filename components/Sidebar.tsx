"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Activity,
  FileText,
  Gauge,
  Flame,
  AlertTriangle,
  FileCheck,
  Users,
  Database,
  Network,
  BarChart3,
  Shield,
  DollarSign,
  Wallet,
  Receipt,
  GitBranch,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Executive Overview", href: "/", icon: LayoutDashboard },
  { name: "Volumes & Balancing", href: "/volumes", icon: Activity },
  { name: "Nominations & Gaps", href: "/nominations", icon: FileText },
  { name: "Capacity Utilisation", href: "/capacity", icon: Gauge },
  { name: "Flare Monitoring", href: "/flare", icon: Flame },
  { name: "Deferment", href: "/deferment", icon: AlertTriangle },
  { name: "Contract Performance", href: "/contracts", icon: FileCheck },
  { name: "Customer Scorecard", href: "/customers", icon: Users },
  { name: "Asset Registry", href: "/assets", icon: Database },
  { name: "Offtaker Hierarchy", href: "/offtakers", icon: Network },
  { name: "Reports & Analytics", href: "/reports", icon: BarChart3 },
  { name: "DSO Compliance", href: "/dso-compliance", icon: Shield },
  { name: "Gas Pricing", href: "/pricing", icon: DollarSign },
  { name: "Collections", href: "/collections", icon: Wallet },
  { name: "Take-or-Pay", href: "/take-or-pay", icon: Receipt },
  { name: "Pipeline Network", href: "/network", icon: GitBranch },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white min-h-screen flex flex-col border-r border-line">
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

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "sidebar-link",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-ink/70 hover:bg-primary/10 hover:text-primary"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-line">
        <p className="text-ink/50 text-xs">
          NGIC · NGML · NLNG
        </p>
        <p className="text-ink/50 text-xs mt-1">
          Build v0.1 - Prototype
        </p>
      </div>
    </aside>
  );
}
