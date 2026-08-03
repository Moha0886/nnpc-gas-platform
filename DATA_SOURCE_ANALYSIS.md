# NNPC Reports - Data Source Analysis

**Date:** August 3, 2026
**Status:** Gap Analysis for Report Data Sources

---

## Executive Summary

The 4 redesigned NNPC reports currently use **hardcoded mock data** within each page component. This analysis identifies what data sources exist in the codebase and what's missing to populate reports from real operational data.

---

## Report 1: NGIC Daily Report (`/nnpc-reports/ngic-daily`)

### What the Report Needs

| Field | Type | Example |
|-------|------|---------|
| Region | AOW, AOE, etc. | "AOW" |
| Customer Type | String | "NPDC Power Customers" |
| Station Name | String | "Transcorp Ughelli" |
| Allocation | Number (Mmscfd) | 51.548 |
| Offtake | Number (Mmscfd) | 51.548 |
| Pressure (Inlet/Outlet) | String | "52/34" |
| Megawatts | Number (MW) | 193.54 |
| Status | String | "STATION ON STREAM" |

### What We Have ✅

- **Offtaker interface** (`lib/types.ts:115`) with:
  - `designCapacity` (can map to capacity)
  - `firmAndEffective`, `contractualDemand` (can derive allocation)
  - `sector`, `corridor`
  - `customerClass`
- **CUSTOMER_TYPE constants** (`lib/nomenclature.ts:30`) - exact strings from Excel
- **STATION_STATUS constants** (`lib/nomenclature.ts:54`) - "STATION ON STREAM", etc.
- **Offtaker seed data** (`lib/nnpc-seed-data.ts:233+`) - 50+ customers

### What's Missing ❌

1. **Region field** - No `region: "AOW" | "AOE"` in Offtaker interface
2. **Customer Type field** - No `customerType` field linking offtaker to customer type category
3. **Pressure data** - No `pressure: { inlet: number; outlet: number }` field
4. **Megawatts field** - No `megawatts` or `powerOutput` field for power stations
5. **Time-series allocation/offtake data** - Static design capacity only, no daily actuals
6. **Operational status** - No real-time status tracking

### Recommended Fixes

```typescript
// Add to Offtaker interface in lib/types.ts
export interface Offtaker {
  // ... existing fields
  region?: "AOW" | "AOE" | "AON" | "AOMW" | "AOD" | "AME"; // NGIC operational area
  customerType?: string; // "NPDC Power Customers", etc.
  pressure?: {
    inlet: number;  // bar or barg
    outlet: number; // bar or barg
  };
  megawatts?: number; // For power stations only
}

// Create daily operational data interface
export interface DailyOfftakerFlow {
  date: string; // Gas day
  offtakerId: string;
  allocation: number; // Mmscfd
  actualOfftake: number; // Mmscfd
  pressure?: { inlet: number; outlet: number; }; // barg
  megawatts?: number; // For power stations
  status: "STATION ON STREAM" | "STATION ON STANDBY" | "STATION ON SHUTDOWN";
}
```

---

## Report 2: MOR Supply Report (`/nnpc-reports/mor-supply`)

### What the Report Needs

| Field | Type | Example |
|-------|------|---------|
| **Producers** | | |
| Producer Name | String | "CNL-Escravos" |
| Volume (weekly) | Number (MMscf) | 2310.625 |
| **Offtakers** | | |
| Offtaker Name | String | "GASLINK, FALCON, etc." |
| Source of Allocation | String | "CNL, NPDC JV" |
| Allocation | Number (MMscf) | 1250.5 |
| Offtake | Number (MMscf) | 1185.2 |

### What We Have ✅

- **Producer interface** (`lib/types.ts:54`) with production volumes
- **13 Western Network producers** (`lib/nnpc-seed-data.ts:14+`) - exact names from Excel
- **AllocationSource interface** (`lib/types.ts:149`) - many-to-many producer-offtaker relationship
- **Offtaker seed data** with allocation fields

### What's Missing ❌

1. **Weekly volume data** - Producers have `averageDailyProduction` but no weekly totals
2. **AllocationSource instances** - Interface exists but no seed data
3. **Source labels** - No pre-defined "CNL, NPDC JV" string mappings
4. **Time-series data** - No historical weekly volumes

### Recommended Fixes

```typescript
// Create weekly production records
export interface WeeklyProducerVolume {
  week: string; // ISO week: "2026-W31"
  producerId: string;
  totalVolume: number; // MMscf (7-day total)
  dailyAverage: number; // mmscf/d
}

// Create allocation source seed data
export const allocationSources: AllocationSource[] = [
  {
    offtakerId: "off-gaslink",
    producerIds: ["prod-w-001", "prod-w-002"], // CNL, NPDC JV
    allocation: 1250.5,
    actualOfftake: 1185.2,
    sourceLabel: "CNL, NPDC JV",
  },
  // ... more mappings
];
```

