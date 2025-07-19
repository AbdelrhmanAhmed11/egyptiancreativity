-- Sample data for Egyptian Creativity Wishlist System
-- This file contains sample data for testing the wishlist functionality

-- Insert sample categories
INSERT INTO categories (id, name, description) VALUES
(1, 'Pharaonic Masks', 'Authentic replicas of ancient Egyptian pharaonic masks'),
(2, 'Jewelry', 'Handcrafted Egyptian jewelry with traditional designs'),
(3, 'Statues', 'Beautiful Egyptian statues and figurines'),
(4, 'Home Decor', 'Egyptian-themed home decoration items'),
(5, 'Textiles', 'Traditional Egyptian textiles and fabrics');

-- Insert sample products
INSERT INTO products (id, product_sku, name, description, price, stock, category) VALUES
(1, 'EGY-MASK-001', 'Ancient Pharaoh Mask', 'An exquisite reproduction of the legendary burial mask, crafted with 24-karat gold and precious gemstones in the traditional Egyptian style.', 12500.00, 15, 1),
(2, 'EGY-STAT-001', 'Nefertiti Bust Replica', 'Stunning replica of the famous Nefertiti bust, capturing the beauty and elegance of the ancient queen.', 2800.00, 8, 3),
(3, 'EGY-JEW-001', 'Sacred Ankh Pendant', 'Symbol of eternal life, this magnificent ankh is crafted from pure gold with intricate engravings representing the cycle of life and death.', 3750.00, 25, 2),
(4, 'EGY-JEW-002', 'Eye of Horus Bracelet', 'Handcrafted bracelet featuring the protective Eye of Horus, crafted in sterling silver with gold accents.', 1850.00, 30, 2),
(5, 'EGY-JEW-003', 'Divine Scarab Amulet', 'A stunning set of protective amulets featuring intricate scarab designs, symbolizing rebirth and eternal life in ancient Egyptian culture.', 2850.00, 20, 2),
(6, 'EGY-DEC-001', 'Pyramid Paperweight', 'Elegant pyramid-shaped paperweight made from authentic Egyptian alabaster, perfect for desk decoration.', 950.00, 40, 4),
(7, 'EGY-TEX-001', 'Egyptian Cotton Throw', 'Luxurious 100% Egyptian cotton throw with pharaonic motifs and golden thread accents.', 850.00, 12, 5),
(8, 'EGY-STAT-002', 'Isis Goddess Statue', 'Beautiful statue of the goddess Isis, protector of magic and motherhood, crafted in bronze with gold accents.', 4200.00, 10, 3),
(9, 'EGY-JEW-004', 'Cleopatra Crown Replica', 'A breathtaking reproduction of the legendary queen crown, adorned with precious stones and intricate goldwork fit for royalty.', 18750.00, 3, 1),
(10, 'EGY-DEC-002', 'Hieroglyphic Papyrus Scroll', 'Authentic papyrus scroll featuring ancient Egyptian scenes and hieroglyphic texts, handcrafted by skilled artisans.', 1250.00, 15, 4);

-- Insert sample user (if not exists)
INSERT INTO users (id, username, email, password_hash, full_name, role) VALUES
(1, 'demo_user', 'demo@egyptiancreativity.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Demo User', 'user')
ON DUPLICATE KEY UPDATE id=id;

-- Insert sample wishlist items for demo user
INSERT INTO wishlist_items (user_id, product_id, added_at) VALUES
(1, 1, NOW()), -- Tutankhamun Mask
(1, 3, NOW()), -- Ankh Pendant
(1, 6, NOW()), -- Pyramid Paperweight
(1, 8, NOW()), -- Sphinx Statue
(1, 10, NOW()); -- Hieroglyphic Wall Art

-- Insert sample cart items for demo user
INSERT INTO cart_items (user_id, product_id, quantity, added_at) VALUES
(1, 2, 1, NOW()), -- Nefertiti Bust (1 quantity)
(1, 4, 2, NOW()), -- Eye of Horus Bracelet (2 quantity)
(1, 7, 1, NOW()), -- Egyptian Cotton Throw (1 quantity)
(1, 9, 1, NOW()); -- Cleopatra Earrings (1 quantity)

-- Insert additional sample products for recommended items
INSERT INTO products (id, product_sku, name, description, price, stock, category) VALUES
(11, 'EGY-STAT-003', 'Royal Canopic Jars', 'Four magnificent vessels representing the sons of Horus, each meticulously detailed with hieroglyphic inscriptions and gold leaf accents.', 8900.00, 5, 3),
(12, 'EGY-JEW-005', 'Pharaoh Scepter Replica', 'Magnificent replica of a pharaoh ceremonial scepter with golden finish and precious stone inlays.', 6500.00, 2, 1),
(13, 'EGY-TEX-002', 'Senet Game Board', 'Ancient Egyptian board game of Senet, the game of passing, complete with playing pieces and instructions.', 3200.00, 4, 5),
(14, 'EGY-STAT-004', 'Egyptian Collar Necklace', 'Elaborate collar necklace worn by Egyptian nobility, featuring intricate beadwork and golden elements.', 4200.00, 6, 2),
(15, 'EGY-JEW-006', 'Tutankhamun Treasure Box', 'Ornate treasure box inspired by Tutankhamun tomb, with authentic hieroglyphic carvings and golden accents.', 7200.00, 3, 3); 