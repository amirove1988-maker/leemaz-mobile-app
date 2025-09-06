import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import ShopScreen from '../screens/ShopScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import CreateProductScreen from '../screens/CreateProductScreen';
import CreateShopScreen from '../screens/CreateShopScreen';
import ChatConversationScreen from '../screens/ChatConversationScreen';
import CreateOrderScreen from '../screens/CreateOrderScreen';
import OrdersScreen from '../screens/OrdersScreen';

export default function MainTabNavigator() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Home');
  const [screenStack, setScreenStack] = useState([{ screen: 'Home', params: {} }]);

  const navigation = {
    navigate: (screenName: string, params = {}) => {
      setScreenStack([...screenStack, { screen: screenName, params }]);
    },
    goBack: () => {
      if (screenStack.length > 1) {
        const newStack = screenStack.slice(0, -1);
        setScreenStack(newStack);
        const lastScreen = newStack[newStack.length - 1];
        if (['Home', 'Shop', 'Favorites', 'Chat', 'Profile'].includes(lastScreen.screen)) {
          setActiveTab(lastScreen.screen);
        }
      }
    }
  };

  const route = {
    params: screenStack[screenStack.length - 1]?.params || {}
  };

  const screenProps = { navigation, route };
  const currentScreen = screenStack[screenStack.length - 1]?.screen || 'Home';

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Home':
        return <HomeScreen {...screenProps} />;
      case 'Shop':
        return <ShopScreen {...screenProps} />;
      case 'Favorites':
        return <FavoritesScreen {...screenProps} />;
      case 'Chat':
        return <ChatScreen {...screenProps} />;
      case 'Profile':
        return <ProfileScreen {...screenProps} />;
      case 'ProductDetails':
        return <ProductDetailsScreen {...screenProps} />;
      case 'CreateProduct':
        return <CreateProductScreen {...screenProps} />;
      case 'CreateShop':
        return <CreateShopScreen {...screenProps} />;
      case 'ChatConversation':
        return <ChatConversationScreen {...screenProps} />;
      case 'CreateOrder':
        return <CreateOrderScreen {...screenProps} />;
      case 'Orders':
        return <OrdersScreen {...screenProps} />;
      default:
        return <HomeScreen {...screenProps} />;
    }
  };

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
    setScreenStack([{ screen: tabName, params: {} }]);
  };

  const tabs = [
    { name: 'Home', icon: 'home', label: 'Home' },
    { name: 'Shop', icon: 'storefront', label: 'Shop' },
    ...(user?.user_type === 'buyer' ? [{ name: 'Favorites', icon: 'heart', label: 'Favorites' }] : []),
    { name: 'Chat', icon: 'chatbubbles', label: 'Chat' },
    { name: 'Profile', icon: 'person', label: 'Profile' },
  ];

  // Don't show tab bar for certain screens
  const hideTabBar = !['Home', 'Shop', 'Favorites', 'Chat', 'Profile'].includes(currentScreen);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screenContainer}>
        {renderScreen()}
      </View>
      
      {!hideTabBar && (
        <View style={styles.tabBar}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabItem}
              onPress={() => handleTabPress(tab.name)}
            >
              <Ionicons
                name={activeTab === tab.name ? tab.icon as any : `${tab.icon}-outline` as any}
                size={24}
                color={activeTab === tab.name ? '#E91E63' : '#666'}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: activeTab === tab.name ? '#E91E63' : '#666' }
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingBottom: 5,
    paddingTop: 10,
    height: 70,
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