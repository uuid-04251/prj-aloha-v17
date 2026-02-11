# Product Image Upload - Quick Start Guide

**⚡ Fast track implementation guide for experienced developers**

---

## 🚀 Setup (15 minutes)

### 1. Supabase Configuration

```bash
# 1. Login to Supabase dashboard
https://rmbitcjsxskhwzrqogfg.supabase.co
Password: RVWX40G4biA3onu5

# 2. Create Storage Bucket
- Name: "product-images"
- Public: Yes
- File size limit: 5MB
- Allowed MIME: image/jpeg, image/png, image/webp

# 3. Get API Keys from Settings > API
- Copy Anon Key
- Copy Service Role Key
```

### 2. Backend Setup

```bash
cd apps/backend
pnpm add @supabase/supabase-js
```

**Add to `.env`:**

```env
SUPABASE_URL=https://rmbitcjsxskhwzrqogfg.supabase.co
SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
SUPABASE_STORAGE_BUCKET=product-images
MAX_FILE_SIZE=5242880
```

### 3. Frontend Setup

```bash
cd apps/admin
pnpm add @supabase/supabase-js
```

**Add to `.env.local`:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://rmbitcjsxskhwzrqogfg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
NEXT_PUBLIC_MAX_FILE_SIZE=5242880
```

---

## 💻 Implementation Order

### Step 1: Backend Storage Service (30 min)

**File**: `apps/backend/src/lib/storage/supabase.service.ts`

```typescript
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

export class SupabaseStorageService {
    private client: SupabaseClient;
    private bucketName = process.env.SUPABASE_STORAGE_BUCKET!;

    constructor() {
        this.client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    }

    async uploadImage(file: Buffer, originalName: string, contentType: string): Promise<string> {
        const fileName = this.generateFileName(originalName);
        const filePath = `products/${fileName}`;

        const { data, error } = await this.client.storage.from(this.bucketName).upload(filePath, file, {
            contentType,
            upsert: false
        });

        if (error) throw new Error(`Upload failed: ${error.message}`);

        const { data: urlData } = this.client.storage.from(this.bucketName).getPublicUrl(filePath);

        return urlData.publicUrl;
    }

    async deleteImage(imageUrl: string): Promise<void> {
        const path = this.extractPathFromUrl(imageUrl);

        const { error } = await this.client.storage.from(this.bucketName).remove([path]);

        if (error) throw new Error(`Delete failed: ${error.message}`);
    }

    private generateFileName(originalName: string): string {
        const ext = originalName.split('.').pop();
        return `${Date.now()}-${uuidv4()}.${ext}`;
    }

    private extractPathFromUrl(url: string): string {
        const urlObj = new URL(url);
        const parts = urlObj.pathname.split(`/${this.bucketName}/`);
        return parts[1] || '';
    }
}

export const storageService = new SupabaseStorageService();
```

### Step 2: Upload Router/Endpoint (45 min)

**File**: `apps/backend/src/resources/products/products.upload.ts`

```typescript
import { Router } from 'express';
import multer from 'multer';
import { storageService } from '../../lib/storage/supabase.service';
import { authenticateToken } from '../../lib/middleware/auth.middleware';

const router = Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880')
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, WebP allowed.'));
        }
    }
});

router.post('/products/upload-image', authenticateToken, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file provided' });
        }

        const imageUrl = await storageService.uploadImage(req.file.buffer, req.file.originalname, req.file.mimetype);

        res.json({
            success: true,
            url: imageUrl,
            fileName: req.file.originalname,
            size: req.file.size
        });
    } catch (error: any) {
        console.error('Upload error:', error);
        res.status(500).json({
            error: 'Upload failed',
            message: error.message
        });
    }
});

router.delete('/products/delete-image', authenticateToken, async (req, res) => {
    try {
        const { imageUrl } = req.body;

        if (!imageUrl) {
            return res.status(400).json({ error: 'Image URL required' });
        }

        await storageService.deleteImage(imageUrl);

        res.json({ success: true });
    } catch (error: any) {
        console.error('Delete error:', error);
        res.status(500).json({
            error: 'Delete failed',
            message: error.message
        });
    }
});

export default router;
```

**Register router in `apps/backend/src/server.ts`:**

```typescript
import uploadRouter from './resources/products/products.upload';

