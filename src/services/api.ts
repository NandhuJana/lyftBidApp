/**
 * API Service Layer
 *
 * This file provides a centralized API service for backend integration.
 * Replace the mock functions with actual API calls to your backend.
 *
 * TODO: Update VITE_API_URL in .env files with your actual API endpoint
 */

// API Base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  // TODO: Implement your auth token retrieval logic
  return localStorage.getItem('auth_token');
};

// Helper function for API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  return response.json();
}

// ============================================================================
// PRODUCTS API
// ============================================================================

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
  timeToClose?: string;
}

export interface ProductCreateData {
  title: string;
  description: string;
  category: string;
  askPrice: number;
  images: File[];
}

export const productsAPI = {
  /**
   * Get all products
   * TODO: Replace with actual API call
   */
  async getAll(): Promise<Product[]> {
    try {
      return await apiRequest<Product[]>('/products');
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw error;
    }
  },

  /**
   * Get single product by ID
   * TODO: Replace with actual API call
   */
  async getById(id: string): Promise<Product> {
    try {
      return await apiRequest<Product>(`/products/${id}`);
    } catch (error) {
      console.error(`Failed to fetch product ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create new product listing
   * TODO: Replace with actual API call
   */
  async create(data: ProductCreateData): Promise<Product> {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('askPrice', data.askPrice.toString());

      // Append images
      data.images.forEach((image, index) => {
        formData.append(`images`, image);
      });

      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to create product:', error);
      throw error;
    }
  },

  /**
   * Update existing product
   * TODO: Replace with actual API call
   */
  async update(id: string, data: Partial<Product>): Promise<Product> {
    try {
      return await apiRequest<Product>(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error(`Failed to update product ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete product
   * TODO: Replace with actual API call
   */
  async delete(id: string): Promise<void> {
    try {
      await apiRequest<void>(`/products/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error(`Failed to delete product ${id}:`, error);
      throw error;
    }
  },
};

// ============================================================================
// BIDS API
// ============================================================================

export interface Bid {
  id: string;
  productId: string;
  bidderName: string;
  amount: number;
  timestamp: Date;
}

export interface BidCreateData {
  productId: string;
  amount: number;
}

export interface UserBidItem {
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

export const bidsAPI = {
  /**
   * Get all bids for a product
   * TODO: Replace with actual API call
   */
  async getByProduct(productId: string): Promise<Bid[]> {
    try {
      return await apiRequest<Bid[]>(`/bids/product/${productId}`);
    } catch (error) {
      console.error(`Failed to fetch bids for product ${productId}:`, error);
      throw error;
    }
  },

  /**
   * Place a new bid
   * TODO: Replace with actual API call
   */
  async create(data: BidCreateData): Promise<Bid> {
    try {
      return await apiRequest<Bid>('/bids', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Failed to place bid:', error);
      throw error;
    }
  },

  /**
   * Get current user's bid history
   * TODO: Replace with actual API call
   */
  async getMyBids(): Promise<UserBidItem[]> {
    try {
      return await apiRequest<UserBidItem[]>('/user/bids');
    } catch (error) {
      console.error('Failed to fetch user bids:', error);
      throw error;
    }
  },
};

// ============================================================================
// AUTHENTICATION API
// ============================================================================

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export const authAPI = {
  /**
   * User login
   * TODO: Replace with actual API call
   */
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await apiRequest<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      // Store token
      localStorage.setItem('auth_token', response.token);

      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  /**
   * User registration
   * TODO: Replace with actual API call
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiRequest<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      // Store token
      localStorage.setItem('auth_token', response.token);

      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },

  /**
   * User logout
   */
  logout(): void {
    localStorage.removeItem('auth_token');
    // TODO: Optionally call backend logout endpoint
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!getAuthToken();
  },
};

// ============================================================================
// IMAGE UPLOAD API
// ============================================================================

export const uploadAPI = {
  /**
   * Upload images to server
   * TODO: Replace with actual API call
   */
  async uploadImages(images: File[]): Promise<string[]> {
    try {
      const formData = new FormData();
      images.forEach((image) => {
        formData.append('images', image);
      });

      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload images');
      }

      const result = await response.json();
      return result.urls; // Assumes API returns { urls: string[] }
    } catch (error) {
      console.error('Failed to upload images:', error);
      throw error;
    }
  },
};

// ============================================================================
// EXPORT ALL APIs
// ============================================================================

export const api = {
  products: productsAPI,
  bids: bidsAPI,
  auth: authAPI,
  upload: uploadAPI,
};

export default api;
