'use client';

import React, { useState, useRef } from 'react';
import { FileUpload, FileUploadSelectEvent } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { ImageUploadService } from '../../services/ImageUploadService';
import './ImageUpload.css';

interface ImageUploadProps {
    value?: string | string[]; // Current image URL(s)
    onChange: (_value: string | string[]) => void; // Callback with new URL(s)
    multiple?: boolean; // Allow multiple images
    maxFiles?: number; // Max number of files (for multiple mode)
    disabled?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, multiple = false, maxFiles = 10, disabled = false }) => {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const toast = useRef<Toast>(null);
    const fileUploadRef = useRef<FileUpload>(null);

    // Convert value to array for easier handling
    const imageUrls = multiple ? (Array.isArray(value) ? value : value ? [value] : []) : value ? [value as string] : [];

    /**
     * Handle file selection and upload
     */
    const handleUpload = async (event: any) => {
        const files = event.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        setUploadProgress(0);

        try {
            if (multiple) {
                // Check max files limit
                const totalFiles = imageUrls.length + files.length;
                if (totalFiles > maxFiles) {
                    throw new Error(`Maximum ${maxFiles} images allowed`);
                }

                // Upload multiple files
                const newUrls = await ImageUploadService.uploadImages(files, (_fileIndex, progress) => {
                    setUploadProgress(progress.percentage);
                });

                // Add to existing URLs
                onChange([...imageUrls, ...newUrls]);

                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: `${files.length} image(s) uploaded successfully`,
                    life: 3000
                });
            } else {
                // Upload single file
                const url = await ImageUploadService.uploadImage(files[0], (progress) => {
                    setUploadProgress(progress.percentage);
                });

                onChange(url);

                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Image uploaded successfully',
                    life: 3000
                });
            }

            // Clear file upload component
            if (fileUploadRef.current) {
                fileUploadRef.current.clear();
            }
        } catch (error: any) {
            console.error('Upload error:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Upload Failed',
                detail: error.message || 'Failed to upload image',
                life: 5000
            });
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    /**
     * Handle image deletion
     */
    const handleDelete = async (imageUrl: string) => {
        try {
            // Delete from storage
            await ImageUploadService.deleteImage(imageUrl);

            // Update state
            if (multiple) {
                const newUrls = imageUrls.filter((url) => url !== imageUrl);
                onChange(newUrls);
            } else {
                onChange('');
            }

            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Image deleted successfully',
                life: 3000
            });
        } catch (error: any) {
            console.error('Delete error:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Delete Failed',
                detail: error.message || 'Failed to delete image',
                life: 5000
            });
        }
    };

    /**
     * Validate file on selection
     */
    const handleSelect = (event: FileUploadSelectEvent) => {
        const files = event.files;

        // Check max files limit for multiple mode
        if (multiple && imageUrls.length + files.length > maxFiles) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Too Many Files',
                detail: `Maximum ${maxFiles} images allowed`,
                life: 3000
            });
            event.files = files.slice(0, maxFiles - imageUrls.length);
        }

        // Validate each file
        files.forEach((file) => {
            try {
                ImageUploadService.validateFile(file);
            } catch (error: any) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Invalid File',
                    detail: `${file.name}: ${error.message}`,
                    life: 5000
                });
                throw error;
            }
        });
    };

    return (
        <div className="image-upload-container">
            <Toast ref={toast} />

            {/* File Upload Component */}
            <FileUpload
                ref={fileUploadRef}
                name="image"
                multiple={multiple}
                accept="image/jpeg,image/png,image/webp"
                maxFileSize={5242880} // 5MB
                customUpload
                uploadHandler={handleUpload}
                onSelect={handleSelect}
                auto={false}
                disabled={disabled || uploading || (!multiple && imageUrls.length > 0)}
                chooseLabel={multiple ? 'Choose Images' : 'Choose Image'}
                uploadLabel="Upload"
                cancelLabel="Clear"
                emptyTemplate={<p className="m-0">Drag and drop {multiple ? 'images' : 'an image'} here to upload (Max 5MB, JPEG/PNG/WebP)</p>}
            />

            {/* Upload Progress */}
            {uploading && (
                <div className="mt-3">
                    <ProgressBar value={uploadProgress} />
                    <small className="text-muted">Uploading... {uploadProgress}%</small>
                </div>
            )}

            {/* Image Preview Grid */}
            {imageUrls.length > 0 && (
                <div className="image-preview-grid mt-3">
                    {imageUrls.map((url, index) => (
                        <div key={index} className="image-preview-item">
                            <img src={url} alt={`Preview ${index + 1}`} className="preview-image" />
                            <Button icon="pi pi-times" rounded severity="danger" size="small" className="delete-button" onClick={() => handleDelete(url)} disabled={disabled || uploading} tooltip="Delete image" tooltipOptions={{ position: 'top' }} />
                        </div>
                    ))}
                </div>
            )}

            {/* Image Count Info (for multiple mode) */}
            {multiple && imageUrls.length > 0 && (
                <small className="text-muted mt-2 d-block">
                    {imageUrls.length} / {maxFiles} images
                </small>
            )}
        </div>
    );
};
