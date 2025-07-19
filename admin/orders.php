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
$orders = []; // Initialize orders array

// Handle form submissions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Debug: Log what's being received
    error_log('POST data received: ' . print_r($_POST, true));
    
    if (isset($_POST['update_status'])) {
        $order_id = $_POST['order_id'] ?? '';
        $new_status = $_POST['status'] ?? '';
        
        error_log('Updating order ' . $order_id . ' to status: ' . $new_status);
        
        try {
            $stmt = $pdo->prepare("UPDATE orders SET status = ? WHERE id = ?");
            if ($stmt->execute([$new_status, $order_id])) {
                $message = 'Order status updated successfully!';
                header('Location: orders.php?message=' . urlencode($message));
                exit();
            } else {
                $message = 'Error updating order status';
            }
        } catch (PDOException $e) {
            $message = 'Error updating order status: ' . $e->getMessage();
        }
    } elseif (isset($_POST['delete_order'])) {
        $order_id = $_POST['order_id'] ?? '';
        
        error_log('Deleting order: ' . $order_id);
        
        try {
            // Delete order items first (due to foreign key constraint)
            $stmt = $pdo->prepare("DELETE FROM order_items WHERE order_id = ?");
            $stmt->execute([$order_id]);
            
            // Delete the order
            $stmt = $pdo->prepare("DELETE FROM orders WHERE id = ?");
            if ($stmt->execute([$order_id])) {
                $message = 'Order deleted successfully!';
                header('Location: orders.php?message=' . urlencode($message));
                exit();
            } else {
                $message = 'Error deleting order';
            }
        } catch (PDOException $e) {
            $message = 'Error deleting order: ' . $e->getMessage();
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
    $id = $_GET['id'] ?? '';
    try {
        $stmt = $pdo->prepare("
            SELECT 
                o.*,
                u.full_name as customer_name,
                u.email as customer_email,
                GROUP_CONCAT(CONCAT(p.name, ' (', oi.quantity, ')') SEPARATOR ', ') as products,
                o.total_price as total
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN products p ON oi.product_id = p.id
            WHERE o.id = ?
            GROUP BY o.id
        ");
        $stmt->execute([$id]);
        $order = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$order) {
            header('Location: orders.php');
            exit();
        }
    } catch (PDOException $e) {
        header('Location: orders.php');
        exit();
    }
}

// Get message from URL
if (isset($_GET['message'])) {
    $message = $_GET['message'];
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
                <a href="orders.php" class="nav-item active">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                    Orders
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
                <div class="message <?php echo strpos($message, 'Error') !== false ? 'error' : 'success'; ?>">
                    <?php echo htmlspecialchars($message); ?>
                </div>
                <?php endif; ?>

                <?php if ($action === 'list'): ?>
                <!-- Orders List -->
                <div class="orders-list">
                    <div class="list-header">
                        <h2>All Orders</h2>
                        <div class="list-actions">
                            <input type="text" id="searchOrders" placeholder="Search orders..." class="search-input">
                        </div>
                    </div>
                    
                    <div class="orders-table">
                        <table>
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
                                            <button onclick="updateOrderStatus(<?php echo $order['id']; ?>)" class="btn btn-small btn-primary">Update</button>
                                            <button onclick="deleteOrder(<?php echo $order['id']; ?>)" class="btn btn-small btn-danger">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
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
                        </div>
                        
                        <div class="order-section">
                            <h3>Products</h3>
                            <div class="products-list">
                                <p><?php echo htmlspecialchars($order['products'] ?? 'No products'); ?></p>
                            </div>
                            <div class="info-item">
                                <label>Total:</label>
                                <span class="total-amount">$<?php echo number_format($order['total'] ?? 0, 2); ?></span>
                            </div>
                        </div>
                        
                        <?php if (!empty($order['notes'])): ?>
                        <div class="order-section">
                            <h3>Notes</h3>
                            <p><?php echo htmlspecialchars($order['notes']); ?></p>
                        </div>
                        <?php endif; ?>
                    </div>
                    
                    <div class="order-actions">
                        <button onclick="updateOrderStatus(<?php echo $order['id']; ?>)" class="btn btn-primary">Update Status</button>
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
            <form method="POST" action="orders.php" id="updateStatusForm">
                <input type="hidden" name="order_id" id="updateOrderId">
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
            <p>Are you sure you want to delete this order? This action cannot be undone.</p>
            <form method="POST" action="orders.php" id="deleteForm">
                <input type="hidden" name="order_id" id="deleteId">
                <div class="modal-actions">
                    <button type="submit" name="delete_order" class="btn btn-danger">Delete</button>
                    <button type="button" onclick="closeDeleteModal()" class="btn btn-secondary">Cancel</button>
                </div>
            </form>
        </div>
    </div>

    <script src="js/admin-script.js"></script>
    <script>
        function updateOrderStatus(id) {
            console.log('Updating order status for ID:', id);
            document.getElementById('updateOrderId').value = id;
            document.getElementById('updateStatusModal').style.display = 'flex';
        }
        
        function closeUpdateModal() {
            document.getElementById('updateStatusModal').style.display = 'none';
        }
        
        function deleteOrder(id) {
            console.log('Deleting order ID:', id);
            document.getElementById('deleteId').value = id;
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

        // Add form submission debugging
        document.addEventListener('DOMContentLoaded', function() {
            const updateForm = document.getElementById('updateStatusForm');
            const deleteForm = document.getElementById('deleteForm');
            
            if (updateForm) {
                updateForm.addEventListener('submit', function(e) {
                    console.log('Update form submitted');
                });
            }
            
            if (deleteForm) {
                deleteForm.addEventListener('submit', function(e) {
                    console.log('Delete form submitted');
                });
            }
        });
    </script>
</body>
</html> 