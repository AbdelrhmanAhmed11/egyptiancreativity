// Egyptian Creativity Gallery - Enhanced JavaScript with Index Background Animations

// Global Variables
let cart = JSON.parse(localStorage.getItem('egyptianLuxuryCart')) || [];
let wishlist = JSON.parse(localStorage.getItem('egyptianWishlist')) || [];
let currentFilter = 'All';
let currentShowcaseItem = 0;
let currentLightboxIndex = 0;
let displayedItems = 8;
let filteredItems = [];

// Gallery Data
const galleryData = [
    {
        id: 1,
        title: "Golden Pharaoh Necklace",
        category: "Jewelry",
        price: 299,
        image: "images/1-7-scaled.jpg",
        description: "Exquisite handcrafted necklace featuring traditional Egyptian blue and gold beads, inspired by ancient pharaonic jewelry.",
        details: "Materials: 18k Gold Plated, Lapis Lazuli, Turquoise\nDimensions: 45cm length\nWeight: 85g\nOrigin: Handcrafted in Cairo"
    },
    {
        id: 2,
        title: "Eye of Horus Ring",
        category: "Jewelry",
        price: 189,
        image: "images/5-1 (1).jpg",
        description: "Sacred Eye of Horus ring crafted in gold and turquoise, symbolizing protection and royal power.",
        details: "Materials: Sterling Silver, Gold Plating, Turquoise Inlay\nSizes: Available in all sizes\nWeight: 12g\nSymbolism: Protection and Divine Power"
    },
    {
        id: 3,
        title: "Hieroglyphic Treasure Box",
        category: "Boxes",
        price: 450,
        image: "images/5-3.jpg",
        description: "Ornate wooden box with authentic hieroglyphic carvings and golden accents, perfect for storing precious items.",
        details: "Materials: Mahogany Wood, Gold Leaf, Hand-carved Details\nDimensions: 25cm x 15cm x 10cm\nWeight: 1.2kg\nFeatures: Velvet-lined interior"
    },
    {
        id: 4,
        title: "Papyrus Scroll Art",
        category: "Decorations",
        price: 125,
        image: "images/4-5-scaled.jpg",
        description: "Authentic papyrus scroll featuring ancient Egyptian scenes and hieroglyphic texts.",
        details: "Materials: Genuine Papyrus, Natural Pigments\nDimensions: 40cm x 30cm\nWeight: 150g\nTheme: Book of the Dead excerpts"
    },
    {
        id: 5,
        title: "Canopic Jar Set",
        category: "Decorations",
        price: 380,
        image: "images/10.jpg",
        description: "Complete set of four canopic jars representing the Four Sons of Horus, meticulously crafted.",
        details: "Materials: Limestone, Gold Accents\nDimensions: 20cm height each\nWeight: 2.5kg total\nSet: Imsety, Duamutef, Hapi, Qebehsenuef"
    },
    {
        id: 6,
        title: "Ankh Symbol Pendant",
        category: "Jewelry",
        price: 95,
        image: "images/9-1.jpg",
        description: "Sacred Ankh pendant symbolizing eternal life, crafted in gold with intricate detailing.",
        details: "Materials: 14k Gold Plated Bronze\nDimensions: 4cm x 2.5cm\nWeight: 15g\nChain: 50cm gold-plated chain included"
    },
    {
        id: 7,
        title: "Pharaoh's Scepter Replica",
        category: "Accessories",
        price: 650,
        image: "images/9-1.jpg",
        description: "Magnificent replica of a pharaoh's ceremonial scepter with golden finish and precious stone inlays.",
        details: "Materials: Brass Core, Gold Plating, Semi-precious Stones\nDimensions: 75cm length\nWeight: 800g\nDisplay: Includes wooden stand"
    },
    {
        id: 8,
        title: "Cleopatra's Mirror",
        category: "Accessories",
        price: 220,
        image: "images/5-3.jpg",
        description: "Elegant hand mirror inspired by Queen Cleopatra's personal accessories, featuring lotus motifs.",
        details: "Materials: Bronze, Silver Plating, Polished Mirror\nDimensions: 25cm x 15cm\nWeight: 400g\nDesign: Lotus and papyrus motifs"
    },
    {
        id: 9,
        title: "Senet Game Board",
        category: "Games",
        price: 320,
        image: "images/4-5-scaled.jpg",
        description: "Authentic replica of the ancient Egyptian board game Senet, complete with playing pieces.",
        details: "Materials: Cedar Wood, Ivory Pieces, Gold Inlays\nDimensions: 35cm x 12cm x 5cm\nWeight: 1kg\nIncludes: Complete game pieces and rules"
    },
    {
        id: 10,
        title: "Scarab Beetle Amulet",
        category: "Jewelry",
        price: 75,
        image: "images/10.jpg",
        description: "Traditional scarab beetle amulet symbolizing transformation and protection.",
        details: "Materials: Faience, Gold Plating\nDimensions: 3cm x 2cm\nWeight: 10g\nCord: Adjustable leather cord included"
    },
    {
        id: 11,
        title: "Tutankhamun Mask",
        category: "Masks",
        price: 850,
        image: "images/5-1.jpg",
        description: "Museum-quality replica of the iconic Tutankhamun death mask with stunning gold and blue detailing.",
        details: "Materials: Resin, 24k Gold Leaf, Lapis Lazuli Inlays\nDimensions: 54cm x 39cm x 49cm\nWeight: 11kg\nDisplay: Custom stand included"
    },
    {
        id: 12,
        title: "Usekh Collar Necklace",
        category: "Jewelry",
        price: 420,
        image: "images/5-1.jpg",
        description: "Traditional broad collar necklace worn by ancient Egyptian nobility, featuring intricate beadwork.",
        details: "Materials: Gold Plating, Lapis Lazuli, Carnelian\nDimensions: Adjustable 35-40cm\nWeight: 350g\nStyle: Traditional Usekh collar"
    },
    {
        id: 13,
        title: "Nefertiti Bust Replica",
        category: "Decorations",
        price: 280,
        image: "images/4-5-scaled.jpg",
        description: "Beautiful replica of Queen Nefertiti's iconic bust with detailed painting.",
        details: "Materials: Painted Limestone Replica\nDimensions: 30cm height\nWeight: 2kg\nOrigin: Berlin Museum reproduction"
    },
    {
        id: 14,
        title: "Anubis Shrine Figure",
        category: "Decorations",
        price: 195,
        image: "images/5-3.jpg",
        description: "Detailed figure of Anubis, the jackal-headed god of mummification, in shrine pose.",
        details: "Materials: Black Granite, Gold Accents\nDimensions: 25cm height\nWeight: 1.8kg\nFinish: Hand-painted details"
    },
    {
        id: 15,
        title: "Royal Lotus Vase",
        category: "Decorations",
        price: 310,
        image: "images/10.jpg",
        description: "Elegant vase shaped like a lotus flower, a sacred symbol of rebirth in ancient Egypt.",
        details: "Materials: Alabaster, Gold Trim\nDimensions: 30cm height, 15cm diameter\nWeight: 2kg\nFinish: Polished natural stone"
    },
    {
        id: 16,
        title: "Sacred Cat Statue",
        category: "Decorations",
        price: 165,
        image: "images/9-1.jpg",
        description: "Bronze statue of Bastet in cat form, representing protection and fertility.",
        details: "Materials: Bronze with Verdigris Patina\nDimensions: 18cm height\nWeight: 800g\nSymbolism: Protection of home and family"
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

// Categories with counts
const categories = [
    { name: "All", count: galleryData.length },
    { name: "Jewelry", count: galleryData.filter(item => item.category === "Jewelry").length },
    { name: "Decorations", count: galleryData.filter(item => item.category === "Decorations").length },
    { name: "Accessories", count: galleryData.filter(item => item.category === "Accessories").length },
    { name: "Boxes", count: galleryData.filter(item => item.category === "Boxes").length },
    { name: "Games", count: galleryData.filter(item => item.category === "Games").length },
    { name: "Masks", count: galleryData.filter(item => item.category === "Masks").length }
];

// DOM Elements
const loadingOverlay = document.getElementById('loadingOverlay');
const header = document.getElementById('header');
const searchBtn = document.getElementById('searchBtn');
const searchModal = document.getElementById('searchModal');
const searchClose = document.getElementById('searchClose');
const searchInput = document.getElementById('searchInput');
const gallerySearchInput = document.getElementById('gallerySearchInput');
const userBtn = document.getElementById('userBtn');
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const cartClose = document.getElementById('cartClose');
const wishlistBtn = document.getElementById('wishlistBtn');
const wishlistSidebar = document.getElementById('wishlistSidebar');
const wishlistClose = document.getElementById('wishlistClose');
const filterButtons = document.getElementById('filterButtons');
const galleryGrid = document.getElementById('galleryGrid');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const lightboxOverlay = document.getElementById('lightboxOverlay');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCategory = document.getElementById('lightboxCategory');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxDescription = document.getElementById('lightboxDescription');
const lightboxDetails = document.getElementById('lightboxDetails');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const lightboxAddToCart = document.getElementById('lightboxAddToCart');
const lightboxAddToWishlist = document.getElementById('lightboxAddToWishlist');
const notificationContainer = document.getElementById('notificationContainer');

// Initialize Website
document.addEventListener('DOMContentLoaded', function() {
    initializeLoading();
    initializeNavigation();
    initializeHero();
    initializeSearch();
    initializeFilters();
    initializeGallery();
    initializeLightbox();
    initializeSidebars();
    updateCartBadge();
    updateWishlistBadge();
    ensureSidebarsClosed();
    
    console.log('🏺 Egyptian Creativity Gallery with Index animations initialized successfully!');
});

// Initialize loading animation
function initializeLoading() {
    let progress = 0;
    const progressBar = document.querySelector('.progress-bar');
    const skipBtn = document.getElementById('skipBtn');
    
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progressBar) progressBar.style.width = `${progress}%`;
        if (progress >= 100) {
            clearInterval(loadingInterval);
            setTimeout(() => hideLoading(), 500);
        }
    }, 150);
    
    // Skip button
    if (skipBtn) {
        skipBtn.addEventListener('click', () => {
            clearInterval(loadingInterval);
            hideLoading();
        });
    }
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        clearInterval(loadingInterval);
        hideLoading();
    }, 3000);
}

