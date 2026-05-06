// src/components/Icons.tsx

import React from 'react';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

interface IconProps {
  size?: number;
  color?: string;
}

export const LogoIcon = ({ size = 24, color }: IconProps) => (
  <MaterialCommunityIcons name="flash-outline" size={size} color={color} />
);

export const HomeIcon = ({ size = 24, color }: IconProps) => (
  <Ionicons name="home-outline" size={size} color={color} />
);

export const ShopIcon = ({ size = 24, color }: IconProps) => (
  <Ionicons name="shirt-outline" size={size} color={color} />
);

export const InfoIcon = ({ size = 24, color }: IconProps) => (
  <Ionicons name="information-circle-outline" size={size} color={color} />
);

export const UserIcon = ({ size = 24, color }: IconProps) => (
  <Ionicons name="person-outline" size={size} color={color} />
);

export const HeartIcon = ({ size = 24, color }: IconProps) => (
  <Ionicons name="heart-outline" size={size} color={color} />
);

export const HeartFilledIcon = ({ size = 24, color }: IconProps) => (
  <Ionicons name="heart" size={size} color={color} />
);

export const CartIcon = ({ size = 24, color }: IconProps) => (
  <Ionicons name="cart-outline" size={size} color={color} />
);

export const TrashIcon = ({ size = 24, color }: IconProps) => (
  <Ionicons name="trash-outline" size={size} color={color} />
);

export const RecycleIcon = ({ size = 24, color }: IconProps) => (
  <MaterialCommunityIcons name="recycle" size={size} color={color} />
);

export const OfficialIcon = ({ size = 24, color }: IconProps) => (
  <MaterialCommunityIcons name="check-decagram" size={size} color={color} />
);

export const StoreIcon = ({ size = 24, color }: IconProps) => (
  <MaterialCommunityIcons name="storefront-outline" size={size} color={color} />
);

export const BoxIcon = ({ size = 24, color }: IconProps) => (
  <Ionicons name="cube-outline" size={size} color={color} />
);

export const StarIcon = ({ size = 24, color }: IconProps) => (
  <Ionicons name="star" size={size} color={color} />
);

export const SunIcon = ({ size = 24, color }: IconProps) => (
  <Ionicons name="sunny-outline" size={size} color={color} />
);

export const MoonIcon = ({ size = 24, color }: IconProps) => (
  <Ionicons name="moon-outline" size={size} color={color} />
);

export const LogoutIcon = ({ size = 24, color }: IconProps) => (
  <Ionicons name="log-out-outline" size={size} color={color} />
);

export const MenuIcon = ({ size = 24, color }: IconProps) => (
  <Ionicons name="menu-outline" size={size} color={color} />
);
