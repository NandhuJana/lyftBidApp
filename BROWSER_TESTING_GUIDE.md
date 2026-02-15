# Browser Testing Guide - Mobile View

This guide shows you how to test your bidding app in mobile view using different browsers.

## Safari (Recommended for iPhone Testing) ⭐

Safari uses the same WebKit engine as iOS, making it the most accurate for iPhone testing.

### Setup (One-time):
1. Open **Safari**
2. Safari menu → **Settings** (or `Cmd + ,`)
3. Go to **Advanced** tab
4. Check ✅ **"Show features for web developers"**

### Test Mobile View:
1. Open: http://localhost:5173/
2. Press: **`Cmd + Ctrl + R`**
   - OR: Menu bar → **Develop** → **Enter Responsive Design Mode**
3. Device selector appears at **top of window**
4. Click dropdown → Select **iPhone 14 Pro**
5. Test your bidding app!

### Keyboard Shortcuts:
- `Cmd + Ctrl + R` - Toggle Responsive Design Mode
- `Cmd + R` - Reload
- Rotate device using buttons in toolbar

---

## Chrome / Edge

### Step-by-Step:
1. Open Chrome: http://localhost:5173/
2. **Open DevTools**: `Cmd + Option + I`
3. **Toggle Device Toolbar**: `Cmd + Shift + M`
   - OR: Click the device icon (📱) at top-left of DevTools panel

### Finding the Device Selector:

After enabling device toolbar, look for a **toolbar at the TOP of your browser window** (not in DevTools):

```
┌──────────────────────────────────────────────────┐
│  Dimensions: Responsive ▼    100% ▼    [⚙]      │
└──────────────────────────────────────────────────┘
     ↑
  Click here to select device
```

4. Click **"Responsive"** dropdown
5. Select **iPhone 14 Pro** or any iPhone model
6. The viewport resizes to iPhone dimensions

### If You Don't See the Toolbar:

**Option A: Check Device Toolbar is Active**
- Look for blue/purple highlight around device icon in DevTools
- Press `Cmd + Shift + M` to toggle it on/off

**Option B: Dock DevTools to Bottom**
- Click ⋮ (three dots) in DevTools
- Dock side: Choose "Dock to bottom"
- Device toolbar will be more visible at top

**Option C: Use Elements Panel**
- Click "Elements" tab in DevTools
- Look for device toolbar above the HTML code

### Manual Device Dimensions:
If dropdown still doesn't work, set manually:
- Width: **393** (iPhone 14 Pro width)
- Height: **852** (iPhone 14 Pro height)

---

## Firefox

1. Open Firefox: http://localhost:5173/
2. **Open Developer Tools**: `Cmd + Option + I`
3. **Toggle Responsive Design Mode**: `Cmd + Option + M`
4. Device selector appears at **top of browser**
5. Select **iPhone 14 Pro** from dropdown

---

## Brave Browser

Same as Chrome instructions (Brave uses Chromium engine)

---

## Testing Checklist

Once in mobile view, test these features:

### Visual:
- [ ] App fits in mobile viewport (no horizontal scroll)
- [ ] Text is readable (not too small)
- [ ] Buttons are tap-friendly (min 44x44px)
- [ ] Images load and fit properly

### Bidding Features:
- [ ] Browse product listings
- [ ] Tap on product to view details
- [ ] Submit a bid
- [ ] See toast notifications
- [ ] Navigate between pages

### Touch Interactions:
- [ ] Tap buttons (not click - use mouse down/up)
- [ ] Scroll through lists
- [ ] Form inputs work (keyboard appears)

### PWA Features (Safari):
1. Share button → **Add to Home Screen**
2. Close Safari
3. Open app from home screen (works like native app!)

---

## Troubleshooting

### "I see the app but it's full width, not mobile size"
- Make sure Device Toolbar / Responsive Mode is **enabled** (not just DevTools)
- Look for blue/purple highlight on device icon
- Toggle off and on again: `Cmd + Shift + M` (twice)

### "DevTools opened but nothing changed"
- DevTools alone doesn't change viewport
- You must **activate Device Toolbar** (separate step)
- Look for device/mobile icon in DevTools toolbar

### "App doesn't load / connection refused"
```bash
# Check dev server is running:
npm run dev

# Should show: ➜ Local: http://localhost:5173/
```

### "Responsive mode active but can't find device dropdown"
- Try refreshing the page: `Cmd + R`
- Close and reopen browser
- Try Safari instead (easier to use)

---

## Browser Comparison

| Browser | Best For | Device Selector | Accuracy |
|---------|----------|-----------------|----------|
| **Safari** | iPhone testing | Easy ⭐⭐⭐ | Most accurate (same engine as iOS) |
| **Chrome** | General dev | Medium ⭐⭐ | Good (different rendering) |
| **Firefox** | Cross-browser | Easy ⭐⭐⭐ | Good |
| **Edge** | Windows testing | Medium ⭐⭐ | Good (Chromium-based) |

---

## Still Having Issues?

If you can't get browser testing to work, you can:

1. **Install Xcode** and use real iPhone Simulator (most accurate)
   - See: [VSCODE_IOS_SIMULATOR.md](VSCODE_IOS_SIMULATOR.md)

2. **Test on real iPhone**:
   ```bash
   # Start dev server with network access:
   npm run dev -- --host

   # Then on your iPhone, open Safari and go to:
   # http://YOUR_MAC_IP:5173/
   # (Replace YOUR_MAC_IP with your Mac's local IP)
   ```

3. **Use online mobile emulator**:
   - Build app: `npm run build`
   - Deploy to Vercel/Netlify
   - Test on real URL

---

**Quick Start Summary:**
- **Safari**: `Cmd + Ctrl + R` → Select iPhone
- **Chrome**: `Cmd + Shift + M` → Click "Responsive" dropdown → Select iPhone
- **Firefox**: `Cmd + Option + M` → Select iPhone
