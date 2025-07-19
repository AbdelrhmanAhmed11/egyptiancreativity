// Egyptian Creativity Gallery - Enhanced JavaScript with Index Background Animations

// Gallery-specific variables
let currentFilter = 'All';
let currentLightboxIndex = 0;
let displayedItems = 8;
let filteredItems = [];
let currentPreviewProduct = null;

// Make functions globally available immediately for onclick handlers
window.openProductPreview = function(productId) {
    console.log('Opening product preview for ID:', productId);
    
    // Try to find product in hardcoded data first
    let product = productData.find(item => item.id === productId);
    console.log('Found in hardcoded data:', product);
    
    // If not found in hardcoded data, create a basic product from gallery item
    if (!product) {
        const galleryItem = document.querySelector(`[data-id="${productId}"]`);
        console.log('Gallery item found:', galleryItem);
        if (galleryItem) {
            const image = galleryItem.querySelector('img');
            const category = galleryItem.querySelector('.gallery-item-category');
            
            product = {
                id: productId,
                title: image?.alt || `Gallery Item ${productId}`,
                category: category?.textContent || 'Artifact',
                price: 0,
                image: image?.src || 'images/1-7-scaled.jpg',
                description: `Exquisite Egyptian artifact with authentic craftsmanship and timeless beauty.`,
                specs: {
                    "Materials": "Authentic Egyptian Materials",
                    "Dimensions": "Various sizes available",
                    "Weight": "Varies by item",
                    "Origin": "Handcrafted in Egypt"
                }
            };
            console.log('Created product from gallery item:', product);
        }
    }
    
    if (!product) {
        console.error('No product found for ID:', productId);
        return;
    }
    
    currentPreviewProduct = product;
    
    // Update modal content
    const modal = document.getElementById('productPreviewModal');
    const image = document.getElementById('previewProductImage');
    const category = document.getElementById('previewProductCategory');
    const title = document.getElementById('previewProductTitle');
    const description = document.getElementById('previewProductDescription');
    const specs = document.getElementById('previewProductSpecs');
    const addToCartBtn = document.getElementById('previewAddToCart');
    const addToWishlistBtn = document.getElementById('previewAddToWishlist');
    
    console.log('Modal elements found:', {
        modal: !!modal,
        image: !!image,
        category: !!category,
        title: !!title,
        description: !!description,
        specs: !!specs,
        addToCartBtn: !!addToCartBtn,
        addToWishlistBtn: !!addToWishlistBtn
    });
    
    if (image) image.src = product.image;
    if (category) category.textContent = product.category.toUpperCase();
    if (title) title.textContent = product.title.toUpperCase();
    if (description) description.textContent = product.description;
    
    // Update specifications
    if (specs && product.specs) {
        specs.innerHTML = Object.entries(product.specs).map(([key, value]) => `
            <div class="spec-item">
                <span class="spec-label">${key}:</span>
                <span class="spec-value">${value}</span>
            </div>
        `).join('');
    }
    
    // Update wishlist button state - use global wishlist
    if (addToWishlistBtn) {
        const globalWishlist = JSON.parse(localStorage.getItem('egyptianWishlist')) || [];
        const isInWishlist = globalWishlist.some(item => item.id === product.id);
        addToWishlistBtn.classList.toggle('active', isInWishlist);
        addToWishlistBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="${isInWishlist ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            ${isInWishlist ? 'REMOVE FROM WISHLIST' : 'ADD TO WISHLIST'}
        `;
    }
    
    // Show modal
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        console.log('Modal opened successfully');
    } else {
        console.error('Modal element not found');
    }
};

// Product Preview Modal Functions - Define immediately
function openProductPreview(productId) {
    // Try to find product in hardcoded data first
    let product = productData.find(item => item.id === productId);
    
    // If not found in hardcoded data, create a basic product from gallery item
    if (!product) {
        const galleryItem = document.querySelector(`[data-id="${productId}"]`);
        if (galleryItem) {
            const image = galleryItem.querySelector('img');
            const category = galleryItem.querySelector('.gallery-item-category');
            
            product = {
                id: productId,
                title: image?.alt || `Gallery Item ${productId}`,
                category: category?.textContent || 'Artifact',
                price: 0,
                image: image?.src || 'images/1-7-scaled.jpg',
                description: `Exquisite Egyptian artifact with authentic craftsmanship and timeless beauty.`,
                specs: {
                    "Materials": "Authentic Egyptian Materials",
                    "Dimensions": "Various sizes available",
                    "Weight": "Varies by item",
                    "Origin": "Handcrafted in Egypt"
                }
            };
        }
    }
    
    if (!product) return;
    
    currentPreviewProduct = product;
    
    // Update modal content
    const modal = document.getElementById('productPreviewModal');
    const image = document.getElementById('previewProductImage');
    const category = document.getElementById('previewProductCategory');
    const title = document.getElementById('previewProductTitle');
    const description = document.getElementById('previewProductDescription');
    const specs = document.getElementById('previewProductSpecs');
    const addToCartBtn = document.getElementById('previewAddToCart');
    const addToWishlistBtn = document.getElementById('previewAddToWishlist');
    
    if (image) image.src = product.image;
    if (category) category.textContent = product.category.toUpperCase();
    if (title) title.textContent = product.title.toUpperCase();
    if (description) description.textContent = product.description;
    
    // Update specifications
    if (specs && product.specs) {
        specs.innerHTML = Object.entries(product.specs).map(([key, value]) => `
            <div class="spec-item">
                <span class="spec-label">${key}:</span>
                <span class="spec-value">${value}</span>
            </div>
        `).join('');
    }
    
    // Update wishlist button state - use global wishlist
    if (addToWishlistBtn) {
        const globalWishlist = JSON.parse(localStorage.getItem('egyptianWishlist')) || [];
        const isInWishlist = globalWishlist.some(item => item.id === product.id);
        addToWishlistBtn.classList.toggle('active', isInWishlist);
        addToWishlistBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="${isInWishlist ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            ${isInWishlist ? 'REMOVE FROM WISHLIST' : 'ADD TO WISHLIST'}
        `;
    }
    
    // Show modal
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeProductPreview() {
    const modal = document.getElementById('productPreviewModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    currentPreviewProduct = null;
}

function handlePreviewAddToCart() {
    console.log('handlePreviewAddToCart called');
    if (!currentPreviewProduct) {
        console.error('No current preview product');
        return;
    }
    
    console.log('Adding to cart:', currentPreviewProduct);
    addToCart(currentPreviewProduct.id);
    showNotification(`${currentPreviewProduct.title} added to cart!`, 'success');
}

function handlePreviewAddToWishlist() {
    console.log('handlePreviewAddToWishlist called');
    if (!currentPreviewProduct) {
        console.error('No current preview product');
        return;
    }
    
    const globalWishlist = JSON.parse(localStorage.getItem('egyptianWishlist')) || [];
    const isInWishlist = globalWishlist.some(item => item.id === currentPreviewProduct.id);
    
    console.log('Current wishlist state:', { isInWishlist, productId: currentPreviewProduct.id });
    
    if (isInWishlist) {
        removeFromWishlist(currentPreviewProduct.id);
        showNotification(`${currentPreviewProduct.title} removed from wishlist`, 'info');
    } else {
        addToWishlist(currentPreviewProduct.id);
        showNotification(`${currentPreviewProduct.title} added to wishlist!`, 'success');
    }
    
    // Update button state
    const addToWishlistBtn = document.getElementById('previewAddToWishlist');
    if (addToWishlistBtn) {
        const newGlobalWishlist = JSON.parse(localStorage.getItem('egyptianWishlist')) || [];
        const newIsInWishlist = newGlobalWishlist.some(item => item.id === currentPreviewProduct.id);
        addToWishlistBtn.classList.toggle('active', newIsInWishlist);
        addToWishlistBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="${newIsInWishlist ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            ${newIsInWishlist ? 'REMOVE FROM WISHLIST' : 'ADD TO WISHLIST'}
        `;
    } else {
        console.error('Add to wishlist button not found in handle function');
    }
}

// Make functions globally available immediately
if (typeof window !== 'undefined') {
    window.openProductPreview = openProductPreview;
    window.addToCart = addToCart;
    window.addToWishlist = addToWishlist;
    window.removeFromCart = removeFromCart;
    window.removeFromWishlist = removeFromWishlist;
    window.changeShowcase = changeShowcase;
    window.closeProductPreview = closeProductPreview;
    window.handlePreviewAddToCart = handlePreviewAddToCart;
    window.handlePreviewAddToWishlist = handlePreviewAddToWishlist;
}

// Product data for preview modal
const productData = [
    {
        id: 1,
        title: "Golden Pharaoh Necklace",
        category: "Jewelry",
        price: 299,
        image: "images/1-7-scaled.jpg",
        description: "Exquisite handcrafted necklace featuring traditional Egyptian blue and gold beads, inspired by ancient pharaonic jewelry.",
        specs: {
            "Materials": "18k Gold Plated, Lapis Lazuli, Turquoise",
            "Dimensions": "45cm length",
            "Weight": "85g",
            "Origin": "Handcrafted in Cairo"
        }
    },
    {
        id: 2,
        title: "Eye of Horus Ring",
        category: "Jewelry",
        price: 189,
        image: "images/5-1 (1).jpg",
        description: "Sacred Eye of Horus ring crafted in gold and turquoise, symbolizing protection and royal power.",
        specs: {
            "Materials": "Sterling Silver, Gold Plating, Turquoise Inlay",
            "Sizes": "Available in all sizes",
            "Weight": "12g",
            "Symbolism": "Protection and Divine Power"
        }
    },
    {
        id: 3,
        title: "Hieroglyphic Treasure Box",
        category: "Boxes",
        price: 450,
        image: "images/5-3.jpg",
        description: "Ornate wooden box with authentic hieroglyphic carvings and golden accents, perfect for storing precious items.",
        specs: {
            "Materials": "Mahogany Wood, Gold Leaf, Hand-carved Details",
            "Dimensions": "25cm x 15cm x 10cm",
            "Weight": "1.2kg",
            "Features": "Velvet-lined interior"
        }
    },
    {
        id: 4,
        title: "Papyrus Scroll Art",
        category: "Decorations",
        price: 125,
        image: "images/4-5-scaled.jpg",
        description: "Authentic papyrus scroll featuring ancient Egyptian scenes and hieroglyphic texts.",
        specs: {
            "Materials": "Genuine Papyrus, Natural Pigments",
            "Dimensions": "40cm x 30cm",
            "Weight": "150g",
            "Theme": "Book of the Dead excerpts"
        }
    },
    {
        id: 5,
        title: "Canopic Jar Set",
        category: "Decorations",
        price: 380,
        image: "images/10.jpg",
        description: "Complete set of four canopic jars representing the Four Sons of Horus, meticulously crafted.",
        specs: {
            "Materials": "Limestone, Gold Accents",
            "Dimensions": "20cm height each",
            "Weight": "2.5kg total",
            "Set": "Imsety, Duamutef, Hapi, Qebehsenuef"
        }
    },
    {
        id: 6,
        title: "Ankh Symbol Pendant",
        category: "Jewelry",
        price: 95,
        image: "images/9-1.jpg",
        description: "Sacred Ankh pendant symbolizing eternal life, crafted in gold with intricate detailing.",
        specs: {
            "Materials": "14k Gold Plated Bronze",
            "Dimensions": "4cm x 2.5cm",
            "Weight": "15g",
            "Chain": "50cm gold-plated chain included"
        }
    },
    {
        id: 7,
        title: "Pharaoh's Scepter Replica",
        category: "Accessories",
        price: 650,
        image: "images/9-1.jpg",
        description: "Magnificent replica of a pharaoh's ceremonial scepter with golden finish and precious stone inlays.",
        specs: {
            "Materials": "Brass Core, Gold Plating, Semi-precious Stones",
            "Dimensions": "75cm length",
            "Weight": "800g",
            "Display": "Includes wooden stand"
        }
    },
    {
        id: 8,
        title: "Cleopatra's Mirror",
        category: "Accessories",
        price: 220,
        image: "images/5-3.jpg",
        description: "Elegant hand mirror inspired by Queen Cleopatra's personal accessories, featuring lotus motifs.",
        specs: {
            "Materials": "Bronze, Silver Plating, Polished Mirror",
            "Dimensions": "25cm x 15cm",
            "Weight": "400g",
            "Design": "Lotus and papyrus motifs"
        }
    }
];

// Showcase items for hero section
const showcaseItems = [
    {
        title: "Golden Pharaoh Collection",
        description: "Exquisite artifacts from the golden age",
        category: "Featured Collection",
        image: "images/1-7-scaled.jpg"
    },
    {
        title: "Sacred Jewelry Treasury",
        description: "Divine ornaments of ancient royalty",
        category: "Jewelry Collection",
        image: "images/5-1 (1).jpg"
    },
    {
        title: "Temple Artifacts",
        description: "Sacred objects from ancient temples",
        category: "Temple Collection",
        image: "images/4-5-scaled.jpg"
    }
];

// Use global DOM elements from script.js or get them when needed

// Loading Screen Functions
function initializeLoading() {
const loadingOverlay = document.getElementById('loadingOverlay');
    if (!loadingOverlay) return;
    
    const skipBtn = document.getElementById('skipBtn');
    const progressBar = document.querySelector('.progress-bar');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(hideLoading, 500);
        }
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    }, 200);
    
    if (skipBtn) {
        skipBtn.addEventListener('click', () => {
            clearInterval(interval);
            hideLoading();
        });
    }
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 1000);
    }
}

// Navigation Functions
function initializeNavigation() {
    const header = document.getElementById('header');
    if (!header) return;
    
    let lastScrollTop = 0;
    const scrollThreshold = 100;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Mobile menu functionality
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
        });
    });
    
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
        });
    }
}

// Hero Section Functions
function initializeHero() {
    const exploreBtn = document.getElementById('exploreBtn');
    if (!exploreBtn) return;
    
    exploreBtn.addEventListener('click', () => {
        const gallerySection = document.getElementById('gallery');
        if (gallerySection) {
            gallerySection.scrollIntoView({ behavior: 'smooth' });
        }
    });
    
    const heritageBtn = document.getElementById('heritageBtn');
    if (heritageBtn) {
        heritageBtn.addEventListener('click', () => {
            window.location.href = 'about.php';
        });
    }
    
    // Auto-rotate showcase
    setInterval(() => {
        const nextIndex = (window.currentShowcaseItem + 1) % showcaseItems.length;
        window.currentShowcaseItem = nextIndex;
        updateShowcase();
    }, 5000);
}
    
    function updateShowcase() {
    const item = showcaseItems[window.currentShowcaseItem];
    if (!item) return;
    
    const showcaseImage = document.getElementById('showcaseImage');
    const showcaseTitle = document.getElementById('showcaseTitle');
    const showcaseDesc = document.getElementById('showcaseDesc');
    const showcaseCategory = document.getElementById('showcaseCategory');
    
    if (showcaseImage) showcaseImage.src = item.image;
    if (showcaseTitle) showcaseTitle.textContent = item.title;
    if (showcaseDesc) showcaseDesc.textContent = item.description;
    if (showcaseCategory) showcaseCategory.textContent = item.category;
        
        // Update dots
        const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === window.currentShowcaseItem);
    });
}

// Search Functions
function initializeSearch() {
    const searchBtn = document.getElementById('searchBtn');
    const searchModal = document.getElementById('searchModal');
    const searchClose = document.getElementById('searchClose');
    if (!searchBtn || !searchModal || !searchClose) return;
    
        searchBtn.addEventListener('click', () => {
            searchModal.classList.add('active');
        const searchInput = document.getElementById('searchInput');
            if (searchInput) searchInput.focus();
        });
    
        searchClose.addEventListener('click', () => {
            searchModal.classList.remove('active');
        });
    
    const searchBackdrop = document.getElementById('searchBackdrop');
    if (searchBackdrop) {
        searchBackdrop.addEventListener('click', () => {
                searchModal.classList.remove('active');
        });
    }
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            searchGallery(query);
        });
        
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                searchModal.classList.remove('active');
            }
        });
    }
    
    // Gallery search
    const gallerySearchInput = document.getElementById('gallerySearchInput');
    if (gallerySearchInput) {
        gallerySearchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            searchGallery(query);
    });
    }
}

function searchGallery(query) {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        const title = item.querySelector('img')?.alt?.toLowerCase() || '';
        const category = item.querySelector('.gallery-item-category')?.textContent?.toLowerCase() || '';
        
        const matches = title.includes(query) || category.includes(query);
        item.style.display = matches ? 'block' : 'none';
    });
}

// Gallery Functions
function initializeGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;
    
    // Filter functionality
    const filterButtons = document.getElementById('filterButtons');
    if (filterButtons) {
        const categories = ['All', 'Jewelry', 'Decorations', 'Accessories', 'Boxes', 'Games', 'Masks'];
        
        filterButtons.innerHTML = categories.map(category => `
            <button class="filter-btn ${category === 'All' ? 'active' : ''}" data-category="${category}">
                <span>${category}</span>
                    </button>
    `).join('');
    
        filterButtons.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                const category = e.target.dataset.category;
                
                // Update active button
                filterButtons.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                e.target.classList.add('active');
                
                // Filter items
                const galleryItems = document.querySelectorAll('.gallery-item');
                galleryItems.forEach(item => {
                    const itemCategory = item.querySelector('.gallery-item-category')?.textContent || '';
                    const shouldShow = category === 'All' || itemCategory === category;
                    item.style.display = shouldShow ? 'block' : 'none';
                });
            }
        });
    }
}

// Lightbox Functions
function initializeLightbox() {
    const lightboxOverlay = document.getElementById('lightboxOverlay');
    const lightboxClose = document.getElementById('lightboxClose');
    if (!lightboxOverlay || !lightboxClose) return;
    
        lightboxClose.addEventListener('click', closeLightbox);
    
    if (lightboxOverlay) {
        lightboxOverlay.addEventListener('click', (e) => {
            if (e.target === lightboxOverlay) {
                closeLightbox();
            }
        });
    }
    
    const lightboxPrev = document.getElementById('lightboxPrev');
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', () => navigateLightbox('prev'));
    }
    
    const lightboxNext = document.getElementById('lightboxNext');
    if (lightboxNext) {
        lightboxNext.addEventListener('click', () => navigateLightbox('next'));
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightboxOverlay && lightboxOverlay.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                navigateLightbox('prev');
            } else if (e.key === 'ArrowRight') {
                navigateLightbox('next');
            }
        }
    });
}

function openLightbox(id) {
    const item = productData.find(item => item.id === id);
    if (!item) return;
    
    currentLightboxIndex = productData.findIndex(item => item.id === id);
    
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCategory = document.getElementById('lightboxCategory');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDescription = document.getElementById('lightboxDescription');
    const lightboxDetails = document.getElementById('lightboxDetails');
    const lightboxOverlay = document.getElementById('lightboxOverlay');
    
    if (lightboxImage) lightboxImage.src = item.image;
    if (lightboxCategory) lightboxCategory.textContent = item.category;
    if (lightboxTitle) lightboxTitle.textContent = item.title;
    if (lightboxDescription) lightboxDescription.textContent = item.description;
    if (lightboxDetails) {
        lightboxDetails.innerHTML = item.specs ? Object.entries(item.specs).map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`).join('') : '';
    }
    
    if (lightboxOverlay) {
        lightboxOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    const lightboxOverlay = document.getElementById('lightboxOverlay');
    if (lightboxOverlay) {
        lightboxOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function navigateLightbox(direction) {
    if (direction === 'prev') {
        currentLightboxIndex = currentLightboxIndex > 0 ? currentLightboxIndex - 1 : productData.length - 1;
    } else {
        currentLightboxIndex = currentLightboxIndex < productData.length - 1 ? currentLightboxIndex + 1 : 0;
    }
    
    const item = productData[currentLightboxIndex];
    openLightbox(item.id);
}

function ensureSidebarsClosed() {
    // Close any open sidebars when clicking outside
    document.addEventListener('click', (e) => {
  const sidebars = document.querySelectorAll('.sidebar');
  sidebars.forEach(sidebar => {
            if (sidebar.classList.contains('active') && !sidebar.contains(e.target)) {
    sidebar.classList.remove('active');
            }
        });
    });
}

// Cart Functions
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

async function removeFromCart(productId) {
    try {
        const response = await fetch('cart.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'remove_from_cart',
                product_id: productId
            })
        });

        const data = await response.json();

        if (data.success) {
            updateCartBadge();
            window.renderCartSidebar();
            showNotification('Item removed from cart', 'success');
        } else {
            showNotification(data.error || 'Failed to remove item', 'error');
        }
    } catch (error) {
        console.error('Error removing from cart:', error);
        showNotification('Error removing from cart', 'error');
    }
}

async function updateCartBadge() {
    try {
        const response = await fetch('cart.php?action=get_cart');
        const data = await response.json();
        const items = data.cart_items || [];
            const badge = document.getElementById('cartBadge');
        const totalItems = items.reduce((sum, item) => sum + (parseInt(item.quantity) || 1), 0);
            if (badge) {
                badge.textContent = totalItems;
                badge.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    } catch (error) {
        console.error('Error updating cart badge:', error);
    }
}

// Wishlist Functions
async function addToWishlist(productId) {
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

async function removeFromWishlist(productId) {
    try {
        const response = await fetch('wishlist.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'remove_from_wishlist',
                product_id: productId
            })
        });

        const data = await response.json();

        if (data.success) {
            updateWishlistBadge();
            renderWishlistSidebar();
            showNotification('Item removed from wishlist', 'success');
        } else {
            showNotification(data.error || 'Failed to remove item', 'error');
        }
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        showNotification('Error removing from wishlist', 'error');
    }
}

