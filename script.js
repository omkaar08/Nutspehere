// ============================================
// NUTSSPHERE E-COMMERCE - COMPLETE JAVASCRIPT
// ============================================

// Global State Management
const appState = {
    user: null,
    cart: [],
    wishlist: [],
    orders: [],
    products: [],
    currentCheckoutStep: 1,
    shippingAddress: null,
    paymentMethod: null
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadProducts();
    setupEventListeners();
    checkAuth();
    loadCart();
    animateHero();
});

// Initialize Application
function initializeApp() {
    // Load from localStorage
    const savedCart = localStorage.getItem('cart');
    const savedUser = localStorage.getItem('user');
    const savedOrders = localStorage.getItem('orders');
    const savedWishlist = localStorage.getItem('wishlist');
    
    if (savedCart) appState.cart = JSON.parse(savedCart);
    if (savedUser) appState.user = JSON.parse(savedUser);
    if (savedOrders) appState.orders = JSON.parse(savedOrders);
    if (savedWishlist) appState.wishlist = JSON.parse(savedWishlist);
    
    updateCartBadge();
    updateAccountMenu();
}

// ====================
// PRODUCTS SECTION
// ====================

// Product Data
const productsData = [
    {
        id: 'pistachios',
        name: 'Roasted Pistachios',
        category: 'nuts',
        description: 'Premium quality roasted pistachios, responsibly sourced and hygienically packed. Pure goodness in every bite.',
        image: 'images/pistachos.jpg',
        price: 899,
        originalPrice: 999,
        discount: 10,
        variants: [
            { size: '250g', price: 899 },
            { size: '500g', price: 1699 },
            { size: '1kg', price: 3199 }
        ],
        features: ['High Protein', 'Premium Quality'],
        badges: ['Premium Quality', 'Roasted'],
        inStock: true
    },
    {
        id: 'almonds',
        name: 'California Almonds',
        category: 'nuts',
        description: 'Premium California almonds, rich in nutrients and perfect for a healthy lifestyle. Naturally sweet and crunchy.',
        image: 'images/almonds.jpg',
        price: 749,
        originalPrice: 849,
        discount: 12,
        variants: [
            { size: '250g', price: 749 },
            { size: '500g', price: 1399 },
            { size: '1kg', price: 2699 }
        ],
        features: ['High Protein', 'Heart Healthy'],
        badges: ['Premium Quality', 'California'],
        inStock: true
    },
    {
        id: 'black-raisins',
        name: 'Black Raisins',
        category: 'dried-fruits',
        description: 'Natural sun-dried black raisins, rich in antioxidants and natural iron. Perfect for snacking or cooking.',
        image: 'images/black_rasins.jpg',
        price: 349,
        originalPrice: 399,
        discount: 13,
        variants: [
            { size: '250g', price: 349 },
            { size: '500g', price: 649 },
            { size: '1kg', price: 1199 }
        ],
        features: ['Antioxidants', 'Natural Iron'],
        badges: ['Premium Quality', 'Natural'],
        inStock: true
    },
    {
        id: 'cashews',
        name: 'Whole Cashews',
        category: 'nuts',
        description: 'Premium whole cashews, rich in healthy fats and essential minerals. Creamy texture and delicious taste.',
        image: 'images/cashews.jpg',
        price: 449,
        originalPrice: 499,
        discount: 10,
        variants: [
            { size: '250g', price: 449 },
            { size: '500g', price: 849 },
            { size: '1kg', price: 1599 }
        ],
        features: ['High Protein', 'Healthy Fats'],
        badges: ['Premium Quality', 'Whole'],
        inStock: true
    },
    {
        id: 'walnuts',
        name: 'Inshell Walnuts',
        category: 'nuts',
        description: 'Premium inshell walnuts, packed with Omega-3 fatty acids. Great for brain health and overall wellness.',
        image: 'images/walnuts.jpg',
        price: 399,
        originalPrice: 449,
        discount: 11,
        variants: [
            { size: '250g', price: 399 },
            { size: '500g', price: 749 },
            { size: '1kg', price: 1399 }
        ],
        features: ['Omega-3', 'Brain Health'],
        badges: ['Premium Quality', 'Inshell'],
        inStock: true
    }
];

// Load and Display Products
function loadProducts(filter = 'all') {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    appState.products = productsData;
    
    const filtered = filter === 'all' 
        ? productsData 
        : productsData.filter(p => p.category === filter);
    
    productsGrid.innerHTML = filtered.map(product => createProductCard(product)).join('');
}

