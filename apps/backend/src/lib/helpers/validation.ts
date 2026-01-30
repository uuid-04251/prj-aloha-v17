import mongoose from 'mongoose';

/**
 * Validate if string is a valid MongoDB ObjectId
 */
export function isValidObjectId(id: string): boolean {
    return mongoose.Types.ObjectId.isValid(id);
}
