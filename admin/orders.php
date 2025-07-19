<?php
session_start();
require_once '../includes/db.php';

// Check if admin is logged in
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: login.php');
    exit();
}

$action = $_GET['action'] ?? 'list';
$message = '';

// Handle form submissions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($action === 'update_status' || isset($_POST['update_status'])) {
        $order_id = intval($_POST['order_id'] ?? 0);
        $new_status = trim($_POST['status'] ?? '');
        
        // Validation
        if ($order_id <= 0 || empty($new_status)) {
            $message = 'Invalid order ID or status.';
        } else {
            $valid_statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
            if (!in_array($new_status, $valid_statuses)) {
                $message = 'Invalid status selected.';
            } else {
                try {
                    $stmt = $pdo->prepare("UPDATE orders SET status = ? WHERE id = ?");
                    $old = $pdo->query("SELECT * FROM orders WHERE id = $order_id")->fetch(PDO::FETCH_ASSOC);
                    if ($stmt->execute([$new_status, $order_id])) {
                        log_action($pdo, 'UPDATE', 'orders', $order_id, $old, ['status' => $new_status]);
                        $message = 'Order status updated successfully!';
                        header('Location: orders.php?message=' . urlencode($message));
                        exit();
                    } else {
                        $message = 'Error updating order status';
                    }
                } catch (PDOException $e) {
                    $message = 'Database error: ' . $e->getMessage();
                }
            }
        }
    } elseif ($action === 'delete' || isset($_POST['delete_order'])) {
        $order_id = intval($_POST['order_id'] ?? 0);
        
        if ($order_id <= 0) {
            $message = 'Invalid order ID.';
        } else {
            try {
                // Get the order to check if it exists
                $stmt = $pdo->prepare("SELECT id FROM orders WHERE id = ?");
                $stmt->execute([$order_id]);
                $order = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if (!$order) {
                    $message = 'Order not found.';
                } else {
                    // Delete order items first (due to foreign key constraint)
                    $stmt = $pdo->prepare("DELETE FROM order_items WHERE order_id = ?");
                    $stmt->execute([$order_id]);
                    
                    // Delete the order
                    $stmt = $pdo->prepare("DELETE FROM orders WHERE id = ?");
                    $old = $pdo->query("SELECT * FROM orders WHERE id = $order_id")->fetch(PDO::FETCH_ASSOC);
                    if ($stmt->execute([$order_id])) {
                        log_action($pdo, 'DELETE', 'orders', $order_id, $old, null);
                        $message = 'Order deleted successfully!';
                        header('Location: orders.php?message=' . urlencode($message));
                        exit();
                    } else {
                        $message = 'Error deleting order';
                    }
                }
            } catch (PDOException $e) {
                $message = 'Database error: ' . $e->getMessage();
            }
        }
    }
}

