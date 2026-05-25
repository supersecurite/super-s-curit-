import { useEffect, useRef, useState } from 'react';

type UseInViewOptions = {
    threshold?: number;
    rootMargin?: string;
    once?: boolean;
};

export function useInView<T extends Element = HTMLDivElement>({
    threshold = 0.15,
    rootMargin = '0px 0px -10% 0px',
    once = true,
}: UseInViewOptions = {}) {
    const ref = useRef<T | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;

        if (!element || typeof IntersectionObserver === 'undefined') {
            setIsVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (once) {
                        observer.unobserve(entry.target);
                    }
                } else if (!once) {
                    setIsVisible(false);
                }
            },
            { threshold, rootMargin },
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [threshold, rootMargin, once]);

    return { ref, isVisible } as const;
}
