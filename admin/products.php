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
        $product_sku = $_POST['product_sku'] ?? '';
        $name = $_POST['name'] ?? '';
        $description = $_POST['description'] ?? '';
        $price = $_POST['price'] ?? '';
        $stock = $_POST['stock'] ?? '';
        $category = $_POST['category'] ?? '';
        $type = $_POST['type'] ?? 'featured';
        $has_box = isset($_POST['has_box']) ? 1 : 0;
        
        // Handle product image upload
        $product_image = '';
        if (isset($_FILES['product_image']) && $_FILES['product_image']['error'] === UPLOAD_ERR_OK) {
            $upload_dir = '../images/products/';
            if (!is_dir($upload_dir)) {
                mkdir($upload_dir, 0777, true);
            }
            
            $file_extension = pathinfo($_FILES['product_image']['name'], PATHINFO_EXTENSION);
            $file_name = 'product_' . uniqid() . '.' . $file_extension;
            $upload_path = $upload_dir . $file_name;
            
            if (move_uploaded_file($_FILES['product_image']['tmp_name'], $upload_path)) {
                $product_image = 'images/products/' . $file_name;
            }
        }
        
        // Handle box image upload
        $box_image = '';
        if (isset($_FILES['box_image']) && $_FILES['box_image']['error'] === UPLOAD_ERR_OK) {
            $upload_dir = '../images/products/';
            if (!is_dir($upload_dir)) {
                mkdir($upload_dir, 0777, true);
            }
            
            $file_extension = pathinfo($_FILES['box_image']['name'], PATHINFO_EXTENSION);
            $file_name = 'box_' . uniqid() . '.' . $file_extension;
            $upload_path = $upload_dir . $file_name;
            
            if (move_uploaded_file($_FILES['box_image']['tmp_name'], $upload_path)) {
                $box_image = 'images/products/' . $file_name;
            }
        }
        
        if ($action === 'add') {
            $stmt = $pdo->prepare("INSERT INTO products (product_sku, name, description, product_image, box_image, price, stock, category, type, has_box, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())");
            if ($stmt->execute([$product_sku, $name, $description, $product_image, $box_image, $price, $stock, $category, $type, $has_box])) {
                $message = 'Product added successfully!';
                header('Location: products.php?message=' . urlencode($message));
                exit();
            } else {
                $message = 'Error adding product';
            }
        } else {
            $id = $_POST['id'] ?? '';
            $product_image_sql = $product_image ? ", product_image = ?" : "";
            $box_image_sql = $box_image ? ", box_image = ?" : "";
            $sql = "UPDATE products SET product_sku = ?, name = ?, description = ?, price = ?, stock = ?, category = ?, type = ?, has_box = ?" . $product_image_sql . $box_image_sql . " WHERE id = ?";
            $params = [$product_sku, $name, $description, $price, $stock, $category, $type, $has_box];
            if ($product_image) $params[] = $product_image;
            if ($box_image) $params[] = $box_image;
            $params[] = $id;
            
            $stmt = $pdo->prepare($sql);
            if ($stmt->execute($params)) {
                $message = 'Product updated successfully!';
                header('Location: products.php?message=' . urlencode($message));
                exit();
            } else {
                $message = 'Error updating product';
            }
        }
    } elseif ($action === 'delete') {
        $id = $_POST['id'] ?? '';
        $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
        if ($stmt->execute([$id])) {
            $message = 'Product deleted successfully!';
        } else {
            $message = 'Error deleting product';
        }
    }
}

