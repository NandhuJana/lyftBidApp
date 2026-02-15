# Backend API Specification - Mobile Bidding Marketplace

**Version:** 1.0.0
**Base URL:** `https://api.yourdomain.com`
**Protocol:** HTTPS Only
**Content-Type:** `application/json` (except file uploads)

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Common Headers](#common-headers)
4. [Error Responses](#error-responses)
5. [Data Models](#data-models)
6. [API Endpoints](#api-endpoints)
   - [Authentication](#authentication-endpoints)
   - [Products](#products-endpoints)
   - [Bids](#bids-endpoints)
   - [Users](#users-endpoints)
   - [Uploads](#uploads-endpoints)

---

## Overview

### Authentication
- **Type:** JWT (JSON Web Token)
- **Token Location:** `Authorization` header
- **Format:** `Bearer <token>`
- **Expiration:** 24 hours (configurable)

### Rate Limiting
- **Limit:** 100 requests per 15 minutes per IP
- **Headers:**
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: Unix timestamp when limit resets

### Pagination
- **Default Page Size:** 20 items
- **Max Page Size:** 100 items
- **Query Parameters:**
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 20, max: 100)

---

## Authentication

### JWT Token Structure

```json
{
  "userId": "user123",
  "email": "user@example.com",
  "role": "user",
  "iat": 1709470800,
  "exp": 1709557200
}
```

### Generating Token

```javascript
// Example (Node.js with jsonwebtoken)
const jwt = require('jsonwebtoken');

const token = jwt.sign(
  {
    userId: user.id,
    email: user.email,
    role: user.role
  },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);
```

---

## Common Headers

### Request Headers

```
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Accept: application/json
User-Agent: MobileBiddingApp/1.0.0 (iOS/Android)
X-App-Version: 1.0.0
```

### Response Headers

```
Content-Type: application/json; charset=utf-8
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1709471700
X-Request-ID: req_abc123def456
Access-Control-Allow-Origin: *
```

---

## Error Responses

### Standard Error Format

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "Additional context"
    }
  },
  "requestId": "req_abc123def456",
  "timestamp": "2026-02-14T12:00:00Z"
}
```

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid input/validation error |
| 401 | Unauthorized | Missing/invalid authentication |
| 403 | Forbidden | Valid auth but insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource conflict (duplicate bid, etc.) |
| 422 | Unprocessable Entity | Validation error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Server maintenance |

### Common Error Codes

```
AUTH_REQUIRED          - Authentication required
INVALID_TOKEN          - Invalid or expired token
INVALID_CREDENTIALS    - Wrong email/password
VALIDATION_ERROR       - Input validation failed
NOT_FOUND              - Resource not found
ALREADY_EXISTS         - Resource already exists
PERMISSION_DENIED      - Insufficient permissions
RATE_LIMIT_EXCEEDED    - Too many requests
SERVER_ERROR           - Internal server error
```

---

## Data Models

### User Model

```typescript
interface User {
  id: string;                    // UUID
  email: string;                 // Email address (unique)
  name: string;                  // Full name
  role: 'user' | 'admin';        // User role
  createdAt: string;             // ISO 8601 datetime
  updatedAt: string;             // ISO 8601 datetime
}
```

### Product Model

```typescript
interface Product {
  id: string;                              // UUID
  title: string;                           // Product title (max 200 chars)
  description: string;                     // Product description (max 2000 chars)
  category: string;                        // Category (Electronics, Fashion, etc.)
  askPrice: number;                        // Asking price (decimal, min 0.01)
  images: string[];                        // Array of image URLs
  sellerId: string;                        // User ID of seller
  status: 'open' | 'closed' | 'cancelled'; // Product status
  createdAt: string;                       // ISO 8601 datetime
  updatedAt: string;                       // ISO 8601 datetime
  closesAt?: string;                       // ISO 8601 datetime (optional)
  timeToClose?: string;                    // Human-readable time (e.g., "2 days")
}
```

### Bid Model

```typescript
interface Bid {
  id: string;              // UUID
  productId: string;       // Product ID
  userId: string;          // User ID of bidder
  bidderName: string;      // Display name of bidder
  amount: number;          // Bid amount (decimal)
  timestamp: string;       // ISO 8601 datetime
  status: 'active' | 'won' | 'outbid' | 'cancelled';
}
```

### UserBidItem Model (for /user/bids)

```typescript
interface UserBidItem {
  productId: string;
  productTitle: string;
  productImage: string;
  myBidAmount: number;
  currentHighestBid: number;
  isMyBidWinning: boolean;
  bidStatus: 'active' | 'won' | 'outbid' | 'ended';
  timeRemaining?: string;
  totalBids: number;
}
```

---

## API Endpoints

---

## Authentication Endpoints

### 1. Register User

**POST** `/api/auth/register`

Create a new user account.

#### Request

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe"
}
```

**Validation Rules:**
- `email`: Required, valid email format, unique
- `password`: Required, min 8 chars, must contain uppercase, lowercase, number, special char
- `name`: Required, min 2 chars, max 100 chars

#### Response

**Status:** `201 Created`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyMTIzIiwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MDk0NzA4MDAsImV4cCI6MTcwOTU1NzIwMH0.signature",
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "createdAt": "2026-02-14T12:00:00Z",
    "updatedAt": "2026-02-14T12:00:00Z"
  }
}
```

#### Error Responses

**409 Conflict** - Email already exists
```json
{
  "error": {
    "code": "ALREADY_EXISTS",
    "message": "An account with this email already exists"
  }
}
```

**422 Validation Error**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "email": "Invalid email format",
      "password": "Password must be at least 8 characters"
    }
  }
}
```

---

### 2. Login User

**POST** `/api/auth/login`

Authenticate user and receive JWT token.

#### Request

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

#### Response

**Status:** `200 OK`

**Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "createdAt": "2026-02-14T12:00:00Z",
    "updatedAt": "2026-02-14T12:00:00Z"
  }
}
```

#### Error Responses

**401 Unauthorized** - Invalid credentials
```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  }
}
```

---

### 3. Logout User (Optional)

**POST** `/api/auth/logout`

Invalidate user's current token (if implementing token blacklist).

#### Request

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response

**Status:** `204 No Content`

---

### 4. Refresh Token (Optional)

**POST** `/api/auth/refresh`

Get a new JWT token before current one expires.

#### Request

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response

**Status:** `200 OK`

**Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Products Endpoints

### 1. Get All Products

**GET** `/api/products`

Retrieve a paginated list of all products.

#### Request

**Headers:**
```
Accept: application/json
```

**Query Parameters:**
```
page=1              # Page number (default: 1)
limit=20            # Items per page (default: 20, max: 100)
status=open         # Filter by status (optional: open, closed, cancelled)
category=Electronics # Filter by category (optional)
sellerId=user123    # Filter by seller (optional)
sort=-createdAt     # Sort field (prefix with - for descending)
search=camera       # Search in title/description (optional)
```

**Example:**
```
GET /api/products?page=1&limit=20&status=open&category=Electronics
```

#### Response

**Status:** `200 OK`

**Headers:**
```
Content-Type: application/json
X-Total-Count: 150
X-Page: 1
X-Page-Size: 20
X-Total-Pages: 8
```

**Body:**
```json
{
  "data": [
    {
      "id": "prod123",
      "title": "Vintage Camera",
      "description": "Classic 35mm film camera in excellent condition",
      "category": "Electronics",
      "askPrice": 250.00,
      "images": [
        "https://cdn.yourdomain.com/products/prod123/img1.jpg",
        "https://cdn.yourdomain.com/products/prod123/img2.jpg"
      ],
      "sellerId": "user456",
      "status": "open",
      "createdAt": "2026-02-10T10:00:00Z",
      "updatedAt": "2026-02-10T10:00:00Z",
      "closesAt": "2026-02-17T10:00:00Z",
      "timeToClose": "2 days"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### 2. Get Product by ID

**GET** `/api/products/:id`

Retrieve a single product by its ID.

#### Request

**Headers:**
```
Accept: application/json
```

**Path Parameters:**
```
:id - Product ID (UUID)
```

**Example:**
```
GET /api/products/prod123
```

#### Response

**Status:** `200 OK`

**Body:**
```json
{
  "id": "prod123",
  "title": "Vintage Camera",
  "description": "Classic 35mm film camera in excellent condition. Perfect for photography enthusiasts.",
  "category": "Electronics",
  "askPrice": 250.00,
  "images": [
    "https://cdn.yourdomain.com/products/prod123/img1.jpg",
    "https://cdn.yourdomain.com/products/prod123/img2.jpg"
  ],
  "sellerId": "user456",
  "seller": {
    "id": "user456",
    "name": "Jane Smith"
  },
  "status": "open",
  "createdAt": "2026-02-10T10:00:00Z",
  "updatedAt": "2026-02-10T10:00:00Z",
  "closesAt": "2026-02-17T10:00:00Z",
  "timeToClose": "2 days",
  "bidCount": 5,
  "highestBid": 300.00
}
```

#### Error Responses

**404 Not Found**
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Product not found"
  }
}
```

---

### 3. Create Product

**POST** `/api/products`

Create a new product listing.

#### Request

**Headers:**
```
Content-Type: multipart/form-data
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Body (multipart/form-data):**
```
title: Vintage Camera
description: Classic 35mm film camera in excellent condition
category: Electronics
askPrice: 250.00
closesAt: 2026-02-17T10:00:00Z (optional)
images: [File, File, File] (max 10 images, max 10MB each)
```

**Validation Rules:**
- `title`: Required, min 3 chars, max 200 chars
- `description`: Required, min 10 chars, max 2000 chars
- `category`: Required, must be valid category
- `askPrice`: Required, number >= 0.01
- `images`: Required, min 1 image, max 10 images, each <= 10MB
- `closesAt`: Optional, must be future datetime

#### Response

**Status:** `201 Created`

**Headers:**
```
Location: /api/products/prod123
```

**Body:**
```json
{
  "id": "prod123",
  "title": "Vintage Camera",
  "description": "Classic 35mm film camera in excellent condition",
  "category": "Electronics",
  "askPrice": 250.00,
  "images": [
    "https://cdn.yourdomain.com/products/prod123/img1.jpg"
  ],
  "sellerId": "user456",
  "status": "open",
  "createdAt": "2026-02-14T12:00:00Z",
  "updatedAt": "2026-02-14T12:00:00Z",
  "closesAt": "2026-02-17T10:00:00Z",
  "timeToClose": "2 days"
}
```

#### Error Responses

**401 Unauthorized** - Not authenticated
```json
{
  "error": {
    "code": "AUTH_REQUIRED",
    "message": "Authentication required"
  }
}
```

**422 Validation Error**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "title": "Title must be at least 3 characters",
      "images": "At least one image is required"
    }
  }
}
```

---

### 4. Update Product

**PUT** `/api/products/:id`

Update an existing product. Only the seller can update their own products.

#### Request

**Headers:**
```
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Path Parameters:**
```
:id - Product ID (UUID)
```

