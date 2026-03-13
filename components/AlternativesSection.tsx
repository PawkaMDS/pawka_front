import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { Text } from "@/components/ui/Text";
import { AlternativeCard } from "@/components/AlternativeCard";
import { getAlternatives } from "@/lib/api/products";
import type { Alternative } from "@/types/product";
import { Colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { Heading } from "./ui/Heading";

interface AlternativesSectionProps {
  productId: number;
}

export function AlternativesSection({ productId }: AlternativesSectionProps) {
  const router = useRouter();
  const [alternatives, setAlternatives] = useState<Alternative[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlternatives = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAlternatives(productId);
        setAlternatives(data);
      } catch (err) {
        // Ne pas afficher d'erreur si le produit n'est pas analysé (400)
        const errorMessage = err instanceof Error ? err.message : "";
        // Ignorer silencieusement les erreurs 400 (produit non analysé)
        if (!errorMessage.includes("encore été analysé") && !errorMessage.includes("400")) {
          console.error("Erreur lors du chargement des alternatives:", err);
          setError(errorMessage || "Erreur inconnue");
        }
        // Sinon, on masque simplement la section (pas d'alternatives)
        setAlternatives([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlternatives();
  }, [productId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary.base} />
      </View>
    );
  }

  if (error) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Heading style={styles.title} as="h4">
        Alternatives plus saines
      </Heading>
      {alternatives.length === 0 ? (
        <Text style={styles.noAlternativesText}>Aucune alternative disponible pour ce produit</Text>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {alternatives.map((alternative) => (
            <AlternativeCard
              key={alternative.id}
              alternative={alternative}
              onPress={() => router.push(`/(tabs)/product/${alternative.id}`)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingHorizontal: 0,
  },
  title: {
    color: Colors.light.primary.base,
    marginBottom: 12,
  },
  scrollContent: {
  },
  loadingContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  noAlternativesText: {
    fontSize: 14,
    color: Colors.light.greyscale[60],
    fontStyle: "italic",
    paddingVertical: 12,
  },
});
