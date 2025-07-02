// Egyptian Creativity - About Page - Enhanced JavaScript with Same Background Animations as Index

// Global Variables
let currentStoryItem = 0;
let statsAnimated = false;

// Story Data for Hero Section
const storyItems = [
  {
    id: 1,
    title: "Master Craftsman",
    description: "Traditional techniques passed down through generations",
    badge: "Heritage",
    image: "images/4-5-scaled.jpg"
  },
  {
    id: 2,
    title: "Ancient Workshop",
    description: "Where history comes alive through skilled hands",
    badge: "Tradition",
    image: "images/5-1 (1).jpg"
  },
  {
    id: 3,
    title: "Timeless Artistry",
    description: "Creating masterpieces that honor pharaonic legacy",
    badge: "Excellence",
    image: "images/5-3.jpg"
  }
];

// Masterpieces Data for Greatest Works Section
const masterpiecesData = [
  {
    id: 1,
    title: "Golden Pharaoh Mask",
    description: "Replica of Tutankhamun's burial mask crafted with 24k gold leaf",
    price: "$2,500",
    image: "images/1-7-scaled.jpg"
  },
  {
    id: 2,
    title: "Sacred Canopic Jars",
    description: "Hand-carved limestone jars with hieroglyphic inscriptions",
    price: "$1,200",
    image: "images/10.jpg"
  },
  {
    id: 3,
    title: "Royal Ankh Pendant",
    description: "Sterling silver ankh symbol with precious gemstone inlays",
    price: "$850",
    image: "images/4-5-scaled.jpg"
  },
  {
    id: 4,
    title: "Egyptian Sphinx Statue",
    description: "Detailed bronze sculpture of the Great Sphinx of Giza",
    price: "$1,800",
    image: "images/5-1 (1).jpg"
  },
  {
    id: 5,
    title: "Hieroglyphic Papyrus",
    description: "Authentic papyrus scroll with hand-painted hieroglyphics",
    price: "$450",
    image: "images/5-1.jpg"
  },
  {
    id: 6,
    title: "Cleopatra's Mirror",
    description: "Ornate hand mirror inspired by Queen Cleopatra's beauty rituals",
    price: "$650",
    image: "images/5-3.jpg"
  },
  {
    id: 7,
    title: "Pharaoh's Scepter",
    description: "Royal scepter replica with intricate metalwork and gemstones",
    price: "$1,950",
    image: "images/9-1.jpg"
  },
  {
    id: 8,
    title: "Ancient Scarab Ring",
    description: "Gold ring featuring sacred scarab beetle design",
    price: "$750",
    image: "images/gift-box.jpg"
  }
];

// Values Data
const valuesData = [
  {
    icon: "star",
    title: "Authenticity",
    description: "Every piece is meticulously researched and crafted to reflect the true essence of ancient Egyptian artistry."
  },
  {
    icon: "heart",
    title: "Passion",
    description: "Our deep love for Egyptian heritage drives us to create pieces that honor ancient traditions."
  },
  {
    icon: "shield",
    title: "Quality",
    description: "We use only the finest materials and traditional techniques combined with modern precision."
  },
  {
    icon: "globe",
    title: "Heritage",
    description: "Preserving and sharing the rich cultural heritage of ancient Egypt with the modern world."
  },
  {
    icon: "zap",
    title: "Innovation",
    description: "Blending ancient techniques with modern precision to create timeless contemporary pieces."
  },
  {
    icon: "users",
    title: "Community",
    description: "Building a global community of enthusiasts who appreciate Egyptian craftsmanship."
  }
];

// Team Data
const teamData = [
  {
    id: 1,
    name: "Ahmed Hassan",
    role: "Master Artisan & Founder",
    bio: "With over 25 years of experience in ancient Egyptian craftsmanship, Ahmed founded Egyptian Creativity with a vision to preserve and share the magnificent heritage of ancient Egypt.",
    avatar: "AH"
  },
  {
    id: 2,
    name: "Fatima Al-Zahra",
    role: "Design Director",
    bio: "A graduate of Cairo's prestigious School of Fine Arts, Fatima brings contemporary design sensibilities to ancient Egyptian motifs, ensuring each piece resonates with modern collectors.",
    avatar: "FA"
  }
];

// DOM Elements
const loadingOverlay = document.getElementById('loadingOverlay');
const header = document.getElementById('header');
const notificationContainer = document.getElementById('notificationContainer');

