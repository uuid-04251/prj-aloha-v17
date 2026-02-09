'use client';
import React, { useRef, useState } from 'react';
import { classNames } from 'primereact/utils';
import { confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import dynamic from 'next/dynamic';
import { trpc } from '../../../../utils/trpc';

// Dynamic imports for PrimeReact components
const DataTable = dynamic(() => import('primereact/datatable').then((mod) => ({ default: mod.DataTable })));
const Column = dynamic(() => import('primereact/column').then((mod) => ({ default: mod.Column })));
const Button = dynamic(() => import('primereact/button').then((mod) => ({ default: mod.Button })));
const Dialog = dynamic(() => import('primereact/dialog').then((mod) => ({ default: mod.Dialog })));
const InputText = dynamic(() => import('primereact/inputtext').then((mod) => ({ default: mod.InputText })));
const Password = dynamic(() => import('primereact/password').then((mod) => ({ default: mod.Password })));
const Dropdown = dynamic(() => import('primereact/dropdown').then((mod) => ({ default: mod.Dropdown })));
const ConfirmDialog = dynamic(() => import('primereact/confirmdialog').then((mod) => ({ default: mod.ConfirmDialog })));
const Skeleton = dynamic(() => import('primereact/skeleton').then((mod) => ({ default: mod.Skeleton })));

interface User {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'user' | 'admin';
    createdAt: string;
    updatedAt: string;
}

interface UserFormData {
    email: string;
    firstName: string;
    lastName: string;
    password?: string;
    role: 'user' | 'admin';
}

const UserPage = () => {
    const emptyUserForm: UserFormData = {
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        role: 'user'
    };

    const [userDialog, setUserDialog] = useState(false);
    const [userForm, setUserForm] = useState<UserFormData>(emptyUserForm);
    const [editingUserId, setEditingUserId] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);

    // TRPC queries and mutations
    const { data: users = [], isLoading, refetch } = trpc.users.getUsers.useQuery({ limit: 100, offset: 0 });
    const createUserMutation = trpc.users.createUser.useMutation();
    const updateUserMutation = trpc.users.updateProfile.useMutation();
    const deleteUserMutation = trpc.users.deleteUser.useMutation();

    // Filter users based on search
    const filteredUsers = users.filter((user) => {
        if (!globalFilter) return true;
        const searchLower = globalFilter.toLowerCase();
        return user.firstName.toLowerCase().includes(searchLower) || user.lastName.toLowerCase().includes(searchLower) || user.email.toLowerCase().includes(searchLower) || user.role.toLowerCase().includes(searchLower);
    });

    const openNew = () => {
        setUserForm(emptyUserForm);
        setEditingUserId(null);
        setSubmitted(false);
        setUserDialog(true);
    };

    const editUser = (user: User) => {
        setUserForm({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            password: '' // Don't show password when editing
        });
        setEditingUserId(user._id);
        setSubmitted(false);
        setUserDialog(true);
    };

    const confirmDeleteUser = (user: User) => {
        confirmDialog({
            message: `Are you sure you want to delete ${user.firstName} ${user.lastName}?`,
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => deleteUser(user._id)
        });
    };

    const deleteUser = async (userId: string) => {
        try {
            await deleteUserMutation.mutateAsync({ userId });
            await refetch();
            toast.current?.show({
                severity: 'success',
                summary: 'Successful',
                detail: 'User Deleted',
                life: 3000
            });
        } catch (error: any) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error.message || 'Failed to delete user',
                life: 3000
            });
        }
    };

    const hideDialog = () => {
        setSubmitted(false);
        setUserDialog(false);
        setUserForm(emptyUserForm);
        setEditingUserId(null);
    };

    const saveUser = async () => {
        setSubmitted(true);

        // Validation
        if (!userForm.email.trim() || !userForm.firstName.trim() || !userForm.lastName.trim()) {
            return;
        }

        // For new users, password is required
        if (!editingUserId && !userForm.password) {
            return;
        }

        try {
            if (editingUserId) {
                // Update existing user
                await updateUserMutation.mutateAsync({
                    userId: editingUserId,
                    email: userForm.email,
                    firstName: userForm.firstName,
                    lastName: userForm.lastName
                });
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'User Updated',
                    life: 3000
                });
            } else {
                // Create new user
                await createUserMutation.mutateAsync({
                    email: userForm.email,
                    firstName: userForm.firstName,
                    lastName: userForm.lastName,
                    password: userForm.password!,
                    role: userForm.role
                });
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'User Created',
                    life: 3000
                });
            }
            await refetch();
            hideDialog();
        } catch (error: any) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error.message || `Failed to ${editingUserId ? 'update' : 'create'} user`,
                life: 3000
            });
        }
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: keyof UserFormData) => {
        setUserForm({ ...userForm, [name]: e.target.value });
    };

    const onRoleChange = (e: any) => {
        setUserForm({ ...userForm, role: e.value });
    };
    const nameBodyTemplate = (rowData: User) => {
        return `${rowData.firstName} ${rowData.lastName}`;
    };

    const roleBodyTemplate = (rowData: User) => {
        return <span className={`product-badge ${rowData.role === 'admin' ? 'status-outofstock' : 'status-instock'}`}>{rowData.role.toUpperCase()}</span>;
    };

    const dateBodyTemplate = (rowData: User) => {
        return new Date(rowData.createdAt).toLocaleDateString();
    };

    const nameSkeletonTemplate = () => {
        return <Skeleton width="80%" height="1.2rem" />;
    };

    const emailSkeletonTemplate = () => {
        return <Skeleton width="90%" height="1.2rem" />;
    };

    const roleSkeletonTemplate = () => {
        return <Skeleton width="70%" height="1.2rem" />;
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
                <InputText type="search" placeholder="Search users..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} />
            </span>
            <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} disabled={createUserMutation.isLoading || updateUserMutation.isLoading} />
        </div>
    );

    const userDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} disabled={createUserMutation.isLoading || updateUserMutation.isLoading} />
            <Button label="Save" icon="pi pi-check" text onClick={saveUser} loading={createUserMutation.isLoading || updateUserMutation.isLoading} />
        </>
    );

    const roleOptions = [
        { label: 'User', value: 'user' },
        { label: 'Admin', value: 'admin' }
    ];

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <ConfirmDialog />
                    <div className="table-name mb-3">
                        <h5>User Management</h5>
                    </div>
                    <DataTable
                        value={isLoading ? Array.from({ length: 10 }, () => ({})) : filteredUsers}
                        paginator
                        rows={10}
                        tableStyle={{ minWidth: '50rem' }}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
                        header={header}
                        emptyMessage="No users found."
                    >
                        <Column field="firstName" header="Name" sortable style={{ width: '25%' }} body={isLoading ? nameSkeletonTemplate : nameBodyTemplate} />
                        <Column field="email" header="Email" sortable style={{ width: '30%' }} body={isLoading ? emailSkeletonTemplate : undefined} />
                        <Column field="role" header="Role" sortable style={{ width: '15%' }} body={isLoading ? roleSkeletonTemplate : roleBodyTemplate} />
                        <Column field="createdAt" header="Created At" sortable style={{ width: '15%' }} body={isLoading ? dateSkeletonTemplate : dateBodyTemplate} />
                        <Column
                            header="Actions"
                            body={
                                isLoading
                                    ? actionsSkeletonTemplate
                                    : (rowData: User) => (
                                          <div className="flex gap-2">
                                              <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-button-sm" onClick={() => editUser(rowData)} disabled={deleteUserMutation.isLoading} />
                                              <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-sm" onClick={() => confirmDeleteUser(rowData)} disabled={deleteUserMutation.isLoading} />
                                          </div>
                                      )
                            }
                            style={{ width: '15%' }}
                        />
                    </DataTable>

                    <Dialog visible={userDialog} style={{ width: '450px' }} header={editingUserId ? 'Edit User' : 'Create User'} modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="firstName">First Name</label>
                            <InputText
                                id="firstName"
                                value={userForm.firstName}
                                onChange={(e) => onInputChange(e, 'firstName')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !userForm.firstName
                                })}
                            />
                            {submitted && !userForm.firstName && <small className="p-invalid">First name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="lastName">Last Name</label>
                            <InputText
                                id="lastName"
                                value={userForm.lastName}
                                onChange={(e) => onInputChange(e, 'lastName')}
                                required
                                className={classNames({
                                    'p-invalid': submitted && !userForm.lastName
                                })}
                            />
                            {submitted && !userForm.lastName && <small className="p-invalid">Last name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <InputText
                                id="email"
                                type="email"
                                value={userForm.email}
                                onChange={(e) => onInputChange(e, 'email')}
                                required
                                className={classNames({
                                    'p-invalid': submitted && !userForm.email
                                })}
                            />
                            {submitted && !userForm.email && <small className="p-invalid">Email is required.</small>}
                        </div>
                        {!editingUserId && (
                            <div className="field">
                                <label htmlFor="password">Password</label>
                                <Password
                                    id="password"
                                    value={userForm.password}
                                    onChange={(e) => onInputChange(e, 'password')}
                                    toggleMask
                                    feedback={false}
                                    required
                                    className={classNames({
                                        'p-invalid': submitted && !userForm.password
                                    })}
                                />
                                {submitted && !userForm.password && <small className="p-invalid">Password is required (min 6 characters).</small>}
                            </div>
                        )}
                        <div className="field">
                            <label htmlFor="role">Role</label>
                            <Dropdown id="role" value={userForm.role} options={roleOptions} onChange={onRoleChange} placeholder="Select a role" />
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default UserPage;
