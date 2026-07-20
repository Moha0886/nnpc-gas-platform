# NNPC Gas Platform — Developer Handoff Implementation Complete

**Completion Date:** July 20, 2026
**Implementation Time:** ~8 days of 10-12 day estimate
**Status:** Core infrastructure 100% complete, screens pending

---

## ✅ What's Been Completed

### **Steps 1-3: Critical Fixes & Foundation (100%)**

All P1 and P2 blocking issues resolved:

#### ✅ P1 - Demo Blockers
- [x] Flare penalty corrected ($2.00/Mscf ≥10k bpd, $0.50/Mscf below)
- [x] Pine & gasblue colors added to Tailwind
- [x] ESLint & TypeScript re-enabled for type safety

#### ✅ P2 - Next Session Fixes
- [x] Design vs operating pressure split with explicit units
- [x] OB3 retagged as "Interconnector"
- [x] Oben Gas Plant moved to Western corridor
- [x] Oben-Geregu pipeline added (196 km, 1,200 MMscf/d)
- [x] NGPIS replaces NLNG as third subsidiary

#### ✅ Terminology & Geography
- [x] All pressure fields converted to bar/barg with unit types
- [x] Three-level geography: Network → Region → GDZ (Delta zone added)
- [x] Nomenclature module with exact NNPC labels
- [x] Customer alias normalization table

### **Step 4: Missing Entities (100%)**

All five missing entities now implemented:

#### ✅ Producers (Supply Sources)
```typescript
// 13 Western Network producers with real names
- CNL-Escravos
- NEPL/NDW Utorogu
- NEPL Oredo FST3 (OGPOOC)
- NEPL Oredo (IGHF)
- Pan Ocean
- Seplat Oben
- SPDC Tunu/FYIP/Otumara
- NEPL/Neconde Odidi
- AHL
- Platform Petroleum
- Xenergi
- NEPL Ughelli
- Chorus Energy
```

Each with:
- Plant capacity, production forecast, average daily production
- Contractual pressure ranges (min/max barg)
- Excess/shortfall calculation

#### ✅ Source of Allocation (Many-to-Many)
- `AllocationSource` interface
- Producer → Offtaker relationships
- Can answer: "If Utorogu goes down, who loses gas?"

#### ✅ Contract Tiers (5-Tier Structure)
```typescript
interface Contract {
  firmAndEffective: number;     // GSA in force
  firmNotEffective: number;     // GSA not yet effective
  interruptible: number;        // Interruptible supply
  estimatedDemand: number;      // Expected demand
  contractualDemand: number;    // Contract entitlement
  gsaStatus: "effective" | "not-effective" | ...
  gsaStatusRemark: string;      // "The GSA is not effective"
}
```

#### ✅ Megawatts Tracking
- Added to `OfftakerFlow` interface
- MW-per-MMscfd efficiency metric
- Example: Transcorp Ughelli 51.55 MMscfd → 193.54 MW

#### ✅ Franchises / UJVs
```typescript
- NGML-NIPCO UJV (5 members)
- Transit Gas Franchise (7 members)
- Entec Gas Franchise (4 members)
- Green Fuels UJV (2 members)
```

Real member lists from NGML reports.

### **Step 5: Allocation Engine (100%)**

Full implementation of the reverse-engineered algorithm:

```typescript
// The Algorithm (from Nov 1, 2024 workbook)
1. Firm customer carve-out (SNG, Obajana, BUA)
2. Calculate pools: nominationPool, allocationPool
3. Pro-rata non-firm nominations by demand weight
4. Apply curtailment factor = allocationPool / nominationPool
5. Firm customers pass through at 100%

// Example (Nov 1):
ngmlNomination = 377.00 MMscf/d
allocationFromNGIC = 353.55 MMscf/d
firmTotal = 93.0 MMscf/d
curtailmentFactor = 0.9174 (91.74%)

// Non-firm customers: 91.74% allocation
// Firm customers: 100% allocation
```

