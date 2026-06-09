import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import Swal from 'sweetalert2';

// Mengonsumsi shared prop `flash` (success/error/info/warning) yang dibagikan
// oleh app/Http/Middleware/HandleInertiaRequests.php.
export default function FlashToast() {
    const { flash } = usePage().props;

    useEffect(() => {
        if (!flash) return;
        const toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3500,
            timerProgressBar: true,
        });

        if (flash.success) toast.fire({ icon: 'success', title: flash.success });
        if (flash.error) toast.fire({ icon: 'error', title: flash.error });
        if (flash.info) toast.fire({ icon: 'info', title: flash.info });
        if (flash.warning) toast.fire({ icon: 'warning', title: flash.warning });
    }, [flash]);

    return null;
}
