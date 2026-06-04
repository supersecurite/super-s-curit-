import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';

const SCROLL_THRESHOLD = 400;

export default function BackToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > SCROLL_THRESHOLD);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    if (!visible) {
        return null;
    }

    return (
        <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Retour en haut de la page"
            className="fixed right-6 bottom-6 z-50 flex size-11 items-center justify-center rounded-full border border-super-securite-border bg-super-securite-surface text-super-securite-heading shadow-lg shadow-slate-900/10 transition-colors duration-200 hover:border-super-securite-accent hover:bg-super-securite-accent hover:text-white focus-visible:ring-2 focus-visible:ring-super-securite-accent focus-visible:outline-none"
        >
            <ArrowUp className="size-5" aria-hidden />
        </button>
    );
}