app.use('/api', uploadRouter);
```

### Step 3: Product Service Update (20 min)

**File**: `apps/backend/src/resources/products/products.service.ts`

Add cleanup method:

```typescript
import { storageService } from '../../lib/storage/supabase.service';

// Add to ProductService class
static async deleteProduct(id: string): Promise<void> {
    const product = await this.getProductById(id);

    // Delete all images from storage
    const imagesToDelete = [
        ...(product.mainImage ? [product.mainImage] : []),
        ...product.images,
    ];

    for (const imageUrl of imagesToDelete) {
        try {
            await storageService.deleteImage(imageUrl);
        } catch (error) {
            console.error(`Failed to delete image: ${imageUrl}`, error);
            // Continue with product deletion even if image delete fails
        }
    }

    await Product.findByIdAndDelete(id);
}
```

### Step 4: Frontend Upload Service (30 min)

**File**: `apps/admin/services/ImageUploadService.ts`

```typescript
import { AuthService } from './AuthService';

export class ImageUploadService {
    private static readonly API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    private static readonly MAX_FILE_SIZE = parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '5242880');

    static async uploadImage(file: File, onProgress?: (progress: number) => void): Promise<string> {
        // Validate file
        const validation = this.validateFile(file);
        if (!validation.valid) {
            throw new Error(validation.error);
        }

        const formData = new FormData();
        formData.append('image', file);

        const token = AuthService.getToken();

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable && onProgress) {
                    const progress = (e.loaded / e.total) * 100;
                    onProgress(Math.round(progress));
                }
            });

            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    resolve(response.url);
                } else {
                    const error = JSON.parse(xhr.responseText);
                    reject(new Error(error.message || 'Upload failed'));
                }
            });

            xhr.addEventListener('error', () => {
                reject(new Error('Network error during upload'));
            });

            xhr.open('POST', `${this.API_URL}/api/products/upload-image`);
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            xhr.send(formData);
        });
    }

    static async deleteImage(imageUrl: string): Promise<void> {
        const token = AuthService.getToken();

        const response = await fetch(`${this.API_URL}/api/products/delete-image`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ imageUrl })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Delete failed');
        }
    }

    static validateFile(file: File): { valid: boolean; error?: string } {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

        if (!allowedTypes.includes(file.type)) {
            return {
                valid: false,
                error: 'Invalid file type. Only JPEG, PNG, WebP allowed.'
            };
        }

        if (file.size > this.MAX_FILE_SIZE) {
            return {
                valid: false,
                error: `File too large. Maximum size is ${this.formatFileSize(this.MAX_FILE_SIZE)}`
            };
        }

        return { valid: true };
    }

    static formatFileSize(bytes: number): string {
        const mb = bytes / (1024 * 1024);
        return `${mb.toFixed(2)}MB`;
    }

    static createPreviewUrl(file: File): string {
        return URL.createObjectURL(file);
    }

    static revokePreviewUrl(url: string): void {
        URL.revokeObjectURL(url);
    }
}
```

### Step 5: Frontend Upload Component (60 min)

**File**: `apps/admin/components/ImageUpload/ImageUpload.tsx`

```tsx
'use client';
import React, { useState, useRef } from 'react';
import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';
import { Toast } from 'primereact/toast';
import { ImageUploadService } from '../../services/ImageUploadService';

