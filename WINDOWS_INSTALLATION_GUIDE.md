# Windows Installation Guide
## JDK 17+, Node.js, and pnpm

---

## PART 1: INSTALL JDK 17+

### Step 1.1: Download JDK 17+

**Option A: Oracle JDK (Official)**

1. Go to: https://www.oracle.com/java/technologies/downloads/
2. Look for "Java 17" or latest LTS version (currently Java 21 or 23)
3. Under "Windows", click the download link for **x64 Installer** (`.msi` file)
4. You may need to create an Oracle account (free) or just click "Download" if available
5. File will be named something like: `jdk-17_windows-x64_bin.msi` or `jdk-21_windows-x64_bin.msi`

**Option B: OpenJDK (Free Alternative)**

1. Go to: https://adoptium.net/
2. Look for "Eclipse Temurin JDK 17 LTS" (or latest LTS)
3. Click "Latest LTS Release"
4. Choose:
   - **Operating System:** Windows
   - **Architecture:** x64
   - **Package Type:** `.msi` (installer)
5. Click "Download"

**Recommended:** Use OpenJDK (Adoptium) - it's free and doesn't require account creation.

---

### Step 1.2: Install JDK

1. **Locate the downloaded file**
   - Usually in your `Downloads` folder
   - File name: `jdk-17_windows-x64_bin.msi` or similar

2. **Double-click the installer**
   - Windows will show a security prompt: "Do you want to allow this app to make changes to your device?"
   - Click **"Yes"**

3. **Follow the installation wizard**

   **Screen 1: Welcome**
   - Click **"Next >"**

   **Screen 2: Custom Setup**
   - Keep all defaults checked
   - Click **"Next >"**

   **Screen 3: Installation Folder**
   - Default location: `C:\Program Files\Java\jdk-17` (or similar)
   - **Do NOT change this** - keep the default
   - Click **"Next >"**

   **Screen 4: Installing**
   - Wait for installation to complete (2-3 minutes)
   - You'll see a progress bar

   **Screen 5: Completed**
   - Click **"Close"**

4. **Verify Installation**
   - Open Command Prompt (press `Win + R`, type `cmd`, press Enter)
   - Type: `java -version`
   - Press Enter
   - You should see output like:
     ```
     java version "17.0.x" 2021-09-14 LTS
     Java(TM) SE Runtime Environment (build 17.0.x+8-LTS-39)
     Java HotSpot(TM) 64-Bit Server VM (build 17.0.x+8-LTS-39, mixed mode, sharing)
     ```

✅ **JDK is installed!**

---

### Step 1.3: Set JAVA_HOME Environment Variable (Important!)

This tells Android SDK where to find Java.

1. **Open File Explorer**
   - Press `Win + E`

2. **Right-click "This PC" in the left sidebar**
   - Select **"Properties"**

3. **Click "Advanced system settings"** (on the right side)
   - A window titled "System Properties" will open

4. **Click the "Environment Variables" button** (bottom right)
   - A new window titled "Environment Variables" will open

5. **Create new User Variable**
   - In the top section "User variables for [YourUsername]", click **"New"**
   - Variable name: `JAVA_HOME`
   - Variable value: `C:\Program Files\Java\jdk-17` (or the folder where you installed Java)
   - Click **"OK"**

6. **Verify the variable was added**
   - You should see `JAVA_HOME` in the list
   - Click **"OK"** to close Environment Variables window
   - Click **"OK"** to close System Properties window

7. **Restart Command Prompt** (important!)
   - Close any open Command Prompt windows
   - Open a new Command Prompt
   - Type: `echo %JAVA_HOME%`
   - Press Enter
   - You should see: `C:\Program Files\Java\jdk-17` (or your installation path)

✅ **JAVA_HOME is set!**

---

## PART 2: INSTALL NODE.JS

### Step 2.1: Download Node.js

1. Go to: https://nodejs.org/en/download/
2. You'll see two options:
   - **LTS** (Long Term Support) - Recommended ✅
   - **Current** (Latest features, less stable)
3. Click the **LTS** button
4. Choose **Windows Installer (.msi)** for 64-bit
5. File will download: `node-v20.x.x-x64.msi` (or similar)

---

### Step 2.2: Install Node.js

