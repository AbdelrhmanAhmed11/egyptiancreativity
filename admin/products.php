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
    if ($action === 'add' || $action === 'edit') {
        $product_sku = trim($_POST['product_sku'] ?? '');
        $name = trim($_POST['name'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $price = floatval($_POST['price'] ?? 0);
        $stock = intval($_POST['stock'] ?? 0);
        $category = $_POST['category'] ?? '';
        $type = $_POST['type'] ?? 'featured';
        $has_box = isset($_POST['has_box']) ? 1 : 0;
        
        // Validation
        if (empty($product_sku) || empty($name) || empty($description) || $price <= 0 || $stock < 0 || empty($category)) {
            $message = 'Please fill in all required fields with valid values.';
        } else {
            // Handle product image upload
            $product_image = '';
            if (isset($_FILES['product_image']) && $_FILES['product_image']['error'] === UPLOAD_ERR_OK) {
                $upload_dir = '../images/products/';
                if (!is_dir($upload_dir)) {
                    mkdir($upload_dir, 0777, true);
                }
                
                $allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                if (in_array($_FILES['product_image']['type'], $allowed_types)) {
                    $file_extension = pathinfo($_FILES['product_image']['name'], PATHINFO_EXTENSION);
                    $file_name = 'product_' . uniqid() . '.' . $file_extension;
                    $upload_path = $upload_dir . $file_name;
                    
                    if (move_uploaded_file($_FILES['product_image']['tmp_name'], $upload_path)) {
                        $product_image = 'images/products/' . $file_name;
                    }
                }
            }
            
            // Handle box image upload
            $box_image = '';
            if (isset($_FILES['box_image']) && $_FILES['box_image']['error'] === UPLOAD_ERR_OK) {
                $upload_dir = '../images/products/';
                if (!is_dir($upload_dir)) {
                    mkdir($upload_dir, 0777, true);
                }
                
                $allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                if (in_array($_FILES['box_image']['type'], $allowed_types)) {
                    $file_extension = pathinfo($_FILES['box_image']['name'], PATHINFO_EXTENSION);
                    $file_name = 'box_' . uniqid() . '.' . $file_extension;
                    $upload_path = $upload_dir . $file_name;
                    
                    if (move_uploaded_file($_FILES['box_image']['tmp_name'], $upload_path)) {
                        $box_image = 'images/products/' . $file_name;
                    }
                }
            }
            
            $blog_id = !empty($_POST['blog_id']) ? $_POST['blog_id'] : null;
            
            if ($action === 'add') {
                try {
                    $stmt = $pdo->prepare("INSERT INTO products (product_sku, name, description, product_image, box_image, price, stock, category, type, has_box, blog_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())");
                    if ($stmt->execute([$product_sku, $name, $description, $product_image, $box_image, $price, $stock, $category, $type, $has_box, $blog_id])) {
                        $message = 'Product added successfully!';
                        header('Location: products.php?message=' . urlencode($message));
                        exit();
                    } else {
                        $message = 'Error adding product';
                    }
                } catch (PDOException $e) {
                    $message = 'Database error: ' . $e->getMessage();
                }
            } else {
                try {
                    $id = intval($_POST['id'] ?? 0);
                    if ($id > 0) {
                        $sql = "UPDATE products SET product_sku = ?, name = ?, description = ?, price = ?, stock = ?, category = ?, type = ?, has_box = ?, blog_id = ?";
                        $params = [$product_sku, $name, $description, $price, $stock, $category, $type, $has_box, $blog_id];
                        
                        if ($product_image) {
                            $sql .= ", product_image = ?";
                            $params[] = $product_image;
                        }
                        if ($box_image) {
                            $sql .= ", box_image = ?";
                            $params[] = $box_image;
                        }
                        
                        $sql .= " WHERE id = ?";
                        $params[] = $id;
                        
                        $stmt = $pdo->prepare($sql);
                        if ($stmt->execute($params)) {
                            $message = 'Product updated successfully!';
                            header('Location: products.php?message=' . urlencode($message));
                            exit();
                        } else {
                            $message = 'Error updating product';
                        }
                    } else {
                        $message = 'Invalid product ID';
                    }
                } catch (PDOException $e) {
                    $message = 'Database error: ' . $e->getMessage();
                }
            }
        }
    } elseif ($action === 'delete') {
        $id = intval($_POST['id'] ?? 0);
        if ($id > 0) {
            try {
                // Get the product to delete associated images
                $stmt = $pdo->prepare("SELECT product_image, box_image FROM products WHERE id = ?");
                $stmt->execute([$id]);
                $product = $stmt->fetch(PDO::FETCH_ASSOC);
                
                // Delete the product
                $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
                if ($stmt->execute([$id])) {
                    // Delete associated image files
                    if ($product && $product['product_image'] && file_exists('../' . $product['product_image'])) {
                        unlink('../' . $product['product_image']);
                    }
                    if ($product && $product['box_image'] && file_exists('../' . $product['box_image'])) {
                        unlink('../' . $product['box_image']);
                    }
                    
                    $message = 'Product deleted successfully!';
                    header('Location: products.php?message=' . urlencode($message));
                    exit();
                } else {
                    $message = 'Error deleting product';
                }
            } catch (PDOException $e) {
                $message = 'Database error: ' . $e->getMessage();
            }
        } else {
            $message = 'Invalid product ID';
        }
    }
}

// Get products for listing
if ($action === 'list') {
    $stmt = $pdo->query("
        SELECT p.*, c.name as category_name 
        FROM products p 
        LEFT JOIN categories c ON p.category = c.id 
        ORDER BY p.created_at DESC
    ");
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// Get product for editing
if ($action === 'edit') {
    $id = intval($_GET['id'] ?? 0);
    if ($id > 0) {
        $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
        $stmt->execute([$id]);
        $product = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$product) {
            header('Location: products.php?message=' . urlencode('Product not found'));
            exit();
        }
    } else {
        header('Location: products.php?message=' . urlencode('Invalid product ID'));
        exit();
    }
}

// Fetch categories for dropdown
$categories = [];
$cat_stmt = $pdo->query("SELECT id, name FROM categories ORDER BY name");
while ($row = $cat_stmt->fetch(PDO::FETCH_ASSOC)) {
    $categories[] = $row;
}

// Fetch published blogs for dropdown
$blogs = [];
$blog_stmt = $pdo->query("SELECT id, title FROM blog_posts WHERE status = 'published' ORDER BY created_at DESC");
while ($row = $blog_stmt->fetch(PDO::FETCH_ASSOC)) {
    $blogs[] = $row;
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
    <title>Products Management - Egyptian Creativity</title>
    <link rel="stylesheet" href="css/admin-styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <style>
        .product-image img {
            width: 60px;
            height: 60px;
            object-fit: cover;
            border-radius: 8px;
            border: 2px solid #e0e0e0;
        }
        .status-badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
            text-transform: uppercase;
        }
        .status-badge.featured { background: #e3f2fd; color: #1976d2; }
        .status-badge.new { background: #e8f5e8; color: #388e3c; }
        .status-badge.sale { background: #fff3e0; color: #f57c00; }
        
        .form-help {
            display: block;
            margin-top: 5px;
            font-size: 12px;
            color: #666;
            font-style: italic;
        }
        
        .current-image {
            margin-top: 10px;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 8px;
            border: 1px solid #e0e0e0;
        }
        
        .current-image p {
            margin: 0 0 10px 0;
            font-size: 14px;
            color: #333;
            font-weight: 500;
        }
        
        input[type="file"] {
            padding: 8px;
            border: 2px dashed #ddd;
            border-radius: 8px;
            background: #f8f9fa;
            width: 100%;
            transition: border-color 0.3s;
        }
        
        input[type="file"]:hover {
            border-color: #007bff;
        }
        
        input[type="checkbox"] {
            margin-right: 8px;
            vertical-align: middle;
        }
        
        .checkbox-label {
            display: flex;
            align-items: center;
            cursor: pointer;
            font-weight: 500;
            color: #333;
            margin-top: 8px;
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
            color: #d32f2f;
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
        .btn-gold-gradient {
            background: linear-gradient(90deg, #eac85b 0%, #8d4c13 100%);
            color: #fff;
            border: none;
            border-radius: 10px;
            padding: 12px 20px;
            font-size: 15px;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 2px 8px rgba(168,107,28,0.08);
            transition: background 0.2s, box-shadow 0.2s;
        }
        .btn-gold-gradient:hover {
            background: linear-gradient(90deg, #8d4c13 0%, #eac85b 100%);
            box-shadow: 0 4px 16px rgba(168,107,28,0.15);
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
                <a href="products.php" class="nav-item active">
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
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06-.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
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
                    <h1 class="page-title">Products Management</h1>
                    <div class="header-actions">
                        <a href="products.php?action=add" class="btn btn-gold-gradient">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:8px;"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            Add Product
                        </a>
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
                <!-- Products List -->
                <div class="products-list">
                    <div class="list-header">
                        <h2>All Products</h2>
                        <div class="list-actions">
                            <input type="text" id="searchProducts" placeholder="Search products..." class="search-input" onkeyup="searchProducts()">
                        </div>
                    </div>
                    
                    <div class="products-table">
                        <table id="productsTable">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>SKU</th>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Type</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if (!empty($products)): ?>
                                    <?php foreach ($products as $prodrow): ?>
                                    <tr>
                                        <td>
                                            <div class="product-image">
                                                <img src="../<?php echo $prodrow['product_image'] ?: 'images/products/placeholder.jpg'; ?>" alt="<?php echo htmlspecialchars($prodrow['name']); ?>">
                                            </div>
                                        </td>
                                        <td><?php echo htmlspecialchars($prodrow['product_sku']); ?></td>
                                        <td>
                                            <div class="product-info">
                                                <h4><?php echo htmlspecialchars($prodrow['name']); ?></h4>
                                                <p><?php echo htmlspecialchars(substr($prodrow['description'], 0, 50)) . '...'; ?></p>
                                            </div>
                                        </td>
                                        <td><?php echo htmlspecialchars($prodrow['category_name'] ?? 'No Category'); ?></td>
                                        <td>$<?php echo number_format($prodrow['price'], 2); ?></td>
                                        <td><?php echo $prodrow['stock']; ?></td>
                                        <td>
                                            <span class="status-badge <?php echo $prodrow['type'] ?? 'featured'; ?>">
                                                <?php echo ucfirst($prodrow['type'] ?? 'featured'); ?>
                                            </span>
                                        </td>
                                        <td>
                                            <div class="action-buttons">
                                                <a href="products.php?action=edit&id=<?php echo $prodrow['id']; ?>" class="btn btn-small btn-secondary">Edit</a>
                                                <button type="button" onclick="openDeleteModal(<?php echo $prodrow['id']; ?>, '<?php echo htmlspecialchars($prodrow['name'], ENT_QUOTES); ?>')" class="btn btn-small btn-danger">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                    <?php endforeach; ?>
                                <?php else: ?>
                                    <tr>
                                        <td colspan="8" style="text-align: center; padding: 40px; color: #666;">
                                            No products found. <a href="products.php?action=add">Add your first product</a>
                                        </td>
                                    </tr>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
                <?php endif; ?>

                <?php if ($action === 'add' || $action === 'edit'): ?>
                <!-- Add/Edit Product Form -->
                <div class="form-container">
                    <div class="form-header">
                        <h2><?php echo $action === 'add' ? 'Add New Product' : 'Edit Product: ' . htmlspecialchars($product['name'] ?? ''); ?></h2>
                        <a href="products.php" class="btn btn-secondary">Back to Products</a>
                    </div>
                    
                    <form method="POST" class="product-form" enctype="multipart/form-data">
                        <?php if ($action === 'edit'): ?>
                        <input type="hidden" name="id" value="<?php echo $product['id']; ?>">
                        <?php endif; ?>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="product_sku">Product SKU *</label>
                                <input type="text" id="product_sku" name="product_sku" value="<?php echo $action === 'edit' ? htmlspecialchars($product['product_sku']) : ''; ?>" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="name">Product Name *</label>
                                <input type="text" id="name" name="name" value="<?php echo $action === 'edit' ? htmlspecialchars($product['name']) : ''; ?>" required>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="price">Price ($) *</label>
                                <input type="number" id="price" name="price" step="0.01" min="0" value="<?php echo $action === 'edit' ? $product['price'] : ''; ?>" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="stock">Stock *</label>
                                <input type="number" id="stock" name="stock" min="0" value="<?php echo $action === 'edit' ? $product['stock'] : ''; ?>" required>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="category">Category *</label>
                                <select id="category" name="category" required>
                                    <option value="">Select Category</option>
                                    <?php foreach ($categories as $cat): ?>
                                        <option value="<?php echo $cat['id']; ?>" <?php echo ($action === 'edit' && $product['category'] == $cat['id']) ? 'selected' : ''; ?>>
                                            <?php echo htmlspecialchars($cat['name']); ?>
                                        </option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="type">Type</label>
                                <select id="type" name="type">
                                    <option value="featured" <?php echo ($action === 'edit' && $product['type'] === 'featured') ? 'selected' : ''; ?>>Featured</option>
                                    <option value="new" <?php echo ($action === 'edit' && $product['type'] === 'new') ? 'selected' : ''; ?>>New</option>
                                    <option value="sale" <?php echo ($action === 'edit' && $product['type'] === 'sale') ? 'selected' : ''; ?>>Sale</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="has_box" class="checkbox-label">
                                <input type="checkbox" id="has_box" name="has_box" value="1" <?php if ($action === 'edit' && !empty($product['has_box'])) echo 'checked'; ?>>
                                Has Box (Show "Buy with the Box" option)
                            </label>
                        </div>
                        
                        <div class="form-group">
                            <label for="description">Description *</label>
                            <textarea id="description" name="description" rows="4" required><?php echo $action === 'edit' ? htmlspecialchars($product['description']) : ''; ?></textarea>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="product_image">Product Image <?php echo $action === 'add' ? '*' : ''; ?></label>
                                <input type="file" id="product_image" name="product_image" accept="image/*" <?php echo $action === 'add' ? 'required' : ''; ?>>
                                <small class="form-help">Upload a high-quality image of the product (JPG, PNG, GIF, WEBP)</small>
                                <?php if ($action === 'edit' && !empty($product['product_image'])): ?>
                                <div class="current-image">
                                    <p>Current Product Image:</p>
                                    <img src="../<?php echo $product['product_image']; ?>" alt="Current product image" style="max-width: 200px; margin-top: 10px; border-radius: 8px;">
                                </div>
                                <?php endif; ?>
                            </div>
                            
                            <div class="form-group">
                                <label for="box_image">Gift Box Image</label>
                                <input type="file" id="box_image" name="box_image" accept="image/*">
                                <small class="form-help">Upload an image of the gift box (optional)</small>
                                <?php if ($action === 'edit' && !empty($product['box_image'])): ?>
                                <div class="current-image">
                                    <p>Current Box Image:</p>
                                    <img src="../<?php echo $product['box_image']; ?>" alt="Current box image" style="max-width: 200px; margin-top: 10px; border-radius: 8px;">
                                </div>
                                <?php endif; ?>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="blog_id">Related Blog Post</label>
                            <select id="blog_id" name="blog_id">
                                <option value="">No Related Blog</option>
                                <?php foreach ($blogs as $blog): ?>
                                    <option value="<?php echo $blog['id']; ?>" <?php if ($action === 'edit' && !empty($product['blog_id']) && $product['blog_id'] == $blog['id']) echo 'selected'; ?>>
                                        <?php echo htmlspecialchars($blog['title']); ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">
                                <?php echo $action === 'add' ? 'Add Product' : 'Update Product'; ?>
                            </button>
                            <a href="products.php" class="btn btn-secondary">Cancel</a>
                        </div>
                    </form>
                </div>
                <?php endif; ?>
            </div>
        </main>
    </div>

    <!-- Delete Confirmation Modal -->
    <div id="deleteModal" class="modal">
        <div class="modal-content">
            <h3>Confirm Delete</h3>
            <p id="deleteMessage">Are you sure you want to delete this product? This action cannot be undone.</p>
            <form method="POST" id="deleteForm">
                <input type="hidden" name="id" id="deleteId">
                <input type="hidden" name="action" value="delete">
                <div class="modal-actions">
                    <button type="submit" class="btn btn-danger">Delete Product</button>
                    <button type="button" onclick="closeDeleteModal()" class="btn btn-secondary">Cancel</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        function openDeleteModal(id, productName) {
            document.getElementById('deleteId').value = id;
            document.getElementById('deleteMessage').innerHTML = `Are you sure you want to delete "<strong>${productName}</strong>"? This action cannot be undone.`;
            document.getElementById('deleteModal').style.display = 'flex';
        }
        
        function closeDeleteModal() {
            document.getElementById('deleteModal').style.display = 'none';
        }
        
        // Close modal when clicking outside
        window.onclick = function(event) {
            const modal = document.getElementById('deleteModal');
            if (event.target === modal) {
                closeDeleteModal();
            }
        }
        
        // Search functionality
        function searchProducts() {
            const input = document.getElementById('searchProducts');
            const filter = input.value.toLowerCase();
            const table = document.getElementById('productsTable');
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

        // Form validation
        document.addEventListener('DOMContentLoaded', function() {
            const form = document.querySelector('.product-form');
            if (form) {
                form.addEventListener('submit', function(e) {
                    const price = parseFloat(document.getElementById('price').value);
                    const stock = parseInt(document.getElementById('stock').value);
                    
                    if (price <= 0) {
                        e.preventDefault();
                        alert('Price must be greater than 0');
                        return false;
                    }
                    
                    if (stock < 0) {
                        e.preventDefault();
                        alert('Stock cannot be negative');
                        return false;
                    }
                });
            }
        });
    </script>
</body>
</html>