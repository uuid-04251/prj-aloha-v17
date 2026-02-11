# Models Database

## Product Model

```typescript
interface Product {
    _id: ObjectId;
    name: string;
    description: string;
    sku: string;
    mainImage?: string;
    images: string[];
    status: 'active' | 'inactive' | 'out_of_stock';
    createdAt: Date;
    updatedAt: Date;
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

- User has role-based access
