# BoroPro App Store Assets Checklist

## Generated Assets Summary

✅ **10 App Icons** - Various sizes for iOS and Android
✅ **2 Splash Screens** - iOS and Android launch screens
✅ **4 Screenshots** - iPhone, Android, iPad, and Tablet
✅ **1 Feature Graphic** - Google Play Store banner
✅ **1 Notification Icon** - Android push notifications

## Asset Download Links

All assets are stored in `/home/ubuntu/webdev-static-assets/` and available at:

### App Icons (1024×1024 primary)
- `boropro-icon-1024.png` - Primary app store icon
- `boropro-icon-512.png` - High resolution
- `boropro-icon-192.png` - Home screen
- `boropro-icon-180.png` - iPhone
- `boropro-icon-167.png` - iPad Pro
- `boropro-icon-152.png` - iPad
- `boropro-icon-120.png` - iPhone Spotlight
- `boropro-icon-android-192.png` - Android
- `boropro-icon-android-512.png` - Android Play Store
- `boropro-icon-android-108.png` - Android adaptive

### Splash Screens
- `boropro-splash-ios.png` - iOS launch screen (1242×2688 px)
- `boropro-splash-android.png` - Android launch screen (1080×1920 px)

### Screenshots
- `boropro-screenshot-iphone.png` - iPhone app store (1125×2436 px)
- `boropro-screenshot-android.png` - Android app store (1080×1920 px)
- `boropro-screenshot-ipad.png` - iPad app store (2048×1536 px)
- `boropro-screenshot-tablet.png` - Tablet app store (2560×1440 px)

### Marketing
- `boropro-feature-graphic.png` - Google Play feature banner (1024×500 px)
- `boropro-notification-icon.png` - Android notifications (192×192 px)

## iOS App Store Submission

### Required Assets
- [ ] App icon (1024×1024 px) - `boropro-icon-1024.png`
- [ ] Screenshots (minimum 2):
  - [ ] 6.5" display - `boropro-screenshot-iphone.png`
  - [ ] 5.5" display - `boropro-screenshot-iphone.png` (resized)
- [ ] App name: "BoroPro"
- [ ] Subtitle: "Glassblowing Reference Tool"
- [ ] Description: "Professional reheat calculator, kiln logging, and glass science resources for borosilicate glassblowers"
- [ ] Keywords: "glassblowing, calculator, kiln, glass, annealing"
- [ ] Category: Productivity
- [ ] Rating: 4+
- [ ] Privacy Policy URL
- [ ] Support URL

### Icon Placement in Xcode
```
App Icon Set:
├── 1024×1024 (App Store)
├── 180×180 (iPhone)
├── 167×167 (iPad Pro)
├── 152×152 (iPad)
├── 120×120 (iPhone Spotlight)
├── 87×87 (iPhone Spotlight small)
├── 80×80 (iPad Spotlight)
└── 58×58 (iPhone Spotlight small)
```

## Google Play Store Submission

### Required Assets
- [ ] App icon (512×512 px) - `boropro-icon-512.png`
- [ ] Feature graphic (1024×500 px) - `boropro-feature-graphic.png`
- [ ] Screenshots (minimum 2):
  - [ ] Phone - `boropro-screenshot-android.png`
  - [ ] Tablet - `boropro-screenshot-tablet.png` (optional but recommended)
- [ ] App name: "BoroPro"
- [ ] Short description: "Professional glassblowing reference tool"
- [ ] Full description: "Professional reheat calculator, kiln logging, and glass science resources for borosilicate glassblowers"
- [ ] Category: Productivity
- [ ] Content rating: Everyone
- [ ] Privacy Policy URL
- [ ] Support URL

### Icon Placement in Android
```
res/mipmap-*/ic_launcher.png:
├── mipmap-mdpi/ (48×48)
├── mipmap-hdpi/ (72×72)
├── mipmap-xhdpi/ (96×96)
├── mipmap-xxhdpi/ (144×144)
└── mipmap-xxxhdpi/ (192×192)

res/drawable/ic_notification.png:
└── 192×192 (white/transparent)
```

## Pre-Submission Verification

### Design Consistency
- [ ] All icons use same torch design
- [ ] Color scheme matches (amber/orange #b45309 on dark stone #1c1917)
- [ ] Icons are recognizable at small sizes
- [ ] Splash screens match app branding

### Technical Requirements
- [ ] All PNG files are properly formatted
- [ ] No transparency issues on solid backgrounds
- [ ] Icons meet minimum size requirements
- [ ] Screenshots show key app features
- [ ] Feature graphic is landscape (1024×500)

### Content Requirements
- [ ] App description is compelling and accurate
- [ ] Keywords are relevant and searchable
- [ ] Privacy policy is accessible
- [ ] Support URL is valid
- [ ] Screenshots demonstrate core functionality

## Submission Timeline

| Step | iOS | Android | Timeline |
|------|-----|---------|----------|
| Prepare assets | ✓ | ✓ | Day 1 |
| Create developer accounts | ✓ | ✓ | Day 1-2 |
| Set up app listings | ✓ | ✓ | Day 2-3 |
| Upload assets | ✓ | ✓ | Day 3 |
| Submit for review | ✓ | ✓ | Day 3 |
| Approval (typical) | 24-48 hrs | 2-3 hrs | Day 4-5 |
| Live on store | ✓ | ✓ | Day 5-6 |

## Asset Specifications Reference

| Aspect | iOS | Android |
|--------|-----|---------|
| Primary Icon | 1024×1024 | 512×512 |
| Formats | PNG | PNG |
| Transparency | Not required | Not required |
| Safe area | 40px margin | Center focus |
| Screenshots | 2-10 per device | 2-8 total |
| Feature graphic | N/A | 1024×500 |

## Customization Guide

If you need to modify assets:

### Change Icon Color
1. Use image editor (Photoshop, GIMP, Figma)
2. Adjust hue/saturation
3. Export as PNG
4. Upload to app stores

### Resize Icons
```bash
# iOS icon sizes
convert boropro-icon-1024.png -resize 180x180 boropro-icon-180.png
convert boropro-icon-1024.png -resize 152x152 boropro-icon-152.png
convert boropro-icon-1024.png -resize 120x120 boropro-icon-120.png

# Android icon sizes
convert boropro-icon-512.png -resize 192x192 boropro-icon-android-192.png
convert boropro-icon-512.png -resize 144x144 boropro-icon-android-144.png
```

### Update Screenshots
1. Take fresh screenshots from running app
2. Crop to required dimensions
3. Add text overlays if desired
4. Export as PNG/JPG
5. Upload to app stores

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Icon looks blurry | Ensure using correct size (1024×1024 for App Store) |
| Icon rejected | Check for transparency issues, use solid background |
| Screenshot too small | Verify dimensions match store requirements |
| Feature graphic distorted | Ensure 1024×500 aspect ratio |
| Notification icon colored | Use white/transparent only |

## Resources

- [iOS App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Store Policies](https://play.google.com/about/developer-content-policy/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)

## Next Steps

1. ✅ Download all assets from `/home/ubuntu/webdev-static-assets/`
2. ⏭️ Create iOS and Android developer accounts
3. ⏭️ Set up app listings in respective stores
4. ⏭️ Upload assets following platform-specific guides
5. ⏭️ Submit for review
6. ⏭️ Monitor approval status
7. ⏭️ Celebrate launch! 🎉

---

**Last Updated:** May 13, 2026
**Asset Version:** 1.0
**Status:** Ready for submission
