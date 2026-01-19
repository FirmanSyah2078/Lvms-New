import PengawasSidebarLayout from '@/layouts/pengawas/app-sidebar-layout'; // <-- Import layout pengawas
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface PengawasLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: PengawasLayoutProps) => (
    <PengawasSidebarLayout breadcrumbs={breadcrumbs} {...props}>
        {children}
    </PengawasSidebarLayout>
);