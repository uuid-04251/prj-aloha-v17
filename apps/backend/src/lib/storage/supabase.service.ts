import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../util/logger';

/**
 * Supabase Storage Service for handling file uploads/deletions
 * Manages product images in Supabase Storage bucket
 */
export class SupabaseStorageService {
    private client: SupabaseClient;
    private bucketName: string;
    private maxFileSize: number;
    private allowedMimeTypes: string[];

    constructor() {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Supabase credentials not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env file');
        }

        // @ts-ignore - Supabase SDK has complex types that can cause TS issues
        this.client = createClient(supabaseUrl, supabaseKey);
        this.bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'product-images';
        this.maxFileSize = parseInt(process.env.MAX_FILE_SIZE || '5242880'); // 5MB default
        this.allowedMimeTypes = (process.env.ALLOWED_MIME_TYPES || 'image/jpeg,image/png,image/webp').split(',');

        logger.info(`SupabaseStorageService initialized: bucket=${this.bucketName}, maxSize=${this.maxFileSize}`);
    }

    /**
     * Upload an image file to Supabase Storage
     * @param file - File buffer
     * @param originalName - Original filename
     * @param contentType - MIME type
     * @returns Public URL of uploaded file
     */
    async uploadImage(file: Buffer, originalName: string, contentType: string): Promise<string> {
        try {
            // Validate file
            this.validateFile(file, contentType);

            // Generate unique filename
            const fileName = this.generateFileName(originalName);
            const filePath = `products/${fileName}`;

            logger.info(`Uploading image: ${filePath} (${contentType}, ${file.length} bytes)`);

            // Upload to Supabase
            const { error } = await this.client.storage.from(this.bucketName).upload(filePath, file, {
                contentType,
                upsert: false,
                cacheControl: '3600' // Cache for 1 hour
            });

            if (error) {
                logger.error(`Upload failed: ${error.message}`);
                throw new Error(`Upload failed: ${error.message}`);
            }

            // Get public URL
            const { data: urlData } = this.client.storage.from(this.bucketName).getPublicUrl(filePath);

            const publicUrl = urlData.publicUrl;
            logger.info(`Image uploaded successfully: ${publicUrl}`);

            return publicUrl;
        } catch (error: any) {
            logger.error(`Error in uploadImage: ${error.message}`, error);
            throw error;
        }
    }

    /**
     * Delete an image from Supabase Storage
     * @param imageUrl - Full public URL of the image
     */
    async deleteImage(imageUrl: string): Promise<void> {
        try {
            const path = this.extractPathFromUrl(imageUrl);

            if (!path) {
                logger.warn(`Invalid image URL, skipping delete: ${imageUrl}`);
                return;
            }

            logger.info(`Deleting image: ${path}`);

            const { error } = await this.client.storage.from(this.bucketName).remove([path]);

            if (error) {
                logger.error(`Delete failed: ${error.message}`);
                throw new Error(`Delete failed: ${error.message}`);
            }

            logger.info(`Image deleted successfully: ${path}`);
        } catch (error: any) {
            logger.error(`Error in deleteImage: ${error.message}`, error);
            throw error;
        }
    }

    /**
     * Delete multiple images at once
     * @param imageUrls - Array of public URLs
     */
    async deleteImages(imageUrls: string[]): Promise<void> {
        const paths = imageUrls.map((url) => this.extractPathFromUrl(url)).filter((path) => path !== null) as string[];

        if (paths.length === 0) {
            logger.warn('No valid image URLs to delete');
            return;
        }

        logger.info(`Deleting ${paths.length} images`);

        const { error } = await this.client.storage.from(this.bucketName).remove(paths);

        if (error) {
            logger.error(`Batch delete failed: ${error.message}`);
            throw new Error(`Batch delete failed: ${error.message}`);
        }

        logger.info(`${paths.length} images deleted successfully`);
    }

    /**
     * Validate file size and MIME type
     * @param file - File buffer
     * @param mimeType - MIME type
     * @throws Error if validation fails
     */
    private validateFile(file: Buffer, mimeType: string): void {
        // Check file size
        if (file.length > this.maxFileSize) {
            const sizeMB = (this.maxFileSize / (1024 * 1024)).toFixed(2);
            throw new Error(`File too large. Maximum size is ${sizeMB}MB`);
        }

        // Check MIME type
        if (!this.allowedMimeTypes.includes(mimeType)) {
            throw new Error(`Invalid file type. Allowed types: ${this.allowedMimeTypes.join(', ')}`);
        }
    }

    /**
     * Generate unique filename with timestamp and UUID
     * @param originalName - Original filename
     * @returns Unique filename
     */
    private generateFileName(originalName: string): string {
        const ext = originalName.split('.').pop()?.toLowerCase() || 'jpg';
        const timestamp = Date.now();
        const uuid = uuidv4();
        return `${timestamp}-${uuid}.${ext}`;
    }

    /**
     * Extract storage path from public URL
     * @param url - Public URL
     * @returns Storage path or null if invalid
     */
    private extractPathFromUrl(url: string): string | null {
        try {
            const urlObj = new URL(url);
            const parts = urlObj.pathname.split(`/${this.bucketName}/`);
            return parts[1] || null;
        } catch (error) {
            logger.warn(`Failed to extract path from URL: ${url}`);
            return null;
        }
    }

    /**
     * Check if bucket exists and is accessible
     * @returns True if bucket is accessible
     */
    async checkBucketAccess(): Promise<boolean> {
        try {
            const { error } = await this.client.storage.from(this.bucketName).list('', { limit: 1 });

            if (error) {
                logger.error(`Bucket access check failed: ${error.message}`);
                return false;
            }

            logger.info(`Bucket ${this.bucketName} is accessible`);
            return true;
        } catch (error: any) {
            logger.error(`Error checking bucket access: ${error.message}`);
            return false;
        }
    }
}

// Export singleton instance
export const storageService = new SupabaseStorageService();
