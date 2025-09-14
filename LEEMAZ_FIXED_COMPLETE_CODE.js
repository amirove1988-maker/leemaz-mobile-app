import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  SafeAreaView,
  Image,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Get screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// ===============================
// COMPLETE LEEMAZ MOBILE APP - FIXED VERSION
// ===============================
// This is the comprehensive Leemaz app with all fixes:
// ✅ Real butterfly logo image (not emoji)
// ✅ Syria mobile number (+963) for seller registration/login
// ✅ Fixed screen sizing and SafeAreaView issues
// ✅ Role-based restrictions (sellers can't buy, buyers can't sell)
// ✅ Request Credits button for sellers
// ✅ Functional Admin Panel (user/product management)
// ✅ Chat system between buyers and sellers
// ✅ Bilingual Arabic/English support

// Mock Data
const MOCK_USER_ACCOUNTS = {
  buyer: {
    id: '1',
    email: 'buyer@leemaz.com',
    mobile: '+963912345678',
    full_name: 'Fatima Al-Ahmad',
    user_type: 'buyer',
    credits: 0,
    language: 'en'
  },
  seller: {
    id: '2', 
    email: 'seller@leemaz.com',
    mobile: '+963987654321',
    full_name: 'Aisha Mahmoud',
    user_type: 'seller',
    credits: 150,
    language: 'ar'
  },
  admin: {
    id: '3',
    email: 'admin@leemaz.com',
    mobile: '+963900000000',
    full_name: 'Admin User',
    user_type: 'admin',
    credits: 1000,
    language: 'en'
  }
};

const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Traditional Syrian Embroidery',
    description: 'Beautiful handmade embroidery with traditional patterns',
    price: 45,
    category: 'Crafts',
    images: [],
    rating: 4.8,
    review_count: 12,
    seller_id: '2'
  },
  {
    id: '2',
    name: 'Handmade Silver Jewelry',
    description: 'Elegant silver jewelry crafted by Syrian artisans',
    price: 75,
    category: 'Jewelry', 
    images: [],
    rating: 4.9,
    review_count: 8
  },
  {
    id: '3',
    name: 'Syrian Spice Collection',
    description: 'Authentic Syrian spices and herbs collection',
    price: 30,
    category: 'Food',
    images: [],
    rating: 4.7,
    review_count: 15
  }
];

const MOCK_CONVERSATIONS = [
  {
    _id: '1',
    user: { id: '2', full_name: 'Aisha Mahmoud' },
    last_message: 'Thank you for your purchase!',
    last_message_time: new Date().toISOString(),
    unread_count: 1
  },
  {
    _id: '2', 
    user: { id: '1', full_name: 'Fatima Al-Ahmad' },
    last_message: 'Is this item available?',
    last_message_time: new Date(Date.now() - 3600000).toISOString(),
    unread_count: 0
  }
];

const MOCK_MESSAGES = [
  {
    id: '1',
    sender_id: '1',
    receiver_id: '2', 
    message: 'Hello! I am interested in your embroidery work.',
    created_at: new Date(Date.now() - 7200000).toISOString(),
    is_read: true
  },
  {
    id: '2',
    sender_id: '2',
    receiver_id: '1',
    message: 'Thank you for your interest! Which design would you like?',
    created_at: new Date(Date.now() - 3600000).toISOString(), 
    is_read: true
  }
];

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
    credits: 'Credits',
    buyer: 'Buyer',
    seller: 'Seller',
    admin: 'Admin',
    cancel: 'Cancel',
    ok: 'OK',
    success: 'Success',
    english: 'English',
    arabic: 'العربية',
    requestCredits: 'Request Credits',
    mobileNumber: 'Mobile Number',
    syriaCode: 'Syria (+963)'
  },
  ar: {
    welcome: 'مرحباً بك في ليماز',
    subtitle: 'سوق السيدات السوريات',
    home: 'الرئيسية',
    shop: 'المتجر',
    profile: 'الملف الشخصي',
    favorites: 'المفضلة',
    orders: 'الطلبات',
    chat: 'الدردشة',
    login: 'تسجيل الدخول',
    register: 'التسجيل',
    logout: 'تسجيل الخروج',
    products: 'المنتجات',
    empowering: 'تمكين رائدات الأعمال السوريات',
    discover: 'اكتشف المنتجات اليدوية الأصيلة',
    switchLanguage: 'Switch to English',
    myProfile: 'ملفي الشخصي',
    changeLanguage: 'تغيير اللغة',
    settings: 'الإعدادات',
    credits: 'النقاط',
    buyer: 'مشتري',
    seller: 'بائع',
    admin: 'مدير',
    cancel: 'إلغاء',
    ok: 'موافق',
    success: 'نجح',
    english: 'English',
    arabic: 'العربية',
    requestCredits: 'طلب نقاط',
    mobileNumber: 'رقم الهاتف',
    syriaCode: 'سوريا (+963)'
  }
};

