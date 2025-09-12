import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { ordersAPI } from '../services/api';

const OrdersScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await apiClient.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Fetch orders error:', error);
      Alert.alert('Error', 'Failed to load orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchOrders();
  }, [fetchOrders]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await apiClient.post(`/orders/${orderId}/status`, { status: newStatus });
      Alert.alert('Success', `Order status updated to ${newStatus}`);
      fetchOrders(); // Refresh the list
    } catch (error) {
      console.error('Update order status error:', error);
      Alert.alert('Error', 'Failed to update order status');
    }
  };

  const confirmStatusUpdate = (orderId, currentStatus, newStatus) => {
    Alert.alert(
      'Update Order Status',
      `Change status from "${currentStatus}" to "${newStatus}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => updateOrderStatus(orderId, newStatus) }
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#FF9800';
      case 'confirmed': return '#2196F3';
      case 'delivered': return '#4CAF50';
      case 'cancelled': return '#f44336';
      default: return '#666';
    }
  };

  const getStatusActions = (order) => {
    const { status } = order;
    const isSeller = user?.user_type === 'seller';
    const isBuyer = user?.user_type === 'buyer';

    if (isSeller) {
      switch (status) {
        case 'pending':
          return [
            { label: 'Confirm', action: 'confirmed', color: '#2196F3' },
            { label: 'Cancel', action: 'cancelled', color: '#f44336' }
          ];
        case 'confirmed':
          return [
            { label: 'Mark Delivered', action: 'delivered', color: '#4CAF50' }
          ];
        default:
          return [];
      }
    }

    if (isBuyer && status === 'pending') {
      return [
        { label: 'Cancel Order', action: 'cancelled', color: '#f44336' }
      ];
    }

    return [];
  };

  const renderOrderItem = ({ item: order }) => {
    const statusActions = getStatusActions(order);
    const isBuyer = user?.user_type === 'buyer';

    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.productName}>{order.product_name}</Text>
            <Text style={styles.orderId}>Order #{order.id.substring(0, 8)}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
            <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.orderDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Quantity:</Text>
            <Text style={styles.detailValue}>{order.quantity}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total Amount:</Text>
            <Text style={styles.detailValue}>${order.total_amount.toFixed(2)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment:</Text>
            <Text style={styles.detailValue}>Cash on Delivery</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Order Date:</Text>
            <Text style={styles.detailValue}>
              {new Date(order.created_at).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View style={styles.addressSection}>
          <Text style={styles.addressLabel}>Delivery Address:</Text>
          <Text style={styles.addressText}>{order.delivery_address}</Text>
          <Text style={styles.phoneText}>Phone: {order.phone_number}</Text>
        </View>

        {statusActions.length > 0 && (
          <View style={styles.actionsSection}>
            {statusActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.actionButton, { backgroundColor: action.color }]}
                onPress={() => confirmStatusUpdate(order.id, order.status, action.action)}
              >
                <Text style={styles.actionButtonText}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {isBuyer && order.status === 'delivered' && (
          <TouchableOpacity
            style={styles.reviewButton}
            onPress={() => navigation.navigate('CreateReviewScreen', { 
              productId: order.product_id,
              productName: order.product_name 
            })}
          >
            <Text style={styles.reviewButtonText}>Write Review</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E91E63" />
        <Text style={styles.loadingText}>Loading orders...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {user?.user_type === 'buyer' ? 'My Orders' : 'Incoming Orders'}
        </Text>
        <Text style={styles.subtitle}>
          {orders.length} {orders.length === 1 ? 'order' : 'orders'}
        </Text>
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {user?.user_type === 'buyer' 
              ? 'You have no orders yet' 
              : 'No incoming orders'}
          </Text>
          <Text style={styles.emptySubtext}>
            {user?.user_type === 'buyer' 
              ? 'Start shopping to place your first order!'
              : 'Orders from buyers will appear here'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          style={styles.ordersList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#E91E63']}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#E91E63',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  ordersList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  orderId: {
    fontSize: 12,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  orderDetails: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  addressSection: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  addressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  phoneText: {
    fontSize: 14,
    color: '#666',
  },
  actionsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  reviewButton: {
    backgroundColor: '#E91E63',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 12,
  },
  reviewButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default OrdersScreen;