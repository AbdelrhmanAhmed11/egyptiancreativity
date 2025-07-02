// Initialize Lucide icons
lucide.createIcons();

// Data
const heroSlides = [
    {
        title: "Great Collection",
        subtitle: "Decorations",
        description: "Discover authentic Egyptian luxury crafted with ancient techniques",
        image: "images/1-7-scaled.jpg",
        badge: "Premium Quality",
        bottomText: "Authentic Craftsmanship",
        category: "Decorations",
    },
    {
        title: "Royal Treasures",
        subtitle: "Accessories",
        description: "Exquisite golden artifacts inspired by pharaonic heritage",
        image: "images/10.jpg",
        badge: "Handcrafted",
        bottomText: "Royal Heritage",
        category: "Accessories",
    },
    {
        title: "Sacred Boxes",
        subtitle: "Storage & Chests",
        description: "Ornate storage solutions fit for pharaohs and nobles",
        image: "images/4-5-scaled.jpg",
        badge: "Limited Edition",
        bottomText: "Sacred Artistry",
        category: "Boxes",
    },
    {
        title: "Ancient Games",
        subtitle: "Game Boxes",
        description: "Recreated board games from the tombs of ancient kings",
        image: "images/5-1.jpg",
        badge: "Museum Quality",
        bottomText: "Historical Accuracy",
        category: "Games",
    },
    {
        title: "Pharaonic Fashion",
        subtitle: "Clothing & Jewelry",
        description: "Wearable art inspired by ancient Egyptian royalty",
        image: "images/9-1.jpg",
        badge: "Exclusive Design",
        bottomText: "Timeless Elegance",
        category: "Fashion",
    },
];

// Rest of the code remains the same
const blogPosts = [
    {
        title: 'The "Road of Rams"',
        excerpt: "The Sphinx Avenue (the Rams Road) is originally attributes of the ancient ceremonial pathways connecting Karnak and Luxor temples...",
        date: "13 APR",
        author: "Admin",
    },
    {
        title: "The Sphinx: Guardian of Ancient Mysteries",
        excerpt: "The Great Sphinx of Giza has watched over the pyramids for millennia, its enigmatic smile hiding secrets of ancient wisdom...",
        date: "13 NOV",
        author: "Admin",
    },
];

// State variables
let currentHeroSlide = 0;
let currentBlogSlide = 0;

// Mobile menu toggle
function toggleMobileMenu() {
    const menu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.mobile-overlay');
    menu.classList.toggle('hidden');
    overlay.classList.toggle('hidden');
}

// Hero carousel functions
function initializeHeroCarousel() {
    const carousel = document.getElementById('heroCarousel');
    const indicators = document.getElementById('heroIndicators');
    const counter = document.getElementById('heroCounter');

    heroSlides.forEach((slide, index) => {
        const slideElement = document.createElement('div');
        slideElement.className = 'carousel-slide';
        slideElement.innerHTML = `
            <img src="${slide.image}" alt="${slide.title}" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
                <div class="space-y-4">
                    <div class="text-2xl font-cinzel font-bold text-white">${slide.title}</div>
                    <div class="text-xl font-playfair text-white">${slide.subtitle}</div>
                    <div class="text-lg font-playfair text-white">${slide.description}</div>
                </div>
            </div>
        `;
        carousel.appendChild(slideElement);

        // Add indicator
        const indicator = document.createElement('button');
        indicator.className = 'w-4 h-4 rounded-full bg-white/50 hover:bg-white transition-colors';
        if (index === 0) indicator.classList.add('bg-white');
        indicator.onclick = () => goToHeroSlide(index);
        indicators.appendChild(indicator);
    });

    updateHeroContent();
    updateHeroCounter();
}

function updateHeroContent() {
    const slide = heroSlides[currentHeroSlide];
    document.getElementById('heroTitle').textContent = slide.title;
    document.getElementById('heroSubtitle').textContent = slide.subtitle;
    document.getElementById('heroDescription').textContent = slide.description;
}

function nextHeroSlide() {
    currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
    updateHeroContent();
    updateHeroCounter();
    updateCarouselIndicators();
}

function prevHeroSlide() {
    currentHeroSlide = (currentHeroSlide - 1 + heroSlides.length) % heroSlides.length;
    updateHeroContent();
    updateHeroCounter();
    updateCarouselIndicators();
}

function goToHeroSlide(index) {
    currentHeroSlide = index;
    updateHeroContent();
    updateHeroCounter();
    updateCarouselIndicators();
}

function updateHeroCounter() {
    document.getElementById('heroCounter').textContent = `${currentHeroSlide + 1} / ${heroSlides.length}`;
}

function updateCarouselIndicators() {
    const indicators = document.querySelectorAll('#heroIndicators button');
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('bg-white', index === currentHeroSlide);
        indicator.classList.toggle('bg-white/50', index !== currentHeroSlide);
    });
}

