# How to Launch iPhone Simulator from VSCode

This guide shows you how to run your bidding app on the iPhone simulator directly from VSCode.

## Prerequisites

### 1. Install Xcode

First, you need Xcode installed on your Mac:

**Option A: Mac App Store (Recommended)**
1. Open **App Store** on your Mac
2. Search for **"Xcode"**
3. Click **Get** / **Install** (it's free, ~15GB download)
4. Wait for installation (can take 30-60 minutes)

**Option B: Command Line**
```bash
xcode-select --install
```

### 2. Verify Installation

After Xcode is installed, verify it's working:

```bash
# Check Xcode version
xcodebuild -version

# List available iPhone simulators
xcrun simctl list devices available | grep iPhone
```

You should see a list of iPhone models like:
- iPhone 15 Pro
- iPhone 15
- iPhone 14 Pro
- iPhone SE (3rd generation)

## Method 1: Using VSCode Tasks (Easiest)

I've created VSCode tasks for you. Here's how to use them:

### Step 1: Open Command Palette
- Press: `Cmd + Shift + P` (Mac)
- Type: **"Tasks: Run Task"**
- Press Enter

### Step 2: Choose a Task

**Available Tasks:**

1. **"Open iPhone Simulator"**
   - Opens the iOS Simulator app
   - You can then manually open Safari and navigate to `http://localhost:5173`

2. **"Open App in iPhone Simulator"** ⭐ (Recommended)
   - Opens the simulator
   - Automatically opens your app in Safari on the simulator
   - Make sure dev server is running first (`npm run dev`)

3. **"List iPhone Simulators"**
   - Shows all available iPhone simulator devices
   - Useful to see what devices you have

4. **"Boot iPhone 15 Pro"**
   - Boots a specific iPhone model
   - Change the model name in [.vscode/tasks.json](.vscode/tasks.json) if needed

### Quick Access

You can also:
- Press `Cmd + Shift + B` to run the default build task
- Press `Cmd + P`, then type `task ` to see all tasks

## Method 2: Using VSCode Terminal

### Option A: Simple Launch
1. Open VSCode integrated terminal: `` Ctrl + ` `` (backtick)
2. Make sure dev server is running: `npm run dev`
3. Open simulator:
   ```bash
   open -a Simulator
   ```
4. In the simulator, open Safari and navigate to: `http://localhost:5173`

### Option B: Automated Launch with URL
```bash
# Open simulator and load your app automatically
open -a Simulator && sleep 3 && xcrun simctl openurl booted http://localhost:5173
```

## Method 3: VSCode Extensions (Advanced)

Install these VSCode extensions for better iOS development:

1. **iOS Dev** (by Roni Levi)
   - Search in VSCode Extensions: "iOS Dev"
   - Provides iOS simulator controls in VSCode

2. **React Native Tools** (by Microsoft)
   - Even though this is not React Native, it provides useful simulator controls

## Testing Your Bidding App on iPhone Simulator

Once the simulator opens:

### Using Safari in Simulator:
1. Safari will open automatically (if using the automated task)
2. If not, tap Safari icon on the simulator
3. Navigate to: `http://localhost:5173`
4. You'll see your Mobile Bidding Marketplace app!

### Add to Home Screen (PWA):
1. In Safari, tap the **Share** button (square with arrow)
2. Scroll and tap **"Add to Home Screen"**
3. Tap **Add**
4. Now you can launch the app like a native app from the home screen!

### Test Mobile Features:
- **Touch gestures**: Click and drag with mouse
- **Rotate device**: Device menu → Rotate Left/Right (or `Cmd + Left/Right Arrow`)
- **Different iPhones**: Device menu → Choose different models
- **Dark mode**: Settings → Developer → Dark Appearance

## Keyboard Shortcuts in Simulator

- `Cmd + S` - Take screenshot
- `Cmd + R` - Rotate right
- `Cmd + Left/Right Arrow` - Rotate device
- `Cmd + H` - Go to home screen
- `Cmd + Shift + H` - Show app switcher
- `Cmd + K` - Toggle software keyboard

## Common Issues

### "Unable to boot device"
```bash
# Kill and restart simulator
killall Simulator
open -a Simulator
```

### "Cannot connect to localhost"
- Make sure dev server is running: `npm run dev`
- In terminal, verify it shows: `Local: http://localhost:5173/`
- Safari in simulator should use `localhost`, not `127.0.0.1`

### Xcode not found
```bash
# Set Xcode path
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
```

### Slow simulator performance
- Close other apps to free up RAM
- Restart the simulator
- Try a smaller device (iPhone SE instead of Pro Max)

## Creating a Custom Task

Want to customize? Edit [.vscode/tasks.json](.vscode/tasks.json):

```json
{
  "label": "My Custom iPhone Task",
  "type": "shell",
  "command": "open -a Simulator && xcrun simctl openurl booted http://localhost:5173",
  "problemMatcher": []
}
```

## Next Steps: Native iOS App with Capacitor

For a true native app experience (not just PWA), see [MOBILE_DEPLOYMENT.md](MOBILE_DEPLOYMENT.md) for Capacitor setup instructions.

---

**Quick Start Summary:**
1. Install Xcode from Mac App Store
2. Run dev server: `npm run dev`
3. In VSCode: `Cmd + Shift + P` → "Tasks: Run Task" → "Open App in iPhone Simulator"
4. Your app opens automatically in Safari on the simulator! 🎉
