// Enhanced Egyptian Creativity Cart - With Index Page Background Animations

// Image mapping for cart items
const DEFAULT_IMAGE_PATH = 'images/logo.jpg';
const CART_IMAGE_MAP = {
  1: 'images/1-7-scaled.jpg',
  2: 'images/4-5-scaled.jpg',
  3: 'images/5-1.jpg',
  4: 'images/5-3.jpg',
  5: 'images/9-1.jpg',
  6: 'images/10.jpg',
};

class EgyptianLuxuryCart {
  constructor() {
    this.cartItems = [];
    this.wishlist = this.loadFromStorage('egyptianWishlist') || [];
    this.subtotal = 0;
    this.shipping = 0; // Set to 0
    this.insurance = 0; // Set to 0
    this.tax = 0; // Set to 0
    this.total = 0;
    this.promoDiscount = 0;
    this.appliedPromoCode = null;
    this.currentStep = 1;

    // Sample cart data with Egyptian artifacts
    this.sampleCartItems = [
      {
        id: 1,
        name: "Golden Pharaoh Mask Replica",
        description: "Exquisite reproduction of Tutankhamun's burial mask, crafted with 24-karat gold plating and precious gemstone inlays.",
        price: 15750,
        quantity: 1,
        image: 'images/1-7-scaled.jpg',
        sku: "EGY-MASK-001",
        features: ["24K Gold Plated", "Handcrafted", "Certificate of Authenticity"],
        badge: "premium",
        availability: "in-stock",
        maxQuantity: 3,
      },
      {
        id: 2,
        name: "Sacred Scarab Amulet Set",
        description: "Collection of five protective scarab amulets representing rebirth and eternal life, crafted in sterling silver.",
        price: 4250,
        quantity: 2,
        image: 'images/4-5-scaled.jpg',
        sku: "EGY-SCARAB-002",
        features: ["Sterling Silver", "Set of 5", "Ancient Design"],
        badge: "limited",
        availability: "limited",
        maxQuantity: 5,
      },
      {
        id: 3,
        name: "Ankh Symbol Pendant",
        description: "Symbol of eternal life in pure gold with intricate hieroglyphic engravings and matching chain.",
        price: 3850,
        quantity: 1,
        image: 'images/5-1.jpg',
        sku: "EGY-ANKH-003",
        features: ["Pure Gold", "Engraved Details", '18" Chain'],
        badge: null,
        availability: "in-stock",
        maxQuantity: 10,
      },
    ];

    this.recommendedItems = []; // Will be loaded from database

    this.validPromoCodes = {
      EGYPT10: { discount: 0.1, type: "percentage", description: "10% off your order" },
      LUXURY500: { discount: 500, type: "fixed", description: "$500 off orders over $10,000" },
      PHARAOH25: { discount: 0.25, type: "percentage", description: "25% off premium items" },
      GOLDEN20: { discount: 0.2, type: "percentage", description: "20% off golden artifacts" },
      WELCOME15: { discount: 0.15, type: "percentage", description: "15% off for new customers" },
    };
  }

  // Force update all badges
  forceUpdateBadges() {
    console.log('[DEBUG] Force updating all badges');
    
    // Clear wishlist badge first
    this.clearWishlistBadge();
    
    // Update cart badge
    const cartBadge = document.getElementById("cartBadge");
    if (cartBadge) {
      const totalItems = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
      cartBadge.textContent = totalItems;
      cartBadge.style.display = totalItems > 0 ? "flex" : "none";
      console.log('[DEBUG] Force updated cart badge to:', totalItems);
    }
    
    // Update wishlist badge (should be 0)
    const wishlistBadge = document.getElementById("wishlistBadge");
    if (wishlistBadge) {
      wishlistBadge.textContent = '0';
      wishlistBadge.style.display = 'none';
      console.log('[DEBUG] Force updated wishlist badge to: 0');
    }
    
    // Update item count
    const itemCount = document.getElementById("itemCount");
    if (itemCount) {
      const totalItems = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
      itemCount.textContent = totalItems;
      console.log('[DEBUG] Force updated item count to:', totalItems);
    }
  }

  // Clear wishlist badge
  clearWishlistBadge() {
    const wishlistBadge = document.getElementById("wishlistBadge");
    if (wishlistBadge) {
      wishlistBadge.textContent = '0';
      wishlistBadge.style.display = 'none';
      console.log('[DEBUG] Cleared wishlist badge');
    }
    
    // Also clear localStorage wishlist to ensure consistency
    this.saveToStorage('egyptianWishlist', []);
  }

  // Initialize the cart system
  async init() {
    console.log("🏺 Egyptian Luxury Cart - Initializing...");

    try {
      this.initializeLoading();
      await this.loadCartData();
      this.setupEventListeners();
      this.setupAnimations();
      this.setupNavigation();
      this.ensureSidebarsClosed();
      
      // Force sync both cart page and sidebar to ensure they're connected
      console.log('[DEBUG] Forcing cart page and sidebar sync');
      this.forceSyncCart();
      
      // Ensure recommended items are rendered
      console.log('[DEBUG] Rendering recommended items');
      this.renderRecommendedItems();
      
      // Force update all badges to ensure correct counts
      this.forceUpdateBadges();

      // Highlight cart icon as active since we're on the cart page
      const cartBtn = document.getElementById('cartBtn');
      if (cartBtn) {
        cartBtn.classList.add('active');
      }

      console.log("✅ Cart initialized successfully");
      console.log('[DEBUG] Final cart state:', this.cartItems.length, 'items');
    } catch (error) {
      console.error("❌ Cart initialization failed:", error);
      this.showNotification("Failed to initialize cart. Please refresh the page.", "error");
    }
  }

