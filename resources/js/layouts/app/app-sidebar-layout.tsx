import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem, type SharedData } from '@/types'; // ✅ Tambah import SharedData
import { type PropsWithChildren } from 'react';
import { usePage } from '@inertiajs/react'; // ✅ Import usePage
import { PengawasSidebar } from '@/components/pengawas/app-sidebar'; // ✅ Import sidebar pengawas

export default function AppSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    // ✅ Dapatkan data user dari Inertia
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    return (
        <AppShell variant="sidebar">
            {/* ✅ Logika Kondisional: Tampilkan sidebar berdasarkan role */}
            {user && user.role === 'pengawas' ? <PengawasSidebar /> : <AppSidebar />}

            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}