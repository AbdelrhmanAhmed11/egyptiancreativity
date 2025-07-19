// Egyptian Creativity - Enhanced Wishlist JavaScript
// Matching Index Page Design System

class EgyptianWishlist {
    constructor() {
        this.wishlistItems = [];
        this.cartItems = [];
        this.recommendedItems = [];
        this.currentView = 'grid';
        this.currentSort = 'newest';
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.filteredItems = [];
        this.elements = {};
        this.intersectionObserver = null;

        // No sample data - only database data
    }

    init() {
        console.log('🏺 Egyptian Wishlist - Initializing...');
        
        this.initializeLoading();
        this.gatherElements();
        this.setupEventListeners();
        this.setupIntersectionObserver();
        
        // Load data from database only
        this.loadStoredData().then(() => {
            // Initialize filteredItems with a copy of wishlistItems
            this.filteredItems = [...this.wishlistItems];
            
            // Log initial data for debugging
            console.log('Initial wishlist items:', this.wishlistItems);
            console.log('Initial filtered items:', this.filteredItems);
            
            // Apply initial filters and sorting
            this.applyFilters();
            
            // Render the UI
            this.renderWishlist();
            this.renderRecommended();
            this.updateStats();
            this.updateBadges();
            this.setupSearchModal();
            
            // Highlight wishlist icon as active since we're on the wishlist page
            if (this.elements.wishlistBtn) {
                this.elements.wishlistBtn.classList.add('active');
            }
            
            ensureSidebarsClosed();
            
            console.log('✅ Wishlist initialized successfully');
        });
    }

    initializeLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        const progressBar = document.querySelector('.progress-bar');
        const skipBtn = document.getElementById('skipBtn');
        
