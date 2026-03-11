import { View, StyleSheet, Image } from "react-native";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/theme";
import { FontFamilies } from "@/constants/typography";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ArrowRightIcon from "@/assets/icons/arrow-right.svg";

const premiumLogoSource = { uri: Image.resolveAssetSource(require("@/assets/icons/premiumLogo.png")).uri };
const premiumIcon1Source = { uri: Image.resolveAssetSource(require("@/assets/icons/premiumIcon-1.png")).uri };
const premiumIcon2Source = { uri: Image.resolveAssetSource(require("@/assets/icons/premiumIcon-2.png")).uri };
const premiumIcon3Source = { uri: Image.resolveAssetSource(require("@/assets/icons/premiumIcon-3.png")).uri };
const premiumSubtitleIconSource = { uri: Image.resolveAssetSource(require("@/assets/icons/premiumSubtitleIcon.png")).uri };
const premiumIcon4Source = { uri: Image.resolveAssetSource(require("@/assets/icons/premiumIcon-4.png")).uri };
const BUTTON_ICON_SIZE = 22;

const formatTrialEndDate = () => {
  const trialEndDate = new Date();
  trialEndDate.setDate(trialEndDate.getDate() + 7);

  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(trialEndDate);
};

export default function PremiumConfirmedScreen() {
  const router = useRouter();
  const trialEndDateLabel = formatTrialEndDate();

  const handleStart = async () => {
    await AsyncStorage.removeItem("needsRegisterOnboarding");
    router.replace("/(tabs)/scan/scan");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.container}>
      {/* Crown Icon */}
      <View style={styles.iconContainer}>
        <Image source={premiumLogoSource} style={styles.premiumLogo} resizeMode="contain" />
      </View>

      {/* Title */}
      <Text style={styles.title}>Bienvenue dans Premium !</Text>
      
      {/* Subtitle */}
      <Text style={styles.subtitle}>Merci pour votre confiance</Text>
      
      {/* Decorative divider */}
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Image source={premiumSubtitleIconSource} style={styles.dividerIcon} resizeMode="contain" />
        <View style={styles.dividerLine} />
      </View>

      {/* Features Cards */}
      <View style={styles.features}>
        {/* Feature 1 */}
        <View style={styles.featureCard}>
          <View style={styles.featureIconCircle}>
            <Image source={premiumIcon1Source} style={styles.featureIcon} resizeMode="contain" />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Animaux illimités</Text>
            <Text style={styles.featureDescription}>
              Ajoutez tous vos compagnons et recevez des recommandations personnalisées pour chacun
            </Text>
          </View>
        </View>

        {/* Feature 2 */}
        <View style={styles.featureCard}>
          <View style={styles.featureIconCircle}>
            <Image source={premiumIcon3Source} style={styles.featureIcon} resizeMode="contain" />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Analyses détaillées</Text>
            <Text style={styles.featureDescription}>
              Accédez aux analyses complètes de nos experts vétérinaires et nutritionnistes
            </Text>
          </View>
        </View>

        {/* Feature 3 */}
        <View style={styles.featureCard}>
          <View style={styles.featureIconCircle}>
            <Image source={premiumIcon2Source} style={styles.featureIcon} resizeMode="contain" />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Recommandations personnalisées</Text>
            <Text style={styles.featureDescription}>
              Recevez des suggestions adaptées à l'âge, la race et la santé de vos animaux
            </Text>
          </View>
        </View>
      </View>

      {/* Trial Card */}
      <View style={styles.trialCard}>
        <View style={styles.trialIconCircle}>
          <Image source={premiumIcon4Source} style={styles.featureIcon} resizeMode="contain" />
        </View>
        <Text style={styles.trialTitle}>Offre de lancement</Text>
        <Text style={styles.trialDescription}>
            Profitez de 7 jours d'essai gratuit jusqu'au{"\n"}
            <Text style={styles.trialDate}>{trialEndDateLabel}</Text>
          </Text>
      </View>

      {/* Start Button */}
      <Button
        label="Commencer à utiliser Premium"
        variant="primary"
        onPress={handleStart}
        textColor={Colors.light.supportBase}
        backgroundColor={Colors.light.premiumPrimary}
        icon={<ArrowRightIcon width={BUTTON_ICON_SIZE} height={BUTTON_ICON_SIZE} fill={Colors.light.supportBase} />}
        iconPosition="right"
        fullWidth
        textStyle={styles.buttonText}
      />

      {/* Footer */}
      <Text style={styles.footer}>
        Vous pouvez annuler votre abonnement à tout moment depuis votre profil
      </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.premiumTertiary,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.light.premiumTertiary,
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "space-between",
  },

  /* ICON */
  iconContainer: {
    marginTop: 2,
    marginBottom: 4,
  },
  premiumLogo: {
    width: 140,
    height: 140,
  },

  /* TITLE */
  title: {
    fontFamily: FontFamilies.display.bold,
    fontSize: 28,
    color: Colors.light.premiumPrimary,
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: FontFamilies.text.regular,
    fontSize: 14,
    color: Colors.light.premiumPrimary,
    textAlign: "center",
    marginBottom: 6,
  },

  /* DIVIDER */
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    width: "100%",
    justifyContent: "center",
  },
  dividerLine: {
    height: 1,
    width: 52,
    backgroundColor: Colors.light.premiumPrimary,
    opacity: 0.3,
  },
  dividerIcon: {
    width: 20,
    height: 20,
    marginHorizontal: 10,
  },

  /* FEATURES */
  features: {
    width: "100%",
    gap: 8,
    marginBottom: 8,
  },
  featureCard: {
    backgroundColor: Colors.light.greyscale[0],
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    gap: 10,
    borderWidth: 2,
    borderColor: Colors.light.premiumPrimary,
    shadowColor: Colors.light.premiumPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.premiumPrimary,
    alignItems: "center",
    justifyContent: "center",
  },
  featureIcon: {
    width: 26,
    height: 26,
  },
  featureContent: {
    flex: 1,
    gap: 2,
  },
  featureTitle: {
    fontFamily: FontFamilies.display.bold,
    fontSize: 14,
    color: Colors.light.greyscale[90],
  },
  featureDescription: {
    fontFamily: FontFamilies.text.regular,
    fontSize: 12,
    color: Colors.light.greyscale[60],
    lineHeight: 16,
  },

  /* TRIAL CARD */
  trialCard: {
    width: "100%",
    backgroundColor: Colors.light.greyscale[0],
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    borderWidth: 2,
    borderColor: Colors.light.premiumPrimary,
    marginBottom: 8,
  },
  trialIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.premiumPrimary,
    alignItems: "center",
    justifyContent: "center",
  },
  trialIcon: {
    fontSize: 22,
  },
  trialContent: {
    flex: 1,
    gap: 2,
    justifyContent: "center",
  },
  trialTitle: {
    fontFamily: FontFamilies.display.bold,
    fontSize: 16,
    color: Colors.light.premiumPrimary,
    marginBottom: 6,
  },
  trialDescription: {
    fontFamily: FontFamilies.text.regular,
    fontSize: 13,
    color: Colors.light.greyscale[70],
    textAlign: "center",
    lineHeight: 18,
  },
  trialDate: {
    fontFamily: FontFamilies.display.bold,
    color: Colors.light.premiumPrimary,
  },
  buttonText: {
    fontFamily: FontFamilies.display.bold,
    fontSize: 16,
  },

  /* FOOTER */
  footer: {
    fontFamily: FontFamilies.text.regular,
    fontSize: 11,
    color: Colors.light.premiumPrimary,
    textAlign: "center",
    lineHeight: 14,
    opacity: 0.7,
  },
});