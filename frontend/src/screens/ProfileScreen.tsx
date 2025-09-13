import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function ProfileScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const { t, language, setLanguage, isRTL } = useLanguage();
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const handleLogout = async () => {
    Alert.alert(
      t('logout'),
      'Are you sure you want to logout?',
      [
        { text: t('cancel'), style: 'cancel' },
        { 
          text: t('logout'), 
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Logout error:', error);
            }
          }
        }
      ]
    );
  };

  const handleLanguageChange = async (lang: string) => {
    await setLanguage(lang);
    setShowLanguageModal(false);
    
    Alert.alert(
      t('success'),
      'Language changed successfully. Please restart the app for RTL changes to take full effect.',
      [{ text: t('ok') }]
    );
  };

  const handleRequestCredits = () => {
    Alert.alert(
      'Request Credits',
      'You can request additional credits from the admin. Your current balance: ' + (user?.credits || 0) + ' credits.',
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
    // Add Request Credits button for sellers only
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
      onPress: () => {}, // Placeholder
    },
    {
      id: 'logout',
      title: t('logout'),
      icon: 'log-out-outline',
      onPress: handleLogout,
      danger: true,
    },
  ];

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>User not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, isRTL && styles.rtlContainer]}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={[styles.header, isRTL && styles.rtlHeader]}>
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
                {user.full_name}
              </Text>
              <Text style={[styles.userEmail, isRTL && styles.rtlText]}>
                {user.email}
              </Text>
              <Text style={[styles.userType, isRTL && styles.rtlText]}>
                {t(user.user_type)}
              </Text>
            </View>
          </View>

          {/* Credits */}
          <View style={[styles.creditsContainer, isRTL && styles.rtlCredits]}>
            <Ionicons name="wallet-outline" size={20} color="#E91E63" />
            <Text style={[styles.creditsText, isRTL && styles.rtlText]}>
              {user.credits} {t('credits')}
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
                  name={item.icon as any}
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
              onPress={() => handleLanguageChange('en')}
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
              onPress={() => handleLanguageChange('ar')}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  rtlContainer: {
    direction: 'rtl',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#E91E63',
    padding: 20,
    paddingTop: 20,
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
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
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
});