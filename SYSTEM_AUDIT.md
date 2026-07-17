# NNPC Gas Platform - System Audit Report

**Date:** 2026-07-17
**Status:** Phase 1 Complete (Read-Only Dashboard)
**Phase 2:** Data Entry & Recording - NOT IMPLEMENTED

---

## ✅ WHAT EXISTS (Confirmed)

### 1. Facilities & Nomenclature ✅

**Location:** `/lib/data.ts` lines 31-123
**Screen:** `/assets` - Asset Registry

**Pipelines (3)**
| ID | Name | Nomenclature | Size | Design Pressure | Length | Corridor | Status |
|---|---|---|---|---|---|---|---|
| elps-001 | ELPS (Escravos-Lagos Pipeline System) | ELPS | 36" | 85 barg | 514 km | Western | Operational |
| ob3-001 | OB3 (Obiafu-Obrikom to Oben) | OB3 | 48" | 90 barg | 130 km | Eastern | Operational |
| akk-001 | AKK (Ajaokuta-Kaduna-Kano) | AKK | 40" | 98 barg | 614 km | Northern | Under construction |

**Processing Plants (3)**
| ID | Name | Capacity | Design Pressure | Products | Pipeline Connection | Corridor |
|---|---|---|---|---|---|---|
| plant-obiafu | Obiafu-Obrikom Gas Plant | 1,000 MMscf/d | 75 barg | Lean gas, LPG, Condensate | OB3 | Eastern |
| plant-oben | Oben Gas Plant | 300 MMscf/d | 70 barg | Lean gas, LPG | OB3 | Eastern |
| plant-utorogu | Utorogu Gas Plant | 510 MMscf/d | 72 barg | Lean gas, Condensate | ELPS | Western |

---

### 2. Inlet/Outlet Pressure Capability ⚠️ PARTIAL

**Type Definition:** `lib/types.ts` lines 201-211

```typescript
export interface Pipeline extends Asset {
  type: "transmission" | "gathering" | "distribution";
  pressure?: {
    inlet: number; // PSI
    outlet: number; // PSI
  };
}
```

**Status:**
- ✅ Data structure supports inlet/outlet pressure
- ❌ Current seed data only has `designPressure` (single value in barg)
- ❌ No actual inlet/outlet pressure data populated
- ❌ Not displayed on any screen

---

### 3. Offtakers/Customers by Category & Product Type ✅ PARTIAL

**Location:** `/lib/data.ts` lines 129-285
**Screen:** `/assets` (includes offtakers filter)

**Customers by Sector:**

**Power Offtakers (6)**
- Western: Egbin (215 MMscf/d), Olorunsogo (140), Omotosho (125)
- Eastern: Okpai (78), Afam VI (102), Alaoji (175)

**Fertiliser Industry (3)**
- Western: Dangote Fertiliser (195 MMscf/d)
- Eastern: Indorama Eleme (145), Notore Fertiliser (35)

**LDC/Distributors (2)**
- Lagos: Shell Nigeria Gas LDC (85 MMscf/d) with 3 sub-offtakers
- Lagos: Axxela Gas Distribution (72 MMscf/d) with 2 sub-offtakers

**What's Shown:**
- ✅ Offtaker name
- ✅ Sector (Power, Fertiliser, LDC)
- ✅ Corridor
- ✅ DCQ (Daily Contract Quantity)
- ❌ Product type they take (NOT SHOWN)
- ❌ Gas quality specs (NOT SHOWN)

**Processing Plants Products:** ✅ Exist in data but NOT displayed
- Plant products: ["Lean gas", "LPG", "Condensate"] exist in data
- Not shown in Assets table

---

### 4. Planned vs Actual Nominations & Deliveries ✅ COMPLETE

**Screen:** `/nominations` - Nominations & Gaps
**Location:** `lib/types.ts` line 88, `app/nominations/page.tsx`

**6-Stage Nomination Cycle Table:**

