import type { ShopInfo, Category } from '../types';

/**
 * Shop information - Replace with actual data
 */
export const SHOP_INFO: ShopInfo = {
  name: 'Hidu Drinks',
  tagline: 'Nơi hương vị gặp gỡ cảm xúc',
  description:
    'Không gian ấm cúng với đa dạng đồ uống chất lượng, từ cà phê thơm ngon đến trà sữa đậm đà, phù hợp cho mọi lứa tuổi.',
  address: '123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh',
  phone: '0123 456 789',
  email: 'contact@hidudrinks.com',
  openingHours: {
    weekday: '7:00 - 22:00',
    weekend: '7:00 - 23:00',
  },
  social: {
    facebook: 'https://facebook.com/hidudrinks',
    instagram: 'https://instagram.com/hidudrinks',
    zalo: 'https://zalo.me/hidudrinks',
  },
};

/**
 * Menu categories with display names
 */
export const CATEGORIES: Record<Category, string> = {
  coffee: 'Cà Phê',
  tea: 'Trà',
  milktea: 'Trà Sữa',
  smoothie: 'Sinh Tố',
  juice: 'Nước Ép',
  special: 'Đặc Biệt',
};

/**
 * Navigation menu items
 */
export const NAV_ITEMS = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Thực đơn', href: '/menu' },
  { label: 'Về chúng tôi', href: '/about' },
  { label: 'Khuyến mãi', href: '/promotions' },
  { label: 'Liên hệ', href: '/contact' },
];

/**
 * SEO default config
 */
export const DEFAULT_SEO = {
  siteName: 'Hidu Drinks',
  locale: 'vi_VN',
  twitterHandle: '@hidudrinks',
};

/**
 * Animation duration constants (in ms)
 */
export const ANIMATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 800,
};

/**
 * Breakpoints for responsive design (matches Tailwind defaults)
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};
