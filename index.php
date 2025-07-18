<?php
include 'includes/db.php';

// AJAX handler for newsletter subscription
if (
    isset($_SERVER['HTTP_X_REQUESTED_WITH']) &&
    strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest' &&
    isset($_POST['subscribe_email'])
) {
    $email = trim($_POST['subscribe_email']);
    $response = ['success' => false, 'message' => ''];
    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $stmt = $pdo->prepare("INSERT IGNORE INTO newsletter_subscriptions (email, status, subscribed_at) VALUES (?, 'subscribed', NOW())");
        if ($stmt->execute([$email])) {
            $response['success'] = true;
            $response['message'] = 'Thank you for subscribing to Egyptian Creativity!';
        } else {
            $response['message'] = 'Subscription failed. Please try again.';
        }
    } else {
        $response['message'] = 'Please enter a valid email address.';
    }
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}

// Fetch featured product (latest)
$featured = null;
$featured_sql = "SELECT * FROM products ORDER BY created_at DESC LIMIT 1";
$featured_stmt = $pdo->query($featured_sql);
$featured = $featured_stmt->fetch();

// Fetch products for collection (limit 6 for homepage)
$products_result = null;
$products_sql = "SELECT * FROM products ORDER BY created_at DESC LIMIT 6";
$products_result = $pdo->query($products_sql);

// Fetch featured blog post
$featured_blog = null;
$other_blogs = [];
$blog_sql = "SELECT * FROM blog_posts WHERE status = 'published' ORDER BY featured DESC, published_at DESC, created_at DESC LIMIT 6";
$blog_stmt = $pdo->query($blog_sql);
while ($row = $blog_stmt->fetch()) {
    if ($row['featured'] && !$featured_blog) {
        $featured_blog = $row;
    } else {
        $other_blogs[] = $row;
    }
}
// Only show 2 other blogs after the featured
$other_blogs = array_slice($other_blogs, 0, 2);

