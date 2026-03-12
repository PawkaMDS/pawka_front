import React, { useMemo, useState, useRef, useEffect } from "react";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { useLocalSearchParams, usePathname, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
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
import { AlternativesSection } from "@/components/AlternativesSection";
import { AnimalSelector } from "@/components/product/AnimalSelector";
import IsVerified from "@/assets/icons/is-verified.svg";
import Paws from "@/assets/icons/paws.svg";
import DetailsIcon from "@/assets/icons/details.svg";
import CompositionIcon from "@/assets/icons/composition.svg";
import PawIcon from "@/assets/icons/paw2.svg";
import Comment from "@/assets/icons/comment.svg";

type ProductTabKey = "criteria" | "ingredients" | "animal" | "community";

interface ProductDetailsProps {
  product: DetailedProduct;
}

/**
 * Composant pour afficher tous les détails d'un produit avec accordéons
 */
export function ProductDetails({ product }: ProductDetailsProps) {
  const productFood = product.product_foods?.[0];
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRouter();
  const pathname = usePathname();
  const localParams = useLocalSearchParams();

  const [activeTab, setActiveTab] = useState<ProductTabKey>("criteria");

  useEffect(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
  }, [product.id]);

  const tabs = useMemo(
    () => [
      {
        key: "criteria" as const,
        label: "Détails",
        icon: (
          <DetailsIcon
            width={18}
            height={18}
            fill={
              activeTab === "criteria"
                ? Colors.light.primary.base
                : Colors.light.secondary.base
            }
          />
        ),
      },
      {
        key: "ingredients" as const,
        label: "Ingrédients",
        icon: (
          <CompositionIcon
            width={18}
            height={18}
            fill={
              activeTab === "ingredients"
                ? Colors.light.primary.base
                : Colors.light.secondary.base
            }
          />
        ),
      },
      {
        key: "animal" as const,
        label: "Mon animal",
        icon: (
          <PawIcon
            width={18}
            height={18}
            fill={
              activeTab === "animal"
                ? Colors.light.primary.base
                : Colors.light.secondary.base
            }
          />
        ),
      },
      {
        key: "community" as const,
        label: "Avis",
        icon: (
          <Comment
            width={18}
            height={18}
            fill={
              activeTab === "community"
                ? Colors.light.primary.base
                : Colors.light.secondary.base
            }
          />
        ),
      },
    ],
    [activeTab]
  );

  const returnTo = useMemo(() => {
    const entries = Object.entries(localParams).flatMap(([key, value]) => {
      if (value === undefined || value === null) return [];
      if (Array.isArray(value)) {
        return value.map((item) => [key, String(item)] as const);
      }
      return [[key, String(value)]] as const;
    });

    if (entries.length === 0) return pathname;

    const query = entries
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join("&");

    return `${pathname}?${query}`;
  }, [localParams, pathname]);

  // Liste d'ingrédients avec style séparateurs (fichier 1)
  const renderIngredientsList = (ingredients?: string | null) => {
    if (!ingredients) return <Text style={styles.noData}>Non disponible</Text>;

    const list = ingredients
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    return (
      <View style={styles.ingredientsList}>
        {list.map((ing, idx) => {
          const isLast = idx === list.length - 1;
          return (
            <View
              key={`${ing}-${idx}`}
              style={[styles.ingredientRow, isLast && styles.ingredientRowLast]}
            >
              <Text style={styles.ingredientText}>{ing}</Text>
            </View>
          );
        })}
      </View>
    );
  };

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
    <ScrollView ref={scrollViewRef} style={styles.container} showsVerticalScrollIndicator={false}>
      {/* En-tête */}
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
              {
                product.certification || 
                "Ce produit contient plusieurs ingrédients peu qualitatifs (sous-produits animaux, colorants, céréales en excès). Il peut convenir ponctuellement, mais n'est pas recommandé pour un usage quotidien, surtout chez les animaux sensibles ou stérilisés."
              }
            </Text>
            <IsVerified width={98} height={98} style={styles.verifiedBadge} />
            <Paws width={48} height={48} style={styles.paws} />
          </View>
        )}
      </View>

      <SegmentedTabs<ProductTabKey>
        items={tabs}
        activeKey={activeTab}
        onChange={setActiveTab}
        showLabel={false}
        style={styles.segmentedTabs}
      />

      {/* Fond coloré englobant tout le contenu des tabs (fichier 1) */}
      <View style={styles.tabContentContainer}>
        {activeTab === "criteria" && (
          <ScoreCriteriaAccordionList productFood={productFood} />
        )}

        {activeTab === "ingredients" && (
          <View>
            <View style={styles.tabsContentWrapper}>
              {/* Titre visible + liste avec séparateurs (fichier 1) */}
              <Heading as="h5" style={styles.tabsHeading}>
                Ingrédients
              </Heading>

              {renderIngredientsList(productFood?.ingredients)}

              <Accordion title="Composition analytique">
                {renderAnalyticalComposition(productFood?.analytical_composition)}
              </Accordion>

              <Accordion title="Caractéristiques">
                {renderCharacteristics(productFood)}
              </Accordion>

              <Accordion title="Additifs et conformité">
                {renderAdditives(productFood)}
              </Accordion>

              {(productFood?.analyzed_at || productFood?.sources || productFood?.score_version) && (
                <Accordion title="Informations complémentaires">
                  <View style={styles.infoContainer}>
                    {productFood.analyzed_at && (
                      <Text style={styles.infoText}>
                        Analysé le:{" "}
                        {new Date(productFood.analyzed_at).toLocaleDateString("fr-FR")}
                      </Text>
                    )}
                    {productFood.score_version && (
                      <Text style={styles.infoText}>
                        Version du score: {productFood.score_version}
                      </Text>
                    )}
                    {productFood.sources && (
                      <Text style={styles.infoText}>Sources: {productFood.sources}</Text>
                    )}
                  </View>
                </Accordion>
              )}
            </View>
          </View>
        )}

        {activeTab === "animal" && (
          <View style={styles.tabsContentWrapper}>
            <Heading as="h5" style={styles.tabsHeading}>
              Mon animal
            </Heading>
            <AnimalSelector />
          </View>
        )}

        {activeTab === "community" && (
          <View style={styles.tabsContentWrapper}>
            <Heading as="h5" style={styles.tabsHeading}>
              Bientôt disponible
            </Heading>
            <Text>
              Super que la communauté t'intéresse ! Elle sera disponible très prochainement. Reste à l'affût des actualités de Pawka pour ne rien manquer !
            </Text>
          </View>
        )}
      </View>

      {/* Toujours visible en bas, hors du fond coloré des tabs */}
      <AlternativesSection productId={product.id} />

      <View style={styles.optionsSection}>
        <Heading as="h5" style={styles.optionsTitle}>Options</Heading>

        <TouchableOpacity style={styles.optionItem}>
          <View style={styles.optionLeft}>
            <Ionicons name="trash-outline" size={20} color={Colors.light.greyscale[90]} />
            <Text style={styles.optionText}>Supprimer de l'historique</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.optionDivider} />

        <TouchableOpacity
          style={styles.optionItem}
          onPress={() =>
            router.push({
              pathname: "/(screens)/howItWorks",
              params: { returnTo },
            })
          }
        >
          <View style={styles.optionLeft}>
            <Text style={styles.optionText}>Méthode de notation</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.light.greyscale[90]} />
        </TouchableOpacity>

        <View style={styles.optionDivider} />

        <TouchableOpacity style={styles.optionItem}>
          <View style={styles.optionLeft}>
            <Text style={styles.optionText}>Un problème avec ce produit</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.light.greyscale[90]} />
        </TouchableOpacity>
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
    marginBottom: 18,
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
  segmented: {
    marginTop: 12,
    marginBottom: 16,
  },
  segmentedTabs: {
    marginTop: 12,
  },
  // Fond coloré englobant tout le contenu des tabs (fichier 1)
  tabContentContainer: {
    backgroundColor: Colors.light.secondary[100],
    marginTop: -24,
    paddingTop: 20,
    marginBottom: 30,
    borderRadius: 12,
    zIndex: 0,
  },
  tabsContentWrapper: {
    marginTop: 12,
    marginBottom: 12,
    backgroundColor: Colors.light.secondary[100],
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  tabsHeading: {
    color: Colors.light.primary.base,
  },
  // Liste d'ingrédients avec séparateurs (fichier 1)
  ingredientsList: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
  ingredientRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.greyscale[20],
  },
  ingredientRowLast: {
    borderBottomWidth: 0,
  },
  ingredientText: {
    fontSize: 14,
    color: Colors.light.greyscale[80],
    lineHeight: 20,
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
  optionsSection: {
    backgroundColor: Colors.light.secondary.base,
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    marginBottom: 24,
  },
  optionsTitle: {
    color: Colors.light.primary.base,
    marginBottom: 16,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optionText: {
    fontSize: 14,
    color: Colors.light.greyscale[90],
    fontWeight: "500",
  },
  optionDivider: {
    height: 1,
    backgroundColor: Colors.light.greyscale[30],
  },
});