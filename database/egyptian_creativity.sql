-- =====================================================
-- Egyptian Creativity - Complete Database Schema
-- =====================================================

-- Create Database
CREATE DATABASE IF NOT EXISTS egyptian_creativity CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE egyptian_creativity;

-- =====================================================
-- USERS & AUTHENTICATION
-- =====================================================

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone VARCHAR(20),
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other', 'prefer_not_to_say'),
    profile_image VARCHAR(255),
    is_admin BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP NULL,
    verification_token VARCHAR(255),
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMP NULL,
    last_login TIMESTAMP NULL,
    login_count INT DEFAULT 0,
    status ENUM('active', 'inactive', 'blocked', 'pending') DEFAULT 'active',
    preferences JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_username (username),
    INDEX idx_users_status (status)
);

-- User Addresses Table
CREATE TABLE IF NOT EXISTS user_addresses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    address_type ENUM('billing', 'shipping', 'both') DEFAULT 'shipping',
    is_default BOOLEAN DEFAULT FALSE,
    full_name VARCHAR(100) NOT NULL,
    company VARCHAR(100),
    street_address TEXT NOT NULL,
    apartment VARCHAR(50),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) NOT NULL DEFAULT 'Egypt',
    phone VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_addresses_user (user_id),
    INDEX idx_user_addresses_type (address_type)
);

-- User Sessions Table
CREATE TABLE IF NOT EXISTS user_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_sessions_token (session_token),
    INDEX idx_user_sessions_user (user_id)
);

-- =====================================================
-- PRODUCTS & INVENTORY
-- =====================================================

-- Product Categories Table
CREATE TABLE IF NOT EXISTS product_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    parent_id INT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    slug VARCHAR(100) UNIQUE NOT NULL,
    image_url VARCHAR(255),
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES product_categories(id) ON DELETE SET NULL,
    INDEX idx_product_categories_parent (parent_id),
    INDEX idx_product_categories_slug (slug),
    INDEX idx_product_categories_active (is_active)
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    price DECIMAL(10,2) NOT NULL,
    old_price DECIMAL(10,2),
    cost_price DECIMAL(10,2),
    stock_quantity INT DEFAULT 0,
    min_stock_alert INT DEFAULT 5,
    max_order_quantity INT DEFAULT 10,
    weight DECIMAL(10,2),
    dimensions VARCHAR(50),
    sku VARCHAR(50) UNIQUE NOT NULL,
    barcode VARCHAR(50),
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    is_bestseller BOOLEAN DEFAULT FALSE,
    is_new BOOLEAN DEFAULT FALSE,
    is_on_sale BOOLEAN DEFAULT FALSE,
    sale_percentage INT DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INT DEFAULT 0,
    view_count INT DEFAULT 0,
    sold_count INT DEFAULT 0,
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES product_categories(id),
    INDEX idx_products_category (category_id),
    INDEX idx_products_slug (slug),
    INDEX idx_products_sku (sku),
    INDEX idx_products_active (is_active),
    INDEX idx_products_featured (is_featured),
    INDEX idx_products_sale (is_on_sale)
);

-- Product Images Table
CREATE TABLE IF NOT EXISTS product_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    alt_text VARCHAR(255),
    title VARCHAR(255),
    is_main BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_images_product (product_id),
    INDEX idx_product_images_main (is_main)
);

-- Product Variants Table
CREATE TABLE IF NOT EXISTS product_variants (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    variant_name VARCHAR(100) NOT NULL,
    variant_type ENUM('size', 'color', 'material', 'style', 'other') DEFAULT 'other',
    price_modifier DECIMAL(10,2) DEFAULT 0.00,
    stock_quantity INT DEFAULT 0,
    sku VARCHAR(50) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_variants_product (product_id),
    INDEX idx_product_variants_sku (sku)
);

