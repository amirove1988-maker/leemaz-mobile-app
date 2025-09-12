import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Main App Component
export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Home');
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('en');

  // Sample data
  const sampleProducts = [
    { id: 1, name: 'Traditional Syrian Embroidery', price: 45, category: 'Crafts' },
    { id: 2, name: 'Handmade Jewelry', price: 25, category: 'Jewelry' },
    { id: 3, name: 'Syrian Spices Set', price: 30, category: 'Food' },
    { id: 4, name: 'Woven Scarf', price: 35, category: 'Fashion' },
  ];

  // Translations
  const translations = {
    en: {
      welcome: 'Welcome to Leemaz',
      subtitle: 'Syrian Women\'s Marketplace',
      home: 'Home',
      shop: 'Shop',
      profile: 'Profile',
      login: 'Login',
      register: 'Register',
      products: 'Products',
      empowering: 'Empowering Syrian Women Entrepreneurs',
      discover: 'Discover authentic handmade products',
      switchLanguage: 'Switch to Arabic',
    },
    ar: {
      welcome: 'مرحباً بك في ليماز',
      subtitle: 'سوق السيدات السوريات',
      home: 'الرئيسية',
      shop: 'المتجر',
      profile: 'الملف الشخصي',
      login: 'تسجيل الدخول',
      register: 'تسجيل جديد',
      products: 'المنتجات',
      empowering: 'تمكين رائدات الأعمال السوريات',
      discover: 'اكتشف المنتجات اليدوية الأصيلة',
      switchLanguage: 'Switch to English',
    }
  };

  const t = (key) => translations[language][key] || key;
  const isRTL = language === 'ar';

  // Navigation Component
  const TabBar = () => (
    <View style={[styles.tabBar, isRTL && styles.rtlTabBar]}>
      {['Home', 'Shop', 'Profile'].map((tab) => (
        <TouchableOpacity
          key={tab}
          style={styles.tabItem}
          onPress={() => setCurrentScreen(tab)}
        >
          <Ionicons
            name={
              tab === 'Home' ? 'home' :
              tab === 'Shop' ? 'storefront' :
              'person'
            }
            size={24}
            color={currentScreen === tab ? '#E91E63' : '#666'}
          />
          <Text style={[
            styles.tabLabel,
            { color: currentScreen === tab ? '#E91E63' : '#666' },
            isRTL && styles.rtlText
          ]}>
            {t(tab.toLowerCase())}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // Home Screen
  const HomeScreen = () => (
    <ScrollView style={styles.screenContainer}>
      <View style={[styles.header, isRTL && styles.rtlHeader]}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>🦋</Text>
          <Text style={[styles.appName, isRTL && styles.rtlText]}>Leemaz</Text>
        </View>
        <TouchableOpacity
          style={styles.languageButton}
          onPress={() => setLanguage(language === 'en' ? 'ar' : 'en')}
        >
          <Text style={styles.languageButtonText}>
            {language === 'en' ? 'عربي' : 'EN'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.welcomeSection, isRTL && styles.rtlSection]}>
        <Text style={[styles.welcomeTitle, isRTL && styles.rtlText]}>
          {t('welcome')}
        </Text>
        <Text style={[styles.welcomeSubtitle, isRTL && styles.rtlText]}>
          {t('subtitle')}
        </Text>
      </View>

      <View style={[styles.missionSection, isRTL && styles.rtlSection]}>
        <Text style={[styles.missionTitle, isRTL && styles.rtlText]}>
          {t('empowering')}
        </Text>
        <Text style={[styles.missionText, isRTL && styles.rtlText]}>
          {t('discover')}
        </Text>
      </View>

      <View style={[styles.featuredSection, isRTL && styles.rtlSection]}>
        <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
          {t('products')}
        </Text>
        {sampleProducts.map((product) => (
          <View key={product.id} style={[styles.productCard, isRTL && styles.rtlCard]}>
            <View style={styles.productImage}>
              <Text style={styles.productImageText}>📦</Text>
            </View>
            <View style={[styles.productInfo, isRTL && styles.rtlProductInfo]}>
              <Text style={[styles.productName, isRTL && styles.rtlText]}>
                {product.name}
              </Text>
              <Text style={[styles.productPrice, isRTL && styles.rtlText]}>
                ${product.price}
              </Text>
              <Text style={[styles.productCategory, isRTL && styles.rtlText]}>
                {product.category}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  // Shop Screen
  const ShopScreen = () => (
    <ScrollView style={styles.screenContainer}>
      <View style={[styles.header, isRTL && styles.rtlHeader]}>
        <Text style={[styles.screenTitle, isRTL && styles.rtlText]}>
          {t('shop')}
        </Text>
      </View>
      <View style={styles.comingSoonContainer}>
        <Text style={styles.comingSoon}>🏪</Text>
        <Text style={[styles.comingSoonText, isRTL && styles.rtlText]}>
          Shop features coming soon!
        </Text>
      </View>
    </ScrollView>
  );

  // Profile Screen
  const ProfileScreen = () => (
    <ScrollView style={styles.screenContainer}>
      <View style={[styles.header, isRTL && styles.rtlHeader]}>
        <Text style={[styles.screenTitle, isRTL && styles.rtlText]}>
          {t('profile')}
        </Text>
      </View>
      <View style={styles.profileContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
        <Text style={[styles.profileName, isRTL && styles.rtlText]}>
          Syrian Entrepreneur
        </Text>
        <TouchableOpacity
          style={styles.languageSwitch}
          onPress={() => setLanguage(language === 'en' ? 'ar' : 'en')}
        >
          <Text style={styles.languageSwitchText}>
            {t('switchLanguage')}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // Render current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'Home': return <HomeScreen />;
      case 'Shop': return <ShopScreen />;
      case 'Profile': return <ProfileScreen />;
      default: return <HomeScreen />;
    }
  };

  return (
    <SafeAreaView style={[styles.container, isRTL && styles.rtlContainer]}>
      {renderScreen()}
      <TabBar />
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  rtlContainer: {
    direction: 'rtl',
  },
  screenContainer: {
    flex: 1,
  },
  header: {
    backgroundColor: '#E91E63',
    padding: 20,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rtlHeader: {
    flexDirection: 'row-reverse',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    marginRight: 8,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  languageButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  languageButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  welcomeSection: {
    padding: 20,
    alignItems: 'center',
  },
  rtlSection: {
    alignItems: 'flex-end',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  missionSection: {
    padding: 20,
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
  },
  missionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 8,
    textAlign: 'center',
  },
  missionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  featuredSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  productCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  rtlCard: {
    flexDirection: 'row-reverse',
  },
  productImage: {
    width: 60,
    height: 60,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  productImageText: {
    fontSize: 24,
  },
  productInfo: {
    flex: 1,
  },
  rtlProductInfo: {
    alignItems: 'flex-end',
    marginRight: 12,
    marginLeft: 0,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 2,
  },
  productCategory: {
    fontSize: 12,
    color: '#666',
  },
  comingSoonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  comingSoon: {
    fontSize: 48,
    marginBottom: 16,
  },
  comingSoonText: {
    fontSize: 18,
    color: '#666',
  },
  profileContainer: {
    alignItems: 'center',
    padding: 40,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E91E63',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    color: 'white',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  languageSwitch: {
    backgroundColor: '#E91E63',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  languageSwitchText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingBottom: 20,
    paddingTop: 10,
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
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});