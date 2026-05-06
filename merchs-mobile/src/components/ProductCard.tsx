// src/components/ProductCard.tsx

import React from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { OfficialIcon, RecycleIcon, StarIcon } from './Icons';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: any;
    product_type?: string;
    images?: Array<{ image: string; is_main: boolean }>;
    creator?: { name: string };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { width } = useWindowDimensions();
  const { colors } = useTheme();
  const router = useRouter();
  
  const numColumns = width > 768 ? 4 : width > 480 ? 3 : 2;
  const padding = 12;
  const gap = 12;
  const cardWidth = (width - (padding * 2) - (gap * (numColumns - 1))) / numColumns;

  const mainImage = product.images?.find(img => img.is_main)?.image || product.images?.[0]?.image;
  const isSecondHand = product.product_type === 'second_hand';

  return (
    <Pressable 
      style={[
        styles.card, 
        { 
          width: cardWidth, 
          backgroundColor: colors.bgSecondary,
          borderColor: colors.border
        }
      ]} 
      onPress={() => router.push(`/product/${product.id}`)}
    >
      <View style={[styles.imageContainer, { height: cardWidth * 1.2, backgroundColor: colors.bgTertiary }]}>
        {mainImage ? (
          <ExpoImage
            source={{ uri: mainImage }}
            style={styles.image}
            contentFit="cover"
            transition={300}
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={{ color: colors.textMuted }}>No Image</Text>
          </View>
        )}

        {/* Badge */}
        <View style={[
          styles.badge, 
          { backgroundColor: 'rgba(0,0,0,0.6)', borderColor: isSecondHand ? colors.accentPurple : colors.accent }
        ]}>
          {isSecondHand ? <RecycleIcon size={12} color={colors.accentPurple} /> : <OfficialIcon size={12} color={colors.accent} />}
          <Text style={[styles.badgeText, { color: isSecondHand ? colors.accentPurple : colors.accent }]}>
            {isSecondHand ? 'Second' : 'Drop'}
          </Text>
        </View>
      </View>

      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
          {product.name}
        </Text>
        
        {product.creator && (
          <View style={styles.creatorRow}>
            <StarIcon size={12} color={colors.accent} />
            <Text style={[styles.creator, { color: colors.textSecondary }]} numberOfLines={1}>
              {product.creator.name}
            </Text>
          </View>
        )}
        
        <Text style={[styles.price, { color: colors.accent }]}>
          {parseFloat(product.price.toString()).toLocaleString()} ₽
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  info: {
    padding: 12,
  },
  name: {
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 4,
    height: 36,
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  creator: {
    fontSize: 11,
    fontWeight: '600',
  },
  price: {
    fontSize: 16,
    fontWeight: '900',
  },
});