// Get products for listing
if ($action === 'list') {
    $stmt = $pdo->query("SELECT * FROM products ORDER BY created_at DESC");
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// Get product for editing
if ($action === 'edit') {
    $id = $_GET['id'] ?? '';
    $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
    $stmt->execute([$id]);
    $product = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$product) {
        header('Location: products.php');
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
            margin-top: 8px;
        }
        
        .checkbox-label {
            display: flex;
            align-items: center;
            cursor: pointer;
            font-weight: 500;
            color: #333;
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
                <a href="orders.php" class="nav-item">
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
                        <a href="products.php?action=add" class="btn btn-primary">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Add Product
                        </a>
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
                <!-- Products List -->
                <div class="products-list">
                    <div class="list-header">
                        <h2>All Products</h2>
                        <div class="list-actions">
                            <input type="text" id="searchProducts" placeholder="Search products..." class="search-input">
                        </div>
                    </div>
                    
                    <div class="products-table">
                        <table>
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
                                <?php foreach ($products as $product): ?>
                                <tr>
                                    <td>
                                        <div class="product-image">
                                            <img src="../<?php echo $product['product_image'] ?: 'images/products/placeholder.jpg'; ?>" alt="<?php echo htmlspecialchars($product['name']); ?>">
                                        </div>
                                    </td>
                                    <td><?php echo htmlspecialchars($product['product_sku']); ?></td>
                                    <td>
                                        <div class="product-info">
                                            <h4><?php echo htmlspecialchars($product['name']); ?></h4>
                                            <p><?php echo htmlspecialchars(substr($product['description'], 0, 50)) . '...'; ?></p>
                                        </div>
                                    </td>
                                    <td><?php echo htmlspecialchars($product['category']); ?></td>
                                    <td>$<?php echo number_format($product['price'], 2); ?></td>
                                    <td><?php echo $product['stock']; ?></td>
                                    <td>
                                        <span class="status-badge <?php echo $product['type'] ?? 'featured'; ?>">
                                            <?php echo ucfirst($product['type'] ?? 'featured'); ?>
                                        </span>
                                    </td>
                                    <td>
                                        <div class="action-buttons">
                                            <a href="products.php?action=edit&id=<?php echo $product['id']; ?>" class="btn btn-small btn-secondary">Edit</a>
                                            <button onclick="deleteProduct(<?php echo $product['id']; ?>)" class="btn btn-small btn-danger">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
                <?php endif; ?>

                <?php if ($action === 'add' || $action === 'edit'): ?>
                <!-- Add/Edit Product Form -->
                <div class="form-container">
                    <div class="form-header">
                        <h2><?php echo $action === 'add' ? 'Add New Product' : 'Edit Product'; ?></h2>
                        <a href="products.php" class="btn btn-secondary">Back to Products</a>
                    </div>
                    
                    <form method="POST" class="product-form" enctype="multipart/form-data">
                        <?php if ($action === 'edit'): ?>
                        <input type="hidden" name="id" value="<?php echo $product['id']; ?>">
                        <?php endif; ?>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="product_sku">Product SKU</label>
                                <input type="text" id="product_sku" name="product_sku" value="<?php echo $action === 'edit' ? htmlspecialchars($product['product_sku']) : ''; ?>" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="name">Product Name</label>
                                <input type="text" id="name" name="name" value="<?php echo $action === 'edit' ? htmlspecialchars($product['name']) : ''; ?>" required>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="price">Price</label>
                                <input type="number" id="price" name="price" step="0.01" value="<?php echo $action === 'edit' ? $product['price'] : ''; ?>" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="stock">Stock</label>
                                <input type="number" id="stock" name="stock" value="<?php echo $action === 'edit' ? $product['stock'] : ''; ?>" required>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="category">Category</label>
                                <select id="category" name="category" required>
                                    <option value="">Select Category</option>
                                    <option value="Accessories" <?php echo ($action === 'edit' && $product['category'] === 'Accessories') ? 'selected' : ''; ?>>Accessories</option>
                                    <option value="Decorations" <?php echo ($action === 'edit' && $product['category'] === 'Decorations') ? 'selected' : ''; ?>>Decorations</option>
                                    <option value="Boxes" <?php echo ($action === 'edit' && $product['category'] === 'Boxes') ? 'selected' : ''; ?>>Boxes</option>
                                    <option value="Game Boxes" <?php echo ($action === 'edit' && $product['category'] === 'Game Boxes') ? 'selected' : ''; ?>>Game Boxes</option>
                                    <option value="Fashion" <?php echo ($action === 'edit' && $product['category'] === 'Fashion') ? 'selected' : ''; ?>>Fashion</option>
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
                            <label for="description">Description</label>
                            <textarea id="description" name="description" rows="4" required><?php echo $action === 'edit' ? htmlspecialchars($product['description']) : ''; ?></textarea>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="product_image">Product Image</label>
                                <input type="file" id="product_image" name="product_image" accept="image/*" <?php echo $action === 'add' ? 'required' : ''; ?>>
                                <small class="form-help">Upload a high-quality image of the product (JPG, PNG, GIF)</small>
                                <?php if ($action === 'edit' && isset($product['product_image']) && $product['product_image']): ?>
                                <div class="current-image">
                                    <p>Current Product Image:</p>
                                    <img src="../<?php echo $product['product_image']; ?>" alt="Current product image" style="max-width: 200px; margin-top: 10px; border-radius: 8px;">
                                </div>
                                <?php endif; ?>
                            </div>
                            
                            <div class="form-group">
                                <label for="has_box" class="checkbox-label">
                                    <input type="checkbox" id="has_box" name="has_box" <?php echo ($action === 'edit' && $product['has_box']) ? 'checked' : ''; ?>>
                                    Product has Gift Box
                                </label>
                            </div>
                        </div>
                        
                        <div class="form-group" id="box_image_section" style="display: none;">
                            <label for="box_image">Gift Box Image</label>
                            <input type="file" id="box_image" name="box_image" accept="image/*">
                            <small class="form-help">Upload an image of the gift box (optional)</small>
                            <?php if ($action === 'edit' && isset($product['box_image']) && $product['box_image']): ?>
                            <div class="current-image">
                                <p>Current Box Image:</p>
                                <img src="../<?php echo $product['box_image']; ?>" alt="Current box image" style="max-width: 200px; margin-top: 10px; border-radius: 8px;">
                            </div>
                            <?php endif; ?>
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
            <p>Are you sure you want to delete this product? This action cannot be undone.</p>
            <form method="POST" id="deleteForm">
                <input type="hidden" name="id" id="deleteId">
                <div class="modal-actions">
                    <button type="submit" class="btn btn-danger">Delete</button>
                    <button type="button" onclick="closeDeleteModal()" class="btn btn-secondary">Cancel</button>
                </div>
            </form>
        </div>
    </div>

    <script src="js/admin-script.js"></script>
    <script>
        function deleteProduct(id) {
            document.getElementById('deleteId').value = id;
            document.getElementById('deleteModal').style.display = 'flex';
        }
        
        function closeDeleteModal() {
            document.getElementById('deleteModal').style.display = 'none';
        }
        
        // Show/hide box image section based on checkbox
        document.addEventListener('DOMContentLoaded', function() {
            const hasBoxCheckbox = document.getElementById('has_box');
            const boxImageSection = document.getElementById('box_image_section');
            
            if (hasBoxCheckbox && boxImageSection) {
                // Show/hide on page load
                boxImageSection.style.display = hasBoxCheckbox.checked ? 'block' : 'none';
                
                // Show/hide on checkbox change
                hasBoxCheckbox.addEventListener('change', function() {
                    boxImageSection.style.display = this.checked ? 'block' : 'none';
                });
            }
        });
        
        // Close modal when clicking outside
        window.onclick = function(event) {
            const modal = document.getElementById('deleteModal');
            if (event.target === modal) {
                closeDeleteModal();
            }
        }
    </script>
</body>
</html> 