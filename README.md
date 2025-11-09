# Hidu Drinks - Landing Page

Landing page hiện đại cho quán đồ uống, được xây dựng với **Astro**, **TailwindCSS**, và nhiều animation mượt mà.

## ✨ Tính năng

- 🎨 **Thiết kế hiện đại**: Gradient đầy màu sắc, animations mượt mà
- 📱 **Responsive**: Tối ưu cho mọi thiết bị từ mobile đến desktop
- ⚡ **Performance tốt**: Static Site Generation (SSG) với Astro
- 🎭 **Animations**: GSAP parallax, AOS scroll animations, hover effects
- 🍔 **Menu đầy đủ**: Filtering theo danh mục, search, add to cart
- 📝 **Forms**: Đặt hàng online, đặt bàn trước
- 🔍 **SEO tốt**: Meta tags, Open Graph, Twitter Cards, JSON-LD structured data
- ♿ **Accessible**: Semantic HTML, ARIA labels, keyboard navigation

## 🛠️ Tech Stack

- **Framework**: [Astro 4.x](https://astro.build/)
- **Styling**: [TailwindCSS 4.x](https://tailwindcss.com/)
- **TypeScript**: Type-safe development
- **Animations**:
  - [GSAP](https://greensock.com/gsap/) - Advanced parallax và animations
  - [AOS](https://michalsnik.github.io/aos/) - Scroll animations
  - [Swiper](https://swiperjs.com/) - Carousels (nếu cần)
- **SEO**: Sitemap, robots.txt, structured data

## 📁 Cấu trúc dự án

```
hidu/
├── public/                    # Static assets
│   ├── images/
│   │   ├── hero/             # Hero section images
│   │   ├── menu/             # Menu item images
│   │   ├── gallery/          # Gallery images
│   │   └── promotions/       # Promotion images
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── layout/           # Layout components
│   │   │   ├── Header.astro
│   │   │   ├── Footer.astro
│   │   │   └── Navigation.astro
│   │   ├── sections/         # Page sections
│   │   │   ├── Hero.astro
│   │   │   ├── FeaturedMenu.astro
│   │   │   ├── MenuGrid.astro
│   │   │   ├── ContactForm.astro
│   │   │   └── PromotionBanner.astro
│   │   └── ui/               # Reusable UI components
│   │       ├── Button.astro
│   │       ├── Card.astro
│   │       └── Input.astro
│   ├── data/                 # Sample data
│   │   └── menu.ts           # Menu items & promotions
│   ├── layouts/
│   │   └── BaseLayout.astro  # Main layout with SEO
│   ├── pages/                # Routes
│   │   ├── index.astro       # Home page
│   │   ├── menu.astro        # Menu page
│   │   ├── about.astro       # About page
│   │   ├── contact.astro     # Contact page
│   │   └── promotions.astro  # Promotions page
│   ├── styles/
│   │   └── global.css        # Global styles & Tailwind config
│   ├── types/
│   │   └── index.ts          # TypeScript types
│   └── utils/
│       └── constants.ts      # Constants & configs
├── astro.config.mjs          # Astro configuration
├── tsconfig.json             # TypeScript configuration
└── package.json
```

## 🚀 Hướng dẫn sử dụng

### 1. Cài đặt dependencies

```bash
pnpm install
```

### 2. Chạy development server

```bash
pnpm dev
```

Server sẽ chạy tại `http://localhost:4321`

### 3. Build production

```bash
pnpm build
```

### 4. Preview production build

```bash
pnpm preview
```

## ⚙️ Cấu hình

### Cập nhật thông tin quán

Chỉnh sửa file `src/utils/constants.ts`:

```typescript
export const SHOP_INFO: ShopInfo = {
  name: 'Tên quán của bạn',
  tagline: 'Slogan của bạn',
  description: 'Mô tả quán...',
  address: 'Địa chỉ chi tiết',
  phone: '0123 456 789',
  email: 'email@example.com',
  openingHours: {
    weekday: '7:00 - 22:00',
    weekend: '7:00 - 23:00',
  },
  social: {
    facebook: 'https://facebook.com/...',
    instagram: 'https://instagram.com/...',
    zalo: 'https://zalo.me/...',
  },
};
```

### Cập nhật menu

Chỉnh sửa file `src/data/menu.ts` để thêm/sửa/xóa món đồ uống.

### Cập nhật domain cho SEO

Chỉnh sửa `astro.config.mjs`:

```javascript
export default defineConfig({
  site: 'https://yourdomain.com', // Thay bằng domain thật
  // ...
});
```

### Thêm hình ảnh

1. Thêm hình ảnh vào thư mục tương ứng trong `/public/images/`
2. Cập nhật đường dẫn trong:
   - `src/data/menu.ts` cho menu items
   - Component tương ứng cho các sections khác

## 🎨 Tùy chỉnh màu sắc

Chỉnh sửa `src/styles/global.css` để thay đổi color palette:

```css
@theme {
  --color-primary-500: #your-color;
  --color-secondary-500: #your-color;
  --color-accent-500: #your-color;
  /* ... */
}
```

## 📦 Deploy

### Vercel (Recommended)

```bash
# Install Vercel CLI
pnpm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Install Netlify CLI
pnpm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### VPS (như trong thiết kế)

1. Build project:
```bash
pnpm build
```

2. Copy folder `dist/` lên VPS

3. Setup Nginx:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

4. (Optional) Setup SSL với Let's Encrypt:
```bash
certbot --nginx -d yourdomain.com
```

## 🔧 Backend Integration (Tương lai)

Hiện tại frontend đã sẵn sàng, các forms đã có UI và validation. Để tích hợp backend:

1. **Tạo API endpoints** trong `src/pages/api/`:
   - `POST /api/orders` - Xử lý đơn hàng
   - `POST /api/reservations` - Xử lý đặt bàn

2. **Kết nối Database** (MongoDB Atlas như thiết kế):
```bash
pnpm add mongodb mongoose
```

3. **Setup Email Service**:
```bash
pnpm add nodemailer
```

Xem file `src/types/index.ts` để biết data structure cho backend.

## 📝 Scripts

```bash
# Development
pnpm dev

# Build
pnpm build

# Preview production build
pnpm preview

# Type check
pnpm astro check
```

## 🎯 Performance

- ⚡ Lighthouse Score: 95+
- 🎨 First Contentful Paint: < 1s
- 📦 Bundle size: ~150KB (gzipped)
- 🖼️ Images: Lazy loading, optimized formats

## 📄 License

MIT License

---

**Được xây dựng với ❤️ bởi Hidu Team**
