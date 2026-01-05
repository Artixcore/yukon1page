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
            <h2>✅ Order Confirmation - Yukon Lifestyle</h2>
        </div>
        <div class="content">
            <p>Dear {{ $orderData['customer_name'] }},</p>
            <p>Your order has been successfully received! 🎉</p>
            
            <div class="order-details">
                <h3>Your Order Details:</h3>
                <table>
                    <tr>
                        <td><strong>Package:</strong></td>
                        <td>{{ $orderData['product'] }}</td>
                    </tr>
                    <tr>
                        <td><strong>Subtotal:</strong></td>
                        <td>{{ $orderData['subtotal'] }}৳</td>
                    </tr>
                    <tr>
                        <td><strong>Delivery Charge:</strong></td>
                        <td>{{ $orderData['delivery_charge'] > 0 ? $orderData['delivery_charge'] . '৳' : 'Free' }}</td>
                    </tr>
                    <tr class="total">
                        <td><strong>Total:</strong></td>
                        <td>{{ $orderData['total'] }}৳</td>
                    </tr>
                </table>
            </div>
            
            <p>We will contact you soon and inform you about your order delivery.</p>
        </div>
        <div class="footer">
            <p>Thank you,<br>Yukon Lifestyle Team</p>
            <p>📞 01924492356 | 📧 artixcore@gmail.com</p>
        </div>
    </div>
</body>
</html>
