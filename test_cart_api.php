<?php
// Test script for cart API endpoints
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>Cart API Test</h1>";

// Test database connection
echo "<h2>1. Database Connection Test</h2>";
try {
    include 'includes/db.php';
    if (isset($pdo)) {
        echo "✅ Database connection successful<br>";
        
        // Test products table
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM products");
        $result = $stmt->fetch();
        echo "✅ Products table accessible - {$result['count']} products found<br>";
        
        // Test cart_items table
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM cart_items");
        $result = $stmt->fetch();
        echo "✅ Cart items table accessible - {$result['count']} cart items found<br>";
        
    } else {
        echo "❌ Database connection failed<br>";
    }
} catch (Exception $e) {
    echo "❌ Database error: " . $e->getMessage() . "<br>";
}

// Test API endpoints
echo "<h2>2. API Endpoints Test</h2>";

// Test get_cart endpoint
echo "<h3>Testing get_cart endpoint:</h3>";
$url = 'http://localhost/_The_Egyptian_Creativity/cart.php?action=get_cart';
$response = file_get_contents($url);
if ($response !== false) {
    $data = json_decode($response, true);
    if ($data && isset($data['success'])) {
        echo "✅ get_cart endpoint working - " . count($data['cart']) . " items in cart<br>";
    } else {
        echo "❌ get_cart endpoint error: " . $response . "<br>";
    }
} else {
    echo "❌ get_cart endpoint failed to connect<br>";
}

// Test get_recommended endpoint
echo "<h3>Testing get_recommended endpoint:</h3>";
$url = 'http://localhost/_The_Egyptian_Creativity/cart.php?action=get_recommended';
$response = file_get_contents($url);
if ($response !== false) {
    $data = json_decode($response, true);
    if ($data && isset($data['success'])) {
        echo "✅ get_recommended endpoint working - " . count($data['recommended_items']) . " recommended items<br>";
    } else {
        echo "❌ get_recommended endpoint error: " . $response . "<br>";
    }
} else {
    echo "❌ get_recommended endpoint failed to connect<br>";
}

// Test add_to_cart endpoint
echo "<h3>Testing add_to_cart endpoint:</h3>";
$postData = json_encode([
    'action' => 'add_to_cart',
    'product_id' => 1,
    'quantity' => 1
]);

$context = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => 'Content-Type: application/json',
        'content' => $postData
    ]
]);

$url = 'http://localhost/_The_Egyptian_Creativity/cart.php';
$response = file_get_contents($url, false, $context);
if ($response !== false) {
    $data = json_decode($response, true);
    if ($data && isset($data['success'])) {
        echo "✅ add_to_cart endpoint working<br>";
    } else {
        echo "❌ add_to_cart endpoint error: " . $response . "<br>";
    }
} else {
    echo "❌ add_to_cart endpoint failed to connect<br>";
}

echo "<h2>3. Database Tables Check</h2>";

try {
    // Check if all required tables exist
    $tables = ['users', 'products', 'cart_items', 'categories', 'wishlist_items'];
    
    foreach ($tables as $table) {
        $stmt = $pdo->query("SHOW TABLES LIKE '$table'");
        if ($stmt->rowCount() > 0) {
            echo "✅ Table '$table' exists<br>";
        } else {
            echo "❌ Table '$table' missing<br>";
        }
    }
    
    // Check sample data
    $stmt = $pdo->query("SELECT * FROM products LIMIT 3");
    $products = $stmt->fetchAll();
    echo "✅ Sample products: " . count($products) . " found<br>";
    
    foreach ($products as $product) {
        echo "- Product: {$product['name']} (ID: {$product['id']})<br>";
    }
    
} catch (Exception $e) {
    echo "❌ Database check error: " . $e->getMessage() . "<br>";
}

echo "<h2>4. Session Test</h2>";
session_start();
echo "Session ID: " . session_id() . "<br>";
echo "Session data: " . print_r($_SESSION, true) . "<br>";

echo "<h2>Test Complete!</h2>";
?> 