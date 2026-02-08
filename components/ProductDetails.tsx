import { View, StyleSheet, ScrollView, Image } from "react-native";
import { Text } from "@/components/ui/Text";
import { Accordion } from "@/components/Accordion";
import type {
  DetailedProduct,
  ProductFood,
  AnalyticalComposition,
} from "@/types/product";
import { Heading } from "./ui/Heading";
import { Colors } from "@/constants/theme";
import { ScoreCard } from "@/components/ui/ScoreCard";
import { getOverallScore } from "@/utils/score";
import { ScoreCriteriaAccordionList } from "@/components/ui/ScoreCriteriaAccordionList";
import IsVerified from "@/assets/icons/is-verified.svg";
import Paws from "@/assets/icons/paws.svg";

interface ProductDetailsProps {
  product: DetailedProduct;
}

/**
 * Composant pour afficher tous les détails d'un produit avec accordéons
 */
export function ProductDetails({ product }: ProductDetailsProps) {
  const productFood = product.product_foods?.[0]; // On prend le premier ProductFood

  // Fonction pour formater les ingrédients
  const formatIngredients = (ingredients?: string | null) => {
    if (!ingredients) return "Non disponible";
    return ingredients.split(",").map((ing, index) => (
      <Text key={index} style={styles.ingredient}>
        • {ing.trim()}
      </Text>
    ));
  };

  // Fonction pour afficher la composition analytique
  const renderAnalyticalComposition = (
    composition?: AnalyticalComposition | null
  ) => {
    if (!composition) return <Text style={styles.noData}>Non disponible</Text>;

    return (
      <View style={styles.compositionGrid}>
        {Object.entries(composition).map(([key, value]) => (
          <View key={key} style={styles.compositionItem}>
            <Text style={styles.compositionLabel}>{formatLabel(key)}</Text>
            <Text style={styles.compositionValue}>{value}%</Text>
          </View>
        ))}
      </View>
    );
  };

  // Fonction pour formater les labels
  const formatLabel = (key: string): string => {
    const labels: Record<string, string> = {
      proteins: "Protéines",
      fats: "Matières grasses",
      fibers: "Fibres",
      ash: "Cendres",
      calcium: "Calcium",
      phosphorus: "Phosphore",
    };
    return labels[key] || key;
  };

  // Fonction pour afficher les caractéristiques
  const renderCharacteristics = (pf?: ProductFood) => {
    if (!pf) return <Text style={styles.noData}>Non disponible</Text>;

    return (
      <View style={styles.characteristicsContainer}>
        {pf.life_stage && (
          <View style={styles.characteristicRow}>
            <Text style={styles.characteristicLabel}>Âge:</Text>
            <Text style={styles.characteristicValue}>
              {formatLifeStage(pf.life_stage)}
            </Text>
          </View>
        )}

        {pf.breed_size && (
          <View style={styles.characteristicRow}>
            <Text style={styles.characteristicLabel}>Taille:</Text>
            <Text style={styles.characteristicValue}>
              {formatBreedSize(pf.breed_size)}
            </Text>
          </View>
        )}

        {pf.is_for_sterilised !== undefined && (
          <View style={styles.characteristicRow}>
            <Text style={styles.characteristicLabel}>Stérilisé:</Text>
            <Text style={styles.characteristicValue}>
              {pf.is_for_sterilised ? "Oui" : "Non"}
            </Text>
          </View>
        )}

        {pf.moisture_percent !== null && pf.moisture_percent !== undefined && (
          <View style={styles.characteristicRow}>
            <Text style={styles.characteristicLabel}>Humidité:</Text>
            <Text style={styles.characteristicValue}>
              {pf.moisture_percent}%
            </Text>
          </View>
        )}

        {pf.animal_type && (
          <View style={styles.characteristicRow}>
            <Text style={styles.characteristicLabel}>Animal:</Text>
            <Text style={styles.characteristicValue}>
              {pf.animal_type.name}
            </Text>
          </View>
        )}

        {pf.food_type && (
          <View style={styles.characteristicRow}>
            <Text style={styles.characteristicLabel}>Type:</Text>
            <Text style={styles.characteristicValue}>{pf.food_type.name}</Text>
          </View>
        )}
      </View>
    );
  };

  // Fonction pour afficher les additifs
  const renderAdditives = (pf?: ProductFood) => {
    if (!pf) return <Text style={styles.noData}>Non disponible</Text>;

    return (
      <View style={styles.additivesContainer}>
        <View style={styles.additiveRow}>
          <Text style={styles.additiveLabel}>Additifs chimiques:</Text>
          <View
            style={[
              styles.additiveBadge,
              pf.has_chemical_additives
                ? styles.badgeNegative
                : styles.badgePositive,
            ]}
          >
            <Text style={styles.additiveBadgeText}>
              {pf.has_chemical_additives ? "Présents" : "Absents"}
            </Text>
          </View>
        </View>

        <View style={styles.additiveRow}>
          <Text style={styles.additiveLabel}>Additifs bénéfiques:</Text>
          <View
            style={[
              styles.additiveBadge,
              pf.has_beneficial_additives
                ? styles.badgePositive
                : styles.badgeNeutral,
            ]}
          >
            <Text style={styles.additiveBadgeText}>
              {pf.has_beneficial_additives ? "Présents" : "Absents"}
            </Text>
          </View>
        </View>

        {pf.fediaf_conformity !== undefined && (
          <View style={styles.additiveRow}>
            <Text style={styles.additiveLabel}>Conforme FEDIAF:</Text>
            <View
              style={[
                styles.additiveBadge,
                pf.fediaf_conformity
                  ? styles.badgePositive
                  : styles.badgeNegative,
              ]}
            >
              <Text style={styles.additiveBadgeText}>
                {pf.fediaf_conformity ? "Oui" : "Non"}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  // Helpers pour formater les énumérations
  const formatLifeStage = (stage: string): string => {
    const stages: Record<string, string> = {
      puppy: "Chiot",
      adult: "Adulte",
      senior: "Senior",
      kitten: "Chaton",
    };
    return stages[stage] || stage;
  };

  const formatBreedSize = (size: string): string => {
    const sizes: Record<string, string> = {
      toy: "Très petit",
      small: "Petit",
      medium: "Moyen",
      large: "Grand",
      giant: "Géant",
    };
    return sizes[size] || size;
  };

  const overall = getOverallScore(product);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* En-tête avec image et infos de base */}
      <View style={styles.header}>
        <Heading as="h4" style={styles.title}>
          {product.name}
        </Heading>
        <View style={styles.twoCols}>
          <View style={styles.col}>
            {product.brand && (
              <Text style={styles.productBrand}>{product.brand}</Text>
            )}
            {overall !== null ? (
              <ScoreCard score={overall} variant="large" />
            ) : (
              <Text style={styles.noData}>Score non disponible</Text>
            )}
          </View>

          <View style={styles.col}>
            {!!product.image_url && (
              <Image
                source={{ uri: product.image_url }}
                style={styles.squareImage}
                resizeMode="cover"
              />
            )}
          </View>
        </View>

        {product.is_verified && (
          <View style={styles.headerVerified}>
            <Heading as="h5">
              Ce que disent nos experts
            </Heading>
            <Text>
              Ce produit contient plusieurs ingrédients peu qualitatifs (sous-produits animaux, colorants, céréales en excès). Il peut convenir ponctuellement, mais n’est pas recommandé pour un usage quotidien, surtout chez les animaux sensibles ou stérilisés.
            </Text>
            <IsVerified width={98} height={98} style={styles.verifiedBadge} />
            <Paws width={48} height={48} style={styles.paws} />
          </View>
        )}
      </View>


      <ScoreCriteriaAccordionList productFood={productFood} />

      {/* Accordéons */}
      <View style={styles.accordionsContainer}>
        {/* Ingrédients */}
        <Accordion title="Ingrédients" defaultExpanded={true}>
          <View style={styles.ingredientsContainer}>
            {formatIngredients(productFood?.ingredients)}
          </View>
        </Accordion>

        {/* Composition analytique */}
        <Accordion title="Composition analytique">
          {renderAnalyticalComposition(productFood?.analytical_composition)}
        </Accordion>

        {/* Caractéristiques */}
        <Accordion title="Caractéristiques">
          {renderCharacteristics(productFood)}
        </Accordion>

        {/* Additifs et conformité */}
        <Accordion title="Additifs et conformité">
          {renderAdditives(productFood)}
        </Accordion>

        {/* Scores détaillés */}
        {productFood?.scores && Object.keys(productFood.scores).length > 1 && (
          <Accordion title="Scores détaillés">
            <View style={styles.detailedScoresContainer}>
              {productFood.scores.nutritional_quality !== undefined && (
                <View style={styles.scoreRow}>
                  <Text style={styles.scoreLabel}>Qualité nutritionnelle</Text>
                  <Text style={styles.scoreValue}>
                    {typeof productFood.scores.nutritional_quality === "object"
                      ? (productFood.scores.nutritional_quality as any).pt
                      : productFood.scores.nutritional_quality}
                    /100
                  </Text>
                </View>
              )}
              {productFood.scores.ingredient_quality !== undefined && (
                <View style={styles.scoreRow}>
                  <Text style={styles.scoreLabel}>Qualité des ingrédients</Text>
                  <Text style={styles.scoreValue}>
                    {typeof productFood.scores.ingredient_quality === "object"
                      ? (productFood.scores.ingredient_quality as any).pt
                      : productFood.scores.ingredient_quality}
                    /100
                  </Text>
                </View>
              )}
              {productFood.scores.processing_level !== undefined && (
                <View style={styles.scoreRow}>
                  <Text style={styles.scoreLabel}>
                    Niveau de transformation
                  </Text>
                  <Text style={styles.scoreValue}>
                    {typeof productFood.scores.processing_level === "object"
                      ? (productFood.scores.processing_level as any).pt
                      : productFood.scores.processing_level}
                    /100
                  </Text>
                </View>
              )}
              {productFood.scores.additives_score !== undefined && (
                <View style={styles.scoreRow}>
                  <Text style={styles.scoreLabel}>Score additifs</Text>
                  <Text style={styles.scoreValue}>
                    {typeof productFood.scores.additives_score === "object"
                      ? (productFood.scores.additives_score as any).pt
                      : productFood.scores.additives_score}
                    /100
                  </Text>
                </View>
              )}
            </View>
          </Accordion>
        )}

        {/* Informations complémentaires */}
        {(productFood?.analyzed_at ||
          productFood?.sources ||
          productFood?.score_version) && (
            <Accordion title="Informations complémentaires">
              <View style={styles.infoContainer}>
                {productFood.analyzed_at && (
                  <Text style={styles.infoText}>
                    Analysé le:{" "}
                    {new Date(productFood.analyzed_at).toLocaleDateString(
                      "fr-FR"
                    )}
                  </Text>
                )}
                {productFood.score_version && (
                  <Text style={styles.infoText}>
                    Version du score: {productFood.score_version}
                  </Text>
                )}
                {productFood.sources && (
                  <Text style={styles.infoText}>
                    Sources: {productFood.sources}
                  </Text>
                )}
              </View>
            </Accordion>
          )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: 4,
    marginBottom: 12,
    color: Colors.light.primary.base,
  },
  productBrand: {
    fontWeight: "500",
    marginBottom: 8,
  },
  twoCols: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  col: {
    flex: 1,
  },
  squareImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
  },
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 16,
    marginTop: 28,
  },
  headerVerified: {
    gap: 8,
    backgroundColor: Colors.light.secondary.base,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    position: "relative",
    overflow: "visible",
  },
  verifiedBadge: {
    position: "absolute",
    top: -42,
    right: -12,
    zIndex: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  paws: {
    position: "absolute",
    bottom: -15,
    left: -5,
    zIndex: 10,
  },
  verifiedText: {
    color: "#4CAF50",
    fontSize: 12,
    fontWeight: "600",
  },
  criteriaBox: {
    marginTop: 12,
    backgroundColor: Colors.light.greyscale[0],
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },

  criteriaList: {
    gap: 14,
  },

  criteriaRow: {
    gap: 8,
  },

  criteriaLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.greyscale[80],
  },

  scoreSection: {
    backgroundColor: "#fff",
    marginBottom: 16,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  accordionsContainer: {
    paddingTop: 0,
  },
  ingredientsContainer: {
    gap: 8,
  },
  ingredient: {
    fontSize: 14,
    color: "#333",
    lineHeight: 22,
  },
  noData: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
  },
  compositionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  compositionItem: {
    width: "48%",
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 8,
  },
  compositionLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  compositionValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  characteristicsContainer: {
    gap: 12,
  },
  characteristicRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  characteristicLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  characteristicValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  additivesContainer: {
    gap: 16,
  },
  additiveRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  additiveLabel: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  additiveBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgePositive: {
    backgroundColor: "#E8F5E9",
  },
  badgeNegative: {
    backgroundColor: "#FFEBEE",
  },
  badgeNeutral: {
    backgroundColor: "#F5F5F5",
  },
  additiveBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  detailedScoresContainer: {
    gap: 12,
  },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  scoreLabel: {
    fontSize: 14,
    color: "#666",
  },
  scoreValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  infoContainer: {
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});
