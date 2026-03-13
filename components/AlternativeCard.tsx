import React from "react";
import { View, StyleSheet, Image, Pressable } from "react-native";
import { Text } from "@/components/ui/Text";
import { Colors } from "@/constants/theme";
import { ScoreCard } from "@/components/ui/ScoreCard";
import type { Alternative } from "@/types/product";
import ArrowRight from "@/assets/icons/arrow-right.svg";

interface AlternativeCardProps {
  alternative: Alternative;
  onPress?: () => void;
}

export function AlternativeCard({ alternative, onPress }: AlternativeCardProps) {
  const scoreFormatted = Math.round(alternative.score_total);

  // Tronquer le nom si trop long
  const maxNameLength = 30;
  const displayName = alternative.name.length > maxNameLength
    ? alternative.name.substring(0, maxNameLength) + "..."
    : alternative.name;

  return (
    <Pressable style={styles.container} onPress={onPress}>
      {/* Score Badge */}
      <View style={styles.scoreBadge}>
        <ScoreCard score={scoreFormatted} variant="mini" />
      </View>

      {/* Product Image */}
      {alternative.image ? (
        <Image
          source={{ uri: alternative.image }}
          style={styles.image}
        />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Text style={styles.placeholderText}>Sans image</Text>
        </View>
      )}

      {/* Product Name with Arrow */}
      <View style={styles.nameRow}>
        <Text style={styles.productName} numberOfLines={2}>
          {displayName}
        </Text>
        <ArrowRight width={16} height={16} fill={Colors.light.primary.base} />
      </View>

      {/* Brand */}
      {alternative.brand && (
        <Text style={styles.brand} numberOfLines={1}>
          {alternative.brand}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 160,
    marginRight: 16,
  },
  scoreBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    zIndex: 10,
  },
  image: {
    width: "100%",
    height: 130,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#F5F5F5",
  },
  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 12,
    color: "#999",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 4,
    marginBottom: 4,
  },
  productName: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    lineHeight: 18,
  },
  brand: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
});
