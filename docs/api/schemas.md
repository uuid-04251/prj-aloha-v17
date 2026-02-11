# Schemas API

## Zod Schemas

### Product Schema

```typescript
const ProductSchema = z.object({
    id: z.string(),
    name: z.string().min(3),
    description: z.string().min(10),
    sku: z.string().min(3).max(50),
    mainImage: z.string().url().optional(),
    images: z.array(z.string().url()),
    status: z.enum(['active', 'inactive', 'out_of_stock']),
    createdAt: z.date(),
    updatedAt: z.date()
});
```

### User Schema

```typescript
const UserSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string().min(1),
    role: z.enum(['admin', 'user']),
    createdAt: z.date()
});
```

### Auth Schemas

```typescript
const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});
```
