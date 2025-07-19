// Admin Dashboard JavaScript - Egyptian Creativity

document.addEventListener('DOMContentLoaded', function() {
    console.log('🏺 Egyptian Creativity Admin Dashboard - Initializing...');
    
    initializeAdminDashboard();
    initializeSearch();
    initializeModals();
    initializeForms();
    
    console.log('🏺 Egyptian Creativity Admin Dashboard - Loaded successfully!');
});

// Initialize Admin Dashboard
function initializeAdminDashboard() {
    // Add active class to current nav item
    const currentPage = window.location.pathname.split('/').pop();
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.php')) {
            item.classList.add('active');
        }
    });
    
    // Initialize statistics cards animation
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Initialize Search Functionality
function initializeSearch() {
    const searchInputs = document.querySelectorAll('.search-input');
    
    searchInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase();
            const table = input.closest('.admin-content').querySelector('table');
            
            if (table) {
                const rows = table.querySelectorAll('tbody tr');
                
                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    if (text.includes(query)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
            }
        });
    });
}

// Initialize Modals
function initializeModals() {
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Close modal on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                modal.style.display = 'none';
            }
        });
    });
}

// Initialize Forms
function initializeForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg> Loading...';
                submitBtn.disabled = true;
                
                // Reset button after form submission
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            }
        });
    });
}

// Show Notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
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

// Delete Confirmation Functions
function deleteProduct(id) {
    document.getElementById('deleteId').value = id;
    document.getElementById('deleteModal').style.display = 'flex';
}

function deleteGalleryItem(id) {
    document.getElementById('deleteId').value = id;
    document.getElementById('deleteModal').style.display = 'flex';
}

function deleteBlog(id) {
    document.getElementById('deleteId').value = id;
    document.getElementById('deleteModal').style.display = 'flex';
}

function closeDeleteModal() {
    document.getElementById('deleteModal').style.display = 'none';
}

// Image Preview
function previewImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const preview = document.createElement('img');
            preview.src = e.target.result;
            preview.style.maxWidth = '200px';
            preview.style.marginTop = '10px';
            
            const container = input.parentNode;
            const existingPreview = container.querySelector('img');
            if (existingPreview) {
                existingPreview.remove();
            }
            
            container.appendChild(preview);
        };
        
        reader.readAsDataURL(input.files[0]);
    }
}

// Initialize image preview for file inputs
document.addEventListener('DOMContentLoaded', function() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            previewImage(this);
        });
    });
});

// Auto-save form data
function autoSaveForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    localStorage.setItem(`form_${formId}`, JSON.stringify(data));
}

// Load auto-saved form data
function loadAutoSavedForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    const savedData = localStorage.getItem(`form_${formId}`);
    if (savedData) {
        const data = JSON.parse(savedData);
        
        Object.keys(data).forEach(key => {
            const input = form.querySelector(`[name="${key}"]`);
            if (input && input.type !== 'file') {
                input.value = data[key];
            }
        });
    }
}

// Clear auto-saved form data
function clearAutoSavedForm(formId) {
    localStorage.removeItem(`form_${formId}`);
}

// Initialize auto-save for forms
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const formId = form.id || 'form_' + Math.random().toString(36).substr(2, 9);
        form.id = formId;
        
        // Load auto-saved data
        loadAutoSavedForm(formId);
        
        // Auto-save on input change
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                autoSaveForm(formId);
            });
        });
        
        // Clear auto-saved data on successful submission
        form.addEventListener('submit', function() {
            setTimeout(() => {
                clearAutoSavedForm(formId);
            }, 1000);
        });
    });
});

// Responsive sidebar toggle
function toggleSidebar() {
    const sidebar = document.querySelector('.admin-sidebar');
    const main = document.querySelector('.admin-main');
    
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
    
    if (main) {
        main.classList.toggle('sidebar-active');
    }
}

// Add mobile menu button if needed
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.admin-header');
    
    if (header && window.innerWidth <= 1024) {
        const menuBtn = document.createElement('button');
        menuBtn.className = 'mobile-menu-btn';
        menuBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
        `;
        menuBtn.addEventListener('click', toggleSidebar);
        
        const headerContent = header.querySelector('.header-content');
        if (headerContent) {
            headerContent.insertBefore(menuBtn, headerContent.firstChild);
        }
    }
});

// Export functions to global scope
window.showNotification = showNotification;
window.deleteProduct = deleteProduct;
window.deleteGalleryItem = deleteGalleryItem;
window.deleteBlog = deleteBlog;
window.closeDeleteModal = closeDeleteModal;
window.toggleSidebar = toggleSidebar; 