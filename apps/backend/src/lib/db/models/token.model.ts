import mongoose, { Schema, Document } from 'mongoose';

export interface IToken extends Document {
    token: string;
    userId: string;
    type: 'access' | 'refresh';
    expiresAt: Date;
    createdAt: Date;
}

const tokenSchema = new Schema<IToken>(
    {
        token: {
            type: String,
            required: true,
            unique: true
        },
        userId: {
            type: String,
            required: true,
            ref: 'User'
        },
        type: {
            type: String,
            enum: ['access', 'refresh'],
            required: true
        },
        expiresAt: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);

// TTL index to auto-delete expired tokens
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for faster lookups
tokenSchema.index({ userId: 1, type: 1 });
tokenSchema.index({ token: 1 });

export const Token = mongoose.model<IToken>('Token', tokenSchema);
