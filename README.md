# NNPC Gas Performance Platform

**Integrated Gas Midstream & Downstream Performance Platform**

A Next.js 14 application for monitoring and managing Nigeria's gas value chain from production through corridors to offtakers.

---

## 🎯 Overview

This platform provides a unified view of NNPC's gas operations across the entire value chain:

**Production → NGL Processing → Transmission → Distribution by Corridor → Delivery to Offtakers**

The system tracks:
- Gas production from fields and JVs
- NGL extraction at processing plants
- Transmission through NGIC pipelines (ELPS, OB3, AKK)
- Distribution by corridor (Eastern, Western, Northern, Lagos)
- Sales to main and sub-offtakers via NGML
- Performance metrics: UFG, flare, deferment, contracts, customer scoring

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Navigate to project
cd nnpc-gas-platform

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at **http://localhost:3000** (or 3001 if 3000 is in use)

### Build for Production

```bash
npm run build
npm run start
```

---

## 📊 Screens

### 1. Executive Overview (`/`)
- 8 KPI cards: Produced, Delivered, UFG %, Network utilisation, Flare intensity, Deferment, Receivables, DSO
- Supply waterfall (production → delivery with NGL extraction)
- Flare intensity trend
- Deferment attribution
- **Corridor filter** for drilling down by region

### 2. Volumes & Balancing (`/volumes`)
- Full production waterfall showing the complete chain
- Deliveries to power plants table
- NGL removed tracking
- Gas day balance reconciliation

### 3. Nominations & Gaps (`/nominations`)
- **6-stage cycle** per delivery point:
  - Nominated → Allocated → Forecast supply → Received → Offtaken
- **Two variance columns** (visually dominant):
  - Nomination variance (Nominated − Received)
  - Receipt variance (Received − Offtaken)
- Grouped by corridor
- The screen the nominations desk lives in

### 4. Capacity Utilisation (`/capacity`)
- Pipeline capacity tracking (nameplate / available / contracted / actual)
- Utilization % per asset
- Corridor-level rollup

### 5. Flare Monitoring (`/flare`)
- Flare register per facility
- Intensity %, penalty exposure (NGN & USD)
- 7-day trend chart

### 6. Deferment (`/deferment`)
- Cause-coded attribution (5 causes)
- Bad-actor asset ranking
- MTBF / MTTR metrics
- Value of deferred volume

### 7. Contract Performance (`/contracts`)
- DCQ delivery %
- Take-or-pay / Ship-or-pay
- DSO tracking
- RAG status (Red / Amber / Green)

### 8. Customer Scorecard (`/customers`)
- Composite score: DSO + Take reliability + Margin + Sector risk
- Ranked by performance
- Highlights dollar-paying industrials vs long-DSO power offtakers

### 9. Asset Registry (`/assets`)
- Master data foundation
- Filters: Pipelines, Processing plants, Power offtakers, Industrial offtakers
- Seed data from NNPC Gas Asset Inventory

### 10. Offtaker Hierarchy (`/offtakers`) — **NEW**
- Main offtakers with nested sub-offtakers (expand/collapse)
- Parent custody meter vs sum of sub-offtaker takes
- **Reconciliation status** (OK / Warning / Alert)
- Lagos LDC branches with downstream customers

---

## 🎨 Design System

### Color Palette (Meaning-Driven)

| Token | Hex | Usage |
|---|---|---|
| **Pine** | #0F4C42 | Primary, delivered gas, operational status |
| **Gasblue** | #2E6FA3 | Gas received into network |
| **Flare** | #D98E04 | Gas leaving stream (NGL, fuel gas, UFG) |
| **Alert** | #B3402A | Money at risk (receivables, deferment) |
| **Line** | #DCDAD2 | Borders, inert capacity |
| **Paper** | #FAFAF7 | Page background |
| **Ink** | #16211E | Text |

**Design Principles:**
- **Tabular monospace numerals** for all figures (operations room scanability)
- **Color encodes severity** — amber = wasted gas, clay = money at risk
- **Corridor tags** are consistent across all screens
- **Sentence case** everywhere

---

## 🏗️ Architecture

### Stack

- **Next.js 14** (App Router) — SSR, server components
- **TypeScript** — Type safety
- **Tailwind CSS** — Utility-first styling
- **Recharts** — Data visualization
- **Lucide React** — Icons

