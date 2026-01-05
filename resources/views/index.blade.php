@extends('layouts.app')

@section('content')
    <!-- Hero Section -->

    <!-- Features Section -->
    <section id="features" class="features-section py-5">
        <div class="container">
            <div class="row mb-5">
                <div class="col-12 text-center">
                    <h2 class="section-title">প্রিমিয়াম T-Shirt খুঁজছেন? <br/>আমাদের বৈশিষ্ট্য:-</h2>
                </div>
            </div>
            <div class="row align-items-center">
                <div class="col-lg-6 mb-4 mb-lg-0">
                    <div class="product-showcase">
                        <div class="row g-3">
                            <div class="col-6">
                                <img src="{{ asset('assets/images/products/full-shirt-blue-green.jpeg') }}" alt="Yukon Lifestyle MaxEcho Sweatshirt - Green/White" class="img-fluid product-showcase-img" loading="lazy">
                            </div>
                            <div class="col-6">
                                <img src="{{ asset('assets/images/products/full-shirt-green-white.jpeg') }}" alt="Yukon Lifestyle MaxEcho Sweatshirt - Maroon/Green" class="img-fluid product-showcase-img" loading="lazy">
                            </div>
                            <div class="col-6">
                                <img src="{{ asset('assets/images/products/full-shirt-red-white.jpeg') }}" alt="Yukon Lifestyle MaxEcho Sweatshirt - Off-white/Maroon" class="img-fluid product-showcase-img" loading="lazy">
                            </div>
                            <div class="col-6">
                                <img src="{{ asset('assets/images/products/full-shirt-red-green.jpeg') }}" alt="Yukon Lifestyle MaxEcho Sweatshirt - Blue/Olive" class="img-fluid product-showcase-img" loading="lazy">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="feature-list">
                        <div class="feature-item">
                            <div class="feature-icon">✓</div>
                            <div class="feature-content">
                                <h3 class="feature-title">Regular Fit</h3>
                                <p class="feature-text">Perfect fit for comfortable day-long wear</p>
                            </div>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">✓</div>
                            <div class="feature-content">
                                <h3 class="feature-title">Soft Cotton Fabrics</h3>
                                <p class="feature-text">Ultra-smooth and comfortable texture</p>
                            </div>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">✓</div>
                            <div class="feature-content">
                                <h3 class="feature-title">Flexible & Breathable</h3>
                                <p class="feature-text">Perfect for day-long wear with maximum comfort</p>
                            </div>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">✓</div>
                            <div class="feature-content">
                                <h3 class="feature-title">100% Cotton Fabrics</h3>
                                <p class="feature-text">Pure cotton for natural comfort</p>
                            </div>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">✓</div>
                            <div class="feature-content">
                                <h3 class="feature-title">285 GSM</h3>
                                <p class="feature-text">Premium weight for durability and comfort</p>
                            </div>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">✓</div>
                            <div class="feature-content">
                                <h3 class="feature-title">Thread: 40/2 & 20/2 DTM</h3>
                                <p class="feature-text">High-quality thread for superior stitching</p>
                            </div>
                        </div>
                    </div>
                    <div class="text-center mt-4">
                        <p class="contact-info">01924492356</p>
                        <p class="contact-email">yukonlifestyle06@gmail.com</p>
                        <a href="#checkout" class="btn btn-cta smooth-scroll">অর্ডার করতে ক্লিক করুন</a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Product Gallery Section -->
    <section id="products" class="product-gallery-section py-5">
        <div class="container">
            <div class="row mb-4">
                <div class="col-12 text-center">
                    <h2 class="section-title">Yukon Lifestyle MaxEcho Sweatshirt Collection</h2>
                </div>
            </div>
            <div class="row g-4">
                <div class="col-6 col-md-4 col-lg-3">
                    <div class="product-card">
                        <img src="{{ asset('assets/images/products/full-shirt-blue-green.jpeg') }}" alt="Yukon Lifestyle MaxEcho Sweatshirt - Green/White" class="img-fluid product-image" loading="lazy">
                    </div>
                </div>
                <div class="col-6 col-md-4 col-lg-3">
                    <div class="product-card">
                        <img src="{{ asset('assets/images/products/full-shirt-green-white.jpeg') }}" alt="Yukon Lifestyle MaxEcho Sweatshirt - Maroon/Green" class="img-fluid product-image" loading="lazy">
                    </div>
                </div>
                <div class="col-6 col-md-4 col-lg-3">
                    <div class="product-card">
                        <img src="{{ asset('assets/images/products/full-shirt-red-white.jpeg') }}" alt="Yukon Lifestyle MaxEcho Sweatshirt - Off-white/Maroon" class="img-fluid product-image" loading="lazy">
                    </div>
                </div>
                <div class="col-6 col-md-4 col-lg-3">
                    <div class="product-card">
                        <img src="{{ asset('assets/images/products/full-shirt-red-green.jpeg') }}" alt="Yukon Lifestyle MaxEcho Sweatshirt - Blue/Olive" class="img-fluid product-image" loading="lazy">
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Customer Reviews Section -->
    <section id="reviews" class="reviews-section py-5">
        <div class="container">
            <div class="row mb-4">
                <div class="col-12 text-center">
                    <h2 class="section-title">আমাদের সম্মানিত কাস্টমারদের রিভিউ</h2>
                </div>
            </div>
            <div class="row g-4">
                <div class="col-6 col-md-4 col-lg-3">
                    <div class="review-card">
                        <img src="{{ asset('assets/images/reviews/r1.jpeg') }}" alt="Customer Review 1" class="img-fluid review-image" loading="lazy" onerror="this.style.display='none';">
                    </div>
                </div>
                <div class="col-6 col-md-4 col-lg-3">
                    <div class="review-card">
                        <img src="{{ asset('assets/images/reviews/r2.jpeg') }}" alt="Customer Review 2" class="img-fluid review-image" loading="lazy" onerror="this.style.display='none';">
                    </div>
                </div>
                <div class="col-6 col-md-4 col-lg-3">
                    <div class="review-card">
                        <img src="{{ asset('assets/images/reviews/r3.jpeg') }}" alt="Customer Review 3" class="img-fluid review-image" loading="lazy" onerror="this.style.display='none';">
                    </div>
                </div>
                <div class="col-6 col-md-4 col-lg-3">
                    <div class="review-card">
                        <img src="{{ asset('assets/images/reviews/r4.jpeg') }}" alt="Customer Review 4" class="img-fluid review-image" loading="lazy" onerror="this.style.display='none';">
                    </div>
                </div>
                <div class="col-6 col-md-4 col-lg-3">
                    <div class="review-card">
                        <img src="{{ asset('assets/images/reviews/r5.jpeg') }}" alt="Customer Review 5" class="img-fluid review-image" loading="lazy" onerror="this.style.display='none';">
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Pricing Section -->
    <section class="pricing-section py-5">
        <div class="container">
            <div class="row mb-4">
                <div class="col-12 text-center">
                    <h2 class="section-title">প্যাকেজ ও মূল্য</h2>
                </div>
            </div>
            <div class="row g-4">
                <!-- Single Pic Pricing -->
                <div class="col-md-4">
                    <div class="pricing-card">
                        <div class="pricing-card-header">
                            <h3 class="pricing-card-title">Single Pic</h3>
                        </div>
                        <div class="pricing-card-body">
                            <p class="pricing-regular">রেগুলার প্রাইস: <span class="regular-price">~~৭৫০~~</span> টাকা</p>
                            <h2 class="pricing-offer">অফার প্রাইস: <span class="offer-price">৫৫০</span> টাকা</h2>
                            <p class="pricing-delivery delivery-extra">ডেলিভারি চার্জ অতিরিক্ত</p>
                            <a href="#checkout" class="btn btn-cta w-100 smooth-scroll" data-product="single">অর্ডার করুন</a>
                        </div>
                    </div>
                </div>
                <!-- 2 Pics Combo Pricing -->
                <div class="col-md-4">
                    <div class="pricing-card pricing-card-featured">
                        <div class="pricing-badge">বেস্ট ভ্যালু</div>
                        <div class="pricing-card-header">
                            <h3 class="pricing-card-title">2 Pics Combo</h3>
                        </div>
                        <div class="pricing-card-body">
                            <p class="pricing-regular">রেগুলার প্রাইস: <span class="regular-price">~~১৫০০~~</span> টাকা</p>
                            <h2 class="pricing-offer">অফার প্রাইস: <span class="offer-price">৯৯০</span> টাকা</h2>
                            <p class="pricing-delivery delivery-free">ডেলিভারি চার্জ ফ্রী</p>
                            <a href="#checkout" class="btn btn-cta w-100 smooth-scroll" data-product="combo2">অর্ডার করুন</a>
                        </div>
                    </div>
                </div>
                <!-- 3 Pics Combo Pricing -->
                <div class="col-md-4">
                    <div class="pricing-card">
                        <div class="pricing-card-header">
                            <h3 class="pricing-card-title">3 Pics Combo</h3>
                        </div>
                        <div class="pricing-card-body">
                            <p class="pricing-regular">রেগুলার প্রাইস: <span class="regular-price">~~২২৫০~~</span> টাকা</p>
                            <h2 class="pricing-offer">অফার প্রাইস: <span class="offer-price">১৩৯০</span> টাকা</h2>
                            <p class="pricing-delivery delivery-free">ডেলিভারি চার্জ ফ্রী</p>
                            <a href="#checkout" class="btn btn-cta w-100 smooth-scroll" data-product="combo3">অর্ডার করুন</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row mt-4">
                <div class="col-12 text-center">
                    <p class="cod-note">১ টাকা অগ্রিম পেমেন্ট ছাড়াই প্রোডাক্ট হাতে পেয়ে মূল্য পরিশোধের সুবিধা।</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Checkout Form Section -->
    <section id="checkout" class="checkout-section py-5">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 mb-4 mb-lg-0">
                    <!-- Product Selection -->
                    <div class="checkout-card mb-4">
                        <h3 class="checkout-card-title">Select Package</h3>
                        <div class="product-selection">
                            <div class="mb-3">
                                <label class="form-label">প্যাকেজ নির্বাচন করুন <span class="text-danger">*</span></label>
                                <div class="product-type-options">
                                    <div class="form-check product-type-option">
                                        <input class="form-check-input" type="radio" name="productType" id="productSingle" value="single" required>
                                        <label class="form-check-label" for="productSingle">
                                            <strong>Single Pic</strong> - ৫৫০৳ (ডেলিভারি চার্জ অতিরিক্ত)
                                        </label>
                                    </div>
                                    <div class="form-check product-type-option">
                                        <input class="form-check-input" type="radio" name="productType" id="productCombo2" value="combo2" required>
                                        <label class="form-check-label" for="productCombo2">
                                            <strong>2 Pics Combo</strong> - ৯৯০৳ (ডেলিভারি চার্জ ফ্রী)
                                        </label>
                                    </div>
                                    <div class="form-check product-type-option">
                                        <input class="form-check-input" type="radio" name="productType" id="productCombo3" value="combo3" required>
                                        <label class="form-check-label" for="productCombo3">
                                            <strong>3 Pics Combo</strong> - ১৩৯০৳ (ডেলিভারি চার্জ ফ্রী)
                                        </label>
                                    </div>
                                </div>
                                <div class="invalid-feedback d-block" id="productTypeError" style="display: none;">অনুগ্রহ করে একটি প্যাকেজ নির্বাচন করুন</div>
                            </div>
                        </div>
                    </div>

                    <!-- Billing Details -->
                    <div class="checkout-card">
                        <h3 class="checkout-card-title">Billing details</h3>
                        <form id="checkoutForm" novalidate>
                            @csrf
                            <div class="mb-3">
                                <label for="fullName" class="form-label">পুরো নাম <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="fullName" name="fullName" required>
                                <div class="invalid-feedback">অনুগ্রহ করে আপনার পুরো নাম লিখুন</div>
                            </div>
                            <div class="mb-3">
                                <label for="email" class="form-label">ইমেইল <span class="text-danger">*</span></label>
                                <input type="email" class="form-control" id="email" name="email" required>
                                <div class="invalid-feedback">অনুগ্রহ করে একটি বৈধ ইমেইল ঠিকানা লিখুন</div>
                            </div>
                            <div class="mb-3">
                                <label for="phoneNumber" class="form-label">ফোন নাম্বার <span class="text-danger">*</span></label>
                                <input type="tel" class="form-control" id="phoneNumber" name="phoneNumber" pattern="[0-9]{10,11}" required>
                                <div class="invalid-feedback">অনুগ্রহ করে একটি বৈধ ফোন নাম্বার লিখুন</div>
                            </div>
                            <div class="mb-3">
                                <label for="fullAddress" class="form-label">পূর্ণ ঠিকানা <span class="text-danger">*</span></label>
                                <textarea class="form-control" id="fullAddress" name="fullAddress" rows="3" required></textarea>
                                <div class="invalid-feedback">অনুগ্রহ করে আপনার পূর্ণ ঠিকানা লিখুন</div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">অবস্থান <span class="text-danger">*</span></label>
                                <div class="location-options">
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" name="location" id="insideDhaka" value="Inside Dhaka" required>
                                        <label class="form-check-label" for="insideDhaka">
                                            ঢাকার ভিতরে
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" name="location" id="outsideDhaka" value="Outside Dhaka" required>
                                        <label class="form-check-label" for="outsideDhaka">
                                            ঢাকার বাইরে
                                        </label>
                                    </div>
                                </div>
                                <div class="invalid-feedback d-block" id="locationError" style="display: none;">অনুগ্রহ করে আপনার অবস্থান নির্বাচন করুন</div>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Order Summary -->
                <div class="col-lg-4">
                    <div class="checkout-card">
                        <h3 class="checkout-card-title">Your order</h3>
                        <div class="order-summary">
                            <table class="table table-borderless">
                                <tbody>
                                    <tr>
                                        <td>Product</td>
                                        <td class="text-end">Subtotal</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span class="product-name-small" id="orderProductName">প্যাকেজ নির্বাচন করুন</span>
                                        </td>
                                        <td class="text-end"><span id="orderSubtotal">0৳</span></td>
                                    </tr>
                                    <tr id="deliveryChargeRow" style="display: none;">
                                        <td>Delivery Charge</td>
                                        <td class="text-end"><span id="deliveryCharge">0৳</span></td>
                                    </tr>
                                    <tr>
                                        <td>Subtotal</td>
                                        <td class="text-end"><span id="orderSubtotal2">0৳</span></td>
                                    </tr>
                                    <tr class="order-total">
                                        <td><strong>Total</strong></td>
                                        <td class="text-end"><strong id="orderTotal">0৳</strong></td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="payment-method">
                                <p class="mb-2"><strong>Cash on delivery</strong></p>
                                <p class="small text-muted">Pay with cash upon delivery.</p>
                            </div>
                            <p class="privacy-text small">
                                Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our <a href="#" class="privacy-link">privacy policy</a>.
                            </p>
                            <button type="submit" form="checkoutForm" class="btn btn-place-order w-100">
                                <span class="lock-icon">🔒</span> Place Order <span id="placeOrderTotal">0৳</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
@endsection
