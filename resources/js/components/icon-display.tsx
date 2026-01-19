import { type LucideIcon } from 'lucide-react';

interface IconDisplayProps {
    icon: LucideIcon | string;
    className?: string;
}

export function IconDisplay({ icon, className }: IconDisplayProps) {
    // Jika 'icon' adalah string (untuk Boxicons)
    if (typeof icon === 'string') {
        return <i className={`${icon} ${className}`} />;
    }

    // Jika bukan, render sebagai komponen Lucide
    const IconComponent = icon;
    return <IconComponent className={className} />;
}