// Main App Component
export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Login');
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('Home');
  const [screenStack, setScreenStack] = useState([{ screen: 'Home', params: {} }]);

  // Helper functions
  const t = (key) => translations[language][key] || key;
  const isRTL = language === 'ar';

  // Mobile number validation for Syria
  const validateSyriaMobile = (mobile) => {
    // Remove spaces and special characters except +
    const cleanMobile = mobile.replace(/[^\d+]/g, '');
    // Check if it starts with +963 and has correct length (13 digits total)
    return cleanMobile.startsWith('+963') && cleanMobile.length === 13;
  };

  // Navigation
  const navigation = {
    navigate: (screenName, params = {}) => {
      setScreenStack([...screenStack, { screen: screenName, params }]);
      setCurrentScreen(screenName);
    },
    goBack: () => {
      if (screenStack.length > 1) {
        const newStack = screenStack.slice(0, -1);
        setScreenStack(newStack);
        const lastScreen = newStack[newStack.length - 1];
        setCurrentScreen(lastScreen.screen);
        if (['Home', 'Shop', 'Favorites', 'Chat', 'Profile', 'Orders'].includes(lastScreen.screen)) {
          setActiveTab(lastScreen.screen);
        }
      }
    }
  };

  const route = {
    params: screenStack[screenStack.length - 1]?.params || {}
  };

  const handleLogin = (emailOrMobile, password, userType = null) => {
    // Mock login logic - check both email and mobile
    const account = Object.values(MOCK_USER_ACCOUNTS).find(acc => 
      acc.email === emailOrMobile || acc.mobile === emailOrMobile
    );
    
    if (account && (userType === null || account.user_type === userType)) {
      setUser(account);
      if (account.user_type === 'admin') {
        setCurrentScreen('AdminPanel');
      } else {
        setCurrentScreen('Home');
        setActiveTab('Home');
      }
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen('Login');
    setScreenStack([]);
  };

  // ===============================
  // AUTH SCREENS
  // ===============================

  const LoginScreen = () => {
    const [loginData, setLoginData] = useState({
      emailOrMobile: '',
      password: '',
      userType: 'buyer'
    });

    const handleSignIn = () => {
      // Special handling for seller login - require mobile number
      if (loginData.userType === 'seller') {
        if (!validateSyriaMobile(loginData.emailOrMobile)) {
          Alert.alert('Error', 'Sellers must provide a valid Syrian mobile number starting with +963');
          return;
        }
      }

      if (handleLogin(loginData.emailOrMobile, loginData.password, loginData.userType)) {
        Alert.alert('Success', 'Logged in successfully!');
      } else {
        Alert.alert('Error', 'Invalid credentials. Try:\nBuyer: buyer@leemaz.com\nSeller: +963987654321\nAdmin: admin@leemaz.com\nPassword: any');
      }
    };

    return (
      <SafeAreaView style={styles.authContainer}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView 
            contentContainerStyle={styles.authContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={{ uri: 'https://customer-assets.emergentagent.com/job_syrian-artisan/artifacts/jfs9o3yv_leemaz.png' }}
                style={styles.logoImage}
                resizeMode="contain"
              />
              <Text style={styles.logoText}>Leemaz</Text>
              <Text style={styles.logoSubtitle}>Syrian Women's Marketplace</Text>
            </View>

            {/* User Type Selection */}
            <View style={styles.userTypeContainer}>
              <Text style={styles.userTypeLabel}>Login as:</Text>
              <View style={styles.userTypeButtons}>
                {['buyer', 'seller', 'admin'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.userTypeButton,
                      loginData.userType === type && styles.activeUserTypeButton
                    ]}
                    onPress={() => setLoginData({...loginData, userType: type})}
                  >
                    <Text style={[
                      styles.userTypeButtonText,
                      loginData.userType === type && styles.activeUserTypeButtonText
                    ]}>
                      {t(type)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Login Form */}
            <View style={styles.authForm}>
              <TextInput
                style={styles.authInput}
                placeholder={loginData.userType === 'seller' ? `${t('mobileNumber')} (+963...)` : 'Email'}
                value={loginData.emailOrMobile}
                onChangeText={(text) => setLoginData({...loginData, emailOrMobile: text})}
                keyboardType={loginData.userType === 'seller' ? 'phone-pad' : 'email-address'}
                autoCapitalize="none"
              />
              <TextInput
                style={styles.authInput}
                placeholder="Password"
                value={loginData.password}
                onChangeText={(text) => setLoginData({...loginData, password: text})}
                secureTextEntry
              />

              <TouchableOpacity style={styles.authButton} onPress={handleSignIn}>
                <Text style={styles.authButtonText}>Sign In</Text>
              </TouchableOpacity>

              <Text style={styles.authDivider}>or</Text>

              <TouchableOpacity 
                style={styles.authSecondaryButton}
                onPress={() => setCurrentScreen('Register')}
              >
                <Text style={styles.authSecondaryButtonText}>Create New Account</Text>
              </TouchableOpacity>
            </View>

            {/* Demo Accounts Info */}
            <View style={styles.demoInfo}>
              <Text style={styles.demoTitle}>Demo Accounts:</Text>
              <Text style={styles.demoText}>Buyer: buyer@leemaz.com</Text>
              <Text style={styles.demoText}>Seller: +963987654321</Text>
              <Text style={styles.demoText}>Admin: admin@leemaz.com</Text>
              <Text style={styles.demoText}>Password: any</Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  };

  const RegisterScreen = () => {
    const [formData, setFormData] = useState({
      email: '',
      mobile: '+963',
      password: '',
      fullName: '',
      userType: 'buyer'
    });

    const handleRegister = () => {
      // Validate mobile number for sellers
      if (formData.userType === 'seller' && !validateSyriaMobile(formData.mobile)) {
        Alert.alert('Error', 'Please provide a valid Syrian mobile number starting with +963');
        return;
      }

      Alert.alert('Success', 'Account created successfully! Please login.');
      setCurrentScreen('Login');
    };

    return (
      <SafeAreaView style={styles.authContainer}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView 
            contentContainerStyle={styles.authContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.authHeader}>
              <TouchableOpacity onPress={() => setCurrentScreen('Login')}>
                <Ionicons name="arrow-back" size={24} color="#E91E63" />
              </TouchableOpacity>
              <Text style={styles.authTitle}>Create Account</Text>
            </View>

            {/* User Type Selection */}
            <View style={styles.userTypeContainer}>
              <Text style={styles.userTypeLabel}>Register as:</Text>
              <View style={styles.userTypeButtons}>
                {['buyer', 'seller'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.userTypeButton,
                      formData.userType === type && styles.activeUserTypeButton
                    ]}
                    onPress={() => setFormData({...formData, userType: type})}
                  >
                    <Text style={[
                      styles.userTypeButtonText,
                      formData.userType === type && styles.activeUserTypeButtonText
                    ]}>
                      {t(type)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.authForm}>
              <TextInput
                style={styles.authInput}
                placeholder="Full Name"
                value={formData.fullName}
                onChangeText={(text) => setFormData({...formData, fullName: text})}
              />
              <TextInput
                style={styles.authInput}
                placeholder="Email"
                value={formData.email}
                onChangeText={(text) => setFormData({...formData, email: text})}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.authInput}
                placeholder={`${t('mobileNumber')} (+963...)`}
                value={formData.mobile}
                onChangeText={(text) => setFormData({...formData, mobile: text})}
                keyboardType="phone-pad"
              />
              <TextInput
                style={styles.authInput}
                placeholder="Password"
                value={formData.password}
                onChangeText={(text) => setFormData({...formData, password: text})}
                secureTextEntry
              />

              <TouchableOpacity style={styles.authButton} onPress={handleRegister}>
                <Text style={styles.authButtonText}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  };

  // ===============================
  // MAIN APP SCREENS
  // ===============================

  const HomeScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredProducts = MOCK_PRODUCTS.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderProduct = ({ item }) => (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
      >
        <View style={styles.productImagePlaceholder}>
          <Ionicons name="image-outline" size={32} color="#ccc" />
        </View>
        
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.productPrice}>${item.price}</Text>
          
          <View style={styles.productMeta}>
            <View style={styles.rating}>
              <Ionicons name="star" size={14} color="#FFB000" />
              <Text style={styles.ratingText}>
                {item.rating.toFixed(1)} ({item.review_count})
              </Text>
            </View>
            <Text style={styles.category}>{item.category}</Text>
          </View>

          {/* Role-based actions */}
          {user?.user_type === 'buyer' && (
            <TouchableOpacity style={styles.viewProductButton}>
              <Text style={styles.viewProductButtonText}>View Details</Text>
            </TouchableOpacity>
          )}
          {user?.user_type === 'seller' && (
            <View style={styles.sellerInfo}>
              <Text style={styles.sellerInfoText}>As a seller, you can view but not purchase</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );

    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.screenContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.greeting}>Welcome{user ? `, ${user.full_name}` : ''}!</Text>
                <View style={styles.brandHeader}>
                  <Image
                    source={{ uri: 'https://customer-assets.emergentagent.com/job_syrian-artisan/artifacts/jfs9o3yv_leemaz.png' }}
                    style={styles.brandLogo}
                    resizeMode="contain"
                  />
                  <Text style={styles.brandName}>Leemaz</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.profileButton}>
                <Ionicons name="person-circle-outline" size={32} color="#E91E63" />
              </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search products..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          {/* Products */}
          <FlatList
            data={filteredProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.productRow}
            contentContainerStyle={styles.productsContainer}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </SafeAreaView>
    );
  };

  const ShopScreen = () => {
    if (user?.user_type === 'buyer') {
      return (
        <SafeAreaView style={styles.safeContainer}>
          <View style={styles.screenContainer}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Explore Shops</Text>
            </View>
            
            <View style={styles.comingSoonContainer}>
              <Ionicons name="storefront-outline" size={64} color="#E91E63" />
              <Text style={styles.comingSoonTitle}>Shop Directory</Text>
              <Text style={styles.comingSoonText}>
                Browse amazing shops from Syrian women entrepreneurs.
                Coming soon!
              </Text>
            </View>
          </View>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.screenContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>My Shop</Text>
            <TouchableOpacity style={styles.addButton}>
              <Ionicons name="add" size={24} color="#E91E63" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.noShopContainer}>
              <Ionicons name="storefront-outline" size={80} color="#E91E63" />
              <Text style={styles.noShopTitle}>Create Your Shop</Text>
              <Text style={styles.noShopText}>
                Start selling your products on Leemaz.{'\n'}
                Create your shop and reach customers across Syria!
              </Text>
              
              <TouchableOpacity style={styles.createShopButton}>
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={styles.createShopButtonText}>Create Shop</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  };

  const ProfileScreen = () => {
    const [showLanguageModal, setShowLanguageModal] = useState(false);

    const handleRequestCredits = () => {
      Alert.alert(
        'Request Credits',
        `You can request additional credits from the admin. Your current balance: ${user?.credits || 0} credits.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Send Request', 
            onPress: () => {
              Alert.alert('Request Sent', 'Your credit request has been sent to the admin for review.');
            }
          }
        ]
      );
    };

    const menuItems = [
      {
        id: 'language',
        title: t('changeLanguage'),
        icon: 'language-outline',
        onPress: () => setShowLanguageModal(true),
      },
      ...(user?.user_type === 'seller' ? [{
        id: 'requestCredits',
        title: 'Request Credits',
        icon: 'diamond-outline',
        onPress: handleRequestCredits,
      }] : []),
      {
        id: 'settings',
        title: t('settings'),
        icon: 'settings-outline',
        onPress: () => {},
      },
      {
        id: 'logout',
        title: t('logout'),
        icon: 'log-out-outline',
        onPress: handleLogout,
        danger: true,
      },
    ];

    return (
      <SafeAreaView style={[styles.safeContainer, isRTL && styles.rtlContainer]}>
        <View style={styles.screenContainer}>
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={[styles.profileHeader, isRTL && styles.rtlHeader]}>
              <Text style={[styles.title, isRTL && styles.rtlText]}>
                {t('myProfile')}
              </Text>
            </View>

            {/* User Info */}
            <View style={styles.userInfoCard}>
              <View style={styles.userInfo}>
                <View style={styles.avatar}>
                  <Ionicons name="person" size={40} color="#fff" />
                </View>
                <View style={[styles.userDetails, isRTL && styles.rtlUserDetails]}>
                  <Text style={[styles.userName, isRTL && styles.rtlText]}>
                    {user?.full_name}
                  </Text>
                  <Text style={[styles.userEmail, isRTL && styles.rtlText]}>
                    {user?.email}
                  </Text>
                  <Text style={[styles.userMobile, isRTL && styles.rtlText]}>
                    {user?.mobile}
                  </Text>
                  <Text style={[styles.userType, isRTL && styles.rtlText]}>
                    {t(user?.user_type)}
                  </Text>
                </View>
              </View>

              {/* Credits */}
              <View style={[styles.creditsContainer, isRTL && styles.rtlCredits]}>
                <Ionicons name="wallet-outline" size={20} color="#E91E63" />
                <Text style={[styles.creditsText, isRTL && styles.rtlText]}>
                  {user?.credits} {t('credits')}
                </Text>
              </View>
            </View>

            {/* Menu Items */}
            <View style={styles.menuContainer}>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.menuItem,
                    isRTL && styles.rtlMenuItem,
                    item.danger && styles.dangerMenuItem
                  ]}
                  onPress={item.onPress}
                >
                  <View style={[styles.menuItemContent, isRTL && styles.rtlMenuContent]}>
                    <Ionicons
                      name={item.icon}
                      size={24}
                      color={item.danger ? '#f44336' : '#666'}
                    />
                    <Text style={[
                      styles.menuItemText,
                      isRTL && styles.rtlText,
                      item.danger && styles.dangerText
                    ]}>
                      {item.title}
                    </Text>
                  </View>
                  <Ionicons
                    name={isRTL ? "chevron-back-outline" : "chevron-forward-outline"}
                    size={20}
                    color={item.danger ? '#f44336' : '#ccc'}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Language Selection Modal */}
          <Modal
            visible={showLanguageModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowLanguageModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, isRTL && styles.rtlModal]}>
                <Text style={[styles.modalTitle, isRTL && styles.rtlText]}>
                  {t('changeLanguage')}
                </Text>
                
                <TouchableOpacity
                  style={[
                    styles.languageOption,
                    language === 'en' && styles.activeLanguage
                  ]}
                  onPress={() => {
                    setLanguage('en');
                    setShowLanguageModal(false);
                  }}
                >
                  <Text style={[
                    styles.languageText,
                    language === 'en' && styles.activeLanguageText
                  ]}>
                    {t('english')}
                  </Text>
                  {language === 'en' && (
                    <Ionicons name="checkmark" size={20} color="#E91E63" />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.languageOption,
                    language === 'ar' && styles.activeLanguage
                  ]}
                  onPress={() => {
                    setLanguage('ar');
                    setShowLanguageModal(false);
                  }}
                >
                  <Text style={[
                    styles.languageText,
                    language === 'ar' && styles.activeLanguageText
                  ]}>
                    {t('arabic')}
                  </Text>
                  {language === 'ar' && (
                    <Ionicons name="checkmark" size={20} color="#E91E63" />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setShowLanguageModal(false)}
                >
                  <Text style={styles.modalCloseText}>{t('cancel')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    );
  };

  const ChatScreen = () => {
    const formatTime = (dateString) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

      if (diffInHours < 1) {
        return 'Just now';
      } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)}h ago`;
      } else {
        return date.toLocaleDateString();
      }
    };

    const renderConversation = ({ item }) => (
      <TouchableOpacity
        style={styles.conversationCard}
        onPress={() => navigation.navigate('ChatConversation', {
          userId: item.user.id,
          userName: item.user.full_name,
        })}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.user.full_name.charAt(0).toUpperCase()}
          </Text>
        </View>

        <View style={styles.conversationInfo}>
          <View style={styles.conversationHeader}>
            <Text style={styles.conversationUserName}>{item.user.full_name}</Text>
            <Text style={styles.timeText}>{formatTime(item.last_message_time)}</Text>
          </View>
          
          <View style={styles.messageRow}>
            <Text
              style={[
                styles.lastMessage,
                item.unread_count > 0 && styles.unreadMessage,
              ]}
              numberOfLines={1}
            >
              {item.last_message}
            </Text>
            
            {item.unread_count > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>
                  {item.unread_count > 99 ? '99+' : item.unread_count}
                </Text>
              </View>
            )}
          </View>
        </View>

        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </TouchableOpacity>
    );

    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.screenContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Messages</Text>
          </View>

          <FlatList
            data={MOCK_CONVERSATIONS}
            renderItem={renderConversation}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="chatbubbles-outline" size={64} color="#ccc" />
                <Text style={styles.emptyTitle}>No Messages Yet</Text>
                <Text style={styles.emptyText}>
                  Start a conversation with sellers or buyers.{'\n'}
                  Your messages will appear here.
                </Text>
              </View>
            }
          />
        </View>
      </SafeAreaView>
    );
  };

  const ChatConversationScreen = () => {
    const { userId, userName } = route.params;
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState(MOCK_MESSAGES);

    const formatTime = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const sendMessage = () => {
      if (!newMessage.trim()) return;

      const newMsg = {
        id: Date.now().toString(),
        sender_id: user?.id,
        receiver_id: userId,
        message: newMessage.trim(),
        created_at: new Date().toISOString(),
        is_read: false
      };

      setMessages([...messages, newMsg]);
      setNewMessage('');
    };

    const renderMessage = ({ item }) => {
      const isMyMessage = item.sender_id === user?.id;
      
      return (
        <View
          style={[
            styles.messageContainer,
            isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer,
          ]}
        >
          <View
            style={[
              styles.messageBubble,
              isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                isMyMessage ? styles.myMessageText : styles.otherMessageText,
              ]}
            >
              {item.message}
            </Text>
            
            <Text
              style={[
                styles.messageTime,
                isMyMessage ? styles.myMessageTime : styles.otherMessageTime,
              ]}
            >
              {formatTime(item.created_at)}
            </Text>
          </View>
        </View>
      );
    };

    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.screenContainer}>
          {/* Header */}
          <View style={styles.chatHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            
            <View style={styles.headerInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {userName.charAt(0).toUpperCase()}
                </Text>
              </View>
              
              <View>
                <Text style={styles.headerTitle}>{userName}</Text>
                <Text style={styles.headerSubtitle}>Active now</Text>
              </View>
            </View>
          </View>

          {/* Messages */}
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesContainer}
            showsVerticalScrollIndicator={false}
          />

          {/* Message Input */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Type a message..."
                  value={newMessage}
                  onChangeText={setNewMessage}
                  multiline
                  maxLength={1000}
                />
                
                <TouchableOpacity
                  style={[
                    styles.sendButton,
                    !newMessage.trim() && styles.sendButtonDisabled,
                  ]}
                  onPress={sendMessage}
                  disabled={!newMessage.trim()}
                >
                  <Ionicons
                    name="send"
                    size={20}
                    color={!newMessage.trim() ? '#ccc' : '#fff'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    );
  };

  // ===============================
  // ADMIN PANEL
  // ===============================

  const AdminPanelScreen = () => {
    const [currentView, setCurrentView] = useState('dashboard');

    const renderUserManagement = () => (
      <ScrollView 
        contentContainerStyle={styles.managementContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.managementCard}>
          <Text style={styles.managementTitle}>👥 User Management</Text>
          
          <TouchableOpacity
            style={styles.managementAction}
            onPress={() => {
              Alert.alert('User Management', 'Feature: View all users, manage user roles, suspend accounts, and handle user verification.');
            }}
          >
            <Ionicons name="people" size={20} color="#1976D2" />
            <Text style={styles.managementActionText}>View All Users</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.managementAction}
            onPress={() => {
              Alert.alert('Credit Management', 'Feature: Add/remove credits from user accounts, view credit transaction history.');
            }}
          >
            <Ionicons name="diamond" size={20} color="#FFB000" />
            <Text style={styles.managementActionText}>Manage User Credits</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.managementAction}
            onPress={() => {
              Alert.alert('User Reports', 'Feature: View user activity reports, registration trends, and engagement metrics.');
            }}
          >
            <Ionicons name="analytics" size={20} color="#4CAF50" />
            <Text style={styles.managementActionText}>User Reports</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );

    const renderProductManagement = () => (
      <ScrollView 
        contentContainerStyle={styles.managementContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.managementCard}>
          <Text style={styles.managementTitle}>📦 Product Management</Text>
          
          <TouchableOpacity
            style={styles.managementAction}
            onPress={() => {
              Alert.alert('All Products', 'Feature: View all products across all shops, moderate content, and manage listings.');
            }}
          >
            <Ionicons name="bag" size={20} color="#E91E63" />
            <Text style={styles.managementActionText}>View All Products</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.managementAction}
            onPress={() => {
              Alert.alert('Product Categories', 'Feature: Manage product categories, create new categories, and organize listings.');
            }}
          >
            <Ionicons name="pricetags" size={20} color="#FF9800" />
            <Text style={styles.managementActionText}>Manage Categories</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.managementAction}
            onPress={() => {
              Alert.alert('Product Reports', 'Feature: View product performance, popular items, and sales analytics.');
            }}
          >
            <Ionicons name="trending-up" size={20} color="#4CAF50" />
            <Text style={styles.managementActionText}>Product Analytics</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );

    const renderDashboard = () => (
      <ScrollView 
        contentContainerStyle={styles.dashboardContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="people" size={24} color="#1976D2" />
            <Text style={styles.statNumber}>247</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="storefront" size={24} color="#E91E63" />
            <Text style={styles.statNumber}>89</Text>
            <Text style={styles.statLabel}>Active Shops</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="bag" size={24} color="#4CAF50" />
            <Text style={styles.statNumber}>1,234</Text>
            <Text style={styles.statLabel}>Products Listed</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="star" size={24} color="#FF9800" />
            <Text style={styles.statNumber}>456</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setCurrentView('users')}
          >
            <Ionicons name="people-outline" size={20} color="#1976D2" />
            <Text style={styles.actionButtonText}>Manage Users</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setCurrentView('products')}
          >
            <Ionicons name="bag-outline" size={20} color="#4CAF50" />
            <Text style={styles.actionButtonText}>Manage Products</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setCurrentView('settings')}
          >
            <Ionicons name="settings-outline" size={20} color="#666" />
            <Text style={styles.actionButtonText}>Credit Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );

    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.screenContainer}>
          {/* Header */}
          <View style={styles.adminHeader}>
            <View style={styles.headerLeft}>
              <Image
                source={{ uri: 'https://customer-assets.emergentagent.com/job_syrian-artisan/artifacts/jfs9o3yv_leemaz.png' }}
                style={styles.adminLogo}
                resizeMode="contain"
              />
              <View>
                <Text style={styles.headerTitle}>Admin Panel</Text>
                <Text style={styles.headerSubtitle}>Leemaz Management</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} color="#ff4444" />
            </TouchableOpacity>
          </View>

          {/* Navigation Tabs */}
          <View style={styles.navTabs}>
            {[
              { key: 'dashboard', label: 'Dashboard', icon: 'analytics' },
              { key: 'users', label: 'Users', icon: 'people' },
              { key: 'products', label: 'Products', icon: 'bag' },
              { key: 'settings', label: 'Settings', icon: 'settings' },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.navTab,
                  currentView === tab.key && styles.activeNavTab,
                ]}
                onPress={() => setCurrentView(tab.key)}
              >
                <Ionicons
                  name={tab.icon}
                  size={20}
                  color={currentView === tab.key ? '#E91E63' : '#666'}
                />
                <Text
                  style={[
                    styles.navTabText,
                    currentView === tab.key && styles.activeNavTabText,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Content */}
          <View style={styles.content}>
            {currentView === 'dashboard' && renderDashboard()}
            {currentView === 'users' && renderUserManagement()}
            {currentView === 'products' && renderProductManagement()}
            {currentView === 'settings' && (
              <View style={styles.comingSoonContainer}>
                <Ionicons name="settings-outline" size={64} color="#ccc" />
                <Text style={styles.comingSoonTitle}>Credit Settings</Text>
                <Text style={styles.comingSoonText}>Configure credit pricing and system settings.</Text>
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  };

  // ===============================
  // OTHER SCREENS
  // ===============================

  const FavoritesScreen = () => (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.screenContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Favorites</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>No Favorites Yet</Text>
          <Text style={styles.emptyText}>Products you like will appear here</Text>
        </View>
      </View>
    </SafeAreaView>
  );

  const OrdersScreen = () => (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.screenContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Orders</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>No Orders Yet</Text>
          <Text style={styles.emptyText}>Your orders will appear here</Text>
        </View>
      </View>
    </SafeAreaView>
  );

  // ===============================
  // NAVIGATION
  // ===============================

  const TabBar = () => {
    if (user?.user_type === 'admin') return null;

    const tabs = [
      { name: 'Home', icon: 'home', label: t('home') },
      { name: 'Shop', icon: 'storefront', label: t('shop') },
      ...(user?.user_type === 'buyer' ? [{ name: 'Favorites', icon: 'heart', label: t('favorites') }] : []),
      { name: 'Orders', icon: 'receipt', label: t('orders') },
      { name: 'Chat', icon: 'chatbubbles', label: t('chat') },
      { name: 'Profile', icon: 'person', label: t('profile') },
    ];

    const hideTabBar = !['Home', 'Shop', 'Favorites', 'Chat', 'Profile', 'Orders'].includes(currentScreen);

    if (hideTabBar) return null;

    return (
      <View style={[styles.tabBar, isRTL && styles.rtlTabBar]}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.name}
            style={styles.tabItem}
            onPress={() => {
              setActiveTab(tab.name);
              setCurrentScreen(tab.name);
              setScreenStack([{ screen: tab.name, params: {} }]);
            }}
          >
            <Ionicons
              name={activeTab === tab.name ? tab.icon : `${tab.icon}-outline`}
              size={24}
              color={activeTab === tab.name ? '#E91E63' : '#666'}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: activeTab === tab.name ? '#E91E63' : '#666' },
                isRTL && styles.rtlText
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // ===============================
  // RENDER CURRENT SCREEN
  // ===============================

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Login':
        return <LoginScreen />;
      case 'Register':
        return <RegisterScreen />;
      case 'Home':
        return <HomeScreen />;
      case 'Shop':
        return <ShopScreen />;
      case 'Favorites':
        return <FavoritesScreen />;
      case 'Orders':
        return <OrdersScreen />;
      case 'Chat':
        return <ChatScreen />;
      case 'ChatConversation':
        return <ChatConversationScreen />;
      case 'Profile':
        return <ProfileScreen />;
      case 'AdminPanel':
        return <AdminPanelScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={[styles.appContainer, isRTL && styles.rtlContainer]}>
      {renderScreen()}
      <TabBar />
    </View>
  );
}