function get_blog_image($img) {
    if (!$img) return 'images/blogs/placeholder.jpg';
    if (strpos($img, 'images/') === 0 && file_exists($img)) return $img;
    if (file_exists('images/blogs/' . $img)) return 'images/blogs/' . $img;
    return 'images/blogs/placeholder.jpg';
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Egyptian Creativity | Luxury Ancient Artifacts Collection</title>
    <meta name="description"
        content="Discover authentic Egyptian artifacts, jewelry, and decorative items crafted by master artisans">

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="images/go3ran_.png">

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap"
        rel="stylesheet">

    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="css/sidebar-styles.css">
</head>

<body> <!-- Loading Screen -->
    <div class="loading-overlay" id="loadingOverlay">
        <div class="loading-content">
            <div class="loading-pyramid"> <img src="images/go3ran_.png" alt="Egyptian Creativity Loading"> </div>
            <div class="loading-text">Egyptian Creativity</div>
            <div class="loading-subtitle">Loading Ancient Wonders...</div>
            <div class="loading-progress">
                <div class="progress-bar"></div>
            </div> <button class="skip-btn" id="skipBtn">Skip</button>
        </div>
    </div>

    <!-- Animated Background (From Version 1) -->
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
                <img src="images/logo_-removebg-preview.png" alt="Logo"
                    style="height:100px;width:250px;object-fit:contain;border-radius:8px;" />
            </div>

            <nav class="nav-menu" id="navMenu">
                <a href="index.php" class="nav-link active">HOME</a>
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
                        <path
                            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z">
                        </path>
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
                    ✨ Authentic Egyptian Artifacts
                </div>
                <h1 class="hero-title">
                    <span class="line">Discover the</span>
                    <span class="line golden">Treasures of</span>
                    <span class="line">Ancient Egypt</span>
                </h1>
                <p class="hero-description">
                    Immerse yourself in the mystique of ancient Egypt with our exclusive collection
                    of handcrafted artifacts, each piece telling a story of pharaohs, gods, and eternal legacy.
                </p>
                <div class="hero-buttons">
                    <button class="btn btn-primary" id="exploreBtn">
                        Explore Collection
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
                    <button class="btn btn-secondary" id="learnBtn">
                        Learn More
                    </button>
                </div>
                <div class="hero-stats">
                    <div class="stat">
                        <div class="stat-number" data-target="500">0</div>
                        <div class="stat-label">Artifacts</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number" data-target="50">0</div>
                        <div class="stat-label">Countries</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number" data-target="25">0</div>
                        <div class="stat-label">Years</div>
                    </div>
                </div>
            </div>
            <div class="hero-visual">
                <div class="featured-product" id="featuredProduct">
                    <div class="product-showcase">
                        <div class="product-image">
                            <?php if ($featured): ?>
                                <img src="<?php echo htmlspecialchars($featured['product_image'] ?: 'images/products/placeholder.jpg'); ?>" alt="<?php echo htmlspecialchars($featured['name']); ?>" id="showcaseImage">
                            <?php else: ?>
                                <img src="images/products/placeholder.jpg" alt="Featured Product" id="showcaseImage">
                            <?php endif; ?>
                        </div>
                        <div class="product-info">
                            <h3 id="showcaseTitle"><?php echo $featured ? htmlspecialchars($featured['name']) : 'Golden Pharaoh Mask'; ?></h3>
                            <p id="showcaseDesc"><?php echo $featured ? htmlspecialchars($featured['description']) : 'Authentic 18th Dynasty ceremonial mask'; ?></p>
                        </div>
                    </div>
                    <div class="product-dots">
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

    <!-- Collection Section -->
    <section class="collection" id="collection">
        <div class="container">
            <div class="section-header">
                <div class="section-badge">Our Collection</div>
                <h2 class="section-title">Masterpieces of Ancient Egypt</h2>
                <p class="section-description">
                    Each artifact in our collection is carefully selected and authenticated,
                    representing the pinnacle of ancient Egyptian craftsmanship and artistry.
                </p>
            </div>

            <div class="collection-grid" id="collectionGrid">
                <?php if ($products_result && $products_result->rowCount() > 0): ?>
                    <?php while ($product = $products_result->fetch()): ?>
                        <div class="collection-item">
                            <div class="item-image">
                                <img src="<?php echo htmlspecialchars($product['product_image'] ?: 'images/products/placeholder.jpg'); ?>" alt="<?php echo htmlspecialchars($product['name']); ?>">
                                <div class="item-overlay">
                                    <div class="overlay-content">
                                        <h3><?php echo htmlspecialchars($product['name']); ?></h3>
                                        <p class="item-price">$<?php echo number_format($product['price'], 2); ?></p>
                                        <div class="item-actions">
                                            <button class="action-btn add-to-cart add-to-cart-btn" data-product-id="<?php echo (int)$product['id']; ?>">Add to Cart</button>
                                            <button class="action-btn add-to-wishlist" onclick="toggleWishlist(<?php echo (int)$product['id']; ?>)">&#9825;</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="item-info">
                                <span class="item-category">
                                    <?php
                                    // Fetch category name if possible
                                    if (!empty($product['category'])) {
                                        $cat_id = (int)$product['category'];
                                        $cat_name = '';
                                        $cat_stmt = $pdo->prepare("SELECT name FROM categories WHERE id = ?");
                                        $cat_stmt->execute([$cat_id]);
                                        $cat_row = $cat_stmt->fetch();
                                        if ($cat_row) {
                                            $cat_name = $cat_row['name'];
                                        }
                                        echo htmlspecialchars($cat_name);
                                    }
                                    ?>
                                </span>
                                <h3 class="item-title"><?php echo htmlspecialchars($product['name']); ?></h3>
                                <p class="item-description"><?php echo htmlspecialchars($product['description']); ?></p>
                            </div>
                        </div>
                    <?php endwhile; ?>
                <?php else: ?>
                    <p>No products found.</p>
                <?php endif; ?>
            </div>

            <div class="collection-footer">
                <button class="btn btn-outline" onclick="window.location.href='shop.php'">View All Collection</button>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section class="about" id="about">
        <div class="container">
            <div class="about-content">
                <div class="about-text">
                    <div class="section-badge">About Us</div>
                    <h2 class="section-title">Guardians of Ancient Heritage</h2>
                    <p class="about-description">
                        For over 25 years, Egyptian Creativity has been dedicated to preserving and sharing
                        the magnificent heritage of ancient Egypt. Our master craftsmen use traditional
                        techniques passed down through generations to create authentic replicas that capture
                        the essence of pharaonic artistry.
                    </p>
                    <div class="about-features">
                        <div class="feature">
                            <div class="feature-icon">🏺</div>
                            <div class="feature-content">
                                <h4>Authentic Craftsmanship</h4>
                                <p>Traditional techniques and materials</p>
                            </div>
                        </div>
                        <div class="feature">
                            <div class="feature-icon">✨</div>
                            <div class="feature-content">
                                <h4>Museum Quality</h4>
                                <p>Each piece meets museum standards</p>
                            </div>
                        </div>
                        <div class="feature">
                            <div class="feature-icon">🌍</div>
                            <div class="feature-content">
                                <h4>Global Recognition</h4>
                                <p>Trusted by collectors worldwide</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="about-visual">
                    <div class="visual-grid">
                        <div class="visual-item large">
                            <img src="images/4-5-scaled.jpg" alt="Craftsman at work">
                        </div>
                        <div class="visual-item">
                            <img src="images/5-1 (1).jpg" alt="Ancient tools">
                        </div>
                        <div class="visual-item">
                            <img src="images/5-3.jpg" alt="Finished artifacts">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Gallery Section -->
    <section class="gallery" id="gallery">
        <div class="container">
            <div class="section-header">
                <div class="section-badge">Gallery</div>
                <h2 class="section-title">Masterworks in Motion</h2>
                <p class="section-description">
                    Witness the beauty and craftsmanship of our collection through this curated gallery
                    showcasing the finest examples of Egyptian artistry.
                </p>
            </div>

            <div class="gallery-container">
                <div class="gallery-track" id="galleryTrack">
                    <div class="gallery-slide">
                        <img src="images/9-1.jpg" alt="Gallery Image 1">
                        <div class="slide-info">
                            <h3>Golden Pharaoh Mask</h3>
                            <p>Symbol of divine power and eternal rule</p>
                        </div>
                    </div>
                    <div class="gallery-slide">
                        <img src="images/10.jpg" alt="Gallery Image 2">
                        <div class="slide-info">
                            <h3>Sacred Scarab Amulets</h3>
                            <p>Protection and rebirth in the afterlife</p>
                        </div>
                    </div>
                    <div class="gallery-slide">
                        <img src="images/5-1 (1).jpg" alt="Gallery Image 3">
                        <div class="slide-info">
                            <h3>Royal Canopic Jars</h3>
                            <p>Guardians of the pharaoh's organs</p>
                        </div>
                    </div>
                </div>
                <div class="gallery-controls">
                    <button class="gallery-btn prev" id="galleryPrev">‹</button>
                    <button class="gallery-btn next" id="galleryNext">›</button>
                </div>
            </div>
        </div>
    </section>

    <!-- Blog Section -->
    <section class="blog" id="blog">
        <div class="container">
            <div class="section-header">
                <div class="section-badge">Latest Stories</div>
                <h2 class="section-title">Ancient Wisdom, Modern Insights</h2>
                <p class="section-description">
                    Explore the fascinating world of ancient Egypt through our curated articles
                    and discover the stories behind our magnificent artifacts.
                </p>
            </div>
            <div class="blog-grid">
                <?php if ($featured_blog): ?>
                    <article class="blog-card featured">
                        <div class="card-image">
                            <span class="card-badge">FEATURED</span>
                            <img src="<?php echo htmlspecialchars(get_blog_image($featured_blog['image'])); ?>" alt="<?php echo htmlspecialchars($featured_blog['title']); ?>">
                        </div>
                        <div class="card-content">
                            <div class="card-meta">
                                <span class="card-date"><?php echo $featured_blog['published_at'] ? date('M d, Y', strtotime($featured_blog['published_at'])) : ''; ?></span>
                            </div>
                            <h3 class="card-title"><?php echo htmlspecialchars($featured_blog['title']); ?></h3>
                            <p class="card-excerpt"><?php echo htmlspecialchars($featured_blog['excerpt']); ?></p>
                            <a href="blog-details.php?id=<?php echo $featured_blog['id']; ?>" class="card-link">Read More &rarr;</a>
                        </div>
                    </article>
                <?php endif; ?>
                <?php foreach ($other_blogs as $post): ?>
                    <article class="blog-card">
                        <div class="card-image">
                            <img src="<?php echo htmlspecialchars(get_blog_image($post['image'])); ?>" alt="<?php echo htmlspecialchars($post['title']); ?>">
                        </div>
                        <div class="card-content">
                            <div class="card-meta">
                                <span class="card-date"><?php echo $post['published_at'] ? date('M d, Y', strtotime($post['published_at'])) : ''; ?></span>
                            </div>
                            <h3 class="card-title"><?php echo htmlspecialchars($post['title']); ?></h3>
                            <p class="card-excerpt"><?php echo htmlspecialchars($post['excerpt']); ?></p>
                            <a href="blog-details.php?id=<?php echo $post['id']; ?>" class="card-link">Read More &rarr;</a>
                        </div>
                    </article>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials" id="testimonials">
        <div class="container">
            <div class="section-header">
                <div class="section-badge">Testimonials</div>
                <h2 class="section-title">What Our Collectors Say</h2>
                <p class="section-description">
                    Discover why collectors worldwide trust Egyptian Creativity for authentic artifacts and exceptional
                    craftsmanship.
                </p>
            </div>

            <div class="testimonials-container">
                <div class="testimonials-track" id="testimonialsTrack">
                    <!-- Testimonials will be loaded dynamically by script.js -->
                </div>
            </div>
        </div>
    </section>

    <!-- Newsletter Section -->
    <section class="newsletter">
        <div class="container">
            <div class="newsletter-content">
                <div class="newsletter-icon">𓊃</div>
                <h2 class="newsletter-title">Stay Connected with Ancient Wisdom</h2>
                <p class="newsletter-subtitle">Be the first to discover new collections and exclusive pieces</p>
                <form method="post" action="" class="newsletter-form" id="newsletterForm">
                    <div class="form-group">
                        <input type="email" name="subscribe_email" class="newsletter-input" placeholder="Enter your email address" required>
                        <button type="submit" class="btn btn-primary newsletter-btn">
                            Subscribe
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12,5 19,12 12,19"></polyline>
                            </svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </section>
    <script>
document.getElementById('newsletterForm').addEventListener('submit', function(e) {
    e.preventDefault();
    var form = this;
    var email = form.subscribe_email.value;
    fetch('', {
        method: 'POST',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        body: new URLSearchParams({ subscribe_email: email })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) form.reset();
        // No message shown
    })
    .catch(() => {
        // No message shown
    });
});
</script>

    <!-- Footer -->
    <footer class="footer" id="contact">
        <div class="container">
            <div class="footer-content">
                <div class="footer-brand">
                    <div class="footer-logo">
                        <img src="images/logo_-removebg-preview.png" alt="Logo"
                            style="height:64px;width:180px;object-fit:contain;border-radius:8px;display:block;" />
                    </div>
                    <p class="footer-description">
                        Preserving the timeless artistry of ancient Egypt through contemporary luxury craftsmanship.
                    </p>
                    <div class="social-links">
                        <a href="https://www.facebook.com/share/16Mhxajx4M/" class="social-link" target="_blank"
                            rel="noopener">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                            </svg>
                        </a>
                        <a href="https://www.instagram.com/theeg.creativity/" class="social-link" target="_blank"
                            rel="noopener">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                        </a>
                        <a href="https://pin.it/6BJJqdJQz" class="social-link" target="_blank" rel="noopener">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M12 8a4 4 0 0 0-1 7.87V21l2-2.87A4 4 0 1 0 12 8z"></path>
                            </svg>
                        </a>
                        <a href="https://www.tiktok.com/@theegptian.creativity?_t=ZS-8xwnWplmfO4&_r=1"
                            class="social-link" target="_blank" rel="noopener">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
                            </svg>
                        </a>
                        <a href="https://wa.me/201021322002" class="social-link" target="_blank" rel="noopener">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" />
                                <path
                                    d="M16.72 13.06c-.29-.14-1.7-.84-1.96-.94-.26-.1-.45-.14-.64.14-.19.28-.74.94-.91 1.13-.17.19-.34.21-.63.07-.29-.14-1.22-.45-2.33-1.43-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.59.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.64-1.54-.88-2.11-.23-.56-.47-.49-.64-.5-.17-.01-.36-.01-.56-.01-.19 0-.5.07-.76.36-.26.29-1 1.01-1 2.46 0 1.45 1.04 2.85 1.19 3.05.15.2 2.05 3.13 5.01 4.27.7.28 1.25.45 1.68.57.71.2 1.36.17 1.87.1.57-.08 1.7-.7 1.94-1.37.24-.67.24-1.25.17-1.37-.07-.12-.26-.19-.55-.33z" />
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
                        <li><a href="https://wa.me/201021322002" target="_blank" rel="noopener">+20 102 132 2002</a>
                        </li>
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
                <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2">
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
                <a class="btn btn-outline" href="wishlist.php">View Wishlist</a>
            </div>
        </div>
    </div>

    <?php include 'includes/sidebar.html'; ?>
    <script src="js/auth-manager.js"></script>
    <script src="js/sidebar-utils.js"></script>
    <script src="js/script.js"></script>
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