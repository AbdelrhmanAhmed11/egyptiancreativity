// Profile Navigation System
console.log("🏺 Profile script starting...");

// Global wishlist functions
async function loadProfileWishlist() {
    const wishlistGrid = document.getElementById('profileWishlistGrid');
    if (!wishlistGrid) return;
    
    try {
        console.log("Loading wishlist data for profile...");
        const response = await fetch('./wishlist.php?action=get_wishlist');
        const data = await response.json();
        
        if (data.success && data.wishlist) {
            renderProfileWishlist(data.wishlist);
        } else {
            wishlistGrid.innerHTML = '<div class="wishlist-empty"><p>No items in your wishlist</p></div>';
            updateWishlistBadgeCount(0);
        }
    } catch (error) {
        console.error("Error loading wishlist:", error);
        wishlistGrid.innerHTML = '<div class="wishlist-empty"><p>Error loading wishlist</p></div>';
        updateWishlistBadgeCount(0);
    }
}

// Initialize wishlist count on page load
async function initializeWishlistCount() {
    try {
        const response = await fetch('./wishlist.php?action=get_wishlist');
        const data = await response.json();
        
        if (data.success && data.wishlist) {
            updateWishlistBadgeCount(data.wishlist.length);
        } else {
            updateWishlistBadgeCount(0);
        }
    } catch (error) {
        console.error("Error initializing wishlist count:", error);
        updateWishlistBadgeCount(0);
    }
}

// Render wishlist items in profile (legacy function - will be replaced)
function renderProfileWishlist(wishlistItems) {
    const wishlistGrid = document.getElementById('profileWishlistGrid');
    if (!wishlistGrid) return;
    
    if (!wishlistItems || wishlistItems.length === 0) {
        wishlistGrid.innerHTML = '<div class="wishlist-empty"><p>No items in your wishlist</p></div>';
        updateWishlistBadgeCount(0);
        return;
    }
    
    // Use the new rendering function with event listeners
    renderProfileWishlistWithEvents(wishlistItems);
    updateWishlistBadgeCount(wishlistItems.length);
    console.log(`Rendered ${wishlistItems.length} wishlist items in profile`);
}

// Update wishlist badge count
function updateWishlistBadgeCount(count) {
    const wishlistBadge = document.getElementById('profileWishlistBadge');
    if (wishlistBadge) {
        wishlistBadge.textContent = count;
        console.log(`Updated wishlist badge count to: ${count}`);
    }
}

// Order count function
function updateOrderBadgeCount() {
    const orderBadge = document.getElementById('profileOrderBadge');
    const overviewCount = document.getElementById('overviewOrderCount');
    
    if (orderBadge || overviewCount) {
        // Count the static orders shown in the profile
        const orderCards = document.querySelectorAll('.order-card');
        const orderCount = orderCards.length;
        
        if (orderBadge) {
            orderBadge.textContent = orderCount;
        }
        
        if (overviewCount) {
            overviewCount.textContent = orderCount;
        }
        
        console.log(`Updated order badge count to: ${orderCount}`);
    }
}

// Initialize order count on page load
function initializeOrderCount() {
    updateOrderBadgeCount();
}

