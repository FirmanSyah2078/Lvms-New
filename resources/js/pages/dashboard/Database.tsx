import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import dashboard from '@/routes/dashboard';

// Impor komponen baru kita
import { VotersDataTable, voterSchema } from "@/components/data-table"; 
import { z } from 'zod';

// Breadcrumbs tetap sama
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Database',
        href: dashboard.database().url, 
    },
];

// Asumsikan controller Anda mengirim prop
interface DatabaseProps {
    voters: z.infer<typeof voterSchema>[];
    missingQueueNumbers: number[];
    categories: string[]; // ✅ Terima prop baru
}

export default function Database({ voters, missingQueueNumbers, categories }: DatabaseProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Database" />
            <div className="p-4 sm:p-6 lg:p-8">
            
                <VotersDataTable data={voters} missingQueueNumbers={missingQueueNumbers} categories={categories} />
            
            </div>
        </AppLayout>
    );
}
