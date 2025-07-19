# Egyptian Creativity - Admin Dashboard

## Overview
The admin dashboard provides comprehensive management tools for the Egyptian Creativity website, allowing administrators to manage products, gallery items, blogs, orders, and system settings.

## Access Information
- **URL**: `http://localhost/_The_Egyptian_Creativity/admin/`
- **Username**: `admin`
- **Password**: `admin123`

## Features

### 🔐 Authentication
- Secure login system with session management
- Automatic logout after session timeout
- Protected admin routes

### 📊 Dashboard
- Overview statistics (products, gallery items, blogs, orders)
- Quick action buttons
- Recent orders display
- Responsive design

### 🛍️ Products Management
- **Add Products**: Upload images, set prices, categories, stock levels
- **Edit Products**: Modify existing product information
- **Delete Products**: Remove products with confirmation
- **Search & Filter**: Find products quickly
- **Status Management**: Activate/deactivate products

**Categories Available:**
- Jewelry
- Decorations
- Accessories
- Boxes
- Games
- Masks

### 🖼️ Gallery Management
- **Add Gallery Items**: Upload images with titles and descriptions
- **Edit Gallery Items**: Modify gallery content
- **Delete Gallery Items**: Remove items with confirmation
- **Category Organization**: Organize by categories
- **Status Control**: Show/hide gallery items

### 📝 Blogs Management
- **Add Blog Posts**: Create new blog posts with rich content
- **Edit Blog Posts**: Modify existing posts
- **Delete Blog Posts**: Remove posts with confirmation
- **Author Management**: Set blog authors
- **Status Control**: Draft/Published status
- **Image Support**: Add featured images to posts

### 📦 Orders Management
- **View Orders**: See all customer orders
- **Order Details**: View complete order information
- **Status Updates**: Update order status (pending, processing, completed, cancelled)
- **Delete Orders**: Remove orders with confirmation
- **Customer Information**: View customer details

### ⚙️ Settings
- **Admin Account**: Update admin password
- **System Information**: View system details
- **Database Status**: Check database connectivity

## File Structure

```
admin/
├── index.php          # Dashboard overview
├── login.php          # Admin login
├── logout.php         # Logout functionality
├── products.php       # Products management
├── gallery.php        # Gallery management
├── blogs.php          # Blogs management
├── orders.php         # Orders management
├── settings.php       # Settings page
├── css/
│   └── admin-styles.css  # Admin styling
├── js/
│   └── admin-script.js   # Admin JavaScript
└── README.md          # This file
```

## Database Tables

### Products Table
```sql
CREATE TABLE products (
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
```

### Gallery Items Table
```sql
CREATE TABLE gallery_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Blogs Table
```sql
CREATE TABLE blogs (
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
```

### Orders Table
```sql
CREATE TABLE orders (
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
```

## Image Storage

Images are stored in the following directories:
- **Products**: `images/products/`
- **Gallery**: `images/gallery/`
- **Blogs**: `images/blogs/`

## Security Features

- **Session Management**: Secure PHP sessions
- **Input Validation**: All user inputs are validated and sanitized
- **File Upload Security**: Only image files are allowed
- **SQL Injection Prevention**: Prepared statements used throughout
- **XSS Prevention**: Output is properly escaped

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Responsive Design

The admin dashboard is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## JavaScript Features

- **Search Functionality**: Real-time search in tables
- **Modal Dialogs**: Confirmation dialogs for delete actions
- **Image Preview**: Preview uploaded images before saving
- **Form Auto-save**: Prevents data loss
- **Loading States**: Visual feedback during operations

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure XAMPP is running
   - Check database credentials in `includes/db.php`
   - Verify database exists: `egyptian_creativity-v2`

2. **Image Upload Issues**
   - Check directory permissions
   - Ensure directories exist: `images/products/`, `images/gallery/`, `images/blogs/`
   - Verify file size limits in PHP configuration

3. **Session Issues**
   - Clear browser cookies
   - Restart web server
   - Check PHP session configuration

### Error Logs

Check the following files for error information:
- `cart_errors.log`
- `wishlist_errors.log`
- `profile_errors.log`

## Sample Data

The system comes with sample data for testing:
- 10 sample products
- 10 sample gallery items
- 5 sample blog posts
- 5 sample orders

## Future Enhancements

- User roles and permissions
- Advanced analytics
- Bulk operations
- Export functionality
- Email notifications
- Backup and restore features

## Support

For technical support or questions about the admin dashboard, please refer to the main website documentation or contact the development team.

---

**Egyptian Creativity Admin Dashboard** - Version 1.0
*Built with PHP, MySQL, HTML5, CSS3, and JavaScript* 