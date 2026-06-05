import type { ImgHTMLAttributes } from 'react';
import { superSecuriteImages } from '@/data/super-securite-images';

export default function AppLogoIcon({
    alt = 'Super Sécurité',
    className,
    ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src={superSecuriteImages.brand}
            alt={alt}
            className={className ?? 'h-full w-auto object-contain'}
            {...props}
        />
    );
}
