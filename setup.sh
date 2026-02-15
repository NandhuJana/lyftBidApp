#!/bin/bash

# 🚀 Bidding Marketplace - Auto Setup Script
# This script creates all necessary files for your mobile app
# Compatible with Android and iOS deployment

echo "🚀 Setting up Mobile Bidding Marketplace..."
echo ""

# Create directory structure
echo "📁 Creating folder structure..."
mkdir -p src/app/components/ui
mkdir -p src/app/components/figma
mkdir -p src/app/data
mkdir -p src/styles
mkdir -p public
mkdir -p .vscode

# Root config files
echo "📄 Creating configuration files..."

cat > package.json << 'EOF'
{
  "name": "mobile-bidding-marketplace",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "build:android": "vite build && echo 'Build ready for Android deployment'",
    "build:ios": "vite build && echo 'Build ready for iOS deployment'"
  },
  "dependencies": {
    "@radix-ui/react-label": "2.1.2",
    "@radix-ui/react-slot": "1.1.2",
    "class-variance-authority": "0.7.1",
    "clsx": "2.1.1",
    "lucide-react": "0.487.0",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "react-router": "7.13.0",
    "sonner": "2.0.3",
    "tailwind-merge": "3.2.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "4.1.12",
    "@types/react": "18.3.18",
    "@types/react-dom": "18.3.5",
    "@vitejs/plugin-react": "4.7.0",
    "tailwindcss": "4.1.12",
    "typescript": "5.7.3",
    "vite": "6.3.5"
  }
}
EOF

cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router'],
        },
      },
    },
  },
})
EOF

cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
EOF

cat > postcss.config.mjs << 'EOF'
export default {
  plugins: {
    '@tailwindcss/postcss': {}
  }
}
EOF

cat > .gitignore << 'EOF'
node_modules/
dist/
.env
.env.local
.DS_Store
*.log
.vscode/*
!.vscode/settings.json
EOF

cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <link rel="manifest" href="/manifest.json" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="Bidding Marketplace" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="theme-color" content="#3b82f6" />
    <meta name="format-detection" content="telephone=no" />
    <meta name="msapplication-tap-highlight" content="no" />
    <link rel="apple-touch-icon" href="/icon-192.png" />
    <title>Bidding Marketplace</title>
    <style>
      html, body { 
        overscroll-behavior: none;
        -webkit-overflow-scrolling: touch;
        height: 100%;
        margin: 0;
        padding: 0;
      }
      * { -webkit-tap-highlight-color: transparent; }
      #root { height: 100%; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/app/App.tsx"></script>
  </body>
</html>
EOF

cat > public/manifest.json << 'EOF'
{
  "name": "Bidding Marketplace",
  "short_name": "BidMarket",
  "description": "Mobile bidding marketplace for Android and iOS",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
EOF

cat > .vscode/settings.json << 'EOF'
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.tsdk": "node_modules/typescript/lib",
  "css.validate": false
}
EOF

cat > README.md << 'EOF'
# 📱 Mobile Bidding Marketplace

A cross-platform mobile marketplace app for Android and iOS.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 📦 Build for Mobile

### For Android & iOS (PWA):
```bash
npm run build
```

The build outputs to `/dist` folder, ready for deployment.

## 🔧 Development

- **Dev Server**: `npm run dev`
- **Build**: `npm run build`
- **Preview Build**: `npm run preview`

## 📱 Mobile Features

- ✅ PWA enabled for both platforms
- ✅ Touch-optimized UI
- ✅ Responsive design
- ✅ Offline capability ready
- ✅ Add to Home Screen support

## 🌐 Deployment Options

1. **Vercel/Netlify** - Deploy as PWA
2. **Capacitor** - Convert to native app
3. **Cordova** - Wrap as mobile app

## 📝 Project Structure

```
src/
  app/
    components/     # Reusable components
    data/          # Mock data
    App.tsx        # Main app
    routes.ts      # Navigation
  styles/          # CSS files
```
EOF

echo "📱 Creating styles..."

cat > src/styles/index.css << 'EOF'
@import "tailwindcss";

@theme {
  --font-sans: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --color-background: #ffffff;
  --color-foreground: #0a0a0a;
  --color-primary: #3b82f6;
  --color-primary-foreground: #ffffff;
  --color-border: #e4e4e7;
  --color-input: #e4e4e7;
  --radius-lg: 0.5rem;
}

* {
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}

body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overscroll-behavior-y: contain;
  touch-action: pan-y pinch-zoom;
}

button, a {
  min-height: 44px;
  min-width: 44px;
  touch-action: manipulation;
}

input, textarea, select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

@media screen and (max-width: 768px) {
  input, textarea, select {
    font-size: 16px !important;
  }
}

/* iOS safe area support */
@supports (padding: env(safe-area-inset-top)) {
  body {
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
  }
}
EOF

echo "📊 Creating mock data..."