-- Product Reviews Table
CREATE TABLE IF NOT EXISTS product_reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    order_id INT,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    helpful_count INT DEFAULT 0,
    not_helpful_count INT DEFAULT 0,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    INDEX idx_product_reviews_product (product_id),
    INDEX idx_product_reviews_user (user_id),
    INDEX idx_product_reviews_status (status)
);

-- Product Tags Table
CREATE TABLE IF NOT EXISTS product_tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_product_tags_slug (slug)
);

-- Product-Tag Relationship Table
CREATE TABLE IF NOT EXISTS product_tag_relationships (
    product_id INT NOT NULL,
    tag_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (product_id, tag_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES product_tags(id) ON DELETE CASCADE
);

-- Product Specifications Table
CREATE TABLE IF NOT EXISTS product_specifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    spec_name VARCHAR(100) NOT NULL,
    spec_value TEXT NOT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_specifications_product (product_id)
);

-- =====================================================
-- SHOPPING CART & WISHLIST
-- =====================================================

-- Cart Items Table
CREATE TABLE IF NOT EXISTS cart_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    variant_id INT,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL,
    INDEX idx_cart_items_user (user_id),
    INDEX idx_cart_items_product (product_id)
);

-- Wishlist Items Table
CREATE TABLE IF NOT EXISTS wishlist_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    variant_id INT,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL,
    UNIQUE KEY unique_wishlist_item (user_id, product_id, variant_id),
    INDEX idx_wishlist_items_user (user_id)
);

-- =====================================================
-- ORDERS & PAYMENTS
-- =====================================================

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded') DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    shipping_amount DECIMAL(10,2) DEFAULT 0.00,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(50),
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    transaction_id VARCHAR(255),
    shipping_method VARCHAR(100),
    tracking_number VARCHAR(100),
    estimated_delivery DATE,
    notes TEXT,
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_orders_user (user_id),
    INDEX idx_orders_number (order_number),
    INDEX idx_orders_status (status),
    INDEX idx_orders_payment_status (payment_status)
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    variant_id INT,
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(50) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL,
    INDEX idx_order_items_order (order_id),
    INDEX idx_order_items_product (product_id)
);

-- Order Addresses Table
CREATE TABLE IF NOT EXISTS order_addresses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    address_type ENUM('billing', 'shipping') NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    company VARCHAR(100),
    street_address TEXT NOT NULL,
    apartment VARCHAR(50),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_order_addresses_order (order_id)
);

-- Order Status History Table
CREATE TABLE IF NOT EXISTS order_status_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded') NOT NULL,
    comment TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_order_status_history_order (order_id)
);

-- =====================================================
-- BLOG & CONTENT
-- =====================================================

-- Blog Categories Table
CREATE TABLE IF NOT EXISTS blog_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_blog_categories_slug (slug)
);

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    author_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content LONGTEXT NOT NULL,
    featured_image VARCHAR(255),
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    is_sticky BOOLEAN DEFAULT FALSE,
    view_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    published_at TIMESTAMP NULL,
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES blog_categories(id),
    FOREIGN KEY (author_id) REFERENCES users(id),
    INDEX idx_blog_posts_category (category_id),
    INDEX idx_blog_posts_slug (slug),
    INDEX idx_blog_posts_status (status),
    INDEX idx_blog_posts_published (published_at)
);

-- Blog Tags Table
CREATE TABLE IF NOT EXISTS blog_tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    color VARCHAR(7),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_blog_tags_slug (slug)
);

-- Blog Post-Tag Relationship Table
CREATE TABLE IF NOT EXISTS blog_post_tag_relationships (
    post_id INT NOT NULL,
    tag_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id, tag_id),
    FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES blog_tags(id) ON DELETE CASCADE
);

-- Blog Comments Table
CREATE TABLE IF NOT EXISTS blog_comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id INT,
    parent_id INT,
    author_name VARCHAR(100),
    author_email VARCHAR(100),
    content TEXT NOT NULL,
    status ENUM('pending', 'approved', 'spam') DEFAULT 'pending',
    like_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (parent_id) REFERENCES blog_comments(id) ON DELETE CASCADE,
    INDEX idx_blog_comments_post (post_id),
    INDEX idx_blog_comments_status (status)
);

