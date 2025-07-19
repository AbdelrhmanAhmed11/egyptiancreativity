// Shared Sidebar Utilities for Egyptian Creativity
// This file provides consistent sidebar functionality across all pages

class SidebarManager {
    constructor() {
        this.cart = [];
        this.wishlist = [];
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.ensureSidebarsClosed();
        await this.fetchDataAndUpdate();
    }

    async fetchDataAndUpdate() {
        await Promise.all([
            this.fetchCart(),
            this.fetchWishlist()
        ]);
        this.updateBadges();
    }

    async fetchCart() {
        try {
            const response = await fetch('cart.php?action=get_cart');
            const data = await response.json();
            this.cart = data.cart || [];
        } catch (e) {
            this.cart = [];
        }
    }

    async fetchWishlist() {
        try {
            const response = await fetch('wishlist.php?action=get_wishlist');
            const data = await response.json();
            this.wishlist = data.wishlist || [];
        } catch (e) {
            this.wishlist = [];
        }
    }

    ensureSidebarsClosed() {
        const sidebars = document.querySelectorAll('.sidebar');
        sidebars.forEach(sidebar => {
            sidebar.classList.remove('active');
        });
    }

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

    async openCartSidebar() {
        await this.fetchCart();
        this.updateBadges();
        const cartSidebar = document.getElementById('cartSidebar');
        const cartBackdrop = document.getElementById('cartBackdrop');
        if (cartSidebar) {
            cartSidebar.classList.add('active');
            if (cartBackdrop) cartBackdrop.classList.add('active');
            document.body.classList.add('sidebar-open');
            this.renderCartSidebar();
        }
    }

    closeCartSidebar() {
        const cartSidebar = document.getElementById('cartSidebar');
        const cartBackdrop = document.getElementById('cartBackdrop');
        if (cartSidebar) {
            cartSidebar.classList.remove('active');
            if (cartBackdrop) cartBackdrop.classList.remove('active');
            document.body.classList.remove('sidebar-open');
        }
    }

    async openWishlistSidebar() {
        await this.fetchWishlist();
        this.updateBadges();
        const wishlistSidebar = document.getElementById('wishlistSidebar');
        const wishlistBackdrop = document.getElementById('wishlistBackdrop');
        if (wishlistSidebar) {
            wishlistSidebar.classList.add('active');
            if (wishlistBackdrop) wishlistBackdrop.classList.add('active');
            document.body.classList.add('sidebar-open');
            this.renderWishlistSidebar();
        }
    }

    closeWishlistSidebar() {
        const wishlistSidebar = document.getElementById('wishlistSidebar');
        const wishlistBackdrop = document.getElementById('wishlistBackdrop');
        if (wishlistSidebar) {
            wishlistSidebar.classList.remove('active');
            if (wishlistBackdrop) wishlistBackdrop.classList.remove('active');
            document.body.classList.remove('sidebar-open');
        }
    }

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

    renderCartSidebar() {
        if (typeof window.renderCartSidebar === 'function') {
            window.renderCartSidebar(this.cart);
        }
    }

    renderWishlistSidebar() {
        if (typeof window.renderWishlistSidebar === 'function') {
            window.renderWishlistSidebar(this.wishlist);
        }
    }
}

// Initialize sidebar manager when DOM is loaded
// (No localStorage, always backend)
document.addEventListener('DOMContentLoaded', () => {
    window.sidebarManager = new SidebarManager();
});

console.log('🏺 Egyptian Creativity - Sidebar utilities loaded successfully!'); 