// Wait for DOM to be ready
document.addEventListener("DOMContentLoaded", function() {
    console.log("🏺 DOM loaded, initializing profile...");
    
    // Test if we can find nav items
    const navItems = document.querySelectorAll('.nav-item');
    console.log("Found navigation items:", navItems.length);
    
    // Test if we can find content sections
    const sections = document.querySelectorAll('.content-section');
    console.log("Found content sections:", sections.length);
    
    // Debug: List all sections
    sections.forEach((section, index) => {
        console.log(`Section ${index + 1}: ${section.id} - Display: ${section.style.display} - Visible: ${section.offsetParent !== null}`);
    });
    
    // Simple navigation function
    window.switchSection = function(sectionName) {
        console.log("Switching to section:", sectionName);
        
        // First, hide all sections
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => {
            section.style.display = 'none';
            section.classList.remove('active');
            console.log(`Hiding section: ${section.id}`);
        });
        
        // Remove active from all nav items
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
        });
        
        // Show target section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.style.display = 'block';
            targetSection.classList.add('active');
            targetSection.style.opacity = '1';
            targetSection.style.visibility = 'visible';
            
            console.log(`Showing section: ${sectionName}`);
            console.log(`Section content length: ${targetSection.innerHTML.length}`);
            console.log(`Section children: ${targetSection.children.length}`);
            
            // Load wishlist data if switching to wishlist section
            if (sectionName === 'wishlist') {
                loadProfileWishlist();
            }
            
            // Setup address buttons if switching to addresses section
            if (sectionName === 'addresses') {
                setupAddressButtons();
            }
            
            // Scroll to the section
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            console.error("Section not found:", sectionName);
        }
        
        // Activate nav item
        const activeNav = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeNav) {
            activeNav.classList.add('active');
            console.log("Nav item activated:", activeNav.textContent.trim());
        }
    };
    
    // Add click handlers
    navItems.forEach((item, index) => {
        const sectionName = item.getAttribute('data-section');
        console.log(`Nav item ${index + 1}:`, item.textContent.trim(), "->", sectionName);
        
        item.onclick = function(e) {
      e.preventDefault();
            console.log("Clicked:", this.textContent.trim(), "->", sectionName);
            if (sectionName) {
                window.switchSection(sectionName);
            }
        };
    });
    
    // Initialize with overview section
    const overviewSection = document.getElementById('overview');
    if (overviewSection) {
        overviewSection.style.display = 'block';
        overviewSection.classList.add('active');
        console.log("✓ Overview section initialized");
    }

    // Initialize wishlist count on page load
    initializeWishlistCount();
    
    // Initialize order count on page load
    initializeOrderCount();
    
    // Setup edit address modal
    setupEditAddressModal();
    
    // Setup product details modal
    setupProductDetailsModal();
    
    console.log("🏺 Profile navigation initialized successfully!");
});

// Address management functions
let currentEditingAddress = null;

function editAddress(addressId) {
    console.log("Editing address:", addressId);
    currentEditingAddress = addressId;
    
    // Get the address card data
    const addressCard = document.querySelector(`[data-address-id="${addressId}"]`);
    if (!addressCard) return;
    
    // Extract address data from the card
    const addressBody = addressCard.querySelector('.address-body');
    const nameElement = addressBody.querySelector('p:first-child strong');
    const streetElement = addressBody.querySelector('p:nth-child(2)');
    const cityStateZipElement = addressBody.querySelector('p:nth-child(3)');
    const phoneElement = addressBody.querySelector('p:last-child');
    
    // Parse the address data
    const fullName = nameElement ? nameElement.textContent : '';
    const street = streetElement ? streetElement.textContent : '';
    const phone = phoneElement ? phoneElement.textContent.replace('Phone: ', '') : '';
    
    // Parse city, state, zip from the combined element
    let city = '', state = '', zip = '', country = '';
    if (cityStateZipElement) {
        const parts = cityStateZipElement.textContent.split(', ');
        if (parts.length >= 2) {
            city = parts[0];
            const stateZip = parts[1].split(' ');
            if (stateZip.length >= 2) {
                state = stateZip[0];
                zip = stateZip[1];
            }
            country = parts[2] || 'Egypt';
        }
    }
    
    // Fill the edit form
    document.getElementById('editAddressName').value = fullName;
    document.getElementById('editAddressPhone').value = phone;
    document.getElementById('editAddressStreet').value = street;
    document.getElementById('editAddressCity').value = city;
    document.getElementById('editAddressState').value = state;
    document.getElementById('editAddressZip').value = zip;
    document.getElementById('editAddressCountry').value = country;
    
    // Show the edit modal
    const editModal = document.getElementById('editAddressModal');
    editModal.classList.add('active');
}

function deleteAddress(addressId) {
    console.log("Deleting address:", addressId);
    if (confirm("Are you sure you want to delete this address?")) {
        // Remove the address card from the DOM
        const addressCard = document.querySelector(`[data-address-id="${addressId}"]`);
        if (addressCard) {
            addressCard.remove();
            console.log("Address deleted successfully");
            alert("Address deleted successfully!");
        }
    }
}