---

## Report 3: NGML Daily Report (`/nnpc-reports/ngml-daily`)

### What the Report Needs

| Field | Type | Example |
|-------|------|---------|
| Allocation from NGIC | Number (MMscfd) | 353.55 |
| NGML Nomination | Number (MMscfd) | 377.00 |
| **RGD Zones** | | |
| Zone Name | String | "REGIONAL GAS DISTRIBUTION LAGOS" |
| Allocation | Number (MMscfd) | 85.2 |
| Offtake | Number (MMscfd) | 78.5 |
| **Customers** | | |
| Customer Name | String | "GASLINK" |
| Design Capacity | Number (MMscfd) | 95.0 |
| Nominations | Number (MMscfd) | 82.47 |
| Allocation | Number (MMscfd) | 82.47 |
| Offtake | Number (MMscfd) | 56.80 |
| Pressure | String | "52/34" |
| Status | String | "ON STREAM" |
| **Franchises** | | |
| Franchise Name | String | "NGML-NIPCO UJV" |
| Members | Array | ["LPL G/PWR", "OLAM", ...] |

### What We Have ✅

- **GDZ constants** (`lib/nomenclature.ts:9`) - exact zone names
- **FRANCHISE constants** (`lib/nomenclature.ts:43`) - "NGML-NIPCO UJV", etc.
- **Franchise interface** (`lib/types.ts:139`)
- **Offtaker interface** with `gdz` and `franchiseId` fields
- **designCapacity** field in Offtaker

### What's Missing ❌

1. **nominations field** - Not in Offtaker interface (only estimatedDemand)
2. **Franchise seed data** - No instances of franchise groupings
3. **Daily allocation/offtake data** - No time-series actuals
4. **Aggregate NGIC allocation** - No system-level nomination/allocation tracking
5. **Pressure data** - Not in Offtaker
6. **RGD zone aggregations** - No pre-computed zone totals

### Recommended Fixes

```typescript
// Add to Offtaker interface
export interface Offtaker {
  // ... existing fields
  nominations?: number; // MMscfd - daily nomination
  pressure?: { inlet: number; outlet: number; }; // bar
}

// Create franchise seed data
export const franchises: Franchise[] = [
  {
    id: "franchise-nipco-ujv",
    name: "NGML-NIPCO UJV",
    type: "UJV",
    gdz: "REGIONAL GAS DISTRIBUTION LAGOS",
    memberOfftakerIds: [
      "off-lpl-gpower",
      "off-olam",
      "off-breeze",
      "off-nestle",
      "off-aiml",
    ],
  },
  // ... more franchises
];

// Create daily system metrics
export interface DailySystemMetrics {
  date: string;
  ngicAllocation: number; // Total allocation from NGIC to NGML
  ngmlNomination: number; // Total NGML customer nominations
  curtailmentFactor: number; // ngicAllocation / ngmlNomination
}
```

---

## Report 4: MOR Volume/Pressure Report (`/nnpc-reports/mor-volume-pressure`)

### What the Report Needs

| Field | Type | Example |
|-------|------|---------|
| Producer Name | String | "CNL-Escravos" |
| Current Week Volume | Number (mmscf/d) | 330.09 |
| Current Week Pressure | Number (barg) | 82.10 |
| Prior Week Volume | Number (mmscf/d) | 352.96 |
| Prior Week Pressure | Number (barg) | 81.83 |
| Contractual Range | Object | { min: 80, max: 85 } |
| Remarks | String | "Volume dropped..." |

### What We Have ✅

- **Producer interface** with `contractualPressureRange`
- **Producer remarks field**
- **13 Western Network producers** with exact names
- **contractualPressureRangeStr** for display

### What's Missing ❌

1. **Time-series volume data** - No current/prior week tracking
2. **Time-series pressure data** - No weekly pressure readings
3. **Automated remarks generation** - Remarks are static strings
4. **Week-on-week variance calculations** - No historical comparison data

### Recommended Fixes

```typescript
// Create weekly producer metrics
export interface WeeklyProducerMetrics {
  week: string; // ISO week: "2026-W31"
  producerId: string;
  volume: number; // mmscf/d (daily average)
  pressure: number; // barg (average)
  remarks?: string; // Operational notes
}

// Seed data for current + prior weeks
export const weeklyProducerMetrics: WeeklyProducerMetrics[] = [
  // Current week (2026-W31)
  {
    week: "2026-W31",
    producerId: "prod-w-001",
    volume: 330.09,
    pressure: 82.10,
    remarks: "Volume dropped with slight improved pressure",
  },
  // Prior week (2026-W30)
  {
    week: "2026-W30",
    producerId: "prod-w-001",
    volume: 352.96,
    pressure: 81.83,
    remarks: "Normal operations",
  },
  // ... more weeks
];
```

