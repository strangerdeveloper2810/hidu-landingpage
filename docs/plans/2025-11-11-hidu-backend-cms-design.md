# Hidu Coffee - Backend & CMS Design Document

**Date:** 2025-11-11
**Version:** 1.0
**Status:** Approved for Implementation

## Overview

Xây dựng hệ thống backend quản lý nội dung và e-commerce cho Hidu Coffee landing page, bao gồm NestJS GraphQL API, MongoDB database, admin dashboard tích hợp vào Astro, và tính năng đặt hàng online với nhiều phương thức thanh toán.

## Tech Stack

### Backend
- **Framework:** NestJS
- **API:** GraphQL (Apollo Server)
- **Database:** MongoDB với Mongoose ODM
- **Authentication:** JWT với Passport.js
- **File Upload:** Multer + Cloudinary + Firebase Storage
- **Payment Integration:** VNPay, MoMo, ZaloPay APIs

### Frontend
- **Framework:** Astro (SSR mode)
- **GraphQL Client:** Apollo Client hoặc urql
- **State Management:** Local state + cookies cho auth
- **UI:** Tailwind CSS (đã có sẵn)

## System Architecture

```
┌─────────────────────────────────────────────┐
│         Astro Frontend (SSR)                │
│  ┌──────────────┐  ┌──────────────────┐    │
│  │ Landing Page │  │  Admin Dashboard │    │
│  │  (Public)    │  │   (Protected)    │    │
│  └──────┬───────┘  └────────┬─────────┘    │
│         │                   │               │
└─────────┼───────────────────┼───────────────┘
          │                   │
          │   GraphQL API     │
          ▼                   ▼
┌─────────────────────────────────────────────┐
│         NestJS Backend                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  GraphQL │  │   Auth   │  │  Upload  │  │
│  │  Resolvers│  │   JWT    │  │  Service │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  │
│       │             │              │        │
│  ┌────┴─────────────┴──────────────┴─────┐  │
│  │         Business Logic Modules        │  │
│  │  Menu│Promotions│Orders│Inventory│... │  │
│  └────────────────┬──────────────────────┘  │
└───────────────────┼─────────────────────────┘
                    │
                    ▼
          ┌─────────────────┐
          │  MongoDB Atlas  │
          └─────────────────┘
```

## Database Schema

