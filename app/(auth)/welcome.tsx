import { View, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Text } from "@/components/ui/Text";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "hasSeenOnboarding";

export default function WelcomeScreen() {
  const router = useRouter();

  const handleViewOnboarding = async () => {
    try {
      await AsyncStorage.removeItem(ONBOARDING_KEY);
      router.replace("/(screens)/onboarding");
    } catch (error) {
      console.error("Error resetting onboarding:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header avec logo/titre */}
      <View style={styles.header}>
        <Text style={styles.logo}>🐾</Text>
        <Text style={styles.title}>Pawka</Text>
        <Text style={styles.subtitle}>Scannez et découvrez vos produits</Text>
      </View>

      {/* Illustration ou espace pour une image */}
      <View style={styles.illustrationContainer}>
        <Text style={styles.illustration}>📱</Text>
        <Text style={styles.illustrationText}>
          Scannez des codes-barres pour obtenir des informations détaillées sur
          vos produits
        </Text>
      </View>

      {/* Boutons d'action */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push("/(auth)/login")}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Se connecter</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push("/(auth)/register")}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryButtonText}>Créer un compte</Text>
        </TouchableOpacity>

        {/* Option pour continuer sans compte (optionnel) */}
        {/* <TouchableOpacity
          style={styles.skipButton}
          onPress={() => router.push("/(tabs)")}
        >
          <Text style={styles.skipButtonText}>Continuer sans compte</Text>
        </TouchableOpacity> */}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
  },
  header: {
    marginTop: 80,
    alignItems: "center",
  },
  logo: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  illustration: {
    fontSize: 120,
    marginBottom: 20,
  },
  illustrationText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  buttonsContainer: {
    marginBottom: 40,
    gap: 16,
  },
  primaryButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 50,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  secondaryButtonText: {
    color: "#007AFF",
    fontSize: 18,
    fontWeight: "600",

  },
  skipButton: {
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  skipButtonText: {
    color: "#999",
    fontSize: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
    flexWrap: "wrap",
  },
  footerText: {
    fontSize: 12,
    color: "#999",
  },
  footerLink: {
    fontSize: 12,
    color: "#007AFF",
    textDecorationLine: "underline",
  },
});