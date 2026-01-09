import { View, StyleSheet, Image } from "react-native";
import type { Product } from "@/types/product";
import { Text } from "@/components/ui/Text";

interface ProductScanResultProps {
  product: Product;
}

/**
 * Composant pour afficher les informations d'un produit scanné
 */
export function ProductScanResult({ product }: ProductScanResultProps) {
  return (
    <View style={styles.container}>
      {product.image_url && (
        <Image
          source={{ uri: product.image_url }}
          style={styles.image}
          resizeMode="contain"
        />
      )}

      <View style={styles.content}>
        <Text style={styles.name}>{product.name}</Text>

        {product.brand && (
          <Text style={styles.brand}>Marque: {product.brand}</Text>
        )}

        <Text style={styles.ean}>Code EAN: {product.code_ean}</Text>

        {product.is_verified && (
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>✓ Produit vérifié</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 200,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 16,
    gap: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  brand: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  ean: {
    fontSize: 14,
    color: "#888",
    fontFamily: "monospace",
  },
  verifiedBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  verifiedText: {
    color: "#4CAF50",
    fontSize: 12,
    fontWeight: "600",
  },
});
