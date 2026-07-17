"use client";

import { useState } from "react";
import type { Corridor } from "@/lib/types";
import { cn } from "@/lib/utils";

const corridors: Array<Corridor | "All"> = [
  "All",
  "Eastern",
  "Western",
  "Northern",
  "Lagos",
];

interface CorridorFilterProps {
  onChange?: (corridor: Corridor | "All") => void;
}

export default function CorridorFilter({ onChange }: CorridorFilterProps) {
  const [selected, setSelected] = useState<Corridor | "All">("All");

  const handleSelect = (corridor: Corridor | "All") => {
    setSelected(corridor);
    onChange?.(corridor);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-ink/70 mr-2">Corridor:</span>
      {corridors.map((corridor) => (
        <button
          key={corridor}
          onClick={() => handleSelect(corridor)}
          className={cn(
            "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
            selected === corridor
              ? "bg-pine text-white"
              : "bg-white border border-line text-ink/70 hover:bg-gray-50"
          )}
        >
          {corridor}
        </button>
      ))}
    </div>
  );
}