function hideLoading() {
    if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

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
    
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    });
    
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');

    function closeMobileMenu() {
        if (navMenu) {
            navMenu.classList.remove('active');
            if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
            document.body.style.overflow = '';
            console.log('Mobile menu closed');
        } else {
            document.body.style.overflow = '';
            console.log('No navMenu found, nothing to close');
        }
    }

    function openMobileMenu() {
        if (navMenu) {
            navMenu.classList.add('active');
            if (mobileMenuBtn) mobileMenuBtn.classList.add('active');
            document.body.style.overflow = 'hidden';
            console.log('Mobile menu opened');
        } else {
            document.body.style.overflow = '';
            console.log('No navMenu found, cannot open menu');
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
    } else {
        console.log('Mobile menu button or navMenu not found');
    }

    // Close mobile menu when a nav link is clicked (on mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
        });
    });
}

// Hero Section
function initializeHero() {
    // Auto-rotate showcase
    setInterval(() => {
        currentShowcaseItem = (currentShowcaseItem + 1) % showcaseItems.length;
        updateShowcase();
    }, 5000);
    
    // Update showcase display
    function updateShowcase() {
        const item = showcaseItems[currentShowcaseItem];
        
        document.getElementById('showcaseImage').src = item.image;
        document.getElementById('showcaseTitle').textContent = item.title;
        document.getElementById('showcaseDesc').textContent = item.description;
        document.getElementById('showcaseCategory').textContent = item.category;
        
        // Update dots
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentShowcaseItem);
        });
    }
    
    // Hero buttons
    const exploreBtn = document.getElementById('exploreBtn');
    const heritageBtn = document.getElementById('heritageBtn');
    
    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            document.getElementById('gallery').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
    
    if (heritageBtn) {
        heritageBtn.addEventListener('click', () => {
            document.getElementById('filters').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
}

// Search functionality
function initializeSearch() {
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
    
    // Close search modal when clicking outside
    if (searchModal) {
        searchModal.addEventListener('click', (e) => {
            if (e.target === searchModal || e.target.classList.contains('modal-backdrop')) {
                searchModal.classList.remove('active');
            }
        });
    }
    
    // Search functionality
    if (gallerySearchInput) {
        gallerySearchInput.addEventListener('input', (e) => {
            searchGallery(e.target.value);
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchGallery(e.target.value);
            searchModal.classList.remove('active');
        });
    }
    
    // Search suggestions
    const suggestions = document.querySelectorAll('.suggestion-item');
    suggestions.forEach(suggestion => {
        suggestion.addEventListener('click', () => {
            const query = suggestion.textContent;
            if (gallerySearchInput) gallerySearchInput.value = query;
            searchGallery(query);
            searchModal.classList.remove('active');
        });
    });
}

// Search function
function searchGallery(query) {
    if (!query.trim()) {
        setFilter(currentFilter);
        return;
    }
    
    const searchTerms = query.toLowerCase().split(' ');
    filteredItems = galleryData.filter(item => {
        const searchableText = `${item.title} ${item.description} ${item.category}`.toLowerCase();
        return searchTerms.every(term => searchableText.includes(term));
    });
    
    displayedItems = 8;
    renderGallery();
    showNotification(`Found ${filteredItems.length} items matching "${query}"`, 'info');
}

// Filter functionality
function initializeFilters() {
    renderFilterButtons();
    filteredItems = [...galleryData];
}

function renderFilterButtons() {
    if (!filterButtons) return;
    
    filterButtons.innerHTML = categories.map(category => `
        <button class="filter-btn ${category.name === currentFilter ? 'active' : ''}" 
                data-filter="${category.name}">
            <span>${category.name} (${category.count})</span>
        </button>
    `).join('');
    
    // Add event listeners
    const filterBtns = filterButtons.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            setFilter(filter);
        });
    });
}

