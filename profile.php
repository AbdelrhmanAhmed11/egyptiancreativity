<?php 
// API logic must be at the very top, before any HTML or whitespace
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', 'profile_errors.log');

// Start session for authentication
session_start();

// Include database connection
try {
    include 'includes/db.php';
    if (!isset($pdo)) {
        throw new Exception('Database connection not established');
    }
} catch (Exception $e) {
    error_log('Database connection error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

// Helper: Check if user is logged in
function getCurrentUserId() {
    return isset($_SESSION['user_id']) ? intval($_SESSION['user_id']) : null;
}

// Helper: Log API requests
function logApiRequest($action, $data = null) {
    $log = date('Y-m-d H:i:s') . ' - Profile Action: ' . $action;
    if ($data) {
        $log .= ' - Data: ' . json_encode($data);
    }
    error_log($log);
}

// Helper: Validate user data
function validateUserData($data) {
    $errors = [];
    
    if (isset($data['email']) && !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Invalid email format';
    }
    
    if (isset($data['phone']) && !preg_match('/^[\+]?[1-9][\d]{0,15}$/', $data['phone'])) {
        $errors[] = 'Invalid phone number format';
    }
    
    if (isset($data['full_name']) && strlen($data['full_name']) > 100) {
        $errors[] = 'Full name too long (max 100 characters)';
    }
    
    return $errors;
}

// Handle API requests
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action'])) {
    header('Content-Type: application/json');
    
    $action = $_GET['action'];
    $user_id = getCurrentUserId();
    
    logApiRequest($action, ['user_id' => $user_id]);
    
    switch ($action) {
        case 'get_profile':
            try {
                if (!$user_id) {
                    http_response_code(401);
                    echo json_encode(['error' => 'User not authenticated']);
                    exit;
                }
                
                $sql = "SELECT id, username, email, full_name, phone, profile_image, created_at, updated_at 
                        FROM users WHERE id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$user_id]);
            $user = $stmt->fetch();
            
            if ($user) {
                    // Get user addresses
                    $address_sql = "SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC";
                    $address_stmt = $pdo->prepare($address_sql);
                    $address_stmt->execute([$user_id]);
                    $addresses = $address_stmt->fetchAll();
                    
                    // Get user stats
                    $stats_sql = "SELECT 
                                    (SELECT COUNT(*) FROM cart_items WHERE user_id = ?) as cart_items,
                                    (SELECT COUNT(*) FROM wishlist_items WHERE user_id = ?) as wishlist_items,
                                    (SELECT COUNT(*) FROM orders WHERE user_id = ?) as total_orders";
                    $stats_stmt = $pdo->prepare($stats_sql);
                    $stats_stmt->execute([$user_id, $user_id, $user_id]);
                    $stats = $stats_stmt->fetch();
                    
                    $profile_data = [
                        'user' => $user,
                        'addresses' => $addresses,
                        'stats' => $stats
                    ];
                    
                    echo json_encode(['success' => true, 'profile' => $profile_data]);
                    logApiRequest('get_profile_success', ['user_id' => $user_id]);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'User not found']);
                    logApiRequest('get_profile_not_found', ['user_id' => $user_id]);
                }
            } catch (Exception $e) {
                error_log('Error getting profile: ' . $e->getMessage());
                http_response_code(500);
                echo json_encode(['error' => 'Failed to get profile']);
            }
            exit;
            
        case 'get_orders':
            try {
                if (!$user_id) {
                    http_response_code(401);
                    echo json_encode(['error' => 'User not authenticated']);
            exit;
    }
                
                $sql = "SELECT o.*, COUNT(oi.id) as item_count 
                        FROM orders o 
                        LEFT JOIN order_items oi ON o.id = oi.order_id 
                        WHERE o.user_id = ? 
                        GROUP BY o.id 
                        ORDER BY o.created_at DESC";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([$user_id]);
                $orders = $stmt->fetchAll();
                
                echo json_encode(['success' => true, 'orders' => $orders]);
                logApiRequest('get_orders_success', ['user_id' => $user_id, 'count' => count($orders)]);
                
            } catch (Exception $e) {
                error_log('Error getting orders: ' . $e->getMessage());
                http_response_code(500);
                echo json_encode(['error' => 'Failed to get orders']);
            }
            exit;
            
        case 'get_addresses':
            try {
                if (!$user_id) {
                    http_response_code(401);
                    echo json_encode(['error' => 'User not authenticated']);
                    exit;
                }
                
                $sql = "SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([$user_id]);
                $addresses = $stmt->fetchAll();
                
                echo json_encode(['success' => true, 'addresses' => $addresses]);
                logApiRequest('get_addresses_success', ['user_id' => $user_id, 'count' => count($addresses)]);
                
            } catch (Exception $e) {
                error_log('Error getting addresses: ' . $e->getMessage());
                http_response_code(500);
                echo json_encode(['error' => 'Failed to get addresses']);
            }
            exit;
    }
}