interface ImageUploadProps {
    value?: string | string[];
    onChange: (urls: string | string[]) => void;
    multiple?: boolean;
    maxImages?: number;
    disabled?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, multiple = false, maxImages = 10, disabled = false }) => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const toast = useRef<Toast>(null);
    const fileUploadRef = useRef<FileUpload>(null);

    const images = Array.isArray(value) ? value : value ? [value] : [];

    const handleUpload = async (event: FileUploadHandlerEvent) => {
        setUploading(true);
        setProgress(0);

        try {
            const files = Array.isArray(event.files) ? event.files : [event.files];
            const uploadPromises = files.map((file) => ImageUploadService.uploadImage(file, (p) => setProgress(p)));

            const uploadedUrls = await Promise.all(uploadPromises);

            const newUrls = multiple ? [...images, ...uploadedUrls].slice(0, maxImages) : uploadedUrls[0];

            onChange(newUrls);

            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Image uploaded successfully',
                life: 3000
            });

            fileUploadRef.current?.clear();
        } catch (error: any) {
            console.error('Upload error:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error.message || 'Upload failed',
                life: 3000
            });
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    const handleDelete = async (imageUrl: string) => {
        try {
            await ImageUploadService.deleteImage(imageUrl);

            const newUrls = multiple ? images.filter((url) => url !== imageUrl) : '';

            onChange(newUrls);

            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Image deleted',
                life: 3000
            });
        } catch (error: any) {
            console.error('Delete error:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error.message || 'Delete failed',
                life: 3000
            });
        }
    };

    return (
        <div className="image-upload-container">
            <Toast ref={toast} />

            {images.length > 0 && (
                <div className="image-preview-grid mb-3">
                    {images.map((url, index) => (
                        <div key={index} className="image-preview-item">
                            <Image src={url} alt={`Product image ${index + 1}`} width="150" height="150" preview />
                            <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-sm delete-btn" onClick={() => handleDelete(url)} disabled={disabled} />
                        </div>
                    ))}
                </div>
            )}

            {(!multiple || images.length < maxImages) && (
                <>
                    <FileUpload
                        ref={fileUploadRef}
                        mode="basic"
                        name="image"
                        accept="image/jpeg,image/png,image/webp"
                        maxFileSize={5242880}
                        customUpload
                        uploadHandler={handleUpload}
                        auto={false}
                        chooseLabel="Choose Image"
                        disabled={disabled || uploading}
                        multiple={multiple}
                    />

                    {uploading && <ProgressBar value={progress} className="mt-3" />}
                </>
            )}

            <small className="text-muted d-block mt-2">
                Allowed: JPEG, PNG, WebP. Max size: 5MB
                {multiple && ` (Max ${maxImages} images)`}
            </small>
        </div>
    );
};
```

**Add styles** in global CSS or component CSS:

```css
.image-preview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
}

.image-preview-item {
    position: relative;
}

.image-preview-item .delete-btn {
    position: absolute;
    top: 5px;
    right: 5px;
}

.image-upload-container {
    width: 100%;
}
```

### Step 6: Integrate in Product Form (15 min)

**File**: `apps/admin/app/(main)/pages/product/page.tsx`

```tsx
import { ImageUpload } from '../../../../components/ImageUpload/ImageUpload';

// In the product dialog JSX:
<div className="field">
    <label htmlFor="mainImage">Main Image</label>
    <ImageUpload
        value={product.mainImage}
        onChange={(url) => onInputChange(url as string, 'mainImage')}
        multiple={false}
        disabled={false}
    />
</div>

<div className="field">
    <label htmlFor="images">Product Gallery</label>
    <ImageUpload
        value={product.images}
        onChange={(urls) => onInputChange(urls, 'images')}
        multiple={true}
        maxImages={10}
        disabled={false}
    />
</div>
```

---

## ✅ Testing Checklist

1. **Upload Image**
    - [ ] Select valid image file
    - [ ] See upload progress
    - [ ] Image appears in preview
    - [ ] Image URL saved to product

2. **Delete Image**
    - [ ] Click delete button
    - [ ] Image removed from preview
    - [ ] Image deleted from Supabase

3. **Validation**
    - [ ] Try upload > 5MB (should fail)
    - [ ] Try upload PDF (should fail)
    - [ ] Try upload 11th image when max is 10 (should prevent)

4. **Product Operations**
    - [ ] Create product with images
    - [ ] Update product images
    - [ ] Delete product (images should be cleaned up)

---

## 🐛 Common Issues

**Issue**: Upload fails with 401 Unauthorized  
**Fix**: Check `Authorization` header includes Bearer token

**Issue**: Images not displaying  
**Fix**: Verify Supabase bucket is public and RLS policies are correct

**Issue**: CORS error  
**Fix**: Add your frontend domain to Supabase allowed origins

**Issue**: File too large error  
**Fix**: Check both frontend MAX_FILE_SIZE and backend multer limits match

---

## 📚 Quick Reference

### Backend Endpoints

```
POST /api/products/upload-image
DELETE /api/products/delete-image
```

### Environment Variables

```env
# Backend
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_STORAGE_BUCKET
MAX_FILE_SIZE

# Frontend
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_MAX_FILE_SIZE
```

### File Constraints

- Max size: 5MB
- Types: JPEG, PNG, WebP
- Max images per product: 10

---

**Total Implementation Time**: ~3-4 hours  
**Difficulty**: Medium  
**Last Updated**: 2026-02-11