// Initialize Website
document.addEventListener('DOMContentLoaded', function() {
  initializeLoading();
  initializeNavigation();
  initializeHero();
  initializeContent();
  initializeSearchModal();
  initializeScrollAnimations();
  initializeSidebars();
  updateCartBadge();
  updateWishlistBadge();
  ensureSidebarsClosed();
  
  console.log('🏺 Egyptian Creativity About page with Index animations initialized successfully!');
});

// Initialize loading animation
function initializeLoading() {
  let progress = 0;
  const progressBar = document.querySelector('.progress-bar');
  const skipBtn = document.getElementById('skipBtn');
  
  const loadingInterval = setInterval(() => {
    progress += Math.random() * 15 + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadingInterval);
      setTimeout(hideLoading, 800);
    }
    if (progressBar) {
      progressBar.style.width = progress + '%';
    }
  }, 150);
  
  // Skip button
  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      clearInterval(loadingInterval);
      hideLoading();
    });
  }
  
  // Auto hide after 4 seconds
  setTimeout(() => {
    if (loadingOverlay && !loadingOverlay.classList.contains('hidden')) {
      clearInterval(loadingInterval);
      hideLoading();
    }
  }, 4000);
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
    
    // Trigger stats animation when hero section is in view
    if (!statsAnimated && currentScrollY > 50) {
      animateStats();
      statsAnimated = true;
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

// Animate Statistics with Count-Up Effect
function animateStats() {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  statNumbers.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-target'));
    const increment = target / 100; // Divide by number of steps
    let current = 0;
    
    const updateCount = () => {
      if (current < target) {
        current += increment;
        if (target === 1000) {
          stat.textContent = Math.floor(current) + '+';
        } else if (target === 25) {
          stat.textContent = Math.floor(current) + '+';
        } else if (target === 500) {
          stat.textContent = Math.floor(current) + '+';
        }
        
        // Add golden glow effect during animation
        stat.style.textShadow = '0 0 30px rgba(255, 215, 0, 0.8)';
        stat.style.transform = 'scale(1.05)';
        
        setTimeout(updateCount, 30); // Smooth animation speed
      } else {
        // Final values
        if (target === 1000) {
          stat.textContent = '1000+';
        } else if (target === 25) {
          stat.textContent = '25+';
        } else if (target === 500) {
          stat.textContent = '500+';
        }
        
        // Reset glow effect
        stat.style.textShadow = '0 0 20px rgba(255, 215, 0, 0.6)';
        stat.style.transform = 'scale(1)';
      }
    };
    
    updateCount();
  });
}

// Hero Section with Ultra-Smooth Story Transitions
function initializeHero() {
  // Auto-rotate story with smoother timing
  setInterval(() => {
    currentStoryItem = (currentStoryItem + 1) % storyItems.length;
    updateStory();
  }, 4000); // Smooth 4-second intervals
  
  // Update story display with enhanced smooth transitions
  function updateStory() {
    const story = storyItems[currentStoryItem];
    
    // Get all elements that need smooth transitions
    const storyImage = document.getElementById('storyImage');
    const storyTitle = document.getElementById('storyTitle');
    const storyDesc = document.getElementById('storyDesc');
    const storyBadge = document.getElementById('storyBadge');
    
    const elements = [storyImage, storyTitle, storyDesc, storyBadge];
    
    // Phase 1: Fade out with smooth opacity transition
    elements.forEach(element => {
      element.style.transition = 'opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      element.style.opacity = '0.3';
      element.style.transform = 'translateY(10px)';
    });
    
    // Phase 2: Update content and fade in
    setTimeout(() => {
      // Preload image for smoother transition
      const newImage = new Image();
      newImage.onload = () => {
        storyImage.src = story.image;
        storyTitle.textContent = story.title;
        storyDesc.textContent = story.description;
        storyBadge.textContent = story.badge;
        
        // Phase 3: Smooth fade in
        setTimeout(() => {
          elements.forEach(element => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
          });
        }, 50);
      };
      newImage.src = story.image;
    }, 400);
    
    // Update dots with smooth animation
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
      dot.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      if (index === currentStoryItem) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
}

