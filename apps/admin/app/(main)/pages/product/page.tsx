'use client';
import React, { useEffect, useRef, useState } from 'react';
import { classNames } from 'primereact/utils';
import { ProductService, Product } from '../../../../services/ProductService';
import { confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import dynamic from 'next/dynamic';

// Dynamic imports for PrimeReact components
const DataTable = dynamic(() => import('primereact/datatable').then(mod => ({ default: mod.DataTable })));
const Column = dynamic(() => import('primereact/column').then(mod => ({ default: mod.Column })));
const Button = dynamic(() => import('primereact/button').then(mod => ({ default: mod.Button })));
const Dialog = dynamic(() => import('primereact/dialog').then(mod => ({ default: mod.Dialog })));
const InputText = dynamic(() => import('primereact/inputtext').then(mod => ({ default: mod.InputText })));
const InputTextarea = dynamic(() => import('primereact/inputtextarea').then(mod => ({ default: mod.InputTextarea })));
const InputNumber = dynamic(() => import('primereact/inputnumber').then(mod => ({ default: mod.InputNumber })));
const Dropdown = dynamic(() => import('primereact/dropdown').then(mod => ({ default: mod.Dropdown })));
const ConfirmDialog = dynamic(() => import('primereact/confirmdialog').then(mod => ({ default: mod.ConfirmDialog })));
const Skeleton = dynamic(() => import('primereact/skeleton').then(mod => ({ default: mod.Skeleton })));
const Rating = dynamic(() => import('primereact/rating').then(mod => ({ default: mod.Rating })));
const Tag = dynamic(() => import('primereact/tag').then(mod => ({ default: mod.Tag })));
const Image = dynamic(() => import('primereact/image').then(mod => ({ default: mod.Image })));

const ProductPage = () => {
    let emptyProduct: Product = {
        id: '',
        name: '',
        description: '',
        price: 0,
        cost: 0,
        stock: 0,
        sku: '',
        mainImage: '',
        images: [],
        category: '',
        status: 'active',
        rating: 0,
        reviewCount: 0,
        createdAt: '',
        updatedAt: ''
    };

    const [products, setProducts] = useState<Product[]>([]);
    const [productDialog, setProductDialog] = useState(false);
    const [product, setProduct] = useState<Product>(emptyProduct);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const toast = useRef<Toast>(null);

    useEffect(() => {
        ProductService.getProducts().then((data: Product[]) => {
            setProducts(data);
            setLoading(false);
        });
    }, []);

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const editProduct = (product: Product) => {
        setProduct({ ...product });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product: Product) => {
        confirmDialog({
            message: 'Are you sure you want to delete this product?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => deleteProduct(product)
        });
    };

    const deleteProduct = (product: Product) => {
        ProductService.deleteProduct(product.id)
            .then(() => {
                setProducts(products.filter((p) => p.id !== product.id));
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Deleted',
                    life: 3000
                });
            })
            .catch((_error: unknown) => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to delete product',
                    life: 3000
                });
            });
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);

        if (product.name.trim()) {
            let _products = [...products];

            if (product.id) {
                // Update existing product
                ProductService.updateProduct(product)
                    .then((updatedProduct: Product) => {
                        _products[_products.findIndex((p) => p.id === product.id)] = updatedProduct;
                        setProducts(_products);
                        toast.current?.show({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Product Updated',
                            life: 3000
                        });
                    })
                    .catch((_error: unknown) => {
                        toast.current?.show({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to update product',
                            life: 3000
                        });
                    });
            } else {
                // Create new product
                ProductService.createProduct(product)
                    .then((newProduct: Product) => {
                        _products.push(newProduct);
                        setProducts(_products);
                        toast.current?.show({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Product Created',
                            life: 3000
                        });
                    })
                    .catch((_error: unknown) => {
                        toast.current?.show({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to create product',
                            life: 3000
                        });
                    });
            }

            setProductDialog(false);
            setProduct(emptyProduct);
        }
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };
        (_product as any)[name] = val;
        setProduct(_product);
    };

    const onInputNumberChange = (e: any, name: string) => {
        const val = e.value || 0;
        let _product = { ...product };
        (_product as any)[name] = val;
        setProduct(_product);
    };

    const onStatusChange = (e: any) => {
        let _product = { ...product };
        _product.status = e.value;
        setProduct(_product);
    };

    const onCategoryChange = (e: any) => {
        let _product = { ...product };
        _product.category = e.value;
        setProduct(_product);
    };

    // Template functions
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(value);
    };

    const imageBodyTemplate = (rowData: Product) => {
        return (
            <div className="flex align-items-center gap-2">
                <Image src={rowData.mainImage} alt={rowData.name} width="60" height="60" preview className="border-round" />
                {rowData.images.length > 0 && (
                    <div className="flex flex-column gap-1">
                        <small className="text-500">+{rowData.images.length} more</small>
                        <div className="flex gap-1">
                            {rowData.images.slice(0, 3).map((img, index) => (
                                <Image key={index} src={img} alt={`${rowData.name} ${index + 1}`} width="24" height="24" preview className="border-round" />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const priceBodyTemplate = (rowData: Product) => {
        return (
            <div className="flex flex-column">
                <span className={classNames('font-bold', { 'text-red-500': rowData.discountPrice })}>{formatCurrency(rowData.price)}</span>
                {rowData.discountPrice && <span className="text-sm text-green-600 font-medium">Sale: {formatCurrency(rowData.discountPrice)}</span>}
            </div>
        );
    };

    const stockBodyTemplate = (rowData: Product) => {
        const severity = rowData.stock > 20 ? 'success' : rowData.stock > 0 ? 'warning' : 'danger';

        return <Tag value={`${rowData.stock} units`} severity={severity} />;
    };

    const ratingBodyTemplate = (rowData: Product) => {
        return (
            <div className="flex align-items-center gap-2">
                <Rating value={rowData.rating} readOnly cancel={false} />
                <span className="text-sm text-500">({rowData.reviewCount})</span>
            </div>
        );
    };

    const statusBodyTemplate = (rowData: Product) => {
        const severity = rowData.status === 'active' ? 'success' : rowData.status === 'inactive' ? 'danger' : 'warning';
        return <Tag value={rowData.status.replace('_', ' ').toUpperCase()} severity={severity} />;
    };

    const profitBodyTemplate = (rowData: Product) => {
        const profit = rowData.price - rowData.cost;
        const margin = ((profit / rowData.price) * 100).toFixed(1);
        const severity = profit > 0 ? 'success' : 'danger';

        return (
            <div className="flex flex-column">
                <span className={`font-medium text-${severity === 'success' ? 'green' : 'red'}-600`}>{formatCurrency(profit)}</span>
                <small className="text-500">{margin}% margin</small>
            </div>
        );
    };

    // Skeleton templates
    const nameSkeletonTemplate = () => {
        return <Skeleton width="85%" height="1.2rem" />;
    };

    const priceSkeletonTemplate = () => {
        return <Skeleton width="70%" height="1.5rem" className="mb-1" />;
    };

    const stockSkeletonTemplate = () => {
        return <Skeleton width="60%" height="1.8rem" className="border-round" />;
    };

    const ratingSkeletonTemplate = () => {
        return <Skeleton width="80%" height="1.5rem" />;
    };

    const statusSkeletonTemplate = () => {
        return <Skeleton width="65%" height="1.8rem" className="border-round" />;
    };

    const profitSkeletonTemplate = () => {
        return <Skeleton width="75%" height="1.5rem" className="mb-1" />;
    };

    const imageSkeletonTemplate = () => {
        return (
            <div className="flex align-items-center gap-2">
                <Skeleton width="60px" height="60px" className="border-round" />
                <div className="flex flex-column gap-1">
                    <Skeleton width="50px" height="0.8rem" />
                    <div className="flex gap-1">
                        <Skeleton width="24px" height="24px" className="border-round" />
                        <Skeleton width="24px" height="24px" className="border-round" />
                        <Skeleton width="24px" height="24px" className="border-round" />
                    </div>
                </div>
            </div>
        );
    };

    const actionsSkeletonTemplate = () => {
        return (
            <div className="flex gap-2">
                <Skeleton width="2rem" height="2rem" className="border-circle" />
                <Skeleton width="2rem" height="2rem" className="border-circle" />
            </div>
        );
    };

    const header = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" placeholder="Search products..." />
            </span>
            <Button label="New Product" icon="pi pi-plus" severity="success" onClick={openNew} />
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveProduct} />
        </>
    );

    const statusOptions = [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Out of Stock', value: 'out_of_stock' }
    ];

    const categoryOptions = [
        { label: 'Flowers', value: 'Flowers' },
        { label: 'Plants', value: 'Plants' },
        { label: 'Arrangements', value: 'Arrangements' },
        { label: 'Gifts', value: 'Gifts' },
        { label: 'Seasonal', value: 'Seasonal' },
        { label: 'Wedding', value: 'Wedding' },
        { label: 'Funeral', value: 'Funeral' },
        { label: 'Corporate', value: 'Corporate' }
    ];

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <ConfirmDialog />
                    <div className="table-name mb-3">
                        <h5>Product Management</h5>
                    </div>
                    <DataTable
                        value={loading ? Array.from({ length: 10 }, () => ({})) : products}
                        paginator
                        rows={10}
                        tableStyle={{ minWidth: '80rem' }}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column field="mainImage" header="Images" body={loading ? imageSkeletonTemplate : imageBodyTemplate} style={{ width: '15%' }} />
                        <Column field="name" header="Product Name" sortable body={loading ? nameSkeletonTemplate : undefined} style={{ width: '20%' }} />
                        <Column field="sku" header="SKU" sortable style={{ width: '10%' }} />
                        <Column field="price" header="Price" body={loading ? priceSkeletonTemplate : priceBodyTemplate} sortable style={{ width: '12%' }} />
                        <Column field="stock" header="Stock" body={loading ? stockSkeletonTemplate : stockBodyTemplate} sortable style={{ width: '10%' }} />
                        <Column field="rating" header="Rating" body={loading ? ratingSkeletonTemplate : ratingBodyTemplate} sortable style={{ width: '15%' }} />
                        <Column field="status" header="Status" body={loading ? statusSkeletonTemplate : statusBodyTemplate} sortable style={{ width: '10%' }} />
                        <Column header="Profit" body={loading ? profitSkeletonTemplate : profitBodyTemplate} style={{ width: '12%' }} />
                        <Column
                            header="Actions"
                            body={
                                loading
                                    ? actionsSkeletonTemplate
                                    : (rowData: Product) => (
                                          <div className="flex gap-2">
                                              <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-button-sm" onClick={() => editProduct(rowData)} />
                                              <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-sm" onClick={() => confirmDeleteProduct(rowData)} />
                                          </div>
                                      )
                            }
                            style={{ width: '10%' }}
                        />
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '600px' }} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="grid">
                            <div className="col-12">
                                <label htmlFor="name" className="block text-900 font-medium mb-2">
                                    Product Name *
                                </label>
                                <InputText id="name" value={product.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
                                {submitted && !product.name && <small className="p-error">Name is required.</small>}
                            </div>

                            <div className="col-12 md:col-6">
                                <label htmlFor="sku" className="block text-900 font-medium mb-2">
                                    SKU
                                </label>
                                <InputText id="sku" value={product.sku} onChange={(e) => onInputChange(e, 'sku')} />
                            </div>

                            <div className="col-12 md:col-6">
                                <label htmlFor="category" className="block text-900 font-medium mb-2">
                                    Category
                                </label>
                                <Dropdown id="category" value={product.category} onChange={onCategoryChange} options={categoryOptions} placeholder="Select a category" />
                            </div>

                            <div className="col-12 md:col-4">
                                <label htmlFor="price" className="block text-900 font-medium mb-2">
                                    Price ($)
                                </label>
                                <InputNumber id="price" value={product.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="USD" locale="en-US" />
                            </div>

                            <div className="col-12 md:col-4">
                                <label htmlFor="discountPrice" className="block text-900 font-medium mb-2">
                                    Discount Price ($)
                                </label>
                                <InputNumber id="discountPrice" value={product.discountPrice} onValueChange={(e) => onInputNumberChange(e, 'discountPrice')} mode="currency" currency="USD" locale="en-US" />
                            </div>

                            <div className="col-12 md:col-4">
                                <label htmlFor="cost" className="block text-900 font-medium mb-2">
                                    Cost ($)
                                </label>
                                <InputNumber id="cost" value={product.cost} onValueChange={(e) => onInputNumberChange(e, 'cost')} mode="currency" currency="USD" locale="en-US" />
                            </div>

                            <div className="col-12 md:col-6">
                                <label htmlFor="stock" className="block text-900 font-medium mb-2">
                                    Stock Quantity
                                </label>
                                <InputNumber id="stock" value={product.stock} onValueChange={(e) => onInputNumberChange(e, 'stock')} />
                            </div>

                            <div className="col-12 md:col-6">
                                <label htmlFor="status" className="block text-900 font-medium mb-2">
                                    Status
                                </label>
                                <Dropdown id="status" value={product.status} onChange={onStatusChange} options={statusOptions} placeholder="Select status" />
                            </div>

                            <div className="col-12">
                                <label htmlFor="description" className="block text-900 font-medium mb-2">
                                    Description
                                </label>
                                <InputTextarea id="description" value={product.description} onChange={(e) => onInputChange(e, 'description')} rows={3} />
                            </div>

                            <div className="col-12">
                                <label htmlFor="mainImage" className="block text-900 font-medium mb-2">
                                    Main Image URL
                                </label>
                                <InputText id="mainImage" value={product.mainImage} onChange={(e) => onInputChange(e, 'mainImage')} placeholder="https://example.com/image.jpg" />
                            </div>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
