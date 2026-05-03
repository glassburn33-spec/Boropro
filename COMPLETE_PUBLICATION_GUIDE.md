# Complete Android App Publication Guide
## Boro Kiln Research - Full Workflow with Links

---

## PHASE 1: ENVIRONMENT SETUP

### Step 1.1: Install Java Development Kit (JDK 17+)

**Links:**
- JDK Download: https://www.oracle.com/java/technologies/downloads/
- OpenJDK Alternative: https://adoptium.net/

**Windows:**
1. Download JDK 17+ from https://www.oracle.com/java/technologies/downloads/
2. Run installer and follow prompts
3. Set JAVA_HOME environment variable:
   - Right-click "This PC" → Properties → Advanced system settings
   - Click "Environment Variables"
   - New → Variable name: `JAVA_HOME`
   - Variable value: `C:\Program Files\Java\jdk-17` (adjust version number)
4. Verify installation:
   ```bash
   java -version
   ```

**macOS:**
```bash
# Using Homebrew
brew install openjdk@17

# Set JAVA_HOME
echo 'export JAVA_HOME=$(/usr/libexec/java_home -v 17)' >> ~/.zshrc
source ~/.zshrc

# Verify
java -version
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install openjdk-17-jdk

# Verify
java -version
```

---

### Step 1.2: Install Android Studio

**Link:** https://developer.android.com/studio

**Installation Steps:**

1. **Download Android Studio**
   - Go to https://developer.android.com/studio
   - Click "Download Android Studio"
   - Choose your operating system (Windows, macOS, Linux)

2. **Install Android Studio**
   - Run the installer
   - Follow the setup wizard
   - Choose "Standard" installation (recommended)
   - Accept licenses when prompted

3. **Configure Android SDK**
   - Open Android Studio
   - Go to Tools → SDK Manager
   - Install these components:
     - Android SDK Platform 34 (or latest)
     - Android SDK Build-Tools 34.0.0
     - Android Emulator
     - Android SDK Platform-Tools
     - Google Play services

4. **Set ANDROID_HOME Environment Variable**

   **Windows:**
   - Right-click "This PC" → Properties → Advanced system settings
   - Click "Environment Variables"
   - New → Variable name: `ANDROID_HOME`
   - Variable value: `C:\Users\YourUsername\AppData\Local\Android\Sdk`
   - Click OK and restart terminal

   **macOS:**
   ```bash
   echo 'export ANDROID_HOME=$HOME/Library/Android/sdk' >> ~/.zshrc
   echo 'export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin' >> ~/.zshrc
   echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools' >> ~/.zshrc
   source ~/.zshrc
   ```

   **Linux:**
   ```bash
   echo 'export ANDROID_HOME=$HOME/Android/Sdk' >> ~/.bashrc
   echo 'export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin' >> ~/.bashrc
   echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools' >> ~/.bashrc
   source ~/.bashrc
   ```

5. **Verify Installation**
   ```bash
   adb --version
   ```

---

### Step 1.3: Install Node.js and pnpm

**Links:**
- Node.js: https://nodejs.org/
- pnpm: https://pnpm.io/

**Steps:**

1. **Install Node.js (v18+)**
   - Go to https://nodejs.org/
   - Download LTS version
   - Run installer and follow prompts

2. **Install pnpm**
   ```bash
   npm install -g pnpm
   ```

3. **Verify Installation**
   ```bash
   node --version
   pnpm --version
   ```

---

## PHASE 2: CREATE SIGNING KEY

### Step 2.1: Generate Release Keystore

**What is a keystore?** A file that contains your private key used to sign the Android app. Keep this file safe - you'll need it for all future updates.

**Generate Keystore:**

```bash
keytool -genkey -v -keystore boro-kiln-release-key.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias boro-kiln-key
```

**When prompted, enter:**
- Keystore password: `[Create a strong password]`
- Key password: `[Same as keystore password]`
- First and last name: `Your Name`
- Organization unit: `Glass Art`
- Organization: `Boro Kiln Research`
- City: `Your City`
- State: `Your State`
- Country code: `US` (or your country)

**Output:** `boro-kiln-release-key.jks` file created in your project directory

**⚠️ IMPORTANT:**
- Save the keystore file in a safe location (preferably version controlled but not in git)
- Remember the passwords
- You'll need this keystore for every app update

---

### Step 2.2: Configure Signing in Build File

**File:** `/home/ubuntu/boro_kiln_research/android/app/build.gradle`

**Add this section before `buildTypes`:**

