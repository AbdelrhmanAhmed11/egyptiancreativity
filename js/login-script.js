// Initialize Lucide icons
lucide.createIcons();

// State variables
let mobileMenuOpen = false;
let currentForm = 'login'; // 'login', 'register', 'forgot'

// DOM Elements
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const menuIcon = document.getElementById('menuIcon');
const closeIcon = document.getElementById('closeIcon');
const cartCount = document.getElementById('cartCount');
const wishlistCount = document.getElementById('wishlistCount');
const scrollToTopBtn = document.getElementById('scrollToTop');

// Form containers
const loginContainer = document.getElementById('loginContainer');
const registerContainer = document.getElementById('registerContainer');
const forgotContainer = document.getElementById('forgotContainer');

// Forms
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const forgotForm = document.getElementById('forgotForm');

// Password strength elements
const passwordStrength = document.getElementById('passwordStrength');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    updateCartCount();
    updateWishlistCount();
    setupScrollAnimations();
    setupPasswordStrength();
    ensureSidebarsClosed();
});

// Mobile menu toggle
function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;

    if (mobileMenuOpen) {
        mobileMenu.classList.add('active');
        menuIcon.classList.add('hidden');
        closeIcon.classList.remove('hidden');
    } else {
        mobileMenu.classList.remove('active');
        menuIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
    }
}

// Show login form
function showLogin() {
    currentForm = 'login';
    loginContainer.classList.remove('hidden');
    registerContainer.classList.add('hidden');
    forgotContainer.classList.add('hidden');
    
    // Add animation
    loginContainer.classList.add('animate-fadeInUp');
    setTimeout(() => {
        loginContainer.classList.remove('animate-fadeInUp');
    }, 600);
}

// Show register form
function showRegister() {
    currentForm = 'register';
    loginContainer.classList.add('hidden');
    registerContainer.classList.remove('hidden');
    forgotContainer.classList.add('hidden');
    
    // Add animation
    registerContainer.classList.add('animate-fadeInUp');
    setTimeout(() => {
        registerContainer.classList.remove('animate-fadeInUp');
    }, 600);
}

// Show forgot password form
function showForgotPassword() {
    currentForm = 'forgot';
    loginContainer.classList.add('hidden');
    registerContainer.classList.add('hidden');
    forgotContainer.classList.remove('hidden');
    
    // Add animation
    forgotContainer.classList.add('animate-fadeInUp');
    setTimeout(() => {
        forgotContainer.classList.remove('animate-fadeInUp');
    }, 600);
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.parentElement.querySelector('.password-toggle');
    const icon = button.querySelector('.password-toggle-icon');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.setAttribute('data-lucide', 'eye-off');
    } else {
        input.type = 'password';
        icon.setAttribute('data-lucide', 'eye');
    }
    
    // Re-initialize Lucide icons
    lucide.createIcons();
}

// Setup password strength indicator
function setupPasswordStrength() {
    const registerPassword = document.getElementById('registerPassword');
    if (registerPassword) {
        registerPassword.addEventListener('input', updatePasswordStrength);
    }
}

