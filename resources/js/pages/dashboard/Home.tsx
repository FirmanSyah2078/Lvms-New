import AppLayout from '@/layouts/app-layout';
import dashboard from '@/routes/dashboard';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { SectionCards } from "@/components/dsh/section-cards";
import { DashboardPemilihanSiswa } from "@/components/dsh/chartbar";

// Definisikan tipe data yang akan diterima dari Laravel
interface Stats {
    totalDpt: number;
    totalBallotsCast: number;
    remainingVoters: number;
    participationRate: number;
}

interface Siswa {
    namaKelas: string;
    tingkatan: number;
    lakiSudahMemilih: number;
    totalLaki: number;
    perempuanSudahMemilih: number;
    totalPerempuan: number;
}

interface HomeProps {
    stats: Stats;
    participationData: Siswa[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Home',
        href: dashboard.home().url,
    },
];

export default function Home({ stats, participationData }: HomeProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Home" />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2 p-4">
                    <div className="flex flex-col gap-4 py-4 px-4 md:gap-6 md:py-6 lg:px-6">
                        {/* Kirim data stats ke SectionCards */}
                        <SectionCards stats={stats} />
                        {/* Kirim data partisipasi ke chart */}
                        <DashboardPemilihanSiswa participationData={participationData} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