// Create Product Card HTML
function createProductCard(product) {
    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    
    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image" onclick="showQuickView('${product.id}')">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='images/final_nutsphere_logo_01-removebg-preview.png'">
                <div class="product-badges">
                    ${product.badges.map(badge => `<span class="badge">${badge}</span>`).join('')}
                </div>
            </div>
            <div class="product-content">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">
                    <span class="current-price">₹${product.price}</span>
                    <span class="original-price">₹${product.originalPrice}</span>
                    <span class="discount">${discount}% OFF</span>
                </div>
                <div class="product-features">
                    ${product.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                </div>
                <div class="quantity-selector">
                    <button class="qty-btn" onclick="decreaseProductQty('${product.id}')">-</button>
                    <span class="qty-display" id="qty-${product.id}">1</span>
                    <button class="qty-btn" onclick="increaseProductQty('${product.id}')">+</button>
                </div>
                <button class="add-to-cart-btn" onclick="addToCart('${product.id}')">
                    <i class="fas fa-shopping-cart"></i>
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}

// Product Quantity Controls
function increaseProductQty(productId) {
    const qtyElement = document.getElementById(`qty-${productId}`);
    const currentQty = parseInt(qtyElement.textContent);
    qtyElement.textContent = currentQty + 1;
}

function decreaseProductQty(productId) {
    const qtyElement = document.getElementById(`qty-${productId}`);
    const currentQty = parseInt(qtyElement.textContent);
    if (currentQty > 1) {
        qtyElement.textContent = currentQty - 1;
    }
}

// Product Filter
function setupEventListeners() {
    // Product Filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const category = this.dataset.category;
            loadProducts(category);
        });
    });
    
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Auth Tabs
    const authTabs = document.querySelectorAll('.auth-tab');
    authTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            authTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const tabName = this.dataset.tab;
            document.querySelectorAll('.auth-form').forEach(form => {
                form.classList.remove('active');
            });
            document.querySelector(`[data-form="${tabName}"]`).classList.add('active');
        });
    });
    
    // Dashboard Tabs
    const dashboardMenuItems = document.querySelectorAll('.dashboard-menu li[data-tab]');
    dashboardMenuItems.forEach(item => {
        item.addEventListener('click', function() {
            dashboardMenuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            const tabName = this.dataset.tab;
            document.querySelectorAll('.dashboard-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            document.getElementById(`${tabName}Tab`).classList.add('active');
        });
    });
    
    // Form Submissions
    setupFormHandlers();
    
    // Back to Top
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    });
    
    if (backToTop) {
        backToTop.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Payment Method Selection
    const paymentOptions = document.querySelectorAll('input[name="paymentMethod"]');
    paymentOptions.forEach(option => {
        option.addEventListener('change', function() {
            handlePaymentMethodChange(this.value);
        });
    });
}

// ====================
// SHOPPING CART
// ====================

// Add to Cart
function addToCart(productId) {
    const product = appState.products.find(p => p.id === productId);
    if (!product) return;
    
    const qtyElement = document.getElementById(`qty-${productId}`);
    const quantity = qtyElement ? parseInt(qtyElement.textContent) : 1;
    
    const existingItem = appState.cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        appState.cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    saveCart();
    updateCartUI();
    showToast(`${product.name} added to cart!`);
    
    // Reset quantity display
    if (qtyElement) qtyElement.textContent = '1';
}

// Remove from Cart
function removeFromCart(productId) {
    appState.cart = appState.cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    showToast('Item removed from cart');
}

// Update Cart Item Quantity
function updateCartItemQty(productId, change) {
    const item = appState.cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

// Save Cart to LocalStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(appState.cart));
    updateCartBadge();
}

// Load Cart from LocalStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        appState.cart = JSON.parse(savedCart);
        updateCartBadge();
    }
}

