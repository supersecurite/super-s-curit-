export function toAbsoluteShareUrl(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }

    if (typeof window === 'undefined') {
        return url;
    }

    return new URL(url, window.location.origin).toString();
}

export function buildFacebookShareUrl(url: string): string {
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
}

export function buildLinkedInShareUrl(url: string): string {
    return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
}

export function buildWhatsAppShareUrl(url: string, title: string): string {
    return `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;
}

export function buildXShareUrl(url: string, title: string): string {
    return `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
}

export function buildEmailShareUrl(
    url: string,
    title: string,
    description?: string,
): string {
    const body = description ? `${description}\n\n${url}` : url;

    return `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
}
