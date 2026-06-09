import AppHeader from '@/Components/AppHeader';
import AppFooter from '@/Components/AppFooter';
import FlashToast from '@/Components/FlashToast';

// Layout publik (Konteks_A) untuk halaman React+Inertia.
export default function AppLayout({ children }) {
    return (
        <div className="min-h-screen bg-background font-sans text-on-background">
            <FlashToast />
            <AppHeader />
            <main>{children}</main>
            <AppFooter />
        </div>
    );
}
