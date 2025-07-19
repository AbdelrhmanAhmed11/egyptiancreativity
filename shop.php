<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
include 'includes/db.php';

// Start session for authentication
session_start();

// Helper function to get user ID if logged in
function getUserId() {
    return isset($_SESSION['user_id']) ? intval($_SESSION['user_id']) : null;
}

// Helper for session cart/wishlist
function getSessionCart() {
    return isset($_SESSION['cart']) ? $_SESSION['cart'] : [];
}
function setSessionCart($cart) {
    $_SESSION['cart'] = $cart;
}
function getSessionWishlist() {
    return isset($_SESSION['wishlist']) ? $_SESSION['wishlist'] : [];
}
function setSessionWishlist($wishlist) {
    $_SESSION['wishlist'] = $wishlist;
}

// Merge session cart/wishlist into user DB cart/wishlist on login
if (isset($_GET['action']) && $_GET['action'] === 'merge_session_cart' && getUserId()) {
    $user_id = getUserId();
    $session_cart = getSessionCart();
    $session_wishlist = getSessionWishlist();
    // Merge cart
    foreach ($session_cart as $item) {
        $product_id = $item['product_id'];
        $quantity = $item['quantity'];
        // Check if already in DB
        $check = $pdo->prepare("SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?");
        $check->execute([$user_id, $product_id]);
        $existing = $check->fetch(PDO::FETCH_ASSOC);
        if ($existing) {
            $new_quantity = $existing['quantity'] + $quantity;
            $pdo->prepare("UPDATE cart_items SET quantity = ? WHERE id = ?")->execute([$new_quantity, $existing['id']]);
        } else {
            $pdo->prepare("INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)")->execute([$user_id, $product_id, $quantity]);
        }
    }
    // Merge wishlist
    foreach ($session_wishlist as $item) {
        $product_id = $item['product_id'];
        $check = $pdo->prepare("SELECT id FROM wishlist_items WHERE user_id = ? AND product_id = ?");
        $check->execute([$user_id, $product_id]);
        if (!$check->fetch()) {
            $pdo->prepare("INSERT INTO wishlist_items (user_id, product_id) VALUES (?, ?)")->execute([$user_id, $product_id]);
        }
    }
    // Clear session cart/wishlist
    setSessionCart([]);
    setSessionWishlist([]);
    echo json_encode(['success' => true, 'message' => 'Session cart/wishlist merged']);
    exit;
}

// Helper function to get sort clause
function getSortClause($sort) {
    switch ($sort) {
        case 'price-low':
            return 'p.price ASC';
        case 'price-high':
            return 'p.price DESC';
        case 'name-az':
            return 'p.name ASC';
        case 'name-za':
            return 'p.name DESC';
        default:
            return 'p.id DESC'; // Featured/Newest first
    }
}

