'use client';
import React, { useEffect, useRef, useState } from 'react';
import { classNames } from 'primereact/utils';
import { UserService, User } from '../../../../services/UserService';
import { confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import dynamic from 'next/dynamic';

// Dynamic imports for PrimeReact components
const DataTable = dynamic(() => import('primereact/datatable').then(mod => ({ default: mod.DataTable })));
const Column = dynamic(() => import('primereact/column').then(mod => ({ default: mod.Column })));
const Button = dynamic(() => import('primereact/button').then(mod => ({ default: mod.Button })));
const Dialog = dynamic(() => import('primereact/dialog').then(mod => ({ default: mod.Dialog })));
const InputText = dynamic(() => import('primereact/inputtext').then(mod => ({ default: mod.InputText })));
const Dropdown = dynamic(() => import('primereact/dropdown').then(mod => ({ default: mod.Dropdown })));
const ConfirmDialog = dynamic(() => import('primereact/confirmdialog').then(mod => ({ default: mod.ConfirmDialog })));
const Skeleton = dynamic(() => import('primereact/skeleton').then(mod => ({ default: mod.Skeleton })));

const UserPage = () => {
    let emptyUser: User = {
        id: '',
        name: '',
        email: '',
        role: '',
        status: 'active',
        createdAt: ''
    };

    const [users, setUsers] = useState<User[]>([]);
    const [userDialog, setUserDialog] = useState(false);
    const [user, setUser] = useState<User>(emptyUser);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const toast = useRef<Toast>(null);

    useEffect(() => {
        UserService.getUsers().then((data: User[]) => {
            setUsers(data);
            setLoading(false);
        });
    }, []);

    const openNew = () => {
        setUser(emptyUser);
        setSubmitted(false);
        setUserDialog(true);
    };

    const editUser = (user: User) => {
        setUser({ ...user });
        setUserDialog(true);
    };

    const confirmDeleteUser = (user: User) => {
        confirmDialog({
            message: 'Are you sure you want to delete this user?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => deleteUser(user)
        });
    };

    const deleteUser = (user: User) => {
        UserService.deleteUser(user.id)
            .then(() => {
                setUsers(users.filter((u) => u.id !== user.id));
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'User Deleted',
                    life: 3000
                });
            })
            .catch((_error) => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to delete user',
                    life: 3000
                });
            });
    };

    const hideDialog = () => {
        setSubmitted(false);
        setUserDialog(false);
    };

    const saveUser = () => {
        setSubmitted(true);

        if (user.name.trim() && user.email.trim() && user.role.trim()) {
            if (user.id) {
                // Update existing user
                UserService.updateUser(user)
                    .then((updatedUser: User) => {
                        setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
                        toast.current?.show({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'User Updated',
                            life: 3000
                        });
                    })
                    .catch((_error) => {
                        toast.current?.show({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to update user',
                            life: 3000
                        });
                    });
            } else {
                // Create new user
                UserService.createUser(user).then((newUser: User) => {
                    setUsers([...users, newUser]);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'User Created',
                        life: 3000
                    });
                });
            }
            setUserDialog(false);
            setUser(emptyUser);
        }
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _user = { ...user };
        if (name === 'status') {
            _user.status = val as 'active' | 'inactive';
        } else {
            (_user as any)[name] = val;
        }
        setUser(_user);
    };

    const onStatusChange = (e: any) => {
        let _user = { ...user };
        _user.status = e.value;
        setUser(_user);
    };

    const onRoleChange = (e: any) => {
        let _user = { ...user };
        _user.role = e.value;
        setUser(_user);
    };

    const statusBodyTemplate = (rowData: User) => {
        return <span className={`product-badge status-${rowData.status}`}>{rowData.status}</span>;
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

    const userDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveUser} />
        </>
    );

    const statusOptions = [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' }
    ];

    const roleOptions = [
        { label: 'Admin', value: 'Admin' },
        { label: 'User', value: 'User' },
        { label: 'Moderator', value: 'Moderator' }
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
                    <DataTable value={loading ? Array.from({ length: 10 }, () => ({})) : users} paginator rows={10} tableStyle={{ minWidth: '50rem' }} paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink" header={header}>
                        <Column field="name" header="Name" sortable style={{ width: '25%' }} body={loading ? nameSkeletonTemplate : undefined}></Column>
                        <Column field="email" header="Email" sortable style={{ width: '25%' }} body={loading ? emailSkeletonTemplate : undefined}></Column>
                        <Column field="role" header="Role" sortable style={{ width: '20%' }} body={loading ? roleSkeletonTemplate : undefined}></Column>
                        <Column field="status" header="Status" body={loading ? statusSkeletonTemplate : statusBodyTemplate} sortable style={{ width: '15%' }}></Column>
                        <Column field="createdAt" header="Created At" sortable style={{ width: '15%' }} body={loading ? dateSkeletonTemplate : undefined}></Column>
                        <Column
                            header="Actions"
                            body={
                                loading
                                    ? actionsSkeletonTemplate
                                    : (rowData: User) => (
                                          <div className="flex gap-2">
                                              <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-button-sm" onClick={() => editUser(rowData)} />
                                              <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-sm" onClick={() => confirmDeleteUser(rowData)} />
                                          </div>
                                      )
                            }
                            style={{ width: '15%' }}
                        ></Column>
                    </DataTable>

                    <Dialog visible={userDialog} style={{ width: '450px' }} header="User Details" modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText
                                id="name"
                                value={user.name}
                                onChange={(e) => onInputChange(e, 'name')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !user.name
                                })}
                            />
                            {submitted && !user.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <InputText
                                id="email"
                                value={user.email}
                                onChange={(e) => onInputChange(e, 'email')}
                                required
                                className={classNames({
                                    'p-invalid': submitted && !user.email
                                })}
                            />
                            {submitted && !user.email && <small className="p-invalid">Email is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="role">Role</label>
                            <Dropdown
                                id="role"
                                value={user.role}
                                options={roleOptions}
                                onChange={onRoleChange}
                                placeholder="Select a role"
                                required
                                className={classNames({
                                    'p-invalid': submitted && !user.role
                                })}
                            />
                            {submitted && !user.role && <small className="p-invalid">Role is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="status">Status</label>
                            <Dropdown id="status" value={user.status} options={statusOptions} onChange={onStatusChange} placeholder="Select status" />
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default UserPage;
