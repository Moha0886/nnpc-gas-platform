# Executive Dashboard Analysis vs Sample Reports

**Date:** August 3, 2026
**Reference:** Sample reports.pptx.pdf (2 pages)

---

## 📊 Executive Dashboard Requirements (From Sample Reports)

### Page 1: Domestic Market Performance - Key Elements

| Element | Sample Report Has | Our Current Dashboard | Status |
|---------|-------------------|----------------------|--------|
| **Big Hero Numbers** | 7.78Bcfd, 1.44Bcfd, 1.25Bcfd (huge, prominent) | KPI cards with numbers | ⚠️ Need BIGGER |
| **Production Breakdown** | 25% Domestic, 41% Export, 23% Reinjection, 8% Flared (visual boxes) | ✅ Has in value chain | ✅ GOOD |
| **Week-over-Week Trends** | "4.9% w/w ▲" with arrows prominently shown | Has trend % in small text | ⚠️ Need MORE PROMINENT |
| **ELPS Pressure Chart** | Line chart showing pressure @ WGTP and Itoki over time | ❌ MISSING | ❌ NEED TO ADD |
| **Power Market Charts** | Bar charts: Allocation vs Offtake (West/North and Eastern) | ❌ Not on homepage | ❌ NEED TO ADD |
| **GBI Charts** | Trend lines showing Nomination/Allocation/Actual Offtake | ❌ MISSING | ❌ NEED TO ADD |
| **NGML Gas Sales** | Daily bar chart (7-day view) | ❌ MISSING | ❌ NEED TO ADD |
| **Capacity Utilization Callouts** | "Okpai xx95MW @xx1%; Afam VI xxx.50MW" | Has capacity metrics but buried | ⚠️ Need PROMINENT |

### Page 2: National Daily Average Production - Key Elements

| Element | Sample Report Has | Our Current Dashboard | Status |
|---------|-------------------|----------------------|--------|
| **Huge Gauge/Speedometer** | Massive circular gauge showing 7,796 mmscfd | ❌ MISSING | ❌ NEED TO ADD |
| **Production w/w Change** | "+242 mmscfd" prominently displayed with green arrow | Has in KPI cards (small) | ⚠️ Need BIGGER |
| **Gas Utilization Boxes** | 4 clean boxes: Domestic 24%, Export 43%, Re-Injection 24%, Flared 6% | Has in value chain (good) | ✅ GOOD |
| **Production Contribution Chart** | Bar chart: JV 57%, PSC 25%, NEPL+IND 18% | ❌ MISSING | ❌ NEED TO ADD |
| **Sub-category Boxes** | Power (723 ▲65), Industries (854 ▼33), WAGP (124 ▲8) | Buried in charts | ⚠️ Need PROMINENT BOXES |
| **Highlights Section** | Bullet points with key insights and drivers | ❌ MISSING | ❌ NEED TO ADD |
| **Line Pack Callout** | "~3% of National Daily Average Production" | Has material balance | ⚠️ Need CALLOUT |

---

## ✅ What We Currently Have (Good)

### Homepage (app/page.tsx) - Executive Overview

**GOOD Elements:**
1. ✅ **Cross-BU Value Chain** - 5-step visualization (NGPIS → Processing → NGIC → NGML → Delivery)
2. ✅ **KPI Cards** - Produced, Delivered, UFG%, Network Utilization
3. ✅ **Capacity Utilization Metrics** - Facility, Customer, Supply performance
4. ✅ **Filters** - Time range, Corridor, Sector
5. ✅ **Charts** - Supply Waterfall, Deferment Attribution, Customer Performance
6. ✅ **Time-series chart** - Customer Request vs Delivery (14-day trend)

**NEEDS IMPROVEMENT:**
1. ⚠️ **Numbers too small** - Need HUGE hero numbers like sample (e.g., "7.78Bcfd" should be massive)
2. ⚠️ **Missing week-over-week** - Sample shows "4.9% w/w ▲" prominently
3. ⚠️ **Too much detail** - Executive dashboards should be cleaner, less cluttered
4. ❌ **Missing ELPS Pressure Chart** - Critical for gas operations
5. ❌ **Missing GBI Charts** - Gas Balance Index is key executive metric
6. ❌ **Missing Production Contribution** - JV vs PSC vs NEPL+IND breakdown
7. ❌ **Missing gauge/speedometer** - Sample has prominent circular gauge

### Operations Dashboards

**app/operations/production-dashboard/page.tsx** - ✅ **GOOD** (Operational Level)
- This is appropriately detailed for operations staff
- Editable tables for daily data entry
- Good for NGPIS team

