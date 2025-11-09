// ============================================
// NUTSSPHERE ADMIN DASHBOARD - JAVASCRIPT
// ============================================

// Admin State
const adminState = {
    isAuthenticated: false,
    currentAdmin: null,
    allOrders: [],
    allCustomers: [],
    products: [],
    filteredOrders: [],
    currentSection: 'dashboard'
};

// Default Admin Credentials
const DEFAULT_ADMIN = {
    username: 'admin',
    password: 'nutsphere2025',
    name: 'Admin'
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
    loadAdminData();
    setupEventListeners();
});

// ============================================
// AUTHENTICATION
// ============================================

function setupEventListeners() {
    const loginForm = document.getElementById('adminLoginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleAdminLogin);
    }

    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', handleChangePassword);
    }

    const storeInfoForm = document.getElementById('storeInfoForm');
    if (storeInfoForm) {
        storeInfoForm.addEventListener('submit', handleStoreInfoUpdate);
    }
}

function checkAdminAuth() {
    const savedAdmin = localStorage.getItem('adminAuth');
    if (savedAdmin) {
        adminState.currentAdmin = JSON.parse(savedAdmin);
        adminState.isAuthenticated = true;
        showAdminDashboard();
    }
}

function handleAdminLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    // Get admin credentials
    const savedCredentials = localStorage.getItem('adminCredentials');
    const credentials = savedCredentials ? JSON.parse(savedCredentials) : DEFAULT_ADMIN;
    
    if (username === credentials.username && password === credentials.password) {
        adminState.currentAdmin = { username, name: credentials.name };
        adminState.isAuthenticated = true;
        
        localStorage.setItem('adminAuth', JSON.stringify(adminState.currentAdmin));
        
        showAdminDashboard();
    } else {
        alert('Invalid credentials! Please try again.');
    }
}

function logoutAdmin() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('adminAuth');
        adminState.isAuthenticated = false;
        adminState.currentAdmin = null;
        
        document.getElementById('adminDashboard').style.display = 'none';
        document.getElementById('adminLoginPage').style.display = 'block';
    }
}

function showAdminDashboard() {
    document.getElementById('adminLoginPage').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    
    if (adminState.currentAdmin) {
        document.getElementById('adminUserName').textContent = adminState.currentAdmin.name || 'Admin';
    }
    
    loadDashboardData();
}

// ============================================
// DATA LOADING
// ============================================

function loadAdminData() {
    // Load all orders from localStorage
    const allOrders = localStorage.getItem('allOrders');
    adminState.allOrders = allOrders ? JSON.parse(allOrders) : [];
    
    // Load products
    const productsData = localStorage.getItem('productsData');
    if (productsData) {
        adminState.products = JSON.parse(productsData);
    } else {
        // Use default products if none saved
        adminState.products = getDefaultProducts();
        localStorage.setItem('productsData', JSON.stringify(adminState.products));
    }
    
    // Extract unique customers from orders
    extractCustomersFromOrders();
}

function getDefaultProducts() {
    return [
        {
            id: 'pistachios',
            name: 'Premium Pistachios',
            category: 'nuts',
            price: 899,
            image: 'images/pistachos.jpg',
            stock: 100,
            sold: 0
        },
        {
            id: 'almonds',
            name: 'California Almonds',
            category: 'nuts',
            price: 749,
            image: 'images/almonds.jpg',
            stock: 150,
            sold: 0
        },
        {
            id: 'black-raisins',
            name: 'Black Raisins',
            category: 'dried-fruits',
            price: 349,
            image: 'images/black_rasins.jpg',
            stock: 200,
            sold: 0
        },
        {
            id: 'cashews',
            name: 'Premium Cashews',
            category: 'nuts',
            price: 449,
            image: 'images/cashews.jpg',
            stock: 120,
            sold: 0
        },
        {
            id: 'walnuts',
            name: 'Kashmiri Walnuts',
            category: 'nuts',
            price: 399,
            image: 'images/walnuts.jpg',
            stock: 80,
            sold: 0
        }
    ];
}

