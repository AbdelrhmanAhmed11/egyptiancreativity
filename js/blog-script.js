// Egyptian Creativity Blog - Enhanced JavaScript

// Global Variables
let currentFilter = 'all';
let currentShowcaseItem = 0;
let displayedArticles = 6;
let filteredArticles = [];

// Blog Data
const blogData = [
    {
        id: 1,
        title: "The Senet Games of King Tutankhamun",
        category: "history artifacts",
        excerpt: "King Tutankhamun was buried with no fewer than five senet game boxes. Senet was an ancient Egyptian board game popular with all classes. Archaeological evidence reveals that senet was played by both royalty and commoners, and it was believed to have spiritual significance in the afterlife.",
        image: "images/1-7-scaled.jpg",
        author: "Admin",
        readTime: "3 min read",
        date: "April 15, 2025"
    },
    {
        id: 2,
        title: "The Road of Rams",
        category: "history culture",
        excerpt: "The Sphinx Avenue (the Rams Road) is a royal avenue that connects the Karnak Temple in the north with the Luxor Temple in the south. It was established for the purpose of witnessing the annual celebrations and religious processions in ancient Thebes.",
        image: "images/10.jpg",
        author: "Admin",
        readTime: "4 min read",
        date: "April 12, 2025"
    },
    {
        id: 3,
        title: "The Queens of Ancient Egypt",
        category: "royalty history",
        excerpt: "Ancient Egypt was home to numerous powerful and influential queens who left an indelible mark on the land of the pharaohs. From the Old Kingdom to the New Kingdom, these queens held significant roles in Egyptian society, politics, and religion.",
        image: "images/4-5-scaled.jpg",
        author: "Admin",
        readTime: "6 min read",
        date: "April 10, 2025"
    },
    {
        id: 4,
        title: "Queen Nefertiti: The Beautiful One",
        category: "royalty history",
        excerpt: "Queen Nefertiti, whose name means 'the beautiful one has come,' was the wife of King Amenhotep IV, the famous pharaoh of the Eighteenth Dynasty, and the protector of Tutankhamun. Her legacy endures through her iconic bust and her influence on Egyptian art and culture.",
        image: "images/5-1.jpg",
        author: "Admin",
        readTime: "5 min read",
        date: "April 8, 2025"
    },
    {
        id: 5,
        title: "Sandals of Tutankhamun",
        category: "artifacts royalty",
        excerpt: "Among the many treasures found in Tutankhamun's tomb were his golden sandals. These exquisite pieces of footwear were crafted with incredible detail, featuring golden straps and soles, and were intended to accompany the young king into the afterlife.",
        image: "images/5-3.jpg",
        author: "Admin",
        readTime: "4 min read",
        date: "April 5, 2025"
    },
    {
        id: 6,
        title: "Heka and the Hammer Nakakha",
        category: "mythology culture",
        excerpt: "The stick (Heka) and the hammer (Nakakha) were originally attributes of the ancient Egyptian god. The shepherd's stick symbolized royalty and the hammer symbolized the fertility of the land and power...",
        image: "images/9-1.jpg",
        author: "Admin",
        readTime: "4 min read",
        date: "April 3, 2025"
    }
];

// Showcase items for hero section
const showcaseItems = [
    {
        title: "The Queens of Ancient Egypt",
        description: "Legacies of Power and Beauty",
        category: "Featured Article",
        image: "images/5-1.jpg"
    },
    {
        title: "Sacred Artifacts Treasury",
        description: "Divine objects from ancient temples",
        category: "Artifacts Collection",
        image: "images/1-7-scaled.jpg"
    },
    {
        title: "Royal Mythology",
        description: "Stories of gods and pharaohs",
        category: "Mythology Collection",
        image: "images/9-1.jpg"
    }
];

