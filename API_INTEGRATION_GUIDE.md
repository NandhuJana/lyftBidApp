# API Integration Guide

This guide explains how to integrate your backend API with the Mobile Bidding Marketplace app.

## Overview

The app currently uses mock data for development. When you're ready to deploy to production, you'll need to:
1. Replace mock data with real API calls
2. Configure environment variables
3. Implement authentication
4. Handle errors properly

## Quick Start

### 1. Set Up Environment Variables

```bash
# Copy the example file
cp .env.production.example .env.production

# Edit .env.production
VITE_API_URL=https://api.yourdomain.com
VITE_APP_ENV=production
```

### 2. API Service Layer

All API calls are centralized in `src/services/api.ts`. This file is already set up with TypeScript interfaces and proper error handling.

**Available APIs:**
- `api.products` - Product CRUD operations
- `api.bids` - Bidding operations
- `api.auth` - Authentication
- `api.upload` - Image uploads

### 3. Replace Mock Data

**Current Files Using Mock Data:**
```
src/app/data/mockData.ts
src/app/components/Home.tsx
src/app/components/MyBids.tsx
src/app/components/ProductDetails.tsx
```

**Example Migration:**

**Before (Mock Data):**
```typescript
// Home.tsx
import { mockProducts } from "../data/mockData";

export function Home() {
  return mockProducts.map(product => ...);
}
```

**After (Real API):**
```typescript
// Home.tsx
import { useState, useEffect } from "react";
import { api } from "@/services/api";

export function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.products.getAll()
      .then(setProducts)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error.message} />;

  return products.map(product => ...);
}
```

## Required API Endpoints

### Products API

#### GET /api/products
Get all product listings

**Response:**
```json
[
  {
    "id": "123",
    "title": "Vintage Camera",
    "description": "Classic 35mm film camera",
    "category": "Electronics",
    "askPrice": 250,
    "images": ["https://cdn.yourdomain.com/img1.jpg"],
    "sellerId": "user456",
    "status": "open",
    "createdAt": "2026-02-14T10:00:00Z",
    "timeToClose": "2 days"
  }
]
```

#### GET /api/products/:id
Get single product

**Response:**
```json
{
  "id": "123",
  "title": "Vintage Camera",
  ...
}
```

#### POST /api/products
Create new product listing

**Request (multipart/form-data):**
```
title: "Vintage Camera"
description: "Classic 35mm..."
category: "Electronics"
askPrice: 250
images: [File, File, ...]
```

**Response:**
```json
{
  "id": "123",
  "title": "Vintage Camera",
  ...
}
```

#### PUT /api/products/:id
Update product

**Request (JSON):**
```json
{
  "title": "Updated Title",
  "status": "closed"
}
```

#### DELETE /api/products/:id
Delete product

**Response:** 204 No Content

---

### Bids API

#### GET /api/bids/product/:productId
Get all bids for a product

**Response:**
```json
[
  {
    "id": "bid123",
    "productId": "123",
    "bidderName": "John Doe",
    "amount": 280,
    "timestamp": "2026-02-14T10:30:00Z"
  }
]
```

#### POST /api/bids
Place a new bid

**Request (JSON):**
```json
{
  "productId": "123",
  "amount": 300
}
```

**Response:**
```json
{
  "id": "bid124",
  "productId": "123",
  "amount": 300,
  "timestamp": "2026-02-14T11:00:00Z"
}
```

#### GET /api/user/bids
Get current user's bid history

**Response:**
```json
[
  {
    "productId": "123",
    "productTitle": "Vintage Camera",
    "productImage": "https://...",
    "myBidAmount": 280,
    "currentHighestBid": 300,
    "isMyBidWinning": false,
    "bidStatus": "outbid",
    "timeRemaining": "2 days",
    "totalBids": 5
  }
]
```

---

### Authentication API

#### POST /api/auth/login
User login

**Request (JSON):**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### POST /api/auth/register
User registration

**Request (JSON):**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

---

### Upload API

#### POST /api/upload
Upload images

**Request (multipart/form-data):**
```
images: [File, File, ...]
```

**Response:**
```json
{
  "urls": [
    "https://cdn.yourdomain.com/img1.jpg",
    "https://cdn.yourdomain.com/img2.jpg"
  ]
}
```

---

## Authentication Flow

### 1. Token Storage

```typescript
// Token is automatically stored in localStorage
await api.auth.login({ email, password });
// Token stored as 'auth_token'

// Token is automatically included in requests
const products = await api.products.getAll();
// Request includes: Authorization: Bearer <token>
```

### 2. Protected Routes

```typescript
// Check authentication before accessing protected pages
import { api } from '@/services/api';

function ProtectedPage() {
  useEffect(() => {
    if (!api.auth.isAuthenticated()) {
      navigate('/login');
    }
  }, []);
}
```

