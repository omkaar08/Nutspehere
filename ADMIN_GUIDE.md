# 🛡️ Admin Dashboard - NutsSphere

## 📋 Overview

The Admin Dashboard is a complete seller/administrator management system that allows you to:

- **View All Orders** - See who ordered what with complete customer details
- **Manage Customers** - Track customer information and purchase history
- **Update Stock** - Manage product inventory in real-time
- **Track Sales** - Monitor revenue and popular products
- **Change Order Status** - Update order status from pending to delivered

## 🔐 Access Admin Dashboard

### URL
Open in your browser:
```
http://localhost/admin.html
```
Or when deployed to GitHub Pages:
```
https://omkaar08.github.io/Nutspehere/admin.html
```

You can also access it from the main website footer - look for **"Admin Login"** link.

### Default Login Credentials

**Username:** `admin`  
**Password:** `nutsphere2025`

⚠️ **IMPORTANT:** Change the password after first login from Settings → Change Password

---

## 🎯 Features

### 1. **Dashboard Overview**
- Total Revenue (₹)
- Total Orders count
- Total Customers
- Low Stock Alerts
- Recent Orders (last 5)
- Top Selling Products

### 2. **Orders Management**

#### View All Orders
- Complete order list with customer details
- Filter by status:
  - Pending
  - Processing
  - Shipped
  - Delivered
  - Cancelled
- Search by Order ID, Customer Name, or Email

#### Order Details
Click "View" on any order to see:
- **Customer Information**
  - Full Name
  - Email Address
  - Phone Number
  
- **Shipping Address**
  - Complete delivery address
  
- **Order Items**
  - Product name
  - Quantity ordered
  - Price per item
  - Total amount
  
- **Payment Information**
  - Payment method (COD/UPI/Card/Net Banking)
  - Order status
  - Order date & time
  - Total amount

#### Update Order Status
Click "Update" button to change order status:
1. **Pending** - Order placed, not yet processed
2. **Processing** - Order being prepared
3. **Shipped** - Order dispatched
4. **Delivered** - Order delivered successfully
5. **Cancelled** - Order cancelled

The customer will see the updated status in their "My Orders" section.

### 3. **Customer Management**

View complete customer database:
- Customer Name
- Email Address
- Phone Number
- Total Orders placed
- Total Amount Spent (₹)
- Last Order Date

**Search Customers:**
- Search by name, email, or phone number
- Instant filtering as you type

### 4. **Product Management**

View all products with:
- Product Image
- Product Name
- Category
- Current Price
- Stock Level
- Stock Status (In Stock/Out of Stock)

**Edit Products:**
- Click "Edit" to update product price
- Changes reflect immediately on the website

### 5. **Stock Management** ⚡

**Critical for Running Your Business!**

#### Monitor Stock Levels
- **Green Indicator:** Good stock (50+ units)
- **Orange Indicator:** Medium stock (20-50 units)
- **Red Indicator:** Low stock (<20 units)

#### Update Stock

**Add Stock:**
1. Click "Add" button
2. Enter quantity to add (e.g., 50)
3. New stock = Current + Added

**Set Stock:**
1. Click "Set" button
2. Enter exact quantity (e.g., 100)
3. Stock is set to that number

**When orders are placed:**
- Stock automatically decreases by ordered quantity
- You'll see real-time stock updates
- Low stock alerts appear when < 20 units

#### Example:
```
Current Stock: 80 units
Customer orders: 10 units
New Stock: 70 units (automatic)

If stock drops below 20:
→ Red indicator appears
→ Alert shows on dashboard
```

### 6. **Settings**

#### Change Password
1. Enter current password
2. Enter new password (min 6 characters)
3. Confirm new password
4. Click "Update Password"

#### Store Information
Update your store details:
- Store Name
- Contact Email
- Contact Phone

#### Danger Zone
**Clear All Test Data:**
- Removes all test orders
- Clears customer data
- Resets the system
- ⚠️ **Use with extreme caution!**

---

## 📊 How It Works

### Data Flow

