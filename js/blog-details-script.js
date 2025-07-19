// Egyptian Creativity Blog Details - Enhanced JavaScript

// Global Variables
let cart = JSON.parse(localStorage.getItem('egyptianLuxuryCart')) || [];
let wishlist = JSON.parse(localStorage.getItem('egyptianWishlist')) || [];

// DOM Elements
const header = document.getElementById('header');
const userBtn = document.getElementById('userBtn');
const cartBtn = document.getElementById('cartBtn');
const wishlistBtn = document.getElementById('wishlistBtn');
const cartBadge = document.getElementById('cartBadge');
const wishlistBadge = document.getElementById('wishlistBadge');
const notificationContainer = document.getElementById('notificationContainer');
const cartSidebar = document.getElementById('cartSidebar');
const wishlistSidebar = document.getElementById('wishlistSidebar');
const cartClose = document.getElementById('cartClose');
const wishlistClose = document.getElementById('wishlistClose');

// Initialize Website
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeUserButton();
    initializeCart();
    initializeWishlist();
    updateCartBadge();
    updateWishlistBadge();
    initializeSearchModal();
    ensureSidebarsClosed();
    initializeBlogAnimations();
    
    console.log('🏺 Blog Details page initialized successfully!');
});

// Navigation
function initializeNavigation() {
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
}

// User Button
function initializeUserButton() {
    if (userBtn) {
        userBtn.addEventListener('click', () => {
            // Check if user is logged in
            if (window.authManager && window.authManager.isAuthenticated()) {
                window.location.href = 'profile.html';
            } else {
                // Show login required message
                showNotification('You must login first to access your profile', 'error');
            }
        });
    }
}

// Cart Functions
function initializeCart() {
    if (cartBtn && cartSidebar) {
        cartBtn.addEventListener('click', () => {
            openSidebar(cartSidebar);
            window.renderCartSidebar();
        });
    }
}

async function updateCartBadge() {
    try {
        const response = await fetch('cart.php?action=get_cart');
        const data = await response.json();
        
        if (data.success) {
            const badge = document.getElementById('cartBadge');
            const totalItems = data.items.reduce((sum, item) => sum + (parseInt(item.quantity) || 1), 0);
            if (badge) {
                badge.textContent = totalItems;
                badge.style.display = totalItems > 0 ? 'flex' : 'none';
            }
        }
    } catch (error) {
        console.error('Error updating cart badge:', error);
    }
}

async function addToCart(productId) {
    try {
        const response = await fetch('cart.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'add_to_cart',
                product_id: productId,
                quantity: 1
            })
        });

        const data = await response.json();

        if (data.success) {
            showNotification(data.message || 'Item added to cart!', 'success');
            updateCartBadge();
        } else {
            showNotification(data.error || 'Failed to add to cart', 'error');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        showNotification('Error adding to cart', 'error');
    }
}

// Wishlist Functions
function initializeWishlist() {
    if (wishlistBtn && wishlistSidebar) {
        wishlistBtn.addEventListener('click', () => {
            openSidebar(wishlistSidebar);
            renderWishlistSidebar();
        });
    }
}

async function updateWishlistBadge() {
    try {
        const response = await fetch('wishlist.php?action=get_wishlist');
        const data = await response.json();
        
        if (data.success) {
            const badge = document.getElementById('wishlistBadge');
            if (badge) {
                badge.textContent = data.items.length;
                badge.style.display = data.items.length > 0 ? 'flex' : 'none';
            }
        }
    } catch (error) {
        console.error('Error updating wishlist badge:', error);
    }
}

async function toggleWishlist(productId) {
    try {
        const response = await fetch('wishlist.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'add_to_wishlist',
                product_id: productId
            })
        });

        const data = await response.json();

        if (data.success) {
            showNotification(data.message || 'Item added to wishlist!', 'success');
            updateWishlistBadge();
        } else {
            showNotification(data.message || 'Failed to add to wishlist', 'error');
        }
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        showNotification('Error adding to wishlist', 'error');
    }
}

// Blog Animations
function initializeBlogAnimations() {
    // Animate blog card on load
    const blogCard = document.querySelector('.blog-article-card');
    if (blogCard) {
        // Add entrance animation
        blogCard.style.opacity = '0';
        blogCard.style.transform = 'translateY(40px)';
        
        setTimeout(() => {
            blogCard.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            blogCard.style.opacity = '1';
            blogCard.style.transform = 'translateY(0)';
        }, 100);
    }
}

// Share functionality
function shareArticle() {
    const url = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: document.title,
            text: 'Check out this amazing blog post about Egyptian culture and history!',
            url: url
        }).then(() => {
            showNotification('Article shared successfully!', 'success');
        }).catch((error) => {
            console.log('Error sharing:', error);
            fallbackShare(url);
        });
    } else {
        fallbackShare(url);
    }
}

function fallbackShare(url) {
    // Fallback: copy to clipboard
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Link copied to clipboard!', 'success');
        }).catch(() => {
            showNotification('Unable to copy link', 'error');
        });
    } else {
        // Older browser fallback
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            showNotification('Link copied to clipboard!', 'success');
        } catch (err) {
            showNotification('Unable to copy link', 'error');
        }
        document.body.removeChild(textArea);
    }
}