function setFilter(filter) {
    currentFilter = filter;
    
    if (filter === 'All') {
        filteredItems = [...galleryData];
    } else {
        filteredItems = galleryData.filter(item => item.category === filter);
    }
    
    displayedItems = 8;
    renderFilterButtons();
    renderGallery();
}

// Gallery functionality
function initializeGallery() {
    renderGallery();
    
    // Load more button
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            displayedItems += 8;
            renderGallery();
            showNotification('Loaded more treasures!', 'success');
        });
    }
}

function renderGallery() {
    if (!galleryGrid) return;
    
    const itemsToShow = filteredItems.slice(0, displayedItems);
    
    galleryGrid.innerHTML = itemsToShow.map((item, index) => `
        <div class="gallery-item" style="animation-delay: ${index * 0.1}s;" data-id="${item.id}">
            <div class="gallery-item-image">
                <img src="${item.image}" alt="${item.title}" loading="lazy" />
                <div class="gallery-item-overlay"></div>
                <div class="gallery-item-category">${item.category}</div>
                <div class="gallery-item-actions">
                    <button class="gallery-action-btn" title="Quick View" onclick="openLightbox(${item.id})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    </button>
                    <button class="gallery-action-btn" title="Add to Wishlist" onclick="addToWishlist(${item.id})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Update load more button visibility
    if (loadMoreBtn) {
        if (displayedItems >= filteredItems.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }
}

// Lightbox functionality
function initializeLightbox() {
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', () => navigateLightbox('prev'));
    }
    
    if (lightboxNext) {
        lightboxNext.addEventListener('click', () => navigateLightbox('next'));
    }
    
    // Close lightbox when clicking outside
    if (lightboxOverlay) {
        lightboxOverlay.addEventListener('click', (e) => {
            if (e.target === lightboxOverlay) {
                closeLightbox();
            }
        });
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
    const item = galleryData.find(item => item.id === id);
    if (!item) return;
    
    currentLightboxIndex = galleryData.findIndex(item => item.id === id);
    
    if (lightboxImage) lightboxImage.src = item.image;
    if (lightboxCategory) lightboxCategory.textContent = item.category;
    if (lightboxTitle) lightboxTitle.textContent = item.title;
    if (lightboxDescription) lightboxDescription.textContent = item.description;
    if (lightboxDetails) {
        lightboxDetails.innerHTML = item.details.split('\n').map(line => `<p>${line}</p>`).join('');
    }
    
    if (lightboxOverlay) {
        lightboxOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Update action buttons
    if (lightboxAddToCart) {
        lightboxAddToCart.onclick = () => addToCart(item.id);
    }
    if (lightboxAddToWishlist) {
        lightboxAddToWishlist.onclick = () => addToWishlist(item.id);
    }
}

function closeLightbox() {
    if (lightboxOverlay) {
        lightboxOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function navigateLightbox(direction) {
    if (direction === 'prev') {
        currentLightboxIndex = currentLightboxIndex > 0 ? currentLightboxIndex - 1 : galleryData.length - 1;
    } else {
        currentLightboxIndex = currentLightboxIndex < galleryData.length - 1 ? currentLightboxIndex + 1 : 0;
    }
    
    const item = galleryData[currentLightboxIndex];
    openLightbox(item.id);
}

// Initialize Sidebars
// Ensure all sidebars are closed by default
function ensureSidebarsClosed() {
  const sidebars = document.querySelectorAll('.sidebar');
  sidebars.forEach(sidebar => {
    sidebar.classList.remove('active');
  });
}

function initializeSidebars() {
  const cartBtn = document.getElementById('cartBtn');
    const wishlistBtn = document.getElementById('wishlistBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const wishlistSidebar = document.getElementById('wishlistSidebar');
    const cartClose = document.getElementById('cartClose');
    const wishlistClose = document.getElementById('wishlistClose');

    function openSidebar(sidebar) {
        if (sidebar) sidebar.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar(sidebar) {
        if (sidebar) sidebar.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (cartBtn && cartSidebar) {
        cartBtn.addEventListener('click', () => {
            openSidebar(cartSidebar);
            renderCartSidebar();
        });
    }

    if (wishlistBtn && wishlistSidebar) {
        wishlistBtn.addEventListener('click', () => {
            openSidebar(wishlistSidebar);
            renderWishlistSidebar();
        });
    }

    if (cartClose && cartSidebar) {
        cartClose.addEventListener('click', () => closeSidebar(cartSidebar));
    }

    if (wishlistClose && wishlistSidebar) {
        wishlistClose.addEventListener('click', () => closeSidebar(wishlistSidebar));
    }

    // Close sidebar when clicking outside
    document.addEventListener('mousedown', (e) => {
        if (cartSidebar && cartSidebar.classList.contains('active') && 
            !cartSidebar.contains(e.target) && !cartBtn.contains(e.target)) {
            closeSidebar(cartSidebar);
        }
        if (wishlistSidebar && wishlistSidebar.classList.contains('active') && 
            !wishlistSidebar.contains(e.target) && !wishlistBtn.contains(e.target)) {
            closeSidebar(wishlistSidebar);
        }
    });

    // ESC key closes any open sidebar
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (cartSidebar && cartSidebar.classList.contains('active')) closeSidebar(cartSidebar);
            if (wishlistSidebar && wishlistSidebar.classList.contains('active')) closeSidebar(wishlistSidebar);
        }
    });
}

// Cart Functions
function addToCart(productId) {
    const product = galleryData.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartBadge();
    saveCart();
    showNotification(`${product.title} added to cart!`, 'success');
}

function removeFromCart(productId) {
    const product = galleryData.find(p => p.id === productId);
    cart = cart.filter(item => item.id !== productId);
    
    updateCartBadge();
    saveCart();
    renderCartSidebar();
    if (product) {
        showNotification(`${product.title} removed from cart`, 'info');
    }
}

function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    if (badge) {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function saveCart() {
    localStorage.setItem('egyptianLuxuryCart', JSON.stringify(cart));
}

function renderCartSidebar() {
    const cartEmpty = document.getElementById('cartEmpty');
    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');
    
    if (!cartEmpty || !cartItems || !cartFooter) return;
    
    if (cart.length === 0) {
        cartEmpty.style.display = 'block';
        cartItems.style.display = 'none';
        cartFooter.style.display = 'none';
    } else {
        cartEmpty.style.display = 'none';
        cartItems.style.display = 'block';
        cartFooter.style.display = 'block';
        
        cartItems.innerHTML = cart.map(item => {
            // Fallback to galleryData if fields are missing
            let product = item;
            if (!item.title || !item.image || !item.price) {
                const found = galleryData.find(p => p.id === item.id);
                if (found) {
                    product = { ...found, ...item };
                }
            }
            return `
                <div class="cart-item">
                    <img src="${product.image}" alt="${product.title}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${product.title}</h4>
                        <div class="cart-item-price">${product.price ? product.price.toLocaleString() : ''} x ${product.quantity}</div>
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCart(${product.id})" title="Remove item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3,6 5,6 21,6"></polyline>
                            <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1 2-2h4a2,2 0 0,1 2,2v2"></path>
                        </svg>
                    </button>
                </div>
            `;
        }).join('');
        
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const subtotalEl = document.getElementById('cartSubtotal');
        const totalEl = document.getElementById('cartTotal');
        if (subtotalEl) subtotalEl.textContent = `$${subtotal.toLocaleString()}`;
        if (totalEl) totalEl.textContent = `$${subtotal.toLocaleString()}`;
    }
}

// Wishlist Functions
function addToWishlist(productId) {
    const product = galleryData.find(p => p.id === productId);
    if (!product) return;
    
    const existingIndex = wishlist.findIndex(item => item.id === productId);
    
    if (existingIndex > -1) {
        wishlist.splice(existingIndex, 1);
        showNotification(`${product.title} removed from wishlist`, 'info');
    } else {
        wishlist.push(product);
        showNotification(`${product.title} added to wishlist!`, 'success');
    }
    
    updateWishlistBadge();
    saveWishlist();
}

function removeFromWishlist(productId) {
    const product = galleryData.find(p => p.id === productId);
    wishlist = wishlist.filter(item => item.id !== productId);
    
    updateWishlistBadge();
    saveWishlist();
    renderWishlistSidebar();
    if (product) {
        showNotification(`${product.title} removed from wishlist`, 'info');
    }
}

function updateWishlistBadge() {
    const badge = document.getElementById('wishlistBadge');
    
    if (badge) {
        badge.textContent = wishlist.length;
        badge.style.display = wishlist.length > 0 ? 'flex' : 'none';
    }
}

function saveWishlist() {
    localStorage.setItem('egyptianWishlist', JSON.stringify(wishlist));
}

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
            // Fallback to galleryData if fields are missing
            let product = item;
            if (!item.title || !item.image || !item.price) {
                const found = galleryData.find(p => p.id === item.id);
                if (found) {
                    product = { ...found, ...item };
                }
            }
            return `
                <div class="wishlist-item">
                    <img src="${product.image}" alt="${product.title}" class="wishlist-item-image">
                    <div class="wishlist-item-details">
                        <h4 class="wishlist-item-title">${product.title}</h4>
                        <div class="wishlist-item-price">$${product.price ? product.price.toLocaleString() : ''}</div>
                    </div>
                    <button class="wishlist-item-remove" onclick="removeFromWishlist(${product.id})" title="Remove from wishlist">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                </div>
            `;
        }).join('');
    }
}

// Showcase Controls
function changeShowcase(index) {
    currentShowcaseItem = index;
    const item = showcaseItems[currentShowcaseItem];
    
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

// Header Actions
document.getElementById('userBtn')?.addEventListener('click', () => {
    if (window.authManager && window.authManager.isAuthenticated()) {
        window.location.href = 'profile.html';
    } else {
        showNotification('You must login first to access your profile', 'error');
    }
});

// Auto-refresh badges when localStorage changes (cross-tab sync)
window.addEventListener('storage', (event) => {
    if (event.key === 'egyptianLuxuryCart') {
        cart = JSON.parse(localStorage.getItem('egyptianLuxuryCart')) || [];
        updateCartBadge();
    }
    if (event.key === 'egyptianWishlist') {
        wishlist = JSON.parse(localStorage.getItem('egyptianWishlist')) || [];
        updateWishlistBadge();
    }
});

// Global functions for onclick handlers
window.openLightbox = openLightbox;
window.addToCart = addToCart;
window.addToWishlist = addToWishlist;
window.removeFromCart = removeFromCart;
window.removeFromWishlist = removeFromWishlist;
window.changeShowcase = changeShowcase;

console.log('🏺 Egyptian Creativity Gallery - Enhanced with Index background animations loaded successfully!');