# Android App - Quick Start Guide

## TL;DR - Build & Publish in 5 Steps

### Prerequisites
- Android SDK installed (via Android Studio)
- JDK 17+ installed
- `ANDROID_HOME` environment variable set
- Google Play Developer account ($25 one-time fee)

### Build Commands

```bash
# 1. Build web app
pnpm run android:build

# 2. Generate signed AAB (for Play Store)
pnpm run android:aab

# 3. Locate the AAB file
ls -la android/app/build/outputs/bundle/release/

# 4. Upload to Play Store Console
# Go to https://play.google.com/console
# Create new app → Upload AAB file → Fill in listing → Publish

# 5. Done! App will be available in Play Store within 24-72 hours
```

## What's Been Set Up

✅ **Capacitor Framework** - Wraps React web app as native Android app
✅ **Android Project** - Located in `android/` directory
✅ **Build Scripts** - Added to `package.json` for easy building
✅ **Permissions** - Configured in `AndroidManifest.xml`
✅ **Documentation** - Full guides for build and publishing

## File Locations

| File | Purpose |
|------|---------|
| `capacitor.config.ts` | Capacitor configuration |
| `android/app/build.gradle` | Android build settings |
| `android/app/src/main/AndroidManifest.xml` | App permissions and metadata |
| `android/app/src/main/res/` | App icons and strings |
| `ANDROID_BUILD_GUIDE.md` | Detailed build instructions |
| `PLAY_STORE_LISTING.md` | App store description and assets |

## Available npm Scripts

```bash
pnpm run android:build    # Build web app + sync to Android
pnpm run android:apk      # Generate APK (for testing)
pnpm run android:aab      # Generate AAB (for Play Store)
pnpm run android:open     # Open Android Studio
```

## Next Steps

1. **Install Android SDK**
   - Download Android Studio: https://developer.android.com/studio
   - Or install command-line tools and set `ANDROID_HOME`

2. **Create Signing Key** (one-time)
   ```bash
   keytool -genkey -v -keystore boro-kiln-release-key.jks \
     -keyalg RSA -keysize 2048 -validity 10000 \
     -alias boro-kiln-key
   ```

3. **Configure Signing** in `android/app/build.gradle`
   ```gradle
   signingConfigs {
       release {
           storeFile = file("../boro-kiln-release-key.jks")
           storePassword = "YOUR_PASSWORD"
           keyAlias = "boro-kiln-key"
           keyPassword = "YOUR_PASSWORD"
       }
   }
   ```

4. **Build AAB**
   ```bash
   pnpm run android:aab
   ```

5. **Create Play Store Account**
   - Go to https://play.google.com/console
   - Pay $25 registration fee
   - Create new app

6. **Upload & Publish**
   - Upload AAB from `android/app/build/outputs/bundle/release/app-release.aab`
   - Fill in app listing (description, screenshots, icons)
   - Submit for review
   - App goes live in 24-72 hours

## Testing Before Publishing

### Test on Emulator
```bash
pnpm run android:open  # Opens Android Studio
# Create emulator in Android Studio
# Run app on emulator
```

### Test on Physical Device
```bash
# Enable USB debugging on device
# Connect via USB
adb install android/app/build/outputs/apk/release/app-release.apk
```

## App Store Assets Needed

- **Icon** (512x512 px) - App launcher icon
- **Screenshots** (2-8 images) - Show app features
- **Feature Graphic** (1024x500 px) - Banner image
- **Description** (4000 chars) - Full app description
- **Short Description** (80 chars) - One-liner
- **Privacy Policy** - Link or text

See `PLAY_STORE_LISTING.md` for templates and examples.

## Common Issues

**Build fails with "gradle not found"**
```bash
# Make sure Android SDK is installed and ANDROID_HOME is set
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
```

**AAB file not generated**
```bash
# Check build output
ls -la android/app/build/outputs/bundle/release/

# If missing, try clean build
cd android && ./gradlew clean && ./gradlew bundleRelease
```

**App crashes on startup**
```bash
# Check logs
adb logcat | grep boro-kiln

# Verify web assets are copied
ls -la android/app/src/main/assets/public/
```

## Version Updates

To release a new version:

1. Update version in `android/app/build.gradle`:
   ```gradle
   versionCode = 2  // Increment this
   versionName = "1.1.0"
   ```

2. Rebuild:
   ```bash
   pnpm run android:aab
   ```

3. Upload new AAB to Play Store

## Support

- **Capacitor Docs**: https://capacitorjs.com/docs/android
- **Play Store Help**: https://support.google.com/googleplay/android-developer
- **Android Docs**: https://developer.android.com/docs

## Checklist Before Publishing

- [ ] Android SDK installed and configured
- [ ] JDK 17+ installed
- [ ] Signing key created and configured
- [ ] App tested on emulator and physical device
- [ ] All features working (flame simulator, color picker, firing tracker, PDF library)
- [ ] No crashes or major bugs
- [ ] Google Play Developer account created ($25 paid)
- [ ] App icons created (512x512 px minimum)
- [ ] Screenshots prepared (2-8 images)
- [ ] App description written (see PLAY_STORE_LISTING.md)
- [ ] Privacy policy prepared
- [ ] AAB file generated and ready to upload
- [ ] Play Store listing filled in
- [ ] Ready to submit for review

Good luck with your Play Store launch! 🚀
