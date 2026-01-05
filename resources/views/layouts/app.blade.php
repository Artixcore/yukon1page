<!DOCTYPE html>
<html lang="bn-BD">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">
    
    <!-- SEO Meta Tags -->
    <title>Yukon Life Style 100% Original Cotton | Yukon Lifestyle</title>
    <meta name="description" content="Premium Sweatshirt # Regular Fit. # Designed for a modern, everyday casual look. # Smooth and flexible feel with excellent durability. # প্রিমিয়াম আদি কটন পাঞ্জাবি - মজবুত, টেকসই, পরিবেশবান্ধব।">
    <meta name="keywords" content="Premium Sweatshirt # Regular Fit. # Designed for a modern, everyday casual look. # Smooth and flexible feel with excellent durability. #, Yukon Lifestyle">
    <meta name="author" content="Yukon Lifestyle">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://yukonlifestyle.com/">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://yukonlifestyle.com/">
    <meta property="og:title" content="Premium Adi Cotton Punjabi - 100% Original Cotton | Yukon Lifestyle">
    <meta property="og:description" content="Premium Sweatshirt # Regular Fit. # Designed for a modern, everyday casual look. # Smooth and flexible feel with excellent durability. #">
    <meta property="og:image" content="https://pnrchmxpywyqvvwzbvwe.supabase.co/storage/v1/object/public/products-images/products/1766033029989-stsdzi.webp?width=1024&quality=85&format=avif">
    <meta property="og:locale" content="bn_BD">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Premium Adi Cotton Punjabi - 100% Original Cotton">
    <meta name="twitter:description" content="Premium Sweatshirt # Regular Fit. # Designed for a modern, everyday casual look. # Smooth and flexible feel with excellent durability. #">
    <meta name="twitter:image" content="https://pnrchmxpywyqvvwzbvwe.supabase.co/storage/v1/object/public/products-images/products/1766033029989-stsdzi.webp?width=1024&quality=85&format=avif">
    
    <!-- Bootstrap 5.3 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    
    <!-- Google Fonts - Bengali Support -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700&family=Kalpurush&display=swap" rel="stylesheet">
    
    <!-- Custom CSS -->
    <link rel="stylesheet" href="{{ asset('assets/css/style.css') }}">
    
    <!-- SweetAlert2 CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    
    <!-- Facebook Pixel Code -->
    @php
        $pixelId = config('meta.pixel_id');
        $pixelConfigured = !empty($pixelId) && $pixelId !== 'YOUR_PIXEL_ID';
    @endphp
    @if($pixelConfigured)
    <script>
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '{{ $pixelId }}');
        fbq('track', 'PageView');
    </script>
    <noscript><img height="1" width="1" style="display:none"
        src="https://www.facebook.com/tr?id={{ $pixelId }}&ev=PageView&noscript=1"
        alt=""/></noscript>
    @endif
    <!-- End Facebook Pixel Code -->
    
    <!-- Facebook Conversion API Structure (Ready for Backend Integration) -->
    <script>
        // Facebook Conversion API - Server-side event tracking
        // This structure is ready for backend integration
        // Send events to: https://graph.facebook.com/v18.0/{pixel_id}/events
        function sendToConversionAPI(eventName, eventData) {
            // Example structure - implement in your backend
            const conversionAPIEvent = {
                data: [{
                    event_name: eventName,
                    event_time: Math.floor(Date.now() / 1000),
                    event_id: generateEventId(),
                    event_source_url: window.location.href,
                    action_source: 'website',
                    user_data: {
                        // Hash these values before sending
                        // client_ip_address: getClientIP(),
                        // client_user_agent: navigator.userAgent,
                        // fbp: getCookie('_fbp'),
                        // fbc: getCookie('_fbc')
                    },
                    custom_data: eventData
                }],
                access_token: 'YOUR_ACCESS_TOKEN' // Replace with your access token
            };
            
            // Backend implementation:
            // POST to https://graph.facebook.com/v18.0/{pixel_id}/events
            // Headers: Content-Type: application/json
            // Body: conversionAPIEvent
        }
        
        function generateEventId() {
            return 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }
    </script>
    
    <!-- Schema.org Structured Data -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "Premium Adi Cotton Punjabi",
        "description": "১০০% আদি কটন কাপড়ের পাঞ্জাবি - মজবুত, টেকসই, পরিবেশবান্ধব",
        "brand": {
            "@type": "Brand",
            "name": "Yukon Lifestyle"
        },
        "offers": {
            "@type": "Offer",
            "url": "https://yukonlifestyle.com/",
            "priceCurrency": "BDT",
            "price": "1150",
            "priceValidUntil": "2024-12-31",
            "availability": "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "27000"
        }
    }
    </script>
    
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Yukon Lifestyle",
        "url": "https://yukonlifestyle.com",
        "logo": "https://yukonlifestyle.com/assets/logo-CZhtHRi3.png",
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+880-1924492356",
            "email": "yukonlifestyle06@gmail.com",
            "contactType": "customer service"
        }
    }
    </script>
</head>
<body>
    <!-- Header -->
    <header class="header-section">
        <nav class="navbar navbar-expand-lg navbar-dark">
            <div class="container">
                <a class="navbar-brand" href="#">
                    <img src="{{ asset('assets/images/logo.png') }}" alt="Yukon Lifestyle Logo" class="navbar-logo">
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto">
                   
                        <li class="nav-item">
                            <a class="nav-link" href="#home">হোম</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#products">পণ্য</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#reviews">রিভিউ</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#checkout">অর্ডার</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>

    @yield('content')

    <!-- Footer -->
    <footer class="footer-section py-4">
        <div class="container">
            <div class="row">
                <div class="col-md-6 mb-3 mb-md-0">
                    <p class="footer-text"><strong>Yukon Lifestyle</strong></p>
                    <p class="footer-text">Email: <a href="mailto:yukonlifestyle06@gmail.com" class="footer-link">yukonlifestyle06@gmail.com</a></p>
                    <p class="footer-text">Phone: <a href="tel:+8801924492356" class="footer-link">01924492356</a></p>
                </div>
                <div class="col-md-6 text-md-end">
                    <a href="#" class="footer-link me-3">Terms & Condition</a>
                    <span class="separator">|</span>
                    <a href="#" class="footer-link ms-3">Refund Policy</a>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-12">
                    <nav class="footer-nav">
                        <a href="#" class="footer-nav-link">HOME</a>
                        <a href="{{route('admin.login')}}" class="footer-nav-link">Admin</a>
                        <a href="#" class="footer-nav-link">FACEBOOK</a>
                        <a href="#" class="footer-nav-link">SHOP</a>
                        <a href="#" class="footer-nav-link">LANDING PAGE</a>
                        <a href="#" class="footer-nav-link">GRAPHICS DESIGN</a>
                    </nav>
                </div>
            </div>
        </div>
    </footer>

    <!-- Bootstrap 5.3 JS Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
    
    <!-- SweetAlert2 JS -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    
    <!-- Cloudflare Turnstile -->
    @if(config('turnstile.site_key'))
    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" defer></script>
    @endif
    
    <!-- Custom JavaScript -->
    <script src="{{ asset('assets/js/main.js') }}"></script>
</body>
</html>
