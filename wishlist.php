<?php
// API logic must be at the very top, before any HTML or whitespace
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', 'wishlist_errors.log');

// Start session
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

// Helper: Get session wishlist (for guests)
function getSessionWishlist() {
    return isset($_SESSION['wishlist']) ? $_SESSION['wishlist'] : [];
}

// Helper: Save session wishlist
function saveSessionWishlist($wishlist) {
    $_SESSION['wishlist'] = $wishlist;
}

// Helper: Find product details
function getProductDetails($pdo, $product_id) {
    try {
        $stmt = $pdo->prepare('SELECT * FROM products WHERE id = ?');
        $stmt->execute([$product_id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        error_log('Error getting product details: ' . $e->getMessage());
        return false;
    }
}

// Helper: Log API requests
function logApiRequest($action, $data = null) {
    $log = date('Y-m-d H:i:s') . ' - Wishlist Action: ' . $action;
    if ($data) {
        $log .= ' - Data: ' . json_encode($data);
    }
    error_log($log);
}


// --- API/AJAX HANDLING ---
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action'])) {
    $action = $_GET['action'];
    $user_id = getCurrentUserId();
    
    logApiRequest($action, ['user_id' => $user_id]);
    
    if ($action === 'get_wishlist') {
        try {
            if ($user_id) {
                // DB wishlist for logged-in user
                $sql = "SELECT w.id, p.id as product_id, p.name, p.description, p.price, p.product_sku, p.stock, c.name as category_name, p.product_image FROM wishlist_items w JOIN products p ON w.product_id = p.id LEFT JOIN categories c ON p.category = c.id WHERE w.user_id = ? ORDER BY w.added_at DESC";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([$user_id]);
                $wishlist_items = [];
                while ($row = $stmt->fetch()) {
                    $wishlist_items[] = [
                        'id' => $row['id'],
                        'product_id' => $row['product_id'],
                        'name' => $row['name'],
                        'description' => $row['description'],
                        'price' => floatval($row['price']),
                        'category' => $row['category_name'],
                        'image' => $row['product_image'] ? $row['product_image'] : 'images/products/placeholder.jpg',
                        'inStock' => $row['stock'] > 0,
                        'quantity' => $row['stock']
                    ];
                }
                echo json_encode(['success' => true, 'wishlist' => $wishlist_items]);
                logApiRequest('get_wishlist_success', ['user_id' => $user_id, 'items_count' => count($wishlist_items)]);
            } else {
                // Session wishlist for guests
                $wishlist = getSessionWishlist();
                $wishlist_items = [];
                foreach ($wishlist as $item) {
                    $product = getProductDetails($pdo, $item['product_id']);
                    if ($product) {
                        $wishlist_items[] = [
                            'id' => $item['product_id'],
                            'product_id' => $item['product_id'],
                            'name' => $product['name'],
                            'description' => $product['description'],
                            'price' => floatval($product['price']),
                            'category' => $product['category'],
                            'image' => $product['product_image'] ? $product['product_image'] : 'images/products/placeholder.jpg',
                            'inStock' => $product['stock'] > 0,
                            'quantity' => $product['stock']
                        ];
                    }
                }
                echo json_encode(['success' => true, 'wishlist' => $wishlist_items]);
                logApiRequest('get_wishlist_success', ['guest' => true, 'items_count' => count($wishlist_items)]);
            }
        } catch (Exception $e) {
            error_log('Error getting wishlist: ' . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Failed to get wishlist items']);
        }
        exit;
    }
    
    if ($action === 'get_recommended') {
        try {
            // Get product IDs already in wishlist
            $wishlist_ids = [];
            if ($user_id) {
                $stmt = $pdo->prepare("SELECT product_id FROM wishlist_items WHERE user_id = ?");
                $stmt->execute([$user_id]);
                $wishlist_ids = $stmt->fetchAll(PDO::FETCH_COLUMN, 0);
            } else {
                $wishlist = getSessionWishlist();
                foreach ($wishlist as $item) {
                    $wishlist_ids[] = $item['product_id'];
                }
            }
            
            // Get recommended products not in wishlist (limit 8)
            $placeholders = count($wishlist_ids) > 0 ? implode(',', array_fill(0, count($wishlist_ids), '?')) : '';
            $sql = "SELECT id, name, description, price, product_sku, stock, category, product_image FROM products";
            if ($placeholders) {
                $sql .= " WHERE id NOT IN ($placeholders) AND stock > 0";
            } else {
                $sql .= " WHERE stock > 0";
            }
            $sql .= " ORDER BY RAND() LIMIT 8";
            
            $stmt = $pdo->prepare($sql);
            if ($placeholders) {
                $stmt->execute($wishlist_ids);
            } else {
                $stmt->execute();
            }
            
            $recommended = [];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $recommended[] = [
                    'id' => $row['id'],
                    'name' => $row['name'],
                    'description' => $row['description'],
                    'price' => floatval($row['price']),
                    'sku' => $row['product_sku'],
                    'category' => $row['category'],
                    'image' => $row['product_image'] ? $row['product_image'] : 'images/products/placeholder.jpg',
                    'inStock' => $row['stock'] > 0,
                    'quantity' => $row['stock']
                ];
            }
            
            echo json_encode(['success' => true, 'recommended' => $recommended]);
            logApiRequest('get_recommended_success', ['items_count' => count($recommended)]);
            
        } catch (Exception $e) {
            error_log('Error getting recommended items: ' . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Failed to get recommended items']);
        }
            exit;
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
    $data = json_decode(file_get_contents('php://input'), true);
    $action = $data['action'] ?? '';
        $user_id = getCurrentUserId();
    
        logApiRequest($action, $data);
    
        if ($action === 'add_to_wishlist') {
            $product_id = $data['product_id'] ?? null;
            
            if (!$product_id) {
                http_response_code(400);
                echo json_encode(['error' => 'Product ID is required']);
                exit;
            }
            
            // Validate product exists
            $product = getProductDetails($pdo, $product_id);
            if (!$product) {
                http_response_code(404);
                echo json_encode(['error' => 'Product not found']);
                exit;
            }
            
            if ($user_id) {
                // DB wishlist for logged-in user
                try {
                $check_sql = "SELECT id FROM wishlist_items WHERE user_id = ? AND product_id = ?";
                $check_stmt = $pdo->prepare($check_sql);
                $check_stmt->execute([$user_id, $product_id]);
                
                if ($check_stmt->fetch()) {
                    echo json_encode(['success' => false, 'message' => 'Item already in wishlist']);
                        logApiRequest('add_to_wishlist_already_exists', ['user_id' => $user_id, 'product_id' => $product_id]);
                } else {
                    $insert_sql = "INSERT INTO wishlist_items (user_id, product_id, added_at) VALUES (?, ?, NOW())";
                    $insert_stmt = $pdo->prepare($insert_sql);
                    $result = $insert_stmt->execute([$user_id, $product_id]);
                    
                    if ($result) {
                        echo json_encode(['success' => true, 'message' => 'Item added to wishlist']);
                            logApiRequest('add_to_wishlist_success', ['user_id' => $user_id, 'product_id' => $product_id]);
                        } else {
                            throw new Exception('Failed to add item to wishlist');
                        }
                    }
                } catch (Exception $e) {
                    error_log('Error adding to wishlist (DB): ' . $e->getMessage());
                    http_response_code(500);
                    echo json_encode(['error' => 'Failed to add item to wishlist']);
                }
            } else {
                // Session wishlist for guests
                try {
                    $wishlist = getSessionWishlist();
                    $already_exists = false;
                    
                    foreach ($wishlist as $item) {
                        if ($item['product_id'] == $product_id) {
                            $already_exists = true;
                            break;
                        }
                    }
                    
                    if ($already_exists) {
                        echo json_encode(['success' => false, 'message' => 'Item already in wishlist']);
                        logApiRequest('add_to_wishlist_already_exists', ['guest' => true, 'product_id' => $product_id]);
                    } else {
                        $wishlist[] = [
                            'product_id' => $product_id,
                            'added_at' => date('Y-m-d H:i:s')
                        ];
                        saveSessionWishlist($wishlist);
                        echo json_encode(['success' => true, 'message' => 'Item added to wishlist']);
                        logApiRequest('add_to_wishlist_success', ['guest' => true, 'product_id' => $product_id]);
                }
            } catch (Exception $e) {
                    error_log('Error adding to wishlist (session): ' . $e->getMessage());
                    http_response_code(500);
                    echo json_encode(['error' => 'Failed to add item to wishlist']);
                }
            }
            exit;
        }
            
        if ($action === 'remove_from_wishlist') {
            $product_id = $data['product_id'] ?? null;
            
            if (!$product_id) {
                http_response_code(400);
                echo json_encode(['error' => 'Product ID is required']);
                exit;
            }
            
            if ($user_id) {
                // DB wishlist for logged-in user
            try {
                $delete_sql = "DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?";
                $delete_stmt = $pdo->prepare($delete_sql);
                $result = $delete_stmt->execute([$user_id, $product_id]);
                
                if ($result) {
                    echo json_encode(['success' => true, 'message' => 'Item removed from wishlist']);
                        logApiRequest('remove_from_wishlist_success', ['user_id' => $user_id, 'product_id' => $product_id]);
                } else {
                        throw new Exception('Failed to remove item from wishlist');
                    }
                } catch (Exception $e) {
                    error_log('Error removing from wishlist (DB): ' . $e->getMessage());
                    http_response_code(500);
                    echo json_encode(['error' => 'Failed to remove item from wishlist']);
                }
            } else {
                // Session wishlist for guests
                try {
                    $wishlist = getSessionWishlist();
                    $initial_count = count($wishlist);
                    $wishlist = array_filter($wishlist, function($item) use ($product_id) {
                        return $item['product_id'] != $product_id;
                    });
                    
                    if (count($wishlist) < $initial_count) {
                        saveSessionWishlist($wishlist);
                        echo json_encode(['success' => true, 'message' => 'Item removed from wishlist']);
                        logApiRequest('remove_from_wishlist_success', ['guest' => true, 'product_id' => $product_id]);
                    } else {
                        echo json_encode(['error' => 'Item not found in wishlist']);
                        logApiRequest('remove_from_wishlist_not_found', ['guest' => true, 'product_id' => $product_id]);
                }
            } catch (Exception $e) {
                    error_log('Error removing from wishlist (session): ' . $e->getMessage());
                http_response_code(500);
                    echo json_encode(['error' => 'Failed to remove item from wishlist']);
                }
            }
            exit;
        }
        
        if ($action === 'clear_wishlist') {
            if ($user_id) {
                // DB wishlist for logged-in user
                try {
                    $query = "DELETE FROM wishlist_items WHERE user_id = ?";
                    $stmt = $pdo->prepare($query);
                    $result = $stmt->execute([$user_id]);
                    
                    if ($result) {
                        echo json_encode(['success' => true, 'message' => 'Wishlist cleared successfully']);
                        logApiRequest('clear_wishlist_success', ['user_id' => $user_id]);
                    } else {
                        throw new Exception('Failed to clear wishlist');
                    }
                } catch (Exception $e) {
                    error_log('Error clearing wishlist (DB): ' . $e->getMessage());
                    http_response_code(500);
                    echo json_encode(['error' => 'Failed to clear wishlist']);
            }
            } else {
                // Session wishlist for guests
                try {
                    saveSessionWishlist([]);
                    echo json_encode(['success' => true, 'message' => 'Wishlist cleared successfully']);
                    logApiRequest('clear_wishlist_success', ['guest' => true]);
                } catch (Exception $e) {
                    error_log('Error clearing wishlist (session): ' . $e->getMessage());
                    http_response_code(500);
                    echo json_encode(['error' => 'Failed to clear wishlist']);
                }
            }
            exit;
        }
        
        // Unknown action
        http_response_code(400);
        echo json_encode(['error' => 'Unknown action']);
        exit;
        
    } catch (Exception $e) {
        error_log('General wishlist API error: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Internal server error']);
            exit;
    }
}

// Get wishlist items for display
$wishlist_items = [];
$user_id = getCurrentUserId(); // Use helper function

$sql = "SELECT w.id, p.id as product_id, p.name, p.description, p.price, p.product_sku, p.stock, c.name as category_name
        FROM wishlist_items w
        JOIN products p ON w.product_id = p.id
        LEFT JOIN categories c ON p.category = c.id
        WHERE w.user_id = ?
        ORDER BY w.added_at DESC";

$stmt = $pdo->prepare($sql);
$stmt->execute([$user_id]);
while ($row = $stmt->fetch()) {
    $wishlist_items[] = $row;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Sacred Wishlist - Egyptian Creativity | Ancient Artifacts Collection</title>
    <meta name="description" content="Your curated collection of ancient Egyptian artifacts and luxury treasures">

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="images/go3ran_.png">

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="css/sidebar-styles.css">
    <link rel="stylesheet" href="css/wishlist-styles.css">

    
    
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

    <!-- Hero Section -->
    <section class="hero" id="home">
        <div class="hero-content">
            <div class="hero-text">
                <div class="hero-badge">
                    ✨ Your Sacred Collection
                </div>
                <h1 class="hero-title">
                    <span class="line">My Sacred</span>
                    <span class="line golden">Wishlist</span>
                </h1>
                <p class="hero-description">
                    Your carefully curated collection of ancient Egyptian creativity, each piece chosen for its divine beauty and mystical significance.
                </p>
                <div class="hero-stats">
                    <div class="stat">
                        <div class="stat-number" id="totalItems">0</div>
                        <div class="stat-label">Treasures</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number" id="totalValue">$0</div>
                        <div class="stat-label">Total Value</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number">∞</div>
                        <div class="stat-label">Memories</div>
                    </div>
                </div>
                <div class="hero-buttons">
                    <button class="btn btn-primary" id="addAllBtn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                        Add All to Cart
                    </button>
                    <button class="btn btn-secondary" id="shareBtn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                            <path d="M16 6l-4-4-4 4"></path>
                            <path d="M12 2v13"></path>
                        </svg>
                        Share Collection
                    </button>
                </div>
            </div>
        </div>
        <div class="scroll-indicator">
            <div class="scroll-line"></div>
            <span>Scroll to explore</span>
        </div>
    </section>

    <!-- Filter Section -->
    <section class="filter-section">
        <div class="container">
            <div class="filter-bar">
                <div class="filter-left">
                    <div class="wishlist-summary">
                        <span class="summary-label">Items:</span>
                        <span class="summary-value" id="totalItemsDisplay">0</span>
                        <span class="summary-separator">|</span>
                        <span class="summary-label">Value:</span>
                        <span class="summary-value" id="totalValueDisplay">$0.00</span>
                    </div>
                </div>
                <div class="filter-right">
                    <div class="filter-controls">
                        <select class="sort-select" id="sortSelect">
                            <option value="newest">Newest First</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="name-asc">Name: A to Z</option>
                            <option value="name-desc">Name: Z to A</option>
                        </select>
                        <select class="filter-select" id="filterSelect">
                            <option value="all">All Categories</option>
                            <option value="accessories">Accessories</option>
                            <option value="decorations">Decorations</option>
                            <option value="boxes">Boxes</option>
                            <option value="game-boxes">Game Boxes</option>
                            <option value="fashion">Fashion</option>
                        </select>
                        <div class="view-toggle">
                            <button class="view-btn active" data-view="grid" id="gridViewBtn">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="3" width="7" height="7"></rect>
                                    <rect x="14" y="3" width="7" height="7"></rect>
                                    <rect x="14" y="14" width="7" height="7"></rect>
                                    <rect x="3" y="14" width="7" height="7"></rect>
                                </svg>
                            </button>
                            <button class="view-btn" data-view="list" id="listViewBtn">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="8" y1="6" x2="21" y2="6"></line>
                                    <line x1="8" y1="12" x2="21" y2="12"></line>
                                    <line x1="8" y1="18" x2="21" y2="18"></line>
                                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Wishlist Section -->
    <section class="wishlist-section">
        <div class="container">
            <!-- Empty State -->
            <div class="empty-state" id="emptyState" style="display: none;">
                <div class="empty-icon">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </div>
                <h2>Your Sacred Collection Awaits</h2>
                <p>Begin your journey through ancient Egyptian creativity and mystical artifacts</p>
                <button class="btn btn-primary" onclick="window.location.href='shop.php'">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M8 12l2 2 4-4"></path>
                    </svg>
                    Explore Collection
                </button>
            </div>

            <!-- Wishlist Grid -->
            <div class="wishlist-grid" id="wishlistGrid">
                <!-- Items will be populated by JavaScript -->
            </div>
        </div>
    </section>

    <!-- Recommended Section -->
    <section class="recommended-section">
        <div class="container">
            <div class="section-header">
                <div class="section-badge">Recommended</div>
                <h2 class="section-title">Treasures You Might Cherish</h2>
                <p class="section-description">
                    Discover more ancient wonders that complement your divine collection
                </p>
            </div>
            <div class="recommended-grid" id="recommendedGrid">
                <!-- Recommended items will be populated by JavaScript -->
            </div>
        </div>
    </section>

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

    <!-- Notification Container -->
    <div class="notification-container" id="notificationContainer"></div>

    <!-- Search Modal -->
    <div class="search-modal" id="searchModal">
        <div class="modal-backdrop" id="searchBackdrop"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Search Wishlist</h3>
                <button class="modal-close" id="searchClose">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="search-input-container">
                <input type="text" class="search-input" placeholder="Search your wishlist..." id="searchInput">
                <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                </svg>
            </div>
            <div class="search-suggestions">
                <div class="suggestion-item">Pharaoh Mask</div>
                <div class="suggestion-item">Jewelry</div>
                <div class="suggestion-item">Decorations</div>
                <div class="suggestion-item">Treasure </div>
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

    <?php include 'includes/sidebar.html'; ?>
    <script src="js/script.js"></script>

    <script src="js/auth-manager.js"></script>
    <script src="js/sidebar-utils.js"></script>
    <script src="js/wishlist-script.js"></script>
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
    <script>
function updateWishlistBadge() {
    let count = 0;
    try {
        // Try localStorage (for guests)
        const wishlist = JSON.parse(localStorage.getItem('egyptianWishlist') || '[]');
        count = Array.isArray(wishlist) ? wishlist.length : 0;
    } catch (e) { count = 0; }
    var badge = document.getElementById('wishlistBadge');
    if (badge) {
        badge.textContent = count;
        badge.style.display = 'inline-block';
    }
}
document.addEventListener('DOMContentLoaded', updateWishlistBadge);
// Optionally, call updateWishlistBadge() after any wishlist action in your JS as well.
</script>
</body>
</html>