# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Mobile Bidding Marketplace** - A bidding application for Android and iOS devices. Users can browse products, place bids, and sellers can create listings and manage their products.

Built as a PWA (Progressive Web App) using React, TypeScript, Vite, and Tailwind CSS for cross-platform mobile deployment.

## Application Features

### Bidding Flow
1. **Marketplace Browsing** - Users view available products with asking prices
2. **Product Details** - View product info, images, description, and current bid history
3. **Place Bids** - Bidders submit offers on products they're interested in
4. **Seller Dashboard** - Sellers can create listings, manage products, and view bids
5. **Product Management** - Sellers create new listings with images, pricing, and descriptions

### User Roles
- **Bidders/Buyers**: Browse marketplace, view products, place bids
- **Sellers**: Create product listings, set asking prices, manage inventory, review bids

## Development Commands

```bash
npm install              # Install dependencies
npm run dev             # Start dev server (Vite)
npm run build           # Production build to /dist
npm run preview         # Preview production build locally
npm run build:android   # Build for Android deployment
npm run build:ios       # Build for iOS deployment
```

## Architecture

### Technology Stack
- **Frontend:** React 18.3.1 with TypeScript 5.7.3
- **Build Tool:** Vite 6.3.5 with React Fast Refresh
- **Styling:** Tailwind CSS 4.1.12 (via @tailwindcss/vite)
- **Routing:** React Router 7.13.0
- **UI Components:** Radix UI primitives with shadcn/ui pattern
- **Notifications:** Sonner (toast notifications)
- **Target Platform:** PWA (deployable to Android/iOS)

### Project Structure

```
src/
  app/
    App.tsx              # Main app entry, renders RouterProvider
    routes.ts            # React Router configuration (currently minimal)
    components/          # All React components
      Layout.tsx         # Mobile frame wrapper with status bar
      Home.tsx           # Marketplace/product listings
      ProductDetails.tsx # Product view + bidding interface
      SellerDashboard.tsx # Seller menu navigation
      CreateProduct.tsx  # New product listing form
      ExistingListings.tsx # Seller's products view
      ProductPreview.tsx # Preview before publishing
      ui/                # 50+ reusable UI components (button, card, dialog, etc.)
        utils.ts         # cn() utility for className merging
        use-mobile.ts    # Mobile detection hook
    data/
      mockData.ts        # Product and Bid interfaces + mock data
  styles/
    index.css            # Main CSS with Tailwind imports
    mobile.css           # Mobile-specific optimizations
    theme.css            # Design tokens
  main.tsx              # React DOM entry point
```

### Key Architecture Decisions

1. **Path Aliases**: `@/*` maps to `./src/*` (configured in vite.config.ts)
   - Use `import { Button } from '@/app/components/ui/button'`

2. **Component Pattern**: Uses class-variance-authority (CVA) for component variants
   - Example: Button component has multiple variants (default, destructive, outline, etc.)
   - Use `cn()` utility from `@/app/components/ui/utils` to merge Tailwind classes

3. **Data Layer**: Currently uses mock data from [mockData.ts](src/app/data/mockData.ts)
   - `Product` interface: Contains listing details (title, description, category, askPrice, images, status)
     - `status`: 'open' | 'closed' | 'cancelled'
     - `askPrice`: Seller's asking/reserve price
   - `Bid` interface: Contains bid details (productId, bidderName, amount, timestamp)
     - Multiple bids can exist per product
     - Bids are tracked chronologically
   - When adding backend API, maintain these TypeScript interfaces for type safety

4. **Routing**: Currently minimal (single welcome route in [routes.ts](src/app/routes.ts))
   - Expected bidding flow routes:
     - `/` - Marketplace home (browse available products)
     - `/product/:id` - Product details page with bidding interface
     - `/seller` - Seller dashboard menu
     - `/create` - Create new product listing form
     - `/seller/existing` - View/manage seller's listings
   - Uses React Router 7 with `createBrowserRouter`

5. **Mobile-First Design** (Android/iOS):
   - **Target platforms**: Android phones and Apple iPhones
   - PWA manifest at [public/manifest.json](public/manifest.json) for installable app experience
   - Mobile meta tags in [index.html](index.html) (viewport, safe-area-inset, no-scaling)
   - CSS optimizations: disabled overscroll, momentum scrolling for native feel
   - Touch-optimized UI components (tap targets, swipe gestures)
   - Installable to home screen on both platforms

6. **Build Configuration**:
   - Vendor chunk splitting for React, React-DOM, React-Router
   - Source maps enabled in production
   - SVG and CSV files included in assets
   - Output directory: `/dist`

### UI Component Library

The project includes 50+ pre-built UI components following the shadcn/ui pattern:
- **Form:** button, input, textarea, label, checkbox, radio-group, switch, select
- **Layout:** card, separator, scroll-area, aspect-ratio, sheet
- **Navigation:** navigation-menu, breadcrumb, pagination, tabs, menubar
- **Feedback:** alert, alert-dialog, toast (via Sonner), progress, skeleton
- **Overlay:** dialog, popover, tooltip, dropdown-menu, context-menu, hover-card
- **Data Display:** table, badge, avatar, carousel, chart, collapsible

All components are Tailwind-based with CVA variants and Radix UI primitives for accessibility.

## Development Patterns

### Working with Bidding Features

The core bidding functionality revolves around:
- **Product Listings**: Sellers create products with asking prices
- **Bid Submission**: Bidders place offers on products
- **Bid History**: Track all bids per product chronologically
- **Product Status**: Open (accepting bids), Closed (bidding ended), Cancelled

