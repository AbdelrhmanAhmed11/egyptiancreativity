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
    $title = trim($_POST['title'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $image = '';
    
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $upload_dir = '../images/masterpieces/';
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }
        $allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (in_array($_FILES['image']['type'], $allowed_types)) {
            $file_extension = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
            $file_name = 'masterpiece_' . uniqid() . '.' . $file_extension;
            $upload_path = $upload_dir . $file_name;
            if (move_uploaded_file($_FILES['image']['tmp_name'], $upload_path)) {
                $image = 'images/masterpieces/' . $file_name;
            }
        }
    }
    
    if ($action === 'add') {
        try {
            $stmt = $pdo->prepare("INSERT INTO masterpieces (title, description, image, created_at) VALUES (?, ?, ?, NOW())");
            if ($stmt->execute([$title, $description, $image])) {
                $message = 'Masterpiece added successfully!';
                header('Location: masterpieces.php?message=' . urlencode($message));
                exit();
            } else {
                $message = 'Error adding masterpiece';
            }
        } catch (PDOException $e) {
            $message = 'Database error: ' . $e->getMessage();
        }
    } elseif ($action === 'edit') {
        $id = intval($_POST['id'] ?? 0);
        if ($id > 0) {
            try {
                $sql = "UPDATE masterpieces SET title = ?, description = ?";
                $params = [$title, $description];
                if ($image) {
                    $sql .= ", image = ?";
                    $params[] = $image;
                }
                $sql .= " WHERE id = ?";
                $params[] = $id;
                $stmt = $pdo->prepare($sql);
                if ($stmt->execute($params)) {
                    $message = 'Masterpiece updated successfully!';
                    header('Location: masterpieces.php?message=' . urlencode($message));
                    exit();
                } else {
                    $message = 'Error updating masterpiece';
                }
            } catch (PDOException $e) {
                $message = 'Database error: ' . $e->getMessage();
            }
        } else {
            $message = 'Invalid masterpiece ID';
        }
    } elseif ($action === 'delete') {
        $id = intval($_POST['id'] ?? 0);
        if ($id > 0) {
            try {
                $stmt = $pdo->prepare("SELECT image FROM masterpieces WHERE id = ?");
                $stmt->execute([$id]);
                $item = $stmt->fetch(PDO::FETCH_ASSOC);
                $stmt = $pdo->prepare("DELETE FROM masterpieces WHERE id = ?");
                if ($stmt->execute([$id])) {
                    if ($item && $item['image'] && file_exists('../' . $item['image'])) {
                        unlink('../' . $item['image']);
                    }
                    $message = 'Masterpiece deleted successfully!';
                    header('Location: masterpieces.php?message=' . urlencode($message));
                    exit();
                } else {
                    $message = 'Error deleting masterpiece';
                }
            } catch (PDOException $e) {
                $message = 'Database error: ' . $e->getMessage();
            }
        } else {
            $message = 'Invalid masterpiece ID';
        }
    }
}

// Get masterpieces for listing
$stmt = $pdo->query("SELECT * FROM masterpieces ORDER BY created_at DESC");
$masterpieces = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Get masterpiece for editing
if ($action === 'edit' && isset($_GET['id'])) {
    $id = intval($_GET['id']);
    $stmt = $pdo->prepare("SELECT * FROM masterpieces WHERE id = ?");
    $stmt->execute([$id]);
    $masterpiece = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$masterpiece) {
        header('Location: masterpieces.php?message=' . urlencode('Masterpiece not found'));
        exit();
    }
}

