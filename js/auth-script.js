// Enhanced Egyptian Creativity Auth Script - Matching Index Page Design

// Loading Animation
document.addEventListener('DOMContentLoaded', () => {
  const loadingOverlay = document.querySelector('.loading-overlay');
  const progressBar = document.querySelector('.progress-bar');
  const skipBtn = document.getElementById('skipBtn');
  let progress = 0;

  function hideLoading() {
    if (loadingOverlay) {
      loadingOverlay.classList.add('hidden');
      setTimeout(() => {
        loadingOverlay.style.display = 'none';
        // Trigger entrance animations
        triggerEntranceAnimations();
      }, 800);
    }
  }

  function triggerEntranceAnimations() {
    // Add entrance animations for background elements
    const pyramids = document.querySelectorAll('.pyramid');
    pyramids.forEach((pyramid, index) => {
      setTimeout(() => {
        pyramid.style.opacity = '0.8';
        pyramid.style.transform = 'translateY(-10px) rotate(5deg)';
      }, index * 100);
    });
  }

  // Start loading simulation
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

  // Skip button functionality
  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      clearInterval(loadingInterval);
      hideLoading();
    });
  }

  // Auto hide after 3 seconds
  setTimeout(() => {
    if (loadingOverlay && !loadingOverlay.classList.contains('hidden')) {
      clearInterval(loadingInterval);
      hideLoading();
    }
  }, 3000);
});

// Navigation setup like index page
function setupNavigation() {
  const header = document.getElementById('header');
  const userBtn = document.getElementById('userBtn');
  
  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

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

// Form switching functionality
let currentForm = "login";

function switchToForm(formType) {
  console.log("Switching to form:", formType);

  // Remove active class from all forms
  document.querySelectorAll(".auth-form-container").forEach((form) => {
    form.classList.remove("active");
  });

  // Add transition effect
  const authForms = document.querySelector('.auth-forms');
  if (authForms) {
    authForms.style.transform = 'translateX(-20px)';
    authForms.style.opacity = '0.8';
  }

  // Add active class to target form
  setTimeout(() => {
    let targetForm;
    switch (formType) {
      case "login":
        targetForm = document.getElementById("loginForm");
        break;
      case "signup":
        targetForm = document.getElementById("signupForm");
        break;
      case "forgot":
        targetForm = document.getElementById("forgotForm");
        break;
    }

    if (targetForm) {
      targetForm.classList.add("active");
      console.log("Activated form:", formType);
    } else {
      console.error("Form not found:", formType);
    }

    // Reset transition effect
    if (authForms) {
      authForms.style.transform = '';
      authForms.style.opacity = '';
    }

    currentForm = formType;
  }, 100);
}

// Password visibility toggle
function togglePasswordVisibility(toggleBtn, passwordInput) {
  const eyeOpen = toggleBtn.querySelector(".eye-open");
  const eyeClosed = toggleBtn.querySelector(".eye-closed");

  // Add glow effect
  toggleBtn.style.filter = 'drop-shadow(0 0 5px rgba(255, 215, 0, 0.5))';
  setTimeout(() => {
    toggleBtn.style.filter = '';
  }, 300);

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyeOpen.classList.add("hidden");
    eyeClosed.classList.remove("hidden");
  } else {
    passwordInput.type = "password";
    eyeOpen.classList.remove("hidden");
    eyeClosed.classList.add("hidden");
  }
}