function extractCustomersFromOrders() {
    const customersMap = new Map();
    
    adminState.allOrders.forEach(order => {
        if (order.customerInfo) {
            const email = order.customerInfo.email;
            if (!customersMap.has(email)) {
                customersMap.set(email, {
                    name: order.customerInfo.name,
                    email: order.customerInfo.email,
                    phone: order.customerInfo.phone || 'N/A',
                    totalOrders: 0,
                    totalSpent: 0,
                    lastOrder: order.date
                });
            }
            
            const customer = customersMap.get(email);
            customer.totalOrders++;
            customer.totalSpent += order.total;
            
            if (new Date(order.date) > new Date(customer.lastOrder)) {
                customer.lastOrder = order.date;
            }
        }
    });
    
    adminState.allCustomers = Array.from(customersMap.values());
}

// ============================================
// DASHBOARD DATA
// ============================================

function loadDashboardData() {
    loadAdminData();
    updateDashboardStats();
    loadRecentOrders();
    loadTopProducts();
}

function updateDashboardStats() {
    // Calculate total revenue
    const totalRevenue = adminState.allOrders.reduce((sum, order) => {
        if (order.status !== 'cancelled') {
            return sum + (order.total || 0);
        }
        return sum;
    }, 0);
    document.getElementById('totalRevenue').textContent = `₹${totalRevenue.toLocaleString()}`;
    
    // Total orders
    document.getElementById('totalOrders').textContent = adminState.allOrders.length;
    
    // Total customers
    document.getElementById('totalCustomers').textContent = adminState.allCustomers.length;
    
    // Low stock count
    const lowStockCount = adminState.products.filter(p => p.stock < 20).length;
    document.getElementById('lowStockCount').textContent = lowStockCount;
    
    // New orders badge
    const newOrders = adminState.allOrders.filter(o => o.status === 'pending').length;
    document.getElementById('newOrdersBadge').textContent = newOrders;
}

function loadRecentOrders() {
    const recentOrders = adminState.allOrders.slice(-5).reverse();
    
    let html = '<table><thead><tr>';
    html += '<th>Order ID</th>';
    html += '<th>Customer</th>';
    html += '<th>Date</th>';
    html += '<th>Amount</th>';
    html += '<th>Status</th>';
    html += '<th>Actions</th>';
    html += '</tr></thead><tbody>';
    
    if (recentOrders.length === 0) {
        html += '<tr><td colspan="6" style="text-align: center; padding: 40px;">No orders yet. Orders will appear here once customers place orders.</td></tr>';
    } else {
        recentOrders.forEach(order => {
            html += `<tr>
                <td><strong>#${order.id}</strong></td>
                <td>${order.customerInfo ? order.customerInfo.name : 'N/A'}</td>
                <td>${formatDate(order.date)}</td>
                <td>₹${order.total.toLocaleString()}</td>
                <td><span class="badge ${order.status}">${order.status.toUpperCase()}</span></td>
                <td><button class="btn-info" onclick="viewOrderDetails('${order.id}')">View</button></td>
            </tr>`;
        });
    }
    
    html += '</tbody></table>';
    document.getElementById('recentOrdersList').innerHTML = html;
}