When extending bidding features:
1. Maintain the `Product` and `Bid` interfaces in [mockData.ts](src/app/data/mockData.ts)
2. Use toast notifications (Sonner) for bid confirmations/errors
3. Consider real-time updates when adding backend (WebSocket, Server-Sent Events, or polling)
4. Implement bid validation (minimum increment, duplicate bids, closed listings)

### Adding New Pages
1. Create component in `src/app/components/` (e.g., `MyNewPage.tsx`)
2. Add route to `src/app/routes.ts`:
   ```ts
   { path: "/my-route", Component: MyNewPage }
   ```
3. Wrap with `Layout` component if mobile frame is needed

### Adding New UI Components
- Components in `src/app/components/ui/` follow shadcn/ui pattern
- Use Radix UI primitives for accessibility
- Style with Tailwind CSS and CVA for variants
- Import `cn()` from `@/app/components/ui/utils` for className merging

### Working with Mock Data
- Import from `@/app/data/mockData`: `mockProducts`, `mockBids`
- Use TypeScript interfaces: `Product`, `Bid`
- When replacing with real API, maintain interface shape for type safety

### Styling Guidelines
- Mobile-first: max-width constraints (typically `max-w-md`)
- Use Tailwind utilities over custom CSS
- Theme tokens available in [styles/theme.css](src/styles/theme.css)
- Mobile-specific styles in [styles/mobile.css](src/styles/mobile.css)

## Testing

No testing framework currently configured. When adding tests:
- Consider Vitest (integrates well with Vite)
- Test files should follow `*.test.tsx` or `*.spec.tsx` pattern
- Add test script to package.json

## Deployment to Mobile Devices

Build outputs to `/dist` folder. Multiple deployment strategies for Android and iOS:

1. **PWA (Recommended for quick deployment)**:
   - Deploy to Vercel, Netlify, or any static host
   - Users install via browser "Add to Home Screen"
   - Works on both Android and iOS devices

2. **Native App Stores**:
   - Wrap with **Capacitor** (recommended) or **Cordova**
   - Submit to Google Play Store (Android) and Apple App Store (iOS)
   - Provides true native app experience

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) and [MOBILE_DEPLOYMENT.md](MOBILE_DEPLOYMENT.md) for detailed instructions.

## Testing on iPhone Simulator from VSCode

Quick start for testing on iPhone simulator:
1. Install Xcode from Mac App Store (required)
2. Run dev server: `npm run dev`
3. Open Command Palette: `Cmd + Shift + P`
4. Run Task: "Open App in iPhone Simulator"

See [VSCODE_IOS_SIMULATOR.md](VSCODE_IOS_SIMULATOR.md) for complete instructions and troubleshooting.

## Important Files

- [vite.config.ts](vite.config.ts) - Build configuration, path aliases, plugins
- [tsconfig.json](tsconfig.json) - TypeScript compiler options
- [postcss.config.mjs](postcss.config.mjs) - Tailwind CSS integration (empty, using Vite plugin)
- [public/manifest.json](public/manifest.json) - PWA configuration
- [index.html](index.html) - Mobile meta tags and viewport settings
- [.vscode/tasks.json](.vscode/tasks.json) - VSCode tasks for iPhone simulator

## Production Deployment

### Pre-Deployment Checklist
- [ ] Replace mock data with real API calls (see [API_INTEGRATION_GUIDE.md](API_INTEGRATION_GUIDE.md))
- [ ] Set up environment variables (.env.production)
- [ ] Configure API endpoint (VITE_API_URL)
- [ ] Test all features on real devices
- [ ] Add Privacy Policy URL
- [ ] Add Terms of Service URL
- [ ] Generate app icons (all sizes)
- [ ] Take screenshots for app stores
- [ ] Set up error tracking (Sentry recommended)
- [ ] Review [PRODUCTION_READINESS.md](PRODUCTION_READINESS.md)

### API Integration
All API calls are centralized in `src/services/api.ts`:
- `api.products` - Product CRUD
- `api.bids` - Bidding operations
- `api.auth` - Authentication
- `api.upload` - Image uploads

Update environment variables:
```bash
# .env.production
VITE_API_URL=https://api.yourdomain.com
VITE_APP_ENV=production
```

### App Store Submission
**Required Documents:**
- Privacy Policy - [PUBLIC_PRIVACY_POLICY.md](PUBLIC_PRIVACY_POLICY.md)
- Terms of Service - [PUBLIC_TERMS_OF_SERVICE.md](PUBLIC_TERMS_OF_SERVICE.md)
- Production Readiness - [PRODUCTION_READINESS.md](PRODUCTION_READINESS.md)

**Apple App Store:**
- Requires Xcode and Apple Developer account ($99/year)
- Privacy nutrition labels required
- Camera usage description in Info.plist
- Review time: 1-3 days typically

**Google Play Store:**
- Requires Google Play Console ($25 one-time)
- Data safety form required
- Camera permission in AndroidManifest.xml
- Review time: Usually within 24 hours

See [PRODUCTION_READINESS.md](PRODUCTION_READINESS.md) for complete checklist.

### Security Notes
- NEVER commit .env.production to git
- Use environment variables for all secrets
- Enforce HTTPS in production
- Implement proper authentication
- Validate all user input
- Sanitize data to prevent XSS
- Keep dependencies updated

