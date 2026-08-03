# NNPC Gas Platform - Live Demo Script

**Duration:** 15-20 minutes
**Audience:** User Department
**Presenter:** [Your Name]
**Date:** August 3, 2026

---

## 🎯 Demo Objectives

1. Show how data enters the system (multiple methods)
2. Demonstrate automatic validation
3. Show data flowing to reports
4. Prove reports match familiar Excel format
5. Highlight time savings and accuracy

---

## 📋 Pre-Demo Checklist

**Before the presentation:**

- [ ] Clear browser cache and localStorage
- [ ] Have sample CSV file ready: `Weekly_Production_W31.csv`
- [ ] Test all page links work
- [ ] Ensure build is up to date (`npm run build`)
- [ ] Have backup screenshots in case of technical issues
- [ ] Print PRESENTATION_DATA_FLOW.md as handout

**Sample Data Files Needed:**
- `Weekly_Production_W31.csv` (13 producers)
- `Daily_Offtake_Aug03.csv` (station data)

---

## 🎬 DEMO SCRIPT - Step by Step

### PART 1: Introduction (2 minutes)

**What to Say:**
> "Good morning everyone. Today I'm going to show you our new NNPC Gas Platform. This system solves a problem we've all experienced: spending hours manually creating Excel reports from scattered data sources. I'll demonstrate how we've automated this entire process while keeping the exact Excel format you're already familiar with."

**Action:** Show homepage/dashboard
- Navigate to: `http://localhost:3000`
- Point out main navigation menu

---

### PART 2: Data Entry - File Upload (5 minutes)

**What to Say:**
> "Let's start with how data enters the system. The first method is uploading CSV or Excel files - perfect for field operators who are already generating daily reports."

**Actions:**

1. **Navigate to Production Records**
   - Click: `Records` → `Production`
   - URL: `/records/production`

2. **Show Existing Data**
   - Point out the existing records table
   - Say: "Here you can see we already have some production records from previous weeks"

3. **Start Upload Process**
   - Click: **"Create New Record"** button
   - Say: "Two options appear: Upload or Manual Entry"
   - Click: **"Upload CSV/Excel"**

4. **Show Template Download**
   - Point to **"Download Template"** button
   - Say: "The system provides templates so you know exactly what format to use"
   - Click to download template

5. **Upload Sample File**
   - Drag and drop `Weekly_Production_W31.csv` into upload zone
   - Say: "Watch what happens when I upload this week's production data..."

6. **Show Validation**
   - System validates the file
   - Point out: "System automatically checks:
     - All required fields present
     - Volume values are positive
     - Producers exist in our database
     - No duplicate entries"

7. **Show Parsed Data**
   - Preview table appears with 13 records
   - Say: "13 producer records detected - CNL-Escravos, NEPL Utorogu, etc."
   - Point out: "Total volume, validation status"

8. **Confirm Upload**
   - Click: **"Confirm Upload"**
   - Success message appears
   - Say: "Data is now in the system and immediately available for reporting"

**Key Points to Emphasize:**
- ✅ No manual typing needed
- ✅ Automatic validation prevents errors
- ✅ Duplicate detection
- ✅ Same CSV format they already use

---

### PART 3: Data Entry - Manual Form (3 minutes)

**What to Say:**
> "For single records or when you don't have a file, we have manual entry forms."

**Actions:**

1. **Open Manual Entry**
   - Click: **"Create New Record"** again
   - Select: **"Manual Entry"**

2. **Fill Out Form** (Use realistic data)
   ```
   Date: 2026-08-03
   Facility: CNL-Escravos
   Facility Type: Processing Plant
   Operator: CNL
   Corridor: Western
   Production: 330.09 MMscf/d
   Pressure: 82.10 barg
   Remarks: Normal operations
   ```

3. **Show Validation**
   - Try entering invalid value (e.g., negative volume)
   - Say: "See how it prevents bad data before saving?"
   - Fix the value

4. **Save Record**
   - Click: **"Save Record"**
   - Record appears in table
   - Say: "Record saved with timestamp and user tracking"

**Key Points:**
- ✅ Mobile-friendly for field operators
- ✅ Dropdowns prevent typos
- ✅ Validation before save

---

### PART 4: The Reports - Show Data Flow (7 minutes)

**What to Say:**
> "Now let me show you the payoff - those 13 production records we just uploaded automatically flow into our regulatory reports. And these reports look EXACTLY like your current Excel templates."

**Actions:**

#### Report 1: MOR Supply Report

