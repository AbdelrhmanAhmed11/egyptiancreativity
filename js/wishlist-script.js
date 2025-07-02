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

        // Initialize sample data
        this.initSampleData();
    }

    init() {
        console.log('🏺 Egyptian Wishlist - Initializing...');
        
        this.initializeLoading();
        this.gatherElements();
        this.setupEventListeners();
        this.setupIntersectionObserver();
        
        // Initialize with sample data first (will be used if no stored data)
        this.initSampleData();
        
        // Then try to load stored data (will override sample data if available)
        this.loadStoredData();
        
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

    initSampleData() {
        // Enhanced sample data with Egyptian theming
        this.wishlistItems = [
            {
                id: 1,
                name: "Ancient Pharaoh Mask of Tutankhamun",
                description: "An exquisite reproduction of the legendary burial mask, crafted with 24-karat gold plating and precious gemstones in the traditional Egyptian style. Each piece is meticulously handcrafted by master artisans.",
                price: 12500,
                originalPrice: 15000,
                image: "images/1-7-scaled.jpg",
                category: "jewelry",
                sku: "EGY-MASK-001",
                inStock: true,
                features: ["24K Gold Plated", "Handcrafted", "Museum Quality", "Certificate of Authenticity"],
                badges: ["Featured", "Premium", "Limited Edition"],
                addedDate: new Date('2024-01-15')
            },
            {
                id: 2,
                name: "Sacred Ankh Pendant Collection",
                description: "Symbol of eternal life, this magnificent ankh collection is crafted from pure gold with intricate engravings representing the cycle of life and death in ancient Egyptian mythology.",
                price: 3750,
                originalPrice: null,
                image: "images/5-1.jpg",
                category: "jewelry",
                sku: "ANK-PEND-002",
                inStock: true,
                features: ["Pure Gold", "Hand Engraved", "Adjustable Chain", "Gift Box Included"],
                badges: ["New Arrival", "Sacred"],
                addedDate: new Date('2024-01-20')
            },
            {
                id: 3,
                name: "Royal Canopic Jars Set",
                description: "Four magnificent vessels representing the sons of Horus, each meticulously detailed with hieroglyphic inscriptions and gold leaf accents. Perfect for collectors of ancient Egyptian artifacts.",
                price: 8900,
                originalPrice: 10500,
                image: "images/5-1.jpg",
                category: "boxes",
                sku: "CPJ-ROYAL-003",
                inStock: true,
                features: ["Hand Painted", "Ceramic", "Set of 4", "Display Stand"],
                badges: ["Sale", "Limited Edition", "Collector's Item"],
                addedDate: new Date('2024-01-25')
            },
            {
                id: 4,
                name: "Divine Scarab Amulet Collection",
                description: "A stunning collection of protective amulets featuring intricate scarab designs, symbolizing rebirth and eternal life in ancient Egyptian culture. Made with premium materials.",
                price: 2850,
                originalPrice: null,
                image: "images/5-3.jpg",
                category: "jewelry",
                sku: "SCB-DIV-004",
                inStock: true,
                features: ["Protective", "Handcrafted", "Sterling Silver", "Multiple Sizes"],
                badges: ["Sacred", "Protection"],
                addedDate: new Date('2024-02-01')
            },
            {
                id: 5,
                name: "Cleopatra's Crown Replica",
                description: "A breathtaking reproduction of the legendary queen's crown, adorned with precious stones and intricate goldwork fit for royalty. Museum-quality craftsmanship.",
                price: 18750,
                originalPrice: null,
                image: "images/9-1.jpg",
                category: "accessories",
                sku: "CLR-CROWN-005",
                inStock: true,
                features: ["Precious Stones", "Goldwork", "Royal Design", "Display Case"],
                badges: ["Featured", "Royal", "Masterpiece"],
                addedDate: new Date('2024-02-05')
            },
            {
                id: 6,
                name: "Hieroglyphic Papyrus Scroll Collection",
                description: "Authentic papyrus scrolls featuring ancient Egyptian scenes and hieroglyphic texts, handcrafted by skilled artisans using traditional methods passed down through generations.",
                price: 1250,
                originalPrice: 1500,
                image: "images/10.jpg",
                category: "decorations",
                sku: "HPS-SCROLL-006",
                inStock: true,
                features: ["Handcrafted", "Authentic Papyrus", "Traditional Methods", "Multiple Designs"],
                badges: ["Sale", "Ancient", "Authentic"],
                addedDate: new Date('2024-02-10')
            },
            {
                id: 7,
                name: "Pharaoh's Ceremonial Scepter",
                description: "Magnificent replica of a pharaoh's ceremonial scepter with golden finish and precious stone inlays. A symbol of divine authority and power in ancient Egypt.",
                price: 6500,
                originalPrice: null,
                image: "images/5-1 (1).jpg",
                category: "accessories",
                sku: "PSR-SCEP-007",
                inStock: true,
                features: ["Golden Finish", "Precious Stones", "Ceremonial Design", "Premium Materials"],
                badges: ["New Arrival", "Royal", "Ceremonial"],
                addedDate: new Date('2024-02-15')
            },
            {
                id: 8,
                name: "Isis Goddess Statue Premium",
                description: "Beautiful statue of the goddess Isis, protector of magic and motherhood, crafted in bronze with gold accents. A divine addition to any collection.",
                price: 4200,
                originalPrice: null,
                image: "images/logo.jpg",
                category: "decorations",
                sku: "IGS-STAT-008",
                inStock: true,
                features: ["Bronze", "Gold Accents", "Divine Protection", "Handcrafted"],
                badges: ["Sacred", "Divine", "Protection"],
                addedDate: new Date('2024-02-20')
            }
        ];

        // Enhanced recommended items
        this.recommendedItems = [
            {
                id: 101,
                name: "Golden Pharaoh Mask",
                description: "Authentic 18th Dynasty ceremonial mask",
                price: 12500,
                image: "images/1-7-scaled.jpg",
                category: "jewelry"
            },
            {
                id: 102,
                name: "Craftsman at Work",
                description: "Master artisan creating ancient wonders",
                price: 3200,
                image: "images/4-5-scaled.jpg",
                category: "decorations"
            },
            {
                id: 103,
                name: "Pharaoh's Ceremonial Scepter",
                description: "Magnificent replica with golden finish and precious stones",
                price: 6500,
                image: "images/5-1 (1).jpg",
                category: "accessories"
            },
            {
                id: 104,
                name: "Finished Artifacts",
                description: "A collection of finished ancient Egyptian artifacts",
                price: 2850,
                image: "images/5-3.jpg",
                category: "decorations"
            },
            {
                id: 105,
                name: "Cleopatra's Crown Replica",
                description: "A breathtaking reproduction of the legendary queen's crown",
                price: 18750,
                image: "images/9-1.jpg",
                category: "accessories"
            },
            {
                id: 106,
                name: "Hieroglyphic Papyrus Scroll Collection",
                description: "Authentic papyrus scrolls featuring ancient Egyptian scenes",
                price: 1250,
                image: "images/10.jpg",
                category: "decorations"
            }
        ];
    }

    loadStoredData() {
        try {
            // First, try to load from localStorage
            const storedWishlist = localStorage.getItem('egyptianWishlist');
            let shouldInitSample = false;
            if (storedWishlist) {
                try {
                    const parsed = JSON.parse(storedWishlist);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        this.wishlistItems = parsed.map(item => ({
                            ...item,
                            price: parseFloat(item.price) || 0,
                            addedDate: item.addedDate ? new Date(item.addedDate) : new Date()
                        }));
                        console.log('Loaded wishlist from storage:', this.wishlistItems);
                        return; // Exit early if we loaded from storage
                    } else {
                        shouldInitSample = true;
                    }
                } catch (e) {
                    console.error('Error parsing wishlist data:', e);
                    shouldInitSample = true;
                }
            } else {
                shouldInitSample = true;
            }

            // If we get here, either there was no stored wishlist or it was empty/invalid
            if (shouldInitSample) {
                console.log('No valid wishlist found in storage, initializing with sample data');
                this.initSampleData();
                this.saveWishlistData();
            }
            // Always try to load cart
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
            // If anything fails, always fall back to sample data
            this.initSampleData();
            this.saveWishlistData();
        }
    }

    saveWishlistData() {
        try {
            localStorage.setItem('egyptianWishlist', JSON.stringify(this.wishlistItems));
        } catch (error) {
            console.error('Error saving wishlist data:', error);
            this.showNotification('Error saving wishlist', 'error');
        }
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
        let displayPrice = item.price;
        if (!displayPrice || displayPrice === 0) {
            if (window.allProducts) {
                let found = window.allProducts.find(p => p.id === item.id || p.name === item.name || p.title === item.title);
                if (found) displayPrice = found.price;
            }
        }
        return `
            <div class="wishlist-card${this.currentView === 'list' ? ' list-view' : ''}" data-id="${item.id}" style="animation-delay: ${index * 0.1}s;">
                <div class="wishlist-card-image-wrapper" style="position:relative;">
                    <img class="wishlist-card-image" src="${item.image}" alt="${item.name}" loading="lazy" onerror="this.onerror=null;this.src='https://images.pexels.com/photos/12935073/pexels-photo-12935073.jpeg';">
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
                        <span class="wishlist-card-price">$${displayPrice ? displayPrice.toLocaleString() : '0'}</span>
                        ${item.originalPrice ? `<span class="wishlist-card-original-price">$${item.originalPrice.toLocaleString()}</span>` : ''}
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

        this.elements.recommendedGrid.innerHTML = this.recommendedItems.map((item, index) => `
            <div class="recommended-item" data-id="${item.id}" style="animation-delay: ${index * 0.1}s;">
                <div class="rec-image">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                    <button class="rec-add-btn" onclick="wishlist.addToWishlist(${item.id}, true)" 
                            title="Add to wishlist" aria-label="Add ${item.name} to wishlist">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                </div>
                <div class="rec-content">
                    <h4>${item.name}</h4>
                    <div class="rec-price">$${item.price.toLocaleString()}</div>
                </div>
            </div>
        `).join('');

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
                const formattedValue = filteredValue.toLocaleString(undefined, { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                });
                this.elements.totalValueDisplay.textContent = `$${formattedValue}`;
            }
        } catch (error) {
            console.error('Error updating stats:', error);
            // Set default values if there's an error
            if (this.elements.totalItems) this.elements.totalItems.textContent = '0';
            if (this.elements.totalValue) this.elements.totalValue.textContent = '$0';
            if (this.elements.totalItemsDisplay) this.elements.totalItemsDisplay.textContent = '0 of 0';
            if (this.elements.totalValueDisplay) this.elements.totalValueDisplay.textContent = '$0';
        }
    }

    animateNumber(element, targetValue, isCurrency = false) {
        const startValue = parseInt(element.textContent.replace(/[^\d]/g, '')) || 0;
        const duration = 1500; // 1.5 seconds
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.round(startValue + (targetValue - startValue) * easeOut);
            
            if (isCurrency) {
                element.textContent = `$${currentValue.toLocaleString()}`;
            } else {
                element.textContent = currentValue.toLocaleString();
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

    removeFromWishlist(itemId, showNotification = true) {
        const item = this.wishlistItems.find(item => item.id === itemId);
        if (!item) return;

        // Add confirmation for expensive items
        if (item.price > 5000 && showNotification) {
            if (!confirm(`Are you sure you want to remove "${item.name}" from your sacred collection?`)) {
                return;
            }
        }

        this.wishlistItems = this.wishlistItems.filter(item => item.id !== itemId);
        this.saveWishlistData();
        this.renderWishlist();
        this.updateBadges();
        if (typeof window.updateCartBadge === 'function') window.updateCartBadge();

        if (showNotification) {
            this.showNotification(`${item.name} removed from wishlist`, 'info');
        }
    }

    addToWishlist(productId, isFromRecommended = false) {
        const product = this.recommendedItems.find(p => p.id === productId);
        if (!product) return;

        // Check if already in wishlist
        if (this.wishlistItems.find(wishlistItem => wishlistItem.id === productId)) {
            this.showNotification('Item already in your sacred collection', 'warning');
            return;
        }

        // Convert recommended item to wishlist format
        const wishlistItem = {
            ...product,
            sku: `REC-${productId}`,
            inStock: true,
            features: ["Recommended", "High Quality"],
            badges: ["Recommended"],
            addedDate: new Date()
        };

        this.wishlistItems.unshift(wishlistItem); // Add to beginning
        this.saveWishlistData();
        this.renderWishlist();
        this.updateBadges();
        this.showNotification(`${product.name} added to your sacred collection!`, 'success');
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