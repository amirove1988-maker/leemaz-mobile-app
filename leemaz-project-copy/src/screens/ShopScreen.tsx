import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { shopAPI, productAPI } from '../services/api';

interface Shop {
  id: string;
  name: string;
  description: string;
  category: string;
  created_at: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  rating: number;
  review_count: number;
}

export default function ShopScreen({ navigation }: any) {
  const { user, refreshUser } = useAuth();
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (user?.user_type === 'seller') {
      loadShopData();
    }
  }, [user]);

  const loadShopData = async () => {
    setLoading(true);
    setHasError(false);
    
    try {
      // Try to get user's shop
      const shopResponse = await shopAPI.getMyShop();
      setShop(shopResponse.data);
      
      // Load shop products
      // Note: In a real app, you'd have an endpoint to get products by shop
      const productsResponse = await productAPI.getProducts();
      setProducts(productsResponse.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        // User doesn't have a shop yet
        setShop(null);
      } else {
        setHasError(true);
        console.error('Error loading shop data:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateShop = () => {
    navigation.navigate('CreateShop');
  };

  const handleAddProduct = () => {
    if (!shop) {
      Alert.alert('No Shop', 'Please create a shop first');
      return;
    }
    
    if (user && user.credits < 50) {
      Alert.alert(
        'Insufficient Credits',
        'You need 50 credits to list a product. Each listing costs 50 credits.',
        [
          { text: 'OK', style: 'default' }
        ]
      );
      return;
    }
    
    navigation.navigate('CreateProduct', { shopId: shop.id });
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
    >
      {item.images.length > 0 ? (
        <Image
          source={{ uri: `data:image/jpeg;base64,${item.images[0]}` }}
          style={styles.productImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.productImagePlaceholder}>
          <Ionicons name="image-outline" size={24} color="#ccc" />
        </View>
      )}
      
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.productPrice}>${item.price}</Text>
        
        <View style={styles.productMeta}>
          <View style={styles.rating}>
            <Ionicons name="star" size={12} color="#FFB000" />
            <Text style={styles.ratingText}>
              {item.rating.toFixed(1)} ({item.review_count})
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (user?.user_type !== 'seller') {
    // Show shops browser for buyers
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Explore Shops</Text>
        </View>
        
        <ScrollView style={styles.content}>
          <View style={styles.comingSoonContainer}>
            <Ionicons name="storefront-outline" size={64} color="#E91E63" />
            <Text style={styles.comingSoonTitle}>Shop Directory</Text>
            <Text style={styles.comingSoonText}>
              Browse amazing shops from Syrian women entrepreneurs.
              Coming soon!
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E91E63" />
          <Text style={styles.loadingText}>Loading your shop...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (hasError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#ff6b6b" />
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorText}>Unable to load your shop data</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadShopData}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!shop) {
    // User doesn't have a shop yet
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Shop</Text>
        </View>
        
        <View style={styles.noShopContainer}>
          <Ionicons name="storefront-outline" size={80} color="#E91E63" />
          <Text style={styles.noShopTitle}>Create Your Shop</Text>
          <Text style={styles.noShopText}>
            Start selling your products on Leemaz.{'\n'}
            Create your shop and reach customers across Syria!
          </Text>
          
          <TouchableOpacity style={styles.createShopButton} onPress={handleCreateShop}>
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.createShopButtonText}>Create Shop</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Shop</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
          <Ionicons name="add" size={24} color="#E91E63" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Shop Info */}
        <View style={styles.shopInfo}>
          <View style={styles.shopIcon}>
            {shop.logo ? (
              <Image
                source={{ uri: `data:image/jpeg;base64,${shop.logo}` }}
                style={styles.shopLogo}
                resizeMode="cover"
              />
            ) : (
              <Ionicons name="storefront" size={32} color="#E91E63" />
            )}
          </View>
          <View style={styles.shopDetails}>
            <Text style={styles.shopName}>{shop.name}</Text>
            <Text style={styles.shopCategory}>{shop.category}</Text>
            <Text style={styles.shopDescription}>{shop.description}</Text>
          </View>
        </View>

        {/* Credits Info */}
        <View style={styles.creditsCard}>
          <View style={styles.creditsInfo}>
            <Ionicons name="diamond-outline" size={24} color="#FFB000" />
            <View>
              <Text style={styles.creditsAmount}>{user?.credits || 0} Credits</Text>
              <Text style={styles.creditsText}>50 credits per product listing</Text>
            </View>
          </View>
        </View>

        {/* Products Section */}
        <View style={styles.productsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Products</Text>
            <TouchableOpacity onPress={handleAddProduct}>
              <Text style={styles.addProductLink}>Add Product</Text>
            </TouchableOpacity>
          </View>

          {products.length > 0 ? (
            <FlatList
              data={products}
              renderItem={renderProduct}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.productRow}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.noProductsContainer}>
              <Ionicons name="bag-outline" size={48} color="#ccc" />
              <Text style={styles.noProductsText}>No products yet</Text>
              <Text style={styles.noProductsSubtext}>Add your first product to start selling</Text>
              
              <TouchableOpacity style={styles.addFirstProductButton} onPress={handleAddProduct}>
                <Text style={styles.addFirstProductButtonText}>Add First Product</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FCE4EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#E91E63',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  shopInfo: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#f8f9fa',
    margin: 16,
    borderRadius: 12,
  },
  shopIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#FCE4EC',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    overflow: 'hidden',
  },
  shopLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  shopDetails: {
    flex: 1,
  },
  shopName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  shopCategory: {
    fontSize: 14,
    color: '#E91E63',
    marginBottom: 8,
  },
  shopDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  creditsCard: {
    backgroundColor: '#FFF9C4',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  creditsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creditsAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 12,
  },
  creditsText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
  },
  productsSection: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addProductLink: {
    fontSize: 16,
    color: '#E91E63',
    fontWeight: '600',
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
  productImage: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  productImagePlaceholder: {
    width: '100%',
    height: 100,
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
  noProductsContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  noProductsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  noProductsSubtext: {
    fontSize: 14,
    color: '#999',
    marginBottom: 24,
  },
  addFirstProductButton: {
    backgroundColor: '#E91E63',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addFirstProductButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
});