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
    timeToClose: '2 days',
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
    timeToClose: '5 days',
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
    timeToClose: '3 days',
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
