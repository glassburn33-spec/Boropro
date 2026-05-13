# BoroPro Capacitor Quick Start

## What is Capacitor?

Capacitor wraps your React web app as a native iOS and Android app. Your code stays the same—Capacitor handles the native layer.

## Quick Commands

### Development Workflow

```bash
# Make changes to React code
# Then rebuild and sync:
pnpm run build
npx cap sync

# Open iOS project (macOS only)
npx cap open ios

# Open Android project
npx cap open android
```

### Build for App Stores

```bash
# iOS (requires macOS and Xcode)
npx cap open ios
# Then in Xcode: Product → Archive → Distribute App

# Android
cd android
./gradlew bundleRelease
# Output: app/build/outputs/bundle/release/app-release.aab
```

## Project Structure

```
boro_kiln_research/
├── client/                    # React web app (your main code)
├── server/                    # Backend API
├── ios/                       # iOS native project (Xcode)
├── android/                   # Android native project (Android Studio)
├── capacitor.config.ts        # Capacitor configuration
├── CAPACITOR_DEPLOYMENT_GUIDE.md  # Full deployment guide
└── CAPACITOR_QUICK_START.md   # This file
```

## Key Features Enabled

✅ **Offline Support** - Service worker caches app data  
✅ **Native Feel** - Full-screen app with no browser UI  
✅ **Touch Optimized** - Large buttons work great on mobile  
✅ **Fast Loading** - Cached assets load instantly  
✅ **App Store Ready** - Can be published to iOS and Android stores  

## Testing on Devices

### iOS Simulator
```bash
npx cap open ios
# In Xcode: Select simulator, Product → Run
```

### Android Emulator
```bash
npx cap open android
# In Android Studio: Select emulator, Run app
```

### Physical Device
```bash
# iOS: Connect iPhone, select device in Xcode, Run
# Android: Enable USB debugging, connect phone, Run in Android Studio
```

## Common Tasks

### Update App After Code Changes
```bash
pnpm run build
npx cap sync
npx cap open ios   # or android
```

### Test Offline Mode
1. Enable Airplane Mode on device
2. Use the app normally
3. Verify calculator and logs still work

### Change App Name/ID
Edit `capacitor.config.ts`:
```ts
const config: CapacitorConfig = {
  appId: 'com.boropro.app',      // Change this
  appName: 'BoroPro',             // And this
  webDir: 'dist/public'
};
```

### Add App Icon
1. Create 1024×1024 px PNG
2. iOS: Xcode → App target → General → App Icons
3. Android: Android Studio → res → mipmap folders

## Troubleshooting

| Problem | Solution |
|---------|----------|
| App won't build | Run `pnpm run build && npx cap sync` first |
| Offline mode not working | Check service-worker.js exists in `client/public/` |
| Changes not appearing | Run `npx cap sync` after building |
| iOS build fails | Run `pod install` in `ios/App` directory |
| Android build fails | Run `./gradlew clean` in `android` directory |

## Next Steps

1. **Test on simulator/emulator** - Verify app works
2. **Test on physical device** - Check touch targets and performance
3. **Read CAPACITOR_DEPLOYMENT_GUIDE.md** - For app store submission
4. **Create app store accounts** - Apple Developer + Google Play Developer
5. **Submit for review** - Follow the deployment guide

## Resources

- [Capacitor Docs](https://capacitorjs.com/docs)
- [Full Deployment Guide](./CAPACITOR_DEPLOYMENT_GUIDE.md)
- [iOS Development](https://developer.apple.com)
- [Android Development](https://developer.android.com)

## Questions?

Refer to `CAPACITOR_DEPLOYMENT_GUIDE.md` for detailed instructions on:
- Building for app stores
- Creating signing certificates
- Submitting to App Store and Play Store
- Troubleshooting common issues
