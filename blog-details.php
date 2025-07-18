<?php
include 'includes/db.php';
// Get blog id from URL
$blog_id = isset($_GET['id']) ? intval($_GET['id']) : 0;
$blog = null;
if ($blog_id) {
    $sql = "SELECT * FROM blog_posts WHERE id = ? AND status = 'published'";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$blog_id]);
    $blog = $stmt->fetch();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $blog ? htmlspecialchars($blog['title']) : 'Blog Not Found'; ?> - Egyptian Creativity</title>
    <meta name="description" content="<?php echo $blog ? htmlspecialchars($blog['excerpt']) : 'Blog post not found.'; ?>">
    <link rel="icon" type="image/png" href="images/go3ran_.png">
    <link rel="stylesheet" href="css/blog-details-styles.css">
    <link rel="stylesheet" href="css/sidebar-styles.css">
    <link rel="stylesheet" href="css/styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
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

    <!-- Header -->
    <header class="header" id="header">
        <div class="header-container">
            <div class="logo">
                <img src="images/logo_-removebg-preview.png" alt="Logo" style="height:100px;width:250px;object-fit:contain;border-radius:8px;" />
            </div>
            <nav class="nav-menu" id="navMenu">
                <a href="index.php" class="nav-link">HOME</a>
                <a href="about.php" class="nav-link">ABOUT US</a>
                <a href="gallery.php" class="nav-link">GALLERY</a>
                <a href="blog.php" class="nav-link active">BLOGS</a>
                <a href="shop.php" class="nav-link">SHOP</a>
                <a href="contact.php" class="nav-link">CONTACT</a>
                <?php session_start(); ?>
                <?php if (isset($_SESSION['user_id'])): ?>
                    <a href="logout.php" class="nav-link" id="loginLogoutBtn">LOGOUT</a>
                <?php else: ?>
                    <a href="auth.php" class="nav-link" id="loginLogoutBtn">LOGIN</a>
                <?php endif; ?>
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

    <!-- Blog Details Section -->
    <main class="blog-details-main">
        <div class="container">
            <?php if ($blog): ?>
                <article class="blog-article-card">
                    <!-- Blog Header -->
                    <header class="blog-article-header">
                        <div class="blog-meta-info">
                            <span class="blog-category-badge">ROYALTY & HISTORY</span>
                            <time class="blog-date-display"><?php echo $blog['published_at'] ? date('F j, Y', strtotime($blog['published_at'])) : date('F j, Y', strtotime($blog['created_at'])); ?></time>
                        </div>
                        <h1 class="blog-main-title"><?php echo htmlspecialchars($blog['title']); ?></h1>
                    </header>

                    <!-- Blog Hero Image -->
                    <div class="blog-hero-container">
                        <img src="<?php echo htmlspecialchars($blog['image'] ?: 'images/blogs/placeholder.jpg'); ?>" 
                             alt="<?php echo htmlspecialchars($blog['title']); ?>" 
                             class="blog-hero-img">
                        <div class="blog-brand-overlay">
                            <img src="images/logo_-removebg-preview.png" alt="Egyptian Creativity" class="brand-logo-overlay">
                        </div>
                    </div>

                    <!-- Blog Content -->
                    <div class="blog-content-section">
                        <div class="blog-excerpt">
                            <?php echo nl2br(htmlspecialchars($blog['excerpt'])); ?>
                        </div>
                        
                        <div class="blog-full-content">
                            <?php echo $blog['content']; ?>
                        </div>
                    </div>

                    <!-- Blog Actions -->
                    <footer class="blog-actions-footer">
                        <a href="blog.php" class="btn-back-to-blog">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="19" y1="12" x2="5" y2="12"></line>
                                <polyline points="12,19 5,12 12,5"></polyline>
                            </svg>
                            BACK TO BLOG
                        </a>
                        <button class="btn-share-article" onclick="shareArticle()">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                                <polyline points="16,6 12,2 8,6"></polyline>
                                <line x1="12" y1="2" x2="12" y2="15"></line>
                            </svg>
                            SHARE ARTICLE
                        </button>
                    </footer>
                </article>
            <?php else: ?>
                <div class="blog-not-found-container">
                    <div class="blog-not-found">
                        <h2>Blog Not Found</h2>
                        <p>The blog post you are looking for does not exist.</p>
                        <a href="blog.php" class="btn-back-to-blog">Back to Blog</a>
                    </div>
                </div>
            <?php endif; ?>
        </div>
    </main>

    <!-- Search Modal -->
    <div class="modal search-modal" id="searchModal">
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

    <?php include 'includes/sidebar.html'; ?>
    <script src="js/auth-manager.js"></script>

    <script src="js/sidebar-utils.js"></script>
    <script src="js/blog-details-script.js"></script>
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
                            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" />
                            <path d="M16.72 13.06c-.29-.14-1.7-.84-1.96-.94-.26-.1-.45-.14-.64.14-.19.28-.74.94-.91 1.13-.17.19-.34.21-.63.07-.29-.14-1.22-.45-2.33-1.43-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.59.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.64-1.54-.88-2.11-.23-.56-.47-.49-.64-.5-.17-.01-.36-.01-.56-.01-.19 0-.5.07-.76.36-.26.29-1 1.01-1 2.46 0 1.45 1.04 2.85 1.19 3.05.15.2 2.05 3.13 5.01 4.27.7.28 1.25.45 1.68.57.71.2 1.36.17 1.87.1.57-.08 1.7-.7 1.94-1.37.24-.67.24-1.25.17-1.37-.07-.12-.26-.19-.55-.33z" />
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
