// Egyptian Creativity Shop - Enhanced JavaScript

// Product Data
const PRODUCTS_DATA = [
    {
        id: 1,
        title: "Ancient Pharaoh Mask",
        category: "jewelry",
        price: 12500,
        originalPrice: 15000,
        image: "images/1-7-scaled.jpg",
        description: "An exquisite reproduction of the legendary burial mask, crafted with 24-karat gold and precious gemstones in the traditional Egyptian style.",
        rating: 4.8,
        reviews: 24,
        badges: ["featured"],
        inStock: true,
        quantity: 15
    },
    {
        id: 2,
        title: "Sacred Ankh Pendant",
        category: "jewelry",
        price: 3750,
        originalPrice: null,
        image: "images/4-5-scaled.jpg",
        description: "Symbol of eternal life, this magnificent ankh is crafted from pure gold with intricate engravings representing the cycle of life and death.",
        rating: 4.9,
        reviews: 18,
        badges: ["new"],
        inStock: true,
        quantity: 8
    },
    {
        id: 3,
        title: "Royal Canopic Jars",
        category: "boxes",
        price: 8900,
        originalPrice: 10500,
        image: "images/5-1 (1).jpg",
        description: "Four magnificent vessels representing the sons of Horus, each meticulously detailed with hieroglyphic inscriptions and gold leaf accents.",
        rating: 4.7,
        reviews: 32,
        badges: ["sale"],
        inStock: true,
        quantity: 5
    },
    {
        id: 4,
        title: "Divine Scarab Amulet",
        category: "jewelry",
        price: 2850,
        originalPrice: null,
        image: "images/5-1.jpg",
        description: "A stunning set of protective amulets featuring intricate scarab designs, symbolizing rebirth and eternal life in ancient Egyptian culture.",
        rating: 4.6,
        reviews: 15,
        badges: [],
        inStock: true,
        quantity: 12
    },
    {
        id: 5,
        title: "Cleopatra's Crown Replica",
        category: "accessories",
        price: 18750,
        originalPrice: null,
        image: "images/5-3.jpg",
        description: "A breathtaking reproduction of the legendary queen's crown, adorned with precious stones and intricate goldwork fit for royalty.",
        rating: 4.9,
        reviews: 28,
        badges: ["featured"],
        inStock: true,
        quantity: 3,
        buyWithBox: true,
        boxPrice: 2500
    },
    {
        id: 6,
        title: "Hieroglyphic Papyrus Scroll",
        category: "decorations",
        price: 1250,
        originalPrice: 1500,
        image: "images/9-1.jpg",
        description: "Authentic papyrus scroll featuring ancient Egyptian scenes and hieroglyphic texts, handcrafted by skilled artisans.",
        rating: 4.5,
        reviews: 41,
        badges: ["sale"],
        inStock: true,
        quantity: 20
    },
    {
        id: 7,
        title: "Pharaoh's Scepter Replica",
        category: "accessories",
        price: 6500,
        originalPrice: null,
        image: "images/10.jpg",
        description: "Magnificent replica of a pharaoh's ceremonial scepter with golden finish and precious stone inlays.",
        rating: 4.8,
        reviews: 12,
        badges: ["new"],
        inStock: true,
        quantity: 2,
        buyWithBox: true,
        boxPrice: 1800
    },
    {
        id: 8,
        title: "Isis Goddess Statue",
        category: "decorations",
        price: 4200,
        originalPrice: null,
        image: "images/5-1 (1).jpg",
        description: "Beautiful statue of the goddess Isis, protector of magic and motherhood, crafted in bronze with gold accents.",
        rating: 4.7,
        reviews: 19,
        badges: [],
        inStock: true,
        quantity: 7
    },
    {
        id: 9,
        title: "Senet Game Board",
        category: "accessories",
        price: 3200,
        originalPrice: 3800,
        image: "images/9-1.jpg",
        description: "Ancient Egyptian board game of Senet, the game of passing, complete with playing pieces and instructions.",
        rating: 4.9,
        reviews: 35,
        badges: ["sale", "featured"],
        inStock: true,
        quantity: 4,
        buyWithBox: true,
        boxPrice: 1200
    },
    {
        id: 10,
        title: "Nefertiti Bust Replica",
        category: "decorations",
        price: 2800,
        originalPrice: null,
        image: "images/1-7-scaled.jpg",
        description: "Stunning replica of the famous Nefertiti bust, capturing the beauty and elegance of the ancient queen.",
        rating: 4.6,
        reviews: 52,
        badges: [],
        inStock: true,
        quantity: 25
    },
    {
        id: 11,
        title: "Egyptian Collar Necklace",
        category: "jewelry",
        price: 4200,
        originalPrice: 5000,
        image: "images/4-5-scaled.jpg",
        description: "Elaborate collar necklace worn by Egyptian nobility, featuring intricate beadwork and golden elements.",
        rating: 4.8,
        reviews: 22,
        badges: ["sale"],
        inStock: true,
        quantity: 6
    },
    {
        id: 12,
        title: "Tutankhamun Treasure Box",
        category: "boxes",
        price: 7200,
        originalPrice: 8500,
        image: "images/5-1 (1).jpg",
        description: "Ornate treasure box inspired by Tutankhamun's tomb, with authentic hieroglyphic carvings and golden accents.",
        rating: 4.9,
        reviews: 16,
        badges: ["sale", "featured"],
        inStock: true,
        quantity: 3
    }
];

