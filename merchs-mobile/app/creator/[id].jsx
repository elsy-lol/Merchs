import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack, Link } from 'expo-router';
import api from '../../src/api';
import ProductCard from '../../src/components/ProductCard';

export default function CreatorProductsScreen() {
  const { id } = useLocalSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProducts();
    }
  }, [id]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/shop/products/', {
        params: { creator: id },
      });
      setProducts(response.data.results || response.data || []);
    } catch (error) {
      console.error('Fetch products error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Мерч автора', headerBackTitle: 'Назад' }} />
      
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#ff006e" />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <Link href={`/product/${item.id}`} style={styles.link}>
              <ProductCard product={item} />
            </Link>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>У этого автора пока нет мерча</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  list: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  link: {
    width: '48%',
  },
});