// Update Cart Badge
function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (badge) {
        const totalItems = appState.cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

// Update Cart UI
function updateCartUI() {
    const cartItems = document.getElementById('cartItems');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems) return;
    
    if (appState.cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #9E9E9E; padding: 2rem;">Your cart is empty</p>';
        if (cartSubtotal) cartSubtotal.textContent = '₹0';
        if (cartTotal) cartTotal.textContent = '₹0';
        return;
    }
    
    const subtotal = appState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 1000 ? 0 : 50;
    const total = subtotal + shipping;
    
    cartItems.innerHTML = appState.cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='images/final_nutsphere_logo_01-removebg-preview.png'">
            </div>
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.name}</h4>
                <p class="cart-item-price">₹${item.price}</p>
                <div class="cart-item-actions">
                    <div class="cart-item-qty">
                        <button onclick="updateCartItemQty('${item.id}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateCartItemQty('${item.id}', 1)">+</button>
                    </div>
                    <button class="remove-cart-item" onclick="removeFromCart('${item.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    if (cartSubtotal) cartSubtotal.textContent = `₹${subtotal}`;
    if (cartTotal) cartTotal.textContent = `₹${total}`;
    
    const shippingElement = document.getElementById('cartShipping');
    if (shippingElement) {
        shippingElement.textContent = shipping === 0 ? 'FREE' : `₹${shipping}`;
    }
}

// Toggle Cart Sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    if (cartSidebar && cartOverlay) {
        cartSidebar.classList.toggle('active');
        cartOverlay.classList.toggle('active');
        
        if (cartSidebar.classList.contains('active')) {
            updateCartUI();
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
}

// ====================
// CHECKOUT PROCESS
// ====================

// Proceed to Checkout
function proceedToCheckout() {
    if (appState.cart.length === 0) {
        showToast('Your cart is empty!');
        return;
    }
    
    if (!appState.user) {
        toggleCart();
        showAuthModal();
        showToast('Please login to continue');
        return;
    }
    
    toggleCart();
    showCheckoutModal();
    updateCheckoutSummary();
}

// Show Checkout Modal
function showCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        nextCheckoutStep(1);
    }
}

// Close Checkout Modal
function closeCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Navigate Checkout Steps
function nextCheckoutStep(step) {
    if (step === 2 && !validateShippingForm()) {
        return;
    }
    
    if (step === 3 && !validatePaymentMethod()) {
        return;
    }
    
    appState.currentCheckoutStep = step;
    
    // Update step indicators
    document.querySelectorAll('.step').forEach((stepEl, index) => {
        if (index + 1 < step) {
            stepEl.classList.add('completed');
        } else if (index + 1 === step) {
            stepEl.classList.add('active');
        } else {
            stepEl.classList.remove('active', 'completed');
        }
    });
    
    // Show appropriate step content
    document.querySelectorAll('.checkout-step').forEach(stepContent => {
        stepContent.classList.remove('active');
    });
    document.getElementById(`checkoutStep${step}`).classList.add('active');
    
    // Update review if on step 3
    if (step === 3) {
        updateOrderReview();
    }
}

// Validate Shipping Form
function validateShippingForm() {
    const form = document.getElementById('shippingForm');
    if (!form) return false;
    
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#F44336';
            isValid = false;
        } else {
            field.style.borderColor = '';
        }
    });
    
    if (isValid) {
        appState.shippingAddress = {
            name: document.getElementById('shipName').value,
            phone: document.getElementById('shipPhone').value,
            address: document.getElementById('shipAddress').value,
            city: document.getElementById('shipCity').value,
            state: document.getElementById('shipState').value,
            pincode: document.getElementById('shipPincode').value,
            country: document.getElementById('shipCountry').value
        };
    } else {
        showToast('Please fill all required fields');
    }
    
    return isValid;
}

// Validate Payment Method
function validatePaymentMethod() {
    const selected = document.querySelector('input[name="paymentMethod"]:checked');
    if (!selected) {
        showToast('Please select a payment method');
        return false;
    }
    
    appState.paymentMethod = selected.value;
    return true;
}

// Handle Payment Method Change
function handlePaymentMethodChange(method) {
    const paymentDetails = document.getElementById('paymentDetails');
    if (!paymentDetails) return;
    
    let content = '';
    
    if (method === 'card') {
        content = `
            <div class="form-group">
                <label>Card Number</label>
                <input type="text" placeholder="1234 5678 9012 3456" required>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Expiry Date</label>
                    <input type="text" placeholder="MM/YY" required>
                </div>
                <div class="form-group">
                    <label>CVV</label>
                    <input type="text" placeholder="123" required>
                </div>
            </div>
        `;
    } else if (method === 'upi') {
        content = `
            <div class="form-group">
                <label>UPI ID</label>
                <input type="text" placeholder="username@upi" required>
            </div>
        `;
    } else if (method === 'netbanking') {
        content = `
            <div class="form-group">
                <label>Select Bank</label>
                <select required>
                    <option value="">Choose your bank</option>
                    <option value="sbi">State Bank of India</option>
                    <option value="hdfc">HDFC Bank</option>
                    <option value="icici">ICICI Bank</option>
                    <option value="axis">Axis Bank</option>
                </select>
            </div>
        `;
    }
    
    paymentDetails.innerHTML = content;
}

