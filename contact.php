<?php include 'includes/db.php'; 
// Start session for authentication 
session_start(); 

// Handle contact form submission 
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['contact_form'])) { 
    $name = trim($_POST['name'] ?? ''); 
    $email = trim($_POST['email'] ?? ''); 
    $subject = trim($_POST['subject'] ?? ''); 
    $message = trim($_POST['message'] ?? ''); 
    $response = ['success' => false, 'message' => '']; 
    
    if (empty($name) || empty($email) || empty($subject) || empty($message)) { 
        $response['message'] = 'Please fill in all fields.'; 
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) { 
        $response['message'] = 'Please enter a valid email address.'; 
    } else { 
        try { 
            $stmt = $pdo->prepare("INSERT INTO contact_messages (name, email, subject, message, sent_at) VALUES (?, ?, ?, ?, NOW())"); 
            if ($stmt->execute([$name, $email, $subject, $message])) { 
                $response['success'] = true; 
                $response['message'] = 'Thank you for your message! We will get back to you soon.'; 
            } else { 
                $response['message'] = 'Failed to send message. Please try again.'; 
            } 
        } catch (Exception $e) { 
            $response['message'] = 'An error occurred. Please try again.'; 
        } 
    } 
    header('Content-Type: application/json'); 
    echo json_encode($response); 
    exit; 
} 

// Handle newsletter subscription 
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['newsletter_email'])) { 
    $email = trim($_POST['newsletter_email'] ?? ''); 
    $response = ['success' => false, 'message' => '']; 
    
    if (filter_var($email, FILTER_VALIDATE_EMAIL)) { 
        try { 
            $stmt = $pdo->prepare("INSERT INTO newsletter_subscriptions (email, status, subscribed_at) VALUES (?, 'subscribed', NOW()) ON DUPLICATE KEY UPDATE status='subscribed', subscribed_at=NOW()"); 
            if ($stmt->execute([$email])) { 
                $response['success'] = true; 
                $response['message'] = 'Thank you for subscribing to our newsletter!'; 
            } else { 
                $response['message'] = 'Subscription failed. Please try again.'; 
            } 
        } catch (Exception $e) { 
            $response['message'] = 'An error occurred. Please try again.'; 
        } 
    } else { 
        $response['message'] = 'Please enter a valid email address.'; 
    } 
    header('Content-Type: application/json'); 
    echo json_encode($response); 
    exit; 
} 
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Us | Egyptian Creativity - Luxury Ancient Artifacts Collection</title>
    <meta name="description" content="Get in touch with Egyptian Creativity for inquiries about authentic Egyptian artifacts and luxury decorative items">
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="images/go3ran_.png">
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="css/contact-styles.css">
    <link rel="stylesheet" href="css/sidebar-styles.css">
