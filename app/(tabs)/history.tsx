import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from "@/components/ui/Text";
import { Heading } from '@/components/ui/Heading';
import { getSearchHistory, SearchHistoryItem } from '@/lib/api/searchHistory';
import { useRouter } from 'expo-router';
import PageLayout from '@/components/layout/PageLayout';
import { Colors } from '@/constants/theme';
import { ScoreCard } from "@/components/ui/ScoreCard";
import { getOverallScore } from "@/utils/score";

export default function History() {
  const [items, setItems] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const formatScanDate = (value?: string | number | null) => {
    if (!value) return null;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return null;

    return d.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

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
      <Heading as="h3" style={styles.heading}>Mon historique</Heading>

      {error ? (
        <Text style={{ marginTop: 16 }}>{error}</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item, index) =>
            String(item.id ?? item.product?.id ?? item.product?.code_ean ?? index)
          }
          contentContainerStyle={{ paddingTop: 16 }}
          renderItem={({ item, index }) => {
            const product = item.product;
            const productId = product?.id ?? item.product_id;
            const isLast = index === items.length - 1;
            // const productFood = product?.product_foods?.[0];
            const overall = getOverallScore(product);

            return (
              <TouchableOpacity style={[styles.item, !isLast && styles.itemWithDivider]}
                onPress={() => {
                  if (!productId) return;
                  router.push(`/(tabs)/product/${productId}`);
                }}>
                <View style={styles.col}>
                  {product?.image_url ? (
                    <Image source={{ uri: product.image_url }} style={styles.thumb} />
                  ) : (
                    <View style={styles.thumbPlaceholder} />
                  )}
                </View>

                <View style={styles.col}>
                  <Heading as="h5" numberOfLines={2} style={styles.title}>
                    {product?.name ?? "Produit inconnu"}
                  </Heading>
                  <View style={styles.col}>
                    {product?.brand && <Text style={styles.brand} numberOfLines={1}>{product.brand}</Text>}

                    <View >
                      {overall !== null ? (
                        <ScoreCard score={overall} variant="mini" />
                      ) : (
                        <Text>Score non disponible</Text>
                      )}
                    </View>
                  </View>

                  {(() => {
                    const scanDate =
                      formatScanDate((item as any).createdAt) ??
                      formatScanDate((item as any).created_at) ??
                      formatScanDate((item as any).scannedAt) ??
                      formatScanDate((item as any).scanned_at);

                    return scanDate ? (
                      <Text style={styles.scanDate} numberOfLines={1}>
                        Scanné le {scanDate}
                      </Text>
                    ) : null;
                  })()}
                </View>
              </TouchableOpacity>

            );
          }}
        />
      )}
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  heading: {
    marginTop: 32,
    color: Colors.light.primary.base,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  item: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 24,
    alignItems: "flex-start",
  },

  itemWithDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.accent.base,
  },

  col: {
    flex: 1,
  },

  thumb: {
    width: "90%",
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: Colors.light.greyscale[20],
  },

  thumbPlaceholder: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: Colors.light.greyscale[20],
  },

  meta: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    // tu peux ajuster si ton Heading h5 est trop grand/petit
    color: Colors.light.greyscale[90],
  },

  brand: {
    marginTop: 2,
    color: Colors.light.greyscale[60],
    marginBottom: 16,
  },

  scanDate: {
    marginTop: 6,
    color: Colors.light.greyscale[50],
    fontSize: 12,
  },
});
