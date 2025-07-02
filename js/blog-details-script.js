// Egyptian Creativity Blog Details - Enhanced JavaScript

// Global Variables
let cart = JSON.parse(localStorage.getItem('egyptianLuxuryCart')) || [];
let wishlist = JSON.parse(localStorage.getItem('egyptianWishlist')) || [];

// Blog Data
const blogs = {
    '1': {
        title: "The Senet Games of King Tutankhamun",
        category: "History & Artifacts",
        date: "April 15, 2025",
        image: "images/1-7-scaled.jpg",
        content: `
            <p>King Tutankhamun was buried with no fewer than five senet game boxes. Senet was an ancient Egyptian board game popular with all classes. Archaeological evidence reveals that senet was played by both royalty and commoners, and it was believed to have spiritual significance in the afterlife.</p>
            
            <p>The game consisted of a board with 30 squares arranged in three rows of ten. Players would move pieces along the board based on throws of dice or casting sticks. The game was not just entertainment but was thought to represent the journey of the soul through the afterlife.</p>
            
            <p>The senet boards found in Tutankhamun's tomb were made of precious materials including ebony, ivory, and gold, indicating the high status of the young pharaoh. These artifacts provide valuable insights into the daily life and beliefs of ancient Egyptians.</p>
            
            <p>Modern scholars believe that senet may have been one of the earliest board games in human history, with evidence of similar games dating back to 3500 BCE. The game's popularity spanned over 2000 years, making it one of the most enduring forms of entertainment in ancient civilization.</p>
        `
    },
    '2': {
        title: "The Road of Rams",
        category: "History & Culture",
        date: "April 12, 2025",
        image: "images/10.jpg",
        content: `
            <p>The Sphinx Avenue (the Rams Road) is a royal avenue that connects the Karnak Temple in the north with the Luxor Temple in the south. It was established for the purpose of witnessing the annual celebrations and religious processions in ancient Thebes.</p>
            
            <p>This magnificent avenue was lined with hundreds of ram-headed sphinxes, each representing the god Amun-Ra. The rams were symbols of fertility and power, embodying the divine authority of the pharaohs who ruled from Thebes.</p>
            
            <p>The avenue served as the main ceremonial route during the annual Opet Festival, when the sacred barques of Amun, Mut, and Khonsu were carried from Karnak to Luxor Temple. This procession was one of the most important religious events in ancient Egypt.</p>
            
            <p>Today, the Avenue of the Sphinxes is being restored and excavated, revealing more about the grandeur of ancient Thebes and the religious practices that shaped Egyptian civilization for thousands of years.</p>
        `
    },
    '3': {
        title: "The Queens of Ancient Egypt",
        category: "Royalty & History",
        date: "April 10, 2025",
        image: "images/4-5-scaled.jpg",
        content: `
            <p>Ancient Egypt was home to numerous powerful and influential queens who left an indelible mark on the land of the pharaohs. From the Old Kingdom to the New Kingdom, these queens held significant roles in Egyptian society, politics, and religion.</p>
            
            <p>Among the most famous was Hatshepsut, who ruled as pharaoh in her own right during the 18th Dynasty. She commissioned numerous building projects, including her magnificent mortuary temple at Deir el-Bahari, and led successful military campaigns.</p>
            
            <p>Nefertiti, the wife of Akhenaten, was another influential queen who played a crucial role in the religious revolution of the Amarna Period. Her beauty and power are immortalized in the famous bust discovered in 1912.</p>
            
            <p>Cleopatra VII, the last active ruler of the Ptolemaic Kingdom, was perhaps the most famous Egyptian queen. Her political alliances and relationships with Julius Caesar and Mark Antony shaped the course of Mediterranean history.</p>
        `
    },
    '4': {
        title: "Queen Nefertiti: The Beautiful One",
        category: "Royalty & History",
        date: "April 8, 2025",
        image: "images/5-1.jpg",
        content: `
            <p>Queen Nefertiti, whose name means 'the beautiful one has come,' was the wife of King Amenhotep IV, the famous pharaoh of the Eighteenth Dynasty, and the protector of Tutankhamun. Her legacy endures through her iconic bust and her influence on Egyptian art and culture.</p>
            
            <p>Nefertiti played a crucial role in the religious revolution initiated by her husband, who changed his name to Akhenaten and established the worship of the sun disk Aten as the state religion. Together, they moved the capital to Amarna and transformed Egyptian art and culture.</p>
            
            <p>The famous bust of Nefertiti, discovered in 1912 by German archaeologist Ludwig Borchardt, has become one of the most recognizable symbols of ancient Egypt. The bust's perfect proportions and serene expression have made it an icon of beauty and grace.</p>
            
            <p>Despite her prominence during her lifetime, much about Nefertiti's later life remains mysterious. Some scholars believe she may have ruled as pharaoh after Akhenaten's death, possibly under the name Smenkhkare or Neferneferuaten.</p>
        `
    },
    '5': {
        title: "Sandals of Tutankhamun",
        category: "Artifacts & Royalty",
        date: "April 5, 2025",
        image: "images/5-3.jpg",
        content: `
            <p>Among the many treasures found in Tutankhamun's tomb were his golden sandals. These exquisite pieces of footwear were crafted with incredible detail, featuring golden straps and soles, and were intended to accompany the young king into the afterlife.</p>
            
            <p>The sandals were made of gold and decorated with intricate patterns, including images of enemies that the pharaoh would symbolically trample underfoot. This was a common motif in ancient Egyptian royal regalia, symbolizing the pharaoh's power over his enemies.</p>
            
            <p>The craftsmanship of these sandals demonstrates the incredible skill of ancient Egyptian artisans. The gold was beaten into thin sheets and carefully shaped to create comfortable, wearable footwear that was also a work of art.</p>
            
            <p>These sandals, along with other items of royal clothing and jewelry found in the tomb, provide valuable insights into the daily life and ceremonial practices of the Egyptian court during the 18th Dynasty.</p>
        `
    },
    '6': {
        title: "Heka and the Hammer Nakakha",
        category: "Mythology & Culture",
        date: "April 3, 2025",
        image: "images/9-1.jpg",
        content: `
            <p>The stick (Heka) and the hammer (Nakakha) were originally attributes of the ancient Egyptian god. The shepherd's stick symbolized royalty and the hammer symbolized the fertility of the land and power over the forces of nature.</p>
            
            <p>Heka, the shepherd's crook, was one of the most important symbols of royal authority in ancient Egypt. It represented the pharaoh's role as the shepherd of his people, guiding and protecting them like a shepherd does his flock.</p>
            
            <p>The Nakakha, or flail, was often paired with the Heka and together they formed the most recognizable symbols of pharaonic power. The flail was associated with the god Osiris and symbolized the pharaoh's authority to punish and reward.</p>
            
            <p>These symbols were not just decorative but had deep religious and political significance. They connected the earthly ruler to the divine realm and emphasized the pharaoh's role as the intermediary between the gods and the people.</p>
        `
    },
    '7': {
        title: "Pharaoh's Scepter Replica",
        category: "Accessories & Royalty",
        date: "April 18, 2025",
        image: "images/10.jpg",
        content: `
            <p>The Pharaoh's Scepter Replica is a magnificent recreation of the ceremonial staff once wielded by Egypt's divine rulers. Symbolizing authority, power, and the connection between the pharaoh and the gods, the scepter was an essential part of royal regalia.</p>
            <p>This replica is crafted with a golden finish and inlaid with precious stones, echoing the opulence of the original artifacts found in ancient tombs. The scepter's design features intricate engravings and a balanced weight, making it both a stunning display piece and a tangible link to Egypt's storied past.</p>
            <h3>Product Details</h3>
            <ul>
                <li><strong>Materials:</strong> Brass Core, Gold Plating, Semi-precious Stones</li>
                <li><strong>Dimensions:</strong> 75cm length</li>
                <li><strong>Weight:</strong> 800g</li>
                <li><strong>Display:</strong> Includes wooden stand</li>
            </ul>
            <h3>Collector's Insights</h3>
            <ul>
                <li>Symbol of divine authority and leadership</li>
                <li>Handcrafted with attention to historical accuracy</li>
                <li>Perfect for display in a study, office, or collection room</li>
            </ul>
            <p>Whether you are a passionate collector or a lover of ancient history, the Pharaoh's Scepter Replica brings a piece of Egypt's royal legacy into your home.</p>
            <p><a href="shop.html">&larr; Return to Shop</a></p>
        `
    }
};

