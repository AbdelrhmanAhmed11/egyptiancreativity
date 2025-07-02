// Authentication Manager
class AuthManager {
    constructor() {
        this.isLoggedIn = false;
        this.currentUser = null;
        this.init();
    }

    init() {
        this.checkAuthStatus();
        this.updateLoginLogoutButton();
        this.setupEventListeners();
    }

    checkAuthStatus() {
        // Check if user is logged in from localStorage
        const userData = localStorage.getItem('egyptianCreativityUser');
        if (userData) {
            try {
                this.currentUser = JSON.parse(userData);
                this.isLoggedIn = true;
            } catch (error) {
                console.error('Error parsing user data:', error);
                this.logout();
            }
        }
    }

    updateLoginLogoutButton() {
        const loginLogoutBtn = document.getElementById('loginLogoutBtn');
        if (loginLogoutBtn) {
            if (this.isLoggedIn) {
                loginLogoutBtn.textContent = 'LOGOUT';
                loginLogoutBtn.href = '#';
                loginLogoutBtn.classList.add('logged-in');
            } else {
                loginLogoutBtn.textContent = 'LOGIN';
                loginLogoutBtn.href = 'auth.html';
                loginLogoutBtn.classList.remove('logged-in');
            }
        }
    }

    setupEventListeners() {
        const loginLogoutBtn = document.getElementById('loginLogoutBtn');
        if (loginLogoutBtn) {
            loginLogoutBtn.addEventListener('click', (e) => {
                if (this.isLoggedIn) {
                    e.preventDefault();
                    this.logout();
                }
            });
        }
    }

    login(userData) {
        this.currentUser = userData;
        this.isLoggedIn = true;
        localStorage.setItem('egyptianCreativityUser', JSON.stringify(userData));
        this.updateLoginLogoutButton();
        
        // Show success notification
        this.showNotification('Login successful! Welcome back.', 'success');
        
        // Redirect to index page or previous page
        const redirectUrl = localStorage.getItem('redirectAfterLogin') || 'index.html';
        localStorage.removeItem('redirectAfterLogin');
        window.location.href = redirectUrl;
    }

    logout() {
        this.currentUser = null;
        this.isLoggedIn = false;
        localStorage.removeItem('egyptianCreativityUser');
        this.updateLoginLogoutButton();
        
        // Show logout notification
        this.showNotification('You have been logged out successfully.', 'info');
        
        // Redirect to home page
        window.location.href = 'index.html';
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            max-width: 300px;
            animation: slideInRight 0.3s ease-out;
        `;

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                margin-left: 10px;
                padding: 0;
            }
        `;
        document.head.appendChild(style);

        // Add to page
        document.body.appendChild(notification);

        // Setup close functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.isLoggedIn;
    }

    // Get current user data
    getCurrentUser() {
        return this.currentUser;
    }

    // Set redirect URL after login
    setRedirectAfterLogin(url) {
        localStorage.setItem('redirectAfterLogin', url);
    }
}

// Initialize Auth Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
} 