import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import AppLogo from '../app-logo';

// ✅ PERBAIKAN UTAMA:
// Daripada memanggil route() yang tidak tersedia, kita gunakan string path langsung.
// Ini aman karena rute untuk halaman utama pengawas jarang berubah.
const pengawasNavItems: NavItem[] = [
    {
        title: 'Pengawas',
        href: '/pengawas', // <-- Menggunakan string path statis
        icon: 'bx bxs-user-detail bx-tada-hover',
    },
];

const footerNavItems: NavItem[] = [
    { title: 'Repository', href: '#', icon: 'bx bxl-github' },
    { title: 'Documentation', href: '#', icon: 'bx bxs-book' },
];

export function PengawasSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            {/* Menggunakan string path statis di sini juga */}
                            <Link href="/pengawas" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={pengawasNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}