// DOM Elements
const header = document.getElementById('header');
const userBtn = document.getElementById('userBtn');
const cartBtn = document.getElementById('cartBtn');
const wishlistBtn = document.getElementById('wishlistBtn');
const cartBadge = document.getElementById('cartBadge');
const wishlistBadge = document.getElementById('wishlistBadge');
const notificationContainer = document.getElementById('notificationContainer');
const cartSidebar = document.getElementById('cartSidebar');
const wishlistSidebar = document.getElementById('wishlistSidebar');
const cartClose = document.getElementById('cartClose');
const wishlistClose = document.getElementById('wishlistClose');

// Initialize Website
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeUserButton();
    initializeCart();
    initializeWishlist();
    renderBlogDetails();
    updateCartBadge();
    updateWishlistBadge();
    initializeSearchModal();
    ensureSidebarsClosed();
    
    console.log('🏺 Blog Details page initialized successfully!');
});

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
    
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
}

// User Button
function initializeUserButton() {
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
}

// Cart Functions
function initializeCart() {
    if (cartBtn && cartSidebar) {
        cartBtn.addEventListener('click', () => {
            cart = JSON.parse(localStorage.getItem('egyptianLuxuryCart')) || [];
            openSidebar(cartSidebar);
            renderCartSidebar();
        });
    }
}

