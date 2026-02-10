import mongoose, { Schema, Document, Model } from 'mongoose';

interface IProduct extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    description: string;
    sku: string;
    mainImage?: string;
    images: string[];
    category: mongoose.Types.ObjectId;
    status: 'active' | 'inactive' | 'out_of_stock';
    createdAt: Date;
    updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: [3, 'Product name must be at least 3 characters long'],
            maxlength: [200, 'Product name cannot exceed 200 characters']
        },
        description: {
            type: String,
            required: true,
            minlength: [10, 'Description must be at least 10 characters long']
        },
        sku: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            minlength: [3, 'SKU must be at least 3 characters long'],
            maxlength: [50, 'SKU cannot exceed 50 characters'],
            validate: {
                validator: function (v: string) {
                    // SKU should be alphanumeric with dashes/underscores allowed
                    return /^[A-Z0-9_-]+$/.test(v);
                },
                message: 'SKU can only contain uppercase letters, numbers, dashes, and underscores'
            }
        },
        mainImage: {
            type: String,
            validate: {
                validator: function (v: string) {
                    // Optional URL validation
                    if (!v) return true;
                    return /^https?:\/\/.+/.test(v);
                },
                message: 'Main image must be a valid URL'
            }
        },
        images: [
            {
                type: String,
                validate: {
                    validator: function (v: string) {
                        // URL validation for each image
                        return /^https?:\/\/.+/.test(v);
                    },
                    message: 'All images must be valid URLs'
                }
            }
        ],
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        },
        status: {
            type: String,
            enum: ['active', 'inactive', 'out_of_stock'],
            default: 'active'
        }
    },
    {
        timestamps: true
    }
);

// Indexes
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ name: 'text', description: 'text' });

const Product: Model<IProduct> = mongoose.model<IProduct>('Product', productSchema);

export default Product;
export { Product };
export type { IProduct };
