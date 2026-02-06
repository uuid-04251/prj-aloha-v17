'use client';

import { AuthGuard } from '../components/AuthGuard';
import Layout from '../layout/layout';

interface ProtectedLayoutProps {
    children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
    return (
        <AuthGuard>
            <Layout>{children}</Layout>
        </AuthGuard>
    );
}
