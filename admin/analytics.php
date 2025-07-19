<?php
session_start();
require_once '../includes/db.php';

// Check if admin is logged in
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: login.php');
    exit();
}

// Fetch analytics data
$stats = [
    'orders' => 0,
    'sales' => 0,
    'users' => 0,
    'products' => 0,
    'blogs' => 0,
];

// Orders count and total sales
$stmt = $pdo->query("SELECT COUNT(*) as count, SUM(total_price) as sales FROM orders");
$row = $stmt->fetch(PDO::FETCH_ASSOC);
$stats['orders'] = $row['count'] ?? 0;
$stats['sales'] = $row['sales'] ?? 0;

// Users count
$stmt = $pdo->query("SELECT COUNT(*) as count FROM users");
$stats['users'] = $stmt->fetch(PDO::FETCH_ASSOC)['count'] ?? 0;

// Products count
$stmt = $pdo->query("SELECT COUNT(*) as count FROM products");
$stats['products'] = $stmt->fetch(PDO::FETCH_ASSOC)['count'] ?? 0;

// Blogs count
$stmt = $pdo->query("SELECT COUNT(*) as count FROM blog_posts");
$stats['blogs'] = $stmt->fetch(PDO::FETCH_ASSOC)['count'] ?? 0;

// Orders per month (last 12 months)
$orders_per_month = [];
$stmt = $pdo->query("SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count, SUM(total_price) as sales FROM orders GROUP BY month ORDER BY month DESC LIMIT 12");
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $orders_per_month[] = $row;
}
$orders_per_month = array_reverse($orders_per_month);

// Product category distribution
$category_dist = [];
$stmt = $pdo->query("SELECT c.name as category, COUNT(p.id) as count FROM products p LEFT JOIN categories c ON p.category = c.id GROUP BY c.name");
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $category_dist[] = $row;
}

?><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Analytics Dashboard - Egyptian Creativity</title>
    <link rel="stylesheet" href="css/admin-styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        .analytics-cards { display: flex; gap: 2rem; margin-bottom: 2rem; flex-wrap: wrap; }
        .analytics-card { background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); padding: 2rem 2.5rem; min-width: 180px; flex: 1; text-align: center; }
        .analytics-card h3 { margin: 0 0 0.5rem 0; font-size: 2.2rem; color: #8d4c13; }
        .analytics-card p { margin: 0; color: #666; font-size: 1.1rem; }
        .charts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2rem; }
        .chart-container { background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); padding: 1.5rem; }
        .chart-title { font-size: 1.2rem; color: #333; margin-bottom: 1rem; }
    </style>
</head>
<body>
    <div class="admin-container">
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
                <a href="orders.php" class="nav-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                    Orders
                </a>
                <a href="analytics.php" class="nav-item active">
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
        <main class="admin-main">
            <header class="admin-header">
                <div class="header-content">
                    <h1 class="page-title">Analytics Dashboard</h1>
                </div>
            </header>
            <div class="admin-content">
                <div class="analytics-cards">
                    <div class="analytics-card">
                        <h3><?php echo $stats['orders']; ?></h3>
                        <p>Total Orders</p>
                    </div>
                    <div class="analytics-card">
                        <h3>$<?php echo number_format($stats['sales'], 2); ?></h3>
                        <p>Total Sales</p>
                    </div>
                    <div class="analytics-card">
                        <h3><?php echo $stats['users']; ?></h3>
                        <p>Total Users</p>
                    </div>
                    <div class="analytics-card">
                        <h3><?php echo $stats['products']; ?></h3>
                        <p>Total Products</p>
                    </div>
                    <div class="analytics-card">
                        <h3><?php echo $stats['blogs']; ?></h3>
                        <p>Total Blogs</p>
                    </div>
                </div>
                <div class="charts-grid">
                    <div class="chart-container">
                        <div class="chart-title">Orders & Sales (Last 12 Months)</div>
                        <canvas id="ordersSalesChart"></canvas>
                    </div>
                    <div class="chart-container">
                        <div class="chart-title">Product Category Distribution</div>
                        <canvas id="categoryPieChart"></canvas>
                    </div>
                </div>
            </div>
        </main>
    </div>
    <script>
        // Orders & Sales Chart
        const ordersSalesCtx = document.getElementById('ordersSalesChart').getContext('2d');
        const ordersSalesChart = new Chart(ordersSalesCtx, {
            type: 'bar',
            data: {
                labels: <?php echo json_encode(array_column($orders_per_month, 'month')); ?>,
                datasets: [
                    {
                        label: 'Orders',
                        data: <?php echo json_encode(array_column($orders_per_month, 'count')); ?>,
                        backgroundColor: 'rgba(33, 150, 243, 0.7)',
                        borderColor: 'rgba(33, 150, 243, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Sales',
                        data: <?php echo json_encode(array_map('floatval', array_column($orders_per_month, 'sales'))); ?>,
                        type: 'line',
                        fill: false,
                        borderColor: 'rgba(255, 193, 7, 1)',
                        backgroundColor: 'rgba(255, 193, 7, 0.3)',
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                interaction: { mode: 'index', intersect: false },
                stacked: false,
                plugins: { legend: { position: 'top' } },
                scales: {
                    y: { beginAtZero: true, title: { display: true, text: 'Orders' } },
                    y1: {
                        beginAtZero: true,
                        position: 'right',
                        grid: { drawOnChartArea: false },
                        title: { display: true, text: 'Sales ($)' }
                    }
                }
            }
        });
        // Product Category Pie Chart
        const categoryPieCtx = document.getElementById('categoryPieChart').getContext('2d');
        const categoryPieChart = new Chart(categoryPieCtx, {
            type: 'pie',
            data: {
                labels: <?php echo json_encode(array_column($category_dist, 'category')); ?>,
                datasets: [{
                    data: <?php echo json_encode(array_column($category_dist, 'count')); ?>,
                    backgroundColor: [
                        '#eac85b', '#8d4c13', '#2196f3', '#388e3c', '#f57c00', '#d32f2f', '#7b1fa2', '#1976d2', '#ffeb3b', '#00bcd4'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { position: 'right' } }
            }
        });
    </script>
</body>
</html> 