# 🚀 LEEMAZ ADMIN PANEL GUIDE

## 📋 **SYSTEM OVERVIEW**

The Leemaz e-commerce platform now features:
- ✅ **NO EMAIL VERIFICATION** - Users get instant access
- ✅ **ADMIN SHOP APPROVAL** - You control which shops go online
- ✅ **COMPREHENSIVE ADMIN PANEL** - Full management control
- ✅ **100 FREE CREDITS** - All new users start with credits

---

## 🔐 **HOW TO ACCESS ADMIN PANEL**

### **Admin Login Credentials:**
- **Email:** `admin@leemaz.com`
- **Password:** `admin123`
- **URL:** https://syria-commerce.preview.emergentagent.com

### **Login Steps:**
1. Open the Leemaz mobile app
2. Enter admin email and password
3. Click "Sign In"
4. You'll automatically be taken to the **Admin Panel** (not the regular user interface)

---

## 🎛️ **ADMIN PANEL FEATURES**

### **📊 Dashboard**
- **User Statistics:** Total users, buyers vs sellers
- **Shop Statistics:** Total, pending, approved shops
- **Product Statistics:** Total and active products
- **Review Statistics:** Total reviews count
- **Quick Actions:** Jump to management sections

### **🏪 Shop Management**
**This is the MAIN feature you requested!**

#### **Shop Approval Process:**
1. **Sellers create shops** → Shop status = "Pending"
2. **You review in Admin Panel** → See all shop details
3. **You approve/reject** → Shop goes online or gets rejected

#### **Shop Management Options:**
- **View Pending Shops:** See all shops waiting for approval
- **View Approved Shops:** See all live shops
- **View All Shops:** Complete overview
- **Approve Shop:** ✅ Make shop visible to customers
- **Reject Shop:** ❌ Reject shop with reason

#### **Shop Information Displayed:**
- Shop name and description  
- Owner name and email
- Category and creation date
- Current status (Pending/Approved/Rejected)

### **👥 User Management**
- View all registered users
- See user details (buyers vs sellers)
- Activate/deactivate user accounts
- Add/remove credits from users

### **📦 Product Management**
- View all products across all shops
- See product details with seller information
- Monitor product activity

---

## 🔄 **NEW USER FLOW (No Email Verification)**

### **For Regular Users:**
1. **Register** → Fill form → Instant account creation
2. **Login** → Access app immediately 
3. **Get 100 Credits** → Ready to start using the platform

### **For Sellers:**
1. **Register as Seller** → Instant account
2. **Create Shop** → Shop status = "Pending" 
3. **Wait for Admin Approval** → You review and approve
4. **Shop Goes Live** → Customers can see it
5. **Add Products** → Shop is now fully functional

---

## ⚙️ **ADMIN OPERATIONS**

### **Approving a Shop:**
1. Go to Admin Panel → **Shops Tab**
2. Select **"Pending"** filter
3. Review shop details
4. Click **"Approve"** button
5. Shop immediately goes live for customers

### **Rejecting a Shop:**
1. Same steps as above
2. Click **"Reject"** button
3. Shop is hidden and marked as rejected
4. Seller won't be able to add products

### **Managing Users:**
1. Go to **Users Tab**
2. View all registered users
3. Toggle user active/inactive status
4. Add or remove credits as needed

---

## 🎯 **KEY DIFFERENCES FROM BEFORE**

| **Before** | **Now** |
|------------|---------|
| Email verification required | ✅ Instant registration |
| Users start with 0 credits | ✅ Users start with 100 credits |
| All shops auto-approved | ✅ **Admin must approve shops** |
| No admin control | ✅ **Full admin panel control** |
| Email verification screen | ✅ Direct login after registration |

---

## 🔧 **TECHNICAL DETAILS**

### **Admin Access Control:**
- Admin emails: `admin@leemaz.com`, `admin@admin.leemaz.com`
- Any email ending with `@admin.leemaz.com`
- Automatic admin panel redirect for admin users

### **Shop Approval System:**
- New shops: `is_approved: false`
- Approved shops: `is_approved: true, approved_at: timestamp`
- Only approved shops visible to customers
- Rejected shops: `is_active: false`

### **API Endpoints:**
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/shops?status=pending` - Pending shops
- `POST /api/admin/shops/{id}/approve` - Approve shop
- `POST /api/admin/shops/{id}/reject` - Reject shop
- `GET /api/admin/users` - All users
- `POST /api/admin/users/{id}/credits` - Manage credits

---

## 🚨 **IMPORTANT NOTES**

1. **Change Admin Password:** 
   - Current password is `admin123`
   - Change it after first login for security

2. **Shop Approval is Required:**
   - Sellers can create shops but they won't be visible until you approve
   - This gives you full control over marketplace quality

3. **No Email Verification:**
   - Users can register and login immediately
   - Much better user experience
   - All users get 100 credits to start

4. **Mobile First:**
   - Admin panel works perfectly on mobile devices
   - Touch-optimized interface
   - Can manage shops from anywhere

---

## 📱 **TESTING THE SYSTEM**

### **Test Shop Approval Flow:**
1. **Register as normal seller** (not admin email)
2. **Create a shop** → Status will be "Pending"
3. **Login as admin** → Go to admin panel
4. **Approve the shop** → Shop goes live
5. **Login as regular user** → Shop now visible to customers

### **Admin Panel Access:**
- **URL:** https://syria-commerce.preview.emergentagent.com
- **Email:** admin@leemaz.com  
- **Password:** admin123

---

## 🎉 **CONGRATULATIONS!**

You now have **FULL CONTROL** over your Leemaz marketplace:
- ✅ Control which shops go online
- ✅ Manage all users and credits  
- ✅ Monitor all platform activity
- ✅ No email verification hassles
- ✅ Professional admin interface

Your Syrian Women's Marketplace is now ready for **professional operation**! 🦋✨