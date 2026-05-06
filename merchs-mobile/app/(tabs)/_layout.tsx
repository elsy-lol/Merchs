// app/(tabs)/_layout.tsx

import { Tabs } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { UIProvider, useUI } from '../../src/context/UIContext';
import { useTheme } from '../../src/context/ThemeContext';
import { MenuIcon } from '../../src/components/Icons';
import Sidebar from '../../src/components/Sidebar';

function TabsHeaderLeft() {
  const { toggleSidebar } = useUI();
  const { colors } = useTheme();
  return (
    <TouchableOpacity onPress={toggleSidebar} style={{ marginLeft: 16 }}>
      <MenuIcon size={28} color={colors.text} />
    </TouchableOpacity>
  );
}

function TabsContent() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          display: 'none', 
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerLeft: () => <TabsHeaderLeft />,
        headerTitleStyle: {
          fontWeight: '900',
          textTransform: 'uppercase',
          letterSpacing: 1,
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="shop" options={{ title: 'Shop' }} />
      <Tabs.Screen name="cart" options={{ title: 'Cart' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      <Tabs.Screen name="catalog" options={{ title: 'Catalog', href: null }} />
    </Tabs>
  );
}

export default function TabsLayout() {
  return (
    <UIProvider>
      <Sidebar />
      <TabsContent />
    </UIProvider>
  );
}