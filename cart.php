<?php
// API logic must be at the very top, before any HTML or whitespace
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', 'cart_errors.log');

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

// Helper: Get session cart (for guests)
function getSessionCart() {
    return isset($_SESSION['cart']) ? $_SESSION['cart'] : [];
}

// Helper: Save session cart
function saveSessionCart($cart) {
    foreach ($cart as $i => &$item) {
        if (!isset($item['id'])) {
            $item['id'] = uniqid('cart_', true);
        }
    }
    $_SESSION['cart'] = $cart;
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
    $log = date('Y-m-d H:i:s') . ' - Action: ' . $action;
    if ($data) {
        $log .= ' - Data: ' . json_encode($data);
    }
    error_log($log);
}

// --- API/AJAX HANDLING ---
if (isset($_GET['action']) && $_GET['action'] === 'get_cart') {
    header('Content-Type: application/json');
    $user_id = isset($_SESSION['user_id']) ? intval($_SESSION['user_id']) : null;
    if ($user_id) {
        // Fetch cart from DB
        $stmt = $pdo->prepare("SELECT c.product_id, c.quantity, p.name, p.price, p.product_sku, p.stock, p.product_image FROM cart_items c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?");
        $stmt->execute([$user_id]);
        $cart = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'cart' => $cart]);
    } else {
        // Guest: use session cart
        $cart = isset($_SESSION['cart']) ? $_SESSION['cart'] : [];
        echo json_encode(['success' => true, 'cart' => $cart]);
    }
    exit;
}

