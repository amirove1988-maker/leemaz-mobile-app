import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function LoginScreen({ navigation }: any) {
  const { login } = useAuth();
  const { t, isRTL } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(t('error'), t('required'));
      return;
    }

    setLoading(true);
    try {
      const success = await login(email.trim(), password);
      if (!success) {
        Alert.alert(t('error'), t('loginError'));
      }
    } catch (error) {
      Alert.alert(t('error'), t('networkError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, isRTL && styles.rtlContainer]}>
      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/leemaz.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Welcome Text */}
          <View style={[styles.welcomeContainer, isRTL && styles.rtlText]}>
            <Text style={[styles.welcomeText, isRTL && styles.rtlText]}>
              {t('welcome')}
            </Text>
            <Text style={[styles.brandName, isRTL && styles.rtlText]}>
              Leemaz
            </Text>
            <Text style={[styles.subtitle, isRTL && styles.rtlText]}>
              {t('subtitle')}
            </Text>
          </View>

          {/* Login Form */}
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, isRTL && styles.rtlInput]}
                placeholder={t('email')}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                textAlign={isRTL ? 'right' : 'left'}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, isRTL && styles.rtlInput]}
                placeholder={t('password')}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                textAlign={isRTL ? 'right' : 'left'}
                placeholderTextColor="#999"
              />
            </View>

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.disabledButton]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.loginButtonText}>
                {loading ? t('loading') : t('signIn')}
              </Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <Text style={[styles.dividerText, isRTL && styles.rtlText]}>
                {t('or')}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={[styles.registerButtonText, isRTL && styles.rtlText]}>
                {t('createAccount')}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  rtlContainer: {
    direction: 'rtl',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 24,
    color: '#333',
    marginBottom: 8,
  },
  brandName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#333',
  },
  rtlInput: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  loginButton: {
    backgroundColor: '#E91E63',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  divider: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerText: {
    color: '#999',
    fontSize: 14,
  },
  registerButton: {
    borderWidth: 1,
    borderColor: '#E91E63',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#E91E63',
    fontSize: 16,
    fontWeight: '600',
  },
});