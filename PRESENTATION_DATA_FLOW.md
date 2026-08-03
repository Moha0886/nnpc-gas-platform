# NNPC Gas Platform - Data Capture & Flow Presentation

**Prepared for:** User Department Presentation
**Date:** August 3, 2026
**Purpose:** Demonstrate how all operational data is captured, processed, and reported

---

## 🎯 Presentation Overview

This document demonstrates the **complete data journey** in the NNPC Gas Platform:
1. **How data enters the system** (Multiple capture methods)
2. **Where data is stored** (Data structures and organization)
3. **How data is processed** (Validation and calculations)
4. **How data is reported** (The 4 Excel-style reports)

---

## 📥 PART 1: DATA CAPTURE - How We Get the Data In

The platform supports **multiple data entry methods** to accommodate different operational workflows:

### Method 1: File Upload (CSV/Excel) ⚡ FASTEST

**Location:** All `/records/*` pages have upload functionality

**Supported Files:**
- ✅ CSV files (.csv)
- ✅ Excel files (.xlsx, .xls)
- ✅ Drag-and-drop or browse

**How it works:**
1. User clicks **"Create New Record"** button
2. Selects **"Upload CSV/Excel"** option
3. System shows upload modal with:
   - File format requirements
   - Sample CSV template download
   - Drag-drop zone
4. File is parsed and validated
5. Preview shows detected records
6. User confirms and data is saved

**Example Upload Flow:**
```
User → Clicks "Create New Record"
     → Selects "Upload CSV/Excel"
     → Drops file: "Weekly_Production_W31.xlsx"
     → System parses: 13 producer records detected
     → Preview shows: CNL-Escravos, NEPL Utorogu, etc.
     → User confirms → Data saved ✓
```

**Pages with Upload:**
- `/records/production` - Producer volumes
- `/records/nominations` - Customer nominations
- `/records/deliveries` - Delivery volumes
- `/records/flows` - Pipeline flows
- `/records/volumes` - Transmission volumes
- `/records/deferment` - Deferment events

---

### Method 2: Manual Entry Form 📝 DETAILED

**Location:** All `/records/*` pages (second option in modal)

**How it works:**
1. User clicks **"Create New Record"**
2. Selects **"Manual Entry"**
3. Fills out comprehensive form with:
   - Date/time picker
   - Dropdown selections (facility, operator, corridor)
   - Number inputs (volumes, pressures)
   - Text fields (remarks, status)
4. Client-side validation checks values
5. User submits → Data saved

**Example Manual Entry Form (Production):**
```
┌─────────────────────────────────────────┐
│  Create Production Record               │
├─────────────────────────────────────────┤
│  Date:           [2026-08-03]          │
│  Facility:       [CNL-Escravos ▼]      │
│  Facility Type:  [Processing Plant ▼]  │
│  Operator:       [CNL]                 │
│  Corridor:       [Western ▼]           │
│  Production:     [330.09] MMscf/d      │
│  Pressure:       [82.10] barg          │
│  Remarks:        [Normal operations]   │
│  [Cancel]              [Save Record]   │
└─────────────────────────────────────────┘
```

---

### Method 3: Daily Operations Dashboard 📊 REAL-TIME

**Location:** `/operations/daily-situation`

**How it works:**
- **Live operational view** showing current gas day
- Real-time metrics update as data flows in
- Quick-entry cards for rapid updates
- Visual indicators for alerts and anomalies

**Captures:**
- Current production levels
- Pipeline pressures
- Customer offtake
- System alerts

---

## 🗄️ PART 2: DATA STORAGE - Where Data Lives

### Data Organization Structure

```
NNPC Gas Platform Data Architecture
│
├── Master Data (Reference Tables)
│   ├── Producers (13 Western, 8 Eastern)
│   ├── Offtakers/Customers (50+ stations)
│   ├── Pipelines (68+ segments)
│   ├── Franchises (NGML-NIPCO UJV, etc.)
│   └── Allocation Sources (Producer→Customer mapping)
│
├── Operational Data (Time-Series)
│   ├── Daily Production Records
│   │   └── { date, producerId, volume, pressure, status }
│   │
│   ├── Daily Allocation/Offtake Records
│   │   └── { date, offtakerId, allocation, offtake, megawatts }
│   │
│   ├── Weekly Production Summaries
│   │   └── { week, producerId, totalVolume, avgPressure }
│   │
│   ├── Nominations
│   │   └── { date, customerId, nominated, allocated }
│   │
│   └── Pipeline Flows
│       └── { date, pipelineId, volume, inletP, outletP }
│
└── Computed Data (Aggregations)
    ├── Material Balance (Supply - Offtake)
    ├── GBI (Gas Balance Index)
    ├── Zone Totals (RGD Lagos, etc.)
    └── Performance Metrics
```