function loadTopProducts() {
    // Calculate sold products from orders
    const productSales = new Map();
    
    adminState.allOrders.forEach(order => {
        if (order.items) {
            order.items.forEach(item => {
                if (productSales.has(item.id)) {
                    productSales.set(item.id, productSales.get(item.id) + item.quantity);
                } else {
                    productSales.set(item.id, item.quantity);
                }
            });
        }
    });
    
    // Sort products by sales
    const sortedProducts = adminState.products
        .map(p => ({
            ...p,
            sold: productSales.get(p.id) || 0
        }))
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 4);
    
    let html = '';
    sortedProducts.forEach(product => {
        html += `
            <div class="top-product-card">
                <img src="${product.image}" alt="${product.name}">
                <h4>${product.name}</h4>
                <p>Sold: ${product.sold} units</p>
                <p>Revenue: ₹${(product.price * product.sold).toLocaleString()}</p>
            </div>
        `;
    });
    
    if (html === '') {
        html = '<p style="text-align: center; padding: 40px;">No sales data available yet.</p>';
    }
    
    document.getElementById('topProductsList').innerHTML = html;
}

// ============================================
// NAVIGATION
// ============================================

function showAdminSection(sectionName) {
    // Remove active class from all sections and nav items
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to current section
    document.getElementById(`section-${sectionName}`).classList.add('active');
    event.target.closest('.nav-item').classList.add('active');
    
    // Load section-specific data
    switch(sectionName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'orders':
            loadAllOrders();
            break;
        case 'customers':
            loadCustomersTable();
            break;
        case 'products':
            loadProductsTable();
            break;
        case 'stock':
            loadStockManagement();
            break;
    }
}

// ============================================
// ORDERS SECTION
// ============================================

function loadAllOrders() {
    adminState.filteredOrders = [...adminState.allOrders];
    renderOrdersTable();
}

function renderOrdersTable() {
    let html = '<table><thead><tr>';
    html += '<th>Order ID</th>';
    html += '<th>Customer</th>';
    html += '<th>Email</th>';
    html += '<th>Phone</th>';
    html += '<th>Date</th>';
    html += '<th>Amount</th>';
    html += '<th>Payment</th>';
    html += '<th>Status</th>';
    html += '<th>Actions</th>';
    html += '</tr></thead><tbody>';
    
    if (adminState.filteredOrders.length === 0) {
        html += '<tr><td colspan="9" style="text-align: center; padding: 40px;">No orders found.</td></tr>';
    } else {
        adminState.filteredOrders.reverse().forEach(order => {
            html += `<tr>
                <td><strong>#${order.id}</strong></td>
                <td>${order.customerInfo ? order.customerInfo.name : 'N/A'}</td>
                <td>${order.customerInfo ? order.customerInfo.email : 'N/A'}</td>
                <td>${order.customerInfo ? order.customerInfo.phone || 'N/A' : 'N/A'}</td>
                <td>${formatDate(order.date)}</td>
                <td>₹${order.total.toLocaleString()}</td>
                <td>${order.paymentMethod || 'N/A'}</td>
                <td><span class="badge ${order.status}">${order.status.toUpperCase()}</span></td>
                <td>
                    <button class="btn-info" onclick="viewOrderDetails('${order.id}')">View</button>
                    <button class="btn-success" onclick="updateOrderStatus('${order.id}')">Update</button>
                </td>
            </tr>`;
        });
    }
    
    html += '</tbody></table>';
    document.getElementById('ordersTableContainer').innerHTML = html;
}

function filterOrders() {
    const status = document.getElementById('orderStatusFilter').value;
    
    if (status === 'all') {
        adminState.filteredOrders = [...adminState.allOrders];
    } else {
        adminState.filteredOrders = adminState.allOrders.filter(order => order.status === status);
    }
    
    renderOrdersTable();
}

function searchOrders() {
    const searchTerm = document.getElementById('orderSearch').value.toLowerCase();
    
    adminState.filteredOrders = adminState.allOrders.filter(order => {
        const orderId = order.id.toLowerCase();
        const customerName = order.customerInfo ? order.customerInfo.name.toLowerCase() : '';
        const customerEmail = order.customerInfo ? order.customerInfo.email.toLowerCase() : '';
        
        return orderId.includes(searchTerm) || 
               customerName.includes(searchTerm) || 
               customerEmail.includes(searchTerm);
    });
    
    renderOrdersTable();
}

