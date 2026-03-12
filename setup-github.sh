#!/bin/bash

echo "🚀 Setting up GitHub repository for MercadoLibre Auto-Responder"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}1. Create the repository on GitHub:${NC}"
echo "   → Go to: https://github.com/henaihh"
echo "   → Click 'New repository'"
echo "   → Name: meli-autoresponder"
echo "   → Description: MercadoLibre Auto-Responder with AI cascade"
echo "   → Public or Private (your choice)"
echo "   → ❌ DO NOT initialize with README (we already have one)"
echo ""

echo -e "${YELLOW}2. After creating the repo, run these commands:${NC}"
echo ""
echo "   git remote add origin https://github.com/henaihh/meli-autoresponder.git"
echo "   git push -u origin main"
echo ""

echo -e "${GREEN}3. Deploy to Vercel:${NC}"
echo "   → Go to: https://vercel.com"
echo "   → Import Project"
echo "   → Select: github.com/henaihh/meli-autoresponder"
echo "   → Framework preset: Next.js"
echo "   → Click Deploy (no env vars needed for now)"
echo ""

echo -e "${BLUE}4. What works after deploy:${NC}"
echo "   ✅ Complete dashboard with navigation"
echo "   ✅ Test Bot with intelligent simulation"  
echo "   ✅ Escalation management system"
echo "   ✅ Store configuration"
echo "   ✅ Project status page (/dashboard/info)"
echo ""

echo -e "${YELLOW}5. What's simulated (not connected to real APIs):${NC}"
echo "   🟡 Test Bot responses (intelligent logic, not real Claude)"
echo "   🟡 Dashboard stats (realistic mock data)"
echo "   🟡 Interactions (sample data)"
echo ""

echo -e "${GREEN}✨ The app is ready for demo and testing!${NC}"
echo ""