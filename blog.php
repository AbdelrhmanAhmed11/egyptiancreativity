<?php include 'includes/db.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog - Egyptian Creativity | Ancient Wisdom & Modern Stories</title>
    <meta name="description" content="Explore ancient Egyptian history, culture, and timeless wisdom through our carefully curated articles">
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="images/go3ran_.png">
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="css/blog-styles.css">
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
                <a href="blog.php" class="nav-link active">BLOGS</a>
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
                <h3>Search Articles</h3>
                <button class="modal-close" id="searchClose">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="search-input-container">
                <input type="text" class="search-input" placeholder="Search for articles..." id="searchInput">
                <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                </svg>
            </div>
            <div class="search-suggestions">
                <div class="suggestion-item">Ancient Egyptian Queens</div>
                <div class="suggestion-item">Tutankhamun Artifacts</div>
                <div class="suggestion-item">Egyptian Mythology</div>
                <div class="suggestion-item">Hieroglyphics</div>
            </div>
        </div>
    </div>

    <!-- Hero Section -->
    <section class="hero" id="home">
        <div class="hero-content">
            <div class="hero-text">
                <div class="hero-badge">
                    ✨ Ancient Wisdom & Modern Stories
                </div>
                <h1 class="hero-title">
                    <span class="line">Discover the</span>
                    <span class="line golden">Secrets of</span>
                    <span class="line">Ancient Egypt</span>
                </h1>
                <p class="hero-description">
                    Explore fascinating stories, historical insights, and timeless wisdom from the land of the pharaohs. 
                    Our carefully curated articles bring ancient Egyptian culture to life.
                </p>
                <div class="hero-buttons">
                    <button class="btn btn-primary" id="exploreBtn">
                        Explore Articles
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    </button>
                    <button class="btn btn-secondary" id="categoriesBtn">
                        Browse Categories
                    </button>
                </div>
                <div class="hero-stats">
                    <div class="stat">
                        <div class="stat-number">100+</div>
                        <div class="stat-label">Articles</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number">5K+</div>
                        <div class="stat-label">Readers</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number">Weekly</div>
                        <div class="stat-label">Updates</div>
                    </div>
                </div>
            </div>
            <div class="hero-visual">
                <div class="featured-blog">
                    <div class="blog-showcase">
                        <div class="blog-image">
                            <img src="images/5-1.jpg" alt="Featured Article" id="showcaseImage">
                        </div>
                        <div class="blog-info">
                            <h3 id="showcaseTitle">The Queens of Ancient Egypt</h3>
                            <p id="showcaseDesc">Legacies of Power and Beauty</p>
                            <div class="blog-category" id="showcaseCategory">Featured Article</div>
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

    <!-- Featured Article -->
    <?php
    // Fetch blog posts (no joins, just use image and author fields)
    $blog_posts = [];
    $sql = "SELECT * FROM blog_posts WHERE status = 'published' ORDER BY published_at DESC, created_at DESC";
    $stmt = $pdo->query($sql);
    while ($row = $stmt->fetch()) {
        $blog_posts[] = $row;
    }
    // Find the most recent featured blog post
    $featured_blog = null;
    foreach ($blog_posts as $post) {
        if (!empty($post['featured'])) {
            $featured_blog = $post;
            break;
        }
    }
    if (!$featured_blog && count($blog_posts) > 0) {
        $featured_blog = $blog_posts[0]; // fallback to latest
    }
    ?>
    <section class="featured-article" id="featured">
        <div class="container">
            <div class="section-header">
                <div class="section-badge">Featured Story</div>
                <h2 class="section-title">Ancient Wisdom for Modern Times</h2>
                <p class="section-description">
                    Dive deep into the most captivating stories from ancient Egypt, 
                    where history meets mystery and wisdom transcends time.
                </p>
            </div>
            <?php if ($featured_blog): ?>
            <div class="featured-content">
                <div class="featured-image">
                    <img src="<?php echo htmlspecialchars($featured_blog['image'] ?: 'images/blogs/placeholder.jpg'); ?>" alt="<?php echo htmlspecialchars($featured_blog['title']); ?>" loading="lazy">
                    <div class="featured-overlay">
                        <div class="featured-category">Featured</div>
                    </div>
                </div>
                <div class="featured-text">
                    <h2 class="featured-title"><?php echo htmlspecialchars($featured_blog['title']); ?></h2>
                    <div class="featured-meta">
                        <span class="meta-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <?php echo htmlspecialchars($featured_blog['author'] ?: '-'); ?>
                        </span>
                        <span class="meta-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12,6 12,12 16,14"></polyline>
                            </svg>
                            <!-- Optionally add read time here -->
                        </span>
                        <span class="meta-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"></path>
                            </svg>
                            <?php echo $featured_blog['published_at'] ? date('M d, Y', strtotime($featured_blog['published_at'])) : date('M d, Y', strtotime($featured_blog['created_at'])); ?>
                        </span>
                    </div>
                    <p class="featured-description"><?php echo htmlspecialchars($featured_blog['excerpt']); ?></p>
                    <a href="blog-details.php?id=<?php echo $featured_blog['id']; ?>" class="read-more-btn">
                        <span>Read Full Article</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12,5 19,12 12,19"></polyline>
                        </svg>
                    </a>
                </div>
            </div>
            <?php endif; ?>
        </div>
    </section>

    <!-- Filter Section -->
    <section class="filter-section" id="filters">
        <div class="container">
            <div class="filter-header">
                <div class="section-badge">Browse Articles</div>
                <h2 class="section-title">Stories by Category</h2>
                <p class="section-description">
                    Explore our collection of articles organized by topics that fascinate and educate.
                </p>
            </div>
            
            <div class="search-container">
                <div class="search-box">
                    <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <input type="text" id="blogSearchInput" placeholder="Search articles..." class="search-input">
                    <div class="input-glow"></div>
                </div>
            </div>
        </div>
    </section>

    <!-- Articles Grid Section -->
    <?php
    // Fetch all published blog posts
    $blog_posts = [];
    $sql = "SELECT * FROM blog_posts WHERE status = 'published' ORDER BY published_at DESC, created_at DESC";
    $stmt = $pdo->query($sql);
    while ($row = $stmt->fetch()) {
        $blog_posts[] = $row;
    }
    // Pagination logic
    $per_page = 6;
    $total_blogs = count($blog_posts);
    $total_pages = ceil($total_blogs / $per_page);
    $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
    $start = ($page - 1) * $per_page;
    $blogs_to_show = array_slice($blog_posts, $start, $per_page);
    ?>
    <section class="articles-section" id="articles">
        <div class="container">
            <div class="articles-grid" id="articlesGrid">
                <?php if (count($blogs_to_show) > 0): ?>
                    <?php foreach ($blogs_to_show as $post): ?>
                        <article class="article-card" data-id="<?php echo $post['id']; ?>">
                            <div class="card-image">
                                <img src="<?php echo htmlspecialchars($post['image'] ?: 'images/blogs/placeholder.jpg'); ?>" alt="<?php echo htmlspecialchars($post['title']); ?>" loading="lazy">
                                <div class="card-overlay"></div>
                            </div>
                            <div class="card-content">
                                <div class="card-meta">
                                    <span class="card-date"><?php echo $post['published_at'] ? date('M d, Y', strtotime($post['published_at'])) : date('M d, Y', strtotime($post['created_at'])); ?></span>
                                    <span class="card-author">By <?php echo htmlspecialchars($post['author'] ?: '-'); ?></span>
                                </div>
                                <h3 class="card-title"><?php echo htmlspecialchars($post['title']); ?></h3>
                                <p class="card-excerpt"><?php echo htmlspecialchars($post['excerpt']); ?></p>
                                <a href="blog-details.php?id=<?php echo $post['id']; ?>" class="card-link">
                                    <span>Read More</span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12,5 19,12 12,19"></polyline>
                                    </svg>
                                </a>
                            </div>
                        </article>
                    <?php endforeach; ?>
                <?php else: ?>
                    <div style="color:#fff;font-size:1.2rem;text-align:center;padding:2rem;">No blog posts found.</div>
                <?php endif; ?>
            </div>
            <div class="pagination-bar" style="display: flex; justify-content: center; align-items: center; gap: 12px; margin-top: 32px;">
                <?php if ($page > 1): ?>
                    <a href="?page=<?php echo $page-1; ?>" class="pagination-btn">&lt; Previous</a>
                <?php else: ?>
                    <span class="pagination-btn disabled">&lt; Previous</span>
                <?php endif; ?>
                <?php for ($i = 1; $i <= $total_pages; $i++): ?>
                    <?php if ($i == $page): ?>
                        <span class="pagination-btn active"><?php echo $i; ?></span>
                    <?php else: ?>
                        <a href="?page=<?php echo $i; ?>" class="pagination-btn"><?php echo $i; ?></a>
                    <?php endif; ?>
                <?php endfor; ?>
                <?php if ($page < $total_pages): ?>
                    <a href="?page=<?php echo $page+1; ?>" class="pagination-btn">Next &gt;</a>
                <?php else: ?>
                    <span class="pagination-btn disabled">Next &gt;</span>
                <?php endif; ?>
            </div>
        </div>
    </section>
    <style>
    .pagination-bar { margin-top: 32px; }
    .pagination-btn { display: inline-block; min-width: 48px; padding: 10px 22px; border-radius: 24px; background: rgba(255,255,255,0.08); color: #fff; font-weight: 600; font-size: 1.1rem; text-align: center; text-decoration: none; border: 2px solid #eac85b; margin: 0 4px; transition: background 0.2s, color 0.2s, border 0.2s; cursor: pointer; }
    .pagination-btn.active { background: #ffe066; color: #222; border-color: #ffe066; box-shadow: 0 2px 8px rgba(234,200,91,0.15); }
    .pagination-btn.disabled { opacity: 0.5; cursor: not-allowed; border-color: #eac85b; }
    .pagination-btn:hover:not(.active):not(.disabled) { background: #eac85b; color: #222; border-color: #eac85b; }
    </style>

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

    <!-- Footer -->
    <footer class="footer" id="contact">
        <div class="container">
            <div class="footer-content">
                <div class="footer-brand">
                    <div class="footer-logo">
                        <img src="images/logo_-removebg-preview.png" alt="Logo" style="height:100px;width:250px;object-fit:contain;border-radius:8px;" />
                    </div>
                    <p class="footer-description">
                        Preserving the timeless artistry of ancient Egypt through contemporary luxury craftsmanship and storytelling.
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
    <script src="js/blog-script.js"></script>
    <script src="js/sidebar-utils.js"></script>
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