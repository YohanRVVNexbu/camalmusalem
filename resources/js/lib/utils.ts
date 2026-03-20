import type { InertiaLinkProps } from '@inertiajs/react';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

/**
 * Rewrites absolute URLs from the local domain to the current host.
 * Fixes storage/media URLs when accessed through ngrok or other proxies.
 */
export function assetUrl(url: string | undefined | null): string {
    if (!url) return '';
    // Replace any http(s)://camalmusalem.test with the current origin
    return url.replace(/https?:\/\/camalmusalem\.test/g, window.location.origin);
}
