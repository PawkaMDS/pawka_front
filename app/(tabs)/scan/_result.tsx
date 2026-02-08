import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Text } from "@/components/ui/Text";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getProductById } from "@/lib/api/products";
import { ProductDetails } from "@/components/ProductDetails";
import PageLayout from "@/components/layout/PageLayout";
import { Colors } from "@/constants/theme";
import type { DetailedProduct } from "@/types/product";

export default function ScanResult() {
  const params = useLocalSearchParams<{ productId: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<DetailedProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const id = params.productId ? Number(params.productId) : NaN;
      if (!id || Number.isNaN(id)) {
        if (mounted) {
          setError("Identifiant produit invalide");
          setLoading(false);
        }
        return;
      }

      try {
        const data = await getProductById(id);
        if (mounted) {
          if (data) setProduct(data);
          else setError("Produit introuvable");
        }
      } catch (err: any) {
        if (mounted) setError(err?.message || "Erreur lors du chargement");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [params.productId]);

  if (loading) {
    return (
      <PageLayout>
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <View style={styles.center}>
          <Text>{error}</Text>
        </View>
      </PageLayout>
    );
  }

  if (!product) {
    return (
      <PageLayout>
        <View style={styles.center}>
          <Text>Produit introuvable</Text>
        </View>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={Colors.light.greyscale[90]} />
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        <ProductDetails product={product} />
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  contentContainer: { flex: 1 },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 8,
    padding: 4,
  },
});
