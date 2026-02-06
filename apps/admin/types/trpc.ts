// Import the actual AppRouter type from backend
// This ensures type safety between frontend and backend
import type { AppRouter } from '../../backend/src/lib/trpc/router';

export type { AppRouter };

// Type helpers for easier usage
export type RouterInputs = any; // TODO: Replace with proper TRPC type helpers
export type RouterOutputs = any; // TODO: Replace with proper TRPC type helpers