```
Customer Places Order (index.html)
         ↓
Order saved to localStorage
         ↓
Admin Dashboard reads data
         ↓
You see order with customer details
         ↓
Update order status
         ↓
Customer sees updated status
```

### Stock Management Flow

```
1. You add products with initial stock
         ↓
2. Customer adds to cart & places order
         ↓
3. Stock automatically decreases
         ↓
4. Low stock alert if < 20 units
         ↓
5. You replenish stock from Admin
         ↓
6. Stock updated, available for new orders
```

---

## 🎓 Step-by-Step Guide

### Managing Your First Order

1. **Customer places order on main website**
   - They fill shipping address
   - Choose payment method
   - Complete checkout

2. **You receive the order**
   - Login to Admin Dashboard
   - Go to "Orders" section
   - You'll see new order with "PENDING" status

3. **View customer details**
   - Click "View" button
   - See customer name, email, phone
   - Check shipping address
   - See what items they ordered

4. **Process the order**
   - Click "Update" button
   - Change status to "Processing" (preparing order)
   - Pack the items
   - Change to "Shipped" (dispatched)
   - Finally "Delivered" (customer received)

5. **Stock automatically updated**
   - Check "Stock Management"
   - See updated quantities
   - Replenish if needed

### Updating Stock When You Get New Inventory

**Scenario:** You received 100 units of Almonds

1. Go to **Stock Management**
2. Find "California Almonds"
3. Click **"Add"** button
4. Enter **100**
5. Stock is updated: Old + 100

**Scenario:** You want to set exact stock to 150

1. Find the product
2. Click **"Set"** button
3. Enter **150**
4. Stock is now exactly 150

---

## 💡 Best Practices

### Daily Operations

✅ **Login daily** to check new orders  
✅ **Update order status** as you process them  
✅ **Monitor stock levels** - replenish before running out  
✅ **Check customer details** before shipping  
✅ **Respond to low stock alerts** immediately  

### Weekly Tasks

📊 **Review Dashboard Stats:**
- Total revenue trends
- Popular products
- Customer growth

📦 **Inventory Planning:**
- Check which products sell fast
- Order more inventory for top sellers
- Consider removing slow-moving items

### Security

🔒 **Change default password** immediately after first login  
🔒 **Never share admin credentials**  
🔒 **Logout when done** working  
🔒 **Clear browser cache** on shared computers  

---

## 🔧 Troubleshooting

### "No orders appearing"

**Solution:**
- Customers must place orders from main website first
- Orders are stored in browser localStorage
- Same browser must be used for admin dashboard

### "Stock not updating after order"

**Solution:**
- This is automatic
- Check if order was completed successfully
- Verify in Stock Management section

### "Forgot admin password"

**Solution:**
1. Open browser console (F12)
2. Go to "Application" → "Local Storage"
3. Delete key: `adminCredentials`
4. Refresh page
5. Use default credentials again

### "Can't see customer email/phone"

**Solution:**
- Customer must be logged in when placing order
- Guest checkout doesn't save full details
- Encourage customers to create accounts

---

## 📱 Mobile Responsive

Admin dashboard works perfectly on:
- ✅ Desktop computers
- ✅ Tablets
- ✅ Mobile phones

---

## 🚀 Future Enhancements

Planned features for next version:
- Email notifications for new orders
- SMS alerts for low stock
- Export orders to Excel/CSV
- Print invoice/packing slip
- Analytics dashboard with charts
- Bulk stock update
- Product image upload
- Discount/coupon management

---

## 📞 Support

If you need help:
- Check this README first
- Review the main ECOMMERCE_README.md
- Test with sample orders

---

## 🎉 You're All Set!

Your admin dashboard is ready to manage your NutsSphere e-commerce business!

**Quick Start:**
1. Access admin.html
2. Login with default credentials
3. Change password in Settings
4. Wait for customer orders
5. Process orders as they come in
6. Keep stock updated
7. Grow your business! 🚀

---

**Happy Selling! 🌰🎯**

*Last Updated: November 10, 2025*
