<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\OtpService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OtpVerificationController extends Controller
{
    public function __construct(private OtpService $otp) {}

    public function show(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('Auth/VerifyOtp', [
            'email' => $request->user()->email,
        ]);
    }

    public function verify(Request $request)
    {
        $request->validate(['code' => ['required', 'digits:6']]);

        $result = $this->otp->verify($request->user(), $request->code);

        if (!$result['ok']) {
            return back()->withErrors(['code' => $result['message']]);
        }

        return redirect()->intended(route('dashboard'))->with('success', $result['message']);
    }

    public function resend(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->route('dashboard');
        }

        $this->otp->sendTo($request->user());

        return back()->with('success', 'Kode baru sudah dikirim ke email kamu.');
    }
}
