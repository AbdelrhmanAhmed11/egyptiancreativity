// Egyptian Creativity Contact Page - Enhanced JavaScript

// DOM Elements
const header = document.getElementById('header');
const loadingOverlay = document.getElementById('loadingOverlay');
const progressBar = document.querySelector('.progress-bar');
const skipBtn = document.getElementById('skipBtn');
const searchBtn = document.getElementById('searchBtn');
const searchModal = document.getElementById('searchModal');
const searchClose = document.getElementById('searchClose');
const searchBackdrop = document.getElementById('searchBackdrop');
const searchInput = document.getElementById('searchInput');
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const wishlistBtn = document.getElementById('wishlistBtn');
const wishlistSidebar = document.getElementById('wishlistSidebar');
const cartBadge = document.getElementById('cartBadge');
const wishlistBadge = document.getElementById('wishlistBadge');
const contactForm = document.getElementById('contactForm');
const newsletterForm = document.getElementById('newsletterForm');
const faqItems = document.querySelectorAll('.faq-item');
const notificationContainer = document.getElementById('notificationContainer');
const userBtn = document.getElementById('userBtn');

// Contact Manager Class
class ContactManager {
    constructor() {
        this.cart = this.loadFromStorage('egyptianLuxuryCart') || [];
        this.wishlist = this.loadFromStorage('egyptianWishlist') || [];
        // Check for a flag to skip loading animation (set by PHP after POST)
        const skipLoading = window.skipContactLoading === true;
        this.init(skipLoading);
    }

    init(skipLoading = false) {
        this.bindEvents();
        if (!skipLoading) {
            this.initializeLoading();
        } else {
            // Hide loading overlay immediately if present
            if (loadingOverlay) loadingOverlay.classList.add('hidden');
            this.animateContactStats();
        }
        this.setupScrollEffects();
        this.setupFAQ();
        this.setupAnimations();
        // this.updateCartBadge(); // Removed as per edit hint
        // this.updateWishlistBadge(); // Removed as per edit hint
        // ensureSidebarsClosed(); // Removed as per edit hint
    }

