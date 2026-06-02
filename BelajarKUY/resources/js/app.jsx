import './bootstrap';
import './i18n';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { route } from 'ziggy-js';

const appName = import.meta.env.VITE_APP_NAME || 'BelajarKUY';

createInertiaApp({
    title: (title) => (title ? `${title} — ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        // Daftarkan route() secara global dengan data Ziggy dari Inertia
        window.route = (name, params, absolute) =>
            route(name, params, absolute, props.initialPage.props.ziggy);

        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: '#4F46E5',
    },
});