// Handle API requests
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action'])) {
    header('Content-Type: application/json');
    
    $action = $_GET['action'];
    
    switch ($action) {
        case 'get_products':
            // Get products from database with filtering
            $category = $_GET['category'] ?? 'all';
            $sort = $_GET['sort'] ?? 'default';
            $search = $_GET['search'] ?? '';
            $min_price = $_GET['min_price'] ?? 0;
            $max_price = $_GET['max_price'] ?? 50000;
            $page = $_GET['page'] ?? 1;
            $limit = $_GET['limit'] ?? 12;
            $offset = ($page - 1) * $limit;
            
            // Build query
            $where_conditions = [];
            $params = [];
            
            if ($category !== 'all') {
                $where_conditions[] = "c.name = ?";
                $params[] = $category;
            }
            
            if (!empty($search)) {
                $where_conditions[] = "(p.name LIKE ? OR p.description LIKE ?)";
                $params[] = "%$search%";
                $params[] = "%$search%";
            }
            
            if ($min_price > 0) {
                $where_conditions[] = "p.price >= ?";
                $params[] = $min_price;
            }
            
            if ($max_price < 50000) {
                $where_conditions[] = "p.price <= ?";
                $params[] = $max_price;
            }
            
            $where_clause = !empty($where_conditions) ? "WHERE " . implode(" AND ", $where_conditions) : "";
            
            // Count total products
            $count_query = "SELECT COUNT(*) as total FROM products p 
                           LEFT JOIN categories c ON p.category = c.id 
                           $where_clause";
            $count_stmt = $pdo->prepare($count_query);
            $count_stmt->execute($params);
            $total_products = $count_stmt->fetch(PDO::FETCH_ASSOC)['total'];
            
            // Make sure $limit and $offset are integers
            $limit = (int)$limit;
            $offset = (int)$offset;
            // Get products with pagination
            $query = "SELECT 
                        p.id,
                        p.name,
                        p.description,
                        p.price,
                        p.product_sku,
                        p.stock,
                        p.has_box,
                        p.type,
                        p.blog_id,
                        p.product_image,
                        p.box_image,
                        c.name as category_name,
                        c.id as category_id
                    FROM products p
                    LEFT JOIN categories c ON p.category = c.id
                    $where_clause
                    ORDER BY " . getSortClause($sort) . "
                    LIMIT $limit OFFSET $offset";
            
            $stmt = $pdo->prepare($query);
            $stmt->execute($params);
            $products = [];
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                // Use actual product image or fallback to placeholder
                $product_image = $row['product_image'] ?: 'images/products/placeholder.jpg';
                $type = strtolower($row['type'] ?? 'featured');
                if (!in_array($type, ['featured', 'new', 'sale'])) {
                    $type = 'featured';
                }
                // Format the data to match frontend expectations
                $products[] = [
                    'id' => $row['id'],
                    'title' => $row['name'],
                    'category' => strtolower($row['category_name']),
                    'price' => floatval($row['price']),
                    'originalPrice' => null, // Could be stored in separate table
                    'image' => $product_image, // Use actual product image
                    'description' => $row['description'],
                    'rating' => 4.8, // Could be stored in separate table
                    'reviews' => rand(10, 50), // Demo data
                    'badges' => [$type], // Use the real type as the badge
                    'type' => $type, // Send the type to the frontend
                    'inStock' => $row['stock'] > 0,
                    'quantity' => $row['stock'],
                    'sku' => $row['product_sku'],
                    'has_box' => isset($row['has_box']) ? (bool)$row['has_box'] : false,
                    'box_image' => $row['box_image'], // Include box image if available
                    'blog_id' => isset($row['blog_id']) ? $row['blog_id'] : null
                ];
            }
            
            echo json_encode([
                'success' => true,
                'products' => $products,
                'total' => $total_products,
                'page' => $page,
                'total_pages' => ceil($total_products / $limit)
            ]);
            exit;
            
        case 'get_categories':
            // Get all categories
            $query = "SELECT id, name, description FROM categories ORDER BY name";
            $stmt = $pdo->prepare($query);
            $stmt->execute();
            $categories = [];
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $categories[] = [
                    'id' => $row['id'],
                    'name' => $row['name'],
                    'description' => $row['description']
                ];
            }
            
            echo json_encode(['success' => true, 'categories' => $categories]);
            exit;
        case 'get_cart':
            $user_id = getUserId();
            if ($user_id) {
                $stmt = $pdo->prepare("SELECT c.product_id, c.quantity, p.name, p.price, p.product_sku, p.stock FROM cart_items c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?");
                $stmt->execute([$user_id]);
                $cart = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } else {
                $cart = getSessionCart();
            }
            echo json_encode(['success' => true, 'cart' => $cart]);
            exit;
        case 'get_wishlist':
            $user_id = getUserId();
            if ($user_id) {
                $stmt = $pdo->prepare("SELECT w.product_id, p.name, p.price, p.product_sku, p.stock FROM wishlist_items w JOIN products p ON w.product_id = p.id WHERE w.user_id = ?");
                $stmt->execute([$user_id]);
                $wishlist = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } else {
                $wishlist = getSessionWishlist();
            }
            echo json_encode(['success' => true, 'wishlist' => $wishlist]);
            exit;
    }
}

// Fallback: If an API action is requested but not handled, return JSON error and exit
if (isset($_GET['action'])) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'error' => 'Invalid API action']);
    exit;
}

