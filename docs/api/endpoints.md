# Endpoints API

> 📖 **Xem thêm:** [Error Handling Guide](./error-handling.md) - Hướng dẫn xử lý lỗi chuẩn giữa Backend và Frontend

## Tổng quan Response Format

Tất cả API responses đều tuân theo format chuẩn:

```typescript
interface ApiResponse<T = any> {
    success: boolean; // Trạng thái thành công
    data?: T; // Dữ liệu trả về (khi success = true)
    error?: StandardizedError; // Thông tin lỗi (khi success = false)
    meta?: {
        // Metadata bổ sung
        timestamp: string;
        requestId?: string;
        pagination?: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    };
}
```

## Error Response Examples

### Thành công

```json
{
    "success": true,
    "data": { "id": "123", "name": "Example" },
    "meta": {
        "timestamp": "2026-02-04T10:00:00.000Z",
        "requestId": "req_abc123"
    }
}
```

### Lỗi validation

```json
{
    "success": false,
    "error": {
        "code": "VALIDATION_EMAIL_INVALID",
        "message": "Please enter a valid email address",
        "details": { "field": "email" },
        "timestamp": "2026-02-04T10:00:00.000Z",
        "requestId": "req_abc124"
    }
}
```

### Lỗi authentication

```json
{
    "success": false,
    "error": {
        "code": "AUTH_INVALID_CREDENTIALS",
        "message": "Invalid email or password",
        "timestamp": "2026-02-04T10:00:00.000Z",
        "requestId": "req_abc125"
    }
}
```

## tRPC Procedures

### Products

- `getProducts`: Lấy danh sách sản phẩm
- `createProduct`: Tạo sản phẩm mới
- `updateProduct`: Cập nhật sản phẩm
- `deleteProduct`: Xóa sản phẩm

### Users

- `getUsers`: Lấy người dùng
- `createUser`: Tạo user
- `updateUser`: Cập nhật user

### Auth

- `login`: Đăng nhập
- `logout`: Đăng xuất
- `getCurrentUser`: Lấy user hiện tại

## REST Endpoints (nếu cần)

- `POST /api/upload`: Upload file
