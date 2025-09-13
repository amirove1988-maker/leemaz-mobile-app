import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  FlatList,
  Image,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../services/api';

interface DashboardStats {
  users: {
    total: number;
    buyers: number;
    sellers: number;
  };
  shops: {
    total: number;
    pending: number;
    approved: number;
  };
  products: {
    total: number;
    active: number;
  };
  reviews: number;
}

interface Shop {
  _id: string;
  name: string;
  description: string;
  category: string;
  owner_name: string;
  owner_email: string;
  created_at: string;
  is_approved: boolean;
  is_active: boolean;
}

interface SystemSettings {
  product_listing_cost: number;
  initial_user_credits: number;
  shop_approval_required: boolean;
  payment_method: string;
  platform_commission: number;
}

export default function AdminPanelScreen() {
  const { logout } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShopStatus, setSelectedShopStatus] = useState('pending');
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [editingSettings, setEditingSettings] = useState(false);
  const [tempSettings, setTempSettings] = useState<SystemSettings | null>(null);

  useEffect(() => {
    if (settings && !tempSettings) {
      setTempSettings(settings);
    }
  }, [settings]);

  useEffect(() => {
    loadData();
  }, [currentView, selectedShopStatus]);

  const loadData = async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);

    try {
      if (currentView === 'dashboard') {
        const response = await apiClient.get('/admin/dashboard');
        setStats(response.data);
      } else if (currentView === 'shops') {
        const response = await apiClient.get(`/admin/shops?status=${selectedShopStatus}`);
        setShops(response.data);
      } else if (currentView === 'settings') {
        const response = await apiClient.get('/admin/settings');
        setSettings(response.data);
      }
    } catch (error: any) {
      console.error('Error loading data:', error);
      Alert.alert('Error', error.response?.data?.detail || 'Failed to load data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleShopAction = async (shopId: string, action: 'approve' | 'reject') => {
    try {
      const endpoint = action === 'approve' ? 'approve' : 'reject';
      await apiClient.post(`/admin/shops/${shopId}/${endpoint}`);
      
      Alert.alert(
        'Success',
        `Shop ${action}d successfully!`,
        [{ text: 'OK', onPress: () => loadData() }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.detail || `Failed to ${action} shop`);
    }
  };

  const handleUpdateSettings = async (newSettings: SystemSettings) => {
    try {
      await apiClient.post('/admin/settings', {
        product_listing_cost: newSettings.product_listing_cost,
        initial_user_credits: newSettings.initial_user_credits,
        shop_approval_required: newSettings.shop_approval_required,
        payment_method: newSettings.payment_method,
        platform_commission: newSettings.platform_commission,
      });
      
      setSettings(newSettings);
      setEditingSettings(false);
      
      Alert.alert(
        'Settings Updated!',
        'System settings have been updated successfully.',
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.detail || 'Failed to update settings');
    }
  };

  const confirmShopAction = (shop: Shop, action: 'approve' | 'reject') => {
    Alert.alert(
      `${action === 'approve' ? 'Approve' : 'Reject'} Shop`,
      `Are you sure you want to ${action} "${shop.name}" by ${shop.owner_name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: action === 'approve' ? 'Approve' : 'Reject',
          style: action === 'approve' ? 'default' : 'destructive',
          onPress: () => handleShopAction(shop._id, action),
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderSettings = () => {
    if (!settings || !tempSettings) return null;

    return (
      <ScrollView
        contentContainerStyle={styles.settingsContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadData(true)} />}
      >
        <View style={styles.settingsCard}>
          <Text style={styles.settingsTitle}>💰 Credit System Settings</Text>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Product Listing Cost (Credits)</Text>
            <Text style={styles.settingDescription}>How many credits sellers pay to list a product</Text>
            <View style={styles.settingInputRow}>
              <Text style={styles.creditIcon}>💎</Text>
              <TextInput
                style={styles.settingInput}
                value={tempSettings.product_listing_cost.toString()}
                onChangeText={(text) => setTempSettings({
                  ...tempSettings,
                  product_listing_cost: parseInt(text) || 0
                })}
                keyboardType="numeric"
                editable={editingSettings}
              />
              <Text style={styles.creditText}>credits</Text>
            </View>
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Initial User Credits</Text>
            <Text style={styles.settingDescription}>Free credits new users receive</Text>
            <View style={styles.settingInputRow}>
              <Text style={styles.creditIcon}>🎁</Text>
              <TextInput
                style={styles.settingInput}
                value={tempSettings.initial_user_credits.toString()}
                onChangeText={(text) => setTempSettings({
                  ...tempSettings,
                  initial_user_credits: parseInt(text) || 0
                })}
                keyboardType="numeric"
                editable={editingSettings}
              />
              <Text style={styles.creditText}>credits</Text>
            </View>
          </View>
        </View>

        <View style={styles.settingsCard}>
          <Text style={styles.settingsTitle}>💳 Payment Settings</Text>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Payment Method</Text>
            <Text style={styles.settingDescription}>How customers pay for products</Text>
            <View style={styles.paymentOptions}>
              {['cash', 'online', 'both'].map((method) => (
                <TouchableOpacity
                  key={method}
                  style={[
                    styles.paymentOption,
                    tempSettings.payment_method === method && styles.paymentOptionActive,
                    !editingSettings && styles.paymentOptionDisabled
                  ]}
                  onPress={() => editingSettings && setTempSettings({
                    ...tempSettings,
                    payment_method: method
                  })}
                  disabled={!editingSettings}
                >
                  <Text style={[
                    styles.paymentOptionText,
                    tempSettings.payment_method === method && styles.paymentOptionTextActive
                  ]}>
                    {method === 'cash' ? '💵 Cash' : method === 'online' ? '💳 Online' : '🔄 Both'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Platform Commission (%)</Text>
            <Text style={styles.settingDescription}>Commission rate on each sale</Text>
            <View style={styles.settingInputRow}>
              <Text style={styles.creditIcon}>📊</Text>
              <TextInput
                style={styles.settingInput}
                value={(tempSettings.platform_commission * 100).toString()}
                onChangeText={(text) => setTempSettings({
                  ...tempSettings,
                  platform_commission: (parseFloat(text) || 0) / 100
                })}
                keyboardType="numeric"
                editable={editingSettings}
              />
              <Text style={styles.creditText}>%</Text>
            </View>
          </View>
        </View>

        <View style={styles.settingsCard}>
          <Text style={styles.settingsTitle}>🛡️ Shop Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingToggleRow}>
              <View style={styles.settingToggleInfo}>
                <Text style={styles.settingLabel}>Require Shop Approval</Text>
                <Text style={styles.settingDescription}>New shops need admin approval</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.toggle,
                  tempSettings.shop_approval_required && styles.toggleActive,
                  !editingSettings && styles.toggleDisabled
                ]}
                onPress={() => editingSettings && setTempSettings({
                  ...tempSettings,
                  shop_approval_required: !tempSettings.shop_approval_required
                })}
                disabled={!editingSettings}
              >
                <View style={[
                  styles.toggleIndicator,
                  tempSettings.shop_approval_required && styles.toggleIndicatorActive
                ]} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.settingsActions}>
          {!editingSettings ? (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setEditingSettings(true)}
            >
              <Ionicons name="settings" size={20} color="#fff" />
              <Text style={styles.editButtonText}>Edit Settings</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.editActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  if (settings) setTempSettings(settings);
                  setEditingSettings(false);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => tempSettings && handleUpdateSettings(tempSettings)}
              >
                <Ionicons name="checkmark" size={20} color="#fff" />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    );
  };

  const renderDashboard = () => {
    if (!stats) return null;

    return (
      <ScrollView
        contentContainerStyle={styles.dashboardContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadData(true)} />}
      >
        <View style={styles.statsGrid}>
          {/* Users Stats */}
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="people" size={24} color="#1976D2" />
            </View>
            <Text style={styles.statNumber}>{stats.users.total}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
            <Text style={styles.statDetail}>
              {stats.users.buyers} Buyers • {stats.users.sellers} Sellers
            </Text>
          </View>

          {/* Shops Stats */}
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#FCE4EC' }]}>
              <Ionicons name="storefront" size={24} color="#E91E63" />
            </View>
            <Text style={styles.statNumber}>{stats.shops.total}</Text>
            <Text style={styles.statLabel}>Total Shops</Text>
            <Text style={styles.statDetail}>
              {stats.shops.pending} Pending • {stats.shops.approved} Approved
            </Text>
          </View>

          {/* Products Stats */}
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#E8F5E8' }]}>
              <Ionicons name="bag" size={24} color="#4CAF50" />
            </View>
            <Text style={styles.statNumber}>{stats.products.total}</Text>
            <Text style={styles.statLabel}>Total Products</Text>
            <Text style={styles.statDetail}>{stats.products.active} Active</Text>
          </View>

          {/* Reviews Stats */}
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#FFF3E0' }]}>
              <Ionicons name="star" size={24} color="#FF9800" />
            </View>
            <Text style={styles.statNumber}>{stats.reviews}</Text>
            <Text style={styles.statLabel}>Total Reviews</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setCurrentView('shops')}
          >
            <Ionicons name="storefront-outline" size={20} color="#E91E63" />
            <Text style={styles.actionButtonText}>Manage Shops</Text>
            {stats.shops.pending > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{stats.shops.pending}</Text>
              </View>
            )}
          </TouchableOpacity>

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
            <Text style={styles.actionButtonText}>View Products</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  const renderShop = ({ item }: { item: Shop }) => (
    <View style={styles.shopCard}>
      <View style={styles.shopHeader}>
        <View style={styles.shopHeaderLeft}>
          {item.logo ? (
            <Image
              source={{ uri: `data:image/jpeg;base64,${item.logo}` }}
              style={styles.adminShopLogo}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.adminShopLogoPlaceholder}>
              <Ionicons name="storefront" size={20} color="#E91E63" />
            </View>
          )}
          <Text style={styles.shopName}>{item.name}</Text>
        </View>
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.is_approved ? '#E8F5E8' : '#FFF3E0' }
        ]}>
          <Text style={[
            styles.statusText,
            { color: item.is_approved ? '#4CAF50' : '#FF9800' }
          ]}>
            {item.is_approved ? 'Approved' : 'Pending'}
          </Text>
        </View>
      </View>

      <Text style={styles.shopDescription} numberOfLines={2}>
        {item.description}
      </Text>
      
      <View style={styles.shopMeta}>
        <Text style={styles.shopOwner}>👤 {item.owner_name}</Text>
        <Text style={styles.shopEmail}>📧 {item.owner_email}</Text>
        <Text style={styles.shopCategory}>🏷️ {item.category}</Text>
        <Text style={styles.shopDate}>📅 {formatDate(item.created_at)}</Text>
      </View>

      {!item.is_approved && (
        <View style={styles.shopActions}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.approveBtn]}
            onPress={() => confirmShopAction(item, 'approve')}
          >
            <Ionicons name="checkmark" size={16} color="#fff" />
            <Text style={styles.actionBtnText}>Approve</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.rejectBtn]}
            onPress={() => confirmShopAction(item, 'reject')}
          >
            <Ionicons name="close" size={16} color="#fff" />
            <Text style={styles.actionBtnText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderShops = () => (
    <View style={styles.shopsContainer}>
      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        {['pending', 'approved', 'all'].map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterTab,
              selectedShopStatus === status && styles.activeFilterTab,
            ]}
            onPress={() => setSelectedShopStatus(status)}
          >
            <Text
              style={[
                styles.filterTabText,
                selectedShopStatus === status && styles.activeFilterTabText,
              ]}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={shops}
        renderItem={renderShop}
        keyExtractor={(item) => item._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadData(true)} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="storefront-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No {selectedShopStatus} shops found</Text>
          </View>
        }
      />
    </View>
  );

  const renderUserManagement = () => (
    <ScrollView
      contentContainerStyle={styles.managementContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadData(true)} />}
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
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadData(true)} />}
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

        <TouchableOpacity
          style={styles.managementAction}
          onPress={() => {
            Alert.alert('Content Moderation', 'Feature: Review flagged products, approve content, and manage disputes.');
          }}
        >
          <Ionicons name="shield-checkmark" size={20} color="#9C27B0" />
          <Text style={styles.managementActionText}>Content Moderation</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E91E63" />
          <Text style={styles.loadingText}>Loading admin panel...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require('../../assets/images/leemaz-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View>
            <Text style={styles.headerTitle}>Admin Panel</Text>
            <Text style={styles.headerSubtitle}>Leemaz Management</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={24} color="#ff4444" />
        </TouchableOpacity>
      </View>

      {/* Navigation Tabs */}
      <View style={styles.navTabs}>
        {[
          { key: 'dashboard', label: 'Dashboard', icon: 'analytics' },
          { key: 'shops', label: 'Shops', icon: 'storefront' },
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
              name={tab.icon as any}
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
        {currentView === 'shops' && renderShops()}
        {currentView === 'settings' && renderSettings()}
        {currentView === 'users' && renderUserManagement()}
        {currentView === 'products' && renderProductManagement()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
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
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
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
  content: {
    flex: 1,
  },
  dashboardContainer: {
    padding: 16,
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
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  statDetail: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
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
  badge: {
    backgroundColor: '#E91E63',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  shopsContainer: {
    flex: 1,
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f8f9fa',
  },
  activeFilterTab: {
    backgroundColor: '#E91E63',
  },
  filterTabText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterTabText: {
    color: '#fff',
    fontWeight: '600',
  },
  shopCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  shopHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  adminShopLogo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  adminShopLogoPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FCE4EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  shopName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  shopDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  shopMeta: {
    marginBottom: 16,
  },
  shopOwner: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  shopEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  shopCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  shopDate: {
    fontSize: 14,
    color: '#999',
  },
  shopActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  approveBtn: {
    backgroundColor: '#4CAF50',
  },
  rejectBtn: {
    backgroundColor: '#ff4444',
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  comingSoon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comingSoonText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
  },
  // Settings Styles
  settingsContainer: {
    padding: 16,
  },
  settingsCard: {
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
  settingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  settingItem: {
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  settingInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  creditIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  settingInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 4,
  },
  creditText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  paymentOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  paymentOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  paymentOptionActive: {
    backgroundColor: '#E91E63',
    borderColor: '#E91E63',
  },
  paymentOptionDisabled: {
    opacity: 0.6,
  },
  paymentOptionText: {
    fontSize: 14,
    color: '#666',
  },
  paymentOptionTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  settingToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingToggleInfo: {
    flex: 1,
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: '#E91E63',
  },
  toggleDisabled: {
    opacity: 0.6,
  },
  toggleIndicator: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleIndicatorActive: {
    alignSelf: 'flex-end',
  },
  settingsActions: {
    marginTop: 8,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E91E63',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  // Management Styles
  managementContainer: {
    padding: 16,
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
});