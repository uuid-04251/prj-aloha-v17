# Backend

## Công nghệ Dự kiến

- **Server**: Fastify
- **API**: tRPC (type-safe RPC)
- **Validation**: Zod schemas
- **Database**: MongoDB với Mongoose
- **Authentication**: JWT hoặc tương tự

## Cấu trúc Dự kiến

```
apps/backend/
├── src/
│   ├── routes/          # tRPC routes
│   ├── schemas/         # Zod schemas
│   ├── models/          # MongoDB models
│   ├── services/        # Business logic
│   └── utils/           # Utilities
├── package.json
└── tsconfig.json
```

## API Design

- Sử dụng tRPC để type-safe giữa frontend và backend
- Zod để validate input/output
- MongoDB cho data persistence
