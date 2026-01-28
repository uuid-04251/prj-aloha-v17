export interface Category {
    id: string;
    name: string;
    description: string;
    status: 'active' | 'inactive';
    createdAt: string;
}

const categories: Category[] = [
    { id: '1', name: 'Flowers', description: 'Fresh cut flowers and bouquets', status: 'active', createdAt: '2023-01-01' },
    { id: '2', name: 'Plants', description: 'Indoor and outdoor plants', status: 'active', createdAt: '2023-02-01' },
    { id: '3', name: 'Arrangements', description: 'Floral arrangements and centerpieces', status: 'active', createdAt: '2023-03-01' },
    { id: '4', name: 'Gifts', description: 'Gift baskets and floral gifts', status: 'active', createdAt: '2023-04-01' },
    { id: '5', name: 'Seasonal', description: 'Holiday and seasonal flowers', status: 'active', createdAt: '2023-05-01' },
    { id: '6', name: 'Wedding', description: 'Wedding flowers and decorations', status: 'active', createdAt: '2023-06-01' },
    { id: '7', name: 'Funeral', description: 'Funeral and sympathy flowers', status: 'inactive', createdAt: '2023-07-01' },
    { id: '8', name: 'Corporate', description: 'Corporate and event flowers', status: 'active', createdAt: '2023-08-01' }
];

export const CategoryService = {
    getCategories(): Promise<Category[]> {
        return Promise.resolve(categories);
    },

    createCategory(category: Omit<Category, 'id' | 'createdAt'>): Promise<Category> {
        const newCategory: Category = {
            ...category,
            id: this.generateId(),
            createdAt: new Date().toISOString().split('T')[0]
        };
        categories.push(newCategory);
        return Promise.resolve(newCategory);
    },

    updateCategory(category: Category): Promise<Category> {
        const index = categories.findIndex((c) => c.id === category.id);
        if (index !== -1) {
            categories[index] = category;
            return Promise.resolve(category);
        } else {
            return Promise.reject(new Error('Category not found'));
        }
    },

    deleteCategory(id: string): Promise<void> {
        const index = categories.findIndex((c) => c.id === id);
        if (index !== -1) {
            categories.splice(index, 1);
            return Promise.resolve();
        } else {
            return Promise.reject(new Error('Category not found'));
        }
    },

    generateId(): string {
        return Math.random().toString(36).substr(2, 9);
    }
};
