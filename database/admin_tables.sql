-- Admin Database Tables for Egyptian Creativity

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    stock INT DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active',
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Gallery Items Table
CREATE TABLE IF NOT EXISTS gallery_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Blogs Table
CREATE TABLE IF NOT EXISTS blogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    author VARCHAR(100) NOT NULL,
    status ENUM('draft', 'published') DEFAULT 'draft',
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    customer_address TEXT,
    products TEXT NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
    payment_method VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Admin Users Table (for future use)
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'editor') DEFAULT 'admin',
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sample Data for Products
INSERT INTO products (name, description, price, category, stock, status, image) VALUES
('Pharaoh Necklace', 'Exquisite gold-plated necklace featuring ancient Egyptian hieroglyphics and pharaoh motifs. Perfect for special occasions and cultural celebrations.', 299.99, 'Jewelry', 15, 'active', 'images/products/pharaoh-necklace.jpg'),
('Ankh Cross Pendant', 'Sacred Ankh symbol pendant in sterling silver with detailed engravings. Represents eternal life and protection.', 89.99, 'Jewelry', 25, 'active', 'images/products/ankh-pendant.jpg'),
('Eye of Horus Bracelet', 'Beautiful bracelet featuring the protective Eye of Horus symbol. Handcrafted with attention to detail.', 149.99, 'Jewelry', 20, 'active', 'images/products/eye-horus-bracelet.jpg'),
('Egyptian Scarab Ring', 'Ancient scarab beetle ring symbolizing rebirth and transformation. Available in various sizes.', 199.99, 'Jewelry', 12, 'active', 'images/products/scarab-ring.jpg'),
('Pyramid Wall Art', 'Stunning pyramid wall decoration with golden accents. Perfect for home or office decor.', 399.99, 'Decorations', 8, 'active', 'images/products/pyramid-wall-art.jpg'),
('Sphinx Statue', 'Hand-carved sphinx statue made from premium materials. A majestic addition to any collection.', 599.99, 'Decorations', 5, 'active', 'images/products/sphinx-statue.jpg'),
('Hieroglyphic Treasure Box', 'Ornate wooden box with authentic hieroglyphic carvings and golden accents, perfect for storing precious items.', 249.99, 'Boxes', 10, 'active', 'images/products/hieroglyphic-box.jpg'),
('Egyptian Chess Set', 'Beautiful chess set featuring Egyptian-themed pieces. Perfect for collectors and players.', 179.99, 'Games', 15, 'active', 'images/products/egyptian-chess.jpg'),
('Pharaoh Mask', 'Decorative pharaoh mask for costume parties and cultural events. High-quality materials.', 129.99, 'Masks', 20, 'active', 'images/products/pharaoh-mask.jpg'),
('Lotus Flower Vase', 'Elegant vase featuring lotus flower design. Perfect for floral arrangements.', 89.99, 'Decorations', 18, 'active', 'images/products/lotus-vase.jpg');

-- Sample Data for Gallery Items
INSERT INTO gallery_items (title, description, category, status, image) VALUES
('Ancient Egyptian Jewelry Collection', 'A stunning collection of handcrafted jewelry pieces inspired by ancient Egyptian designs and symbols.', 'Jewelry', 'active', 'images/gallery/jewelry-collection.jpg'),
('Pharaoh\'s Throne Replica', 'Detailed replica of an ancient Egyptian throne with intricate carvings and golden finish.', 'Decorations', 'active', 'images/gallery/pharaoh-throne.jpg'),
('Sacred Ankh Symbols', 'Collection of sacred Ankh symbols in various sizes and materials, representing eternal life.', 'Accessories', 'active', 'images/gallery/ankh-symbols.jpg'),
('Egyptian Temple Architecture', 'Miniature replicas of famous Egyptian temples with authentic architectural details.', 'Decorations', 'active', 'images/gallery/temple-architecture.jpg'),
('Nile River Artwork', 'Beautiful artwork depicting the Nile River with ancient Egyptian boats and landscapes.', 'Decorations', 'active', 'images/gallery/nile-river-art.jpg'),
('Hieroglyphic Writing Set', 'Complete writing set with hieroglyphic symbols and papyrus scrolls for authentic experience.', 'Accessories', 'active', 'images/gallery/hieroglyphic-writing.jpg'),
('Egyptian God Statues', 'Collection of statues representing various Egyptian gods and goddesses.', 'Decorations', 'active', 'images/gallery/egyptian-gods.jpg'),
('Ancient Egyptian Games', 'Traditional Egyptian games including Senet and other board games from antiquity.', 'Games', 'active', 'images/gallery/ancient-games.jpg'),
('Pharaoh Costume Set', 'Complete pharaoh costume with crown, scepter, and traditional Egyptian clothing.', 'Accessories', 'active', 'images/gallery/pharaoh-costume.jpg'),
('Egyptian Pottery Collection', 'Authentic-style Egyptian pottery with traditional patterns and designs.', 'Decorations', 'active', 'images/gallery/egyptian-pottery.jpg');

