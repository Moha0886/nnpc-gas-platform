#!/bin/bash

# NNPC Gas Platform - Demo Start Script
# Run this script before your presentation

echo "🚀 Starting NNPC Gas Platform Demo..."
echo ""

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "${YELLOW}⚠️  Installing dependencies...${NC}"
    npm install
fi

# Clear any existing builds
echo "${BLUE}🧹 Clearing previous builds...${NC}"
rm -rf .next

# Start development server
echo ""
echo "${GREEN}✅ Starting development server...${NC}"
echo ""
echo "📊 Your demo app will be available at:"
echo "${GREEN}http://localhost:3000${NC}"
echo ""
echo "🎯 Quick Links for Demo:"
echo "  Production Records:    http://localhost:3000/records/production"
echo "  NGIC Daily Report:     http://localhost:3000/nnpc-reports/ngic-daily"
echo "  MOR Supply Report:     http://localhost:3000/nnpc-reports/mor-supply"
echo "  NGML Daily Report:     http://localhost:3000/nnpc-reports/ngml-daily"
echo "  MOR Pressure Report:   http://localhost:3000/nnpc-reports/mor-volume-pressure"
echo ""
echo "${YELLOW}📁 Sample CSV files ready in: demo-data/${NC}"
echo "  - Weekly_Production_W31.csv (13 producers)"
echo "  - Daily_Offtake_Aug03.csv (20 stations)"
echo "  - NGML_Nominations_Aug03.csv (16 customers)"
echo ""
echo "${BLUE}📖 Demo script available: DEMO_SCRIPT.md${NC}"
echo "${BLUE}✅ Checklist available: LIVE_DEMO_CHECKLIST.md${NC}"
echo ""
echo "🎬 Press Ctrl+C to stop the server when demo is complete"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start the dev server
npm run dev