  // Ensure all sidebars are closed by default
  ensureSidebarsClosed() {
    const sidebars = document.querySelectorAll('.sidebar');
    sidebars.forEach(sidebar => {
      sidebar.classList.remove('active');
    });
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
      if (progressBar) progressBar.style.width = `${progress}%`;
    }, 150);

    // Skip button
    skipBtn?.addEventListener('click', () => {
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
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
      loadingOverlay.classList.add('hidden');
      setTimeout(() => {
        loadingOverlay.style.display = 'none';
      }, 1000);
    }
  }

  // Setup navigation like the index page
  setupNavigation() {
    const header = document.getElementById('header');
    
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

        // Handle only in-page anchor links (starting with #)
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const targetSection = document.querySelector(href);

          if (targetSection) {
            targetSection.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });

            // Update active link
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

  // Load cart data from database
  async loadCartData() {
    try {
      // Load cart data from database/API instead of localStorage
      console.log('[DEBUG] Loading cart data from database...');
      
      const response = await fetch('cart.php?action=get_cart');
      const text = await response.text();
      
      if (text.trim().startsWith('<')) {
        console.warn('[DEBUG] Cart API returned HTML, using empty cart');
        this.cartItems = [];
      } else {
        try {
          const data = JSON.parse(text);
          console.log('[DEBUG] Cart API response:', data);
        if (data.success) {
            this.cartItems = data.cart || data.cart_items || [];
            console.log('[DEBUG] Successfully loaded cart items from database:', this.cartItems.length, 'items');
        } else {
            console.log('[DEBUG] API failed, using empty cart');
          this.cartItems = [];
        }
        } catch (e) {
          console.error('Error parsing cart API response:', e);
        this.cartItems = [];
        }
      }

      // Always render both cart page and sidebar with the same data
      console.log('[DEBUG] Rendering cart page and sidebar with', this.cartItems.length, 'items');
      this.renderCart();
      this.renderCartSidebar();
      this.calculateTotals();
      this.updateBadges();
      
      console.log('[DEBUG] Cart page and sidebar updated with', this.cartItems.length, 'items');
      
      // Load recommended items from database
      try {
      const recommendedResponse = await fetch('cart.php?action=get_recommended');
      if (recommendedResponse.ok) {
        const recommendedData = await recommendedResponse.json();
        if (recommendedData.success) {
          this.recommendedItems = recommendedData.recommended_items || [];
            console.log("📦 Loaded recommended items from database:", this.recommendedItems.length, "items");
        } else {
            console.error("❌ Failed to load recommended items:", recommendedData.error);
          this.recommendedItems = [];
        }
      } else {
        console.error("❌ Failed to load recommended items from database");
          this.recommendedItems = [];
        }
      } catch (error) {
        console.error("❌ Failed to load recommended items:", error);
        this.recommendedItems = [];
      }
      
    } catch (error) {
      console.error("❌ Error loading cart data:", error);
      this.cartItems = [];
      this.recommendedItems = [];
      this.renderCart();
      this.renderCartSidebar();
      this.calculateTotals();
      this.updateBadges();
    }
  }

  // Save cart data to database (not needed for database integration)
  saveCartData() {
    // Save cart data to database instead of localStorage
    console.log('[DEBUG] Saving cart data to database...');
    
    // The cart data is already saved to database in each operation
    // This function is kept for compatibility but doesn't need to do anything
    console.log('[DEBUG] Cart data saved to database');
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

  // Setup all event listeners
  setupEventListeners() {
    // Header actions
    document.getElementById('searchBtn')?.addEventListener('click', () => this.openModal('searchModal'));
    document.getElementById('userBtn')?.addEventListener('click', () => {
      // Check if user is logged in
      if (window.authManager && window.authManager.isAuthenticated()) {
        window.location.href = 'profile.html';
      } else {
        // Show login required message
        this.showNotification('You must login first to access your profile', 'error');
      }
    });
    document.getElementById('cartBtn')?.addEventListener('click', () => {
      const cartSidebar = document.getElementById('cartSidebar');
      if (cartSidebar) {
        cartSidebar.classList.add('active');
        this.renderCartSidebar();
      }
    });
    document.getElementById('wishlistBtn')?.addEventListener('click', () => {
      const wishlistSidebar = document.getElementById('wishlistSidebar');
      if (wishlistSidebar) {
        wishlistSidebar.classList.add('active');
        this.renderWishlistSidebar();
      }
    });

    // Sidebar close buttons
    document.getElementById('cartClose')?.addEventListener('click', () => {
      const cartSidebar = document.getElementById('cartSidebar');
      if (cartSidebar) {
        cartSidebar.classList.remove('active');
      }
    });

    document.getElementById('wishlistClose')?.addEventListener('click', () => {
      const wishlistSidebar = document.getElementById('wishlistSidebar');
      if (wishlistSidebar) {
        wishlistSidebar.classList.remove('active');
      }
    });

    // Close sidebars when clicking outside
    document.addEventListener('click', (e) => {
      const cartSidebar = document.getElementById('cartSidebar');
      const wishlistSidebar = document.getElementById('wishlistSidebar');
      const cartBtn = document.getElementById('cartBtn');
      const wishlistBtn = document.getElementById('wishlistBtn');

      if (cartSidebar && cartSidebar.classList.contains('active') && 
          !cartSidebar.contains(e.target) && !cartBtn.contains(e.target)) {
        cartSidebar.classList.remove('active');
      }

      if (wishlistSidebar && wishlistSidebar.classList.contains('active') && 
          !wishlistSidebar.contains(e.target) && !wishlistBtn.contains(e.target)) {
        wishlistSidebar.classList.remove('active');
      }
    });

    // Close sidebars with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const cartSidebar = document.getElementById('cartSidebar');
        const wishlistSidebar = document.getElementById('wishlistSidebar');
        
        if (cartSidebar && cartSidebar.classList.contains('active')) {
          cartSidebar.classList.remove('active');
        }
        if (wishlistSidebar && wishlistSidebar.classList.contains('active')) {
          wishlistSidebar.classList.remove('active');
        }
      }
    });

    // Modal controls
    this.bindModalEvents();

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput?.addEventListener('input', (e) => {
      // Search functionality can be added here
      console.log('Searching for:', e.target.value);
    });

    // Newsletter form
    document.getElementById('newsletterForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.showNotification('Thank you for subscribing to Egyptian Creativity!', 'success');
      e.target.reset();
    });

    // Cart specific events
    document.addEventListener("click", async (e) => {
      // Quantity controls
      if (e.target.closest(".qty-btn")) {
        const btn = e.target.closest(".qty-btn");
        const action = btn.dataset.action;
        const itemId = parseInt(btn.closest(".cart-item").dataset.itemId);
        await this.updateQuantity(itemId, action);
      }

      // Remove item
      if (e.target.closest(".remove-btn")) {
        const itemId = parseInt(e.target.closest(".cart-item").dataset.itemId);
        await this.removeItem(itemId);
      }

      // Move to wishlist
      if (e.target.closest(".wishlist-btn")) {
        const itemId = parseInt(e.target.closest(".cart-item").dataset.itemId);
        this.moveToWishlist(itemId);
      }

      // Add recommended item
      if (e.target.closest(".add-rec-btn")) {
        const button = e.target.closest(".add-rec-btn");
        const itemId = parseInt(button.dataset.itemId);
        console.log('[DEBUG] Add to Cart button clicked for item:', itemId);
        console.log('[DEBUG] Button element:', button);
        console.log('[DEBUG] Button dataset:', button.dataset);
        await this.addRecommendedItem(itemId);
      }

      // Clear all items
      if (e.target.closest("#clearAllBtn")) {
        await this.clearCart();
      }

      // Checkout
      if (e.target.closest("#checkoutBtn")) {
        this.openCheckoutModal();
      }

      // Modal controls
      if (e.target.closest("#closeModal")) {
        this.closeCheckoutModal();
      }

      if (e.target.closest("#nextBtn")) {
        this.nextStep();
      }

      if (e.target.closest("#prevBtn")) {
        this.prevStep();
      }

      if (e.target.closest("#placeOrderBtn")) {
        this.placeOrder();
      }
    });

    // Quantity input changes
    document.addEventListener("input", (e) => {
      if (e.target.classList.contains("qty-input")) {
        const itemId = parseInt(e.target.closest(".cart-item").dataset.itemId);
        const newQuantity = parseInt(e.target.value) || 1;
        this.updateQuantityDirect(itemId, newQuantity);
      }
    });

    // Shipping selection
    const shippingSelect = document.getElementById("shippingSelect");
    if (shippingSelect) {
      shippingSelect.addEventListener("change", (e) => {
        this.shipping = parseInt(e.target.value);
        this.calculateTotals();
        this.showNotification("Shipping option updated", "success");
      });
    }

    // Insurance toggle
    const insuranceToggle = document.getElementById("insuranceToggle");
    if (insuranceToggle) {
      insuranceToggle.addEventListener("change", (e) => {
        this.updateInsurance(e.target.checked);
      });
    }

    // Promo code
    const applyPromoBtn = document.getElementById("applyPromoBtn");
    if (applyPromoBtn) {
      applyPromoBtn.addEventListener("click", () => {
        this.applyPromoCode();
      });
    }

    const promoInput = document.getElementById("promoInput");
    if (promoInput) {
      promoInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.applyPromoCode();
        }
      });
    }

    // Close modal on overlay click
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal-overlay")) {
        this.closeCheckoutModal();
      }
    });

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeCheckoutModal();
        this.closeModal('searchModal');
      }
    });
  }

  // Bind modal events
  bindModalEvents() {
    // Search modal
    const searchBtn = document.getElementById('searchBtn');
    const searchModal = document.getElementById('searchModal');
    const searchClose = document.getElementById('searchClose');
    const searchBackdrop = document.getElementById('searchBackdrop');
    const searchInput = document.getElementById('searchInput');

    if (searchBtn && searchModal) {
      searchBtn.addEventListener('click', () => {
        searchModal.classList.add('active');
        if (searchInput) {
          setTimeout(() => searchInput.focus(), 100);
        }
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

    // Search suggestions
    const suggestions = document.querySelectorAll('.suggestion-item');
    suggestions.forEach(suggestion => {
      suggestion.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = suggestion.textContent;
          this.showNotification(`Searching for "${suggestion.textContent}"...`, 'info');
          searchModal.classList.remove('active');
          // Redirect to shop with search query
          setTimeout(() => {
            window.location.href = `shop.html?search=${encodeURIComponent(suggestion.textContent)}`;
          }, 1000);
        }
      });
    });

    // ESC key closes search modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchModal && searchModal.classList.contains('active')) {
        searchModal.classList.remove('active');
      }
    });

    // Checkout modal
    const checkoutModal = document.getElementById('checkoutModal');
    const closeCheckoutBtn = document.getElementById('closeCheckoutModal');
    const checkoutBackdrop = document.getElementById('checkoutBackdrop');

    if (closeCheckoutBtn) {
      closeCheckoutBtn.addEventListener('click', () => this.closeCheckoutModal());
    }

    if (checkoutBackdrop) {
      checkoutBackdrop.addEventListener('click', () => this.closeCheckoutModal());
    }

    // Step navigation
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const placeOrderBtn = document.getElementById('placeOrderBtn');

    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextStep());
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.prevStep());
    }

    if (placeOrderBtn) {
      placeOrderBtn.addEventListener('click', () => this.placeOrder());
    }
  }

  // Setup animations and effects from index page
  setupAnimations() {
    // Enhanced parallax effect for background elements based on index page
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;

      // Animate hieroglyphs (symbols)
      const symbols = document.querySelectorAll(".symbol");
      symbols.forEach((element, index) => {
        const speed = 0.3 + index * 0.05;
        const yPos = -(scrolled * speed);
        const rotate = scrolled * 0.05;
        element.style.transform = `translate3d(0, ${yPos}px, 0) rotate(${rotate}deg)`;
      });

      // Animate floating artifacts
      const artifacts = document.querySelectorAll(".artifact");
      artifacts.forEach((element, index) => {
        const speed = 0.2 + index * 0.1;
        const yPos = -(scrolled * speed);
        const rotate = scrolled * 0.03;
        element.style.transform = `translate3d(0, ${yPos}px, 0) rotate(${rotate}deg)`;
      });

      // Animate golden rays
      const goldenRays = document.querySelector(".golden-rays");
      if (goldenRays) {
        const rotation = scrolled * 0.02;
        goldenRays.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
      }

      // Animate pyramid background
      const pyramidBg = document.querySelector(".pyramid-bg");
      if (pyramidBg) {
        const rotation = scrolled * 0.01;
        pyramidBg.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
      }
    });

    // Intersection Observer for animations
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

    // Observe elements for scroll animations
    document.querySelectorAll('.cart-item, .recommended-item, .trust-item').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });

    // Enhanced floating animations for page elements
    this.addFloatingAnimations();
  }

  // Add floating animations to various elements
  addFloatingAnimations() {
    // Animate hero ornament
    const heroOrnament = document.querySelector('.hero-ornament');
    if (heroOrnament) {
      heroOrnament.style.animation = 'float 3s ease-in-out infinite';
    }

    // Add hover effects to cart items
    const cartItems = document.querySelectorAll('.cart-item');
    cartItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-5px) scale(1.02)';
        item.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      });

      item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateY(0) scale(1)';
      });
    });

    // Add ripple effect to buttons
    this.addRippleEffect();
  }

  // Add ripple effect to buttons
  addRippleEffect() {
    const buttons = document.querySelectorAll('.checkout-btn, .add-rec-btn, .btn-primary');
    
    buttons.forEach(button => {
      button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 0.6s linear;
          pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });

    // Add ripple animation keyframes if not already added
    if (!document.getElementById('ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'ripple-styles';
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Render cart items
  renderCart() {
    const container = document.getElementById("cartItemsContainer");
    const emptyState = document.getElementById("emptyCartState");
    const cartLayout = document.querySelector(".cart-layout");

    console.log('[DEBUG] renderCart: cartItems.length =', this.cartItems.length);

    if (!Array.isArray(this.cartItems) || this.cartItems.length === 0) {
      if (cartLayout) cartLayout.style.display = "none";
      if (emptyState) emptyState.style.display = "flex";
      // Update sidebar to show empty state
      this.renderCartSidebar();
      return;
    }

    if (cartLayout) cartLayout.style.display = "";
    if (emptyState) emptyState.style.display = "none";

    if (!container) return;

    try {
    container.innerHTML = this.cartItems
      .map(
          (item, index) => {
            try {
              return `
            <div class="cart-item" data-item-id="${item.id}">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                    ${item.badge ? `<div class="item-badge ${item.badge}">${item.badge}</div>` : ""}
                </div>
                <div class="item-details">
                    <h3 class="item-name">${item.name}</h3>
                    <p class="item-description">${item.description}</p>
                    <div class="item-features">
                        ${(item.features || []).map((feature) => `<span class="feature-tag">${feature}</span>`).join("")}
                    </div>
                    <div class="item-meta">
                        <span class="item-sku">SKU: ${item.sku}</span>
                        <div class="item-availability ${item.availability}">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                ${item.availability === "in-stock" 
                                  ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22,4 12,14.01 9,11.01"></polyline>'
                                  : '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>'
                                }
                            </svg>
                            <span>${item.availability === "in-stock" ? "In Stock" : "Limited Stock"}</span>
                        </div>
                    </div>
                </div>
                <div class="item-controls">
                    <div class="quantity-controls">
                        <label>Quantity</label>
                        <div class="quantity-input">
                            <button class="qty-btn" data-action="decrease" ${item.quantity <= 1 ? "disabled" : ""}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                            </button>
                            <input type="number" class="qty-input" value="${item.quantity}" min="1" max="${item.maxQuantity}">
                            <button class="qty-btn" data-action="increase" ${item.quantity >= item.maxQuantity ? "disabled" : ""}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="item-pricing">
                        <div class="unit-price">$${this.formatPrice(item.price)} each</div>
                        <div class="total-price">$${this.formatPrice(item.price * item.quantity)}</div>
                    </div>
                    <div class="item-actions">
                        <button class="action-btn wishlist-btn" title="Move to Wishlist">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                        </button>
                        <button class="action-btn remove-btn" title="Remove Item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3,6 5,6 21,6"></polyline>
                                <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1 2-2h4a2,2 0 0,1 2,2v2"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
              `;
            } catch (err) {
              console.error('[RENDER ERROR] Failed to render cart item:', item, err);
              return `<div style="color:red;">[ERROR] Failed to render item: ${item && item.name ? item.name : 'Unknown'}</div>`;
            }
          }
      )
      .join("");
    } catch (err) {
      console.error('[RENDER ERROR] Failed to render cart items:', err);
      if (container) container.innerHTML = '<div style="color:red;">[ERROR] Failed to render cart items</div>';
    }

    // Render recommended items
    this.renderRecommendedItems();

    // Re-apply animations to newly rendered items
    setTimeout(() => {
      this.addFloatingAnimations();
    }, 100);

    // Always update sidebar to keep it in sync with main cart
    this.renderCartSidebar();
  }

  // Render recommended items
  renderRecommendedItems() {
    const container = document.getElementById("recommendedGrid");
    console.log('[DEBUG] renderRecommendedItems - container:', container);
    console.log('[DEBUG] renderRecommendedItems - recommendedItems:', this.recommendedItems);
    
    if (!container) {
      console.error('[DEBUG] Recommended grid container not found');
      return;
    }

    if (!this.recommendedItems || this.recommendedItems.length === 0) {
      console.log('[DEBUG] No recommended items available, showing empty state');
      container.innerHTML = '<div class="no-recommendations">No recommendations available at the moment.</div>';
      return;
    }

    console.log('[DEBUG] Rendering', this.recommendedItems.length, 'recommended items from database');

    container.innerHTML = this.recommendedItems
      .map(
        (item, index) => {
          console.log('[DEBUG] Rendering recommended item from database:', item);
          const buttonHtml = `
            <div class="recommended-item">
                <div class="rec-image">
                    <img src="${item.image || 'images/1-7-scaled.jpg'}" alt="${item.name}" loading="lazy">
                </div>
                <h4 class="rec-name">${item.name}</h4>
                <div class="rec-price">$${this.formatPrice(item.price)}</div>
                <button class="add-rec-btn" data-item-id="${item.id}" onclick="console.log('Button clicked for item ${item.id}')">
                    Add to Cart
                </button>
            </div>
        `;
          console.log('[DEBUG] Generated HTML for database item:', item.id, buttonHtml);
          return buttonHtml;
        }
      )
      .join("");
      
    console.log('[DEBUG] Recommended items from database rendered successfully');
  }

  // Update item quantity
  async updateQuantity(itemId, action) {
    const item = this.cartItems.find((item) => item.id === itemId);
    if (!item) return;

    let newQuantity = item.quantity;

    if (action === "increase") {
      newQuantity = Math.min(item.quantity + 1, item.maxQuantity);
    } else if (action === "decrease") {
      newQuantity = Math.max(item.quantity - 1, 1);
    }

    await this.updateQuantityDirect(itemId, newQuantity);
  }

  // Update quantity directly
  async updateQuantityDirect(itemId, newQuantity) {
    const item = this.cartItems.find((item) => item.id === itemId);
    if (!item) return;

    const clampedQuantity = Math.max(1, Math.min(newQuantity, item.maxQuantity));
    
    try {
      // Update local cart first
      item.quantity = clampedQuantity;
      
      // Update database
      const response = await fetch('cart.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update_quantity',
          cart_id: item.cart_id,
          quantity: clampedQuantity
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (!result.success) {
          console.warn('Database update failed:', result.error);
        }
      } else {
        console.warn('Database update failed');
      }

      // Update both cart page and sidebar
      this.forceSyncCart();

      // Update UI elements
          const cartItem = document.querySelector(`[data-item-id="${itemId}"]`);
          if (cartItem) {
            const qtyInput = cartItem.querySelector(".qty-input");
            const decreaseBtn = cartItem.querySelector('[data-action="decrease"]');
            const increaseBtn = cartItem.querySelector('[data-action="increase"]');
            const totalPrice = cartItem.querySelector(".total-price");

            if (qtyInput) qtyInput.value = clampedQuantity;
            if (decreaseBtn) decreaseBtn.disabled = clampedQuantity <= 1;
            if (increaseBtn) increaseBtn.disabled = clampedQuantity >= item.maxQuantity;
            if (totalPrice) totalPrice.textContent = `$${this.formatPrice(item.price * clampedQuantity)}`;

            // Add animation
            cartItem.style.transform = "scale(1.02)";
            setTimeout(() => {
              cartItem.style.transform = "";
            }, 200);
          }

          this.showNotification(`Quantity updated to ${clampedQuantity}`, 'success');
    } catch (error) {
      console.error('Error updating quantity:', error);
      this.showNotification('Failed to update quantity', 'error');
    }
  }

  // Remove item from cart
  async removeItem(itemId) {
    const item = this.cartItems.find((item) => item.id === itemId);
    if (!item) return;

      try {
      // Remove from local cart first
      this.cartItems = this.cartItems.filter((item) => item.id !== itemId);
      
      // Remove from database
        const response = await fetch('cart.php', {
        method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
          action: 'remove_from_cart',
          cart_id: item.cart_id,
          product_id: item.id
          })
        });

        if (response.ok) {
          const result = await response.json();
        if (!result.success) {
          console.warn('Database removal failed:', result.error);
        }
      } else {
        console.warn('Database removal failed');
      }

      // Update both cart page and sidebar
      this.forceSyncCart();

      // Update UI with animation
      const cartItem = document.querySelector(`[data-item-id="${itemId}"]`);
            if (cartItem) {
        cartItem.style.transform = "scale(0.95)";
              cartItem.style.opacity = "0";
              setTimeout(() => {
                this.renderCart();
          this.renderCartSidebar();
        }, 300);
      }

      this.showNotification(`${item.name} removed from cart`, 'success');
    } catch (error) {
      console.error('Error removing item:', error);
      this.showNotification('Failed to remove item', 'error');
    }
  }

  // Add item to cart (called from other pages)
  async addToCart(productData) {
    try {
      // Check if item already exists in cart
      const existingItem = this.cartItems.find(item => item.id === productData.id);
      
      if (existingItem) {
        // Update quantity if item exists
        existingItem.quantity += productData.quantity || 1;
        this.showNotification(`${productData.name} quantity updated`, 'success');
          } else {
        // Add new item to cart
        const newItem = {
          id: productData.id,
          name: productData.name,
          description: productData.description || '',
          price: productData.price,
          quantity: productData.quantity || 1,
          image: productData.image || 'images/1-7-scaled.jpg',
          sku: productData.sku || `SKU-${productData.id}`,
          features: productData.features || ['Handcrafted', 'Premium Quality'],
          badge: productData.badge || null,
          availability: productData.availability || 'in-stock',
          maxQuantity: productData.maxQuantity || 10,
          cart_id: `local_${Date.now()}_${productData.id}` // Local cart ID
        };
        
        this.cartItems.push(newItem);
        this.showNotification(`${productData.name} added to cart`, 'success');
      }
      
      // Save to database
      const response = await fetch('cart.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'add_to_cart',
          product_id: productData.id,
          quantity: productData.quantity || 1
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (!result.success) {
          console.warn('Database add failed:', result.error);
          }
        } else {
        console.warn('Database add failed');
        }
      
      // Update both cart page and sidebar
      this.forceSyncCart();
      
      return true;
      } catch (error) {
      console.error('Error adding to cart:', error);
      this.showNotification('Failed to add item to cart', 'error');
      return false;
    }
  }

  // Move item from cart to wishlist
  moveToWishlist(itemId) {
    const item = this.cartItems.find((item) => item.id === itemId);
    if (!item) return;

    try {
      // Remove from cart
      this.cartItems = this.cartItems.filter((item) => item.id !== itemId);

    // Add to wishlist
      const wishlist = this.loadFromStorage('egyptianWishlist') || [];
      const existingWishlistItem = wishlist.find(wishlistItem => wishlistItem.id === itemId);
      
    if (!existingWishlistItem) {
        wishlist.push({
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          description: item.description
        });
        this.saveToStorage('egyptianWishlist', wishlist);
      }
      
      // Update both cart page and sidebar
      this.forceSyncCart();
      this.renderWishlistSidebar();
      
      this.showNotification(`${item.name} moved to wishlist`, 'success');
    } catch (error) {
      console.error('Error moving to wishlist:', error);
      this.showNotification('Failed to move item to wishlist', 'error');
    }
  }

  // Add recommended item to cart
  async addRecommendedItem(itemId) {
    console.log('[DEBUG] Adding recommended item to cart:', itemId);
    
    // Find the recommended item
    const recommendedItem = this.recommendedItems.find(item => item.id === itemId);
    if (!recommendedItem) {
      console.error('[DEBUG] Recommended item not found:', itemId);
      this.showNotification('Item not found', 'error');
      return;
    }

    // Check if item already exists in cart
    const existingItem = this.cartItems.find((item) => item.id === itemId);
    if (existingItem) {
      console.log('[DEBUG] Item already in cart, updating quantity');
      await this.updateQuantityDirect(itemId, existingItem.quantity + 1);
      this.showNotification(`${existingItem.name} quantity updated`, "success");
      return;
    }

    try {
      console.log('[DEBUG] Adding new item to cart:', recommendedItem);
      
      // Add to local cart first
      const newCartItem = {
        id: recommendedItem.id,
        name: recommendedItem.name,
        description: recommendedItem.description || '',
        price: recommendedItem.price,
        quantity: 1,
        image: recommendedItem.image,
        sku: `SKU-${recommendedItem.id}`,
        features: ['Handcrafted', 'Premium Quality'],
        badge: null,
        availability: 'in-stock',
        maxQuantity: 10,
        cart_id: `local_${Date.now()}_${recommendedItem.id}`
      };
      
      this.cartItems.push(newCartItem);
      console.log('[DEBUG] Added to local cart:', newCartItem);
      
      // Try to save to database
      const response = await fetch('cart.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'add_to_cart',
          product_id: itemId,
          quantity: 1
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (!result.success) {
          console.warn('Database add failed, but local cart updated:', result.error);
        }
      } else {
        console.warn('Database add failed, but local cart updated');
      }
      
      // Update both cart page and sidebar
      this.forceSyncCart();
      
      this.showNotification(`${recommendedItem.name} added to cart`, "success");
      console.log('[DEBUG] Item successfully added to cart');
      
    } catch (error) {
      console.error('Error adding item to cart:', error);
      this.showNotification('Failed to add item to cart', 'error');
    }
  }

  // Clear all cart items
  async clearCart() {
    try {
      // Clear local cart first
      this.cartItems = [];
      
      // Clear database
          const response = await fetch('cart.php', {
        method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
          action: 'clear_cart'
            })
          });
          
      if (response.ok) {
        const result = await response.json();
        if (!result.success) {
          console.warn('Database clear failed:', result.error);
        }
      } else {
        console.warn('Database clear failed');
      }

      // Update both cart page and sidebar
      this.forceSyncCart();
      
      this.showNotification('Cart cleared successfully', 'success');
      } catch (error) {
        console.error('Error clearing cart:', error);
        this.showNotification('Failed to clear cart', 'error');
    }
  }

  // Update insurance
  updateInsurance(enabled) {
    if (enabled) {
      this.insurance = Math.round(this.subtotal * 0.01); // 1% of subtotal
    } else {
      this.insurance = 0;
    }

    this.calculateTotals();
    this.showNotification(enabled ? "Insurance coverage added" : "Insurance coverage removed", "success");
  }

  // Apply promo code
  applyPromoCode() {
    const promoInput = document.getElementById("promoInput");
    const promoMessage = document.getElementById("promoMessage");

    if (!promoInput || !promoMessage) return;

    const code = promoInput.value.trim().toUpperCase();

    if (!code) {
      this.showPromoMessage("Please enter a promo code", "error");
      return;
    }

    if (this.appliedPromoCode === code) {
      this.showPromoMessage("This promo code is already applied", "error");
      return;
    }

    const promoData = this.validPromoCodes[code];
    if (!promoData) {
      this.showPromoMessage("Invalid promo code", "error");
      return;
    }

    // Apply promo code
    this.appliedPromoCode = code;
    if (promoData.type === "percentage") {
      this.promoDiscount = this.subtotal * promoData.discount;
    } else {
      this.promoDiscount = promoData.discount;
    }

    this.calculateTotals();
    this.showPromoMessage(`${promoData.description} applied!`, "success");
    promoInput.value = "";
    this.showNotification(`Promo code ${code} applied successfully!`, "success");
  }

  // Show promo message
  showPromoMessage(message, type) {
    const promoMessage = document.getElementById("promoMessage");
    if (!promoMessage) return;

    promoMessage.textContent = message;
    promoMessage.className = `promo-message ${type}`;
    promoMessage.style.display = "block";

    setTimeout(() => {
      promoMessage.style.display = "none";
    }, 5000);
  }

  // Calculate totals
  calculateTotals() {
    this.subtotal = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    // Make total equal to subtotal (no additional charges)
    this.total = this.subtotal;
    this.updateTotalsDisplay();
    // Update sidebar totals
    this.renderCartSidebar();
  }

  updateTotalsDisplay() {
    const subtotalElement = document.getElementById("subtotalAmount");
    const totalElement = document.getElementById("totalAmount");
    
    if (subtotalElement) {
      subtotalElement.textContent = `$${this.formatPrice(this.subtotal)}`;
    }
    
    if (totalElement) {
      totalElement.textContent = `$${this.formatPrice(this.total)}`;
    }
  }

  updateBadges() {
    const cartBadge = document.getElementById("cartBadge");
    const wishlistBadge = document.getElementById("wishlistBadge");
    const itemCount = document.getElementById("itemCount");
    
    const totalItems = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    console.log('[DEBUG] updateBadges - cartItems:', this.cartItems);
    console.log('[DEBUG] updateBadges - totalItems:', totalItems);
    
    if (cartBadge) {
      cartBadge.textContent = totalItems;
      cartBadge.style.display = totalItems > 0 ? "flex" : "none";
      console.log('[DEBUG] Updated cart badge to:', totalItems);
    }
    
    if (wishlistBadge) {
      const wishlist = this.loadFromStorage('egyptianWishlist') || [];
      console.log('[DEBUG] updateBadges - wishlist from localStorage:', wishlist);
      console.log('[DEBUG] updateBadges - wishlist length:', wishlist.length);
      
      // Clear wishlist if it's empty or invalid
      if (!Array.isArray(wishlist) || wishlist.length === 0) {
        this.saveToStorage('egyptianWishlist', []);
        wishlistBadge.textContent = '0';
        wishlistBadge.style.display = 'none';
        console.log('[DEBUG] Cleared wishlist badge - no items');
      } else {
        wishlistBadge.textContent = wishlist.length;
        wishlistBadge.style.display = wishlist.length > 0 ? "flex" : "none";
        console.log('[DEBUG] Updated wishlist badge to:', wishlist.length);
      }
    }
    
    if (itemCount) {
      itemCount.textContent = totalItems;
      console.log('[DEBUG] Updated item count to:', totalItems);
    }
    
    // Update sidebar badges
    this.renderCartSidebar();
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

  // Open checkout modal
  openCheckoutModal() {
    if (this.cartItems.length === 0) {
      this.showNotification("Your cart is empty", "warning");
      return;
    }

    const modal = document.getElementById("checkoutModal");
    if (!modal) return;

    this.currentStep = 1;
    this.updateCheckoutStep();
    this.populateOrderReview();

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  // Close checkout modal
  closeCheckoutModal() {
    const modal = document.getElementById("checkoutModal");
    if (!modal) return;

    modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  // Next checkout step
  nextStep() {
    if (this.currentStep >= 3) return;

    if (!this.validateCurrentStep()) return;

    this.currentStep++;
    this.updateCheckoutStep();
  }

  // Previous checkout step
  prevStep() {
    if (this.currentStep <= 1) return;

    this.currentStep--;
    this.updateCheckoutStep();
  }

  // Validate current step
  validateCurrentStep() {
    const currentStepContent = document.getElementById(`step${this.currentStep}`);
    if (!currentStepContent) return true;

    const requiredInputs = currentStepContent.querySelectorAll("input[required], select[required]");
    let isValid = true;

    requiredInputs.forEach((input) => {
      if (!input.value.trim()) {
        input.style.borderColor = "#ef4444";
        isValid = false;

        setTimeout(() => {
          input.style.borderColor = "";
        }, 3000);
      }
    });

    if (!isValid) {
      this.showNotification("Please fill in all required fields", "error");
    }

    return isValid;
  }

  // Update checkout step
  updateCheckoutStep() {
    // Update step indicators
    const steps = document.querySelectorAll(".step");
    steps.forEach((step, index) => {
      if (index + 1 <= this.currentStep) {
        step.classList.add("active");
      } else {
        step.classList.remove("active");
      }
    });

    // Update step content
    const stepContents = document.querySelectorAll(".step-content");
    stepContents.forEach((content, index) => {
      if (index + 1 === this.currentStep) {
        content.classList.add("active");
      } else {
        content.classList.remove("active");
      }
    });

    // Update buttons
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const placeOrderBtn = document.getElementById("placeOrderBtn");

    if (prevBtn) prevBtn.style.display = this.currentStep > 1 ? "inline-flex" : "none";
    if (nextBtn) nextBtn.style.display = this.currentStep < 3 ? "inline-flex" : "none";
    if (placeOrderBtn) placeOrderBtn.style.display = this.currentStep === 3 ? "inline-flex" : "none";
  }

  // Populate order review
  populateOrderReview() {
    const reviewItems = document.getElementById("reviewItems");
    const reviewSummary = document.getElementById("reviewSummary");

    if (reviewItems) {
      reviewItems.innerHTML = this.cartItems
        .map(
          (item) => `
                <div class="review-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="review-details">
                        <h5>${item.name}</h5>
                        <span>Qty: ${item.quantity}</span>
                    </div>
                    <div class="review-price">$${this.formatPrice(item.price * item.quantity)}</div>
                </div>
            `,
        )
        .join("");
    }

    if (reviewSummary) {
      reviewSummary.innerHTML = `
                <div class="summary-line">
                    <span>Subtotal:</span>
                    <span>$${this.formatPrice(this.subtotal)}</span>
                </div>
                ${
                  this.promoDiscount > 0
                    ? `
                    <div class="summary-line" style="color: #10b981;">
                        <span>Promo Discount:</span>
                        <span>-$${this.formatPrice(this.promoDiscount)}</span>
                    </div>
                `
                    : ""
                }
                <div class="summary-divider"></div>
                <div class="summary-line total-line">
                    <span>Total:</span>
                    <span>$${this.formatPrice(this.total)}</span>
                </div>
            `;
    }
  }

  // Place order
  placeOrder() {
    if (!this.validateCurrentStep()) return;

    const placeOrderBtn = document.getElementById("placeOrderBtn");
    if (placeOrderBtn) {
      placeOrderBtn.textContent = "Processing...";
      placeOrderBtn.disabled = true;
    }

    // Simulate order processing
    setTimeout(() => {
      this.showNotification("Order placed successfully! 🎉", "success");
      this.cartItems = [];
      this.appliedPromoCode = null;
      this.promoDiscount = 0;
      this.saveCartData();
      this.closeCheckoutModal();

      setTimeout(() => {
        this.renderCart();
        this.calculateTotals();
        this.updateBadges();
      }, 500);

      if (placeOrderBtn) {
        placeOrderBtn.textContent = "Place Order";
        placeOrderBtn.disabled = false;
      }
    }, 2000);
  }

  // Show notification
  showNotification(message, type = "info", duration = 4000) {
    const container = document.getElementById("notificationContainer");
    if (!container) return;

    const notification = document.createElement("div");
    notification.className = `notification ${type}`;

    const iconMap = {
      success: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22,4 12,14.01 9,11.01"></polyline>',
      error: '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>',
      info: '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>',
      warning: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>'
    };

    notification.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                ${iconMap[type] || iconMap.info}
            </svg>
            <span>${message}</span>
        `;

    container.appendChild(notification);

    // Show notification with animation
    setTimeout(() => {
      notification.classList.add("show");
    }, 100);

    // Auto remove
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 500);
    }, duration);
  }

  // Format price
  formatPrice(price) {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }

  // Force sync cart page and sidebar
  forceSyncCart() {
    console.log('[DEBUG] Force syncing cart page and sidebar');
    console.log('[DEBUG] Current cart items:', this.cartItems);
    
    // Update both cart page and sidebar
    this.renderCart();
    this.renderCartSidebar();
    this.calculateTotals();
    this.updateBadges();
    
    console.log('[DEBUG] Cart sync completed');
  }

  // Render wishlist sidebar
  renderWishlistSidebar() {
    const wishlist = this.loadFromStorage('egyptianWishlist') || [];
    const wishlistSidebar = document.getElementById('wishlistSidebar');
    const wishlistItems = document.getElementById('wishlistItems');
    const wishlistEmpty = document.getElementById('wishlistEmpty');
    const wishlistFooter = document.getElementById('wishlistFooter');
    if (!wishlistSidebar || !wishlistItems || !wishlistEmpty || !wishlistFooter) return;
    if (wishlist.length === 0) {
      wishlistEmpty.style.display = 'block';
      wishlistItems.style.display = 'none';
      wishlistFooter.style.display = 'none';
    } else {
      wishlistEmpty.style.display = 'none';
      wishlistItems.style.display = 'block';
      wishlistFooter.style.display = 'block';
      wishlistItems.innerHTML = wishlist.map(item => `
        <div class="wishlist-item">
          <img src="${item.image}" alt="${item.name}" class="wishlist-item-image">
          <div class="wishlist-item-details">
            <h4 class="wishlist-item-title">${item.name}</h4>
            <div class="wishlist-item-price">$${item.price.toLocaleString()}</div>
          </div>
          <button class="wishlist-item-remove" onclick="window.cartManager.removeFromWishlist(${item.id})" title="Remove from wishlist">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>
      `).join('');
    }
  }

  // Render cart sidebar
  renderCartSidebar() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartItems = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartFooter = document.getElementById('cartFooter');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartSidebar || !cartItems || !cartEmpty || !cartFooter) {
      console.log('[DEBUG] Cart sidebar elements not found');
      return;
    }
    
    console.log('[DEBUG] renderCartSidebar: cartItems.length =', this.cartItems.length);
    console.log('[DEBUG] Cart items in sidebar:', this.cartItems);
    
    if (this.cartItems.length === 0) {
      cartEmpty.style.display = 'block';
      cartItems.style.display = 'none';
      cartFooter.style.display = 'none';
      console.log('[DEBUG] Cart sidebar showing empty state');
    } else {
      cartEmpty.style.display = 'none';
      cartItems.style.display = 'block';
      cartFooter.style.display = 'block';
      
      // Use the EXACT same items as the main cart page
      cartItems.innerHTML = this.cartItems.map(item => `
        <div class="cart-item" data-item-id="${item.id}">
          <img src="${item.image}" alt="${item.name}" class="cart-item-image">
          <div class="cart-item-details">
            <h4 class="cart-item-title">${item.name}</h4>
            <div class="cart-item-price">$${this.formatPrice(item.price)}</div>
            <div class="cart-item-quantity">Qty: ${item.quantity}</div>
            <div class="cart-item-total">Total: $${this.formatPrice(item.price * item.quantity)}</div>
          </div>
          <button class="cart-item-remove" onclick="window.cartManager.removeItem(${item.id})" title="Remove from cart">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
              <polyline points="3,6 5,6 21,6"></polyline>
              <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1 2-2h4a2,2 0 0,1 2,2v2"></path>
            </svg>
          </button>
        </div>
      `).join('');
      
      // Update sidebar totals using the same calculation as main cart
      if (cartSubtotal) {
        cartSubtotal.textContent = `$${this.formatPrice(this.subtotal)}`;
      }
      if (cartTotal) {
        cartTotal.textContent = `$${this.formatPrice(this.total)}`;
      }
    }
    
    // Update cart badge count
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
      const totalItems = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
      cartBadge.textContent = totalItems;
      console.log('[DEBUG] Cart badge updated to:', totalItems);
    }
    
    console.log('[DEBUG] Cart sidebar updated with', this.cartItems.length, 'items');
  }
}

// Initialize cart when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("🏺 Egyptian Luxury Cart - Starting...");

  const cart = new EgyptianLuxuryCart();
  cart.init();
  
  // Make cart manager globally accessible
  window.cartManager = cart;

  // Global error handler
  window.addEventListener("error", (e) => {
    console.error("Global error:", e.error);
    if (cart && typeof cart.showNotification === "function") {
      cart.showNotification("An unexpected error occurred", "error");
    }
  });

  // Handle escape key for closing modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // Close active modals
      document.querySelectorAll('.modal.active').forEach(modal => {
        cart?.closeModal(modal.id);
      });
    }
  });

  // Save data before page unload
  window.addEventListener('beforeunload', () => {
    cart?.saveCartData();
  });
  
  // Ensure cart sidebar is connected to cart page
  setTimeout(() => {
    cart.forceSyncCart();
    console.log('[DEBUG] Cart sidebar connected to cart page');
  }, 500);
});

// Global function to add items to cart (for use from other pages)
window.addToCart = function(productData) {
  if (window.cartManager) {
    const result = window.cartManager.addToCart(productData);
    // Sync cart sidebar after adding item
    setTimeout(() => {
      window.cartManager.forceSyncCart();
    }, 100);
    return result;
  } else {
    console.error('Cart manager not initialized');
    return false;
  }
};

// Global function to get cart items (for use from other pages)
window.getCartItems = function() {
  if (window.cartManager) {
    return window.cartManager.cartItems;
  } else {
    return [];
  }
};

// Global function to update cart display (for use from other pages)
window.updateCartDisplay = function() {
  if (window.cartManager) {
    window.cartManager.forceSyncCart();
  }
};

// Global function to sync cart sidebar
window.syncCartSidebar = function() {
  if (window.cartManager) {
    window.cartManager.forceSyncCart();
  }
};

// Export for potential module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = EgyptianLuxuryCart;
}

console.log('🏺 Egyptian Creativity - Enhanced luxury cart script with index page animations loaded successfully!');