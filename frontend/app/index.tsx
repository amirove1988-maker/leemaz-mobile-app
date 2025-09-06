import React, { useEffect, useState } from 'react';
import { StyleSheet, ActivityIndicator, View, Text } from 'react-native';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import { LanguageProvider } from '../src/contexts/LanguageContext';
import LoginScreen from '../src/screens/LoginScreen';
import RegisterScreen from '../src/screens/RegisterScreen';
import MainTabNavigator from '../src/navigation/MainTabNavigator';
import AdminPanelScreen from '../src/screens/AdminPanelScreen';

function AppContent() {
  const { user, isLoading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState('Login');

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E91E63" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (user) {
    // Check if user is admin
    const isAdmin = user.email === 'admin@leemaz.com' || 
                   user.email === 'admin@admin.leemaz.com' || 
                   user.email.endsWith('@admin.leemaz.com');
    
    if (isAdmin) {
      return <AdminPanelScreen />;
    }
    
    return <MainTabNavigator />;
  }

  // Navigation logic for auth screens
  const navigate = (screenName: string, params?: any) => {
    setCurrentScreen(screenName);
  };

  const goBack = () => {
    setCurrentScreen('Login');
  };

  const authScreenProps = {
    navigation: { navigate, goBack },
    route: { params: {} }
  };

  switch (currentScreen) {
    case 'Register':
      return <RegisterScreen {...authScreenProps} />;
    default:
      return <LoginScreen {...authScreenProps} />;
  }
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});