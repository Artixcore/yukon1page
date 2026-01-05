@extends('admin.layouts.app')

@section('title', 'Dashboard')

@section('content')
<div class="row">
    <div class="col-md-3">
        <div class="stat-card">
            <div class="stat-card-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                <i class="fas fa-shopping-cart"></i>
            </div>
            <div class="stat-card-label">Total Orders</div>
            <div class="stat-card-value">{{ $totalOrders }}</div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="stat-card">
            <div class="stat-card-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                <i class="fas fa-clock"></i>
            </div>
            <div class="stat-card-label">Pending</div>
            <div class="stat-card-value">{{ $pendingOrders }}</div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="stat-card">
            <div class="stat-card-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                <i class="fas fa-cog"></i>
            </div>
            <div class="stat-card-label">Processing</div>
            <div class="stat-card-value">{{ $processingOrders }}</div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="stat-card">
            <div class="stat-card-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
                <i class="fas fa-check-circle"></i>
            </div>
            <div class="stat-card-label">Completed</div>
            <div class="stat-card-value">{{ $completedOrders }}</div>
        </div>
    </div>
</div>

<div class="row mt-4">
    <div class="col-12">
        <div class="table-card">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h5 class="mb-0">Recent Orders</h5>
                <a href="{{ route('admin.orders') }}" class="btn btn-primary btn-sm">
                    <i class="fas fa-list"></i> View All Orders
                </a>
            </div>
            
            @if($recentOrders->count() > 0)
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Product</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($recentOrders as $order)
                                <tr>
                                    <td>#{{ $order->id }}</td>
                                    <td>{{ $order->customer_name }}</td>
                                    <td>{{ $order->email }}</td>
                                    <td>{{ $order->phone }}</td>
                                    <td>{{ $order->getProductTypeName() }}</td>
                                    <td>৳{{ number_format($order->total, 2) }}</td>
                                    <td>
                                        <span class="badge badge-status {{ $order->getStatusBadgeClass() }}">
                                            {{ ucfirst($order->status) }}
                                        </span>
                                    </td>
                                    <td>{{ $order->created_at->format('M d, Y') }}</td>
                                    <td>
                                        <a href="{{ route('admin.orders', ['search' => $order->id]) }}" class="btn btn-sm btn-outline-primary">
                                            <i class="fas fa-eye"></i>
                                        </a>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @else
                <div class="text-center py-5">
                    <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                    <p class="text-muted">No orders found</p>
                </div>
            @endif
        </div>
    </div>
</div>

<!-- New Orders Notification Badge -->
<div id="newOrdersBadge" class="position-fixed top-0 end-0 m-4" style="display: none; z-index: 1050;">
    <div class="alert alert-success alert-dismissible fade show shadow-lg" role="alert" style="min-width: 300px;">
        <h5 class="alert-heading">
            <i class="fas fa-bell"></i> New Order!
        </h5>
        <p class="mb-0" id="newOrdersMessage">You have <strong id="newOrdersCount">0</strong> new order(s)</p>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        <hr>
        <div class="d-flex justify-content-end">
            <a href="{{ route('admin.orders') }}" class="btn btn-sm btn-primary">View Orders</a>
        </div>
    </div>
</div>
@endsection

@section('scripts')
<script>
    (function() {
        'use strict';
        
        let lastOrderId = {{ $recentOrders->max('id') ?? 0 }};
        let pollingInterval = null;
        let soundEnabled = true;
        let notificationShown = false;
        
        /**
         * Play Notification Sound
         */
        function playNotificationSound() {
            if (!soundEnabled) return;
            
            try {
                // Try to play custom sound file first
                const audio = new Audio('/sounds/notification.mp3');
                audio.volume = 0.5;
                audio.play().catch(function(error) {
                    console.log('Custom sound failed, using fallback beep');
                    playBeepSound();
                });
            } catch (error) {
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
                
                oscillator.frequency.value = 800;
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
         * Check for new orders
         */
        async function checkNewOrders() {
            // Only poll if page is visible
            if (document.hidden) {
                return;
            }
            
            try {
                const response = await fetch(`{{ route('admin.api.newOrders') }}?last_id=${lastOrderId}`, {
                    method: 'GET',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'Accept': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to check for new orders');
                }
                
                const data = await response.json();
                
                if (data.success && data.count > 0) {
                    // Update last order ID
                    lastOrderId = data.latest_order_id;
                    
                    // Play sound notification
                    playNotificationSound();
                    
                    // Show visual notification
                    showNewOrderNotification(data.count, data.new_orders);
                    
                    // Update sidebar badge
                    const sidebarBadge = document.getElementById('ordersNotificationBadge');
                    if (sidebarBadge) {
                        sidebarBadge.textContent = data.count;
                        sidebarBadge.style.display = 'inline-block';
                        sidebarBadge.classList.add('animate__animated', 'animate__pulse');
                    }
                    
                    // Update dashboard stats if on dashboard page
                    updateDashboardStats();
                }
            } catch (error) {
                console.error('Error checking for new orders:', error);
            }
        }
        
        /**
         * Show new order notification
         */
        function showNewOrderNotification(count, orders) {
            const badge = document.getElementById('newOrdersBadge');
            const countElement = document.getElementById('newOrdersCount');
            const messageElement = document.getElementById('newOrdersMessage');
            
            if (badge && countElement) {
                countElement.textContent = count;
                
                if (count === 1) {
                    const order = orders[0];
                    messageElement.innerHTML = `New order from <strong>${order.customer_name}</strong> (Order #${order.id})`;
                } else {
                    messageElement.innerHTML = `You have <strong>${count}</strong> new orders`;
                }
                
                badge.style.display = 'block';
                
                // Add flash animation
                badge.querySelector('.alert').classList.add('animate__animated', 'animate__pulse');
                
                // Auto-hide after 10 seconds
                setTimeout(() => {
                    badge.style.display = 'none';
                }, 10000);
            }
        }
        
        /**
         * Update dashboard statistics
         */
        function updateDashboardStats() {
            // Reload page after a short delay to show updated stats
            // Or use AJAX to update specific elements
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
        
        /**
         * Start polling
         */
        function startPolling() {
            // Check immediately
            checkNewOrders();
            
            // Then check every 5 seconds
            pollingInterval = setInterval(checkNewOrders, 5000);
        }
        
        /**
         * Stop polling
         */
        function stopPolling() {
            if (pollingInterval) {
                clearInterval(pollingInterval);
                pollingInterval = null;
            }
        }
        
        // Start polling when page loads
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', startPolling);
        } else {
            startPolling();
        }
        
        // Stop polling when page becomes hidden, resume when visible
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                stopPolling();
            } else {
                startPolling();
            }
        });
        
        // Stop polling when page is unloaded
        window.addEventListener('beforeunload', stopPolling);
    })();
</script>
@endsection
