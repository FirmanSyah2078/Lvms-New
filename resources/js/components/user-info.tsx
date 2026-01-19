import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { type User } from '@/types';

export function UserInfo({ user }: { user: User }) {
    const getInitials = useInitials();
    
    if (!user) {
        return null;
    }

    // Fungsi kecil untuk membuat huruf pertama kapital
    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage src={user.avatar_url} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                {/* GANTI BARIS EMAIL DENGAN KODE INI UNTUK MENAMPILKAN ROLE */}
                <span className="truncate text-xs text-muted-foreground">
                    {capitalize(user.role)} Access
                </span>
            </div>
        </>
    );
}