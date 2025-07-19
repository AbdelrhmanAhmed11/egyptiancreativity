<?php
session_start();
require_once '../includes/db.php';

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    
    // Simple admin authentication (in production, use proper hashing)
    if ($username === 'admin' && $password === 'admin123') {
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_username'] = $username;
        header('Location: index.php');
        exit();
    } else {
        $error = 'Invalid username or password';
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login - Egyptian Creativity</title>
    <link rel="stylesheet" href="css/admin-styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body.login-page {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
        }
        
        body.login-page::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23eac85b" opacity="0.03"/><circle cx="75" cy="75" r="1" fill="%23eac85b" opacity="0.03"/><circle cx="50" cy="10" r="0.5" fill="%23eac85b" opacity="0.02"/><circle cx="10" cy="50" r="0.5" fill="%23eac85b" opacity="0.02"/><circle cx="90" cy="30" r="0.5" fill="%23eac85b" opacity="0.02"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>') repeat;
            pointer-events: none;
        }
        
        .login-container {
            width: 100%;
            max-width: 800px;
            padding: 2rem;
            position: relative;
            z-index: 1;
        }
        
        .login-card {
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            border-radius: 24px;
            box-shadow: 
                0 32px 64px rgba(0, 0, 0, 0.3),
                0 16px 32px rgba(0, 0, 0, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.1);
            overflow: hidden;
            position: relative;
            animation: slideUp 0.8s ease-out;
        }
        
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(40px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .login-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 6px;
            background: linear-gradient(90deg, #eac85b 0%, #d4b84a 50%, #eac85b 100%);
            background-size: 200% 100%;
            animation: shimmer 3s ease-in-out infinite;
        }
        
        @keyframes shimmer {
            0%, 100% { background-position: 200% 0; }
            50% { background-position: -200% 0; }
        }
        
        .login-header {
            text-align: center;
            padding: 3rem 5rem 2rem;
            background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
            position: relative;
        }
        
        .login-header::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 1px;
            background: linear-gradient(90deg, transparent, #eac85b, transparent);
        }
        
        .logo {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 16px;
            margin-bottom: 2rem;
            animation: fadeIn 1s ease-out 0.3s both;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .logo-img {
            width: 56px;
            height: 56px;
            object-fit: contain;
            filter: drop-shadow(0 4px 8px rgba(234, 200, 91, 0.3));
            transition: transform 0.3s ease;
        }
        
        .logo:hover .logo-img {
            transform: scale(1.05) rotate(2deg);
        }
        
        .logo-text {
            text-align: left;
        }
        
        .logo-main {
            font-family: 'Playfair Display', serif;
            font-size: 1.25rem;
            font-weight: 700;
            color: #8d4c13;
            line-height: 1.2;
            letter-spacing: 1px;
        }
        
        .logo-sub {
            font-family: 'Playfair Display', serif;
            font-size: 0.875rem;
            font-weight: 400;
            color: #eac85b;
            letter-spacing: 2px;
            margin-top: 2px;
        }
        
        .login-header h1 {
            font-family: 'Playfair Display', serif;
            font-size: 2rem;
            font-weight: 600;
            color: #333;
            margin-bottom: 0.75rem;
            animation: fadeIn 1s ease-out 0.5s both;
        }
        
        .login-header p {
            color: #666;
            font-size: 0.95rem;
            font-weight: 400;
            line-height: 1.5;
            animation: fadeIn 1s ease-out 0.7s both;
        }
        
        .error-message {
            margin: 1.5rem 5rem 0;
            padding: 1rem 1.25rem;
            background: linear-gradient(135deg, #fee 0%, #fdd 100%);
            color: #c53030;
            border-radius: 12px;
            border: 1px solid #fed7d7;
            font-size: 0.875rem;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
            animation: shake 0.5s ease-in-out;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-4px); }
            75% { transform: translateX(4px); }
        }
        
        .error-message::before {
            content: '⚠';
            font-size: 1.1rem;
        }
        
        .login-form {
            padding: 2rem 5rem;
        }
        
        .form-group {
            margin-bottom: 1.75rem;
            animation: fadeIn 1s ease-out 0.9s both;
        }
        
        .form-group:last-child {
            margin-bottom: 0;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.75rem;
            font-weight: 600;
            color: #333;
            font-size: 0.875rem;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }
        
        .input-wrapper {
            position: relative;
            display: flex;
            align-items: center;
        }
        
        .input-wrapper svg {
            position: absolute;
            left: 16px;
            color: #999;
            z-index: 2;
            transition: color 0.3s ease;
        }
        
        .input-wrapper input {
            width: 100%;
            padding: 16px 16px 16px 52px;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            font-size: 1rem;
            font-weight: 400;
            background: #fff;
            transition: all 0.3s ease;
            outline: none;
        }
        
        .input-wrapper input:focus {
            border-color: #eac85b;
            box-shadow: 0 0 0 4px rgba(234, 200, 91, 0.1);
            transform: translateY(-1px);
        }
        
        .input-wrapper input:focus + svg,
        .input-wrapper:hover svg {
            color: #eac85b;
        }
        
        .input-wrapper input::placeholder {
            color: #a0aec0;
        }
        
        .login-btn {
            width: 100%;
            padding: 16px 24px;
            background: linear-gradient(135deg, #eac85b 0%, #d4b84a 100%);
            color: #fff;
            border: none;
            border-radius: 12px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            margin-top: 2rem;
            position: relative;
            overflow: hidden;
            animation: fadeIn 1s ease-out 1.1s both;
        }
        
        .login-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s ease;
        }
        
        .login-btn:hover::before {
            left: 100%;
        }
        
        .login-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(234, 200, 91, 0.4);
        }
        
        .login-btn:active {
            transform: translateY(0);
        }
        
        .login-btn svg {
            transition: transform 0.3s ease;
        }
        
        .login-btn:hover svg {
            transform: translateX(4px);
        }
        
        .login-footer {
            padding: 1.5rem 5rem 2.5rem;
            text-align: center;
            background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
            border-top: 1px solid #f0f0f0;
            animation: fadeIn 1s ease-out 1.3s both;
        }
        
        .back-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: #666;
            text-decoration: none;
            font-size: 0.875rem;
            font-weight: 500;
            transition: all 0.3s ease;
            padding: 8px 16px;
            border-radius: 8px;
        }
        
        .back-link:hover {
            color: #eac85b;
            background: rgba(234, 200, 91, 0.1);
            transform: translateX(-4px);
        }
        
        .back-link svg {
            transition: transform 0.3s ease;
        }
        
        .back-link:hover svg {
            transform: translateX(-2px);
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .login-container {
                padding: 1rem;
                max-width: 600px;
            }
            
            .login-header {
                padding: 2rem 3rem 1.5rem;
            }
            
            .login-header h1 {
                font-size: 1.75rem;
            }
            
            .logo {
                gap: 12px;
                margin-bottom: 1.5rem;
            }
            
            .logo-img {
                width: 48px;
                height: 48px;
            }
            
            .logo-main {
                font-size: 1.1rem;
            }
            
            .logo-sub {
                font-size: 0.8rem;
            }
            
            .login-form {
                padding: 1.5rem 3rem;
            }
            
            .login-footer {
                padding: 1.25rem 3rem 2rem;
            }
            
            .error-message {
                margin: 1rem 3rem 0;
                padding: 0.875rem 1rem;
            }
        }
        
        @media (max-width: 480px) {
            .login-container {
                padding: 0.5rem;
                max-width: 500px;
            }
            
            .login-card {
                border-radius: 16px;
            }
            
            .login-header {
                padding: 1.5rem 1.5rem 1rem;
            }
            
            .login-header h1 {
                font-size: 1.5rem;
            }
            
            .login-form {
                padding: 1rem 1.5rem;
            }
            
            .login-footer {
                padding: 1rem 1.5rem 1.5rem;
            }
            
            .form-group {
                margin-bottom: 1.5rem;
            }
            
            .input-wrapper input {
                padding: 14px 14px 14px 48px;
                font-size: 0.95rem;
            }
            
            .input-wrapper svg {
                left: 14px;
                width: 18px;
                height: 18px;
            }
            
            .login-btn {
                padding: 14px 20px;
                font-size: 0.95rem;
            }
        }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            body.login-page {
                background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
            }
            
            .login-card {
                background: rgba(30, 30, 30, 0.95);
                border: 1px solid rgba(255, 255, 255, 0.05);
            }
            
            .login-header {
                background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
            }
            
            .login-header h1 {
                color: #fff;
            }
            
            .login-header p {
                color: #ccc;
            }
            
            .form-group label {
                color: #fff;
            }
            
            .input-wrapper input {
                background: #2a2a2a;
                border-color: #404040;
                color: #fff;
            }
            
            .input-wrapper input:focus {
                border-color: #eac85b;
                background: #333;
            }
            
            .login-footer {
                background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
                border-top-color: #333;
            }
            
            .back-link {
                color: #ccc;
            }
            
            .back-link:hover {
                color: #eac85b;
                background: rgba(234, 200, 91, 0.1);
            }
        }
        
        /* High contrast mode */
        @media (prefers-contrast: high) {
            .login-card {
                border: 2px solid #000;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
            }
            
            .input-wrapper input {
                border-width: 2px;
            }
            
            .login-btn {
                border: 2px solid #000;
            }
        }
        
        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    </style>