// Story Controls with Ultra-Smooth Transitions
function changeStory(index) {
  currentStoryItem = index;
  const story = storyItems[currentStoryItem];
  
  // Enhanced smooth transition for manual control
  const storyImage = document.getElementById('storyImage');
  const storyTitle = document.getElementById('storyTitle');
  const storyDesc = document.getElementById('storyDesc');
  const storyBadge = document.getElementById('storyBadge');
  
  const elements = [storyImage, storyTitle, storyDesc, storyBadge];
  
  // Ultra-smooth manual transition
  elements.forEach(element => {
    element.style.transition = 'opacity 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    element.style.opacity = '0.4';
    element.style.transform = 'translateY(8px)';
  });
  
  setTimeout(() => {
    // Preload image for instant display
    const newImage = new Image();
    newImage.onload = () => {
      storyImage.src = story.image;
      storyTitle.textContent = story.title;
      storyDesc.textContent = story.description;
      storyBadge.textContent = story.badge;
      
      setTimeout(() => {
        elements.forEach(element => {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        });
      }, 30);
    };
    newImage.src = story.image;
  }, 300);
  
  // Update dots with enhanced animation
  const dots = document.querySelectorAll('.dot');
  dots.forEach((dot, i) => {
    dot.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    if (i === index) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

// Initialize Content Sections
function initializeContent() {
  renderMasterpieces();
  renderValues();
  renderTeam();
  initializeScrollAnimations();
}

// Render Masterpieces Section with Auto-Scroll
function renderMasterpieces() {
  const masterpiecesCarousel = document.getElementById('masterpiecesCarousel');
  if (!masterpiecesCarousel) return;

  // Double the array for seamless infinite scroll
  const extendedMasterpieces = [...masterpiecesData, ...masterpiecesData];

  const masterpiecesHTML = `
    <div class="masterpieces-track">
      ${extendedMasterpieces.map(masterpiece => `
        <div class="masterpiece-card">
          <div class="masterpiece-image">
            <img src="${masterpiece.image}" alt="${masterpiece.title}" loading="lazy">
            <div class="masterpiece-overlay"></div>
          </div>
          <div class="masterpiece-info">
            <h3 class="masterpiece-title">${masterpiece.title}</h3>
            <p class="masterpiece-description">${masterpiece.description}</p>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  masterpiecesCarousel.innerHTML = masterpiecesHTML;

  // Pause animation on hover
  const track = masterpiecesCarousel.querySelector('.masterpieces-track');
  track.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });
  
  track.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });
}

// Render Values Section
function renderValues() {
  const valuesGrid = document.getElementById('valuesGrid');
  if (!valuesGrid) return;

  valuesGrid.innerHTML = valuesData.map((value, index) => `
    <div class="value-card fade-in" style="animation-delay: ${index * 0.1}s;">
      <div class="value-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          ${getIconPath(value.icon)}
        </svg>
      </div>
      <h3 class="value-title">${value.title}</h3>
      <p class="value-description">${value.description}</p>
    </div>
  `).join('');
}

// Render Team Section
function renderTeam() {
  const teamGrid = document.getElementById('teamGrid');
  if (!teamGrid) return;

  teamGrid.innerHTML = teamData.map((member, index) => `
    <div class="team-card fade-in" style="animation-delay: ${index * 0.15}s;">
      <div class="team-avatar">${member.avatar}</div>
      <h3 class="team-name">${member.name}</h3>
      <p class="team-role">${member.role}</p>
      <p class="team-bio">${member.bio}</p>
    </div>
  `).join('');
}

// Get SVG icon paths
function getIconPath(iconName) {
  const icons = {
    star: '<polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>',
    heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>',
    globe: '<circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>',
    zap: '<polygon points="13,2 3,14 12,14 11,22 21,10 12,10"></polygon>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>'
  };
  return icons[iconName] || '';
}

// Initialize Scroll Animations
function initializeScrollAnimations() {
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
  document.querySelectorAll('.fade-in').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
  });
}

// Ensure all sidebars are closed by default
function ensureSidebarsClosed() {
  const sidebars = document.querySelectorAll('.sidebar');
  sidebars.forEach(sidebar => {
    sidebar.classList.remove('active');
  });
}

// Initialize Sidebars
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
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem('egyptianLuxuryCart')) || [];
  const badge = document.getElementById('cartBadge');
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  if (badge) {
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'flex' : 'none';
  }
}

