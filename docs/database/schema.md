# Schema Database

## MongoDB Collections

### Products Collection

```json
{
  "_id": ObjectId,
  "name": String,
  "description": String,
  "price": Number,
  "categoryId": ObjectId,
  "imageUrl": String,
  "createdAt": Date,
  "updatedAt": Date
}
```

### Categories Collection

```json
{
  "_id": ObjectId,
  "name": String,
  "description": String,
  "createdAt": Date
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

- Products: categoryId, name
- Users: email (unique)