1. **Navigate to Report**
   - Click: `NNPC Reports` → `MOR Supply Report`
   - URL: `/nnpc-reports/mor-supply`

2. **Show Layout**
   - Say: "This is your Weekly MOR Supply report. Notice:
     - Left column: Gas Supply Situation
     - Right column: Allocation & Offtake
     - Material Balance automatically calculated
     - Same bordered Excel style"

3. **Point Out Data**
   - Show the 13 producers we just uploaded
   - Point to CNL-Escravos: "2,310.625 MMscf - this came from our CSV"
   - Show Total Supply calculation
   - Show Material Balance formula at bottom

4. **Change Week**
   - Use week picker to change date
   - Say: "Can view any historical week"

5. **Print Demo**
   - Click: **"Print"** button
   - Show print preview
   - Say: "PDF ready for regulatory submission"

**Key Point:** "This report used to take 2-3 hours to compile. Now it's instant."

---

#### Report 2: NGIC Daily Report

1. **Navigate**
   - Click: `NNPC Reports` → `NGIC Daily Report`
   - URL: `/nnpc-reports/ngic-daily`

2. **Show Hierarchy**
   - Say: "This is your NGIC Daily Gas Off-Take Report"
   - Point out:
     - Region → Customer Type → Station hierarchy
     - Transcorp Ughelli showing 193.54 MW
     - Pressure readings
     - Station status (ON STREAM, ON STANDBY)

3. **Show Groupings**
   - Scroll through regions (AOW, AOE)
   - Point out subtotals per customer type
   - Show grand total at bottom

4. **Highlight Auto-Calculations**
   - Say: "Notice how:
     - Megawatts calculated from gas offtake
     - Status derived from actual offtake
     - All totals auto-sum"

---

#### Report 3: NGML Daily Report

1. **Navigate**
   - Click: `NNPC Reports` → `NGML Daily Report`
   - URL: `/nnpc-reports/ngml-daily`

2. **Show Header Metrics**
   - Point to: "Allocation from NGIC: 353.55 MMscfd"
   - Point to: "NGML Nomination: 377.00 MMscfd"
   - Say: "These are the exact numbers from the Excel verification"

3. **Show Dual S/N Columns**
   - Say: "Notice the two S/N columns - exactly like your Excel template"

4. **Show Franchise Groupings**
   - Scroll to: "NGML-NIPCO UJV" section
   - Show member customers: LPL G/PWR, OLAM, BREEZE, etc.
   - Point out: "SUB -TOTAL 1" (with space before hyphen)

5. **Show Firm Customer**
   - Find SNG row
   - Say: "SNG is a FIRM customer - always gets 100% allocation"

---

#### Report 4: MOR Volume/Pressure Report

1. **Navigate**
   - Click: `NNPC Reports` → `MOR Volume/Pressure`
   - URL: `/nnpc-reports/mor-volume-pressure`

2. **Show Week Comparison**
   - Say: "This report shows week-on-week changes"
   - Point to CNL-Escravos:
     - Current Week: 330.09 mmscf/d @ 82.10 barg
     - Prior Week: 352.96 mmscf/d @ 81.83 barg
     - Variance: -22.87 mmscf/d

3. **Show Pressure Breach Detection** ⚠️ KEY FEATURE
   - Scroll to NEPL Oredo FST3
   - Say: "See this red highlighting? The system automatically detected a pressure breach"
   - Point out:
     - Current pressure: 38.19 barg
     - Contractual range: 55-70 barg
     - 31% below minimum
     - Critical breach indicator

4. **Show Breach Summary**
   - Scroll to bottom
   - Point to orange alert box
   - Say: "System found 6 out of 13 producers with pressure breaches
     - Automatically flagged
     - Severity levels (warning vs critical)
     - No manual checking needed!"

**Key Point:** "In your Excel template, someone has to manually compare each pressure against the contractual range. This system does it automatically and highlights the problems."

---

### PART 5: Complete Example Walkthrough (3 minutes)

**What to Say:**
> "Let me tie it all together with a complete example showing how Tuesday's data flows through the system."

**Actions:**

1. **Show Timeline** (use PRESENTATION_DATA_FLOW.md)
   - 08:00 AM: Field operator uploads production CSV
   - 08:05 AM: System validates (show validation screen)
   - 09:00 AM: Allocation team enters offtake (show manual form)
   - 10:00 AM: Reports auto-update (show report)

2. **Demonstrate Live Update**
   - Go back to `/records/production`
   - Create one more manual entry
   - Navigate to `/nnpc-reports/mor-supply`
   - Say: "Watch - the report updates immediately with the new data"

