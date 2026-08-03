# Live Demo Pre-Flight Checklist

**Demo Date:** _______________
**Presenter:** _______________
**Time:** _______________

---

## ✅ 24 Hours Before Demo

- [ ] **Run build to ensure no errors**
  ```bash
  cd /Users/muhammadilu/NGOS/NGOS/nnpc-gas-platform
  npm run build
  ```

- [ ] **Start dev server and test all routes**
  ```bash
  npm run dev
  ```
  - [ ] Homepage loads: `http://localhost:3000`
  - [ ] All 4 reports accessible:
    - [ ] `/nnpc-reports/ngic-daily`
    - [ ] `/nnpc-reports/mor-supply`
    - [ ] `/nnpc-reports/ngml-daily`
    - [ ] `/nnpc-reports/mor-volume-pressure`
  - [ ] All data entry pages work:
    - [ ] `/records/production`
    - [ ] `/records/nominations`
    - [ ] `/records/deliveries`

- [ ] **Prepare demo data files**
  - [ ] `demo-data/Weekly_Production_W31.csv` - 13 producers
  - [ ] `demo-data/Daily_Offtake_Aug03.csv` - 20 stations
  - [ ] `demo-data/NGML_Nominations_Aug03.csv` - 16 customers

- [ ] **Test file uploads**
  - [ ] Upload Weekly_Production_W31.csv to `/records/production`
  - [ ] Verify validation works
  - [ ] Verify duplicate detection
  - [ ] Confirm data appears in records table

- [ ] **Clear demo environment**
  - [ ] Clear browser localStorage
  - [ ] Clear browser cache
  - [ ] Close all unnecessary tabs
  - [ ] Disable browser extensions that might interfere

- [ ] **Backup plan**
  - [ ] Take screenshots of all key screens
  - [ ] Record screen demo video as backup
  - [ ] Print PRESENTATION_DATA_FLOW.md as handout

---

## ✅ 1 Hour Before Demo

- [ ] **Technical Setup**
  - [ ] Start dev server: `npm run dev`
  - [ ] Verify app running at `http://localhost:3000`
  - [ ] Test internet connection (if needed for deployment)
  - [ ] Close CPU-intensive applications
  - [ ] Set display to presentation mode (mirror/extend)
  - [ ] Adjust screen resolution for projector if needed
  - [ ] Disable notifications and popups

- [ ] **Browser Setup**
  - [ ] Open Chrome/Firefox in clean profile
  - [ ] Clear localStorage: Open DevTools → Application → Local Storage → Clear All
  - [ ] Bookmark these URLs for quick access:
    - [ ] `http://localhost:3000` (Home)
    - [ ] `http://localhost:3000/records/production` (Production Records)
    - [ ] `http://localhost:3000/nnpc-reports/ngic-daily` (NGIC Report)
    - [ ] `http://localhost:3000/nnpc-reports/mor-supply` (MOR Supply)
    - [ ] `http://localhost:3000/nnpc-reports/ngml-daily` (NGML Report)
    - [ ] `http://localhost:3000/nnpc-reports/mor-volume-pressure` (MOR Pressure)
  - [ ] Increase browser zoom to 110-125% for visibility
  - [ ] Test full-screen mode (F11)

- [ ] **Demo Files Ready**
  - [ ] Copy demo CSV files to Desktop for easy access
  - [ ] Open one CSV in Excel to show format
  - [ ] Have DEMO_SCRIPT.md open on second monitor/device

- [ ] **Print Materials**
  - [ ] PRESENTATION_DATA_FLOW.md (1 copy per attendee)
  - [ ] Quick Start Guide (1 copy per attendee)
  - [ ] Screenshots as backup (just in case)

---

## ✅ 15 Minutes Before Demo

- [ ] **Final Technical Check**
  - [ ] Navigate to homepage - loads correctly
  - [ ] Click through main menu - all links work
  - [ ] Open each of 4 reports - all display correctly
  - [ ] Test one file upload - works smoothly

- [ ] **Presentation Setup**
  - [ ] Connect laptop to projector
  - [ ] Test display mirroring
  - [ ] Adjust screen brightness
  - [ ] Position screen for easy viewing
  - [ ] Have backup laptop ready (if available)

- [ ] **Personal Prep**
  - [ ] Have water nearby
  - [ ] Review DEMO_SCRIPT.md key points
  - [ ] Take deep breath 😊

---

## 🎬 During Demo - Tab Organization

**Organize browser tabs in this order:**

1. **Tab 1:** Homepage (`http://localhost:3000`)
2. **Tab 2:** Production Records (`/records/production`)
3. **Tab 3:** NGIC Daily Report (`/nnpc-reports/ngic-daily`)
4. **Tab 4:** MOR Supply Report (`/nnpc-reports/mor-supply`)
5. **Tab 5:** NGML Daily Report (`/nnpc-reports/ngml-daily`)
6. **Tab 6:** MOR Pressure Report (`/nnpc-reports/mor-volume-pressure`)

**Pin these tabs** so they don't accidentally close.

---

## 🎯 Demo Flow Quick Reference

