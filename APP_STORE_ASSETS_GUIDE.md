# BoroPro App Store Assets Guide

## Overview

All required app icons, splash screens, and screenshots for iOS App Store and Google Play Store have been generated. This guide explains where to use each asset.

## Generated Assets

### App Icons

All icons follow the BoroPro design: golden torch flame in a circular border with warm amber/orange glow on dark stone background.

| Asset | Size | Use Case | Location |
|-------|------|----------|----------|
| `boropro-icon-1024.png` | 1024×1024 px | App Store listing (iOS & Android) | App Store Connect & Google Play Console |
| `boropro-icon-512.png` | 512×512 px | High-resolution icon | App Store Connect |
| `boropro-icon-192.png` | 192×192 px | Home screen (Android) | `android/app/src/main/res/mipmap-xxxhdpi/` |
| `boropro-icon-180.png` | 180×180 px | iPhone home screen | Xcode Asset Catalog |
| `boropro-icon-167.png` | 167×167 px | iPad Pro home screen | Xcode Asset Catalog |
| `boropro-icon-152.png` | 152×152 px | iPad home screen | Xcode Asset Catalog |
| `boropro-icon-120.png` | 120×120 px | iPhone spotlight search | Xcode Asset Catalog |
| `boropro-icon-android-192.png` | 192×192 px | Android launcher icon | `android/app/src/main/res/mipmap-hdpi/` |
| `boropro-icon-android-512.png` | 512×512 px | Google Play Store | Google Play Console |
| `boropro-icon-android-108.png` | 108×108 px | Android adaptive icon | `android/app/src/main/res/mipmap-xxxhdpi/` |
| `boropro-notification-icon.png` | 192×192 px | Push notifications | `android/app/src/main/res/drawable/` |

### Splash Screens

Splash screens display while the app loads on first launch.

| Asset | Dimensions | Platform | Use Case |
|-------|-----------|----------|----------|
| `boropro-splash-ios.png` | 1242×2688 px | iOS | 6.5" display (iPhone 11 Pro Max, etc.) |
| `boropro-splash-android.png` | 1080×1920 px | Android | Standard Android device |

### App Store Screenshots

Screenshots showcase app features in the app store listing.

| Asset | Dimensions | Platform | Feature Shown |
|-------|-----------|----------|----------------|
| `boropro-screenshot-iphone.png` | 1125×2436 px | iOS | Reheat calculator interface |
| `boropro-screenshot-android.png` | 1080×1920 px | Android | Reheat calculator interface |
| `boropro-screenshot-ipad.png` | 2048×1536 px | iOS | Kiln logging interface |
| `boropro-screenshot-tablet.png` | 2560×1440 px | Android | Firing tracker interface |

### Marketing Graphics

| Asset | Dimensions | Use Case |
|-------|-----------|----------|
| `boropro-feature-graphic.png` | 1024×500 px | Google Play Store feature banner |

## iOS App Store Setup

### 1. Add Icons to Xcode

1. Open `ios/App/App.xcworkspace` in Xcode
2. Select "App" target
3. Go to "Build Settings" → "App Icons and Launch Images"
4. Click "+" to add new icon set
5. Name it "AppIcon"
6. Drag icons to appropriate slots:
   - 1024×1024 → App Store
   - 180×180 → iPhone
   - 167×167 → iPad Pro
   - 152×152 → iPad
   - 120×120 → iPhone Spotlight
   - 87×87 → iPhone Spotlight (small)
   - 80×80 → iPad Spotlight
   - 58×58 → iPhone Spotlight (small)

### 2. Add Splash Screen

1. In Xcode, select "App" target
2. Go to "Build Settings" → "Launch Screen"
3. Create new Launch Screen storyboard or use provided splash image
4. Set `boropro-splash-ios.png` as launch image