1. **Locate the downloaded file**
   - Usually in your `Downloads` folder
   - File name: `node-v20.x.x-x64.msi`

2. **Double-click the installer**
   - Windows will show a security prompt
   - Click **"Yes"**

3. **Follow the installation wizard**

   **Screen 1: Welcome**
   - Click **"Next >"**

   **Screen 2: End-User License Agreement**
   - Check the box: "I accept the terms in the License Agreement"
   - Click **"Next >"**

   **Screen 3: Destination Folder**
   - Default: `C:\Program Files\nodejs`
   - **Keep this default**
   - Click **"Next >"**

   **Screen 4: Custom Setup**
   - Make sure these are checked:
     - ✅ Node.js runtime
     - ✅ npm package manager
     - ✅ Online documentation shortcuts
     - ✅ Add to PATH
   - Click **"Next >"**

   **Screen 5: Tools for Native Modules**
   - You can check or uncheck this (not needed for our app)
   - Click **"Next >"**

   **Screen 6: Ready to Install**
   - Click **"Install"**
   - Wait for installation (2-3 minutes)

   **Screen 7: Completed**
   - Click **"Finish"**

4. **Verify Installation**
   - Open a **new** Command Prompt (press `Win + R`, type `cmd`, press Enter)
   - Type: `node --version`
   - Press Enter
   - You should see: `v20.x.x` (or similar)
   - Type: `npm --version`
   - Press Enter
   - You should see: `10.x.x` (or similar)

✅ **Node.js is installed!**

---

## PART 3: INSTALL PNPM

### Step 3.1: Install pnpm via npm

pnpm is a package manager for Node.js. We'll install it using npm (which came with Node.js).

1. **Open Command Prompt**
   - Press `Win + R`
   - Type: `cmd`
   - Press Enter

2. **Install pnpm**
   - Type: `npm install -g pnpm`
   - Press Enter
   - Wait for installation (1-2 minutes)
   - You should see output like:
     ```
     added 200 packages in 45s
     ```

3. **Verify Installation**
   - Type: `pnpm --version`
   - Press Enter
   - You should see: `8.x.x` or `9.x.x` (or similar)

✅ **pnpm is installed!**

---

## PART 4: INSTALL ANDROID STUDIO (Optional but Recommended)

### Step 4.1: Download Android Studio

1. Go to: https://developer.android.com/studio
2. Click **"Download Android Studio"**
3. Accept the terms and click **"Download Android Studio [version]"**
4. File will download: `android-studio-[version]-windows.exe`

---

### Step 4.2: Install Android Studio

1. **Double-click the installer**
   - Windows will show a security prompt
   - Click **"Yes"**

2. **Follow the setup wizard**

   **Screen 1: Welcome**
   - Click **"Next"**

   **Screen 2: Choose Components**
   - Keep all defaults checked
   - Click **"Next"**

   **Screen 3: Configuration Settings**
   - Default: `C:\Users\[YourUsername]\AppData\Local\Android\Sdk`
   - **Keep this default**
   - Click **"Next"**

   **Screen 4: Choose Start Menu Folder**
   - Keep default
   - Click **"Install"**
   - Wait for installation (5-10 minutes)

   **Screen 5: Completing Setup**
   - Check: "Start Android Studio"
   - Click **"Finish"**

3. **First Launch Setup**
   - Android Studio will open
   - It may ask about importing settings - click **"Do not import settings"**
   - Wait for it to download SDK components (5-10 minutes)

4. **Configure SDK Manager**
   - Go to: **Tools → SDK Manager**
   - Make sure these are installed:
     - Android SDK Platform 34 (or latest)
     - Android SDK Build-Tools 34.0.0
     - Android Emulator
     - Android SDK Platform-Tools
     - Google Play services
   - Click **"OK"** to install any missing components

---

### Step 4.3: Set ANDROID_HOME Environment Variable

1. **Open File Explorer**
   - Press `Win + E`

2. **Right-click "This PC"**
   - Select **"Properties"**

3. **Click "Advanced system settings"**

4. **Click "Environment Variables"**

5. **Create new User Variable**
   - Click **"New"**
   - Variable name: `ANDROID_HOME`
   - Variable value: `C:\Users\[YourUsername]\AppData\Local\Android\Sdk`
   - Click **"OK"**

