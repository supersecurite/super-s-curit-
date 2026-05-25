import { type CSSProperties, type ElementType, type ReactNode } from 'react';
import { useInView } from '@/hooks/use-in-view';
import { cn } from '@/lib/utils';

type RevealProps = {
    children: ReactNode;
    as?: ElementType;
    className?: string;
    delay?: number;
    variant?: 'slide' | 'fade';
    threshold?: number;
};

export default function Reveal({
    children,
    as: Tag = 'div',
    className,
    delay = 0,
    variant = 'slide',
    threshold = 0.2,
}: RevealProps) {
    const { ref, isVisible } = useInView<HTMLDivElement>({ threshold });

    const style = { '--reveal-delay': `${delay}ms` } as CSSProperties;

    return (
        <Tag
            ref={ref}
            data-visible={isVisible}
            style={style}
            className={cn(
                variant === 'slide' ? 'marketing-reveal' : 'marketing-reveal-fade',
                className,
            )}
        >
            {children}
        </Tag>
    );
}
