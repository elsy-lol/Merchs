// app/(tabs)/profile.tsx

import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert
} from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';
import { 
  UserIcon, 
  BoxIcon, 
  HeartIcon, 
  LogoutIcon, 
  StarIcon,
  SunIcon,
  MoonIcon 
} from '../../src/components/Icons';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { user, logout, isAuthenticated } = useAuth();
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => logout() }
      ]
    );
  };

  if (!isAuthenticated) {
    return (
      <View style={[styles.authContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.iconCircle, { backgroundColor: colors.bgSecondary }]}>
          <UserIcon size={64} color={colors.accent} />
        </View>
        <Text style={[styles.authTitle, { color: colors.text }]}>JOIN THE CULTURE</Text>
        <Text style={[styles.authSubtitle, { color: colors.textMuted }]}>
          Sign in to track your drops, manage your wishlist, and get exclusive access.
        </Text>
        
        <TouchableOpacity 
          style={[styles.loginBtn, { backgroundColor: colors.accent }]} 
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.loginBtnText}>SIGN IN</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.registerBtn, { borderColor: colors.border }]} 
          onPress={() => router.push('/(auth)/register')}
        >
          <Text style={[styles.registerBtnText, { color: colors.text }]}>CREATE ACCOUNT</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={[styles.header, { backgroundColor: colors.bgSecondary, borderBottomColor: colors.border }]}>
        <View style={[styles.avatarContainer, { backgroundColor: colors.accent }]}>
          <Text style={styles.avatarText}>{user?.username?.[0]?.toUpperCase()}</Text>
        </View>
        <Text style={[styles.username, { color: colors.text }]}>{user?.username?.toUpperCase()}</Text>
        <Text style={[styles.email, { color: colors.textMuted }]}>{user?.email}</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsRow}>
         <View style={[styles.statCard, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}>
            <Text style={[styles.statValue, { color: colors.accent }]}>12</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>ORDERS</Text>
         </View>
         <View style={[styles.statCard, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}>
            <Text style={[styles.statValue, { color: colors.accentPurple }]}>5</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>WISHLIST</Text>
         </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menu}>
        <MenuItem 
          Icon={BoxIcon} 
          title="MY ORDERS" 
          onPress={() => Alert.alert('Orders', 'Feature coming soon')} 
          colors={colors}
        />
        <MenuItem 
          Icon={HeartIcon} 
          title="WISHLIST" 
          onPress={() => Alert.alert('Wishlist', 'Feature coming soon')} 
          colors={colors}
        />
        <MenuItem 
          Icon={StarIcon} 
          title="LOYALTY PROGRAM" 
          onPress={() => {}} 
          colors={colors}
        />
        
        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <TouchableOpacity style={styles.menuItem} onPress={toggleTheme}>
          <View style={[styles.menuIconContainer, { backgroundColor: colors.bgTertiary }]}>
            {isDarkMode ? <SunIcon size={20} color={colors.accent} /> : <MoonIcon size={20} color={colors.accent} />}
          </View>
          <Text style={[styles.menuTitle, { color: colors.text }]}>
            {isDarkMode ? 'LIGHT MODE' : 'DARK MODE'}
          </Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>
        
        <MenuItem 
          Icon={LogoutIcon} 
          title="LOGOUT" 
          onPress={handleLogout} 
          colors={colors}
          isDanger
        />
      </View>
      
      <View style={styles.footer}>
        <Text style={[styles.version, { color: colors.textMuted }]}>MERCH MARKET PREMIUM v1.1.0</Text>
      </View>
    </ScrollView>
  );
}

function MenuItem({ Icon, title, onPress, colors, isDanger = false }: any) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={[styles.menuIconContainer, { backgroundColor: colors.bgTertiary }]}>
        <Icon size={20} color={isDanger ? colors.error : colors.accent} />
      </View>
      <Text style={[styles.menuTitle, { color: isDanger ? colors.error : colors.text }]}>{title}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 40,
    paddingTop: 60,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    borderBottomWidth: 1,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#ff006e',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  avatarText: {
    color: '#fff',
    fontSize: 42,
    fontWeight: '950',
  },
  username: {
    fontSize: 24,
    fontWeight: '950',
    letterSpacing: -1,
  },
  email: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 6,
    opacity: 0.8,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginTop: -24,
    gap: 16,
  },
  statCard: {
    flex: 1,
    height: 100,
    borderRadius: 24,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '950',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 4,
  },
  menu: {
    padding: 24,
    marginTop: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 12,
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  menuTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    marginVertical: 12,
    opacity: 0.5,
  },
  footer: {
    padding: 40,
    alignItems: 'center',
  },
  version: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    opacity: 0.4,
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  authTitle: {
    fontSize: 28,
    fontWeight: '950',
    letterSpacing: -1,
    textAlign: 'center',
  },
  authSubtitle: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  loginBtn: {
    width: '100%',
    height: 64,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 48,
  },
  loginBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  registerBtn: {
    width: '100%',
    height: 64,
    borderRadius: 100,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  registerBtnText: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1,
  }
});
