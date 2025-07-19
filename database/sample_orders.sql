-- Sample Orders Data for Egyptian Creativity
-- This file contains sample order data for testing the admin panel

-- Insert sample orders
INSERT INTO orders (user_id, transaction_id, total_price, status, notes, customer_notes, created_at) VALUES
(1, 'TXN-2024-001', 389.98, 'delivered', 'Customer requested gift wrapping', 'Please deliver before 3 PM', '2024-01-15 10:30:00'),
(1, 'TXN-2024-002', 149.98, 'shipped', 'Express shipping requested', 'Handle with care - fragile items', '2024-01-20 14:45:00'),
(1, 'TXN-2024-003', 299.99, 'processing', 'Standard shipping', 'No special instructions', '2024-01-25 09:15:00'),
(1, 'TXN-2024-004', 89.99, 'pending', 'Customer will pick up', 'Call customer before delivery', '2024-01-28 16:20:00'),
(1, 'TXN-2024-005', 199.99, 'delivered', 'Gift box included', 'Perfect for anniversary gift', '2024-02-01 11:30:00'),
(1, 'TXN-2024-006', 49.99, 'cancelled', 'Customer cancelled due to delay', 'Customer requested cancellation', '2024-02-05 13:45:00'),
(1, 'TXN-2024-007', 39.99, 'shipped', 'Standard shipping', 'No special requirements', '2024-02-10 15:20:00'),
(1, 'TXN-2024-008', 599.97, 'processing', 'Bulk order discount applied', 'Corporate gift order', '2024-02-15 10:00:00'),
(1, 'TXN-2024-009', 299.99, 'pending', 'Customer requested special packaging', 'Include thank you note', '2024-02-18 14:30:00'),
(1, 'TXN-2024-010', 149.98, 'delivered', 'Express delivery completed', 'Customer very satisfied', '2024-02-20 12:15:00');

-- Insert order items for each order
-- Order 1: Golden Pharaoh Mask + Senet Game Box
INSERT INTO order_items (order_id, product_id, quantity) VALUES
(1, 1, 1),  -- Golden Pharaoh Mask
(1, 2, 1);  -- Senet Game Box

-- Order 2: Nefertiti Bust + Ankh Pendant
INSERT INTO order_items (order_id, product_id, quantity) VALUES
(2, 3, 1),  -- Nefertiti Bust
(2, 4, 1);  -- Ankh Pendant

-- Order 3: Golden Pharaoh Mask
INSERT INTO order_items (order_id, product_id, quantity) VALUES
(3, 1, 1);  -- Golden Pharaoh Mask

-- Order 4: Senet Game Box
INSERT INTO order_items (order_id, product_id, quantity) VALUES
(4, 2, 1);  -- Senet Game Box

-- Order 5: Nefertiti Bust
INSERT INTO order_items (order_id, product_id, quantity) VALUES
(5, 3, 1);  -- Nefertiti Bust

-- Order 6: Ankh Pendant
INSERT INTO order_items (order_id, product_id, quantity) VALUES
(6, 4, 1);  -- Ankh Pendant

-- Order 7: Eye of Horus Amulet
INSERT INTO order_items (order_id, product_id, quantity) VALUES
(7, 5, 1);  -- Eye of Horus Amulet

-- Order 8: Multiple items (Golden Pharaoh Mask + Nefertiti Bust + Ankh Pendant)
INSERT INTO order_items (order_id, product_id, quantity) VALUES
(8, 1, 1),  -- Golden Pharaoh Mask
(8, 3, 1),  -- Nefertiti Bust
(8, 4, 1);  -- Ankh Pendant

-- Order 9: Golden Pharaoh Mask
INSERT INTO order_items (order_id, product_id, quantity) VALUES
(9, 1, 1);  -- Golden Pharaoh Mask

-- Order 10: Nefertiti Bust + Eye of Horus Amulet
INSERT INTO order_items (order_id, product_id, quantity) VALUES
(10, 3, 1), -- Nefertiti Bust
(10, 5, 1); -- Eye of Horus Amulet

-- Insert order status history (optional - for tracking status changes)
INSERT INTO order_status_history (order_id, status, changed_at) VALUES
(1, 'pending', '2024-01-15 10:30:00'),
(1, 'processing', '2024-01-16 09:15:00'),
(1, 'shipped', '2024-01-17 14:20:00'),
(1, 'delivered', '2024-01-19 11:30:00'),
(2, 'pending', '2024-01-20 14:45:00'),
(2, 'processing', '2024-01-21 10:30:00'),
(2, 'shipped', '2024-01-22 16:45:00'),
(3, 'pending', '2024-01-25 09:15:00'),
(3, 'processing', '2024-01-26 11:20:00'),
(4, 'pending', '2024-01-28 16:20:00'),
(5, 'pending', '2024-02-01 11:30:00'),
(5, 'processing', '2024-02-02 09:45:00'),
(5, 'shipped', '2024-02-03 14:30:00'),
(5, 'delivered', '2024-02-05 12:15:00'),
(6, 'pending', '2024-02-05 13:45:00'),
(6, 'cancelled', '2024-02-06 10:30:00'),
(7, 'pending', '2024-02-10 15:20:00'),
(7, 'processing', '2024-02-11 09:15:00'),
(7, 'shipped', '2024-02-12 16:45:00'),
(8, 'pending', '2024-02-15 10:00:00'),
(8, 'processing', '2024-02-16 11:30:00'),
(9, 'pending', '2024-02-18 14:30:00'),
(10, 'pending', '2024-02-20 12:15:00'),
(10, 'processing', '2024-02-21 09:45:00'),
(10, 'shipped', '2024-02-22 14:20:00'),
(10, 'delivered', '2024-02-24 11:30:00'); 