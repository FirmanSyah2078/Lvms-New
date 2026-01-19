import { Head, usePage } from '@inertiajs/react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import UpdateProfile from '@/components/UpdateProfile'; // Impor komponen baru
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem, type SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Profile settings',
    href: '/settings/profile',
  },
];

export default function Profile() {
  const { auth } = usePage<SharedData>().props;
  const user = auth.user;

  // Tampilkan loading jika data user belum ada
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Profile settings" />

      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall
            title="Profile Information"
            description="Update your username and profile avatar"
          />
          <UpdateProfile user={user} />
          <DeleteUser />
          
        </div>

      </SettingsLayout>
    </AppLayout>
  );
}