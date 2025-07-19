<?php include 'includes/db.php'; ?>
<?php
// Fetch company info from admin_settings
$site_name = '';
$site_description = '';
$stmt = $pdo->prepare("SELECT setting_key, setting_value FROM admin_settings WHERE setting_key IN ('site_name', 'site_description')");
$stmt->execute();
while ($row = $stmt->fetch()) {
    if ($row['setting_key'] === 'site_name') $site_name = $row['setting_value'];
    if ($row['setting_key'] === 'site_description') $site_description = $row['setting_value'];
}

// Fetch masterpieces from DB
$masterpieces = [];
try {
    $mp_stmt = $pdo->query("SELECT * FROM masterpieces ORDER BY created_at DESC");
    if ($mp_stmt) {
        $mp_stmt->setFetchMode(PDO::FETCH_ASSOC);
        while ($row = $mp_stmt->fetch()) {
            $masterpieces[] = $row;
        }
    }
} catch (Exception $e) {
    $masterpieces = [];
}
// Fetch team members from DB
$team_members = [];
try {
    $team_stmt = $pdo->query("SELECT * FROM team_members ORDER BY created_at DESC");
    if ($team_stmt) {
        $team_stmt->setFetchMode(PDO::FETCH_ASSOC);
        while ($row = $team_stmt->fetch()) {
            $team_members[] = $row;
        }
    }
} catch (Exception $e) {
    $team_members = [];
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About Us - <?php echo htmlspecialchars($site_name); ?> | Luxury Ancient Artifacts Collection</title>
    <meta name="description" content="Discover the story behind <?php echo htmlspecialchars($site_name); ?> - <?php echo htmlspecialchars($site_description); ?>">
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="images/go3ran_.png">
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="css/about-styles.css">
    
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
                <a href="about.php" class="nav-link active">ABOUT US</a>
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
                    ✨ Our Egyptian Legacy
                </div>
                <h1 class="hero-title">
                    <span class="line">Guardians of</span>
                    <span class="line golden">Ancient Heritage</span>
                    <span class="line"><?php echo htmlspecialchars($site_name); ?></span>
                </h1>
                <p class="hero-description">
                    <?php echo htmlspecialchars($site_description); ?>
                </p>
                <div class="hero-stats" id="heroStats">
                    <div class="stat">
                        <div class="stat-number" data-target="1000">0</div>
                        <div class="stat-label">Happy Clients</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number" data-target="25">0</div>
                        <div class="stat-label">Years Experience</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number" data-target="500">0</div>
                        <div class="stat-label">Masterpieces</div>
                    </div>
                </div>
            </div>
            <div class="hero-visual">
                <div class="featured-story" id="featuredStory">
                    <div class="story-showcase">
                        <div class="story-image">
                            <img src="images/4-5-scaled.jpg" alt="Master Craftsman" id="storyImage">
                        </div>
                        <div class="story-info">
                            <h3 id="storyTitle">Master Craftsman</h3>
                            <p id="storyDesc">Traditional techniques passed down through generations</p>
                            <div class="story-badge" id="storyBadge">Heritage</div>
                        </div>
                    </div>
                    <div class="story-dots">
                        <button class="dot active" onclick="changeStory(0)"></button>
                        <button class="dot" onclick="changeStory(1)"></button>
                        <button class="dot" onclick="changeStory(2)"></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="scroll-indicator">
            <div class="scroll-line"></div>
            <span>Discover our story</span>
        </div>
    </section>

    <!-- Vision & Mission Section -->
    <section class="vision-mission" id="vision">
        <div class="container">
            <div class="section-header">
                <div class="section-badge">Our Purpose</div>
                <h2 class="section-title">Vision & Mission</h2>
                <p class="section-description">
                    Bridging the timeless beauty of ancient Egyptian heritage with contemporary artistry, 
                    creating exceptional pieces that tell stories of eternal legacy.
                </p>
            </div>
            
            <div class="vm-grid">
                <div class="vm-card vision-card">
                    <div class="vm-icon">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    </div>
                    <div class="vm-content">
                        <h3 class="vm-title">Our Vision</h3>
                        <p class="vm-description">
                            To be internationally recognized as a leading brand that bridges the beauty of ancient Egyptian heritage with contemporary artistry, inspiring the world to embrace timeless craftsmanship in their daily lives
                        </p>
                    </div>
                </div>

                <div class="vm-card mission-card">
                    <div class="vm-icon">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88"></polygon>
                        </svg>
                    </div>
                    <div class="vm-content">
                        <h3 class="vm-title">Our Mission</h3>
                        <p class="vm-description">
                            At The Egyptian Creativity, we bring history to life by crafting exceptional, authentic replicas and artistic creations inspired by ancient Egypt. Through meticulous attention to detail, unparalleled precision, and a passion for heritage, we transform historical art into versatile pieces that enrich modern living, making history accessible and meaningful for every collector, traveler, and enthusiast worldwide
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Our Story Section -->
    <section class="our-story" id="story">
        <div class="container">
            <div class="story-content">
                <div class="story-text">
                    <div class="section-badge">Our Journey</div>
                    <h2 class="section-title">The Egyptian Creativity Story</h2>
                    <p class="story-description">
                        Founded in 1999 by master craftsman Ahmed Hassan, Egyptian Creativity began as a small 
                        workshop in the heart of Cairo. What started as a passion for preserving ancient Egyptian 
                        artistry has grown into an internationally recognized brand.
                    </p>
                    <div class="story-features">
                        <div class="feature">
                            <div class="feature-icon">🏺</div>
                            <div class="feature-content">
                                <h4>Authentic Craftsmanship</h4>
                                <p>Traditional techniques and materials sourced from Egypt</p>
                            </div>
                        </div>
                        <div class="feature">
                            <div class="feature-icon">✨</div>
                            <div class="feature-content">
                                <h4>Museum Quality</h4>
                                <p>Each piece meets international museum standards</p>
                            </div>
                        </div>
                        <div class="feature">
                            <div class="feature-icon">🌍</div>
                            <div class="feature-content">
                                <h4>Global Recognition</h4>
                                <p>Trusted by collectors and museums worldwide</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="story-visual">
                    <div class="visual-grid">
                        <div class="visual-item large">
                            <img src="images/5-1 (1).jpg" alt="Ancient workshop">
                        </div>
                        <div class="visual-item">
                            <img src="images/5-3.jpg" alt="Crafting process">
                        </div>
                        <div class="visual-item">
                            <img src="images/9-1.jpg" alt="Finished masterpiece">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Our Greatest Works Section -->
    <section class="greatest-works" id="greatest-works">
        <div class="container">
            <div class="section-header">
                <div class="section-badge">Our Greatest Works</div>
                <h2 class="section-title">Masterpiece Collections</h2>
                <p class="section-description">
                    Explore our most celebrated creations, each piece representing the pinnacle of Egyptian artistry 
                    and contemporary craftsmanship.
                </p>
            </div>
            <div class="masterpieces-carousel" id="masterpiecesCarousel">
                <div class="masterpieces-track">
                    <?php foreach ($masterpieces as $mp): ?>
                        <div class="masterpiece-card">
                            <div class="masterpiece-image">
                                <img src="<?php echo htmlspecialchars($mp['image'] ?? 'images/placeholder.jpg'); ?>" alt="<?php echo htmlspecialchars($mp['title']); ?>" loading="lazy">
                                <div class="masterpiece-overlay"></div>
                            </div>
                            <div class="masterpiece-info">
                                <h3 class="masterpiece-title"><?php echo htmlspecialchars($mp['title']); ?></h3>
                                <p class="masterpiece-description"><?php echo htmlspecialchars($mp['description']); ?></p>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
    </section>

    <!-- Values Section -->
    <section class="values" id="values">
        <div class="container">
            <div class="section-header">
                <div class="section-badge">Our Values</div>
                <h2 class="section-title">What Drives Us</h2>
                <p class="section-description">
                    The principles that guide our craftsmanship and dedication to preserving ancient Egyptian heritage 
                    while creating contemporary masterpieces.
                </p>
            </div>
            
            <div class="values-grid" id="valuesGrid">
                <div class="value-card">
                    <h4 class="value-title">Authenticity</h4>
                    <p class="value-description">Looking at symbols and their meanings, as well as ancient Egyptian.</p>
                </div>
                <div class="value-card">
                    <h4 class="value-title">Passion</h4>
                    <p class="value-description">Ancient Egyptian god and goddesses and their special powers</p>
                </div>
                <div class="value-card">
                    <h4 class="value-title">Innovation</h4>
                    <p class="value-description">The Egyptian Creativity is a brand that redefines the connection between ancient Egyptian artistry and contemporary living. This document outlines a comprehensive marketing strategy designed to enhance brand awareness.</p>
                </div>
                <div class="value-card">
                    <h4 class="value-title">Community</h4>
                    <p class="value-description">Establishing credibility and enhancing</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Team Section -->
    <section class="team" id="team">
        <div class="container">
            <div class="section-header">
                <div class="section-badge">Master Craftsmen</div>
                <h2 class="section-title">Our Artisan Team</h2>
                <p class="section-description">
                    Meet the skilled artisans who bring ancient Egyptian artistry to life with modern precision 
                    and unwavering dedication to authenticity.
                </p>
            </div>
            <div class="team-grid" id="teamGrid">
                <?php foreach ($team_members as $member): ?>
                    <div class="team-card">
                        <div class="team-avatar">
                            <?php
                            $avatar = $member['avatar'];
                            $is_image = $avatar && (strpos($avatar, '/') !== false || preg_match('/\.(jpg|jpeg|png|gif)$/i', $avatar));
                            ?>
                            <?php if ($is_image): ?>
                                <img src="<?php echo htmlspecialchars($avatar); ?>" alt="<?php echo htmlspecialchars($member['name']); ?>">
                            <?php else: ?>
                                <div class="avatar-placeholder"><?php echo htmlspecialchars($avatar ?: strtoupper(substr($member['name'], 0, 2))); ?></div>
                            <?php endif; ?>
                        </div>
                        <div class="team-info">
                            <h3 class="team-name"><?php echo htmlspecialchars($member['name']); ?></h3>
                            <div class="team-role"><?php echo htmlspecialchars($member['role']); ?></div>
                            <p class="team-bio"><?php echo htmlspecialchars($member['bio']); ?></p>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer" id="contact">
        <div class="container">
            <div class="footer-content">
                <div class="footer-brand">
                    <div class="footer-logo">
                        <img src="images/logo_-removebg-preview.png" alt="Logo" style="height:64px;width:180px;object-fit:contain;border-radius:8px;display:block;" />
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
    <script src="js/sidebar-utils.js"></script>
    <script src="js/script.js"></script>

    <script src="js/about-script.js"></script>
    <script src="js/auth-manager.js"></script>
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
</body>
</html>