// Enhanced notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    let icon = '';
    switch(type) {
        case 'success':
            icon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22,4 12,14.01 9,11.01"></polyline></svg>';
            break;
        case 'error':
            icon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
            break;
        default:
            icon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    }
    
    notification.innerHTML = `${icon}<span>${message}</span>`;
    
    // Create notification container if it doesn't exist
    let container = document.getElementById('notificationContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notificationContainer';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(container);
    }
    
    // Add notification styles
    notification.style.cssText = `
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 300px;
    `;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Sidebar Functions
function openSidebar(sidebar) {
    if (sidebar) sidebar.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSidebar(sidebar) {
    if (sidebar) sidebar.classList.remove('active');
    document.body.style.overflow = '';
}

if (cartClose && cartSidebar) {
    cartClose.addEventListener('click', () => closeSidebar(cartSidebar));
}

if (wishlistClose && wishlistSidebar) {
    wishlistClose.addEventListener('click', () => closeSidebar(wishlistSidebar));
}

// Close sidebar when clicking outside content
document.addEventListener('mousedown', (e) => {
    if (cartSidebar && cartSidebar.classList.contains('active') && !cartSidebar.querySelector('.sidebar-content').contains(e.target) && !cartSidebar.querySelector('.sidebar-header').contains(e.target)) {
        closeSidebar(cartSidebar);
    }
    if (wishlistSidebar && wishlistSidebar.classList.contains('active') && !wishlistSidebar.querySelector('.sidebar-content').contains(e.target) && !wishlistSidebar.querySelector('.sidebar-header').contains(e.target)) {
        closeSidebar(wishlistSidebar);
    }
});

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    // Escape key closes modals and sidebars
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('navMenu');
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
        
        if (cartSidebar && cartSidebar.classList.contains('active')) closeSidebar(cartSidebar);
        if (wishlistSidebar && wishlistSidebar.classList.contains('active')) closeSidebar(wishlistSidebar);
    }
});

// Render Wishlist Sidebar
function renderWishlistSidebar() {
    const wishlistEmpty = document.getElementById('wishlistEmpty');
    const wishlistItems = document.getElementById('wishlistItems');
    if (!wishlistEmpty || !wishlistItems) return;
    
    if (wishlist.length === 0) {
        wishlistEmpty.style.display = 'block';
        wishlistItems.style.display = 'none';
    } else {
        wishlistEmpty.style.display = 'none';
        wishlistItems.style.display = 'block';
        wishlistItems.innerHTML = wishlist.map(item => {
            let displayName = item.name || item.title || '';
            let displayPrice = item.price;
            let priceStr = typeof displayPrice === 'number' ? `$${displayPrice.toLocaleString()}` : displayPrice;
            return `
            <div class="wishlist-item">
                <img src="${item.image}" alt="${displayName}" class="wishlist-item-image">
                <div class="wishlist-item-details">
                    <h4 class="wishlist-item-title">${displayName}</h4>
                    <div class="wishlist-item-price">${priceStr}</div>
                </div>
                <button class="wishlist-item-remove" onclick="removeFromWishlistSidebar(${item.id})" title="Remove from wishlist">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
            </div>
            `;
        }).join('');
    }
}

function removeFromWishlistSidebar(productId) {
    const index = wishlist.findIndex(item => item.id === productId);
    if (index > -1) {
        wishlist.splice(index, 1);
        updateWishlistBadge();
        saveWishlist();
        renderWishlistSidebar();
    }
}

function removeFromCartSidebar(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index > -1) {
        cart.splice(index, 1);
        updateCartBadge();
        saveCart();
        window.renderCartSidebar();
    }
}

function saveCart() {
    localStorage.setItem('egyptianLuxuryCart', JSON.stringify(cart));
}

function saveWishlist() {
    localStorage.setItem('egyptianWishlist', JSON.stringify(wishlist));
}

// Search Modal
function initializeSearchModal() {
    const searchBtn = document.getElementById('searchBtn');
    const searchModal = document.getElementById('searchModal');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.getElementById('searchInput');
    if (searchBtn && searchModal) {
        searchBtn.addEventListener('click', () => {
            searchModal.classList.add('active');
            if (searchInput) searchInput.focus();
        });
    }
    if (searchClose) {
        searchClose.addEventListener('click', () => {
            searchModal.classList.remove('active');
        });
    }
    if (searchModal) {
        searchModal.addEventListener('click', (e) => {
            if (e.target === searchModal || e.target.classList.contains('modal-backdrop')) {
                searchModal.classList.remove('active');
            }
        });
    }
    // Search suggestions click
    const suggestions = document.querySelectorAll('.suggestion-item');
    suggestions.forEach(suggestion => {
        suggestion.addEventListener('click', () => {
            if (searchInput) {
                const query = suggestion.textContent.trim();
                searchModal.classList.remove('active');
                if (query) {
                    window.location.href = 'shop.php?search=' + encodeURIComponent(query);
                }
            }
        });
    });
    // Enter key in search input
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                searchModal.classList.remove('active');
                if (query) {
                    window.location.href = 'shop.php?search=' + encodeURIComponent(query);
                }
            }
        });
    }
    // ESC key closes modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchModal && searchModal.classList.contains('active')) {
            searchModal.classList.remove('active');
        }
    });
}

// Ensure all sidebars are closed by default
function ensureSidebarsClosed() {
    const sidebars = document.querySelectorAll('.sidebar');
    sidebars.forEach(sidebar => {
        sidebar.classList.remove('active');
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Page visibility API for better performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is not visible
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations when page becomes visible
        document.body.style.animationPlayState = 'running';
    }
});