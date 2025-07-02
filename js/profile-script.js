// Egyptian Creativity - Enhanced Profile Script with Index Page Integration

// Global Variables
let currentUser = null;
let currentSection = "overview";
let cart = JSON.parse(localStorage.getItem('egyptianLuxuryCart')) || [];
let wishlist = JSON.parse(localStorage.getItem('egyptianWishlist')) || [];
let editingAddressId = null;
let editingPaymentId = null;

// Sample data for demo
const sampleAddresses = [
  {
    id: 1,
    name: "Home Address",
    fullName: "John Doe",
    street: "123 Pyramid Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States",
    phone: "+1 (555) 123-4567",
    isDefault: true,
  },
  {
    id: 2,
    name: "Office Address",
    fullName: "John Doe",
    street: "456 Business Ave",
    city: "New York",
    state: "NY",
    zipCode: "10002",
    country: "United States",
    phone: "+1 (555) 987-6543",
    isDefault: false,
  },
];

const samplePaymentMethods = [
  {
    id: 1,
    type: "Visa",
    number: "•••• •••• •••• 4567",
    expiry: "12/26",
    isDefault: true,
  },
  {
    id: 2,
    type: "Mastercard",
    number: "•••• •••• •••• 8901",
    expiry: "08/25",
    isDefault: false,
  },
];

// Initialize the profile page
document.addEventListener("DOMContentLoaded", () => {
  console.log("🏺 Egyptian Creativity Profile - Initializing...");

  // Loading Animation
  initializeLoading();

  // Initialize Navigation
  initializeNavigation();

  // Load user data
  loadUserData();

  // Setup event listeners
  setupEventListeners();

  // Initialize sections
  initializeSections();

  // Update cart and wishlist badges
  updateBadges();

  // Initialize Search Modal
  initializeSearchModal();

  // Add event listeners for order actions
  setupOrderActionModals();

  // Render wishlist section
  renderWishlistSection();

  // Ensure sidebars are closed by default
  ensureSidebarsClosed();

  console.log("🏺 Egyptian Creativity Profile - Loaded successfully!");
});

// Initialize loading animation
function initializeLoading() {
  const loadingOverlay = document.getElementById('loadingOverlay');
  const progressBar = document.querySelector('.progress-bar');
  const skipBtn = document.getElementById('skipBtn');
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress > 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => hideLoading(), 500);
    }
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }
  }, 150);

  // Skip button
  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      clearInterval(interval);
      hideLoading();
    });
  }

  // Auto hide after 3 seconds
  setTimeout(() => {
    if (!loadingOverlay.classList.contains('hidden')) {
      clearInterval(interval);
      hideLoading();
    }
  }, 3000);
}

function hideLoading() {
  const loadingOverlay = document.getElementById('loadingOverlay');
  if (loadingOverlay) {
    loadingOverlay.classList.add('hidden');
    setTimeout(() => {
      loadingOverlay.style.display = 'none';
    }, 1000);
  }
}

// Initialize Navigation
function initializeNavigation() {
  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
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

// Load user data from storage
function loadUserData() {
  const savedUser = localStorage.getItem("egyptianTreasuresUser") || sessionStorage.getItem("egyptianTreasuresUser");

  if (savedUser) {
    try {
      currentUser = JSON.parse(savedUser);
      updateProfileDisplay();
    } catch (error) {
      console.error("Error parsing user data:", error);
      // Create demo user for showcase
      currentUser = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
      };
      updateProfileDisplay();
    }
  } else {
    // Create demo user for showcase
    currentUser = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
    };
    updateProfileDisplay();
  }
}

