// Shared Sidebar Utilities for Egyptian Creativity
// This file provides consistent sidebar functionality across all pages

class SidebarManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('egyptianLuxuryCart')) || [];
        this.wishlist = JSON.parse(localStorage.getItem('egyptianWishlist')) || [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.ensureSidebarsClosed();
        this.updateBadges();
    }

    // Ensure all sidebars are closed by default
    ensureSidebarsClosed() {
        const sidebars = document.querySelectorAll('.sidebar');
        sidebars.forEach(sidebar => {
            sidebar.classList.remove('active');
        });
    }

    // Setup event listeners for sidebar functionality
    setupEventListeners() {
        // Cart button
        const cartBtn = document.getElementById('cartBtn');
        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                this.openCartSidebar();
            });
        }

        // Wishlist button
        const wishlistBtn = document.getElementById('wishlistBtn');
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', () => {
                this.openWishlistSidebar();
            });
        }

        // Close buttons
        const cartClose = document.getElementById('cartClose');
        if (cartClose) {
            cartClose.addEventListener('click', () => {
                this.closeCartSidebar();
            });
        }

        const wishlistClose = document.getElementById('wishlistClose');
        if (wishlistClose) {
            wishlistClose.addEventListener('click', () => {
                this.closeWishlistSidebar();
            });
        }

        // Close sidebars when clicking outside
        document.addEventListener('click', (e) => {
            const cartSidebar = document.getElementById('cartSidebar');
            const wishlistSidebar = document.getElementById('wishlistSidebar');
            const cartBtn = document.getElementById('cartBtn');
            const wishlistBtn = document.getElementById('wishlistBtn');

            if (cartSidebar && cartSidebar.classList.contains('active') && 
                !cartSidebar.contains(e.target) && !cartBtn.contains(e.target)) {
                this.closeCartSidebar();
            }

            if (wishlistSidebar && wishlistSidebar.classList.contains('active') && 
                !wishlistSidebar.contains(e.target) && !wishlistBtn.contains(e.target)) {
                this.closeWishlistSidebar();
            }
        });

        // Close sidebars when clicking on backdrop
        const cartBackdrop = document.getElementById('cartBackdrop');
        if (cartBackdrop) {
            cartBackdrop.addEventListener('click', () => {
                this.closeCartSidebar();
            });
        }

        const wishlistBackdrop = document.getElementById('wishlistBackdrop');
        if (wishlistBackdrop) {
            wishlistBackdrop.addEventListener('click', () => {
                this.closeWishlistSidebar();
            });
        }

        // Close sidebars with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeCartSidebar();
                this.closeWishlistSidebar();
            }
        });
    }

    // Open cart sidebar
    openCartSidebar() {
        const cartSidebar = document.getElementById('cartSidebar');
        const cartBackdrop = document.getElementById('cartBackdrop');
        if (cartSidebar) {
            cartSidebar.classList.add('active');
            if (cartBackdrop) cartBackdrop.classList.add('active');
            document.body.classList.add('sidebar-open');
            this.renderCartSidebar();
        }
    }

    // Close cart sidebar
    closeCartSidebar() {
        const cartSidebar = document.getElementById('cartSidebar');
        const cartBackdrop = document.getElementById('cartBackdrop');
        if (cartSidebar) {
            cartSidebar.classList.remove('active');
            if (cartBackdrop) cartBackdrop.classList.remove('active');
            document.body.classList.remove('sidebar-open');
        }
    }

    // Open wishlist sidebar
    openWishlistSidebar() {
        const wishlistSidebar = document.getElementById('wishlistSidebar');
        const wishlistBackdrop = document.getElementById('wishlistBackdrop');
        if (wishlistSidebar) {
            wishlistSidebar.classList.add('active');
            if (wishlistBackdrop) wishlistBackdrop.classList.add('active');
            document.body.classList.add('sidebar-open');
            this.renderWishlistSidebar();
        }
    }

    // Close wishlist sidebar
    closeWishlistSidebar() {
        const wishlistSidebar = document.getElementById('wishlistSidebar');
        const wishlistBackdrop = document.getElementById('wishlistBackdrop');
        if (wishlistSidebar) {
            wishlistSidebar.classList.remove('active');
            if (wishlistBackdrop) wishlistBackdrop.classList.remove('active');
            document.body.classList.remove('sidebar-open');
        }
    }

    // Render cart sidebar content
    renderCartSidebar() {
        const cartItems = document.getElementById('cartItems');
        const cartEmpty = document.getElementById('cartEmpty');
        const cartFooter = document.getElementById('cartFooter');
        const cartSubtotal = document.getElementById('cartSubtotal');
        const cartTotal = document.getElementById('cartTotal');
        
        if (!cartItems || !cartEmpty || !cartFooter) return;
        
        // Reload cart data
        this.cart = JSON.parse(localStorage.getItem('egyptianLuxuryCart')) || [];
        
        if (this.cart.length === 0) {
            cartEmpty.style.display = 'block';
            cartItems.style.display = 'none';
            cartFooter.style.display = 'none';
            if (cartSubtotal) cartSubtotal.textContent = '$0';
            if (cartTotal) cartTotal.textContent = '$0';
        } else {
            cartEmpty.style.display = 'none';
            cartItems.style.display = 'block';
            cartFooter.style.display = 'block';
            
            cartItems.innerHTML = this.cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image || 'images/logo.jpg'}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${item.name}</h4>
                        <div class="cart-item-price">$${(item.price || 0).toLocaleString()} x ${item.quantity || 1}</div>
                    </div>
                    <button class="cart-item-remove" onclick="window.sidebarManager.removeFromCart(${item.id})" title="Remove item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3,6 5,6 21,6"></polyline>
                            <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1 2-2h4a2,2 0 0,1 2,2v2"></path>
                        </svg>
                    </button>
                </div>
            `).join('');
            
            // Calculate and display totals
            const subtotal = this.cart.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
            if (cartSubtotal) cartSubtotal.textContent = `$${subtotal.toLocaleString()}`;
            if (cartTotal) cartTotal.textContent = `$${subtotal.toLocaleString()}`;
        }
    }

    // Render wishlist sidebar content
    renderWishlistSidebar() {
        const wishlistItems = document.getElementById('wishlistItems');
        const wishlistEmpty = document.getElementById('wishlistEmpty');
        const wishlistFooter = document.getElementById('wishlistFooter');
        
        if (!wishlistItems || !wishlistEmpty || !wishlistFooter) return;
        
        // Reload wishlist data
        this.wishlist = JSON.parse(localStorage.getItem('egyptianWishlist')) || [];
        
        if (this.wishlist.length === 0) {
            wishlistEmpty.style.display = 'block';
            wishlistItems.style.display = 'none';
            wishlistFooter.style.display = 'none';
        } else {
            wishlistEmpty.style.display = 'none';
            wishlistItems.style.display = 'block';
            wishlistFooter.style.display = 'block';
            
            wishlistItems.innerHTML = this.wishlist.map(item => `
                <div class="wishlist-item">
                    <img src="${item.image || 'images/logo.jpg'}" alt="${item.name}" class="wishlist-item-image">
                    <div class="wishlist-item-details">
                        <h4 class="wishlist-item-title">${item.name}</h4>
                        <div class="wishlist-item-price">$${(item.price || 0).toLocaleString()}</div>
                    </div>
                    <button class="wishlist-item-remove" onclick="window.sidebarManager.removeFromWishlist(${item.id})" title="Remove from wishlist">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                </div>
            `).join('');
        }
    }

    // Remove item from cart
    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        localStorage.setItem('egyptianLuxuryCart', JSON.stringify(this.cart));
        this.renderCartSidebar();
        this.updateBadges();
        this.showNotification('Item removed from cart', 'info');
    }

    // Remove item from wishlist
    removeFromWishlist(itemId) {
        this.wishlist = this.wishlist.filter(item => item.id !== itemId);
        localStorage.setItem('egyptianWishlist', JSON.stringify(this.wishlist));
        this.renderWishlistSidebar();
        this.updateBadges();
        this.showNotification('Item removed from wishlist', 'info');
    }

    // Update cart and wishlist badges
    updateBadges() {
        const cartBadge = document.getElementById('cartBadge');
        const wishlistBadge = document.getElementById('wishlistBadge');
        
        // Update cart badge
        if (cartBadge) {
            const totalItems = this.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
            cartBadge.textContent = totalItems;
            cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
        }
        
        // Update wishlist badge
        if (wishlistBadge) {
            wishlistBadge.textContent = this.wishlist.length;
            wishlistBadge.style.display = this.wishlist.length > 0 ? 'flex' : 'none';
        }
    }

    // Show notification
    showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            success: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22,4 12,14.01 9,11.01"></polyline>',
            error: '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>',
            info: '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>'
        };
        
        notification.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                ${icons[type] || icons.info}
            </svg>
            <span>${message}</span>
        `;
        
        container.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
}

// Initialize sidebar manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.sidebarManager = new SidebarManager();
});

console.log('🏺 Egyptian Creativity - Sidebar utilities loaded successfully!'); 