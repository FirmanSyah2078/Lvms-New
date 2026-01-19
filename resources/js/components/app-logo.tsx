import { usePage } from '@inertiajs/react';
import AppLogoIcon from './app-logo-icon';
import { type SharedData } from '@/types';

export default function AppLogo() {
    const { app } = usePage<SharedData>().props;
    const version = app?.version || ''; 

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
            </div>
            
            <div className="ml-1 flex flex-1 items-center text-left">
                
                <span className="truncate text-base font-bold leading-tight">
                    LVMS
                </span>
                
                {version && (
                    <span className="ml-3 rounded-md bg-neutral-200 px-1.5 py-0.5 text-[11px] font-mono text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300">
                        v{version}
                    </span>
                )}
            </div>
        </>
    );
}