# 📱 Leemaz Android APK/AAB Build Guide

## 🚀 Complete Guide to Building Android APK/AAB for Leemaz Syrian Women's Marketplace

### 📋 Prerequisites

Before building the Android app, ensure you have:

1. **Node.js** (v18 or later)
2. **Expo CLI** (latest version)
3. **EAS CLI** (Expo Application Services)
4. **Expo Account** (free registration at expo.dev)

### 🛠️ Installation Steps

#### 1. Install Required Tools
```bash
# Install Expo CLI globally
npm install -g @expo/cli

# Install EAS CLI globally  
npm install -g eas-cli

# Login to your Expo account
eas login
```

#### 2. Configure Your Backend URL
Before building, update the backend URL in the environment file:

```bash
# Edit /app/frontend/.env
EXPO_PUBLIC_BACKEND_URL=https://your-production-backend-url.com
```

⚠️ **IMPORTANT**: Replace with your actual production backend URL before building!

### 🏗️ Build Process

#### Method 1: EAS Build (Recommended for Production)

##### Build APK (for testing/distribution)
```bash
cd /app/frontend
eas build --platform android --profile preview
```

##### Build AAB (for Google Play Store)
```bash
cd /app/frontend  
eas build --platform android --profile production
```

#### Method 2: Local Build (Advanced Users)

##### Prerequisites for Local Build
```bash
# Install Android Studio and Android SDK
# Set up ANDROID_HOME environment variable
# Install Java Development Kit (JDK 17)

# Build locally
npx expo run:android --variant release
```

### 📱 Build Profiles Explained

#### **Preview Profile (APK)**
- **Purpose**: Testing and internal distribution
- **File Type**: APK
- **Use Case**: Share with testers, side-load on devices
- **Distribution**: Direct download and install

#### **Production Profile (AAB)**
- **Purpose**: Google Play Store submission
- **File Type**: Android App Bundle (AAB)
- **Use Case**: Official app store distribution
- **Distribution**: Through Google Play Store

### 🔧 App Configuration Details

The app is configured with:

- **Package Name**: `com.leemaz.mobile`
- **App Name**: "Leemaz - Syrian Women's Marketplace"
- **Version**: 1.0.0
- **Min SDK**: 21 (Android 5.0+)
- **Target SDK**: 34 (Android 14)

#### Permissions Included:
- **INTERNET**: For API communication
- **CAMERA**: For product photos and shop logos
- **READ_EXTERNAL_STORAGE**: For image selection
- **WRITE_EXTERNAL_STORAGE**: For image caching
- **VIBRATE**: For notification feedback

### 🌍 Bilingual Support Features

The built app includes:
- **Complete Arabic & English translations**
- **RTL (Right-to-Left) layout support**
- **Dynamic language switching**
- **Persistent language preferences**

### 📦 Build Output

After successful build, you'll receive:

1. **Download Link**: Direct link to download the built file
2. **QR Code**: For easy mobile download
3. **Build Logs**: Detailed build information
4. **Artifact Details**: File size, build time, etc.

### 🚀 Distribution Options

#### APK Distribution:
1. **Direct Download**: Share the APK link
2. **Internal Testing**: Use Firebase App Distribution
3. **Side-loading**: Install directly on devices

#### AAB Distribution:
1. **Google Play Console**: Upload for store submission
2. **Internal Testing Track**: Test with limited users
3. **Production Release**: Public app store release

### 🔍 Testing Your Build

#### Before Distribution:
1. **Install on Test Device**: Verify all functionality
2. **Test Authentication**: Ensure login/register works
3. **Test Bilingual**: Switch between Arabic/English
4. **Test Core Features**: Orders, shops, products, chat
5. **Test Permissions**: Camera, storage access

#### Testing Checklist:
- ✅ App launches successfully
- ✅ Login/logout functionality
- ✅ Language switching (Arabic ↔ English)
- ✅ RTL layout for Arabic
- ✅ Shop creation and logo upload
- ✅ Product browsing and ordering
- ✅ Chat functionality
- ✅ Profile management
- ✅ Navigation between screens

### 🐛 Troubleshooting

#### Common Issues:

**Build Fails with "Network Error"**
```bash
# Retry the build
eas build --platform android --profile preview --clear-cache
```

**"Package name already exists"**
- Change the package name in `app.json`
- Update android.package field

**"Assets not found"**
- Ensure all images exist in assets/images/
- Check file paths in app.json are correct

**Backend Connection Issues**
- Verify EXPO_PUBLIC_BACKEND_URL is correct
- Ensure backend is accessible from mobile networks
- Check CORS settings on backend

### 📱 Production Deployment Checklist

Before releasing to production:

1. **✅ Backend Configuration**
   - Production database configured
   - API endpoints accessible
   - SSL certificates installed
   - CORS properly configured

2. **✅ App Configuration**
   - Correct backend URL in environment
   - App icons and branding correct
   - Version number updated
   - Permissions properly set

3. **✅ Content Review**
   - All text properly translated
   - Arabic RTL layout working
   - Images and assets optimized
   - Terms of service updated

4. **✅ Testing Completed**
   - Full functionality testing
   - Multi-language testing
   - Performance testing
   - Security testing

### 🌟 App Store Submission

#### Google Play Store Requirements:
1. **Developer Account** ($25 one-time fee)
2. **App Bundle** (AAB file from production build)
3. **Store Listing**: Description, screenshots, metadata
4. **Privacy Policy**: Required for apps with user data
5. **Content Rating**: Age-appropriate content rating

#### Store Listing Assets Needed:
- **App Icon**: 512x512 PNG
- **Feature Graphic**: 1024x500 PNG  
- **Screenshots**: Multiple device sizes
- **Short Description**: 80 characters max
- **Full Description**: 4000 characters max

### 📞 Support

For build issues or questions:
1. Check Expo documentation: docs.expo.dev
2. Review EAS Build documentation
3. Check community forums
4. Contact support if needed

---

## 🎉 Success!

Once built, your Leemaz app will be ready to empower Syrian women entrepreneurs worldwide with a professional, bilingual mobile marketplace! 🦋✨

### 🚀 Quick Build Commands Reference:

```bash
# Test APK
eas build --platform android --profile preview

# Production AAB
eas build --platform android --profile production

# Check build status
eas build:list

# Download build
eas build:download [BUILD_ID]
```