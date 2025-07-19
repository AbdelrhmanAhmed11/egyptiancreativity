// Egyptian Creativity - Enhanced JavaScript with Version 1 Animations

// Global Variables
let cart = JSON.parse(localStorage.getItem('egyptianLuxuryCart')) || [];
if (cart.length === 0) {
    cart = [
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
    localStorage.setItem('egyptianLuxuryCart', JSON.stringify(cart));
}
let wishlist = JSON.parse(localStorage.getItem('egyptianWishlist')) || [];
let currentGallerySlide = 0;
let currentShowcaseItem = 0;
let statsAnimated = false;

// Product Data
const showcaseProducts = [
    {   
        id: 1,
        name: "Golden Pharaoh Mask",
        description: "Authentic 18th Dynasty ceremonial mask",
        price: "$12,500",
        image: "images/1-7-scaled.jpg"
    },
    {
        id: 2,
        name: "Sacred Scarab Amulet",
        description: "Lapis lazuli scarab with protective hieroglyphs",
        price: "$3,850",
        image: "images/4-5-scaled.jpg"
    },
    {
        id: 3,
        name: "Royal Canopic Jars",
        description: "Complete set of 4 alabaster jars with deity lids",
        price: "$8,900",
        image: "images/5-1 (1).jpg"
    }
];

const products = [
    {
        id: 1,
        name: "Golden Pharaoh Mask",
        category: "Pharaoh Masks",
        description: "Exquisite replica of the legendary burial mask",
        price: "$12,500",
        image: "images/1-7-scaled.jpg"
    },
    {
        id: 2,
        name: "Sacred Scarab Collection",
        category: "Sacred Jewelry",
        description: "Protective amulets with intricate designs",
        price: "$3,750",
        image: "images/4-5-scaled.jpg"
    },
    {
        id: 3,
        name: "Royal Canopic Jars",
        category: "Sacred Vessels",
        description: "Four vessels representing the sons of Horus",
        price: "$8,900",
        image: "images/5-1 (1).jpg"
    },
    {
        id: 4,
        name: "Ancient Ankh Pendant",
        category: "Sacred Jewelry",
        description: "Symbol of eternal life and divine power",
        price: "$2,850",
        image: "images/5-1.jpg"
    },
    {
        id: 5,
        name: "Cleopatra's Crown",
        category: "Royal Crowns",
        description: "Magnificent replica of the queen's crown",
        price: "$18,750",
        image: "images/5-3.jpg"
    },
    {
        id: 6,
        name: "Egyptian Jewelry Set",
        category: "Jewelry Sets",
        description: "Complete set of royal accessories",
        price: "$6,200",
        image: "images/9-1.jpg"
    }
];

const testimonials = [
    {
        id: 1,
        author: "Michael Harrison",
        location: "Art Collector, London",
        avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
        rating: 5,
        quote: "The attention to detail in every piece is extraordinary. My Golden Pharaoh Mask is the centerpiece of my collection and never fails to amaze guests.",
        icon: "𓂀"
    },
    {
        id: 2,
        author: "Sarah Chen",
        location: "Museum Director, New York",
        avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
        rating: 5,
        quote: "Egyptian Creativity delivers museum-quality pieces that transport you back to ancient times. The craftsmanship is simply unparalleled.",
        icon: "𓂀"
    },
    {
        id: 3,
        author: "James Rodriguez",
        location: "Private Collector, Miami",
        avatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
        rating: 5,
        quote: "After visiting Egypt, I wanted to bring a piece of that magic home. Egyptian Creativity made that dream a reality with their authentic artifacts.",
        icon: "𓂀"
    },
    {
        id: 4,
        author: "Dr. Emma Thompson",
        location: "Egyptologist, Oxford",
        avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
        rating: 5,
        quote: "The historical accuracy and artistic excellence of each piece reflects a deep respect for Egyptian heritage. Truly magnificent work.",
        icon: "𓂀"
    },
    {
        id: 5,
        author: "Li Wei",
        location: "Antiquities Enthusiast, Beijing",
        avatar: "https://images.pexels.com/photos/428364/pexels-photo-428364.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
        rating: 5,
        quote: "Every piece tells a story. The craftsmanship and attention to cultural details make these artifacts truly special and authentic.",
        icon: "𓂀"
    }
];

// Blog Data for Index Page (first 3 items)
const blogData = [
    {
        id: 1,
        title: "The Senet Games of King Tutankhamun",
        category: "History & Artifacts",
        excerpt: "King Tutankhamun was buried with no fewer than five senet game boxes. Explore the history of one of the world's oldest board games.",
        image: "images/1-7-scaled.jpg",
        author: "Admin",
        readTime: "3 min read",
        date: "April 15, 2025"
    },
    {
        id: 2,
        title: "The Road of Rams",
        category: "History & Culture",
        excerpt: "Discover the royal avenue that connects the Karnak Temple with the Luxor Temple, lined with hundreds of ram-headed sphinxes.",
        image: "images/10.jpg",
        author: "Admin",
        readTime: "4 min read",
        date: "April 12, 2025"
    },
    {
        id: 3,
        title: "The Queens of Ancient Egypt",
        category: "Royalty & History",
        excerpt: "Learn about the powerful and influential queens who left an indelible mark on the land of the pharaohs, from Hatshepsut to Nefertiti.",
        image: "images/4-5-scaled.jpg",
        author: "Admin",
        readTime: "6 min read",
        date: "April 10, 2025"
    }
];

// DOM Elements
const loadingScreen = document.getElementById('loadingScreen');
const header = document.getElementById('header');
const notificationContainer = document.getElementById('notificationContainer');

// Initialize Website
document.addEventListener('DOMContentLoaded', async function() {
    initializeLoading();
    initializeNavigation();
    if (document.getElementById('showcaseImage')) {
        initializeHero();
    }
    initializeCollection();
    initializeGallery();
    initializeNewsletter();
    updateCartBadge();
    updateWishlistBadge();
    if (window.sidebarManager && typeof window.sidebarManager.fetchCart === 'function') {
        await window.sidebarManager.fetchCart();
        window.sidebarManager.updateBadges();
    }
    initializeSearchModal();
    initializeStatsCounter();
    initializeTestimonials();
    // Remove the static blogData array and renderBlogSection function

    console.log('🏺 Egyptian Creativity website initialized successfully!');

    // Cart Sidebar: View Cart button
    const viewCartBtn = document.querySelector('#cartSidebar .cart-actions .btn.btn-outline');
    if (viewCartBtn) {
        viewCartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            closeSidebar(cartSidebar);
            setTimeout(() => {
                window.location.href = 'cart.html';
            }, 200);
        });
    }

    // Wishlist Sidebar: View Wishlist button
    const viewWishlistBtn = document.querySelector('#wishlistSidebar .cart-actions .btn.btn-outline');
    if (viewWishlistBtn) {
        viewWishlistBtn.addEventListener('click', function(e) {
            e.preventDefault();
            closeSidebar(wishlistSidebar);
            setTimeout(() => {
                window.location.href = 'wishlist.html';
            }, 200);
        });
    }
});

