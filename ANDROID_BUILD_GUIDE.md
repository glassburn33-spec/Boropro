# Android App Build & Play Store Publication Guide

## Overview

The Borosilicate Kiln Research platform has been converted to an Android app using Capacitor. This guide walks you through building the app and publishing it to Google Play Store.

## Prerequisites

Before building, you need to install:

1. **Java Development Kit (JDK) 17+**
   ```bash
   # On Ubuntu/Debian
   sudo apt-get install openjdk-17-jdk
   
   # Verify installation
   java -version
   ```

2. **Android SDK**
   - Download Android Studio from https://developer.android.com/studio
   - Or install Android SDK command-line tools
   - Set `ANDROID_HOME` environment variable:
     ```bash
     export ANDROID_HOME=$HOME/Android/Sdk
     export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
     export PATH=$PATH:$ANDROID_HOME/platform-tools
     ```

3. **Gradle** (usually included with Android Studio)

## Project Structure

```
boro_kiln_research/
├── android/                    # Android native project
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── AndroidManifest.xml
│   │   │   ├── assets/public/  # Web app files
│   │   │   └── res/            # App resources (icons, strings)
│   │   └── build.gradle.kts
│   └── build.gradle.kts
├── dist/public/                # Built web app
├── capacitor.config.ts         # Capacitor configuration
└── package.json
```

## Build Steps

### Step 1: Build the Web App

```bash
cd /home/ubuntu/boro_kiln_research
pnpm run build
```

This creates the production build in `dist/public/`.

### Step 2: Sync Web Assets to Android

```bash
npx cap sync android
```

This copies the web app files to `android/app/src/main/assets/public/`.

### Step 3: Build the Android App

#### Option A: Build APK (for testing)

```bash
cd android
./gradlew assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

#### Option B: Build AAB (for Play Store - RECOMMENDED)

```bash
cd android
./gradlew bundleRelease
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

**Why AAB?** Google Play Store now requires Android App Bundles (AAB) for new apps. AAB is smaller and allows Google Play to optimize the app for each device.

### Step 4: Sign the Release Build

You need a keystore file to sign the app. If you don't have one, create it:

```bash
keytool -genkey -v -keystore boro-kiln-release-key.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias boro-kiln-key
```

Then configure signing in `android/app/build.gradle.kts`:

```kotlin
signingConfigs {
    release {
        storeFile = file("../boro-kiln-release-key.jks")
        storePassword = "YOUR_PASSWORD"
        keyAlias = "boro-kiln-key"
        keyPassword = "YOUR_PASSWORD"
    }
}

buildTypes {
    release {
        signingConfig = signingConfigs.release
    }
}
```

**⚠️ IMPORTANT:** Keep your keystore file and password safe. You'll need the same keystore to update the app in the future.

## App Store Assets

### App Icons

Create icons in these sizes and place them in `android/app/src/main/res/`:

- `mipmap-ldpi/ic_launcher.png` - 36x36 px
- `mipmap-mdpi/ic_launcher.png` - 48x48 px
- `mipmap-hdpi/ic_launcher.png` - 72x72 px
- `mipmap-xhdpi/ic_launcher.png` - 96x96 px
- `mipmap-xxhdpi/ic_launcher.png` - 144x144 px
- `mipmap-xxxhdpi/ic_launcher.png` - 192x192 px

### App Strings

Edit `android/app/src/main/res/values/strings.xml`:

```xml
<?xml version='1.0' encoding='utf-8'?>
<resources>
    <string name="app_name">Boro Kiln Research</string>
    <string name="title_activity_main">Boro Kiln Research</string>
</resources>
```

## Google Play Store Publication

### Step 1: Create Google Play Developer Account

1. Go to https://play.google.com/console
2. Sign in with your Google account
3. Pay the $25 one-time registration fee
4. Complete your developer profile

### Step 2: Create App Listing

1. Click "Create app"
2. Enter app name: "Boro Kiln Research"
3. Select category: "Education" or "Productivity"
4. Fill in required information:
   - Short description (80 characters max)
   - Full description (4000 characters max)
   - Screenshots (minimum 2, maximum 8)
   - Feature graphic (1024x500 px)
   - Icon (512x512 px)

### Step 3: Upload AAB

1. Go to "Release" → "Production"
2. Click "Create new release"
3. Upload the signed AAB file: `android/app/build/outputs/bundle/release/app-release.aab`
4. Add release notes
5. Review and publish

### Step 4: Content Rating

1. Complete the content rating questionnaire
2. Google will assign a rating (typically "Everyone" for this app)

### Step 5: Pricing & Distribution

1. Set price (free or paid)
2. Select countries where app is available
3. Review Play Store listing

## Testing Before Publication

### Test on Emulator

```bash
# Start Android emulator
emulator -avd Pixel_4_API_30

# Install APK on emulator
adb install android/app/build/outputs/apk/release/app-release.apk

# Or use Capacitor
npx cap open android
```

### Test on Physical Device

```bash
# Enable USB debugging on device
# Connect device via USB
adb install android/app/build/outputs/apk/release/app-release.apk
```

## App Features & Permissions

The app includes:

- **Flame Chemistry Simulator** - Interactive visualization of flame types and color effects
- **Color Picker & Schedule Generator** - Multi-select tool to generate annealing schedules
- **Test Firing Tracker** - Log and track test firings with localStorage persistence
- **PDF Library** - Upload kiln schedules and generate PDFs

### Permissions Used

- `INTERNET` - Required for web content and external resources
- `READ_EXTERNAL_STORAGE` - For PDF uploads
- `WRITE_EXTERNAL_STORAGE` - For PDF downloads
- `ACCESS_FINE_LOCATION` - For potential future map features
- `ACCESS_COARSE_LOCATION` - For potential future map features

## Troubleshooting

### Build Fails with Gradle Error

```bash
# Clean build
cd android
./gradlew clean
./gradlew bundleRelease
```

### APK/AAB Not Found

Verify build completed successfully:
```bash
ls -la android/app/build/outputs/
```

### App Crashes on Device

1. Check logcat:
   ```bash
   adb logcat | grep boro-kiln
   ```

2. Ensure web assets are copied:
   ```bash
   ls -la android/app/src/main/assets/public/
   ```

3. Verify AndroidManifest.xml permissions are set

### Play Store Rejection

Common reasons:
- App crashes on startup (test thoroughly)
- Missing privacy policy (add in app description)
- Inappropriate content (ensure app content is appropriate)
- Broken functionality (test all features)

## Updating the App

To release a new version:

1. Update version in `android/app/build.gradle.kts`:
   ```kotlin
   versionCode = 2  // Increment this
   versionName = "1.1.0"
   ```

2. Rebuild and sign:
   ```bash
   pnpm run build
   npx cap sync android
   cd android && ./gradlew bundleRelease
   ```

3. Upload new AAB to Play Store

## Resources

- [Capacitor Android Documentation](https://capacitorjs.com/docs/android)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [Android App Signing](https://developer.android.com/studio/publish/app-signing)
- [Play Store Listing Best Practices](https://support.google.com/googleplay/android-developer/answer/113469)

## Next Steps

1. Install Android SDK and JDK
2. Build the AAB file
3. Create Google Play Developer account
4. Upload app to Play Store
5. Monitor reviews and ratings
6. Plan future updates and features
