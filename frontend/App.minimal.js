import React from 'react';
import { StyleSheet, Text, View, StatusBar, Platform } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Leemaz</Text>
      <Text style={styles.subtitle}>Syrian Women's Marketplace</Text>
      <Text style={styles.arabicText}>سوق النساء السوريات</Text>
      <Text style={styles.version}>Version: 1.0.0</Text>
      <Text style={styles.platform}>Platform: {Platform.OS}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  arabicText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  version: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
  },
  platform: {
    fontSize: 14,
    color: '#999',
  },
});