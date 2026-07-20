import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { Subsidiary, Corridor } from "./types";

/**
 * Hook to filter data by user's Business Unit and permissions
 */
export function useBUFilter() {
  const { user, activeBU, canAccess } = useAuth();

  return useMemo(() => {
    if (!user) {
      return {
        filterByBU: () => false,
        filterByCorridor: () => false,
        allowedBUs: [] as Subsidiary[],
        allowedCorridors: [] as Corridor[],
        currentBU: activeBU,
        isExecutive: false,
      };
    }

    const isExecutive = user.permissions.canViewCrossBU;
    const allowedBUs: Subsidiary[] = isExecutive
      ? ["NGIC", "NGML", "NGPIS"]
      : [user.businessUnit];

    const allowedCorridors = user.corridors || ["Eastern", "Western", "Northern", "Lagos"];

    /**
     * Filter function for Business Unit
     */
    const filterByBU = <T extends { subsidiary?: Subsidiary; businessUnit?: Subsidiary }>(
      item: T
    ): boolean => {
      if (isExecutive) {
        // Executives can see all, but filtered by active BU
        const itemBU = item.subsidiary || item.businessUnit;
        return !itemBU || itemBU === activeBU;
      }

      // Regular users only see their own BU
      const itemBU = item.subsidiary || item.businessUnit;
      return !itemBU || itemBU === user.businessUnit;
    };

    /**
     * Filter function for Corridor
     */
    const filterByCorridor = <T extends { corridor?: Corridor }>(item: T): boolean => {
      if (isExecutive) return true; // Executives see all corridors
      if (!item.corridor) return true; // Items without corridor are visible to all
      if (!user.corridors) return true; // If user has no corridor restriction, see all

      return user.corridors.includes(item.corridor);
    };

    return {
      filterByBU,
      filterByCorridor,
      allowedBUs,
      allowedCorridors,
      currentBU: activeBU,
      isExecutive,
    };
  }, [user, activeBU, canAccess]);
}

/**
 * Hook to filter arrays by BU
 */
export function useFilteredData<T extends { subsidiary?: Subsidiary; businessUnit?: Subsidiary }>(
  data: T[]
): T[] {
  const { filterByBU } = useBUFilter();
  return useMemo(() => data.filter(filterByBU), [data, filterByBU]);
}

/**
 * Hook to get BU-specific stats
 */
export function useBUStats() {
  const { user, activeBU } = useAuth();
  const { isExecutive } = useBUFilter();

  return {
    displayBU: isExecutive ? activeBU : user?.businessUnit || "NGIC",
    buLabel: isExecutive ? `${activeBU} (Active View)` : user?.businessUnit || "NGIC",
    canSwitchBU: user?.permissions.canSwitchBU || false,
  };
}
