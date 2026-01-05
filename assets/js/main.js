/**
 * Bengali E-commerce Landing Page - Main JavaScript
 * Handles form validation, quantity selector, order summary, and Facebook Pixel events
 */

(function() {
    'use strict';

    // Constants
    const PIXEL_ID = 'YOUR_PIXEL_ID'; // Replace with actual Pixel ID
    
    // Email Service Configuration
    // Configure any or all of these services. They will be tried in order as fallbacks.
    const EMAIL_CONFIG = {
        // EmailJS Configuration (Primary - Recommended)
        emailjs: {
            enabled: true, // Set to false to disable EmailJS
            publicKey: 'VVsKh909DGsLkw5ks', // Get from https://www.emailjs.com
            serviceId: 'service_z61hqzt',
            templateId: 'template_d5inutg'
        },
        // Formspree Configuration (Secondary Fallback)
        formspree: {
            enabled: false, // Disabled - using EmailJS as primary
            endpoint: 'YOUR_FORMSPREE_ENDPOINT' // Get from https://formspree.io (e.g., 'https://formspree.io/f/YOUR_FORM_ID')
        },
        // Web3Forms Configuration (Tertiary Fallback)
        web3forms: {
            enabled: false, // Disabled - using EmailJS as primary
            accessKey: 'YOUR_WEB3FORMS_ACCESS_KEY' // Get from https://web3forms.com
        },
        // Twilio WhatsApp Configuration
        twilio: {
            enabled: true, // Set to false to disable Twilio WhatsApp
            accountSid: 'YOUR_TWILIO_ACCOUNT_SID', // Get from https://www.twilio.com/console
            authToken: 'YOUR_TWILIO_AUTH_TOKEN', // Get from https://www.twilio.com/console
            whatsappFrom: 'whatsapp:+14155238886', // Twilio WhatsApp sandbox number (replace with your number)
            businessWhatsApp: '01924492356' // Business WhatsApp number (without whatsapp: prefix)
        },
        // EmailJS User Confirmation Template (for sending confirmation to customer)
        emailjsUserConfirmation: {
            enabled: true, // Set to false to disable user confirmation emails
            templateId: 'template_d5inutg' // Use same template or create a separate one for user confirmation
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

    // Initialize EmailJS once when DOM is ready
    let emailjsInitialized = false;
    
    function initializeEmailJS() {
        if (!emailjsInitialized && EMAIL_CONFIG.emailjs.enabled && 
            EMAIL_CONFIG.emailjs.publicKey !== 'YOUR_EMAILJS_PUBLIC_KEY' &&
            typeof emailjs !== 'undefined') {
            try {
                emailjs.init(EMAIL_CONFIG.emailjs.publicKey);
                emailjsInitialized = true;
                console.log('EmailJS initialized successfully');
            } catch (error) {
                console.error('Failed to initialize EmailJS:', error);
            }
        }
    }

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        initializeEmailJS();
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

                    // Fetch IP address
                    let ipAddress = 'Unable to fetch IP';
                    try {
                        ipAddress = await getIPAddress();
                    } catch (error) {
                        console.error('Error fetching IP:', error);
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
                    const isTwilioConfigured = EMAIL_CONFIG.twilio.enabled && 
                        EMAIL_CONFIG.twilio.accountSid !== 'YOUR_TWILIO_ACCOUNT_SID' &&
                        EMAIL_CONFIG.twilio.authToken !== 'YOUR_TWILIO_AUTH_TOKEN';

                    // Send order data to all services
                    try {
                        // 0. First, submit to Laravel backend
                        let laravelSuccess = false;
                        let laravelError = null;
                        try {
                            const laravelFormData = {
                                fullName: formData.name,
                                email: formData.email,
                                phoneNumber: formData.phone,
                                fullAddress: formData.address,
                                location: formData.location,
                                productType: formData.productType
                            };

                            // Get CSRF token from meta tag or form
                            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || 
                                            document.querySelector('input[name="_token"]')?.value || '';

                            const response = await fetch('/orders', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'X-CSRF-TOKEN': csrfToken,
                                    'Accept': 'application/json'
                                },
                                body: JSON.stringify(laravelFormData)
                            });

                            const result = await response.json();

                            if (response.ok && result.success) {
                                laravelSuccess = true;
                                console.log('✅ Order saved to database:', result);
                            } else {
                                laravelError = result.errors || result.message || 'Unknown error';
                                console.error('Laravel validation error:', laravelError);
                                
                                // Display Laravel validation errors
                                if (result.errors) {
                                    Object.keys(result.errors).forEach(function(field) {
                                        const fieldName = field === 'fullName' ? 'fullName' : 
                                                         field === 'phoneNumber' ? 'phoneNumber' : 
                                                         field === 'fullAddress' ? 'fullAddress' : field;
                                        const fieldElement = document.getElementById(fieldName) || document.querySelector(`[name="${fieldName}"]`);
                                        if (fieldElement) {
                                            validateField(fieldElement, false, result.errors[field][0]);
                                        }
                                    });
                                    
                                    // Show location error if exists
                                    if (result.errors.location && locationError) {
                                        locationError.style.display = 'block';
                                        locationError.textContent = result.errors.location[0];
                                    }
                                    
                                    // Show product type error if exists
                                    if (result.errors.productType && productTypeError) {
                                        productTypeError.style.display = 'block';
                                        productTypeError.textContent = result.errors.productType[0];
                                    }
                                    
                                    throw new Error('Laravel validation failed');
                                }
                            }
                        } catch (error) {
                            console.error('Laravel submission error:', error);
                            if (!laravelError) {
                                laravelError = error.message;
                            }
                            // Continue with EmailJS even if Laravel fails (graceful degradation)
                        }

                        const results = {
                            laravel: { success: laravelSuccess },
                            whatsappBusiness: { success: false },
                            emailBusiness: { success: false },
                            whatsappUser: { success: false },
                            emailUser: { success: false }
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

                        // 2. Send to Business Email (EmailJS)
                        try {
                            results.emailBusiness = await sendToEmail(formData, ipAddress);
                        } catch (error) {
                            console.error('Email Business error:', error);
                        }

                        // 3. Send WhatsApp Confirmation to User (only if Twilio is configured)
                        if (isTwilioConfigured) {
                            try {
                                results.whatsappUser = await sendWhatsAppConfirmation(formData);
                            } catch (error) {
                                console.error('WhatsApp User confirmation error:', error);
                            }
                        } else {
                            console.log('WhatsApp API not configured, skipping WhatsApp User confirmation');
                        }

                        // 4. Send Email Confirmation to User (EmailJS)
                        try {
                            results.emailUser = await sendEmailJSUserConfirmation(formData);
                        } catch (error) {
                            console.error('Email User confirmation error:', error);
                        }

                        // Build success message
                        let successMessage = '✅ অর্ডার সফলভাবে জমা দেওয়া হয়েছে!\n\n';
                        
                        // Count only successful sends (not skipped ones)
                        const attemptedServices = [];
                        if (laravelSuccess) {
                            attemptedServices.push(true);
                        }
                        if (isTwilioConfigured) {
                            attemptedServices.push(results.whatsappBusiness.success, results.whatsappUser.success);
                        }
                        attemptedServices.push(results.emailBusiness.success, results.emailUser.success);
                        
                        const successCount = attemptedServices.filter(Boolean).length;

                        if (successCount > 0) {
                            if (laravelSuccess) {
                                successMessage += '✅ অর্ডার ডাটাবেসে সংরক্ষণ করা হয়েছে।\n\n';
                            }
                            successMessage += `আপনার অর্ডার ${successCount} টি মাধ্যমের মাধ্যমে পাঠানো হয়েছে।\n\n`;
                            
                            if (results.whatsappBusiness.success || results.emailBusiness.success) {
                                successMessage += 'আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।\n\n';
                            }
                            
                            if (isTwilioConfigured && results.whatsappUser.success) {
                                successMessage += '✅ WhatsApp এ নিশ্চিতকরণ বার্তা পাঠানো হয়েছে।\n';
                            }
                            
                            if (results.emailUser.success) {
                                successMessage += '✅ ইমেইলে নিশ্চিতকরণ বার্তা পাঠানো হয়েছে।\n';
                            }
                        } else {
                            successMessage += '⚠️ কিছু সমস্যা হয়েছে, তবে আমরা আপনার তথ্য পেয়েছি।\n\n';
                            successMessage += 'আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।\n\n';
                            successMessage += 'সরাসরি যোগাযোগ:\n';
                            successMessage += '📞 01924492356\n';
                            successMessage += '📧 artixcore@gmail.com';
                        }

                        alert(successMessage);
                        
                        // Reset form on success
                        form.reset();
                        updateOrderSummary();
                        
                    } catch (error) {
                        console.error('Form submission error:', error);
                        if (error.message === 'Laravel validation failed') {
                            alert('❌ অনুগ্রহ করে ফর্মের ত্রুটিগুলি ঠিক করুন।');
                        } else {
                            alert('❌ একটি ত্রুটি হয়েছে।\n\nঅনুগ্রহ করে আবার চেষ্টা করুন অথবা সরাসরি আমাদের সাথে যোগাযোগ করুন।\n\nফোন: 01924492356\nইমেইল: artixcore@gmail.com');
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
        // Track PageView (already done in head, but ensure it's tracked)
        if (typeof fbq !== 'undefined') {
            fbq('track', 'PageView');
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
        if (typeof fbq !== 'undefined') {
            try {
                fbq('track', eventName, eventData);
                console.log('Facebook Pixel Event Tracked:', eventName, eventData);
            } catch (error) {
                console.error('Error tracking Facebook Pixel event:', error);
            }
        } else {
            console.warn('Facebook Pixel not loaded');
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
    async function getIPAddress() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.error('Error fetching IP address:', error);
            // Fallback: try alternative API
            try {
                const response = await fetch('https://api64.ipify.org?format=json');
                const data = await response.json();
                return data.ip;
            } catch (fallbackError) {
                console.error('Fallback IP API also failed:', fallbackError);
                return 'Unable to fetch IP';
            }
        }
    }

    /**
     * Format Email Message (for fallback mailto)
     */
    function formatEmailMessage(formData, ipAddress) {
        const deliveryText = formData.delivery > 0 ? `Delivery Charge: ${formData.delivery}৳` : 'Delivery: Free';
        const message = `New Order - Yukon Lifestyle

Customer Information:
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Address: ${formData.address}
Location: ${formData.location}
IP Address: ${ipAddress}

Order Details:
Package: ${formData.product}
Subtotal: ${formData.subtotal}৳
${deliveryText}
Total: ${formData.total}৳

---
This is an automated message from Yukon Lifestyle website.`;

        return encodeURIComponent(message);
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
        if (!EMAIL_CONFIG.twilio.enabled || 
            EMAIL_CONFIG.twilio.accountSid === 'YOUR_TWILIO_ACCOUNT_SID' ||
            EMAIL_CONFIG.twilio.authToken === 'YOUR_TWILIO_AUTH_TOKEN') {
            return { success: false, error: 'Twilio not configured' };
        }

        try {
            const message = formatWhatsAppMessage(formData, ipAddress);
            let businessNumber = EMAIL_CONFIG.twilio.businessWhatsApp;
            if (!businessNumber.startsWith('+')) {
                // Remove leading 0 if present and add +880
                if (businessNumber.startsWith('0')) {
                    businessNumber = `+880${businessNumber.substring(1)}`;
                } else {
                    businessNumber = `+880${businessNumber}`;
                }
            }

            // Twilio API endpoint
            const url = `https://api.twilio.com/2010-04-01/Accounts/${EMAIL_CONFIG.twilio.accountSid}/Messages.json`;
            
            const formDataToSend = new URLSearchParams();
            formDataToSend.append('From', EMAIL_CONFIG.twilio.whatsappFrom);
            formDataToSend.append('To', `whatsapp:${businessNumber}`);
            formDataToSend.append('Body', message);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': 'Basic ' + btoa(`${EMAIL_CONFIG.twilio.accountSid}:${EMAIL_CONFIG.twilio.authToken}`),
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
        if (!EMAIL_CONFIG.twilio.enabled || 
            EMAIL_CONFIG.twilio.accountSid === 'YOUR_TWILIO_ACCOUNT_SID' ||
            EMAIL_CONFIG.twilio.authToken === 'YOUR_TWILIO_AUTH_TOKEN') {
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
            const url = `https://api.twilio.com/2010-04-01/Accounts/${EMAIL_CONFIG.twilio.accountSid}/Messages.json`;
            
            const formDataToSend = new URLSearchParams();
            formDataToSend.append('From', EMAIL_CONFIG.twilio.whatsappFrom);
            formDataToSend.append('To', `whatsapp:${userPhone}`);
            formDataToSend.append('Body', message);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': 'Basic ' + btoa(`${EMAIL_CONFIG.twilio.accountSid}:${EMAIL_CONFIG.twilio.authToken}`),
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
     * Send Email Confirmation to User via EmailJS
     */
    async function sendEmailJSUserConfirmation(formData) {
        if (!EMAIL_CONFIG.emailjsUserConfirmation.enabled || 
            !EMAIL_CONFIG.emailjs.enabled ||
            EMAIL_CONFIG.emailjs.publicKey === 'YOUR_EMAILJS_PUBLIC_KEY' ||
            typeof emailjs === 'undefined') {
            return { success: false, error: 'EmailJS not configured' };
        }

        try {
            // Ensure EmailJS is initialized
            if (!emailjsInitialized) {
                initializeEmailJS();
            }
            
            const deliveryText = formData.delivery > 0 ? `${formData.delivery}৳` : 'Free';
            
            // Use the same template or create a separate one for user confirmation
            // You can use the same templateId or create a new template specifically for user confirmation
            const templateParams = {
                to_email: formData.email, // Send to user's email
                customer_name: formData.name,
                customer_email: formData.email,
                customer_phone: formData.phone,
                customer_address: formData.address,
                location: formData.location,
                package_name: formData.product,
                subtotal: formData.subtotal + '৳',
                delivery_charge: deliveryText,
                total: formData.total + '৳',
                ip_address: 'N/A', // Not needed for user confirmation
                order_date: new Date().toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' })
            };
            
            const response = await emailjs.send(
                EMAIL_CONFIG.emailjs.serviceId, 
                EMAIL_CONFIG.emailjsUserConfirmation.templateId || EMAIL_CONFIG.emailjs.templateId, // Use user confirmation template or fallback to main template
                templateParams
            );
            
            if (response.status === 200) {
                console.log('✅ Confirmation email sent to user via EmailJS!', response);
                return { success: true, emailId: response.text };
            }
            console.error('EmailJS user confirmation returned non-200 status:', response.status);
            return { success: false, error: `EmailJS returned status ${response.status}` };
        } catch (error) {
            console.error('EmailJS user confirmation failed:', error);
            const errorMessage = error.text || error.message || 'Unknown error';
            console.error('Error details:', {
                status: error.status,
                text: error.text,
                message: error.message,
                fullError: error
            });
            // Log the full error for debugging
            if (error.text) {
                console.error('EmailJS error text:', error.text);
            }
            return { success: false, error: errorMessage };
        }
    }

    /**
     * Try sending email via EmailJS (Primary Method)
     */
    async function tryEmailJS(formData, ipAddress) {
        if (!EMAIL_CONFIG.emailjs.enabled || 
            EMAIL_CONFIG.emailjs.publicKey === 'YOUR_EMAILJS_PUBLIC_KEY' ||
            typeof emailjs === 'undefined') {
            return false;
        }
        
        try {
            // Ensure EmailJS is initialized
            if (!emailjsInitialized) {
                initializeEmailJS();
            }
            
            const deliveryText = formData.delivery > 0 ? `${formData.delivery}৳` : 'Free';
            
            const templateParams = {
                to_email: 'yukonlifestyle06@gmail.com',
                customer_name: formData.name,
                customer_email: formData.email,
                customer_phone: formData.phone,
                customer_address: formData.address,
                location: formData.location,
                package_name: formData.product,
                subtotal: formData.subtotal + '৳',
                delivery_charge: deliveryText,
                total: formData.total + '৳',
                ip_address: ipAddress,
                order_date: new Date().toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' })
            };
            
            const response = await emailjs.send(
                EMAIL_CONFIG.emailjs.serviceId, 
                EMAIL_CONFIG.emailjs.templateId, 
                templateParams
            );
            
            if (response.status === 200) {
                console.log('✅ Email sent via EmailJS!', response);
                return true;
            }
            console.error('EmailJS returned non-200 status:', response.status);
            return false;
        } catch (error) {
            console.error('EmailJS failed:', error);
            const errorDetails = {
                status: error.status,
                text: error.text,
                message: error.message
            };
            console.error('Error details:', errorDetails);
            // Log the full error for debugging
            if (error.text) {
                console.error('EmailJS error text:', error.text);
            }
            return false;
        }
    }

    /**
     * Try sending email via Formspree (Secondary Fallback)
     */
    async function tryFormspree(formData, ipAddress) {
        if (!EMAIL_CONFIG.formspree.enabled || 
            EMAIL_CONFIG.formspree.endpoint === 'YOUR_FORMSPREE_ENDPOINT') {
            return false;
        }
        
        try {
            const deliveryText = formData.delivery > 0 ? `${formData.delivery}৳` : 'Free';
            
            const formDataToSend = new FormData();
            formDataToSend.append('_to', 'artixcore@gmail.com');
            formDataToSend.append('_subject', 'New Order - Yukon Lifestyle');
            formDataToSend.append('_replyto', formData.email);
            formDataToSend.append('Name', formData.name);
            formDataToSend.append('Email', formData.email);
            formDataToSend.append('Phone', formData.phone);
            formDataToSend.append('Address', formData.address);
            formDataToSend.append('Location', formData.location);
            formDataToSend.append('Package', formData.product);
            formDataToSend.append('Subtotal', formData.subtotal + '৳');
            formDataToSend.append('Delivery', deliveryText);
            formDataToSend.append('Total', formData.total + '৳');
            formDataToSend.append('IP Address', ipAddress);
            formDataToSend.append('Order Date', new Date().toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' }));
            
            const response = await fetch(EMAIL_CONFIG.formspree.endpoint, {
                method: 'POST',
                body: formDataToSend,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            const result = await response.json();
            
            if (response.ok && !result.error) {
                console.log('✅ Email sent via Formspree!', result);
                return true;
            }
            return false;
        } catch (error) {
            console.log('Formspree failed:', error.message);
            return false;
        }
    }

    /**
     * Try sending email via Web3Forms (Tertiary Fallback)
     */
    async function tryWeb3Forms(formData, ipAddress) {
        if (!EMAIL_CONFIG.web3forms.enabled || 
            EMAIL_CONFIG.web3forms.accessKey === 'YOUR_WEB3FORMS_ACCESS_KEY') {
            return false;
        }
        
        try {
            const deliveryText = formData.delivery > 0 ? `${formData.delivery}৳` : 'Free';
            
            const emailBody = `
New Order - Yukon Lifestyle

Customer Information:
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Address: ${formData.address}
Location: ${formData.location}
IP Address: ${ipAddress}

Order Details:
Package: ${formData.product}
Subtotal: ${formData.subtotal}৳
Delivery: ${deliveryText}
Total: ${formData.total}৳

Order Date: ${new Date().toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' })}
            `.trim();
            
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    access_key: EMAIL_CONFIG.web3forms.accessKey,
                    subject: 'New Order - Yukon Lifestyle',
                    from_name: formData.name,
                    from_email: formData.email,
                    to_email: 'artixcore@gmail.com',
                    message: emailBody
                })
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
                console.log('✅ Email sent via Web3Forms!', result);
                return true;
            }
            return false;
        } catch (error) {
            console.log('Web3Forms failed:', error.message);
            return false;
        }
    }

    /**
     * Fallback to mailto: (Always works)
     */
    function tryMailto(formData, ipAddress) {
        try {
            const subject = encodeURIComponent('New Order - Yukon Lifestyle');
            const body = formatEmailMessage(formData, ipAddress);
            const mailtoUrl = `mailto:artixcore@gmail.com?subject=${subject}&body=${body}`;
            window.location.href = mailtoUrl;
            console.log('📧 Using mailto: fallback');
            return true;
        } catch (error) {
            console.error('Mailto fallback failed:', error);
            return false;
        }
    }

    /**
     * Send Form Data to Email with Multiple Fallback Options
     * Tries EmailJS → Formspree → Web3Forms → mailto: in order
     */
    async function sendToEmail(formData, ipAddress) {
        let methodUsed = '';
        
        // Try EmailJS first (Primary)
        if (EMAIL_CONFIG.emailjs.enabled) {
            try {
                const result = await tryEmailJS(formData, ipAddress);
                if (result) {
                    methodUsed = 'EmailJS';
                    return { success: true, method: methodUsed };
                }
            } catch (e) {
                console.log('EmailJS error, trying next method...');
            }
        }
        
        // Try Formspree second (Secondary)
        if (EMAIL_CONFIG.formspree.enabled) {
            try {
                const result = await tryFormspree(formData, ipAddress);
                if (result) {
                    methodUsed = 'Formspree';
                    return { success: true, method: methodUsed };
                }
            } catch (e) {
                console.log('Formspree error, trying next method...');
            }
        }
        
        // Try Web3Forms third (Tertiary)
        if (EMAIL_CONFIG.web3forms.enabled) {
            try {
                const result = await tryWeb3Forms(formData, ipAddress);
                if (result) {
                    methodUsed = 'Web3Forms';
                    return { success: true, method: methodUsed };
                }
            } catch (e) {
                console.log('Web3Forms error, using mailto fallback...');
            }
        }
        
        // Final fallback: mailto (Always works)
        const mailtoResult = tryMailto(formData, ipAddress);
        return { success: mailtoResult, method: 'mailto' };
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