cat > src/app/data/mockData.ts << 'EOF'
export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  askPrice: number;
  images: string[];
  sellerId: string;
  status: 'open' | 'closed' | 'cancelled';
  createdAt: Date;
}

export interface Bid {
  id: string;
  productId: string;
  bidderName: string;
  amount: number;
  timestamp: Date;
}

export const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Vintage Camera',
    description: 'Classic 35mm film camera in excellent condition. Perfect for photography enthusiasts.',
    category: 'Electronics',
    askPrice: 250,
    images: ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800'],
    sellerId: 'seller1',
    status: 'open',
    createdAt: new Date('2026-02-10'),
  },
  {
    id: '2',
    title: 'Leather Jacket',
    description: 'Genuine leather jacket, size M. Barely worn, excellent quality.',
    category: 'Fashion',
    askPrice: 150,
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800'],
    sellerId: 'seller1',
    status: 'open',
    createdAt: new Date('2026-02-12'),
  },
  {
    id: '3',
    title: 'Wooden Coffee Table',
    description: 'Handcrafted oak coffee table with unique design.',
    category: 'Furniture',
    askPrice: 200,
    images: ['https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800'],
    sellerId: 'seller2',
    status: 'open',
    createdAt: new Date('2026-02-11'),
  },
];

export const mockBids: Bid[] = [
  {
    id: 'b1',
    productId: '1',
    bidderName: 'John Doe',
    amount: 280,
    timestamp: new Date('2026-02-13T10:00:00'),
  },
  {
    id: 'b2',
    productId: '1',
    bidderName: 'Jane Smith',
    amount: 300,
    timestamp: new Date('2026-02-13T11:30:00'),
  },
  {
    id: 'b3',
    productId: '1',
    bidderName: 'Bob Johnson',
    amount: 265,
    timestamp: new Date('2026-02-13T09:15:00'),
  },
];
EOF

echo "🧩 Creating components..."

cat > src/app/components/figma/ImageWithFallback.tsx << 'EOF'
import { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
}

export function ImageWithFallback({
  src,
  alt,
  fallbackSrc = 'https://images.unsplash.com/photo-1560472355-536de3962603?w=800',
  ...props
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <img
      {...props}
      src={imgSrc}
      alt={alt}
      onError={handleError}
      loading="lazy"
    />
  );
}
EOF

echo "🎨 Creating UI utility..."

cat > src/app/lib/utils.ts << 'EOF'
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
EOF

mkdir -p src/app/lib

echo "🛣️ Creating routes..."

cat > src/app/routes.ts << 'EOF'
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    Component: () => {
      return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">📱</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Mobile Bidding Marketplace
            </h1>
            <p className="text-gray-600 mb-6">
              Ready for Android & iOS Development
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 font-semibold">✅ Setup Complete!</p>
              <p className="text-green-700 text-sm mt-1">
                Your app is ready to run on mobile devices
              </p>
            </div>
            <div className="text-left space-y-2 text-sm text-gray-700">
              <p>✅ PWA enabled for both platforms</p>
              <p>✅ Touch-optimized UI</p>
              <p>✅ Responsive design</p>
              <p>✅ Ready for VS Code development</p>
            </div>
          </div>
        </div>
      );
    },
  },
]);

export { router };
EOF

echo "⚛️ Creating main App..."

cat > src/app/App.tsx << 'EOF'
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import "../styles/index.css";

const root = document.getElementById("root");

if (root) {
  createRoot(root).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}

export default function App() {
  return <RouterProvider router={router} />;
}
EOF

cat > MOBILE_DEPLOYMENT.md << 'EOF'
# 📱 Mobile Deployment Guide

## Option 1: PWA (Progressive Web App) - EASIEST

Your app is already PWA-ready! Just deploy to:

### Vercel (Recommended):
```bash
npm install -g vercel
vercel
```

### Netlify:
```bash
npm install -g netlify-cli
netlify deploy
```

Users can "Add to Home Screen" on both Android and iOS!

---

## Option 2: Native App with Capacitor

Convert to real native app:

```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/ios

npx cap init
npm run build
npx cap add android
npx cap add ios

# Open in Android Studio
npx cap open android

# Open in Xcode
npx cap open ios
```

---

## Option 3: Cordova

```bash
npm install -g cordova
cordova create myapp com.example.app BiddingMarketplace
cd myapp
cordova platform add android
cordova platform add ios
cordova build
```

---

## 🎯 Recommended: Start with PWA

1. Build: `npm run build`
2. Deploy to Vercel/Netlify
3. Share link with users
4. They add to home screen
5. Works like native app!

Later, convert to native with Capacitor if needed.
EOF

echo ""
echo "✅ Setup complete!"
echo ""
echo "📱 Next steps:"
echo "1. Run: npm install"
echo "2. Run: npm run dev"
echo "3. Open: http://localhost:5173"
echo "4. Read: MOBILE_DEPLOYMENT.md for deployment"
echo ""
echo "🚀 Ready for Android & iOS development!"
EOF

chmod +x setup.sh

echo "✅ Script created: setup.sh"