</head>
<body class="login-page">
    <div class="login-container">
        <div class="login-card">
            <div class="login-header">
                <div class="logo">
                    <img src="../images/logo_.png" alt="Egyptian Creativity" class="logo-img">
                    <div class="logo-text">
                        <div class="logo-main">THE EGYPTIAN</div>
                        <div class="logo-sub">CREATIVITY</div>
                    </div>
                </div>
                <h1>Admin Portal</h1>
                <p>Secure access to your creative empire</p>
            </div>
            
            <?php if ($error): ?>
            <div class="error-message">
                <?php echo htmlspecialchars($error); ?>
            </div>
            <?php endif; ?>
            
            <form method="POST" class="login-form">
                <div class="form-group">
                    <label for="username">Username</label>
                    <div class="input-wrapper">
                        <input type="text" id="username" name="username" placeholder="Enter your username" required>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="password">Password</label>
                    <div class="input-wrapper">
                        <input type="password" id="password" name="password" placeholder="Enter your password" required>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <circle cx="12" cy="16" r="1"></circle>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                    </div>
                </div>
                
                <button type="submit" class="login-btn">
                    <span>Access Dashboard</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                        <polyline points="10,17 15,12 10,7"></polyline>
                        <line x1="15" y1="12" x2="3" y2="12"></line>
                    </svg>
                </button>
            </form>
            
            <div class="login-footer">
                <a href="../index.php" class="back-link">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Return to Website
                </a>
            </div>
        </div>
    </div>
</body>
</html>