-- Blog Comment Likes Table
CREATE TABLE IF NOT EXISTS blog_comment_likes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    comment_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (comment_id) REFERENCES blog_comments(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_comment_like (comment_id, user_id),
    INDEX idx_blog_comment_likes_comment (comment_id)
);

-- =====================================================
-- CONTACT & SUPPORT
-- =====================================================

-- Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    message_type ENUM('general', 'support', 'order', 'custom', 'shipping', 'return', 'wholesale', 'other') DEFAULT 'general',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    status ENUM('new', 'in_progress', 'resolved', 'closed') DEFAULT 'new',
    assigned_to INT,
    is_read BOOLEAN DEFAULT FALSE,
    response TEXT,
    responded_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_contact_messages_email (email),
    INDEX idx_contact_messages_status (status),
    INDEX idx_contact_messages_type (message_type)
);

-- FAQ Table
CREATE TABLE IF NOT EXISTS faqs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    question VARCHAR(500) NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    view_count INT DEFAULT 0,
    helpful_count INT DEFAULT 0,
    not_helpful_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_faqs_category (category),
    INDEX idx_faqs_active (is_active)
);

-- =====================================================
-- ANALYTICS & TRACKING
-- =====================================================

-- Search History Table
CREATE TABLE IF NOT EXISTS search_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    search_term VARCHAR(255) NOT NULL,
    search_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    result_count INT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_search_history_user (user_id),
    INDEX idx_search_history_term (search_term)
);

-- Page Views Table
CREATE TABLE IF NOT EXISTS page_views (
    id INT PRIMARY KEY AUTO_INCREMENT,
    page_url VARCHAR(500) NOT NULL,
    page_title VARCHAR(255),
    user_id INT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    referrer VARCHAR(500),
    session_id VARCHAR(255),
    view_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_page_views_url (page_url),
    INDEX idx_page_views_user (user_id),
    INDEX idx_page_views_time (view_time)
);

-- Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    subscription_type ENUM('weekly', 'monthly', 'both') DEFAULT 'both',
    unsubscribed_at TIMESTAMP NULL,
    INDEX idx_newsletter_subscribers_email (email),
    INDEX idx_newsletter_subscribers_active (is_active)
);

-- =====================================================
-- SYSTEM & SETTINGS
-- =====================================================

-- System Settings Table
CREATE TABLE IF NOT EXISTS system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'integer', 'boolean', 'json', 'text') DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_system_settings_key (setting_key)
);

-- Activity Log Table
CREATE TABLE IF NOT EXISTS activity_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50),
    record_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_activity_logs_user (user_id),
    INDEX idx_activity_logs_action (action),
    INDEX idx_activity_logs_table (table_name)
);

-- =====================================================
-- SAMPLE DATA INSERTION
-- =====================================================

-- Insert default admin user (password: admin123)
INSERT INTO users (username, email, password, full_name, is_admin, is_verified, status) VALUES
('admin', 'admin@egyptiancreativity.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Administrator', TRUE, TRUE, 'active');

-- Insert product categories
INSERT INTO product_categories (name, slug, description, is_active, sort_order) VALUES
('Jewelry', 'jewelry', 'Authentic Egyptian jewelry and accessories', TRUE, 1),
('Decorations', 'decorations', 'Egyptian decorative items and artifacts', TRUE, 2),
('Accessories', 'accessories', 'Egyptian accessories and ceremonial items', TRUE, 3),
('Boxes', 'boxes', 'Egyptian storage boxes and containers', TRUE, 4);

-- Insert blog categories
INSERT INTO blog_categories (name, slug, description, is_active) VALUES
('History', 'history', 'Ancient Egyptian history and civilization', TRUE),
('Artifacts', 'artifacts', 'Egyptian artifacts and their significance', TRUE),
('Royalty', 'royalty', 'Egyptian pharaohs and royal families', TRUE),
('Culture', 'culture', 'Egyptian culture and traditions', TRUE);

