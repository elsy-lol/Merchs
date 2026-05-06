import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function CreatorCard({ creator }) {
  const router = useRouter();
  const logoUrl = creator.logo || 'https://via.placeholder.com/150?text=Logo';

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => router.push(`/creator/${creator.id}`)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: logoUrl }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{creator.name}</Text>
        {creator.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {creator.description}
          </Text>
        ) : null}
        <Text style={styles.actionText}>Смотреть мерч &rarr;</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#333',
  },
  content: {
    padding: 16,
  },
  name: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 12,
  },
  actionText: {
    color: '#ff006e',
    fontWeight: 'bold',
  },
});
