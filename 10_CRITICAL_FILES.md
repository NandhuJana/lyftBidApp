# 🚀 10 CRITICAL FILES - Copy & Paste Guide

Follow these steps exactly and you'll have a working app in 10 minutes!

---

## 📁 STEP 1: Create Folder Structure

Open Terminal/Command Prompt and run:

```bash
# Create main folder
mkdir bidding-marketplace
cd bidding-marketplace

# Create subfolders
mkdir -p src/app/components/ui
mkdir -p src/app/components/figma
mkdir -p src/app/data
mkdir -p src/styles
mkdir -p public
mkdir -p .vscode
```

Now open this folder in VS Code:
```bash
code .
```

---

## 📄 FILE 1: package.json
**Location**: Root folder  
**Create new file**: `package.json`

```json
{
  "name": "mobile-bidding-marketplace",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
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
```

---

## 📄 FILE 2: vite.config.ts
**Location**: Root folder  
**Create new file**: `vite.config.ts`

```typescript
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
})
```

---

## 📄 FILE 3: tsconfig.json
**Location**: Root folder  
**Create new file**: `tsconfig.json`

```json
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
```

---

## 📄 FILE 4: postcss.config.mjs
**Location**: Root folder  
**Create new file**: `postcss.config.mjs`

```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {}
  }
}
```

---

## 📄 FILE 5: index.html
**Location**: Root folder  
**Create new file**: `index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="manifest" href="/manifest.json" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="theme-color" content="#ffffff" />
    <title>Bidding Marketplace</title>
    <style>
      html, body { overscroll-behavior: none; }
      * { -webkit-tap-highlight-color: transparent; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/app/App.tsx"></script>
  </body>
</html>
```

---

## 📄 FILE 6: src/styles/index.css
**Location**: `src/styles/index.css`  
**Create new file**

```css
@import "tailwindcss";

@theme {
  --font-sans: system-ui, -apple-system, sans-serif;
  --color-background: #ffffff;
  --color-foreground: #0a0a0a;
  --color-primary: #18181b;
  --color-primary-foreground: #fafafa;
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
  overscroll-behavior-y: contain;
}

button, a {
  min-height: 44px;
  min-width: 44px;
}

@media screen and (max-width: 768px) {
  input, textarea, select {
    font-size: 16px !important;
  }
}
```

---

## 📄 FILE 7: public/manifest.json
**Location**: `public/manifest.json`  
**Create new file**

```json
{
  "name": "Bidding Marketplace",
  "short_name": "BidMarket",
  "description": "Mobile bidding marketplace",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "orientation": "portrait"
}
```

---

## 📄 FILE 8: src/app/data/mockData.ts
**Location**: `src/app/data/mockData.ts`  
**Create new file**

```typescript
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
    description: 'Classic 35mm film camera in excellent condition',
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
    description: 'Genuine leather jacket, size M',
    category: 'Fashion',
    askPrice: 150,
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800'],
    sellerId: 'seller1',
    status: 'open',
    createdAt: new Date('2026-02-12'),
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
```

---

## 📄 FILE 9: src/app/routes.ts
**Location**: `src/app/routes.ts`  
**Create new file**

```typescript
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    Component: () => {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">🎉 It Works!</h1>
            <p className="text-gray-600 mb-4">Your bidding marketplace is running!</p>
            <p className="text-sm text-gray-500">Next: Add the remaining component files</p>
          </div>
        </div>
      );
    },
  },
]);

export { router };
```

---

## 📄 FILE 10: src/app/App.tsx
**Location**: `src/app/App.tsx`  
**Create new file**

```typescript
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
```

---

## ✅ STEP 2: Install Dependencies

Open Terminal in VS Code (Ctrl+` or View → Terminal) and run:

```bash
npm install
```

This will take 2-3 minutes to download all packages.

---

## 🚀 STEP 3: Start the App

```bash
npm run dev
```

You should see:
```
VITE v6.3.5  ready in 500 ms

➜  Local:   http://localhost:5173/
```

---

## 🎯 STEP 4: Test It!

Open your browser to `http://localhost:5173`

You should see: **"🎉 It Works! Your bidding marketplace is running!"**

---

## 📱 STEP 5: Add Components (Next)

Now that it's working, tell me:

**"Show me the component files"**

And I'll give you:
- Home.tsx (browse products)
- ProductDetails.tsx (bidding)
- SellerDashboard.tsx (seller menu)
- CreateProduct.tsx (create listings)
- And all other components

---

## 🆘 Troubleshooting

**Issue: npm not found**
- Install Node.js from https://nodejs.org/

**Issue: Port already in use**
```bash
npx kill-port 5173
```

**Issue: TypeScript errors**
- Ignore for now, they'll go away when we add more files

---

## ✨ Success!

If you see the "It Works!" page, you're ready for the next step!

**Say: "Show me the component files"** and I'll provide the rest!
