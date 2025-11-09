/**
 * Type definitions for the beverage shop landing page
 */

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  isPopular?: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
}

export type Category =
  | 'coffee'
  | 'tea'
  | 'milktea'
  | 'smoothie'
  | 'juice'
  | 'special';

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: string;
  validUntil: Date;
  image: string;
  terms?: string[];
}

export interface ContactFormData {
  name: string;
  phone: string;
  email?: string;
  message: string;
}

export interface ReservationFormData {
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  note?: string;
}

export interface OrderItem {
  menuItemId: string;
  quantity: number;
  note?: string;
}

export interface OrderFormData {
  name: string;
  phone: string;
  items: OrderItem[];
  deliveryAddress?: string;
  note?: string;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  zalo?: string;
}

export interface ShopInfo {
  name: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  openingHours: {
    weekday: string;
    weekend: string;
  };
  social: SocialLinks;
}

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
}
