/**
 * Image Upload Service for Product Images
 * Handles file upload to backend API with progress tracking
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export interface UploadProgress {
    loaded: number;
    total: number;
    percentage: number;
}

export interface UploadResponse {
    success: boolean;
    message: string;
    data?: {
        url: string;
    };
    error?: string;
}

export class ImageUploadService {
    /**
     * Upload a single image to the backend
     * @param file - File to upload
     * @param onProgress - Progress callback
     * @returns Upload response with image URL
     */
    static async uploadImage(file: File, onProgress?: (_progress: UploadProgress) => void): Promise<string> {
        // Validate file
        this.validateFile(file);

        // Get auth token
        const token = this.getAuthToken();
        if (!token) {
            throw new Error('Authentication required. Please login again.');
        }

        // Create form data
        const formData = new FormData();
        formData.append('image', file);

        // Upload with XHR for progress tracking
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            // Progress tracking
            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable && onProgress) {
                    onProgress({
                        loaded: event.loaded,
                        total: event.total,
                        percentage: Math.round((event.loaded / event.total) * 100)
                    });
                }
            });

            // Success handler
            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const response: UploadResponse = JSON.parse(xhr.responseText);
                        if (response.success && response.data?.url) {
                            resolve(response.data.url);
                        } else {
                            reject(new Error(response.message || 'Upload failed'));
                        }
                    } catch {
                        reject(new Error('Invalid server response'));
                    }
                } else {
                    try {
                        const response: UploadResponse = JSON.parse(xhr.responseText);
                        reject(new Error(response.message || `Upload failed with status ${xhr.status}`));
                    } catch {
                        reject(new Error(`Upload failed with status ${xhr.status}`));
                    }
                }
            });

            // Error handler
            xhr.addEventListener('error', () => {
                reject(new Error('Network error during upload'));
            });

            // Abort handler
            xhr.addEventListener('abort', () => {
                reject(new Error('Upload cancelled'));
            });

            // Send request
            xhr.open('POST', `${API_BASE_URL}/api/products/upload-image`);
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            xhr.send(formData);
        });
    }

    /**
     * Upload multiple images at once
     * @param files - Array of files to upload
     * @param onProgress - Progress callback for each file
     * @returns Array of uploaded image URLs
     */
    static async uploadImages(files: File[], onProgress?: (_fileIndex: number, _progress: UploadProgress) => void): Promise<string[]> {
        // Validate all files first
        files.forEach((file, index) => {
            try {
                this.validateFile(file);
            } catch (error: any) {
                throw new Error(`File ${index + 1} (${file.name}): ${error.message}`);
            }
        });

        // Upload files sequentially to avoid overwhelming the server
        const urls: string[] = [];
        for (let i = 0; i < files.length; i++) {
            const url = await this.uploadImage(files[i], (progress) => {
                if (onProgress) {
                    onProgress(i, progress);
                }
            });
            urls.push(url);
        }

        return urls;
    }

    /**
     * Delete an image from storage
     * @param imageUrl - URL of the image to delete
     */
    static async deleteImage(imageUrl: string): Promise<void> {
        const token = this.getAuthToken();
        if (!token) {
            throw new Error('Authentication required. Please login again.');
        }

        const response = await fetch(`${API_BASE_URL}/api/products/delete-image`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ imageUrl })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to delete image');
        }

        const result: UploadResponse = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Failed to delete image');
        }
    }

    /**
     * Validate file size and type
     * @param file - File to validate
     * @throws Error if validation fails
     */
    static validateFile(file: File): void {
        // Check file size
        if (file.size > MAX_FILE_SIZE) {
            const sizeMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(1);
            throw new Error(`File too large. Maximum size is ${sizeMB}MB`);
        }

        // Check file type
        if (!ALLOWED_TYPES.includes(file.type)) {
            throw new Error(`Invalid file type. Allowed types: JPEG, PNG, WebP`);
        }
    }

    /**
     * Format file size for display
     * @param bytes - Size in bytes
     * @returns Formatted string (e.g., "2.5 MB")
     */
    static formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Create a preview URL for a file
     * @param file - File to preview
     * @returns Data URL
     */
    static createPreviewUrl(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    /**
     * Get authentication token from localStorage
     * @returns JWT token or null
     */
    private static getAuthToken(): string | null {
        if (typeof window === 'undefined') return null;

        const authData = localStorage.getItem('authData');
        if (!authData) return null;

        try {
            const parsed = JSON.parse(authData);
            return parsed.token || null;
        } catch {
            return null;
        }
    }
}