### Key Data Files

| File | Purpose | What It Contains |
|------|---------|------------------|
| `lib/types.ts` | Type definitions | All data structures |
| `lib/nnpc-seed-data.ts` | Master data | 13 producers, 50+ customers |
| `lib/nnpc-operational-data.ts` | Sample operational | Production breakdown, ELPS data |
| `lib/pipeline-network-data.ts` | Network assets | 68+ pipeline segments |
| `lib/nomenclature.ts` | Standard terms | GDZ names, customer types, status |

---

## 🔄 PART 3: DATA PROCESSING - How Data is Validated & Calculated

### Step 1: Data Validation ✓

When data enters the system (upload or manual):

```typescript
// Example: Production Record Validation
function validateProductionRecord(record) {
  ✓ Check date is valid gas day (06:00-06:00 WAT)
  ✓ Verify producer exists in master list
  ✓ Confirm volume > 0 and < plant capacity
  ✓ Check pressure within contractual range
  ✓ Validate corridor assignment
  ✓ Ensure no duplicate records for same day
}
```

**Validation Rules:**
- ✅ Required fields must be filled
- ✅ Volumes must be positive numbers
- ✅ Pressures must be within contractual ranges
- ✅ Dates must be valid gas days
- ✅ Facilities must exist in master data

**What Happens on Validation Failure:**
- ❌ Record is flagged with error
- 📝 User sees specific error message
- 🔧 User can correct and resubmit

---

### Step 2: Automated Calculations 🧮

The system automatically computes:

**1. Material Balance / Line Pack**
```
Material Balance = Total Supply - Total Offtake
Example: 9,847.964 MMscf - 8,351.358 MMscf = 1,496.606 MMscf
```

**2. Gas Balance Index (GBI)**
```
GBI = Actual Offtake / Allocation
Example: 1,185.2 / 1,250.5 = 0.948 (94.8%)
```

**3. Pressure Breach Detection**
```
IF current_pressure < contractual_min OR current_pressure > contractual_max
  THEN flag as BREACH
  CALCULATE severity (warning vs critical)
  GENERATE alert
```

**4. Week-on-Week Variance**
```
Volume Variance = Current Week - Prior Week
Variance % = (Variance / Prior Week) × 100
Trend = Up/Down/Stable
```

**5. Zone Aggregations**
```
RGD Lagos Total = SUM(all customers in Lagos zone)
Western Network Total = SUM(all Western producers)
```

---

## 📊 PART 4: DATA REPORTING - The 4 Excel-Style Reports

All captured data flows automatically into these regulatory reports:

### Report 1: NGIC Daily Gas Off-Take Report
**Route:** `/nnpc-reports/ngic-daily`

**Data Sources:**
- Master: Offtakers (Region, Customer Type, Station Name)
- Daily: Allocation, Offtake, Pressure, Megawatts, Status

**What Gets Displayed:**
```
Region: AOW
  Customer Type: NPDC Power Customers
    Station: Transcorp Ughelli
      Allocation: 51.548 Mmscfd
      Offtake: 51.548 Mmscfd
      Pressure: 52/34 bar
      Megawatts: 193.54 MW
      Status: STATION ON STREAM
```

**Data Flow:**
```
Daily Entry → Validation → Storage → Aggregation by Region/Type → NGIC Report
```

---

### Report 2: MOR Supply, Allocations & Offtake
**Route:** `/nnpc-reports/mor-supply`

**Data Sources:**
- Master: 13 Western Network Producers
- Weekly: Producer volumes (7-day totals)
- Master: Allocation sources (which producers supply which customers)
- Weekly: Customer allocation and offtake

**What Gets Displayed:**

**Left Column - Gas Supply:**
```
CNL-Escravos: 2,310.625 MMscf
NEPL Utorogu: 1,286.12 MMscf
...
Total Supply: 9,847.964 MMscf
```

**Right Column - Allocation & Offtake:**
```
GASLINK, FALCON: 1,250.5 → 1,185.2 MMscf
Source: CNL, NPDC JV
...
Material Balance: 1,496.606 MMscf
```