// Update profile display with user data
function updateProfileDisplay() {
  if (!currentUser) return;

  // Update profile name and email with animation
  const profileName = document.getElementById("profileName");
  const profileEmail = document.getElementById("profileEmail");

  if (profileName) {
    const fullName =
      currentUser.firstName && currentUser.lastName
        ? `${currentUser.firstName} ${currentUser.lastName}`
        : currentUser.email.split("@")[0];

    // Animate text change
    profileName.style.opacity = "0";
    setTimeout(() => {
      profileName.textContent = fullName;
      profileName.style.opacity = "1";
    }, 200);
  }

  if (profileEmail) {
    profileEmail.style.opacity = "0";
    setTimeout(() => {
      profileEmail.textContent = currentUser.email;
      profileEmail.style.opacity = "1";
    }, 300);
  }

  // Load saved avatar image if available
  const avatarImage = document.getElementById("avatarImage");
  const savedAvatar = localStorage.getItem("egyptianTreasuresAvatar");
  if (avatarImage && savedAvatar) {
    avatarImage.innerHTML = `<img src="${savedAvatar}" alt="Profile picture" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
  }

  // Update form fields if on personal info section
  updatePersonalInfoForm();
}

// Update personal info form with user data
function updatePersonalInfoForm() {
  if (!currentUser) return;

  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");

  if (firstName && currentUser.firstName) {
    firstName.value = currentUser.firstName;
  }
  if (lastName && currentUser.lastName) {
    lastName.value = currentUser.lastName;
  }
  if (email) {
    email.value = currentUser.email;
  }
  if (phone && currentUser.phone) {
    phone.value = currentUser.phone;
  }
}

// Setup event listeners
function setupEventListeners() {
  // Navigation items
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const section = item.getAttribute("data-section");
      if (section) {
        switchSection(section);
      }
    });
  });

  // Avatar upload
  const avatarUpload = document.getElementById("avatarUpload");
  if (avatarUpload) {
    avatarUpload.addEventListener("click", openAvatarModal);
  }

  // Modal controls
  const avatarClose = document.getElementById("avatarClose");
  const avatarBackdrop = document.getElementById("avatarBackdrop");
  const selectImageBtn = document.getElementById("selectImageBtn");
  const saveAvatar = document.getElementById("saveAvatar");
  const avatarFileInput = document.getElementById("avatarFileInput");

  if (avatarClose) avatarClose.addEventListener("click", closeAvatarModal);
  if (avatarBackdrop)
    avatarBackdrop.addEventListener("click", (e) => {
      if (e.target === avatarBackdrop) closeAvatarModal();
    });
  if (selectImageBtn) selectImageBtn.addEventListener("click", () => avatarFileInput?.click());
  if (saveAvatar) saveAvatar.addEventListener("click", handleAvatarSave);
  if (avatarFileInput) avatarFileInput.addEventListener("change", handleAvatarPreview);

  // Form submissions
  const personalInfoForm = document.getElementById("personalInfoForm");
  if (personalInfoForm) {
    personalInfoForm.addEventListener("submit", handlePersonalInfoSubmit);
  }

  // Add event listeners for new buttons
  const addAddressBtn = document.getElementById('addAddressBtn');
  if (addAddressBtn) {
    addAddressBtn.addEventListener('click', () => {
      openAddressModal();
    });
  }

  const addPaymentBtn = document.getElementById('addPaymentBtn');
  if (addPaymentBtn) {
    addPaymentBtn.addEventListener('click', () => {
      openPaymentModal();
    });
  }

  // Modal event listeners
  setupModalEventListeners();

  // Header actions
  const searchBtn = document.getElementById('searchBtn');
  const userBtn = document.getElementById('userBtn');
  const wishlistBtn = document.getElementById('wishlistBtn');
  const cartBtn = document.getElementById('cartBtn');
  const cartSidebar = document.getElementById('cartSidebar');
  const wishlistSidebar = document.getElementById('wishlistSidebar');
  const cartClose = document.getElementById('cartClose');
  const wishlistClose = document.getElementById('wishlistClose');
  const cartBackdrop = cartSidebar?.querySelector('.sidebar-content');
  const wishlistBackdrop = wishlistSidebar?.querySelector('.sidebar-content');

  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      // Already on profile page, scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (userBtn) {
    userBtn.addEventListener('click', () => {
      // Already on profile page, scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (wishlistBtn && wishlistSidebar) {
    wishlistBtn.addEventListener('click', () => {
      renderWishlistSidebar();
      wishlistSidebar.classList.add('active');
    });
  }
  if (cartBtn && cartSidebar) {
    cartBtn.addEventListener('click', () => {
      renderCartSidebar();
      cartSidebar.classList.add('active');
    });
  }
  if (cartClose && cartSidebar) {
    cartClose.addEventListener('click', () => {
      cartSidebar.classList.remove('active');
    });
  }
  if (wishlistClose && wishlistSidebar) {
    wishlistClose.addEventListener('click', () => {
      wishlistSidebar.classList.remove('active');
    });
  }
  if (cartBackdrop && cartSidebar) {
    cartBackdrop.addEventListener('click', (e) => {
      if (e.target === cartBackdrop) cartSidebar.classList.remove('active');
    });
  }
  if (wishlistBackdrop && wishlistSidebar) {
    wishlistBackdrop.addEventListener('click', (e) => {
      if (e.target === wishlistBackdrop) wishlistSidebar.classList.remove('active');
    });
  }
}

// Switch between sections
function switchSection(sectionName) {
  // Update navigation
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((item) => {
    item.classList.remove("active");
    if (item.getAttribute("data-section") === sectionName) {
      item.classList.add("active");
    }
  });

  // Update content sections
  const contentSections = document.querySelectorAll(".content-section");
  contentSections.forEach((section) => {
    section.classList.remove("active");
    section.style.display = "none";
  });

  const targetSection = document.getElementById(sectionName);
  if (targetSection) {
    targetSection.classList.add("active");
    targetSection.style.display = "block";
    targetSection.style.opacity = "0";
    targetSection.style.transform = "translateY(20px)";
    setTimeout(() => {
      targetSection.style.opacity = "1";
      targetSection.style.transform = "translateY(0)";
      // Scroll into view for mobile
      targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
    currentSection = sectionName;
  }
}

// Initialize sections
function initializeSections() {
  // Set overview as default active section
  switchSection("overview");

  // Render content for all sections
  renderAddresses();
  renderPaymentMethods();
  renderPreferences();
}

// Render addresses section
function renderAddresses() {
  const addressesSection = document.getElementById("addresses");
  if (!addressesSection) return;

  // Sort addresses: default first
  const sortedAddresses = [...sampleAddresses].sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));

  // Clear previous content to re-render
  const existingList = addressesSection.querySelector('.address-list');
  if (existingList) {
    existingList.remove();
  }

  let content = `<div class="address-list" style="display: flex; flex-wrap: wrap; gap: 2rem;">`;

  if (sortedAddresses.length > 0) {
    sortedAddresses.forEach(address => {
      content += `
        <div class="address-card${address.isDefault ? ' default' : ''}" data-id="${address.id}" style="flex: 1 1 350px; max-width: 420px; min-width: 320px; background: rgba(255,255,255,0.06); border-radius: 18px; border: 2.5px solid ${address.isDefault ? 'var(--pyramid-gold)' : 'rgba(203,138,88,0.3)'}; box-shadow: ${address.isDefault ? '0 0 32px 0 rgba(255,215,0,0.18)' : '0 8px 32px rgba(24,28,58,0.10)'}; position: relative; padding: 3.5rem 1.5rem 1.5rem 1.5rem; margin-bottom: 1.5rem; transition: box-shadow 0.3s;">
          ${(address.isDefault ? '<span class=\"status-badge\" style=\"position: absolute; top: 1.2rem; right: 1.5rem; background: rgba(255,215,0,0.18); color: var(--pyramid-gold); font-weight: bold; border-radius: 18px; padding: 0.3rem 1.8rem 0.3rem 1.2rem; font-size: 1.1rem; letter-spacing: 1px; z-index:2; box-shadow:0 0 0 2px var(--pyramid-gold);\">DEFAULT</span>' : '')}
          <div class="address-header" style="display: flex; align-items: flex-start; justify-content: flex-start;">
            <h4 style="color: var(--pyramid-gold); font-size: 2rem; font-family: var(--font-primary); font-weight: bold; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 1.2rem; padding-right: 8rem;">${address.name}</h4>
          </div>
          <div class="address-body" style="margin-bottom: 2rem;">
            <p style="font-weight: bold; color: var(--text-light); font-size: 1.1rem; margin-bottom: 0.5rem;">${address.fullName}</p>
            <p style="color: var(--text-light);">${address.street}</p>
            <p style="color: var(--text-light);">${address.city}, ${address.state} ${address.zipCode}</p>
            <p style="color: var(--text-light);">${address.country}</p>
            <p style="color: var(--text-light);">Phone: ${address.phone}</p>
          </div>
          <div class="address-actions" style="display: flex; flex-direction: column; flex-wrap: nowrap; gap: 1.2rem;">
            ${[ 
              `<button class=\"btn btn-outline edit-address\" data-id=\"${address.id}\" style=\"min-width: 110px; font-size: 1.1rem; border: 2px solid var(--pyramid-gold); color: var(--pyramid-gold); background: transparent; border-radius: 14px; padding: 0.7rem 1.5rem; font-weight: bold;\">Edit</button>`,
              `<button class=\"btn btn-outline btn-danger remove-address\" data-id=\"${address.id}\" style=\"min-width: 110px; font-size: 1.1rem; border: 2px solid var(--pyramid-gold); color: var(--pyramid-gold); background: transparent; border-radius: 14px; padding: 0.7rem 1.5rem; font-weight: bold;\">Remove</button>`,
              !address.isDefault 
                ? `<button class=\"btn btn-outline set-default-address\" data-id=\"${address.id}\" style=\"width: 100%; font-size: 1.1rem; border: 2px solid var(--pyramid-gold); color: var(--pyramid-gold); background: transparent; border-radius: 14px; padding: 0.7rem 1.5rem; font-weight: bold;\">Set as Default</button>`
                : `<button class=\"btn btn-outline btn-warning remove-default-address\" data-id=\"${address.id}\" style=\"width: 100%; font-size: 1.1rem; border: 2px solid var(--pyramid-gold); color: var(--pyramid-gold); background: transparent; border-radius: 14px; padding: 0.7rem 1.5rem; font-weight: bold;\">Remove Default</button>`
            ].join('')}
          </div>
        </div>
      `;
    });
  } else {
    content += `
      <div class="empty-state">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        <h4>No addresses found</h4>
        <p>Add a new address to get started with faster checkout.</p>
      </div>
    `;
  }

  content += `</div>`;
  const sectionHeader = addressesSection.querySelector('.section-header');
  if(sectionHeader){
    sectionHeader.insertAdjacentHTML('afterend', content);
  }

  // Add event listeners for address actions
  document.querySelectorAll('.edit-address').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = Number(btn.getAttribute('data-id'));
      openEditAddressModal(id);
    });
  });
  document.querySelectorAll('.remove-address').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = Number(btn.getAttribute('data-id'));
      removeAddress(id);
    });
  });
  document.querySelectorAll('.set-default-address').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = Number(btn.getAttribute('data-id'));
      setDefaultAddress(id);
    });
  });
  document.querySelectorAll('.remove-default-address').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = Number(btn.getAttribute('data-id'));
      removeDefaultAddress(id);
    });
  });
}

function openEditAddressModal(id) {
  const address = sampleAddresses.find(a => a.id === id);
  if (!address) return;
  editingAddressId = id;
  document.getElementById('addressName').value = address.name;
  document.getElementById('addressFullName').value = address.fullName;
  document.getElementById('addressStreet').value = address.street;
  document.getElementById('addressCity').value = address.city;
  document.getElementById('addressState').value = address.state;
  document.getElementById('addressZip').value = address.zipCode;
  document.getElementById('addressCountry').value = address.country;
  document.getElementById('addressPhone').value = address.phone;
  openAddressModal();
  document.querySelector('#addressModal .modal-header h3').textContent = 'Edit Address';
}

function removeAddress(id) {
  const idx = sampleAddresses.findIndex(a => a.id === id);
  if (idx !== -1) {
    sampleAddresses.splice(idx, 1);
    renderAddresses();
    showNotification('Address removed!', 'success');
  }
}

function setDefaultAddress(id) {
  sampleAddresses.forEach(a => a.isDefault = false);
  const address = sampleAddresses.find(a => a.id === id);
  if (address) address.isDefault = true;
  renderAddresses();
  showNotification('Default address updated!', 'success');
}

function removeDefaultAddress(id) {
  const address = sampleAddresses.find(a => a.id === id);
  if (address && address.isDefault) {
    address.isDefault = false;
    renderAddresses();
    showNotification('Default address removed!', 'info');
  }
}

// Render payment methods section
function renderPaymentMethods() {
  const paymentSection = document.getElementById("payment");
  if (!paymentSection) return;

  // Sort payment methods: default first
  const sortedPayments = [...samplePaymentMethods].sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));

  // Clear previous content to re-render
  const existingList = paymentSection.querySelector('.payment-methods-list');
  if (existingList) {
    existingList.remove();
  }

  let content = `<div class="payment-methods-list redesigned">`;

  if (sortedPayments.length > 0) {
    sortedPayments.forEach(method => {
      const brandIcon = method.type === 'VISA' ? `<svg class='card-icon' width='40' height='40' viewBox='0 0 40 40'><rect width='40' height='40' rx='8' fill='rgba(255,255,255,0.08)'/><text x='20' y='26' text-anchor='middle' font-size='18' fill='#FFD700' font-family='Cinzel, serif'>VISA</text></svg>` : `<svg class='card-icon' width='40' height='40' viewBox='0 0 40 40'><rect width='40' height='40' rx='8' fill='rgba(255,255,255,0.08)'/><text x='20' y='26' text-anchor='middle' font-size='14' fill='#FFD700' font-family='Cinzel, serif'>MASTERCARD</text></svg>`;
      content += `
        <div class="payment-method-card redesigned ${method.isDefault ? 'default' : ''}" data-id="${method.id}">
          <div class="pm-card-header">
            ${brandIcon}
            <span class="pm-card-brand">${method.type}</span>
          </div>
          <div class="pm-card-number">•••• •••• •••• ${method.number.slice(-4)}</div>
          <div class="pm-card-expiry">Expires ${method.expiry}</div>
          <div class="pm-card-actions">
            <button class="pm-btn edit-payment" data-id="${method.id}">Edit</button>
            <button class="pm-btn pm-btn-danger remove-payment" data-id="${method.id}">Remove</button>
            ${!method.isDefault ? `<button class="pm-btn pm-btn-default set-default-payment" data-id="${method.id}">Set as Default</button>` : `<button class="pm-btn pm-btn-warning remove-default-payment" data-id="${method.id}" disabled>Default</button>`}
          </div>
        </div>
      `;
    });
  } else {
    content += `
      <div class="empty-state">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
        <h4>No payment methods found</h4>
        <p>Add a new payment method for seamless transactions.</p>
      </div>
    `;
  }
  content += `</div>`;

  const sectionHeader = paymentSection.querySelector('.section-header');
  if(sectionHeader){
    sectionHeader.insertAdjacentHTML('afterend', content);
  }

  // Add event listeners for payment actions
  document.querySelectorAll('.edit-payment').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = Number(btn.getAttribute('data-id'));
      openEditPaymentModal(id);
    });
  });
  document.querySelectorAll('.remove-payment').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = Number(btn.getAttribute('data-id'));
      removePayment(id);
    });
  });
  document.querySelectorAll('.set-default-payment').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = Number(btn.getAttribute('data-id'));
      setDefaultPayment(id);
    });
  });
  document.querySelectorAll('.remove-default-payment').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = Number(btn.getAttribute('data-id'));
      removeDefaultPayment(id);
    });
  });
}

function openEditPaymentModal(id) {
  const method = samplePaymentMethods.find(m => m.id === id);
  if (!method) return;
  editingPaymentId = id;
  document.getElementById('paymentType').value = method.type;
  document.getElementById('paymentNumber').value = method.number.replace(/[^\d]/g, '');
  document.getElementById('paymentExpiry').value = method.expiry;
  openPaymentModal();
  document.querySelector('#paymentModal .modal-header h3').textContent = 'Edit Payment Method';
}

function removePayment(id) {
  const idx = samplePaymentMethods.findIndex(m => m.id === id);
  if (idx !== -1) {
    samplePaymentMethods.splice(idx, 1);
    renderPaymentMethods();
    showNotification('Payment method removed!', 'success');
  }
}

function setDefaultPayment(id) {
  samplePaymentMethods.forEach(m => m.isDefault = false);
  const method = samplePaymentMethods.find(m => m.id === id);
  if (method) method.isDefault = true;
  renderPaymentMethods();
  showNotification('Default payment method updated!', 'success');
}

function removeDefaultPayment(id) {
  const method = samplePaymentMethods.find(m => m.id === id);
  if (method && method.isDefault) {
    method.isDefault = false;
    renderPaymentMethods();
    showNotification('Default payment method removed!', 'info');
  }
}

// Render preferences section
function renderPreferences() {
    const preferencesSection = document.getElementById("preferences");
    if (!preferencesSection) return;

    const content = `
        <form class="profile-form">
            <div class="form-group">
                <label class="form-label">Language</label>
                <select class="form-input">
                    <option selected>English (United States)</option>
                    <option>Arabic (Egypt)</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Currency</label>
                <select class="form-input">
                    <option selected>USD ($)</option>
                    <option>EGP (£)</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Communication Preferences</label>
                <div class="checkbox-group">
                    <input type="checkbox" id="promoEmails" checked>
                    <label for="promoEmails">Receive promotional emails</label>
                </div>
                <div class="checkbox-group">
                    <input type="checkbox" id="newsletter">
                    <label for="newsletter">Subscribe to newsletter</label>
                </div>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">Save Preferences</button>
            </div>
        </form>
    `;
    const sectionHeader = preferencesSection.querySelector('.section-header');
    if(sectionHeader){
      sectionHeader.insertAdjacentHTML('afterend', content);
    }
}

// Avatar modal functions
function openAvatarModal() {
  const modal = document.getElementById('avatarModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeAvatarModal() {
  const modal = document.getElementById('avatarModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  // Reset file input
  const avatarFileInput = document.getElementById("avatarFileInput");
  if (avatarFileInput) {
    avatarFileInput.value = "";
  }

  // Reset preview
  const uploadPreview = document.getElementById("uploadPreview");
  if (uploadPreview) {
    uploadPreview.innerHTML = `
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    `;
  }
}

function handleAvatarPreview(event) {
  const file = event.target.files[0];
  if (file) {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const uploadPreview = document.getElementById("uploadPreview");
        if (uploadPreview) {
          uploadPreview.style.opacity = "0";
          setTimeout(() => {
            uploadPreview.innerHTML = `<img src="${e.target.result}" alt="Avatar preview" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
            uploadPreview.style.opacity = "1";
          }, 200);
        }
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please select a valid image file.");
    }
  }
}