        if (!loadingOverlay) return;
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 12 + 3;
            if (progress > 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => this.hideLoading(), 500);
            }
            if (progressBar) {
                progressBar.style.width = `${progress}%`;
            }
        }, 120);

        // Skip button
        skipBtn?.addEventListener('click', () => {
            clearInterval(interval);
            this.hideLoading();
        });

        // Auto hide after 4 seconds
        setTimeout(() => {
            clearInterval(interval);
            this.hideLoading();
        }, 4000);
    }

    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
            }, 1000);
        }
    }

    gatherElements() {
        this.elements = {
            // Header elements
            searchBtn: document.getElementById('searchBtn'),
            userBtn: document.getElementById('userBtn'),
            wishlistBadge: document.getElementById('wishlistBadge'),
            cartBadge: document.getElementById('cartBadge'),
            cartBtn: document.getElementById('cartBtn'),
            wishlistBtn: document.getElementById('wishlistBtn'),
            
            // Hero elements
            totalItems: document.getElementById('totalItems'),
            totalValue: document.getElementById('totalValue'),
            addAllBtn: document.getElementById('addAllBtn'),
            shareBtn: document.getElementById('shareBtn'),
            
            // Controls elements
            gridViewBtn: document.getElementById('gridViewBtn'),
            listViewBtn: document.getElementById('listViewBtn'),
            sortSelect: document.getElementById('sortSelect'),
            filterSelect: document.getElementById('filterSelect'),
            totalItemsDisplay: document.getElementById('totalItemsDisplay'),
            totalValueDisplay: document.getElementById('totalValueDisplay'),
            
            // Wishlist elements
            emptyState: document.getElementById('emptyState'),
            wishlistGrid: document.getElementById('wishlistGrid'),
            recommendedGrid: document.getElementById('recommendedGrid'),
            
            // Newsletter
            newsletterForm: document.getElementById('newsletterForm'),
            
            // Notification container
            notificationContainer: document.getElementById('notificationContainer')
        };
    }

    setupEventListeners() {
        // Header events
        this.elements.userBtn?.addEventListener('click', () => {
            // Check if user is logged in
            if (window.authManager && window.authManager.isAuthenticated()) {
                window.location.href = 'profile.html';
            } else {
                // Show login required message
                this.showNotification('You must login first to access your profile', 'error');
            }
        });
        // this.elements.cartBtn?.addEventListener('click', () => this.showNotification('Cart functionality coming soon!', 'info'));
        this.elements.wishlistBtn?.addEventListener('click', () => this.showNotification('You are already viewing your wishlist!', 'info'));

        // Hero events
        this.elements.addAllBtn?.addEventListener('click', () => this.addAllToCart());
        this.elements.shareBtn?.addEventListener('click', () => this.shareWishlist());

        // View controls
        this.elements.gridViewBtn?.addEventListener('click', () => this.setView('grid'));
        this.elements.listViewBtn?.addEventListener('click', () => this.setView('list'));

        // Filter controls
        this.elements.sortSelect?.addEventListener('change', (e) => this.setSort(e.target.value));
        this.elements.filterSelect?.addEventListener('change', (e) => this.setFilter(e.target.value));

        // Newsletter form
        this.elements.newsletterForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.showNotification('Thank you for subscribing to our divine updates!', 'success');
            e.target.reset();
        });

        // Header scroll effect
        window.addEventListener('scroll', this.throttle(() => {
            const header = document.getElementById('header');
            if (header) {
                if (window.scrollY > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
        }, 100));

        // Cart Sidebar open logic for wishlist page
        const cartBtn = document.getElementById('cartBtn');
        const cartSidebar = document.getElementById('cartSidebar');
        if (cartBtn && cartSidebar) {
            cartBtn.addEventListener('click', () => {
                if (typeof this.renderCartSidebar === 'function') {
                    this.renderCartSidebar();
                } else if (typeof window.renderCartSidebar === 'function') {
                    window.renderCartSidebar();
                }
                if (typeof window.updateCartBadge === 'function') window.updateCartBadge();
                cartSidebar.classList.add('active');
            });
        }

        // Delegated event listeners for wishlist actions
        if (this.elements.wishlistGrid) {
            this.elements.wishlistGrid.addEventListener('click', (e) => {
                const addBtn = e.target.closest('.wishlist-card-btn-primary');
                const removeBtn = e.target.closest('.wishlist-card-btn-outline');
                if (addBtn) {
                    const card = addBtn.closest('.wishlist-card');
                    if (card) {
                        const id = parseInt(card.getAttribute('data-id'));
                        if (!isNaN(id)) this.addToCart(id);
                    }
                } else if (removeBtn) {
                    const card = removeBtn.closest('.wishlist-card');
                    if (card) {
                        const id = parseInt(card.getAttribute('data-id'));
                        if (!isNaN(id)) this.removeFromWishlist(id);
                    }
                }
            });
        }
        // Delegated event listener for recommended heart icon
        if (this.elements.recommendedGrid) {
            this.elements.recommendedGrid.addEventListener('click', (e) => {
                const heartBtn = e.target.closest('.rec-add-btn');
                if (heartBtn && !heartBtn.disabled) {
                    const recItem = heartBtn.closest('.recommended-item');
                    if (recItem) {
                        const id = parseInt(recItem.getAttribute('data-id'));
                        if (!isNaN(id)) this.addToWishlist(id, true);
                    }
                }
            });
        }
    }

    setupIntersectionObserver() {
        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    this.intersectionObserver.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '50px'
        });
    }

    // initSampleData() method removed - only database data is used now

    // --- Wishlist AJAX helpers ---
    async fetchWishlistData() {
        try {
            // Use GET, not POST, to match sidebar and other pages
            const res = await fetch('wishlist.php?action=get_wishlist');
            const data = await res.json();
            if (data.success && data.wishlist) {
                return data.wishlist.map(item => ({
                    ...item,
                    price: parseFloat(item.price) || 0,
                    addedDate: item.addedDate ? new Date(item.addedDate) : new Date()
                }));
            }
            return [];
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            return [];
        }
    }

    async addToWishlistAPI(productId) {
        try {
            const res = await fetch('wishlist.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    action: 'add_to_wishlist',
                    product_id: productId 
                })
            });
            return await res.json();
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            return { success: false, message: 'Network error' };
        }
    }

    async removeFromWishlistAPI(productId) {
        try {
            const res = await fetch('wishlist.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    action: 'remove_from_wishlist',
                    product_id: productId 
                })
            });
            return await res.json();
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            return { success: false, message: 'Network error' };
        }
    }

    async fetchRecommendedData() {
        try {
            // Use a relative path that works from any page
            const res = await fetch('./wishlist.php?action=get_recommended');
            const data = await res.json();
            if (data.success && data.recommended) {
                return data.recommended;
            }
            return [];
        } catch (error) {
            console.error('Error fetching recommended items:', error);
            return [];
        }
    }

    // Override loadStoredData to use backend only
    async loadStoredData() {
        try {
            // Load wishlist from backend only
            const wishlistData = await this.fetchWishlistData();
            this.wishlistItems = wishlistData || [];
            console.log('Loaded wishlist from backend:', this.wishlistItems);

            // Load recommended items from backend only
            const recommendedData = await this.fetchRecommendedData();
            this.recommendedItems = recommendedData || [];
            console.log('Loaded recommended items from backend:', this.recommendedItems);

            // Always try to load cart from localStorage (cart is still client-side)
            const storedCart = localStorage.getItem('egyptianLuxuryCart');
            if (storedCart) {
                try {
                    const cartData = JSON.parse(storedCart);
                    if (Array.isArray(cartData)) {
                        this.cartItems = cartData;
                    }
                } catch (e) {
                    console.error('Error parsing cart data:', e);
                }
            }
        } catch (e) {
            console.error('Error loading data from backend:', e);
            // Don't fallback to sample data - just use empty arrays
            this.wishlistItems = [];
            this.recommendedItems = [];
        }
    }

    // Override addToWishlist to use backend
    async addToWishlist(productId, isFromRecommended = false) {
        const result = await this.addToWishlistAPI(productId);
        if (result.success) {
            // Find the product details to add to local array
            let productDetails = null;
            if (isFromRecommended && this.recommendedItems) {
                productDetails = this.recommendedItems.find(item => item.id == productId);
            }
            
            if (productDetails) {
                const newItem = {
                    ...productDetails,
                    wishlist_id: Date.now(), // Temporary ID until we get the real one
                    addedDate: new Date()
                };
                this.wishlistItems.unshift(newItem);
                this.renderWishlist();
                this.updateStats();
                this.updateBadges();
                this.showNotification('Added to wishlist!', 'success');
            }
        } else {
            this.showNotification(result.message || 'Failed to add to wishlist', 'error');
        }
    }

    // Override removeFromWishlist to use backend
    async removeFromWishlist(itemId, showNotification = true) {
        const item = this.wishlistItems.find(item => item.id == itemId);
        if (!item) return;

        const result = await this.removeFromWishlistAPI(item.product_id);
        if (result.success) {
            this.wishlistItems = this.wishlistItems.filter(item => item.id != itemId);
            this.renderWishlist();
            this.updateStats();
            this.updateBadges();
            if (showNotification) {
                this.showNotification('Removed from wishlist', 'info');
            }
        } else {
            this.showNotification(result.message || 'Failed to remove from wishlist', 'error');
        }
    }

    // Override renderRecommended to use backend data
    async renderRecommended() {
        if (!this.elements.recommendedGrid) return;

        // Load fresh recommended data
        const recommendedData = await this.fetchRecommendedData();
        if (recommendedData.length > 0) {
            this.recommendedItems = recommendedData;
        }

        this.elements.recommendedGrid.innerHTML = this.recommendedItems.map((item, index) => {
            const isInWishlist = this.wishlistItems.some(w => w.id === item.id);
            return `
                <div class="recommended-item" data-id="${item.id}" style="animation-delay: ${index * 0.1}s;">
                    <div class="rec-image">
                        <img src="${item.image}" alt="${item.name}" loading="lazy">
                        <button class="rec-add-btn" onclick="${isInWishlist ? '' : `wishlist.addToWishlist(${item.id}, true)`}" 
                                title="${isInWishlist ? 'Already in wishlist' : 'Add to wishlist'}" aria-label="${isInWishlist ? 'Already in wishlist' : `Add ${item.name} to wishlist`}" ${isInWishlist ? 'disabled' : ''}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="${isInWishlist ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                        </button>
                    </div>
                    <div class="rec-content">
                        <h4>${item.name}</h4>
                        <div class="rec-price">$${item.price.toLocaleString()}</div>
                    </div>
                </div>
            `;
        }).join('');

        // Observe recommended items for animation
        this.observeItems('.recommended-item');
    }

    saveCartData() {
        try {
            localStorage.setItem('egyptianLuxuryCart', JSON.stringify(this.cartItems));
        } catch (error) {
            console.error('Error saving cart data:', error);
            this.showNotification('Error saving cart', 'error');
        }
    }

    renderWishlist() {
        if (!this.elements.wishlistGrid) return;

        this.filteredItems = [...this.wishlistItems];
        this.applyFilters();

        if (this.filteredItems.length === 0) {
            this.showEmptyState();
        } else {
            this.hideEmptyState();
            this.elements.wishlistGrid.className = `wishlist-grid${this.currentView === 'list' ? ' list-view' : ''}`;
            this.elements.wishlistGrid.innerHTML = this.filteredItems.map((item, index) => 
                this.renderWishlistItem(item, index)
            ).join('');
            
            // Observe new items for animation
            this.observeItems('.wishlist-item');
        }

        this.updateStats();
        if (typeof window.updateCartBadge === 'function') window.updateCartBadge();
    }

    renderWishlistItem(item, index) {
        const availability = item.inStock ? 'in-stock' : 'out-of-stock';
        const availabilityText = item.inStock ? 'In Stock' : 'Out of Stock';
        const hasSale = item.originalPrice && item.originalPrice > item.price;
        const discountPercent = hasSale ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : 0;
        
        // Ensure price is properly formatted
        const displayPrice = parseFloat(item.price) || 0;
        const formattedPrice = displayPrice.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        
        return `
            <div class="wishlist-card${this.currentView === 'list' ? ' list-view' : ''}" data-id="${item.id}" style="animation-delay: ${index * 0.1}s;">
                <div class="wishlist-card-image-wrapper" style="position:relative;">
                    <img class="wishlist-card-image" src="${item.image}" alt="${item.name}" loading="lazy" onerror="this.onerror=null;this.src='images/1-7-scaled.jpg';">
                    ${hasSale ? `<div class="wishlist-card-discount">-${discountPercent}%</div>` : ''}
                </div>
                <div class="wishlist-card-content">
                    ${(item.badges || []).length > 0 ? `
                        <div class="wishlist-card-badges">
                            ${item.badges.map(badge => `<span class="wishlist-card-badge">${badge}</span>`).join('')}
                        </div>
                    ` : ''}
                    <h3 class="wishlist-card-title">${item.name}</h3>
                    <p class="wishlist-card-description">${item.description}</p>
                    <div class="wishlist-card-meta">
                        <span class="wishlist-card-sku">SKU: ${item.sku}</span>
                        <span class="wishlist-card-availability ${availability}">
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"></circle></svg>
                            ${availabilityText}
                        </span>
                    </div>
                    <div class="wishlist-card-price-row">
                        <span class="wishlist-card-price">$${formattedPrice}</span>
                        ${item.originalPrice ? `<span class="wishlist-card-original-price">$${parseFloat(item.originalPrice).toLocaleString()}</span>` : ''}
                    </div>
                    <div class="wishlist-card-features">
                        ${(item.features || []).map(feature => `<span class="wishlist-card-feature">${feature}</span>`).join('')}
                    </div>
                    <div class="wishlist-card-actions">
                        <button class="wishlist-card-btn wishlist-card-btn-primary" onclick="wishlist.addToCart(${item.id})" ${!item.inStock ? 'disabled' : ''} aria-label="Add ${item.name} to cart">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                            ${item.inStock ? 'Add to Cart' : 'Unavailable'}
                        </button>
                        <button class="wishlist-card-btn wishlist-card-btn-outline" onclick="wishlist.removeFromWishlist(${item.id})" aria-label="Remove ${item.name} from wishlist">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderRecommended() {
        if (!this.elements.recommendedGrid) return;

        this.elements.recommendedGrid.innerHTML = this.recommendedItems.map((item, index) => {
            const isInWishlist = this.wishlistItems.some(w => w.id === item.id);
            const formattedPrice = (parseFloat(item.price) || 0).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
            return `
                <div class="recommended-item" data-id="${item.id}" style="animation-delay: ${index * 0.1}s;">
                    <div class="rec-image">
                        <img src="${item.image}" alt="${item.name}" loading="lazy" onerror="this.onerror=null;this.src='images/5-1.jpg';">
                        <button class="rec-add-btn" onclick="${isInWishlist ? '' : `wishlist.addToWishlist(${item.id}, true)`}" 
                                title="${isInWishlist ? 'Already in wishlist' : 'Add to wishlist'}" aria-label="${isInWishlist ? 'Already in wishlist' : `Add ${item.name} to wishlist`}" ${isInWishlist ? 'disabled' : ''}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="${isInWishlist ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                        </button>
                    </div>
                    <div class="rec-content">
                        <h4>${item.name}</h4>
                        <div class="rec-price">$${formattedPrice}</div>
                    </div>
                </div>
            `;
        }).join('');

        // Observe recommended items for animation
        this.observeItems('.recommended-item');
    }

    observeItems(selector) {
        if (!this.intersectionObserver) return;
        
        document.querySelectorAll(selector).forEach(item => {
            this.intersectionObserver.observe(item);
        });
    }

    showEmptyState() {
        if (this.elements.emptyState) {
            this.elements.emptyState.style.display = 'block';
        }
        if (this.elements.wishlistGrid) {
            this.elements.wishlistGrid.style.display = 'none';
        }
    }

    hideEmptyState() {
        if (this.elements.emptyState) {
            this.elements.emptyState.style.display = 'none';
        }
        if (this.elements.wishlistGrid) {
            this.elements.wishlistGrid.style.display = 'grid';
        }
    }

    setView(view) {
        this.currentView = view;

        // Update view buttons
        if (this.elements.gridViewBtn && this.elements.listViewBtn) {
            this.elements.gridViewBtn.classList.toggle('active', view === 'grid');
            this.elements.listViewBtn.classList.toggle('active', view === 'list');
        }

        this.applyFilters();
        this.renderWishlist();

        // Save view preference
        localStorage.setItem('egyptianWishlistView', view);
        this.showNotification(`View changed to ${view}`, 'info');
    }

    setSort(sort) {
        this.currentSort = sort;
        this.applyFilters();
        this.renderWishlist();
        this.showNotification(`Sorted by ${this.getSortLabel(sort)}`, 'info');
    }

    getSortLabel(sort) {
        const labels = {
            'newest': 'Newest First',
            'price-low': 'Price: Low to High',
            'price-high': 'Price: High to Low',
            'name-asc': 'Name: A to Z',
            'name-desc': 'Name: Z to A'
        };
        return labels[sort] || 'Default';
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.applyFilters();
        this.renderWishlist();

        const filterLabel = filter === 'all' ? 'All Categories' : filter.charAt(0).toUpperCase() + filter.slice(1);
        this.showNotification(`Filtered by ${filterLabel}`, 'info');
    }

    applyFilters() {
        // Always start with a fresh copy of wishlistItems
        let filtered = [...this.wishlistItems];
        
        console.log('Initial items count:', filtered.length);

        // Apply search filter if there's a search query
        if (this.searchQuery && this.searchQuery.trim() !== '') {
            const query = this.searchQuery.toLowerCase().trim();
            console.log('Applying search filter with query:', query);
            
            filtered = filtered.filter(item => {
                const matches = item.name.toLowerCase().includes(query) ||
                    (item.description || '').toLowerCase().includes(query) ||
                    (item.features || []).some(feature => feature.toLowerCase().includes(query)) ||
                    (item.badges || []).some(badge => badge.toLowerCase().includes(query));
                return matches;
            });
            console.log('Items after search filter:', filtered.length);
        }

        // Apply category filter if not 'all'
        if (this.currentFilter && this.currentFilter !== 'all') {
            console.log('Applying category filter:', this.currentFilter);
            filtered = filtered.filter(item => item.category === this.currentFilter);
            console.log('Items after category filter:', filtered.length);
        }

        // Apply sorting
        console.log('Applying sort:', this.currentSort);
        switch (this.currentSort) {
            case 'price-low':
                filtered.sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
                break;
            case 'price-high':
                filtered.sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0));
                break;
            case 'name-asc':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                filtered.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'newest':
            default:
                filtered.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));
                break;
        }
        
        // Update filteredItems with the final result
        this.filteredItems = filtered;
        console.log('Final filtered items count:', this.filteredItems.length);
        
        // Update stats after filtering
        this.updateStats();

        this.filteredItems = filtered;
    }

    updateStats() {
        try {
            // Ensure we have items to process
            if (!this.wishlistItems || !Array.isArray(this.wishlistItems)) {
                console.error('Wishlist items not properly initialized');
                return;
            }

            const totalItems = this.wishlistItems.length;
            
            // Calculate total value with detailed logging
            let totalValue = 0;
            this.wishlistItems.forEach(item => {
                const price = parseFloat(item.price) || 0;
                if (isNaN(price)) {
                    console.warn('Invalid price found in wishlist item:', item);
                } else {
                    totalValue += price;
                }
            });

            // Ensure we have a valid filteredItems array
            const filteredItems = Array.isArray(this.filteredItems) && this.filteredItems.length > 0 
                ? this.filteredItems 
                : this.wishlistItems;

            const filteredCount = filteredItems.length;
            let filteredValue = 0;
            filteredItems.forEach(item => {
                const price = parseFloat(item.price) || 0;
                if (!isNaN(price)) {
                    filteredValue += price;
                }
            });

            console.log('Updating stats:', { 
                totalItems, 
                totalValue, 
                filteredCount, 
                filteredValue,
                items: this.wishlistItems.map(i => ({ 
                    id: i.id, 
                    name: i.name,
                    price: i.price,
                    type: typeof i.price
                }))
            });

            // Update hero stats with animation (total items and value)
            if (this.elements.totalItems) {
                this.animateNumber(this.elements.totalItems, totalItems);
            }
            if (this.elements.totalValue) {
                this.animateNumber(this.elements.totalValue, totalValue, true);
            }

            // Update filter bar stats (filtered items and value)
            if (this.elements.totalItemsDisplay) {
                this.elements.totalItemsDisplay.textContent = `${filteredCount} of ${totalItems}`;
            }
            if (this.elements.totalValueDisplay) {
                // Format as currency with 2 decimal places
                const formattedValue = filteredValue.toLocaleString('en-US', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                });
                this.elements.totalValueDisplay.textContent = `$${formattedValue}`;
            }
        } catch (error) {
            console.error('Error updating stats:', error);
            // Set default values if there's an error
            if (this.elements.totalItems) this.elements.totalItems.textContent = '0';
            if (this.elements.totalValue) this.elements.totalValue.textContent = '$0.00';
            if (this.elements.totalItemsDisplay) this.elements.totalItemsDisplay.textContent = '0 of 0';
            if (this.elements.totalValueDisplay) this.elements.totalValueDisplay.textContent = '$0.00';
        }
    }

    animateNumber(element, targetValue, isCurrency = false) {
        const startValue = parseFloat(element.textContent.replace(/[^\d.]/g, '')) || 0;
        const duration = 1500; // 1.5 seconds
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = startValue + (targetValue - startValue) * easeOut;
            
            if (isCurrency) {
                element.textContent = `$${currentValue.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}`;
            } else {
                element.textContent = Math.round(currentValue).toLocaleString();
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    updateBadges() {
        if (this.elements.wishlistBadge) {
            this.elements.wishlistBadge.textContent = this.wishlistItems.length;
            this.elements.wishlistBadge.style.display = this.wishlistItems.length > 0 ? 'flex' : 'none';
            this.elements.wishlistBadge.style.animation = 'badgePulse 0.6s ease';
            setTimeout(() => {
                this.elements.wishlistBadge.style.animation = '';
            }, 600);
        }

        if (this.elements.cartBadge) {
            // Always reload cart from localStorage to sync with cart page
            const cart = JSON.parse(localStorage.getItem('egyptianLuxuryCart')) || [];
            const totalCartItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
            this.elements.cartBadge.textContent = totalCartItems;
            this.elements.cartBadge.style.display = totalCartItems > 0 ? 'flex' : 'none';
            if (totalCartItems > 0) {
                this.elements.cartBadge.style.animation = 'badgePulse 0.6s ease';
                setTimeout(() => {
                    this.elements.cartBadge.style.animation = '';
                }, 600);
            }
        }
    }

    addToCart(productId) {
        const product = this.wishlistItems.find(p => p.id === productId) || 
                        this.recommendedItems.find(p => p.id === productId);
        if (!product) return;

        // Check if item already in cart
        const existingCartItem = this.cartItems.find(cartItem => cartItem.id === productId);
        if (existingCartItem) {
            existingCartItem.quantity += 1;
            this.showNotification(`Increased quantity of ${product.name}`, 'success');
        } else {
            this.cartItems.push({
                ...product,
                quantity: 1,
                addedAt: new Date().toISOString()
            });
            this.showNotification(`${product.name} added to cart!`, 'success');
        }

        this.saveCartData();
        this.updateBadges();
        if (typeof window.updateCartBadge === 'function') window.updateCartBadge();
    }

    addAllToCart() {
        const availableItems = this.wishlistItems.filter(item => item.inStock);
        if (availableItems.length === 0) {
            this.showNotification('No available items to add', 'warning');
            return;
        }

        let addedCount = 0;
        availableItems.forEach(item => {
            const existingCartItem = this.cartItems.find(cartItem => cartItem.id === item.id);
            if (existingCartItem) {
                existingCartItem.quantity += 1;
            } else {
                this.cartItems.push({
                    ...item,
                    quantity: 1,
                    addedAt: new Date().toISOString()
                });
            }
            addedCount++;
        });

        this.saveCartData();
        this.updateBadges();
        this.showNotification(`${addedCount} divine treasures added to cart!`, 'success');
        if (typeof window.updateCartBadge === 'function') window.updateCartBadge();
    }

    shareWishlist() {
        const wishlistData = {
            title: 'My Egyptian Creativity Collection',
            items: this.wishlistItems.map(item => ({
                name: item.name,
                price: item.price,
                image: item.image
            })),
            totalValue: this.wishlistItems.reduce((sum, item) => sum + item.price, 0)
        };

        if (navigator.share) {
            navigator.share({
                title: wishlistData.title,
                text: `Discover my collection of ${wishlistData.items.length} ancient Egyptian creativity worth $${wishlistData.totalValue.toLocaleString()}!`,
                url: window.location.href
            }).catch(err => {
                console.log('Error sharing:', err);
                this.copyWishlistLink();
            });
        } else {
            this.copyWishlistLink();
        }
    }

    copyWishlistLink() {
        const url = window.location.href;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(() => {
                this.showNotification('Wishlist link copied to clipboard!', 'success');
            }).catch(() => {
                this.fallbackCopy(url);
            });
        } else {
            this.fallbackCopy(url);
        }
    }

    fallbackCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            this.showNotification('Wishlist link copied to clipboard!', 'success');
        } catch (err) {
            this.showNotification('Failed to copy link', 'error');
        }
        document.body.removeChild(textArea);
    }

    showNotification(message, type = 'info', duration = 4000) {
        if (!this.elements.notificationContainer) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                ${this.getNotificationIcon(type)}
            </svg>
            <span>${message}</span>
        `;

        this.elements.notificationContainer.appendChild(notification);

        // Trigger animation
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // Auto remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 400);
        }, duration);

        // Add click to dismiss
        notification.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 400);
        });
    }

    getNotificationIcon(type) {
        switch (type) {
            case 'success':
                return '<path d="M20 6 9 17l-5-5"></path>';
            case 'error':
                return '<circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path>';
            case 'warning':
                return '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" x2="12" y1="9" y2="13"></line><line x1="12" x2="12.01" y1="17" y2="17"></line>';
            case 'info':
            default:
                return '<circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path>';
        }
    }

    // Utility function for throttling
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Load user preferences
    loadUserPreferences() {
        const savedView = localStorage.getItem('egyptianWishlistView');
        if (savedView && ['grid', 'list'].includes(savedView)) {
            this.setView(savedView);
        }
    }

    setupSearchModal() {
        const searchBtn = document.getElementById('searchBtn');
        const searchModal = document.getElementById('searchModal');
        const searchClose = document.getElementById('searchClose');
        const searchInput = document.getElementById('searchInput');
        const searchBackdrop = document.getElementById('searchBackdrop');

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
        if (searchBackdrop) {
            searchBackdrop.addEventListener('click', () => {
                searchModal.classList.remove('active');
            });
        }
        // Optional: close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchModal.classList.contains('active')) {
                searchModal.classList.remove('active');
            }
        });
    }
}

// Global wishlist instance
window.wishlist = null;

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', () => {
    // Create wishlist instance
    window.wishlist = new EgyptianWishlist();

    // Initialize wishlist
    try {
        // Initialize loading animation
        window.wishlist.initializeLoading();
        
        // Initialize main functionality
        window.wishlist.init();
    } catch (error) {
        console.error('Failed to initialize wishlist:', error);
    }
});

// Handle escape key for closing modals and sidebars
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close any active modals or sidebars
        console.log('Escape key pressed');
    }
});

console.log('🏺 Egyptian Creativity - Enhanced Wishlist page script loaded successfully!');

// Ensure all sidebars are closed by default
function ensureSidebarsClosed() {
  const sidebars = document.querySelectorAll('.sidebar');
  sidebars.forEach(sidebar => {
    sidebar.classList.remove('active');
  });
}