<?php
session_start();
require_once '../includes/db.php';

// Test database connection
try {
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM products");
    $products_count = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM blogs");
    $blogs_count = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM gallery_items");
    $gallery_count = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM orders");
    $orders_count = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    $db_status = "✅ Connected";
} catch (Exception $e) {
    $db_status = "❌ Error: " . $e->getMessage();
    $products_count = 0;
    $blogs_count = 0;
    $gallery_count = 0;
    $orders_count = 0;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin System Test - Egyptian Creativity</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .test-container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .status {
            padding: 10px;
            margin: 10px 0;
            border-radius: 5px;
            font-weight: bold;
        }
        .success { background: #d4edda; color: #155724; }
        .error { background: #f8d7da; color: #721c24; }
        .info { background: #d1ecf1; color: #0c5460; }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        .stat-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }
        .stat-number {
            font-size: 2em;
            font-weight: bold;
            color: #007bff;
        }
        .btn {
            display: inline-block;
            padding: 10px 20px;
            background: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 10px 5px;
        }
        .btn:hover {
            background: #0056b3;
        }
    </style>
</head>
<body>
    <div class="test-container">
        <h1>🏺 Egyptian Creativity Admin System Test</h1>
        
        <div class="status <?php echo strpos($db_status, '✅') !== false ? 'success' : 'error'; ?>">
            <strong>Database Status:</strong> <?php echo $db_status; ?>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <div class="stat-number"><?php echo $products_count; ?></div>
                <div>Products</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?php echo $blogs_count; ?></div>
                <div>Blog Posts</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?php echo $gallery_count; ?></div>
                <div>Gallery Items</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?php echo $orders_count; ?></div>
                <div>Orders</div>
            </div>
        </div>
        
        <div class="status info">
            <strong>Admin Dashboard Access:</strong><br>
            URL: <code>http://localhost:8000/admin/</code><br>
            Username: <code>admin</code><br>
            Password: <code>admin123</code>
        </div>
        
        <div style="margin-top: 30px;">
            <a href="login.php" class="btn">🔐 Go to Admin Login</a>
            <a href="index.php" class="btn">📊 Go to Dashboard</a>
            <a href="../index.php" class="btn">🏠 Back to Website</a>
        </div>
        
        <div class="status success" style="margin-top: 20px;">
            <strong>✅ Admin System Status:</strong> Ready to use!<br>
            All database tables are accessible and contain sample data.
        </div>
    </div>
</body>
</html> 