**Body:**
```json
{
  "title": "Vintage Camera - Updated",
  "description": "Updated description",
  "status": "closed"
}
```

**Note:** Only send fields you want to update. Cannot update: `id`, `sellerId`, `createdAt`.

#### Response

**Status:** `200 OK`

**Body:**
```json
{
  "id": "prod123",
  "title": "Vintage Camera - Updated",
  "description": "Updated description",
  "category": "Electronics",
  "askPrice": 250.00,
  "images": [
    "https://cdn.yourdomain.com/products/prod123/img1.jpg"
  ],
  "sellerId": "user456",
  "status": "closed",
  "createdAt": "2026-02-10T10:00:00Z",
  "updatedAt": "2026-02-14T12:30:00Z",
  "closesAt": "2026-02-17T10:00:00Z"
}
```

#### Error Responses

**403 Forbidden** - Not the seller
```json
{
  "error": {
    "code": "PERMISSION_DENIED",
    "message": "You can only update your own products"
  }
}
```

---

### 5. Delete Product

**DELETE** `/api/products/:id`

Delete a product. Only the seller can delete their own products.

#### Request

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Path Parameters:**
```
:id - Product ID (UUID)
```

#### Response

**Status:** `204 No Content`

#### Error Responses

**403 Forbidden** - Not the seller
```json
{
  "error": {
    "code": "PERMISSION_DENIED",
    "message": "You can only delete your own products"
  }
}
```

