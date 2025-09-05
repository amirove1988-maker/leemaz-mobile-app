import React, { useEffect, useState } from 'react';
import { StyleSheet, ActivityIndicator, View, Text } from 'react-native';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import LoginScreen from '../src/screens/LoginScreen';
import RegisterScreen from '../src/screens/RegisterScreen';
import EmailVerificationScreen from '../src/screens/EmailVerificationScreen';
import MainTabNavigator from '../src/navigation/MainTabNavigator';

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
    case 'EmailVerification':
      return <EmailVerificationScreen {...authScreenProps} />;
    default:
      return <LoginScreen {...authScreenProps} />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
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
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});