### Key Patterns

- **Server Components by default** — only charts are client components
- **Mock data layer** (`lib/data.ts`) — to be replaced with Route Handlers
- **Corridor dimension** — first-class filter throughout
- **Gas day** — 06:00–06:00 WAT
- **UFG is computed** — received − fuelGas − linePackChange − delivered

### Directory Structure

```
nnpc-gas-platform/
├── app/
│   ├── layout.tsx              # Root layout + Sidebar
│   ├── page.tsx                # Executive Overview
│   ├── volumes/page.tsx        # Volumes & Balancing
│   ├── nominations/page.tsx    # Nominations & Gaps
│   ├── capacity/page.tsx       # Capacity Utilisation
│   ├── flare/page.tsx          # Flare Monitoring
│   ├── deferment/page.tsx      # Deferment
│   ├── contracts/page.tsx      # Contract Performance
│   ├── customers/page.tsx      # Customer Scorecard
│   ├── assets/page.tsx         # Asset Registry
│   ├── offtakers/page.tsx      # Offtaker Hierarchy
│   └── globals.css             # Design system
├── components/
│   ├── Sidebar.tsx             # 10-item navigation
│   ├── Header.tsx              # Gas day indicator
│   ├── CorridorFilter.tsx      # Shared filter component
│   └── KPICard.tsx             # Reusable KPI card
├── lib/
│   ├── types.ts                # TypeScript interfaces
│   ├── data.ts                 # Mock data (replace with API)
│   └── utils.ts                # Formatting utilities
└── tailwind.config.ts          # Custom color palette
```

---

## 📝 Data Model

### Core Entities

**Corridor** — Eastern | Western | Northern | Lagos

**Asset** — Pipelines, processing plants, metering stations

**Offtaker** — Main offtakers with optional `parentOfftakerId` for hierarchy

**GasDayBalance** — Production → NGL → Transmission → Delivery chain

**OfftakerFlow** — 6-stage cycle with variances

**DefermentEvent** — Cause-coded with MTBF/MTTR

**Contract** — DCQ, take-or-pay, DSO, RAG status

**CustomerScore** — Composite metric (DSO, reliability, margin, risk)

See `lib/types.ts` for complete definitions.

---

## 🔄 Next Steps (Phase 2)

### 1. API Integration
Replace `lib/data.ts` with Route Handlers (`app/api/*/route.ts`) that query the governed data platform.

### 2. Authentication
Add `middleware.ts` for NNPC Active Directory / SSO (SAML 2.0 or OIDC).

### 3. Write Paths
Implement maker-checker workflow for manual entry (deferment events, flare estimates, station logs).

### 4. Deployment
- Environment variables: `NEXT_PUBLIC_API_URL`, auth config
- Deploy to Vercel / Azure / On-prem
- Connect to governed data platform

### 5. AI Agent Layer
Only after governed data is connected. Requirements:
- Answers only from governed data
- Cites figures with lineage
- Permission-scoped (users can't query beyond their role)

---

## 🛡️ Security & Governance

- **NGIC/NGML entity segregation** enforced on server (not in browser)
- **Corridor-level permissions** ready for SSO integration
- **No write to SCADA** — ingestion is one-directional from DMZ replica
- **Audit trail** for all manual entries (when implemented)

---

## 📌 Key Features

✅ Production as starting point (not just transmission)
✅ NGL aggregation tracking
✅ Corridors as first-class dimension
✅ 6-stage nomination cycle with variances
✅ Offtaker hierarchy (main→sub) with reconciliation
✅ Cause-coded deferment with bad-actor ranking
✅ RAG contract status
✅ Customer composite scoring
✅ Tabular numerals throughout
✅ Color encodes meaning

---

## 📚 Reference

**Build Spec:** NNPC Gas Performance Platform Frontend Build Specification (Sections 1-11)

**Seed Data:** NNPC_Gas_Asset_Inventory.xlsx (equivalent in `lib/data.ts`)

**Subsidiaries:** NGIC (transmission), NGML (sales), NLNG (LNG export)

**Corridors:** Eastern (OB3), Western (ELPS), Northern (AKK), Lagos (LDC networks)

---

## 📧 Support

For detailed implementation notes, see `BUILD_STATUS.md`

---

**Status:** ✅ All 10 screens complete — Prototype ready for API integration and deployment