function setDefaultAddress(addressId) {
    console.log("Setting default address:", addressId);
    
    // Remove default status from all addresses
    const allAddressCards = document.querySelectorAll('.address-card');
    allAddressCards.forEach(card => {
        card.classList.remove('default');
        const badge = card.querySelector('.status-badge');
        if (badge) {
            badge.textContent = '';
            badge.style.display = 'none';
        }
        
        // Add "Set as Default" button to all cards
        const actions = card.querySelector('.address-actions');
        const existingSetDefault = actions.querySelector('.set-default-address');
        if (!existingSetDefault) {
            const setDefaultBtn = document.createElement('button');
            setDefaultBtn.className = 'btn btn-warning set-default-address';
            setDefaultBtn.textContent = 'Set as Default';
            setDefaultBtn.onclick = function() {
                const cardId = this.closest('.address-card').getAttribute('data-address-id');
                setDefaultAddress(cardId);
            };
            actions.appendChild(setDefaultBtn);
        }
    });
    
    // Set the selected address as default
    const selectedCard = document.querySelector(`[data-address-id="${addressId}"]`);
    if (selectedCard) {
        selectedCard.classList.add('default');
        
        // Add or update the default badge
        let badge = selectedCard.querySelector('.status-badge');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'status-badge';
            selectedCard.querySelector('.address-header').appendChild(badge);
        }
        badge.textContent = 'Default';
        badge.style.display = 'inline-block';
        
        // Remove "Set as Default" button from the default card
        const setDefaultBtn = selectedCard.querySelector('.set-default-address');
        if (setDefaultBtn) {
            setDefaultBtn.remove();
        }
        
        console.log("Default address set successfully");
        alert("Default address set successfully!");
    }
}

// Setup edit address modal
function setupEditAddressModal() {
    const editModal = document.getElementById('editAddressModal');
    const editBackdrop = document.getElementById('editAddressBackdrop');
    const editClose = document.getElementById('editAddressClose');
    const cancelEdit = document.getElementById('cancelEditAddress');
    const editForm = document.getElementById('editAddressForm');
    
    // Close modal functions
    function closeEditModal() {
        editModal.classList.remove('active');
        currentEditingAddress = null;
    }
    
    // Event listeners
    editBackdrop.addEventListener('click', closeEditModal);
    editClose.addEventListener('click', closeEditModal);
    cancelEdit.addEventListener('click', closeEditModal);
    
    // Handle form submission
    editForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!currentEditingAddress) return;
        
        // Get form data
        const formData = new FormData(editForm);
        const addressData = {
            fullName: formData.get('fullName'),
            phone: formData.get('phone'),
            street: formData.get('street'),
            city: formData.get('city'),
            state: formData.get('state'),
            zip: formData.get('zip'),
            country: formData.get('country')
        };
        
        // Update the address card
        updateAddressCard(currentEditingAddress, addressData);
        
        closeEditModal();
        alert("Address updated successfully!");
    });
}

// Update address card with new data
function updateAddressCard(addressId, addressData) {
    const addressCard = document.querySelector(`[data-address-id="${addressId}"]`);
    if (!addressCard) return;
    
    const addressBody = addressCard.querySelector('.address-body');
    addressBody.innerHTML = `
        <p><strong>${addressData.fullName}</strong></p>
        <p>${addressData.street}</p>
        <p>${addressData.city}, ${addressData.state} ${addressData.zip}</p>
        <p>Phone: ${addressData.phone}</p>
    `;
}

