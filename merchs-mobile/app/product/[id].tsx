// app/product/[id].tsx

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  Dimensions,
  Share
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image as ExpoImage } from 'expo-image';
import { api } from '../../src/api';
import { useCart } from '../../src/context/CartContext';
import { useTheme } from '../../src/context/ThemeContext';
import { 
  BoxIcon, 
  HeartIcon, 
  HeartFilledIcon, 
  OfficialIcon, 
  RecycleIcon,
  StarIcon 
} from '../../src/components/Icons';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { colors, isDarkMode } = useTheme();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/shop/products/${id}/`);
      setProduct(response.data);
      if (response.data.variants?.length > 0) {
        setSelectedVariant(response.data.variants[0]);
      }
    } catch (error) {
      console.error('Fetch product detail error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, selectedVariant);
      // Можно добавить анимацию
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this drop: ${product.name} on Merch Market!`,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.error }}>Product not found</Text>
      </View>
    );
  }

  const images = product.images || [];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={styles.imageGallery}>
          <ScrollView 
            horizontal 
            pagingEnabled 
            onScroll={(e) => {
              const x = e.nativeEvent.contentOffset.x;
              setActiveImage(Math.round(x / width));
            }}
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
          >
            {images.length > 0 ? images.map((img: any, index: number) => (
              <ExpoImage 
                key={index}
                source={{ uri: img.image }}
                style={styles.mainImage}
                contentFit="cover"
              />
            )) : (
              <View style={[styles.mainImage, { backgroundColor: colors.bgTertiary, justifyContent: 'center', alignItems: 'center' }]}>
                <BoxIcon size={80} color={colors.textMuted} />
              </View>
            )}
          </ScrollView>
          
          {images.length > 1 && (
            <View style={styles.pagination}>
              {images.map((_: any, i: number) => (
                <View 
                  key={i} 
                  style={[
                    styles.dot, 
                    { backgroundColor: activeImage === i ? colors.accent : 'rgba(255,255,255,0.3)' },
                    activeImage === i && { width: 24 }
                  ]} 
                />
              ))}
            </View>
          )}

          {/* Floating Buttons */}
          <TouchableOpacity 
            style={[styles.floatingBtn, { left: 20 }]} 
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.floatingBtn, { right: 20 }]} 
            onPress={handleShare}
          >
            <Ionicons name="share-social-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.titleRow}>
            <Text style={[styles.name, { color: colors.text }]}>{product.name}</Text>
            <Text style={[styles.price, { color: colors.accent }]}>
               {parseFloat(product.price).toLocaleString()} ₽
            </Text>
          </View>

          {product.creator && (
            <TouchableOpacity style={[styles.creatorRow, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}>
              <View style={[styles.creatorAvatar, { backgroundColor: colors.accent }]}>
                 <Text style={styles.creatorInitial}>{product.creator.name[0].toUpperCase()}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.creatorLabel, { color: colors.textMuted }]}>CREATOR</Text>
                <Text style={[styles.creatorName, { color: colors.text }]}>{product.creator.name}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}

          <View style={styles.tagsRow}>
            <View style={[styles.tag, { backgroundColor: colors.bgTertiary }]}>
              {product.product_type === 'official' ? <OfficialIcon size={14} color={colors.accent} /> : <RecycleIcon size={14} color={colors.accentPurple} />}
              <Text style={[styles.tagText, { color: colors.textSecondary }]}>
                {product.product_type === 'official' ? 'Official Drop' : 'Second Hand'}
              </Text>
            </View>
            {product.condition && (
              <View style={[styles.tag, { backgroundColor: colors.bgTertiary }]}>
                <StarIcon size={14} color={colors.accent} />
                <Text style={[styles.tagText, { color: colors.textSecondary }]}>{product.condition}</Text>
              </View>
            )}
          </View>

          {product.variants?.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>SELECT SIZE</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.variantList}>
                {product.variants.map((v: any) => (
                  <TouchableOpacity 
                    key={v.id} 
                    style={[
                        styles.variantChip, 
                        { backgroundColor: colors.bgSecondary, borderColor: colors.border },
                        selectedVariant?.id === v.id && { borderColor: colors.accent, backgroundColor: isDarkMode ? 'rgba(255, 0, 110, 0.1)' : 'rgba(255, 0, 110, 0.05)' }
                    ]}
                    onPress={() => setSelectedVariant(v)}
                  >
                    <Text style={[
                        styles.variantText, 
                        { color: colors.textSecondary },
                        selectedVariant?.id === v.id && { color: colors.accent, fontWeight: '900' }
                    ]}>
                      {v.size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>DESCRIPTION</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>{product.description}</Text>
          </View>
        </View>
        
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Bar */}
      <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <TouchableOpacity style={[styles.wishlistButton, { borderColor: colors.border }]}>
          <HeartIcon size={28} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity 
            style={[styles.addToCartButton, { backgroundColor: colors.accent }]} 
            onPress={handleAddToCart}
        >
          <Text style={styles.addToCartText}>ADD TO CART</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  imageGallery: {
    height: width,
    width: width,
    position: 'relative',
  },
  mainImage: {
    width: width,
    height: width,
  },
  pagination: {
    position: 'absolute',
    bottom: 24,
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  floatingBtn: {
    position: 'absolute',
    top: 50,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    padding: 24,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
  },
  name: {
    flex: 1,
    fontSize: 26,
    fontWeight: '950',
    textTransform: 'uppercase',
    letterSpacing: -1,
  },
  price: {
    fontSize: 24,
    fontWeight: '900',
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  creatorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  creatorInitial: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 18,
  },
  creatorLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 2,
  },
  creatorName: {
    fontSize: 16,
    fontWeight: '700',
  },
  tagsRow: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 12,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  section: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 16,
  },
  variantList: {
    flexDirection: 'row',
  },
  variantChip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    marginRight: 12,
    borderWidth: 2,
  },
  variantText: {
    fontSize: 15,
    fontWeight: '700',
  },
  description: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '500',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  wishlistButton: {
    width: 60,
    height: 60,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  addToCartButton: {
    flex: 1,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ff006e',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