// Update Checkout Summary
function updateCheckoutSummary() {
    const summaryItems = document.getElementById('checkoutSummaryItems');
    const checkoutSubtotal = document.getElementById('checkoutSubtotal');
    const checkoutShipping = document.getElementById('checkoutShipping');
    const checkoutTotal = document.getElementById('checkoutTotal');
    
    if (!summaryItems) return;
    
    const subtotal = appState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 1000 ? 0 : 50;
    const total = subtotal + shipping;
    
    summaryItems.innerHTML = appState.cart.map(item => `
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem; font-size: 0.9rem;">
            <span>${item.name} x ${item.quantity}</span>
            <span>₹${item.price * item.quantity}</span>
        </div>
    `).join('');
    
    if (checkoutSubtotal) checkoutSubtotal.textContent = `₹${subtotal}`;
    if (checkoutShipping) checkoutShipping.textContent = shipping === 0 ? 'FREE' : `₹${shipping}`;
    if (checkoutTotal) checkoutTotal.textContent = `₹${total}`;
}

// Update Order Review
function updateOrderReview() {
    const reviewShipping = document.getElementById('reviewShipping');
    const reviewItems = document.getElementById('reviewItems');
    const reviewPayment = document.getElementById('reviewPayment');
    const reviewSubtotal = document.getElementById('reviewSubtotal');
    const reviewShippingCost = document.getElementById('reviewShippingCost');
    const reviewGrandTotal = document.getElementById('reviewGrandTotal');
    
    if (appState.shippingAddress && reviewShipping) {
        const addr = appState.shippingAddress;
        reviewShipping.innerHTML = `
            <p><strong>${addr.name}</strong></p>
            <p>${addr.phone}</p>
            <p>${addr.address}</p>
            <p>${addr.city}, ${addr.state} - ${addr.pincode}</p>
            <p>${addr.country}</p>
        `;
    }
    
    if (reviewItems) {
        reviewItems.innerHTML = appState.cart.map(item => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
                <span>${item.name} x ${item.quantity}</span>
                <span>₹${item.price * item.quantity}</span>
            </div>
        `).join('');
    }
    
    if (reviewPayment && appState.paymentMethod) {
        const paymentMethods = {
            'cod': 'Cash on Delivery',
            'upi': 'UPI Payment',
            'card': 'Credit/Debit Card',
            'netbanking': 'Net Banking'
        };
        reviewPayment.textContent = paymentMethods[appState.paymentMethod] || appState.paymentMethod;
    }
    
    const subtotal = appState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 1000 ? 0 : 50;
    const total = subtotal + shipping;
    
    if (reviewSubtotal) reviewSubtotal.textContent = `₹${subtotal}`;
    if (reviewShippingCost) reviewShippingCost.textContent = shipping === 0 ? 'FREE' : `₹${shipping}`;
    if (reviewGrandTotal) reviewGrandTotal.textContent = `₹${total}`;
}

// Place Order
function placeOrder() {
    if (!appState.user) {
        showToast('Please login to place order');
        return;
    }
    
    showLoading();
    
    // Simulate order processing
    setTimeout(() => {
        const orderId = 'ORD' + Date.now();
        const orderDate = new Date().toISOString();
        const subtotal = appState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal >= 1000 ? 0 : 50;
        const total = subtotal + shipping;
        
        const order = {
            id: orderId,
            date: orderDate,
            items: [...appState.cart],
            shippingAddress: appState.shippingAddress,
            paymentMethod: appState.paymentMethod,
            customerInfo: {
                name: appState.user.name,
                email: appState.user.email,
                phone: appState.user.phone || appState.shippingAddress?.phone || 'N/A'
            },
            subtotal: subtotal,
            shipping: shipping,
            total: total,
            status: 'pending'
        };
        
        appState.orders.push(order);
        localStorage.setItem('orders', JSON.stringify(appState.orders));
        
        // Save to allOrders for admin view
        const allOrders = JSON.parse(localStorage.getItem('allOrders') || '[]');
        allOrders.push(order);
        localStorage.setItem('allOrders', JSON.stringify(allOrders));
        
        // Clear cart
        appState.cart = [];
        saveCart();
        updateCartUI();
        
        hideLoading();
        closeCheckoutModal();
        
        showToast('Order placed successfully! Order ID: ' + orderId);
        
        // Show order confirmation
        setTimeout(() => {
            showOrderConfirmation(order);
        }, 500);
    }, 2000);
}

// Show Order Confirmation
function showOrderConfirmation(order) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" onclick="this.closest('.modal').remove()">
                <i class="fas fa-times"></i>
            </button>
            <div style="text-align: center; padding: 2rem;">
                <div style="font-size: 4rem; color: #4CAF50; margin-bottom: 1rem;">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2>Order Placed Successfully!</h2>
                <p style="color: #616161; margin: 1rem 0;">Thank you for your order</p>
                <div style="background: #F5F5F5; padding: 1.5rem; border-radius: 12px; margin: 2rem 0;">
                    <p><strong>Order ID:</strong> ${order.id}</p>
                    <p><strong>Total Amount:</strong> ₹${order.total}</p>
                    <p><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
                </div>
                <p style="font-size: 0.9rem; color: #9E9E9E;">
                    You will receive an order confirmation email shortly
                </p>
                <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 2rem;">
                    <button class="btn btn-primary" onclick="this.closest('.modal').remove(); showDashboard()">
                        View Orders
                    </button>
                    <button class="btn btn-outline" onclick="this.closest('.modal').remove()">
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// ====================
// USER AUTHENTICATION
// ====================

// Show Auth Modal
function showAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close Auth Modal
function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Setup Form Handlers
function setupFormHandlers() {
    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
    
    // Register Form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRegister();
        });
    }
    
    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactForm();
        });
    }
    
    // Newsletter Form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleNewsletter();
        });
    }
    
    // Profile Form
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleProfileUpdate();
        });
    }
}

// Handle Login
function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    showLoading();
    
    // Simulate login process
    setTimeout(() => {
        const user = {
            id: 'user_' + Date.now(),
            name: email.split('@')[0],
            email: email,
            phone: '+91 9876543210',
            createdAt: new Date().toISOString()
        };
        
        appState.user = user;
        localStorage.setItem('user', JSON.stringify(user));
        
        hideLoading();
        closeAuthModal();
        updateAccountMenu();
        showToast('Login successful!');
    }, 1500);
}

// Handle Register
function handleRegister() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    if (password !== confirmPassword) {
        showToast('Passwords do not match!');
        return;
    }
    
    showLoading();
    
    // Simulate registration process
    setTimeout(() => {
        const user = {
            id: 'user_' + Date.now(),
            name: name,
            email: email,
            phone: phone,
            createdAt: new Date().toISOString()
        };
        
        appState.user = user;
        localStorage.setItem('user', JSON.stringify(user));
        
        hideLoading();
        closeAuthModal();
        updateAccountMenu();
        showToast('Registration successful!');
    }, 1500);
}

// Check Auth Status
function checkAuth() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        appState.user = JSON.parse(savedUser);
        updateAccountMenu();
    }
}

// Update Account Menu
function updateAccountMenu() {
    const accountMenuName = document.getElementById('accountUserName');
    const dashUserName = document.getElementById('dashUserName');
    const dashUserEmail = document.getElementById('dashUserEmail');
    const navUserName = document.getElementById('navUserName');
    const accountMenuItems = document.getElementById('accountMenuItems');
    
    if (appState.user) {
        if (accountMenuName) accountMenuName.textContent = appState.user.name;
        if (dashUserName) dashUserName.textContent = appState.user.name;
        if (dashUserEmail) dashUserEmail.textContent = appState.user.email;
        if (navUserName) navUserName.textContent = appState.user.name.split(' ')[0];
        
        if (accountMenuItems) {
            accountMenuItems.innerHTML = `
                <a href="#" onclick="showDashboard(); return false;">
                    <i class="fas fa-box"></i> My Orders
                </a>
                <a href="#" onclick="showDashboard(); return false;">
                    <i class="fas fa-user"></i> Profile
                </a>
                <a href="#" onclick="showDashboard(); return false;">
                    <i class="fas fa-heart"></i> Wishlist
                </a>
                <a href="#" onclick="logout(); return false;">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </a>
            `;
        }
    } else {
        if (navUserName) navUserName.textContent = 'Account';
        if (accountMenuItems) {
            accountMenuItems.innerHTML = `
                <a href="#" onclick="showAuthModal(); toggleAccountMenu(); return false;">
                    <i class="fas fa-sign-in-alt"></i> Login
                </a>
                <a href="#" onclick="showAuthModal(); toggleAccountMenu(); return false;">
                    <i class="fas fa-user-plus"></i> Register
                </a>
            `;
        }
    }
}

// Toggle Account Menu
function toggleAccountMenu() {
    const dropdown = document.getElementById('accountDropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

// Logout
function logout() {
    appState.user = null;
    localStorage.removeItem('user');
    updateAccountMenu();
    showToast('Logged out successfully');
    toggleAccountMenu();
}

// ====================
// USER DASHBOARD
// ====================

// Show Dashboard
function showDashboard() {
    if (!appState.user) {
        showAuthModal();
        return;
    }
    
    const modal = document.getElementById('dashboardModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        loadDashboardData();
    }
    
    toggleAccountMenu();
}

// Close Dashboard
function closeDashboardModal() {
    const modal = document.getElementById('dashboardModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Load Dashboard Data
function loadDashboardData() {
    loadOrders();
    loadProfile();
}

// Load Orders
function loadOrders() {
    const ordersList = document.getElementById('ordersList');
    if (!ordersList) return;
    
    if (appState.orders.length === 0) {
        ordersList.innerHTML = '<p style="text-align: center; color: #9E9E9E; padding: 2rem;">No orders yet</p>';
        return;
    }
    
    ordersList.innerHTML = appState.orders.reverse().map(order => `
        <div class="order-card">
            <div class="order-header">
                <div>
                    <strong>Order #${order.id}</strong>
                    <p style="color: #9E9E9E; font-size: 0.9rem;">${new Date(order.date).toLocaleDateString()}</p>
                </div>
                <span class="order-status ${order.status}">${order.status.toUpperCase()}</span>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span>${item.name} x ${item.quantity}</span>
                        <span>₹${item.price * item.quantity}</span>
                    </div>
                `).join('')}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #E0E0E0;">
                <strong>Total: ₹${order.total}</strong>
                <button class="btn btn-outline" onclick="trackOrder('${order.id}')">
                    <i class="fas fa-truck"></i> Track Order
                </button>
            </div>
        </div>
    `).join('');
}

// Load Profile
function loadProfile() {
    if (!appState.user) return;
    
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profilePhone = document.getElementById('profilePhone');
    
    if (profileName) profileName.value = appState.user.name || '';
    if (profileEmail) profileEmail.value = appState.user.email || '';
    if (profilePhone) profilePhone.value = appState.user.phone || '';
}

// Handle Profile Update
function handleProfileUpdate() {
    const name = document.getElementById('profileName').value;
    const email = document.getElementById('profileEmail').value;
    const phone = document.getElementById('profilePhone').value;
    
    appState.user.name = name;
    appState.user.email = email;
    appState.user.phone = phone;
    
    localStorage.setItem('user', JSON.stringify(appState.user));
    updateAccountMenu();
    showToast('Profile updated successfully!');
}

// ====================
// ORDER TRACKING
// ====================

// Show Order Tracking
function showOrderTracking() {
    const modal = document.getElementById('orderTrackingModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close Order Tracking
function closeOrderTrackingModal() {
    const modal = document.getElementById('orderTrackingModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Track Order
function trackOrder(orderId) {
    const order = appState.orders.find(o => o.id === orderId);
    if (!order) {
        showToast('Order not found');
        return;
    }
    
    showOrderTracking();
    
    const trackingResult = document.getElementById('trackingResult');
    if (trackingResult) {
        trackingResult.innerHTML = `
            <div style="padding: 2rem 0;">
                <h4>Order #${order.id}</h4>
                <p style="color: #9E9E9E; margin-bottom: 2rem;">Placed on ${new Date(order.date).toLocaleDateString()}</p>
                
                <div class="tracking-timeline">
                    <div class="tracking-step active">
                        <div class="step-icon"><i class="fas fa-check"></i></div>
                        <div class="step-content">
                            <h5>Order Placed</h5>
                            <p>${new Date(order.date).toLocaleString()}</p>
                        </div>
                    </div>
                    <div class="tracking-step ${order.status !== 'pending' ? 'active' : ''}">
                        <div class="step-icon"><i class="fas fa-box"></i></div>
                        <div class="step-content">
                            <h5>Processing</h5>
                            <p>${order.status !== 'pending' ? 'In progress' : 'Pending'}</p>
                        </div>
                    </div>
                    <div class="tracking-step ${order.status === 'shipped' || order.status === 'delivered' ? 'active' : ''}">
                        <div class="step-icon"><i class="fas fa-truck"></i></div>
                        <div class="step-content">
                            <h5>Shipped</h5>
                            <p>${order.status === 'shipped' || order.status === 'delivered' ? 'On the way' : 'Not yet shipped'}</p>
                        </div>
                    </div>
                    <div class="tracking-step ${order.status === 'delivered' ? 'active' : ''}">
                        <div class="step-icon"><i class="fas fa-home"></i></div>
                        <div class="step-content">
                            <h5>Delivered</h5>
                            <p>${order.status === 'delivered' ? 'Delivered' : 'Not yet delivered'}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// ====================
// UTILITY FUNCTIONS
// ====================

// Show Toast Notification
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.classList.add('active');
        
        setTimeout(() => {
            toast.classList.remove('active');
        }, 3000);
    }
}

// Show Loading
function showLoading() {
    const loading = document.getElementById('loadingOverlay');
    if (loading) {
        loading.classList.add('active');
    }
}

// Hide Loading
function hideLoading() {
    const loading = document.getElementById('loadingOverlay');
    if (loading) {
        loading.classList.remove('active');
    }
}

// Quick View Product
function showQuickView(productId) {
    const product = appState.products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('quickViewModal');
    const content = document.getElementById('quickViewContent');
    
    if (modal && content) {
        content.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                <div>
                    <img src="${product.image}" alt="${product.name}" style="width: 100%; border-radius: 12px;" onerror="this.src='images/final_nutsphere_logo_01-removebg-preview.png'">
                </div>
                <div>
                    <h2>${product.name}</h2>
                    <p style="color: #616161; margin: 1rem 0;">${product.description}</p>
                    <div style="display: flex; align-items: center; gap: 1rem; margin: 1.5rem 0;">
                        <span style="font-size: 2rem; font-weight: 700; color: #E65100;">₹${product.price}</span>
                        <span style="color: #9E9E9E; text-decoration: line-through;">₹${product.originalPrice}</span>
                        <span style="background: #4CAF50; color: white; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.85rem;">${product.discount}% OFF</span>
                    </div>
                    <div style="margin: 1.5rem 0;">
                        <h4>Features:</h4>
                        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem;">
                            ${product.features.map(f => `<span style="background: #F5F5F5; padding: 0.5rem 1rem; border-radius: 8px;">${f}</span>`).join('')}
                        </div>
                    </div>
                    <button class="btn btn-primary btn-block" onclick="addToCart('${product.id}'); closeQuickView();">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                </div>
            </div>
        `;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close Quick View
function closeQuickView() {
    const modal = document.getElementById('quickViewModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Handle Contact Form
function handleContactForm() {
    showLoading();
    setTimeout(() => {
        hideLoading();
        document.getElementById('contactForm').reset();
        showToast('Message sent successfully! We will get back to you soon.');
    }, 1500);
}

// Handle Newsletter
function handleNewsletter() {
    showToast('Thank you for subscribing!');
    document.getElementById('newsletterForm').reset();
}

// Animate Hero Stats
function animateHero() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = parseInt(stat.dataset.target);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                stat.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    });
}

// Toggle Mobile Menu
function toggleMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    }
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
    const accountDropdown = document.getElementById('accountDropdown');
    const userBtn = document.querySelector('.user-btn');
    
    if (accountDropdown && !accountDropdown.contains(e.target) && !userBtn?.contains(e.target)) {
        accountDropdown.classList.remove('active');
    }
});

// Helper Functions for UI
function showReturnPolicy() {
    showToast('Return policy page - Coming soon!');
}

function showShippingInfo() {
    showToast('Shipping info page - Coming soon!');
}

function showFAQ() {
    showToast('FAQ page - Coming soon!');
}

function showAddAddressForm() {
    showToast('Add address feature - Coming soon!');
}

console.log('NutsSphere E-Commerce System Loaded Successfully! 🎉');