async function updateWishlistBadge() {
    try {
        const response = await fetch('wishlist.php?action=get_wishlist');
        const data = await response.json();
        const items = data.wishlist || [];
        if (data.success) {
            const badge = document.getElementById('wishlistBadge');
            if (badge) {
                badge.textContent = items.length;
                badge.style.display = items.length > 0 ? 'flex' : 'none';
            }
        }
    } catch (error) {
        console.error('Error updating wishlist badge:', error);
    }
}

async function renderWishlistSidebar() {
    const wishlistEmpty = document.getElementById('wishlistEmpty');
    const wishlistItems = document.getElementById('wishlistItems');
    if (!wishlistEmpty || !wishlistItems) return;
    try {
        const response = await fetch('wishlist.php?action=get_wishlist');
        const data = await response.json();
        const items = data.wishlist || [];
        if (data.success && items.length > 0) {
            wishlistEmpty.style.display = 'none';
            wishlistItems.style.display = 'block';
            wishlistItems.innerHTML = items.map(item => `
                <div class="wishlist-item">
                    <img src="${item.image}" alt="${item.name || item.title}" class="wishlist-item-image">
                    <div class="wishlist-item-details">
                        <h4 class="wishlist-item-title">${item.name || item.title}</h4>
                        <div class="wishlist-item-price">${item.price}</div>
                    </div>
                    <button class="wishlist-item-remove" onclick="removeFromWishlist(${item.id})" title="Remove from wishlist">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                </div>
            `).join('');
        } else {
            wishlistEmpty.style.display = 'block';
            wishlistItems.style.display = 'none';
        }
    } catch (error) {
        console.error('Error loading wishlist data:', error);
        wishlistEmpty.style.display = 'block';
        wishlistItems.style.display = 'none';
    }
}

