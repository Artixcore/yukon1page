/**
 * Bengali E-commerce Landing Page - Main JavaScript
 * Handles form validation, quantity selector, order summary, and Facebook Pixel events
 */

(function() {
    'use strict';

    // Constants
    const PIXEL_ID = 'YOUR_PIXEL_ID'; // Replace with actual Pixel ID
    const PIXEL_CONFIGURED = PIXEL_ID !== 'YOUR_PIXEL_ID' && PIXEL_ID !== null && PIXEL_ID !== '';
    
    // WhatsApp Configuration (Twilio)
    const WHATSAPP_CONFIG = {
        twilio: {
            enabled: true, // Set to false to disable Twilio WhatsApp
            accountSid: 'YOUR_TWILIO_ACCOUNT_SID', // Get from https://www.twilio.com/console
            authToken: 'YOUR_TWILIO_AUTH_TOKEN', // Get from https://www.twilio.com/console
            whatsappFrom: 'whatsapp:+14155238886', // Twilio WhatsApp sandbox number (replace with your number)
            businessWhatsApp: '01924492356' // Business WhatsApp number (without whatsapp: prefix)
        }
    };
    
    // Pricing Structure
    const PRICING = {
        single: { 
            offer: 550, 
            regular: 750, 
            delivery: true,
            name: 'Single Pic',
            nameBn: 'Single Pic'
        },
        combo2: { 
            offer: 990, 
            regular: 1500, 
            delivery: false,
            name: '2 Pics Combo',
            nameBn: '2 Pics Combo'
        },
        combo3: { 
            offer: 1390, 
            regular: 2250, 
            delivery: false,
            name: '3 Pics Combo',
            nameBn: '3 Pics Combo'
        }
    };
    
    const DELIVERY_CHARGE = 100; // Delivery charge for single pic

    /**
     * Cloudflare Turnstile Callbacks
     */
    window.onTurnstileSuccess = function(token) {
        // Hide any error messages when CAPTCHA succeeds
        const captchaError = document.getElementById('turnstile-error');
        if (captchaError) {
            captchaError.style.display = 'none';
        }
        console.log('Turnstile verified successfully');
    };

    window.onTurnstileError = function(error) {
        console.error('Turnstile error:', error);
        const captchaError = document.getElementById('turnstile-error');
        const errorText = document.getElementById('turnstile-error-text');
        if (captchaError && errorText) {
            // Error 110200 usually means invalid site key or domain mismatch
            if (error && error.includes('110200')) {
                errorText.textContent = 'CAPTCHA কনফিগারেশন ত্রুটি। অনুগ্রহ করে সাইট প্রশাসকের সাথে যোগাযোগ করুন।';
            } else {
                errorText.textContent = 'CAPTCHA লোড করতে সমস্যা হয়েছে। পৃষ্ঠাটি রিফ্রেশ করুন।';
            }
            captchaError.style.display = 'block';
        }
    };

    window.onTurnstileExpired = function() {
        console.log('Turnstile token expired');
        const captchaError = document.getElementById('turnstile-error');
        const errorText = document.getElementById('turnstile-error-text');
        if (captchaError && errorText) {
            errorText.textContent = 'CAPTCHA সময় শেষ হয়ে গেছে। অনুগ্রহ করে আবার চেষ্টা করুন।';
            captchaError.style.display = 'block';
        }
        
        // Reset the widget
        const turnstileWidget = document.getElementById('turnstile-widget');
        if (turnstileWidget && typeof turnstile !== 'undefined') {
            try {
                turnstile.reset(turnstileWidget);
            } catch (e) {
                console.error('Failed to reset Turnstile:', e);
            }
        }
    };

    /**
     * Initialize Turnstile widget when script loads
     */
    function initializeTurnstile() {
        const turnstileWidget = document.getElementById('turnstile-widget');
        if (!turnstileWidget) return;

        // Wait for Turnstile script to load
        if (typeof turnstile === 'undefined') {
            // Retry after a short delay
            setTimeout(initializeTurnstile, 100);
            return;
        }

        // Widget should auto-render, but we can verify it's loaded
        console.log('Turnstile script loaded');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeTurnstile);
    } else {
        initializeTurnstile();
    }

    /**
     * Play Notification Sound
     */
    function playNotificationSound() {
        try {
            // Try to play custom sound file first
            const audio = new Audio('/sounds/notification.mp3');
            audio.volume = 0.5; // Set volume to 50%
            audio.play().catch(function(error) {
                // If custom sound fails, use browser beep
                console.log('Custom sound failed, using fallback beep');
                playBeepSound();
            });
        } catch (error) {
            // Fallback to beep if audio file doesn't exist
            playBeepSound();
        }
    }

    /**
     * Play Beep Sound (Fallback)
     */
    function playBeepSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800; // Frequency in Hz
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (error) {
            console.log('Sound notification not available:', error);
        }
    }

    /**
     * SweetAlert2 Helper Functions
     */
    
    /**
     * Show Success Alert
     */
    function showSuccessAlert(title, html, footer) {
        return Swal.fire({
            icon: 'success',
            title: title,
            html: html,
            footer: footer,
            confirmButtonText: 'ঠিক আছে',
            confirmButtonColor: '#DC143C',
            allowOutsideClick: false,
            customClass: {
                popup: 'swal2-popup-bengali',
                title: 'swal2-title-bengali',
                htmlContainer: 'swal2-html-container-bengali',
                confirmButton: 'swal2-confirm-bengali'
            },
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        });
    }

    /**
     * Show Error Alert
     */
    function showErrorAlert(title, html, footer) {
        return Swal.fire({
            icon: 'error',
            title: title,
            html: html,
            footer: footer,
            confirmButtonText: 'ঠিক আছে',
            confirmButtonColor: '#DC143C',
            allowOutsideClick: false,
            customClass: {
                popup: 'swal2-popup-bengali',
                title: 'swal2-title-bengali',
                htmlContainer: 'swal2-html-container-bengali',
                confirmButton: 'swal2-confirm-bengali'
            },
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        });
    }

    /**
     * Show Validation Error Alert
     */
    function showValidationError(message) {
        return Swal.fire({
            icon: 'warning',
            title: 'ফর্ম যাচাইকরণ ত্রুটি',
            html: `<p style="font-family: 'Noto Sans Bengali', Arial, sans-serif;">${message}</p>`,
            confirmButtonText: 'ঠিক আছে',
            confirmButtonColor: '#DC143C',
            allowOutsideClick: false,
            customClass: {
                popup: 'swal2-popup-bengali',
                title: 'swal2-title-bengali',
                htmlContainer: 'swal2-html-container-bengali',
                confirmButton: 'swal2-confirm-bengali'
            },
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        });
    }

    /**
     * Format HTML content for success message
     */
    function formatSuccessHTML(messages) {
        let html = '<div style="text-align: left; font-family: \'Noto Sans Bengali\', Arial, sans-serif; line-height: 1.8;">';
        messages.forEach(function(msg) {
            html += `<p style="margin: 8px 0;">${msg}</p>`;
        });
        html += '</div>';
        return html;
    }

    /**
     * Format contact information footer
     */
    function formatContactFooter() {
        return '<div style="font-family: \'Noto Sans Bengali\', Arial, sans-serif; font-size: 14px; margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee;">' +
               '<strong>সরাসরি যোগাযোগ:</strong><br>' +
               '📞 01924492356<br>' +
               '📧 artixcore@gmail.com' +
               '</div>';
    }

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        initializeProductSelection();
        initializeFormValidation();
        initializeSmoothScroll();
        initializeFacebookPixel();
        updateOrderSummary();
    });

    /**
     * Initialize Product Selection
     */
    function initializeProductSelection() {
        const productTypeRadios = document.querySelectorAll('input[name="productType"]');
        const productTypeError = document.getElementById('productTypeError');
        
        // Handle product type selection from pricing cards
        const pricingCardLinks = document.querySelectorAll('[data-product]');
        pricingCardLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                const productType = this.getAttribute('data-product');
                const radio = document.getElementById('product' + productType.charAt(0).toUpperCase() + productType.slice(1));
                if (radio) {
                    radio.checked = true;
                    updateOrderSummary();
                    if (productTypeError) {
                        productTypeError.style.display = 'none';
                    }
                }
            });
        });

        // Handle product type radio changes
        productTypeRadios.forEach(function(radio) {
            radio.addEventListener('change', function() {
                updateOrderSummary();
                if (productTypeError) {
                    productTypeError.style.display = 'none';
                }
                trackFacebookEvent('AddToCart', {
                    content_name: PRICING[this.value].name,
                    content_type: 'product',
                    value: PRICING[this.value].offer,
                    currency: 'USD' // Facebook Pixel requires USD
                });
            });
        });
    }

    /**
     * Update Order Summary
     */
    function updateOrderSummary() {
        const selectedProduct = document.querySelector('input[name="productType"]:checked');
        const orderProductName = document.getElementById('orderProductName');
        const orderSubtotal = document.getElementById('orderSubtotal');
        const orderSubtotal2 = document.getElementById('orderSubtotal2');
        const orderTotal = document.getElementById('orderTotal');
        const placeOrderTotal = document.getElementById('placeOrderTotal');
        const deliveryChargeRow = document.getElementById('deliveryChargeRow');
        const deliveryCharge = document.getElementById('deliveryCharge');

        if (selectedProduct && PRICING[selectedProduct.value]) {
            const pricing = PRICING[selectedProduct.value];
            const subtotal = pricing.offer;
            const delivery = pricing.delivery ? DELIVERY_CHARGE : 0;
            const total = subtotal + delivery;

            if (orderProductName) orderProductName.textContent = pricing.nameBn;
            if (orderSubtotal) orderSubtotal.textContent = subtotal + '৳';
            if (orderSubtotal2) orderSubtotal2.textContent = subtotal + '৳';
            if (orderTotal) orderTotal.textContent = total + '৳';
            if (placeOrderTotal) placeOrderTotal.textContent = total + '৳';
            
            if (deliveryChargeRow && deliveryCharge) {
                if (pricing.delivery) {
                    deliveryChargeRow.style.display = '';
                    deliveryCharge.textContent = delivery + '৳';
                } else {
                    deliveryChargeRow.style.display = 'none';
                }
            }
        } else {
            // No product selected
            if (orderProductName) orderProductName.textContent = 'প্যাকেজ নির্বাচন করুন';
            if (orderSubtotal) orderSubtotal.textContent = '0৳';
            if (orderSubtotal2) orderSubtotal2.textContent = '0৳';
            if (orderTotal) orderTotal.textContent = '0৳';
            if (placeOrderTotal) placeOrderTotal.textContent = '0৳';
            if (deliveryChargeRow) deliveryChargeRow.style.display = 'none';
        }
    }

    /**
     * Initialize Form Validation
     */
    function initializeFormValidation() {
        const form = document.getElementById('checkoutForm');
        const fullName = document.getElementById('fullName');
        const email = document.getElementById('email');
        const phoneNumber = document.getElementById('phoneNumber');
        const fullAddress = document.getElementById('fullAddress');
        const locationRadios = document.querySelectorAll('input[name="location"]');
        const locationError = document.getElementById('locationError');
        const productTypeRadios = document.querySelectorAll('input[name="productType"]');
        const productTypeError = document.getElementById('productTypeError');

        if (form) {
            // Real-time validation
            if (fullName) {
                fullName.addEventListener('blur', function() {
                    validateField(this, this.value.trim().length >= 2, 'অনুগ্রহ করে আপনার পুরো নাম লিখুন');
                });
            }

            if (email) {
                email.addEventListener('blur', function() {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    validateField(this, emailPattern.test(this.value), 'অনুগ্রহ করে একটি বৈধ ইমেইল ঠিকানা লিখুন');
                });
            }

            if (phoneNumber) {
                phoneNumber.addEventListener('blur', function() {
                    const phonePattern = /^[0-9]{10,11}$/;
                    validateField(this, phonePattern.test(this.value), 'অনুগ্রহ করে একটি বৈধ ফোন নাম্বার লিখুন (১০-১১ সংখ্যা)');
                });

                phoneNumber.addEventListener('input', function() {
                    // Only allow numbers
                    this.value = this.value.replace(/[^0-9]/g, '');
                });
            }

            if (fullAddress) {
                fullAddress.addEventListener('blur', function() {
                    validateField(this, this.value.trim().length >= 10, 'অনুগ্রহ করে আপনার পূর্ণ ঠিকানা লিখুন (কমপক্ষে ১০ অক্ষর)');
                });
            }

            // Location validation
            locationRadios.forEach(function(radio) {
                radio.addEventListener('change', function() {
                    if (locationError) {
                        locationError.style.display = 'none';
                    }
                });
            });

            // Product type validation
            productTypeRadios.forEach(function(radio) {
                radio.addEventListener('change', function() {
                    if (productTypeError) {
                        productTypeError.style.display = 'none';
                    }
                });
            });

            // Form submission
            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                let isValid = true;

                // Validate all fields
                if (fullName && !validateField(fullName, fullName.value.trim().length >= 2, 'অনুগ্রহ করে আপনার পুরো নাম লিখুন')) {
                    isValid = false;
                }

                if (email) {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!validateField(email, emailPattern.test(email.value), 'অনুগ্রহ করে একটি বৈধ ইমেইল ঠিকানা লিখুন')) {
                        isValid = false;
                    }
                }

                if (phoneNumber) {
                    const phonePattern = /^[0-9]{10,11}$/;
                    if (!validateField(phoneNumber, phonePattern.test(phoneNumber.value), 'অনুগ্রহ করে একটি বৈধ ফোন নাম্বার লিখুন')) {
                        isValid = false;
                    }
                }

                if (fullAddress && !validateField(fullAddress, fullAddress.value.trim().length >= 10, 'অনুগ্রহ করে আপনার পূর্ণ ঠিকানা লিখুন')) {
                    isValid = false;
                }

                // Validate location
                const selectedLocation = document.querySelector('input[name="location"]:checked');
                if (!selectedLocation) {
                    isValid = false;
                    if (locationError) {
                        locationError.style.display = 'block';
                        locationError.textContent = 'অনুগ্রহ করে আপনার অবস্থান নির্বাচন করুন';
                    }
                } else {
                    if (locationError) {
                        locationError.style.display = 'none';
                    }
                }

                // Validate product type
                const selectedProductType = document.querySelector('input[name="productType"]:checked');
                if (!selectedProductType) {
                    isValid = false;
                    if (productTypeError) {
                        productTypeError.style.display = 'block';
                        productTypeError.textContent = 'অনুগ্রহ করে একটি প্যাকেজ নির্বাচন করুন';
                    }
                } else {
                    if (productTypeError) {
                        productTypeError.style.display = 'none';
                    }
                }

                if (isValid) {
                    // Get form data
                    const pricing = PRICING[selectedProductType.value];
                    const subtotal = pricing.offer;
                    const delivery = pricing.delivery ? DELIVERY_CHARGE : 0;
                    const total = subtotal + delivery;
                    
                    const formData = {
                        name: fullName.value.trim(),
                        email: email ? email.value.trim() : '',
                        phone: phoneNumber.value.trim(),
                        address: fullAddress.value.trim(),
                        location: selectedLocation.value,
                        product: pricing.name,
                        productType: selectedProductType.value,
                        subtotal: subtotal,
                        delivery: delivery,
                        total: total
                    };

                    // Fetch IP address (non-blocking, continue even if it fails)
                    let ipAddress = 'Unable to fetch IP';
                    try {
                        const ipController = new AbortController();
                        const ipTimeoutId = setTimeout(() => ipController.abort(), 5000); // 5 second timeout for IP
                        ipAddress = await getIPAddress(ipController.signal);
                        clearTimeout(ipTimeoutId);
                    } catch (error) {
                        console.error('Error fetching IP:', error);
                        // Continue without IP address - not critical
                    }

                    // Track Purchase event
                    trackFacebookEvent('Purchase', {
                        content_name: formData.product,
                        content_type: 'product',
                        value: total,
                        currency: 'USD' // Facebook Pixel requires USD, BDT not supported
                    });

                    // Send to Conversion API
                    sendToConversionAPI('Purchase', {
                        content_name: formData.product,
                        value: total,
                        currency: 'USD' // Conversion API requires USD
                    });

                    // Show loading message
                    const submitButton = form.querySelector('button[type="submit"]');
                    const originalButtonText = submitButton ? submitButton.innerHTML : '';
                    if (submitButton) {
                        submitButton.disabled = true;
                        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>অর্ডার পাঠানো হচ্ছে...';
                    }

                    // Check if Twilio WhatsApp is configured
                    const isTwilioConfigured = WHATSAPP_CONFIG.twilio.enabled && 
                        WHATSAPP_CONFIG.twilio.accountSid !== 'YOUR_TWILIO_ACCOUNT_SID' &&
                        WHATSAPP_CONFIG.twilio.authToken !== 'YOUR_TWILIO_AUTH_TOKEN';

                    // Send order data to all services
                    try {
                        // 0. First, submit to Laravel backend
                        let laravelSuccess = false;
                        let laravelError = null;
                        try {
                            // Get CAPTCHA token if Turnstile is enabled
                            let captchaToken = null;
                            const turnstileWidget = document.getElementById('turnstile-widget');
                            if (turnstileWidget) {
                                // Check if Turnstile script is loaded
                                if (typeof turnstile === 'undefined') {
                                    const captchaError = document.getElementById('turnstile-error');
                                    const errorText = document.getElementById('turnstile-error-text');
                                    if (captchaError && errorText) {
                                        errorText.textContent = 'CAPTCHA লোড হচ্ছে... অনুগ্রহ করে অপেক্ষা করুন।';
                                        captchaError.style.display = 'block';
                                    }
                                    throw new Error('CAPTCHA script not loaded');
                                }
                                
                                try {
                                    captchaToken = turnstile.getResponse(turnstileWidget);
                                    if (!captchaToken) {
                                        // Show error if CAPTCHA not completed
                                        const captchaError = document.getElementById('turnstile-error');
                                        const errorText = document.getElementById('turnstile-error-text');
                                        if (captchaError && errorText) {
                                            errorText.textContent = 'অনুগ্রহ করে CAPTCHA সম্পন্ন করুন';
                                            captchaError.style.display = 'block';
                                        }
                                        throw new Error('CAPTCHA not completed');
                                    }
                                } catch (error) {
                                    // Handle Turnstile-specific errors
                                    const captchaError = document.getElementById('turnstile-error');
                                    const errorText = document.getElementById('turnstile-error-text');
                                    if (captchaError && errorText) {
                                        if (error.message && error.message.includes('Turnstile')) {
                                            errorText.textContent = 'CAPTCHA ত্রুটি। পৃষ্ঠাটি রিফ্রেশ করুন এবং আবার চেষ্টা করুন।';
                                        } else {
                                            errorText.textContent = 'অনুগ্রহ করে CAPTCHA সম্পন্ন করুন';
                                        }
                                        captchaError.style.display = 'block';
                                    }
                                    throw new Error('CAPTCHA verification required');
                                }
                            }

                            const laravelFormData = {
                                fullName: formData.name,
                                email: formData.email,
                                phoneNumber: formData.phone,
                                fullAddress: formData.address,
                                location: formData.location,
                                productType: formData.productType
                            };
                            
                            // Add CAPTCHA token if available
                            if (captchaToken) {
                                laravelFormData['cf-turnstile-response'] = captchaToken;
                            }

                            // Get CSRF token from meta tag or form
                            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || 
                                            document.querySelector('input[name="_token"]')?.value || '';

                            // Add timeout to fetch request
                            const controller = new AbortController();
                            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
                            
                            const response = await fetch('/orders', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'X-CSRF-TOKEN': csrfToken,
                                    'Accept': 'application/json'
                                },
                                body: JSON.stringify(laravelFormData),
                                signal: controller.signal
                            });
                            
                            clearTimeout(timeoutId);

                            // Handle different HTTP status codes
                            if (!response.ok) {
                                let errorData;
                                try {
                                    errorData = await response.json();
                                } catch (e) {
                                    // If response is not JSON, create error object
                                    errorData = {
                                        message: `Server error: ${response.status} ${response.statusText}`,
                                        errors: {}
                                    };
                                }
                                
                                if (response.status === 422) {
                                    // Validation errors
                                    laravelError = errorData.errors || errorData.message || 'Validation error';
                                    console.error('Laravel validation error:', laravelError);
                                    
                                    // Display Laravel validation errors
                                    if (errorData.errors) {
                                        // Handle CAPTCHA errors
                                        if (errorData.errors.captcha) {
                                            const captchaError = document.getElementById('turnstile-error');
                                            if (captchaError) {
                                                captchaError.style.display = 'block';
                                                captchaError.innerHTML = '<small>' + errorData.errors.captcha[0] + '</small>';
                                            }
                                            // Reset Turnstile widget
                                            const turnstileWidget = document.getElementById('turnstile-widget');
                                            if (turnstileWidget && typeof turnstile !== 'undefined') {
                                                turnstile.reset(turnstileWidget);
                                            }
                                        }
                                        
                                        Object.keys(errorData.errors).forEach(function(field) {
                                            if (field === 'captcha') return; // Already handled above
                                            
                                            const fieldName = field === 'fullName' ? 'fullName' : 
                                                             field === 'phoneNumber' ? 'phoneNumber' : 
                                                             field === 'fullAddress' ? 'fullAddress' : field;
                                            const fieldElement = document.getElementById(fieldName) || document.querySelector(`[name="${fieldName}"]`);
                                            if (fieldElement) {
                                                validateField(fieldElement, false, errorData.errors[field][0]);
                                            }
                                        });
                                        
                                        // Show location error if exists
                                        if (errorData.errors.location && locationError) {
                                            locationError.style.display = 'block';
                                            locationError.textContent = errorData.errors.location[0];
                                        }
                                        
                                        // Show product type error if exists
                                        if (errorData.errors.productType && productTypeError) {
                                            productTypeError.style.display = 'block';
                                            productTypeError.textContent = errorData.errors.productType[0];
                                        }
                                        
                                        throw new Error('Laravel validation failed');
                                    }
                                } else if (response.status === 500) {
                                    // Server error
                                    throw new Error('Server error: ' + (errorData.message || 'Internal server error'));
                                } else {
                                    // Other HTTP errors
                                    throw new Error('Request failed: ' + (errorData.message || `HTTP ${response.status}`));
                                }
                            }

                            const result = await response.json();

                            if (result.success) {
                                laravelSuccess = true;
                                console.log('✅ Order saved to database:', result);
                            } else {
                                laravelError = result.errors || result.message || 'Unknown error';
                                console.error('Laravel error:', laravelError);
                                throw new Error('Laravel request failed');
                            }
                        } catch (error) {
                            console.error('Laravel submission error:', error);
                            
                            // Handle AbortError (timeout)
                            if (error.name === 'AbortError') {
                                throw new Error('Request timeout: Server did not respond in time');
                            }
                            
                            // Handle network errors
                            if (error.message && (error.message.includes('Failed to fetch') || error.message.includes('NetworkError'))) {
                                throw new Error('Network error: Please check your internet connection');
                            }
                            
                            // Re-throw validation errors to be handled by outer catch
                            if (error.message === 'Laravel validation failed') {
                                throw error;
                            }
                            
                            if (!laravelError) {
                                laravelError = error.message;
                            }
                            // Continue even if Laravel fails (graceful degradation)
                        }

                        const results = {
                            laravel: { success: laravelSuccess },
                            whatsappBusiness: { success: false },
                            whatsappUser: { success: false }
                        };

                        // 1. Send to Business WhatsApp (only if Twilio is configured)
                        if (isTwilioConfigured) {
                            try {
                                results.whatsappBusiness = await sendToWhatsAppBusiness(formData, ipAddress);
                            } catch (error) {
                                console.error('WhatsApp Business error:', error);
                            }
                        } else {
                            console.log('WhatsApp API not configured, skipping WhatsApp Business message');
                        }

                        // 2. Send WhatsApp Confirmation to User (only if Twilio is configured)
                        if (isTwilioConfigured) {
                            try {
                                results.whatsappUser = await sendWhatsAppConfirmation(formData);
                            } catch (error) {
                                console.error('WhatsApp User confirmation error:', error);
                            }
                        } else {
                            console.log('WhatsApp API not configured, skipping WhatsApp User confirmation');
                        }

                        // Build success message
                        // Laravel backend already sends emails via Mailer (Resend)
                        const successMessages = [];
                        successMessages.push('<strong>✅ অর্ডার সফলভাবে জমা দেওয়া হয়েছে!</strong>');
                        
                        if (laravelSuccess) {
                            successMessages.push('✅ অর্ডার ডাটাবেসে সংরক্ষণ করা হয়েছে।');
                            successMessages.push('✅ ইমেইল নিশ্চিতকরণ পাঠানো হয়েছে।');
                        }
                        
                        if (isTwilioConfigured && results.whatsappBusiness.success) {
                            successMessages.push('✅ WhatsApp এ বিজ্ঞপ্তি পাঠানো হয়েছে।');
                        }
                        
                        if (isTwilioConfigured && results.whatsappUser.success) {
                            successMessages.push('✅ WhatsApp এ নিশ্চিতকরণ বার্তা পাঠানো হয়েছে।');
                        }
                        
                        if (laravelSuccess || (isTwilioConfigured && (results.whatsappBusiness.success || results.whatsappUser.success))) {
                            successMessages.push('<br><strong>আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।</strong>');
                        } else {
                            successMessages.push('⚠️ কিছু সমস্যা হয়েছে, তবে আমরা আপনার তথ্য পেয়েছি।');
                            successMessages.push('আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।');
                        }

                        const successHTML = formatSuccessHTML(successMessages);
                        const contactFooter = formatContactFooter();
                        
                        // Play success sound notification
                        playNotificationSound();
                        
                        await showSuccessAlert(
                            'অর্ডার সফল!',
                            successHTML,
                            contactFooter
                        );
                        
                        // Reset form on success
                        form.reset();
                        updateOrderSummary();
                        
                        // Reset CAPTCHA widget
                        const turnstileWidget = document.getElementById('turnstile-widget');
                        if (turnstileWidget && typeof turnstile !== 'undefined') {
                            turnstile.reset(turnstileWidget);
                        }
                        
                        // Hide CAPTCHA error
                        const captchaError = document.getElementById('turnstile-error');
                        if (captchaError) {
                            captchaError.style.display = 'none';
                        }
                        
                    } catch (error) {
                        console.error('Form submission error:', error);
                        
                        let errorTitle = 'ত্রুটি হয়েছে';
                        let errorHTML = '';
                        let errorFooter = formatContactFooter();
                        
                        // Handle different types of errors
                        if (error.message === 'Laravel validation failed') {
                            errorTitle = 'ফর্ম যাচাইকরণ ত্রুটি';
                            errorHTML = '<p style="font-family: \'Noto Sans Bengali\', Arial, sans-serif;">অনুগ্রহ করে ফর্মের ত্রুটিগুলি ঠিক করুন এবং আবার চেষ্টা করুন।</p>';
                            await showValidationError('অনুগ্রহ করে ফর্মের ত্রুটিগুলি ঠিক করুন।');
                            
                            // Scroll to first invalid field
                            const firstInvalid = form.querySelector('.is-invalid');
                            if (firstInvalid) {
                                setTimeout(() => {
                                    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    firstInvalid.focus();
                                }, 300);
                            }
                        } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
                            // Network error
                            errorTitle = 'নেটওয়ার্ক ত্রুটি';
                            errorHTML = '<p style="font-family: \'Noto Sans Bengali\', Arial, sans-serif;">ইন্টারনেট সংযোগ পরীক্ষা করুন এবং আবার চেষ্টা করুন।</p>';
                            await showErrorAlert(errorTitle, errorHTML, errorFooter);
                        } else if (error.message && error.message.includes('timeout')) {
                            // Timeout error
                            errorTitle = 'সময় শেষ';
                            errorHTML = '<p style="font-family: \'Noto Sans Bengali\', Arial, sans-serif;">অনুরোধের সময় শেষ হয়ে গেছে। অনুগ্রহ করে আবার চেষ্টা করুন।</p>';
                            await showErrorAlert(errorTitle, errorHTML, errorFooter);
                        } else {
                            // Generic error
                            errorHTML = '<p style="font-family: \'Noto Sans Bengali\', Arial, sans-serif;">একটি ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।</p>';
                            await showErrorAlert(errorTitle, errorHTML, errorFooter);
                        }
                    } finally {
                        // Restore button
                        if (submitButton) {
                            submitButton.disabled = false;
                            submitButton.innerHTML = originalButtonText;
                        }
                    }
                    
                    // Reset form (optional)
                    // form.reset();
                } else {
                    // Scroll to first invalid field
                    const firstInvalid = form.querySelector('.is-invalid');
                    if (firstInvalid) {
                        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        firstInvalid.focus();
                    } else if (!selectedLocation && locationError) {
                        locationError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            });
        }
    }

    /**
     * Validate Individual Field
     */
    function validateField(field, isValid, errorMessage) {
        if (isValid) {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
            return true;
        } else {
            field.classList.remove('is-valid');
            field.classList.add('is-invalid');
            const feedback = field.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
                feedback.textContent = errorMessage;
            }
            return false;
        }
    }

    /**
     * Initialize Smooth Scroll
     */
    function initializeSmoothScroll() {
        const smoothScrollLinks = document.querySelectorAll('.smooth-scroll');
        
        smoothScrollLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        // Check if this is a pricing card button with product data
                        const productType = this.getAttribute('data-product');
                        if (productType) {
                            // Set the product type when scrolling to checkout
                            setTimeout(function() {
                                const radio = document.getElementById('product' + productType.charAt(0).toUpperCase() + productType.slice(1));
                                if (radio) {
                                    radio.checked = true;
                                    updateOrderSummary();
                                }
                            }, 500);
                        }
                        
                        // Track InitiateCheckout event
                        trackFacebookEvent('InitiateCheckout', {
                            content_name: 'Yukon Lifestyle Product',
                            content_type: 'product',
                            value: 550,
                            currency: 'USD' // Facebook Pixel requires USD
                        });

                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }

    /**
     * Initialize Facebook Pixel
     */
    function initializeFacebookPixel() {
        // Only initialize if Pixel ID is configured
        if (!PIXEL_CONFIGURED || typeof fbq === 'undefined') {
            return;
        }
        
        // Track PageView (already done in head, but ensure it's tracked)
        try {
            fbq('track', 'PageView');
        } catch (error) {
            // Silently fail if Pixel is not properly configured
        }

        // Track ViewContent when product section is viewed
        const productSection = document.getElementById('products');
        if (productSection) {
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        trackFacebookEvent('ViewContent', {
                            content_name: 'Yukon Lifestyle MaxEcho Sweatshirt',
                            content_type: 'product',
                            content_ids: ['yukon-lifestyle-maxecho'],
                            value: 550,
                            currency: 'USD' // Facebook Pixel requires USD
                        });
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(productSection);
        }

        // Track InitiateCheckout when checkout form is focused
        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) {
            let checkoutTracked = false;
            const formFields = checkoutForm.querySelectorAll('input, textarea');
            
            formFields.forEach(function(field) {
                field.addEventListener('focus', function() {
                    if (!checkoutTracked) {
                        trackFacebookEvent('InitiateCheckout', {
                            content_name: 'Yukon Lifestyle Product',
                            content_type: 'product',
                            value: 550,
                            currency: 'USD' // Facebook Pixel requires USD
                        });
                        checkoutTracked = true;
                    }
                });
            });
        }
    }

    /**
     * Track Facebook Pixel Event
     */
    function trackFacebookEvent(eventName, eventData) {
        // Only track if Pixel is configured
        if (!PIXEL_CONFIGURED || typeof fbq === 'undefined') {
            return;
        }
        
        try {
            fbq('track', eventName, eventData);
            console.log('Facebook Pixel Event Tracked:', eventName, eventData);
        } catch (error) {
            // Silently fail if Pixel is not properly configured
        }
    }

    /**
     * Send Event to Facebook Conversion API
     * This is a structure ready for backend integration
     */
    function sendToConversionAPI(eventName, eventData) {
        // This function provides the structure for backend implementation
        // In production, this should be called from your backend server
        
        const conversionAPIEvent = {
            data: [{
                event_name: eventName,
                event_time: Math.floor(Date.now() / 1000),
                event_id: generateEventId(),
                event_source_url: window.location.href,
                action_source: 'website',
                user_data: {
                    // These should be hashed on the backend before sending
                    // client_ip_address: getClientIP(),
                    // client_user_agent: navigator.userAgent,
                    // fbp: getCookie('_fbp'),
                    // fbc: getCookie('_fbc')
                },
                custom_data: eventData
            }]
        };

        // Backend implementation example:
        // POST to https://graph.facebook.com/v18.0/{pixel_id}/events
        // Headers: Content-Type: application/json, Authorization: Bearer {access_token}
        // Body: conversionAPIEvent

        console.log('Conversion API Event Structure:', conversionAPIEvent);
        
        // Uncomment and implement backend call:
        /*
        fetch('/api/facebook-conversion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(conversionAPIEvent)
        })
        .then(response => response.json())
        .then(data => console.log('Conversion API Response:', data))
        .catch(error => console.error('Conversion API Error:', error));
        */
    }

    /**
     * Generate Unique Event ID
     */
    function generateEventId() {
        return 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Get Cookie Value
     */
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    /**
     * Fetch IP Address
     */
    async function getIPAddress(signal) {
        try {
            const response = await fetch('https://api.ipify.org?format=json', { signal });
            if (!response.ok) {
                throw new Error('IP API returned error');
            }
            const data = await response.json();
            return data.ip;
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('IP fetch timeout');
            }
            console.error('Error fetching IP address:', error);
            // Fallback: try alternative API (only if not aborted)
            if (!signal || !signal.aborted) {
                try {
                    const fallbackResponse = await fetch('https://api64.ipify.org?format=json', { signal });
                    if (!fallbackResponse.ok) {
                        throw new Error('Fallback IP API returned error');
                    }
                    const fallbackData = await fallbackResponse.json();
                    return fallbackData.ip;
                } catch (fallbackError) {
                    if (fallbackError.name === 'AbortError') {
                        throw new Error('IP fetch timeout');
                    }
                    console.error('Fallback IP API also failed:', fallbackError);
                    throw new Error('Unable to fetch IP');
                }
            }
            throw error;
        }
    }


    /**
     * Format WhatsApp Message for Business
     */
    function formatWhatsAppMessage(formData, ipAddress) {
        const deliveryText = formData.delivery > 0 ? `ডেলিভারি চার্জ: ${formData.delivery}৳` : 'ডেলিভারি: ফ্রী';
        const message = `🛒 *নতুন অর্ডার - Yukon Lifestyle*

*গ্রাহকের তথ্য:*
👤 নাম: ${formData.name}
📧 ইমেইল: ${formData.email}
📱 ফোন: ${formData.phone}
📍 ঠিকানা: ${formData.address}
🌍 অবস্থান: ${formData.location}
🌐 IP Address: ${ipAddress}

*অর্ডার বিবরণ:*
📦 প্যাকেজ: ${formData.product}
💰 সাবটোটাল: ${formData.subtotal}৳
🚚 ${deliveryText}
💵 মোট: ${formData.total}৳

📅 তারিখ: ${new Date().toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' })}

---
Yukon Lifestyle ওয়েবসাইট থেকে স্বয়ংক্রিয় বার্তা`;

        return message;
    }

    /**
     * Format WhatsApp Confirmation Message for User
     */
    function formatUserConfirmationWhatsApp(formData) {
        const deliveryText = formData.delivery > 0 ? `ডেলিভারি চার্জ: ${formData.delivery}৳` : 'ডেলিভারি: ফ্রী';
        const message = `✅ *অর্ডার নিশ্চিতকরণ - Yukon Lifestyle*

প্রিয় ${formData.name},

আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে! 🎉

*আপনার অর্ডার বিবরণ:*
📦 প্যাকেজ: ${formData.product}
💰 সাবটোটাল: ${formData.subtotal}৳
🚚 ${deliveryText}
💵 মোট: ${formData.total}৳

আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব এবং আপনার অর্ডার ডেলিভারির বিষয়ে আপনাকে অবহিত করব।

ধন্যবাদ,
Yukon Lifestyle Team
📞 01924492356
📧 artixcore@gmail.com`;

        return message;
    }

    /**
     * Format Email Confirmation Message for User
     */
    function formatUserConfirmationEmail(formData) {
        const deliveryText = formData.delivery > 0 ? `${formData.delivery}৳` : 'ফ্রী';
        const htmlMessage = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Noto Sans Bengali', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #DC143C; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .order-details { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #DC143C; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; }
        td { padding: 8px; border-bottom: 1px solid #ddd; }
        .total { font-weight: bold; font-size: 18px; color: #DC143C; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>✅ অর্ডার নিশ্চিতকরণ - Yukon Lifestyle</h2>
        </div>
        <div class="content">
            <p>প্রিয় ${formData.name},</p>
            <p>আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে! 🎉</p>
            
            <div class="order-details">
                <h3>আপনার অর্ডার বিবরণ:</h3>
                <table>
                    <tr>
                        <td><strong>প্যাকেজ:</strong></td>
                        <td>${formData.product}</td>
                    </tr>
                    <tr>
                        <td><strong>সাবটোটাল:</strong></td>
                        <td>${formData.subtotal}৳</td>
                    </tr>
                    <tr>
                        <td><strong>ডেলিভারি চার্জ:</strong></td>
                        <td>${deliveryText}</td>
                    </tr>
                    <tr class="total">
                        <td><strong>মোট:</strong></td>
                        <td>${formData.total}৳</td>
                    </tr>
                </table>
            </div>
            
            <p>আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব এবং আপনার অর্ডার ডেলিভারির বিষয়ে আপনাকে অবহিত করব।</p>
        </div>
        <div class="footer">
            <p>ধন্যবাদ,<br>Yukon Lifestyle Team</p>
            <p>📞 01924492356 | 📧 artixcore@gmail.com</p>
        </div>
    </div>
</body>
</html>`;

        const textMessage = `
অর্ডার নিশ্চিতকরণ - Yukon Lifestyle

প্রিয় ${formData.name},

আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে!

আপনার অর্ডার বিবরণ:
প্যাকেজ: ${formData.product}
সাবটোটাল: ${formData.subtotal}৳
ডেলিভারি চার্জ: ${deliveryText}
মোট: ${formData.total}৳

আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।

ধন্যবাদ,
Yukon Lifestyle Team
01924492356
artixcore@gmail.com`;

        return { html: htmlMessage, text: textMessage };
    }

    /**
     * Send WhatsApp Message via Twilio API
     */
    async function sendToWhatsAppBusiness(formData, ipAddress) {
        if (!WHATSAPP_CONFIG.twilio.enabled || 
            WHATSAPP_CONFIG.twilio.accountSid === 'YOUR_TWILIO_ACCOUNT_SID' ||
            WHATSAPP_CONFIG.twilio.authToken === 'YOUR_TWILIO_AUTH_TOKEN') {
            return { success: false, error: 'Twilio not configured' };
        }

        try {
            const message = formatWhatsAppMessage(formData, ipAddress);
            let businessNumber = WHATSAPP_CONFIG.twilio.businessWhatsApp;
            if (!businessNumber.startsWith('+')) {
                // Remove leading 0 if present and add +880
                if (businessNumber.startsWith('0')) {
                    businessNumber = `+880${businessNumber.substring(1)}`;
                } else {
                    businessNumber = `+880${businessNumber}`;
                }
            }

            // Twilio API endpoint
            const url = `https://api.twilio.com/2010-04-01/Accounts/${WHATSAPP_CONFIG.twilio.accountSid}/Messages.json`;
            
            const formDataToSend = new URLSearchParams();
            formDataToSend.append('From', WHATSAPP_CONFIG.twilio.whatsappFrom);
            formDataToSend.append('To', `whatsapp:${businessNumber}`);
            formDataToSend.append('Body', message);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': 'Basic ' + btoa(`${WHATSAPP_CONFIG.twilio.accountSid}:${WHATSAPP_CONFIG.twilio.authToken}`),
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formDataToSend
            });

            const result = await response.json();

            if (response.ok && result.sid) {
                console.log('✅ WhatsApp sent to business via Twilio!', result);
                return { success: true, messageId: result.sid };
            } else {
                console.error('Twilio WhatsApp error:', result);
                return { success: false, error: result.message || 'Unknown error' };
            }
        } catch (error) {
            console.error('Twilio WhatsApp failed:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Send WhatsApp Confirmation to User via Twilio API
     */
    async function sendWhatsAppConfirmation(formData) {
        if (!WHATSAPP_CONFIG.twilio.enabled || 
            WHATSAPP_CONFIG.twilio.accountSid === 'YOUR_TWILIO_ACCOUNT_SID' ||
            WHATSAPP_CONFIG.twilio.authToken === 'YOUR_TWILIO_AUTH_TOKEN') {
            return { success: false, error: 'Twilio not configured' };
        }

        try {
            const message = formatUserConfirmationWhatsApp(formData);
            let userPhone = formData.phone;
            if (!userPhone.startsWith('+')) {
                // Remove leading 0 if present and add +880
                if (userPhone.startsWith('0')) {
                    userPhone = `+880${userPhone.substring(1)}`;
                } else {
                    userPhone = `+880${userPhone}`;
                }
            }

            // Twilio API endpoint
            const url = `https://api.twilio.com/2010-04-01/Accounts/${WHATSAPP_CONFIG.twilio.accountSid}/Messages.json`;
            
            const formDataToSend = new URLSearchParams();
            formDataToSend.append('From', WHATSAPP_CONFIG.twilio.whatsappFrom);
            formDataToSend.append('To', `whatsapp:${userPhone}`);
            formDataToSend.append('Body', message);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': 'Basic ' + btoa(`${WHATSAPP_CONFIG.twilio.accountSid}:${WHATSAPP_CONFIG.twilio.authToken}`),
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formDataToSend
            });

            const result = await response.json();

            if (response.ok && result.sid) {
                console.log('✅ WhatsApp confirmation sent to user via Twilio!', result);
                return { success: true, messageId: result.sid };
            } else {
                console.error('Twilio WhatsApp confirmation error:', result);
                return { success: false, error: result.message || 'Unknown error' };
            }
        } catch (error) {
            console.error('Twilio WhatsApp confirmation failed:', error);
            return { success: false, error: error.message };
        }
    }


    /**
     * Add Fade-in Animation on Scroll
     */
    function initializeScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe sections
        const sections = document.querySelectorAll('section');
        sections.forEach(function(section) {
            observer.observe(section);
        });
    }

    // Initialize scroll animations
    initializeScrollAnimations();

    // Mobile menu close on link click
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            if (window.innerWidth < 992 && navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                    toggle: false
                });
                bsCollapse.hide();
            }
        });
    });

})();