---

### PART 6: Benefits Summary (2 minutes)

**What to Say:**
> "Let me summarize what you've seen today."

**Display on screen or handout:**

### Time Savings
- ⏱️ **Before:** 2-3 hours per weekly report × 4 reports = 8-12 hours/week
- ⏱️ **After:** Data entry (15 min) + instant reports = 15 minutes/week
- 💰 **Savings:** ~95% time reduction

### Data Quality
- ✅ Automatic validation prevents errors
- ✅ Duplicate detection
- ✅ Pressure breach auto-detection
- ✅ Calculations can't be wrong (automated)
- ✅ Audit trail (who entered what, when)

### Compliance
- ✅ Reports match exact Excel format (no retraining needed)
- ✅ Print-ready PDFs
- ✅ Historical data preserved
- ✅ Regulatory requirements met

### Flexibility
- 📊 Upload CSV (for bulk data)
- ✍️ Manual entry (for single records)
- 📱 Mobile-friendly
- 🔄 Real-time updates

---

## ❓ ANTICIPATED QUESTIONS & ANSWERS

### Q: "What if we lose internet connection?"

**A:** "Good question. The system saves data locally in your browser, so you can continue working offline. When connection returns, it automatically syncs to the server."

**Demo:**
- Open browser DevTools → Network tab
- Go offline
- Create a record
- Show it saves to localStorage
- Go back online
- Show sync

---

### Q: "Can we still use our existing Excel files?"

**A:** "Absolutely! That's the beauty of the CSV upload. Keep using your current Excel workflow - just save as CSV and upload. No need to change how you work."

**Demo:**
- Show Excel file
- Save As → CSV
- Upload to platform

---

### Q: "What if we make a mistake?"

**A:** "Each record has Edit and Delete options with proper permissions. All changes are logged in an audit trail showing who changed what and when."

**Demo:**
- Go to records table
- Click Edit on a record
- Show change form
- Point out audit log

---

### Q: "How do we handle historical data?"

**A:** "We can bulk import your historical Excel files via CSV upload. I can work with your team to map the old data format to our system."

---

### Q: "Who can access what?"

**A:** "The system has role-based permissions:
- Field operators: Enter production data only
- Allocation team: Enter nominations and offtake
- Management: View all reports
- Admins: Full access

We'll configure this based on your organizational structure."

---

### Q: "What about training?"

**A:** "Training is minimal because:
1. Reports look exactly like your current Excel templates
2. CSV upload uses your existing file format
3. Manual forms are self-explanatory with dropdowns

We recommend:
- 1-hour overview session (what we're doing now)
- Hands-on practice sessions by department
- Quick reference guides
- Support during first 2 weeks"

---

## 🎯 CLOSING

**What to Say:**
> "Thank you for your time today. What you've seen is a platform that:
>
> 1. Saves 8-12 hours per week on report generation
> 2. Prevents data entry errors through automatic validation
> 3. Detects pressure breaches automatically
> 4. Uses the exact Excel format you're already familiar with
> 5. Provides an audit trail for compliance
>
> The best part? Your team doesn't have to change their workflow. Upload the same CSV files you're already creating, and get instant, accurate reports.
>
> Next steps:
> 1. Gather your feedback today
> 2. Run a pilot with one department (Production or Allocation)
> 3. Training sessions
> 4. Gradual rollout
>
> Questions?"

---

## 📁 HANDOUT MATERIALS

Provide printed copies of:
1. PRESENTATION_DATA_FLOW.md (full document)
2. DATA_SOURCE_ANALYSIS.md (technical overview)
3. Quick Start Guide (1-page):
   - How to upload CSV
   - How to create manual entry
   - How to access reports
   - Who to contact for support

---

## 🎥 BACKUP PLAN

**If live demo fails:**
1. Have screenshots ready in PowerPoint
2. Show video recording of demo
3. Walk through printed PRESENTATION_DATA_FLOW.md

**If internet is down:**
1. Use localhost (npm run dev)
2. Use previously saved data
3. Show cached reports

---

## 📊 SUCCESS METRICS TO MENTION

After implementation, we'll track:
- ⏱️ Time to generate reports (Target: <5 min vs current 2+ hours)
- ✅ Data accuracy (Target: 99%+)
- 📈 User adoption rate
- 🎯 Regulatory compliance
- 😊 User satisfaction scores

---

**END OF DEMO SCRIPT**

*Remember: Enthusiasm is contagious! Show confidence in the platform and emphasize how it makes THEIR jobs easier.*