```gradle
signingConfigs {
    release {
        storeFile = file("../boro-kiln-release-key.jks")
        storePassword = "YOUR_KEYSTORE_PASSWORD"
        keyAlias = "boro-kiln-key"
        keyPassword = "YOUR_KEY_PASSWORD"
    }
}

buildTypes {
    release {
        signingConfig = signingConfigs.release
        minifyEnabled false
        proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
    }
}
```

**Replace:**
- `YOUR_KEYSTORE_PASSWORD` with your keystore password
- `YOUR_KEY_PASSWORD` with your key password

---

## PHASE 3: BUILD THE APP

### Step 3.1: Build Web App and Sync to Android

```bash
cd /home/ubuntu/boro_kiln_research

# Build web app
pnpm run build

# Sync to Android
npx cap sync android
```

**Expected output:**
```
✓ Copying web assets from public to android/app/src/main/assets/public
✓ Updating Android plugins
```

---

### Step 3.2: Build Android App Bundle (AAB)

**AAB is required for Play Store (APK is only for testing)**

```bash
cd /home/ubuntu/boro_kiln_research

# Build AAB
pnpm run android:aab
```

Or manually:
```bash
cd /home/ubuntu/boro_kiln_research/android
./gradlew bundleRelease
```

**Expected output:**
```
BUILD SUCCESSFUL in XXs
```

**AAB file location:**
```
android/app/build/outputs/bundle/release/app-release.aab
```

---

### Step 3.3: Verify AAB File

```bash
ls -lh /home/ubuntu/boro_kiln_research/android/app/build/outputs/bundle/release/app-release.aab
```

File should be 30-50 MB in size.

---

## PHASE 4: CREATE GOOGLE PLAY DEVELOPER ACCOUNT

### Step 4.1: Create Google Account (if needed)

**Link:** https://accounts.google.com/signup

1. Go to https://accounts.google.com/signup
2. Fill in your details
3. Verify your phone number
4. Complete security verification

---

### Step 4.2: Register as Play Store Developer

**Link:** https://play.google.com/console

1. Go to https://play.google.com/console
2. Click "Create account"
3. Accept Developer Agreement and Policies
4. Pay $25 registration fee (one-time)
5. Complete your developer profile:
   - Developer name
   - Contact email
   - Website (optional)
   - Phone number

**Expected time:** 10-15 minutes

---

## PHASE 5: CREATE APP LISTING

### Step 5.1: Create New App

**Link:** https://play.google.com/console

1. Go to https://play.google.com/console
2. Click "Create app"
3. Enter app name: `Boro Kiln Research`
4. Select default language: `English`
5. Select category: `Education` or `Productivity`
6. Select content rating: `Everyone`
7. Click "Create app"

---

### Step 5.2: Fill in App Information

**Go to:** All apps → Boro Kiln Research → Store listing

**Fill in these fields:**

#### Short Description (80 characters max)
```
Master borosilicate kiln annealing with interactive flame chemistry and schedules
```

#### Full Description (4000 characters max)
```
Boro Kiln Research is a comprehensive educational platform for borosilicate glass artists learning kiln annealing, color striking, and flame chemistry.

FEATURES:

🔥 Flame Chemistry Simulator
Explore how neutral, oxidizing, and reducing flames affect borosilicate colors in real-time. Understand metal behavior and color development for cobalt blues, copper rubies, silver exotics, amber purples, and heat-sensitive opaques.

🎨 Color Picker & Schedule Generator
Select multiple Northstar colors from your project and generate combined annealing schedules automatically. The tool flags conflicts between heat-sensitive and reduction-sensitive colors, ensuring safe firing practices.

📊 Test Firing Tracker
Log your test firings with detailed metadata: kiln model, anneal temperature, glass thickness, color accuracy, and notes. Track outcomes over time to identify patterns in your kiln behavior and refine your techniques.

📄 PDF Schedule Library
Upload existing kiln schedules as PDFs to extract temperature and time data. Generate professional PDF schedules from your color selections and build a personal library for reference and comparison.

EDUCATIONAL CONTENT:

• Hollow vs. solid form annealing with effective thickness calculations
• Slumping schedules for different glass thicknesses
• Metal compositions in borosilicate colors (cobalt, copper, silver, exotic striking colors)
• Flame annealing techniques for thin-wall work
• Neutral, oxidizing, and reducing flame chemistry and effects
• Striking color processes and heat-sensitive opaque handling
• Kiln vs. flame striking methods
• Reduction color theory and development

DESIGNED FOR:

• Borosilicate glass blowers and lampworkers
• Sculptural glass artists
• Glass educators and students
• Anyone learning advanced kiln annealing techniques

KEY BENEFITS:

✓ Explore data more intuitively with interactive visualizations
✓ Understand trends better through color-specific guidance
✓ Easily save and share firing records and schedules
✓ Build a personal database of successful techniques
✓ Learn from your kiln's unique behavior patterns

DATA PRIVACY:

All data (firing records, PDF library, color selections) is stored locally on your device. No data is sent to external servers. Your firing history and personal schedules remain private.

DISCLAIMER:

This app is an educational tool to support learning and experimentation. Always follow manufacturer instructions, calibrate your kiln regularly, test thoroughly, and use professional judgment for high-value work. The developers are not responsible for firing failures or material loss.
```