function updateCartBadge() {
    // Always reload cart from localStorage to sync with cart page
    cart = JSON.parse(localStorage.getItem('egyptianLuxuryCart')) || [];
    const badge = document.getElementById('cartBadge');
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    if (badge) {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function addToCart(productId) {
    const product = getProductById(productId);
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        saveCart();
        updateCartBadge();
        showNotification(`${product.name} added to cart!`, 'success');
    }
}

function saveCart() {
    localStorage.setItem('egyptianLuxuryCart', JSON.stringify(cart));
}

// Wishlist Functions
function initializeWishlist() {
    if (wishlistBtn && wishlistSidebar) {
        wishlistBtn.addEventListener('click', () => {
            wishlist = JSON.parse(localStorage.getItem('egyptianWishlist')) || [];
            openSidebar(wishlistSidebar);
            renderWishlistSidebar();
        });
    }
}

function updateWishlistBadge() {
    if (wishlistBadge) {
        wishlistBadge.textContent = wishlist.length;
        wishlistBadge.style.display = wishlist.length > 0 ? 'flex' : 'none';
    }
}

function toggleWishlist(productId) {
    const product = getProductById(productId);
    if (product) {
        const existingIndex = wishlist.findIndex(item => item.id === productId);
        if (existingIndex > -1) {
            wishlist.splice(existingIndex, 1);
            showNotification(`${product.name} removed from wishlist!`, 'info');
        } else {
            wishlist.push(product);
            showNotification(`${product.name} added to wishlist!`, 'success');
        }
        saveWishlist();
        updateWishlistBadge();
    }
}

function saveWishlist() {
    localStorage.setItem('egyptianWishlist', JSON.stringify(wishlist));
}

// Helper Functions
function getProductById(productId) {
    // This would typically fetch from a products database
    // For now, return a mock product
    return {
        id: productId,
        name: "Egyptian Artifact",
        price: "$1,000",
        image: "images/1-7-scaled.jpg"
    };
}

// Get blog id from URL
function getBlogId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Render blog details
function renderBlogDetails() {
    const blogId = getBlogId();
    let blog = null;
    // First, try to get from localStorage
    const blogsFromStorage = JSON.parse(localStorage.getItem('egyptianCreativityBlogs')) || [];
    blog = blogsFromStorage.find(b => String(b.id) === String(blogId));
    // If not found, fall back to static blogs object
    if (!blog) {
        blog = blogs[blogId];
    }
    const container = document.getElementById('blogDetailsContent');
    
    if (!blog) {
        container.innerHTML = `
            <div class="blog-not-found">
                <h2>Blog Not Found</h2>
                <p>The blog post you are looking for does not exist.</p>
                <a href="blog.html" class="btn btn-primary">Back to Blog</a>
            </div>
        `;
        return;
    }

    // If blog is from localStorage, use .content or .excerpt as content
    let blogContent = blog.content;
    if (!blogContent) {
        // Fallback: use excerpt if no content
        blogContent = `<p>${blog.excerpt || 'No content available.'}</p>`;
    }

    container.innerHTML = `
        <div class="blog-header">
            <div class="blog-meta">
                <span class="blog-category">${blog.category}</span>
                <span class="blog-date">${blog.date}</span>
            </div>
            <h1 class="blog-title">${blog.title}</h1>
        </div>
        <div class="blog-hero-image">
            <img src="${blog.image}" alt="${blog.title}">
        </div>
        <div class="blog-content">
            <div class="blog-text">
                ${blogContent}
            </div>
            <div class="blog-actions">
                <a href="blog.html" class="btn btn-outline">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12,19 5,12 12,5"></polyline>
                    </svg>
                    Back to Blog
                </a>
                <button class="btn btn-primary" onclick="shareBlog()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                        <polyline points="16,6 12,2 8,6"></polyline>
                        <line x1="12" y1="2" x2="12" y2="15"></line>
                    </svg>
                    Share Article
                </button>
            </div>
        </div>
    `;
}

// Share blog function
function shareBlog() {
    if (navigator.share) {
        navigator.share({
            title: document.title,
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            showNotification('Link copied to clipboard!', 'success');
        });
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    let icon = '';
    switch(type) {
        case 'success':
            icon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22,4 12,14.01 9,11.01"></polyline></svg>';
            break;
        case 'error':
            icon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
            break;
        default:
            icon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    }
    
    notification.innerHTML = `${icon}<span>${message}</span>`;
    
    if (notificationContainer) {
        notificationContainer.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
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

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    // Escape key closes modals
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('navMenu');
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
    }
});

// Sidebar open/close logic for cart and wishlist (copied from script.js)
function openSidebar(sidebar) {
    if (sidebar) sidebar.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeSidebar(sidebar) {
    if (sidebar) sidebar.classList.remove('active');
    document.body.style.overflow = '';
}

if (cartClose && cartSidebar) {
    cartClose.addEventListener('click', () => closeSidebar(cartSidebar));
}
if (wishlistClose && wishlistSidebar) {
    wishlistClose.addEventListener('click', () => closeSidebar(wishlistSidebar));
}
// Close sidebar when clicking outside content
// (optional, for better UX)
document.addEventListener('mousedown', (e) => {
    if (cartSidebar && cartSidebar.classList.contains('active') && !cartSidebar.querySelector('.sidebar-content').contains(e.target) && !cartSidebar.querySelector('.sidebar-header').contains(e.target)) {
        closeSidebar(cartSidebar);
    }
    if (wishlistSidebar && wishlistSidebar.classList.contains('active') && !wishlistSidebar.querySelector('.sidebar-content').contains(e.target) && !wishlistSidebar.querySelector('.sidebar-header').contains(e.target)) {
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

// Render Cart Sidebar
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
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <div class="cart-item-price">${item.price} x ${item.quantity}</div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCartSidebar(${item.id})" title="Remove item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3,6 5,6 21,6"></polyline>
                        <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1 2-2h4a2,2 0 0,1 2,2v2"></path>
                    </svg>
                </button>
            </div>
        `).join('');
        // Calculate subtotal and total using numeric price
        const subtotal = cart.reduce((sum, item) => {
            let priceNum = typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace(/[^\d.]/g, ''));
            return sum + (priceNum * item.quantity);
        }, 0);
        const subtotalEl = document.getElementById('cartSubtotal');
        const totalEl = document.getElementById('cartTotal');
        if (subtotalEl) subtotalEl.textContent = `$${subtotal.toLocaleString()}`;
        if (totalEl) totalEl.textContent = `$${subtotal.toLocaleString()}`;
    }
}

function removeFromCartSidebar(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index > -1) {
        cart.splice(index, 1);
        updateCartBadge();
        saveCart();
        renderCartSidebar();
    }
}

// Render Wishlist Sidebar
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
    }
}

function removeFromWishlistSidebar(productId) {
    const index = wishlist.findIndex(item => item.id === productId);
    if (index > -1) {
        wishlist.splice(index, 1);
        updateWishlistBadge();
        saveWishlist();
        renderWishlistSidebar();
    }
}

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
        if (e.key === 'Escape' && searchModal.classList.contains('active')) {
            searchModal.classList.remove('active');
        }
    });
}

// Ensure all sidebars are closed by default
function ensureSidebarsClosed() {
  const sidebars = document.querySelectorAll('.sidebar');
  sidebars.forEach(sidebar => {
    sidebar.classList.remove('active');
  });
}