// Add click handlers for address buttons
function setupAddressButtons() {
    // Edit buttons
    const editButtons = document.querySelectorAll('.edit-address-btn');
    editButtons.forEach((button, index) => {
        button.onclick = function() {
            const addressId = this.closest('.address-card').getAttribute('data-address-id') || `address-${index + 1}`;
            editAddress(addressId);
        };
    });
    
    // Delete buttons
    const deleteButtons = document.querySelectorAll('.address-actions .btn-danger');
    deleteButtons.forEach((button, index) => {
        button.onclick = function() {
            const addressId = this.closest('.address-card').getAttribute('data-address-id') || `address-${index + 1}`;
            deleteAddress(addressId);
        };
    });
    
    // Set as Default buttons
    const setDefaultButtons = document.querySelectorAll('.set-default-address');
    setDefaultButtons.forEach((button, index) => {
        button.onclick = function() {
            const addressId = this.closest('.address-card').getAttribute('data-address-id') || `address-${index + 1}`;
            setDefaultAddress(addressId);
        };
    });
}

// Wishlist helper functions
async function removeFromWishlist(productId) {
    try {
        const response = await fetch('./wishlist.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=remove_from_wishlist&product_id=${productId}`
        });
        
        const data = await response.json();
        if (data.success) {
            // Reload wishlist data
            loadProfileWishlist();
            console.log("Item removed from wishlist successfully");
        }
    } catch (error) {
        console.error("Error removing from wishlist:", error);
    }
}

async function addToCart(productId) {
    try {
        const response = await fetch('./cart.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=add_to_cart&product_id=${productId}&quantity=1`
        });
        
        const data = await response.json();
        if (data.success) {
            // Update cart badge
            updateCartBadge();
            alert("Item added to cart!");
        }
    } catch (error) {
        console.error("Error adding to cart:", error);
    }
}

function viewProduct(productId) {
    // Navigate to product details page
    window.location.href = `shop.php?product=${productId}`;
}

function updateWishlistBadge() {
    // Update wishlist badge in profile sidebar
    const wishlistBadge = document.getElementById('profileWishlistBadge');
    if (wishlistBadge) {
        // This would be updated based on actual wishlist count
        // For now, we'll just reload the wishlist data
        loadProfileWishlist();
    }
}

function updateCartBadge() {
    // Update cart badge - this would be handled by the main cart system
    console.log("Cart updated");
}

// Global functions for wishlist and cart operations
window.addToCart = function(productData) {
    console.log("Global addToCart called with:", productData);
    
    // Add to localStorage cart
    const cart = JSON.parse(localStorage.getItem('egyptianLuxuryCart') || '[]');
    const existingItem = cart.find(item => item.id === productData.id);
    
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        cart.push({
            id: productData.id,
            name: productData.name || productData.title,
            price: productData.price,
            image: productData.image,
            quantity: 1
        });
    }
    
    localStorage.setItem('egyptianLuxuryCart', JSON.stringify(cart));
    
    // Update cart sidebar if available
    if (typeof window.renderCartSidebar === 'function') {
        window.renderCartSidebar(cart);
    }
    
    // Update cart badge
    const cartBadge = document.querySelector('.header-icon[data-target="cart"] .badge');
    if (cartBadge) {
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'block' : 'none';
    }
};

window.removeFromWishlist = function(productId) {
    console.log("Global removeFromWishlist called with:", productId);
    
    // Remove from localStorage wishlist
    const wishlist = JSON.parse(localStorage.getItem('egyptianLuxuryWishlist') || '[]');
    const updatedWishlist = wishlist.filter(item => item.id !== productId);
    localStorage.setItem('egyptianLuxuryWishlist', JSON.stringify(updatedWishlist));
    
    // Update wishlist sidebar if available
    if (typeof window.renderWishlistSidebar === 'function') {
        window.renderWishlistSidebar(updatedWishlist);
    }
    
    // Update wishlist badge
    const wishlistBadge = document.querySelector('.header-icon[data-target="wishlist"] .badge');
    if (wishlistBadge) {
        wishlistBadge.textContent = updatedWishlist.length;
        wishlistBadge.style.display = updatedWishlist.length > 0 ? 'block' : 'none';
    }
    
    // Update profile wishlist badge
    updateWishlistBadgeCount(updatedWishlist.length);
};

// Product details modal functionality
let currentProductDetails = null;

