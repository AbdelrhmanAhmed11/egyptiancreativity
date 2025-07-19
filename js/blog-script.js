// Egyptian Creativity Blog - Enhanced JavaScript

// Global Variables
let currentFilter = 'all';
let currentShowcaseItem = 0;
let displayedArticles = 6;
let filteredArticles = [];

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
    initializeCart();
    initializeWishlist();
    initializeNewsletter();
    ensureSidebarsClosed();
    initializeBlogPagination();
    
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
    
    // Search suggestions
    const suggestions = document.querySelectorAll('.suggestion-item');
    suggestions.forEach(suggestion => {
        suggestion.addEventListener('click', () => {
            const query = suggestion.textContent.trim();
            searchModal.classList.remove('active');
            if (query) {
                window.location.href = 'shop.php?search=' + encodeURIComponent(query);
            }
        });
    });
    
    // Enter key in search input
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                searchModal.classList.remove('active');
                if (query) {
                    window.location.href = 'shop.php?search=' + encodeURIComponent(query);
                }
            }
        });
    }
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

function initializeBlogPagination() {
    const articlesGrid = document.getElementById('articlesGrid');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (!articlesGrid || !loadMoreBtn) return;
    const allBlogs = JSON.parse(articlesGrid.getAttribute('data-all-blogs') || '[]');
    let shown = articlesGrid.querySelectorAll('.article-card').length;
    const perPage = 6;
    loadMoreBtn.addEventListener('click', function() {
        const nextBlogs = allBlogs.slice(shown, shown + perPage);
        nextBlogs.forEach(post => {
            const article = document.createElement('article');
            article.className = 'article-card';
            article.setAttribute('data-id', post.id);
            article.innerHTML = `
                <div class="card-image">
                    <img src="${post.image ? post.image : 'images/blogs/placeholder.jpg'}" alt="${escapeHtml(post.title)}" loading="lazy">
                    <div class="card-overlay"></div>
                </div>
                <div class="card-content">
                    <div class="card-meta">
                        <span class="card-date">${post.published_at ? formatDate(post.published_at) : formatDate(post.created_at)}</span>
                        <span class="card-author">By ${escapeHtml(post.author || '-')}</span>
                    </div>
                    <h3 class="card-title">${escapeHtml(post.title)}</h3>
                    <p class="card-excerpt">${escapeHtml(post.excerpt)}</p>
                    <a href="blog-details.php?id=${post.id}" class="card-link">
                        <span>Read More</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12,5 19,12 12,19"></polyline>
                        </svg>
                    </a>
                </div>
            `;
            articlesGrid.appendChild(article);
        });
        shown += nextBlogs.length;
        if (shown >= allBlogs.length) {
            loadMoreBtn.style.display = 'none';
        }
    });
    if (shown >= allBlogs.length) {
        loadMoreBtn.style.display = 'none';
    }
}
function escapeHtml(text) {
    return text.replace(/[&<>'"]/g, function(c) {
        return {'&':'&amp;','<':'&lt;','>':'&gt;','\'':'&#39;','"':'&quot;'}[c];
    });
}
function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}