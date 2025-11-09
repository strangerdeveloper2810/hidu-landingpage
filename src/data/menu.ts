import type { MenuItem, Promotion } from '../types';

/**
 * Sample menu items - Replace with actual menu data
 */
export const menuItems: MenuItem[] = [
  // Coffee
  {
    id: 'cf-001',
    name: 'Cà Phê Đen Đá',
    description: 'Cà phê phin truyền thống, đậm đà hương vị Việt',
    price: 25000,
    category: 'coffee',
    image: '/images/menu/ca-phe-den.jpg',
    isPopular: true,
  },
  {
    id: 'cf-002',
    name: 'Bạc Xỉu',
    description: 'Cà phê sữa Sài Gòn, ngọt ngào và béo ngậy',
    price: 30000,
    category: 'coffee',
    image: '/images/menu/bac-xiu.jpg',
    isBestSeller: true,
  },
  {
    id: 'cf-003',
    name: 'Cappuccino',
    description: 'Espresso Ý kết hợp sữa tươi và foam mịn màng',
    price: 45000,
    category: 'coffee',
    image: '/images/menu/cappuccino.jpg',
  },
  {
    id: 'cf-004',
    name: 'Cold Brew',
    description: 'Cà phê ủ lạnh 24h, vị ngọt tự nhiên',
    price: 50000,
    category: 'coffee',
    image: '/images/menu/cold-brew.jpg',
    isNew: true,
  },

  // Milk Tea
  {
    id: 'mt-001',
    name: 'Trà Sữa Truyền Thống',
    description: 'Trà đen kết hợp sữa tươi, topping trân châu',
    price: 35000,
    category: 'milktea',
    image: '/images/menu/tra-sua-truyen-thong.jpg',
    isBestSeller: true,
  },
  {
    id: 'mt-002',
    name: 'Trà Sữa Matcha',
    description: 'Matcha Nhật Bản cao cấp, béo ngậy',
    price: 45000,
    category: 'milktea',
    image: '/images/menu/tra-sua-matcha.jpg',
    isPopular: true,
  },
  {
    id: 'mt-003',
    name: 'Trà Sữa Socola',
    description: 'Socola đắng ngọt hòa quyện cùng trà sữa',
    price: 40000,
    category: 'milktea',
    image: '/images/menu/tra-sua-socola.jpg',
  },

  // Tea
  {
    id: 'tea-001',
    name: 'Trà Đào Cam Sả',
    description: 'Trà hoa quả tươi mát, thơm lừng hương sả',
    price: 35000,
    category: 'tea',
    image: '/images/menu/tra-dao-cam-sa.jpg',
    isPopular: true,
  },
  {
    id: 'tea-002',
    name: 'Trà Chanh Leo',
    description: 'Trà xanh kết hợp chanh leo chua ngọt',
    price: 30000,
    category: 'tea',
    image: '/images/menu/tra-chanh-leo.jpg',
  },
  {
    id: 'tea-003',
    name: 'Trà Oolong Vải',
    description: 'Trà Oolong thơm nồng, vải thiều tươi',
    price: 38000,
    category: 'tea',
    image: '/images/menu/tra-oolong-vai.jpg',
    isNew: true,
  },

  // Smoothie
  {
    id: 'sm-001',
    name: 'Sinh Tố Bơ',
    description: 'Bơ Đắk Lắk béo ngậy, sữa tươi',
    price: 40000,
    category: 'smoothie',
    image: '/images/menu/sinh-to-bo.jpg',
    isBestSeller: true,
  },
  {
    id: 'sm-002',
    name: 'Sinh Tố Dâu',
    description: 'Dâu tây Đà Lạt tươi, sữa chua',
    price: 42000,
    category: 'smoothie',
    image: '/images/menu/sinh-to-dau.jpg',
  },
  {
    id: 'sm-003',
    name: 'Sinh Tố Xoài',
    description: 'Xoài cát Hòa Lộc, ngọt thanh mát lạnh',
    price: 38000,
    category: 'smoothie',
    image: '/images/menu/sinh-to-xoai.jpg',
  },

  // Juice
  {
    id: 'jc-001',
    name: 'Nước Ép Cam',
    description: 'Cam Sành tươi ép, giàu vitamin C',
    price: 30000,
    category: 'juice',
    image: '/images/menu/nuoc-ep-cam.jpg',
  },
  {
    id: 'jc-002',
    name: 'Nước Ép Dưa Hấu',
    description: 'Dưa hấu ngọt mát, giải nhiệt',
    price: 28000,
    category: 'juice',
    image: '/images/menu/nuoc-ep-dua-hau.jpg',
  },
  {
    id: 'jc-003',
    name: 'Nước Ép Dứa',
    description: 'Dứa tươi ngọt, bổ dưỡng',
    price: 32000,
    category: 'juice',
    image: '/images/menu/nuoc-ep-dua.jpg',
  },

  // Special
  {
    id: 'sp-001',
    name: 'Yogurt Dâu Nhiệt Đới',
    description: 'Yogurt Hy Lạp, dâu tươi, granola',
    price: 55000,
    category: 'special',
    image: '/images/menu/yogurt-dau.jpg',
    isNew: true,
    isPopular: true,
  },
  {
    id: 'sp-002',
    name: 'Đá Xay Cookie',
    description: 'Đá xay vani, bánh cookie nghiền, kem tươi',
    price: 58000,
    category: 'special',
    image: '/images/menu/da-xay-cookie.jpg',
    isBestSeller: true,
  },
];

/**
 * Sample promotions - Replace with actual promotion data
 */
export const promotions: Promotion[] = [
  {
    id: 'promo-001',
    title: 'Happy Hour',
    description: 'Giảm 20% tất cả đồ uống',
    discount: '20%',
    validUntil: new Date('2025-12-31'),
    image: '/images/promotions/happy-hour.jpg',
    terms: [
      'Áp dụng từ 14:00 - 16:00 hàng ngày',
      'Không áp dụng cho combo và món đặc biệt',
      'Không kết hợp với chương trình khác',
    ],
  },
  {
    id: 'promo-002',
    title: 'Combo Học Đường',
    description: '1 đồ uống + 1 bánh chỉ 45.000đ',
    discount: 'Tiết kiệm 15.000đ',
    validUntil: new Date('2025-12-31'),
    image: '/images/promotions/combo-hoc-duong.jpg',
    terms: [
      'Áp dụng cho học sinh, sinh viên (có thẻ)',
      'Áp dụng cả tuần',
    ],
  },
  {
    id: 'promo-003',
    title: 'Thành Viên VIP',
    description: 'Tích điểm đổi quà, ưu đãi độc quyền',
    discount: 'Miễn phí đăng ký',
    validUntil: new Date('2025-12-31'),
    image: '/images/promotions/vip-member.jpg',
    terms: [
      '1 điểm = 10.000đ chi tiêu',
      '100 điểm đổi 1 voucher 100.000đ',
      'Ưu đãi sinh nhật đặc biệt',
    ],
  },
];