// Form submissions
async function handleLoginSubmit(event) {
  event.preventDefault();

  const formData = new FormData(document.getElementById("loginFormElement"));
  const email = formData.get("email");
  const password = formData.get("password");
  const remember = formData.get("remember");

  // Validate form data
  if (!email || !password) {
    showNotification("Please fill in all required fields.", "error");
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showNotification("Please enter a valid email address.", "error");
    return;
  }

  // Show loading state
  const submitBtn = document.getElementById("loginFormElement").querySelector(".auth-btn");
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = `<span>Signing In...</span><div class="btn-loader"></div>`;
  submitBtn.disabled = true;
  submitBtn.style.background = 'linear-gradient(45deg, var(--pyramid-gold), var(--soft-gold))';

  try {
    // Create form data for API
    const apiFormData = new FormData();
    apiFormData.append('action', 'login');
    apiFormData.append('email', email);
    apiFormData.append('password', password);
    
    // Send login request to backend
    const response = await fetch('auth.php', {
      method: 'POST',
      body: apiFormData
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Store user data for frontend use
      const userData = {
        ...result.user,
        loginTime: new Date().toISOString(),
        remember: remember,
        isAuthenticated: true
      };

      // Use AuthManager to handle login
      if (window.authManager) {
        window.authManager.login(userData);
      } else {
        // Fallback if AuthManager is not available
        if (remember) {
          localStorage.setItem("egyptianCreativityUser", JSON.stringify(userData));
        } else {
          sessionStorage.setItem("egyptianCreativityUser", JSON.stringify(userData));
        }
      }
      
      showNotification(result.message, "success");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    } else {
      showNotification(result.message, "error");
    }
  } catch (error) {
    console.error('Login error:', error);
    showNotification("Login failed. Please try again.", "error");
  } finally {
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
    submitBtn.style.background = '';
  }
}

async function handleSignupSubmit(event) {
  event.preventDefault();

  const formData = new FormData(document.getElementById("signupFormElement"));
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const email = formData.get("email");
  const phone = formData.get("phone");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  const agreeTerms = formData.get("terms");
  const newsletter = formData.get("newsletter");

  // Validate form data
  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    showNotification("Please fill in all required fields.", "error");
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showNotification("Please enter a valid email address.", "error");
    return;
  }

  // Password validation
  if (password !== confirmPassword) {
    showNotification("Passwords do not match.", "error");
    return;
  }

  if (password.length < 6) {
    showNotification("Password must be at least 6 characters long.", "error");
    return;
  }

  if (!agreeTerms) {
    showNotification("Please agree to the Terms of Service and Privacy Policy.", "error");
    return;
  }

  // Show loading state
  const submitBtn = document.getElementById("signupFormElement").querySelector(".auth-btn");
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = `<span>Creating Account...</span><div class="btn-loader"></div>`;
  submitBtn.disabled = true;
  submitBtn.style.background = 'linear-gradient(45deg, var(--pyramid-gold), var(--soft-gold))';

  try {
    // Create form data for API
    const apiFormData = new FormData();
    apiFormData.append('action', 'signup');
    apiFormData.append('username', email.split('@')[0]); // Use email prefix as username
    apiFormData.append('email', email);
    apiFormData.append('password', password);
    apiFormData.append('full_name', `${firstName} ${lastName}`);
    
    // Send signup request to backend
    const response = await fetch('auth.php', {
      method: 'POST',
      body: apiFormData
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Store user data for frontend use
      const userData = {
        ...result.user,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        newsletter: newsletter,
        signupTime: new Date().toISOString(),
        isAuthenticated: true
      };

      // Use AuthManager to handle signup/login
      if (window.authManager) {
        window.authManager.login(userData);
      } else {
        // Fallback if AuthManager is not available
        localStorage.setItem("egyptianCreativityUser", JSON.stringify(userData));
      }
      
      showNotification(result.message, "success");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    } else {
      showNotification(result.message, "error");
    }
  } catch (error) {
    console.error('Signup error:', error);
    showNotification("Account creation failed. Please try again.", "error");
  } finally {
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
    submitBtn.style.background = '';
  }
}

async function handleForgotSubmit(event) {
  event.preventDefault();

  const formData = new FormData(document.getElementById("forgotFormElement"));
  const email = formData.get("email");

  // Validate email
  if (!email) {
    showNotification("Please enter your email address.", "error");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showNotification("Please enter a valid email address.", "error");
    return;
  }

  // Show loading state
  const submitBtn = document.getElementById("forgotFormElement").querySelector(".auth-btn");
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = `<span>Sending...</span><div class="btn-loader"></div>`;
  submitBtn.disabled = true;
  submitBtn.style.background = 'linear-gradient(45deg, var(--pyramid-gold), var(--soft-gold))';

  try {
    // Create form data for API
    const apiFormData = new FormData();
    apiFormData.append('action', 'forgot_password');
    apiFormData.append('email', email);
    
    // Send forgot password request to backend
    const response = await fetch('auth.php', {
      method: 'POST',
      body: apiFormData
    });
    
    const result = await response.json();
    
    if (result.success) {
      showNotification(result.message, "success");
      document.getElementById("forgotFormElement").reset();
      
      // Switch back to login form
      setTimeout(() => {
        switchToForm("login");
      }, 2000);
    } else {
      showNotification(result.message, "error");
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    showNotification("Password reset failed. Please try again.", "error");
  } finally {
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
    submitBtn.style.background = '';
  }
}

// Notification function
function showNotification(message, type = "info") {
  const notificationContainer = document.getElementById("notificationContainer");
  if (!notificationContainer) return;

  const notificationDiv = document.createElement("div");
  notificationDiv.className = `notification notification-${type}`;
  
  let iconSVG = '';
  
  switch(type) {
    case 'success':
      iconSVG = '<svg class="notification-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20,6 9,17 4,12"></polyline></svg>';
      break;
    case 'error':
      iconSVG = '<svg class="notification-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
      break;
    default:
      iconSVG = '<svg class="notification-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
  }
  
  notificationDiv.innerHTML = `
    <div class="notification-content">
      ${iconSVG}
      <span>${message}</span>
    </div>
  `;
  
  notificationContainer.appendChild(notificationDiv);

  // Animate in
  setTimeout(() => {
    notificationDiv.classList.add("show");
  }, 100);

  // Remove after 5 seconds
  setTimeout(() => {
    notificationDiv.classList.remove("show");
    setTimeout(() => {
      if (notificationDiv.parentNode) {
        notificationDiv.parentNode.removeChild(notificationDiv);
      }
    }, 400);
  }, 5000);
}

// Password validation
function setupPasswordValidation() {
  const signupPassword = document.getElementById("signupPassword");
  const confirmPassword = document.getElementById("confirmPassword");
  const strengthFill = document.querySelector(".strength-fill");
  const strengthText = document.querySelector(".strength-text");
  const matchIcon = document.querySelector(".match-icon");
  const mismatchIcon = document.querySelector(".mismatch-icon");

  if (signupPassword) {
    signupPassword.addEventListener("input", () => {
      const password = signupPassword.value;
      const strength = calculatePasswordStrength(password);

      // Update strength bar
      if (strengthFill) {
        strengthFill.style.width = `${strength.percentage}%`;
        
        if (strength.percentage > 60) {
          strengthFill.style.filter = 'drop-shadow(0 0 5px rgba(255, 215, 0, 0.5))';
        } else {
          strengthFill.style.filter = '';
        }
      }
      
      if (strengthText) {
        const levels = {
          0: "Very weak",
          20: "Weak", 
          40: "Fair",
          60: "Good",
          80: "Strong",
          100: "Excellent"
        };
        
        let level = "Very weak";
        for (let threshold in levels) {
          if (strength.percentage >= threshold) {
            level = levels[threshold];
          }
        }
        
        strengthText.textContent = level;
      }

      // Update strength bar color
      if (strengthFill) {
        if (strength.percentage < 30) {
          strengthFill.style.background = "#dc2626";
        } else if (strength.percentage < 60) {
          strengthFill.style.background = "#f59e0b";
        } else if (strength.percentage < 80) {
          strengthFill.style.background = "#d4af37";
        } else {
          strengthFill.style.background = "linear-gradient(90deg, #d4af37, #f4e4a6)";
        }
      }
    });
  }

  if (confirmPassword) {
    confirmPassword.addEventListener("input", () => {
      const password = signupPassword ? signupPassword.value : "";
      const confirm = confirmPassword.value;

      if (confirm.length > 0) {
        if (password === confirm) {
          if (matchIcon) {
            matchIcon.classList.remove("hidden");
            matchIcon.style.filter = 'drop-shadow(0 0 3px rgba(16, 163, 74, 0.5))';
          }
          if (mismatchIcon) mismatchIcon.classList.add("hidden");
        } else {
          if (matchIcon) matchIcon.classList.add("hidden");
          if (mismatchIcon) {
            mismatchIcon.classList.remove("hidden");
            mismatchIcon.style.filter = 'drop-shadow(0 0 3px rgba(220, 38, 38, 0.5))';
          }
        }
      } else {
        if (matchIcon) matchIcon.classList.add("hidden");
        if (mismatchIcon) mismatchIcon.classList.add("hidden");
      }
    });
  }
}

function calculatePasswordStrength(password) {
  let score = 0;
  let text = "Very Weak";

  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 10;
  if (/[a-z]/.test(password)) score += 15;
  if (/[A-Z]/.test(password)) score += 15;
  if (/[0-9]/.test(password)) score += 15;
  if (/[^A-Za-z0-9]/.test(password)) score += 25;

  if (score >= 80) text = "Very Strong";
  else if (score >= 60) text = "Strong";
  else if (score >= 40) text = "Medium";
  else if (score >= 20) text = "Weak";

  return { percentage: Math.min(score, 100), text };
}

// Input enhancements
function setupInputEnhancements() {
  const formInputs = document.querySelectorAll(".form-input");
  
  formInputs.forEach((input) => {
    input.addEventListener("focus", function () {
      this.parentElement?.classList.add("focused");
      // Add glow effect
      this.style.boxShadow = '0 0 0 3px rgba(255, 215, 0, 0.1), 0 0 15px rgba(255, 215, 0, 0.2)';
      
      // Animate the input icon
      const icon = this.parentElement.querySelector('.input-icon');
      if (icon) {
        icon.style.transform = 'translateY(-50%) scale(1.1)';
        icon.style.filter = 'drop-shadow(0 0 5px rgba(255, 215, 0, 0.5))';
      }
    });

    input.addEventListener("blur", function () {
      this.parentElement?.classList.remove("focused");
      this.style.boxShadow = '';
      
      // Reset icon animation
      const icon = this.parentElement.querySelector('.input-icon');
      if (icon) {
        icon.style.transform = 'translateY(-50%)';
        icon.style.filter = '';
      }
    });
    
    // Add typing effect
    input.addEventListener("input", function() {
      if (this.value.length > 0) {
        this.style.borderColor = 'rgba(255, 215, 0, 0.5)';
      } else {
        this.style.borderColor = '';
      }
    });
  });
}

// Setup event listeners
function setupEventListeners() {
  console.log("Setting up event listeners...");

  // Form switching
  const showSignupBtn = document.getElementById("showSignup");
  const showLoginBtn = document.getElementById("showLogin");
  const forgotPasswordLink = document.getElementById("forgotPasswordLink");
  const backToLoginBtn = document.getElementById("backToLogin");

  if (showSignupBtn) {
    showSignupBtn.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("Show signup clicked");
      switchToForm("signup");
    });
    console.log("✅ Show signup button listener added");
  }

  if (showLoginBtn) {
    showLoginBtn.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("Show login clicked");
      switchToForm("login");
    });
    console.log("✅ Show login button listener added");
  }

  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("Forgot password clicked");
      switchToForm("forgot");
    });
    console.log("✅ Forgot password link listener added");
  }

  if (backToLoginBtn) {
    backToLoginBtn.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("Back to login clicked");
      switchToForm("login");
    });
    console.log("✅ Back to login button listener added");
  }

  // Password visibility toggles
  const loginPasswordToggle = document.getElementById("loginPasswordToggle");
  const signupPasswordToggle = document.getElementById("signupPasswordToggle");

  if (loginPasswordToggle) {
    loginPasswordToggle.addEventListener("click", () => {
      const passwordInput = document.getElementById("loginPassword");
      togglePasswordVisibility(loginPasswordToggle, passwordInput);
    });
    console.log("✅ Login password toggle listener added");
  }

  if (signupPasswordToggle) {
    signupPasswordToggle.addEventListener("click", () => {
      const passwordInput = document.getElementById("signupPassword");
      togglePasswordVisibility(signupPasswordToggle, passwordInput);
    });
    console.log("✅ Signup password toggle listener added");
  }

  // Form submissions
  const loginFormElement = document.getElementById("loginFormElement");
  const signupFormElement = document.getElementById("signupFormElement");
  const forgotFormElement = document.getElementById("forgotFormElement");

  if (loginFormElement) {
    loginFormElement.addEventListener("submit", handleLoginSubmit);
    console.log("✅ Login form submit listener added");
  }

  if (signupFormElement) {
    signupFormElement.addEventListener("submit", handleSignupSubmit);
    console.log("✅ Signup form submit listener added");
  }

  if (forgotFormElement) {
    forgotFormElement.addEventListener("submit", handleForgotSubmit);
    console.log("✅ Forgot form submit listener added");
  }

  // Social auth buttons
  document.querySelectorAll(".social-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const provider = this.classList.contains("google") ? "Google" : "Facebook";
      
      // Add effect to button
      this.style.transform = 'translateY(-3px) scale(1.05)';
      this.style.filter = 'drop-shadow(0 5px 15px rgba(255, 215, 0, 0.3))';
      
      setTimeout(() => {
        this.style.transform = '';
        this.style.filter = '';
      }, 300);
      
      showNotification(`${provider} authentication coming soon!`, "info");
    });
  });
  console.log("✅ Social auth buttons listeners added");

  // Newsletter form
  document.getElementById('newsletterForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    showNotification('Thank you for subscribing to Egyptian Creativity!', 'success');
    e.target.reset();
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.tagName !== "BUTTON" && e.target.type !== "submit") {
      const activeForm = document.querySelector(".auth-form-container.active form");
      if (activeForm) {
        const submitBtn = activeForm.querySelector(".auth-btn[type='submit']");
        if (submitBtn) {
          submitBtn.style.filter = 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))';
          setTimeout(() => {
            submitBtn.style.filter = '';
          }, 200);
          submitBtn.click();
        }
      }
    }
  });

  console.log("🏺 All event listeners setup complete");
}

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  console.log("🏺 Egyptian Creativity Auth - Initializing...");

  // Check if all forms exist
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const forgotForm = document.getElementById("forgotForm");

  console.log("Login form found:", !!loginForm);
  console.log("Signup form found:", !!signupForm);
  console.log("Forgot form found:", !!forgotForm);

  setupNavigation();
  setupEventListeners();
  setupPasswordValidation();
  setupInputEnhancements();
  initializeSearchModal();
  ensureSidebarsClosed();

  // Ensure login form is active by default
  if (loginForm) {
    loginForm.classList.add("active");
    console.log("Login form set as active");
  }

  // Add CSS for dynamic button loader
  const style = document.createElement('style');
  style.textContent = `
    .btn-loader {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-left: 8px;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

  console.log("🏺 Egyptian Creativity Auth - Loaded successfully!");
});

// Error handling
window.addEventListener("error", (e) => {
  console.error("An error occurred:", e.error);
  if (typeof showNotification === "function") {
    showNotification("An unexpected error occurred. Please refresh the page.", "error");
  }
});

// Check if user is already logged in
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch('auth.php?action=check_auth');
    const result = await response.json();
    
    if (result.success && result.authenticated) {
      console.log("User already logged in:", result.user.email);
      showNotification(`Welcome back, ${result.user.full_name}!`, "success");
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    } else {
      // Check for saved user data in localStorage as fallback
      const savedUser = localStorage.getItem("egyptianCreativityUser") || sessionStorage.getItem("egyptianCreativityUser");
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          console.log("User already logged in (localStorage):", userData.email);
          showNotification(`Welcome back, explorer of ancient treasures!`, "info");
        } catch (error) {
          console.error("Error parsing user data:", error);
          // Clear invalid data
          localStorage.removeItem("egyptianCreativityUser");
          sessionStorage.removeItem("egyptianCreativityUser");
        }
      }
    }
  } catch (error) {
    console.error("Auth check error:", error);
    // Fallback to localStorage check
    const savedUser = localStorage.getItem("egyptianCreativityUser") || sessionStorage.getItem("egyptianCreativityUser");
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        console.log("User already logged in (fallback):", userData.email);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("egyptianCreativityUser");
        sessionStorage.removeItem("egyptianCreativityUser");
      }
    }
  }
});

// Save data before page unload
window.addEventListener('beforeunload', () => {
  // Any cleanup if needed
});

console.log('🏺 Egyptian Creativity - Enhanced auth script loaded successfully!');

// Search Modal Functionality
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
        if (e.key === 'Escape' && searchModal && searchModal.classList.contains('active')) {
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

// Sidebar open/close logic for cart and wishlist (wrapped in IIFE to avoid redeclaration)
(function() {
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
          window.cart = JSON.parse(localStorage.getItem('egyptianLuxuryCart')) || [];
          openSidebar(cartSidebar);
          if (typeof window.renderCartSidebar === 'function') window.renderCartSidebar();
      });
  }
  if (wishlistBtn && wishlistSidebar) {
      wishlistBtn.addEventListener('click', () => {
          window.wishlist = JSON.parse(localStorage.getItem('egyptianWishlist')) || [];
          openSidebar(wishlistSidebar);
          if (typeof window.renderWishlistSidebar === 'function') window.renderWishlistSidebar();
      });
  }
  if (cartClose && cartSidebar) {
      cartClose.addEventListener('click', () => closeSidebar(cartSidebar));
  }
  if (wishlistClose && wishlistSidebar) {
      wishlistClose.addEventListener('click', () => closeSidebar(wishlistSidebar));
  }

  // Only close sidebar if click is outside any .sidebar
  document.addEventListener('mousedown', (e) => {
      if (!e.target.closest('.sidebar')) {
          if (cartSidebar && cartSidebar.classList.contains('active')) closeSidebar(cartSidebar);
          if (wishlistSidebar && wishlistSidebar.classList.contains('active')) closeSidebar(wishlistSidebar);
      }
  });

  document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
          if (cartSidebar && cartSidebar.classList.contains('active')) closeSidebar(cartSidebar);
          if (wishlistSidebar && wishlistSidebar.classList.contains('active')) closeSidebar(wishlistSidebar);
      }
  });
})();

document.addEventListener('DOMContentLoaded', function() {
    // Cart Sidebar: View Cart button
    const viewCartBtn = document.querySelector('#cartSidebar .cart-actions .btn.btn-outline, #cartSidebar .cart-actions a.btn.btn-outline');
    if (viewCartBtn) {
        viewCartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const cartSidebar = document.getElementById('cartSidebar');
            if (cartSidebar) cartSidebar.classList.remove('active');
            document.body.style.overflow = '';
            setTimeout(() => {
                window.location.href = 'cart.html';
            }, 200);
        });
    }

    // Wishlist Sidebar: View Wishlist button
    const viewWishlistBtn = document.querySelector('#wishlistSidebar .cart-actions .btn.btn-outline, #wishlistSidebar .cart-actions a.btn.btn-outline');
    if (viewWishlistBtn) {
        viewWishlistBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const wishlistSidebar = document.getElementById('wishlistSidebar');
            if (wishlistSidebar) wishlistSidebar.classList.remove('active');
            document.body.style.overflow = '';
            setTimeout(() => {
                window.location.href = 'wishlist.html';
            }, 200);
        });
    }
});