// Initialize loading animation (Unified)
function initializeLoading() {
    let progress = 0;
    const progressBar = document.querySelector('.progress-bar');
    const skipBtn = document.getElementById('skipBtn');
    const loadingOverlay = document.getElementById('loadingOverlay');

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
    const loadingOverlay = document.getElementById('loadingOverlay');
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

// Hero Section
function initializeHero() {
    // Auto-rotate showcase with enhanced animation
    setInterval(() => {
        currentShowcaseItem = (currentShowcaseItem + 1) % showcaseProducts.length;
        updateShowcaseWithAnimation();
    }, 6000); // Increased interval for better user experience

    // Update showcase display with smooth animation
    function updateShowcaseWithAnimation() {
        const product = showcaseProducts[currentShowcaseItem];
        const showcaseImage = document.getElementById('showcaseImage');
        const showcaseTitle = document.getElementById('showcaseTitle');
        const showcaseDesc = document.getElementById('showcaseDesc');

        // Add fade out effect
        showcaseImage.style.opacity = '0';
        showcaseTitle.style.opacity = '0';
        showcaseDesc.style.opacity = '0';

        setTimeout(() => {
            showcaseImage.src = product.image;
            showcaseTitle.textContent = product.name;
            showcaseDesc.textContent = product.description;

            // Fade in effect
            showcaseImage.style.opacity = '1';
            showcaseTitle.style.opacity = '1';
            showcaseDesc.style.opacity = '1';
        }, 300);

        // Update dots
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentShowcaseItem);
        });
    }

    // Hero buttons
    const exploreBtn = document.getElementById('exploreBtn');
    const learnBtn = document.getElementById('learnBtn');

    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            document.getElementById('collection').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    if (learnBtn) {
        learnBtn.addEventListener('click', () => {
            document.getElementById('about').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
}

// Stats Counter Animation
function initializeStatsCounter() {
    const statsSection = document.querySelector('.hero-stats');
    
    if (!statsSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                statsAnimated = true;
                animateStats();
            }
        });
    }, { threshold: 0.5 });

    observer.observe(statsSection);
}