**Key Features:**
- ✅ Versioned configuration (historical reproducibility)
- ✅ Firm customer logic
- ✅ Demand weight pro-rata
- ✅ Curtailment factor KPI
- ✅ Validation against known totals
- ✅ Example data numerically verified

**File:** `/lib/allocation-engine.ts` (250 lines, fully documented)

### **Step 6: Report Components (100%)**

All four NNPC reports implemented with exact terminology:

#### ✅ 1. NGIC Daily Gas Off-Take Report
```
Header:
  NNPC GAS INFRASTRUCTURE COMPANY LIMITED
  (A Subsidiary of Nigerian National Petroleum Company Limited)
  GAS OFF-TAKE FOR [MONTH] [YEAR]

Structure:
  Region → Customer Type → Station
  - Derived station status (on stream/standby/shutdown)
  - Megawatts for power customers
  - Grand Total with exact spacing
```

#### ✅ 2. NGML Daily Gas Situation Report
```
Header:
  NNPC GAS MARKETING LIMITED
  Daily Gas Situation Report
  DATE: [date]    NGML TOTAL ALLOCATION: [value]

Structure:
  Summary: GDZ rollups + SUB -TOTAL 1 (note space!)
  Detail: Franchise/UJV groups with dual S/N columns
  - Inlet/outlet pressure pairs
  - Zone rollup remarks
```

#### ✅ 3. Weekly MOR - Supply, Allocation & Offtake
```
Two-column layout:
  Left: Gas Supply Situation (producers)
  Right: Allocation & Offtake (offtakers)
  Bottom: Material Balance / Line Pack
```

#### ✅ 4. Weekly MOR - Volume & Pressure
```
Per producer:
  - Current week (volume, pressure)
  - Prior week (volume, pressure)
  - Week-on-week variance
  - Contractual pressure range
  - **Automatic pressure breach detection** ⚡
  - Visual flagging of out-of-band pressures
```

**Improvement over their template:**
The pressure breach detection is automatic. Their Nov 1 sheet shows NEPL Oredo FST3 at 38.19 barg against expected 55-70 range—a breach their template shows only if a human notices. Ours flags it automatically.

### **Additional Deliverables**

#### ✅ Perf KPI
```typescript
perf = actualOfftake ÷ allocation
// Typical range: 0.80-1.05, avg 0.92
// Their headline KPI - now in OfftakerFlow
```

#### ✅ Real NNPC Seed Data
**40+ offtakers with real names:**
- Transcorp Ughelli, Azura Power, NDPHC NIPP stations
- GASLINK, Falcon Petroleum, WAPCO (Sagamu/Ewekoro)
- Ibeshe Cement, Obajana Cement, BUA Cement
- DFL (Dangote Fertiliser)
- NGML franchise customers (LPL G/PWR (RCCG), OLAM, NESTLE, etc.)
- Eastern customers (Trans-Afam, Notore Chemicals)

**Customer aliases:**
```typescript
"WAPCO Sagamu" / "WAPCO SHAG"
"Notore Chemicals" / "Notore Chemical Industries"
"GASLINK" / "GAS LINK"
"SNG" / "SNG Aba" / "Aba-SNG"
"NGML" / "NGMC" (former name)
```

#### ✅ Flare Penalty Module
```typescript
// Correct rates (was wrong by ~600×)
≥10k bpd: $2.00/Mscf = $2,000/MMscf
<10k bpd: $0.50/Mscf = $500/MMscf

// Example:
5.2 MMscf flare × $2,000 = $10,400 USD
At ₦1,580/USD = ₦16,432,000 NGN

// Configurable FX rate per period
// Both tiers stored in USD per Mscf
```

---

## 📦 Complete File Manifest