function showProductDetails(productData) {
    console.log("Showing product details:", productData);
    currentProductDetails = productData;
    
    // Fill the modal with product data
    document.getElementById('productDetailImage').src = productData.image || 'images/4-5-scaled.jpg';
    document.getElementById('productDetailName').textContent = productData.name || productData.title || 'Product Name';
    document.getElementById('productDetailDescription').textContent = productData.description || 'Ancient Egyptian artifact with rich cultural significance.';
    document.getElementById('productDetailPrice').textContent = productData.price || '$2,850';
    
    // Show the modal
    const productModal = document.getElementById('productDetailsModal');
    productModal.classList.add('active');
}

function setupProductDetailsModal() {
    const productModal = document.getElementById('productDetailsModal');
    const productBackdrop = document.getElementById('productDetailsBackdrop');
    const productClose = document.getElementById('productDetailsClose');
    
    // Close modal functions
    function closeProductModal() {
        productModal.classList.remove('active');
        currentProductDetails = null;
    }
    
    // Event listeners
    productBackdrop.addEventListener('click', closeProductModal);
    productClose.addEventListener('click', closeProductModal);
    
    // Add to cart from details modal
    document.getElementById('addToCartFromDetails').addEventListener('click', function() {
        if (currentProductDetails) {
            addToCartFromDetails(currentProductDetails);
        }
    });
    
    // Remove from wishlist from details modal
    document.getElementById('removeFromWishlistFromDetails').addEventListener('click', function() {
        if (currentProductDetails) {
            removeFromWishlistFromDetails(currentProductDetails);
        }
    });
}

async function addToCartFromDetails(productData) {
    console.log("Adding to cart from details:", productData);
    
    try {
        // Call backend API to add to cart
        const response = await fetch('./cart.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'add_to_cart',
                product_id: productData.product_id,
                quantity: 1
            })
        });
        
        const data = await response.json();
        if (data.success) {
            console.log("Item added to cart successfully");
            
            // Update cart badge
            const cartBadge = document.querySelector('.header-icon[data-target="cart"] .badge');
            if (cartBadge) {
                // Get updated count from the cart
                const cartResponse = await fetch('./cart.php?action=get_cart');
                const cartData = await cartResponse.json();
                if (cartData.success && cartData.cart) {
                    const totalItems = cartData.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
                    cartBadge.textContent = totalItems;
                    cartBadge.style.display = totalItems > 0 ? 'block' : 'none';
                }
            }
            
            alert("Product added to cart successfully!");
            
            // Close the modal
            document.getElementById('productDetailsModal').classList.remove('active');
            currentProductDetails = null;
        } else {
            console.error("Failed to add to cart:", data.message);
            alert("Failed to add item to cart. Please try again.");
        }
    } catch (error) {
        console.error("Error adding to cart:", error);
        alert("Error adding item to cart. Please try again.");
    }
}

async function removeFromWishlistFromDetails(productData) {
    console.log("Removing from wishlist from details:", productData);
    
    if (confirm("Are you sure you want to remove this item from your wishlist?")) {
        try {
            // Call backend API to remove from wishlist
            const response = await fetch('./wishlist.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'remove_from_wishlist',
                    product_id: productData.product_id
                })
            });
            
            const data = await response.json();
            if (data.success) {
                console.log("Item removed from wishlist successfully");
                
                // Close the modal
                document.getElementById('productDetailsModal').classList.remove('active');
                currentProductDetails = null;
                
                // Refresh the wishlist display
                loadProfileWishlist();
                
                // Update wishlist badge
                const wishlistBadge = document.querySelector('.header-icon[data-target="wishlist"] .badge');
                if (wishlistBadge) {
                    // Get updated count from the refreshed wishlist
                    setTimeout(() => {
                        const wishlistItems = document.querySelectorAll('.wishlist-item');
                        wishlistBadge.textContent = wishlistItems.length;
                        wishlistBadge.style.display = wishlistItems.length > 0 ? 'block' : 'none';
                    }, 100);
                }
                
                alert("Item removed from wishlist!");
    } else {
                console.error("Failed to remove from wishlist:", data.message);
                alert("Failed to remove item from wishlist. Please try again.");
            }
        } catch (error) {
            console.error("Error removing from wishlist:", error);
            alert("Error removing item from wishlist. Please try again.");
        }
    }
}

