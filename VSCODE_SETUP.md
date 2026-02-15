# VS Code Setup Guide - Mobile Bidding Marketplace

## Quick Start

### Method 1: Download from Figma Make (Recommended)
If you're viewing this in Figma Make:
1. Look for an **Export** or **Download** button in the Figma Make interface
2. Download the complete project as a ZIP file
3. Extract to your desired location
4. Open the folder in VS Code
5. Run installation commands (see below)

### Method 2: Manual Setup (Complete Instructions Below)

---

## Prerequisites

Before starting, ensure you have installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **pnpm** (comes with Node.js)
- **VS Code** - [Download](https://code.visualstudio.com/)
- **Git** (optional) - [Download](https://git-scm.com/)

Check installations:
```bash
node --version    # Should show v18.x.x or higher
npm --version     # Should show 9.x.x or higher
```

---

## Step 1: Create Project Structure

Create a new folder for your project:

```bash
mkdir bidding-marketplace
cd bidding-marketplace
```

Create the following folder structure:

```
bidding-marketplace/
├── public/
│   └── manifest.json
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   └── figma/
│   │   ├── data/
│   │   ├── App.tsx
│   │   └── routes.ts
│   └── styles/
│       ├── fonts.css
│       ├── index.css
│       ├── mobile.css
│       ├── tailwind.css
│       └── theme.css
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── postcss.config.mjs
```

---

## Step 2: Initialize Project

Create `package.json` with all dependencies:

```bash
npm init -y
```

Then replace the contents of `package.json` with the configuration provided in the next section.

---

## Step 3: Install Dependencies

Run one of these commands:

```bash
# Using npm
npm install

# Using pnpm (faster)
pnpm install
```

This will install all required packages based on the package.json file.

---

## Step 4: Start Development Server

```bash
npm run dev
```

Or with pnpm:
```bash
pnpm dev
```

The app will open at `http://localhost:5173`

---

## Step 5: VS Code Extensions (Recommended)

Install these VS Code extensions for better development experience:

1. **ES7+ React/Redux/React-Native snippets** - `dsznajder.es7-react-js-snippets`
2. **Tailwind CSS IntelliSense** - `bradlc.vscode-tailwindcss`
3. **Prettier - Code formatter** - `esbenp.prettier-vscode`
4. **ESLint** - `dbaeumer.vscode-eslint`
5. **Auto Rename Tag** - `formulahendry.auto-rename-tag`
6. **Path Intellisense** - `christian-kohler.path-intellisense`

Install via VS Code:
- Press `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (Mac)
- Search for each extension and click Install

---

## Step 6: VS Code Settings

Create `.vscode/settings.json` in your project root:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "css.validate": false,
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

---

## File Contents

All necessary file contents are provided in the accompanying files in this project.

### Essential Files Checklist:

#### Configuration Files:
- ✅ `package.json` - Dependencies and scripts
- ✅ `vite.config.ts` - Vite configuration
- ✅ `tsconfig.json` - TypeScript configuration
- ✅ `postcss.config.mjs` - PostCSS configuration
- ✅ `index.html` - Entry HTML file

#### Style Files:
- ✅ `src/styles/index.css` - Main styles import
- ✅ `src/styles/tailwind.css` - Tailwind directives
- ✅ `src/styles/theme.css` - Theme tokens
- ✅ `src/styles/mobile.css` - Mobile optimizations
- ✅ `src/styles/fonts.css` - Font imports

#### App Files:
- ✅ `src/app/App.tsx` - Main app component
- ✅ `src/app/routes.ts` - Route configuration
- ✅ All component files in `src/app/components/`

#### PWA Files:
- ✅ `public/manifest.json` - PWA manifest

---

## Troubleshooting

### Issue: "Cannot find module 'react'"
**Solution**: Run `npm install` or `pnpm install`

### Issue: Port 5173 already in use
**Solution**: 
```bash
# Kill the process using port 5173
# On Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -ti:5173 | xargs kill -9
```

### Issue: TypeScript errors
**Solution**: 
```bash
# Restart VS Code TypeScript server
# Press Ctrl+Shift+P, type "TypeScript: Restart TS Server"
```

### Issue: Tailwind classes not working
**Solution**: 
1. Ensure `@tailwindcss/vite` is installed
2. Check `vite.config.ts` includes Tailwind plugin
3. Restart dev server

### Issue: Module resolution errors
**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Building for Production

```bash
npm run build
```

This creates a `dist` folder with optimized production files.

### Deploy the `dist` folder to:
- **Vercel**: `vercel --prod`
- **Netlify**: Drag & drop `dist` folder
- **Firebase**: `firebase deploy`
- **GitHub Pages**: Push `dist` to `gh-pages` branch

---

## Testing on Mobile Devices

### Test on Android:
1. Connect Android device via USB
2. Enable USB debugging on device
3. Run: `npm run dev -- --host`
4. Access via device browser: `http://YOUR_COMPUTER_IP:5173`

### Test on iOS:
1. Ensure Mac and iPhone on same network
2. Run: `npm run dev -- --host`
3. Access via Safari: `http://YOUR_MAC_IP:5173`

### Remote Testing:
Use tools like:
- **ngrok**: `npx ngrok http 5173`
- **localtunnel**: `npx localtunnel --port 5173`

---

## Next Steps After Setup

1. ✅ Verify app runs without errors
2. ✅ Test on desktop browser
3. ✅ Test on mobile browser (Chrome/Safari)
4. ✅ Try installing as PWA
5. ✅ Customize branding (colors, name, icons)
6. ✅ Add your own products/data
7. ✅ Connect to backend API (optional)
8. ✅ Deploy to production

---

## Project Structure Explained

```
src/app/
├── components/           # All React components
│   ├── ui/              # Reusable UI components (buttons, inputs, etc.)
│   ├── Home.tsx         # Bidder home page (browse products)
│   ├── ProductDetails.tsx    # Product detail + bidding
│   ├── SellerDashboard.tsx   # Seller menu
│   ├── CreateProduct.tsx     # Create new listing
│   ├── ExistingListings.tsx  # Seller's products
│   └── ProductPreview.tsx    # Preview before publishing
├── data/                # Mock data and types
│   └── mockData.ts      # Sample products and bids
├── App.tsx              # Main app component
└── routes.ts            # React Router configuration

src/styles/
├── index.css            # Imports all styles
├── tailwind.css         # Tailwind directives
├── theme.css            # Design tokens (colors, spacing)
└── mobile.css           # Mobile-specific optimizations
```

---

## Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# With pnpm
pnpm dev
pnpm build
pnpm preview
```

---

## Environment Variables (Optional)

Create `.env` file in root:

```env
# API Configuration (if using backend)
VITE_API_URL=https://your-api.com
VITE_STORAGE_URL=https://your-storage.com

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_PWA=true
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## Git Setup (Optional)

```bash
git init
git add .
git commit -m "Initial commit - Mobile bidding marketplace"
git branch -M main
git remote add origin https://github.com/yourusername/bidding-marketplace.git
git push -u origin main
```

Create `.gitignore`:
```
node_modules/
dist/
.env
.env.local
.DS_Store
*.log
.vscode/*
!.vscode/settings.json
```

---

## Support & Resources

- **Documentation**: See `/MOBILE_COMPATIBILITY.md`
- **Deployment**: See `/DEPLOYMENT_GUIDE.md`
- **React Router**: https://reactrouter.com/
- **Tailwind CSS**: https://tailwindcss.com/
- **Vite**: https://vitejs.dev/

---

## License

MIT License - Free to use for personal and commercial projects

---

**Setup Complete!** 🎉

Your mobile bidding marketplace is ready for development.

Questions? Check the troubleshooting section or refer to the documentation files.