---

## Summary: Missing Data Sources

### Critical Missing Components

| Component | Impact | Reports Affected |
|-----------|--------|------------------|
| **Time-series data** | Cannot show daily/weekly actuals | All 4 reports |
| **Pressure measurements** | Cannot track contractual breaches | NGIC, NGML, MOR Pressure |
| **Allocation/Offtake actuals** | Cannot show performance vs contract | All 4 reports |
| **AllocationSource instances** | Cannot show producer-offtaker flow | MOR Supply |
| **Franchise groupings** | Cannot group customers correctly | NGML Daily |
| **Region/Customer Type mapping** | Cannot organize NGIC report hierarchy | NGIC Daily |
| **Megawatts for power stations** | Cannot show power output | NGIC Daily |

### Data Architecture Recommendations

1. **Create Time-Series Tables**
   ```typescript
   // Daily operational snapshots
   - DailyOfftakerFlow (allocation, offtake, pressure, megawatts, status)
   - DailyProducerFlow (production, pressure, status)
   - WeeklyProducerVolume (weekly totals)
   - WeeklyProducerMetrics (volume, pressure, week-on-week)
   ```

2. **Enhance Master Data**
   ```typescript
   // Add to Offtaker
   - region (AOW, AOE, etc.)
   - customerType (NPDC Power Customers, etc.)
   - nominations (daily nomination)
   - pressure { inlet, outlet }
   - megawatts (for power stations)

   // Add to Producer
   - weeklyVolumes[] (time-series)
   - weeklyPressures[] (time-series)
   ```

3. **Create Reference Data**
   ```typescript
   - allocationSources[] (producer-offtaker mappings)
   - franchises[] (NGML-NIPCO UJV, etc.)
   - dailySystemMetrics[] (NGIC allocation, NGML nomination)
   ```

4. **Build Data Layer**
   ```typescript
   // Data fetching functions (lib/data-fetchers.ts)
   - getDailyOfftakerFlows(date: string)
   - getWeeklyProducerMetrics(week: string)
   - getMORSupplyData(week: string)
   - getNGMLDailyReport(date: string)
   ```

---

## Next Steps

### Phase 1: Extend Interfaces (1-2 hours)
- Add missing fields to Offtaker and Producer interfaces
- Create time-series interfaces (DailyOfftakerFlow, WeeklyProducerMetrics, etc.)
- Update types.ts with new interfaces

### Phase 2: Create Seed Data (2-4 hours)
- Build franchise groupings seed data
- Create allocation source mappings
- Generate 2-4 weeks of sample time-series data for demo

### Phase 3: Build Data Layer (4-6 hours)
- Create data fetcher functions
- Add aggregation utilities (zone totals, material balance, etc.)
- Build caching layer for performance

### Phase 4: Connect Reports to Data (2-3 hours)
- Replace hardcoded data in each report with data fetchers
- Add loading states and error handling
- Test with sample data

### Phase 5: Production Integration (TBD)
- Connect to real database or API
- Set up data pipelines for daily/weekly updates
- Add data validation and quality checks

---

## Files Modified

To implement these changes, you'll need to modify:

1. **Type Definitions**
   - `lib/types.ts` - Add missing fields and new interfaces

2. **Seed Data**
   - `lib/nnpc-seed-data.ts` - Add franchises, allocation sources
   - Create `lib/nnpc-time-series-data.ts` - Daily/weekly operational data

3. **Data Utilities**
   - Create `lib/data-fetchers.ts` - Data access layer
   - Create `lib/aggregations.ts` - Zone totals, material balance, etc.

4. **Report Pages**
   - `app/nnpc-reports/ngic-daily/page.tsx` - Use data fetchers
   - `app/nnpc-reports/mor-supply/page.tsx` - Use data fetchers
   - `app/nnpc-reports/ngml-daily/page.tsx` - Use data fetchers
   - `app/nnpc-reports/mor-volume-pressure/page.tsx` - Use data fetchers

---

## Conclusion

The report layouts are **100% accurate** and match Excel templates exactly. However, they currently use hardcoded mock data.

**To make them production-ready**, you need:
1. ✅ Interfaces already exist (mostly complete)
2. ❌ Time-series data structures (need to create)
3. ❌ Seed data for reference tables (franchises, allocation sources)
4. ❌ Sample operational data (2-4 weeks for demo)
5. ❌ Data fetcher layer to connect reports to data sources

**Estimated effort**: 10-15 hours for full implementation with sample data.