    // Initialize loading animation
    initializeLoading() {
        if (!loadingOverlay || !progressBar || !skipBtn) return;

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => this.hideLoading(), 500);
            }
            progressBar.style.width = `${progress}%`;
        }, 150);

        // Skip button
        skipBtn.addEventListener('click', () => {
            clearInterval(interval);
            this.hideLoading();
        });

        // Auto hide after 3 seconds
        setTimeout(() => {
            clearInterval(interval);
            this.hideLoading();
        }, 3000);
    }

    hideLoading() {
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
            setTimeout(() => {
                this.animateContactStats();
            }, 1000);
        } else {
            this.animateContactStats();
        }
    }

    // Count-up animation for contact stats
    animateContactStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            const text = stat.textContent.trim();
            // Only animate numbers (e.g., 24/7, 48h, 100%)
            if (/^(\d+)(\/\d+|h|%|\+)?$/.test(text)) {
                let finalValue = 0;
                let suffix = '';
                if (text.endsWith('%')) {
                    finalValue = parseInt(text);
                    suffix = '%';
                } else if (text.endsWith('h')) {
                    finalValue = parseInt(text);
                    suffix = 'h';
                } else if (text.includes('/')) {
                    finalValue = parseInt(text.split('/')[0]);
                    suffix = '/' + text.split('/')[1];
                } else {
                    finalValue = parseInt(text.replace(/\D/g, ''));
                }
                const duration = 4000;
                let start = 0;
                const step = Math.ceil(finalValue / (duration / 16));
                function update() {
                    start += step;
                    if (start >= finalValue) {
                        stat.textContent = suffix ? finalValue + suffix : finalValue;
                    } else {
                        stat.textContent = suffix ? start + suffix : start;
                        requestAnimationFrame(update);
                    }
                }
                stat.textContent = suffix ? '0' + suffix : '0';
                requestAnimationFrame(update);
            }
        });
    }

    // Bind event listeners
    bindEvents() {
        // Header actions
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.openModal('searchModal'));
        }

        if (userBtn) {
            userBtn.addEventListener('click', () => {
                // Check if user is logged in
                if (window.authManager && window.authManager.isAuthenticated()) {
                    window.location.href = 'profile.html';
                } else {
                    // Show login required message
                    this.showNotification('You must login first to access your profile', 'error');
                }
            });
        }

        if (cartBtn) {
            cartBtn.addEventListener('click', () => window.openSidebar('cartSidebar'));
        }

        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', () => window.openSidebar('wishlistSidebar'));
        }

        // Modal controls
        if (searchClose) {
            searchClose.addEventListener('click', () => this.closeModal('searchModal'));
        }

        if (searchBackdrop) {
            searchBackdrop.addEventListener('click', () => this.closeModal('searchModal'));
        }

        // Sidebar controls
        document.querySelectorAll('.sidebar-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const sidebar = e.target.closest('.sidebar');
                if (sidebar) {
                    window.closeSidebar(sidebar.id);
                }
            });
        });

        // Forms
        // Remove or comment out the following lines in the bindEvents() method:
        // if (contactForm) {
        //     contactForm.addEventListener('submit', (e) => this.handleContactForm(e));
        // }
        // if (newsletterForm) {
        //     newsletterForm.addEventListener('submit', (e) => this.handleNewsletterForm(e));
        // }

        // Search functionality
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e));
        }

        // Search suggestions
        document.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (searchInput) {
                    searchInput.value = e.target.textContent;
                    this.showNotification(`Searching for "${e.target.textContent}"...`, 'info');
                    this.closeModal('searchModal');
                    // Redirect to shop with search query
                    setTimeout(() => {
                        window.location.href = `shop.html?search=${encodeURIComponent(e.target.textContent)}`;
                    }, 1000);
                }
            });
        });

        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal('searchModal');
                window.closeSidebar('cartSidebar');
                window.closeSidebar('wishlistSidebar');
            }
        });

        // Click outside to close sidebars
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.sidebar') && !e.target.closest('.header-icon')) {
                window.closeSidebar('cartSidebar');
                window.closeSidebar('wishlistSidebar');
            }
        });

        // Header scroll effect
        window.addEventListener('scroll', () => {
            if (header) {
                if (window.scrollY > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
        });
    }

    // Setup scroll effects
    setupScrollEffects() {
        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateHeader = () => {
            const currentScrollY = window.scrollY;

            if (header) {
                if (currentScrollY > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }

                if (currentScrollY > lastScrollY && currentScrollY > 200) {
                    header.classList.add('hidden');
                } else {
                    header.classList.remove('hidden');
                }
            }

            lastScrollY = currentScrollY;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        });
    }

    // Setup FAQ functionality
    setupFAQ() {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => this.toggleFAQ(item));
            }
        });
    }

    toggleFAQ(faqItem) {
        const answer = faqItem.querySelector('.faq-answer');
        const plusIcon = faqItem.querySelector('.faq-icon-plus');
        const minusIcon = faqItem.querySelector('.faq-icon-minus');

        const isOpen = !answer?.classList.contains('hidden');

        // Close all FAQs
        faqItems.forEach(item => {
            const itemAnswer = item.querySelector('.faq-answer');
            const itemPlusIcon = item.querySelector('.faq-icon-plus');
            const itemMinusIcon = item.querySelector('.faq-icon-minus');

            itemAnswer?.classList.add('hidden');
            itemPlusIcon?.classList.remove('hidden');
            itemMinusIcon?.classList.add('hidden');
        });

        // If it was closed, open it
        if (!isOpen) {
            answer?.classList.remove('hidden');
            plusIcon?.classList.add('hidden');
            minusIcon?.classList.remove('hidden');
        }
    }

    // Setup animations
    setupAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.contact-card, .contact-form-card, .faq-item, .contact-map').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    // Modal management
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            if (modalId === 'searchModal' && searchInput) {
                setTimeout(() => searchInput.focus(), 100);
            }
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    // Cart functionality
    // async updateCartBadge() { // Removed as per edit hint
    //     try {
    //         const response = await fetch('cart.php?action=get_cart');
    //         const data = await response.json();
            
    //         if (data.success) {
    //             const totalItems = data.items.reduce((sum, item) => sum + (parseInt(item.quantity) || 1), 0);
    //             if (cartBadge) {
    //                 cartBadge.textContent = totalItems;
    //                 cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    //             }
    //         }
    //     } catch (error) {
    //         console.error('Error updating cart badge:', error);
    //     }
    // }

    // async updateWishlistBadge() { // Removed as per edit hint
    //     try {
    //         const response = await fetch('wishlist.php?action=get_wishlist');
    //         const data = await response.json();
            
    //         if (data.success) {
    //             if (wishlistBadge) {
    //                 wishlistBadge.textContent = data.items.length;
    //                 wishlistBadge.style.display = data.items.length > 0 ? 'flex' : 'none';
    //             }
    //         }
    //     } catch (error) {
    //         console.error('Error updating wishlist badge:', error);
    //     }
    // }

    // Remove from cart
    // async removeFromCart(productId) { // Removed as per edit hint
    //     try {
    //         const response = await fetch('cart.php', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 action: 'remove_from_cart',
    //                 product_id: productId
    //             })
    //         });

    //         const data = await response.json();

    //         if (data.success) {
    //             window.renderCartSidebar();
    //             this.updateCartBadge();
    //             this.showNotification('Item removed from cart', 'success');
    //         } else {
    //             this.showNotification(data.error || 'Failed to remove item', 'error');
    //         }
    //     } catch (error) {
    //         console.error('Error removing from cart:', error);
    //         this.showNotification('Error removing from cart', 'error');
    //     }
    // }

    // Add to cart
    // async addToCart(productId) { // Removed as per edit hint
    //     try {
    //         const response = await fetch('cart.php', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 action: 'add_to_cart',
    //                 product_id: productId,
    //                 quantity: 1
    //             })
    //         });

    //         const data = await response.json();

    //         if (data.success) {
    //             this.showNotification(data.message || 'Item added to cart!', 'success');
    //             this.updateCartBadge();
    //             window.renderCartSidebar();
    //         } else {
    //             this.showNotification(data.error || 'Failed to add to cart', 'error');
    //         }
    //     } catch (error) {
    //         console.error('Error adding to cart:', error);
    //         this.showNotification('Error adding to cart', 'error');
    //     }
    // }

    // Remove from wishlist
    // async removeFromWishlist(productId) { // Removed as per edit hint
    //     try {
    //         const response = await fetch('wishlist.php', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 action: 'remove_from_wishlist',
    //                 product_id: productId
    //             })
    //         });

    //         const data = await response.json();

    //         if (data.success) {
    //             window.renderWishlistSidebar();
    //             this.updateWishlistBadge();
    //             this.showNotification('Item removed from wishlist', 'success');
    //         } else {
    //             this.showNotification(data.error || 'Failed to remove item', 'error');
    //         }
    //     } catch (error) {
    //         console.error('Error removing from wishlist:', error);
    //         this.showNotification('Error removing from wishlist', 'error');
    //     }
    // }

    // Handle search
    handleSearch(e) {
        const query = e.target.value.toLowerCase();
        if (query.length > 2) {
            // Simulate search suggestions
            console.log('Searching for:', query);
        }
    }

    // Handle contact form submission
    handleContactForm(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');

        if (!name || !email || !subject || !message) {
            this.showNotification('Please fill in all required fields.', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showNotification('Please enter a valid email address.', 'error');
            return;
        }

        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<span>Sending Sacred Message...</span>';
        submitBtn.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            this.showNotification('Your sacred message has been sent successfully! Our master craftsmen will respond within 24 hours.', 'success');
            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    // Handle newsletter form submission
    handleNewsletterForm(e) {
        e.preventDefault();
        
        const emailInput = newsletterForm.querySelector('.newsletter-input');
        const email = emailInput.value.trim();

        if (!email) {
            this.showNotification('Please enter your email address.', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showNotification('Please enter a valid email address.', 'error');
            return;
        }

        const submitBtn = newsletterForm.querySelector('.newsletter-btn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<span>Subscribing...</span>';
        submitBtn.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            this.showNotification('Welcome to the Egyptian Creativity family! You will receive ancient wisdom and exclusive offers.', 'success');
            newsletterForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    }

    // Show notification
    showNotification(message, type = 'info') {
        if (!notificationContainer) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            success: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22,4 12,14.01 9,11.01"></polyline></svg>',
            error: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
            info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
        };
        
        notification.innerHTML = `
            ${icons[type] || icons.info}
            <span>${message}</span>
        `;
        
        notificationContainer.appendChild(notification);
        
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

    // Local storage helpers
    saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
        }
    }

    loadFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Failed to load from localStorage:', error);
            return null;
        }
    }
}

