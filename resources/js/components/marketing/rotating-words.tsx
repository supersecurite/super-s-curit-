import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type RotatingWordsProps = {
    words: readonly string[];
    interval?: number;
    className?: string;
};

export default function RotatingWords({
    words,
    interval = 2600,
    className,
}: RotatingWordsProps) {
    const [index, setIndex] = useState(0);
    const [reduceMotion, setReduceMotion] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => setReduceMotion(mq.matches);
        update();
        mq.addEventListener('change', update);
        return () => mq.removeEventListener('change', update);
    }, []);

    useEffect(() => {
        if (reduceMotion || words.length <= 1) {
            return;
        }

        const id = window.setInterval(() => {
            setIndex((i) => (i + 1) % words.length);
        }, interval);

        return () => window.clearInterval(id);
    }, [interval, words.length, reduceMotion]);

    const longest = words.reduce((a, b) => (a.length > b.length ? a : b));

    return (
        <span
            className={cn('marketing-rotating-slot', className)}
            aria-live="polite"
        >
            <span
                aria-hidden
                className="invisible block whitespace-nowrap pe-[0.15em] leading-[inherit]"
            >
                {longest}
            </span>

            <span className="marketing-rotating-layer" aria-hidden>
                {words.map((word, i) => (
                    <span
                        key={word}
                        className={cn(
                            'marketing-gradient-text marketing-rotating-word',
                            i === index && 'is-active',
                            reduceMotion && i !== index && 'hidden',
                        )}
                    >
                        {word}
                    </span>
                ))}
            </span>

            <span className="sr-only">{words[index]}</span>
        </span>
    );
}