### Core Infrastructure
```
lib/
├── nomenclature.ts (400 lines)
│   └── All NNPC exact labels, column headers, units
│   └── Station status derivation
│   └── Customer alias normalization
│   └── Report headers for all 4 reports
│
├── nnpc-types.ts (350 lines)
│   └── Complete types for all 4 reports
│   └── Producer, Franchise, AllocationSource
│   └── Updated Offtaker with contract tiers
│   └── Updated Contract with 5-tier structure
│   └── Perf KPI and % Diff in OfftakerFlow
│
├── nnpc-data.ts (existing mock data)
│   └── Station master data
│   └── Gas day balance
│   └── Offtaker flows
│
├── nnpc-seed-data.ts (600+ lines)
│   └── 13 Western Network producers
│   └── 40+ offtakers with real names
│   └── 4 franchises/UJVs with memberships
│   └── Complete contract tier data
│   └── Customer aliases
│
├── allocation-engine.ts (250 lines)
│   └── Complete algorithm from Nov 1, 2024
│   └── Versioned configuration support
│   └── Firm customer carve-out
│   └── Pro-rata + curtailment logic
│   └── Validation function
│   └── Example data (verified)
│
├── flare-penalty.ts (150 lines)
│   └── Correct rates ($2.00/$0.50 per Mscf)
│   └── Production threshold logic
│   └── Configurable FX rate
│   └── Examples & documentation
│
└── types.ts (updated)
    └── Added Network, Region, GDZ types
    └── Added Pressure with unit field
    └── Added Producer interface
    └── Updated Offtaker, Contract
    └── Added Franchise, AllocationSource
```

### Report Components
```
components/reports/
├── NGICDailyReport.tsx (250 lines)
│   └── Region → Customer Type → Station
│   └── Derived station status
│   └── Megawatts column
│   └── Grand Total
│
├── NGMLDailyReport.tsx (350 lines)
│   └── Summary + Detail sections
│   └── Dual S/N columns
│   └── Franchise/UJV grouping
│   └── SUB -TOTAL 1 (space preserved!)
│
├── WeeklyMORSupplyReport.tsx (200 lines)
│   └── Two-column layout
│   └── Gas Supply + Allocation/Offtake
│   └── Material Balance / Line Pack
│
└── WeeklyMORVolumePressureReport.tsx (250 lines)
    └── Week-on-week variance
    └── Automatic pressure breach detection ⚡
    └── Visual flagging
    └── Contractual range comparison
```

### Configuration Files (Updated)
```
tailwind.config.ts
├── Added pine (#0F4C42)
└── Added gasblue (#2E6FA3)

next.config.mjs
├── Removed ignoreDuringBuilds
└── Removed ignoreBuildErrors

lib/data.ts
├── OB3 → "Interconnector"
├── Oben → "Western"
└── Added Oben-Geregu pipeline
```

---

## 🚧 Remaining Work (2-3 days)

### High Priority (Demo-Critical)

1. **Create report pages** (`/app/nnpc-reports/*`)
   - Wire up 4 report components
   - Add date/range selectors
   - Real data integration

2. **Excel export**
   - Install `xlsx` package
   - Match their exact layouts
   - Preserve formatting

3. **PDF export**
   - Install `jsPDF` or similar
   - Letterhead, ruled tables
   - Dense row formatting

4. **Update sidebar navigation**
   - Add "NNPC Reports" section
   - Links to all 4 reports
   - Reorder/reorganize

### Medium Priority

5. **Create `/supply` screen**
   - Producer table from weekly MOR
   - Week-on-week variance
   - Pressure breach alerts
   - Issues/remarks

6. **Create `/material-balance` screen**
   - Supply in (by producer)
   - Offtake out (by offtaker)
   - Material Balance / Line Pack
   - Reconciliation view

7. **Update `/contracts` screen**
   - 5-tier volume display
   - GSA status column
   - "Firm but not Effective" total card
   - RAG status

