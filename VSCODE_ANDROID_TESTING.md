# How to Test on Android from VSCode

This guide shows you how to run your bidding app on Android devices from VSCode.

## Option 1: Quick Test in Chrome (No Installation Required) ⚡

The fastest way to test Android mobile view without any installation.

### Steps:
1. **Open Chrome** at http://localhost:5173/
2. **Open DevTools**: `Cmd + Option + I`
3. **Toggle Device Toolbar**: `Cmd + Shift + M`
4. **Select Android Device**:
   - Click "Dimensions: Responsive" dropdown at top
   - Choose: **Pixel 7**, **Samsung Galaxy S20**, or any Android device
5. **Test your app!**

**Pros:** Instant, no installation
**Cons:** Not 100% accurate (different rendering engine than Android)

---

## Option 2: Android Emulator via Android Studio (Recommended) ⭐

The most accurate way to test on Android.

### Prerequisites: Install Android Studio

**Step 1: Download Android Studio**
```bash
# Download from: https://developer.android.com/studio
# Or install via Homebrew:
brew install --cask android-studio
```

**Step 2: Initial Setup**
1. Open Android Studio
2. Click **More Actions** → **SDK Manager**
3. Install:
   - ✅ Android SDK Platform (latest version)
   - ✅ Android SDK Build-Tools
   - ✅ Android Emulator
   - ✅ Intel x86 Emulator Accelerator (HAXM)

**Step 3: Create Virtual Device**
1. Click **More Actions** → **Virtual Device Manager**
2. Click **Create Device**
3. Select: **Pixel 7** or **Pixel 4** (recommended)
4. Choose System Image: **Android 13 (Tiramisu)** or latest
5. Click **Finish**

**Step 4: Set Environment Variables**
Add to your `~/.zshrc` or `~/.bash_profile`:
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
```

Then reload:
```bash
source ~/.zshrc  # or source ~/.bash_profile
```

### Running Your App on Emulator

**Method A: From Terminal**
```bash
# Start dev server (if not already running)
npm run dev

# List available emulators
emulator -list-avds

# Start emulator (replace 'Pixel_7_API_33' with your device name)
emulator -avd Pixel_7_API_33 &

# Wait for emulator to boot, then open Chrome in emulator
# Navigate to: http://10.0.2.2:5173/
# (10.0.2.2 is localhost from Android emulator's perspective)
```

**Method B: Using VSCode Task**
1. Press `Cmd + Shift + P`
2. Type: **Tasks: Run Task**
3. Select: **Open App in Android Emulator**

### Testing in Emulator

Once emulator is running:
1. Open **Chrome** app in the emulator
2. Navigate to: `http://10.0.2.2:5173/`
3. Your bidding app will load!
4. Test touch interactions, scrolling, bidding features

**Note:** Use `10.0.2.2` instead of `localhost` in the Android emulator.

---

## Option 3: Physical Android Phone (Best for Real Testing) 📱

Test on your actual Android phone for the most accurate results.

### Prerequisites:
1. Android phone with **Developer Mode** enabled
2. USB cable

### Enable Developer Mode:
1. Go to **Settings** → **About Phone**
2. Tap **Build Number** 7 times
3. Go back → **System** → **Developer Options**
4. Enable **USB Debugging**

### Connect and Test:

**Method A: USB Connection (Recommended)**
```bash
# Connect phone via USB

# Check if device is detected
adb devices

# Forward port to phone
adb reverse tcp:5173 tcp:5173

# Open Chrome on your phone
# Navigate to: http://localhost:5173/
```

**Method B: WiFi Connection (Same Network)**
1. Make sure phone and Mac are on **same WiFi**
2. Get your Mac's local IP:
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```
3. Start dev server with host flag:
   ```bash
   npm run dev -- --host
   ```
4. On phone, open Chrome and go to: `http://YOUR_MAC_IP:5173/`
   - Example: `http://192.168.1.100:5173/`

### Add to Home Screen (PWA):
1. In Chrome, tap **⋮** (menu)
2. Tap **Add to Home Screen**
3. Tap **Add**
4. Now you can launch like a native app!

---

## Option 4: Native Android App with Capacitor 🚀

Create a real native Android app that can be installed on any device.

### Setup Capacitor:
```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android

# Initialize Capacitor
npx cap init

# App name: Mobile Bidding Marketplace
# Package ID: com.biddoo.marketplace (or your preference)

# Add Android platform
npx cap add android

# Build your app
npm run build

# Sync files to Android project
npx cap sync android

# Open in Android Studio
npx cap open android
```

### Build and Run:
1. Android Studio opens automatically
2. Wait for Gradle sync to complete
3. Select device (emulator or physical phone)
4. Click **Run** (green play button)
5. App installs and launches on device!

### Update after code changes:
```bash
npm run build
npx cap sync android
```

---

## VSCode Tasks for Android

I've created VSCode tasks for quick access:

### Available Tasks:
- **Start Android Emulator** - Launches emulator
- **Check Android Devices** - Lists connected devices
- **Forward Port to Phone** - Sets up adb port forwarding
- **Open in Android Emulator** - Opens app automatically

**To run:** `Cmd + Shift + P` → **Tasks: Run Task** → Select task

---

## Troubleshooting

### "adb: command not found"
- Android Studio not installed or SDK path not set
- Add to `~/.zshrc`: `export ANDROID_HOME=$HOME/Library/Android/sdk`
- Then: `source ~/.zshrc`

### "No devices found"
- For emulator: Make sure emulator is running
- For physical phone: Enable USB debugging and reconnect
- Run: `adb devices` to verify

### "Can't access localhost:5173"
- **In emulator**: Use `http://10.0.2.2:5173/` (not localhost)
- **On physical phone via USB**: Run `adb reverse tcp:5173 tcp:5173`
- **On physical phone via WiFi**: Use Mac's IP address

### Emulator is slow
- Enable **Hardware Acceleration** in Android Studio
- Install Intel HAXM (or Apple Silicon equivalent)
- Choose a smaller device (Pixel 4 instead of Pixel 7 Pro)
- Allocate more RAM to emulator in AVD settings

### Port 5173 already in use
```bash
# Kill the process
lsof -ti:5173 | xargs kill -9

# Restart dev server
npm run dev
```

---

## Quick Start Summary

**Fastest (1 minute):**
- Chrome DevTools → `Cmd + Shift + M` → Select Android device

**Most Accurate (30 minutes setup):**
1. Install Android Studio
2. Create Pixel 7 virtual device
3. Start emulator: `emulator -avd Pixel_7_API_33`
4. Open Chrome in emulator → `http://10.0.2.2:5173/`

**Real Device (5 minutes):**
1. Enable USB debugging on phone
2. Connect via USB
3. Run: `adb reverse tcp:5173 tcp:5173`
4. Open Chrome on phone → `http://localhost:5173/`

---

## Comparison Table

| Method | Setup Time | Accuracy | Best For |
|--------|------------|----------|----------|
| Chrome DevTools | 1 min | 70% | Quick testing |
| Android Emulator | 30 min | 95% | Development |
| Physical Phone | 5 min | 100% | Final testing |
| Capacitor Native | 1 hour | 100% | Production app |

---

**Recommendation:** Start with Chrome DevTools for quick testing, then set up Android Studio emulator for accurate development testing!
