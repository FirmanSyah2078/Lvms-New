// File: index.tsx
import React, { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import PengawasLayout from '@/layouts/pengawas/app-layout';
import { SharedData, Peserta, BreadcrumbItem } from '@/types';
import 'boxicons/css/boxicons.min.css';

import TableControls from '@/components/pengawas/TableControls';
import { PengawasDataTable } from '@/components/pengawas/PengawasDataTable';
import Heading from '@/components/heading';

interface PengawasPageProps extends SharedData {
    peserta: Peserta[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Pengawas', href: '/pengawas' },
];

export default function PengawasPage({ peserta }: PengawasPageProps) {
    const [filter, setFilter] = useState('all');
    const [searchTerm] = useState('');

    const filteredPeserta = useMemo(() => {
        return peserta
            .filter(p => {
                if (filter === 'all') return true;
                if (filter === 'guru') return p.kategori.toLowerCase().includes('guru');
                return !p.kategori.toLowerCase().includes('guru');
            })
            .filter(p =>
                p.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.nis_nip.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [peserta, filter, searchTerm]);

    return (
        <PengawasLayout breadcrumbs={breadcrumbs}>
            <Head title="Supervisor Area" />

            <div className="p-4 sm:p-6 lg:p-8">
                <Heading
                    title="Voter Management"
                    description="Perform attendance, record presence, and manage voter data in real-time."
                />
                <div className="mt-6 space-y-6">
                    {/* ✅ PERBAIKAN: Hapus props yang tidak diperlukan */}
                    <TableControls
                        filter={filter}
                        setFilter={setFilter}
                    />
                    <PengawasDataTable data={filteredPeserta} />
                </div>
            </div>
        </PengawasLayout>
    );
}