import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
  TextInput,
  useWindowDimensions
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { api } from '../../src/api';
import ProductCard from '../../src/components/ProductCard';
import { useLocalSearchParams } from 'expo-router';

export default function CatalogScreen() {
  const params = useLocalSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Filters
  const [selectedType, setSelectedType] = useState(params.type || '');
  const [selectedCategory, setSelectedCategory] = useState(params.category || '');
  const [searchQuery, setSearchQuery] = useState('');
  const { width } = useWindowDimensions();
  const numColumns = width > 768 ? 4 : width > 480 ? 3 : 2;


  useEffect(() => {
    fetchProducts();
  }, [selectedType, selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `/shop/products/?`;
      if (selectedType) url += `product_type=${selectedType}&`;
      if (selectedCategory) url += `category=${selectedCategory}&`;
      if (searchQuery) url += `search=${searchQuery}&`;
      
      const response = await api.get(url);
      setProducts(response.data.results || response.data || []);
    } catch (error) {
      console.error('Fetch products error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const toggleType = (type) => {
    setSelectedType(selectedType === type ? '' : type);
  };

  return (
    <View style={styles.container}>
      {/* Search & Filter Header */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#666" />
          <TextInput 
            style={styles.searchInput}
            placeholder="Поиск..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={fetchProducts}
          />
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          <TouchableOpacity 
            style={[styles.filterChip, !selectedType && styles.activeChip]}
            onPress={() => setSelectedType('')}
          >
            <Text style={[styles.chipText, !selectedType && styles.activeChipText]}>Все</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterChip, selectedType === 'official' && styles.activeChip]}
            onPress={() => toggleType('official')}
          >
            <Text style={[styles.chipText, selectedType === 'official' && styles.activeChipText]}>🎤 Мерч</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterChip, selectedType === 'second_hand' && styles.activeChip]}
            onPress={() => toggleType('second_hand')}
          >
            <Text style={[styles.chipText, selectedType === 'second_hand' && styles.activeChipText]}>♻️ Секонд</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {loading && products.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#ff006e" />
        </View>
      ) : (
        <FlatList
          key={numColumns} // Force re-render when numColumns changes
          data={products}
          keyExtractor={(item) => item.id.toString()}
          numColumns={numColumns}
          contentContainerStyle={styles.list}
          columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : null}
          renderItem={({ item }) => <ProductCard product={item} />}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="shirt-outline" size={64} color="#333" />
              <Text style={styles.emptyText}>Товары не найдены</Text>
            </View>
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
  header: {
    paddingTop: 10,
    backgroundColor: '#1a1a2e',
    paddingBottom: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
    marginHorizontal: 15,
    paddingHorizontal: 15,
    height: 45,
    borderRadius: 10,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: '#fff',
  },
  filterRow: {
    paddingHorizontal: 15,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#2a2a3e',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  activeChip: {
    backgroundColor: '#ff006e',
    borderColor: '#ff006e',
  },
  chipText: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: '600',
  },
  activeChipText: {
    color: '#fff',
  },
  list: {
    padding: 15,
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    marginTop: 15,
  },
});