// Initialize the contact manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.contactManager = new ContactManager();

    // --- Mobile menu toggle logic (added for contact page) ---
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    function closeMobileMenu() {
        if (navMenu) {
            navMenu.classList.remove('active');
            if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    function openMobileMenu() {
        if (navMenu) {
            navMenu.classList.add('active');
            if (mobileMenuBtn) mobileMenuBtn.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isActive = navMenu.classList.contains('active');
            if (isActive) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }
    // Close mobile menu when a nav link is clicked (on mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
        });
    });
    // --- End mobile menu logic ---
});

// Auto-refresh cart and wishlist data, badges when localStorage changes (cross-tab sync)
window.addEventListener('storage', (event) => {
    if (event.key === 'egyptianLuxuryCart') {
        if (window.contactManager) {
            window.contactManager.cart = JSON.parse(localStorage.getItem('egyptianLuxuryCart')) || [];
            // window.contactManager.updateCartBadge(); // Removed as per edit hint
            if (cartSidebar && cartSidebar.classList.contains('active')) {
                // window.renderCartSidebar(); // Removed as per edit hint
            }
        }
    }
    if (event.key === 'egyptianWishlist') {
        if (window.contactManager) {
            window.contactManager.wishlist = JSON.parse(localStorage.getItem('egyptianWishlist')) || [];
            // window.contactManager.updateWishlistBadge(); // Removed as per edit hint
            if (wishlistSidebar && wishlistSidebar.classList.contains('active')) {
                // window.renderWishlistSidebar(); // Removed as per edit hint
            }
        }
    }
});

// Handle escape key for closing modals and sidebars
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close active modals
        document.querySelectorAll('.modal.active').forEach(modal => {
            window.contactManager?.closeModal(modal.id);
        });

        // Close active sidebars
        document.querySelectorAll('.sidebar.active').forEach(sidebar => {
            window.contactManager?.closeSidebar(sidebar.id);
        });
    }
});

// Handle window load event
window.addEventListener('load', () => {
    // Update badges on load
    if (window.contactManager) {
        // window.contactManager.updateCartBadge(); // Removed as per edit hint
        // window.contactManager.updateWishlistBadge(); // Removed as per edit hint
    }
});

console.log('🏺 Egyptian Creativity Contact - Enhanced luxury website loaded successfully!');

// Ensure all sidebars are closed by default
function ensureSidebarsClosed() {
  const sidebars = document.querySelectorAll('.sidebar');
  sidebars.forEach(sidebar => {
    sidebar.classList.remove('active');
  });
}