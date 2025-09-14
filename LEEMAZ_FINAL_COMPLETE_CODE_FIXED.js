import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  SafeAreaView,
  StatusBar,
  Modal,
  Dimensions,
  FlatList,
  Platform,
  I18nManager,
} from 'react-native';

// Mock user data
const mockUsers = {
  'buyer@leemaz.com': {
    id: '1',
    email: 'buyer@leemaz.com',
    name: 'Sarah Ahmed',
    role: 'buyer',
    credits: 150,
  },
  'seller@leemaz.com': {
    id: '2',
    email: 'seller@leemaz.com',
    name: 'Fatima Al-Rashid',
    role: 'seller',
    credits: 75,
  },
  'admin@leemaz.com': {
    id: '3',
    email: 'admin@leemaz.com',
    name: 'Admin User',
    role: 'admin',
    credits: 1000,
  },
};

// Mock shops data
const mockShops = [
  {
    id: '1',
    name: 'Handmade Treasures',
    owner: 'Fatima Al-Rashid',
    description: 'Authentic Syrian handicrafts and jewelry',
    logo: null,
    approved: true,
  },
  {
    id: '2',
    name: 'Traditional Crafts',
    owner: 'Aisha Hassan',
    description: 'Beautiful traditional Syrian textiles',
    logo: null,
    approved: true,
  },
];

// Mock products data
const mockProducts = [
  {
    id: '1',
    name: 'Hand-woven Scarf',
    price: 45,
    category: 'clothing',
    description: 'Beautiful traditional Syrian scarf',
    shopId: '1',
    shopName: 'Handmade Treasures',
    image: null,
  },
  {
    id: '2',
    name: 'Silver Bracelet',
    price: 75,
    category: 'jewelry',
    description: 'Elegant handcrafted silver bracelet',
    shopId: '1',
    shopName: 'Handmade Treasures',
    image: null,
  },
];

const { width, height } = Dimensions.get('window');

// Get screen dimensions and set proper mobile sizing
const screenWidth = Math.min(width, 400); // Max width for mobile
const screenHeight = Math.min(height, 800); // Max height for mobile