// Blog carousel functions
function initializeBlogCarousel() {
    const carousel = document.getElementById('blogCarousel');
    const indicators = document.getElementById('blogIndicators');
    const counter = document.getElementById('blogCounter');

    blogPosts.forEach((post, index) => {
        const postElement = document.createElement('div');
        postElement.className = 'blog-post';
        postElement.innerHTML = `
            <div class="space-y-4">
                <h3 class="text-2xl font-cinzel font-bold">${post.title}</h3>
                <p class="text-lg font-playfair">${post.excerpt}</p>
                <div class="flex items-center space-x-4">
                    <span class="text-sm font-playfair">${post.date}</span>
                    <span class="text-sm font-playfair">by ${post.author}</span>
                </div>
            </div>
        `;
        carousel.appendChild(postElement);

        // Add indicator
        const indicator = document.createElement('button');
        indicator.className = 'w-3 h-3 rounded-full bg-white/50 hover:bg-white transition-colors';
        if (index === 0) indicator.classList.add('bg-white');
        indicator.onclick = () => goToBlogSlide(index);
        indicators.appendChild(indicator);
    });

    updateBlogCarousel();
    updateBlogCounter();
}

function updateBlogCarousel() {
    const slides = document.querySelectorAll('.blog-post');
    slides.forEach((slide, index) => {
        slide.style.transform = `translateX(${(index - currentBlogSlide) * 100}%)`;
    });
}

function nextBlogSlide() {
    currentBlogSlide = (currentBlogSlide + 1) % blogPosts.length;
    updateBlogCarousel();
    updateBlogCounter();
    updateBlogIndicators();
}

function prevBlogSlide() {
    currentBlogSlide = (currentBlogSlide - 1 + blogPosts.length) % blogPosts.length;
    updateBlogCarousel();
    updateBlogCounter();
    updateBlogIndicators();
}

function goToBlogSlide(index) {
    currentBlogSlide = index;
    updateBlogCarousel();
    updateBlogCounter();
    updateBlogIndicators();
}

function updateBlogCounter() {
    document.getElementById('blogCounter').textContent = `${currentBlogSlide + 1} / ${blogPosts.length}`;
}

function updateBlogIndicators() {
    const indicators = document.querySelectorAll('#blogIndicators button');
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('bg-white', index === currentBlogSlide);
        indicator.classList.toggle('bg-white/50', index !== currentBlogSlide);
    });
}

// Render categories
function renderCategories() {
    const categories = document.getElementById('categories');
    const categoryList = [
        { name: 'Decorations', icon: 'gift' },
        { name: 'Accessories', icon: 'jewelry' },
        { name: 'Boxes', icon: 'box' },
        { name: 'Games', icon: 'gamepad' },
        { name: 'Fashion', icon: 'dress' },
    ];

    categoryList.forEach(category => {
        const categoryElement = document.createElement('a');
        categoryElement.className = 'category-item group';
        categoryElement.href = `#${category.name.toLowerCase()}`;
        categoryElement.innerHTML = `
            <div class="flex items-center space-x-3">
                <i data-lucide="${category.icon}" class="w-6 h-6 text-lapis transition-transform group-hover:scale-125"></i>
                <span class="text-lg font-playfair font-semibold">${category.name}</span>
            </div>
        `;
        categories.appendChild(categoryElement);
    });
}

// Render products
function renderProducts() {
    const products = document.getElementById('products');
    const productList = [
        {
            name: 'Golden Ankh',
            price: '$1,299',
            image: 'images/product-ankh.jpg',
            category: 'Accessories',
        },
        {
            name: 'Hieroglyphic Box',
            price: '$899',
            image: 'images/product-box.jpg',
            category: 'Boxes',
        },
        {
            name: 'Sphinx Necklace',
            price: '$2,499',
            image: 'images/product-necklace.jpg',
            category: 'Fashion',
        },
    ];

    productList.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product-card';
        productElement.innerHTML = `
            <div class="relative">
                <img src="${product.image}" alt="${product.name}" class="w-full h-64 object-cover rounded-lg">
                <div class="absolute top-4 right-4">
                    <button class="btn-icon bg-lapis hover:bg-deeplapis">
                        <i data-lucide="heart" class="w-5 h-5"></i>
                    </button>
                </div>
            </div>
            <div class="mt-4 space-y-2">
                <h3 class="text-lg font-cinzel font-bold">${product.name}</h3>
                <div class="text-xl font-playfair font-semibold">${product.price}</div>
                <button class="btn-primary w-full">ADD TO CART</button>
            </div>
        `;
        products.appendChild(productElement);
    });
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('heroPrev').onclick = prevHeroSlide;
    document.getElementById('heroNext').onclick = nextHeroSlide;
    document.getElementById('blogPrev').onclick = prevBlogSlide;
    document.getElementById('blogNext').onclick = nextBlogSlide;

    // Mobile menu
    document.getElementById('mobileMenuBtn').onclick = toggleMobileMenu;
    document.querySelector('.mobile-overlay').onclick = toggleMobileMenu;
}

// Auto-slide functionality
function startAutoSlide() {
    heroInterval = setInterval(() => {
        nextHeroSlide();
    }, 5000);
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initializeHeroCarousel();
    initializeBlogCarousel();
    renderCategories();
    renderProducts();
    setupEventListeners();
    startAutoSlide();
});

// Pause auto-slide on hover
document.addEventListener('mouseenter', (e) => {
    if (e.target.closest('#heroCarousel')) {
        clearInterval(heroInterval);
    }
});

document.addEventListener('mouseleave', (e) => {
    if (e.target.closest('#heroCarousel')) {
        startAutoSlide();
    }
});
