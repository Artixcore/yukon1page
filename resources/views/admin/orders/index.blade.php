@extends('admin.layouts.app')

@section('title', 'Orders Management')

@section('styles')
<style>
    .filter-section {
        background: white;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        margin-bottom: 20px;
    }
    .status-select {
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        padding: 8px 12px;
        transition: all 0.3s;
    }
    .status-select:focus {
        border-color: #667eea;
        box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        outline: none;
    }
    .order-row {
        transition: background-color 0.2s;
    }
    .order-row:hover {
        background-color: #f8f9fa;
    }
</style>
@endsection

@section('content')
<div class="filter-section">
    <form method="GET" action="{{ route('admin.orders') }}" class="row g-3">
        <div class="col-md-4">
            <label for="search" class="form-label">Search</label>
            <input type="text" class="form-control" id="search" name="search" 
                   value="{{ request('search') }}" placeholder="Search by name, email, phone, or order ID">
        </div>
        <div class="col-md-4">
            <label for="status" class="form-label">Filter by Status</label>
            <select class="form-select status-select" id="status" name="status">
                <option value="">All Statuses</option>
                @foreach(\App\Models\Order::getStatuses() as $value => $label)
                    <option value="{{ $value }}" {{ request('status') == $value ? 'selected' : '' }}>
                        {{ $label }}
                    </option>
                @endforeach
            </select>
        </div>
        <div class="col-md-4 d-flex align-items-end">
            <button type="submit" class="btn btn-primary me-2">
                <i class="fas fa-filter"></i> Filter
            </button>
            <a href="{{ route('admin.orders') }}" class="btn btn-outline-secondary">
                <i class="fas fa-redo"></i> Reset
            </a>
        </div>
    </form>
</div>

<div class="table-card">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h5 class="mb-0">Orders List</h5>
        <span class="text-muted">Total: {{ $orders->total() }} orders</span>
    </div>

    @if($orders->count() > 0)
        <div class="table-responsive">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Contact</th>
                        <th>Address</th>
                        <th>Product</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($orders as $order)
                        <tr class="order-row" data-order-id="{{ $order->id }}">
                            <td><strong>#{{ $order->id }}</strong></td>
                            <td>{{ $order->customer_name }}</td>
                            <td>
                                <div>{{ $order->email }}</div>
                                <small class="text-muted">{{ $order->phone }}</small>
                            </td>
                            <td>
                                <div>{{ Str::limit($order->address, 30) }}</div>
                                <small class="text-muted">{{ $order->location }}</small>
                            </td>
                            <td>{{ $order->getProductTypeName() }}</td>
                            <td>
                                <div>৳{{ number_format($order->total, 2) }}</div>
                                <small class="text-muted">
                                    Subtotal: ৳{{ number_format($order->subtotal, 2) }}
                                    @if($order->delivery_charge > 0)
                                        <br>Delivery: ৳{{ number_format($order->delivery_charge, 2) }}
                                    @endif
                                </small>
                            </td>
                            <td>
                                <select class="form-select form-select-sm status-update" 
                                        data-order-id="{{ $order->id }}" 
                                        style="min-width: 120px;">
                                    @foreach(\App\Models\Order::getStatuses() as $value => $label)
                                        <option value="{{ $value }}" {{ $order->status == $value ? 'selected' : '' }}>
                                            {{ $label }}
                                        </option>
                                    @endforeach
                                </select>
                            </td>
                            <td>
                                <div>{{ $order->created_at->format('M d, Y') }}</div>
                                <small class="text-muted">{{ $order->created_at->format('h:i A') }}</small>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-outline-info view-order-details" 
                                        data-order-id="{{ $order->id }}"
                                        data-bs-toggle="modal" 
                                        data-bs-target="#orderModal">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <div class="mt-4">
            {{ $orders->links() }}
        </div>
    @else
        <div class="text-center py-5">
            <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
            <p class="text-muted">No orders found</p>
            @if(request('search') || request('status'))
                <a href="{{ route('admin.orders') }}" class="btn btn-primary mt-2">
                    <i class="fas fa-redo"></i> Clear Filters
                </a>
            @endif
        </div>
    @endif
</div>

<!-- Order Details Modal -->
<div class="modal fade" id="orderModal" tabindex="-1" aria-labelledby="orderModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="orderModalLabel">Order Details #<span id="modalOrderId"></span></h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" id="orderModalBody">
                <div class="text-center">
                    <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@section('scripts')
