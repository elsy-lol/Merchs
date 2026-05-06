import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList,
  useWindowDimensions,
  ActivityIndicator
} from 'react-native';

import { api } from '../../src/api';
import ProductCard from '../../src/components/ProductCard';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';
import { ShopIcon, StarIcon, LogoIcon } from '../../src/components/Icons';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const { width } = useWindowDimensions();
  const [categories, setCategories] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const numColumns = width > 768 ? 4 : width > 480 ? 3 : 2;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [catRes, prodRes] = await Promise.all([
        api.get('/shop/categories/'),
        api.get('/shop/products/?limit=6')
      ]);
      setCategories(catRes.data.results || catRes.data || []);
      setNewArrivals(prodRes.data.results || prodRes.data || []);
    } catch (error) {
      console.error('Home data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      {/* Hero Header */}
      <View style={[styles.header, { backgroundColor: colors.bgSecondary, borderBottomColor: colors.border }]}>
        <View style={styles.topRow}>
          <LogoIcon size={32} color={colors.accent} />
          <Text style={[styles.brandName, { color: colors.text }]}>MERCH MARKET</Text>
        </View>
        <Text style={[styles.greeting, { color: colors.text }]}>FIND YOUR{"\n"}EXCLUSIVE STYLE</Text>
        <Text style={[styles.subGreeting, { color: colors.textMuted }]}>THE BEST DROPS & SECOND HAND SELECTION</Text>
        
        <TouchableOpacity 
          style={[styles.searchContainer, { backgroundColor: colors.bgTertiary, borderColor: colors.border }]}
          onPress={() => router.push('/(tabs)/shop')}
        >
          <Ionicons name="search" size={20} color={colors.textMuted} />
          <Text style={[styles.searchPlaceholder, { color: colors.textMuted }]}>SEARCH DROPS...</Text>
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>CATEGORIES</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryList}>
          {categories.map((cat: any) => (
            <TouchableOpacity 
              key={cat.id} 
              style={styles.categoryCard}
              onPress={() => router.push({ pathname: '/(tabs)/shop', params: { category: cat.id } })}
            >
              <View style={[styles.categoryIcon, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}>
                <ShopIcon size={24} color={colors.accent} />
              </View>
              <Text style={[styles.categoryText, { color: colors.textSecondary }]}>{cat.name.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* New Arrivals */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>NEW ARRIVALS</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/shop')}>
            <Text style={[styles.viewAll, { color: colors.accent }]}>SEE ALL</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          key={numColumns} 
          data={newArrivals}
          renderItem={({ item }) => <ProductCard product={item} />}
          keyExtractor={(item) => item.id.toString()}
          numColumns={numColumns}
          scrollEnabled={false}
          columnWrapperStyle={numColumns > 1 ? styles.productRow : null}
          contentContainerStyle={styles.productList}
        />
      </View>
      
      <View style={styles.promoSection}>
         <View style={[styles.promoCard, { backgroundColor: colors.accentPurple }]}>
            <StarIcon size={32} color="#fff" />
            <Text style={styles.promoTitle}>JOIN THE LOYALTY PROGRAM</Text>
            <Text style={styles.promoSub}>GET EARLY ACCESS TO NEW DROPS</Text>
         </View>
      </View>
      
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    borderBottomWidth: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  brandName: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '950',
    letterSpacing: -1.5,
    lineHeight: 34,
  },
  subGreeting: {
    fontSize: 12,
    fontWeight: '800',
    marginTop: 12,
    letterSpacing: 1,
    opacity: 0.6,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 20,
    marginTop: 32,
    height: 56,
    borderWidth: 1,
  },
  searchPlaceholder: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
  section: {
    marginTop: 40,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
  },
  viewAll: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  categoryList: {
    gap: 20,
  },
  categoryCard: {
    alignItems: 'center',
    width: 80,
  },
  categoryIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  productList: {
    gap: 16,
  },
  productRow: {
    justifyContent: 'space-between',
    gap: 12,
  },
  promoSection: {
    paddingHorizontal: 24,
    marginTop: 40,
  },
  promoCard: {
    padding: 32,
    borderRadius: 32,
    alignItems: 'center',
    gap: 12,
  },
  promoTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '950',
    textAlign: 'center',
  },
  promoSub: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    opacity: 0.8,
    letterSpacing: 1,
  }
});
