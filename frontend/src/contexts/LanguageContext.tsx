import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';

// Translation files
const translations = {
  en: {
    // Authentication
    login: 'Login',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    fullName: 'Full Name',
    confirmPassword: 'Confirm Password',
    userType: 'User Type',
    buyer: 'Buyer',
    seller: 'Seller',
    language: 'Language',
    english: 'English',
    arabic: 'العربية',
    signIn: 'Sign In',
    createAccount: 'Create New Account',
    welcome: 'Welcome to',
    subtitle: 'Syrian Women\'s Marketplace',
    
    // Navigation
    home: 'Home',
    shop: 'Shop',
    favorites: 'Favorites',
    orders: 'Orders',
    chat: 'Chat',
    profile: 'Profile',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    back: 'Back',
    next: 'Next',
    done: 'Done',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    or: 'or',
    
    // Profile
    logout: 'Logout',
    settings: 'Settings',
    changeLanguage: 'Change Language',
    myProfile: 'My Profile',
    credits: 'Credits',
    
    // Shop
    createShop: 'Create Shop',
    shopName: 'Shop Name',
    description: 'Description',
    category: 'Category',
    logo: 'Logo',
    uploadLogo: 'Upload Logo',
    
    // Products
    products: 'Products',
    productName: 'Product Name',
    price: 'Price',
    addProduct: 'Add Product',
    orderNow: 'Order Now',
    contactSeller: 'Contact Seller',
    
    // Orders
    myOrders: 'My Orders',
    incomingOrders: 'Incoming Orders',
    createOrder: 'Create Order',
    quantity: 'Quantity',
    deliveryAddress: 'Delivery Address',
    phoneNumber: 'Phone Number',
    placeOrder: 'Place Order',
    orderStatus: 'Order Status',
    pending: 'Pending',
    confirmed: 'Confirmed',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    cashOnDelivery: 'Cash on Delivery',
    
    // Reviews
    reviews: 'Reviews',
    writeReview: 'Write Review',
    rating: 'Rating',
    comment: 'Comment',
    
    // Chat
    messages: 'Messages',
    typeMessage: 'Type a message...',
    send: 'Send',
    
    // Errors and Messages
    loginError: 'Invalid email or password',
    registerSuccess: 'Account created successfully',
    required: 'This field is required',
    invalidEmail: 'Please enter a valid email',
    passwordMismatch: 'Passwords do not match',
    networkError: 'Network error. Please try again.',
  },
  ar: {
    // Authentication
    login: 'تسجيل الدخول',
    register: 'تسجيل جديد',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    fullName: 'الاسم الكامل',
    confirmPassword: 'تأكيد كلمة المرور',
    userType: 'نوع المستخدم',
    buyer: 'مشتري',
    seller: 'بائع',
    language: 'اللغة',
    english: 'English',
    arabic: 'العربية',
    signIn: 'دخول',
    createAccount: 'إنشاء حساب جديد',
    welcome: 'مرحباً بك في',
    subtitle: 'سوق السيدات السوريات',
    
    // Navigation
    home: 'الرئيسية',
    shop: 'المتجر',
    favorites: 'المفضلة',
    orders: 'الطلبات',
    chat: 'المحادثات',
    profile: 'الملف الشخصي',
    
    // Common
    loading: 'جاري التحميل...',
    error: 'خطأ',
    success: 'نجح',
    cancel: 'إلغاء',
    confirm: 'تأكيد',
    save: 'حفظ',
    edit: 'تعديل',
    delete: 'حذف',
    back: 'رجوع',
    next: 'التالي',
    done: 'تم',
    yes: 'نعم',
    no: 'لا',
    ok: 'موافق',
    or: 'أو',
    
    // Profile
    logout: 'تسجيل الخروج',
    settings: 'الإعدادات',
    changeLanguage: 'تغيير اللغة',
    myProfile: 'ملفي الشخصي',
    credits: 'النقاط',
    
    // Shop
    createShop: 'إنشاء متجر',
    shopName: 'اسم المتجر',
    description: 'الوصف',
    category: 'الفئة',
    logo: 'الشعار',
    uploadLogo: 'رفع الشعار',
    
    // Products
    products: 'المنتجات',
    productName: 'اسم المنتج',
    price: 'السعر',
    addProduct: 'إضافة منتج',
    orderNow: 'اطلب الآن',
    contactSeller: 'تواصل مع البائع',
    
    // Orders
    myOrders: 'طلباتي',
    incomingOrders: 'الطلبات الواردة',
    createOrder: 'إنشاء طلب',
    quantity: 'الكمية',
    deliveryAddress: 'عنوان التسليم',
    phoneNumber: 'رقم الهاتف',
    placeOrder: 'تأكيد الطلب',
    orderStatus: 'حالة الطلب',
    pending: 'قيد الإنتظار',
    confirmed: 'مؤكد',
    delivered: 'تم التسليم',
    cancelled: 'ملغي',
    cashOnDelivery: 'الدفع عند الاستلام',
    
    // Reviews
    reviews: 'التقييمات',
    writeReview: 'كتابة تقييم',
    rating: 'التقييم',
    comment: 'التعليق',
    
    // Chat
    messages: 'الرسائل',
    typeMessage: 'اكتب رسالة...',
    send: 'إرسال',
    
    // Errors and Messages
    loginError: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
    registerSuccess: 'تم إنشاء الحساب بنجاح',
    required: 'هذا الحقل مطلوب',
    invalidEmail: 'يرجى إدخال بريد إلكتروني صحيح',
    passwordMismatch: 'كلمات المرور غير متطابقة',
    networkError: 'خطأ في الشبكة. يرجى المحاولة مرة أخرى.',
  }
};

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setCurrentLanguage] = useState('en');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('language');
      if (savedLanguage) {
        setCurrentLanguage(savedLanguage);
        // Set RTL for Arabic
        I18nManager.forceRTL(savedLanguage === 'ar');
      }
    } catch (error) {
      console.error('Failed to load language:', error);
    }
  };

  const setLanguage = async (lang: string) => {
    try {
      await AsyncStorage.setItem('language', lang);
      setCurrentLanguage(lang);
      
      // Handle RTL
      const shouldBeRTL = lang === 'ar';
      if (I18nManager.isRTL !== shouldBeRTL) {
        I18nManager.forceRTL(shouldBeRTL);
        // Note: App restart is typically required for RTL changes to take full effect
      }
    } catch (error) {
      console.error('Failed to save language:', error);
    }
  };

  const t = (key: string): string => {
    return translations[language as keyof typeof translations]?.[key as keyof typeof translations['en']] || key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};