**409 Conflict** - Product has bids
```json
{
  "error": {
    "code": "HAS_BIDS",
    "message": "Cannot delete product with active bids"
  }
}
```

---

## Bids Endpoints

### 1. Get Bids for Product

**GET** `/api/bids/product/:productId`

Get all bids for a specific product.

#### Request

**Headers:**
```
Accept: application/json
```

**Path Parameters:**
```
:productId - Product ID (UUID)
```

**Query Parameters:**
```
sort=-timestamp     # Sort by timestamp (default: descending)
limit=50           # Max bids to return (default: 50)
```

#### Response

**Status:** `200 OK`

**Body:**
```json
{
  "data": [
    {
      "id": "bid123",
      "productId": "prod123",
      "userId": "user789",
      "bidderName": "John Doe",
      "amount": 300.00,
      "timestamp": "2026-02-14T11:30:00Z",
      "status": "active"
    },
    {
      "id": "bid122",
      "productId": "prod123",
      "userId": "user456",
      "bidderName": "Jane Smith",
      "amount": 280.00,
      "timestamp": "2026-02-14T10:15:00Z",
      "status": "outbid"
    }
  ],
  "highestBid": 300.00,
  "bidCount": 5
}
```

---

### 2. Place Bid

**POST** `/api/bids`