// DOM Elements
const loadingOverlay = document.getElementById('loadingOverlay');
const header = document.getElementById('header');
const searchBtn = document.getElementById('searchBtn');
const searchModal = document.getElementById('searchModal');
const searchClose = document.getElementById('searchClose');
const searchInput = document.getElementById('searchInput');
const userBtn = document.getElementById('userBtn');
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const cartClose = document.getElementById('cartClose');
const wishlistBtn = document.getElementById('wishlistBtn');
const wishlistSidebar = document.getElementById('wishlistSidebar');
const wishlistClose = document.getElementById('wishlistClose');
const filterButtons = document.querySelectorAll('.filter-btn');
const articlesGrid = document.getElementById('articlesGrid');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const newsletterForm = document.getElementById('newsletterForm');
const notificationContainer = document.getElementById('notificationContainer');

// Initialize Website
document.addEventListener('DOMContentLoaded', function() {
    initializeLoading();
    initializeNavigation();
    initializeHero();
    initializeSearch();
    initializeFilters();
    initializeArticles();
    initializeCart();
    initializeWishlist();
    initializeNewsletter();
    ensureSidebarsClosed();
    
    console.log('🏺 Egyptian Creativity Blog initialized successfully!');
});

// Loading Screen
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
        if (!loadingOverlay.classList.contains('hidden')) {
            clearInterval(loadingInterval);
            hideLoading();
        }
    }, 4000);
}

function hideLoading() {
    if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
        document.body.style.overflow = 'auto';
        setTimeout(() => {
            animateBlogStats();
        }, 1000);
    } else {
        animateBlogStats();
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
    const categoriesBtn = document.getElementById('categoriesBtn');
    
    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            document.getElementById('articles').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
    
    if (categoriesBtn) {
        categoriesBtn.addEventListener('click', () => {
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
    
    // User button navigation
    if (userBtn) {
        userBtn.addEventListener('click', () => {
            // Check if user is logged in
            if (window.authManager && window.authManager.isAuthenticated()) {
                window.location.href = 'profile.html';
            } else {
                // Show login required message
                showNotification('You must login first to access your profile', 'error');
            }
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
    const blogSearchInput = document.getElementById('blogSearchInput');
    if (blogSearchInput) {
        let searchTimeout;
        blogSearchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchArticles(e.target.value);
            }, 500);
        });
    }
    
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchArticles(e.target.value);
                searchModal.classList.remove('active');
            }, 500);
        });
    }
    
    // Search suggestions
    const suggestions = document.querySelectorAll('.suggestion-item');
    suggestions.forEach(suggestion => {
        suggestion.addEventListener('click', () => {
            const query = suggestion.textContent;
            if (blogSearchInput) blogSearchInput.value = query;
            searchArticles(query);
            searchModal.classList.remove('active');
        });
    });
}

// Search function
function searchArticles(query) {
    const articlesGrid = document.getElementById('articlesGrid');
    if (!articlesGrid) return;
    const cards = articlesGrid.querySelectorAll('.article-card');
    const search = query.trim().toLowerCase();
    let found = 0;
    cards.forEach(card => {
        const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
        const excerpt = card.querySelector('.card-excerpt')?.textContent.toLowerCase() || '';
        const category = card.querySelector('.card-category')?.textContent.toLowerCase() || '';
        if (!search || title.includes(search) || excerpt.includes(search) || category.includes(search)) {
            card.style.display = '';
            found++;
        } else {
            card.style.display = 'none';
        }
    });
    showNotification(`Found ${found} articles matching "${query}"`, 'info');
}

// Filter functionality
function initializeFilters() {
    filteredArticles = [...blogData];
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            setFilter(filter);
        });
    });
}

function setFilter(filter) {
    currentFilter = filter;
    
    if (filter === 'all') {
        filteredArticles = [...blogData];
    } else {
        filteredArticles = blogData.filter(article => article.category.includes(filter));
    }
    
    displayedArticles = 6;
    
    // Update active button
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
    
    renderArticles();
}

// Articles functionality
function initializeArticles() {
    renderArticles();
    
    // Load more button
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            displayedArticles += 6;
            renderArticles();
            showNotification('Loaded more articles!', 'success');
        });
    }
}

