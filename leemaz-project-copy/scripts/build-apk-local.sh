#!/bin/bash

# 📱 Leemaz Local APK Build Script
echo "🦋 Building Leemaz APK Locally"
echo "=============================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📋 Preparing local APK build...${NC}"

# Check if we have the Android development setup
if command -v adb &> /dev/null; then
    echo -e "${GREEN}✅ Android Debug Bridge (ADB) found${NC}"
else
    echo -e "${YELLOW}⚠️  ADB not found - APK will be built for distribution${NC}"
fi

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install

# Try Expo local build
echo -e "${BLUE}🔨 Attempting local APK build...${NC}"
echo -e "${YELLOW}Method 1: Using Expo run android${NC}"

if expo run:android --variant release &> build.log; then
    echo -e "${GREEN}✅ APK built successfully!${NC}"
    echo -e "${BLUE}📍 APK location: android/app/build/outputs/apk/release/app-release.apk${NC}"
else
    echo -e "${RED}❌ Local build failed${NC}"
    echo -e "${YELLOW}Trying alternative method...${NC}"
    
    # Alternative: Try with npx
    if npx expo run:android --variant release &> build2.log; then
        echo -e "${GREEN}✅ APK built successfully with npx!${NC}"
    else
        echo -e "${RED}❌ Alternative build also failed${NC}"
        echo -e "${BLUE}📋 Build logs:${NC}"
        tail -20 build.log build2.log 2>/dev/null
        
        echo ""
        echo -e "${YELLOW}💡 Alternative Solutions:${NC}"
        echo "1. Use EAS Build (cloud): eas build --platform android --profile preview"
        echo "2. Setup Android Studio for local builds"
        echo "3. Use online build services"
        echo ""
        echo -e "${BLUE}📖 Check the full build guide: /app/ANDROID_BUILD_GUIDE.md${NC}"
    fi
fi

echo ""
echo -e "${GREEN}🎉 Build process completed!${NC}"