// Handle POST requests (update profile)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json');
    
    try {
    $data = json_decode(file_get_contents('php://input'), true);
    $action = $data['action'] ?? '';
        $user_id = getCurrentUserId();
        
        logApiRequest($action, $data);
        
        if (!$user_id) {
            http_response_code(401);
            echo json_encode(['error' => 'User not authenticated']);
            exit;
        }
    
    switch ($action) {
        case 'update_profile':
                try {
            $full_name = $data['full_name'] ?? '';
            $phone = $data['phone'] ?? '';
                    $email = $data['email'] ?? '';
                    
                    // Validate data
                    $validation_errors = validateUserData([
                        'full_name' => $full_name,
                        'phone' => $phone,
                        'email' => $email
                    ]);
                    
                    if (!empty($validation_errors)) {
                        http_response_code(400);
                        echo json_encode(['error' => 'Validation failed', 'details' => $validation_errors]);
                        exit;
                    }
                    
                    // Check if email is already taken by another user
                    if ($email) {
                        $check_sql = "SELECT id FROM users WHERE email = ? AND id != ?";
                        $check_stmt = $pdo->prepare($check_sql);
                        $check_stmt->execute([$email, $user_id]);
                        if ($check_stmt->fetch()) {
                            http_response_code(400);
                            echo json_encode(['error' => 'Email already taken']);
                            exit;
                        }
                    }
                    
                    $sql = "UPDATE users SET full_name = ?, phone = ?, email = ?, updated_at = NOW() WHERE id = ?";
                    $stmt = $pdo->prepare($sql);
                    $result = $stmt->execute([$full_name, $phone, $email, $user_id]);
                    
                    if ($result) {
                echo json_encode(['success' => true, 'message' => 'Profile updated successfully']);
                        logApiRequest('update_profile_success', ['user_id' => $user_id]);
                    } else {
                        throw new Exception('Failed to update profile');
                    }
            } catch (Exception $e) {
                    error_log('Error updating profile: ' . $e->getMessage());
                http_response_code(500);
                echo json_encode(['error' => 'Failed to update profile']);
            }
                exit;
                
            case 'add_address':
                try {
                    $address_data = [
                        'recipient_name' => $data['recipient_name'] ?? '',
                        'phone' => $data['phone'] ?? '',
                        'address_line1' => $data['address_line1'] ?? '',
                        'address_line2' => $data['address_line2'] ?? '',
                        'city' => $data['city'] ?? '',
                        'state' => $data['state'] ?? '',
                        'postal_code' => $data['postal_code'] ?? '',
                        'country' => $data['country'] ?? '',
                        'is_default' => $data['is_default'] ?? false
                    ];
                    
                    // Validate required fields
                    if (empty($address_data['recipient_name']) || empty($address_data['address_line1']) || 
                        empty($address_data['city']) || empty($address_data['country'])) {
                        http_response_code(400);
                        echo json_encode(['error' => 'Required address fields missing']);
                        exit;
                    }
                    
                    // If this is default, unset other defaults
                    if ($address_data['is_default']) {
                        $update_sql = "UPDATE addresses SET is_default = 0 WHERE user_id = ?";
                        $update_stmt = $pdo->prepare($update_sql);
                        $update_stmt->execute([$user_id]);
                    }
                    
                    $sql = "INSERT INTO addresses (user_id, recipient_name, phone, address_line1, address_line2, 
                            city, state, postal_code, country, is_default, created_at) 
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
                    $stmt = $pdo->prepare($sql);
                    $result = $stmt->execute([
                        $user_id, $address_data['recipient_name'], $address_data['phone'],
                        $address_data['address_line1'], $address_data['address_line2'],
                        $address_data['city'], $address_data['state'], $address_data['postal_code'],
                        $address_data['country'], $address_data['is_default']
                    ]);
                    
                    if ($result) {
                        echo json_encode(['success' => true, 'message' => 'Address added successfully']);
                        logApiRequest('add_address_success', ['user_id' => $user_id]);
                    } else {
                        throw new Exception('Failed to add address');
                    }
                } catch (Exception $e) {
                    error_log('Error adding address: ' . $e->getMessage());
                    http_response_code(500);
                    echo json_encode(['error' => 'Failed to add address']);
                }
                exit;
                
            case 'update_address':
                try {
                    $address_id = $data['address_id'] ?? null;
                    if (!$address_id) {
                        http_response_code(400);
                        echo json_encode(['error' => 'Address ID required']);
                        exit;
                    }
                    
                    $address_data = [
                        'recipient_name' => $data['recipient_name'] ?? '',
                        'phone' => $data['phone'] ?? '',
                        'address_line1' => $data['address_line1'] ?? '',
                        'address_line2' => $data['address_line2'] ?? '',
                        'city' => $data['city'] ?? '',
                        'state' => $data['state'] ?? '',
                        'postal_code' => $data['postal_code'] ?? '',
                        'country' => $data['country'] ?? '',
                        'is_default' => $data['is_default'] ?? false
                    ];
                    
                    // Validate required fields
                    if (empty($address_data['recipient_name']) || empty($address_data['address_line1']) || 
                        empty($address_data['city']) || empty($address_data['country'])) {
                        http_response_code(400);
                        echo json_encode(['error' => 'Required address fields missing']);
                        exit;
                    }
                    
                    // If this is default, unset other defaults
                    if ($address_data['is_default']) {
                        $update_sql = "UPDATE addresses SET is_default = 0 WHERE user_id = ? AND id != ?";
                        $update_stmt = $pdo->prepare($update_sql);
                        $update_stmt->execute([$user_id, $address_id]);
                    }
                    
                    $sql = "UPDATE addresses SET recipient_name = ?, phone = ?, address_line1 = ?, 
                            address_line2 = ?, city = ?, state = ?, postal_code = ?, country = ?, 
                            is_default = ? WHERE id = ? AND user_id = ?";
                    $stmt = $pdo->prepare($sql);
                    $result = $stmt->execute([
                        $address_data['recipient_name'], $address_data['phone'],
                        $address_data['address_line1'], $address_data['address_line2'],
                        $address_data['city'], $address_data['state'], $address_data['postal_code'],
                        $address_data['country'], $address_data['is_default'], $address_id, $user_id
                    ]);
                    
                    if ($result) {
                        echo json_encode(['success' => true, 'message' => 'Address updated successfully']);
                        logApiRequest('update_address_success', ['user_id' => $user_id, 'address_id' => $address_id]);
                    } else {
                        throw new Exception('Failed to update address');
                    }
                } catch (Exception $e) {
                    error_log('Error updating address: ' . $e->getMessage());
                    http_response_code(500);
                    echo json_encode(['error' => 'Failed to update address']);
                }
                exit;
                
            case 'delete_address':
                try {
                    $address_id = $data['address_id'] ?? null;
                    if (!$address_id) {
                        http_response_code(400);
                        echo json_encode(['error' => 'Address ID required']);
                        exit;
                    }
                    
                    $sql = "DELETE FROM addresses WHERE id = ? AND user_id = ?";
                    $stmt = $pdo->prepare($sql);
                    $result = $stmt->execute([$address_id, $user_id]);
                    
                    if ($result) {
                        echo json_encode(['success' => true, 'message' => 'Address deleted successfully']);
                        logApiRequest('delete_address_success', ['user_id' => $user_id, 'address_id' => $address_id]);
                    } else {
                        throw new Exception('Failed to delete address');
                    }
                } catch (Exception $e) {
                    error_log('Error deleting address: ' . $e->getMessage());
                    http_response_code(500);
                    echo json_encode(['error' => 'Failed to delete address']);
                }
                exit;
                
            case 'change_password':
                try {
                    $current_password = $data['current_password'] ?? '';
                    $new_password = $data['new_password'] ?? '';
                    $confirm_password = $data['confirm_password'] ?? '';
                    
                    if (empty($current_password) || empty($new_password) || empty($confirm_password)) {
                        http_response_code(400);
                        echo json_encode(['error' => 'All password fields are required']);
                        exit;
                    }
                    
                    if ($new_password !== $confirm_password) {
                        http_response_code(400);
                        echo json_encode(['error' => 'New passwords do not match']);
                        exit;
                    }
                    
                    if (strlen($new_password) < 6) {
                        http_response_code(400);
                        echo json_encode(['error' => 'Password must be at least 6 characters']);
                        exit;
                    }
                    
                    // Get current password hash
                    $sql = "SELECT password_hash FROM users WHERE id = ?";
                    $stmt = $pdo->prepare($sql);
                    $stmt->execute([$user_id]);
                    $user = $stmt->fetch();
                    
                    if (!$user || !password_verify($current_password, $user['password_hash'])) {
                        http_response_code(400);
                        echo json_encode(['error' => 'Current password is incorrect']);
                        exit;
                    }
                    
                    // Update password
                    $new_password_hash = password_hash($new_password, PASSWORD_DEFAULT);
                    $update_sql = "UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?";
                    $update_stmt = $pdo->prepare($update_sql);
                    $result = $update_stmt->execute([$new_password_hash, $user_id]);
                    
                    if ($result) {
                        echo json_encode(['success' => true, 'message' => 'Password changed successfully']);
                        logApiRequest('change_password_success', ['user_id' => $user_id]);
                    } else {
                        throw new Exception('Failed to change password');
                    }
                } catch (Exception $e) {
                    error_log('Error changing password: ' . $e->getMessage());
                    http_response_code(500);
                    echo json_encode(['error' => 'Failed to change password']);
                }
                exit;
                
            default:
                http_response_code(400);
                echo json_encode(['error' => 'Unknown action']);
                exit;
        }
        
    } catch (Exception $e) {
        error_log('General profile API error: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Internal server error']);
            exit;
    }
}

