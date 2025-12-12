import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getProductById } from "@/lib/api/products";
import { ProductDetails } from "@/components/ProductDetails";
import type { DetailedProduct } from "@/types/product";

export default function ScanResult() {
  const params = useLocalSearchParams<{ productId: string; token: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<DetailedProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      if (!params.productId || !params.token) {
        setError("Paramètres manquants");
        setLoading(false);
        return;
      }

      try {
        const data = await getProductById(
          Number(params.productId),
          params.token
        );
        if (data) {
          setProduct(data);
        } else {
          setError("Produit non trouvé");
        }
      } catch (err) {
        console.error("Erreur lors du chargement du produit:", err);
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [params.productId, params.token]);

  const handleBack = () => {
    router.back();
  };

  const handleScanAgain = () => {
    router.push("/(tabs)/scan/scan");
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0A7EA4" />
        <Text style={styles.loadingText}>Chargement du produit...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={handleBack}>
          <Text style={styles.buttonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Produit introuvable</Text>
        <TouchableOpacity style={styles.button} onPress={handleScanAgain}>
          <Text style={styles.buttonText}>Scanner un autre produit</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Flèche de retour en haut à gauche */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <ProductDetails product={product} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#0A7EA4",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
});