### 1. MenuItems Collection
```typescript
{
  _id: ObjectId,
  id: string,              // "cf-001" (legacy compatibility)
  name: string,            // "Cà phê đen"
  description: string,
  price: number,           // 15000
  priceLarge?: number,     // 25000
  category: string,        // "coffee", "matcha", "juice", "cacao", "topping"
  imageUrl: string,        // Cloudinary/Firebase URL
  isPopular: boolean,
  isBestSeller: boolean,   // Auto-calculated từ orders
  isNew: boolean,
  isAvailable: boolean,    // Stock status
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Promotions Collection
```typescript
{
  _id: ObjectId,
  id: string,
  title: string,
  description: string,
  discount: string,        // "20%"
  validFrom: Date,
  validUntil: Date,
  imageUrl: string,
  terms: string[],
  isActive: boolean,
  applicableCategories: string[],  // ["all"] hoặc ["coffee", "matcha"]
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Banners Collection
```typescript
{
  _id: ObjectId,
  title: string,
  description?: string,
  imageUrl: string,
  linkUrl?: string,
  order: number,           // Display order
  isActive: boolean,
  position: string,        // "hero", "sidebar", "footer"
  createdAt: Date,
  updatedAt: Date
}
```

### 4. Orders Collection
```typescript
{
  _id: ObjectId,
  orderNumber: string,     // "ORD-20250111-001"
  customerInfo: {
    name: string,
    phone: string,
    email?: string,
    address?: string
  },
  items: [{
    menuItemId: ObjectId,
    name: string,          // Snapshot tại thời điểm order
    price: number,
    quantity: number,
    size?: string,         // "M" | "L"
    note?: string
  }],
  totalAmount: number,
  discount: number,
  finalAmount: number,

  paymentMethod: string,   // "COD"|"VNPay"|"MoMo"|"ZaloPay"|"BankTransfer"
  paymentStatus: string,   // "pending"|"paid"|"failed"
  paymentTransactionId?: string,

  orderStatus: string,     // "pending"|"confirmed"|"preparing"|"completed"|"cancelled"
  orderType: string,       // "delivery"|"pickup"

  notes?: string,
  createdAt: Date,
  updatedAt: Date,
  completedAt?: Date
}
```

### 5. Inventory Collection
```typescript
{
  _id: ObjectId,
  menuItemId: ObjectId,
  menuItemName: string,

  stockIn: number,         // Số lượng nhập
  stockOut: number,        // Số lượng xuất
  currentStock: number,    // Tồn kho hiện tại
  minStock: number,        // Ngưỡng cảnh báo

  transactionType: string, // "restock"|"sale"|"adjustment"
  orderId?: ObjectId,      // Reference nếu là sale
  note?: string,

  createdBy: ObjectId,     // Admin user
  createdAt: Date
}
```

### 6. Users Collection
```typescript
{
  _id: ObjectId,
  email: string,           // unique
  password: string,        // bcrypt hashed
  fullName: string,
  role: string,            // "admin"|"staff"|"manager"
  isActive: boolean,
  createdAt: Date,
  lastLogin?: Date
}
```

### 7. ShopSettings Collection (singleton)
```typescript
{
  _id: ObjectId,
  shopInfo: {
    name: string,
    tagline: string,
    description: string,
    logo?: string,
    coverImage?: string
  },
  contact: {
    phone: string,
    email: string,
    address: string,
    googleMapUrl?: string
  },
  openingHours: {
    weekday: string,
    weekend: string
  },
  social: {
    facebook?: string,
    instagram?: string,
    zalo?: string,
    tiktok?: string
  },
  delivery: {
    isEnabled: boolean,
    feePerKm: number,
    minOrderAmount: number,
    maxDistance: number
  },
  updatedAt: Date,
  updatedBy: ObjectId
}
```

### 8. Analytics Collection
```typescript
{
  _id: ObjectId,
  date: Date,              // 1 record per day

  revenue: {
    totalOrders: number,
    totalRevenue: number,
    totalDiscount: number,
    netRevenue: number,
    avgOrderValue: number
  },

  paymentMethods: {
    cod: number,
    vnpay: number,
    momo: number,
    zalopay: number,
    bankTransfer: number
  },

  topSellingItems: [{
    menuItemId: ObjectId,
    name: string,
    quantitySold: number,
    revenue: number
  }],

  ordersByHour: number[],  // 24 elements

  createdAt: Date,
  lastUpdated: Date
}
```

## GraphQL API Schema

### Queries (Public & Admin)
```graphql
type Query {
  # Public - Landing Page
  menuItems(category: String, isAvailable: Boolean): [MenuItem!]!
  menuItem(id: ID!): MenuItem
  categories: [String!]!
  activePromotions: [Promotion!]!
  activeBanners(position: String): [Banner!]!
  shopSettings: ShopSettings!

  # Public - Customer Orders
  myOrders(phone: String!): [Order!]!

  # Admin Only
  allPromotions(isActive: Boolean): [Promotion!]!
  allBanners: [Banner!]!
  orders(status: String, startDate: DateTime, endDate: DateTime): [Order!]!
  order(id: ID!): Order
  inventoryTransactions(menuItemId: ID): [Inventory!]!
  lowStockItems: [MenuItem!]!
  dailyAnalytics(startDate: DateTime!, endDate: DateTime!): [Analytics!]!
  bestSellingItems(limit: Int): [MenuItem!]!
  revenueReport(startDate: DateTime!, endDate: DateTime!): RevenueReport!
}
```

### Mutations
```graphql
type Mutation {
  # Auth
  login(email: String!, password: String!): AuthResponse!

  # Menu (Admin)
  createMenuItem(input: CreateMenuItemInput!): MenuItem!
  updateMenuItem(id: ID!, input: UpdateMenuItemInput!): MenuItem!
  deleteMenuItem(id: ID!): Boolean!
  toggleMenuItemAvailability(id: ID!): MenuItem!

  # Promotions (Admin)
  createPromotion(input: CreatePromotionInput!): Promotion!
  updatePromotion(id: ID!, input: UpdatePromotionInput!): Promotion!
  deletePromotion(id: ID!): Boolean!

  # Banners (Admin)
  createBanner(input: CreateBannerInput!): Banner!
  updateBanner(id: ID!, input: UpdateBannerInput!): Banner!
  deleteBanner(id: ID!): Boolean!

  # Orders
  createOrder(input: CreateOrderInput!): Order!
  updateOrderStatus(id: ID!, status: OrderStatus!): Order!  # Admin
  cancelOrder(id: ID!, reason: String): Order!

  # Inventory (Admin)
  addInventoryTransaction(input: InventoryTransactionInput!): Inventory!

  # Shop Settings (Admin)
  updateShopSettings(input: UpdateShopSettingsInput!): ShopSettings!

  # Upload
  uploadImage(file: Upload!): UploadResponse!
}
```

## Authentication & Authorization

### JWT Flow
1. Admin login với email/password
2. NestJS verify credentials (bcrypt)
3. Generate JWT token (expires: 7 days)
4. Return `{ accessToken, user }`
5. Astro lưu token vào httpOnly cookie
6. Mỗi request gửi token trong Authorization header
7. NestJS JwtAuthGuard verify token

### Role-Based Access
- **admin:** Full access (CRUD all resources)
- **staff:** View orders, update order status only
- **manager:** View analytics, cannot delete data

### Security Measures
- Password hashing: bcrypt (saltRounds: 10)
- JWT secret: từ environment variable
- CORS: whitelist frontend domain only
- Rate limiting: prevent brute force
- Input validation: class-validator decorators
- XSS protection: sanitize user inputs

## Admin Dashboard Features

### 1. Dashboard (/admin/dashboard)
- Revenue cards (today, week, month)
- New orders count
- Low stock warnings
- Line chart: 7-day revenue
- Bar chart: Top 5 best sellers
- Latest 5 orders table

### 2. Menu Management (/admin/menu)
- Table: Image, Name, Category, Price, Stock, Status
- Search & filter by category, availability
- Actions: Create, Edit, Delete, Toggle availability
- Inline editing or modal forms
- Image upload with preview

### 3. Promotions (/admin/promotions)
- Table: Title, Discount, Valid dates, Active status
- CRUD operations
- Quick toggle active/inactive
- Auto-disable expired promotions

### 4. Banners (/admin/banners)
- Grid view with image previews
- Drag & drop reordering
- Upload new banners
- Set position (hero, sidebar, footer)

### 5. Orders Management (/admin/orders)
- Tabs: Pending, Confirmed, Preparing, Completed, Cancelled
- Table: Order#, Time, Customer, Amount, Payment, Status
- Order details modal: Items, timeline, actions
- Update status workflow
- Real-time notifications for new orders
- Auto-refresh every 30s
- Print bill button

### 6. Inventory (/admin/inventory)
- Stock overview table with warnings
- Add stock form (restock transactions)
- Transaction history
- Auto stock deduction on order completion
- Low stock alerts

### 7. Analytics (/admin/analytics)
- Date range picker
- Revenue metrics cards
- Revenue line chart
- Top 10 best sellers table & bar chart
- Payment methods pie chart
- Orders by hour heatmap
- Export to Excel/PDF

### 8. Shop Settings (/admin/settings)
- Update shop info form
- Upload logo & cover image
- Social media links
- Delivery configuration
- Opening hours

## Customer Features (Landing Page)

### Public Pages
- **Home (/):** Hero, featured items, promotions
- **Menu (/menu):** Browse all items by category
- **Promotions (/promotions):** Active promotions
- **About (/about):** Shop info
- **Contact (/contact):** Contact form

### E-commerce Flow
1. Browse menu → Add to cart (local state)
2. View cart → Update quantities
3. Checkout → Fill customer info
4. Choose payment method:
   - **COD:** Submit order → Pending
   - **VNPay/MoMo/ZaloPay:** Redirect → Callback → Update status
   - **Bank Transfer:** Submit → Upload receipt → Admin confirm
5. Order confirmation page with order number
6. Track order with phone number

## Payment Integration

### VNPay
- Sandbox testing first
- Create payment URL → Redirect → IPN callback
- Verify signature → Update order payment status

### MoMo
- Similar flow with MoMo API
- QR code option

### ZaloPay
- API integration
- Deep link to ZaloPay app

### Bank Transfer
- Customer uploads receipt image
- Admin manually confirms payment

## File Upload Strategy

### Cloudinary (Primary)
- Auto image optimization
- Responsive URLs
- Free tier: 25GB storage
- Use for: Menu images, banners, promotion images

### Firebase Storage (Backup)
- Use for: Payment receipts, documents
- Free tier: 5GB storage

### Upload Flow
1. Admin selects file
2. Multer handles multipart/form-data
3. Upload to Cloudinary via SDK
4. Return secure URL
5. Save URL to MongoDB

## Deployment Considerations

### Backend (NestJS)
- Deploy to: Railway, Render, DigitalOcean, VPS
- Environment variables: DB_URI, JWT_SECRET, CLOUDINARY_*, PAYMENT_*
- CORS config: production frontend domain

### Frontend (Astro SSR)
- Deploy to: Vercel, Netlify, Railway (support SSR)
- Cannot use static hosting (Netlify Static, GitHub Pages)
- Environment: GRAPHQL_API_URL

### Database
- MongoDB Atlas (free M0 cluster 512MB)
- Enable IP whitelist
- Regular backups

## Migration Strategy

1. Create NestJS backend with GraphQL
2. Migrate data từ `src/data/menu.ts` vào MongoDB
3. Update Astro pages để fetch từ GraphQL thay vì import local data
4. Build admin pages
5. Test e-commerce flow
6. Deploy backend → Deploy frontend

## Future Enhancements

- Customer accounts & loyalty points
- SMS notifications (ESMS, Twilio)
- Mobile app (React Native)
- Table reservation system
- Multi-location support
- Inventory forecasting with AI

---

**Prepared by:** Claude
**Approved for implementation:** 2025-11-11