// Update the renderProfileWishlist function to include view details functionality
function renderProfileWishlistWithEvents(wishlistItems) {
    const container = document.getElementById('profileWishlistGrid');
    if (!container) return;
    
    if (!wishlistItems || wishlistItems.length === 0) {
        container.innerHTML = `
            <div class="wishlist-empty">
                <div class="empty-icon">📜</div>
                <h4>Your Wishlist is Empty</h4>
                <p>Start exploring our ancient treasures and add items to your wishlist.</p>
        </div>
      `;
    return;
  }

    container.innerHTML = wishlistItems.map((item, index) => `
        <div class="wishlist-item" data-product-id="${item.id}" data-product-index="${index}">
      <div class="item-image">
                <img src="${item.image || 'images/4-5-scaled.jpg'}" alt="${item.name || item.title}">
                <button class="remove-wishlist" data-product-id="${item.id}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="item-content">
                <h3>${item.name || item.title}</h3>
                <p>${item.description || 'Ancient Egyptian artifact with rich cultural significance.'}</p>
                <div class="item-price">${item.price || '$2,850'}</div>
        <div class="item-actions">
                    <button class="btn btn-primary add-to-cart-btn" data-product-id="${item.id}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        Add to Cart
                    </button>
                    <button class="btn btn-outline view-details-btn" data-product-index="${index}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                        </svg>
                        View Details
                    </button>
        </div>
      </div>
        </div>
    `).join('');
    
    // Add event listeners after rendering
    setupWishlistEventListeners(wishlistItems);
}

// Setup event listeners for wishlist items
function setupWishlistEventListeners(wishlistItems) {
    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            const product = wishlistItems.find(item => item.id == productId);
            if (product) {
                addToCartFromWishlist(product);
            }
        });
    });
    
    // View details buttons
    const viewDetailsButtons = document.querySelectorAll('.view-details-btn');
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productIndex = this.getAttribute('data-product-index');
            const product = wishlistItems[productIndex];
            if (product) {
                showProductDetails(product);
            }
        });
    });
    
    // Remove from wishlist buttons (X icons)
    const removeButtons = document.querySelectorAll('.remove-wishlist');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            const product = wishlistItems.find(item => item.id == productId);
            if (product) {
                // Use product_id instead of id for the backend
                removeFromWishlistFromWishlist(product.product_id);
            }
        });
    });
}

// Add to cart from wishlist
async function addToCartFromWishlist(product) {
    console.log("Adding to cart from wishlist:", product);
    
    try {
        // Call backend API to add to cart
        const response = await fetch('./cart.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'add_to_cart',
                product_id: product.product_id,
        quantity: 1
      })
    });

    const data = await response.json();
    if (data.success) {
            console.log("Item added to cart successfully");
            
            // Update cart badge
            const cartBadge = document.querySelector('.header-icon[data-target="cart"] .badge');
            if (cartBadge) {
                // Get updated count from the cart
                const cartResponse = await fetch('./cart.php?action=get_cart');
                const cartData = await cartResponse.json();
                if (cartData.success && cartData.cart) {
                    const totalItems = cartData.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
                    cartBadge.textContent = totalItems;
                    cartBadge.style.display = totalItems > 0 ? 'block' : 'none';
                }
            }
            
            alert("Product added to cart successfully!");
    } else {
            console.error("Failed to add to cart:", data.message);
            alert("Failed to add item to cart. Please try again.");
    }
  } catch (error) {
        console.error("Error adding to cart:", error);
        alert("Error adding item to cart. Please try again.");
    }
}

