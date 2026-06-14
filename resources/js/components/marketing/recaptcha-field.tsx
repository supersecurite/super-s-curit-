import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
} from 'react';
import { cn } from '@/lib/utils';

type RecaptchaFieldProps = {
    siteKey: string;
    language?: string;
    onChange: (token: string) => void;
    onExpired?: () => void;
    className?: string;
};

export type RecaptchaFieldHandle = {
    reset: () => void;
};

type Grecaptcha = {
    render: (
        container: HTMLElement,
        options: {
            sitekey: string;
            callback?: (token: string) => void;
            'expired-callback'?: () => void;
        },
    ) => number;
    reset: (widgetId?: number) => void;
};

declare global {
    interface Window {
        grecaptcha?: Grecaptcha;
        onRecaptchaLoad?: () => void;
    }
}

const RecaptchaField = forwardRef<RecaptchaFieldHandle, RecaptchaFieldProps>(
    function RecaptchaField(
        { siteKey, language = 'fr', onChange, onExpired, className },
        ref,
    ) {
        const containerRef = useRef<HTMLDivElement>(null);
        const widgetIdRef = useRef<number | null>(null);

        useImperativeHandle(ref, () => ({
            reset: () => {
                if (widgetIdRef.current !== null) {
                    window.grecaptcha?.reset(widgetIdRef.current);
                }

                onChange('');
            },
        }));

        useEffect(() => {
            const renderWidget = () => {
                if (
                    !containerRef.current ||
                    widgetIdRef.current !== null ||
                    !window.grecaptcha
                ) {
                    return;
                }

                widgetIdRef.current = window.grecaptcha.render(
                    containerRef.current,
                    {
                        sitekey: siteKey,
                        callback: (token) => onChange(token),
                        'expired-callback': () => {
                            onChange('');
                            onExpired?.();
                        },
                    },
                );
            };

            if (window.grecaptcha?.render) {
                renderWidget();
            } else {
                window.onRecaptchaLoad = renderWidget;

                const scriptId = `recaptcha-script-${language}`;

                if (!document.getElementById(scriptId)) {
                    const script = document.createElement('script');
                    script.id = scriptId;
                    script.src = `https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit&hl=${encodeURIComponent(language)}`;
                    script.async = true;
                    script.defer = true;
                    document.head.appendChild(script);
                }
            }

            return () => {
                if (window.onRecaptchaLoad === renderWidget) {
                    delete window.onRecaptchaLoad;
                }
            };
        }, [language, onChange, onExpired, siteKey]);

        return <div ref={containerRef} className={cn(className)} />;
    },
);

export default RecaptchaField;
