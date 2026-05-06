// src/components/Sidebar.tsx

import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Dimensions, 
  Pressable 
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useUI } from '../context/UIContext';
import { useTheme } from '../context/ThemeContext';
import { 
  HomeIcon, 
  ShopIcon, 
  CartIcon, 
  UserIcon, 
  SunIcon, 
  MoonIcon 
} from './Icons';

const { width, height } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.8;

export default function Sidebar() {
  const { isSidebarOpen, closeSidebar } = useUI();
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isSidebarOpen ? 0 : -SIDEBAR_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isSidebarOpen]);

  const navigateTo = (path: string) => {
    closeSidebar();
    router.push(path);
  };

  const navItems = [
    { name: 'index', label: 'Главная', Icon: HomeIcon },
    { name: 'shop', label: 'Магазин', Icon: ShopIcon },
    { name: 'cart', label: 'Корзина', Icon: CartIcon },
    { name: 'profile', label: 'Профиль', Icon: UserIcon },
  ];

  return (
    <View style={styles.overlayContainer} pointerEvents={isSidebarOpen ? 'auto' : 'none'}>
      <Pressable 
        style={[styles.backdrop, { opacity: isSidebarOpen ? 1 : 0 }]} 
        onPress={closeSidebar} 
      />
      
      <Animated.View style={[
        styles.sidebar, 
        { 
          transform: [{ translateX: slideAnim }],
          backgroundColor: colors.background,
          borderColor: colors.border
        }
      ]}>
        <View style={styles.header}>
          <Text style={[styles.logo, { color: colors.accent }]}>MERCH MARKET</Text>
        </View>

        <View style={styles.nav}>
          {navItems.map((item) => {
            const isActive = pathname === `/${item.name === 'index' ? '' : item.name}` || 
                            (item.name === 'index' && pathname === '/');
            
            return (
              <TouchableOpacity 
                key={item.name} 
                style={[
                  styles.navItem, 
                  isActive && { backgroundColor: isDarkMode ? 'rgba(255, 0, 110, 0.1)' : 'rgba(255, 0, 110, 0.05)' }
                ]}
                onPress={() => navigateTo(item.name === 'index' ? '/' : `/(tabs)/${item.name}`)}
              >
                <item.Icon 
                  size={24} 
                  color={isActive ? colors.accent : colors.textMuted} 
                />
                <Text style={[
                  styles.navLabel, 
                  { color: isActive ? colors.text : colors.textMuted },
                  isActive && styles.activeNavLabel
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <TouchableOpacity 
            style={[styles.themeToggle, { backgroundColor: colors.bgSecondary }]} 
            onPress={toggleTheme}
          >
            {isDarkMode ? <SunIcon size={20} color={colors.text} /> : <MoonIcon size={20} color={colors.text} />}
            <Text style={[styles.themeText, { color: colors.text }]}>
              {isDarkMode ? 'Светлая тема' : 'Темная тема'}
            </Text>
          </TouchableOpacity>
          
          <Text style={[styles.version, { color: colors.textMuted }]}>v1.1.0 PREMIUM</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    height: '100%',
    paddingTop: 60,
    borderRightWidth: 1,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  logo: {
    fontSize: 24,
    fontWeight: '950',
    letterSpacing: -1,
  },
  nav: {
    flex: 1,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginHorizontal: 12,
    borderRadius: 16,
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 16,
    textTransform: 'uppercase',
  },
  activeNavLabel: {
    fontWeight: '900',
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 16,
    gap: 12,
    marginBottom: 20,
  },
  themeText: {
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  version: {
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '700',
    opacity: 0.5,
  }
});
