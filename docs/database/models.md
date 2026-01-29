# Models Database

## Product Model

```typescript
interface Product {
    _id: ObjectId;
    name: string;
    description?: string;
    price: number;
    categoryId: ObjectId;
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}
```

## Category Model

```typescript
interface Category {
    _id: ObjectId;
    name: string;
    description?: string;
    createdAt: Date;
}
```

## User Model

```typescript
interface User {
    _id: ObjectId;
    email: string;
    name: string;
    password: string; // hashed
    role: 'admin' | 'user';
    createdAt: Date;
}
```

## Relationships

- Product belongs to Category (categoryId)
- User has role-based access
