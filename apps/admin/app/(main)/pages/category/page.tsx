'use client';
import React, { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { classNames } from 'primereact/utils';
import { Skeleton } from 'primereact/skeleton';
import { CategoryService, Category } from '../../../../services/CategoryService';

const CategoryPage = () => {
    let emptyCategory: Category = {
        id: '',
        name: '',
        description: '',
        status: 'active',
        createdAt: ''
    };

    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryDialog, setCategoryDialog] = useState(false);
    const [category, setCategory] = useState<Category>(emptyCategory);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const toast = useRef<Toast>(null);

    useEffect(() => {
        CategoryService.getCategories().then((data: Category[]) => {
            setCategories(data);
            setLoading(false);
        });
    }, []);

    const openNew = () => {
        setCategory(emptyCategory);
        setSubmitted(false);
        setCategoryDialog(true);
    };

    const editCategory = (category: Category) => {
        setCategory({ ...category });
        setCategoryDialog(true);
    };

    const confirmDeleteCategory = (category: Category) => {
        confirmDialog({
            message: 'Are you sure you want to delete this category?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => deleteCategory(category)
        });
    };

    const deleteCategory = (category: Category) => {
        CategoryService.deleteCategory(category.id)
            .then(() => {
                setCategories(categories.filter((c) => c.id !== category.id));
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Category Deleted',
                    life: 3000
                });
            })
            .catch((error: unknown) => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to delete category',
                    life: 3000
                });
            });
    };

    const hideDialog = () => {
        setSubmitted(false);
        setCategoryDialog(false);
    };

    const saveCategory = () => {
        setSubmitted(true);

        if (category.name.trim()) {
            if (category.id) {
                // Update existing category
                CategoryService.updateCategory(category)
                    .then((updatedCategory: Category) => {
                        setCategories(categories.map((c) => (c.id === updatedCategory.id ? updatedCategory : c)));
                        toast.current?.show({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Category Updated',
                            life: 3000
                        });
                    })
                    .catch((error: unknown) => {
                        toast.current?.show({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to update category',
                            life: 3000
                        });
                    });
            } else {
                // Create new category
                CategoryService.createCategory(category).then((newCategory: Category) => {
                    setCategories([...categories, newCategory]);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Category Created',
                        life: 3000
                    });
                });
            }
            setCategoryDialog(false);
            setCategory(emptyCategory);
        }
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _category = { ...category };
        if (name === 'status') {
            _category.status = val as 'active' | 'inactive';
        } else {
            (_category as any)[name] = val;
        }
        setCategory(_category);
    };

    const onStatusChange = (e: any) => {
        let _category = { ...category };
        _category.status = e.value;
        setCategory(_category);
    };

    const statusBodyTemplate = (rowData: Category) => {
        return <span className={`product-badge status-${rowData.status}`}>{rowData.status}</span>;
    };

    const nameSkeletonTemplate = () => {
        return <Skeleton width="80%" height="1.2rem" />;
    };

    const descriptionSkeletonTemplate = () => {
        return <Skeleton width="95%" height="1.2rem" />;
    };

    const statusSkeletonTemplate = () => {
        return <Skeleton width="60%" height="1.5rem" className="mb-1" />;
    };

    const dateSkeletonTemplate = () => {
        return <Skeleton width="85%" height="1.2rem" />;
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
                <InputText type="search" placeholder="Search..." />
            </span>
            <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
        </div>
    );

    const categoryDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveCategory} />
        </>
    );

    const statusOptions = [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' }
    ];

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <ConfirmDialog />
                    <div className="table-name mb-3">
                        <h5>Category Management</h5>
                    </div>
                    <DataTable
                        value={loading ? Array.from({ length: 10 }, () => ({})) : categories}
                        paginator
                        rows={10}
                        tableStyle={{ minWidth: '50rem' }}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                        header={header}
                    >
                        <Column field="name" header="Name" sortable style={{ width: '25%' }} body={loading ? nameSkeletonTemplate : undefined}></Column>
                        <Column field="description" header="Description" sortable style={{ width: '40%' }} body={loading ? descriptionSkeletonTemplate : undefined}></Column>
                        <Column field="status" header="Status" body={loading ? statusSkeletonTemplate : statusBodyTemplate} sortable style={{ width: '15%' }}></Column>
                        <Column field="createdAt" header="Created At" sortable style={{ width: '20%' }} body={loading ? dateSkeletonTemplate : undefined}></Column>
                        <Column
                            header="Actions"
                            body={
                                loading
                                    ? actionsSkeletonTemplate
                                    : (rowData: Category) => (
                                          <div className="flex gap-2">
                                              <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-button-sm" onClick={() => editCategory(rowData)} />
                                              <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-sm" onClick={() => confirmDeleteCategory(rowData)} />
                                          </div>
                                      )
                            }
                            style={{ width: '15%' }}
                        ></Column>
                    </DataTable>

                    <Dialog visible={categoryDialog} style={{ width: '450px' }} header="Category Details" modal className="p-fluid" footer={categoryDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText
                                id="name"
                                value={category.name}
                                onChange={(e) => onInputChange(e, 'name')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !category.name
                                })}
                            />
                            {submitted && !category.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputTextarea id="description" value={category.description} onChange={(e) => onInputChange(e, 'description')} rows={3} cols={30} />
                        </div>
                        <div className="field">
                            <label htmlFor="status">Status</label>
                            <Dropdown id="status" value={category.status} options={statusOptions} onChange={onStatusChange} placeholder="Select status" />
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default CategoryPage;