-- Sample Data for Blogs
INSERT INTO blogs (title, content, excerpt, author, status, image) VALUES
('The History of Egyptian Jewelry', 'Egyptian jewelry has a rich history dating back thousands of years. The ancient Egyptians were master craftsmen who created stunning pieces using gold, silver, and precious stones. These pieces were not just decorative but held deep religious and cultural significance. The Ankh symbol, representing eternal life, was commonly used in jewelry designs. Pharaohs and nobility wore elaborate pieces to display their status and power. Today, modern artisans continue to create beautiful Egyptian-inspired jewelry that honors these ancient traditions while appealing to contemporary tastes. Our collection features handcrafted pieces that capture the essence of ancient Egyptian design while using modern techniques and materials.', 'Discover the fascinating history behind ancient Egyptian jewelry and how it continues to inspire modern designs.', 'Dr. Sarah Ahmed', 'published', 'images/blogs/egyptian-jewelry-history.jpg'),
('Symbols of Ancient Egypt', 'Ancient Egyptian symbols hold deep meaning and were used extensively in art, architecture, and daily life. The Eye of Horus, for example, represents protection, royal power, and good health. The Ankh symbol, shaped like a cross with a loop at the top, symbolizes eternal life and was often carried by gods and pharaohs. The Scarab beetle represents rebirth and transformation, as the ancient Egyptians observed how these beetles rolled balls of dung, which they associated with the sun god Ra rolling the sun across the sky. The Lotus flower symbolizes rebirth and purity, as it closes at night and reopens in the morning. These symbols continue to inspire artists and designers today, appearing in modern jewelry, home decor, and artwork.', 'Explore the powerful symbols that defined ancient Egyptian culture and their lasting influence on modern design.', 'Prof. Michael Hassan', 'published', 'images/blogs/egyptian-symbols.jpg'),
('Crafting Egyptian-Inspired Home Decor', 'Creating Egyptian-inspired home decor involves understanding the principles of ancient Egyptian design while adapting them for modern living spaces. Key elements include the use of gold and rich colors, geometric patterns, and symbolic motifs. When designing Egyptian-themed rooms, consider incorporating elements like pyramid shapes, lotus flower patterns, and hieroglyphic-inspired artwork. Color palettes should feature deep blues, rich golds, and warm earth tones. Materials like wood, stone, and metal work well to create authentic-looking pieces. Our collection includes handcrafted items that bring the elegance of ancient Egypt into contemporary homes, from wall art to decorative accessories.', 'Learn how to incorporate the timeless elegance of ancient Egyptian design into your modern home decor.', 'Interior Designer Fatima Ali', 'published', 'images/blogs/egyptian-home-decor.jpg'),
('The Art of Egyptian Hieroglyphics', 'Hieroglyphics, the ancient Egyptian writing system, is one of the world\'s oldest forms of written communication. These intricate symbols were used for over 3,000 years and represent a sophisticated system that combined logographic and alphabetic elements. Each hieroglyph could represent a sound, a word, or a concept. The ancient Egyptians used hieroglyphics for religious texts, royal decrees, and monumental inscriptions. Today, these beautiful symbols continue to fascinate people worldwide and are often incorporated into modern art and design. Our artisans carefully study these ancient symbols to create authentic-looking pieces that honor this rich cultural heritage.', 'Dive into the fascinating world of Egyptian hieroglyphics and their enduring influence on art and culture.', 'Egyptologist Dr. Omar Khalil', 'published', 'images/blogs/egyptian-hieroglyphics.jpg'),
('Traditional Egyptian Games and Entertainment', 'Ancient Egyptians enjoyed various forms of entertainment and games. Senet, one of the oldest known board games, was played by people of all social classes and was believed to have religious significance. The game involved moving pieces across a board with 30 squares, and some versions included special squares that could help or hinder players. Other popular games included Mehen, a spiral board game, and various dice games. These games not only provided entertainment but also served as social activities that brought people together. Today, modern versions of these ancient games are available, allowing people to experience a piece of ancient Egyptian culture.', 'Discover the games and entertainment that brought joy to ancient Egyptian society.', 'Cultural Historian Dr. Layla Mahmoud', 'published', 'images/blogs/egyptian-games.jpg');

-- Sample Data for Orders
INSERT INTO orders (customer_name, customer_email, customer_phone, customer_address, products, total, status, payment_method, notes) VALUES
('Ahmed Hassan', 'ahmed.hassan@email.com', '+20-123-456-7890', '123 Nile Street, Cairo, Egypt', 'Pharaoh Necklace, Ankh Cross Pendant', 389.98, 'completed', 'Credit Card', 'Gift for anniversary'),
('Fatima Ali', 'fatima.ali@email.com', '+20-987-654-3210', '456 Pyramid Road, Giza, Egypt', 'Eye of Horus Bracelet', 149.99, 'processing', 'PayPal', 'Birthday gift'),
('Omar Khalil', 'omar.khalil@email.com', '+20-555-123-4567', '789 Sphinx Avenue, Luxor, Egypt', 'Egyptian Scarab Ring, Sphinx Statue', 799.98, 'pending', 'Bank Transfer', 'Collection pieces'),
('Layla Mahmoud', 'layla.mahmoud@email.com', '+20-111-222-3333', '321 Temple Street, Aswan, Egypt', 'Pyramid Wall Art', 399.99, 'completed', 'Credit Card', 'Home decoration'),
('Sarah Ahmed', 'sarah.ahmed@email.com', '+20-444-555-6666', '654 Pharaoh Lane, Alexandria, Egypt', 'Egyptian Chess Set, Pharaoh Mask', 309.98, 'processing', 'PayPal', 'Gift set');

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_gallery_items_category ON gallery_items(category);
CREATE INDEX idx_gallery_items_status ON gallery_items(status);
CREATE INDEX idx_blogs_status ON blogs(status);
CREATE INDEX idx_blogs_author ON blogs(author);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at); 