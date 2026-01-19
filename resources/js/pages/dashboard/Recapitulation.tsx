import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import dashboard from '@/routes/dashboard';

// Breadcrumbs untuk navigasi
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Recapitulation',
        href: dashboard.recapitulation().url, 
    },
];

export default function Recapitulation() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Recapitulation" />
            <div className="p-4">
                
            </div>
        </AppLayout>
    );
}