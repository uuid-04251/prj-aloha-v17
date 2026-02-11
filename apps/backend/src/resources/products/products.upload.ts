import { FastifyPluginAsync } from 'fastify';
import { storageService } from '../../lib/storage/supabase.service';
import { logger } from '../../util/logger';

/**
 * Product Image Upload Routes Plugin
 * Handles file uploads to Supabase Storage
 */
const productUploadRoutes: FastifyPluginAsync = async (fastify) => {
    const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '5242880'); // 5MB
    const ALLOWED_MIME_TYPES = (process.env.ALLOWED_MIME_TYPES || 'image/jpeg,image/png,image/webp').split(',');

    /**
     * POST /api/products/upload-image
     * Upload a single product image
     * Protected: Requires authentication
     */
    fastify.post(
        '/upload-image',
        {
            onRequest: [fastify.authenticate], // Use Fastify auth hook
            schema: {
                description: 'Upload a single product image',
                tags: ['products'],
                consumes: ['multipart/form-data'],
                response: {
                    200: {
                        type: 'object',
                        properties: {
                            success: { type: 'boolean' },
                            message: { type: 'string' },
                            data: {
                                type: 'object',
                                properties: {
                                    url: { type: 'string' }
                                }
                            }
                        }
                    }
                }
            }
        },
        async (request, reply) => {
            try {
                const data = await request.file({
                    limits: {
                        fileSize: MAX_FILE_SIZE
                    }
                });

                if (!data) {
                    return reply.status(400).send({
                        success: false,
                        message: 'No file uploaded'
                    });
                }

                // Validate MIME type
                if (!ALLOWED_MIME_TYPES.includes(data.mimetype)) {
                    return reply.status(400).send({
                        success: false,
                        message: `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`
                    });
                }

                // Get file buffer
                const buffer = await data.toBuffer();

                logger.info(`Image upload request: ${data.filename} (${data.mimetype}, ${buffer.length} bytes)`);

                // Upload to Supabase
                const imageUrl = await storageService.uploadImage(buffer, data.filename, data.mimetype);

                logger.info(`Image uploaded successfully: ${imageUrl}`);

                return reply.status(200).send({
                    success: true,
                    message: 'Image uploaded successfully',
                    data: {
                        url: imageUrl
                    }
                });
            } catch (error: any) {
                logger.error(`Image upload failed: ${error.message}`, error);

                return reply.status(500).send({
                    success: false,
                    message: error.message || 'Failed to upload image',
                    error: process.env.NODE_ENV === 'development' ? error.toString() : undefined
                });
            }
        }
    );

    /**
     * DELETE /api/products/delete-image
     * Delete a product image
     * Protected: Requires authentication
     */
    fastify.delete(
        '/delete-image',
        {
            onRequest: [fastify.authenticate],
            schema: {
                description: 'Delete a product image',
                tags: ['products'],
                body: {
                    type: 'object',
                    required: ['imageUrl'],
                    properties: {
                        imageUrl: { type: 'string' }
                    }
                },
                response: {
                    200: {
                        type: 'object',
                        properties: {
                            success: { type: 'boolean' },
                            message: { type: 'string' }
                        }
                    }
                }
            }
        },
        async (request, reply) => {
            try {
                const { imageUrl } = request.body as { imageUrl: string };

                if (!imageUrl || typeof imageUrl !== 'string') {
                    return reply.status(400).send({
                        success: false,
                        message: 'Image URL is required'
                    });
                }

                logger.info(`Image delete request: ${imageUrl}`);

                // Delete from Supabase
                await storageService.deleteImage(imageUrl);

                logger.info(`Image deleted successfully: ${imageUrl}`);

                return reply.status(200).send({
                    success: true,
                    message: 'Image deleted successfully'
                });
            } catch (error: any) {
                logger.error(`Image delete failed: ${error.message}`, error);

                return reply.status(500).send({
                    success: false,
                    message: error.message || 'Failed to delete image',
                    error: process.env.NODE_ENV === 'development' ? error.toString() : undefined
                });
            }
        }
    );

    /**
     * POST /api/products/upload-images
     * Upload multiple product images at once (max 10)
     * Protected: Requires authentication
     */
    fastify.post(
        '/upload-images',
        {
            onRequest: [fastify.authenticate],
            schema: {
                description: 'Upload multiple product images (max 10)',
                tags: ['products'],
                consumes: ['multipart/form-data'],
                response: {
                    200: {
                        type: 'object',
                        properties: {
                            success: { type: 'boolean' },
                            message: { type: 'string' },
                            data: {
                                type: 'object',
                                properties: {
                                    urls: {
                                        type: 'array',
                                        items: { type: 'string' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        async (request, reply) => {
            try {
                const parts = request.parts({
                    limits: {
                        fileSize: MAX_FILE_SIZE,
                        files: 10
                    }
                });

                const uploadPromises: Promise<string>[] = [];
                let fileCount = 0;

                for await (const part of parts) {
                    if (part.type === 'file') {
                        // Validate MIME type
                        if (!ALLOWED_MIME_TYPES.includes(part.mimetype)) {
                            return reply.status(400).send({
                                success: false,
                                message: `Invalid file type: ${part.mimetype}. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`
                            });
                        }

                        fileCount++;
                        const buffer = await part.toBuffer();

                        uploadPromises.push(storageService.uploadImage(buffer, part.filename, part.mimetype));
                    }
                }

                if (fileCount === 0) {
                    return reply.status(400).send({
                        success: false,
                        message: 'No files uploaded'
                    });
                }

                logger.info(`Multiple image upload request: ${fileCount} files`);

                // Upload all files
                const imageUrls = await Promise.all(uploadPromises);

                logger.info(`${imageUrls.length} images uploaded successfully`);

                return reply.status(200).send({
                    success: true,
                    message: `${imageUrls.length} images uploaded successfully`,
                    data: {
                        urls: imageUrls
                    }
                });
            } catch (error: any) {
                logger.error(`Multiple image upload failed: ${error.message}`, error);

                return reply.status(500).send({
                    success: false,
                    message: error.message || 'Failed to upload images',
                    error: process.env.NODE_ENV === 'development' ? error.toString() : undefined
                });
            }
        }
    );
};

export default productUploadRoutes;
