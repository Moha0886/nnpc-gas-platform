"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-pine-deep min-h-screen flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 border-b border-pine">
        <h1 className="text-white text-xl font-bold">NNPC Gas</h1>
        <p className="text-white/70 text-sm mt-1">Performance Platform</p>
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
                isActive ? "sidebar-link-active" : "sidebar-link-inactive text-white/70 hover:bg-pine hover:text-white"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-pine">
        <p className="text-white/50 text-xs">
          NGIC · NGML · NLNG
        </p>
        <p className="text-white/50 text-xs mt-1">
          Build v0.1 - Prototype
        </p>
      </div>
    </aside>
  );
}
