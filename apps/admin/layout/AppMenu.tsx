import React from 'react';
import AppMenuitem from './AppMenuitem';
import { MenuProvider } from './context/menucontext';
import { AppMenuItem } from '@/types';

const AppMenu = () => {
    // const { layoutConfig } = useContext(LayoutContext);

    const model: AppMenuItem[] = [
        {
            label: 'Dashboard',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: 'Management',
            items: [
                { label: 'Users', icon: 'pi pi-fw pi-users', to: '/pages/user' },
                { label: 'Products', icon: 'pi pi-fw pi-box', to: '/pages/product' },
                { label: 'Categories', icon: 'pi pi-fw pi-tags', to: '/pages/category' }
            ]
        },
        {
            label: 'Authentication',
            items: [
                { label: 'Login', icon: 'pi pi-fw pi-sign-in', to: '/auth/login' },
                { label: 'Access', icon: 'pi pi-fw pi-lock', to: '/auth/access' },
                { label: 'Error', icon: 'pi pi-fw pi-exclamation-triangle', to: '/auth/error' }
            ]
        },
        {
            label: 'Pages',
            items: [{ label: 'Not Found', icon: 'pi pi-fw pi-question-circle', to: '/pages/notfound' }]
        }
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
