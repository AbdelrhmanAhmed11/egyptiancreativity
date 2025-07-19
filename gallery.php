<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gallery | Egyptian Creativity - Ancient Artifacts Collection</title>
    <meta name="description" content="Browse our stunning gallery of Egyptian artifacts and ancient treasures.">
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="images/go3ran_.png">
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="css/gallery-styles.css">
    <link rel="stylesheet" href="css/sidebar-styles.css">
    <style>
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}
</style>

</head>
<body>
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

    <!-- Header -->
    <header class="header" id="header">
        <div class="header-container">
            <a href="index.php" class="logo">
                <img src="images/logo_-removebg-preview.png" alt="Logo" style="height:100px;width:250px;object-fit:contain;border-radius:8px;" />
            </a>
            
            <nav class="nav-menu" id="navMenu">
                <a href="index.php" class="nav-link">HOME</a>
                <a href="about.php" class="nav-link">ABOUT US</a>
                <a href="gallery.php" class="nav-link active">GALLERY</a>
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

    <!-- Search Modal -->
    <div class="search-modal" id="searchModal">
        <div class="modal-backdrop" id="searchBackdrop"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Search Gallery</h3>
                <button class="modal-close" id="searchClose">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="search-input-container">
                <input type="text" class="search-input" placeholder="Search artifacts..." id="searchInput">
                <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                </svg>
            </div>
            <div class="search-suggestions">
                <div class="suggestion-item">Pharaoh Masks</div>
                <div class="suggestion-item">Sacred Jewelry</div>
                <div class="suggestion-item">Ancient Decorations</div>
                <div class="suggestion-item">Treasure Boxes</div>
            </div>
        </div>
    </div>

    <!-- Product Preview Modal -->
    <div class="product-preview-modal" id="productPreviewModal">
        <div class="modal-backdrop" id="productPreviewBackdrop"></div>
        <div class="modal-content product-preview-content">
            <button class="modal-close product-preview-close" id="productPreviewClose">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
            
            <div class="product-preview-container">
                <!-- Left Section - Product Image -->
                <div class="product-preview-image-section">
                    <div class="product-image-container">
                        <img src="" alt="Product Image" id="previewProductImage" class="preview-product-image">
                        <div class="product-watermark">
                            <div class="watermark-text">
                                <div class="watermark-main">THE EGYPTIAN CREATIVITY</div>
                                <div class="watermark-sub">EGYPTIAN REPLICA ANTIQUE</div>
                            </div>
                            <div class="watermark-icon">𓂀</div>
                        </div>
                        <button class="image-nav-btn image-prev" id="imagePrev">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="15,18 9,12 15,6"></polyline>
                            </svg>
                        </button>
                        <button class="image-nav-btn image-next" id="imageNext">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9,18 15,12 9,6"></polyline>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <!-- Right Section - Product Details -->
                <div class="product-preview-details-section">
                    <div class="product-category-tag" id="previewProductCategory">JEWELRY</div>
                    <h2 class="product-preview-title" id="previewProductTitle">EYE OF HORUS RING</h2>
                    <p class="product-preview-description" id="previewProductDescription">
                        Sacred Eye of Horus ring crafted in gold and turquoise, symbolizing protection and royal power.
                    </p>
                    
                    <div class="product-specifications" id="previewProductSpecs">
                        <div class="spec-item">
                            <span class="spec-label">Materials:</span>
                            <span class="spec-value">Sterling Silver, Gold Plating, Turquoise Inlay</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Sizes:</span>
                            <span class="spec-value">Available in all sizes</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Weight:</span>
                            <span class="spec-value">12g</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Symbolism:</span>
                            <span class="spec-value">Protection and Divine Power</span>
                        </div>
                    </div>
                    
                    <div class="product-preview-actions">
                        <button class="action-btn add-to-cart-btn" id="previewAddToCart">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <path d="M16 10a4 4 0 0 1-8 0"></path>
                            </svg>
                            ADD TO CART
                        </button>
                        <button class="action-btn add-to-wishlist-btn" id="previewAddToWishlist">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            ADD TO WISHLIST
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Hero Section -->
    <section class="hero" id="home">
        <div class="hero-content">
            <div class="hero-text">
                <div class="hero-badge">
                    ✨ Timeless Egyptian Artistry
                </div>
                <h1 class="hero-title">
                    <span class="line">Gallery of</span>
                    <span class="line golden">Ancient</span>
                    <span class="line">Wonders</span>
                </h1>
                <p class="hero-description">
                    Discover our exquisite collection of authentic Egyptian replicas, each piece meticulously 
                    crafted to honor the sacred traditions of ancient artisans and bring timeless beauty into your modern life.
                </p>
                <div class="hero-buttons">
                    <button class="btn btn-primary" id="exploreBtn">
                        Explore Collection
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    </button>
                    <button class="btn btn-secondary" id="heritageBtn">
                        Our Heritage
                    </button>
                </div>
                <div class="hero-stats">
                    <div class="stat">
                        <div class="stat-number">200+</div>
                        <div class="stat-label">Gallery Items</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number">8</div>
                        <div class="stat-label">Categories</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number">100%</div>
                        <div class="stat-label">Authentic</div>
                    </div>
                </div>
            </div>
            <div class="hero-visual">
                <div class="featured-gallery">
                    <div class="gallery-showcase">
                        <div class="showcase-image">
                            <img src="images/1-7-scaled.jpg" alt="Featured Gallery Item" id="showcaseImage">
                        </div>
                        <div class="showcase-info">
                            <h3 id="showcaseTitle">Golden Pharaoh Collection</h3>
                            <p id="showcaseDesc">Exquisite artifacts from the golden age</p>
                            <div class="showcase-category" id="showcaseCategory">Featured Collection</div>
                        </div>
                    </div>
                    <div class="showcase-dots">
                        <button class="dot active" onclick="changeShowcase(0)"></button>
                        <button class="dot" onclick="changeShowcase(1)"></button>
                        <button class="dot" onclick="changeShowcase(2)"></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="scroll-indicator">
            <div class="scroll-line"></div>
            <span>Scroll to explore</span>
        </div>
    </section>

    <!-- Filter Section -->
    <section class="filter-section" id="filters">
        <div class="container">
            <div class="filter-header">
                <div class="section-badge">Our Collection</div>
                <h2 class="section-title">Masterpieces by Category</h2>
                <p class="section-description">
                    Browse our carefully curated collection of authentic Egyptian artifacts, 
                    organized by category for your convenience.
                </p>
            </div>
            
            <div class="filter-buttons" id="filterButtons">
                <!-- Filter buttons populated by JavaScript -->
            </div>
            
            <div class="search-container">
                <div class="search-box">
                    <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <input type="text" id="gallerySearchInput" placeholder="Search artifacts..." class="search-input">
                    <div class="input-glow"></div>
                </div>
            </div>
        </div>
    </section>

    <!-- Gallery Grid Section -->
    <?php
    include 'includes/db.php';
    // Fetch all gallery items
    $gallery_items = [];
    $stmt = $pdo->query("SELECT * FROM gallery_items ORDER BY created_at DESC");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $gallery_items[] = $row;
    }
    ?>
    <section class="gallery-grid-section" id="gallery">
        <div class="container">
            <div class="gallery-grid" id="galleryGrid">
                <?php foreach (
                    $gallery_items as $item): ?>
                    <div class="gallery-item" data-id="<?php echo htmlspecialchars($item['id']); ?>">
                        <div class="gallery-item-image">
                            <img src="<?php echo htmlspecialchars($item['image']); ?>" alt="<?php echo htmlspecialchars($item['title']); ?>" loading="lazy" />
                            <div class="gallery-item-overlay"></div>
                            <div class="gallery-item-category"><?php echo htmlspecialchars($item['category']); ?></div>
                            <div class="gallery-item-actions">
                                <button class="gallery-action-btn view-btn" title="Quick View" onclick="openProductPreview(<?php echo $item['id']; ?>)">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                </button>
                                <button class="gallery-action-btn add-to-wishlist-btn" title="Add to Wishlist" onclick="addToWishlist(<?php echo $item['id']; ?>)">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
            <!-- Load More button can be handled with PHP pagination or AJAX if needed -->
        </div>
    </section>

    <!-- Lightbox Modal -->
    <div class="lightbox-overlay" id="lightboxOverlay">
        <div class="lightbox-container">
            <button class="lightbox-close" id="lightboxClose">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
            <div class="lightbox-content">
                <div class="lightbox-image-container">
                    <img id="lightboxImage" src="" alt="" class="lightbox-image">
                    <div class="lightbox-nav">
                        <button class="lightbox-prev" id="lightboxPrev">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="15,18 9,12 15,6"></polyline>
                            </svg>
                        </button>
                        <button class="lightbox-next" id="lightboxNext">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9,18 15,12 9,6"></polyline>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="lightbox-info">
                    <div class="lightbox-category" id="lightboxCategory"></div>
                    <h3 class="lightbox-title" id="lightboxTitle"></h3>
                    <p class="lightbox-description" id="lightboxDescription"></p>
                    <div class="lightbox-details" id="lightboxDetails"></div>
                    <div class="lightbox-actions">
                        <button class="btn btn-primary" id="lightboxAddToCart">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <path d="M16 10a4 4 0 0 1-8 0"></path>
                            </svg>
                            <span>Add to Cart</span>
                        </button>
                        <button class="btn btn-secondary" id="lightboxAddToWishlist">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            <span>Add to Wishlist</span>
                        </button>
                    </div>
                </div>
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

    <!-- Notification Container -->
    <div class="notification-container" id="notificationContainer"></div>

    <script src="js/auth-manager.js"></script>
    <script src="js/script.js"></script>

    <script src="js/sidebar-utils.js"></script>
    <script src="js/products-data.js"></script>
    <script src="js/gallery-script.js"></script>
</body>
</html>