// Android emulator uses 10.0.2.2 to reach host machine's localhost
import { Capacitor } from '@capacitor/core';

function getApiBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) return envUrl;

  // Use Capacitor's native platform detection (more reliable than userAgent)
  if (Capacitor.getPlatform() === 'android') {
    return 'http://10.0.2.2:8080/api';
  }
  return 'http://localhost:8080/api';
}

const API_BASE_URL = getApiBaseUrl();

// DEBUG: expose logs for Login debug panel
(window as any).__apiDebugLogs = [] as string[];
function apiDebugLog(msg: string) {
  console.log('[API DEBUG]', msg);
  (window as any).__apiDebugLogs.push(`[${new Date().toLocaleTimeString()}] ${msg}`);
}
apiDebugLog(`API_BASE_URL = ${API_BASE_URL}`);
apiDebugLog(`Platform = ${Capacitor.getPlatform()}`);
apiDebugLog(`isNative = ${Capacitor.isNativePlatform()}`);

// --- Token management ---

function getAccessToken(): string | null {
  return localStorage.getItem('access_token');
}

function getRefreshToken(): string | null {
  return localStorage.getItem('refresh_token');
}

function setTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
}

function clearTokens() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
}

// --- API Response types (envelope) ---

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// --- Domain types matching OpenAPI schemas ---

export interface ProductResponse {
  id: string;
  title: string;
  description: string;
  images: string[];
  startingPrice: number;
  currentPrice: number;
  status: string;
  category: string;
  endTime: string;
  sellerId: string;
  sellerName: string;
  joyOfGiving: boolean;
  bidCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductPageResponse {
  products: ProductResponse[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface CreateProductRequest {
  title: string;
  description?: string;
  images?: string[];
  startingPrice: number;
  category?: string;
  joyOfGiving?: boolean;
  endTime: string;
}

export interface UpdateProductRequest {
  title?: string;
  description?: string;
  images?: string[];
  startingPrice?: number;
  category?: string;
  endTime?: string;
}

export interface BidResponse {
  id: string;
  amount: number;
  productId: string;
  userId: string;
  bidderName: string;
  status: string;
  createdAt: string;
}

export interface CreateBidRequest {
  productId: string;
  amount: number;
}

export interface UserBidResponse {
  id: string;
  amount: number;
  productId: string;
  productTitle: string;
  status: string;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  email: string;
  fullName: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface UserResponse {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  address: string;
  role: string;
  createdAt: string;
}

export interface UpdateUserRequest {
  fullName?: string;
  phone?: string;
  address?: string;
}

export interface FileUploadResponse {
  fileName: string;
  url: string;
  size: number;
}

// --- Core request helper ---

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAccessToken();

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const fullUrl = `${API_BASE_URL}${endpoint}`;
  apiDebugLog(`FETCH ${options.method || 'GET'} ${fullUrl}`);

  let response: Response;
  try {
    response = await fetch(fullUrl, {
      ...options,
      headers,
    });
    apiDebugLog(`Response: ${response.status} ${response.statusText}`);
  } catch (fetchError: any) {
    apiDebugLog(`FETCH ERROR: ${fetchError.message || fetchError}`);
    throw fetchError;
  }

  // Handle 401 - try token refresh
  if (response.status === 401 && getRefreshToken()) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      headers['Authorization'] = `Bearer ${getAccessToken()}`;
      const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });
      if (retryResponse.status === 204) return undefined as T;
      if (!retryResponse.ok) {
        const error = await retryResponse.json().catch(() => ({}));
        throw new Error(error.message || `API Error: ${retryResponse.status}`);
      }
      const retryResult: ApiResponse<T> = await retryResponse.json();
      return retryResult.data;
    } else {
      clearTokens();
      window.location.href = '/login';
      throw new Error('Session expired');
    }
  }

  if (response.status === 204) return undefined as T;

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  const result: ApiResponse<T> = await response.json();
  return result.data;
}

async function tryRefreshToken(): Promise<boolean> {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) return false;

    const result: ApiResponse<AuthResponse> = await response.json();
    setTokens(result.data.accessToken, result.data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

// --- Products API ---

export const productsAPI = {
  async getAll(params?: {
    status?: string;
    category?: string;
    search?: string;
    page?: number;
    size?: number;
  }): Promise<ProductPageResponse> {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.category) searchParams.set('category', params.category);
    if (params?.search) searchParams.set('search', params.search);
    if (params?.page !== undefined) searchParams.set('page', params.page.toString());
    if (params?.size !== undefined) searchParams.set('size', params.size.toString());
    const qs = searchParams.toString();
    return apiRequest<ProductPageResponse>(`/products${qs ? `?${qs}` : ''}`);
  },

  async getById(id: string): Promise<ProductResponse> {
    return apiRequest<ProductResponse>(`/products/${id}`);
  },

  async create(data: CreateProductRequest): Promise<ProductResponse> {
    return apiRequest<ProductResponse>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: UpdateProductRequest): Promise<ProductResponse> {
    return apiRequest<ProductResponse>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<void> {
    return apiRequest<void>(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// --- Bids API ---

export const bidsAPI = {
  async getByProduct(productId: string): Promise<BidResponse[]> {
    return apiRequest<BidResponse[]>(`/bids/product/${productId}`);
  },

  async create(data: CreateBidRequest): Promise<BidResponse> {
    return apiRequest<BidResponse>('/bids', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getMyBids(): Promise<UserBidResponse[]> {
    return apiRequest<UserBidResponse[]>('/user/bids');
  },
};

// --- Auth API ---

export const authAPI = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const result = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setTokens(result.accessToken, result.refreshToken);
    localStorage.setItem('user', JSON.stringify({
      email: result.email,
      fullName: result.fullName,
      role: result.role,
    }));
    return result;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const result = await apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setTokens(result.accessToken, result.refreshToken);
    localStorage.setItem('user', JSON.stringify({
      email: result.email,
      fullName: result.fullName,
      role: result.role,
    }));
    return result;
  },

  async logout(): Promise<void> {
    try {
      await apiRequest<void>('/auth/logout', { method: 'POST' });
    } finally {
      clearTokens();
    }
  },

  isAuthenticated(): boolean {
    return !!getAccessToken();
  },

  getStoredUser(): { email: string; fullName: string; role: string } | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

// --- User API ---

export const userAPI = {
  async getProfile(): Promise<UserResponse> {
    return apiRequest<UserResponse>('/user/me');
  },

  async updateProfile(data: UpdateUserRequest): Promise<UserResponse> {
    return apiRequest<UserResponse>('/user/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// --- Upload API ---

export const uploadAPI = {
  async uploadFile(file: File): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return apiRequest<FileUploadResponse>('/upload', {
      method: 'POST',
      body: formData,
    });
  },

  async uploadMultiple(files: File[]): Promise<string[]> {
    const results = await Promise.all(files.map((f) => this.uploadFile(f)));
    return results.map((r) => r.url);
  },
};

// --- Export ---

export const api = {
  products: productsAPI,
  bids: bidsAPI,
  auth: authAPI,
  user: userAPI,
  upload: uploadAPI,
};

export default api;