if (isset($_GET['message'])) {
    $message = $_GET['message'];
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Masterpieces Management - Egyptian Creativity</title>
    <link rel="stylesheet" href="css/admin-styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <style>
        .masterpieces-container {
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.06);
            overflow: hidden;
            margin-bottom: 2rem;
        }
        
        .masterpieces-table {
            width: 100%;
            border-collapse: collapse;
            background: #fff;
            table-layout: fixed;
        }
        
        .masterpieces-table th,
        .masterpieces-table td {
            padding: 16px;
            border-bottom: 1px solid #eee;
            text-align: left;
            vertical-align: middle;
        }
        
        .masterpieces-table th {
            background: #f8f9fa;
            font-weight: 600;
            color: #333;
            font-size: 0.875rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            position: sticky;
            top: 0;
            z-index: 10;
        }
        
        .masterpieces-table th:nth-child(1) { width: 120px; } /* Image */
        .masterpieces-table th:nth-child(2) { width: 20%; }   /* Title */
        .masterpieces-table th:nth-child(3) { width: 40%; }   /* Description */
        .masterpieces-table th:nth-child(4) { width: 15%; }   /* Date */
        .masterpieces-table th:nth-child(5) { width: 15%; }   /* Actions */
        
        .masterpieces-table tr:last-child td {
            border-bottom: none;
        }
        
        .masterpieces-table tr:hover {
            background: #f8f9fa;
        }
        
        .masterpiece-image {
            width: 80px;
            height: 60px;
            object-fit: cover;
            border-radius: 8px;
            border: 2px solid #e0e0e0;
            background: #f8f9fa;
            display: block;
        }
        
        .masterpiece-title {
            font-weight: 600;
            color: #333;
            font-size: 0.95rem;
            line-height: 1.4;
            margin: 0;
        }
        
        .masterpiece-description {
            color: #666;
            font-size: 0.875rem;
            line-height: 1.5;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }
        
        .masterpiece-date {
            color: #666;
            font-size: 0.875rem;
            font-weight: 500;
        }
        
        .action-buttons {
            display: flex;
            gap: 8px;
            align-items: center;
            flex-wrap: wrap;
        }
        
        .btn-small {
            padding: 6px 12px;
            font-size: 0.75rem;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 500;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
            white-space: nowrap;
        }
        
        .btn-secondary {
            background: #f8f9fa;
            color: #666;
            border: 1px solid #e9ecef;
        }
        
        .btn-secondary:hover {
            background: #e9ecef;
            color: #333;
        }
        
        .btn-danger {
            background: #dc3545;
            color: #fff;
        }
        
        .btn-danger:hover {
            background: #c82333;
        }
        
        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #666;
        }
        
        .empty-state-icon {
            width: 64px;
            height: 64px;
            margin: 0 auto 20px;
            opacity: 0.3;
        }
        
        .empty-state-text {
            font-size: 1.125rem;
            margin-bottom: 8px;
            color: #333;
        }
        
        .empty-state-subtext {
            font-size: 0.875rem;
            opacity: 0.7;
        }
        
        .empty-state a {
            color: #eac85b;
            text-decoration: none;
            font-weight: 500;
        }
        
        .empty-state a:hover {
            text-decoration: underline;
        }
        
        .table-responsive {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
        }
        
        .message {
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-weight: 500;
        }
        
        .message.success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .message.error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        
        /* Form Styles */
        .form-container {
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.06);
            overflow: hidden;
        }
        
        .form-header {
            background: #f8f9fa;
            padding: 20px 24px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 16px;
        }
        
        .form-header h2 {
            margin: 0;
            font-size: 1.25rem;
            font-weight: 600;
            color: #333;
        }
        
        .blog-form {
            padding: 24px;
        }
        
        .form-row {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .form-group {
            margin-bottom: 20px;
            flex: 1;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #333;
            font-size: 0.875rem;
        }
        
        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 0.875rem;
            transition: border-color 0.2s ease;
            box-sizing: border-box;
        }
        
        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #eac85b;
            box-shadow: 0 0 0 3px rgba(234, 200, 91, 0.1);
        }
        
        .form-group textarea {
            resize: vertical;
            min-height: 120px;
        }
        
        .current-image {
            margin-top: 12px;
            padding: 12px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        
        .current-image p {
            margin: 0 0 8px 0;
            font-size: 0.875rem;
            color: #666;
        }
        
        .current-image img {
            max-width: 200px;
            border-radius: 8px;
            border: 2px solid #e0e0e0;
        }
        
        .form-actions {
            display: flex;
            gap: 12px;
            margin-top: 24px;
            padding-top: 20px;
            border-top: 1px solid #eee;
        }
        
        .btn {
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 500;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 0.875rem;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }
        
        .btn-primary {
            background: #eac85b;
            color: #fff;
        }
        
        .btn-primary:hover {
            background: #d4b84a;
            transform: translateY(-1px);
        }
        
        .btn-secondary {
            background: #f8f9fa;
            color: #666;
            border: 1px solid #e9ecef;
        }
        
        .btn-secondary:hover {
            background: #e9ecef;
            color: #333;
        }
        
        .btn-gold-gradient {
            background: linear-gradient(135deg, #eac85b 0%, #d4b84a 100%);
            color: #fff;
            border: none;
        }
        
        .btn-gold-gradient:hover {
            background: linear-gradient(135deg, #d4b84a 0%, #c4a83a 100%);
            transform: translateY(-1px);
        }
        
        .btn-gold-gradient.add-btn {
            background: linear-gradient(90deg, #eac85b 0%, #b8860b 100%);
            color: #fff;
            border: none;
            border-radius: 16px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.06);
            font-weight: 500;
            font-size: 1rem;
            padding: 10px 20px;
            transition: background 0.2s, box-shadow 0.2s;
        }
        .btn-gold-gradient.add-btn:hover {
            background: linear-gradient(90deg, #d4b84a 0%, #a97405 100%);
            color: #fff;
            box-shadow: 0 4px 16px rgba(0,0,0,0.10);
        }
        
        .btn-secondary, .btn-small.btn-secondary {
            background: #6c757d;
            color: #fff;
            border: none;
            border-radius: 6px;
            box-shadow: none;
            font-weight: 500;
            font-size: 0.875rem;
            padding: 1px 18px;
            transition: background 0.2s, color 0.2s;
        }
        .btn-secondary:hover, .btn-small.btn-secondary:hover {
            background: #495057;
            color: #fff;
        }
        
        /* Responsive Design */
        @media (max-width: 1200px) {
            .masterpieces-table th:nth-child(3) { width: 35%; }
            .masterpieces-table th:nth-child(4) { width: 18%; }
            .masterpieces-table th:nth-child(5) { width: 17%; }
        }
        
        @media (max-width: 768px) {
            .masterpieces-table th,
            .masterpieces-table td {
                padding: 12px 8px;
                font-size: 0.875rem;
            }
            
            .masterpieces-table th:nth-child(1) { width: 100px; }
            .masterpieces-table th:nth-child(2) { width: 25%; }
            .masterpieces-table th:nth-child(3) { width: 30%; }
            .masterpieces-table th:nth-child(4) { width: 20%; }
            .masterpieces-table th:nth-child(5) { width: 25%; }
            
            .masterpiece-image {
                width: 60px;
                height: 45px;
            }
            
            .action-buttons {
                flex-direction: column;
                gap: 4px;
            }
            
            .btn-small {
                padding: 4px 8px;
                font-size: 0.7rem;
                width: 100%;
                text-align: center;
            }
            
            .form-header {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .form-row {
                flex-direction: column;
                gap: 0;
            }
            
            .form-actions {
                flex-direction: column;
            }
        }
        
        @media (max-width: 480px) {
            .masterpieces-table {
                font-size: 0.75rem;
            }
            
            .masterpieces-table th,
            .masterpieces-table td {
                padding: 8px 6px;
            }
            
            .masterpiece-image {
                width: 50px;
                height: 38px;
            }
            
            .masterpiece-description {
                font-size: 0.75rem;
            }
        }
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
                <a href="masterpieces.php" class="nav-item active">
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
                    <h1 class="page-title">Masterpieces Management</h1>
                    <?php if ($action === 'list'): ?>
                    <div class="header-actions">
                        <a href="masterpieces.php?action=add" class="btn btn-gold-gradient add-btn" style="display: inline-flex; align-items: center; gap: 8px; font-weight: 500; font-size: 1rem; border-radius: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); min-width: 180px; justify-content: center;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px;"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            Add Masterpiece
                        </a>
                    </div>
                    <?php endif; ?>
                </div>
            </header>
            
            <div class="admin-content">
                <?php if ($message): ?>
                <div class="message <?php echo strpos($message, 'Error') !== false || strpos($message, 'error') !== false || strpos($message, 'Invalid') !== false ? 'error' : 'success'; ?>">
                    <?php echo htmlspecialchars($message); ?>
                </div>
                <?php endif; ?>
                
                <?php if ($action === 'list'): ?>
                <div class="masterpieces-container">
                    <?php if (!empty($masterpieces)): ?>
                        <div class="table-responsive">
                            <table class="masterpieces-table">
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Title</th>
                                        <th>Description</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($masterpieces as $item): ?>
                                    <tr>
                                        <td>
                                            <img src="../<?php echo $item['image'] ?: 'images/placeholder.jpg'; ?>" 
                                                 class="masterpiece-image" 
                                                 alt="<?php echo htmlspecialchars($item['title']); ?>"
                                                 onerror="this.src='../images/placeholder.jpg'">
                                        </td>
                                        <td>
                                            <h3 class="masterpiece-title"><?php echo htmlspecialchars($item['title']); ?></h3>
                                        </td>
                                        <td>
                                            <div class="masterpiece-description">
                                                <?php echo htmlspecialchars(strlen($item['description']) > 120 ? substr($item['description'], 0, 120) . '...' : $item['description']); ?>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="masterpiece-date">
                                                <?php echo date('M j, Y', strtotime($item['created_at'])); ?>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="action-buttons">
                                                <a href="masterpieces.php?action=edit&id=<?php echo $item['id']; ?>" 
                                                   class="btn-small btn-secondary">Edit</a>
                                                <form method="POST" style="display:inline;" 
                                                      onsubmit="return confirm('Are you sure you want to delete this masterpiece?');">
                                                    <input type="hidden" name="id" value="<?php echo $item['id']; ?>">
                                                    <input type="hidden" name="action" value="delete">
                                                    <button type="submit" class="btn-small btn-danger">Delete</button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                    <?php else: ?>
                        <div class="empty-state">
                            <svg class="empty-state-icon" viewBox="0 0 64 64" fill="currentColor">
                                <polygon points="32 8 38 22 54 22 42 32 46 48 32 40 18 48 22 32 10 22 26 22 32 8"></polygon>
                            </svg>
                            <div class="empty-state-text">No masterpieces found</div>
                            <div class="empty-state-subtext">
                                <a href="masterpieces.php?action=add">Add your first masterpiece</a> to get started
                            </div>
                        </div>
                    <?php endif; ?>
                </div>
                <?php endif; ?>
                
                <?php if ($action === 'add' || $action === 'edit'): ?>
                <div class="form-container">
                    <div class="form-header">
                        <h2><?php echo $action === 'add' ? 'Add New Masterpiece' : 'Edit Masterpiece: ' . htmlspecialchars($masterpiece['title'] ?? ''); ?></h2>
                        <a href="masterpieces.php" class="btn btn-secondary">Back to Masterpieces</a>
                    </div>
                    <form method="POST" enctype="multipart/form-data" class="blog-form">
                        <?php if ($action === 'edit'): ?>
                        <input type="hidden" name="id" value="<?php echo $masterpiece['id']; ?>">
                        <?php endif; ?>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="title">Title *</label>
                                <input type="text" id="title" name="title" 
                                       value="<?php echo $action === 'edit' ? htmlspecialchars($masterpiece['title']) : ''; ?>" 
                                       required>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="description">Description *</label>
                            <textarea id="description" name="description" rows="5" required><?php echo $action === 'edit' ? htmlspecialchars($masterpiece['description']) : ''; ?></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label for="image">Image <?php echo $action === 'add' ? '*' : ''; ?></label>
                            <input type="file" id="image" name="image" accept="image/*" <?php echo $action === 'add' ? 'required' : ''; ?>>
                            <?php if ($action === 'edit' && !empty($masterpiece['image'])): ?>
                            <div class="current-image">
                                <p>Current Image:</p>
                                <img src="../<?php echo $masterpiece['image']; ?>" alt="Current masterpiece image">
                            </div>
                            <?php endif; ?>
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">
                                <?php echo $action === 'add' ? 'Add Masterpiece' : 'Update Masterpiece'; ?>
                            </button>
                            <a href="masterpieces.php" class="btn btn-secondary">Cancel</a>
                        </div>
                    </form>
                </div>
                <?php endif; ?>
            </div>
        </main>
    </div>
</body>
</html>