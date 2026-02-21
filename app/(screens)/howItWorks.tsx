import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Text } from "@/components/ui/Text";
import { Heading } from "@/components/ui/Heading";
import { Colors } from "@/constants/theme";
import { FontFamilies } from "@/constants/typography";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import IsVerified from "@/assets/icons/is-verified.svg";
import IsVerifiedByIa from "@/assets/icons/is-verified-by-IA.svg";

const CRITERIA = [
  {
    name: "Teneur en protéines",
    percentage: "20%",
    description: "Conformément aux normes établies par l'AAFCO et la FEDIAF, il est essentiel que la composition nutritionnelle soit adaptée à l'espèce et au type de nourriture. Un desequilibre, qu'il soit trop faible ou excessif, constitue un critère défavorable qui peut impacter la sante et le bien-etre de l'animal.",
  },
  {
    name: "Teneur en lipides",
    percentage: "10%",
    description: "Nous procédons à une vérification approfondie du produit scanné afin de déterminer s'il présente un bon équilibre énergétique, en veillant à ce que son profil d'acides gras soit adéquat, c'est-a-dire ni excessivement gras ni trop maigre.",
  },
  {
    name: "Teneur en glucides",
    percentage: "10%",
    description: "Nous examinons si la teneur en glucides est faible à modérée, en veillant à ce qu'il n'y ait pas d'excès d'amidon ni de sucres ajoutés. Cette approche garantit une alimentation équilibrée et saine.",
  },
  {
    name: "Teneur en fibres",
    percentage: "5%",
    description: "L'application évalue si la quantité est adéquate, c'est-à-dire ni insuffisante ni excessive, ce qui constitue un indicateur fiable de la digestibilité.",
  },
  {
    name: "Type d'ingrédients",
    percentage: "15%",
    description: "Il est essentiel que les ingrédients soient clairement identifiés, peu transformés et qu'aucun terme générique ne soit utilisé. Cela garantit une transparence maximale et une meilleure compréhension des produits.",
  },
  {
    name: "Origine des protéines",
    percentage: "15%",
    description: "L'application évalue si les sources animales, telles que le poulet, le saumon et le bœuf, sont favorisées par rapport aux sources végétales ou aux sous-produits anonymes, qui sont pénalisés.",
  },
  {
    name: "Présence de sous-produits",
    percentage: "10%",
    description: "Des pénalités peuvent être appliquées si les termes \"sous-produits animaux\" ou \"céréales\" sont utilisés sans précision, en particulier lorsqu'ils figurent en tête de liste. Il est essentiel de fournir des détails clairs pour éviter toute ambiguité et garantir la conformité aux réglementations en vigueur.",
  },
  {
    name: "Additifs chimiques",
    percentage: "10%",
    description: "Nous examinons les conservateurs, les colorants et les exhausteurs de goût controversés, puis nous appliquons un malus en fonction de leur nombre et de leur nature.",
  },
  {
    name: "Additifs bénéfiques",
    percentage: "5%",
    description: "Nous offrons des bonus pour des éléments essentiels tels que les levures, les oméga-3, les prébiotiques et les minéraux chélatés. Ces composants jouent un role crucial dans la sante et le bien-être.",
  },
];



const QUALITY_SCALE = [
  {
    range: "0-19",
    label: "Critique",
    description: "Produit de très faibles Qualité. À éviter.",
    color: "#F7202DFF",
  },
  {
    range: "20-39",
    label: "Insuffisant",
    description: "Produit avec des manques. Non recommandé.",
    color: "#FB541CFF",
  },
  {
    range: "40-59",
    label: "Acceptable",
    description: "Produit présentant peu un usage occasionnel acceptable.",
    color: "#FB8B15FF",
  },
  {
    range: "60-79",
    label: "Satisfaisant",
    description: "Produit offrant une qualité moyenne, acceptable pour un usage régulier.",
    color: "#FDAE12FF",
  },
  {
    range: "80-94",
    label: "Bon",
    description: "Produit de bonne qualité avec, souvent, une formulation écologique.",
    color: "#A0D911FF",
  },
  {
    range: "95-100",
    label: "Excellent",
    description: "Produits d'une qualité optimale de nutrition et production.",
    color: "#54C41AFF",
  },
];

