<?php
// Test script for profile API endpoints
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>Profile API Test</h1>";

// Test database connection
echo "<h2>1. Database Connection Test</h2>";
try {
    include 'includes/db.php';
    if (isset($pdo)) {
        echo "✅ Database connection successful<br>";
        
        // Test users table
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM users");
        $result = $stmt->fetch();
        echo "✅ Users table accessible - {$result['count']} users found<br>";
        
        // Test addresses table
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM addresses");
        $result = $stmt->fetch();
        echo "✅ Addresses table accessible - {$result['count']} addresses found<br>";
        
    } else {
        echo "❌ Database connection failed<br>";
    }
} catch (Exception $e) {
    echo "❌ Database error: " . $e->getMessage() . "<br>";
}

// Test API endpoints
echo "<h2>2. API Endpoints Test</h2>";

// Test get_profile endpoint
echo "<h3>Testing get_profile endpoint:</h3>";
$url = 'http://localhost/_The_Egyptian_Creativity/profile.php?action=get_profile';
$response = file_get_contents($url);
if ($response !== false) {
    $data = json_decode($response, true);
    if ($data && isset($data['success'])) {
        echo "✅ get_profile endpoint working<br>";
        if (isset($data['profile']['user'])) {
            echo "- User data available<br>";
        }
        if (isset($data['profile']['addresses'])) {
            echo "- Addresses data available (" . count($data['profile']['addresses']) . " addresses)<br>";
        }
        if (isset($data['profile']['stats'])) {
            echo "- Stats data available<br>";
        }
    } else {
        echo "❌ get_profile endpoint error: " . $response . "<br>";
    }
} else {
    echo "❌ get_profile endpoint failed to connect<br>";
}

// Test get_orders endpoint
echo "<h3>Testing get_orders endpoint:</h3>";
$url = 'http://localhost/_The_Egyptian_Creativity/profile.php?action=get_orders';
$response = file_get_contents($url);
if ($response !== false) {
    $data = json_decode($response, true);
    if ($data && isset($data['success'])) {
        echo "✅ get_orders endpoint working - " . count($data['orders']) . " orders found<br>";
    } else {
        echo "❌ get_orders endpoint error: " . $response . "<br>";
    }
} else {
    echo "❌ get_orders endpoint failed to connect<br>";
}

// Test get_addresses endpoint
echo "<h3>Testing get_addresses endpoint:</h3>";
$url = 'http://localhost/_The_Egyptian_Creativity/profile.php?action=get_addresses';
$response = file_get_contents($url);
if ($response !== false) {
    $data = json_decode($response, true);
    if ($data && isset($data['success'])) {
        echo "✅ get_addresses endpoint working - " . count($data['addresses']) . " addresses found<br>";
    } else {
        echo "❌ get_addresses endpoint error: " . $response . "<br>";
    }
} else {
    echo "❌ get_addresses endpoint failed to connect<br>";
}

// Test update_profile endpoint
echo "<h3>Testing update_profile endpoint:</h3>";
$postData = json_encode([
    'action' => 'update_profile',
    'full_name' => 'Test User',
    'phone' => '+1234567890',
    'email' => 'test@example.com'
]);

$context = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => 'Content-Type: application/json',
        'content' => $postData
    ]
]);

$url = 'http://localhost/_The_Egyptian_Creativity/profile.php';
$response = file_get_contents($url, false, $context);
if ($response !== false) {
    $data = json_decode($response, true);
    if ($data && isset($data['success'])) {
        echo "✅ update_profile endpoint working<br>";
    } else {
        echo "❌ update_profile endpoint error: " . $response . "<br>";
    }
} else {
    echo "❌ update_profile endpoint failed to connect<br>";
}

// Test add_address endpoint
echo "<h3>Testing add_address endpoint:</h3>";
$postData = json_encode([
    'action' => 'add_address',
    'recipient_name' => 'Test Recipient',
    'phone' => '+1234567890',
    'address_line1' => '123 Test Street',
    'city' => 'Test City',
    'country' => 'Test Country',
    'is_default' => true
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
        echo "✅ add_address endpoint working<br>";
    } else {
        echo "❌ add_address endpoint error: " . $response . "<br>";
    }
} else {
    echo "❌ add_address endpoint failed to connect<br>";
}

echo "<h2>3. Database Tables Check</h2>";

try {
    // Check if all required tables exist
    $tables = ['users', 'addresses', 'orders', 'order_items'];
    
    foreach ($tables as $table) {
        $stmt = $pdo->query("SHOW TABLES LIKE '$table'");
        if ($stmt->rowCount() > 0) {
            echo "✅ Table '$table' exists<br>";
        } else {
            echo "❌ Table '$table' missing<br>";
        }
    }
    
    // Check sample data
    $stmt = $pdo->query("SELECT * FROM users LIMIT 3");
    $users = $stmt->fetchAll();
    echo "✅ Sample users: " . count($users) . " found<br>";
    
    foreach ($users as $user) {
        echo "- User: {$user['username']} (ID: {$user['id']})<br>";
    }
    
    // Check addresses
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM addresses");
    $result = $stmt->fetch();
    echo "✅ Addresses: {$result['count']} found<br>";
    
} catch (Exception $e) {
    echo "❌ Database check error: " . $e->getMessage() . "<br>";
}

echo "<h2>4. Session Test</h2>";
session_start();
echo "Session ID: " . session_id() . "<br>";
echo "Session data: " . print_r($_SESSION, true) . "<br>";

echo "<h2>5. API Response Format Test</h2>";

// Test profile response format
$url = 'http://localhost/_The_Egyptian_Creativity/profile.php?action=get_profile';
$response = file_get_contents($url);
if ($response !== false) {
    $data = json_decode($response, true);
    if ($data && isset($data['success'])) {
        echo "✅ Profile response format correct<br>";
        if (isset($data['profile']['user'])) {
            $user = $data['profile']['user'];
            $required_fields = ['id', 'username', 'email', 'created_at'];
            $missing_fields = [];
            foreach ($required_fields as $field) {
                if (!isset($user[$field])) {
                    $missing_fields[] = $field;
                }
            }
            if (empty($missing_fields)) {
                echo "✅ User data structure correct<br>";
            } else {
                echo "❌ Missing fields in user data: " . implode(', ', $missing_fields) . "<br>";
            }
        }
    } else {
        echo "❌ Profile response format incorrect<br>";
    }
}

echo "<h2>Test Complete!</h2>";
?> 