function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                stat.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                stat.textContent = target + '+';
            }
        };

        // Add stagger effect
        const delay = Array.from(statNumbers).indexOf(stat) * 200;
        setTimeout(updateCounter, delay);
    });
}

// Collection Section
function initializeCollection() {
    const collectionGrid = document.getElementById('collectionGrid');

    if (collectionGrid) {
        // Render products
        products.forEach(product => {
            const productCard = createProductCard(product);
            collectionGrid.appendChild(productCard);
        });
    }
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'collection-item';
    card.innerHTML = `
        <div class="item-image">
            <img src="${product.image}" alt="${product.name}">
            <div class="item-overlay">
                <div class="overlay-content">
                    <h3>${product.name}</h3>
                    <p class="item-price">${product.price}</p>
                    <div class="item-actions">
                        <button class="action-btn add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
                        <button class="action-btn add-to-wishlist" onclick="toggleWishlist(${product.id})">♡</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="item-info">
            <span class="item-category">${product.category}</span>
            <h3 class="item-title">${product.name}</h3>
            <p class="item-description">${product.description}</p>
        </div>
    `;

    return card;
}

// Gallery
function initializeGallery() {
    const galleryTrack = document.getElementById('galleryTrack');
    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');
    const slides = document.querySelectorAll('.gallery-slide');

    if (!galleryTrack || slides.length === 0) return;

    function updateGallery() {
        const translateX = -currentGallerySlide * 100;
        galleryTrack.style.transform = `translateX(${translateX}%)`;
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentGallerySlide = currentGallerySlide > 0 ? currentGallerySlide - 1 : slides.length - 1;
            updateGallery();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentGallerySlide = (currentGallerySlide + 1) % slides.length;
            updateGallery();
        });
    }

    // Auto-advance gallery
    setInterval(() => {
        currentGallerySlide = (currentGallerySlide + 1) % slides.length;
        updateGallery();
    }, 6000);
}