// Shop State Management Class
class ShopManager {
    constructor() {
        this.products = [...PRODUCTS_DATA];
        this.filteredProducts = [...PRODUCTS_DATA];
        this.currentCategory = 'all';
        this.currentSort = 'default';
        this.currentView = 'grid';
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.searchQuery = '';
        this.priceRange = { min: 0, max: 50000 };
        this.cart = JSON.parse(localStorage.getItem('egyptianLuxuryCart')) || [];
        this.wishlist = JSON.parse(localStorage.getItem('egyptianWishlist')) || [];

        this.init();
    }

    // Initialize the shop
    init() {
        this.bindEvents();
        this.handleURLParameters();
        this.applyFilters();
        this.initializeLoading();
        this.updateCartBadge();
        this.updateWishlistBadge();
        this.initializeSidebars();
        ensureSidebarsClosed();
    }

    // Handle URL parameters for category filtering
    handleURLParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        
        if (category && ['jewelry', 'decorations', 'boxes', 'accessories'].includes(category)) {
            this.currentCategory = category;
            
            // Update the category select dropdown if it exists
            const categorySelect = document.getElementById('categorySelect');
            if (categorySelect) {
                categorySelect.value = category;
            }
            
            // Update category filter buttons if they exist
            const filterButtons = document.querySelectorAll('.filter-btn');
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.filter === category) {
                    btn.classList.add('active');
                }
            });
            
            console.log(`🎯 Applied category filter: ${category}`);
        }
    }

    // Initialize loading animation
    initializeLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        const progressBar = document.querySelector('.progress-bar');
        const skipBtn = document.getElementById('skipBtn');
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => this.hideLoading(), 500);
            }
            if (progressBar) {
                progressBar.style.width = `${progress}%`;
            }
        }, 150);

        // Skip button
        if (skipBtn) {
            skipBtn.addEventListener('click', () => {
                clearInterval(interval);
                this.hideLoading();
            });
        }

        // Auto hide after 3 seconds
        setTimeout(() => {
            clearInterval(interval);
            this.hideLoading();
        }, 3000);
    }

    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
            setTimeout(() => {
                this.animateShopStats();
            }, 1000);
        } else {
            this.animateShopStats();
        }
    }

    // Count-up animation for shop stats
    animateShopStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            const text = stat.textContent.trim();
            // Only animate numbers (e.g., 500+, 100%, 25+)
            if (/^[\d,.Kk\+%]+$/.test(text)) {
                let finalValue = 0;
                let suffix = '';
                if (text.endsWith('K+')) {
                    finalValue = parseInt(text) * 1000;
                    suffix = 'K+';
                } else if (text.endsWith('+')) {
                    finalValue = parseInt(text);
                    suffix = '+';
                } else if (text.endsWith('%')) {
                    finalValue = parseInt(text);
                    suffix = '%';
                } else {
                    finalValue = parseInt(text.replace(/\D/g, ''));
                }
                const duration = 4000;
                let start = 0;
                const step = Math.ceil(finalValue / (duration / 16));
                function update() {
                    start += step;
                    if (start >= finalValue) {
                        stat.textContent = suffix ? (suffix === 'K+' ? (finalValue / 1000) + 'K+' : finalValue + suffix) : finalValue;
                    } else {
                        stat.textContent = suffix ? (suffix === 'K+' ? Math.floor(start / 1000) + 'K+' : start + suffix) : start;
                        requestAnimationFrame(update);
                    }
                }
                stat.textContent = suffix ? (suffix === 'K+' ? '0K+' : '0' + suffix) : '0';
                requestAnimationFrame(update);
            }
        });
    }

    // Bind all event listeners
    bindEvents() {
        // Category filter dropdown
        const categorySelect = document.getElementById('categorySelect');
        if (categorySelect) {
            categorySelect.addEventListener('change', (e) => {
                this.currentCategory = e.target.value;
                this.applyFilters();
            });
        }

        // Sort selection
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.applyFilters();
            });
        }

        // View toggle
        const gridViewBtn = document.getElementById('gridViewBtn');
        const listViewBtn = document.getElementById('listViewBtn');
        
        if (gridViewBtn) {
            gridViewBtn.addEventListener('click', () => this.setView('grid'));
        }
        if (listViewBtn) {
            listViewBtn.addEventListener('click', () => this.setView('list'));
        }

        // Price filter
        const applyPriceFilter = document.getElementById('applyPriceFilter');
        if (applyPriceFilter) {
            applyPriceFilter.addEventListener('click', () => {
                const minPrice = parseInt(document.getElementById('minPrice')?.value) || 0;
                const maxPrice = parseInt(document.getElementById('maxPrice')?.value) || 50000;
                this.priceRange = { min: minPrice, max: maxPrice };
                this.applyFilters();
            });
        }

        // Pagination
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.goToPage(this.currentPage - 1));
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.goToPage(this.currentPage + 1));
        }

        // Header actions
        const searchBtn = document.getElementById('searchBtn');
        const userBtn = document.getElementById('userBtn');
        const cartBtn = document.getElementById('cartBtn');
        const wishlistBtn = document.getElementById('wishlistBtn');
        
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
            cartBtn.addEventListener('click', () => this.openSidebar('cartSidebar'));
        }
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', () => this.openSidebar('wishlistSidebar'));
        }

        // Modal and sidebar controls
        this.bindModalEvents();
        this.bindSidebarEvents();

        // Search functionality
        const searchInput = document.getElementById('shopSearchInput');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.searchQuery = e.target.value;
                    this.applyFilters();
                }, 500);
            });
        }

        // Newsletter form
        const newsletterForm = document.getElementById('newsletterForm');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.showNotification('Thank you for subscribing to Egyptian Creativity!', 'success');
                e.target.reset();
            });
        }

        // Buy with box checkboxes
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('buy-with-box-input')) {
                const productId = parseInt(e.target.dataset.productId);
                const isChecked = e.target.checked;
                
                // Update the product's buyWithBox status
                const product = this.products.find(p => p.id === productId);
                if (product) {
                    product.buyWithBox = isChecked;
                }
                
                // Show feedback
                const boxText = isChecked ? 'enabled' : 'disabled';
                this.showNotification(`Display box option ${boxText} for ${product.title}`, 'info');
            }
        });

        // Header scroll effect
        window.addEventListener('scroll', () => {
            const header = document.getElementById('header');
            if (header) {
                if (window.scrollY > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
        });
    }

    // Bind modal events
    bindModalEvents() {
        // Close modals
        document.querySelectorAll('.modal-close, .modal-backdrop').forEach(el => {
            el.addEventListener('click', (e) => {
                const modal = el.closest('.modal');
                if (modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Search suggestions
        document.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const searchInput = document.getElementById('shopSearchInput');
                if (searchInput) {
                    searchInput.value = e.target.textContent;
                    this.searchQuery = e.target.textContent;
                    this.applyFilters();
                    this.closeModal('searchModal');
                }
            });
        });
    }

    // Bind sidebar events
    bindSidebarEvents() {
        document.querySelectorAll('.sidebar-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const sidebar = e.target.closest('.sidebar');
                if (sidebar) {
                    this.closeSidebar(sidebar.id);
                }
            });
        });
    }

    // Initialize sidebars
    initializeSidebars() {
        this.renderCart();
        this.renderWishlist();
    }

    // Set view mode
    setView(view) {
        this.currentView = view;
        const gridBtn = document.getElementById('gridViewBtn');
        const listBtn = document.getElementById('listViewBtn');
        
        if (view === 'grid') {
            gridBtn?.classList.add('active');
            listBtn?.classList.remove('active');
        } else {
            listBtn?.classList.add('active');
            gridBtn?.classList.remove('active');
        }
        this.renderProducts();
    }

    // Apply filters and sorting
    applyFilters() {
        let filtered = [...this.products];

        // Category filter
        if (this.currentCategory !== 'all') {
            filtered = filtered.filter(product => product.category === this.currentCategory);
        }

        // Search filter
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(product => 
                product.title.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query) ||
                product.category.toLowerCase().includes(query)
            );
        }

        // Price filter
        filtered = filtered.filter(product => 
            product.price >= this.priceRange.min && 
            product.price <= this.priceRange.max
        );

        // Sorting
        this.applySorting(filtered);

        this.filteredProducts = filtered;
        this.currentPage = 1;
        this.renderProducts();
        this.updateResultsInfo();
        this.renderPagination();
    }

    // Apply sorting
    applySorting(products) {
        switch (this.currentSort) {
            case 'price-low':
                products.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                products.sort((a, b) => b.price - a.price);
                break;
            case 'name-az':
                products.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'name-za':
                products.sort((a, b) => b.title.localeCompare(a.title));
                break;
            default:
                // Keep original order for featured
                break;
        }
    }

    // Render products
    renderProducts() {
        const grid = document.getElementById('productsGrid');
        if (!grid) return;

        // Set grid/list class
        grid.classList.toggle('grid-view', this.currentView === 'grid');
        grid.classList.toggle('list-view', this.currentView === 'list');

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);

        if (productsToShow.length === 0) {
            grid.innerHTML = `
                <div class="no-products">
                    <div class="empty-icon">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="m9 9 6 6"></path>
                            <path d="m15 9-6 6"></path>
                        </svg>
                    </div>
                    <h3>No treasures found</h3>
                    <p>Try adjusting your filters or search terms</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = productsToShow.map(product => this.createProductCard(product, this.currentView)).join('');
    }

    // Create product card HTML
    createProductCard(product, view = 'grid') {
        const cardClass = view === 'list' ? 'product-card list' : 'product-card';
        
        // Generate buy with box checkbox for accessories
        const buyWithBoxCheckbox = product.category === 'accessories' && product.buyWithBox ? `
            <div class="buy-with-box-container">
                <label class="buy-with-box-checkbox">
                    <input type="checkbox" class="buy-with-box-input" data-product-id="${product.id}" data-box-price="${product.boxPrice}">
                    <span class="checkmark"></span>
                    <div class="checkbox-content">
                        <span class="checkbox-label">Buy with the Box</span>
                    </div>
                </label>
            </div>
        ` : '';

        // Add Read more... link for 3 random items (IDs 2, 5, 7) only (remove for id 8)
        const readMoreLink = [2, 5, 7].includes(product.id) ? `
            <div class="read-more-container">
                <a href="blog-details.html?id=${product.id}" class="read-more-link">Read more...</a>
            </div>
        ` : '';
        
        return `
            <div class="${cardClass}" data-id="${product.id}">
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.title}" class="product-image" loading="lazy">
                    <div class="product-overlay"></div>
                    ${product.badges.length > 0 ? `
                        <div class="product-badges">
                            ${product.badges.map(badge => `
                                <span class="product-badge badge-${badge}">${badge}</span>
                            `).join('')}
                        </div>
                    ` : ''}
                    <div class="product-actions">
                        <button class="product-action-btn" onclick="window.shop.openQuickView(${product.id})" title="Quick View">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                        </button>
                        <button class="product-action-btn" onclick="window.shop.addToWishlist(${product.id})" title="Add to Wishlist">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                        </button>
                        <button class="product-action-btn" onclick="window.shop.addToCart(${product.id})" title="Add to Cart">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <path d="M16 10a4 4 0 0 1-8 0"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="product-content">
                    <div class="product-category">${product.category.replace('-', ' ')}</div>
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-rating">
                        <div class="rating-stars">
                            ${this.generateStars(product.rating)}
                        </div>
                        <span class="rating-text">(${product.reviews} reviews)</span>
                    </div>
                    ${buyWithBoxCheckbox}
                    ${readMoreLink}
                    <div class="product-footer">
                        <div class="product-price">
                            <span class="price-current">$${product.price.toLocaleString()}</span>
                            ${product.originalPrice ? `<span class="price-original">$${product.originalPrice.toLocaleString()}</span>` : ''}
                        </div>
                        <button class="add-to-cart-btn" onclick="window.shop.addToCart(${product.id})">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <path d="M16 10a4 4 0 0 1-8 0"></path>
                            </svg>
                            <span>Add to Cart</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Generate star rating HTML
    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let stars = '';
        
        // Full stars
        for (let i = 0; i < fullStars; i++) {
            stars += '<svg class="star" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon></svg>';
        }
        
        // Half star
        if (hasHalfStar) {
            stars += '<svg class="star" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" style="opacity: 0.5;"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon></svg>';
        }
        
        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            stars += '<svg class="star empty" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon></svg>';
        }
        
        return stars;
    }

    // Update results info
    updateResultsInfo() {
        const resultsInfo = document.getElementById('resultsInfo');
        if (!resultsInfo) return;

        const startIndex = (this.currentPage - 1) * this.itemsPerPage + 1;
        const endIndex = Math.min(this.currentPage * this.itemsPerPage, this.filteredProducts.length);
        const total = this.filteredProducts.length;
        
        resultsInfo.textContent = `Showing ${startIndex}-${endIndex} of ${total} ancient treasures`;
    }

    // Render pagination
    renderPagination() {
        const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
        const paginationNumbers = document.getElementById('paginationNumbers');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (!paginationNumbers || !prevBtn || !nextBtn) return;

        prevBtn.disabled = this.currentPage === 1;
        nextBtn.disabled = this.currentPage === totalPages || totalPages === 0;
        
        let paginationHTML = '';
        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="pagination-number ${i === this.currentPage ? 'active' : ''}" 
                        onclick="window.shop.goToPage(${i})">
                    ${i}
                </button>
            `;
        }
        
        paginationNumbers.innerHTML = paginationHTML;
    }

    // Go to specific page
    goToPage(page) {
        const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderProducts();
            this.updateResultsInfo();
            this.renderPagination();
            
            // Scroll to products
            document.getElementById('productsGrid')?.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Cart functionality
    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        // Check if buy with box is selected for accessories
        const buyWithBoxCheckbox = document.querySelector(`.buy-with-box-input[data-product-id="${productId}"]`);
        const buyWithBox = buyWithBoxCheckbox ? buyWithBoxCheckbox.checked : false;

        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
            // Update box option if it changed
            if (existingItem.buyWithBox !== buyWithBox) {
                existingItem.buyWithBox = buyWithBox;
            }
        } else {
            this.cart.push({
                ...product,
                quantity: 1,
                buyWithBox: buyWithBox
            });
        }

        this.saveCart();
        this.updateCartBadge();
        this.renderCart();
        
        const boxText = buyWithBox ? ' with the box' : '';
        this.showNotification(`${product.title}${boxText} added to cart!`, 'success');
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartBadge();
        this.renderCart();
        this.showNotification('Item removed from cart', 'info');
    }

    updateCartQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.renderCart();
            }
        }
    }

    updateCartBadge() {
        const badge = document.getElementById('cartBadge');
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        
        if (badge) {
            badge.textContent = totalItems;
            badge.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }

    saveCart() {
        localStorage.setItem('egyptianLuxuryCart', JSON.stringify(this.cart));
    }

    renderCart() {
        const cartContent = document.getElementById('cartContent');
        const cartFooter = document.getElementById('cartFooter');
        
        if (!cartContent) return;

        if (this.cart.length === 0) {
            cartContent.innerHTML = `
                <div class="cart-empty">
                    <div class="empty-icon">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                    </div>
                    <h4>Your cart is empty</h4>
                    <p>Add some treasures to get started</p>
                </div>
            `;
            if (cartFooter) cartFooter.style.display = 'none';
            return;
        }

        cartContent.innerHTML = this.cart.map(item => {
            const displayName = item.title || item.name || '';
            return `
                <div class="cart-item">
                    <img src="${item.image}" alt="${displayName}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${displayName}</h4>
                        <div class="cart-item-price">${item.price} x ${item.quantity}</div>
                    </div>
                    <button class="cart-item-remove" onclick="window.shop.removeFromCart(${item.id})" title="Remove item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3,6 5,6 21,6"></polyline>
                            <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1 2-2h4a2,2 0 0,1 2,2v2"></path>
                        </svg>
                    </button>
                </div>
            `;
        }).join('');

        // Update totals without box prices
        const subtotal = this.cart.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);
        
        document.getElementById('cartSubtotal').textContent = `$${subtotal.toLocaleString()}`;
        document.getElementById('cartTotal').textContent = `$${subtotal.toLocaleString()}`;
        
        if (cartFooter) cartFooter.style.display = 'block';
    }

    // Wishlist functionality
    addToWishlist(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const existingIndex = this.wishlist.findIndex(item => item.id === productId);
        
        if (existingIndex > -1) {
            this.wishlist.splice(existingIndex, 1);
            this.showNotification(`${product.title} removed from wishlist`, 'info');
        } else {
            this.wishlist.push(product);
            this.showNotification(`${product.title} added to wishlist!`, 'success');
        }

        this.saveWishlist();
        this.updateWishlistBadge();
        this.renderWishlist();
    }

    removeFromWishlist(productId) {
        this.wishlist = this.wishlist.filter(item => item.id !== productId);
        this.saveWishlist();
        this.updateWishlistBadge();
        this.renderWishlist();
        this.showNotification('Item removed from wishlist', 'info');
    }

    updateWishlistBadge() {
        const badge = document.getElementById('wishlistBadge');
        
        if (badge) {
            badge.textContent = this.wishlist.length;
            badge.style.display = this.wishlist.length > 0 ? 'flex' : 'none';
        }
    }

    saveWishlist() {
        localStorage.setItem('egyptianWishlist', JSON.stringify(this.wishlist));
    }

    renderWishlist() {
        const wishlistContent = document.getElementById('wishlistContent');
        const viewWishlistBtn = document.getElementById('viewWishlistBtn');
        if (!wishlistContent) return;

        if (this.wishlist.length === 0) {
            wishlistContent.innerHTML = `
                <div class="wishlist-empty">
                    <div class="empty-icon">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </div>
                    <h4>Your wishlist is empty</h4>
                    <p>Save items you love for later</p>
                </div>
            `;
            if (viewWishlistBtn) viewWishlistBtn.style.display = 'none';
            return;
        }

        wishlistContent.innerHTML = this.wishlist.map(item => `
            <div class="wishlist-item">
                <img src="${item.image}" alt="${item.title || item.name || ''}" class="wishlist-item-image">
                <div class="wishlist-item-details">
                    <div class="wishlist-item-title">${item.title || item.name || ''}</div>
                    <div class="wishlist-item-price">$${item.price.toLocaleString()}</div>
                </div>
                <button class="wishlist-item-remove" onclick="window.shop.removeFromWishlist(${item.id})" title="Remove">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        `).join('');
        if (viewWishlistBtn) viewWishlistBtn.style.display = '';
    }

    // Quick view functionality
    openQuickView(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const modal = document.getElementById('quickViewModal');
        const modalBody = document.getElementById('quickViewContent');
        
        if (!modal || !modalBody) return;

        // Generate images section - show gift box for accessories
        const imagesSection = product.category === 'accessories' ? `
            <div style="display: flex; flex-direction: column; gap: 1rem; align-items: center;">
                <img src="${product.image}" alt="${product.title}" style="width:280px; height:280px; border-radius:16px; box-shadow:0 4px 24px rgba(27,41,81,0.12); object-fit:cover; background:#f5f5f5;" />
                <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--pyramid-gold); font-size: 1.2rem;">
                    <span>+</span>
                    <img src="images/gift-box.jpg" alt="Gift Box" style="width:200px; height:200px; border-radius:16px; box-shadow:0 2px 12px rgba(27,41,81,0.12); object-fit:cover;" />
                </div>
            </div>
        ` : `
            <img src="${product.image}" alt="${product.title}" style="width:320px; height:320px; border-radius:16px; box-shadow:0 4px 24px rgba(27,41,81,0.12); object-fit:cover; background:#f5f5f5;" />
        `;

        // Generate buy with box checkbox for accessories
        const buyWithBoxCheckbox = product.category === 'accessories' && product.buyWithBox ? `
            <div style="margin: 1rem 0; padding: 0.75rem; background: rgba(255, 215, 0, 0.05); border: 1px solid rgba(203, 138, 88, 0.3); border-radius: 12px;">
                <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer; user-select: none;">
                    <input type="checkbox" id="quickViewBuyWithBox" style="position: absolute; opacity: 0; cursor: pointer; height: 0; width: 0;">
                    <span id="quickViewCheckmark" style="height: 20px; width: 20px; background: rgba(255, 255, 255, 0.1); border: 2px solid var(--soft-gold); border-radius: 4px; position: relative; transition: all 0.3s ease;"></span>
                    <span style="font-size: 0.9rem; font-weight: 600; color: var(--pyramid-gold); text-shadow: 0 0 5px rgba(255, 215, 0, 0.3);">Buy with the Box</span>
                </label>
            </div>
        ` : '';

        // Add Read more... link for 3 random items (IDs 2, 5, 7) only
        const readMoreLink = [2, 5, 7].includes(product.id) ? `
            <div style="margin-top:1.2rem; text-align:left;">
                <a href="blog-details.html?id=${product.id}" class="read-more-link">Read more...</a>
            </div>
        ` : '';

        modalBody.innerHTML = `
            <div style="display: flex; flex-direction: row; gap: 2rem; align-items: flex-start; flex-wrap: wrap; max-width:700px; min-width:340px; width:100%; padding: 2rem;">
                ${imagesSection}
                <div style="flex:1; min-width:220px; max-width:340px;">
                    <h2 style="font-size:2rem; font-weight:700; margin-bottom:0.5rem; color:var(--text-light);">${product.title}</h2>
                    <div style="font-size:1.1rem; color:var(--soft-yellow); margin-bottom:0.5rem;">Category: <b style='color:var(--pyramid-gold);'>${product.category.replace(/\b\w/g, l => l.toUpperCase())}</b></div>
                    <div style="font-size:1.3rem; color:var(--pyramid-gold); margin-bottom:1rem;">Price: <b style='color:var(--pyramid-gold);'>$${product.price.toLocaleString()}</b></div>
                    <div style="font-size:1.1rem; color:var(--soft-yellow); margin-bottom:1.5rem; line-height:1.6;">${product.description}</div>
                    ${buyWithBoxCheckbox}
                    <div style='display:grid; grid-template-columns: 1fr 1fr 1fr; gap:1rem; align-items:center; margin-bottom:1rem;'>
                        <div style='display:flex; align-items:center; gap:0.5rem;'>
                            <button type='button' id='quickViewQtyMinus' style='width:2.2rem; height:2.2rem; border-radius:50%; border:1px solid rgba(203, 138, 88, 0.5); background:rgba(255,255,255,0.1); font-size:1.2rem; cursor:pointer; color:var(--text-light);'>-</button>
                            <input id='quickViewQty' type='number' min='1' value='1' style='width:2.5rem; text-align:center; font-size:1.1rem; border:1px solid rgba(203, 138, 88, 0.5); border-radius:8px; padding:0.3rem 0.5rem; background:rgba(255,255,255,0.1); color:var(--text-light);' />
                            <button type='button' id='quickViewQtyPlus' style='width:2.2rem; height:2.2rem; border-radius:50%; border:1px solid rgba(203, 138, 88, 0.5); background:rgba(255,255,255,0.1); font-size:1.2rem; cursor:pointer; color:var(--text-light);'>+</button>
                        </div>
                        <button class="add-to-cart-btn" id="quickViewAddToCart" style="width:100%;">Add to Cart</button>
                        <button class="wishlist-btn" onclick="window.shop.addToWishlist(${product.id})" style="width:100%; margin-left:-0.5rem;">♡ Wishlist</button>
                    </div>
                    ${readMoreLink}
                </div>
            </div>
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Handle buy with box checkbox for accessories
        if (product.category === 'accessories' && product.buyWithBox) {
            const checkbox = document.getElementById('quickViewBuyWithBox');
            const checkmark = document.getElementById('quickViewCheckmark');
            
            if (checkbox && checkmark) {
                checkbox.addEventListener('change', function() {
                    if (this.checked) {
                        checkmark.style.background = 'var(--pyramid-gold)';
                        checkmark.style.borderColor = 'var(--pyramid-gold)';
                        checkmark.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.5)';
                        checkmark.innerHTML = '<div style="position: absolute; left: 6px; top: 2px; width: 4px; height: 8px; border: solid var(--royal-dark-blue); border-width: 0 2px 2px 0; transform: rotate(45deg);"></div>';
                    } else {
                        checkmark.style.background = 'rgba(255, 255, 255, 0.1)';
                        checkmark.style.borderColor = 'var(--soft-gold)';
                        checkmark.style.boxShadow = 'none';
                        checkmark.innerHTML = '';
                    }
                });
            }
        }

        // Quantity selector logic
        const qtyInput = document.getElementById('quickViewQty');
        const qtyMinus = document.getElementById('quickViewQtyMinus');
        const qtyPlus = document.getElementById('quickViewQtyPlus');

        if (qtyMinus && qtyInput) {
            qtyMinus.onclick = () => {
                let val = parseInt(qtyInput.value) || 1;
                if (val > 1) qtyInput.value = val - 1;
            };
        }

        if (qtyPlus && qtyInput) {
            qtyPlus.onclick = () => {
                let val = parseInt(qtyInput.value) || 1;
                qtyInput.value = val + 1;
            };
        }

        // Add to Cart with quantity and box option
        const addToCartBtn = document.getElementById('quickViewAddToCart');
        if (addToCartBtn && qtyInput) {
            addToCartBtn.onclick = () => {
                const quantity = parseInt(qtyInput.value) || 1;
                const buyWithBox = product.category === 'accessories' ? 
                    (document.getElementById('quickViewBuyWithBox')?.checked || false) : false;
                
                // Temporarily set the checkbox state for this add to cart action
                const originalCheckbox = document.querySelector(`.buy-with-box-input[data-product-id="${product.id}"]`);
                if (originalCheckbox) {
                    originalCheckbox.checked = buyWithBox;
                }
                
                for (let i = 0; i < quantity; i++) {
                    this.addToCart(product.id);
                }
                
                // Reset the original checkbox state
                if (originalCheckbox) {
                    originalCheckbox.checked = false;
                }
                
                this.closeModal('quickViewModal');
            };
        }
    }

    // Modal management
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    // Sidebar management
    openSidebar(sidebarId) {
        const sidebar = document.getElementById(sidebarId);
        if (sidebar) {
            sidebar.classList.add('active');
        }
    }

    closeSidebar(sidebarId) {
        const sidebar = document.getElementById(sidebarId);
        if (sidebar) {
            sidebar.classList.remove('active');
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

// Initialize the shop when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check for category in URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    window.shop = new ShopManager();
    
    if (categoryParam) {
        const categorySelect = document.getElementById('categorySelect');
        if (categorySelect) {
            const validValues = Array.from(categorySelect.options).map(opt => opt.value);
            if (validValues.includes(categoryParam)) {
                categorySelect.value = categoryParam;
                window.shop.currentCategory = categoryParam;
                window.shop.applyFilters();
            }
        }
    }
});

// Handle escape key for closing modals and sidebars
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close active modals
        document.querySelectorAll('.modal.active').forEach(modal => {
            window.shop?.closeModal(modal.id);
        });

        // Close active sidebars
        document.querySelectorAll('.sidebar.active').forEach(sidebar => {
            window.shop?.closeSidebar(sidebar.id);
        });
    }
});

// Handle click outside sidebars to close them
document.addEventListener('click', (e) => {
    if (!e.target.closest('.sidebar') && !e.target.closest('.header-icon')) {
        document.querySelectorAll('.sidebar.active').forEach(sidebar => {
            window.shop?.closeSidebar(sidebar.id);
        });
    }
});

// Global functions for backward compatibility
window.addToCart = (productId) => window.shop?.addToCart(productId);
window.addToWishlist = (productId) => window.shop?.addToWishlist(productId);

console.log('🏺 Egyptian Creativity Shop - Enhanced luxury website loaded successfully!');

// Ensure all sidebars are closed by default
function ensureSidebarsClosed() {
  const sidebars = document.querySelectorAll('.sidebar');
  sidebars.forEach(sidebar => {
    sidebar.classList.remove('active');
  });
}