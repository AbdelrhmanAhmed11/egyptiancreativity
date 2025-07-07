CREATE DATABASE IF NOT EXISTS egyptian_creativity CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE egyptian_creativity;

-- 1. Users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    phone VARCHAR(20),
    profile_image VARCHAR(255),
    role ENUM('user','admin') DEFAULT 'user', -- user role
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 1a. Addresses (multiple per user)
CREATE TABLE addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    recipient_name VARCHAR(100),
    phone VARCHAR(20),
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    is_default BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
);

-- 2. Categories (with parent_id for subcategories)
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    parent_id INT,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- 3. Products
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_sku VARCHAR(50) NOT NULL UNIQUE, -- unique product code
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    category INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_category (category)
);

-- 4. Cart Items
CREATE TABLE cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_product_id (product_id)
);

-- 5. Wishlist Items
CREATE TABLE wishlist_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_product_id (product_id)
);

-- 6. Orders (now with shipping_address_id)
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    shipping_address_id INT,
    total_price DECIMAL(10,2) NOT NULL,
    status ENUM('pending','processing','shipped','delivered','cancelled') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (shipping_address_id) REFERENCES addresses(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_shipping_address_id (shipping_address_id)
);

-- 7. Order Items
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
);

-- 8. Blog Posts
CREATE TABLE blog_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    author_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_author_id (author_id)
);

-- 10. Gallery Images (now linked to products and blog posts)
CREATE TABLE gallery_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    blog_post_id INT,
    title VARCHAR(100),
    image_path VARCHAR(255) NOT NULL,
    description TEXT,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (blog_post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id),
    INDEX idx_blog_post_id (blog_post_id)
);

-- 11. Contact Messages
CREATE TABLE contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(100),
    email VARCHAR(100),
    subject VARCHAR(200),
    message TEXT NOT NULL,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id)
);