// Handle POST requests (add to cart/wishlist)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json');
    
    $data = json_decode(file_get_contents('php://input'), true);
    $action = $data['action'] ?? '';
    $user_id = getUserId();
    
    switch ($action) {
        case 'add_to_cart':
            $product_id = $data['product_id'] ?? null;
            $quantity = $data['quantity'] ?? 1;
            
            if (!$product_id) {
                http_response_code(400);
                echo json_encode(['error' => 'Product ID is required']);
                exit;
            }
            
            if ($user_id) {
                // DB cart
                try {
                    // Check if item already in cart
                    $check_query = "SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?";
                    $check_stmt = $pdo->prepare($check_query);
                    $check_stmt->execute([$user_id, $product_id]);
                    $existing_item = $check_stmt->fetch(PDO::FETCH_ASSOC);
                    
                    if ($existing_item) {
                        // Update quantity
                        $new_quantity = $existing_item['quantity'] + $quantity;
                        $update_query = "UPDATE cart_items SET quantity = ? WHERE id = ?";
                        $update_stmt = $pdo->prepare($update_query);
                        $result = $update_stmt->execute([$new_quantity, $existing_item['id']]);
                        
                        if ($result) {
                            echo json_encode(['success' => true, 'message' => 'Cart updated', 'action' => 'updated']);
                        } else {
                            http_response_code(500);
                            echo json_encode(['error' => 'Failed to update cart']);
                        }
                    } else {
                        // Add new item
                        $insert_query = "INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)";
                        $insert_stmt = $pdo->prepare($insert_query);
                        $result = $insert_stmt->execute([$user_id, $product_id, $quantity]);
                        
                        if ($result) {
                            echo json_encode(['success' => true, 'message' => 'Item added to cart', 'action' => 'added']);
                        } else {
                            http_response_code(500);
                            echo json_encode(['error' => 'Failed to add item to cart']);
                        }
                    }
                } catch (Exception $e) {
                    http_response_code(500);
                    echo json_encode(['error' => 'Database error']);
                }
            } else {
                // Session cart
                $cart = getSessionCart();
                $found = false;
                foreach ($cart as &$item) {
                    if ($item['product_id'] == $product_id) {
                        $item['quantity'] += $quantity;
                        $found = true;
                        break;
                    }
                }
                if (!$found) {
                    $cart[] = ['product_id' => $product_id, 'quantity' => $quantity];
                }
                setSessionCart($cart);
                echo json_encode(['success' => true, 'message' => 'Item added to cart (session)', 'action' => $found ? 'updated' : 'added']);
            }
            exit;
            
        case 'add_to_wishlist':
            $product_id = $data['product_id'] ?? null;
            
            if (!$product_id) {
                http_response_code(400);
                echo json_encode(['error' => 'Product ID is required']);
                exit;
            }
            
            if ($user_id) {
                // DB wishlist
                try {
                    // Check if item already in wishlist
                    $check_query = "SELECT id FROM wishlist_items WHERE user_id = ? AND product_id = ?";
                    $check_stmt = $pdo->prepare($check_query);
                    $check_stmt->execute([$user_id, $product_id]);
                    
                    if ($check_stmt->fetch()) {
                        echo json_encode(['success' => false, 'message' => 'Item already in wishlist']);
                    } else {
                        // Add to wishlist
                        $insert_query = "INSERT INTO wishlist_items (user_id, product_id) VALUES (?, ?)";
                        $insert_stmt = $pdo->prepare($insert_query);
                        $result = $insert_stmt->execute([$user_id, $product_id]);
                        
                        if ($result) {
                            echo json_encode(['success' => true, 'message' => 'Item added to wishlist']);
                        } else {
                            http_response_code(500);
                            echo json_encode(['error' => 'Failed to add item to wishlist']);
                        }
                    }
                } catch (Exception $e) {
                    http_response_code(500);
                    echo json_encode(['error' => 'Database error']);
                }
            } else {
                // Session wishlist
                $wishlist = getSessionWishlist();
                foreach ($wishlist as $item) {
                    if ($item['product_id'] == $product_id) {
                        echo json_encode(['success' => false, 'message' => 'Item already in wishlist (session)']);
                        exit;
                    }
                }
                $wishlist[] = ['product_id' => $product_id];
                setSessionWishlist($wishlist);
                echo json_encode(['success' => true, 'message' => 'Item added to wishlist (session)']);
            }
            exit;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shop | Egyptian Creativity - Luxury Ancient Artifacts Collection</title>
    <meta name="description" content="Discover authentic Egyptian artifacts, jewelry, and decorative items crafted by master artisans">
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="images/go3ran_.png">
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="css/shop-styles.css">
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
                <a href="shop.php" class="nav-link active">SHOP</a>
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
    <section class="hero-shop">
        <div class="hero-content">
            <div class="hero-ornaments">
                <div class="ornament left">𓂀</div>
                <div class="ornament right">𓋹</div>
            </div>
            <div class="hero-text-center">
                <div class="hero-badge">
                    ✨ Authentic Egyptian Collection
                </div>
                <h1 class="hero-title">
                    <span class="line">Discover Our</span>
                    <span class="line golden">Sacred Collection</span>
                    <span class="line">of Ancient Treasures</span>
                </h1>
                <p class="hero-description">
                    Each piece in our curated collection represents thousands of years of Egyptian craftsmanship, 
                    handpicked and authenticated by our expert archaeologists and master artisans.
                </p>
                <div class="hero-stats">
                    <div class="stat">
                        <div class="stat-number">500+</div>
                        <div class="stat-label">Artifacts</div>
                    </div>
                    <div class="stat-divider">𓊃</div>
                    <div class="stat">
                        <div class="stat-number">100%</div>
                        <div class="stat-label">Authentic</div>
                    </div>
                    <div class="stat-divider">𓊃</div>
                    <div class="stat">
                        <div class="stat-number">25+</div>
                        <div class="stat-label">Years</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="scroll-indicator">
            <div class="scroll-line"></div>
            <span>Explore Collection</span>
        </div>
    </section>

    <!-- Filter Bar -->
    <section class="filter-section">
        <div class="container">
            <div class="filter-bar">
                <div class="filter-main">
                    <div class="filter-controls">
                        <select class="filter-select" id="categorySelect">
                            <option value="all">All Categories</option>
                            <option value="Pharaonic Masks">Pharaonic Masks</option>
                            <option value="Jewelry">Jewelry</option>
                            <option value="Statues">Statues</option>
                            <option value="Home Decor">Home Decor</option>
                            <option value="Textiles">Textiles</option>
                        </select>
                        <select class="filter-select" id="sortSelect">
                            <option value="default">Featured</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="name-az">Name: A to Z</option>
                            <option value="name-za">Name: Z to A</option>
                        </select>
                        <div class="price-filter">
                            <input type="number" id="minPrice" placeholder="Min" class="price-input">
                            <span class="price-separator">—</span>
                            <input type="number" id="maxPrice" placeholder="Max" class="price-input">
                            <button class="apply-btn" id="applyPriceFilter">Apply</button>
                        </div>
                        <div class="view-toggle">
                            <button class="view-btn active" data-view="grid" id="gridViewBtn" title="Grid View">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="3" width="7" height="7"></rect>
                                    <rect x="14" y="3" width="7" height="7"></rect>
                                    <rect x="14" y="14" width="7" height="7"></rect>
                                    <rect x="3" y="14" width="7" height="7"></rect>
                                </svg>
                            </button>
                            <button class="view-btn" data-view="list" id="listViewBtn" title="List View">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="8" y1="6" x2="21" y2="6"></line>
                                    <line x1="8" y1="12" x2="21" y2="12"></line>
                                    <line x1="8" y1="18" x2="21" y2="18"></line>
                                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        <div class="search-container">
                            <input type="text" id="shopSearchInput" class="search-input" placeholder="Search ancient treasures...">
                            <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.35-4.35"></path>
                            </svg>
                        </div>
                    </div>
                    
                    <div class="results-info" id="resultsInfo">
                        Loading treasures...
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Products Section -->
    <section class="products-section">
        <div class="container">
            <div class="products-grid" id="productsGrid">
                <!-- Products will be rendered here -->
            </div>
            
            <!-- Pagination -->
            <div class="pagination-container">
                <nav class="pagination" id="pagination">
                    <button class="pagination-btn prev" id="prevBtn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="15,18 9,12 15,6"></polyline>
                        </svg>
                        Previous
                    </button>
                    <div class="pagination-numbers" id="paginationNumbers"></div>
                    <button class="pagination-btn next" id="nextBtn">
                        Next
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="9,18 15,12 9,6"></polyline>
                        </svg>
                    </button>
                </nav>
            </div>
        </div>
    </section>

    <!-- Search Modal -->
    <div class="modal search-modal" id="searchModal">
        <div class="modal-backdrop" id="searchBackdrop"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Search Collection</h3>
                <button class="modal-close" id="searchClose">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="search-input-container">
                <input type="text" class="search-input" placeholder="Search for ancient treasures..." id="searchInput">
            </div>
            <div class="search-suggestions">
                <div class="suggestion-item">Ancient Artifacts</div>
                <div class="suggestion-item">Pharaoh Masks</div>
                <div class="suggestion-item">Sacred Jewelry</div>
                <div class="suggestion-item">Egyptian Decor</div>
                <div class="suggestion-item">Royal Accessories</div>
            </div>
        </div>
    </div>

    <!-- Quick View Modal -->
    <div class="modal quick-view-modal" id="quickViewModal">
        <div class="modal-backdrop" id="quickViewBackdrop"></div>
        <div class="modal-content quick-view-content">
            <button class="modal-close" id="quickViewClose">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
            <div id="quickViewContent">
                <!-- Quick view content will be loaded here -->
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
                <button class="btn btn-outline" id="viewWishlistBtn" onclick="window.location.href='wishlist.php'">View Wishlist</button>
            </div>
        </div>
    </div>

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
    <?php include 'includes/sidebar.html'; ?>
    <script src="js/script.js"></script>

    <script src="js/auth-manager.js"></script>
    <script src="js/sidebar-utils.js"></script>
    <script src="js/shop-script.js"></script>
    <script src="js/products-data.js"></script>
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
    <?php include 'includes/sidebar.html'; ?>
</body>
</html>