**Data Flow:**
```
Daily Production → Weekly Aggregation → Supply Column
Daily Offtake → Weekly Aggregation → Offtake Column
Material Balance = AUTO CALCULATED
```

---

### Report 3: NGML Daily Gas Situation Report
**Route:** `/nnpc-reports/ngml-daily`

**Data Sources:**
- System: NGIC Allocation (total to NGML)
- Daily: Customer nominations
- Master: Franchise groupings (NGML-NIPCO UJV members)
- Daily: Customer allocation and offtake

**What Gets Displayed:**

**Header Metrics:**
```
Allocation from NGIC: 353.55 MMscfd
NGML Nomination: 377.00 MMscfd
```

**RGD Zones (Subtotal 1):**
```
REGIONAL GAS DISTRIBUTION LAGOS: 85.2 → 78.5 MMscfd
REGIONAL GAS DISTRIBUTION CALABAR: 62.0 → 57.3 MMscfd
...
SUB -TOTAL 1: 231.5 → 213.8 MMscfd
```

**Industrial Customers:**
```
GASLINK: 95.0 design | 82.47 nom | 82.47 alloc | 56.80 offtake
SNG (FIRM): 10.0 | 10.0 | 10.0 | 10.0 [100% guaranteed]
```

**Franchise Groups:**
```
NGML-NIPCO UJV:
  - LPL G/PWR
  - OLAM
  - BREEZE
  - NESTLE
  - AIML
```

**Data Flow:**
```
Daily Nominations → Allocation Engine → Curtailment if needed
Daily Offtake → Performance Tracking
Franchise Master → Grouping Display
```

---

### Report 4: MOR Volume & Pressure Overview
**Route:** `/nnpc-reports/mor-volume-pressure`

**Data Sources:**
- Weekly: Producer volumes (current + prior week)
- Weekly: Producer pressures (current + prior week)
- Master: Contractual pressure ranges

**What Gets Displayed:**
```
Producer: CNL-Escravos
  Current Week: 330.09 mmscf/d @ 82.10 barg
  Prior Week: 352.96 mmscf/d @ 81.83 barg
  Variance: -22.87 mmscf/d | +0.26 barg
  Contractual Range: 80-85 barg
  Status: ✓ Within range
  Remark: Volume dropped with slight improved pressure
```

**Automatic Breach Detection:**
```
IF pressure < min OR pressure > max
  → Highlight row (yellow/red)
  → Show breach icon (⚠️/🚨)
  → Calculate severity
  → Add to breach summary
```

**Data Flow:**
```
Daily Pressure Readings → Weekly Averages → Week-on-Week Comparison
Contractual Ranges → Breach Detection → Alert Generation
```

---

## 🔁 COMPLETE DATA LIFECYCLE - End-to-End Example

### Scenario: Recording Tuesday's Production

**08:00 AM - Field Operator Submits Data**
```
Location: Escravos Gas Plant
Action: Upload daily production CSV
File: "Escravos_Daily_2026-08-03.csv"
Contains: Volume, pressure, status for CNL-Escravos
```

**08:05 AM - System Validates**
```
✓ Volume: 330.09 mmscf/d [Valid - within capacity]
✓ Pressure: 82.10 barg [Valid - within 80-85 range]
✓ Date: 2026-08-03 [Valid gas day]
→ Record APPROVED
```

**08:10 AM - Data Stored**
```
Saved to: Daily Production Records
Linked to: Producer "CNL-Escravos" (prod-w-001)
Status: Approved
Available for: Reporting
```

**09:00 AM - NGIC Allocation Team Enters Offtake**
```
Location: /records/deliveries
Action: Manual entry for Transcorp Ughelli
Allocation: 51.548 Mmscfd
Actual Offtake: 51.548 Mmscfd
Pressure: 52/34 bar
Megawatts: 193.54 MW
Status: STATION ON STREAM
```

**10:00 AM - Reports Auto-Update**
```
✓ NGIC Daily Report: Shows today's offtake
✓ MOR Volume: Updates CNL-Escravos current week average
✓ Material Balance: Recalculated with new supply/offtake
```

**Friday 06:00 AM - Week Closes**
```
System automatically:
  → Aggregates 7 days of data
  → Calculates weekly totals
  → Generates MOR Supply Report (weekly)
  → Generates MOR Volume/Pressure Report
  → Archives week as "2026-W31"
```