// Translations
const translations = {
  en: {
    welcome: 'Welcome to Leemaz',
    subtitle: 'Syrian Women\'s Marketplace',
    home: 'Home',
    shop: 'Shop',
    profile: 'Profile',
    favorites: 'Favorites',
    orders: 'Orders',
    chat: 'Chat',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    products: 'Products',
    empowering: 'Empowering Syrian Women Entrepreneurs',
    discover: 'Discover authentic handmade products',
    switchLanguage: 'Switch to Arabic',
    myProfile: 'My Profile',
    changeLanguage: 'Change Language',
    settings: 'Settings',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    userType: 'I am a',
    buyer: 'Buyer',
    seller: 'Seller',
    language: 'Language',
    english: 'English',
    arabic: 'Arabic',
    createAccount: 'Create Account',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: 'Don\'t have an account?',
    signUp: 'Sign Up',
    credits: 'Credits',
    requestCredits: 'Request Credits',
    manageUsers: 'Manage Users',
    manageProducts: 'Manage Products',
    adminPanel: 'Admin Panel',
    dashboard: 'Dashboard',
    totalUsers: 'Total Users',
    totalShops: 'Total Shops',
    totalProducts: 'Total Products',
    searchPlaceholder: 'Search products...',
    categories: 'Categories',
    all: 'All',
    clothing: 'Clothing',
    jewelry: 'Jewelry',
    handicrafts: 'Handicrafts',
    viewDetails: 'View Details',
    buyNow: 'Buy Now',
    addToFavorites: 'Add to Favorites',
    price: 'Price',
    description: 'Description',
    shopName: 'Shop Name',
    noProductsFound: 'No products found',
    noFavorites: 'No favorites yet',
    noOrders: 'No orders yet',
    noMessages: 'No messages yet',
    sendMessage: 'Send message...',
    send: 'Send',
    back: 'Back',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    confirmLogout: 'Are you sure you want to logout?',
    yes: 'Yes',
    no: 'No',
    accountSettings: 'Account Settings',
    notificationSettings: 'Notification Settings',
    privacySettings: 'Privacy Settings',
    help: 'Help & Support',
    about: 'About Leemaz',
    version: 'Version 1.0.0',
    madeWith: 'Made with ❤️ for Syrian women entrepreneurs',
    copyrightText: '© 2024 Leemaz. All rights reserved.',
    roleBasedMessage: 'You are logged in as',
    sellerCannotBuy: 'As a seller, you can list your products here',
    createShop: 'Create Shop',
    myShop: 'My Shop',
    addProduct: 'Add Product',
    notificationsEnabled: 'Notifications Enabled',
    pushNotifications: 'Push Notifications',
    emailNotifications: 'Email Notifications',
    smsNotifications: 'SMS Notifications',
    publicProfile: 'Public Profile',
    showEmail: 'Show Email',
    showPhone: 'Show Phone Number',
    allowMessages: 'Allow Direct Messages',
    helpCenter: 'Help Center',
    contactSupport: 'Contact Support',
    reportIssue: 'Report an Issue',
    faqs: 'Frequently Asked Questions'
  },
  ar: {
    welcome: 'أهلاً بك في ليماز',
    subtitle: 'سوق المرأة السورية',
    home: 'الرئيسية',
    shop: 'المتجر',
    profile: 'الملف الشخصي',
    favorites: 'المفضلة',
    orders: 'الطلبات',
    chat: 'المحادثة',
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    logout: 'تسجيل الخروج',
    products: 'المنتجات',
    empowering: 'تمكين النساء السوريات',
    discover: 'اكتشفي منتجات يدوية أصيلة',
    switchLanguage: 'التبديل للإنجليزية',
    myProfile: 'ملفي الشخصي',
    changeLanguage: 'تغيير اللغة',
    settings: 'الإعدادات',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    fullName: 'الاسم الكامل',
    userType: 'أنا',
    buyer: 'مشترية',
    seller: 'بائعة',
    language: 'اللغة',
    english: 'الإنجليزية',
    arabic: 'العربية',
    createAccount: 'إنشاء حساب',
    alreadyHaveAccount: 'لديك حساب بالفعل؟',
    dontHaveAccount: 'ليس لديك حساب؟',
    signUp: 'سجلي الآن',
    credits: 'الرصيد',
    requestCredits: 'طلب رصيد',
    manageUsers: 'إدارة المستخدمين',
    manageProducts: 'إدارة المنتجات',
    adminPanel: 'لوحة الإدارة',
    dashboard: 'لوحة المعلومات',
    totalUsers: 'إجمالي المستخدمين',
    totalShops: 'إجمالي المتاجر',
    totalProducts: 'إجمالي المنتجات',
    searchPlaceholder: 'البحث عن منتجات...',
    categories: 'الفئات',
    all: 'الكل',
    clothing: 'الملابس',
    jewelry: 'المجوهرات',
    handicrafts: 'الحرف اليدوية',
    viewDetails: 'عرض التفاصيل',
    buyNow: 'اشتري الآن',
    addToFavorites: 'أضف للمفضلة',
    price: 'السعر',
    description: 'الوصف',
    shopName: 'اسم المتجر',
    noProductsFound: 'لم يتم العثور على منتجات',
    noFavorites: 'لا توجد مفضلة بعد',
    noOrders: 'لا توجد طلبات بعد',
    noMessages: 'لا توجد رسائل بعد',
    sendMessage: 'إرسال رسالة...',
    send: 'إرسال',
    back: 'رجوع',
    cancel: 'إلغاء',
    save: 'حفظ',
    edit: 'تعديل',
    delete: 'حذف',
    confirmLogout: 'هل أنت متأكدة من تسجيل الخروج؟',
    yes: 'نعم',
    no: 'لا',
    accountSettings: 'إعدادات الحساب',
    notificationSettings: 'إعدادات الإشعارات',
    privacySettings: 'إعدادات الخصوصية',
    help: 'المساعدة والدعم',
    about: 'حول ليماز',
    version: 'الإصدار 1.0.0',
    madeWith: 'صُنع بـ ❤️ للنساء السوريات',
    copyrightText: '© 2024 ليماز. جميع الحقوق محفوظة.',
    roleBasedMessage: 'أنت مسجلة الدخول كـ',
    sellerCannotBuy: 'كبائعة، يمكنك عرض منتجاتك هنا',
    createShop: 'إنشاء متجر',
    myShop: 'متجري',
    addProduct: 'إضافة منتج',
    notificationsEnabled: 'الإشعارات مفعلة',
    pushNotifications: 'الإشعارات الفورية',
    emailNotifications: 'إشعارات البريد الإلكتروني',
    smsNotifications: 'الرسائل النصية',
    publicProfile: 'الملف العام',
    showEmail: 'إظهار البريد الإلكتروني',
    showPhone: 'إظهار رقم الهاتف',
    allowMessages: 'السماح بالرسائل المباشرة',
    helpCenter: 'مركز المساعدة',
    contactSupport: 'اتصل بالدعم',
    reportIssue: 'إبلاغ عن مشكلة',
    faqs: 'الأسئلة الشائعة'
  }
};

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('Login');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'buyer',
    language: 'en'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [notificationSettings, setNotificationSettings] = useState({
    push: true,
    email: true,
    sms: false
  });
  const [privacySettings, setPrivacySettings] = useState({
    publicProfile: true,
    showEmail: false,
    showPhone: false,
    allowMessages: true
  });

  // Set RTL for Arabic
  useEffect(() => {
    if (currentLanguage === 'ar') {
      I18nManager.forceRTL(true);
    } else {
      I18nManager.forceRTL(false);
    }
  }, [currentLanguage]);

  const t = (key) => translations[currentLanguage][key] || key;

  const handleLogin = () => {
    const user = mockUsers[loginForm.email];
    if (user && loginForm.password === 'password123') {
      setCurrentUser(user);
      setCurrentScreen('Home');
      Alert.alert('Success', `Welcome ${user.name}!`);
    } else {
      Alert.alert('Error', 'Invalid credentials. Try: buyer@leemaz.com / seller@leemaz.com / admin@leemaz.com with password: password123');
    }
  };

  const handleRegister = () => {
    if (registerForm.password !== registerForm.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (!registerForm.fullName || !registerForm.email || !registerForm.password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    
    // Validate mobile number for Syrian format
    if (registerForm.userType === 'seller' && registerForm.email.includes('seller')) {
      // Mock Syrian mobile validation
      Alert.alert('Success', 'Account created successfully! Please verify your Syrian mobile number.');
    } else {
      Alert.alert('Success', 'Account created successfully! You can now login.');
    }
    setCurrentScreen('Login');
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setCurrentUser(null);
    setCurrentScreen('Login');
    setShowLogoutModal(false);
    setLoginForm({ email: '', password: '' });
  };

  const navigateToScreen = (screenName) => {
    setCurrentScreen(screenName);
  };

  const addToFavorites = (product) => {
    if (!favorites.find(fav => fav.id === product.id)) {
      setFavorites([...favorites, product]);
      Alert.alert('Success', 'Added to favorites!');
    }
  };

  const buyProduct = (product) => {
    if (currentUser.role === 'seller') {
      Alert.alert('Notice', t('sellerCannotBuy'));
      return;
    }
    const newOrder = {
      id: Date.now().toString(),
      product,
      date: new Date().toLocaleDateString(),
      status: 'pending'
    };
    setOrders([...orders, newOrder]);
    Alert.alert('Success', 'Order placed successfully!');
  };

  const sendMessage = () => {
    if (messageInput.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: messageInput,
        sender: currentUser.name,
        time: new Date().toLocaleTimeString()
      };
      setMessages([...messages, newMessage]);
      setMessageInput('');
    }
  };

  const requestCredits = () => {
    Alert.alert('Credit Request', 'Your credit request has been submitted to the admin. You will be notified once approved.', [
      { text: 'OK', style: 'default' }
    ]);
  };

  const manageUsers = () => {
    Alert.alert('User Management', 'Admin User Management Features:\n\n• View all registered users\n• Approve seller accounts\n• Manage user credits\n• Handle user reports\n• Send notifications to users', [
      { text: 'OK', style: 'default' }
    ]);
  };

  const manageProducts = () => {
    Alert.alert('Product Management', 'Admin Product Management Features:\n\n• Review and approve products\n• Moderate product content\n• Manage product categories\n• Handle product reports\n• Set featured products', [
      { text: 'OK', style: 'default' }
    ]);
  };

  const getFilteredProducts = () => {
    let filtered = mockProducts;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };

  const renderHeader = () => (
    <View style={[styles.header, currentLanguage === 'ar' && styles.rtlContainer]}>
      <View style={styles.headerContent}>
        <Text style={styles.logo}>🦋</Text>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Leemaz</Text>
          <Text style={styles.headerSubtitle}>{t('subtitle')}</Text>
        </View>
      </View>
    </View>
  );

  const renderBottomTabs = () => {
    if (!currentUser || currentUser.role === 'admin') return null;
    
    const tabs = [
      { key: 'Home', icon: '🏠', label: t('home') },
      { key: 'Shop', icon: '🛍️', label: t('shop') },
      { key: 'Favorites', icon: '❤️', label: t('favorites'), buyerOnly: true },
      { key: 'Orders', icon: '📦', label: t('orders') },
      { key: 'Chat', icon: '💬', label: t('chat') },
      { key: 'Profile', icon: '👤', label: t('profile') }
    ];

    return (
      <View style={[styles.bottomTabs, currentLanguage === 'ar' && styles.rtlContainer]}>
        {tabs.map(tab => {
          if (tab.buyerOnly && currentUser.role !== 'buyer') return null;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabItem, currentScreen === tab.key && styles.activeTab]}
              onPress={() => navigateToScreen(tab.key)}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text style={[styles.tabLabel, currentLanguage === 'ar' && styles.rtlText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderLoginScreen = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {renderHeader()}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.formContainer, currentLanguage === 'ar' && styles.rtlContainer]}>
          <Text style={[styles.welcomeText, currentLanguage === 'ar' && styles.rtlText]}>
            {t('welcome')}
          </Text>
          <Text style={[styles.subtitleText, currentLanguage === 'ar' && styles.rtlText]}>
            {t('empowering')}
          </Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, currentLanguage === 'ar' && styles.rtlInput]}
              placeholder={t('email')}
              value={loginForm.email}
              onChangeText={(text) => setLoginForm({...loginForm, email: text})}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={[styles.input, currentLanguage === 'ar' && styles.rtlInput]}
              placeholder={t('password')}
              value={loginForm.password}
              onChangeText={(text) => setLoginForm({...loginForm, password: text})}
              secureTextEntry
            />
          </View>
          
          <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
            <Text style={styles.primaryButtonText}>{t('login')}</Text>
          </TouchableOpacity>
          
          <View style={styles.linkContainer}>
            <Text style={[styles.linkText, currentLanguage === 'ar' && styles.rtlText]}>
              {t('dontHaveAccount')}
            </Text>
            <TouchableOpacity onPress={() => setCurrentScreen('Register')}>
              <Text style={styles.linkButton}> {t('signUp')}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.languageButton} 
            onPress={() => setShowLanguageModal(true)}
          >
            <Text style={styles.languageButtonText}>
              {currentLanguage === 'en' ? '🇸🇦 العربية' : '🇺🇸 English'}
            </Text>
          </TouchableOpacity>

          <View style={styles.demoInfo}>
            <Text style={[styles.demoText, currentLanguage === 'ar' && styles.rtlText]}>
              Demo Accounts:
            </Text>
            <Text style={styles.demoCredentials}>buyer@leemaz.com / password123</Text>
            <Text style={styles.demoCredentials}>seller@leemaz.com / password123</Text>
            <Text style={styles.demoCredentials}>admin@leemaz.com / password123</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  const renderRegisterScreen = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {renderHeader()}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.formContainer, currentLanguage === 'ar' && styles.rtlContainer]}>
          <Text style={[styles.welcomeText, currentLanguage === 'ar' && styles.rtlText]}>
            {t('createAccount')}
          </Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, currentLanguage === 'ar' && styles.rtlInput]}
              placeholder={t('fullName')}
              value={registerForm.fullName}
              onChangeText={(text) => setRegisterForm({...registerForm, fullName: text})}
            />
            <TextInput
              style={[styles.input, currentLanguage === 'ar' && styles.rtlInput]}
              placeholder={t('email')}
              value={registerForm.email}
              onChangeText={(text) => setRegisterForm({...registerForm, email: text})}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={[styles.input, currentLanguage === 'ar' && styles.rtlInput]}
              placeholder={t('password')}
              value={registerForm.password}
              onChangeText={(text) => setRegisterForm({...registerForm, password: text})}
              secureTextEntry
            />
            <TextInput
              style={[styles.input, currentLanguage === 'ar' && styles.rtlInput]}
              placeholder={t('confirmPassword')}
              value={registerForm.confirmPassword}
              onChangeText={(text) => setRegisterForm({...registerForm, confirmPassword: text})}
              secureTextEntry
            />
            
            <View style={[styles.pickerContainer, currentLanguage === 'ar' && styles.rtlContainer]}>
              <Text style={[styles.pickerLabel, currentLanguage === 'ar' && styles.rtlText]}>
                {t('userType')}:
              </Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity 
                  style={styles.radioOption}
                  onPress={() => setRegisterForm({...registerForm, userType: 'buyer'})}
                >
                  <Text style={registerForm.userType === 'buyer' ? styles.radioSelected : styles.radioUnselected}>
                    ● {t('buyer')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.radioOption}
                  onPress={() => setRegisterForm({...registerForm, userType: 'seller'})}
                >
                  <Text style={registerForm.userType === 'seller' ? styles.radioSelected : styles.radioUnselected}>
                    ● {t('seller')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          <TouchableOpacity style={styles.primaryButton} onPress={handleRegister}>
            <Text style={styles.primaryButtonText}>{t('createAccount')}</Text>
          </TouchableOpacity>
          
          <View style={styles.linkContainer}>
            <Text style={[styles.linkText, currentLanguage === 'ar' && styles.rtlText]}>
              {t('alreadyHaveAccount')}
            </Text>
            <TouchableOpacity onPress={() => setCurrentScreen('Login')}>
              <Text style={styles.linkButton}> {t('login')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  const renderHomeScreen = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {renderHeader()}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.homeContainer, currentLanguage === 'ar' && styles.rtlContainer]}>
          <View style={[styles.welcomeSection, currentLanguage === 'ar' && styles.rtlContainer]}>
            <Text style={[styles.welcomeMessage, currentLanguage === 'ar' && styles.rtlText]}>
              {t('welcome')}, {currentUser.name}!
            </Text>
            <Text style={[styles.roleMessage, currentLanguage === 'ar' && styles.rtlText]}>
              {t('roleBasedMessage')} {currentUser.role}
            </Text>
          </View>
          
          <View style={styles.searchContainer}>
            <TextInput
              style={[styles.searchInput, currentLanguage === 'ar' && styles.rtlInput]}
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <View style={[styles.categoriesContainer, currentLanguage === 'ar' && styles.rtlContainer]}>
            <Text style={[styles.sectionTitle, currentLanguage === 'ar' && styles.rtlText]}>
              {t('categories')}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['all', 'clothing', 'jewelry', 'handicrafts'].map(category => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.activeCategoryButton
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={[
                    styles.categoryButtonText,
                    selectedCategory === category && styles.activeCategoryButtonText,
                    currentLanguage === 'ar' && styles.rtlText
                  ]}>
                    {t(category)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          <View style={[styles.productsContainer, currentLanguage === 'ar' && styles.rtlContainer]}>
            <Text style={[styles.sectionTitle, currentLanguage === 'ar' && styles.rtlText]}>
              {t('products')}
            </Text>
            {getFilteredProducts().length === 0 ? (
              <Text style={[styles.emptyMessage, currentLanguage === 'ar' && styles.rtlText]}>
                {t('noProductsFound')}
              </Text>
            ) : (
              getFilteredProducts().map(product => (
                <View key={product.id} style={[styles.productCard, currentLanguage === 'ar' && styles.rtlContainer]}>
                  <View style={styles.productInfo}>
                    <Text style={[styles.productName, currentLanguage === 'ar' && styles.rtlText]}>
                      {product.name}
                    </Text>
                    <Text style={[styles.productPrice, currentLanguage === 'ar' && styles.rtlText]}>
                      ${product.price}
                    </Text>
                    <Text style={[styles.productDescription, currentLanguage === 'ar' && styles.rtlText]}>
                      {product.description}
                    </Text>
                    <Text style={[styles.productShop, currentLanguage === 'ar' && styles.rtlText]}>
                      {t('shopName')}: {product.shopName}
                    </Text>
                  </View>
                  <View style={styles.productActions}>
                    {currentUser.role === 'buyer' ? (
                      <>
                        <TouchableOpacity 
                          style={styles.secondaryButton}
                          onPress={() => addToFavorites(product)}
                        >
                          <Text style={styles.secondaryButtonText}>{t('addToFavorites')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.primaryButton}
                          onPress={() => buyProduct(product)}
                        >
                          <Text style={styles.primaryButtonText}>{t('buyNow')}</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <TouchableOpacity style={styles.secondaryButton}>
                        <Text style={styles.secondaryButtonText}>{t('viewDetails')}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))
            )}
          </View>
          
          {currentUser.role === 'seller' && (
            <View style={[styles.sellerInfo, currentLanguage === 'ar' && styles.rtlContainer]}>
              <Text style={[styles.sellerMessage, currentLanguage === 'ar' && styles.rtlText]}>
                {t('sellerCannotBuy')}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      {renderBottomTabs()}
    </SafeAreaView>
  );

  const renderShopScreen = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {renderHeader()}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.shopContainer, currentLanguage === 'ar' && styles.rtlContainer]}>
          <Text style={[styles.pageTitle, currentLanguage === 'ar' && styles.rtlText]}>
            {t('shop')}
          </Text>
          
          <View style={styles.shopsGrid}>
            {mockShops.map(shop => (
              <View key={shop.id} style={[styles.shopCard, currentLanguage === 'ar' && styles.rtlContainer]}>
                <Text style={[styles.shopName, currentLanguage === 'ar' && styles.rtlText]}>
                  {shop.name}
                </Text>
                <Text style={[styles.shopDescription, currentLanguage === 'ar' && styles.rtlText]}>
                  {shop.description}
                </Text>
                <Text style={[styles.shopOwner, currentLanguage === 'ar' && styles.rtlText]}>
                  {t('seller')}: {shop.owner}
                </Text>
                <TouchableOpacity style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>{t('viewDetails')}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      {renderBottomTabs()}
    </SafeAreaView>
  );

  const renderFavoritesScreen = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {renderHeader()}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.favoritesContainer, currentLanguage === 'ar' && styles.rtlContainer]}>
          <Text style={[styles.pageTitle, currentLanguage === 'ar' && styles.rtlText]}>
            {t('favorites')}
          </Text>
          
          {favorites.length === 0 ? (
            <Text style={[styles.emptyMessage, currentLanguage === 'ar' && styles.rtlText]}>
              {t('noFavorites')}
            </Text>
          ) : (
            favorites.map(product => (
              <View key={product.id} style={[styles.productCard, currentLanguage === 'ar' && styles.rtlContainer]}>
                <View style={styles.productInfo}>
                  <Text style={[styles.productName, currentLanguage === 'ar' && styles.rtlText]}>
                    {product.name}
                  </Text>
                  <Text style={[styles.productPrice, currentLanguage === 'ar' && styles.rtlText]}>
                    ${product.price}
                  </Text>
                  <Text style={[styles.productDescription, currentLanguage === 'ar' && styles.rtlText]}>
                    {product.description}
                  </Text>
                </View>
                <View style={styles.productActions}>
                  <TouchableOpacity 
                    style={styles.primaryButton}
                    onPress={() => buyProduct(product)}
                  >
                    <Text style={styles.primaryButtonText}>{t('buyNow')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
      {renderBottomTabs()}
    </SafeAreaView>
  );

  const renderOrdersScreen = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {renderHeader()}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.ordersContainer, currentLanguage === 'ar' && styles.rtlContainer]}>
          <Text style={[styles.pageTitle, currentLanguage === 'ar' && styles.rtlText]}>
            {t('orders')}
          </Text>
          
          {orders.length === 0 ? (
            <Text style={[styles.emptyMessage, currentLanguage === 'ar' && styles.rtlText]}>
              {t('noOrders')}
            </Text>
          ) : (
            orders.map(order => (
              <View key={order.id} style={[styles.orderCard, currentLanguage === 'ar' && styles.rtlContainer]}>
                <Text style={[styles.orderProduct, currentLanguage === 'ar' && styles.rtlText]}>
                  {order.product.name}
                </Text>
                <Text style={[styles.orderPrice, currentLanguage === 'ar' && styles.rtlText]}>
                  ${order.product.price}
                </Text>
                <Text style={[styles.orderDate, currentLanguage === 'ar' && styles.rtlText]}>
                  {order.date}
                </Text>
                <Text style={[styles.orderStatus, currentLanguage === 'ar' && styles.rtlText]}>
                  Status: {order.status}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
      {renderBottomTabs()}
    </SafeAreaView>
  );

  const renderChatScreen = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {renderHeader()}
      <View style={styles.chatContainer}>
        <Text style={[styles.pageTitle, currentLanguage === 'ar' && styles.rtlText]}>
          {t('chat')}
        </Text>
        
        <ScrollView style={styles.messagesContainer}>
          {messages.length === 0 ? (
            <Text style={[styles.emptyMessage, currentLanguage === 'ar' && styles.rtlText]}>
              {t('noMessages')}
            </Text>
          ) : (
            messages.map(message => (
              <View key={message.id} style={[styles.messageCard, currentLanguage === 'ar' && styles.rtlContainer]}>
                <Text style={[styles.messageSender, currentLanguage === 'ar' && styles.rtlText]}>
                  {message.sender}
                </Text>
                <Text style={[styles.messageText, currentLanguage === 'ar' && styles.rtlText]}>
                  {message.text}
                </Text>
                <Text style={[styles.messageTime, currentLanguage === 'ar' && styles.rtlText]}>
                  {message.time}
                </Text>
              </View>
            ))
          )}
        </ScrollView>
        
        <View style={[styles.messageInputContainer, currentLanguage === 'ar' && styles.rtlContainer]}>
          <TextInput
            style={[styles.messageInput, currentLanguage === 'ar' && styles.rtlInput]}
            placeholder={t('sendMessage')}
            value={messageInput}
            onChangeText={setMessageInput}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>{t('send')}</Text>
          </TouchableOpacity>
        </View>
      </View>
      {renderBottomTabs()}
    </SafeAreaView>
  );

  const renderProfileScreen = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {renderHeader()}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.profileContainer, currentLanguage === 'ar' && styles.rtlContainer]}>
          <Text style={[styles.pageTitle, currentLanguage === 'ar' && styles.rtlText]}>
            {t('myProfile')}
          </Text>
          
          <View style={[styles.profileCard, currentLanguage === 'ar' && styles.rtlContainer]}>
            <Text style={[styles.profileName, currentLanguage === 'ar' && styles.rtlText]}>
              {currentUser.name}
            </Text>
            <Text style={[styles.profileEmail, currentLanguage === 'ar' && styles.rtlText]}>
              {currentUser.email}
            </Text>
            <Text style={[styles.profileRole, currentLanguage === 'ar' && styles.rtlText]}>
              {t('userType')}: {t(currentUser.role)}
            </Text>
            <Text style={[styles.profileCredits, currentLanguage === 'ar' && styles.rtlText]}>
              {t('credits')}: {currentUser.credits}
            </Text>
          </View>
          
          {currentUser.role === 'seller' && (
            <TouchableOpacity style={styles.creditButton} onPress={requestCredits}>
              <Text style={styles.creditButtonText}>{t('requestCredits')}</Text>
            </TouchableOpacity>
          )}
          
          <View style={styles.profileActions}>
            <TouchableOpacity 
              style={styles.profileActionButton}
              onPress={() => navigateToScreen('Settings')}
            >
              <Text style={[styles.profileActionText, currentLanguage === 'ar' && styles.rtlText]}>
                ⚙️ {t('settings')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.profileActionButton}
              onPress={() => setShowLanguageModal(true)}
            >
              <Text style={[styles.profileActionText, currentLanguage === 'ar' && styles.rtlText]}>
                🌐 {t('changeLanguage')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>{t('logout')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {renderBottomTabs()}
    </SafeAreaView>
  );

  const renderSettingsScreen = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {renderHeader()}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.settingsContainer, currentLanguage === 'ar' && styles.rtlContainer]}>
          <View style={styles.settingsHeader}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigateToScreen('Profile')}
            >
              <Text style={styles.backButtonText}>← {t('back')}</Text>
            </TouchableOpacity>
            <Text style={[styles.pageTitle, currentLanguage === 'ar' && styles.rtlText]}>
              {t('settings')}
            </Text>
          </View>
          
          <View style={[styles.settingsSection, currentLanguage === 'ar' && styles.rtlContainer]}>
            <Text style={[styles.settingsSectionTitle, currentLanguage === 'ar' && styles.rtlText]}>
              {t('accountSettings')}
            </Text>
            <TouchableOpacity style={[styles.settingsItem, currentLanguage === 'ar' && styles.rtlContainer]}>
              <Text style={[styles.settingsItemText, currentLanguage === 'ar' && styles.rtlText]}>
                👤 Edit Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.settingsItem, currentLanguage === 'ar' && styles.rtlContainer]}>
              <Text style={[styles.settingsItemText, currentLanguage === 'ar' && styles.rtlText]}>
                🔒 Change Password
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.settingsSection, currentLanguage === 'ar' && styles.rtlContainer]}>
            <Text style={[styles.settingsSectionTitle, currentLanguage === 'ar' && styles.rtlText]}>
              {t('notificationSettings')}
            </Text>
            <View style={[styles.settingsItem, currentLanguage === 'ar' && styles.rtlContainer]}>
              <Text style={[styles.settingsItemText, currentLanguage === 'ar' && styles.rtlText]}>
                🔔 {t('pushNotifications')}
              </Text>
              <TouchableOpacity 
                style={[styles.toggleButton, notificationSettings.push && styles.toggleActive]}
                onPress={() => setNotificationSettings({...notificationSettings, push: !notificationSettings.push})}
              >
                <Text style={styles.toggleText}>{notificationSettings.push ? 'ON' : 'OFF'}</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.settingsItem, currentLanguage === 'ar' && styles.rtlContainer]}>
              <Text style={[styles.settingsItemText, currentLanguage === 'ar' && styles.rtlText]}>
                📧 {t('emailNotifications')}
              </Text>
              <TouchableOpacity 
                style={[styles.toggleButton, notificationSettings.email && styles.toggleActive]}
                onPress={() => setNotificationSettings({...notificationSettings, email: !notificationSettings.email})}
              >
                <Text style={styles.toggleText}>{notificationSettings.email ? 'ON' : 'OFF'}</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.settingsItem, currentLanguage === 'ar' && styles.rtlContainer]}>
              <Text style={[styles.settingsItemText, currentLanguage === 'ar' && styles.rtlText]}>
                📱 {t('smsNotifications')}
              </Text>
              <TouchableOpacity 
                style={[styles.toggleButton, notificationSettings.sms && styles.toggleActive]}
                onPress={() => setNotificationSettings({...notificationSettings, sms: !notificationSettings.sms})}
              >
                <Text style={styles.toggleText}>{notificationSettings.sms ? 'ON' : 'OFF'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.settingsSection, currentLanguage === 'ar' && styles.rtlContainer]}>
            <Text style={[styles.settingsSectionTitle, currentLanguage === 'ar' && styles.rtlText]}>
              {t('privacySettings')}
            </Text>
            <View style={[styles.settingsItem, currentLanguage === 'ar' && styles.rtlContainer]}>
              <Text style={[styles.settingsItemText, currentLanguage === 'ar' && styles.rtlText]}>
                👥 {t('publicProfile')}
              </Text>
              <TouchableOpacity 
                style={[styles.toggleButton, privacySettings.publicProfile && styles.toggleActive]}
                onPress={() => setPrivacySettings({...privacySettings, publicProfile: !privacySettings.publicProfile})}
              >
                <Text style={styles.toggleText}>{privacySettings.publicProfile ? 'ON' : 'OFF'}</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.settingsItem, currentLanguage === 'ar' && styles.rtlContainer]}>
              <Text style={[styles.settingsItemText, currentLanguage === 'ar' && styles.rtlText]}>
                📧 {t('showEmail')}
              </Text>
              <TouchableOpacity 
                style={[styles.toggleButton, privacySettings.showEmail && styles.toggleActive]}
                onPress={() => setPrivacySettings({...privacySettings, showEmail: !privacySettings.showEmail})}
              >
                <Text style={styles.toggleText}>{privacySettings.showEmail ? 'ON' : 'OFF'}</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.settingsItem, currentLanguage === 'ar' && styles.rtlContainer]}>
              <Text style={[styles.settingsItemText, currentLanguage === 'ar' && styles.rtlText]}>
                💬 {t('allowMessages')}
              </Text>
              <TouchableOpacity 
                style={[styles.toggleButton, privacySettings.allowMessages && styles.toggleActive]}
                onPress={() => setPrivacySettings({...privacySettings, allowMessages: !privacySettings.allowMessages})}
              >
                <Text style={styles.toggleText}>{privacySettings.allowMessages ? 'ON' : 'OFF'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.settingsSection, currentLanguage === 'ar' && styles.rtlContainer]}>
            <Text style={[styles.settingsSectionTitle, currentLanguage === 'ar' && styles.rtlText]}>
              {t('help')}
            </Text>
            <TouchableOpacity style={[styles.settingsItem, currentLanguage === 'ar' && styles.rtlContainer]}>
              <Text style={[styles.settingsItemText, currentLanguage === 'ar' && styles.rtlText]}>
                ❓ {t('faqs')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.settingsItem, currentLanguage === 'ar' && styles.rtlContainer]}>
              <Text style={[styles.settingsItemText, currentLanguage === 'ar' && styles.rtlText]}>
                📞 {t('contactSupport')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.settingsSection, currentLanguage === 'ar' && styles.rtlContainer]}>
            <Text style={[styles.settingsSectionTitle, currentLanguage === 'ar' && styles.rtlText]}>
              {t('about')}
            </Text>
            <View style={[styles.aboutSection, currentLanguage === 'ar' && styles.rtlContainer]}>
              <Text style={[styles.aboutText, currentLanguage === 'ar' && styles.rtlText]}>
                {t('version')}
              </Text>
              <Text style={[styles.aboutText, currentLanguage === 'ar' && styles.rtlText]}>
                {t('madeWith')}
              </Text>
              <Text style={[styles.copyrightText, currentLanguage === 'ar' && styles.rtlText]}>
                {t('copyrightText')}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      {renderBottomTabs()}
    </SafeAreaView>
  );

  const renderAdminPanel = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {renderHeader()}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.adminContainer, currentLanguage === 'ar' && styles.rtlContainer]}>
          <Text style={[styles.pageTitle, currentLanguage === 'ar' && styles.rtlText]}>
            {t('adminPanel')}
          </Text>
          
          <View style={[styles.adminStats, currentLanguage === 'ar' && styles.rtlContainer]}>
            <View style={[styles.statCard, currentLanguage === 'ar' && styles.rtlContainer]}>
              <Text style={[styles.statNumber, currentLanguage === 'ar' && styles.rtlText]}>150</Text>
              <Text style={[styles.statLabel, currentLanguage === 'ar' && styles.rtlText]}>
                {t('totalUsers')}
              </Text>
            </View>
            <View style={[styles.statCard, currentLanguage === 'ar' && styles.rtlContainer]}>
              <Text style={[styles.statNumber, currentLanguage === 'ar' && styles.rtlText]}>25</Text>
              <Text style={[styles.statLabel, currentLanguage === 'ar' && styles.rtlText]}>
                {t('totalShops')}
              </Text>
            </View>
            <View style={[styles.statCard, currentLanguage === 'ar' && styles.rtlContainer]}>
              <Text style={[styles.statNumber, currentLanguage === 'ar' && styles.rtlText]}>300</Text>
              <Text style={[styles.statLabel, currentLanguage === 'ar' && styles.rtlText]}>
                {t('totalProducts')}
              </Text>
            </View>
          </View>
          
          <View style={styles.adminActions}>
            <TouchableOpacity style={styles.adminButton} onPress={manageUsers}>
              <Text style={styles.adminButtonText}>👥 {t('manageUsers')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.adminButton} onPress={manageProducts}>
              <Text style={styles.adminButtonText}>📦 {t('manageProducts')}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.adminButton}
              onPress={() => setShowLanguageModal(true)}
            >
              <Text style={styles.adminButtonText}>🌐 {t('changeLanguage')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>{t('logout')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  const renderLanguageModal = () => (
    <Modal
      visible={showLanguageModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowLanguageModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, currentLanguage === 'ar' && styles.rtlContainer]}>
          <Text style={[styles.modalTitle, currentLanguage === 'ar' && styles.rtlText]}>
            {t('changeLanguage')}
          </Text>
          
          <TouchableOpacity 
            style={[styles.languageOption, currentLanguage === 'en' && styles.activeLanguageOption]}
            onPress={() => {
              setCurrentLanguage('en');
              setShowLanguageModal(false);
            }}
          >
            <Text style={[styles.languageOptionText, currentLanguage === 'en' && styles.activeLanguageOptionText]}>
              🇺🇸 English
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.languageOption, currentLanguage === 'ar' && styles.activeLanguageOption]}
            onPress={() => {
              setCurrentLanguage('ar');
              setShowLanguageModal(false);
            }}
          >
            <Text style={[styles.languageOptionText, currentLanguage === 'ar' && styles.activeLanguageOptionText]}>
              🇸🇦 العربية
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.modalCloseButton}
            onPress={() => setShowLanguageModal(false)}
          >
            <Text style={styles.modalCloseButtonText}>{t('cancel')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderLogoutModal = () => (
    <Modal
      visible={showLogoutModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowLogoutModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, currentLanguage === 'ar' && styles.rtlContainer]}>
          <Text style={[styles.modalTitle, currentLanguage === 'ar' && styles.rtlText]}>
            {t('confirmLogout')}
          </Text>
          
          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => setShowLogoutModal(false)}
            >
              <Text style={styles.modalButtonText}>{t('no')}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.modalButtonPrimary]}
              onPress={confirmLogout}
            >
              <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>
                {t('yes')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Main render logic
  if (!currentUser) {
    return (
      <View style={styles.appContainer}>
        {currentScreen === 'Login' && renderLoginScreen()}
        {currentScreen === 'Register' && renderRegisterScreen()}
        {renderLanguageModal()}
      </View>
    );
  }

  if (currentUser.role === 'admin') {
    return (
      <View style={styles.appContainer}>
        {renderAdminPanel()}
        {renderLanguageModal()}
        {renderLogoutModal()}
      </View>
    );
  }

  return (
    <View style={styles.appContainer}>
      {currentScreen === 'Home' && renderHomeScreen()}
      {currentScreen === 'Shop' && renderShopScreen()}
      {currentScreen === 'Favorites' && renderFavoritesScreen()}
      {currentScreen === 'Orders' && renderOrdersScreen()}
      {currentScreen === 'Chat' && renderChatScreen()}
      {currentScreen === 'Profile' && renderProfileScreen()}
      {currentScreen === 'Settings' && renderSettingsScreen()}
      {renderLanguageModal()}
      {renderLogoutModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    width: '100%',
    maxWidth: screenWidth,
    alignSelf: 'center',
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  
  // Header Styles
  header: {
    backgroundColor: '#E91E63',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: Platform.OS === 'ios' ? 50 : 15,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    fontSize: 32,
    marginRight: 10,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  
  // Form Styles
  formContainer: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  
  // Button Styles
  primaryButton: {
    backgroundColor: '#E91E63',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  
  // Link Styles
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkText: {
    color: '#666',
    fontSize: 14,
  },
  linkButton: {
    color: '#E91E63',
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  // Language Styles
  languageButton: {
    marginTop: 20,
    padding: 10,
    alignItems: 'center',
  },
  languageButtonText: {
    color: '#E91E63',
    fontSize: 16,
  },
  
  // Demo Info Styles
  demoInfo: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  demoText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  demoCredentials: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  
  // Picker Styles
  pickerContainer: {
    marginBottom: 15,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    color: '#333',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  radioOption: {
    padding: 10,
  },
  radioSelected: {
    color: '#E91E63',
    fontWeight: 'bold',
    fontSize: 16,
  },
  radioUnselected: {
    color: '#666',
    fontSize: 16,
  },
  
  // Home Screen Styles
  homeContainer: {
    padding: 20,
  },
  welcomeSection: {
    marginBottom: 20,
  },
  welcomeMessage: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  roleMessage: {
    fontSize: 16,
    color: '#666',
  },
  
  // Search Styles
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  
  // Categories Styles
  categoriesContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  categoryButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  activeCategoryButton: {
    backgroundColor: '#E91E63',
  },
  categoryButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  activeCategoryButtonText: {
    color: '#fff',
  },
  
  // Product Styles
  productsContainer: {
    marginBottom: 20,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productInfo: {
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  productShop: {
    fontSize: 12,
    color: '#999',
  },
  productActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  // Message Styles
  emptyMessage: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 50,
  },
  sellerInfo: {
    backgroundColor: '#fff3e0',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  sellerMessage: {
    color: '#e65100',
    fontSize: 14,
    textAlign: 'center',
  },
  
  // Bottom Tabs Styles
  bottomTabs: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
  },
  activeTab: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 10,
    color: '#333',
  },
  
  // Page Styles
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  
  // Shop Styles
  shopContainer: {
    padding: 20,
  },
  shopsGrid: {
    flexDirection: 'column',
  },
  shopCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shopName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  shopDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  shopOwner: {
    fontSize: 12,
    color: '#999',
    marginBottom: 10,
  },
  
  // Favorites Styles
  favoritesContainer: {
    padding: 20,
  },
  
  // Orders Styles
  ordersContainer: {
    padding: 20,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderProduct: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  orderPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 5,
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  orderStatus: {
    fontSize: 14,
    color: '#666',
  },
  
  // Chat Styles
  chatContainer: {
    flex: 1,
    padding: 20,
  },
  messagesContainer: {
    flex: 1,
    marginBottom: 20,
  },
  messageCard: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  messageSender: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 5,
  },
  messageText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  messageTime: {
    fontSize: 10,
    color: '#999',
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sendButton: {
    backgroundColor: '#E91E63',
    padding: 15,
    borderRadius: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  
  // Profile Styles
  profileContainer: {
    padding: 20,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  profileRole: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
  },
  profileCredits: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E91E63',
  },
  creditButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  creditButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileActions: {
    marginTop: 10,
  },
  profileActionButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  profileActionText: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Settings Styles
  settingsContainer: {
    padding: 20,
  },
  settingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
    marginRight: 10,
  },
  backButtonText: {
    color: '#E91E63',
    fontSize: 16,
  },
  settingsSection: {
    marginBottom: 25,
  },
  settingsSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  settingsItemText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  toggleButton: {
    backgroundColor: '#ddd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    minWidth: 50,
    alignItems: 'center',
  },
  toggleActive: {
    backgroundColor: '#E91E63',
  },
  toggleText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  aboutSection: {
    alignItems: 'center',
    padding: 20,
  },
  aboutText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    textAlign: 'center',
  },
  copyrightText: {
    fontSize: 12,
    color: '#999',
    marginTop: 10,
    textAlign: 'center',
  },
  
  // Admin Styles
  adminContainer: {
    padding: 20,
  },
  adminStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  adminActions: {
    marginTop: 20,
  },
  adminButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  adminButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  languageOption: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  activeLanguageOption: {
    backgroundColor: '#E91E63',
  },
  languageOptionText: {
    fontSize: 16,
    color: '#333',
  },
  activeLanguageOptionText: {
    color: '#fff',
  },
  modalCloseButton: {
    backgroundColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  modalCloseButtonText: {
    color: '#333',
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  modalButtonPrimary: {
    backgroundColor: '#E91E63',
  },
  modalButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalButtonTextPrimary: {
    color: '#fff',
  },
  
  // RTL Styles
  rtlContainer: {
    flexDirection: 'row-reverse',
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  rtlInput: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});