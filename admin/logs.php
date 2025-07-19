<?php
session_start();
require_once '../includes/db.php';

// Check if admin is logged in
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: login.php');
    exit();
}

// Initialize variables
$error_message = '';
$logs = [];
$total_logs = 0;
$total_pages = 1;

// Pagination parameters
$page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
$per_page = 25;
$offset = ($page - 1) * $per_page;

try {
    // Get total count of logs
    $count_stmt = $pdo->prepare("SELECT COUNT(*) FROM audit_logs");
    $count_stmt->execute();
    $total_logs = $count_stmt->fetchColumn();
    $total_pages = ceil($total_logs / $per_page);
    
    // Ensure page is within valid range
    if ($page > $total_pages && $total_pages > 0) {
        $page = $total_pages;
        $offset = ($page - 1) * $per_page;
    }
    
    // Fetch logs with user information
    $stmt = $pdo->prepare("
        SELECT 
            l.id,
            l.table_name,
            l.record_id,
            l.action,
            l.old_values,
            l.new_values,
            l.created_at,
            l.changed_by,
            COALESCE(u.full_name, 'System') as user_name,
            u.email as user_email
        FROM audit_logs l 
        LEFT JOIN users u ON l.changed_by = u.id 
        ORDER BY l.created_at DESC 
        LIMIT ? OFFSET ?
    ");
    $stmt->bindValue(1, $per_page, PDO::PARAM_INT);
    $stmt->bindValue(2, $offset, PDO::PARAM_INT);
    $stmt->execute();
    $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
} catch (PDOException $e) {
    $error_message = 'Error loading logs: ' . $e->getMessage();
}

// Function to format date
function formatLogDate($date) {
    $timestamp = strtotime($date);
    $now = time();
    $diff = $now - $timestamp;
    
    if ($diff < 3600) { // Less than 1 hour
        return floor($diff / 60) . ' min ago';
    } elseif ($diff < 86400) { // Less than 1 day
        return floor($diff / 3600) . ' hours ago';
    } elseif ($diff < 604800) { // Less than 1 week
        return floor($diff / 86400) . ' days ago';
    } else {
        return date('M j, Y H:i', $timestamp);
    }
}

// Function to truncate long text
function truncateText($text, $length = 100) {
    if (strlen($text) <= $length) {
        return $text;
    }
    return substr($text, 0, $length) . '...';
}

// Function to get action badge class
function getActionBadgeClass($action) {
    switch (strtolower($action)) {
        case 'create':
        case 'insert':
            return 'badge-success';
        case 'update':
        case 'edit':
            return 'badge-warning';
        case 'delete':
        case 'remove':
            return 'badge-danger';
        default:
            return 'badge-info';
    }
}

function render_log_diff($old_json, $new_json) {
    $old = $old_json ? json_decode($old_json, true) : [];
    $new = $new_json ? json_decode($new_json, true) : [];
    if (!$old && !$new) return 'No details';
    $fields = array_unique(array_merge(array_keys($old), array_keys($new)));
    $lines = [];
    foreach ($fields as $field) {
        $old_val = isset($old[$field]) ? $old[$field] : '';
        $new_val = isset($new[$field]) ? $new[$field] : '';
        if ($old_val != $new_val && $old_val !== '' && $new_val !== '') {
            $lines[] = htmlspecialchars(ucfirst($field)) . ': changed from ' . htmlspecialchars($old_val) . ' to ' . htmlspecialchars($new_val);
        }
    }
    return $lines ? implode('<br>', $lines) : 'No changes';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>System Logs - Egyptian Creativity</title>
    <link rel="stylesheet" href="css/admin-styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <style>
        .logs-container {
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.06);
            overflow: hidden;
            margin-bottom: 2rem;
        }
        
        .logs-header {
            background: #f8f9fa;
            padding: 1.5rem;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
        }
        
        .logs-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: #333;
            margin: 0;
        }
        
        .logs-stats {
            font-size: 0.875rem;
            color: #666;
        }
        
        .logs-table {
            width: 100%;
            border-collapse: collapse;
            background: #fff;
        }
        
        .logs-table th,
        .logs-table td {
            padding: 12px 16px;
            border-bottom: 1px solid #eee;
            text-align: left;
            vertical-align: top;
        }
        
        .logs-table th {
            background: #f8f9fa;
            font-weight: 600;
            color: #333;
            font-size: 0.875rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            position: sticky;
            top: 0;
            z-index: 10;
        }
        
        .logs-table tr:last-child td {
            border-bottom: none;
        }
        
        .logs-table tr:hover {
            background: #f8f9fa;
        }
        
        .action-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .badge-success {
            background: #d4edda;
            color: #155724;
        }
        
        .badge-warning {
            background: #fff3cd;
            color: #856404;
        }
        
        .badge-danger {
            background: #f8d7da;
            color: #721c24;
        }
        
        .badge-info {
            background: #d1ecf1;
            color: #0c5460;
        }
        
        .user-info {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .user-avatar {
            width: 32px;
            height: 32px;
            background: #eac85b;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-weight: 600;
            font-size: 0.875rem;
        }
        
        .user-details {
            display: flex;
            flex-direction: column;
        }
        
        .user-name {
            font-weight: 500;
            color: #333;
            font-size: 0.875rem;
        }
        
        .user-email {
            font-size: 0.75rem;
            color: #666;
        }
        
        .log-details {
            max-width: 300px;
            font-size: 0.875rem;
            line-height: 1.4;
        }
        
        .log-details-item {
            margin-bottom: 4px;
        }
        
        .log-details-label {
            font-weight: 500;
            color: #666;
        }
        
        .log-details-value {
            color: #333;
            word-break: break-word;
        }
        
        .pagination {
            display: flex;
            gap: 8px;
            justify-content: center;
            align-items: center;
            margin: 2rem 0;
            flex-wrap: wrap;
        }
        
        .pagination-info {
            font-size: 0.875rem;
            color: #666;
            margin-right: 1rem;
        }
        
        .pagination a,
        .pagination span {
            padding: 8px 12px;
            border-radius: 6px;
            background: #f8f9fa;
            color: #8d4c13;
            text-decoration: none;
            font-weight: 500;
            border: 1px solid #e9ecef;
            transition: all 0.2s ease;
        }
        
        .pagination a:hover {
            background: #e9ecef;
            transform: translateY(-1px);
        }
        
        .pagination a.active,
        .pagination span.current {
            background: #eac85b;
            color: #fff;
            border-color: #eac55b;
        }
        
        .pagination .disabled {
            opacity: 0.5;
            pointer-events: none;
        }
        
        .empty-state {
            text-align: center;
            padding: 3rem 2rem;
            color: #666;
        }
        
        .empty-state-icon {
            width: 64px;
            height: 64px;
            margin: 0 auto 1rem;
            opacity: 0.3;
        }
        
        .empty-state-text {
            font-size: 1.125rem;
            margin-bottom: 0.5rem;
        }
        
        .empty-state-subtext {
            font-size: 0.875rem;
            opacity: 0.7;
        }
        
        .error-message {
            background: #f8d7da;
            color: #721c24;
            padding: 1rem;
            border-radius: 6px;
            margin-bottom: 1rem;
            border: 1px solid #f5c6cb;
        }
        
        .table-responsive {
            overflow-x: auto;
        }
        
        @media (max-width: 768px) {
            .logs-header {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .logs-table th,
            .logs-table td {
                padding: 8px 12px;
                font-size: 0.875rem;
            }
            
            .pagination {
                justify-content: center;
            }
            
            .pagination-info {
                margin: 0 0 1rem 0;
                text-align: center;
                width: 100%;
            }
            
            .user-info {
                flex-direction: column;
                align-items: flex-start;
                gap: 4px;
            }
            
            .log-details {
                max-width: 200px;
            }
        }
        
        @media (max-width: 480px) {
            .logs-table {
                font-size: 0.75rem;
            }
            
            .logs-table th,
            .logs-table td {
                padding: 6px 8px;
            }
            
            .user-avatar {
                width: 24px;
                height: 24px;
                font-size: 0.75rem;
            }
        }
    </style>
</head>
<body>
    <div class="admin-container">
        <aside class="admin-sidebar">
            <div class="sidebar-header">
                <div class="logo">
                    <img src="../images/logo_.png" alt="Egyptian Creativity" class="logo-img">
                    <div class="logo-text">
                        <div class="logo-main">THE EGYPTIAN</div>
                        <div class="logo-sub">CREATIVITY</div>
                    </div>
                </div>
                <div class="admin-info">
                    <div class="admin-avatar">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </div>
                    <div class="admin-details">
                        <div class="admin-name">Admin Panel</div>
                        <div class="admin-role">Administrator</div>
                    </div>
                </div>
            </div>
            <nav class="sidebar-nav">
                <a href="index.php" class="nav-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9,22 9,12 15,12 15,22"></polyline>
                    </svg>
                    Dashboard
                </a>
                <a href="products.php" class="nav-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                    Products
                </a>
                <a href="gallery.php" class="nav-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21,15 16,10 5,21"></polyline>
                    </svg>
                    Gallery
                </a>
                <a href="blogs.php" class="nav-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14,2 14,8 20,8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10,9 9,9 8,9"></polyline>
                    </svg>
                    Blogs
                </a>
                <a href="masterpieces.php" class="nav-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="12 2 15 8.5 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 9 8.5 12 2"></polygon>
                    </svg>
                    Masterpieces
                </a>
                <a href="orders.php" class="nav-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                    Orders
                </a>
                <a href="analytics.php" class="nav-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="9" y1="17" x2="9" y2="13"></line>
                        <line x1="15" y1="17" x2="15" y2="7"></line>
                        <line x1="12" y1="17" x2="12" y2="10"></line>
                    </svg>
                    Analytics
                </a>
                <a href="logs.php" class="nav-item active">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="8" y1="8" x2="16" y2="8"></line>
                        <line x1="8" y1="12" x2="16" y2="12"></line>
                        <line x1="8" y1="16" x2="16" y2="16"></line>
                    </svg>
                    Logs
                </a>
                <a href="settings.php" class="nav-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                    Settings
                </a>
            </nav>
            <div class="sidebar-footer">
                <a href="logout.php" class="logout-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16,17 21,12 16,7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Logout
                </a>
            </div>
        </aside>
        
        <main class="admin-main">
            <header class="admin-header">
                <div class="header-content">
                    <h1 class="page-title">System Logs</h1>
                </div>
            </header>
            
            <div class="admin-content">
                <?php if ($error_message): ?>
                    <div class="error-message">
                        <?php echo htmlspecialchars($error_message); ?>
                    </div>
                <?php endif; ?>
                
                <div class="logs-container">
                    <div class="logs-header">
                        <h2 class="logs-title">Audit Trail</h2>
                        <div class="logs-stats">
                            <?php if ($total_logs > 0): ?>
                                Showing <?php echo $offset + 1; ?>-<?php echo min($offset + $per_page, $total_logs); ?> of <?php echo $total_logs; ?> logs
                            <?php else: ?>
                                No logs found
                            <?php endif; ?>
                        </div>
                    </div>
                    
                    <?php if (!empty($logs)): ?>
                        <div class="table-responsive">
                            <table class="logs-table">
                                <thead>
                                    <tr>
                                        <th>Date & Time</th>
                                        <th>User</th>
                                        <th>Action</th>
                                        <th>Table</th>
                                        <th>Record ID</th>
                                        <th>Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($logs as $log): ?>
                                    <tr>
                                        <td>
                                            <div style="font-weight: 500; margin-bottom: 2px;">
                                                <?php echo formatLogDate($log['created_at']); ?>
                                            </div>
                                            <div style="font-size: 0.75rem; color: #666;">
                                                <?php echo date('M j, Y H:i:s', strtotime($log['created_at'])); ?>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="user-info">
                                                <div class="user-avatar">
                                                    <?php echo strtoupper(substr($log['user_name'], 0, 1)); ?>
                                                </div>
                                                <div class="user-details">
                                                    <div class="user-name"><?php echo htmlspecialchars($log['user_name']); ?></div>
                                                    <?php if (!empty($log['user_email'])): ?>
                                                        <div class="user-email"><?php echo htmlspecialchars($log['user_email']); ?></div>
                                                    <?php endif; ?>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span class="action-badge <?php echo getActionBadgeClass($log['action']); ?>">
                                                <?php echo htmlspecialchars($log['action']); ?>
                                            </span>
                                        </td>
                                        <td>
                                            <code style="background: #f8f9fa; padding: 2px 6px; border-radius: 4px; font-size: 0.875rem;">
                                                <?php echo htmlspecialchars($log['table_name']); ?>
                                            </code>
                                        </td>
                                        <td>
                                            <span style="font-family: monospace; font-weight: 500;">
                                                #<?php echo htmlspecialchars($log['record_id']); ?>
                                            </span>
                                        </td>
                                        <td>
                                            <?php echo render_log_diff($log['old_values'], $log['new_values']); ?>
                                        </td>
                                    </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                    <?php else: ?>
                        <div class="empty-state">
                            <svg class="empty-state-icon" viewBox="0 0 64 64" fill="currentColor">
                                <path d="M32 8C18.745 8 8 18.745 8 32s10.745 24 24 24 24-10.745 24-24S45.255 8 32 8zm0 44c-11.028 0-20-8.972-20-20s8.972-20 20-20 20 8.972 20 20-8.972 20-20 20z"/>
                                <path d="M32 16c-1.105 0-2 .895-2 2v12c0 1.105.895 2 2 2s2-.895 2-2V18c0-1.105-.895-2-2-2zM32 38c-1.105 0-2 .895-2 2v2c0 1.105.895 2 2 2s2-.895 2-2v-2c0-1.105-.895-2-2-2z"/>
                            </svg>
                            <div class="empty-state-text">No logs found</div>
                            <div class="empty-state-subtext">System activity will appear here when actions are performed</div>
                        </div>
                    <?php endif; ?>
                </div>
                
                <?php if ($total_pages > 1): ?>
                    <div class="pagination">
                        <div class="pagination-info">
                            Page <?php echo $page; ?> of <?php echo $total_pages; ?>
                        </div>
                        
                        <?php if ($page > 1): ?>
                            <a href="?page=1" title="First page">&laquo;</a>
                            <a href="?page=<?php echo $page - 1; ?>" title="Previous page">&lsaquo;</a>
                        <?php else: ?>
                            <span class="disabled">&laquo;</span>
                            <span class="disabled">&lsaquo;</span>
                        <?php endif; ?>
                        
                        <?php
                        $start = max(1, $page - 2);
                        $end = min($total_pages, $page + 2);
                        
                        if ($start > 1): ?>
                            <a href="?page=1">1</a>
                            <?php if ($start > 2): ?>
                                <span>...</span>
                            <?php endif; ?>
                        <?php endif; ?>
                        
                        <?php for ($i = $start; $i <= $end; $i++): ?>
                            <?php if ($i == $page): ?>
                                <span class="current"><?php echo $i; ?></span>
                            <?php else: ?>
                                <a href="?page=<?php echo $i; ?>"><?php echo $i; ?></a>
                            <?php endif; ?>
                        <?php endfor; ?>
                        
                        <?php if ($end < $total_pages): ?>
                            <?php if ($end < $total_pages - 1): ?>
                                <span>...</span>
                            <?php endif; ?>
                            <a href="?page=<?php echo $total_pages; ?>"><?php echo $total_pages; ?></a>
                        <?php endif; ?>
                        
                        <?php if ($page < $total_pages): ?>
                            <a href="?page=<?php echo $page + 1; ?>" title="Next page">&rsaquo;</a>
                            <a href="?page=<?php echo $total_pages; ?>" title="Last page">&raquo;</a>
                        <?php else: ?>
                            <span class="disabled">&rsaquo;</span>
                            <span class="disabled">&raquo;</span>
                        <?php endif; ?>
                    </div>
                <?php endif; ?>
            </div>
        </main>
    </div>
</body>
</html>