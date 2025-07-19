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
        $title = trim($_POST['title'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $category = $_POST['category'] ?? '';
        $price = floatval($_POST['price'] ?? 0);
        
        // Validation
        if (empty($title) || empty($description) || empty($category)) {
            $message = 'Please fill in all required fields.';
        } else {
            // Handle image upload
            $image = '';
            if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
                $upload_dir = '../images/gallery/';
                if (!is_dir($upload_dir)) {
                    mkdir($upload_dir, 0777, true);
                }
                
                $allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                if (in_array($_FILES['image']['type'], $allowed_types)) {
                    $file_extension = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
                    $file_name = 'gallery_' . uniqid() . '.' . $file_extension;
                    $upload_path = $upload_dir . $file_name;
                    
                    if (move_uploaded_file($_FILES['image']['tmp_name'], $upload_path)) {
                        $image = 'images/gallery/' . $file_name;
                    }
                }
            }
            
            $materials = trim($_POST['materials'] ?? '');
            $dimensions = trim($_POST['dimensions'] ?? '');
            $weight = trim($_POST['weight'] ?? '');
            $origin = trim($_POST['origin'] ?? '');
            
            if ($action === 'add') {
                try {
                    $stmt = $pdo->prepare("INSERT INTO gallery_items (title, description, category, price, image, materials, dimensions, weight, origin, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())");
                    if ($stmt->execute([$title, $description, $category, $price, $image, $materials, $dimensions, $weight, $origin])) {
                        $new_id = $pdo->lastInsertId();
                        log_action($pdo, 'INSERT', 'gallery_items', $new_id, null, compact('title','description','category','price','image','materials','dimensions','weight','origin'));
                        $message = 'Gallery item added successfully!';
                        header('Location: gallery.php?message=' . urlencode($message));
                        exit();
                    } else {
                        $message = 'Error adding gallery item';
                    }
                } catch (PDOException $e) {
                    $message = 'Database error: ' . $e->getMessage();
                }
            } else {
                try {
                    $id = intval($_POST['id'] ?? 0);
                    if ($id > 0) {
                        $sql = "UPDATE gallery_items SET title = ?, description = ?, category = ?, price = ?, materials = ?, dimensions = ?, weight = ?, origin = ?";
                        $params = [$title, $description, $category, $price, $materials, $dimensions, $weight, $origin];
                        
                        if ($image) {
                            $sql .= ", image = ?";
                            $params[] = $image;
                        }
                        
                        $sql .= " WHERE id = ?";
                        $params[] = $id;
                        
                        $stmt = $pdo->prepare($sql);
                        $old = $pdo->query("SELECT * FROM gallery_items WHERE id = $id")->fetch(PDO::FETCH_ASSOC);
                        if ($stmt->execute($params)) {
                            log_action($pdo, 'UPDATE', 'gallery_items', $id, $old, $_POST);
                            $message = 'Gallery item updated successfully!';
                            header('Location: gallery.php?message=' . urlencode($message));
                            exit();
                        } else {
                            $message = 'Error updating gallery item';
                        }
                    } else {
                        $message = 'Invalid gallery item ID';
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
                // Get the gallery item to delete associated image
                $stmt = $pdo->prepare("SELECT image FROM gallery_items WHERE id = ?");
                $stmt->execute([$id]);
                $gallery_item = $stmt->fetch(PDO::FETCH_ASSOC);
                
                // Delete the gallery item
                $stmt = $pdo->prepare("DELETE FROM gallery_items WHERE id = ?");
                if ($stmt->execute([$id])) {
                    log_action($pdo, 'DELETE', 'gallery_items', $id, $gallery_item, null);
                    // Delete associated image file
                    if ($gallery_item && $gallery_item['image'] && file_exists('../' . $gallery_item['image'])) {
                        unlink('../' . $gallery_item['image']);
                    }
                    
                    $message = 'Gallery item deleted successfully!';
                    header('Location: gallery.php?message=' . urlencode($message));
                    exit();
                } else {
                    $message = 'Error deleting gallery item';
                }
            } catch (PDOException $e) {
                $message = 'Database error: ' . $e->getMessage();
            }
        } else {
            $message = 'Invalid gallery item ID';
        }
    }
}

// Get gallery items for listing
if ($action === 'list') {
    $stmt = $pdo->query("SELECT * FROM gallery_items ORDER BY created_at DESC");
    $gallery_items = $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// Get gallery item for editing
if ($action === 'edit') {
    $id = intval($_GET['id'] ?? 0);
    if ($id > 0) {
        $stmt = $pdo->prepare("SELECT * FROM gallery_items WHERE id = ?");
        $stmt->execute([$id]);
        $gallery_item = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$gallery_item) {
            header('Location: gallery.php?message=' . urlencode('Gallery item not found'));
            exit();
        }
    } else {
        header('Location: gallery.php?message=' . urlencode('Invalid gallery item ID'));
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
    <title>Gallery Management - Egyptian Creativity</title>
    <link rel="stylesheet" href="css/admin-styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <style>
        .gallery-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .gallery-item-card {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .gallery-item-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }
        .item-image {
            position: relative;
            height: 200px;
            overflow: hidden;
        }
        .item-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .item-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s;
        }
        .gallery-item-card:hover .item-overlay {
            opacity: 1;
        }
        .overlay-actions {
            display: flex;
            gap: 10px;
        }
        .item-info {
            padding: 20px;
        }
        .item-info h4 {
            margin: 0 0 10px 0;
            color: #333;
            font-size: 18px;
        }
        .item-info p {
            margin: 0 0 15px 0;
            color: #666;
            line-height: 1.5;
        }
        .item-meta {
            display: flex;
            gap: 10px;
            align-items: center;
        }
        .category-badge {
            background: #e3f2fd;
            color: #1976d2;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
        }
        .price-badge {
            background: #e8f5e8;
            color: #388e3c;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
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
                <a href="products.php" class="nav-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                    Products
                </a>
                <a href="gallery.php" class="nav-item active">
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
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06-.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l-.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06-.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
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
                    <h1 class="page-title">Gallery Management</h1>
                    <div class="header-actions">
                        <a href="gallery.php?action=add" class="btn btn-gold-gradient">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:8px;"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            Add Gallery Item
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
                <!-- Gallery Items List -->
                <div class="gallery-list">
                    <div class="list-header">
                        <h2>All Gallery Items</h2>
                        <div class="list-actions">
                            <input type="text" id="searchGallery" placeholder="Search gallery items..." class="search-input" onkeyup="searchGallery()">
                        </div>
                    </div>
                    
                    <div class="gallery-grid" id="galleryGrid">
                        <?php if (!empty($gallery_items)): ?>
                            <?php foreach ($gallery_items as $item): ?>
                            <div class="gallery-item-card">
                                <div class="item-image">
                                    <img src="../<?php echo $item['image'] ?: 'images/gallery/placeholder.jpg'; ?>" alt="<?php echo htmlspecialchars($item['title']); ?>">
                                    <div class="item-overlay">
                                        <div class="overlay-actions">
                                            <a href="gallery.php?action=edit&id=<?php echo $item['id']; ?>" class="btn btn-small btn-secondary">Edit</a>
                                            <button type="button" onclick="openDeleteModal(<?php echo $item['id']; ?>, '<?php echo htmlspecialchars($item['title'], ENT_QUOTES); ?>')" class="btn btn-small btn-danger">Delete</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="item-info">
                                    <h4><?php echo htmlspecialchars($item['title']); ?></h4>
                                    <p><?php echo htmlspecialchars(substr($item['description'], 0, 100)) . '...'; ?></p>
                                    <div class="item-meta">
                                        <span class="category-badge"><?php echo htmlspecialchars($item['category']); ?></span>
                                        <?php if ($item['price'] > 0): ?>
                                        <span class="price-badge">$<?php echo number_format($item['price'], 2); ?></span>
                                        <?php endif; ?>
                                    </div>
                                </div>
                            </div>
                            <?php endforeach; ?>
                        <?php else: ?>
                            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #666;">
                                No gallery items found. <a href="gallery.php?action=add">Add your first gallery item</a>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
                <?php endif; ?>

                <?php if ($action === 'add' || $action === 'edit'): ?>
                <!-- Add/Edit Gallery Item Form -->
                <div class="form-container">
                    <div class="form-header">
                        <h2><?php echo $action === 'add' ? 'Add New Gallery Item' : 'Edit Gallery Item: ' . htmlspecialchars($gallery_item['title'] ?? ''); ?></h2>
                        <a href="gallery.php" class="btn btn-secondary">Back to Gallery</a>
                    </div>
                    
                    <form method="POST" enctype="multipart/form-data" class="gallery-form">
                        <?php if ($action === 'edit'): ?>
                        <input type="hidden" name="id" value="<?php echo $gallery_item['id']; ?>">
                        <?php endif; ?>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="title">Title *</label>
                                <input type="text" id="title" name="title" value="<?php echo $action === 'edit' ? htmlspecialchars($gallery_item['title']) : ''; ?>" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="category">Category *</label>
                                <select id="category" name="category" required>
                                    <option value="">Select Category</option>
                                    <option value="Jewelry" <?php echo ($action === 'edit' && $gallery_item['category'] === 'Jewelry') ? 'selected' : ''; ?>>Jewelry</option>
                                    <option value="Decorations" <?php echo ($action === 'edit' && $gallery_item['category'] === 'Decorations') ? 'selected' : ''; ?>>Decorations</option>
                                    <option value="Accessories" <?php echo ($action === 'edit' && $gallery_item['category'] === 'Accessories') ? 'selected' : ''; ?>>Accessories</option>
                                    <option value="Boxes" <?php echo ($action === 'edit' && $gallery_item['category'] === 'Boxes') ? 'selected' : ''; ?>>Boxes</option>
                                    <option value="Games" <?php echo ($action === 'edit' && $gallery_item['category'] === 'Games') ? 'selected' : ''; ?>>Games</option>
                                    <option value="Masks" <?php echo ($action === 'edit' && $gallery_item['category'] === 'Masks') ? 'selected' : ''; ?>>Masks</option>
                                    <option value="Statues" <?php echo ($action === 'edit' && $gallery_item['category'] === 'Statues') ? 'selected' : ''; ?>>Statues</option>
                                    <option value="Art" <?php echo ($action === 'edit' && $gallery_item['category'] === 'Art') ? 'selected' : ''; ?>>Art</option>
                                    <option value="Symbols" <?php echo ($action === 'edit' && $gallery_item['category'] === 'Symbols') ? 'selected' : ''; ?>>Symbols</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="price">Price (Optional)</label>
                                <input type="number" id="price" name="price" step="0.01" min="0" value="<?php echo $action === 'edit' ? $gallery_item['price'] : ''; ?>">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="description">Description *</label>
                            <textarea id="description" name="description" rows="4" required><?php echo $action === 'edit' ? htmlspecialchars($gallery_item['description']) : ''; ?></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label for="image">Gallery Image <?php echo $action === 'add' ? '*' : ''; ?></label>
                            <input type="file" id="image" name="image" accept="image/*" <?php echo $action === 'add' ? 'required' : ''; ?>>
                            <small style="display: block; margin-top: 5px; font-size: 12px; color: #666; font-style: italic;">Upload a high-quality image (JPG, PNG, GIF, WEBP)</small>
                            <?php if ($action === 'edit' && !empty($gallery_item['image'])): ?>
                            <div class="current-image">
                                <p>Current Image:</p>
                                <img src="../<?php echo $gallery_item['image']; ?>" alt="Current gallery image" style="max-width: 200px; margin-top: 10px; border-radius: 8px;">
                            </div>
                            <?php endif; ?>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="materials">Materials</label>
                                <input type="text" id="materials" name="materials" value="<?php echo $action === 'edit' ? htmlspecialchars($gallery_item['materials'] ?? '') : ''; ?>" placeholder="e.g. Authentic Egyptian Materials">
                            </div>
                            <div class="form-group">
                                <label for="dimensions">Dimensions</label>
                                <input type="text" id="dimensions" name="dimensions" value="<?php echo $action === 'edit' ? htmlspecialchars($gallery_item['dimensions'] ?? '') : ''; ?>" placeholder="e.g. Various sizes available">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="weight">Weight</label>
                                <input type="text" id="weight" name="weight" value="<?php echo $action === 'edit' ? htmlspecialchars($gallery_item['weight'] ?? '') : ''; ?>" placeholder="e.g. Varies by item">
                            </div>
                            <div class="form-group">
                                <label for="origin">Origin</label>
                                <input type="text" id="origin" name="origin" value="<?php echo $action === 'edit' ? htmlspecialchars($gallery_item['origin'] ?? '') : ''; ?>" placeholder="e.g. Handcrafted in Egypt">
                            </div>
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">
                                <?php echo $action === 'add' ? 'Add Gallery Item' : 'Update Gallery Item'; ?>
                            </button>
                            <a href="gallery.php" class="btn btn-secondary">Cancel</a>
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
            <p id="deleteMessage">Are you sure you want to delete this gallery item? This action cannot be undone.</p>
            <form method="POST" id="deleteForm">
                <input type="hidden" name="id" id="deleteId">
                <input type="hidden" name="action" value="delete">
                <div class="modal-actions">
                    <button type="submit" class="btn btn-danger">Delete Gallery Item</button>
                    <button type="button" onclick="closeDeleteModal()" class="btn btn-secondary">Cancel</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        function openDeleteModal(id, itemTitle) {
            document.getElementById('deleteId').value = id;
            document.getElementById('deleteMessage').innerHTML = `Are you sure you want to delete "<strong>${itemTitle}</strong>"? This action cannot be undone.`;
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
        function searchGallery() {
            const input = document.getElementById('searchGallery');
            const filter = input.value.toLowerCase();
            const grid = document.getElementById('galleryGrid');
            const cards = grid.getElementsByClassName('gallery-item-card');
            
            for (let i = 0; i < cards.length; i++) {
                const title = cards[i].querySelector('h4').textContent || cards[i].querySelector('h4').innerText;
                const description = cards[i].querySelector('p').textContent || cards[i].querySelector('p').innerText;
                const category = cards[i].querySelector('.category-badge').textContent || cards[i].querySelector('.category-badge').innerText;
                
                const searchText = (title + ' ' + description + ' ' + category).toLowerCase();
                
                if (searchText.indexOf(filter) > -1) {
                    cards[i].style.display = '';
                } else {
                    cards[i].style.display = 'none';
                }
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
            const form = document.querySelector('.gallery-form');
            if (form) {
                form.addEventListener('submit', function(e) {
                    const price = parseFloat(document.getElementById('price').value);
                    
                    if (price < 0) {
                        e.preventDefault();
                        alert('Price cannot be negative');
                        return false;
                    }
                });
            }
        });
    </script>
</body>
</html>