// Get orders for listing
if ($action === 'list') {
    try {
        $stmt = $pdo->query("
            SELECT 
                o.*,
                u.full_name as customer_name,
                u.email as customer_email,
                u.phone as customer_phone,
                GROUP_CONCAT(CONCAT(p.name, ' (', oi.quantity, ')') SEPARATOR ', ') as products,
                o.total_price as total
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN products p ON oi.product_id = p.id
            GROUP BY o.id
            ORDER BY o.created_at DESC
        ");
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        $orders = [];
        $message = "Error fetching orders: " . $e->getMessage();
    }
}

// Get order for viewing
if ($action === 'view') {
    $id = intval($_GET['id'] ?? 0);
    if ($id <= 0) {
        header('Location: orders.php?message=' . urlencode('Invalid order ID'));
        exit();
    }
    
    try {
        $stmt = $pdo->prepare("
            SELECT 
                o.*,
                u.full_name as customer_name,
                u.email as customer_email,
                u.phone as customer_phone
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            WHERE o.id = ?
        ");
        $stmt->execute([$id]);
        $order = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$order) {
            header('Location: orders.php?message=' . urlencode('Order not found'));
            exit();
        }
        
        // Get order items
        $stmt = $pdo->prepare("
            SELECT 
                oi.*,
                p.name as product_name,
                p.price as product_price,
                p.product_image
            FROM order_items oi
            LEFT JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?
        ");
        $stmt->execute([$id]);
        $order_items = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
    } catch (PDOException $e) {
        header('Location: orders.php?message=' . urlencode('Error fetching order details'));
        exit();
    }
}

// Get message from URL
if (isset($_GET['message'])) {
    $message = $_GET['message'];
}

function log_action($pdo, $action, $table, $record_id, $old_values = null, $new_values = null) {
    $user_id = $_SESSION['admin_id'] ?? null;
    $stmt = $pdo->prepare("INSERT INTO audit_logs (table_name, record_id, action, old_values, new_values, changed_by, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())");
    $stmt->execute([$table, $record_id, $action, $old_values ? json_encode($old_values) : null, $new_values ? json_encode($new_values) : null, $user_id]);
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Orders Management - Egyptian Creativity</title>
    <link rel="stylesheet" href="css/admin-styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <style>
        .status-badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
            text-transform: uppercase;
        }
        .status-badge.pending { background: #fff3e0; color: #f57c00; }
        .status-badge.processing { background: #e3f2fd; color: #1976d2; }
        .status-badge.shipped { background: #f3e5f5; color: #7b1fa2; }
        .status-badge.delivered { background: #e8f5e8; color: #388e3c; }
        .status-badge.cancelled { background: #ffebee; color: #d32f2f; }
        
        .customer-info h4 {
            margin: 0 0 5px 0;
            color: #333;
            font-size: 14px;
        }
        .customer-info p {
            margin: 0;
            color: #666;
            font-size: 12px;
        }
        .products-info p {
            margin: 0;
            color: #666;
            font-size: 12px;
            line-height: 1.4;
        }
        
        .order-stats {
            display: flex;
            gap: 20px;
            align-items: center;
        }
        .stat-item {
            color: #666;
            font-size: 14px;
        }
        
        .order-info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .order-section {
            background: white;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e0e0e0;
        }
        .order-section h3 {
            margin: 0 0 15px 0;
            color: #333;
            font-size: 16px;
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 10px;
        }
        .info-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 5px 0;
        }
        .info-item label {
            font-weight: 500;
            color: #333;
        }
        .info-item span {
            color: #666;
        }
        .total-amount {
            font-weight: bold;
            color: #2e7d32 !important;
            font-size: 16px;
        }
        
        .order-items-table {
            background: white;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid #e0e0e0;
            margin-bottom: 20px;
        }
        .order-items-table table {
            width: 100%;
            border-collapse: collapse;
        }
        .order-items-table th,
        .order-items-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e0e0e0;
        }
        .order-items-table th {
            background: #f8f9fa;
            font-weight: 500;
            color: #333;
        }
        .product-image {
            width: 50px;
            height: 50px;
            border-radius: 4px;
            overflow: hidden;
        }
        .product-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            align-items: center;
            justify-content: center;
        }
        
        .modal-content {
            background-color: #fff;
            padding: 30px;
            border-radius: 12px;
            max-width: 400px;
            width: 90%;
            text-align: center;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }
        
        .modal-content h3 {
            margin: 0 0 15px 0;
            color: #333;
            font-size: 20px;
        }
        
        .modal-content p {
            margin: 0 0 25px 0;
            color: #666;
            line-height: 1.5;
        }
        
        .modal-actions {
            display: flex;
            gap: 10px;
            justify-content: center;
        }
        
        .message {
            padding: 12px 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-weight: 500;
        }
        
        .message.success {
            background-color: #e8f5e8;
            color: #2e7d32;
            border-left: 4px solid #4caf50;
        }
        
        .message.error {
            background-color: #ffebee;
            color: #c62828;
            border-left: 4px solid #f44336;
        }
        
        .search-input {
            padding: 10px 15px;
            border: 1px solid #ddd;
            border-radius: 8px;
            width: 250px;
            font-size: 14px;
        }
        
        .search-input:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
        }
        
        .action-buttons {
            display: flex;
            gap: 8px;
        }
        
        .btn {
            padding: 8px 16px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }
        
        .btn-primary {
            background: #007bff;
            color: white;
        }
        
        .btn-primary:hover {
            background: #0056b3;
        }
        
        .btn-secondary {
            background: #6c757d;
            color: white;
        }
        
        .btn-secondary:hover {
            background: #545b62;
        }
        
        .btn-danger {
            background: #dc3545;
            color: white;
        }
        
        .btn-danger:hover {
            background: #c82333;
        }
        
        .btn-small {
            padding: 6px 12px;
            font-size: 12px;
        }
        
        .order-actions {
            display: flex;
            gap: 10px;
            justify-content: flex-start;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="admin-container">
        <!-- Sidebar -->
        <aside class="admin-sidebar">
            <div class="sidebar-header">
                <div class="logo">
                    <img src="../images/logo_.png" alt="Egyptian Creativity" class="logo-img">
                    <div class="logo-text">
                        <div class="logo-main">THE EGYPTIAN</div>
                        <div class="logo-sub">CREATIVITY</div>
                    </div>
                </div>
                <div class="admin-info">
                    <div class="admin-avatar">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </div>
                    <div class="admin-details">
                        <div class="admin-name">Admin Panel</div>
                        <div class="admin-role">Administrator</div>
                    </div>
                </div>
            </div>
            
            <nav class="sidebar-nav">
                <a href="index.php" class="nav-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9,22 9,12 15,12 15,22"></polyline>
                    </svg>
                    Dashboard
                </a>
                <a href="products.php" class="nav-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                    Products
                </a>
                <a href="gallery.php" class="nav-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21,15 16,10 5,21"></polyline>
                    </svg>
                    Gallery
                </a>
                <a href="blogs.php" class="nav-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14,2 14,8 20,8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10,9 9,9 8,9"></polyline>
                    </svg>
                    Blogs
                </a>
                <a href="masterpieces.php" class="nav-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="12 2 15 8.5 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 9 8.5 12 2"></polygon>
                    </svg>
                    Masterpieces
                </a>
                <a href="orders.php" class="nav-item active">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                    Orders
                </a>
                <a href="analytics.php" class="nav-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="9" y1="17" x2="9" y2="13"></line>
                        <line x1="15" y1="17" x2="15" y2="7"></line>
                        <line x1="12" y1="17" x2="12" y2="10"></line>
                    </svg>
                    Analytics
                </a>
                <a href="logs.php" class="nav-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="8" y1="8" x2="16" y2="8"></line>
                        <line x1="8" y1="12" x2="16" y2="12"></line>
                        <line x1="8" y1="16" x2="16" y2="16"></line>
                    </svg>
                    Logs
                </a>
                <a href="settings.php" class="nav-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                    Settings
                </a>
            </nav>
            
            <div class="sidebar-footer">
                <a href="logout.php" class="logout-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16,17 21,12 16,7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Logout
                </a>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="admin-main">
            <header class="admin-header">
                <div class="header-content">
                    <h1 class="page-title">Orders Management</h1>
                    <div class="header-actions">
                        <div class="order-stats">
                            <span class="stat-item">
                                <strong><?php echo count($orders ?? []); ?></strong> Total Orders
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <div class="admin-content">
                <?php if ($message): ?>
                <div class="message <?php echo strpos($message, 'Error') !== false || strpos($message, 'error') !== false || strpos($message, 'Invalid') !== false ? 'error' : 'success'; ?>">
                    <?php echo htmlspecialchars($message); ?>
                </div>
                <?php endif; ?>

                <?php if ($action === 'list'): ?>
                <!-- Orders List -->
                <div class="orders-list">
                    <div class="list-header">
                        <h2>All Orders</h2>
                        <div class="list-actions">
                            <input type="text" id="searchOrders" placeholder="Search orders..." class="search-input" onkeyup="searchOrders()">
                        </div>
                    </div>
                    
                    <div class="orders-table">
                        <table id="ordersTable">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Products</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if (!empty($orders)): ?>
                                    <?php foreach ($orders as $order): ?>
                                    <tr>
                                        <td>#<?php echo $order['id']; ?></td>
                                        <td>
                                            <div class="customer-info">
                                                <h4><?php echo htmlspecialchars($order['customer_name'] ?? 'Unknown Customer'); ?></h4>
                                                <p><?php echo htmlspecialchars($order['customer_email'] ?? 'No email'); ?></p>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="products-info">
                                                <p><?php echo htmlspecialchars($order['products'] ?? 'No products'); ?></p>
                                            </div>
                                        </td>
                                        <td>$<?php echo number_format($order['total'] ?? 0, 2); ?></td>
                                        <td>
                                            <span class="status-badge <?php echo $order['status']; ?>">
                                                <?php echo ucfirst($order['status']); ?>
                                            </span>
                                        </td>
                                        <td><?php echo date('M j, Y', strtotime($order['created_at'])); ?></td>
                                        <td>
                                            <div class="action-buttons">
                                                <a href="orders.php?action=view&id=<?php echo $order['id']; ?>" class="btn btn-small btn-secondary">View</a>
                                                <button type="button" onclick="openUpdateModal(<?php echo $order['id']; ?>, '<?php echo $order['status']; ?>')" class="btn btn-small btn-primary">Update</button>
                                                <button type="button" onclick="openDeleteModal(<?php echo $order['id']; ?>, '#<?php echo $order['id']; ?>')" class="btn btn-small btn-danger">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                    <?php endforeach; ?>
                                <?php else: ?>
                                    <tr>
                                        <td colspan="7" style="text-align: center; padding: 40px; color: #666;">
                                            No orders found.
                                        </td>
                                    </tr>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
                <?php endif; ?>

                <?php if ($action === 'view'): ?>
                <!-- Order Details -->
                <div class="order-details">
                    <div class="form-header">
                        <h2>Order #<?php echo $order['id']; ?> Details</h2>
                        <a href="orders.php" class="btn btn-secondary">Back to Orders</a>
                    </div>
                    
                    <div class="order-info-grid">
                        <div class="order-section">
                            <h3>Customer Information</h3>
                            <div class="info-item">
                                <label>Name:</label>
                                <span><?php echo htmlspecialchars($order['customer_name'] ?? 'Unknown Customer'); ?></span>
                            </div>
                            <div class="info-item">
                                <label>Email:</label>
                                <span><?php echo htmlspecialchars($order['customer_email'] ?? 'No email'); ?></span>
                            </div>
                            <div class="info-item">
                                <label>Phone:</label>
                                <span><?php echo htmlspecialchars($order['customer_phone'] ?? 'No phone'); ?></span>
                            </div>
                            <div class="info-item">
                                <label>Address:</label>
                                <span><?php echo htmlspecialchars($order['customer_address'] ?? 'No address'); ?></span>
                            </div>
                        </div>
                        
                        <div class="order-section">
                            <h3>Order Information</h3>
                            <div class="info-item">
                                <label>Order ID:</label>
                                <span>#<?php echo $order['id']; ?></span>
                            </div>
                            <div class="info-item">
                                <label>Date:</label>
                                <span><?php echo date('F j, Y g:i A', strtotime($order['created_at'])); ?></span>
                            </div>
                            <div class="info-item">
                                <label>Status:</label>
                                <span class="status-badge <?php echo $order['status']; ?>"><?php echo ucfirst($order['status']); ?></span>
                            </div>
                            <div class="info-item">
                                <label>Payment Method:</label>
                                <span><?php echo htmlspecialchars($order['payment_method'] ?? 'Not specified'); ?></span>
                            </div>
                            <div class="info-item">
                                <label>Total:</label>
                                <span class="total-amount">$<?php echo number_format($order['total_price'] ?? 0, 2); ?></span>
                            </div>
                        </div>
                        
                    </div>
                    
                    <?php if (!empty($order_items)): ?>
                    <div class="order-items-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($order_items as $item): ?>
                                <tr>
                                    <td>
                                        <div class="product-image">
                                            <img src="../<?php echo $item['product_image'] ?: 'images/products/placeholder.jpg'; ?>" alt="<?php echo htmlspecialchars($item['product_name']); ?>">
                                        </div>
                                    </td>
                                    <td><?php echo htmlspecialchars($item['product_name']); ?></td>
                                    <td>$<?php echo number_format($item['product_price'], 2); ?></td>
                                    <td><?php echo $item['quantity']; ?></td>
                                    <td>$<?php echo number_format($item['product_price'] * $item['quantity'], 2); ?></td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                    <?php endif; ?>
                    
                    <div class="order-actions">
                        <button type="button" onclick="openUpdateModal(<?php echo $order['id']; ?>, '<?php echo $order['status']; ?>')" class="btn btn-primary">Update Status</button>
                        <a href="orders.php" class="btn btn-secondary">Back to Orders</a>
                    </div>
                </div>
                <?php endif; ?>
            </div>
        </main>
    </div>

    <!-- Update Status Modal -->
    <div id="updateStatusModal" class="modal">
        <div class="modal-content">
            <h3>Update Order Status</h3>
            <form method="POST" id="updateStatusForm">
                <input type="hidden" name="order_id" id="updateOrderId">
                <input type="hidden" name="action" value="update_status">
                <div class="form-group">
                    <label for="status">New Status</label>
                    <select id="status" name="status" required>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
                <div class="modal-actions">
                    <button type="submit" name="update_status" class="btn btn-primary">Update Status</button>
                    <button type="button" onclick="closeUpdateModal()" class="btn btn-secondary">Cancel</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div id="deleteModal" class="modal">
        <div class="modal-content">
            <h3>Confirm Delete</h3>
            <p id="deleteMessage">Are you sure you want to delete this order? This action cannot be undone.</p>
            <form method="POST" id="deleteForm">
                <input type="hidden" name="order_id" id="deleteId">
                <input type="hidden" name="action" value="delete">
                <div class="modal-actions">
                    <button type="submit" name="delete_order" class="btn btn-danger">Delete Order</button>
                    <button type="button" onclick="closeDeleteModal()" class="btn btn-secondary">Cancel</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        function openUpdateModal(id, currentStatus) {
            document.getElementById('updateOrderId').value = id;
            document.getElementById('status').value = currentStatus;
            document.getElementById('updateStatusModal').style.display = 'flex';
        }
        
        function closeUpdateModal() {
            document.getElementById('updateStatusModal').style.display = 'none';
        }
        
        function openDeleteModal(id, orderNumber) {
            document.getElementById('deleteId').value = id;
            document.getElementById('deleteMessage').innerHTML = `Are you sure you want to delete order <strong>${orderNumber}</strong>? This action cannot be undone.`;
            document.getElementById('deleteModal').style.display = 'flex';
        }
        
        function closeDeleteModal() {
            document.getElementById('deleteModal').style.display = 'none';
        }
        
        // Close modal when clicking outside
        window.onclick = function(event) {
            const updateModal = document.getElementById('updateStatusModal');
            const deleteModal = document.getElementById('deleteModal');
            if (event.target === updateModal) {
                closeUpdateModal();
            }
            if (event.target === deleteModal) {
                closeDeleteModal();
            }
        }
        
        // Search functionality
        function searchOrders() {
            const input = document.getElementById('searchOrders');
            const filter = input.value.toLowerCase();
            const table = document.getElementById('ordersTable');
            const rows = table.getElementsByTagName('tr');
            
            for (let i = 1; i < rows.length; i++) {
                const cells = rows[i].getElementsByTagName('td');
                let found = false;
                
                for (let j = 0; j < cells.length - 1; j++) {
                    const cellText = cells[j].textContent || cells[j].innerText;
                    if (cellText.toLowerCase().indexOf(filter) > -1) {
                        found = true;
                        break;
                    }
                }
                
                rows[i].style.display = found ? '' : 'none';
            }
        }
        
        // Auto-hide success messages after 5 seconds
        document.addEventListener('DOMContentLoaded', function() {
            const successMessages = document.querySelectorAll('.message.success');
            successMessages.forEach(function(message) {
                setTimeout(function() {
                    message.style.opacity = '0';
                    message.style.transition = 'opacity 0.5s';
                    setTimeout(function() {
                        message.remove();
                    }, 500);
                }, 5000);
            });
        });
    </script>
</body>
</html>