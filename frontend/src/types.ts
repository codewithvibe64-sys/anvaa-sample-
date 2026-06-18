/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  _id?: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
  phone?: string;
  avatar?: string;
  savedAddresses?: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export interface Designer {
  id: string;
  name: string;
  city: string;
  bio: string;
  achievements: string[];
  history: { year: string; event: string }[];
  rating: number;
  reviewsCount: number;
  avatar: string;
  coverImage: string;
  specialty: string;
  consultationFee: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'Wedding Collection' | 'Office Wear' | 'Casual Wear' | 'Designer Collections' | 'Premium Limited Editions';
  description: string;
  designerId?: string;
  designerName?: string;
  images: string[];
  sizes: string[];
  stock: number;
  rating: number;
  isTrending?: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  address: Address;
  paymentMethod: string;
  status: 'Order Placed' | 'In Crafting' | 'Quality Check' | 'Dispatched' | 'Out for Delivery' | 'Delivered';
  createdAt: string;
  trackingTimeline: { status: string; date: string; description: string; done: boolean }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
}

export interface Payment {
  orderId: string;
  method: string;
  amount: number;
  status: 'Pending' | 'Success' | 'Failed';
  transactionId: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'designer';
  content: string;
  timestamp: string;
}

export interface ChatThread {
  id: string;
  customerId: string;
  customerName: string;
  designerId: string;
  designerName: string;
  messages: ChatMessage[];
  lastUpdated: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Consultation {
  id: string;
  userId: string;
  userName: string;
  designerId: string;
  designerName: string;
  date: string;
  timeSlot: string;
  status: 'Requested' | 'Confirmed' | 'Completed' | 'Cancelled';
  notes?: string;
  amount: number;
  createdAt: string;
}
