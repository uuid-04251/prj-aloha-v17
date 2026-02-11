'use client';
import { LayoutProvider } from '../layout/context/layoutcontext';
import { PrimeReactProvider } from 'primereact/api';
import { TRPCReactProvider } from '../providers/TRPCReactProvider';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';

interface RootLayoutProps {
    children: React.ReactNode;
}

function RootLayoutContent({ children }: RootLayoutProps) {
    // Remove useAuthTokenRefresh from root level to prevent SSR issues
    // It will be enabled in authenticated pages only

    return (
        <PrimeReactProvider>
            <TRPCReactProvider>
                <LayoutProvider>{children}</LayoutProvider>
            </TRPCReactProvider>
        </PrimeReactProvider>
    );
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link id="theme-css" href={`/themes/lara-light-blue/theme.css`} rel="stylesheet"></link>
            </head>
            <body>
                <RootLayoutContent>{children}</RootLayoutContent>
            </body>
        </html>
    );
}
