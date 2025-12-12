import { View, Text, StyleSheet } from "react-native";

interface ScoreIndicatorProps {
  score: number; // Score sur 100
  size?: "small" | "medium" | "large";
}

/**
 * Composant pour afficher un score avec couleur et icône (style Yuka)
 *
 * Échelle de notation :
 * - 0-20 : Rouge foncé (Mauvais)
 * - 21-40 : Orange (Médiocre)
 * - 41-60 : Jaune (Moyen)
 * - 61-80 : Vert clair (Bon)
 * - 81-100 : Vert foncé (Excellent)
 */
export function ScoreIndicator({
  score,
  size = "medium",
}: ScoreIndicatorProps) {
  // Déterminer la couleur et le label selon le score
  const getScoreDetails = (value: number) => {
    if (value >= 81)
      return {
        color: "#2E7D32",
        bgColor: "#C8E6C9",
        label: "Excellent",
      };
    if (value >= 61)
      return {
        color: "#689F38",
        bgColor: "#DCEDC8",
        label: "Bon",
      };
    if (value >= 41)
      return {
        color: "#F9A825",
        bgColor: "#FFF9C4",
        label: "Moyen",
      };
    if (value >= 21)
      return {
        color: "#F57C00",
        bgColor: "#FFE0B2",
        label: "Médiocre",
      };
    return {
      color: "#D32F2F",
      bgColor: "#FFCDD2",
      label: "Mauvais",
    };
  };

  const { color, bgColor, label } = getScoreDetails(score);

  const sizes = {
    small: { container: 60, score: 24, label: 10, bar: 40 },
    medium: { container: 80, score: 32, label: 12, bar: 60 },
    large: { container: 100, score: 40, label: 14, bar: 80 },
  };

  const dimensions = sizes[size];

  return (
    <View style={styles.container}>
      {/* Cercle avec le score */}
      <View
        style={[
          styles.scoreCircle,
          {
            width: dimensions.container,
            height: dimensions.container,
            backgroundColor: bgColor,
            borderColor: color,
          },
        ]}
      >
        <Text style={[styles.scoreText, { fontSize: dimensions.score, color }]}>
          {Math.round(score)}
        </Text>
        <Text style={[styles.scoreMax, { fontSize: dimensions.label, color }]}>
          /100
        </Text>
      </View>

      {/* Label */}
      <View style={styles.labelContainer}>
        <Text style={[styles.label, { color }]}>{label}</Text>
      </View>

      {/* Barre de progression */}
      <View style={[styles.progressBar, { width: dimensions.bar }]}>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${score}%`,
                backgroundColor: color,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 12,
  },
  scoreCircle: {
    borderRadius: 1000,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scoreText: {
    fontWeight: "bold",
  },
  scoreMax: {
    fontWeight: "600",
    marginTop: -4,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
  },
  progressBar: {
    marginTop: 4,
  },
  progressTrack: {
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
});
