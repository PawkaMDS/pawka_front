import { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Text } from "@/components/ui/Text";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/theme";
import { FontFamilies } from "@/constants/typography";
import Switch from "@/components/ui/Switch";
import ArrowRightIcon from "@/assets/icons/arrow-right.svg";

type Period = "monthly" | "yearly" | "lifetime";

const logoSource = { uri: Image.resolveAssetSource(require("@/assets/images/logoPawkaBase.png")).uri };
const premiumCheckSource = { uri: Image.resolveAssetSource(require("@/assets/icons/IconPremium.png")).uri };
const premiumButtonSource = { uri: Image.resolveAssetSource(require("@/assets/icons/IconPremiumButton.png")).uri };
const freeCheckSource = { uri: Image.resolveAssetSource(require("@/assets/icons/IconFreeModel.png")).uri };

export default function SubscriptionScreen() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("monthly");

  const periodOptions = [
    { value: "monthly", label: "Mensuel" },
    { value: "yearly", label: "Annuel" },
    { value: "lifetime", label: "Lifetime" },
  ];

  const premiumPrices = {
    monthly: { price: "3,99€", label: "/mois" },
    yearly: { price: "39,99€", label: "/an" },
    lifetime: { price: "99,99€", label: "" },
  };

  const handlePremium = () => {
    // TODO: Gérer l'achat premium
    router.replace("/(tabs)/scan/scan");
  };

  const handleFreeTrial = () => {
    // Rediriger directement vers l'app
    router.replace("/(tabs)/scan/scan");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Image
            source={logoSource}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>Choisissez votre formule</Text>
        <Text style={styles.subtitle}>
          Sélectionnez l'offre qui correspond à vos besoins
        </Text>
      </View>

      {/* Premium Card */}
      <View style={styles.premiumCard}>
        <Switch
          options={periodOptions}
          selectedValue={selectedPeriod}
          onValueChange={(value) => setSelectedPeriod(value as Period)}
          backgroundColor={Colors.light.greyscale[0]}
          activeColor={Colors.light.premiumPrimary}
          textColor={Colors.light.primary.base}
          activeTextColor={Colors.light.greyscale[0]}
        />

        <View style={styles.cardHeader}>
          <Text style={styles.premiumLabel}>Premium</Text>
          <View style={styles.priceRow}>
            <Text style={styles.premiumPrice}>{premiumPrices[selectedPeriod].price}</Text>
            <Text style={styles.premiumPriceLabel}>{premiumPrices[selectedPeriod].label}</Text>
          </View>
        </View>

        <View style={styles.features}>
          {[
            "Animaux illimités sur votre profil",
            "Scan illimité de produits",
            "Analyses détaillées par nos experts",
            "Recommandations personnalisées",
            "Historique illimité",
            "Support prioritaire",
          ].map((text, i) => (
            <View key={i} style={styles.feature}>
              <Image source={premiumCheckSource} style={styles.checkIcon} resizeMode="contain" />
              <Text style={styles.featureText}>{text}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.premiumButton} onPress={handlePremium}>
          <Text style={styles.premiumButtonText}>Passer premium</Text>
          <Image source={premiumButtonSource} style={styles.premiumButtonIcon} resizeMode="contain" />
        </TouchableOpacity>
      </View>

      {/* Free Card */}
      <View style={styles.freeCard}>
        <View style={styles.freeCardHeader}>
          <Text style={styles.freeLabel}>Gratuit</Text>
          <View style={styles.freeBadge}>
            <Text style={styles.freeBadgeText}>0€</Text>
          </View>
        </View>

        <View style={styles.features}>
          {[
            "1 animal sur votre profil",
            "Scan illimité de produits",
            "Analyses nutritionnelles basiques",
            "Historique de 30 jours",
          ].map((text, i) => (
            <View key={i} style={styles.feature}>
              <Image source={freeCheckSource} style={styles.checkIcon} resizeMode="contain" />
              <Text style={styles.featureText}>{text}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.freeButton} onPress={handleFreeTrial}>
          <Text style={styles.freeButtonText}>Je teste l'application d'abord !</Text>
          <ArrowRightIcon width={18} height={18} fill={Colors.light.greyscale[0]} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.secondary.base,
    paddingHorizontal: 16,
    paddingTop: 8,
    justifyContent: "flex-start",
  },

  /* HEADER */
  header: {
    alignItems: "center",
    marginBottom: 8,
  },
  logoRow: {
    marginTop: 30,
  
  },
  logo: {
    height: 62,
    width: 248,
    tintColor: Colors.light.primary.base,
  },
  title: {
    fontFamily: FontFamilies.display.bold,
    fontSize: 24,
    color: Colors.light.primary.base,
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: FontFamilies.text.regular,
    fontSize: 13,
    color: Colors.light.primary.base,
    textAlign: "center",
  },

  /* PREMIUM CARD */
  premiumCard: {
    backgroundColor: Colors.light.premiumTertiary,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: Colors.light.premiumPrimary,
    gap: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  premiumLabel: {
    fontFamily: FontFamilies.display.bold,
    fontSize: 24,
    color: Colors.light.premiumPrimary,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  premiumPrice: {
    fontFamily: FontFamilies.display.bold,
    fontSize: 28,
    color: Colors.light.premiumPrimary,
  },
  premiumPriceLabel: {
    fontFamily: FontFamilies.text.regular,
    fontSize: 15,
    color: Colors.light.premiumPrimary,
    marginLeft: 4,
  },
  features: {
    gap: 6,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkIcon: {
    width: 17,
    height: 17,
    marginRight: 8,
  },
  featureText: {
    fontFamily: FontFamilies.text.regular,
    fontSize: 13,
    color: Colors.light.greyscale[90],
    flex: 1,
    lineHeight: 19,
  },
  premiumButton: {
    backgroundColor: Colors.light.premiumPrimary,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  premiumButtonText: {
    fontFamily: FontFamilies.display.bold,
    fontSize: 16,
    color: Colors.light.greyscale[90],
  },
  premiumButtonIcon: {
    width: 24,
    height: 24,
  },

  /* FREE CARD */
  freeCard: {
    backgroundColor: Colors.light.greyscale[0],
    borderRadius: 16,
    padding: 14,
    borderWidth: 2,
    borderColor: Colors.light.primary.base,
    gap: 10,
  },
  freeCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  freeLabel: {
    fontFamily: FontFamilies.display.bold,
    fontSize: 24,
    color: Colors.light.primary.base,
  },
  freeBadge: {
    backgroundColor: Colors.light.secondary.base,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
  },
  freeBadgeText: {
    fontFamily: FontFamilies.display.bold,
    fontSize: 15,
    color: Colors.light.primary.base,
  },
  freeButton: {
    backgroundColor: Colors.light.accent.base,
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  freeButtonText: {
    fontFamily: FontFamilies.display.bold,
    fontSize: 14,
    color: Colors.light.greyscale[90],
  },
});