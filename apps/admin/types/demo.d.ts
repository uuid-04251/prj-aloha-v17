// Essential types for Aloha Admin (User, Product management only)

// Layout types (used by PrimeReact components)
export type LayoutType = 'list' | 'grid';
export type SortOrderType = 1 | 0 | -1;

// Status types for our entities
export type UserStatus = 'active' | 'inactive';
export type ProductStatus = 'active' | 'inactive' | 'out_of_stock';

// Basic interfaces for our data models (defined in respective services)
export interface BaseEntity {
    id: string;
    createdAt: string;
    updatedAt?: string;
}

// Toast notification options (used by PrimeReact Toast)
export interface ToastOptions {
    severity?: 'success' | 'info' | 'warn' | 'error';
    summary?: string;
    detail?: string;
    life?: number;
}