**Monday 09:00 AM - Management Review**
```
Team opens reports:
  → NGIC Daily: Last Friday's snapshot
  → MOR Supply: Full week W31 totals
  → MOR Pressure: Week-on-week comparison
  → NGML Daily: Last Friday's allocations

All reports print to PDF for regulatory submission ✓
```

---

## 📱 USER ROLES & ACCESS

Different departments have different data entry points:

| Department | Data Entry Pages | Reports Access |
|------------|-----------------|----------------|
| **Production** | `/records/production` | MOR Volume/Pressure |
| **Transmission** | `/records/flows`, `/records/volumes` | Material Balance |
| **Allocation** | `/records/nominations`, `/records/deliveries` | NGIC, NGML Daily |
| **Operations** | `/operations/daily-situation` | All Reports |
| **Management** | View only | All Reports |

---

## 🎯 KEY BENEFITS FOR PRESENTATION

### 1. Multiple Entry Methods = Flexibility
- Excel users: Upload CSV files
- Field operators: Mobile-friendly manual forms
- Control room: Real-time dashboard updates

### 2. Automatic Validation = Data Quality
- No manual calculations
- Pressure breaches auto-detected
- Duplicate prevention
- Error flagging before save

### 3. Zero Manual Report Generation
- Reports update automatically as data enters
- Excel-style formatting (familiar to staff)
- Print-ready PDFs
- Historical data preserved

### 4. Audit Trail
- Every entry timestamped
- User tracking (who entered what)
- Status workflow (pending → approved)
- Change history

### 5. Real-Time Visibility
- Management sees data as it's entered
- Alerts for breaches and anomalies
- Performance dashboards
- Trend analysis

---

## 📋 PRESENTATION FLOW RECOMMENDATION

### Slide 1: Introduction
"Today we'll show you how the NNPC Gas Platform captures every piece of operational data and transforms it into regulatory reports"

### Slide 2: The Problem (Before)
- Manual Excel entry
- Risk of errors
- Time-consuming
- Hard to validate
- Difficult to aggregate

### Slide 3: Our Solution - Data Entry
**DEMO:** Show `/records/production` page
- Click "Create New Record"
- Show both upload and manual options
- Upload sample CSV
- Show validation

### Slide 4: Data Storage & Processing
**DEMO:** Show DATA_SOURCE_ANALYSIS.md diagram
- Master data (producers, customers)
- Daily operational data
- Automatic calculations

### Slide 5: The Reports
**DEMO:** Show all 4 reports
- NGIC Daily
- MOR Supply
- NGML Daily
- MOR Volume/Pressure

### Slide 6: Complete Example
Walk through Tuesday production recording example (from this document)

### Slide 7: Benefits
- Time savings
- Data accuracy
- Audit compliance
- Real-time visibility

### Slide 8: Next Steps
- Pilot with one department
- Training sessions
- Full rollout

---

## 🎬 LIVE DEMO CHECKLIST

For the actual presentation, demonstrate:

- [ ] Upload CSV file to `/records/production`
- [ ] Show validation of uploaded data
- [ ] Create manual entry in `/records/deliveries`
- [ ] Open NGIC Daily Report - show data appears
- [ ] Open MOR Supply Report - show weekly totals
- [ ] Show pressure breach detection in MOR Volume/Pressure
- [ ] Print report to PDF
- [ ] Show data persistence (reload page, data still there)

---

## 📞 SUPPORT & QUESTIONS

**Common Questions to Prepare For:**

**Q: What if we lose internet connection?**
A: Data saved locally, syncs when connection restored

**Q: Can we still use our Excel files?**
A: Yes! Upload CSV/Excel directly. No need to change workflow.

**Q: How do we fix mistakes?**
A: Edit/delete records with proper permissions and audit trail

**Q: What about historical data?**
A: Can bulk import past records via CSV upload

**Q: Who can access what?**
A: Role-based permissions by department

---

## 🎯 SUCCESS METRICS

After implementation, we'll track:
- ✅ Time to generate weekly reports (Target: <5 minutes vs. current 2+ hours)
- ✅ Data entry errors (Target: <1%)
- ✅ Report generation time (Target: Instant)
- ✅ User satisfaction (Target: >90%)
- ✅ Regulatory compliance (Target: 100%)

---

**END OF PRESENTATION DOCUMENT**

*This platform transforms weeks of manual Excel work into minutes of automated reporting while ensuring data quality and regulatory compliance.*