if (isset($_GET['action']) && $_GET['action'] === 'get_products' && isset($_GET['ids'])) {
    header('Content-Type: application/json');
    $ids = array_filter(array_map('intval', explode(',', $_GET['ids'])));
    if (empty($ids)) {
        echo json_encode(['success' => false, 'products' => []]);
        exit;
    }
    $in = str_repeat('?,', count($ids) - 1) . '?';
    $stmt = $pdo->prepare("SELECT id, name, price, product_image as image FROM products WHERE id IN ($in)");
    $stmt->execute($ids);
    $products = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $products[] = [
            'id' => $row['id'],
            'name' => $row['name'],
            'title' => $row['name'],
            'price' => floatval($row['price']),
            'image' => $row['image'] ?: 'images/products/placeholder.jpg'
        ];
    }
    echo json_encode(['success' => true, 'products' => $products]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action'])) {
    $action = $_GET['action'];
    $user_id = getCurrentUserId();
    
    logApiRequest($action, ['user_id' => $user_id]);
    
    if ($action === 'get_recommended') {
        try {
            // Get recommended items from database
            $query = "SELECT id, name, description, price, product_sku, stock, category 
                     FROM products 
                     WHERE stock > 0 
                     ORDER BY RAND() 
                     LIMIT 9";
            $stmt = $pdo->prepare($query);
            $stmt->execute();
            $recommended_items = [];
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $recommended_items[] = [
                    'id' => intval($row['id']),
                    'name' => $row['name'],
                    'description' => $row['description'],
                    'price' => floatval($row['price']),
                    'image' => 'images/1-7-scaled.jpg', // Default image
                    'sku' => $row['product_sku'],
                    'stock' => intval($row['stock']),
                    'category' => $row['category']
                ];
            }
            
            echo json_encode(['success' => true, 'recommended_items' => $recommended_items]);
            logApiRequest('get_recommended_success', ['items_count' => count($recommended_items)]);
            
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
        $user_id = getCurrentUserId();
        $data = json_decode(file_get_contents('php://input'), true);
        $action = $data['action'] ?? '';
        
        logApiRequest($action, $data);
        
        if ($action === 'add_to_cart') {
            $product_id = $data['product_id'] ?? null;
            $quantity = $data['quantity'] ?? 1;
            
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
                // DB cart for logged-in user
                try {
                    $check_query = "SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?";
                    $check_stmt = $pdo->prepare($check_query);
                    $check_stmt->execute([$user_id, $product_id]);
                    $existing_item = $check_stmt->fetch(PDO::FETCH_ASSOC);
                    
                    if ($existing_item) {
                        $new_quantity = $existing_item['quantity'] + $quantity;
                        $update_query = "UPDATE cart_items SET quantity = ? WHERE id = ?";
                        $update_stmt = $pdo->prepare($update_query);
                        $result = $update_stmt->execute([$new_quantity, $existing_item['id']]);
                        
                        if ($result) {
                            echo json_encode(['success' => true, 'message' => 'Cart updated', 'action' => 'updated']);
                            logApiRequest('add_to_cart_success', ['user_id' => $user_id, 'product_id' => $product_id, 'action' => 'updated']);
                        } else {
                            throw new Exception('Failed to update cart');
                        }
                    } else {
                        $insert_query = "INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)";
                        $insert_stmt = $pdo->prepare($insert_query);
                        $result = $insert_stmt->execute([$user_id, $product_id, $quantity]);
                        
                        if ($result) {
                            echo json_encode(['success' => true, 'message' => 'Item added to cart', 'action' => 'added']);
                            logApiRequest('add_to_cart_success', ['user_id' => $user_id, 'product_id' => $product_id, 'action' => 'added']);
                        } else {
                            throw new Exception('Failed to add item to cart');
                        }
                    }
                } catch (Exception $e) {
                    error_log('Error adding to cart (DB): ' . $e->getMessage());
                    http_response_code(500);
                    echo json_encode(['error' => 'Failed to add item to cart']);
                }
            } else {
                // Session cart for guests
                try {
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
                        $cart[] = [
                            'product_id' => $product_id,
                            'quantity' => $quantity,
                            'added_at' => date('Y-m-d H:i:s'),
                            'id' => uniqid('cart_', true)
                        ];
                    }
                    
                    saveSessionCart($cart);
                    echo json_encode(['success' => true, 'message' => 'Item added to cart', 'action' => $found ? 'updated' : 'added']);
                    logApiRequest('add_to_cart_success', ['guest' => true, 'product_id' => $product_id, 'action' => $found ? 'updated' : 'added']);
                    
                } catch (Exception $e) {
                    error_log('Error adding to cart (session): ' . $e->getMessage());
                    http_response_code(500);
                    echo json_encode(['error' => 'Failed to add item to cart']);
                }
            }
            exit;
        }
        
        if ($action === 'update_quantity') {
            $cart_id = $data['cart_id'] ?? null;
            $quantity = $data['quantity'] ?? 1;
            
            if (!$cart_id || $quantity < 1) {
                http_response_code(400);
                echo json_encode(['error' => 'Valid cart ID and quantity are required']);
                exit;
            }
            
            if ($user_id) {
                // DB cart for logged-in user
                try {
                    $query = "UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?";
                    $stmt = $pdo->prepare($query);
                    $result = $stmt->execute([$quantity, $cart_id, $user_id]);
                    
                    if ($result) {
                        echo json_encode(['success' => true, 'message' => 'Quantity updated']);
                        logApiRequest('update_quantity_success', ['user_id' => $user_id, 'cart_id' => $cart_id, 'quantity' => $quantity]);
                    } else {
                        throw new Exception('Failed to update quantity');
                    }
                } catch (Exception $e) {
                    error_log('Error updating quantity (DB): ' . $e->getMessage());
                    http_response_code(500);
                    echo json_encode(['error' => 'Failed to update quantity']);
                }
            } else {
                // Session cart for guests
                try {
                    $cart = getSessionCart();
                    foreach ($cart as &$item) {
                        if ($item['id'] == $cart_id) {
                            $item['quantity'] = $quantity;
                            break;
                        }
                    }
                    saveSessionCart($cart);
                    echo json_encode(['success' => true, 'message' => 'Quantity updated']);
                    logApiRequest('update_quantity_success', ['guest' => true, 'cart_id' => $cart_id, 'quantity' => $quantity]);
                } catch (Exception $e) {
                    error_log('Error updating quantity (session): ' . $e->getMessage());
                    http_response_code(500);
                    echo json_encode(['error' => 'Failed to update quantity']);
                }
            }
            exit;
        }
        
        if ($action === 'remove_from_cart') {
            $cart_id = $data['cart_id'] ?? null;
            $product_id = $data['product_id'] ?? null;
            
            if (!$cart_id && !$product_id) {
                http_response_code(400);
                echo json_encode(['error' => 'Cart item ID is required']);
                exit;
            }
            
            if ($user_id) {
                // DB cart for logged-in user
                try {
                    if ($cart_id) {
                        $query = "DELETE FROM cart_items WHERE id = ? AND user_id = ?";
                        $stmt = $pdo->prepare($query);
                        $result = $stmt->execute([$cart_id, $user_id]);
                    } else {
                        $query = "DELETE FROM cart_items WHERE user_id = ? AND product_id = ?";
                        $stmt = $pdo->prepare($query);
                        $result = $stmt->execute([$user_id, $product_id]);
                    }
                    
                    if ($result) {
                        echo json_encode(['success' => true, 'message' => 'Item removed from cart']);
                        logApiRequest('remove_from_cart_success', ['user_id' => $user_id, 'cart_id' => $cart_id, 'product_id' => $product_id]);
                    } else {
                        throw new Exception('Failed to remove item from cart');
                    }
                } catch (Exception $e) {
                    error_log('Error removing from cart (DB): ' . $e->getMessage());
                    http_response_code(500);
                    echo json_encode(['error' => 'Failed to remove item from cart']);
                }
            } else {
                // Session cart for guests
                try {
                    $cart = getSessionCart();
                    $cart = array_filter($cart, function($item) use ($cart_id, $product_id) {
                        if ($cart_id) {
                            return $item['id'] != $cart_id;
                        } else {
                            return $item['product_id'] != $product_id;
                        }
                    });
                    saveSessionCart($cart);
                    echo json_encode(['success' => true, 'message' => 'Item removed from cart']);
                    logApiRequest('remove_from_cart_success', ['guest' => true, 'cart_id' => $cart_id, 'product_id' => $product_id]);
                } catch (Exception $e) {
                    error_log('Error removing from cart (session): ' . $e->getMessage());
                    http_response_code(500);
                    echo json_encode(['error' => 'Failed to remove item from cart']);
                }
            }
            exit;
        }
        
        if ($action === 'clear_cart') {
            if ($user_id) {
                // DB cart for logged-in user
                try {
                    $query = "DELETE FROM cart_items WHERE user_id = ?";
                    $stmt = $pdo->prepare($query);
                    $result = $stmt->execute([$user_id]);
                    
                    if ($result) {
                        echo json_encode(['success' => true, 'message' => 'Cart cleared successfully']);
                        logApiRequest('clear_cart_success', ['user_id' => $user_id]);
                    } else {
                        throw new Exception('Failed to clear cart');
                    }
                } catch (Exception $e) {
                    error_log('Error clearing cart (DB): ' . $e->getMessage());
                    http_response_code(500);
                    echo json_encode(['error' => 'Failed to clear cart']);
                }
            } else {
                // Session cart for guests
                try {
                    saveSessionCart([]);
                    echo json_encode(['success' => true, 'message' => 'Cart cleared successfully']);
                    logApiRequest('clear_cart_success', ['guest' => true]);
                } catch (Exception $e) {
                    error_log('Error clearing cart (session): ' . $e->getMessage());
                    http_response_code(500);
                    echo json_encode(['error' => 'Failed to clear cart']);
                }
            }
            exit;
        }
        
        // Unknown action
        http_response_code(400);
        echo json_encode(['error' => 'Unknown action']);
        exit;
        
    } catch (Exception $e) {
        error_log('General API error: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Internal server error']);
        exit;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shopping Cart | Egyptian Creativity - Ancient Artifacts Collection</title>
    <meta name="description" content="Review your curated collection of authentic Egyptian artifacts and luxury treasures">
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="images/go3ran_.png">
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="css/cart-styles.css">
    <link rel="stylesheet" href="css/sidebar-styles.css">