// --- REMOVE/COMMENT OUT ALL JS THAT RENDERS ARTICLES TO #articlesGrid ---
// Comment out renderArticles and any code that fills articlesGrid with blogData
// function renderArticles() { ... }
// ...
// document.addEventListener('DOMContentLoaded', function() {
//   renderArticles();
//   ...
// });

// Cart functionality
function initializeCart() {
    if (cartBtn && cartSidebar) {
        cartBtn.addEventListener('click', () => {
            cartSidebar.classList.add('active');
            renderCart();
        });
    }
    
    if (cartClose && cartSidebar) {
        cartClose.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
        });
    }
}

// Wishlist functionality
function initializeWishlist() {
    if (wishlistBtn && wishlistSidebar) {
        wishlistBtn.addEventListener('click', () => {
            wishlistSidebar.classList.add('active');
            renderWishlist();
        });
    }
    
    if (wishlistClose && wishlistSidebar) {
        wishlistClose.addEventListener('click', () => {
            wishlistSidebar.classList.remove('active');
        });
    }
}

// Newsletter
function initializeNewsletter() {
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('.newsletter-input').value;
            
            if (email) {
                const submitBtn = newsletterForm.querySelector('.newsletter-btn');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<span>Subscribing...</span>';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    newsletterForm.reset();
                    showNotification('Thank you for subscribing to Egyptian Creativity!', 'success');
                }, 2000);
            }
        });
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

// Scroll to top functionality
function createScrollToTop() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="18,15 12,9 6,15"></polyline>
        </svg>
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize scroll to top after page load
window.addEventListener('load', createScrollToTop);

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    // Escape key for closing modals and sidebars
    if (e.key === 'Escape') {
        // Close search modal
        if (searchModal && searchModal.classList.contains('active')) {
            searchModal.classList.remove('active');
        }
        
        // Close cart sidebar
        if (cartSidebar && cartSidebar.classList.contains('active')) {
            cartSidebar.classList.remove('active');
        }
        
        // Close wishlist sidebar
        if (wishlistSidebar && wishlistSidebar.classList.contains('active')) {
            wishlistSidebar.classList.remove('active');
        }
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
document.querySelectorAll('.article-card, .featured-content, .filter-buttons').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Global functions for onclick handlers
window.changeShowcase = changeShowcase;

// Count-up animation for blog stats
function animateBlogStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const text = stat.textContent.trim();
        // Only animate numbers (e.g., 100+, 5K+), skip 'Weekly'
        if (/^[\d,.Kk\+]+$/.test(text)) {
            let finalValue = 0;
            let suffix = '';
            if (text.endsWith('K+')) {
                finalValue = parseInt(text) * 1000;
                suffix = 'K+';
            } else if (text.endsWith('+')) {
                finalValue = parseInt(text);
                suffix = '+';
            } else {
                finalValue = parseInt(text.replace(/\D/g, ''));
            }
            const duration = 4000;
            let start = 0;
            const step = Math.ceil(finalValue / (duration / 16));
            function update() {
                start += step;
                if (start >= finalValue) {
                    stat.textContent = suffix ? (finalValue / (suffix === 'K+' ? 1000 : 1)) + suffix : finalValue;
                } else {
                    stat.textContent = suffix ? (Math.floor(start / (suffix === 'K+' ? 1000 : 1))) + suffix : start;
                    requestAnimationFrame(update);
                }
            }
            stat.textContent = suffix ? (0 + suffix) : '0';
            requestAnimationFrame(update);
        }
    });
}

console.log('🏺 Egyptian Creativity Blog - Enhanced with matching index design loaded successfully!');

// Ensure all sidebars are closed by default
function ensureSidebarsClosed() {
  const sidebars = document.querySelectorAll('.sidebar');
  sidebars.forEach(sidebar => {
    sidebar.classList.remove('active');
  });
}