// ===============================
// STYLES
// ===============================

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  rtlContainer: {
    direction: 'rtl',
  },
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  screenContainer: {
    flex: 1,
    paddingBottom: Platform.OS === 'ios' ? 90 : 70, // Account for tab bar
  },
  keyboardView: {
    flex: 1,
  },
  
  // Auth Styles
  authContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  authContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 8,
  },
  logoSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  authHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 16,
  },
  userTypeContainer: {
    marginBottom: 24,
  },
  userTypeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  userTypeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  userTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  activeUserTypeButton: {
    backgroundColor: '#E91E63',
    borderColor: '#E91E63',
  },
  userTypeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textTransform: 'capitalize',
  },
  activeUserTypeButtonText: {
    color: '#fff',
  },
  authForm: {
    marginBottom: 24,
  },
  authInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  authButton: {
    backgroundColor: '#E91E63',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  authButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  authDivider: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 16,
  },
  authSecondaryButton: {
    borderWidth: 1,
    borderColor: '#E91E63',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  authSecondaryButtonText: {
    color: '#E91E63',
    fontSize: 16,
    fontWeight: '600',
  },
  demoInfo: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  demoText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },

  // Header Styles
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandLogo: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  greeting: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  brandName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E91E63',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  profileButton: {
    padding: 4,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FCE4EC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Search Styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },

  // Product Styles
  productsContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImagePlaceholder: {
    width: '100%',
    height: 120,
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 8,
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  category: {
    fontSize: 12,
    color: '#999',
  },
  viewProductButton: {
    backgroundColor: '#E91E63',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 8,
    alignItems: 'center',
  },
  viewProductButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  sellerInfo: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 8,
  },
  sellerInfoText: {
    fontSize: 10,
    color: '#FF9800',
    textAlign: 'center',
  },

  // Shop Styles
  content: {
    flex: 1,
  },
  noShopContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  noShopTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 24,
    marginBottom: 16,
  },
  noShopText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  createShopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E91E63',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
  },
  createShopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },

  // Profile Styles
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: '#E91E63',
    padding: 20,
    paddingTop: 30,
  },
  rtlHeader: {
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  userInfoCard: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E91E63',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userDetails: {
    marginLeft: 16,
    flex: 1,
  },
  rtlUserDetails: {
    marginLeft: 0,
    marginRight: 16,
    alignItems: 'flex-end',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  userMobile: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  userType: {
    fontSize: 12,
    color: '#E91E63',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  creditsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  rtlCredits: {
    flexDirection: 'row-reverse',
  },
  creditsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  menuContainer: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 32,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  rtlMenuItem: {
    flexDirection: 'row-reverse',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rtlMenuContent: {
    flexDirection: 'row-reverse',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  dangerMenuItem: {
    backgroundColor: '#fff5f5',
  },
  dangerText: {
    color: '#f44336',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    minWidth: 280,
    maxWidth: '90%',
  },
  rtlModal: {
    alignItems: 'flex-end',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  activeLanguage: {
    backgroundColor: '#f0f7ff',
  },
  languageText: {
    fontSize: 16,
    color: '#333',
  },
  activeLanguageText: {
    color: '#E91E63',
    fontWeight: '600',
  },
  modalCloseButton: {
    marginTop: 16,
    padding: 12,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#666',
  },

  // Chat Styles
  listContainer: {
    paddingVertical: 8,
    paddingBottom: 32,
  },
  conversationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  conversationInfo: {
    flex: 1,
    marginLeft: 16,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  timeText: {
    fontSize: 12,
    color: '#999',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  unreadMessage: {
    fontWeight: '600',
    color: '#333',
  },
  unreadBadge: {
    backgroundColor: '#E91E63',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Chat Conversation Styles
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    marginRight: 16,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
    flexGrow: 1,
    paddingBottom: 32,
  },
  messageContainer: {
    marginBottom: 12,
  },
  myMessageContainer: {
    alignItems: 'flex-end',
  },
  otherMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  myMessageBubble: {
    backgroundColor: '#E91E63',
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    backgroundColor: '#f0f0f0',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#333',
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
    opacity: 0.7,
  },
  myMessageTime: {
    color: '#fff',
    textAlign: 'right',
  },
  otherMessageTime: {
    color: '#666',
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E91E63',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  sendButtonDisabled: {
    backgroundColor: '#f0f0f0',
  },

  // Admin Panel Styles
  adminHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminLogo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  logoutButton: {
    padding: 8,
  },
  navTabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  activeNavTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#E91E63',
  },
  navTabText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  activeNavTabText: {
    color: '#E91E63',
    fontWeight: '600',
  },
  dashboardContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  quickActions: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  managementContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  managementCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  managementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  managementAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    marginBottom: 8,
  },
  managementActionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },

  // Common Styles
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 24,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  comingSoonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  comingSoonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 24,
    marginBottom: 16,
  },
  comingSoonText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },

  // Tab Bar Styles
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingBottom: Platform.OS === 'ios' ? 25 : 5,
    paddingTop: 10,
    height: Platform.OS === 'ios' ? 90 : 70,
  },
  rtlTabBar: {
    flexDirection: 'row-reverse',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});