**app/operations/daily-situation/page.tsx** - ✅ **GOOD** (Operational Level)
- Editable forms for NGIC daily reporting
- Appropriate detail level for operators

---

## 🎯 Recommendations

### Priority 1: Create Executive Weekly Dashboard (NEW PAGE)

**Route:** `/executive-weekly` or make it the new homepage

**Must Have:**
1. **Hero Section** - Massive numbers with w/w trends
   ```
   ┌─────────────────────────────────────────────┐
   │  National Daily Average Production          │
   │  ┌───────────────┐                         │
   │  │   [GAUGE]     │     7,796                │
   │  │   7,796       │     mmscfd               │
   │  │   mmscfd      │     ▲ 242 (3.2% w/w)    │
   │  └───────────────┘                         │
   └─────────────────────────────────────────────┘
   ```

2. **Gas Utilization - 4 Box Layout**
   ```
   ┌──────────┬──────────┬──────────┬──────────┐
   │ Domestic │ Export   │ Re-Inj   │ Flared   │
   │ 1,835    │ 3,352    │ 1,839    │ 471      │
   │ 24%      │ 43%      │ 24%      │ 6%       │
   │ ▲59      │ ▲92      │ ▲136     │ ▼4       │
   └──────────┴──────────┴──────────┴──────────┘
   ```

3. **Production Contribution Chart**
   - Horizontal bar chart
   - JV (57%), PSC (25%), NEPL+IND (18%)
   - Current vs Previous week comparison

4. **Sub-categories with Trends**
   ```
   Power: 723 MMscfd ▲65 (9.9% w/w)
   Industries: 854 MMscfd ▼33 (3.7% w/w)
   WAGP: 124 MMscfd ▲8 (6.9% w/w)
   ```

5. **ELPS Section**
   ```
   ┌─────────────────────────────────────┐
   │ ELPS Gas Supply: 1.44Bcfd (0.7% w/w)│
   │ Offtake (ELPS): 1.25Bcfd (3.7% w/w) │
   │ [Pressure Chart: WGTP & Itoki]      │
   └─────────────────────────────────────┘
   ```

6. **Power Market Performance**
   ```
   ┌─────────────────┬─────────────────┐
   │ West/North      │ Eastern         │
   │ [Bar Chart]     │ [Bar Chart]     │
   │ Allocation vs   │ Allocation vs   │
   │ Offtake         │ Offtake         │
   │ GBI: XXX        │ GBI: XXX        │
   └─────────────────┴─────────────────┘
   ```

7. **Highlights Section**
   - 3-5 bullet points
   - Key drivers of changes
   - Auto-generated insights

8. **NGML Gas Sales**
   - Daily bar chart (last 7 days)
   - Allocation vs Offtake
   - Running total

### Priority 2: Enhance Current Homepage

If keeping current structure, make these changes to `app/page.tsx`:

1. **Make hero numbers MASSIVE**
   - 3x current size
   - Add w/w% prominently
   - Use colored arrows (green up, red down)

2. **Add missing sections:**
   - ELPS Pressure Chart (line chart, dual axis)
   - Production Contribution Chart (JV/PSC/NEPL+IND)
   - Power Market Allocation vs Offtake
   - GBI trend charts
   - Highlights/Insights section

3. **Simplify** - Remove or collapse:
   - Hide filter panel by default
   - Move detailed charts to separate "Detailed Analytics" page
   - Keep only executive-level visuals on homepage

### Priority 3: Create "Detailed Analytics" Page

Move current detailed content to `/analytics/detailed`:
- Customer capacity performance (detailed bar chart)
- Time-series trends (14-day)
- Supply waterfall (detailed)
- Deferment attribution

---

## 🎨 Visual Style Guidelines (From Sample Reports)

### Typography
- **Hero Numbers:** 48-72px, bold, colored
- **w/w Trends:** 24-36px with arrows, colored (green/red)
- **Labels:** 14-18px, gray-600
- **Section Headers:** 20-24px, bold, dark

### Colors (NNPC Branding)
- **Primary Green:** #1B5E3E (production, NGPIS)
- **Secondary Teal:** #2B5F75 (processing, NGIC)
- **Accent Gold:** #F9A825 (highlights, warnings)
- **Success Green:** #10B981 (positive trends)
- **Alert Red:** #EF4444 (negative trends, breaches)
- **Gray Neutral:** #6B7280 (labels, secondary text)

### Layout
- **Maximum 2 columns** for executive view
- **Big boxes** with single focus
- **White space** - not cluttered
- **Borders** - subtle, not heavy
- **Icons** - minimal, only when needed

### Charts
- **Simple** - Bar, line, gauge only
- **Large** - Minimum 300px height
- **Colored** - Use NNPC brand colors
- **Clean axes** - No clutter
- **Tooltips** - Detailed info on hover