### 3. Logout

```typescript
api.auth.logout();
// Removes token from localStorage
```

---

## Error Handling

### API Service Errors

All API calls throw errors that can be caught:

```typescript
try {
  const products = await api.products.getAll();
  setProducts(products);
} catch (error) {
  // Show user-friendly error message
  toast.error(error.message || 'Failed to load products');
  console.error('API Error:', error);
}
```

### Expected Error Responses

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid authentication token"
  }
}
```

**Common Error Codes:**
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate bid, etc.)
- `500` - Server Error

---

## Image Upload Best Practices

### Client-Side

```typescript
// src/app/components/CreateProduct.tsx
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // Option 1: Upload images first, then create product
    const imageUrls = await api.upload.uploadImages(imageFiles);
    const product = await api.products.create({
      ...formData,
      images: imageUrls,
    });

    // Option 2: Send images with product creation
    const product = await api.products.create({
      ...formData,
      images: imageFiles,
    });

    toast.success('Product created!');
    navigate(`/product/${product.id}`);
  } catch (error) {
    toast.error('Failed to create product');
  }
};
```

### Backend Requirements

**Image Processing:**
- Resize to multiple sizes (thumbnail, medium, large)
- Convert to WebP for better compression
- Limit file size (10MB max)
- Validate file types (JPEG, PNG, WebP)

**Storage:**
- Use CDN (CloudFlare, AWS CloudFront)
- Store in S3/Google Cloud Storage/Azure Blob
- Generate signed URLs for security

---

## CORS Configuration

Your backend API must allow requests from your frontend domain:

```javascript
// Express.js example
const cors = require('cors');

app.use(cors({
  origin: [
    'https://yourdomain.com',
    'https://www.yourdomain.com',
    'http://localhost:5173', // Development
  ],
  credentials: true,
}));
```

---

## Rate Limiting

Implement rate limiting to prevent abuse:

```javascript
// Example: Max 100 requests per 15 minutes
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use('/api/', limiter);
```

---

## WebSocket for Real-Time Updates (Optional)

For real-time bid updates:

```typescript
// src/services/websocket.ts
const ws = new WebSocket('wss://api.yourdomain.com/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === 'NEW_BID') {
    // Update UI with new bid
    updateBidUI(data.bid);
  }
};

// Subscribe to product updates
ws.send(JSON.stringify({
  type: 'SUBSCRIBE',
  productId: '123',
}));
```

---

## Testing API Integration

### 1. Development

```bash
# Start backend locally
cd backend
npm run dev  # Runs on http://localhost:3000

# Start frontend
cd frontend
npm run dev  # Runs on http://localhost:5173
```

### 2. Staging

```bash
# Use staging API
VITE_API_URL=https://staging-api.yourdomain.com npm run build
```

### 3. Production

```bash
# Use production API
npm run build
# Deploys with .env.production settings
```

---

## Migration Checklist

- [ ] Set up backend API with required endpoints
- [ ] Configure CORS to allow frontend domain
- [ ] Implement authentication (JWT recommended)
- [ ] Set up image storage and CDN
- [ ] Update environment variables
- [ ] Replace mock data in components
- [ ] Test all API endpoints
- [ ] Implement error handling
- [ ] Add loading states
- [ ] Test authentication flow
- [ ] Test image upload
- [ ] Test bidding functionality
- [ ] Implement rate limiting
- [ ] Set up monitoring and logging
- [ ] Test on staging environment
- [ ] Deploy to production

---

## Example: Complete Component Migration

**Before:**
```typescript
// MyBids.tsx
const mockUserBids = [...];
const userBids = mockUserBids;
```

**After:**
```typescript
// MyBids.tsx
import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { toast } from "sonner";

export function MyBids() {
  const [userBids, setUserBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserBids();
  }, []);

  const loadUserBids = async () => {
    try {
      const bids = await api.bids.getMyBids();
      setUserBids(bids);
    } catch (error) {
      toast.error('Failed to load your bids');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading your bids...</div>;
  }

  return (
    // ... render bids
  );
}
```

---

## Security Best Practices

1. **Never expose API keys in frontend code**
2. **Always use HTTPS in production**
3. **Validate input on both client and server**
4. **Implement proper authentication**
5. **Use secure token storage** (httpOnly cookies or localStorage with precautions)
6. **Sanitize user input** to prevent XSS
7. **Implement CSRF protection**
8. **Rate limit API endpoints**
9. **Log security events**
10. **Keep dependencies updated**

---

## Support

**Questions about API integration?**
Email: dev@yourdomain.com

**Need help with backend?**
See: BACKEND_REQUIREMENTS.md (create this with your backend specs)

---

**Your API service layer is ready! Just update the environment variables and start making real API calls.** 🚀