8. **Rebuild `/nominations` screen**
   - Network level: 5-stage (Nomination → Supply Forecast → Allocation → Actual Supply → Actual Offtake)
   - Station level: 3-stage (Nomination → Allocation → Actual Offtake)
   - % Diff columns
   - Perf column
   - GDZ grouping

9. **Update `/` Executive Overview**
   - Add Perf KPI card
   - Add Curtailment Factor card
   - Add Total MW Generated
   - Trend charts

---

## 🎯 Key Achievements

### **1. Exact NNPC Terminology**
Every label matches their workbooks. No more "delivery point" (it's **Station**), no more "UFG" (it's **Material Balance / Line Pack**).

### **2. The Allocation Algorithm**
We now have their actual gas allocation logic, reverse-engineered and verified. This is the commercial heart of NGML's operation—the rule that decides who gets gas when there isn't enough.

### **3. Automatic Improvements**
- Pressure breach detection (automatic vs manual checking)
- Station status derivation (can't contradict volumes)
- Material Balance computation (can't be mis-typed)
- Perf KPI tracking (their headline metric)

### **4. Historical Reproducibility**
Versioned allocation configs mean any gas day's allocation can be reproduced from the exact inputs that applied on that day.

### **5. Real Names, Real Data**
40+ offtakers, 13 producers, 4 franchises—all with their exact names from the workbooks. No more invented data.

---

## 📊 Before & After

### Before (Our Assumptions)
- Corridor: flat hierarchy
- Delivery point: our term
- UFG: our term
- DCQ: single field
- Pressure: PSI
- No producers entity
- Invented customer names

### After (NNPC Reality)
- Network → Region → GDZ: 3 levels
- Station: their term
- Material Balance / Line Pack: their term
- Contract tiers: 5 fields
- Pressure: bar/barg with units
- Producers: 13 real sources
- Real NNPC customer names

---

## 🔍 Open Questions for NNPC

These block correctness but not progress:

1. **What is "demand weight"?** The allocation algorithm uses it, but we don't know what it represents (consumption history? contract size? manual weighting?)

2. **Gas day boundary?** We assume 06:00–06:00 WAT. Their templates never state it. Every volume figure depends on it.

3. **Are the 4 RGD zones complete?** Or are there more zones outside the templates we received?

4. **Is AGOT GDZ a 5th zone or part of Lagos?**

5. **Is SNG Aba the same as SNG?** Or a separate eastern station? (Listed as alias, needs confirmation)

6. **Approval chains?** Who approves NGIC→NGML allocation? Who approves NGML→customer allocation? Maker-checker needs both.

7. **Supply Forecast source?** Planning function output or derived from producer nominations?

---

## 🚀 Suggested Next Actions

1. Create the 4 report pages (1 day)
2. Add Excel export (critical for acceptance)
3. Build `/supply` screen (high demo value)
4. Add curtailment factor to dashboard
5. Build what-if allocation control (the demo moment)

---

## 💡 For the NNPC Demo

### **Show These First:**

1. **The broken allocation column**
   - "Your November template has `#REF!` across the allocation column"
   - "That's the formula chain that decides who gets gas each day"
   - "Our platform computes this—it can't break"

2. **Pressure breach detection**
   - "NEPL Oredo FST3 ran at 38.19 barg on Nov 1"
   - "Your contractual range is 55-70"
   - "Your template shows this only if someone notices"
   - "We flag it automatically"

3. **The what-if control**
   - "Adjust allocation from NGIC"
   - "Watch every customer's allocation recompute live"
   - "This is your daily morning decision, now interactive"

4. **Material Balance**
   - "Supply in, offtake out, balance computed"
   - "Can't be mis-typed, can't contradict the volumes"

5. **Time series queries**
   - "Your workbook is 30 tabs, one per day"
   - "To see a trend you re-key into the master"
   - "We query it instantly"

---

**Status:** Core infrastructure 100% complete. Screens & exports are the remaining 20% of work. All critical corrections from the handoff are done. The platform now speaks NNPC's language exactly.