function viewOrderDetails(orderId) {
    const order = adminState.allOrders.find(o => o.id === orderId);
    if (!order) return;
    
    let html = `
        <h2>Order Details - #${order.id}</h2>
        
        <div style="margin: 20px 0;">
            <h3>Customer Information</h3>
            <p><strong>Name:</strong> ${order.customerInfo ? order.customerInfo.name : 'N/A'}</p>
            <p><strong>Email:</strong> ${order.customerInfo ? order.customerInfo.email : 'N/A'}</p>
            <p><strong>Phone:</strong> ${order.customerInfo ? order.customerInfo.phone || 'N/A' : 'N/A'}</p>
        </div>
        
        <div style="margin: 20px 0;">
            <h3>Shipping Address</h3>
            <p>${order.shippingAddress ? formatAddress(order.shippingAddress) : 'N/A'}</p>
        </div>
        
        <div style="margin: 20px 0;">
            <h3>Order Items</h3>
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    if (order.items) {
        order.items.forEach(item => {
            html += `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>₹${item.price}</td>
                    <td>₹${item.price * item.quantity}</td>
                </tr>
            `;
        });
    }
    
    html += `
                </tbody>
            </table>
        </div>
        
        <div style="margin: 20px 0;">
            <h3>Payment Information</h3>
            <p><strong>Method:</strong> ${order.paymentMethod || 'N/A'}</p>
            <p><strong>Status:</strong> <span class="badge ${order.status}">${order.status.toUpperCase()}</span></p>
            <p><strong>Total:</strong> ₹${order.total.toLocaleString()}</p>
            <p><strong>Date:</strong> ${formatDate(order.date)}</p>
        </div>
    `;
    
    document.getElementById('orderDetailsContent').innerHTML = html;
    document.getElementById('orderDetailsModal').style.display = 'block';
}

function closeOrderDetails() {
    document.getElementById('orderDetailsModal').style.display = 'none';
}

function updateOrderStatus(orderId) {
    const order = adminState.allOrders.find(o => o.id === orderId);
    if (!order) return;
    
    const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    const currentIndex = statuses.indexOf(order.status);
    
    const newStatus = prompt(
        `Current Status: ${order.status.toUpperCase()}\n\nSelect new status:\n` +
        `1 - Pending\n2 - Processing\n3 - Shipped\n4 - Delivered\n5 - Cancelled\n\n` +
        `Enter number (1-5):`, 
        currentIndex + 1
    );
    
    if (newStatus && newStatus >= 1 && newStatus <= 5) {
        order.status = statuses[newStatus - 1];
        localStorage.setItem('allOrders', JSON.stringify(adminState.allOrders));
        
        // Update user's order in their orders array
        updateUserOrder(order);
        
        alert(`Order status updated to: ${order.status.toUpperCase()}`);
        loadAllOrders();
        updateDashboardStats();
    }
}

function updateUserOrder(order) {
    // Update the order in the user's orders array
    const allUsersOrders = localStorage.getItem('orders');
    if (allUsersOrders) {
        const orders = JSON.parse(allUsersOrders);
        const orderIndex = orders.findIndex(o => o.id === order.id);
        if (orderIndex !== -1) {
            orders[orderIndex] = order;
            localStorage.setItem('orders', JSON.stringify(orders));
        }
    }
}

// ============================================
// CUSTOMERS SECTION
// ============================================

function loadCustomersTable() {
    let html = '<table><thead><tr>';
    html += '<th>Name</th>';
    html += '<th>Email</th>';
    html += '<th>Phone</th>';
    html += '<th>Total Orders</th>';
    html += '<th>Total Spent</th>';
    html += '<th>Last Order</th>';
    html += '</tr></thead><tbody>';
    
    if (adminState.allCustomers.length === 0) {
        html += '<tr><td colspan="6" style="text-align: center; padding: 40px;">No customers yet.</td></tr>';
    } else {
        adminState.allCustomers.forEach(customer => {
            html += `<tr>
                <td>${customer.name}</td>
                <td>${customer.email}</td>
                <td>${customer.phone}</td>
                <td>${customer.totalOrders}</td>
                <td>₹${customer.totalSpent.toLocaleString()}</td>
                <td>${formatDate(customer.lastOrder)}</td>
            </tr>`;
        });
    }
    
    html += '</tbody></table>';
    document.getElementById('customersTableContainer').innerHTML = html;
}

function searchCustomers() {
    const searchTerm = document.getElementById('customerSearch').value.toLowerCase();
    
    const filtered = adminState.allCustomers.filter(customer => {
        return customer.name.toLowerCase().includes(searchTerm) ||
               customer.email.toLowerCase().includes(searchTerm) ||
               customer.phone.includes(searchTerm);
    });
    
    // Render filtered customers
    let html = '<table><thead><tr>';
    html += '<th>Name</th>';
    html += '<th>Email</th>';
    html += '<th>Phone</th>';
    html += '<th>Total Orders</th>';
    html += '<th>Total Spent</th>';
    html += '<th>Last Order</th>';
    html += '</tr></thead><tbody>';
    
    filtered.forEach(customer => {
        html += `<tr>
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>${customer.totalOrders}</td>
            <td>₹${customer.totalSpent.toLocaleString()}</td>
            <td>${formatDate(customer.lastOrder)}</td>
        </tr>`;
    });
    
    html += '</tbody></table>';
    document.getElementById('customersTableContainer').innerHTML = html;
}

// ============================================
// PRODUCTS SECTION
// ============================================

function loadProductsTable() {
    let html = '<table><thead><tr>';
    html += '<th>Image</th>';
    html += '<th>Name</th>';
    html += '<th>Category</th>';
    html += '<th>Price</th>';
    html += '<th>Stock</th>';
    html += '<th>Status</th>';
    html += '<th>Actions</th>';
    html += '</tr></thead><tbody>';
    
    adminState.products.forEach(product => {
        const stockStatus = product.stock > 50 ? 'high' : product.stock > 20 ? 'medium' : 'low';
        
        html += `<tr>
            <td><img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;"></td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>₹${product.price}</td>
            <td>${product.stock}</td>
            <td>
                <div class="stock-status">
                    <div class="stock-indicator ${stockStatus}"></div>
                    ${product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </div>
            </td>
            <td>
                <button class="btn-info" onclick="editProduct('${product.id}')">Edit</button>
            </td>
        </tr>`;
    });
    
    html += '</tbody></table>';
    document.getElementById('productsTableContainer').innerHTML = html;
}

function editProduct(productId) {
    const product = adminState.products.find(p => p.id === productId);
    if (!product) return;
    
    const newPrice = prompt(`Update price for ${product.name}\nCurrent: ₹${product.price}`, product.price);
    if (newPrice && !isNaN(newPrice)) {
        product.price = parseFloat(newPrice);
        localStorage.setItem('productsData', JSON.stringify(adminState.products));
        alert('Product price updated successfully!');
        loadProductsTable();
    }
}

function showAddProductModal() {
    alert('Product addition feature coming soon! For now, you can edit existing products.');
}

// ============================================
// STOCK MANAGEMENT
// ============================================

function loadStockManagement() {
    const lowStockItems = adminState.products.filter(p => p.stock < 20);
    
    if (lowStockItems.length > 0) {
        document.getElementById('lowStockAlert').textContent = 
            `⚠️ ${lowStockItems.length} product(s) are running low on stock!`;
    } else {
        document.getElementById('lowStockAlert').textContent = 
            '✓ All products have sufficient stock.';
    }
    
    let html = '<table><thead><tr>';
    html += '<th>Product</th>';
    html += '<th>Current Stock</th>';
    html += '<th>Status</th>';
    html += '<th>Update Stock</th>';
    html += '</tr></thead><tbody>';
    
    adminState.products.forEach(product => {
        const stockStatus = product.stock > 50 ? 'high' : product.stock > 20 ? 'medium' : 'low';
        const statusText = product.stock > 50 ? 'Good' : product.stock > 20 ? 'Medium' : 'Low';
        
        html += `<tr>
            <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <img src="${product.image}" alt="${product.name}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 8px;">
                    <strong>${product.name}</strong>
                </div>
            </td>
            <td>${product.stock} units</td>
            <td>
                <div class="stock-status">
                    <div class="stock-indicator ${stockStatus}"></div>
                    ${statusText}
                </div>
            </td>
            <td>
                <button class="btn-success" onclick="updateStock('${product.id}', 'add')">
                    <i class="fas fa-plus"></i> Add
                </button>
                <button class="btn-secondary" onclick="updateStock('${product.id}', 'set')">
                    <i class="fas fa-edit"></i> Set
                </button>
            </td>
        </tr>`;
    });
    
    html += '</tbody></table>';
    document.getElementById('stockTableContainer').innerHTML = html;
}

function updateStock(productId, action) {
    const product = adminState.products.find(p => p.id === productId);
    if (!product) return;
    
    if (action === 'add') {
        const quantity = prompt(`Add stock for ${product.name}\nCurrent stock: ${product.stock}`, 50);
        if (quantity && !isNaN(quantity)) {
            product.stock += parseInt(quantity);
            localStorage.setItem('productsData', JSON.stringify(adminState.products));
            alert(`Added ${quantity} units. New stock: ${product.stock}`);
            loadStockManagement();
            updateDashboardStats();
        }
    } else if (action === 'set') {
        const quantity = prompt(`Set stock for ${product.name}\nCurrent stock: ${product.stock}`, product.stock);
        if (quantity && !isNaN(quantity)) {
            product.stock = parseInt(quantity);
            localStorage.setItem('productsData', JSON.stringify(adminState.products));
            alert(`Stock set to ${quantity} units`);
            loadStockManagement();
            updateDashboardStats();
        }
    }
}

// ============================================
// SETTINGS
// ============================================

function handleChangePassword(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    const savedCredentials = localStorage.getItem('adminCredentials');
    const credentials = savedCredentials ? JSON.parse(savedCredentials) : DEFAULT_ADMIN;
    
    if (currentPassword !== credentials.password) {
        alert('Current password is incorrect!');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        alert('New passwords do not match!');
        return;
    }
    
    if (newPassword.length < 6) {
        alert('New password must be at least 6 characters long!');
        return;
    }
    
    credentials.password = newPassword;
    localStorage.setItem('adminCredentials', JSON.stringify(credentials));
    
    alert('Password changed successfully!');
    e.target.reset();
}

function handleStoreInfoUpdate(e) {
    e.preventDefault();
    
    const storeInfo = {
        name: document.getElementById('storeName').value,
        email: document.getElementById('storeEmail').value,
        phone: document.getElementById('storePhone').value
    };
    
    localStorage.setItem('storeInfo', JSON.stringify(storeInfo));
    alert('Store information updated successfully!');
}

function clearAllData() {
    if (confirm('⚠️ WARNING: This will delete ALL orders and customer data!\n\nAre you absolutely sure?')) {
        if (confirm('This action cannot be undone. Continue?')) {
            localStorage.removeItem('allOrders');
            localStorage.removeItem('orders');
            adminState.allOrders = [];
            adminState.allCustomers = [];
            
            alert('All data cleared successfully!');
            loadDashboardData();
            loadAllOrders();
            loadCustomersTable();
        }
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-IN', options);
}

function formatAddress(address) {
    if (!address) return 'N/A';
    return `${address.street || ''}, ${address.city || ''}, ${address.state || ''} ${address.pincode || ''}, ${address.country || ''}`;
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('orderDetailsModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}
