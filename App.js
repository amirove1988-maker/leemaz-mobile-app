import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  StatusBar,
  Modal,
  Dimensions,
  Platform,
  I18nManager,
  Image,
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
  {
    id: '3',
    name: 'Rose Perfume Oil',
    price: 25,
    category: 'perfumes',
    description: 'Natural Syrian rose perfume oil',
    shopId: '2',
    shopName: 'Traditional Crafts',
    image: null,
  },
  {
    id: '4',
    name: 'Herbal Tea Mix',
    price: 15,
    category: 'herbal',
    description: 'Traditional Syrian herbal tea blend',
    shopId: '2',
    shopName: 'Traditional Crafts',
    image: null,
  },
];

const { width, height } = Dimensions.get('window');

// Get screen dimensions and set proper mobile sizing
const screenWidth = Math.min(width, 400);
const screenHeight = Math.min(height, 800);

// Leemaz Logo Base64 (Beautiful butterfly logo)
const LEEMAZ_LOGO_BASE64 = "data:image/png;base64,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";

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
    perfumes: 'Perfumes & Oils',
    herbal: 'Herbal Products',
    soaps: 'Natural Soaps',
    candles: 'Handmade Candles',
    pottery: 'Pottery & Ceramics',
    textiles: 'Traditional Textiles',
    woodwork: 'Wooden Crafts',
    metalwork: 'Metal Crafts',
    leather: 'Leather Goods',
    baskets: 'Woven Baskets',
    spices: 'Spices & Seasonings',
    sweets: 'Traditional Sweets',
    embroidery: 'Embroidered Items',
    rugs: 'Handmade Rugs',
    bags: 'Handcrafted Bags',
    accessories: 'Fashion Accessories',
    homeDecor: 'Home Decoration',
    kitchenware: 'Kitchen Items',
    cosmetics: 'Natural Cosmetics',
    incense: 'Incense & Aromatics',
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
    perfumes: 'العطور والزيوت',
    herbal: 'المنتجات العشبية',
    soaps: 'الصابون الطبيعي',
    candles: 'الشموع اليدوية',
    pottery: 'الفخار والسيراميك',
    textiles: 'المنسوجات التقليدية',
    woodwork: 'الأعمال الخشبية',
    metalwork: 'الأعمال المعدنية',
    leather: 'المنتجات الجلدية',
    baskets: 'السلال المنسوجة',
    spices: 'البهارات والتوابل',
    sweets: 'الحلويات التقليدية',
    embroidery: 'المطرزات',
    rugs: 'السجاد اليدوي',
    bags: 'الحقائب اليدوية',
    accessories: 'إكسسوارات الموضة',
    homeDecor: 'ديكور المنزل',
    kitchenware: 'أدوات المطبخ',
    cosmetics: 'مستحضرات التجميل الطبيعية',
    incense: 'البخور والعطريات',
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
        <View style={styles.logoContainer}>
          <Image 
            source={{ uri: LEEMAZ_LOGO_BASE64 }}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
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
          </View>
          
          <TouchableOpacity style={styles.primaryButton} onPress={handleRegister}>
            <Text style={styles.primaryButtonText}>{t('register')}</Text>
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
        <View style={styles.homeContent}>
          <Text style={[styles.welcomeText, currentLanguage === 'ar' && styles.rtlText]}>
            {t('welcome')} {currentUser?.name}!
          </Text>
          <Text style={[styles.subtitleText, currentLanguage === 'ar' && styles.rtlText]}>
            {t('discover')}
          </Text>
          
          <View style={styles.searchContainer}>
            <TextInput
              style={[styles.searchInput, currentLanguage === 'ar' && styles.rtlInput]}
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <View style={styles.categoriesContainer}>
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
          
          <View style={styles.productsContainer}>
            <Text style={[styles.sectionTitle, currentLanguage === 'ar' && styles.rtlText]}>
              {t('products')}
            </Text>
            {getFilteredProducts().length === 0 ? (
              <Text style={[styles.emptyText, currentLanguage === 'ar' && styles.rtlText]}>
                {t('noProductsFound')}
              </Text>
            ) : (
              getFilteredProducts().map(product => (
                <View key={product.id} style={styles.productCard}>
                  <View style={styles.productInfo}>
                    <Text style={[styles.productName, currentLanguage === 'ar' && styles.rtlText]}>
                      {product.name}
                    </Text>
                    <Text style={[styles.productDescription, currentLanguage === 'ar' && styles.rtlText]}>
                      {product.description}
                    </Text>
                    <Text style={styles.productPrice}>${product.price}</Text>
                    <Text style={[styles.productShop, currentLanguage === 'ar' && styles.rtlText]}>
                      {product.shopName}
                    </Text>
                  </View>
                  <View style={styles.productActions}>
                    {currentUser.role === 'buyer' && (
                      <>
                        <TouchableOpacity
                          style={styles.secondaryButton}
                          onPress={() => addToFavorites(product)}
                        >
                          <Text style={styles.secondaryButtonText}>❤️</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.primaryButton}
                          onPress={() => buyProduct(product)}
                        >
                          <Text style={styles.primaryButtonText}>{t('buyNow')}</Text>
                        </TouchableOpacity>
                      </>
                    )}
                    {currentUser.role === 'seller' && (
                      <TouchableOpacity style={styles.secondaryButton}>
                        <Text style={styles.secondaryButtonText}>{t('viewDetails')}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
      {renderBottomTabs()}
    </SafeAreaView>
  );

  const renderProfileScreen = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {renderHeader()}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileContent}>
          <View style={styles.profileHeader}>
            <Text style={styles.profileIcon}>👤</Text>
            <Text style={[styles.profileName, currentLanguage === 'ar' && styles.rtlText]}>
              {currentUser?.name}
            </Text>
            <Text style={[styles.profileEmail, currentLanguage === 'ar' && styles.rtlText]}>
              {currentUser?.email}
            </Text>
            <Text style={[styles.profileRole, currentLanguage === 'ar' && styles.rtlText]}>
              {t('roleBasedMessage')}: {t(currentUser?.role)}
            </Text>
            <Text style={[styles.profileCredits, currentLanguage === 'ar' && styles.rtlText]}>
              {t('credits')}: {currentUser?.credits}
            </Text>
          </View>
          
          <View style={styles.profileActions}>
            {currentUser?.role === 'seller' && (
              <TouchableOpacity style={styles.actionButton} onPress={requestCredits}>
                <Text style={styles.actionButtonText}>{t('requestCredits')}</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setShowLanguageModal(true)}
            >
              <Text style={styles.actionButtonText}>{t('changeLanguage')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
              <Text style={styles.actionButtonText}>{t('logout')}</Text>
            </TouchableOpacity>
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
        <View style={styles.favoritesContent}>
          <Text style={[styles.screenTitle, currentLanguage === 'ar' && styles.rtlText]}>
            {t('favorites')}
          </Text>
          {favorites.length === 0 ? (
            <Text style={[styles.emptyText, currentLanguage === 'ar' && styles.rtlText]}>
              {t('noFavorites')}
            </Text>
          ) : (
            favorites.map(product => (
              <View key={product.id} style={styles.favoriteItem}>
                <Text style={[styles.favoriteItemName, currentLanguage === 'ar' && styles.rtlText]}>
                  {product.name}
                </Text>
                <Text style={styles.favoriteItemPrice}>${product.price}</Text>
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
        <View style={styles.ordersContent}>
          <Text style={[styles.screenTitle, currentLanguage === 'ar' && styles.rtlText]}>
            {t('orders')}
          </Text>
          {orders.length === 0 ? (
            <Text style={[styles.emptyText, currentLanguage === 'ar' && styles.rtlText]}>
              {t('noOrders')}
            </Text>
          ) : (
            orders.map(order => (
              <View key={order.id} style={styles.orderItem}>
                <Text style={[styles.orderItemName, currentLanguage === 'ar' && styles.rtlText]}>
                  {order.product.name}
                </Text>
                <Text style={[styles.orderItemDate, currentLanguage === 'ar' && styles.rtlText]}>
                  {order.date}
                </Text>
                <Text style={styles.orderItemStatus}>{order.status}</Text>
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.chatContent}>
          <Text style={[styles.screenTitle, currentLanguage === 'ar' && styles.rtlText]}>
            {t('chat')}
          </Text>
          <View style={styles.messagesContainer}>
            {messages.length === 0 ? (
              <Text style={[styles.emptyText, currentLanguage === 'ar' && styles.rtlText]}>
                {t('noMessages')}
              </Text>
            ) : (
              messages.map(message => (
                <View key={message.id} style={styles.messageItem}>
                  <Text style={[styles.messageSender, currentLanguage === 'ar' && styles.rtlText]}>
                    {message.sender}
                  </Text>
                  <Text style={[styles.messageText, currentLanguage === 'ar' && styles.rtlText]}>
                    {message.text}
                  </Text>
                  <Text style={styles.messageTime}>{message.time}</Text>
                </View>
              ))
            )}
          </View>
          <View style={styles.messageInputContainer}>
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
      </ScrollView>
      {renderBottomTabs()}
    </SafeAreaView>
  );

  const renderShopScreen = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {renderHeader()}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.shopContent}>
          <Text style={[styles.screenTitle, currentLanguage === 'ar' && styles.rtlText]}>
            {t('shop')}
          </Text>
          {mockShops.map(shop => (
            <View key={shop.id} style={styles.shopItem}>
              <Text style={[styles.shopName, currentLanguage === 'ar' && styles.rtlText]}>
                {shop.name}
              </Text>
              <Text style={[styles.shopOwner, currentLanguage === 'ar' && styles.rtlText]}>
                Owner: {shop.owner}
              </Text>
              <Text style={[styles.shopDescription, currentLanguage === 'ar' && styles.rtlText]}>
                {shop.description}
              </Text>
            </View>
          ))}
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
        <View style={styles.adminContent}>
          <Text style={[styles.screenTitle, currentLanguage === 'ar' && styles.rtlText]}>
            🦋 {t('adminPanel')}
          </Text>
          
          <View style={styles.adminStats}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={[styles.statLabel, currentLanguage === 'ar' && styles.rtlText]}>
                {t('totalUsers')}
              </Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>2</Text>
              <Text style={[styles.statLabel, currentLanguage === 'ar' && styles.rtlText]}>
                {t('totalShops')}
              </Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>2</Text>
              <Text style={[styles.statLabel, currentLanguage === 'ar' && styles.rtlText]}>
                {t('totalProducts')}
              </Text>
            </View>
          </View>
          
          <View style={styles.adminActions}>
            <TouchableOpacity style={styles.adminButton} onPress={manageUsers}>
              <Text style={styles.adminButtonText}>{t('manageUsers')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.adminButton} onPress={manageProducts}>
              <Text style={styles.adminButtonText}>{t('manageProducts')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.adminButton}
              onPress={() => setShowLanguageModal(true)}
            >
              <Text style={styles.adminButtonText}>{t('changeLanguage')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.adminButton} onPress={handleLogout}>
              <Text style={styles.adminButtonText}>{t('logout')}</Text>
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
        <View style={styles.modalContainer}>
          <Text style={[styles.modalTitle, currentLanguage === 'ar' && styles.rtlText]}>
            {t('changeLanguage')}
          </Text>
          
          <TouchableOpacity
            style={[styles.languageOption, currentLanguage === 'en' && styles.selectedLanguage]}
            onPress={() => {
              setCurrentLanguage('en');
              setShowLanguageModal(false);
            }}
          >
            <Text style={styles.languageOptionText}>🇺🇸 English</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.languageOption, currentLanguage === 'ar' && styles.selectedLanguage]}
            onPress={() => {
              setCurrentLanguage('ar');
              setShowLanguageModal(false);
            }}
          >
            <Text style={styles.languageOptionText}>🇸🇦 العربية</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.modalCancelButton}
            onPress={() => setShowLanguageModal(false)}
          >
            <Text style={styles.modalCancelButtonText}>{t('cancel')}</Text>
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
        <View style={styles.modalContainer}>
          <Text style={[styles.modalTitle, currentLanguage === 'ar' && styles.rtlText]}>
            {t('confirmLogout')}
          </Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.modalButton} onPress={confirmLogout}>
              <Text style={styles.modalButtonText}>{t('yes')}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalCancelButton} 
              onPress={() => setShowLogoutModal(false)}
            >
              <Text style={styles.modalCancelButtonText}>{t('no')}</Text>
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
      {currentScreen === 'Profile' && renderProfileScreen()}
      {currentScreen === 'Favorites' && renderFavoritesScreen()}
      {currentScreen === 'Orders' && renderOrdersScreen()}
      {currentScreen === 'Chat' && renderChatScreen()}
      {currentScreen === 'Shop' && renderShopScreen()}
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
  logoContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  logoImage: {
    width: 35,
    height: 35,
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
  languageButton: {
    marginTop: 20,
    padding: 10,
    alignItems: 'center',
  },
  languageButtonText: {
    color: '#E91E63',
    fontSize: 16,
  },
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
  homeContent: {
    padding: 20,
  },
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
  },
  activeCategoryButtonText: {
    color: '#fff',
  },
  productsContainer: {
    marginBottom: 80,
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
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 5,
  },
  productShop: {
    fontSize: 12,
    color: '#999',
    marginBottom: 10,
  },
  productActions: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 50,
  },
  profileContent: {
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileIcon: {
    fontSize: 60,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 24,
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
    color: '#E91E63',
    marginBottom: 5,
  },
  profileCredits: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  profileActions: {
    gap: 15,
  },
  actionButton: {
    backgroundColor: '#E91E63',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 20,
    textAlign: 'center',
  },
  favoritesContent: {
    padding: 20,
  },
  favoriteItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  favoriteItemName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  favoriteItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E91E63',
  },
  ordersContent: {
    padding: 20,
  },
  orderItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  orderItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  orderItemDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  orderItemStatus: {
    fontSize: 14,
    color: '#E91E63',
  },
  chatContent: {
    padding: 20,
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    marginBottom: 20,
  },
  messageItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  messageSender: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 5,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  messageTime: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  messageInputContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-end',
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#E91E63',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  shopContent: {
    padding: 20,
  },
  shopItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  shopName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  shopOwner: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  shopDescription: {
    fontSize: 14,
    color: '#666',
  },
  adminContent: {
    padding: 20,
  },
  adminStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#eee',
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
    gap: 15,
  },
  adminButton: {
    backgroundColor: '#E91E63',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  adminButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    margin: 20,
    minWidth: 280,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  languageOption: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  selectedLanguage: {
    backgroundColor: '#E91E63',
  },
  languageOptionText: {
    fontSize: 16,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: '#E91E63',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalCancelButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  modalCancelButtonText: {
    color: '#333',
    fontSize: 16,
  },
});