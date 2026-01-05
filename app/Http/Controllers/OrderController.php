<?php

namespace App\Http\Controllers;

use App\Mail\OrderConfirmation;
use App\Mail\OrderNotification;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    /**
     * Store a newly created order in storage.
     */
    public function store(Request $request)
    {
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
        ];

        // Send notification email to business (don't break if it fails)
        try {
            Mail::to('yukonlifestyle06@gmail.com')->send(new OrderNotification($orderData));
        } catch (\Exception $e) {
            Log::error('Failed to send order notification email: ' . $e->getMessage());
        }

        // Send confirmation email to customer (don't break if it fails)
        try {
            Mail::to($request->email)->send(new OrderConfirmation($orderData));
        } catch (\Exception $e) {
            Log::error('Failed to send order confirmation email: ' . $e->getMessage());
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
