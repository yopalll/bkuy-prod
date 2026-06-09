<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureCanPurchase
{
    /**
     * Cegah instruktur membeli kursus (cart / checkout). Instruktur tetap
     * boleh menjelajahi kursus — guard ini hanya menutup aksi pembelian.
     *
     * Mengembalikan JSON 403 untuk request API (cart.add via fetch) dan
     * redirect back dengan flash error untuk request Inertia (checkout).
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->isInstructor()) {
            $message = 'Instruktur tidak dapat membeli kursus. Anda hanya bisa menjelajahi kursus.';

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => $message,
                ], 403);
            }

            return redirect()->route('home')->with('error', $message);
        }

        return $next($request);
    }
}
