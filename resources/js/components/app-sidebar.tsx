// app-sidebar.tsx

import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';

import AppLogo from './app-logo';
import dashboard from '@/routes/dashboard';


const mainNavItems: NavItem[] = [
    {
        title: 'Home',
        href: dashboard.home(),
        icon: 'bx bxs-dashboard bx-tada-hover',
    },
    {
        title: 'Database',
        href: dashboard.database(),
        icon: 'bx bx-search bx-tada-hover',
    },
    {
        title: 'Callroom',
        href: dashboard.callroom(), 
        icon: 'bx bx-list-check bx-tada-hover',
    },
    {
        title: 'Candidates',   
        href: dashboard.candidates(),
        icon: 'bx bx-user-check bx-tada-hover',
    },
    {
        title: 'Recapitulation',
        href: dashboard.recapitulation(),
        icon: 'bx  bx-bar-chart bx-tada-hover',
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: 'bx bxl-github',
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: 'bx bxs-book',
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard.home()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}