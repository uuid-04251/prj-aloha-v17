# Product Image Upload Feature - Setup Guide

## ✅ Implementation Complete!

All code for the product image upload feature with Supabase Storage has been successfully implemented. Follow the steps below to complete the setup and start using the feature.

---

## 📦 What Was Implemented

### Backend (Node.js + Fastify + tRPC)

1. **Supabase Storage Service** (`apps/backend/src/lib/storage/supabase.service.ts`)
    - Upload/delete image files to Supabase Storage
    - File validation (size, type)
    - Automatic filename generation with UUID
    - Batch deletion support

2. **Fastify Authentication Plugin** (`apps/backend/src/lib/fastify-auth.ts`)
    - JWT authentication decorator for REST endpoints
    - Token validation and blacklist checking

3. **Image Upload REST Endpoints** (`apps/backend/src/resources/products/products.upload.ts`)
    - `POST /api/products/upload-image` - Single image upload
    - `POST /api/products/upload-images` - Multiple image upload (max 10)
    - `DELETE /api/products/delete-image` - Delete image from storage

4. **Product Service Updates** (`apps/backend/src/resources/products/products.service.ts`)
    - Automatic image cleanup when deleting products
    - Deletes both main image and additional images from Supabase

5. **Server Configuration** (`apps/backend/src/server.ts`)
    - Registered @fastify/multipart plugin for file uploads
    - Registered authentication plugin
    - Registered product upload routes

### Frontend (Next.js + PrimeReact)

1. **Image Upload Service** (`apps/admin/services/ImageUploadService.ts`)
    - Upload images with progress tracking (XHR)
    - Delete images from storage
    - Client-side file validation
    - Helper functions (formatFileSize, createPreviewUrl)

2. **ImageUpload Component** (`apps/admin/components/ImageUpload/ImageUpload.tsx`)
    - Drag-and-drop file upload with PrimeReact FileUpload
    - Image preview grid with delete buttons
    - Upload progress bar
    - Toast notifications for success/error
    - Single and multiple mode support

3. **Product Page Integration** (`apps/admin/app/(main)/pages/product/page.tsx`)
    - Main Image upload (single)
    - Additional Images upload (multiple, max 10)
    - Integrated into product create/edit dialog

### Dependencies Installed

- **Backend:**
    - `@supabase/supabase-js@^2.95.3` - Supabase client
    - `@fastify/multipart@^9.4.0` - File upload support
    - `fastify-plugin@^5.1.0` - Plugin helper
    - `uuid@^13.0.0` - Unique filename generation
    - `@types/multer@^2.0.0` - Type definitions

- **Frontend:**
    - `@supabase/supabase-js@^2.95.3` - Supabase client (for types)

---

## 🚀 Setup Instructions