| Column | Description | Status |
|---|---|---|
| Nominated | What customer requested (PLANNED) | ✅ Shown |
| Allocated | What NGML allocated | ✅ Shown |
| Forecast Supply | Forward projection | ✅ Shown |
| Received | Metered delivery (ACTUAL) | ✅ Shown |
| Offtaken | What customer actually took (ACTUAL) | ✅ Shown |
| Nomination Variance | Nominated - Received | ✅ Shown (highlighted) |
| Receipt Variance | Received - Offtaken | ✅ Shown (highlighted) |

**Features:**
- ✅ Grouped by corridor
- ✅ Variance columns visually highlighted
- ✅ Totals by corridor
- ✅ Filter by corridor

---

## ❌ WHAT'S MISSING (Critical Gaps)

### 1. Inlet/Outlet Pressure Data ❌

**Data Structure:** ✅ Exists
**Actual Data:** ❌ Missing
**Display:** ❌ Not shown

**What's Needed:**
- Populate `pressure.inlet` and `pressure.outlet` for each pipeline
- Add new column to Assets table showing "Inlet PSI / Outlet PSI"
- Show pressure drop across pipeline

---

### 2. Product Type per Offtaker ❌

**Data Structure:** ❌ Not in Offtaker interface
**Actual Data:** ❌ Missing
**Display:** ❌ Not shown

**What's Needed:**
- Add `productType` field to Offtaker interface:
  ```typescript
  productType?: "Lean gas" | "Rich gas" | "LPG" | "Condensate" | "LNG feedstock";
  ```
- Show in Assets table and Offtakers screen
- Show in Nominations table

---

### 3. Processing Plant Products Display ❌

**Data Structure:** ✅ Exists (`products: string[]`)
**Actual Data:** ✅ Populated
**Display:** ❌ Not shown on screen

**What's Needed:**
- Show products column in Assets table when filtering for Processing Plants
- Create dedicated "Products" column showing comma-separated list

---

### 4. Data Entry/Recording System ❌ CRITICAL

**All Missing:**
- ❌ No forms for staff to enter data
- ❌ No API endpoints for creating records
- ❌ No authentication system (NGIC/NGML/BU staff login)
- ❌ No daily production recording form
- ❌ No customer demand recording form
- ❌ No pipeline flow recording form
- ❌ No pressure reading entry form
- ❌ No volume/delivery point recording
- ❌ No maker-checker workflow
- ❌ No audit trail

**What Staff Need to Record:**
1. **Daily Production from Upstream**
   - Date, facility, volume received
   - Source (upstream JV/field)
   - Gas quality specs

2. **Customer Demands (Nominations)**
   - Offtaker name
   - Requested volume
   - Time period
   - Priority level

3. **Pipeline Flows**
   - Pipeline ID
   - Current flow (MMscf/d)
   - Inlet pressure (PSI)
   - Outlet pressure (PSI)
   - Temperature

4. **Delivery Point Records**
   - Metering station ID
   - Customer name
   - Volume delivered
   - Pressure at delivery
   - Temperature
   - Time stamp

5. **Flare & Deferment Events**
   - Facility, reason, volume
   - Start/end time
   - Cause codes

---

### 5. Metering Station Screen ❌

**Data Structure:** ✅ Exists (`MeteringStation` interface)
**Actual Data:** ❌ No seed data
**Screen:** ❌ No dedicated screen

**What's Needed:**
- New `/metering` screen
- Show all custody-transfer points
- Display: flow, pressure, temperature, calibration status
- Map view showing locations

---

### 6. Detailed Pipeline Screen ❌

**Current:** Assets table shows basic info
**Missing:**
- Individual pipeline detail view
- Real-time flow monitoring
- Inlet/outlet pressure tracking
- Pressure drop calculation
- Route map visualization

---

### 7. Reports & Exports ❌

**Missing:**
- Daily operations report generation
- Export to Excel/PDF
- Email scheduled reports
- Historical data comparison
- Trend analysis charts

---

