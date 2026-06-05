<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Inertia: wajib ada di web group agar auth & shared props dikirim ke React
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
        ]);
        $middleware->alias([
            'role' => \App\Http\Middleware\RoleMiddleware::class,
        ]);
        // L9: Midtrans callback tidak mengirim CSRF token — WAJIB di-exclude (ADR-004)
        $middleware->validateCsrfTokens(except: [
            '/payment/callback',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Semua HTTP error → React error pages via Inertia
        $exceptions->respond(function (\Symfony\Component\HttpFoundation\Response $response, \Throwable $e, \Illuminate\Http\Request $request) {
            $status  = $response->getStatusCode();
            $handled = [403, 404, 419, 429, 500, 503];

            if (in_array($status, $handled)) {
                return \Inertia\Inertia::render("Errors/{$status}")
                    ->toResponse($request)
                    ->setStatusCode($status);
            }

            return $response;
        });
    })
    ->create();
