import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AppTopbarRef } from '@/types';
import { LayoutContext } from './context/layoutcontext';
import { AuthService } from '../services/AuthService';
import { trpc } from '../utils/trpc';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const router = useRouter();
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);

    const logoutMutation = trpc.auth.logout.useMutation();

    const handleLogout = async () => {
        try {
            // Call backend logout to blacklist tokens
            await logoutMutation.mutateAsync();
        } catch (error) {
            // Even if backend logout fails, still clear local tokens
            console.error('Logout error:', error);
        } finally {
            // Clear local tokens and redirect
            AuthService.clearTokens();
            router.push('/auth/login');
        }
    };

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    return (
        <div className="layout-topbar">
            <Link href="/" className="layout-topbar-logo">
                <img src={`/layout/images/logo-${layoutConfig.colorScheme !== 'light' ? 'white' : 'dark'}.svg`} width="47.22px" height={'35px'} alt="logo" />
                <span>ALOHA</span>
            </Link>

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>

            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                <button type="button" className="p-link layout-topbar-button">
                    <i className="pi pi-calendar"></i>
                    <span>Calendar</span>
                </button>
                <button type="button" className="p-link layout-topbar-button">
                    <i className="pi pi-user"></i>
                    <span>Profile</span>
                </button>
                <Link href="/documentation">
                    <button type="button" className="p-link layout-topbar-button">
                        <i className="pi pi-cog"></i>
                        <span>Settings</span>
                    </button>
                </Link>
                <button type="button" className="p-link layout-topbar-button" onClick={handleLogout}>
                    <i className="pi pi-sign-out"></i>
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
