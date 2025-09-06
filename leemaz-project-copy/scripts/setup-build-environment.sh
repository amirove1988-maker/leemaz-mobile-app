#!/bin/bash

# 🛠️ Leemaz Build Environment Setup Script
echo "🦋 Leemaz Build Environment Setup"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check Node.js
echo -e "${BLUE}🔍 Checking Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js installed: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js not found${NC}"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

# Install Expo CLI
echo -e "${BLUE}🔍 Checking Expo CLI...${NC}"
if command -v expo &> /dev/null; then
    EXPO_VERSION=$(expo --version)
    echo -e "${GREEN}✅ Expo CLI installed: $EXPO_VERSION${NC}"
else
    echo -e "${YELLOW}📦 Installing Expo CLI...${NC}"
    npm install -g @expo/cli
fi

# Install EAS CLI
echo -e "${BLUE}🔍 Checking EAS CLI...${NC}"
if command -v eas &> /dev/null; then
    EAS_VERSION=$(eas --version)
    echo -e "${GREEN}✅ EAS CLI installed: $EAS_VERSION${NC}"
else
    echo -e "${YELLOW}📦 Installing EAS CLI...${NC}"
    npm install -g eas-cli
fi

echo ""
echo -e "${GREEN}🎉 Build environment setup complete!${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Create an Expo account at https://expo.dev if you don't have one"
echo "2. Login to EAS: ${YELLOW}eas login${NC}"
echo "3. Update your backend URL in .env file"
echo "4. Run the build script: ${YELLOW}./scripts/build-android.sh${NC}"
echo ""
echo -e "${YELLOW}⚠️  Important:${NC}"
echo "Before building, make sure to update EXPO_PUBLIC_BACKEND_URL in .env"
echo "to point to your production backend server!"
echo ""