## 📊 COMPLETE FEATURE MATRIX

| Feature | Data Structure | Seed Data | Display | Data Entry | Status |
|---------|---------------|-----------|---------|------------|--------|
| Facilities (Pipelines) | ✅ | ✅ | ✅ | ❌ | READ-ONLY |
| Facilities (Plants) | ✅ | ✅ | ✅ | ❌ | READ-ONLY |
| Pipeline Size & Nomenclature | ✅ | ✅ | ✅ | ❌ | READ-ONLY |
| Design Pressure | ✅ | ✅ | ✅ | ❌ | READ-ONLY |
| Inlet/Outlet Pressure | ✅ | ❌ | ❌ | ❌ | **MISSING** |
| Processing Plant Products | ✅ | ✅ | ❌ | ❌ | **NOT SHOWN** |
| Offtakers by Category | ✅ | ✅ | ✅ | ❌ | READ-ONLY |
| Offtaker Product Type | ❌ | ❌ | ❌ | ❌ | **MISSING** |
| Nominations (Planned) | ✅ | ✅ | ✅ | ❌ | READ-ONLY |
| Deliveries (Actual) | ✅ | ✅ | ✅ | ❌ | READ-ONLY |
| Variances | ✅ | ✅ | ✅ | ❌ | READ-ONLY |
| Metering Stations | ✅ | ❌ | ❌ | ❌ | **MISSING** |
| Daily Production Recording | ✅ | ❌ | ❌ | ❌ | **MISSING** |
| Demand Recording | ✅ | ❌ | ❌ | ❌ | **MISSING** |
| Flow Recording | ✅ | ❌ | ❌ | ❌ | **MISSING** |
| Pressure Recording | ✅ | ❌ | ❌ | ❌ | **MISSING** |
| Volume Recording | ✅ | ❌ | ❌ | ❌ | **MISSING** |
| Authentication | - | - | ❌ | ❌ | **MISSING** |
| Maker-Checker Workflow | - | - | ❌ | ❌ | **MISSING** |
| Audit Trail | - | - | ❌ | ❌ | **MISSING** |

---

## 🎯 PRIORITY FIXES

### Quick Wins (Can be done now)

1. **Show Processing Plant Products** - 30 mins
   - Add products column to Assets table
   - Display comma-separated product list

2. **Add Offtaker Product Type** - 1 hour
   - Add field to Offtaker interface
   - Populate seed data
   - Display in tables

3. **Populate Inlet/Outlet Pressure** - 1 hour
   - Add realistic pressure data for 3 pipelines
   - Display in Assets table as "Inlet/Outlet PSI"

### Medium Priority (Phase 2 Foundation)

4. **Metering Stations Screen** - 4 hours
   - Create `/metering` route
   - Add seed data for custody-transfer points
   - Build table view

5. **Pipeline Detail View** - 6 hours
   - Create `/pipelines/[id]` route
   - Show full specs, flow, pressure
   - Add simple chart

### Critical (Phase 2 Core)

6. **Data Entry System** - 2-3 weeks
   - Authentication (NGIC/NGML SSO)
   - Production recording forms
   - Nomination recording forms
   - Pipeline flow recording
   - Metering station recording
   - API endpoints (app/api/*)
   - Maker-checker workflow
   - Audit trail

---

## 📝 SUMMARY

**Current System:** ✅ Phase 1 Complete
- Excellent read-only dashboards
- All 10 screens operational
- Comprehensive data model
- NNPC branding applied

**Missing:** ❌ Phase 2 Not Started
- No data entry capability
- Staff cannot record operations
- No authentication
- No audit trail
- Some display gaps (products, pressures)

**Next Steps:**
1. Fix display gaps (products, pressures) - **2-3 hours**
2. Add metering stations screen - **4 hours**
3. Build complete data entry system - **2-3 weeks**

---

**Bottom Line:**
The system **HAS all the data structures** you need, but **LACKS the user interface** for staff to create/update records. It's a dashboard, not a data entry system yet.
