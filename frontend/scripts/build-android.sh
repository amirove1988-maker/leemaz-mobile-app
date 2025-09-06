#!/bin/bash

# 📱 Leemaz Android Build Script
# Syrian Women's Marketplace APK/AAB Builder

echo "🦋 Leemaz Android Build Script"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo -e "${RED}❌ EAS CLI is not installed${NC}"
    echo -e "${YELLOW}Installing EAS CLI...${NC}"
    npm install -g eas-cli
fi

# Check if user is logged in to EAS
echo -e "${BLUE}📋 Checking EAS authentication...${NC}"
if ! eas whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  You need to login to EAS first${NC}"
    echo -e "${BLUE}Please run: eas login${NC}"
    exit 1
fi

echo -e "${GREEN}✅ EAS CLI ready${NC}"
echo ""

# Show current configuration
echo -e "${PURPLE}📱 Current App Configuration:${NC}"
echo "   App Name: Leemaz - Syrian Women's Marketplace"
echo "   Package: com.leemaz.mobile"
echo "   Version: 1.0.0"
echo ""

# Backend URL check
echo -e "${YELLOW}⚠️  IMPORTANT: Backend URL Configuration${NC}"
echo "Current EXPO_PUBLIC_BACKEND_URL: ${EXPO_PUBLIC_BACKEND_URL:-'Not set'}"
echo ""
echo -e "${RED}🚨 Make sure to update your backend URL before building!${NC}"
echo "Edit /app/frontend/.env and set EXPO_PUBLIC_BACKEND_URL to your production backend"
echo ""

# Build options
echo -e "${BLUE}🏗️  Build Options:${NC}"
echo "1. APK (for testing/distribution)"
echo "2. AAB (for Google Play Store)"
echo "3. Exit"
echo ""

read -p "Select build type (1-3): " choice

case $choice in
    1)
        echo -e "${GREEN}🔨 Building APK (Preview Profile)...${NC}"
        echo "This will create an APK file for testing and direct distribution"
        echo ""
        eas build --platform android --profile preview
        ;;
    2)
        echo -e "${GREEN}🔨 Building AAB (Production Profile)...${NC}"
        echo "This will create an Android App Bundle for Google Play Store"
        echo ""
        eas build --platform android --profile production
        ;;
    3)
        echo -e "${YELLOW}👋 Exiting...${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}❌ Invalid option${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}🎉 Build command executed!${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Monitor the build progress on expo.dev/accounts/[your-account]/projects/leemaz-mobile/builds"
echo "2. Once complete, download the file using the provided link or QR code"
echo "3. Test the app thoroughly before distribution"
echo ""
echo -e "${PURPLE}📱 For testing:${NC}"
echo "• Install the APK on Android devices for testing"
echo "• Verify all functionality works correctly"
echo "• Test Arabic/English language switching"
echo "• Test authentication and core features"
echo ""
echo -e "${GREEN}🚀 Happy building! 🦋${NC}"