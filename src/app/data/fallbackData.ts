/**
 * FALLBACK DATA — Used when the API is unavailable or returns empty results.
 *
 * TODO: Remove this entire file once the backend API is fully integrated.
 * Search for "fallbackData" across the codebase to find all usages.
 */

import type {
  ProductResponse,
  ProductPageResponse,
  BidResponse,
  UserBidResponse,
} from "@/services/api";

const futureDate = (days: number) =>
  new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

const pastDate = (days: number) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

export const FALLBACK_PRODUCTS: ProductResponse[] = [
  {
    id: "fb-1",
    title: "Vintage Camera",
    description:
      "Classic 35mm film camera in excellent condition. Perfect for photography enthusiasts.",
    images: [
      "https://images.unsplash.com/photo-1588420635201-3a9e2a2a0a07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    startingPrice: 250,
    currentPrice: 300,
    status: "ACTIVE",
    category: "Electronics",
    endTime: futureDate(2),
    sellerId: "fb-seller-1",
    sellerName: "Demo Seller",
    bidCount: 3,
    createdAt: pastDate(5),
    updatedAt: pastDate(1),
  },
  {
    id: "fb-2",
    title: "Luxury Watch",
    description:
      "Premium timepiece with automatic movement. Sapphire crystal glass, water resistant to 100m.",
    images: [
      "https://images.unsplash.com/photo-1639564879163-a2a85682410e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    startingPrice: 500,
    currentPrice: 650,
    status: "ACTIVE",
    category: "Fashion",
    endTime: futureDate(5),
    sellerId: "fb-seller-1",
    sellerName: "Demo Seller",
    bidCount: 5,
    createdAt: pastDate(3),
    updatedAt: pastDate(1),
  },
  {
    id: "fb-3",
    title: "Mountain Bike",
    description:
      "Full-suspension mountain bike, 27.5\" wheels. Great for trail riding and off-road adventures.",
    images: [
      "https://images.unsplash.com/photo-1656480930913-dc35796ff5cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    startingPrice: 800,
    currentPrice: 800,
    status: "ACTIVE",
    category: "Sports",
    endTime: futureDate(3),
    sellerId: "fb-seller-2",
    sellerName: "Another Seller",
    bidCount: 0,
    createdAt: pastDate(4),
    updatedAt: pastDate(2),
  },
];

export const FALLBACK_PRODUCT_PAGE: ProductPageResponse = {
  products: FALLBACK_PRODUCTS,
  totalElements: FALLBACK_PRODUCTS.length,
  totalPages: 1,
  currentPage: 0,
  pageSize: 10,
};

export const FALLBACK_BIDS: Record<string, BidResponse[]> = {
  "fb-1": [
    {
      id: "fb-b1",
      amount: 300,
      productId: "fb-1",
      userId: "fb-user-2",
      bidderName: "Jane Smith",
      status: "ACTIVE",
      createdAt: pastDate(1),
    },
    {
      id: "fb-b2",
      amount: 280,
      productId: "fb-1",
      userId: "fb-user-1",
      bidderName: "John Doe",
      status: "OUTBID",
      createdAt: pastDate(2),
    },
    {
      id: "fb-b3",
      amount: 265,
      productId: "fb-1",
      userId: "fb-user-3",
      bidderName: "Bob Johnson",
      status: "OUTBID",
      createdAt: pastDate(3),
    },
  ],
  "fb-2": [
    {
      id: "fb-b4",
      amount: 650,
      productId: "fb-2",
      userId: "fb-user-1",
      bidderName: "John Doe",
      status: "ACTIVE",
      createdAt: pastDate(1),
    },
    {
      id: "fb-b5",
      amount: 600,
      productId: "fb-2",
      userId: "fb-user-3",
      bidderName: "Bob Johnson",
      status: "OUTBID",
      createdAt: pastDate(2),
    },
  ],
};

export const FALLBACK_USER_BIDS: UserBidResponse[] = [
  {
    id: "fb-b2",
    amount: 280,
    productId: "fb-1",
    productTitle: "Vintage Camera",
    status: "OUTBID",
    createdAt: pastDate(2),
  },
  {
    id: "fb-b4",
    amount: 650,
    productId: "fb-2",
    productTitle: "Luxury Watch",
    status: "ACTIVE",
    createdAt: pastDate(1),
  },
];

/**
 * Helper: get a fallback product by ID.
 */
export function getFallbackProduct(id: string): ProductResponse | undefined {
  return FALLBACK_PRODUCTS.find((p) => p.id === id);
}

/**
 * Helper: get fallback bids for a product.
 */
export function getFallbackBids(productId: string): BidResponse[] {
  return FALLBACK_BIDS[productId] ?? [];
}