<script>
    $(document).ready(function() {
        // CSRF token setup for AJAX
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        // Status update handler
        $('.status-update').on('change', function() {
            const orderId = $(this).data('order-id');
            const newStatus = $(this).val();
            const selectElement = $(this);
            const originalStatus = selectElement.data('original-status') || selectElement.find('option:selected').text();

            // Disable select during update
            selectElement.prop('disabled', true);

            $.ajax({
                url: `/admin/orders/${orderId}/status`,
                method: 'POST',
                data: {
                    status: newStatus
                },
                success: function(response) {
                    if (response.success) {
                        // Show success message
                        const alert = $('<div class="alert alert-success alert-dismissible fade show" role="alert">' +
                            'Order status updated successfully!' +
                            '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>' +
                            '</div>');
                        $('.main-content').prepend(alert);
                        
                        // Auto-dismiss after 3 seconds
                        setTimeout(function() {
                            alert.fadeOut(function() {
                                $(this).remove();
                            });
                        }, 3000);

                        // Update badge if exists
                        const row = selectElement.closest('tr');
                        const badge = row.find('.badge-status');
                        if (badge.length) {
                            badge.removeClass().addClass('badge badge-status');
                            const statusClasses = {
                                'pending': 'bg-warning',
                                'processing': 'bg-info',
                                'completed': 'bg-success',
                                'cancelled': 'bg-danger'
                            };
                            badge.addClass(statusClasses[newStatus] || 'bg-secondary');
                            badge.text(response.order.status.charAt(0).toUpperCase() + response.order.status.slice(1));
                        }
                    }
                },
                error: function(xhr) {
                    // Revert selection
                    selectElement.val(originalStatus);
                    
                    let errorMessage = 'Failed to update order status';
                    if (xhr.responseJSON && xhr.responseJSON.message) {
                        errorMessage = xhr.responseJSON.message;
                    }
                    
                    const alert = $('<div class="alert alert-danger alert-dismissible fade show" role="alert">' +
                        errorMessage +
                        '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>' +
                        '</div>');
                    $('.main-content').prepend(alert);
                    
                    setTimeout(function() {
                        alert.fadeOut(function() {
                            $(this).remove();
                        });
                    }, 5000);
                },
                complete: function() {
                    // Re-enable select
                    selectElement.prop('disabled', false);
                }
            });
        });

        // Store original status on page load
        $('.status-update').each(function() {
            $(this).data('original-status', $(this).val());
        });

        // Order details modal
        $('.view-order-details').on('click', function() {
            const orderId = $(this).data('order-id');
            $('#modalOrderId').text(orderId);
            $('#orderModalBody').html('<div class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></div>');
            
            // Fetch order details (you can create an API endpoint for this or use existing data)
            // For now, we'll show basic info from the table row
            const row = $(this).closest('tr');
            const orderData = {
                id: orderId,
                customer: row.find('td').eq(1).text(),
                contact: row.find('td').eq(2).html(),
                address: row.find('td').eq(3).html(),
                product: row.find('td').eq(4).text(),
                amount: row.find('td').eq(5).html(),
                status: row.find('td').eq(6).find('select').val(),
                date: row.find('td').eq(7).html()
            };
            
            const modalContent = `
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <strong>Customer Name:</strong><br>
                        ${orderData.customer}
                    </div>
                    <div class="col-md-6 mb-3">
                        <strong>Contact:</strong><br>
                        ${orderData.contact}
                    </div>
                    <div class="col-12 mb-3">
                        <strong>Address:</strong><br>
                        ${orderData.address}
                    </div>
                    <div class="col-md-6 mb-3">
                        <strong>Product:</strong><br>
                        ${orderData.product}
                    </div>
                    <div class="col-md-6 mb-3">
                        <strong>Amount:</strong><br>
                        ${orderData.amount}
                    </div>
                    <div class="col-md-6 mb-3">
                        <strong>Status:</strong><br>
                        <span class="badge badge-status bg-${orderData.status === 'pending' ? 'warning' : orderData.status === 'processing' ? 'info' : orderData.status === 'completed' ? 'success' : 'danger'}">
                            ${orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1)}
                        </span>
                    </div>
                    <div class="col-md-6 mb-3">
                        <strong>Order Date:</strong><br>
                        ${orderData.date}
                    </div>
                </div>
            `;
            
            $('#orderModalBody').html(modalContent);
        });
    });
    
    // New Orders Polling (same as dashboard)
    (function() {
        'use strict';
        
        let lastOrderId = {{ $orders->max('id') ?? 0 }};
        let pollingInterval = null;
        
        function playNotificationSound() {
            try {
                const audio = new Audio('/sounds/notification.mp3');
                audio.volume = 0.5;
                audio.play().catch(function(error) {
                    playBeepSound();
                });
            } catch (error) {
                playBeepSound();
            }
        }
        
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
                console.log('Sound notification not available');
            }
        }
        
        async function checkNewOrders() {
            if (document.hidden) return;
            
            try {
                const response = await fetch(`{{ route('admin.api.newOrders') }}?last_id=${lastOrderId}`, {
                    method: 'GET',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'Accept': 'application/json'
                    }
                });
                
                if (!response.ok) return;
                
                const data = await response.json();
                
                if (data.success && data.count > 0) {
                    lastOrderId = data.latest_order_id;
                    playNotificationSound();
                    
                    // Update sidebar badge
                    const badge = document.getElementById('ordersNotificationBadge');
                    if (badge) {
                        badge.textContent = data.count;
                        badge.style.display = 'inline-block';
                        badge.classList.add('animate__animated', 'animate__pulse');
                    }
                    
                    // Show notification
                    const alert = $('<div class="alert alert-success alert-dismissible fade show animate__animated animate__pulse" role="alert">' +
                        '<strong><i class="fas fa-bell"></i> New Order!</strong> ' + data.count + ' new order(s) received. ' +
                        '<a href="?status=pending" class="alert-link">View pending orders</a>' +
                        '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>' +
                        '</div>');
                    $('.main-content').prepend(alert);
                    
                    setTimeout(() => {
                        alert.fadeOut(() => alert.remove());
                    }, 5000);
                    
                    // Reload page to show new orders
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                }
            } catch (error) {
                console.error('Error checking for new orders:', error);
            }
        }
        
        function startPolling() {
            checkNewOrders();
            pollingInterval = setInterval(checkNewOrders, 5000);
        }
        
        function stopPolling() {
            if (pollingInterval) {
                clearInterval(pollingInterval);
                pollingInterval = null;
            }
        }
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', startPolling);
        } else {
            startPolling();
        }
        
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                stopPolling();
            } else {
                startPolling();
            }
        });
        
        window.addEventListener('beforeunload', stopPolling);
    })();
</script>
@endsection
