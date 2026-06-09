<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Mail\NewSaleMail;
use App\Models\Cart;
use App\Models\Payment;
use App\Models\Order;
use App\Models\Coupon;
use App\Models\Enrollment;
use App\Models\User;
use App\Notifications\CoursePurchasedNotification;
use App\Notifications\NewSaleNotification;
use App\Services\MidtransService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    protected $midtrans;

    public function __construct(MidtransService $midtrans)
    {
        $this->midtrans = $midtrans;
    }

    /**
     * Display checkout page with current cart items and optional coupon.
     */
    public function index(Request $request): \Inertia\Response|RedirectResponse
    {
        $cartItems = Cart::where('user_id', auth()->id())
            ->with(['course.instructor', 'course.category'])
            ->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('cart.index')
                ->with('error', 'Keranjang belanja Anda kosong.');
        }

        $coupon = null;
        $discountAmount = 0;
        $subtotal = $cartItems->sum(function ($item) {
            return $item->course->discounted_price;
        });

        if ($request->filled('coupon_code')) {
            $coupon = Coupon::active()->where('code', $request->coupon_code)->first();
            if ($coupon) {
                // Apply coupon discount (global or specific course)
                foreach ($cartItems as $item) {
                    if (is_null($coupon->course_id) || $coupon->course_id == $item->course_id) {
                        $discountAmount += $item->course->discounted_price * ($coupon->discount_percent / 100);
                    }
                }
                session()->put('applied_coupon', $coupon->code);
            } else {
                session()->forget('applied_coupon');
                return redirect()->back()
                    ->with('error', 'Kupon tidak valid atau sudah kedaluwarsa.');
            }
        } else {
            session()->forget('applied_coupon');
        }

        $total = max(0, $subtotal - $discountAmount);

        return Inertia::render('Checkout/Index', [
            'cartItems'      => $cartItems,
            'coupon'         => $coupon,
            'subtotal'       => $subtotal,
            'discountAmount' => $discountAmount,
            'total'          => $total,
        ]);
    }

    /**
     * Process checkout, generate Midtrans Snap Token, and return checkout screen.
     */
    public function process(Request $request): \Inertia\Response|RedirectResponse
    {
        $cartItems = Cart::where('user_id', auth()->id())
            ->with(['course.instructor', 'course.category'])
            ->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('cart.index')
                ->with('error', 'Keranjang belanja Anda kosong.');
        }

        // Validate coupon if provided
        $coupon = null;
        if ($request->filled('coupon_code')) {
            $coupon = Coupon::active()->where('code', $request->coupon_code)->first();
            if (!$coupon) {
                return redirect()->back()
                    ->with('error', 'Kupon tidak valid atau sudah kedaluwarsa.');
            }
        }

        // Calculate exact total amount
        $totalAmount = 0;
        foreach ($cartItems as $item) {
            $price = $item->course->discounted_price;
            if ($coupon) {
                if (is_null($coupon->course_id) || $coupon->course_id == $item->course_id) {
                    $price = $price - ($price * ($coupon->discount_percent / 100));
                }
            }
            $totalAmount += (int) round($price);
        }

        // Generate Order ID format: BKUY-{timestamp}-{user_id}
        $midtransOrderId = 'BKUY-' . time() . '-' . auth()->id();

        try {
            DB::beginTransaction();

            // 1. Create Payment record in 'pending' status BEFORE fetching Snap token
            $payment = Payment::create([
                'user_id'          => auth()->id(),
                'coupon_id'        => $coupon?->id,
                'midtrans_order_id'=> $midtransOrderId,
                'total_amount'     => $totalAmount,
                'status'           => 'pending',
            ]);

            // 2. Snapshot Orders at process() time so handleSuccess() never reads from cart
            foreach ($cartItems as $item) {
                $course = $item->course;
                $originalPrice  = $course->price;
                $discountAmount = $course->price - $course->discounted_price;
                $finalPrice     = $course->discounted_price;

                if ($coupon) {
                    if (is_null($coupon->course_id) || $coupon->course_id == $course->id) {
                        $couponDiscount  = $finalPrice * ($coupon->discount_percent / 100);
                        $discountAmount += $couponDiscount;
                        $finalPrice     -= $couponDiscount;
                    }
                }

                Order::create([
                    'payment_id'      => $payment->id,
                    'user_id'         => auth()->id(),
                    'course_id'       => $course->id,
                    'instructor_id'   => $course->instructor_id,
                    'coupon_id'       => $coupon?->id,
                    'original_price'  => $originalPrice,
                    'discount_amount' => $discountAmount,
                    'final_price'     => (int) round($finalPrice),
                    'status'          => 'pending',
                ]);
            }

            // 3. Fetch Snap Token from Midtrans Service
            $snapToken = $this->midtrans->createSnapToken($cartItems, auth()->user(), $midtransOrderId, $coupon);

            DB::commit();

            $clientKey = config('midtrans.client_key');

            // Return Inertia page — React will auto-trigger snap.pay() via useEffect
            return Inertia::render('Checkout/Process', [
                'snapToken'   => $snapToken,
                'clientKey'   => $clientKey,
                'midtransOrderId' => $midtransOrderId,
                'totalAmount' => $totalAmount,
                'couponCode'  => $coupon ? $coupon->code : null,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Checkout processing failed: ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'trace'   => $e->getTraceAsString()
            ]);

            return redirect()->back()
                ->with('error', 'Gagal memproses pembayaran. Silakan coba beberapa saat lagi.');
        }
    }

    /**
     * Handle asynchronous Midtrans webhook callbacks.
     */
    public function callback(Request $request): JsonResponse
    {
        try {
            $notification = $this->midtrans->handleNotification();

            $orderId = $notification->order_id;
            $transactionStatus = $notification->transaction_status;
            $fraudStatus = $notification->fraud_status;
            $paymentType = $notification->payment_type;
            $transactionId = $notification->transaction_id;

            // Retrieve payment record created during process()
            $payment = Payment::where('midtrans_order_id', $orderId)->first();

            if (!$payment) {
                Log::warning('Payment record not found for Order ID: ' . $orderId);
                return response()->json(['message' => 'Payment not found'], 404);
            }

            $midtransRaw = json_decode($request->getContent(), true);

            // Update payment with Midtrans metadata
            $payment->update([
                'midtrans_transaction_id' => $transactionId,
                'payment_type' => $paymentType,
                'midtrans_response' => $midtransRaw,
            ]);

            // Handle transaction status mapping
            if ($transactionStatus == 'capture') {
                if ($fraudStatus == 'accept') {
                    $this->handleSuccess($payment);
                } elseif ($fraudStatus == 'challenge') {
                    $payment->update(['status' => 'pending']);
                }
            } elseif ($transactionStatus == 'settlement') {
                $this->handleSuccess($payment);
            } elseif ($transactionStatus == 'pending') {
                $payment->update(['status' => 'pending']);
            } elseif (in_array($transactionStatus, ['deny', 'cancel', 'expire', 'failure'])) {
                $payment->update(['status' => $transactionStatus]);
                
                // Update corresponding orders status to cancelled if they exist
                Order::where('payment_id', $payment->id)->update(['status' => 'cancelled']);
            }

            return response()->json(['status' => 'OK']);

        } catch (\Exception $e) {
            Log::error('Midtrans Callback Handling Failed: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['message' => 'Internal Server Error'], 500);
        }
    }

    /**
     * Process successful payment: Create Orders, Enroll student, Clear cart, update Coupon count.
     */
    private function handleSuccess(Payment $payment): void
    {
        DB::transaction(function () use ($payment) {
            // lockForUpdate: cegah race condition bila Midtrans kirim notifikasi ganda
            $fresh = Payment::lockForUpdate()->find($payment->id);

            if (!$fresh || in_array($fresh->status, ['settlement', 'capture'])) {
                return;
            }

            $fresh->update(['status' => 'settlement']);

            // Use snapshot Orders created at process() — never re-read from cart
            $orders = Order::where('payment_id', $fresh->id)
                ->with(['course', 'instructor'])
                ->get();

            $coupon = $fresh->coupon_id ? Coupon::find($fresh->coupon_id) : null;

            foreach ($orders as $order) {
                $order->update(['status' => 'completed']);

                // Grant access to the course
                Enrollment::firstOrCreate([
                    'user_id'   => $fresh->user_id,
                    'course_id' => $order->course_id,
                ], [
                    'order_id'    => $order->id,
                    'enrolled_at' => now(),
                ]);

                // Email + in-app notification to instructor
                if ($order->instructor && $order->instructor->email) {
                    Mail::to($order->instructor->email)->queue(new NewSaleMail($order));
                }
                if ($order->instructor) {
                    $order->instructor->notify(new NewSaleNotification($order));
                }

                // In-app notification to buyer
                $buyer = User::find($fresh->user_id);
                if ($buyer) {
                    $buyer->notify(new CoursePurchasedNotification($order));
                }
            }

            // Increment coupon usage count if used
            if ($coupon) {
                $coupon->increment('used_count');
            }

            // Clear Cart now that orders are finalised
            Cart::where('user_id', $fresh->user_id)->delete();
        });
    }

    /**
     * Payment Success Page.
     *
     * Juga berfungsi sebagai fallback processor: jika webhook Midtrans belum
     * tiba (mis. local dev / delay), verifikasi transaksi langsung ke Midtrans
     * API dan jalankan handleSuccess() bila sudah settlement/capture.
     */
    public function success(Request $request): \Inertia\Response|\Illuminate\Http\RedirectResponse
    {
        $orderId   = $request->query('order_id');
        $txStatus  = $request->query('transaction_status', '');

        // Midtrans menyertakan transaction_status di query string redirect URL.
        // Jika cancel / expire / deny / failure → tampilkan halaman gagal.
        $failedStatuses = ['cancel', 'expire', 'deny', 'failure'];
        if ($txStatus && in_array($txStatus, $failedStatuses)) {
            return redirect()->route('payment.failed', ['order_id' => $orderId]);
        }

        $payment = null;
        $orders  = [];

        if ($orderId) {
            $payment = Payment::where('midtrans_order_id', $orderId)
                ->with('user')
                ->first();

            if ($payment && $payment->status === 'pending') {
                try {
                    $verified = $this->midtrans->verifyTransaction($orderId);
                    $vStatus  = $verified->transaction_status ?? '';
                    $fStatus  = $verified->fraud_status ?? 'accept';

                    if ($vStatus === 'settlement' ||
                        ($vStatus === 'capture' && $fStatus === 'accept')) {
                        $this->handleSuccess($payment);
                        $payment->refresh();
                    } elseif (in_array($vStatus, $failedStatuses)) {
                        // Webhook belum tiba tapi Midtrans sudah konfirmasi gagal
                        return redirect()->route('payment.failed', ['order_id' => $orderId]);
                    }
                } catch (\Exception $e) {
                    Log::warning('Midtrans verify on success page failed: ' . $e->getMessage(), [
                        'order_id' => $orderId,
                    ]);
                }
            }

            // Payment sudah diproses webhook sebelumnya dan statusnya gagal
            if ($payment && in_array($payment->status, $failedStatuses)) {
                return redirect()->route('payment.failed', ['order_id' => $orderId]);
            }

            if ($payment) {
                $orders = Order::where('payment_id', $payment->id)
                    ->with('course:id,title,thumbnail,slug')
                    ->get();
            }
        }

        return Inertia::render('Payment/Success', [
            'payment' => $payment,
            'orders'  => $orders,
        ]);
    }

    /**
     * Payment Failed Page.
     */
    public function failed(Request $request): \Inertia\Response
    {
        $orderId = $request->query('order_id');
        $payment = null;

        if ($orderId) {
            $payment = Payment::where('midtrans_order_id', $orderId)->first();
        }

        return Inertia::render('Payment/Failed', [
            'payment' => $payment,
        ]);
    }
}