### Step 1: Configure Supabase Bucket

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project (URL: https://rmbitcjsxskhwzrqogfg.supabase.co)
3. Navigate to **Storage** in the left sidebar
4. Click **Create new bucket**
5. Enter bucket name: `product-images`
6. Set bucket privacy: **Public** (for direct URL access)
7. Click **Create bucket**

### Step 2: Get Supabase API Keys

1. In Supabase Dashboard, go to **Settings** → **API**
2. Copy the following keys:
    - **Project URL**: Already in .env (`https://rmbitcjsxskhwzrqogfg.supabase.co`)
    - **anon/public key**: Copy from "Project API keys" section
    - **service_role key**: Copy from "Project API keys" section (⚠️ Keep this secret!)

### Step 3: Update Backend Environment Variables

Edit `apps/backend/.env` and fill in the missing keys:

```env
# Supabase Configuration
SUPABASE_URL=https://rmbitcjsxskhwzrqogfg.supabase.co
SUPABASE_ANON_KEY=<paste your anon key here>
SUPABASE_SERVICE_ROLE_KEY=<paste your service_role key here>
SUPABASE_STORAGE_BUCKET=product-images

# File Upload Configuration
MAX_FILE_SIZE=5242880
ALLOWED_MIME_TYPES=image/jpeg,image/png,image/webp
MAX_IMAGES_PER_PRODUCT=10
```

### Step 4: Update Frontend Environment Variables

Create or update `apps/admin/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

_Note: Adjust the URL for production deployment_

### Step 5: Restart Services

```bash
# Terminal 1 - Backend
cd apps/backend
pnpm dev

# Terminal 2 - Frontend
cd apps/admin
pnpm dev
```

---

## 🧪 Testing the Feature

### 1. Access Admin Panel

1. Open http://localhost:3000 (or your admin URL)
2. Login with admin credentials
3. Navigate to **Products** page

### 2. Create Product with Images

1. Click **New Product** button
2. Fill in product details (Name, SKU, Description)
3. **Main Image section:**
    - Drag & drop an image or click "Choose Image"
    - Wait for upload progress to complete
    - Image preview appears below
4. **Additional Images section:**
    - Drag & drop up to 10 images or click "Choose Images"
    - Multiple files can be selected at once
    - Preview grid shows all uploaded images
5. Click **Save**

### 3. Edit Product Images

1. Click the **Edit** (pencil) button on any product
2. To replace main image:
    - Click the ❌ button on existing image to delete
    - Upload new image
3. To add more images:
    - Use "Choose Images" (up to 10 total)
4. To remove an image:
    - Click the ❌ button on image preview
5. Click **Save**

### 4. Delete Product (with images)

1. Click the **Delete** (trash) button on any product
2. Confirm deletion
3. ✅ Product AND all associated images are deleted from Supabase Storage

---

## 📝 File Upload Constraints

- **Max file size**: 5MB per image
- **Allowed formats**: JPEG, PNG, WebP
- **Max images per product**: 10 (additional images only)
- **Main image**: 1 image only
- **File naming**: Automatic with timestamp and UUID (e.g., `1699999999999-uuid.jpg`)
- **Storage path**: `products/timestamp-uuid.ext`

---

## 🔍 Verification Checklist

Before testing, verify:

- [ ] Supabase bucket `product-images` created and set to **Public**
- [ ] Backend `.env` has `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Frontend `.env.local` has correct `NEXT_PUBLIC_API_URL`
- [ ] Backend server running without errors
- [ ] Frontend server running without errors
- [ ] Can access admin panel and login successfully

---

## 🎯 Usage Examples

### Upload Single Image (Frontend)

```typescript
import { ImageUploadService } from '@/services/ImageUploadService';

const url = await ImageUploadService.uploadImage(file, (progress) => {
    console.log(`Upload progress: ${progress.percentage}%`);
});
console.log('Uploaded URL:', url);
```

### Upload Multiple Images (Frontend)

```typescript
const urls = await ImageUploadService.uploadImages(files, (index, progress) => {
    console.log(`File ${index + 1}: ${progress.percentage}%`);
});
console.log('Uploaded URLs:', urls);
```

### Delete Image (Frontend)

```typescript
await ImageUploadService.deleteImage(imageUrl);
```

### Backend API Endpoints

**Upload Single Image:**

```bash
curl -X POST http://localhost:4000/api/products/upload-image \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "image=@/path/to/image.jpg"
```

**Delete Image:**

```bash
curl -X DELETE http://localhost:4000/api/products/delete-image \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"imageUrl": "https://..."}'
```

---

## 🛠️ Troubleshooting

### Backend Issues

**Error: "Supabase credentials not configured"**

- Solution: Check `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `apps/backend/.env`

**Error: "Upload failed: Bucket not found"**

- Solution: Create the `product-images` bucket in Supabase Dashboard (Step 1)

**Error: "Upload failed: Row Level Security policy violation"**

- Solution: Make sure bucket is set to **Public** or configure RLS policies

**Error: "File too large"**

- Solution: Image exceeds 5MB. Compress image or increase `MAX_FILE_SIZE` in `.env`

### Frontend Issues

**Error: "Authentication required"**

- Solution: Make sure you're logged in. Check localStorage for `authData`

**Error: "Network error during upload"**

- Solution: Check `NEXT_PUBLIC_API_URL` in `.env.local` and verify backend is running

**Upload progress stuck at 0%**

- Solution: Check browser console for errors. Verify file size and type are valid

**Images not displaying after upload**

- Solution: Check Supabase bucket is **Public**. Verify URL in browser directly.

---

## 📚 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   Admin Frontend                        │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Product Page (Next.js)                         │   │
│  │  ├── ImageUpload Component (PrimeReact)        │   │
│  │  └── ImageUploadService (API calls)            │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────┬───────────────────────────────────┘
                      │ REST API (JWT Auth)
                      ↓
┌─────────────────────────────────────────────────────────┐
│                   Backend (Fastify)                      │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Product Upload Routes (@fastify/multipart)     │   │
│  │  ├── POST /api/products/upload-image           │   │
│  │  ├── POST /api/products/upload-images          │   │
│  │  └── DELETE /api/products/delete-image         │   │
│  └─────────────────┬───────────────────────────────┘   │
│                    │                                     │
│  ┌─────────────────▼───────────────────────────────┐   │
│  │  Supabase Storage Service                      │   │
│  │  ├── uploadImage()                             │   │
│  │  ├── deleteImage()                             │   │
│  │  └── deleteImages()                            │   │
│  └─────────────────┬───────────────────────────────┘   │
└────────────────────┼───────────────────────────────────┘
                     │ Supabase Client SDK
                     ↓
┌─────────────────────────────────────────────────────────┐
│             Supabase Storage (Cloud)                     │
│  Bucket: product-images                                  │
│  └── products/                                          │
│       ├── 1699999999999-uuid1.jpg                      │
│       ├── 1699999999999-uuid2.png                      │
│       └── ...                                           │
└─────────────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│             MongoDB (Database)                           │
│  Product Model:                                          │
│  {                                                       │
│    mainImage: "https://...supabase.co/.../uuid1.jpg"   │
│    images: [                                            │
│      "https://...supabase.co/.../uuid2.jpg",          │
│      "https://...supabase.co/.../uuid3.jpg"           │
│    ]                                                    │
│  }                                                      │
└─────────────────────────────────────────────────────────┘
```

---

## 🎉 Success!

Once setup is complete, you'll be able to:

- ✅ Upload product images directly from the admin panel
- ✅ Preview images before saving
- ✅ Manage multiple images per product (1 main + up to 10 additional)
- ✅ Delete images individually
- ✅ Automatic cleanup when deleting products
- ✅ Secure uploads with JWT authentication
- ✅ Progress tracking for large uploads
- ✅ Client and server-side validation

**Need Help?** Check the troubleshooting section above or review the implementation files.

---

Generated: 2024
Project: Aloha Admin System v17
