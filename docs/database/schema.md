# Schema Database

## MongoDB Collections

### Products Collection

```json
{
  "_id": ObjectId,
  "name": String,
  "description": String,
  "sku": String,
  "mainImage": String,
  "images": [String],
  "status": String,
  "createdAt": Date,
  "updatedAt": Date
}
```

### Users Collection

```json
{
  "_id": ObjectId,
  "email": String,
  "name": String,
  "password": String (hashed),
  "role": String (enum: admin, user),
  "createdAt": Date
}
```

## Indexes

- Products: sku (unique), status, name/description (text)
- Users: email (unique)
