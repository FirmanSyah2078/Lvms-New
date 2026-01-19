import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import dashboard from '@/routes/dashboard';

// Breadcrumbs untuk navigasi
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Candidates',
        href: dashboard.candidates().url, 
    },
];

export default function Candidates() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Candidates" />
            <div className="p-4">
                
            </div>
        </AppLayout>
    );
}