### Part 1: Introduction (2 min)
- Start on **Homepage**
- Explain the problem (manual Excel reports take hours)
- Show navigation menu

### Part 2: Data Upload (5 min)
- Go to **Tab 2** (Production Records)
- Click "Create New Record" → "Upload CSV/Excel"
- Download template (show format)
- Upload `Weekly_Production_W31.csv`
- Show validation
- Confirm upload
- **Key Point:** "13 records uploaded in seconds vs hours of manual entry"

### Part 3: Manual Entry (3 min)
- Still on **Tab 2**
- Click "Create New Record" → "Manual Entry"
- Fill form with sample data:
  ```
  Date: Today's date
  Facility: CNL-Escravos
  Production: 330.09
  Pressure: 82.10
  ```
- Save
- **Key Point:** "Mobile-friendly for field operators"

### Part 4: Reports Tour (7 min)

**NGIC Report** - **Tab 3**
- Show Region→Customer Type→Station hierarchy
- Point out Transcorp Ughelli: 193.54 MW
- Show subtotals and grand total
- **Key Point:** "Exact Excel format you know"

**MOR Supply** - **Tab 4**
- Show two-column layout
- Point out CNL-Escravos: 2,310.625 MMscf
- Show Material Balance calculation
- Test Print button
- **Key Point:** "Material Balance auto-calculated, can't be wrong"

**NGML Daily** - **Tab 5**
- Show dual S/N columns
- Point out "SUB -TOTAL 1" (space before hyphen)
- Show franchise groupings
- Show SNG (FIRM customer)
- **Key Point:** "All franchise groupings automatic"

**MOR Pressure** - **Tab 6**
- Show week-on-week comparison
- **HIGHLIGHT:** Pressure breach detection
  - NEPL Oredo FST3: 38.19 vs 55-70 range = RED
  - Show breach summary at bottom
- **Key Point:** "Automatic breach detection vs manual checking"

### Part 5: Closing (3 min)
- Summarize benefits:
  - ⏱️ 95% time savings
  - ✅ Zero calculation errors
  - 🎯 Automatic breach detection
  - 📊 Familiar Excel format
- Answer questions
- Distribute handouts

---

## 🆘 Emergency Backup Plan

### If App Crashes:
1. Restart dev server: `Ctrl+C` → `npm run dev`
2. While restarting, show screenshots from backup folder
3. Continue with backup PowerPoint/PDF

### If Upload Fails:
1. Show manual entry instead
2. Explain: "Upload feature will be demonstrated separately"

### If Reports Don't Load:
1. Show screenshots of reports
2. Walk through PRESENTATION_DATA_FLOW.md printout

### If Internet Fails:
1. Continue with localhost (works offline)
2. Show local data

---

## 📊 Key Numbers to Remember

- **Time Savings:** 2-3 hours → 15 minutes (95% reduction)
- **Records in Demo CSV:** 13 producers, 20 stations
- **Pressure Breaches Detected:** 6 out of 13 producers
- **Critical Breach:** NEPL Oredo FST3 (31% below minimum)
- **Reports Generated:** 4 regulatory reports instantly

---

## 💬 Key Phrases to Use

✅ "Same Excel format you're already familiar with"
✅ "No need to change your workflow - just upload your CSV"
✅ "Automatic validation prevents errors before they happen"
✅ "System detected 6 pressure breaches automatically"
✅ "Material Balance is calculated, not typed - can't be wrong"
✅ "From 8-12 hours per week to 15 minutes"

---

## ❓ Anticipated Questions - Quick Answers

**Q: What if internet is down?**
A: "Works offline, syncs when connection returns"

**Q: Can we use existing Excel files?**
A: "Yes! Save as CSV and upload - no workflow change needed"

**Q: What about mistakes?**
A: "Edit/delete with audit trail showing who changed what"

**Q: Training required?**
A: "Minimal - 1 hour overview + hands-on practice sessions"

**Q: Cost?**
A: [Prepare your answer based on deployment model]

**Q: Security?**
A: "Role-based access, audit trail, secure authentication"

---

## ✅ Post-Demo

- [ ] Collect feedback forms (if prepared)
- [ ] Note all questions asked
- [ ] Follow up on any concerns
- [ ] Send demo video recording (if recorded)
- [ ] Schedule training sessions
- [ ] Send thank you email with next steps

---

## 📱 Contact Info for Tech Support During Demo

**If you need emergency tech support:**
- Developer: [Your contact]
- IT Support: [IT contact]
- Backup presenter: [Backup person]

---

**Remember:**
- Smile and show confidence 😊
- Emphasize time savings and accuracy
- Let them see it's just like their Excel
- The automatic breach detection is impressive - highlight it!
- This makes THEIR jobs easier - that's the message

**You've got this! 🚀**

---

## 🎯 Success Indicators

You'll know the demo was successful if:
- ✅ People lean forward and pay attention during breach detection
- ✅ Someone asks "When can we start using this?"
- ✅ They nod when you show the Excel-matching format
- ✅ Questions are about implementation, not skepticism
- ✅ Management asks about rollout timeline

Good luck! 🍀
