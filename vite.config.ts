import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { local } from 'laravel-vite-plugin/fonts';
import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
    server: {
        host: '127.0.0.1',
        port: 5173,
        strictPort: true,
    },
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
            fonts: [
                local('Montserrat', {
                    variants: [400, 500, 600, 700, 800].map((weight) => ({
                        src: `resources/fonts/montserrat/montserrat-latin-${weight}-normal.woff2`,
                        weight,
                    })),
                    display: 'swap',
                }),
            ],
        }),
        // En `vite` (serve), le warm-up SSR démarre avant optimizeDeps et expire à 60s sur Windows.
        inertia({
            ssr: command === 'serve' ? false : undefined,
        }),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (!id.includes('node_modules')) {
                        return;
                    }

                    if (id.includes('recharts') || id.includes('d3-')) {
                        return 'charts';
                    }

                    if (id.includes('@radix-ui')) {
                        return 'ui';
                    }

                    if (id.includes('@inertiajs')) {
                        return 'inertia';
                    }

                    return 'vendor';
                },
            },
        },
    },
}));
