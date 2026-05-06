import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
  TextInput
} from 'react-native';
import { api } from '../../src/api';
import ProductCard from '../../src/components/ProductCard';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';
import { BoxIcon, OfficialIcon, RecycleIcon } from '../../src/components/Icons';
import { Ionicons } from '@expo/vector-icons';

export default function ShopScreen() {
  const params = useLocalSearchParams();
  const { colors } = useTheme();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Filters
  const [selectedType, setSelectedType] = useState(params.type || '');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [selectedType]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `/shop/products/?`;
      if (selectedType) url += `product_type=${selectedType}&`;
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search & Filter Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <View style={[styles.searchBar, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput 
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search drops..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={fetchProducts}
          />
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          <TouchableOpacity 
            style={[
              styles.filterChip, 
              !selectedType && { backgroundColor: colors.text, borderColor: colors.text },
              { borderColor: colors.border }
            ]}
            onPress={() => setSelectedType('')}
          >
            <Text style={[styles.chipText, !selectedType && { color: colors.background }]}>All Drops</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterChip, 
              selectedType === 'official' && { backgroundColor: colors.accent, borderColor: colors.accent },
              { borderColor: colors.border, flexDirection: 'row', alignItems: 'center', gap: 6 }
            ]}
            onPress={() => toggleType('official')}
          >
            <OfficialIcon size={14} color={selectedType === 'official' ? '#fff' : colors.textMuted} />
            <Text style={[styles.chipText, selectedType === 'official' && { color: '#fff' }]}>Official</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterChip, 
              selectedType === 'second_hand' && { backgroundColor: colors.accentPurple, borderColor: colors.accentPurple },
              { borderColor: colors.border, flexDirection: 'row', alignItems: 'center', gap: 6 }
            ]}
            onPress={() => toggleType('second_hand')}
          >
            <RecycleIcon size={14} color={selectedType === 'second_hand' ? '#fff' : colors.textMuted} />
            <Text style={[styles.chipText, selectedType === 'second_hand' && { color: '#fff' }]}>Second Hand</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {loading && products.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item }) => <ProductCard product={item} />}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <BoxIcon size={64} color={colors.border} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>No items found</Text>
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
  },
  header: {
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '600',
  },
  filterRow: {
    paddingHorizontal: 16,
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 100,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  list: {
    padding: 12,
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: 12,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 16,
    letterSpacing: 1,
  },
});
