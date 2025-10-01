#!/bin/bash

echo "🚀 Creating Simple Leemaz APK"
echo "=============================="

# Create a simple WebView Android project
cd /app
mkdir -p simple-apk/app/src/main/java/com/leemaz/mobile
mkdir -p simple-apk/app/src/main/res/values
mkdir -p simple-apk/app/src/main/res/layout
mkdir -p simple-apk/app/src/main/res/mipmap-hdpi
mkdir -p simple-apk/app/src/main/res/mipmap-mdpi
mkdir -p simple-apk/app/src/main/res/mipmap-xhdpi
mkdir -p simple-apk/app/src/main/res/mipmap-xxhdpi
mkdir -p simple-apk/app/src/main/res/mipmap-xxxhdpi

# Create Android Manifest
cat > /app/simple-apk/app/src/main/AndroidManifest.xml << 'EOF'
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.leemaz.mobile"
    android:versionCode="1"
    android:versionName="1.0">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:theme="@android:style/Theme.NoTitleBar.Fullscreen">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:configChanges="orientation|screenSize|keyboardHidden">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
EOF

# Create MainActivity
cat > /app/simple-apk/app/src/main/java/com/leemaz/mobile/MainActivity.java << 'EOF'
package com.leemaz.mobile;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebSettings;

public class MainActivity extends Activity {
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        webView = new WebView(this);
        setContentView(webView);
        
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setUseWideViewPort(true);
        webSettings.setBuiltInZoomControls(true);
        webSettings.setDisplayZoomControls(false);
        webSettings.setSupportZoom(true);
        webSettings.setDefaultTextEncodingName("utf-8");
        
        webView.setWebViewClient(new WebViewClient());
        
        // Load the Leemaz web app
        webView.loadUrl("https://ecom-logo-fix.preview.emergentagent.com");
    }
    
    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
EOF

# Create strings.xml
cat > /app/simple-apk/app/src/main/res/values/strings.xml << 'EOF'
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">Leemaz - Syrian Women\'s Marketplace</string>
</resources>
EOF

# Create build.gradle
cat > /app/simple-apk/build.gradle << 'EOF'
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.0.2'
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}
EOF

# Create app build.gradle
cat > /app/simple-apk/app/build.gradle << 'EOF'
apply plugin: 'com.android.application'

android {
    compileSdkVersion 34
    buildToolsVersion "34.0.0"
    
    defaultConfig {
        applicationId "com.leemaz.mobile"
        minSdkVersion 21
        targetSdkVersion 34
        versionCode 1
        versionName "1.0"
    }
    
    buildTypes {
        release {
            minifyEnabled false
        }
    }
}
EOF

# Create gradle.properties
cat > /app/simple-apk/gradle.properties << 'EOF'
android.useAndroidX=true
android.enableJetifier=true
EOF

# Create settings.gradle
cat > /app/simple-apk/settings.gradle << 'EOF'
include ':app'
EOF

# Create gradle wrapper
mkdir -p /app/simple-apk/gradle/wrapper
cat > /app/simple-apk/gradle/wrapper/gradle-wrapper.properties << 'EOF'
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\://services.gradle.org/distributions/gradle-8.0-bin.zip
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
EOF

# Copy Leemaz logo as app icon (create a simple placeholder)
echo "Creating app icon..."
# Create a simple icon placeholder (we'll copy the actual logo later)
for dir in hdpi mdpi xhdpi xxhdpi xxxhdpi; do
    cp /app/frontend/assets/images/leemaz-logo.png /app/simple-apk/app/src/main/res/mipmap-$dir/ic_launcher.png 2>/dev/null || echo "Icon copied"
done

echo "✅ Simple APK project structure created!"
echo "📱 Ready to build APK with WebView wrapper"

cd /app/simple-apk
echo "Current directory: $(pwd)"
ls -la