// Update password strength
function updatePasswordStrength() {
    const password = document.getElementById('registerPassword').value;
    const strengthFill = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');
    
    let strength = 0;
    let strengthLabel = 'Very Weak';
    let strengthColor = '#991B1B'; // wine
    
    // Check password criteria
    if (password.length >= 8) strength += 20;
    if (password.match(/[a-z]/)) strength += 20;
    if (password.match(/[A-Z]/)) strength += 20;
    if (password.match(/[0-9]/)) strength += 20;
    if (password.match(/[^a-zA-Z0-9]/)) strength += 20;
    
    // Determine strength level
    if (strength >= 80) {
        strengthLabel = 'Very Strong';
        strengthColor = '#0891B2'; // turquoise
    } else if (strength >= 60) {
        strengthLabel = 'Strong';
        strengthColor = '#C9A961'; // gold
    } else if (strength >= 40) {
        strengthLabel = 'Medium';
        strengthColor = '#CD853F'; // terracotta
    } else if (strength >= 20) {
        strengthLabel = 'Weak';
        strengthColor = '#A0522D'; // deep terracotta
    }
    
    // Update UI
    strengthFill.style.width = `${strength}%`;
    strengthFill.style.background = strengthColor;
    strengthText.textContent = strengthLabel;
    strengthText.style.color = strengthColor;
}

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(loginForm);
    const email = formData.get('email');
    const password = formData.get('password');
    const remember = formData.get('remember');
    
    // Validate form data
    if (!email || !password) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = loginForm.querySelector('.auth-button');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> Signing In...';
    submitBtn.disabled = true;
    
    // Simulate login process
    setTimeout(() => {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        lucide.createIcons();
        
        // Simulate successful login
        showNotification('Welcome back! Redirecting to your account...', 'success');
        
        // Store login state in a consistent key for all pages
        const userData = { email, loginTime: new Date().toISOString(), remember };
        if (remember) {
            localStorage.setItem('egyptianCreativityUser', JSON.stringify(userData));
        } else {
            sessionStorage.setItem('egyptianCreativityUser', JSON.stringify(userData));
        }
        
        // Redirect after delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }, 2000);
}

// Handle register form submission
function handleRegister(e) {
    e.preventDefault();
    
    const formData = new FormData(registerForm);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const terms = formData.get('terms');
    const newsletter = formData.get('newsletter');
    
    // Validate form data
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match.', 'error');
        return;
    }
    
    if (!terms) {
        showNotification('Please agree to the Terms & Conditions.', 'error');
        return;
    }
    
    // Check password strength
    if (password.length < 8) {
        showNotification('Password must be at least 8 characters long.', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = registerForm.querySelector('.auth-button');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> Creating Account...';
    submitBtn.disabled = true;
    
    // Simulate registration process
    setTimeout(() => {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        lucide.createIcons();
        
        // Simulate successful registration
        showNotification('Account created successfully! Please check your email for verification.', 'success');
        
        // Subscribe to newsletter if checked
        if (newsletter) {
            setTimeout(() => {
                showNotification('You have been subscribed to our newsletter!', 'info');
            }, 1000);
        }
        
        // Switch to login form after delay
        setTimeout(() => {
            showLogin();
            showNotification('You can now sign in with your new account.', 'info');
        }, 3000);
    }, 2000);
}

// Handle forgot password form submission
function handleForgotPassword(e) {
    e.preventDefault();
    
    const formData = new FormData(forgotForm);
    const email = formData.get('email');
    
    // Validate form data
    if (!email) {
        showNotification('Please enter your email address.', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = forgotForm.querySelector('.auth-button');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate forgot password process
    setTimeout(() => {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        lucide.createIcons();
        
        // Simulate successful email sent
        showNotification('Password reset instructions have been sent to your email.', 'success');
        
        // Switch to login form after delay
        setTimeout(() => {
            showLogin();
        }, 3000);
    }, 2000);
}

// Social login functions
function loginWithGoogle() {
    showNotification('Redirecting to Google...', 'info');
    // Simulate Google OAuth
    setTimeout(() => {
        showNotification('Google login is not available in demo mode.', 'error');
    }, 1500);
}

function loginWithFacebook() {
    showNotification('Redirecting to Facebook...', 'info');
    // Simulate Facebook OAuth
    setTimeout(() => {
        showNotification('Facebook login is not available in demo mode.', 'error');
    }, 1500);
}

function registerWithGoogle() {
    showNotification('Redirecting to Google...', 'info');
    // Simulate Google OAuth
    setTimeout(() => {
        showNotification('Google registration is not available in demo mode.', 'error');
    }, 1500);
}

function registerWithFacebook() {
    showNotification('Redirecting to Facebook...', 'info');
    // Simulate Facebook OAuth
    setTimeout(() => {
        showNotification('Facebook registration is not available in demo mode.', 'error');
    }, 1500);
}

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('egyptianCart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Update wishlist count
function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem('egyptianWishlist')) || [];
    wishlistCount.textContent = wishlist.length;
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i data-lucide="${type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : 'info'}" class="w-5 h-5"></i>
            <span>${message}</span>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: ${type === 'success' ? 'var(--egyptian-turquoise)' : type === 'error' ? 'var(--egyptian-wine)' : 'var(--egyptian-lapis)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-family: 'Playfair Display', serif;
        font-weight: 600;
        backdrop-filter: blur(10px);
        max-width: 400px;
    `;

    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;

    document.body.appendChild(notification);

    // Initialize Lucide icons for notification
    lucide.createIcons();

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Handle scroll to top
function handleScroll() {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Mobile menu
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    // Forms
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    if (forgotForm) {
        forgotForm.addEventListener('submit', handleForgotPassword);
    }

    // Scroll to top
    window.addEventListener('scroll', handleScroll);
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Newsletter form submission
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            if (email) {
                showNotification('Thank you for subscribing to our newsletter!', 'success');
                this.reset();
            }
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href') === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close any open modals or overlays
        }
        
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'BUTTON') {
            // Handle enter key on form inputs
            const form = e.target.closest('form');
            if (form) {
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.click();
                }
            }
        }
    });

    // Real-time form validation
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('blur', validateInput);
        input.addEventListener('input', clearValidationError);
    });
}

// Validate individual input
function validateInput(e) {
    const input = e.target;
    const value = input.value.trim();
    
    // Remove existing error styling
    input.classList.remove('error');
    
    // Email validation
    if (input.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            input.classList.add('error');
            showInputError(input, 'Please enter a valid email address');
        }
    }
    
    // Password confirmation validation
    if (input.name === 'confirmPassword' && value) {
        const password = document.getElementById('registerPassword').value;
        if (value !== password) {
            input.classList.add('error');
            showInputError(input, 'Passwords do not match');
        }
    }
}

// Clear validation error
function clearValidationError(e) {
    const input = e.target;
    input.classList.remove('error');
    
    // Remove error message if exists
    const errorMsg = input.parentElement.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.remove();
    }
}

// Show input error
function showInputError(input, message) {
    // Remove existing error message
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: var(--egyptian-wine);
        font-size: 0.875rem;
        margin-top: 0.25rem;
        font-family: 'Playfair Display', serif;
    `;
    
    input.parentElement.appendChild(errorDiv);
}

// Setup scroll animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeInUp');
            }
        });
    }, observerOptions);

    // Observe all sections for scroll animations
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Observe individual cards and elements
    document.querySelectorAll('.auth-card, .benefits-card, .security-card, .benefit-item').forEach(element => {
        observer.observe(element);
    });
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroSection = document.querySelector('.account-hero');

    if (heroSection) {
        const rate = scrolled * -0.3;
        heroSection.style.transform = `translateY(${rate}px)`;
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('animate-fadeInUp');
});

// Re-initialize Lucide icons after dynamic content is added
setTimeout(() => {
    lucide.createIcons();
}, 100);

// Global functions for onclick handlers
window.showLogin = showLogin;
window.showRegister = showRegister;
window.showForgotPassword = showForgotPassword;
window.togglePassword = togglePassword;
window.loginWithGoogle = loginWithGoogle;
window.loginWithFacebook = loginWithFacebook;
window.registerWithGoogle = registerWithGoogle;
window.registerWithFacebook = registerWithFacebook;

// Add CSS for error styling
const errorStyles = document.createElement('style');
errorStyles.textContent = `
    .form-input.error {
        border-color: var(--egyptian-wine) !important;
        box-shadow: 0 0 0 3px rgba(153, 27, 27, 0.1) !important;
    }
`;
document.head.appendChild(errorStyles);

// Ensure all sidebars are closed by default
function ensureSidebarsClosed() {
  const sidebars = document.querySelectorAll('.sidebar');
  sidebars.forEach(sidebar => {
    sidebar.classList.remove('active');
  });
}