<?php
// Test script for wishlist API endpoints
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>Wishlist API Test</h1>";

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
        
        // Test wishlist_items table
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM wishlist_items");
        $result = $stmt->fetch();
        echo "✅ Wishlist items table accessible - {$result['count']} wishlist items found<br>";
        
    } else {
        echo "❌ Database connection failed<br>";
    }
} catch (Exception $e) {
    echo "❌ Database error: " . $e->getMessage() . "<br>";
}

// Test API endpoints
echo "<h2>2. API Endpoints Test</h2>";

// Test get_wishlist endpoint
echo "<h3>Testing get_wishlist endpoint:</h3>";
$url = 'http://localhost/_The_Egyptian_Creativity/wishlist.php?action=get_wishlist';
$response = file_get_contents($url);
if ($response !== false) {
    $data = json_decode($response, true);
    if ($data && isset($data['success'])) {
        echo "✅ get_wishlist endpoint working - " . count($data['wishlist']) . " items in wishlist<br>";
    } else {
        echo "❌ get_wishlist endpoint error: " . $response . "<br>";
    }
} else {
    echo "❌ get_wishlist endpoint failed to connect<br>";
}

// Test get_recommended endpoint
echo "<h3>Testing get_recommended endpoint:</h3>";
$url = 'http://localhost/_The_Egyptian_Creativity/wishlist.php?action=get_recommended';
$response = file_get_contents($url);
if ($response !== false) {
    $data = json_decode($response, true);
    if ($data && isset($data['success'])) {
        echo "✅ get_recommended endpoint working - " . count($data['recommended']) . " recommended items<br>";
    } else {
        echo "❌ get_recommended endpoint error: " . $response . "<br>";
    }
} else {
    echo "❌ get_recommended endpoint failed to connect<br>";
}

// Test add_to_wishlist endpoint
echo "<h3>Testing add_to_wishlist endpoint:</h3>";
$postData = json_encode([
    'action' => 'add_to_wishlist',
    'product_id' => 1
]);

$context = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => 'Content-Type: application/json',
        'content' => $postData
    ]
]);

$url = 'http://localhost/_The_Egyptian_Creativity/wishlist.php';
$response = file_get_contents($url, false, $context);
if ($response !== false) {
    $data = json_decode($response, true);
    if ($data && isset($data['success'])) {
        echo "✅ add_to_wishlist endpoint working<br>";
    } else {
        echo "❌ add_to_wishlist endpoint error: " . $response . "<br>";
    }
} else {
    echo "❌ add_to_wishlist endpoint failed to connect<br>";
}

// Test remove_from_wishlist endpoint
echo "<h3>Testing remove_from_wishlist endpoint:</h3>";
$postData = json_encode([
    'action' => 'remove_from_wishlist',
    'product_id' => 1
]);

$context = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => 'Content-Type: application/json',
        'content' => $postData
    ]
]);

$response = file_get_contents($url, false, $context);
if ($response !== false) {
    $data = json_decode($response, true);
    if ($data && isset($data['success'])) {
        echo "✅ remove_from_wishlist endpoint working<br>";
    } else {
        echo "❌ remove_from_wishlist endpoint error: " . $response . "<br>";
    }
} else {
    echo "❌ remove_from_wishlist endpoint failed to connect<br>";
}

echo "<h2>3. Database Tables Check</h2>";

try {
    // Check if all required tables exist
    $tables = ['users', 'products', 'wishlist_items', 'categories'];
    
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
    
    // Check wishlist items
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM wishlist_items");
    $result = $stmt->fetch();
    echo "✅ Wishlist items: {$result['count']} found<br>";
    
} catch (Exception $e) {
    echo "❌ Database check error: " . $e->getMessage() . "<br>";
}

echo "<h2>4. Session Test</h2>";
session_start();
echo "Session ID: " . session_id() . "<br>";
echo "Session data: " . print_r($_SESSION, true) . "<br>";

echo "<h2>5. API Response Format Test</h2>";

// Test wishlist response format
$url = 'http://localhost/_The_Egyptian_Creativity/wishlist.php?action=get_wishlist';
$response = file_get_contents($url);
if ($response !== false) {
    $data = json_decode($response, true);
    if ($data && isset($data['success']) && isset($data['wishlist'])) {
        echo "✅ Wishlist response format correct<br>";
        if (count($data['wishlist']) > 0) {
            $item = $data['wishlist'][0];
            $required_fields = ['id', 'product_id', 'name', 'price', 'image'];
            $missing_fields = [];
            foreach ($required_fields as $field) {
                if (!isset($item[$field])) {
                    $missing_fields[] = $field;
                }
            }
            if (empty($missing_fields)) {
                echo "✅ Wishlist item structure correct<br>";
            } else {
                echo "❌ Missing fields in wishlist item: " . implode(', ', $missing_fields) . "<br>";
            }
        }
    } else {
        echo "❌ Wishlist response format incorrect<br>";
    }
}

echo "<h2>Test Complete!</h2>";
?> 