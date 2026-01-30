import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from "@/components/ui/Text";
import { Heading } from '@/components/ui/Heading';
import { getSearchHistory, SearchHistoryItem } from '@/lib/api/searchHistory';
import { useRouter } from 'expo-router';
import PageLayout from '@/components/layout/PageLayout';

export default function History() {
  const [items, setItems] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getSearchHistory();
        if (mounted) setItems(data);
      } catch (err: any) {
        if (mounted) setError(err?.message || 'Erreur lors de la récupération');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <PageLayout>
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Heading as="h1">Historique</Heading>

      {error ? (
        <Text style={{ marginTop: 16 }}>{error}</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item, index) => String(item.id ?? item.product?.id ?? item.product?.code_ean ?? index)}
          contentContainerStyle={{ paddingTop: 16 }}
          renderItem={({ item }) => {
            const product = item.product;
            const productId = product?.id ?? item.product_id;
            return (
              <TouchableOpacity
                onPress={() => {
                  if (!productId) return;
                  // navigate to product page inside tabs
                  router.push(`/(tabs)/product/${productId}`);
                }}
                style={styles.row}
              >
                {product?.image_url ? (
                  <Image source={{ uri: product.image_url }} style={styles.image} />
                ) : (
                  <View style={styles.placeholder} />
                )}
                <Text style={styles.name}>{product?.name ?? 'Produit inconnu'}</Text>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  image: { width: 56, height: 56, borderRadius: 8, backgroundColor: '#eee' },
  placeholder: { width: 56, height: 56, borderRadius: 8, backgroundColor: '#eee' },
  name: { marginLeft: 12 },
});