### 3. Upload Screenshots to App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Select your app
3. Go to "App Previews and Screenshots"
4. For each device type (6.7", 6.5", 5.5"):
   - Click "+" to add screenshot
   - Upload `boropro-screenshot-iphone.png`
   - Add description (optional)

## Android App Store Setup

### 1. Add Icons to Android Project

#### Launcher Icons

1. Open Android Studio
2. Right-click `app/src/main/res` → "New" → "Image Asset"
3. Select "Launcher Icons (Adaptive and Legacy)"
4. Upload `boropro-icon-android-512.png`
5. Set background color to dark stone (#1c1917)
6. Click "Next" → "Finish"

This automatically creates:
- `mipmap-hdpi/ic_launcher.png` (72×72)
- `mipmap-mdpi/ic_launcher.png` (48×48)
- `mipmap-xhdpi/ic_launcher.png` (96×96)
- `mipmap-xxhdpi/ic_launcher.png` (144×144)
- `mipmap-xxxhdpi/ic_launcher.png` (192×192)

#### Notification Icon

1. Copy `boropro-notification-icon.png` to `app/src/main/res/drawable/`
2. Rename to `ic_notification.png`
3. In `AndroidManifest.xml`, add:
   ```xml
   <application>
     <meta-data
       android:name="com.google.firebase.messaging.default_notification_icon"
       android:resource="@drawable/ic_notification" />
   </application>
   ```

### 2. Add Splash Screen

1. Create `app/src/main/res/drawable/splash_screen.xml`:
   ```xml
   <?xml version="1.0" encoding="utf-8"?>
   <layer-list xmlns:android="http://schemas.android.com/apk/res/android">
     <item android:drawable="@color/splash_background" />
     <item>
       <bitmap
         android:src="@drawable/splash_logo"
         android:gravity="center" />
     </item>
   </layer-list>
   ```

2. Add to `app/src/main/res/values/colors.xml`:
   ```xml
   <color name="splash_background">#1c1917</color>
   ```

3. Copy `boropro-splash-android.png` to `app/src/main/res/drawable/`
4. Rename to `splash_logo.png`

### 3. Upload Screenshots to Google Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Select your app
3. Go to "Store listing" → "Screenshots"
4. For each device type:
   - Click "+" to add screenshot
   - Upload `boropro-screenshot-android.png` (phone)
   - Upload `boropro-screenshot-tablet.png` (tablet)

### 4. Upload Feature Graphic

1. In Google Play Console, go to "Store listing"
2. Under "Feature graphic", upload `boropro-feature-graphic.png`

## Asset Specifications Summary

### iOS Requirements

- **App Icon**: 1024×1024 px (required for App Store)
- **Minimum iOS Version**: 14.0+
- **Supported Devices**: iPhone, iPad
- **Safe Area**: Avoid placing critical content in outer 40px margin
- **Format**: PNG with transparency support

### Android Requirements

- **App Icon**: 192×192 px (xxxhdpi), 144×144 px (xxhdpi), 96×96 px (xhdpi), 72×72 px (hdpi), 48×48 px (mdpi)
- **Notification Icon**: 192×192 px (must be white/transparent, no colors)
- **Minimum Android Version**: API 21 (Android 5.0)
- **Format**: PNG with transparency support

### App Store Requirements

#### iOS App Store
- **App Icon**: 1024×1024 px (square, no transparency)
- **Screenshots**: 
  - 6.7" (1290×2796 px)
  - 6.5" (1242×2688 px)
  - 5.5" (1242×2208 px)
- **Minimum**: 2 screenshots per device type
- **Maximum**: 10 screenshots per device type
- **Format**: PNG or JPG

#### Google Play Store
- **App Icon**: 512×512 px (square, no transparency)
- **Feature Graphic**: 1024×500 px (landscape)
- **Screenshots**:
  - Phone: 1080×1920 px (minimum 2, maximum 8)
  - Tablet: 1440×2560 px (optional, but recommended)
- **Format**: PNG or JPG

## File Locations

All generated assets are stored in `/home/ubuntu/webdev-static-assets/`:

```
/home/ubuntu/webdev-static-assets/
├── boropro-icon-1024.png
├── boropro-icon-512.png
├── boropro-icon-192.png
├── boropro-icon-180.png
├── boropro-icon-167.png
├── boropro-icon-152.png
├── boropro-icon-120.png
├── boropro-icon-android-192.png
├── boropro-icon-android-512.png
├── boropro-icon-android-108.png
├── boropro-notification-icon.png
├── boropro-splash-ios.png
├── boropro-splash-android.png
├── boropro-screenshot-iphone.png
├── boropro-screenshot-android.png
├── boropro-screenshot-ipad.png
├── boropro-screenshot-tablet.png
└── boropro-feature-graphic.png
```

## Quick Deployment Checklist

### Before iOS Submission
- [ ] All icons added to Xcode Asset Catalog
- [ ] Splash screen configured
- [ ] Screenshots uploaded to App Store Connect
- [ ] App name, description, keywords set
- [ ] Privacy policy URL added
- [ ] Support URL added
- [ ] Category selected (Productivity/Utilities)
- [ ] Rating set (4+)

### Before Android Submission
- [ ] Launcher icons added to Android project
- [ ] Notification icon added
- [ ] Splash screen configured
- [ ] Screenshots uploaded to Google Play Console
- [ ] Feature graphic uploaded
- [ ] App description and keywords set
- [ ] Privacy policy URL added
- [ ] Support URL added
- [ ] Category selected (Productivity)
- [ ] Content rating completed

## Customization

If you need to modify any assets:

1. **Change colors**: Edit the prompt in the generation command
2. **Adjust text**: Use image editing software (Photoshop, GIMP, Figma)
3. **Add branding**: Layer your logo on top of existing assets
4. **Resize**: Use ImageMagick or online tools (maintain aspect ratio)

```bash
# Example: Resize icon to specific size
convert boropro-icon-1024.png -resize 512x512 boropro-icon-512-custom.png
```

## Support

For issues with:
- **Asset placement**: See platform-specific guides above
- **App Store submission**: Check official guidelines
- **Asset generation**: Refer to the generation prompts in this guide

## Next Steps

1. Download all assets from `/home/ubuntu/webdev-static-assets/`
2. Follow platform-specific setup instructions above
3. Upload to respective app stores
4. Submit for review

Good luck! 🚀