// Handle avatar save with proper persistence
function handleAvatarSave() {
  const uploadPreview = document.getElementById("uploadPreview");
  const img = uploadPreview?.querySelector("img");

  if (img && img.src) {
    // Save to localStorage
    localStorage.setItem("egyptianTreasuresAvatar", img.src);

    // Update the main avatar display with animation
    const avatarImage = document.getElementById("avatarImage");
    if (avatarImage) {
      avatarImage.style.opacity = "0";
      avatarImage.style.transform = "scale(0.8)";
      setTimeout(() => {
        avatarImage.innerHTML = `<img src="${img.src}" alt="Profile picture" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
        avatarImage.style.opacity = "1";
        avatarImage.style.transform = "scale(1)";
      }, 200);
    }

    closeAvatarModal();
    showNotification("Profile picture updated successfully!", "success");
  } else {
    alert("Please select an image first.");
  }
}

// Handle personal info form submission
function handlePersonalInfoSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const updatedData = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    birthDate: formData.get("birthDate"),
    gender: formData.get("gender"),
    bio: formData.get("bio"),
  };

  // Validate required fields
  if (!updatedData.firstName || !updatedData.lastName || !updatedData.email) {
    alert("Please fill in all required fields.");
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(updatedData.email)) {
    alert("Please enter a valid email address.");
    return;
  }

  // Add loading animation
  const submitBtn = event.target.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.style.opacity = "0.7";
    submitBtn.style.transform = "scale(0.95)";
    submitBtn.disabled = true;
  }

  // Simulate API call delay
  setTimeout(() => {
    // Update user data
    currentUser = { ...currentUser, ...updatedData };

    // Save to storage
    localStorage.setItem("egyptianTreasuresUser", JSON.stringify(currentUser));

    // Update profile display
    updateProfileDisplay();

    // Reset button
    if (submitBtn) {
      submitBtn.style.opacity = "1";
      submitBtn.style.transform = "scale(1)";
      submitBtn.disabled = false;
    }

    showNotification("Profile updated successfully!", "success");
  }, 1000);
}

// Update cart and wishlist badges
function updateBadges() {
  // Always reload cart and wishlist from localStorage to sync with other pages
  cart = JSON.parse(localStorage.getItem('egyptianLuxuryCart')) || [];
  wishlist = JSON.parse(localStorage.getItem('egyptianWishlist')) || [];
  
  const cartBadge = document.getElementById('cartBadge');
  const wishlistBadge = document.getElementById('wishlistBadge');
  const profileWishlistBadge = document.getElementById('profileWishlistBadge');
  
  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const wishlistCount = wishlist.length;
  
  if (cartBadge) {
    cartBadge.textContent = cartCount;
    cartBadge.style.display = cartCount > 0 ? 'flex' : 'none';
  }
  
  if (wishlistBadge) {
    wishlistBadge.textContent = wishlistCount;
    wishlistBadge.style.display = wishlistCount > 0 ? 'flex' : 'none';
  }

  if (profileWishlistBadge) {
    profileWishlistBadge.textContent = wishlistCount;
    profileWishlistBadge.style.display = wishlistCount > 0 ? 'inline-block' : 'none';
  }
}

// Show notification function
function showNotification(message, type = "info") {
  const notificationContainer = document.getElementById("notificationContainer");
  if (!notificationContainer) return;

  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  
  const icons = {
    success: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22,4 12,14.01 9,11.01"></polyline></svg>',
    error: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
    info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
  };
  
  notification.innerHTML = `
    ${icons[type] || icons.info}
    <span>${message}</span>
  `;
  
  notification.style.cssText = `
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: ${type === 'success' ? 'rgba(16, 185, 129, 0.9)' : type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(59, 130, 246, 0.9)'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    margin-bottom: 1rem;
    transform: translateX(100%);
    transition: all 0.3s ease;
    max-width: 350px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  `;

  notificationContainer.appendChild(notification);

  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  setTimeout(() => {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 4000);
}

// Handle escape key for closing modals
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const activeModal = document.querySelector('.modal.active');
    if (activeModal) {
      closeAvatarModal();
    }
  }
});

// Keyboard Navigation
document.addEventListener("keydown", (e) => {
  // Arrow keys for section navigation
  if (e.key === "ArrowLeft" && e.ctrlKey) {
    e.preventDefault();
    const sections = ["overview", "personal", "orders", "wishlist", "addresses", "payment", "preferences"];
    const currentIndex = sections.indexOf(currentSection);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : sections.length - 1;
    switchSection(sections[prevIndex]);
  }
  
  if (e.key === "ArrowRight" && e.ctrlKey) {
    e.preventDefault();
    const sections = ["overview", "personal", "orders", "wishlist", "addresses", "payment", "preferences"];
    const currentIndex = sections.indexOf(currentSection);
    const nextIndex = (currentIndex + 1) % sections.length;
    switchSection(sections[nextIndex]);
  }
});

// Save data before page unload
window.addEventListener('beforeunload', () => {
  localStorage.setItem('egyptianLuxuryCart', JSON.stringify(cart));
  localStorage.setItem('egyptianWishlist', JSON.stringify(wishlist));
});

// Auto-refresh cart and wishlist data, badges when localStorage changes (cross-tab sync)
window.addEventListener('storage', (event) => {
  if (event.key === 'egyptianLuxuryCart') {
    cart = JSON.parse(localStorage.getItem('egyptianLuxuryCart')) || [];
    updateBadges();
  }
  if (event.key === 'egyptianWishlist') {
    wishlist = JSON.parse(localStorage.getItem('egyptianWishlist')) || [];
    updateBadges();
    renderWishlistSection();
  }
});

// --- Search Modal Logic ---
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
      if (searchInput) searchInput.value = suggestion.textContent;
      searchModal.classList.remove('active');
      showNotification(`Searching for "${suggestion.textContent}"...`, 'info');
      // Redirect to shop with search query
      setTimeout(() => {
        window.location.href = `shop.html?search=${encodeURIComponent(suggestion.textContent)}`;
      }, 1000);
    });
  });
  // ESC key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchModal.classList.contains('active')) {
      searchModal.classList.remove('active');
    }
  });
}

// Modal handling
function setupModalEventListeners() {
    // Address Modal
    const addressModal = document.getElementById('addressModal');
    const addressBackdrop = document.getElementById('addressBackdrop');
    const addressClose = document.getElementById('addressClose');
    const cancelAddress = document.getElementById('cancelAddress');
    const addressForm = document.getElementById('addressForm');

    if (addressModal) {
        if(addressClose) addressClose.addEventListener('click', closeAddressModal);
        if(addressBackdrop) addressBackdrop.addEventListener('click', closeAddressModal);
        if(cancelAddress) cancelAddress.addEventListener('click', closeAddressModal);
        if(addressForm) addressForm.addEventListener('submit', handleAddressFormSubmit);
    }

    // Payment Modal
    const paymentModal = document.getElementById('paymentModal');
    const paymentBackdrop = document.getElementById('paymentBackdrop');
    const paymentClose = document.getElementById('paymentClose');
    const cancelPayment = document.getElementById('cancelPayment');
    const paymentForm = document.getElementById('paymentForm');
    
    if (paymentModal) {
        if(paymentClose) paymentClose.addEventListener('click', closePaymentModal);
        if(paymentBackdrop) paymentBackdrop.addEventListener('click', closePaymentModal);
        if(cancelPayment) cancelPayment.addEventListener('click', closePaymentModal);
        if(paymentForm) paymentForm.addEventListener('submit', handlePaymentFormSubmit);
    }
}

function openAddressModal() {
    editingAddressId = null;
    const modal = document.getElementById('addressModal');
    if (modal) modal.classList.add('active');
    document.getElementById('addressForm').reset();
    document.querySelector('#addressModal .modal-header h3').textContent = 'Add New Address';
}

function closeAddressModal() {
    const modal = document.getElementById('addressModal');
    if (modal) modal.classList.remove('active');
    document.getElementById('addressForm').reset();
}

function openPaymentModal() {
    editingPaymentId = null;
    const modal = document.getElementById('paymentModal');
    if (modal) modal.classList.add('active');
    document.getElementById('paymentForm').reset();
    document.querySelector('#paymentModal .modal-header h3').textContent = 'Add Payment Method';
}

function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) modal.classList.remove('active');
    document.getElementById('paymentForm').reset();
}

function handleAddressFormSubmit(e) {
    e.preventDefault();
    const addressData = {
        name: document.getElementById('addressName').value,
        fullName: document.getElementById('addressFullName').value,
        street: document.getElementById('addressStreet').value,
        city: document.getElementById('addressCity').value,
        state: document.getElementById('addressState').value,
        zipCode: document.getElementById('addressZip').value,
        country: document.getElementById('addressCountry').value,
        phone: document.getElementById('addressPhone').value,
    };
    if (editingAddressId) {
        // Edit mode
        const idx = sampleAddresses.findIndex(a => a.id === editingAddressId);
        if (idx !== -1) {
            sampleAddresses[idx] = { ...sampleAddresses[idx], ...addressData };
            renderAddresses();
            closeAddressModal();
            showNotification('Address updated successfully!', 'success');
        }
    } else {
        // Add mode
        const newAddress = {
            id: Date.now(),
            ...addressData,
            isDefault: false,
        };
        sampleAddresses.push(newAddress);
        renderAddresses();
        closeAddressModal();
        showNotification('Address added successfully!', 'success');
    }
}

function handlePaymentFormSubmit(e) {
    e.preventDefault();
    const paymentNumberInput = document.getElementById('paymentNumber').value;
    const paymentData = {
        type: document.getElementById('paymentType').value,
        number: `•••• •••• •••• ${paymentNumberInput.slice(-4)}`,
        expiry: document.getElementById('paymentExpiry').value,
    };
    if (editingPaymentId) {
        // Edit mode
        const idx = samplePaymentMethods.findIndex(m => m.id === editingPaymentId);
        if (idx !== -1) {
            samplePaymentMethods[idx] = { ...samplePaymentMethods[idx], ...paymentData };
            renderPaymentMethods();
            closePaymentModal();
            showNotification('Payment method updated successfully!', 'success');
        }
    } else {
        // Add mode
        const newPayment = {
            id: Date.now(),
            ...paymentData,
            isDefault: false,
        };
        samplePaymentMethods.push(newPayment);
        renderPaymentMethods();
        closePaymentModal();
        showNotification('Payment method added successfully!', 'success');
    }
}

function setupOrderActionModals() {
  // Track Order
  const trackOrderBtn = document.querySelector('.order-actions .btn.btn-outline:nth-child(1)');
  const trackOrderModal = document.getElementById('trackOrderModal');
  const trackOrderClose = document.getElementById('trackOrderClose');
  const trackOrderBackdrop = document.getElementById('trackOrderBackdrop');
  const trackOrderBody = document.getElementById('trackOrderBody');

  if (trackOrderBtn && trackOrderModal) {
    trackOrderBtn.addEventListener('click', () => {
      // Example tracking info
      trackOrderBody.innerHTML = `
        <div style="padding:1rem;">
          <h4 style="color:var(--pyramid-gold);margin-bottom:1rem;">Order #EG-2024-001</h4>
          <ul style="list-style:none;padding:0;">
            <li><span style="color:var(--pyramid-gold);font-weight:700;font-size:1.08rem;">Shipped</span> <span style="color:#fff;font-weight:600;">- March 16, 2024</span></li>
            <li><span style="color:var(--pyramid-gold);font-weight:700;font-size:1.08rem;">In Transit</span> <span style="color:#fff;font-weight:600;">- March 17, 2024</span></li>
            <li><span style="color:var(--pyramid-gold);font-weight:700;font-size:1.08rem;">Out for Delivery</span> <span style="color:#fff;font-weight:600;">- March 19, 2024</span></li>
            <li><strong style="color:var(--pyramid-gold);font-size:1.13rem;">Estimated Delivery</strong> <span style="color:var(--pyramid-gold);font-weight:700;">- March 20, 2024</span></li>
          </ul>
        </div>
      `;
      trackOrderModal.classList.add('active');
    });
  }
  if (trackOrderClose) trackOrderClose.addEventListener('click', () => trackOrderModal.classList.remove('active'));
  if (trackOrderBackdrop) trackOrderBackdrop.addEventListener('click', (e) => {
    if (e.target === trackOrderBackdrop) trackOrderModal.classList.remove('active');
  });

  // View Details
  const viewDetailsBtn = document.querySelector('.order-actions .btn.btn-outline:nth-child(2)');
  const orderDetailsModal = document.getElementById('orderDetailsModal');
  const orderDetailsClose = document.getElementById('orderDetailsClose');
  const orderDetailsBackdrop = document.getElementById('orderDetailsBackdrop');
  const orderDetailsBody = document.getElementById('orderDetailsBody');

  if (viewDetailsBtn && orderDetailsModal) {
    viewDetailsBtn.addEventListener('click', () => {
      // Example order details
      orderDetailsBody.innerHTML = `
        <div style="padding:1rem;">
          <h4 style="color:var(--pyramid-gold);margin-bottom:1rem;">Order #EG-2024-001</h4>
          <p><strong style="color:var(--pyramid-gold);font-size:1.08rem;">Placed on:</strong> <span style="color:#fff;font-weight:600;">March 15, 2024</span></p>
          <p><strong style="color:var(--pyramid-gold);font-size:1.08rem;">Status:</strong> <span style="color:#fff;font-weight:700;">Shipped</span></p>
          <hr style="margin:1rem 0;">
          <div style="display:flex;align-items:center;gap:1rem;">
            <img src='images/1-7-scaled.jpg' alt='Golden Pharaoh Mask' style='width:80px;height:80px;border-radius:8px;object-fit:cover;'>
            <div>
              <h5 style='margin:0;color:var(--pyramid-gold);'>Golden Pharaoh Mask</h5>
              <p style='margin:0;color:var(--soft-yellow);'>Exquisite reproduction with 24-karat gold</p>
              <span style='color:var(--pyramid-gold);font-weight:600;'>$12,500</span>
            </div>
          </div>
          <hr style="margin:1rem 0;">
          <p><strong style="color:var(--pyramid-gold);font-size:1.1rem;">Total:</strong> <span style="color:var(--pyramid-gold);font-weight:700;">$12,500</span></p>
        </div>
      `;
      orderDetailsModal.classList.add('active');
    });
  }
  if (orderDetailsClose) orderDetailsClose.addEventListener('click', () => orderDetailsModal.classList.remove('active'));
  if (orderDetailsBackdrop) orderDetailsBackdrop.addEventListener('click', (e) => {
    if (e.target === orderDetailsBackdrop) orderDetailsModal.classList.remove('active');
  });
}

// --- Wishlist Section Logic ---
function renderWishlistSection() {
  const wishlistSection = document.getElementById('wishlist');
  if (!wishlistSection) return;
  const wishlistGrid = wishlistSection.querySelector('.wishlist-grid');
  if (!wishlistGrid) return;

  wishlistGrid.innerHTML = '';
  if (wishlist.length === 0) {
    wishlistGrid.innerHTML = `<div class="empty-state"><h3>Your wishlist is empty</h3><p>Save your favorite artifacts for later</p></div>`;
    return;
  }

  wishlist.forEach((item, idx) => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'wishlist-item';
    itemDiv.innerHTML = `
      <div class="item-image">
        <img src="${item.image || 'images/4-5-scaled.jpg'}" alt="${item.name || ''}">
        <button class="remove-wishlist" title="Remove from wishlist">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>
      <div class="item-content">
        <h3>${item.name || 'Artifact'}</h3>
        <p>${item.description || ''}</p>
        <div class="item-price">$${item.price ? item.price.toLocaleString() : '0'}</div>
        <div class="item-actions">
          <button class="btn btn-primary">Add to Cart</button>
          <button class="btn btn-outline">View Details</button>
        </div>
      </div>
    `;
    // Add event listeners
    const addToCartBtn = itemDiv.querySelector('.btn-primary');
    const viewDetailsBtn = itemDiv.querySelector('.btn-outline');
    const removeBtn = itemDiv.querySelector('.remove-wishlist');

    addToCartBtn.addEventListener('click', () => {
      addWishlistItemToCart(item, idx);
    });
    viewDetailsBtn.addEventListener('click', () => {
      openWishlistItemDetailsModal(item);
    });
    removeBtn.addEventListener('click', () => {
      removeWishlistItem(idx);
    });
    wishlistGrid.appendChild(itemDiv);
  });
}

function addWishlistItemToCart(item, idx) {
  // Check if already in cart
  const existing = cart.find(ci => ci.id === item.id);
  if (existing) {
    existing.quantity = (existing.quantity || 1) + 1;
    showNotification(`Increased quantity of ${item.name}`, 'success');
  } else {
    cart.push({ ...item, quantity: 1 });
    showNotification(`${item.name} added to cart!`, 'success');
  }
  localStorage.setItem('egyptianLuxuryCart', JSON.stringify(cart));
  updateBadges();
}

function openWishlistItemDetailsModal(item) {
  // Use or create a modal for item details
  let modal = document.getElementById('wishlistItemDetailsModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'wishlistItemDetailsModal';
    modal.innerHTML = `
      <div class="modal-backdrop" id="wishlistItemDetailsBackdrop"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3>Item Details</h3>
          <button class="modal-close" id="wishlistItemDetailsClose">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="modal-body" id="wishlistItemDetailsBody"></div>
      </div>
    `;
    document.body.appendChild(modal);
  }
  const body = modal.querySelector('#wishlistItemDetailsBody');
  body.innerHTML = `
    <div style="display:flex;gap:1.5rem;align-items:center;">
      <img src="${item.image || 'images/4-5-scaled.jpg'}" alt="${item.name || ''}" style="width:120px;height:120px;border-radius:10px;object-fit:cover;">
      <div>
        <h4 style="color:var(--pyramid-gold);margin-bottom:0.5rem;">${item.name || 'Artifact'}</h4>
        <p style="color:var(--soft-yellow);margin-bottom:0.5rem;">${item.description || ''}</p>
        <div style="color:var(--pyramid-gold);font-weight:600;font-size:1.2rem;">$${item.price ? item.price.toLocaleString() : '0'}</div>
      </div>
    </div>
  `;
  modal.classList.add('active');
  // Close logic
  modal.querySelector('#wishlistItemDetailsClose').onclick = () => modal.classList.remove('active');
  modal.querySelector('#wishlistItemDetailsBackdrop').onclick = (e) => { if (e.target === modal.querySelector('#wishlistItemDetailsBackdrop')) modal.classList.remove('active'); };
}

function removeWishlistItem(idx) {
  const item = wishlist[idx];
  wishlist.splice(idx, 1);
  localStorage.setItem('egyptianWishlist', JSON.stringify(wishlist));
  renderWishlistSection();
  updateBadges();
  showNotification(`${item.name} removed from wishlist`, 'info');
}

// Add these functions near the top-level of the file
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
    cartItems.innerHTML = cart.map(item => {
      let product = item;
      if (!item.title || !item.image || !item.price) {
        const found = (window.galleryData ? window.galleryData.find(p => p.id === item.id) : null) || (window.allProducts ? window.allProducts.find(p => p.id === item.id) : null);
        if (found) {
          product = { ...found, ...item };
        }
      }
      return `
        <div class="cart-item">
          <img src="${product.image}" alt="${product.title || product.name}" class="cart-item-image">
          <div class="cart-item-details">
            <h4 class="cart-item-title">${product.title || product.name}</h4>
            <div class="cart-item-price">${product.price ? product.price.toLocaleString() : ''} x ${product.quantity}</div>
          </div>
          <button class="cart-item-remove" onclick="removeFromCart(${product.id})" title="Remove item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3,6 5,6 21,6"></polyline>
              <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1 2-2h4a2,2 0 0,1 2,2v2"></path>
            </svg>
          </button>
        </div>
      `;
    }).join('');
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const subtotalEl = document.getElementById('cartSubtotal');
    const totalEl = document.getElementById('cartTotal');
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toLocaleString()}`;
    if (totalEl) totalEl.textContent = `$${subtotal.toLocaleString()}`;
  }
}

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
      let product = item;
      if (!item.title || !item.image || !item.price) {
        const found = (window.galleryData ? window.galleryData.find(p => p.id === item.id) : null) || (window.allProducts ? window.allProducts.find(p => p.id === item.id) : null);
        if (found) {
          product = { ...found, ...item };
        }
      }
      return `
        <div class="wishlist-item">
          <img src="${product.image}" alt="${product.title || product.name}" class="wishlist-item-image">
          <div class="wishlist-item-details">
            <h4 class="wishlist-item-title">${product.title || product.name}</h4>
            <div class="wishlist-item-price">$${product.price ? product.price.toLocaleString() : ''}</div>
          </div>
          <button class="wishlist-item-remove" onclick="removeFromWishlist(${product.id})" title="Remove from wishlist">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>
      `;
    }).join('');
  }
}

// Ensure all sidebars are closed by default
function ensureSidebarsClosed() {
  const sidebars = document.querySelectorAll('.sidebar');
  sidebars.forEach(sidebar => {
    sidebar.classList.remove('active');
  });
}

console.log('🏺 Egyptian Creativity - Enhanced Profile page script loaded successfully!');