</head>
<body>
    <?php if (isset($skip_loading) && $skip_loading): ?>
    <script>window.skipContactLoading = true;</script>
    <?php endif; ?>

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
                <a href="contact.php" class="nav-link active">CONTACT</a>
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
    <section class="hero-contact">
        <div class="hero-content">
            <div class="hero-ornaments">
                <div class="ornament left">𓂀</div>
                <div class="ornament right">𓋹</div>
            </div>
            <div class="hero-text-center">
                <div class="hero-badge">
                    ✨ Connect with Ancient Wisdom
                </div>
                <h1 class="hero-title">
                    <span class="line">Reach Out to</span>
                    <span class="line golden">Egyptian Creativity</span>
                    <span class="line">Masters</span>
                </h1>
                <p class="hero-description">
                    We're here to guide you through our collection of authentic Egyptian artifacts and answer any questions about our ancient treasures.
                </p>
                <div class="hero-stats">
                    <div class="stat">
                        <div class="stat-number">24/7</div>
                        <div class="stat-label">Support</div>
                    </div>
                    <div class="stat-divider">𓊃</div>
                    <div class="stat">
                        <div class="stat-number">48h</div>
                        <div class="stat-label">Response</div>
                    </div>
                    <div class="stat-divider">𓊃</div>
                    <div class="stat">
                        <div class="stat-number">100%</div>
                        <div class="stat-label">Satisfaction</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="scroll-indicator">
            <div class="scroll-line"></div>
            <span>Connect with us</span>
        </div>
    </section>

    <!-- Contact Section -->
    <section class="contact-section">
        <div class="container">
            <div class="contact-grid">
                <!-- Contact Information -->
                <div class="contact-info">
                    <div class="contact-card">
                        <div class="card-header">
                            <div class="card-ornament">𓊖</div>
                            <h3>Contact Information</h3>
                            <p>Reach out to us through any of these channels. Our master craftsmen and customer service team are here to assist you with any inquiries about our Egyptian creativity.</p>
                        </div>

                        <div class="contact-methods">
                            <div class="contact-method">
                                <div class="contact-method-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                                        <circle cx="12" cy="10" r="3"/>
                                    </svg>
                                </div>
                                <div class="contact-method-details">
                                    <h4>Sacred Location</h4>
                                    <p>Cairo, Egypt<br>Zamalek District, Nile Corniche<br>Near the Ancient Temples</p>
                                </div>
                            </div>

                            <div class="contact-method">
                                <div class="contact-method-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                    </svg>
                                </div>
                                <div class="contact-method-details">
                                    <h4>Sacred Hotline</h4>
                                    <p>+20 102 132 2002<br>+20 100 555 7890<br>WhatsApp Available</p>
                                </div>
                            </div>

                            <div class="contact-method">
                                <div class="contact-method-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect width="20" height="16" x="2" y="4" rx="2"/>
                                        <path d="m22 7-10 5L2 7"/>
                                    </svg>
                                </div>
                                <div class="contact-method-details">
                                    <h4>Digital Papyrus</h4>
                                    <p>info@egyptiantreasures.com<br>support@egyptiantreasures.com<br>orders@egyptiantreasures.com</p>
                                </div>
                            </div>

                            <div class="contact-method">
                                <div class="contact-method-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <circle cx="12" cy="12" r="10"/>
                                        <polyline points="12,6 12,12 16,14"/>
                                    </svg>
                                </div>
                                <div class="contact-method-details">
                                    <h4>Sacred Hours</h4>
                                    <p>Sunday - Thursday: 9:00 AM - 6:00 PM<br>Friday - Saturday: 10:00 AM - 4:00 PM<br>Egyptian Time (GMT+2)</p>
                                </div>
                            </div>
                        </div>

                        <div class="contact-social">
                            <h4>Follow Our Ancient Journey</h4>
                            <div class="social-links">
                                <a href="https://www.facebook.com/share/16Mhxajx4M/" class="social-btn" title="Facebook" target="_blank" rel="noopener">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                                    </svg>
                                </a>
                                <a href="https://www.instagram.com/theeg.creativity/" class="social-btn" title="Instagram" target="_blank" rel="noopener">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                                    </svg>
                                </a>
                                <a href="#" class="social-btn" title="Twitter">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                                    </svg>
                                </a>
                                <a href="#" class="social-btn" title="YouTube">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
                                        <path d="m10 15 5-3-5-3z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Contact Form -->
                <div class="contact-form-container">
                    <div class="contact-form-card">
                        <div class="card-header">
                            <div class="card-ornament">𓈖</div>
                            <h3>Send Sacred Message</h3>
                            <p>Share your inquiries about our ancient treasures. Our master craftsmen and experts will respond with the wisdom of the pharaohs.</p>
                        </div>
                        
                        <form id="contactForm" class="contact-form" method="post" action="contact.php">
                            <input type="hidden" name="contact_form" value="1">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="name">Sacred Name *</label>
                                    <input type="text" id="name" name="name" class="form-input" placeholder="Your honored name" required>
                                </div>
                                
                                <div class="form-group">
                                    <label for="email">Digital Papyrus *</label>
                                    <input type="email" id="email" name="email" class="form-input" placeholder="your.email@domain.com" required>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="phone">Sacred Hotline</label>
                                    <input type="tel" id="phone" name="phone" class="form-input" placeholder="+20 100 000 0000">
                                </div>
                                
                                <div class="form-group">
                                    <label for="subject">Inquiry Purpose *</label>
                                    <select id="subject" name="subject" class="form-input" required>
                                        <option value="">Choose your quest</option>
                                        <option value="general">General Wisdom</option>
                                        <option value="product">Artifact Information</option>
                                        <option value="order">Order Guidance</option>
                                        <option value="custom">Custom Creation</option>
                                        <option value="shipping">Sacred Delivery</option>
                                        <option value="return">Return & Exchange</option>
                                        <option value="wholesale">Wholesale Partnership</option>
                                        <option value="authentication">Authentication Services</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="message">Sacred Message *</label>
                                <textarea id="message" name="message" class="form-textarea" placeholder="Share your quest for ancient treasures, specific artifacts you seek, or how our master craftsmen can serve your needs..." rows="16" required></textarea>
                            </div>
                            
                            <button type="submit" class="submit-btn">
                                <span>Send Sacred Message</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12,5 19,12 12,19"></polyline>
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Sacred Map -->
            <div class="contact-map">
                <div class="map-header">
                    <div class="map-ornament">𓊪</div>
                    <h3>Find Our Sacred Workshop</h3>
                    <p>Located in the heart of Cairo, where ancient traditions meet modern craftsmanship</p>
                </div>
                <div class="map-container">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110502.76983794965!2d31.18390057654534!3d30.059558904459633!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583fa60b21beeb%3A0x79dfb296e8423bba!2sCairo%2C%20Cairo%20Governorate%2C%20Egypt!5e0!3m2!1sen!2sus!4v1686124582069!5m2!1sen!2sus" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                </div>
            </div>

            <!-- FAQ Section -->
            <div class="faq-section">
                <div class="section-header">
                    <div class="section-ornament">𓊖</div>
                    <h2>Ancient Wisdom & Answers</h2>
                    <p>Discover answers to the most common questions about our sacred treasures and services</p>
                </div>

                <div class="faq-list">
                    <div class="faq-item">
                        <div class="faq-question" data-faq-trigger>
                            <h3>How authentic are your Egyptian creativity?</h3>
                            <button class="faq-toggle" type="button">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="faq-icon-plus">
                                    <path d="M5 12h14"/>
                                    <path d="M12 5v14"/>
                                </svg>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="faq-icon-minus hidden">
                                    <path d="M5 12h14"/>
                                </svg>
                            </button>
                        </div>
                        <div class="faq-answer hidden">
                            <p>All our treasures are authentic replicas crafted by master Egyptian artisans using traditional techniques passed down through generations. Each piece is meticulously created using authentic materials and methods, capturing the true essence of ancient Egyptian artistry. We provide certificates of authenticity and detailed provenance with every purchase.</p>
                        </div>
                    </div>

                    <div class="faq-item">
                        <div class="faq-question" data-faq-trigger>
                            <h3>Do you ship your treasures worldwide?</h3>
                            <button class="faq-toggle" type="button">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="faq-icon-plus">
                                    <path d="M5 12h14"/>
                                    <path d="M12 5v14"/>
                                </svg>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="faq-icon-minus hidden">
                                    <path d="M5 12h14"/>
                                </svg>
                            </button>
                        </div>
                        <div class="faq-answer hidden">
                            <p>Yes, we carefully ship our sacred treasures to collectors worldwide. International shipping typically takes 7-14 business days depending on your location. Each piece is expertly packed using museum-quality materials to ensure safe passage. We provide full tracking and insurance for all international shipments.</p>
                        </div>
                    </div>

                    <div class="faq-item">
                        <div class="faq-question" data-faq-trigger>
                            <h3>What sacred payment methods do you accept?</h3>
                            <button class="faq-toggle" type="button">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="faq-icon-plus">
                                    <path d="M5 12h14"/>
                                    <path d="M12 5v14"/>
                                </svg>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="faq-icon-minus hidden">
                                    <path d="M5 12h14"/>
                                </svg>
                            </button>
                        </div>
                        <div class="faq-answer hidden">
                            <p>We accept various payment methods including major credit cards (Visa, MasterCard, American Express), PayPal, cryptocurrency (Bitcoin, Ethereum), and secure bank transfers. All transactions are protected with military-grade SSL encryption to safeguard your sacred information.</p>
                        </div>
                    </div>

                    <div class="faq-item">
                        <div class="faq-question" data-faq-trigger>
                            <h3>What is your sacred return policy?</h3>
                            <button class="faq-toggle" type="button">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="faq-icon-plus">
                                    <path d="M5 12h14"/>
                                    <path d="M12 5v14"/>
                                </svg>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="faq-icon-minus hidden">
                                    <path d="M5 12h14"/>
                                </svg>
                            </button>
                        </div>
                        <div class="faq-answer hidden">
                            <p>We offer a 30-day sacred guarantee for most treasures. If you're not completely satisfied with your acquisition, you may return it within 30 days for a full refund or exchange. Items must remain in their original condition and packaging. Custom-crafted pieces may have different return terms due to their bespoke nature.</p>
                        </div>
                    </div>

                    <div class="faq-item">
                        <div class="faq-question" data-faq-trigger>
                            <h3>Do you create custom Egyptian creativity?</h3>
                            <button class="faq-toggle" type="button">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="faq-icon-plus">
                                    <path d="M5 12h14"/>
                                    <path d="M12 5v14"/>
                                </svg>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="faq-icon-minus hidden">
                                    <path d="M5 12h14"/>
                                </svg>
                            </button>
                        </div>
                        <div class="faq-answer hidden">
                            <p>Absolutely! Our master craftsmen specialize in creating bespoke Egyptian creativity. Whether you seek a specific size, design, personalization, or wish to recreate a particular ancient artifact, our artisans can bring your vision to life. Contact us with your sacred requirements for a custom consultation and timeline.</p>
                        </div>
                    </div>

                    <div class="faq-item">
                        <div class="faq-question" data-faq-trigger>
                            <h3>How long does crafting take for custom orders?</h3>
                            <button class="faq-toggle" type="button">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="faq-icon-plus">
                                    <path d="M5 12h14"/>
                                    <path d="M12 5v14"/>
                                </svg>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="faq-icon-minus hidden">
                                    <path d="M5 12h14"/>
                                </svg>
                            </button>
                        </div>
                        <div class="faq-answer hidden">
                            <p>Custom treasures typically require 4-8 weeks for completion, depending on complexity and materials. Simple pieces may be ready in 2-3 weeks, while elaborate artifacts requiring intricate detailing can take 10-12 weeks. We provide regular updates throughout the sacred crafting process and will notify you of any timeline adjustments.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

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

    <!-- Newsletter Section -->
    <section class="newsletter">
        <div class="container">
            <div class="newsletter-content">
                <div class="newsletter-icon">𓊃</div>
                <h2 class="newsletter-title">Stay Connected with Ancient Wisdom</h2>
                <p class="newsletter-subtitle">Be the first to discover new collections and exclusive pieces</p>
                <form class="newsletter-form" id="newsletterForm" method="post" action="contact.php">
                    <div class="form-group">
                        <input type="email" class="newsletter-input" name="newsletter_email" placeholder="Enter your email address" required>
                        <button type="submit" class="btn btn-primary newsletter-btn">
                            Subscribe
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12,5 19,12 12,19"></polyline>
                            </svg>
                        </button>
                    </div>
                </form>
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

    <?php include 'includes/sidebar.html'; ?>
    <script src="js/script.js"></script>

    <script src="js/contact-script.js"></script>
    <script src="js/sidebar-utils.js"></script>
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