6. **Create new PATH entry**
   - In the "User variables" section, find or create `PATH`
   - Click **"Edit"** (or **"New"** if it doesn't exist)
   - Click **"New"**
   - Add: `C:\Users\[YourUsername]\AppData\Local\Android\Sdk\cmdline-tools\latest\bin`
   - Click **"OK"**
   - Click **"New"** again
   - Add: `C:\Users\[YourUsername]\AppData\Local\Android\Sdk\platform-tools`
   - Click **"OK"** multiple times to close all windows

7. **Restart Command Prompt**
   - Close any open Command Prompt windows
   - Open a new Command Prompt
   - Type: `echo %ANDROID_HOME%`
   - Press Enter
   - You should see: `C:\Users\[YourUsername]\AppData\Local\Android\Sdk`

✅ **ANDROID_HOME is set!**

---

## VERIFICATION CHECKLIST

Open Command Prompt and verify all installations:

```bash
# Check Java
java -version
# Expected: java version "17.0.x" or higher

# Check Node.js
node --version
# Expected: v20.x.x or higher

# Check npm
npm --version
# Expected: 10.x.x or higher

# Check pnpm
pnpm --version
# Expected: 8.x.x or higher

# Check JAVA_HOME
echo %JAVA_HOME%
# Expected: C:\Program Files\Java\jdk-17 (or similar)

# Check ANDROID_HOME
echo %ANDROID_HOME%
# Expected: C:\Users\[YourUsername]\AppData\Local\Android\Sdk
```

All commands should show version numbers (not "command not found").

---

## NEXT STEPS

Once all installations are verified:

1. **Navigate to your project**
   ```bash
   cd C:\Users\[YourUsername]\path\to\boro_kiln_research
   ```

2. **Build the Android app**
   ```bash
   pnpm run android:build
   ```

3. **Generate AAB for Play Store**
   ```bash
   pnpm run android:aab
   ```

4. **Follow the Play Store publication guide** (see COMPLETE_PUBLICATION_GUIDE.md)

---

## TROUBLESHOOTING

### "java: command not found"
- **Solution:** JAVA_HOME not set or Command Prompt not restarted
- Restart Command Prompt and try again
- Verify JAVA_HOME: `echo %JAVA_HOME%`

### "node: command not found"
- **Solution:** Node.js not installed or PATH not updated
- Restart Command Prompt and try again
- Verify Node.js: `node --version`

### "pnpm: command not found"
- **Solution:** pnpm not installed
- Run: `npm install -g pnpm`
- Restart Command Prompt and try again

### "gradle: command not found"
- **Solution:** Android SDK not installed
- Install Android Studio and configure ANDROID_HOME
- Restart Command Prompt

### Installation hangs or freezes
- **Solution:** Close installer and try again
- Make sure you have at least 5 GB free disk space
- Disable antivirus temporarily during installation

### "Access Denied" error
- **Solution:** Run installer as Administrator
- Right-click installer → "Run as administrator"

---

## ESTIMATED TIME

| Software | Download | Install | Total |
|----------|----------|---------|-------|
| JDK 17+ | 5-10 min | 5 min | 10-15 min |
| Node.js | 5 min | 5 min | 10 min |
| pnpm | - | 2 min | 2 min |
| Android Studio | 10-15 min | 10-15 min | 25-30 min |
| **Total** | **25-40 min** | **27-35 min** | **52-75 min** |

---

## IMPORTANT NOTES

1. **Keep installers:** Save the `.msi` files in case you need to reinstall
2. **Restart after each installation:** Always restart Command Prompt after setting environment variables
3. **Admin privileges:** You need admin rights to install software
4. **Disk space:** Make sure you have at least 10 GB free (for Android Studio and SDK)
5. **Internet connection:** Required for downloading SDKs and dependencies

---

## SUPPORT

If you encounter issues:

1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Restart your computer (sometimes helps with environment variables)
4. Check official documentation:
   - Java: https://www.oracle.com/java/technologies/javase-downloads.html
   - Node.js: https://nodejs.org/en/docs/
   - pnpm: https://pnpm.io/
   - Android: https://developer.android.com/docs

---

**You're all set! Ready to build the Android app.** 🚀

Next: Follow COMPLETE_PUBLICATION_GUIDE.md to build and publish to Play Store.