Place a new bid on a product.

#### Request

**Headers:**
```
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Body:**
```json
{
  "productId": "prod123",
  "amount": 300.00
}
```

**Validation Rules:**
- `productId`: Required, must exist, must be status "open"
- `amount`: Required, must be > current highest bid (or askPrice if no bids)
- User cannot bid on their own product
- User cannot bid twice in a row (must wait for another bidder)

#### Response

**Status:** `201 Created`

**Headers:**
```
Location: /api/bids/bid123
```

**Body:**
```json
{
  "id": "bid123",
  "productId": "prod123",
  "userId": "user789",
  "bidderName": "John Doe",
  "amount": 300.00,
  "timestamp": "2026-02-14T11:30:00Z",
  "status": "active"
}
```

#### Error Responses

**401 Unauthorized**
```json
{
  "error": {
    "code": "AUTH_REQUIRED",
    "message": "Authentication required to place bids"
  }
}
```

**403 Forbidden** - Bidding on own product
```json
{
  "error": {
    "code": "PERMISSION_DENIED",
    "message": "Cannot bid on your own product"
  }
}
```

**409 Conflict** - Bid too low
```json
{
  "error": {
    "code": "BID_TOO_LOW",
    "message": "Bid must be higher than current highest bid of $280.00"
  }
}
```

**409 Conflict** - Product closed
```json
{
  "error": {
    "code": "PRODUCT_CLOSED",
    "message": "This product is no longer accepting bids"
  }
}
```

---

### 3. Get User's Bid History

**GET** `/api/user/bids`

Get the authenticated user's bid history across all products.

#### Request

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Accept: application/json
```

**Query Parameters:**
```
status=active      # Filter by bid status (optional: active, won, outbid, ended)
page=1            # Page number
limit=20          # Items per page
```

#### Response

**Status:** `200 OK`

**Body:**
```json
{
  "data": [
    {
      "productId": "prod123",
      "productTitle": "Vintage Camera",
      "productImage": "https://cdn.yourdomain.com/products/prod123/img1.jpg",
      "myBidAmount": 280.00,
      "currentHighestBid": 300.00,
      "isMyBidWinning": false,
      "bidStatus": "outbid",
      "timeRemaining": "2 days",
      "totalBids": 5,
      "bidTimestamp": "2026-02-14T10:15:00Z"
    },
    {
      "productId": "prod456",
      "productTitle": "Leather Jacket",
      "productImage": "https://cdn.yourdomain.com/products/prod456/img1.jpg",
      "myBidAmount": 175.00,
      "currentHighestBid": 175.00,
      "isMyBidWinning": true,
      "bidStatus": "active",
      "timeRemaining": "5 days",
      "totalBids": 3,
      "bidTimestamp": "2026-02-13T14:20:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 12,
    "totalPages": 1
  }
}
```

---

## Users Endpoints

### 1. Get Current User

**GET** `/api/user/me`

Get the authenticated user's profile.

#### Request

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response

**Status:** `200 OK`