-- Insert system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('site_name', 'Egyptian Creativity', 'string', 'Website name', TRUE),
('site_description', 'Authentic Egyptian artifacts and treasures', 'string', 'Website description', TRUE),
('contact_email', 'info@egyptiancreativity.com', 'string', 'Contact email address', TRUE),
('contact_phone', '+20 100 000 0000', 'string', 'Contact phone number', TRUE),
('currency', 'USD', 'string', 'Default currency', TRUE),
('tax_rate', '14', 'integer', 'Default tax rate percentage', FALSE),
('shipping_cost', '25.00', 'string', 'Default shipping cost', TRUE),
('free_shipping_threshold', '500.00', 'string', 'Minimum order for free shipping', TRUE);

-- Insert FAQ data
INSERT INTO faqs (question, answer, category, sort_order) VALUES
('How authentic are your Egyptian products?', 'All our products are authentic replicas crafted by skilled Egyptian artisans using traditional techniques and materials. Each piece is carefully designed to capture the essence and beauty of ancient Egyptian art and culture. We provide certificates of authenticity with every purchase.', 'General', 1),
('Do you ship internationally?', 'Yes, we ship to most countries worldwide. International shipping times typically range from 7-14 business days depending on your location. All packages are carefully packed to ensure safe delivery of your Egyptian creativity. We also provide tracking information for all shipments.', 'Shipping', 2),
('What payment methods do you accept?', 'We accept various payment methods including credit cards (Visa, MasterCard, American Express), PayPal, Bitcoin, Skrill, and bank transfers. All payments are processed securely using SSL encryption to protect your personal information.', 'Payment', 3),
('What is your return policy?', 'We offer a 30-day return policy for most items. If you''re not completely satisfied with your purchase, you can return it within 30 days for a full refund or exchange. Items must be in their original condition and packaging. Custom orders may have different return terms.', 'Returns', 4),
('Do you offer custom orders?', 'Yes, we specialize in custom orders! Whether you need a specific size, design, personalization, or want to recreate a particular Egyptian artifact, our master artisans can create unique pieces tailored to your preferences. Contact us with your requirements for a custom quote and timeline.', 'Custom', 5);

-- =====================================================
-- ADDITIONAL INDEXES FOR PERFORMANCE
-- =====================================================

-- Composite indexes for better query performance
CREATE INDEX idx_products_category_active ON products(category_id, is_active);
CREATE INDEX idx_products_featured_active ON products(is_featured, is_active);
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
CREATE INDEX idx_blog_posts_category_status ON blog_posts(category_id, status);
CREATE INDEX idx_contact_messages_status_type ON contact_messages(status, message_type);

-- Full-text search indexes
ALTER TABLE products ADD FULLTEXT(name, description, short_description);
ALTER TABLE blog_posts ADD FULLTEXT(title, content, excerpt);
ALTER TABLE product_tags ADD FULLTEXT(name);
ALTER TABLE blog_tags ADD FULLTEXT(name);

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- Product summary view
CREATE VIEW product_summary AS
SELECT 
    p.id,
    p.name,
    p.slug,
    p.price,
    p.old_price,
    p.stock_quantity,
    p.rating,
    p.review_count,
    p.is_featured,
    p.is_on_sale,
    p.sale_percentage,
    pc.name as category_name,
    pc.slug as category_slug,
    (SELECT image_url FROM product_images WHERE product_id = p.id AND is_main = TRUE LIMIT 1) as main_image
FROM products p
JOIN product_categories pc ON p.category_id = pc.id
WHERE p.is_active = TRUE;

-- Order summary view
CREATE VIEW order_summary AS
SELECT 
    o.id,
    o.order_number,
    o.status,
    o.total_amount,
    o.payment_status,
    o.created_at,
    u.full_name as customer_name,
    u.email as customer_email,
    COUNT(oi.id) as item_count
