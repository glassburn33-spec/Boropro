# BoroPro Capacitor Deployment Guide

## Overview

BoroPro is now configured with Capacitor, enabling deployment to iOS App Store and Google Play Store. This guide walks you through the complete process.

## What's Been Set Up

✅ **Capacitor Core** - Native app wrapper for iOS and Android  
✅ **PWA Configuration** - Offline support with service worker  
✅ **iOS Platform** - Ready for Xcode development  
✅ **Android Platform** - Ready for Android Studio development  
✅ **Manifest & Icons** - PWA manifest configured  
✅ **Service Worker** - Offline caching enabled  

## Prerequisites

### For iOS Development
- **macOS** (required for iOS development)
- **Xcode** 14+ (download from App Store)
- **Apple Developer Account** ($99/year) - [https://developer.apple.com](https://developer.apple.com)
- **CocoaPods** (usually pre-installed with Xcode)

### For Android Development
- **Android Studio** (download from [https://developer.android.com/studio](https://developer.android.com/studio))
- **Java Development Kit (JDK)** 11+ (usually included with Android Studio)
- **Google Play Developer Account** ($25 one-time) - [https://play.google.com/console](https://play.google.com/console)

## Build & Development Workflow

### 1. Update Web App (if making changes)

```bash
cd /home/ubuntu/boro_kiln_research

# Make changes to React components, styles, etc.
# Then rebuild:
pnpm run build

# Sync changes to native projects:
npx cap sync
```

### 2. Open iOS Project (macOS only)

```bash
npx cap open ios
```

This opens Xcode with the iOS project. You can:
- Run on iOS Simulator
- Run on physical device (requires provisioning profile)
- Build for App Store

### 3. Open Android Project

```bash
npx cap open android
```

This opens Android Studio with the Android project. You can:
- Run on Android Emulator
- Run on physical device
- Build for Google Play Store

## iOS App Store Submission

### Step 1: Prepare App Icons & Assets

1. **Create App Icons** (required sizes):
   - 1024×1024 px (App Store)
   - 180×180 px (iPhone)
   - 167×167 px (iPad Pro)
   - 152×152 px (iPad)
   - 120×120 px (iPhone)
   - 87×87 px (iPhone)
   - 80×80 px (iPad)
   - 58×58 px (iPhone)

2. **Create Screenshots** (for App Store listing):
   - 6.7" display: 1290×2796 px
   - 6.5" display: 1242×2688 px
   - 5.5" display: 1242×2208 px

3. **Place in Xcode**:
   - Open `ios/App/App` in Xcode
   - Select "App" target
   - Go to "Build Settings" → "App Icons and Launch Images"
   - Upload icons to Asset Catalog

### Step 2: Configure App in Xcode

1. Open `ios/App/App.xcworkspace` in Xcode
2. Select "App" target
3. Go to "General" tab and fill in:
   - **Display Name**: BoroPro
   - **Bundle Identifier**: com.boropro.app (must match capacitor.config.ts)
   - **Version**: 1.0.0
   - **Build**: 1
   - **Minimum Deployments**: iOS 14.0+

4. Go to "Signing & Capabilities":
   - Select your Team
   - Enable "Automatically manage signing"

### Step 3: Create App Store Connect Record

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click "My Apps" → "+" → "New App"
3. Fill in:
   - **Name**: BoroPro
   - **Bundle ID**: com.boropro.app
   - **SKU**: boropro (any unique identifier)
   - **Platform**: iOS

### Step 4: Build & Submit

```bash
# In Xcode:
# 1. Select "App" target
# 2. Select "Generic iOS Device" from device selector
# 3. Product → Archive
# 4. Distribute App → App Store Connect → Upload
```

Or use command line:

```bash
cd ios/App
xcodebuild -workspace App.xcworkspace -scheme App -configuration Release -derivedDataPath build archive -archivePath build/App.xcarchive
xcodebuild -exportArchive -archivePath build/App.xcarchive -exportOptionsPlist ExportOptions.plist -exportPath build/export
```

### Step 5: Complete App Store Listing

In App Store Connect:
1. Add app description, keywords, category
2. Upload screenshots
3. Set pricing and availability
4. Submit for review

**Review time**: 24-48 hours typically

## Google Play Store Submission

### Step 1: Generate Signing Key

```bash
cd android

# Generate keystore (one-time)
keytool -genkey -v -keystore boropro-release.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias boropro

# When prompted:
# Keystore password: [create strong password - save it!]
# Key password: [same as keystore password]
# Name: [Your Name]
# Organization: [Your Company]
# City: [Your City]
# State: [Your State]
# Country Code: [US]
```

**IMPORTANT**: Save the keystore file and passwords securely. You'll need them for future updates.

### Step 2: Configure Gradle Signing

Edit `android/app/build.gradle`:

```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file('boropro-release.keystore')
            storePassword 'YOUR_KEYSTORE_PASSWORD'
            keyAlias 'boropro'
            keyPassword 'YOUR_KEY_PASSWORD'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

### Step 3: Build Release APK/AAB

```bash
cd android

# Build Android App Bundle (recommended for Play Store)
./gradlew bundleRelease

# Or build APK
./gradlew assembleRelease

# Output locations:
# AAB: app/build/outputs/bundle/release/app-release.aab
# APK: app/build/outputs/apk/release/app-release.apk
```

### Step 4: Create Google Play Listing

1. Go to [Google Play Console](https://play.google.com/console)
2. Click "Create app"
3. Fill in:
   - **App name**: BoroPro
   - **Default language**: English
   - **App or game**: App
   - **Free or paid**: Free

### Step 5: Upload & Configure

1. **App content**:
   - Content rating questionnaire
   - Target audience
   - Content guidelines

2. **Releases**:
   - Go to "Release" → "Create new release"
   - Upload `app-release.aab`
   - Add release notes

3. **Store listing**:
   - Add app description (up to 4000 characters)
   - Add short description (80 characters)
   - Add screenshots (up to 8 per device type)
   - Add app icon (512×512 px)
   - Add feature graphic (1024×500 px)

4. **Pricing & distribution**:
   - Set countries/regions
   - Set pricing (free)
   - Content rating

### Step 6: Submit for Review

1. Review all sections (green checkmarks required)
2. Click "Review release"
3. Click "Start rollout to Production"

**Review time**: Usually 2-3 hours, sometimes up to 24 hours

## Testing Before Submission

### iOS Testing

```bash
# Build for testing
npx cap open ios

# In Xcode:
# 1. Select simulator or device
# 2. Product → Run (⌘R)
# 3. Test all features: calculator, logs, offline mode
```

### Android Testing

```bash
# Build for testing
npx cap open android

# In Android Studio:
# 1. Select emulator or device
# 2. Run app (Shift+F10)
# 3. Test all features: calculator, logs, offline mode
```

### Offline Testing

1. Enable Airplane Mode
2. Verify calculator still works
3. Verify saved logs are accessible
4. Verify UI renders correctly

## App Store Assets Checklist

- [ ] App name: "BoroPro"
- [ ] Bundle ID: "com.boropro.app"
- [ ] App icon (1024×1024 px)
- [ ] Screenshots (minimum 2 per device type)
- [ ] App description (compelling, 4000 chars max)
- [ ] Keywords (up to 100 characters)
- [ ] Support URL
- [ ] Privacy Policy URL
- [ ] Category: Productivity or Utilities
- [ ] Rating: 4+
- [ ] Version number: 1.0.0

## Troubleshooting

### iOS Build Fails

```bash
# Clean build cache
cd ios/App
rm -rf Pods
pod install
cd ../..
npx cap sync
```

### Android Build Fails

```bash
# Clean build cache
cd android
./gradlew clean
./gradlew bundleRelease
```

### App Crashes on Launch

1. Check logs in Xcode (Product → Scheme → Edit Scheme → Run → Diagnostics)
2. Check Android logcat: `adb logcat`
3. Ensure service worker is properly registered
4. Test offline mode

### Offline Features Not Working

1. Verify service-worker.js is in `client/public/`
2. Check browser console for service worker errors
3. Clear app cache and reinstall

## Updating the App

### For Existing App Versions

1. Update version in `capacitor.config.ts` and `package.json`
2. Make code changes
3. Run `pnpm run build && npx cap sync`
4. Rebuild and resubmit to app stores

### Version Numbering

- **iOS**: Use semantic versioning (1.0.0, 1.0.1, 1.1.0)
- **Android**: Increment versionCode by 1 for each release

## Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [iOS App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Store Policies](https://play.google.com/about/developer-content-policy/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)

## Support

For issues with:
- **Capacitor**: See [Capacitor Docs](https://capacitorjs.com/docs)
- **iOS**: Check [Apple Developer Forums](https://developer.apple.com/forums/)
- **Android**: Check [Android Developers](https://developer.android.com/)
- **BoroPro**: Review code in `/home/ubuntu/boro_kiln_research/`

## Next Steps

1. **Create app store accounts** if you haven't already
2. **Generate signing certificates** (iOS) and keys (Android)
3. **Create app store listings** with descriptions and screenshots
4. **Test on real devices** before submission
5. **Submit for review** and monitor approval status

Good luck! 🚀
