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
        $title = $_POST['title'] ?? '';
        $description = $_POST['description'] ?? '';
        $category = $_POST['category'] ?? '';
        $price = $_POST['price'] ?? '';
        
        // Handle image upload
        $image = '';
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $upload_dir = '../images/gallery/';
            if (!is_dir($upload_dir)) {
                mkdir($upload_dir, 0777, true);
            }
            
            $file_extension = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
            $file_name = uniqid() . '.' . $file_extension;
            $upload_path = $upload_dir . $file_name;
            
            if (move_uploaded_file($_FILES['image']['tmp_name'], $upload_path)) {
                $image = 'images/gallery/' . $file_name;
            }
        }
        
        if ($action === 'add') {
            $stmt = $pdo->prepare("INSERT INTO gallery_items (title, description, category, price, image) VALUES (?, ?, ?, ?, ?)");
            if ($stmt->execute([$title, $description, $category, $price, $image])) {
                $message = 'Gallery item added successfully!';
                header('Location: gallery.php?message=' . urlencode($message));
                exit();
            } else {
                $message = 'Error adding gallery item';
            }
        } else {
            $id = $_POST['id'] ?? '';
            $image_sql = $image ? ", image = ?" : "";
            $sql = "UPDATE gallery_items SET title = ?, description = ?, category = ?, price = ?" . $image_sql . " WHERE id = ?";
            $params = [$title, $description, $category, $price];
            if ($image) $params[] = $image;
            $params[] = $id;
            
            $stmt = $pdo->prepare($sql);
            if ($stmt->execute($params)) {
                $message = 'Gallery item updated successfully!';
                header('Location: gallery.php?message=' . urlencode($message));
                exit();
            } else {
                $message = 'Error updating gallery item';
            }
        }
    } elseif ($action === 'delete') {
        $id = $_POST['id'] ?? '';
        $stmt = $pdo->prepare("DELETE FROM gallery_items WHERE id = ?");
        if ($stmt->execute([$id])) {
            $message = 'Gallery item deleted successfully!';
        } else {
            $message = 'Error deleting gallery item';
        }
    }
}

// Get gallery items for listing
if ($action === 'list') {
    $stmt = $pdo->query("SELECT * FROM gallery_items ORDER BY id DESC");
    $gallery_items = $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// Get gallery item for editing
if ($action === 'edit') {
    $id = $_GET['id'] ?? '';
    $stmt = $pdo->prepare("SELECT * FROM gallery_items WHERE id = ?");
    $stmt->execute([$id]);
    $gallery_item = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$gallery_item) {
        header('Location: gallery.php');
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
                        <a href="gallery.php?action=add" class="btn btn-primary">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Add Gallery Item
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
                <!-- Gallery Items List -->
                <div class="gallery-list">
                    <div class="list-header">
                        <h2>All Gallery Items</h2>
                        <div class="list-actions">
                            <input type="text" id="searchGallery" placeholder="Search gallery items..." class="search-input">
                        </div>
                    </div>
                    
                    <div class="gallery-grid">
                        <?php foreach ($gallery_items as $item): ?>
                        <div class="gallery-item-card">
                            <div class="item-image">
                                <img src="../<?php echo $item['image'] ?: 'images/gallery/placeholder.jpg'; ?>" alt="<?php echo htmlspecialchars($item['title']); ?>">
                                <div class="item-overlay">
                                    <div class="overlay-actions">
                                        <a href="gallery.php?action=edit&id=<?php echo $item['id']; ?>" class="btn btn-small btn-secondary">Edit</a>
                                        <button onclick="deleteGalleryItem(<?php echo $item['id']; ?>)" class="btn btn-small btn-danger">Delete</button>
                                    </div>
                                </div>
                            </div>
                            <div class="item-info">
                                <h4><?php echo htmlspecialchars($item['title']); ?></h4>
                                <p><?php echo htmlspecialchars(substr($item['description'], 0, 100)) . '...'; ?></p>
                                <div class="item-meta">
                                    <span class="category-badge"><?php echo htmlspecialchars($item['category']); ?></span>
                                    <?php if ($item['price']): ?>
                                    <span class="price-badge">$<?php echo number_format($item['price'], 2); ?></span>
                                    <?php endif; ?>
                                </div>
                            </div>
                        </div>
                        <?php endforeach; ?>
                    </div>
                </div>
                <?php endif; ?>

                <?php if ($action === 'add' || $action === 'edit'): ?>
                <!-- Add/Edit Gallery Item Form -->
                <div class="form-container">
                    <div class="form-header">
                        <h2><?php echo $action === 'add' ? 'Add New Gallery Item' : 'Edit Gallery Item'; ?></h2>
                        <a href="gallery.php" class="btn btn-secondary">Back to Gallery</a>
                    </div>
                    
                    <form method="POST" enctype="multipart/form-data" class="gallery-form">
                        <?php if ($action === 'edit'): ?>
                        <input type="hidden" name="id" value="<?php echo $gallery_item['id']; ?>">
                        <?php endif; ?>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="title">Title</label>
                                <input type="text" id="title" name="title" value="<?php echo $action === 'edit' ? htmlspecialchars($gallery_item['title']) : ''; ?>" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="category">Category</label>
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
                                <input type="number" id="price" name="price" step="0.01" value="<?php echo $action === 'edit' ? $gallery_item['price'] : ''; ?>">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="description">Description</label>
                            <textarea id="description" name="description" rows="4" required><?php echo $action === 'edit' ? htmlspecialchars($gallery_item['description']) : ''; ?></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label for="image">Gallery Image</label>
                            <input type="file" id="image" name="image" accept="image/*" <?php echo $action === 'add' ? 'required' : ''; ?>>
                            <?php if ($action === 'edit' && $gallery_item['image']): ?>
                            <div class="current-image">
                                <p>Current Image:</p>
                                <img src="../<?php echo $gallery_item['image']; ?>" alt="Current gallery image" style="max-width: 200px; margin-top: 10px;">
                            </div>
                            <?php endif; ?>
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
            <p>Are you sure you want to delete this gallery item? This action cannot be undone.</p>
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
        function deleteGalleryItem(id) {
            document.getElementById('deleteId').value = id;
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
    </script>
</body>
</html> 