#### Screenshots (2-8 images, 1080x1920 px each)

You need to create or capture screenshots showing:
1. Flame Chemistry Simulator
2. Color Picker & Schedule Generator
3. Test Firing Tracker
4. PDF Library
5. Schedule Details

**Tools for creating screenshots:**
- Android Emulator (built into Android Studio)
- Physical device with USB debugging enabled
- Screenshot tools like Figma or Photoshop

#### Feature Graphic (1024x500 px)

Create an image showing:
- App name: "Boro Kiln Research"
- Tagline: "Master Borosilicate Kiln Annealing"
- Visual: Flame, kiln, or glass imagery
- Colors: Dark background with amber accents

**Design tools:**
- Figma: https://www.figma.com/
- Canva: https://www.canva.com/
- Adobe Express: https://www.adobe.com/express/

#### Icon (512x512 px)

Create a circular app icon with:
- Furnace/kiln theme
- Amber and stone colors
- Geometric, scientific aesthetic
- Clear at small sizes

---

### Step 5.3: Add Content Rating

**Go to:** All apps → Boro Kiln Research → Content rating

1. Click "Set up content rating"
2. Select category: `Education`
3. Answer questionnaire (usually all "No")
4. Get rating: `Everyone` (typical for educational apps)

---

### Step 5.4: Add Privacy Policy

**Go to:** All apps → Boro Kiln Research → Store listing → Privacy policy

**Link to privacy policy:**
```
[Your website]/privacy-policy
```

Or use this template:
```
PRIVACY POLICY

The App does NOT collect, store, or transmit personal data to external servers. 
All data is stored locally on your device using browser localStorage.

LOCAL DATA:
• Test firing records
• PDF library metadata
• Color selections and schedules
• User preferences

PERMISSIONS:
• INTERNET - For loading web content
• READ_EXTERNAL_STORAGE - For uploading PDF files
• WRITE_EXTERNAL_STORAGE - For downloading PDF files

The App does not integrate with third-party analytics or advertising services.
```

---

## PHASE 6: UPLOAD APP BUNDLE

### Step 6.1: Go to Release Management

**Link:** https://play.google.com/console

1. Go to https://play.google.com/console
2. Select "Boro Kiln Research" app
3. Go to Release → Production (left sidebar)

---

### Step 6.2: Create New Release

1. Click "Create new release"
2. Click "Browse files" under "App bundles"
3. Select your AAB file:
   ```
   /home/ubuntu/boro_kiln_research/android/app/build/outputs/bundle/release/app-release.aab
   ```
4. Click "Upload"

**Expected:** File uploads (may take 1-2 minutes)

---

### Step 6.3: Add Release Notes

1. In "Release notes" field, enter:
   ```
   Initial release of Boro Kiln Research for Android.
   
   Features:
   • Flame Chemistry Simulator with real-time color effects
   • Color Picker & Schedule Generator with conflict detection
   • Test Firing Tracker with localStorage persistence
   • PDF Schedule Library with upload and extraction
   • Comprehensive educational content on kiln annealing
   
   All data stored locally on device. No cloud sync in this version.
   ```

2. Click "Save"

---

### Step 6.4: Review and Submit

1. Review all information:
   - ✓ App name
   - ✓ Description
   - ✓ Screenshots
   - ✓ Icon
   - ✓ Feature graphic
   - ✓ Content rating
   - ✓ Privacy policy
   - ✓ AAB file uploaded

2. Click "Review release"

3. Verify all details are correct

4. Click "Start rollout to Production"

5. Confirm you want to publish to production

---

## PHASE 7: MONITOR PUBLICATION

### Step 7.1: Track Review Status

**Link:** https://play.google.com/console

1. Go to Release → Production
2. Watch status change:
   - "In review" (24-72 hours)
   - "Approved" (app goes live)
   - "Rejected" (fix issues and resubmit)

---

### Step 7.2: Check Play Store Listing

