// app/(tabs)/cart.tsx

import React from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Alert
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { useCart } from '../../src/context/CartContext';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';
import { 
  BoxIcon, 
  CartIcon, 
  TrashIcon, 
  CheckoutIcon,
  RecycleIcon 
} from '../../src/components/Icons';
import { Ionicons } from '@expo/vector-icons';

export default function CartScreen() {
  const { cart, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const { colors, isDarkMode } = useTheme();
  const router = useRouter();

  const handleCheckout = () => {
    if (cart.length === 0) return;
    Alert.alert('Checkout', 'Payment gateway integration coming soon!');
  };

  const renderItem = ({ item }: any) => {
    const mainImage = item.product.images?.find((img: any) => img.is_main)?.image || item.product.images?.[0]?.image;

    return (
      <View style={[styles.cartItem, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}>
        <ExpoImage 
          source={{ uri: mainImage }}
          style={styles.itemImage}
          contentFit="cover"
        />
        
        <View style={styles.itemInfo}>
          <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={1}>
            {item.product.name}
          </Text>
          {item.variant && (
            <View style={styles.variantBadge}>
              <Text style={[styles.itemVariant, { color: colors.textMuted }]}>
                SIZE: {item.variant.size}
              </Text>
            </View>
          )}
          <Text style={[styles.itemPrice, { color: colors.accent }]}>
            {parseFloat(item.product.price).toLocaleString()} ₽
          </Text>
          
          <View style={styles.quantityRow}>
            <View style={[styles.quantityContainer, { backgroundColor: colors.bgTertiary, borderColor: colors.border }]}>
              <TouchableOpacity 
                style={styles.quantityBtn}
                onPress={() => updateQuantity(item.product.id, item.variant?.id, item.quantity - 1)}
              >
                <Ionicons name="remove" size={16} color={colors.text} />
              </TouchableOpacity>
              <Text style={[styles.quantityText, { color: colors.text }]}>{item.quantity}</Text>
              <TouchableOpacity 
                style={styles.quantityBtn}
                onPress={() => updateQuantity(item.product.id, item.variant?.id, item.quantity + 1)}
              >
                <Ionicons name="add" size={16} color={colors.text} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.removeBtn}
              onPress={() => removeFromCart(item.product.id, item.variant?.id)}
            >
              <TrashIcon size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (cart.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.emptyIconCircle, { backgroundColor: colors.bgSecondary }]}>
          <BoxIcon size={64} color={colors.accent} />
        </View>
        <Text style={[styles.emptyTitle, { color: colors.text }]}>YOUR CART IS EMPTY</Text>
        <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
          Looks like you haven't added any drops to your collection yet.
        </Text>
        <TouchableOpacity 
            style={[styles.shopBtn, { backgroundColor: colors.accent }]} 
            onPress={() => router.push('/(tabs)/shop')}
        >
          <Text style={styles.shopBtnText}>EXPLORE SHOP</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>BAG</Text>
          <Text style={[styles.headerSub, { color: colors.textMuted }]}>{cart.length} ITEMS</Text>
        </View>
        <TouchableOpacity onPress={() => clearCart()}>
          <Text style={[styles.clearText, { color: colors.textMuted }]}>CLEAR ALL</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={cart}
        keyExtractor={(item, index) => `${item.product.id}-${item.variant?.id || index}`}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <View style={[styles.footer, { backgroundColor: colors.bgSecondary, borderTopColor: colors.border }]}>
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: colors.textMuted }]}>TOTAL AMOUNT</Text>
          <Text style={[styles.totalAmount, { color: colors.accent }]}>
            {total.toLocaleString()} ₽
          </Text>
        </View>
        <TouchableOpacity style={[styles.checkoutBtn, { backgroundColor: colors.text }]} onPress={handleCheckout}>
          <CheckoutIcon size={20} color={colors.background} />
          <Text style={[styles.checkoutBtnText, { color: colors.background }]}>CHECKOUT NOW</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '950',
    letterSpacing: -1,
  },
  headerSub: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  clearText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    paddingBottom: 4,
  },
  list: {
    padding: 24,
    paddingTop: 0,
  },
  cartItem: {
    flexDirection: 'row',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 16,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 16,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  variantBadge: {
    marginTop: 4,
  },
  itemVariant: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: '900',
    marginTop: 8,
  },
  quantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 100,
    borderWidth: 1,
    padding: 4,
  },
  quantityBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    marginHorizontal: 12,
    fontSize: 14,
    fontWeight: '900',
  },
  removeBtn: {
    padding: 8,
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '950',
  },
  checkoutBtn: {
    flexDirection: 'row',
    height: 64,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  checkoutBtnText: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '950',
    letterSpacing: -1,
  },
  emptySubtitle: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  shopBtn: {
    marginTop: 40,
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 100,
    shadowColor: '#ff006e',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
  shopBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  }
});
