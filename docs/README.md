# 📚 Aloha API Documentation

Chào mừng đến với tài liệu API của Aloha! Tài liệu này giúp backend và frontend developers hiểu và sử dụng APIs một cách hiệu quả.

## 📁 Cấu trúc tài liệu

```
docs/
├── api/
│   ├── endpoints.md          # Danh sách endpoints và examples
│   ├── error-handling.md     # 🔴 Hướng dẫn xử lý lỗi chuẩn
│   └── schemas.md           # Định nghĩa schemas và types
├── architecture/
│   ├── backend.md
│   └── frontend.md
├── auth/
│   └── authentication.md
├── business-logic/
│   ├── admin.md
│   └── user-management.md
├── database/
│   ├── models.md
│   └── schema.md
└── deployment/
    ├── production.md
    └── setup.md
```

## 🚀 Bắt đầu nhanh

### 1. Shared Package Setup

Cài đặt package shared cho error handling:

```bash
pnpm add @aloha/shared
```

Package này cung cấp:

- Error codes và messages chuẩn
- Type-safe constants
- Consistent error handling across FE/BE

### 2. Xử lý lỗi (Quan trọng!)

Đọc **[Error Handling Guide](./api/error-handling.md)** trước khi làm việc với APIs:

- Cách xử lý responses
- Danh sách error codes
- Best practices cho FE/BE

### 3. Endpoints

Xem **[API Endpoints](./api/endpoints.md)** để:

- Danh sách tất cả procedures
- Response format chuẩn
- Error examples

### 4. Data Schemas

Xem **[Schemas](./api/schemas.md)** để:

- Input/output types
- Validation rules
- Type definitions

## 🔧 Development Guidelines

### Backend Developers

- Luôn sử dụng standardized errors (không dùng `throw new Error()`)
- Tham khảo error handling guide khi tạo APIs mới
- Update documentation khi thay đổi APIs

### Frontend Developers

- Luôn check `response.success` trước khi dùng data
- Handle tất cả error codes appropriately
- Sử dụng error messages từ error guide

## 📞 Support

- **Issues với APIs**: Tạo issue trên GitHub
- **Câu hỏi về error handling**: Tham khảo error guide
- **Cần thêm documentation**: Update files trong `docs/`

---

**Last Updated:** February 4, 2026</content>
<parameter name="filePath">/Users/MAC/Desktop/lamdd/aloha/prj-aloha-v17/docs/README.md