export default function HowItWorks() {
  const router = useRouter();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();

  const handleBack = () => {
    if (typeof returnTo === "string" && returnTo.length > 0) {
      router.replace(returnTo);
      return;
    }
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/(tabs)/scan/scan");
  };

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
        >
          <Ionicons name="arrow-back" size={20} color={Colors.light.primary.base} />
          <Text style={styles.backText}>Retour</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Yellow Section */}
        <View style={styles.yellowSection}>
          {/* Title */}
          <Heading as="h2" style={styles.mainTitle}>
            Comment ça marche ?
          </Heading>

          {/* Introduction */}
          <Text style={styles.introText}>
           Chaque produit est évalué selon un barème
rigoureux de 0 à 100, fondé sur des critères
nutritionnels et qualitatifs précis, chacun ayant
son propre poids. La note finale est ensuite
normalisée sur 100.  </Text>

          {/* Criteria Section */}
          <Heading as="h4" style={styles.sectionTitle}>
            Critères évalués
          </Heading>

          <View style={styles.criteriaList}>
            {CRITERIA.map((criterion, index) => (
              <View key={index} style={styles.criterionCard}>
                <View style={styles.criterionHeader}>
                  <Text style={styles.criterionName}>{criterion.name}</Text>
                  <View style={styles.percentageBadge}>
                    <Text style={styles.percentageText}>{criterion.percentage}</Text>
                  </View>
                </View>
                <Text style={styles.criterionDescription}>
                  {criterion.description}
                </Text>
              </View>
            ))}
          </View>

          {/* Quality Scale Section Title */}
          <Heading as="h4" style={styles.sectionTitle}>
            Échelle de qualité
          </Heading>
  


        {/* White Section */}
        <View style={styles.whiteSection}>
          <View style={styles.scaleList}>
            {QUALITY_SCALE.map((item, index) => (
              <View key={index} style={styles.scaleItem}>
                <View
                  style={[styles.colorIndicator, { backgroundColor: item.color }]}
                />
                <View style={styles.scaleContent}>
                  <View style={styles.scaleHeader}>
                    <Text style={styles.scaleRange}>{item.range}</Text>
                    <Text style={styles.scaleLabel}>{item.label}</Text>
                  </View>
                  <Text style={styles.scaleDescription}>{item.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

          {/* Labels Section */}
          <Heading as="h4" style={styles.sectionTitle}>
            Les labels utilisés par Pawka
          </Heading>

          <View style={styles.labelsSection}>
            <View style={styles.labelCard}>
              <View style={styles.labelIconContainer}>
                <IsVerified width={100} height={100} />
              </View>
              <Text style={styles.labelText}>
                <Text style={styles.labelBold}>Ce label indique un produit</Text>{" "}
                reconnu et été soigneusement analysé par notre intelligence artificielle et par notre équipe de professionnels vétérinaires qualité. Nous tenons à signaler que le contenu peut être soumis à nos contrôles et nos algorithmes. Le produit a reçu l'approbation d'experts.
              </Text>
            </View>

            <View style={styles.labelCard}>
              <View style={styles.labelIconContainer}>
                <IsVerifiedByIa width={100} height={100} />
              </View>
              <Text style={styles.labelText}>
                <Text style={styles.labelBold}>Ce label indique que l'emballage</Text>{" "}
                de notre nourriture respectueuse de bonne récoltés principalement, chez un producteur honnête ainsi que celui d'OpenPetFood (une base de données de produits permettant d'avoir la connaissance sur les produits alimentaire dans le but de permettre dans à l'utilisateur de mieux comprendre des enjeux qui impact l'environnement et la composition des du produit.
              </Text>
            </View>
          </View>
        </View>

        {/* Final Note Section */}
        <View style={styles.finalNoteSection}>
          <Heading as="h4" style={styles.finalNoteTitleStyle}>
            Note finale
          </Heading>



          <Text style={styles.finalNoteTextPrimary}>
            La note finale est une moyenne pondérée de tous nos critères. Elle reflète la qualité nutritionnelle et la qualité environnementale du produit.
          </Text>

          {/* Footer with Pawka logo */}
          <View style={styles.footer}>
            <Image
              source={require("@/assets/images/logoPawka.png")}
              style={styles.logoPawkaImage}
              resizeMode="contain"
            />
          </View>

          <Image
            source={require("@/assets/images/dog.png")}
            style={styles.dogImage}
            resizeMode="cover"
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.greyscale[0],
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: Colors.light.secondary.base,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  backText: {
    fontSize: 16,
    color: Colors.light.primary.base,
    fontFamily: FontFamilies.text.medium,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  yellowSection: {
    backgroundColor: Colors.light.secondary.base,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  whiteSection: {
    backgroundColor: Colors.light.greyscale[0],
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
    borderRadius: 16,
  },
  mainTitle: {
    color: Colors.light.primary.base,
    marginBottom: 16,
  },
  introText: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.light.greyscale[90],
    marginBottom: 32,
    fontFamily: FontFamilies.text.regular,
  },
  sectionTitle: {
    color: Colors.light.primary.base,
    marginBottom: 16,
    marginTop: 24,
  },
  criteriaList: {
    gap: 16,
  },
  criterionCard: {
    backgroundColor: Colors.light.greyscale[0],
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  criterionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  criterionName: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.greyscale[90],
    flex: 1,
    fontFamily: FontFamilies.text.bold,
  },
  percentageBadge: {
    backgroundColor: Colors.light.primary.base,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  percentageText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.light.greyscale[0],
    fontFamily: FontFamilies.text.bold,
  },
  criterionDescription: {
    fontSize: 13,
    lineHeight: 20,
    color: Colors.light.greyscale[70],
    fontFamily: FontFamilies.text.regular,
  },
  gradationContainer: {
    flexDirection: "row",
    marginBottom: 12,
    gap: 4,
    height: 40,
  },
  gradationBar: {
    borderRadius: 4,
  },
  gradationLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  gradationLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.light.greyscale[70],
    fontFamily: FontFamilies.text.medium,
  },
  scaleList: {
    gap: 12,
  },
  scaleItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  colorIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginTop: 2,
  },
  scaleContent: {
    flex: 1,
    gap: 4,
  },
  scaleHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  scaleRange: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.light.greyscale[90],
    fontFamily: FontFamilies.text.bold,
  },
  scaleLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.greyscale[90],
    fontFamily: FontFamilies.text.medium,
  },
  scaleDescription: {
    fontSize: 13,
    lineHeight: 20,
    color: Colors.light.greyscale[70],
    fontFamily: FontFamilies.text.regular,
  },
  labelsSection: {
    backgroundColor: Colors.light.greyscale[0],
    padding: 16,
    borderRadius: 16,
    gap: 16,
  },
  labelCard: {
    flexDirection: "row",
    gap: 12,
  },
  labelIconContainer: {
    paddingTop: 4,
  },
  labelImageContainer: {
    paddingTop: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  verifiedByIaImage: {
    width: 150,
    height: 60,
  },
  labelText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: Colors.light.greyscale[80],
    fontFamily: FontFamilies.text.regular,
  },
  labelBold: {
    fontWeight: "700",
    fontFamily: FontFamilies.text.bold,
  },
  finalNoteSection: {
    backgroundColor: Colors.light.primary.base,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
  },
  finalNoteTitleStyle: {
    color: Colors.light.greyscale[0],
    marginBottom: 16,
  },
  finalNoteTextPrimary: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.light.greyscale[0],
    marginBottom: 24,
    fontFamily: FontFamilies.text.regular,
  },
  dogImage: {
    width: "100%",
    height: 240,
    borderRadius: 12,
    marginBottom: 24,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 16,
    gap: 8,
  },
  logoPawkaImage: {
    width: 250,
    height:120,
  },
  footerLogo: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.light.greyscale[0],
    fontFamily: FontFamilies.text.bold,
  },
  footerTagline: {
    fontSize: 14,
    color: Colors.light.greyscale[0],
    fontFamily: FontFamilies.text.regular,
  },
});
