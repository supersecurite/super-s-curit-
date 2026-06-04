import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
            fonts: [
                bunny('DM Sans', {
                    weights: [400, 500, 600],
                    display: 'swap',
                }),
                bunny('Space Grotesk', {
                    weights: [600, 700],
                    display: 'swap',
                }),
            ],
        }),
        inertia(),
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
});
