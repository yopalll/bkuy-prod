import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.{js,jsx,ts,tsx}',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Plus Jakarta Sans', 'Figtree', ...defaultTheme.fontFamily.sans],
                'body-lg':      ['Plus Jakarta Sans'],
                'caption':      ['Plus Jakarta Sans'],
                'headline-lg':  ['Plus Jakarta Sans'],
                'headline-lg-mobile': ['Plus Jakarta Sans'],
                'display-lg':   ['Plus Jakarta Sans'],
                'label-md':     ['Plus Jakarta Sans'],
                'headline-md':  ['Plus Jakarta Sans'],
                'body-md':      ['Plus Jakarta Sans'],
            },
            fontSize: {
                'body-lg':           ['18px', { lineHeight: '28px', fontWeight: '400' }],
                'caption':           ['12px', { lineHeight: '16px', fontWeight: '500' }],
                'headline-lg':       ['32px', { lineHeight: '40px', fontWeight: '700' }],
                'headline-lg-mobile':['28px', { lineHeight: '36px', fontWeight: '700' }],
                'display-lg':        ['48px', { lineHeight: '56px', letterSpacing: '-0.02em', fontWeight: '800' }],
                'label-md':          ['14px', { lineHeight: '20px', letterSpacing: '0.01em', fontWeight: '600' }],
                'headline-md':       ['24px', { lineHeight: '32px', fontWeight: '700' }],
                'body-md':           ['16px', { lineHeight: '24px', fontWeight: '400' }],
            },
            borderRadius: {
                DEFAULT: '0.25rem',
                lg:  '0.5rem',
                xl:  '0.75rem',
                '2xl': '1rem',
                full: '9999px',
            },
            spacing: {
                'xxl':             '64px',
                'xs':              '4px',
                'md':              '16px',
                'margin-mobile':   '16px',
                'sm':              '8px',
                'base':            '4px',
                'margin-desktop':  '48px',
                'gutter':          '24px',
                'xl':              '32px',
                'lg':              '24px',
            },
            colors: {
                // Brand / design-system tokens (dari desain Vascha & Quinsha)
                'primary':                    '#300033',
                'primary-container':          '#4a154b',
                'primary-fixed':              '#ffd6f8',
                'primary-fixed-dim':          '#f6afef',
                'on-primary':                 '#ffffff',
                'on-primary-container':       '#be7db9',
                'on-primary-fixed':           '#370139',
                'on-primary-fixed-variant':   '#693168',
                'inverse-primary':            '#f6afef',

                'secondary':                  '#855400',
                'secondary-container':        '#ffb145',
                'secondary-fixed':            '#ffddb7',
                'secondary-fixed-dim':        '#ffb95c',
                'on-secondary':               '#ffffff',
                'on-secondary-container':     '#6f4600',
                'on-secondary-fixed':         '#2a1700',
                'on-secondary-fixed-variant': '#653e00',

                'tertiary':                   '#181814',
                'tertiary-container':         '#2d2c28',
                'tertiary-fixed':             '#e6e2db',
                'tertiary-fixed-dim':         '#c9c6c0',
                'on-tertiary':                '#ffffff',
                'on-tertiary-container':      '#95938d',
                'on-tertiary-fixed':          '#1c1c18',
                'on-tertiary-fixed-variant':  '#484742',

                'background':                 '#fcf9f8',
                'on-background':              '#1b1b1c',
                'surface':                    '#FFFFFF',
                'surface-dim':                '#dcd9d9',
                'surface-bright':             '#fcf9f8',
                'surface-variant':            '#e5e2e1',
                'surface-container-lowest':   '#ffffff',
                'surface-container-low':      '#f6f3f2',
                'surface-container':          '#f0eded',
                'surface-container-high':     '#eae7e7',
                'surface-container-highest':  '#e5e2e1',
                'surface-tint':               '#844981',
                'on-surface':                 '#1b1b1c',
                'on-surface-variant':         '#4f434c',
                'inverse-surface':            '#303030',
                'inverse-on-surface':         '#f3f0ef',

                'outline':                    '#80737d',
                'outline-variant':            '#d2c2cd',

                'error':                      '#D91E18',
                'error-container':            '#ffdad6',
                'on-error':                   '#ffffff',
                'on-error-container':         '#93000a',

                'success':                    '#2D8A56',
                'warning':                    '#E67E22',

                // legacy aliases yang dipakai komponen lain
                'background-subtle':           '#F8F5F2',
                'brand-bg-soft':              '#E2E8ED',
                'brand-cream-card':           '#FDF6ED',
                'brand-sidebar-light':        '#F9F6F0',
                'brand-text-dark':            '#2B3A4A',
                'brand-accent-blue':          '#3B5973',
            },
        },
    },

    plugins: [forms],
};
