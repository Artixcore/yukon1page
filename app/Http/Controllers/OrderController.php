<?php

namespace App\Http\Controllers;

use App\Mail\OrderConfirmation;
use App\Mail\OrderNotification;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    /**
     * Verify Cloudflare Turnstile CAPTCHA token.
     */
    private function verifyTurnstile($token, $ip = null)
    {
        $siteKey = config('turnstile.site_key');
        $secretKey = config('turnstile.secret_key');

        // Skip validation if Turnstile is not configured
        if (empty($siteKey) || empty($secretKey)) {
            return ['success' => true, 'message' => 'Turnstile not configured'];
        }

        if (empty($token)) {
            return [
                'success' => false,
                'message' => 'CAPTCHA token is missing',
                'error_codes' => ['missing-input-response']
            ];
        }

        try {
            $clientIp = $ip ?? $this->getClientIp(request());
            
            $response = Http::asForm()->post(config('turnstile.verify_url'), [
                'secret' => $secretKey,
                'response' => $token,
                'remoteip' => $clientIp,
            ]);

            $result = $response->json();

            if (!$result || !isset($result['success'])) {
                return [
                    'success' => false,
                    'message' => 'Invalid response from CAPTCHA service',
                    'error_codes' => ['invalid-response']
                ];
            }

            return [
                'success' => $result['success'],
                'message' => $result['success'] ? 'CAPTCHA verified' : 'CAPTCHA verification failed',
                'error_codes' => $result['error-codes'] ?? []
            ];
        } catch (\Exception $e) {
            Log::error('Turnstile verification error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'CAPTCHA verification service unavailable',
                'error_codes' => ['service-error']
            ];
        }
    }

    /**
     * Get client IP address.
     */
    private function getClientIp($request)
    {
        return $request->ip() ?? 
               $request->header('CF-Connecting-IP') ?? 
               $request->header('X-Forwarded-For') ?? 
               $request->header('X-Real-IP') ?? 
               '0.0.0.0';
    }

    /**
     * Store a newly created order in storage.
     */
    public function store(Request $request)
    {
        // Verify CAPTCHA if Turnstile is configured
        if (config('turnstile.site_key') && config('turnstile.secret_key')) {
            $captchaToken = $request->input('cf-turnstile-response');
            $captchaVerification = $this->verifyTurnstile($captchaToken, $this->getClientIp($request));

            if (!$captchaVerification['success']) {
                return response()->json([
                    'success' => false,
                    'message' => 'CAPTCHA verification failed',
                    'errors' => [
                        'captcha' => ['অনুগ্রহ করে CAPTCHA সম্পন্ন করুন। দয়া করে পৃষ্ঠাটি রিফ্রেশ করুন এবং আবার চেষ্টা করুন।']
                    ]
                ], 422);
            }
        }

        $validator = Validator::make($request->all(), [
            'fullName' => 'required|string|min:2|max:255',
            'email' => 'required|email|max:255',
            'phoneNumber' => 'required|string|regex:/^[0-9]{10,11}$/',
            'fullAddress' => 'required|string|min:10',
            'location' => 'required|in:Inside Dhaka,Outside Dhaka',
            'productType' => 'required|in:single,combo2,combo3',
        ], [
            'fullName.required' => 'অনুগ্রহ করে আপনার পুরো নাম লিখুন',
            'fullName.min' => 'নাম কমপক্ষে ২ অক্ষর হতে হবে',
            'email.required' => 'অনুগ্রহ করে একটি ইমেইল ঠিকানা লিখুন',
            'email.email' => 'অনুগ্রহ করে একটি বৈধ ইমেইল ঠিকানা লিখুন',
            'phoneNumber.required' => 'অনুগ্রহ করে একটি ফোন নাম্বার লিখুন',
            'phoneNumber.regex' => 'অনুগ্রহ করে একটি বৈধ ফোন নাম্বার লিখুন (১০-১১ সংখ্যা)',
            'fullAddress.required' => 'অনুগ্রহ করে আপনার পূর্ণ ঠিকানা লিখুন',
            'fullAddress.min' => 'ঠিকানা কমপক্ষে ১০ অক্ষর হতে হবে',
            'location.required' => 'অনুগ্রহ করে আপনার অবস্থান নির্বাচন করুন',
            'location.in' => 'অনুগ্রহ করে একটি বৈধ অবস্থান নির্বাচন করুন',
            'productType.required' => 'অনুগ্রহ করে একটি প্যাকেজ নির্বাচন করুন',
            'productType.in' => 'অনুগ্রহ করে একটি বৈধ প্যাকেজ নির্বাচন করুন',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Calculate pricing
        $pricing = [
            'single' => ['offer' => 550, 'delivery' => true, 'name' => 'Single Pic'],
            'combo2' => ['offer' => 990, 'delivery' => false, 'name' => '2 Pics Combo'],
            'combo3' => ['offer' => 1390, 'delivery' => false, 'name' => '3 Pics Combo'],
        ];

        $productType = $request->productType;
        $subtotal = $pricing[$productType]['offer'];
        $deliveryCharge = $pricing[$productType]['delivery'] ? 100 : 0;
        $total = $subtotal + $deliveryCharge;

        $orderId = null;
        $dbSuccess = false;

        // Try to save to database (graceful degradation if it fails)
        try {
            $order = Order::create([
                'customer_name' => $request->fullName,
                'email' => $request->email,
                'phone' => $request->phoneNumber,
                'address' => $request->fullAddress,
                'location' => $request->location,
                'product_type' => $productType,
                'subtotal' => $subtotal,
                'delivery_charge' => $deliveryCharge,
                'total' => $total,
                'status' => 'pending',
            ]);
            $orderId = $order->id;
            $dbSuccess = true;
        } catch (\Exception $e) {
            // Log database error but continue with email sending
            Log::error('Database error while creating order: ' . $e->getMessage(), [
                'request' => $request->all(),
                'error' => $e->getMessage()
            ]);
        }

        // Prepare order data for emails
        $orderData = [
            'customer_name' => $request->fullName,
            'email' => $request->email,
            'phone' => $request->phoneNumber,
            'address' => $request->fullAddress,
            'location' => $request->location,
            'product' => $pricing[$productType]['name'],
            'product_type' => $productType,
            'subtotal' => $subtotal,
            'delivery_charge' => $deliveryCharge,
            'total' => $total,
            'order_date' => now()->format('Y-m-d H:i:s'),
            'ip_address' => $request->ip(),
            'order_id' => $orderId, // Include order ID if available
        ];

        $emailStatus = [
            'seller_notification' => false,
            'customer_confirmation' => false,
        ];

        // Send notification email to seller (yukonlifestyle06@gmail.com)
        // This email is critical - send even if database save failed
        try {
            Mail::to('yukonlifestyle06@gmail.com')->send(new OrderNotification($orderData));
            $emailStatus['seller_notification'] = true;
            Log::info('Order notification email sent to seller', [
                'to' => 'yukonlifestyle06@gmail.com',
                'order_id' => $orderId,
                'customer' => $request->fullName
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send order notification email to seller', [
                'to' => 'yukonlifestyle06@gmail.com',
                'error' => $e->getMessage(),
                'order_id' => $orderId,
                'customer' => $request->fullName,
                'trace' => $e->getTraceAsString()
            ]);
        }

        // Send confirmation email to customer
        // This email is critical - send even if database save failed
        try {
            Mail::to($request->email)->send(new OrderConfirmation($orderData));
            $emailStatus['customer_confirmation'] = true;
            Log::info('Order confirmation email sent to customer', [
                'to' => $request->email,
                'order_id' => $orderId,
                'customer' => $request->fullName
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send order confirmation email to customer', [
                'to' => $request->email,
                'error' => $e->getMessage(),
                'order_id' => $orderId,
                'customer' => $request->fullName,
                'trace' => $e->getTraceAsString()
            ]);
        }

        // Return success even if database failed (graceful degradation)
        return response()->json([
            'success' => true,
            'message' => $dbSuccess ? 'অর্ডার সফলভাবে সংরক্ষণ করা হয়েছে' : 'অর্ডার গ্রহণ করা হয়েছে',
            'order_id' => $orderId,
            'database_saved' => $dbSuccess,
        ], 201);
    }
}