</head>
<body>
    <!-- Animated Background (From Index Page) -->
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
                <button class="header-icon active" id="cartBtn">
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

    <!-- Main Content -->
    <main class="main-content">
        <div class="container">
            <!-- Breadcrumb -->
            <div class="breadcrumb">
                <a href="index.php">Home</a>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9,18 15,12 9,6"></polyline>
                </svg>
                <a href="shop.php">Shop</a>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9,18 15,12 9,6"></polyline>
                </svg>
                <span>Shopping Cart</span>
            </div>

            <!-- Page Header -->
            <div class="page-header">
                <div class="hero-ornament">𓂀</div>
                <h1 class="page-title">
                    <span class="title-line">Your Sacred</span>
                    <span class="title-line highlight">Collection</span>
                </h1>
                <p class="page-subtitle">Curated artifacts of ancient Egyptian civilization</p>
            </div>

            <!-- Cart Content -->
            <div class="cart-layout">
                <!-- Cart Items Section -->
                <div class="cart-items-section">
                    <div class="section-header">
                        <h2>Items in Cart (<span id="itemCount">0</span>)</h2>
                        <button class="clear-all-btn" id="clearAllBtn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3,6 5,6 21,6"></polyline>
                                <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1 2-2h4a2,2 0 0,1 2,2v2"></path>
                            </svg>
                            Clear All
                        </button>
                    </div>

                    <div class="cart-items-container" id="cartItemsContainer">
                        <!-- Cart items will be rendered by JS -->
                    </div>

                    <!-- Recommended Items -->
                    <div class="recommended-section">
                        <h3>You Might Also Like</h3>
                        <div class="recommended-grid" id="recommendedGrid">
                            <!-- Recommended items will be rendered here -->
                        </div>
                    </div>
                </div>

                <!-- Cart Summary Section -->
                <div class="cart-summary-section">
                    <div class="summary-card">
                        <div class="summary-header">
                            <h3>Order Summary</h3>
                            <div class="secure-badge">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                </svg>
                                <span>Secure Checkout</span>
                            </div>
                        </div>

                        <div class="summary-content">
                            <div class="summary-line">
                                <span>Subtotal</span>
                                <span id="subtotalAmount">$0.00</span>
                            </div>
                            
                            <div class="summary-divider"></div>

                            <div class="summary-line total-line">
                                <span>Total</span>
                                <span id="totalAmount">$0.00</span>
                            </div>
                        </div>

                        <div class="checkout-actions">
                            <button class="checkout-btn" id="checkoutBtn">
                                <span>Proceed to Checkout</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12,5 19,12 12,19"></polyline>
                                </svg>
                            </button>
                            <a href="shop.php" class="continue-shopping">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="19" y1="12" x2="5" y2="12"></line>
                                    <polyline points="12,19 5,12 12,5"></polyline>
                                </svg>
                                Continue Shopping
                            </a>
                        </div>
                    </div>

                    <!-- Trust Badges -->
                    <div class="trust-badges">
                        <div class="trust-item">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="1" y="3" width="15" height="13"></rect>
                                <polygon points="16,8 20,8 23,11 23,16 16,16 16,8"></polygon>
                                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                                <circle cx="18.5" cy="18.5" r="2.5"></circle>
                            </svg>
                            <div>
                                <h4>Free Shipping</h4>
                                <p>On orders over $10,000</p>
                            </div>
                        </div>
                        <div class="trust-item">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            </svg>
                            <div>
                                <h4>Authenticity Guaranteed</h4>
                                <p>Certificate included</p>
                            </div>
                        </div>
                        <div class="trust-item">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M1 4h22l-1 7H2z"></path>
                                <path d="M7 12v8a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-8"></path>
                                <path d="M16 6V4a2 2 0 0 0-2-2H10a2 2 0 0 0-2 2v2"></path>
                            </svg>
                            <div>
                                <h4>30-Day Returns</h4>
                                <p>Satisfaction guaranteed</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty Cart State -->
            <div class="empty-cart-state" id="emptyCartState" style="display: none;">
                <div class="empty-cart-content">
                    <div class="empty-icon">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                    </div>
                    <h2>Your Cart is Empty</h2>
                    <p>Discover our magnificent collection of authentic Egyptian artifacts and treasures.</p>
                    <a href="shop.php" class="explore-btn">
                        <span>Explore Collection</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12,5 19,12 12,19"></polyline>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    </main>

    <!-- Notification Container -->
    <div class="notification-container" id="notificationContainer"></div>

    <!-- Search Modal -->
    <div class="modal search-modal" id="searchModal">
        <div class="modal-backdrop" id="searchBackdrop"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Search Sacred Treasures</h3>
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

    <!-- Checkout Modal -->
    <div class="modal-overlay" id="checkoutModal">
        <div class="checkout-modal">
            <div class="modal-header">
                <h3>Secure Checkout</h3>
                <button class="close-modal" id="closeModal">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>

            <div class="checkout-steps">
                <div class="step active" data-step="1">
                    <div class="step-number">1</div>
                    <span>Shipping</span>
                </div>
                <div class="step" data-step="2">
                    <div class="step-number">2</div>
                    <span>Payment</span>
                </div>
                <div class="step" data-step="3">
                    <div class="step-number">3</div>
                    <span>Review</span>
                </div>
            </div>

            <div class="modal-content">
                <!-- Step 1: Shipping -->
                <div class="step-content active" id="step1">
                    <h4>Shipping Information</h4>
                    <form class="checkout-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label>First Name *</label>
                                <input type="text" required>
                            </div>
                            <div class="form-group">
                                <label>Last Name *</label>
                                <input type="text" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Email Address *</label>
                            <input type="email" required>
                        </div>
                        <div class="form-group">
                            <label>Phone Number *</label>
                            <input type="tel" required>
                        </div>
                        <div class="form-group">
                            <label>Address *</label>
                            <input type="text" required>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>City *</label>
                                <input type="text" required>
                            </div>
                            <div class="form-group">
                                <label>State *</label>
                                <input type="text" required>
                            </div>
                            <div class="form-group">
                                <label>ZIP Code *</label>
                                <input type="text" required>
                            </div>
                        </div>
                    </form>
                </div>

                <!-- Step 2: Payment -->
                <div class="step-content" id="step2">
                    <h4>Payment Information</h4>
                    <div class="payment-methods">
                        <label class="payment-option">
                            <input type="radio" name="payment" value="card" checked>
                            <div class="option-content">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                                    <line x1="1" y1="10" x2="23" y2="10"></line>
                                </svg>
                                <span>Credit/Debit Card</span>
                            </div>
                        </label>
                        <label class="payment-option">
                            <input type="radio" name="payment" value="paypal">
                            <div class="option-content">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                                    <line x1="12" y1="18" x2="12.01" y2="18"></line>
                                    <line x1="12" y1="6" x2="12" y2="10"></line>
                                </svg>
                                <span>PayPal</span>
                            </div>
                        </label>
                    </div>
                    <form class="payment-form">
                        <div class="form-group">
                            <label>Card Number *</label>
                            <input type="text" placeholder="1234 5678 9012 3456" required>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Expiry Date *</label>
                                <input type="text" placeholder="MM/YY" required>
                            </div>
                            <div class="form-group">
                                <label>CVV *</label>
                                <input type="text" placeholder="123" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Cardholder Name *</label>
                            <input type="text" required>
                        </div>
                    </form>
                </div>

                <!-- Step 3: Review -->
                <div class="step-content" id="step3">
                    <h4>Order Review</h4>
                    <div class="order-review">
                        <div class="review-items" id="reviewItems">
                            <!-- Review items will be populated -->
                        </div>
                        <div class="review-summary" id="reviewSummary">
                            <!-- Review summary will be populated -->
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <button class="btn-secondary" id="prevBtn" style="display: none;">Previous</button>
                <button class="btn-primary" id="nextBtn">Next Step</button>
                <button class="btn-primary" id="placeOrderBtn" style="display: none;">
                    <span>Place Order</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 6L9 17l-5-5"></path>
                    </svg>
                </button>
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

    <?php include 'includes/sidebar.html'; ?>
    <script src="js/sidebar-utils.js"></script>
    <script src="js/script.js"></script>
    <script src="js/cart-script.js"></script>
    <script src="js/auth-manager.js"></script>
</body>
</html> 