**Body:**
```json
{
  "id": "user123",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user",
  "createdAt": "2026-01-15T10:00:00Z",
  "updatedAt": "2026-02-14T12:00:00Z",
  "stats": {
    "productsSold": 5,
    "productsActive": 2,
    "bidsPlaced": 15,
    "bidsWon": 3
  }
}
```

---

### 2. Update User Profile

**PUT** `/api/user/me`

Update the authenticated user's profile.

#### Request

**Headers:**
```
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Body:**
```json
{
  "name": "John Smith",
  "email": "newemail@example.com"
}
```

#### Response

**Status:** `200 OK`

**Body:**
```json
{
  "id": "user123",
  "email": "newemail@example.com",
  "name": "John Smith",
  "role": "user",
  "createdAt": "2026-01-15T10:00:00Z",
  "updatedAt": "2026-02-14T12:30:00Z"
}
```

---

## Uploads Endpoints

### 1. Upload Images

**POST** `/api/upload`

Upload images to CDN/storage.

#### Request

**Headers:**
```
Content-Type: multipart/form-data
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Body (multipart/form-data):**
```
images: [File, File, File] (max 10 files, max 10MB each)
```

**Validation:**
- Max 10 files per request
- Max 10MB per file
- Allowed types: JPEG, PNG, WebP
- Images should be resized/optimized server-side

#### Response

**Status:** `201 Created`

**Body:**
```json
{
  "urls": [
    "https://cdn.yourdomain.com/uploads/abc123/image1.jpg",
    "https://cdn.yourdomain.com/uploads/abc123/image2.jpg"
  ]
}
```

#### Error Responses

**413 Payload Too Large**
```json
{
  "error": {
    "code": "FILE_TOO_LARGE",
    "message": "File size exceeds 10MB limit"
  }
}
```

**415 Unsupported Media Type**
```json
{
  "error": {
    "code": "INVALID_FILE_TYPE",
    "message": "Only JPEG, PNG, and WebP images are allowed"
  }
}
```

---

## Additional Recommendations

### Database Schema

```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  ask_price DECIMAL(10, 2) NOT NULL,
  images JSONB NOT NULL,
  seller_id UUID REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'open',
  closes_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_seller (seller_id),
  INDEX idx_category (category)
);

-- Bids Table
CREATE TABLE bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  amount DECIMAL(10, 2) NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'active',
  INDEX idx_product (product_id),
  INDEX idx_user (user_id),
  INDEX idx_timestamp (timestamp DESC)
);
```

### Security Best Practices

1. **Password Hashing:** Use bcrypt with salt rounds >= 10
2. **Rate Limiting:** Implement per-endpoint and per-user limits
3. **Input Validation:** Validate and sanitize all inputs
4. **SQL Injection:** Use parameterized queries
5. **XSS Protection:** Sanitize user-generated content
6. **CORS:** Configure allowed origins
7. **HTTPS Only:** Redirect HTTP to HTTPS
8. **Token Expiration:** Implement token refresh mechanism
9. **File Upload:** Scan uploaded files for malware
10. **Logging:** Log all security events

### Image Processing

```javascript
// Example with Sharp (Node.js)
const sharp = require('sharp');

async function processImage(buffer) {
  // Generate multiple sizes
  const thumbnail = await sharp(buffer)
    .resize(200, 200, { fit: 'cover' })
    .webp({ quality: 80 })
    .toBuffer();

  const medium = await sharp(buffer)
    .resize(800, 800, { fit: 'inside' })
    .webp({ quality: 85 })
    .toBuffer();

  return { thumbnail, medium };
}
```

---

## Testing the API

### Example Requests with curl

```bash
# Register
curl -X POST https://api.yourdomain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","name":"Test User"}'

# Login
curl -X POST https://api.yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# Get Products
curl -X GET https://api.yourdomain.com/api/products \
  -H "Accept: application/json"

# Create Product
curl -X POST https://api.yourdomain.com/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=Test Product" \
  -F "description=Test description" \
  -F "category=Electronics" \
  -F "askPrice=100" \
  -F "images=@image1.jpg"

# Place Bid
curl -X POST https://api.yourdomain.com/api/bids \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId":"prod123","amount":150.00}'
```

---

## Postman Collection

Consider creating a Postman collection with all endpoints for easier testing.

---

**This specification should provide everything your backend team needs to implement the API!** 🚀

For questions or clarifications, contact: dev@yourdomain.com
