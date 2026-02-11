export interface ICreateProductData {
    name: string;
    description: string;
    sku: string;
    mainImage?: string | undefined;
    images?: string[] | undefined;
    status?: 'active' | 'inactive' | 'out_of_stock' | undefined;
}

export interface IUpdateProductData {
    name?: string | undefined;
    description?: string | undefined;
    sku?: string | undefined;
    mainImage?: string | undefined;
    images?: string[] | undefined;
    status?: 'active' | 'inactive' | 'out_of_stock' | undefined;
}

export interface IProductResponseData {
    _id: string;
    name: string;
    description: string;
    sku: string;
    mainImage?: string;
    images: string[];
    status: 'active' | 'inactive' | 'out_of_stock';
    createdAt: string;
    updatedAt: string;
}

export interface IProductFilters {
    status?: 'active' | 'inactive' | 'out_of_stock';
    search?: string;
}