// Remove from wishlist
async function removeFromWishlistFromWishlist(productId) {
    console.log("Removing from wishlist:", productId);
    
    if (confirm("Are you sure you want to remove this item from your wishlist?")) {
        try {
            // Call backend API to remove from wishlist
            const response = await fetch('./wishlist.php', {
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
                console.log("Item removed from wishlist successfully");
                
                // Refresh the wishlist display
                loadProfileWishlist();
                
                // Update wishlist badge
                const wishlistBadge = document.querySelector('.header-icon[data-target="wishlist"] .badge');
                if (wishlistBadge) {
                    // Get updated count from the refreshed wishlist
                    setTimeout(() => {
                        const wishlistItems = document.querySelectorAll('.wishlist-item');
                        wishlistBadge.textContent = wishlistItems.length;
                        wishlistBadge.style.display = wishlistItems.length > 0 ? 'block' : 'none';
                    }, 100);
                }
                
                alert("Item removed from wishlist!");
    } else {
                console.error("Failed to remove from wishlist:", data.message);
                alert("Failed to remove item from wishlist. Please try again.");
    }
  } catch (error) {
            console.error("Error removing from wishlist:", error);
            alert("Error removing item from wishlist. Please try again.");
        }
    }
}

// --- Order History: Track Order & View Details ---
document.addEventListener('DOMContentLoaded', function() {
    // Attach event listeners after DOM is loaded
    setupOrderHistoryButtons();
});

function setupOrderHistoryButtons() {
    // Track Order buttons
    Array.from(document.querySelectorAll('.order-card .order-actions .btn')).filter(btn => btn.textContent.trim().toLowerCase() === 'track order').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderCard = btn.closest('.order-card');
            const orderNumber = orderCard.querySelector('.order-info h3').textContent.trim();
            openTrackOrderModal(orderNumber);
        });
    });
    // View Details buttons
    Array.from(document.querySelectorAll('.order-card .order-actions .btn')).filter(btn => btn.textContent.trim().toLowerCase() === 'view details').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderCard = btn.closest('.order-card');
            const orderNumber = orderCard.querySelector('.order-info h3').textContent.trim();
            openOrderDetailsModal(orderNumber);
        });
    });
}

function openTrackOrderModal(orderNumber) {
    const modal = document.getElementById('orderTrackingModal');
    const body = document.getElementById('orderTrackingBody');
    body.innerHTML = '<div class="loading-spinner"></div> Loading tracking info...';
    modal.classList.add('active');
    // Fetch tracking info from backend
    fetch(`profile.php?action=get_order_tracking&order_number=${encodeURIComponent(orderNumber)}`)
        .then(res => res.json())
        .then(data => {
            if (data.success && data.tracking) {
                body.innerHTML = `<h4>Status: ${data.tracking.status}</h4><p>${data.tracking.details}</p>`;
            } else {
                body.innerHTML = '<p>No tracking info found for this order.</p>';
            }
        })
        .catch(() => {
            body.innerHTML = '<p>Error loading tracking info.</p>';
        });
    // Close modal logic
    document.getElementById('orderTrackingClose').onclick = () => modal.classList.remove('active');
    document.getElementById('orderTrackingBackdrop').onclick = () => modal.classList.remove('active');
}

function openOrderDetailsModal(orderNumber) {
    const modal = document.getElementById('orderDetailsModal');
    const body = document.getElementById('orderDetailsBody');
    body.innerHTML = '<div class="loading-spinner"></div> Loading order details...';
    modal.classList.add('active');
    // Fetch order details from backend
    fetch(`profile.php?action=get_order_details&order_number=${encodeURIComponent(orderNumber)}`)
        .then(res => res.json())
        .then(data => {
            if (data.success && data.order) {
                let html = `<h4>Order #${data.order.order_number}</h4>`;
                html += `<p>Placed on: ${data.order.placed_on}</p>`;
                html += `<p>Status: ${data.order.status}</p>`;
                html += '<ul>';
                data.order.items.forEach(item => {
                    html += `<li>${item.name} x${item.quantity} - $${item.price}</li>`;
                });
                html += '</ul>';
                html += `<p>Total: $${data.order.total}</p>`;
                body.innerHTML = html;
            } else {
                body.innerHTML = '<p>No details found for this order.</p>';
            }
        })
        .catch(() => {
            body.innerHTML = '<p>Error loading order details.</p>';
        });
    // Close modal logic
    document.getElementById('orderDetailsClose').onclick = () => modal.classList.remove('active');
    document.getElementById('orderDetailsBackdrop').onclick = () => modal.classList.remove('active');
}