Once approved:
1. Go to Google Play Store: https://play.google.com/store
2. Search for "Boro Kiln Research"
3. Verify app appears with correct details
4. Test download and installation

---

## PHASE 8: POST-LAUNCH

### Step 8.1: Monitor Reviews and Ratings

**Link:** https://play.google.com/console

1. Go to Ratings & reviews
2. Monitor user feedback
3. Respond to reviews (especially negative ones)
4. Fix bugs and issues reported

---

### Step 8.2: Plan Updates

To release a new version:

1. Update version in `android/app/build.gradle`:
   ```gradle
   versionCode = 2  // Increment this
   versionName = "1.1.0"
   ```

2. Make code changes and rebuild:
   ```bash
   pnpm run build
   npx cap sync android
   pnpm run android:aab
   ```

3. Upload new AAB to Play Store (same process as initial release)

---

## TROUBLESHOOTING

### Build Fails

**Error:** `gradle not found`
```bash
# Solution: Set ANDROID_HOME
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
```

**Error:** `java: command not found`
```bash
# Solution: Set JAVA_HOME
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
```

---

### AAB Upload Fails

**Error:** `App is not signed`
```bash
# Solution: Verify signing config in build.gradle
# Check keystore file exists and passwords are correct
```

**Error:** `Version code already used`
```bash
# Solution: Increment versionCode in build.gradle
versionCode = 2  # Was 1, now 2
```

---

### App Crashes on Device

**Check logs:**
```bash
adb logcat | grep boro-kiln
```

**Verify web assets:**
```bash
ls -la android/app/src/main/assets/public/
```

---

## QUICK REFERENCE COMMANDS

```bash
# Build and sync
pnpm run android:build

# Generate APK (for testing)
pnpm run android:apk

# Generate AAB (for Play Store)
pnpm run android:aab

# Open Android Studio
pnpm run android:open

# Check logs
adb logcat | grep boro-kiln

# Install APK on device
adb install android/app/build/outputs/apk/release/app-release.apk
```

---

## USEFUL LINKS SUMMARY

| Task | Link |
|------|------|
| Java JDK | https://www.oracle.com/java/technologies/downloads/ |
| Android Studio | https://developer.android.com/studio |
| Android Documentation | https://developer.android.com/docs |
| Google Play Console | https://play.google.com/console |
| Play Store Help | https://support.google.com/googleplay/android-developer |
| Capacitor Docs | https://capacitorjs.com/docs/android |
| App Signing Guide | https://developer.android.com/studio/publish/app-signing |
| Play Store Policies | https://play.google.com/about/developer-content-policy/ |
| Design Guidelines | https://material.io/design |
| Figma (Design) | https://www.figma.com/ |
| Canva (Design) | https://www.canva.com/ |

---

## CHECKLIST

- [ ] JDK 17+ installed and JAVA_HOME set
- [ ] Android Studio installed and SDK configured
- [ ] ANDROID_HOME environment variable set
- [ ] Node.js and pnpm installed
- [ ] Release keystore created (boro-kiln-release-key.jks)
- [ ] Signing config added to build.gradle
- [ ] Web app built successfully
- [ ] AAB file generated (app-release.aab)
- [ ] Google Play Developer account created ($25 paid)
- [ ] App listing created
- [ ] Screenshots prepared (2-8 images)
- [ ] Feature graphic created (1024x500 px)
- [ ] App icon created (512x512 px)
- [ ] Description and privacy policy added
- [ ] Content rating set
- [ ] AAB file uploaded to Play Store
- [ ] Release submitted for review
- [ ] App approved and published
- [ ] App appears in Play Store
- [ ] Downloaded and tested on device

---

## ESTIMATED TIMELINE

| Phase | Time |
|-------|------|
| Environment setup | 30-60 minutes |
| Create signing key | 5 minutes |
| Build app | 10 minutes |
| Create Play Store account | 15 minutes |
| Create app listing | 30-60 minutes |
| Create assets (screenshots, icons) | 1-2 hours |
| Upload and submit | 10 minutes |
| Play Store review | 24-72 hours |
| **Total** | **3-5 hours + 24-72 hour review** |

---

## SUPPORT RESOURCES

- **Capacitor Android Guide**: https://capacitorjs.com/docs/basics/workflow
- **Play Store Developer Help**: https://support.google.com/googleplay/android-developer
- **Android Developer Docs**: https://developer.android.com/docs
- **Material Design**: https://material.io/design
- **Stack Overflow**: https://stackoverflow.com/questions/tagged/android

---

**Good luck with your Play Store launch! 🚀**

If you encounter any issues, refer to the troubleshooting section or check the support resources above.