---

## 📋 Implementation Checklist

### Phase 1: Executive Weekly Dashboard (NEW - Highest Priority)
- [ ] Create new route: `/executive-weekly` or update `/`
- [ ] Add massive gauge component for production
- [ ] Add 4-box gas utilization layout
- [ ] Add production contribution chart (JV/PSC/NEPL+IND)
- [ ] Add sub-category boxes (Power, Industries, WAGP) with trends
- [ ] Add ELPS section with pressure chart
- [ ] Add Power Market charts (West/North & Eastern)
- [ ] Add GBI trend charts
- [ ] Add NGML Gas Sales daily chart
- [ ] Add Highlights/Insights section
- [ ] Add w/w trend arrows and colors
- [ ] Make all numbers HUGE and prominent
- [ ] Clean, uncluttered layout

### Phase 2: Homepage Enhancement (If Keeping Current)
- [ ] Increase hero number size (3x)
- [ ] Add w/w trends prominently with arrows
- [ ] Add ELPS Pressure Chart component
- [ ] Add Production Contribution Chart
- [ ] Add Power Market Allocation charts
- [ ] Add GBI Charts
- [ ] Simplify - hide filters by default
- [ ] Add auto-generated highlights section

### Phase 3: Separation of Concerns
- [ ] Move detailed analytics to `/analytics/detailed`
- [ ] Keep executive homepage clean and focused
- [ ] Ensure operations dashboards stay detailed (good as-is)
- [ ] Add navigation: Executive View | Detailed Analytics | Operations

---

## 🎯 Success Criteria

Executive dashboard is successful when:

1. ✅ **Management can understand in 30 seconds**
   - What's the production? (big number)
   - Is it up or down? (w/w trend)
   - Where is gas going? (utilization boxes)
   - Any issues? (highlights/alerts)

2. ✅ **No scrolling needed** for key metrics
   - All critical info above the fold
   - Detailed charts below or on separate page

3. ✅ **Matches familiar format**
   - Looks like the sample reports
   - Same terminology
   - Same visual style

4. ✅ **Actionable insights**
   - Highlights section tells the story
   - Automatic flagging of issues
   - Clear trends and drivers

---

## 📊 Sample Data Requirements

To populate the executive dashboard, we need:

```typescript
interface ExecutiveWeeklyData {
  // Hero Metrics
  totalProduction: number; // mmscfd
  productionChange: number; // mmscfd (w/w)
  productionChangePercent: number; // %

  // Gas Utilization
  domestic: { volume: number; change: number; changePercent: number };
  export: { volume: number; change: number; changePercent: number };
  reinjection: { volume: number; change: number; changePercent: number };
  flared: { volume: number; change: number; changePercent: number };

  // Production Contribution
  contributionJV: { current: number; previous: number; percentage: number };
  contributionPSC: { current: number; previous: number; percentage: number };
  contributionNEPL: { current: number; previous: number; percentage: number };

  // Sub-categories
  power: { volume: number; change: number; changePercent: number };
  industries: { volume: number; change: number; changePercent: number };
  wagp: { volume: number; change: number; changePercent: number };

  // ELPS
  elpsSupply: { volume: number; changePercent: number };
  elpsOfftake: { volume: number; changePercent: number };
  elpsPressure: Array<{
    date: string;
    wgtp: number;
    wgtpMin: number;
    itoki: number;
    itokiMin: number;
  }>;

  // Power Markets
  powerWestNorth: Array<{
    station: string;
    allocation: number;
    offtake: number;
  }>;
  powerEastern: Array<{
    station: string;
    allocation: number;
    offtake: number;
  }>;

  // GBI
  gbiWestNorth: number;
  gbiEastern: number;
  gbiTrend: Array<{
    date: string;
    nomination: number;
    allocation: number;
    offtake: number;
  }>;

  // NGML Gas Sales
  ngmlSales: Array<{
    date: string;
    allocation: number;
    offtake: number;
  }>;

  // Highlights
  highlights: string[]; // Auto-generated insights
}
```

---

## 🚀 Next Steps

**Immediate Action:**
1. Create new executive dashboard page matching sample reports
2. Use data from `lib/nnpc-operational-data.ts`
3. Add missing chart components (gauge, ELPS pressure, GBI)
4. Test with sample data
5. Demo to user department

**Would you like me to:**
- A) Create the new executive weekly dashboard page now?
- B) Enhance the current homepage first?
- C) Both - create new page AND enhance homepage?

I recommend **Option A** - create a brand new executive dashboard that exactly matches your sample reports. This gives you both the clean executive view AND keeps the detailed homepage for power users.