// Testimonials
function initializeTestimonials() {
    const testimonialsTrack = document.getElementById('testimonialsTrack');
    if (!testimonialsTrack) return;

    // Duplicate testimonials for a seamless loop
    const allTestimonials = [...testimonials, ...testimonials];

    testimonialsTrack.innerHTML = allTestimonials.map(testimonial => {
        return `
            <div class="testimonial-card">
                <div class="testimonial-content">
                    <div class="quote-icon">${testimonial.icon}</div>
                    <p class="testimonial-text">"${testimonial.quote}"</p>
                    <div class="testimonial-author">
                        <div class="author-avatar">
                            <img src="${testimonial.avatar}" alt="${testimonial.author}">
                        </div>
                        <div class="author-info">
                            <h4>${testimonial.author}</h4>
                            <p>${testimonial.location}</p>
                            <div class="rating">
                                <span>${'★'.repeat(testimonial.rating)}${'☆'.repeat(5 - testimonial.rating)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Dynamically adjust animation duration
    const numTestimonials = testimonials.length;
    const animationDuration = numTestimonials * 5; // 5 seconds per testimonial
    testimonialsTrack.style.setProperty('--animation-duration', `${animationDuration}s`);
    
    // Pause animation on hover
    testimonialsTrack.addEventListener('mouseenter', () => {
        testimonialsTrack.style.animationPlayState = 'paused';
    });

    testimonialsTrack.addEventListener('mouseleave', () => {
        testimonialsTrack.style.animationPlayState = 'running';
    });
}

// Newsletter
function initializeNewsletter() {
    const newsletterForm = document.getElementById('newsletterForm');

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
    const product = showcaseProducts[currentShowcaseItem];
    const showcaseImage = document.getElementById('showcaseImage');
    const showcaseTitle = document.getElementById('showcaseTitle');
    const showcaseDesc = document.getElementById('showcaseDesc');

    // Smooth transition
    showcaseImage.style.opacity = '0';
    showcaseTitle.style.opacity = '0';
    showcaseDesc.style.opacity = '0';

    setTimeout(() => {
        showcaseImage.src = product.image;
        showcaseTitle.textContent = product.name;
        showcaseDesc.textContent = product.description;

        showcaseImage.style.opacity = '1';
        showcaseTitle.style.opacity = '1';
        showcaseDesc.style.opacity = '1';
    }, 200);

    // Update dots
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
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

        let data;
        try {
            data = await response.json();
        } catch (jsonError) {
            const text = await response.text();
            console.error('Server returned non-JSON for addToCart:', text);
            showNotification('Server error: ' + text, 'error');
            return;
        }

        if (data.success) {
            showNotification(data.message || 'Item added to cart!', 'success');
            updateCartBadge();
            renderCartSidebar();
        } else {
            showNotification(data.error || 'Failed to add to cart', 'error');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        showNotification('Error adding to cart', 'error');
    }
}

async function updateCartBadge() {
    try {
        const response = await fetch('cart.php?action=get_cart');
        const data = await response.json();
        
        if (data.success) {
            const badge = document.getElementById('cartBadge');
            const items = data.cart_items || [];
            const totalItems = items.reduce((sum, item) => sum + (parseInt(item.quantity) || 1), 0);
            if (badge) {
                badge.textContent = totalItems;
                if (totalItems > 0) {
                    badge.style.display = 'flex';
                    badge.style.visibility = 'visible';
                    badge.style.opacity = '1';
                } else {
                    badge.style.display = 'none';
                }
            }
        }
    } catch (error) {
        console.error('Error updating cart badge:', error);
    }
}

// Wishlist Functions
async function toggleWishlist(productId) {
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

        let data;
        try {
            data = await response.json();
        } catch (jsonError) {
            const text = await response.text();
            console.error('Server returned non-JSON for toggleWishlist:', text);
            showNotification('Server error: ' + text, 'error');
            return;
        }

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

async function updateWishlistBadge() {
    try {
        const response = await fetch('wishlist.php?action=get_wishlist');
        const data = await response.json();
        
        if (data.success) {
            const badge = document.getElementById('wishlistBadge');
            const items = data.wishlist || [];
            if (badge) {
                badge.textContent = items.length;
                if (items.length > 0) {
                    badge.style.display = 'flex';
                    badge.style.visibility = 'visible';
                    badge.style.opacity = '1';
                } else {
                    badge.style.display = 'none';
                }
            }
        }
    } catch (error) {
        console.error('Error updating wishlist badge:', error);
    }
}

// Notification System
function showNotification(message, type = 'info') {
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
    // Check if user is logged in
    if (window.authManager && window.authManager.isAuthenticated()) {
        window.location.href = 'profile.html';
    } else {
        // Show login required message
        showNotification('You must login first to access your profile', 'error');
    }
});

// Sidebar open/close logic for cart and wishlist
const cartSidebar = document.getElementById('cartSidebar');
const wishlistSidebar = document.getElementById('wishlistSidebar');
const cartBtn = document.getElementById('cartBtn');
const wishlistBtn = document.getElementById('wishlistBtn');
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
        renderCartSidebar();
        openSidebar(cartSidebar);
    });
}
if (wishlistBtn && wishlistSidebar) {
    wishlistBtn.addEventListener('click', () => {
        renderWishlistSidebar();
        openSidebar(wishlistSidebar);
    });
}
if (cartClose && cartSidebar) {
    cartClose.addEventListener('click', () => closeSidebar(cartSidebar));
}
if (wishlistClose && wishlistSidebar) {
    wishlistClose.addEventListener('click', () => closeSidebar(wishlistSidebar));
}

// Close sidebar when clicking outside content
document.addEventListener('mousedown', (e) => {
    if (cartSidebar && cartSidebar.classList.contains('active') &&
        !cartSidebar.querySelector('.sidebar-content').contains(e.target) &&
        !cartSidebar.querySelector('.sidebar-header').contains(e.target) &&
        !cartSidebar.querySelector('.sidebar-footer').contains(e.target)) {
        closeSidebar(cartSidebar);
    }
    if (wishlistSidebar && wishlistSidebar.classList.contains('active') &&
        !wishlistSidebar.querySelector('.sidebar-content').contains(e.target) &&
        !wishlistSidebar.querySelector('.sidebar-header').contains(e.target) &&
        !wishlistSidebar.querySelector('.sidebar-footer').contains(e.target)) {
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

// Search Modal Logic
const searchBtn = document.getElementById('searchBtn');
const searchModal = document.getElementById('searchModal');
const searchClose = document.getElementById('searchClose');
const searchInput = document.getElementById('searchInput');

function initializeSearchModal() {
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
            if (searchInput) {
                const query = suggestion.textContent.trim();
                searchModal.classList.remove('active');
                if (query) {
                    window.location.href = 'shop.php?search=' + encodeURIComponent(query);
                }
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
    // ESC key closes modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchModal.classList.contains('active')) {
            searchModal.classList.remove('active');
        }
    });
}

async function renderCartSidebar(itemsArg) {
    const cartEmpty = document.getElementById('cartEmpty');
    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');
    if (!cartEmpty || !cartItems || !cartFooter) return;
    let items = itemsArg;
    if (!Array.isArray(items)) items = [];
    // Patch: map product_id to id for guest/session cart
    items = items.map(item => {
        if (item && !item.id && item.product_id) {
            return { ...item, id: item.product_id };
        }
        return item;
    });
    try {
        if (!items || items.length === 0) {
            const response = await fetch('cart.php?action=get_cart');
            const data = await response.json();
            items = Array.isArray(data.cart) ? data.cart : [];
            // Patch: map product_id to id for guest/session cart
            items = items.map(item => {
                if (item && !item.id && item.product_id) {
                    return { ...item, id: item.product_id };
                }
                return item;
            });
        }
        // For guest/session cart, fetch product details if missing
        const needsDetails = items.some(item => !item.name || !item.price);
        if (needsDetails && items.length > 0) {
            // Fetch details for all items
            const ids = items.map(item => item.product_id || item.id).filter(Boolean);
            const detailsResp = await fetch('cart.php?action=get_products&ids=' + ids.join(','));
            const detailsData = await detailsResp.json();
            const detailsMap = {};
            (detailsData.products || []).forEach(prod => { detailsMap[prod.id] = prod; });
            items = items.map(item => {
                const prod = detailsMap[item.product_id || item.id] || {};
                return {
                    ...item,
                    name: item.name || prod.title || prod.name || 'Product',
                    price: (typeof item.price === 'number' && !isNaN(item.price)) ? item.price : (typeof prod.price === 'number' ? prod.price : 0),
                    image: item.image || prod.image || 'images/products/placeholder.jpg',
                };
            });
        }
        if (items && items.length > 0) {
            cartEmpty.style.display = 'none';
            cartItems.style.display = 'block';
            cartFooter.style.display = 'block';
            cartItems.innerHTML = items.map(item => {
                const price = (typeof item.price === 'number' && !isNaN(item.price)) ? item.price : 0;
                const image = item.image || 'images/products/placeholder.jpg';
                return `<div class="cart-item">
                    <img src="${image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${item.name}</h4>
                        <div class="cart-item-price">$${price.toLocaleString()} x ${item.quantity}</div>
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCartSidebar('product', null, ${item.product_id || item.id})" title="Remove item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3,6 5,6 21,6"></polyline>
                            <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1 2-2h4a2,2 0 0,1 2,2v2"></path>
                        </svg>
                    </button>
                </div>`;
            }).join('');
            const subtotal = items.reduce((sum, item) => {
                let priceNum = typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace(/[^\\d.]/g, ''));
                return sum + (priceNum * item.quantity);
            }, 0);
            const subtotalEl = document.getElementById('cartSubtotal');
            const totalEl = document.getElementById('cartTotal');
            if (subtotalEl) subtotalEl.textContent = `$${subtotal.toLocaleString()}`;
            if (totalEl) totalEl.textContent = `$${subtotal.toLocaleString()}`;
        } else {
            cartEmpty.style.display = 'block';
            cartItems.style.display = 'none';
            cartFooter.style.display = 'none';
        }
    } catch (error) {
        console.error('Error loading cart data:', error);
        cartEmpty.style.display = 'block';
        cartItems.style.display = 'none';
        cartFooter.style.display = 'none';
    }
}

// Accepts (type, cart_id, product_id)
async function removeFromCartSidebar(type, cart_id, product_id) {
    try {
        let body = { action: 'remove_from_cart' };
        if (type === 'cart' && cart_id) {
            body.cart_id = cart_id;
        } else if (type === 'product' && product_id) {
            body.product_id = product_id;
        }
        const response = await fetch('cart.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        if (data.success) {
            updateCartBadge();
            renderCartSidebar();
            showNotification('Item removed from cart', 'success');
        } else {
            showNotification(data.error || 'Failed to remove item', 'error');
        }
    } catch (error) {
        console.error('Error removing from cart:', error);
        showNotification('Error removing from cart', 'error');
    }
}

async function renderWishlistSidebar(itemsArg) {
    const wishlistEmpty = document.getElementById('wishlistEmpty');
    const wishlistItems = document.getElementById('wishlistItems');
    if (!wishlistEmpty || !wishlistItems) return;
    let items = itemsArg;
    try {
        if (!items) {
            const response = await fetch('wishlist.php?action=get_wishlist');
            const data = await response.json();
            items = data.wishlist || [];
        }
        if (items && items.length > 0) {
            wishlistEmpty.style.display = 'none';
            wishlistItems.style.display = 'block';
            wishlistItems.innerHTML = items.map(item => {
                let displayName = item.name || item.title || '';
                let displayPrice = item.price;
                let priceStr = typeof displayPrice === 'number' ? `$${displayPrice.toLocaleString()}` : displayPrice;
                return `
                <div class="wishlist-item">
                    <img src="${item.image}" alt="${displayName}" class="wishlist-item-image">
                    <div class="wishlist-item-details">
                        <h4 class="wishlist-item-title">${displayName}</h4>
                        <div class="wishlist-item-price">${priceStr}</div>
                    </div>
                    <button class="wishlist-item-remove" onclick="removeFromWishlistSidebar(${item.id})" title="Remove from wishlist">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                </div>
                `;
            }).join('');
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

async function removeFromWishlistSidebar(productId) {
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

async function addToCartFromWishlist(productId) {
    await addToCart(productId);
    await removeFromWishlistSidebar(productId);
}

// Auto-refresh cart and wishlist data, badges, and sidebars when localStorage changes (cross-tab sync)
// Removed since we're now using backend APIs

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    // Arrow keys for gallery navigation
    if (e.key === 'ArrowLeft' && e.ctrlKey) {
        e.preventDefault();
        const slides = document.querySelectorAll('.gallery-slide');
        currentGallerySlide = currentGallerySlide > 0 ? currentGallerySlide - 1 : slides.length - 1;
        const galleryTrack = document.getElementById('galleryTrack');
        if (galleryTrack) {
            galleryTrack.style.transform = `translateX(-${currentGallerySlide * 100}%)`;
        }
    }

    if (e.key === 'ArrowRight' && e.ctrlKey) {
        e.preventDefault();
        const slides = document.querySelectorAll('.gallery-slide');
        currentGallerySlide = (currentGallerySlide + 1) % slides.length;
        const galleryTrack = document.getElementById('galleryTrack');
        if (galleryTrack) {
            galleryTrack.style.transform = `translateX(-${currentGallerySlide * 100}%)`;
        }
    }
});

// Save data before page unload - removed since we're using backend APIs

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
document.querySelectorAll('.collection-item, .blog-card, .feature, .testimonial-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Render Blog Section on Index Page
// Remove the static blogData array and renderBlogSection function

console.log('🏺 Egyptian Creativity - Enhanced luxury website script loaded successfully!');

// Add login check for checkout
function proceedToCheckout() {
    fetch('auth.php?action=check_login')
        .then(res => res.json())
        .then(data => {
            if (data.logged_in) {
                window.location.href = 'checkout.php';
            } else {
                window.location.href = 'auth.php?redirect=checkout.php';
            }
        })
        .catch(() => {
            window.location.href = 'auth.php?redirect=checkout.php';
        });
}
window.renderCartSidebar = renderCartSidebar;
window.renderWishlistSidebar = renderWishlistSidebar;
window.renderWishlistSidebar = renderWishlistSidebar;