// Showcase Controls
function changeShowcase(index) {
    // Use global currentShowcaseItem from script.js
    if (typeof window.currentShowcaseItem !== 'undefined') {
        window.currentShowcaseItem = index;
    }
    const item = showcaseItems[index];
    
    document.getElementById('showcaseImage').src = item.image;
    document.getElementById('showcaseTitle').textContent = item.title;
    document.getElementById('showcaseDesc').textContent = item.description;
    document.getElementById('showcaseCategory').textContent = item.category;
    
    // Update dots
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notificationContainer = document.getElementById('notificationContainer');
    if (!notificationContainer) return;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notificationContainer.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Initialize Product Preview Modal
function initializeProductPreview() {
    const modal = document.getElementById('productPreviewModal');
    const backdrop = document.getElementById('productPreviewBackdrop');
    const closeBtn = document.getElementById('productPreviewClose');
    const addToCartBtn = document.getElementById('previewAddToCart');
    const addToWishlistBtn = document.getElementById('previewAddToWishlist');
    
    console.log('Initializing product preview modal:', {
        modal: !!modal,
        backdrop: !!backdrop,
        closeBtn: !!closeBtn,
        addToCartBtn: !!addToCartBtn,
        addToWishlistBtn: !!addToWishlistBtn
    });
    
    // Close modal events
    if (backdrop) {
        backdrop.addEventListener('click', closeProductPreview);
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeProductPreview);
    }
    
    // Action button events
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', handlePreviewAddToCart);
        console.log('Add to cart button event listener added');
    } else {
        console.error('Add to cart button not found!');
    }
    
    if (addToWishlistBtn) {
        addToWishlistBtn.addEventListener('click', handlePreviewAddToWishlist);
        console.log('Add to wishlist button event listener added');
    } else {
        console.error('Add to wishlist button not found!');
    }
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeProductPreview();
        }
    });
}

// Global functions for onclick handlers
window.openLightbox = openLightbox;
window.openProductPreview = openProductPreview;
window.addToCart = addToCart;
window.addToWishlist = addToWishlist;
window.removeFromCart = removeFromCart;
window.removeFromWishlist = removeFromWishlist;
window.changeShowcase = changeShowcase;

// Ensure functions are available immediately for onclick handlers
if (typeof window !== 'undefined') {
    window.openProductPreview = openProductPreview;
    window.addToCart = addToCart;
    window.addToWishlist = addToWishlist;
    window.removeFromCart = removeFromCart;
    window.removeFromWishlist = removeFromWishlist;
    window.changeShowcase = changeShowcase;
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏺 Egyptian Creativity Gallery - Initializing...');
    
    initializeLoading();
    initializeNavigation();
    initializeHero();
    initializeSearch();
    initializeGallery();
    initializeLightbox();
    initializeProductPreview();
    ensureSidebarsClosed();

console.log('🏺 Egyptian Creativity Gallery - Enhanced with Index background animations loaded successfully!');
}); 