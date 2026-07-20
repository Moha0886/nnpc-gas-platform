# NNPC Gas Platform — Implementation Status

**Date:** July 20, 2026
**Phase:** Nomenclature Conformance & Report Implementation
**Based on:** NNPC_Naming_Conformance_and_Reports.md, NNPC_Frontend_Update_Spec_v2.md, NNPC_Allocation_Engine_Addendum.md

---

## ✅ Completed

### Step 1: Critical P1 & P2 Fixes

#### P1 - Demo Blockers (All Fixed)
- ✅ **Flare penalty calculation corrected**
  - Created `/lib/flare-penalty.ts` with correct rates
  - $2.00/Mscf for producers ≥10k bpd
  - $0.50/Mscf for producers <10k bpd
  - Configurable FX rate per period
  - Both tiers stored in USD per Mscf

- ✅ **Pine & gasblue colors added to Tailwind config**
  - Added to `tailwind.config.ts`
  - Pine (#0F4C42) - delivered gas, operational status
  - Gasblue (#2E6FA3) - gas received into network
  - All existing components using these colors will now render correctly

- ✅ **ESLint and TypeScript re-enabled**
  - Removed `ignoreDuringBuilds` and `ignoreBuildErrors` from `next.config.mjs`
  - Type safety and code quality checks now active

#### P2 - Next Session Fixes (All Fixed)
- ✅ **Design vs operating pressure split**
  - Added `Pressure` interface with `value` + `unit` fields
  - Separated `designPressure` (MAOP) from `operatingPressure.inlet/outlet`
  - Added `PressureUnit` type: "barg" | "bar" | "psi" | "kPa"
  - Added `asOfDate` field for data provenance

- ✅ **Pipeline geography corrections**
  - OB3 retagged as "Interconnector" (East-West connector)
  - Oben Gas Plant moved to "Western" corridor
  - Added Oben-Geregu pipeline (36", 196 km, 1,200 MMscf/d, operational 2011)
  - Added "Interconnector" to Corridor type

- ✅ **Subsidiary update**
  - Replaced NLNG with NGPIS in Subsidiary type
  - Now: "NGIC" | "NGML" | "NGPIS"

### Step 2 & 3: Units, Terminology & Geography

- ✅ **Geography hierarchy fixed**
  - Added three-level structure: Network → Region → GDZ
  - Network: "Western Network" | "Eastern Network"
  - Region: "AOW" | "AOE"
  - GasDistributionZone: Lagos | North | **Delta** | East | AGOT GDZ
  - Legacy Corridor type preserved for backward compatibility

- ✅ **Nomenclature module created** (`/lib/nomenclature.ts`)
  - All NNPC exact labels and column headers
  - GDZ definitions (4 RGD zones + AGOT)
  - Network definitions (Western | Eastern)
  - Customer types (exact 6 types from NGIC)
  - Franchises/UJVs (exact 4 from NGML)
  - Station status derivation function
  - Customer alias normalization table
  - Report headers for all 4 reports
  - Unit notation helpers

### Step 6: Report Components

- ✅ **Created 4 NNPC report components**
  1. `/components/reports/NGICDailyReport.tsx`
     - NGIC Gas Off-Take for Month report
     - Region → Customer Type → Station hierarchy
     - Derived station status (on stream/standby/shutdown)
     - Megawatts column for power customers
     - Grand total with correct spacing

  2. `/components/reports/NGMLDailyReport.tsx`
     - NGML Daily Gas Situation Report
     - Summary section with SUB -TOTAL 1 (note the space!)
     - Detail section with franchises/UJVs
     - Dual S/N columns (continuous + zone-specific)
     - Inlet/outlet pressure pairs
     - Zone rollup remarks

  3. `/components/reports/WeeklyMORSupplyReport.tsx`
     - Weekly MOR Supply, Allocation & Offtake
     - Two-column layout (Gas Supply | Allocation & Offtake)
     - Material Balance / Line Pack calculation
     - Source of Allocation tracking

  4. `/components/reports/WeeklyMORVolumePressureReport.tsx`
     - Weekly MOR Volume & Pressure Overview
     - Current week vs prior week comparison
     - Week-on-week variance columns
     - **Automatic pressure breach detection** (outside contractual range)
     - Visual flagging of breaches

- ✅ **NNPC type definitions** (`/lib/nnpc-types.ts`)
  - Complete type definitions for all 4 reports
  - Station master data
  - Gas producer master data
  - Daily and weekly aggregated data types

- ✅ **Mock data** (`/lib/nnpc-data.ts`)
  - Station master data (NGIC + NGML stations)
  - Gas producer master data (6 producers across 2 networks)
  - Station daily data with correct pressure breach example
  - Weekly aggregated data
  - Helper functions for data retrieval

---

### Step 4 & 5: Missing Entities & Allocation Engine (Complete)

- ✅ **Producers entity** (`Producer` interface)
  - 13 Western Network producers with real names
  - Plant capacity, production forecast, average daily production
  - Contractual pressure ranges (min/max barg)
  - Excess/shortfall calculation

- ✅ **Many-to-many Source of Allocation**
  - `AllocationSource` interface linking producers to offtakers
  - Replaces single flat DCQ model
  - Can answer: "If Utorogu goes down, who loses gas?"

- ✅ **Contract tiers (5-tier structure)**
  - Firm & Effective
  - Firm but not Effective
  - Interruptible
  - Estimated Demand
  - Contractual Demand
  - GSA status and remarks

- ✅ **Megawatts tracking**
  - Added to `OfftakerFlow` interface
  - MW-per-MMscfd efficiency metric
  - Power station specific

- ✅ **Franchises/UJVs** (`Franchise` interface)
  - NGML-NIPCO UJV
  - Transit Gas Franchise
  - Entec Gas Franchise
  - Green Fuels UJV
  - Real member lists from NGML reports

- ✅ **Allocation engine** (`/lib/allocation-engine.ts`)
  - Complete algorithm from Nov 1, 2024 workbook
  - Firm customer carve-out (SNG, Obajana, BUA)
  - Pro-rata allocation by demand weight
  - Curtailment factor calculation
  - **Versioned configuration support** (historical reproducibility)
  - Validation function
  - Example data verified against workbook

- ✅ **Perf KPI**
  - Added to `OfftakerFlow`: `perf = actualOfftake ÷ allocation`
  - % Diff calculations (Allocation vs Actual Supply/Offtake)
  - Typical range 0.80-1.05, avg 0.92

- ✅ **Real NNPC seed data** (`/lib/nnpc-seed-data.ts`)
  - 13 Western Network producers with real names
  - 40+ offtakers with real names from workbooks
  - Customer aliases for normalization
  - Complete contract tier data
  - Franchise/UJV memberships

## 🚧 In Progress / Next Steps

### High Priority (Needed for Demo)

1. **Create report pages** (`/app/nnpc-reports/*`)
   - Wire up the 4 report components with real data
   - Add date/range selectors
   - Navigation integration

2. **Excel export**
   - Install `xlsx` package
   - Export functions matching their exact layout
   - Preserve formatting (bold, borders, merged cells)

3. **PDF export**
   - Install `jsPDF` or similar
   - Match their exact report layouts
   - Letterhead, ruled tables, dense rows

4. **Update Sidebar navigation**
   - Add "NNPC Reports" section
   - Links to all 4 reports

### Medium Priority (Step 4 - Missing Entities)

5. **Producers entity & screen**
   - 13 named supply sources
   - Plant capacity, production forecast
   - Average daily production
   - Contractual pressure ranges
   - New `/supply` screen

6. **Many-to-many Source of Allocation**
   - Producer → Offtaker relationships
   - "Who loses gas if Utorogu goes down?"
   - Replace flat `dcq` field

7. **Contract tiers**
   - Firm & Effective
   - Firm but not Effective
   - Interruptible
   - Estimated Demand
   - Contractual Demand

8. **Megawatts tracking**
   - Add to power station records
   - Derived MW-per-MMscfd calculation

9. **Real franchises/UJVs**
   - Rewire `/offtakers` with exact names
   - Remove invented Shell/Axxela hierarchy (keep as data, update labels)

### Step 5: Allocation Engine

10. **Build allocation engine** (`/lib/allocation-engine.ts`)
    - Implement the algorithm from Addendum
    - Firm customer carve-out
    - Pro-rata allocation by demand weight
    - Curtailment factor calculation
    - **Versioned inputs** (demand weights, firm customer list)
    - Never allow manual allocation entry

11. **Curtailment factor KPI**
    - Add to executive dashboard
    - Show trend
    - Alert when < 0.90

12. **What-if allocation control**
    - Adjust `allocationFromNGIC` slider
    - Watch all allocations recompute live
    - **This is the demo moment**

### Step 7: Rebuild /nominations

13. **Network-level (top)**
    - 5-stage: Nomination → Supply Forecast → Allocation → Actual Supply → Actual Offtake
    - Two % Diff columns

14. **Station-level (below)**
    - 3-stage: Nomination → Allocation → Actual Offtake
    - Add Perf = Actual Offtake ÷ Allocation
    - Group by GDZ

---

## 📁 New Files Created

```
lib/
├── nomenclature.ts          ✅ Single source of truth for NNPC labels
├── nnpc-types.ts            ✅ Type definitions for 4 reports
├── nnpc-data.ts             ✅ Mock data for stations, producers
├── nnpc-seed-data.ts        ✅ Real NNPC names (13 producers, 40+ offtakers)
├── allocation-engine.ts     ✅ Allocation algorithm with versioned configs
└── flare-penalty.ts         ✅ Correct penalty calculation ($2/Mscf)

components/reports/
├── NGICDailyReport.tsx                  ✅ NGIC Gas Off-Take
├── NGMLDailyReport.tsx                  ✅ NGML Daily Situation
├── WeeklyMORSupplyReport.tsx            ✅ MOR Supply/Allocation
└── WeeklyMORVolumePressureReport.tsx    ✅ MOR Volume/Pressure
```

---

## 🔄 Files Modified

```
tailwind.config.ts       ✅ Added pine & gasblue colors
next.config.mjs          ✅ Re-enabled ESLint & TypeScript
lib/types.ts             ✅ Added geography hierarchy, pressure types, NGPIS
lib/data.ts              ✅ Fixed OB3, Oben, added Oben-Geregu pipeline
```

---

## 📋 Open Questions for NNPC (from Handoff)

These block correctness but not progress:

1. **What is "demand weight"?** Drives the entire allocation formula, but we don't know what it represents
2. **Gas day boundary?** Assumed 06:00–06:00 WAT, never stated in templates
3. **Are the 4 RGD zones complete?** Is AGOT GDZ a 5th zone or part of Lagos?
4. **Is SNG Aba the same as SNG?** Or a separate eastern station?
5. **Approval chains?** Who approves NGIC→NGML allocation? NGML→customer allocation?

---

## 🎯 Rough Completion Estimates

| Task | Estimate | Status |
|---|---|---|
| P1 & P2 fixes (Step 1) | ~1 day | ✅ Complete |
| Units & geography (Steps 2-3) | ~1 day | ✅ Complete |
| Report components (Step 6) | ~1 day | ✅ Complete |
| Missing entities (Step 4) | ~3-4 days | ✅ Complete |
| Allocation engine (Step 5) | ~2 days | ✅ Complete |
| Wire reports + export | ~1 day | 🚧 Next |
| Rebuild /nominations (Step 7) | ~1 day | Pending |
| New screens (/supply, /material-balance) | ~2 days | Pending |
| **TOTAL** | **10-12 days** | **~8 days complete** |

---

## 🚀 Suggested Next Actions

1. Create the 4 report pages in `/app/nnpc-reports/`
2. Add Excel export (critical for client acceptance)
3. Update sidebar navigation
4. Build allocation engine (high demo value)
5. Add curtailment factor to executive dashboard
6. Build what-if control

---

## 📝 Notes

- All user-facing strings now use `nomenclature.ts` - no hardcoded labels
- Station status is **derived**, never stored (prevents contradictions)
- Pressure breach detection is **automatic** (improvement over their manual checking)
- Exact NNPC column headers, casing, and spacing preserved
- "SUB -TOTAL 1" has space before hyphen (from their template)
- Customer alias table ready for ingestion normalization
- All 4 report components ready for data integration

---

**Status:** Strong progress on Steps 1-3 and 6. Core infrastructure in place. Ready for report page creation and allocation engine implementation.
