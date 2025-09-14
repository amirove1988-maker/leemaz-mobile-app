# 📋 LEEMAZ PROJECT FILES TO COPY

## **🎯 Essential Files for EAS Build:**

Create a new folder on your computer called `leemaz-project` and copy these files:

### **1. package.json**
```json
{
  "name": "leemaz-mobile",
  "main": "expo-router/entry",
  "version": "1.0.0",
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "@expo/vector-icons": "^14.1.0",
    "@react-native-async-storage/async-storage": "2.1.2",
    "@react-navigation/elements": "^2.3.8",
    "axios": "^1.11.0",
    "expo": "~53.0.22",
    "expo-camera": "~16.0.5",
    "expo-constants": "~17.0.3",
    "expo-image-picker": "~16.0.3",
    "expo-linking": "~7.1.7",
    "expo-notifications": "~0.30.3",
    "expo-router": "~4.0.9",
    "expo-splash-screen": "~0.29.13",
    "expo-status-bar": "~2.0.0",
    "expo-system-ui": "~4.0.4",
    "react": "18.3.1",
    "react-native": "0.76.3",
    "react-native-safe-area-context": "4.12.0",
    "react-native-screens": "3.36.0"
  },
  "devDependencies": {
    "@babel/core": "^7.25.2",
    "@types/react": "~18.3.12",
    "typescript": "~5.6.3"
  }
}
```

### **2. app.json**
```json
{
  "expo": {
    "name": "Leemaz - Syrian Women's Marketplace",
    "slug": "leemaz-mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/leemaz-logo.png",
    "userInterfaceStyle": "light",
    "scheme": "leemaz",
    "splash": {
      "image": "./assets/images/leemaz-logo.png",
      "resizeMode": "contain",
      "backgroundColor": "#E91E63"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.leemaz.mobile"
    },
    "android": {
      "package": "com.leemaz.mobile",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/leemaz-logo.png",
        "backgroundColor": "#E91E63"
      },
      "permissions": [
        "android.permission.INTERNET",
        "android.permission.CAMERA",
        "android.permission.READ_EXTERNAL_STORAGE"
      ]
    },
    "web": {
      "favicon": "./assets/images/leemaz-logo.png"
    },
    "plugins": ["expo-router"]
  }
}
```

### **3. eas.json**
```json
{
  "cli": {
    "version": ">= 12.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  }
}
```

### **4. .env**
```
EXPO_PUBLIC_BACKEND_URL=https://leemaz-expo-app.preview.emergentagent.com
```

## **📁 Create This Folder Structure:**
```
leemaz-project/
├── package.json
├── app.json  
├── eas.json
├── .env
├── app/
│   └── index.tsx
├── src/
│   ├── contexts/
│   ├── screens/
│   ├── services/
│   └── navigation/
└── assets/
    └── images/
        └── leemaz-logo.png
```

After creating these files, run:
```bash
npm install
eas login
eas build --platform android --profile production
```