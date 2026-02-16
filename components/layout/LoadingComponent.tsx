import { useEffect } from "react";
import { View, StyleSheet, ImageBackground, ActivityIndicator } from "react-native";
import { Text } from "@/components/ui/Text";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/theme";

interface LoadingComponentProps {
  title?: string;
  subtitle?: string;
  redirectTo?: string;
  duration?: number;
  onComplete?: () => void;
}

export default function LoadingComponent({
  title = "Chargement en cours",
  subtitle = "Veuillez patienter...",
  redirectTo,
  duration = 2500,
  onComplete,
}: LoadingComponentProps) {
  const router = useRouter();

  useEffect(() => {
    // Navigation ou callback après le délai
    const timer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      } else if (redirectTo) {
        router.replace(redirectTo as any);
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [redirectTo, duration, onComplete]);

  return (
    <ImageBackground
      source={require("@/assets/images/background/loader.png")}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Logo animé */}
      <View style={styles.logoContainer}>
        <ActivityIndicator size="large" color={Colors.light.accent.base} />
      </View>

      {/* Texte personnalisable */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>


    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    display: 'none',
  },
  logoContainer: {
    marginBottom: 40,
    zIndex: 10,
  },

  textContainer: {
    alignItems: "center",
    marginBottom: 40,
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.primary.base,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.primary.base,
    opacity: 0.8,
    textAlign: "center",
  },
});