// Get user profile for display
$user_id = getCurrentUserId();
$user = null;

if ($user_id) {
    try {
        $sql = "SELECT id, username, email, full_name, phone, profile_image, created_at, updated_at FROM users WHERE id = ?";
$stmt = $pdo->prepare($sql);
$stmt->execute([$user_id]);
$user = $stmt->fetch();
    } catch (Exception $e) {
        error_log('Error getting user data for display: ' . $e->getMessage());
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile | Egyptian Creativity - Ancient Artifacts Collection</title>
    <meta name="description" content="Manage your Egyptian Creativity account and preferences.">
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="images/go3ran_.png">
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="css/profile-styles.css">
    <link rel="stylesheet" href="css/sidebar-styles.css">
</head>
<body>
    <!-- Animated Background (Same as Index Page) -->
    <div class="animated-bg">
        <div class="pyramid-bg"></div>
        <div class="sand-particles"></div>
        <div class="hieroglyph-symbols">
            <span class="symbol">𓋹</span>
            <span class="symbol">𓂀</span>
            <span class="symbol">𓊃</span>
            <span class="symbol">𓈖</span>
            <span class="symbol">𓇯</span>
            <span class="symbol">𓊪</span>
        </div>
        <div class="golden-rays"></div>
        <div class="floating-artifacts">
            <div class="artifact artifact-1">𓋹</div>
            <div class="artifact artifact-2">𓂀</div>
            <div class="artifact artifact-3">𓊃</div>
            <div class="artifact artifact-4">𓈖</div>
        </div>
    </div>

    <!-- Loading Screen -->
    <div class="loading-overlay" id="loadingOverlay">
        <div class="loading-content">
            <div class="loading-pyramid">
                <img src="images/go3ran_.png" alt="Egyptian Creativity Loading">
            </div>
            <div class="loading-text">Egyptian Creativity</div>
            <div class="loading-subtitle">Loading Ancient Wonders...</div>
            <div class="loading-progress">
                <div class="progress-bar"></div>
            </div>
            <button class="skip-btn" id="skipBtn">Skip</button>
        </div>
    </div>

    <!-- Header -->
    <header class="header" id="header">
        <div class="header-container">
            <a href="index.php" class="logo">
                <img src="images/logo_-removebg-preview.png" alt="Logo" style="height:100px;width:250px;object-fit:contain;border-radius:8px;" />
            </a>
            
            <nav class="nav-menu" id="navMenu">
                <a href="index.php" class="nav-link">HOME</a>
                <a href="about.php" class="nav-link">ABOUT US</a>
                <a href="gallery.php" class="nav-link">GALLERY</a>
                <a href="blog.php" class="nav-link">BLOGS</a>
                <a href="shop.php" class="nav-link">SHOP</a>
                <a href="contact.php" class="nav-link">CONTACT</a>
                <a href="auth.php" class="nav-link" id="loginLogoutBtn">LOGIN</a>
            </nav>
            
            <div class="header-actions">
                <button class="header-icon" id="searchBtn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                </button>
                <button class="header-icon" id="userBtn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </button>
                <button class="header-icon" id="wishlistBtn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <span class="badge" id="wishlistBadge">0</span>
                </button>
                <button class="header-icon" id="cartBtn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                    <span class="badge" id="cartBadge">0</span>
                </button>
                <button class="mobile-menu-btn" id="mobileMenuBtn">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </div>
    </header>

    <!-- Main Profile Container -->
    <main class="profile-main">
        <div class="container">
            <div class="profile-container">
                <!-- Profile Sidebar -->
                <aside class="profile-sidebar">
                    <div class="profile-card">
                        <div class="profile-avatar">
                            <div class="avatar-image" id="avatarImage">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </div>
                            <button class="avatar-upload" id="avatarUpload">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="m9 9 3-3 3 3"></path>
                                    <path d="M12 12V2.5"></path>
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                </svg>
                            </button>
                            <input type="file" id="avatarInput" accept="image/*" hidden>
                        </div>
                        
                        <div class="profile-info">
                            <h2 class="profile-name" id="profileName">John Doe</h2>
                            <p class="profile-email" id="profileEmail">john.doe@example.com</p>
                            <div class="profile-status">
                                <span class="status-badge premium">Premium Member</span>
                            </div>
                        </div>
                    </div>

                    <nav class="profile-nav">
                        <button class="nav-item active" data-section="overview">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="3" width="7" height="9"></rect>
                                <rect x="14" y="3" width="7" height="5"></rect>
                                <rect x="14" y="12" width="7" height="9"></rect>
                                <rect x="3" y="16" width="7" height="5"></rect>
                            </svg>
                            <span>Overview</span>
                        </button>
                        <button class="nav-item" data-section="personal">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <span>Personal Info</span>
                        </button>
                        <button class="nav-item" data-section="orders">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <path d="M16 10a4 4 0 0 1-8 0"></path>
                            </svg>
                            <span>Order History</span>
                            <span class="nav-badge" id="profileOrderBadge">5</span>
                        </button>
                        <button class="nav-item" data-section="wishlist">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            <span>Wishlist</span>
                            <span class="nav-badge" id="profileWishlistBadge">12</span>
                        </button>
                        <button class="nav-item" data-section="addresses">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            <span>Addresses</span>
                        </button>

                        <button class="nav-item" data-section="preferences">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="3"></circle>
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                            </svg>
                            <span>Preferences</span>
                        </button>
                    </nav>
                </aside>

                <!-- Profile Content -->
                <div class="profile-content">
                    <!-- Overview Section -->
                    <section class="content-section active" id="overview">
                        <div class="section-header">
                            <div>
                                <h1 class="section-title">Account Overview</h1>
                                <p class="section-subtitle">Welcome back to your Egyptian Creativity collection</p>
                            </div>
                        </div>

                        <div class="overview-grid">
                            <div class="overview-card">
                                <div class="card-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                        <line x1="3" y1="6" x2="21" y2="6"></line>
                                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                                    </svg>
                                </div>
                                <div class="card-content">
                                    <h3>Total Orders</h3>
                                    <p class="card-number" id="overviewOrderCount">5</p>
                                    <span class="card-change positive">+2 this month</span>
                                </div>
                            </div>

                            <div class="overview-card">
                                <div class="card-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <line x1="12" y1="1" x2="12" y2="23"></line>
                                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                    </svg>
                                </div>
                                <div class="card-content">
                                    <h3>Total Spent</h3>
                                    <p class="card-number">$45,750</p>
                                    <span class="card-change positive">+$8,900 this month</span>
                                </div>
                            </div>

                            <div class="overview-card">
                                <div class="card-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                    </svg>
                                </div>
                                <div class="card-content">
                                    <h3>Wishlist Items</h3>
                                    <p class="card-number">12</p>
                                    <span class="card-change neutral">2 new items</span>
                                </div>
                            </div>

                            <div class="overview-card">
                                <div class="card-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
                                    </svg>
                                </div>
                                <div class="card-content">
                                    <h3>Loyalty Points</h3>
                                    <p class="card-number">2,450</p>
                                    <span class="card-change positive">+150 this week</span>
                                </div>
                            </div>
                        </div>

                        <div class="recent-activity">
                            <h3>Recent Activity</h3>
                            <div class="activity-list">
                                <div class="activity-item">
                                    <div class="activity-icon">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                            <line x1="3" y1="6" x2="21" y2="6"></line>
                                            <path d="M16 10a4 4 0 0 1-8 0"></path>
                                        </svg>
                                    </div>
                                    <div class="activity-content">
                                        <p><strong>Order #EG-2024-001</strong> has been shipped</p>
                                        <span class="activity-time">2 hours ago</span>
                                    </div>
                                </div>
                                <div class="activity-item">
                                    <div class="activity-icon">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                        </svg>
                                    </div>
                                    <div class="activity-content">
                                        <p>Added <strong>Sacred Scarab Pendant</strong> to wishlist</p>
                                        <span class="activity-time">1 day ago</span>
                                    </div>
                                </div>
                                <div class="activity-item">
                                    <div class="activity-icon">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
                                        </svg>
                                    </div>
                                    <div class="activity-content">
                                        <p>Earned <strong>150 loyalty points</strong> from recent purchase</p>
                                        <span class="activity-time">3 days ago</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Personal Info Section -->
                    <section class="content-section" id="personal">
                        <div class="section-header">
                            <div>
                                <h1 class="section-title">Personal Information</h1>
                                <p class="section-subtitle">Manage your account details and preferences</p>
                            </div>
                        </div>

                        <form class="profile-form" id="personalInfoForm">
                            <div class="form-grid">
                                <div class="form-group">
                                    <label for="firstName" class="form-label">First Name</label>
                                    <div class="input-wrapper">
                                        <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                        <input type="text" id="firstName" name="firstName" class="form-input" value="John" required>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="lastName" class="form-label">Last Name</label>
                                    <div class="input-wrapper">
                                        <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                        <input type="text" id="lastName" name="lastName" class="form-input" value="Doe" required>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="email" class="form-label">Email Address</label>
                                    <div class="input-wrapper">
                                        <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                            <polyline points="22,6 12,13 2,6"></polyline>
                                        </svg>
                                        <input type="email" id="email" name="email" class="form-input" value="john.doe@example.com" required>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="phone" class="form-label">Phone Number</label>
                                    <div class="input-wrapper">
                                        <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                        </svg>
                                        <input type="tel" id="phone" name="phone" class="form-input" value="+1 (555) 123-4567">
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="birthDate" class="form-label">Date of Birth</label>
                                    <div class="input-wrapper">
                                        <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                            <line x1="16" y1="2" x2="16" y2="6"></line>
                                            <line x1="8" y1="2" x2="8" y2="6"></line>
                                            <line x1="3" y1="10" x2="21" y2="10"></line>
                                        </svg>
                                        <input type="date" id="birthDate" name="birthDate" class="form-input" value="1985-06-15">
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="gender" class="form-label">Gender</label>
                                    <div class="input-wrapper">
                                        <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M17 5h4v4"></path>
                                            <path d="M21 5l-6 6"></path>
                                            <circle cx="9" cy="9" r="9"></circle>
                                        </svg>
                                        <select id="gender" name="gender" class="form-input">
                                            <option value="">Select Gender</option>
                                            <option value="male" selected>Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                            <option value="prefer-not-to-say">Prefer not to say</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="bio" class="form-label">Bio</label>
                                <textarea id="bio" name="bio" class="form-textarea" rows="4" placeholder="Tell us about your interest in Egyptian artifacts...">Passionate collector of ancient Egyptian artifacts with a focus on authentic pieces that tell the stories of pharaohs and ancient civilizations.</textarea>
                            </div>

                            <div class="form-actions">
                                <button type="button" class="btn btn-secondary">Cancel</button>
                                <button type="submit" class="btn btn-primary">
                                    <span>Save Changes</span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                        <polyline points="17,21 17,13 7,13 7,21"></polyline>
                                        <polyline points="7,3 7,8 15,8"></polyline>
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </section>

                    <!-- Other sections (orders, wishlist, addresses, payment, preferences) -->
                    <section class="content-section" id="orders">
                        <div class="section-header">
                            <div>
                                <h1 class="section-title">Order History</h1>
                                <p class="section-subtitle">Track your purchases and view order details</p>
                            </div>
                        </div>

                        <div class="orders-list">
                            <div class="order-card">
                                <div class="order-header">
                                    <div class="order-info">
                                        <h3>Order #EG-2024-001</h3>
                                        <p>Placed on March 15, 2024</p>
                                    </div>
                                    <div class="order-status">
                                        <span class="status-badge shipped">Shipped</span>
                                    </div>
                                </div>
                                <div class="order-items">
                                    <div class="order-item">
                                        <div class="item-image">
                                            <img src="images/1-7-scaled.jpg" alt="Golden Pharaoh Mask">
                                        </div>
                                        <div class="item-details">
                                            <h4>Golden Pharaoh Mask</h4>
                                            <p>Exquisite reproduction with 24-karat gold</p>
                                            <span class="item-price">$12,500</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="order-footer">
                                    <div class="order-total">
                                        <strong>Total: $12,500</strong>
                                    </div>
                                    <div class="order-actions">
                                        <button class="btn btn-outline">Track Order</button>
                                        <button class="btn btn-outline">View Details</button>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="order-card">
                                <div class="order-header">
                                    <div class="order-info">
                                        <h3>Order #EG-2024-002</h3>
                                        <p>Placed on March 20, 2024</p>
                                    </div>
                                    <div class="order-status">
                                        <span class="status-badge pending">Pending</span>
                                    </div>
                                </div>
                                <div class="order-items">
                                    <div class="order-item">
                                        <div class="item-image">
                                            <img src="images/5-1.jpg" alt="Sacred Ankh Pendant">
                                        </div>
                                        <div class="item-details">
                                            <h4>Sacred Ankh Pendant</h4>
                                            <p>Symbol of eternal life and protection</p>
                                            <span class="item-price">$3,750</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="order-footer">
                                    <div class="order-total">
                                        <strong>Total: $3,750</strong>
                                    </div>
                                    <div class="order-actions">
                                        <button class="btn btn-outline">Track Order</button>
                                        <button class="btn btn-outline">View Details</button>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="order-card">
                                <div class="order-header">
                                    <div class="order-info">
                                        <h3>Order #EG-2024-003</h3>
                                        <p>Placed on February 28, 2024</p>
                                    </div>
                                    <div class="order-status">
                                        <span class="status-badge delivered">Delivered</span>
                                    </div>
                                </div>
                                <div class="order-items">
                                    <div class="order-item">
                                        <div class="item-image">
                                            <img src="images/5-3.jpg" alt="Royal Scarab Bracelet">
                                        </div>
                                        <div class="item-details">
                                            <h4>Royal Scarab Bracelet</h4>
                                            <p>Ancient Egyptian royal jewelry</p>
                                            <span class="item-price">$8,500</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="order-footer">
                                    <div class="order-total">
                                        <strong>Total: $8,500</strong>
                                    </div>
                                    <div class="order-actions">
                                        <button class="btn btn-outline">Track Order</button>
                                        <button class="btn btn-outline">View Details</button>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="order-card">
                                <div class="order-header">
                                    <div class="order-info">
                                        <h3>Order #EG-2024-004</h3>
                                        <p>Placed on January 15, 2024</p>
                                    </div>
                                    <div class="order-status">
                                        <span class="status-badge delivered">Delivered</span>
                                    </div>
                                </div>
                                <div class="order-items">
                                    <div class="order-item">
                                        <div class="item-image">
                                            <img src="images/9-1.jpg" alt="Pharaoh's Crown">
                                        </div>
                                        <div class="item-details">
                                            <h4>Pharaoh's Crown</h4>
                                            <p>Authentic replica of ancient royal headpiece</p>
                                            <span class="item-price">$15,200</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="order-footer">
                                    <div class="order-total">
                                        <strong>Total: $15,200</strong>
                                    </div>
                                    <div class="order-actions">
                                        <button class="btn btn-outline">Track Order</button>
                                        <button class="btn btn-outline">View Details</button>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="order-card">
                                <div class="order-header">
                                    <div class="order-info">
                                        <h3>Order #EG-2024-005</h3>
                                        <p>Placed on December 10, 2023</p>
                                    </div>
                                    <div class="order-status">
                                        <span class="status-badge delivered">Delivered</span>
                                    </div>
                                </div>
                                <div class="order-items">
                                    <div class="order-item">
                                        <div class="item-image">
                                            <img src="images/10.jpg" alt="Sacred Eye of Horus">
                                        </div>
                                        <div class="item-details">
                                            <h4>Sacred Eye of Horus</h4>
                                            <p>Protective amulet with ancient symbolism</p>
                                            <span class="item-price">$6,800</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="order-footer">
                                    <div class="order-total">
                                        <strong>Total: $6,800</strong>
                                    </div>
                                    <div class="order-actions">
                                        <button class="btn btn-outline">Track Order</button>
                                        <button class="btn btn-outline">View Details</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section class="content-section" id="wishlist">
                        <div class="section-header">
                            <div>
                                <h1 class="section-title">My Wishlist</h1>
                                <p class="section-subtitle">Save your favorite artifacts for later</p>
                            </div>
                        </div>

                        <div class="wishlist-grid" id="profileWishlistGrid">
                            <!-- Wishlist items will be loaded here dynamically -->
                            <div class="wishlist-loading">
                                <div class="loading-spinner"></div>
                                <p>Loading your wishlist...</p>
                            </div>
                        </div>
                    </section>

                    <!-- Additional sections would follow the same pattern -->
                    <section class="content-section" id="addresses">
                        <div class="section-header">
                            <div>
                                <h1 class="section-title">Shipping Addresses</h1>
                                <p class="section-subtitle">Manage your delivery locations</p>
                            </div>
                            <button class="btn btn-primary" id="addAddressBtn">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                <span>Add New Address</span>
                            </button>
                        </div>
                        
                        <div class="address-list">
                            <div class="address-card default" data-address-id="address-1">
                                <div class="address-header">
                                    <h4>Home Address</h4>
                                    <span class="status-badge">Default</span>
                                </div>
                                <div class="address-body">
                                    <p><strong>John Doe</strong></p>
                                    <p>123 Ancient Street</p>
                                    <p>Cairo, Egypt 12345</p>
                                    <p>Phone: +20 102 132 2002</p>
                                </div>
                                <div class="address-actions">
                                    <button class="btn btn-outline edit-address-btn">Edit</button>
                                    <button class="btn btn-danger">Delete</button>
                                </div>
                            </div>
                            
                            <div class="address-card" data-address-id="address-2">
                                <div class="address-header">
                                    <h4>Work Address</h4>
                                </div>
                                <div class="address-body">
                                    <p><strong>John Doe</strong></p>
                                    <p>456 Pyramid Avenue</p>
                                    <p>Giza, Egypt 67890</p>
                                    <p>Phone: +20 102 132 2002</p>
                                </div>
                                <div class="address-actions">
                                    <button class="btn btn-outline edit-address-btn">Edit</button>
                                    <button class="btn btn-danger">Delete</button>
                                    <button class="btn btn-warning set-default-address">Set as Default</button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section class="content-section" id="payment">
                        <div class="section-header">
                            <div>
                                <h1 class="section-title">Payment Methods</h1>
                                <p class="section-subtitle">Manage your payment options</p>
                            </div>
                            <button class="btn btn-primary" id="addPaymentBtn">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                <span>Add Payment Method</span>
                            </button>
                        </div>
                        <!-- Payment methods would be rendered here dynamically -->
                    </section>

                    <section class="content-section" id="preferences">
                        <div class="section-header">
                            <div>
                                <h1 class="section-title">Preferences</h1>
                                <p class="section-subtitle">Customize your Egyptian Creativity experience</p>
                            </div>
                        </div>
                        
                        <form class="profile-form">
                            <div class="form-grid">
                                <div class="form-group">
                                    <label class="form-label">Email Notifications</label>
                                    <div class="preference-options">
                                        <label class="checkbox-label">
                                            <input type="checkbox" checked>
                                            <span>Order updates and tracking</span>
                                        </label>
                                        <label class="checkbox-label">
                                            <input type="checkbox" checked>
                                            <span>New product releases</span>
                                        </label>
                                        <label class="checkbox-label">
                                            <input type="checkbox">
                                            <span>Special offers and discounts</span>
                                        </label>
                                        <label class="checkbox-label">
                                            <input type="checkbox" checked>
                                            <span>Newsletter</span>
                                        </label>
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Currency</label>
                                    <select class="form-input">
                                        <option value="USD" selected>USD ($)</option>
                                        <option value="EGP">EGP (E£)</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="form-actions">
                                <button type="button" class="btn btn-secondary">Cancel</button>
                                <button type="submit" class="btn btn-primary">Save Preferences</button>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="footer" id="contact">
        <div class="container">
            <div class="footer-content">
                <div class="footer-brand">
                    <div class="footer-logo">
                        <img src="images/logo_-removebg-preview.png" alt="Logo" style="height:100px;width:250px;object-fit:contain;border-radius:8px;" />
                    </div>
                    <p class="footer-description">
                        Preserving the timeless artistry of ancient Egypt through contemporary luxury craftsmanship.
                    </p>
                    <div class="social-links">
                        <a href="https://www.facebook.com/share/16Mhxajx4M/" class="social-link" target="_blank" rel="noopener">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                            </svg>
                        </a>
                        <a href="https://www.instagram.com/theeg.creativity/" class="social-link" target="_blank" rel="noopener">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                        </a>
                        <a href="https://pin.it/6BJJqdJQz" class="social-link" target="_blank" rel="noopener">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M12 8a4 4 0 0 0-1 7.87V21l2-2.87A4 4 0 1 0 12 8z"></path>
                            </svg>
                        </a>
                        <a href="https://www.tiktok.com/@theegptian.creativity?_t=ZS-8xwnWplmfO4&_r=1" class="social-link" target="_blank" rel="noopener">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
                            </svg>
                        </a>
                        <a href="https://wa.me/201021322002" class="social-link" target="_blank" rel="noopener">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                                <path d="M16.72 13.06c-.29-.14-1.7-.84-1.96-.94-.26-.1-.45-.14-.64.14-.19.28-.74.94-.91 1.13-.17.19-.34.21-.63.07-.29-.14-1.22-.45-2.33-1.43-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.59.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.64-1.54-.88-2.11-.23-.56-.47-.49-.64-.5-.17-.01-.36-.01-.56-.01-.19 0-.5.07-.76.36-.26.29-1 1.01-1 2.46 0 1.45 1.04 2.85 1.19 3.05.15.2 2.05 3.13 5.01 4.27.7.28 1.25.45 1.68.57.71.2 1.36.17 1.87.1.57-.08 1.7-.7 1.94-1.37.24-.67.24-1.25.17-1.37-.07-.12-.26-.19-.55-.33z"/>
                            </svg>
                        </a>
                    </div>
                </div>
                
                <div class="footer-section">
                    <h4>Navigation</h4>
                    <ul class="footer-links">
                        <li><a href="index.php">Home</a></li>
                        <li><a href="about.php">About</a></li>
                        <li><a href="gallery.php">Gallery</a></li>
                        <li><a href="blog.php">Blog</a></li>
                        <li><a href="shop.php">shop</a></li>
                        <li><a href="contact.php">Contact</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h4>Categories</h4>
                    <ul class="footer-links">
                        <li><a href="shop.php?category=accessories">Accessories</a></li>
                        <li><a href="shop.php?category=decorations">Decorations</a></li>
                        <li><a href="shop.php?category=boxes">Boxes</a></li>
                        <li><a href="shop.php?category=game-boxes">Game Boxes</a></li>
                        <li><a href="shop.php?category=fashion">Fashion</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h4>Contact</h4>
                    <ul class="footer-links">
                        <li><a href="#">Cairo, Egypt</a></li>
                        <li><a href="https://wa.me/201021322002" target="_blank" rel="noopener">+20 102 132 2002</a></li>
                        <li><a href="#">info@egyptiantreasures.com</a></li>
                        <li><a href="#">Support Center</a></li>
                    </ul>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>&copy; 2025 Egyptian Creativity. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <!-- Avatar Upload Modal -->
    <div class="modal avatar-modal" id="avatarModal">
        <div class="modal-backdrop" id="avatarBackdrop"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Change Profile Picture</h3>
                <button class="modal-close" id="avatarClose">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="avatar-upload-area">
                <div class="upload-preview" id="uploadPreview">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </div>
                <input type="file" id="avatarFileInput" accept="image/*" hidden>
                <button class="btn btn-primary" id="selectImageBtn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="m9 9 3-3 3 3"></path>
                        <path d="M12 12V2.5"></path>
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    </svg>
                    <span>Select Image</span>
                </button>
                <p>Recommended: Square image, at least 200x200px</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="cancelUpload">Cancel</button>
                <button class="btn btn-primary" id="saveAvatar">Save Changes</button>
            </div>
        </div>
    </div>

    <!-- Search Modal -->
    <div class="search-modal" id="searchModal">
        <div class="modal-backdrop" id="searchBackdrop"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Search Our Collection</h3>
                <button class="modal-close" id="searchClose">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="search-input-container">
                <input type="text" class="search-input" placeholder="Search for ancient treasures..." id="searchInput">
                <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                </svg>
            </div>
            <div class="search-suggestions">
                <div class="suggestion-item">Ancient Artifacts</div>
                <div class="suggestion-item">Pharaoh Masks</div>
                <div class="suggestion-item">Sacred Jewelry</div>
                <div class="suggestion-item">Egyptian Decor</div>
                <div class="suggestion-item">Custom Orders</div>
            </div>
        </div>
    </div>

    <!-- Notification Container -->
    <div class="notification-container" id="notificationContainer"></div>

    <!-- Add Address Modal -->
    <div class="modal" id="addressModal">
        <div class="modal-backdrop" id="addressBackdrop"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Add New Address</h3>
                <button class="modal-close" id="addressClose">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
            <form id="addressForm">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="addressName" class="form-label">Address Nickname</label>
                        <input type="text" id="addressName" class="form-input" placeholder="e.g., Home, Office" required>
                    </div>
                    <div class="form-group">
                        <label for="addressFullName" class="form-label">Full Name</label>
                        <input type="text" id="addressFullName" class="form-input" required>
                    </div>
                    <div class="form-group full-width">
                        <label for="addressStreet" class="form-label">Street Address</label>
                        <input type="text" id="addressStreet" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label for="addressCity" class="form-label">City</label>
                        <input type="text" id="addressCity" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label for="addressState" class="form-label">State / Province</label>
                        <input type="text" id="addressState" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label for="addressZip" class="form-label">ZIP Code</label>
                        <input type="text" id="addressZip" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label for="addressCountry" class="form-label">Country</label>
                        <input type="text" id="addressCountry" class="form-input" required>
                    </div>
                     <div class="form-group">
                        <label for="addressPhone" class="form-label">Phone Number</label>
                        <input type="tel" id="addressPhone" class="form-input" required>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" id="cancelAddress">Cancel</button>
                    <button type="submit" class="btn btn-primary">Save Address</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Add Payment Method Modal -->
    <div class="modal" id="paymentModal">
        <div class="modal-backdrop" id="paymentBackdrop"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Add Payment Method</h3>
                <button class="modal-close" id="paymentClose">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
            <form id="paymentForm">
                <div class="form-group">
                    <label for="paymentType" class="form-label">Card Type</label>
                    <select id="paymentType" class="form-input" required>
                        <option value="Visa">Visa</option>
                        <option value="Mastercard">Mastercard</option>
                        <option value="Amex">American Express</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="paymentNumber" class="form-label">Card Number</label>
                    <input type="text" id="paymentNumber" class="form-input" placeholder="•••• •••• •••• ••••" required>
                </div>
                <div class="form-group">
                    <label for="paymentExpiry" class="form-label">Expiry Date</label>
                    <input type="text" id="paymentExpiry" class="form-input" placeholder="MM/YY" required>
                </div>
                <div class="form-group">
                    <label for="paymentCVC" class="form-label">CVC</label>
                    <input type="text" id="paymentCVC" class="form-input" placeholder="•••" required>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" id="cancelPayment">Cancel</button>
                    <button type="submit" class="btn btn-primary">Save Card</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Track Order Modal -->
    <div class="modal" id="trackOrderModal">
        <div class="modal-backdrop" id="trackOrderBackdrop"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Track Order</h3>
                <button class="modal-close" id="trackOrderClose">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
            <div class="modal-body" id="trackOrderBody">
                <!-- Tracking info will be loaded here -->
            </div>
        </div>
    </div>

    <!-- Order Details Modal -->
    <div class="modal" id="orderDetailsModal">
        <div class="modal-backdrop" id="orderDetailsBackdrop"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Order Details</h3>
                <button class="modal-close" id="orderDetailsClose">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="modal-body" id="orderDetailsBody">
                <!-- Order details will be loaded here -->
            </div>
        </div>
    </div>

    <!-- Edit Address Modal -->
    <div class="modal" id="editAddressModal">
        <div class="modal-backdrop" id="editAddressBackdrop"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Edit Address</h3>
                <button class="modal-close" id="editAddressClose">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <form id="editAddressForm">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="editAddressName" class="form-label">Full Name</label>
                        <input type="text" id="editAddressName" name="fullName" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label for="editAddressPhone" class="form-label">Phone Number</label>
                        <input type="tel" id="editAddressPhone" name="phone" class="form-input" required>
                    </div>
                    <div class="form-group full-width">
                        <label for="editAddressStreet" class="form-label">Street Address</label>
                        <input type="text" id="editAddressStreet" name="street" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label for="editAddressCity" class="form-label">City</label>
                        <input type="text" id="editAddressCity" name="city" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label for="editAddressState" class="form-label">State / Province</label>
                        <input type="text" id="editAddressState" name="state" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label for="editAddressZip" class="form-label">ZIP Code</label>
                        <input type="text" id="editAddressZip" name="zip" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label for="editAddressCountry" class="form-label">Country</label>
                        <input type="text" id="editAddressCountry" name="country" class="form-input" required>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" id="cancelEditAddress">Cancel</button>
                    <button type="submit" class="btn btn-primary">Save Changes</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Product Details Modal -->
    <div class="modal" id="productDetailsModal">
        <div class="modal-backdrop" id="productDetailsBackdrop"></div>
        <div class="modal-content product-details-modal">
            <div class="modal-header">
                <h3>Product Details</h3>
                <button class="modal-close" id="productDetailsClose">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="modal-body" id="productDetailsBody">
                <div class="product-details-content">
                    <div class="product-image-section">
                        <img id="productDetailImage" src="" alt="Product Image">
                    </div>
                    <div class="product-info-section">
                        <h2 id="productDetailName"></h2>
                        <p id="productDetailDescription"></p>
                        <div class="product-price-section">
                            <span class="product-price" id="productDetailPrice"></span>
                        </div>
                        <div class="product-actions">
                            <button class="btn btn-primary" id="addToCartFromDetails">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="9" cy="21" r="1"></circle>
                                    <circle cx="20" cy="21" r="1"></circle>
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                </svg>
                                Add to Cart
                            </button>
                            <button class="btn btn-outline" id="removeFromWishlistFromDetails">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                                Remove from Wishlist
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Order Details Modal -->
    <div class="modal" id="orderDetailsModal">
        <div class="modal-backdrop" id="orderDetailsBackdrop"></div>
        <div class="modal-content order-details-modal">
            <div class="modal-header">
                <h3>Order Details</h3>
                <button class="modal-close" id="orderDetailsClose">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="modal-body" id="orderDetailsBody">
                <!-- Order details will be loaded here -->
            </div>
        </div>
    </div>

    <!-- Order Tracking Modal -->
    <div class="modal" id="orderTrackingModal">
        <div class="modal-backdrop" id="orderTrackingBackdrop"></div>
        <div class="modal-content order-tracking-modal">
            <div class="modal-header">
                <h3>Order Tracking</h3>
                <button class="modal-close" id="orderTrackingClose">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="modal-body" id="orderTrackingBody">
                <!-- Order tracking will be loaded here -->
            </div>
        </div>
    </div>

    <!-- Cart Sidebar -->
    <div class="sidebar-backdrop" id="cartBackdrop"></div>
    <div class="sidebar" id="cartSidebar">
        <div class="sidebar-header">
            <h3>Shopping Cart</h3>
            <button class="sidebar-close" id="cartClose">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
        <div class="sidebar-content" id="cartContent">
            <div class="cart-empty" id="cartEmpty">
                <div class="empty-icon">🛒</div>
                <h4>Your cart is empty</h4>
                <p>Add some treasures to get started</p>
            </div>
            <div class="cart-items" id="cartItems"></div>
        </div>
        <div class="sidebar-footer" id="cartFooter" style="display: none;">
            <div class="cart-summary">
                <div class="summary-row">
                    <span>Subtotal:</span>
                    <span id="cartSubtotal">$0</span>
                </div>
                <div class="summary-row total">
                    <span>Total:</span>
                    <span id="cartTotal">$0</span>
                </div>
            </div>
            <div class="cart-actions">
                <a class="btn btn-outline" href="cart.php">View Cart</a>
                <a class="btn btn-primary" href="cart.php">Checkout</a>
            </div>
        </div>
    </div>

    <!-- Wishlist Sidebar -->
    <div class="sidebar-backdrop" id="wishlistBackdrop"></div>
    <div class="sidebar" id="wishlistSidebar">
        <div class="sidebar-header">
            <h3>Wishlist</h3>
            <button class="sidebar-close" id="wishlistClose">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
        <div class="sidebar-content" id="wishlistContent">
            <div class="wishlist-empty" id="wishlistEmpty">
                <div class="empty-icon">💝</div>
                <h4>Your wishlist is empty</h4>
                <p>Save items you love for later</p>
            </div>
            <div class="wishlist-items" id="wishlistItems"></div>
        </div>
        <div class="sidebar-footer" id="wishlistFooter" style="display: block;">
            <div class="cart-actions">
                <button class="btn btn-outline" onclick="window.location.href='wishlist.php'">View Wishlist</button>
            </div>
        </div>
    </div>


    <?php include 'includes/sidebar.html'; ?>
    <script src="js/script.js"></script>

    <script src="js/auth-manager.js"></script>
    <script src="js/sidebar-utils.js"></script>
    <script src="js/products-data.js"></script>
    <script src="js/profile-script.js"></script>
    <script>
    document.addEventListener('mousedown', (e) => {
        const cartSidebar = document.getElementById('cartSidebar');
        const wishlistSidebar = document.getElementById('wishlistSidebar');
        if (cartSidebar && cartSidebar.classList.contains('active') &&
            !cartSidebar.querySelector('.sidebar-content').contains(e.target) &&
            !cartSidebar.querySelector('.sidebar-header').contains(e.target) &&
            !cartSidebar.querySelector('.sidebar-footer').contains(e.target)) {
            cartSidebar.classList.remove('active');
            document.body.style.overflow = '';
        }
        if (wishlistSidebar && wishlistSidebar.classList.contains('active') &&
            !wishlistSidebar.querySelector('.sidebar-content').contains(e.target) &&
            !wishlistSidebar.querySelector('.sidebar-header').contains(e.target) &&
            !wishlistSidebar.querySelector('.sidebar-footer').contains(e.target)) {
            wishlistSidebar.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    </script>
</body>
</html>