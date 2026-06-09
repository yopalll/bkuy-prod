// Konfigurasi i18next untuk BelajarKUY (L1 - Vascha).
// Default language: 'id' (Bahasa Indonesia), fallback: 'en'.
// Cara pakai di komponen:
//   import { useTranslation } from 'react-i18next';
//   const { t } = useTranslation();
//   t('nav.login')  →  "Masuk" (id) | "Login" (en)

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import id from './locales/id.json';
import en from './locales/en.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            id: { translation: id },
            en: { translation: en },
        },
        lng: 'id',           // bahasa default BelajarKUY
        fallbackLng: 'en',   // fallback jika key tidak ada di 'id'
        interpolation: {
            escapeValue: false, // React sudah aman dari XSS
        },
    });

export default i18n;