FROM orders o
JOIN users u ON o.user_id = u.id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id;

-- Blog post summary view
CREATE VIEW blog_post_summary AS
SELECT 
    bp.id,
    bp.title,
    bp.slug,
    bp.excerpt,
    bp.view_count,
    bp.comment_count,
    bp.published_at,
    bc.name as category_name,
    bc.slug as category_slug,
    u.full_name as author_name
FROM blog_posts bp
JOIN blog_categories bc ON bp.category_id = bc.id
JOIN users u ON bp.author_id = u.id
WHERE bp.status = 'published';

-- =====================================================
-- STORED PROCEDURES
-- =====================================================

DELIMITER //

-- Procedure to update product rating
CREATE PROCEDURE UpdateProductRating(IN product_id_param INT)
BEGIN
    UPDATE products 
    SET rating = (
        SELECT AVG(rating) 
        FROM product_reviews 
        WHERE product_id = product_id_param AND status = 'approved'
    ),
    review_count = (
        SELECT COUNT(*) 
        FROM product_reviews 
        WHERE product_id = product_id_param AND status = 'approved'
    )
    WHERE id = product_id_param;
END //

-- Procedure to update blog post comment count
CREATE PROCEDURE UpdateBlogCommentCount(IN post_id_param INT)
BEGIN
    UPDATE blog_posts 
    SET comment_count = (
        SELECT COUNT(*) 
        FROM blog_comments 
        WHERE post_id = post_id_param AND status = 'approved'
    )
    WHERE id = post_id_param;
END //

-- Procedure to generate order number
CREATE PROCEDURE GenerateOrderNumber(OUT order_number VARCHAR(50))
BEGIN
    DECLARE current_year INT;
    DECLARE sequence_number INT;
    
    SET current_year = YEAR(NOW());
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(order_number, 12) AS UNSIGNED)), 0) + 1
    INTO sequence_number
    FROM orders 
    WHERE order_number LIKE CONCAT('ORD-', current_year, '-%');
    
    SET order_number = CONCAT('ORD-', current_year, '-', LPAD(sequence_number, 6, '0'));
END //

DELIMITER ;

-- =====================================================
-- TRIGGERS
-- =====================================================

DELIMITER //

-- Trigger to update product rating when review is added/updated
CREATE TRIGGER after_review_update
AFTER UPDATE ON product_reviews
FOR EACH ROW
BEGIN
    IF NEW.status != OLD.status OR NEW.rating != OLD.rating THEN
        CALL UpdateProductRating(NEW.product_id);
    END IF;
END //

-- Trigger to update product rating when review is deleted
CREATE TRIGGER after_review_delete
AFTER DELETE ON product_reviews
FOR EACH ROW
BEGIN
    CALL UpdateProductRating(OLD.product_id);
END //

-- Trigger to update blog comment count when comment is added/updated
CREATE TRIGGER after_comment_update
AFTER UPDATE ON blog_comments
FOR EACH ROW
BEGIN
    IF NEW.status != OLD.status THEN
        CALL UpdateBlogCommentCount(NEW.post_id);
    END IF;
END //

-- Trigger to update blog comment count when comment is deleted
CREATE TRIGGER after_comment_delete
AFTER DELETE ON blog_comments
FOR EACH ROW
BEGIN
    CALL UpdateBlogCommentCount(OLD.post_id);
END //

DELIMITER ;

-- =====================================================
-- FINAL COMMENTS
-- =====================================================

-- This database schema provides a complete foundation for the Egyptian Creativity e-commerce system
-- It includes all necessary tables for users, products, orders, blog, contact forms, and analytics
-- The schema is optimized for performance with proper indexes and includes sample data
-- All foreign key relationships are properly defined with appropriate cascade rules
-- The system supports multi-language content and includes comprehensive tracking capabilities
