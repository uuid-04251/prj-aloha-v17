# Tổng quan Kiến trúc

## Kiến trúc Tổng thể

Dự án Aloha sử dụng kiến trúc full-stack:

- **Frontend (Admin)**: Next.js với TypeScript, PrimeReact UI
- **Backend**: Fastify server với tRPC, Zod validation, MongoDB

## Luồng Dữ liệu

1. Client gửi request qua tRPC
2. Backend validate với Zod
3. Xử lý logic và truy vấn MongoDB
4. Trả về response

## Components Chính

- Admin Panel: Dashboard, quản lý sản phẩm, danh mục, người dùng
- API Layer: tRPC procedures
- Database: MongoDB collections
