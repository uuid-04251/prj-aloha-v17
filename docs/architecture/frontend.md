# Frontend (Admin Panel)

## Công nghệ

- **Framework**: Next.js 14 với App Router
- **Language**: TypeScript
- **UI Library**: PrimeReact
- **Styling**: SCSS với themes (lara-light-blue, lara-dark-blue)

## Cấu trúc Thư mục

```
apps/admin/
├── app/                 # Next.js app router
│   ├── (full-page)/     # Auth pages
│   ├── (main)/          # Main dashboard
│   └── api/             # API routes
├── layout/              # Layout components
├── services/            # Data services
├── types/               # TypeScript types
└── styles/              # SCSS styles
```

## Key Features

- Dashboard với thống kê
- Quản lý sản phẩm, danh mục, người dùng
- Authentication (login, access control)
- Responsive design
