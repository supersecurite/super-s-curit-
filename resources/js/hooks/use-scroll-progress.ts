import { useEffect, useState } from 'react';

export function useScrollProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        let rafId = 0;

        const update = () => {
            const scrollTop = window.scrollY;
            const docHeight =
                document.documentElement.scrollHeight - window.innerHeight;
            const next = docHeight > 0 ? scrollTop / docHeight : 0;
            setProgress(Math.min(Math.max(next, 0), 1));
            rafId = 0;
        };

        const handleScroll = () => {
            if (rafId) return;
            rafId = window.requestAnimationFrame(update);
        };

        update();
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
            if (rafId) window.cancelAnimationFrame(rafId);
        };
    }, []);

    return progress;
}
