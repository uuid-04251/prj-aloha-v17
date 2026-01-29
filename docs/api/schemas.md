# Schemas API

## Zod Schemas

### Product Schema

```typescript
const ProductSchema = z.object({
    id: z.string(),
    name: z.string().min(1),
    description: z.string().optional(),
    price: z.number().positive(),
    categoryId: z.string(),
    imageUrl: z.string().url().optional(),
    createdAt: z.date(),
    updatedAt: z.date()
});
```

### Category Schema

```typescript
const CategorySchema = z.object({
    id: z.string(),
    name: z.string().min(1),
    description: z.string().optional()
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
