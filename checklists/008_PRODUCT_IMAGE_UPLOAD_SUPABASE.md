# Product Image Upload with Supabase - Implementation Checklist

**Feature**: Add image upload capability for Product creation/editing using Supabase Storage  
**Status**: 🚧 In Progress  
**Priority**: High  
**Estimated Time**: 6-8 hours

---

## 📋 Overview

### Supabase Connection Details

- **URL**: https://rmbitcjsxskhwzrqogfg.supabase.co
- **Password**: RVWX40G4biA3onu5
- **Service**: Storage (for file uploads)

### Technical Stack

- **Storage**: Supabase Storage
- **Backend**: Node.js/Express with tRPC
- **Frontend**: Next.js 16 + PrimeReact
- **File Processing**: multer (optional) or direct upload
- **Image Optimization**: Sharp (optional)

---

## 🎯 Goals

1. ✅ Upload product images to Supabase Storage
2. ✅ Store image URLs in MongoDB Product model
3. ✅ Preview images before upload
4. ✅ Support multiple images (gallery)
5. ✅ Set main product image
6. ✅ Image validation (type, size, dimensions)
7. ✅ Proper error handling and user feedback

---

## Phase 1: Supabase Setup & Configuration

### 1.1 Supabase Storage Bucket Setup

- [ ] Login to Supabase dashboard (https://rmbitcjsxskhwzrqogfg.supabase.co)
- [ ] Navigate to Storage section
- [ ] Create new bucket: `product-images`
- [ ] Configure bucket settings:
    - [x] Public: Yes (for easy CDN access)
    - [x] File size limit: 5MB
    - [x] Allowed MIME types: `image/jpeg, image/png, image/webp`
- [ ] Setup storage policies (RLS):

    ```sql
    -- Allow authenticated users to upload
    CREATE POLICY "Allow authenticated uploads"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'product-images');

    -- Allow public read access
    CREATE POLICY "Allow public read access"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'product-images');

    -- Allow authenticated users to delete their uploads
    CREATE POLICY "Allow authenticated deletes"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'product-images');
    ```

- [ ] Get bucket public URL pattern
- [ ] Test bucket access with sample upload

### 1.2 Backend Environment Configuration

- [ ] Install Supabase client library:
    ```bash
    cd apps/backend
    pnpm add @supabase/supabase-js
    pnpm add -D @types/multer
    ```
- [ ] Add Supabase credentials to `.env`:

    ```env
    # Supabase Configuration
    SUPABASE_URL=https://rmbitcjsxskhwzrqogfg.supabase.co
    SUPABASE_ANON_KEY=<get-from-supabase-dashboard>
    SUPABASE_SERVICE_ROLE_KEY=<get-from-supabase-dashboard>
    SUPABASE_STORAGE_BUCKET=product-images

    # File Upload Configuration
    MAX_FILE_SIZE=5242880 # 5MB in bytes
    ALLOWED_MIME_TYPES=image/jpeg,image/png,image/webp
    MAX_IMAGES_PER_PRODUCT=10
    ```

- [ ] Update `.env.example` with Supabase variables
- [ ] Add environment validation in backend startup

---

## Phase 2: Backend Implementation

### 2.1 Supabase Service Layer

**File**: `apps/backend/src/lib/storage/supabase.service.ts`

- [ ] Create Supabase service module:

    ```typescript
    import { createClient } from '@supabase/supabase-js';

    export class SupabaseStorageService {
        private client;
        private bucketName = process.env.SUPABASE_STORAGE_BUCKET!;

        constructor() {
            this.client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
        }

        async uploadImage(file: Buffer, fileName: string, contentType: string): Promise<string>;
        async deleteImage(fileUrl: string): Promise<void>;
        async getPublicUrl(path: string): string;
        private generateFileName(originalName: string): string;
        private validateFile(file: Buffer, mimeType: string): void;
    }
    ```

- [ ] Implement file validation (size, type, dimensions)
- [ ] Implement unique filename generation (timestamp + UUID)
- [ ] Implement upload with error handling
- [ ] Implement delete with cleanup
- [ ] Add image optimization using Sharp (optional)
- [ ] Add comprehensive error logging

### 2.2 Storage Types & Interfaces

**File**: `apps/backend/src/lib/storage/storage.types.ts`

- [ ] Define storage interfaces:

    ```typescript
    export interface IUploadResult {
        url: string;
        path: string;
        fileName: string;
        size: number;
    }

    export interface IImageUploadOptions {
        maxSize?: number;
        allowedTypes?: string[];
        optimize?: boolean;
        width?: number;
        height?: number;
    }

    export interface IStorageError {
        code: string;
        message: string;
        details?: any;
    }
    ```

- [ ] Export validation constants
- [ ] Add JSDoc documentation

### 2.3 Product Upload Router/Procedures

**File**: `apps/backend/src/resources/products/products.upload.router.ts`

- [ ] Create tRPC upload procedures:

    ```typescript
    // Get presigned upload URL (client uploads directly to Supabase)
    getUploadUrl: protectedProcedure
        .input(
            z.object({
                fileName: z.string(),
                contentType: z.string()
            })
        )
        .mutation(async ({ input }) => {
            // Generate presigned URL
            // Return URL + upload fields
        });

    // Confirm upload and link to product
    confirmImageUpload: protectedProcedure
        .input(
            z.object({
                productId: z.string().optional(),
                imageUrl: z.string().url(),
                isMainImage: z.boolean().optional()
            })
        )
        .mutation(async ({ input }) => {
            // Validate uploaded file exists
            // Update product images array
        });

    // Delete product image
    deleteProductImage: protectedProcedure
        .input(
            z.object({
                productId: z.string(),
                imageUrl: z.string().url()
            })
        )
        .mutation(async ({ input }) => {
            // Delete from Supabase
            // Update product document
        });
    ```

**OR Alternative**: Direct upload endpoint

**File**: `apps/backend/src/resources/products/products.upload.ts`

- [ ] Create Express endpoint for direct upload:

    ```typescript
    import multer from 'multer';
    import { SupabaseStorageService } from '../../lib/storage/supabase.service';

    const upload = multer({
        storage: multer.memoryStorage(),
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
        fileFilter: (req, file, cb) => {
            // Validate MIME type
        }
    });

    router.post('/products/upload-image', authenticateToken, upload.single('image'), async (req, res) => {
        // Upload to Supabase
        // Return image URL
    });
    ```

- [ ] Add authentication middleware
- [ ] Add file validation middleware
- [ ] Add rate limiting (prevent abuse)
- [ ] Add comprehensive error handling
- [ ] Add upload progress support (if needed)

### 2.4 Product Schemas Update

**File**: `apps/backend/src/resources/products/products.schemas.ts`

- [ ] Update schemas to support image operations:

    ```typescript
    export const uploadImageSchema = z.object({
        fileName: z.string().min(1),
        contentType: z.enum(['image/jpeg', 'image/png', 'image/webp']),
        fileSize: z.number().max(5242880) // 5MB
    });

    export const confirmImageUploadSchema = z.object({
        productId: z.string().optional(),
        imageUrl: z.string().url(),
        isMainImage: z.boolean().optional().default(false)
    });

    export const deleteImageSchema = z.object({
        productId: z.string(),
        imageUrl: z.string().url()
    });
    ```

- [ ] Update createProductSchema to validate image URLs
- [ ] Update updateProductSchema for image modifications
- [ ] Add image array length validation

### 2.5 Product Service Updates

**File**: `apps/backend/src/resources/products/products.service.ts`

- [ ] Add image management methods:

    ```typescript
    static async addProductImage(
      productId: string,
      imageUrl: string,
      isMainImage: boolean
    ): Promise<IProduct>

    static async removeProductImage(
      productId: string,
      imageUrl: string
    ): Promise<IProduct>

    static async setMainImage(
      productId: string,
      imageUrl: string
    ): Promise<IProduct>

    static async cleanupOrphanedImages(
      productId: string,
      validUrls: string[]
    ): Promise<void>
    ```

- [ ] Update createProduct to handle image uploads
- [ ] Update updateProduct to manage image changes
- [ ] Update deleteProduct to cleanup images from storage
- [ ] Add transaction support for data consistency
- [ ] Add rollback logic for failed operations

### 2.6 Middleware & Utilities

**File**: `apps/backend/src/lib/middleware/upload.middleware.ts`

- [ ] Create file validation middleware
- [ ] Create file size limiting middleware
- [ ] Create MIME type validation
- [ ] Add image dimension validation (using Sharp)
- [ ] Add malicious file detection (basic)

**File**: `apps/backend/src/lib/helpers/image.helpers.ts`

- [ ] Create image helper utilities:
    ```typescript
    export function generateImageFileName(originalName: string): string;
    export function extractPathFromUrl(url: string): string;
    export function isValidImageUrl(url: string): boolean;
    export async function getImageMetadata(buffer: Buffer): Promise<ImageMetadata>;
    export function sanitizeFileName(fileName: string): string;
    ```

### 2.7 Error Handling

**File**: `apps/backend/src/lib/errors/storage.errors.ts`

- [ ] Add storage-specific error codes:
    ```typescript
    STORAGE_UPLOAD_FAILED;
    STORAGE_DELETE_FAILED;
    STORAGE_INVALID_FILE_TYPE;
    STORAGE_FILE_TOO_LARGE;
    STORAGE_QUOTA_EXCEEDED;
    STORAGE_FILE_NOT_FOUND;
    ```
- [ ] Create error factory functions
- [ ] Add detailed error messages

### 2.8 Testing

**File**: `apps/backend/tests/integration/products/products.upload.test.ts`

- [ ] Test file upload flow
- [ ] Test file validation (size, type, dimensions)
- [ ] Test image deletion
- [ ] Test error scenarios:
    - [ ] Invalid file type
    - [ ] File too large
    - [ ] Network errors
    - [ ] Storage quota exceeded
    - [ ] Orphaned file cleanup
- [ ] Test concurrent uploads
- [ ] Test authentication/authorization

---

## Phase 3: Frontend Implementation

### 3.1 Environment Configuration

**File**: `apps/admin/.env.local`

- [ ] Add Supabase config:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=https://rmbitcjsxskhwzrqogfg.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
    NEXT_PUBLIC_MAX_FILE_SIZE=5242880
    NEXT_PUBLIC_ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/webp
    ```

### 3.2 Supabase Client Setup

**File**: `apps/admin/lib/supabase/client.ts`

- [ ] Install Supabase client:
    ```bash
    cd apps/admin
    pnpm add @supabase/supabase-js
    ```
- [ ] Create Supabase client instance:

    ```typescript
    import { createClient } from '@supabase/supabase-js';

    export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    ```

### 3.3 Image Upload Service

**File**: `apps/admin/services/ImageUploadService.ts`

- [ ] Create upload service:
    ```typescript
    export class ImageUploadService {
        static async uploadImage(file: File, onProgress?: (progress: number) => void): Promise<string>;

        static async deleteImage(imageUrl: string): Promise<void>;

        static validateFile(file: File): { valid: boolean; error?: string };

        static async compressImage(file: File): Promise<File>;

        static createPreviewUrl(file: File): string;

        static revokePreviewUrl(url: string): void;
    }
    ```
- [ ] Implement file validation on client side
- [ ] Implement upload with progress tracking
- [ ] Implement retry logic for failed uploads
- [ ] Add image compression (optional, using browser-image-compression)
- [ ] Add comprehensive error handling

### 3.4 Image Upload Component

**File**: `apps/admin/components/ImageUpload/ImageUpload.tsx`

- [ ] Create reusable upload component:

    ```tsx
    interface ImageUploadProps {
        value?: string | string[];
        onChange: (urls: string | string[]) => void;
        multiple?: boolean;
        maxImages?: number;
        showPreview?: boolean;
        aspectRatio?: string;
        maxSize?: number;
        allowedTypes?: string[];
    }

    export const ImageUpload: React.FC<ImageUploadProps> = (props) => {
        // Drag & drop support
        // File input with validation
        // Preview with lightbox
        // Progress indicator
        // Error display
        // Delete confirmation
    };
    ```

- [ ] Implement drag & drop zone (using FileUpload from PrimeReact)
- [ ] Add image preview with lightbox (using PrimeReact Image)
- [ ] Add upload progress indicator (using ProgressBar)
- [ ] Add file validation feedback
- [ ] Add image reordering (drag to reorder gallery)
- [ ] Add "Set as Main Image" functionality
- [ ] Style with PrimeReact theme

**File**: `apps/admin/components/ImageUpload/ImageUpload.module.scss`

- [ ] Create component styles matching PrimeReact theme
- [ ] Add responsive design
- [ ] Add hover effects and animations

**File**: `apps/admin/components/ImageUpload/ImagePreview.tsx`

- [ ] Create image preview sub-component:
    ```tsx
    interface ImagePreviewProps {
        src: string;
        alt: string;
        isMain?: boolean;
        onDelete?: () => void;
        onSetMain?: () => void;
        onView?: () => void;
    }
    ```
- [ ] Add thumbnail with actions overlay
- [ ] Add loading skeleton
- [ ] Add error state

### 3.5 Product Form Integration

**File**: `apps/admin/app/(main)/pages/product/page.tsx`

- [ ] Update Product interface to include images properly
- [ ] Integrate ImageUpload component in product dialog:

    ```tsx
    <div className="field">
      <label htmlFor="mainImage">Main Image</label>
      <ImageUpload
        value={product.mainImage}
        onChange={(url) => onInputChange(url, 'mainImage')}
        maxImages={1}
        showPreview={true}
      />
    </div>

    <div className="field">
      <label htmlFor="images">Product Gallery</label>
      <ImageUpload
        value={product.images}
        onChange={(urls) => onInputChange(urls, 'images')}
        multiple={true}
        maxImages={10}
        showPreview={true}
      />
    </div>
    ```

- [ ] Update saveProduct to handle image URLs
- [ ] Add image cleanup on product delete
- [ ] Add loading states during upload
- [ ] Add error handling and user feedback
- [ ] Update product table to display main image thumbnail

### 3.6 tRPC Integration

**File**: `apps/admin/services/ProductService.tsx`

- [ ] Add image-related tRPC calls:
    ```typescript
    // If using presigned URL approach
    const getUploadUrl = trpc.products.getUploadUrl.useMutation();
    const confirmUpload = trpc.products.confirmImageUpload.useMutation();
    const deleteImage = trpc.products.deleteProductImage.useMutation();
    ```
- [ ] Update createProduct and updateProduct calls
- [ ] Add optimistic updates for better UX
- [ ] Handle upload errors gracefully

### 3.7 Types & Interfaces

**File**: `apps/admin/types/product.d.ts`

- [ ] Update Product interface:

    ```typescript
    export interface Product {
        id: string;
        name: string;
        description: string;
        sku: string;
        mainImage?: string;
        images: string[];
        status: 'active' | 'inactive' | 'out_of_stock';
        createdAt: string;
        updatedAt: string;
    }

    export interface ImageUploadProgress {
        fileName: string;
        progress: number;
        status: 'pending' | 'uploading' | 'success' | 'error';
        error?: string;
    }
    ```

### 3.8 Utilities

**File**: `apps/admin/utils/imageUtils.ts`

- [ ] Create helper functions:
    ```typescript
    export function formatFileSize(bytes: number): string;
    export function isValidImageType(file: File): boolean;
    export function isValidImageSize(file: File, maxSize: number): boolean;
    export function getImageDimensions(file: File): Promise<{ width: number; height: number }>;
    export function generateThumbnailUrl(url: string, size: number): string;
    ```

---

## Phase 4: Testing & Quality Assurance

### 4.1 Backend Testing

- [ ] Unit tests for SupabaseStorageService
- [ ] Unit tests for image helpers
- [ ] Integration tests for upload flow
- [ ] Test file validation edge cases
- [ ] Test error scenarios (network, storage errors)
- [ ] Test concurrent uploads
- [ ] Test cleanup on failures
- [ ] Performance testing (upload speed, large files)

### 4.2 Frontend Testing

**File**: `apps/admin/__tests__/components/ImageUpload.test.tsx`

- [ ] Test component rendering
- [ ] Test file selection
- [ ] Test drag & drop
- [ ] Test file validation
- [ ] Test upload progress
- [ ] Test error display
- [ ] Test image preview
- [ ] Test image deletion
- [ ] Test multiple image handling

**File**: `apps/admin/__tests__/services/ImageUploadService.test.ts`

- [ ] Test upload service methods
- [ ] Test validation logic
- [ ] Test error handling
- [ ] Mock Supabase client

### 4.3 E2E Testing

- [ ] Test complete product creation with images
- [ ] Test product update with image changes
- [ ] Test product deletion with image cleanup
- [ ] Test image gallery reordering
- [ ] Test main image selection
- [ ] Test error recovery scenarios
- [ ] Test on different browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile devices

### 4.4 Manual Testing Checklist

- [ ] Upload valid image (JPEG, PNG, WebP)
- [ ] Try uploading invalid file type (PDF, etc.)
- [ ] Try uploading file > 5MB
- [ ] Test with slow network (throttle)
- [ ] Test upload cancellation
- [ ] Test multiple concurrent uploads
- [ ] Test image preview/lightbox
- [ ] Test image deletion
- [ ] Test setting main image
- [ ] Test product with no images
- [ ] Test product with max images (10)
- [ ] Verify images persist after page refresh
- [ ] Verify images display in product list
- [ ] Test image cleanup on product delete

---

## Phase 5: Security & Optimization

### 5.1 Security Measures

- [ ] Validate file types on both client and server
- [ ] Implement file size limits
- [ ] Add rate limiting for uploads
- [ ] Sanitize file names
- [ ] Use presigned URLs with expiry
- [ ] Implement virus scanning (optional, using ClamAV)
- [ ] Add CORS configuration for Supabase bucket
- [ ] Implement CSP headers for image sources
- [ ] Add authentication check on all upload endpoints
- [ ] Implement RBAC (only admins can upload)

### 5.2 Performance Optimization

- [ ] Implement image lazy loading in product list
- [ ] Use progressive image loading (blur-up)
- [ ] Add image caching headers
- [ ] Implement CDN (Supabase CDN)
- [ ] Optimize image compression
- [ ] Add thumbnail generation
- [ ] Implement image format negotiation (WebP fallback)
- [ ] Add loading skeletons
- [ ] Optimize bundle size (code splitting)

### 5.3 Storage Management

- [ ] Implement orphaned file cleanup job
- [ ] Add storage quota monitoring
- [ ] Implement image retention policy
- [ ] Add admin dashboard for storage stats
- [ ] Setup automated backups
- [ ] Monitor storage costs

---

## Phase 6: Documentation & Deployment

### 6.1 Documentation

- [ ] Update API documentation with upload endpoints
- [ ] Document Supabase bucket configuration
- [ ] Create image upload guide for users
- [ ] Document environment variables
- [ ] Add JSDoc comments to all functions
- [ ] Create troubleshooting guide
- [ ] Update README with setup instructions

### 6.2 Code Quality

- [ ] Run ESLint and fix all warnings
- [ ] Format code with Prettier
- [ ] Run TypeScript type checks
- [ ] Review and refactor duplicate code
- [ ] Add comprehensive error messages
- [ ] Add logging for debugging

### 6.3 Deployment Preparation

- [ ] Verify all environment variables in production
- [ ] Test in staging environment
- [ ] Create database migration if needed
- [ ] Setup Supabase bucket in production
- [ ] Configure CDN and caching
- [ ] Setup monitoring and alerts
- [ ] Create rollback plan

### 6.4 Release

- [ ] Create feature branch: `feature/product-image-upload`
- [ ] Create pull request with detailed description
- [ ] Code review with team
- [ ] Merge to development
- [ ] Deploy to staging
- [ ] QA testing
- [ ] Deploy to production
- [ ] Monitor for errors
- [ ] Announce feature to users

---

## 📊 Success Metrics

- [ ] Upload success rate > 99%
- [ ] Average upload time < 3 seconds for 2MB image
- [ ] Zero data loss incidents
- [ ] User satisfaction (feedback)
- [ ] Error rate < 1%
- [ ] Storage costs within budget

---

## 🐛 Known Issues & Considerations

### Current Limitations

- Maximum 10 images per product
- 5MB file size limit
- Only supports JPEG, PNG, WebP
- No video support (future enhancement)

### Future Enhancements

- [ ] Add image cropping tool
- [ ] Add image filters/effects
- [ ] Support bulk image upload
- [ ] Add AI-powered image tagging
- [ ] Add image search functionality
- [ ] Support 360° product views
- [ ] Add video thumbnail support
- [ ] Implement image versioning

---

## 📝 Notes

- Always test uploads in Supabase dashboard first
- Keep Supabase credentials secure (use env variables)
- Monitor storage usage regularly
- Implement proper cleanup to avoid orphaned files
- Consider implementing image optimization pipeline
- Use TypeScript for better type safety
- Follow project conventions and coding standards
- Add comprehensive error handling
- Write tests for critical paths
- Document all configuration changes

---

## 🔗 References

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/storage)
- [PrimeReact FileUpload](https://primereact.org/fileupload/)
- [PrimeReact Image](https://primereact.org/image/)
- [Next.js Image Optimization](https://nextjs.org/docs/app/api-reference/components/image)
- [Sharp Image Processing](https://sharp.pixelplumbing.com/)

---

**Last Updated**: 2026-02-11  
**Status**: ✅ Ready for Implementation  
**Assigned To**: Development Team