function updateWishlistBadge() {
  const wishlist = JSON.parse(localStorage.getItem('egyptianWishlist')) || [];
  const badge = document.getElementById('wishlistBadge');
  if (badge) {
    badge.textContent = wishlist.length;
    badge.style.display = wishlist.length > 0 ? 'flex' : 'none';
  }
}

function renderCartSidebar() {
  const cart = JSON.parse(localStorage.getItem('egyptianLuxuryCart')) || [];
  const cartEmpty = document.getElementById('cartEmpty');
  const cartItems = document.getElementById('cartItems');
  const cartFooter = document.getElementById('cartFooter');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartTotal = document.getElementById('cartTotal');
  
  if (!cartEmpty || !cartItems || !cartFooter || !cartSubtotal || !cartTotal) return;
  
  if (cart.length === 0) {
    cartEmpty.style.display = 'block';
    cartItems.style.display = 'none';
    cartFooter.style.display = 'none';
    cartSubtotal.textContent = '$0';
    cartTotal.textContent = '$0';
  } else {
    cartEmpty.style.display = 'none';
    cartItems.style.display = 'block';
    cartFooter.style.display = 'block';
    
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-details">
          <h4 class="cart-item-title">${item.name}</h4>
          <div class="cart-item-price">${item.price} x ${item.quantity}</div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${item.id})" title="Remove item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3,6 5,6 21,6"></polyline>
            <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1 2-2h4a2,2 0 0,1 2,2v2"></path>
          </svg>
        </button>
      </div>
    `).join('');
    // Calculate subtotal and total
    let subtotal = 0;
    cart.forEach(item => {
      // Remove $ and commas from price, convert to number
      let price = 0;
      if (typeof item.price === 'string') {
        price = parseFloat(item.price.replace(/[$,]/g, ''));
      } else {
        price = item.price;
      }
      subtotal += price * (item.quantity || 1);
    });
    cartSubtotal.textContent = `$${subtotal.toLocaleString()}`;
    cartTotal.textContent = `$${subtotal.toLocaleString()}`;
  }
}

function renderWishlistSidebar() {
  const wishlist = JSON.parse(localStorage.getItem('egyptianWishlist')) || [];
  const wishlistEmpty = document.getElementById('wishlistEmpty');
  const wishlistItems = document.getElementById('wishlistItems');
  
  if (!wishlistEmpty || !wishlistItems) return;
  
  if (wishlist.length === 0) {
    wishlistEmpty.style.display = 'block';
    wishlistItems.style.display = 'none';
  } else {
    wishlistEmpty.style.display = 'none';
    wishlistItems.style.display = 'block';
    
    wishlistItems.innerHTML = wishlist.map(item => `
      <div class="wishlist-item">
        <img src="${item.image}" alt="${item.name}" class="wishlist-item-image">
        <div class="wishlist-item-details">
          <h4 class="wishlist-item-title">${item.name}</h4>
          <div class="wishlist-item-price">${item.price}</div>
        </div>
        <button class="wishlist-item-remove" onclick="removeFromWishlist(${item.id})" title="Remove from wishlist">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>
    `).join('');
  }
}

function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem('egyptianLuxuryCart')) || [];
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem('egyptianLuxuryCart', JSON.stringify(cart));
  updateCartBadge();
  renderCartSidebar();
  showNotification('Item removed from cart', 'info');
}

function removeFromWishlist(productId) {
  let wishlist = JSON.parse(localStorage.getItem('egyptianWishlist')) || [];
  wishlist = wishlist.filter(item => item.id !== productId);
  localStorage.setItem('egyptianWishlist', JSON.stringify(wishlist));
  updateWishlistBadge();
  renderWishlistSidebar();
  showNotification('Item removed from wishlist', 'info');
}

// Show notification
function showNotification(message, type = 'info') {
  const container = document.getElementById('notificationContainer');
  if (!container) return;

  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  container.appendChild(notification);
  
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

// Search Modal Logic
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
      if (searchInput) searchInput.value = suggestion.textContent;
      searchModal.classList.remove('active');
    });
  });
  
  // ESC key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchModal && searchModal.classList.contains('active')) {
      searchModal.classList.remove('active');
    }
  });
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
    updateCartBadge();
  }
  if (event.key === 'egyptianWishlist') {
    updateWishlistBadge();
  }
});

console.log('🏺 Egyptian Creativity - Enhanced About page with Index animations loaded successfully!');