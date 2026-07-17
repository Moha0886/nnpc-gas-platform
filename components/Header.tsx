"use client";

import { CURRENT_GAS_DAY } from "@/lib/data";
import { Calendar } from "lucide-react";
import CorridorFilter from "./CorridorFilter";

interface HeaderProps {
  title: string;
  showCorridorFilter?: boolean;
}

export default function Header({ title, showCorridorFilter = false }: HeaderProps) {
  return (
    <header className="bg-white border-b border-line px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-ink">{title}</h2>
        </div>

        <div className="flex items-center gap-6">
          {/* Gas Day Indicator */}
          <div className="flex items-center gap-2 px-4 py-2 bg-pine/10 rounded-lg">
            <Calendar className="w-4 h-4 text-pine" />
            <div>
              <p className="text-xs text-ink/60">Gas Day</p>
              <p className="text-sm font-semibold text-ink tabular-nums">
                {CURRENT_GAS_DAY}
              </p>
            </div>
          </div>

          {/* Corridor Filter (optional) */}
          {showCorridorFilter && <CorridorFilter />}
        </div>
      </div>
    </header>
  );
}
