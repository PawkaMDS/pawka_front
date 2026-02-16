import { useEffect } from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import { Text } from "@/components/ui/Text";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";

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
  const scale = useSharedValue(0.8);
  const rotate = useSharedValue(0);

  useEffect(() => {
    // Animation de pulsation
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.8, { duration: 600, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Animation de rotation
    rotate.value = withRepeat(
      withTiming(360, { duration: 2000, easing: Easing.linear }),
      -1,
      false
    );

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

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
    };
  });

  return (
    <ImageBackground
      source={require("@/assets/images/background/loading")}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Overlay pour améliorer la lisibilité */}
      <View style={styles.overlay} />

      {/* Logo animé */}
      <Animated.View style={[styles.logoContainer, animatedStyle]}>
        <View style={styles.logoCircle}>
          <Text style={styles.logo}>🐾</Text>
        </View>
      </Animated.View>

      {/* Texte personnalisable */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {/* Points de chargement animés */}
      <View style={styles.dotsContainer}>
        <View style={[styles.dot, styles.dot1]} />
        <View style={[styles.dot, styles.dot2]} />
        <View style={[styles.dot, styles.dot3]} />
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 10, 15, 0.5)", 
  },
  logoContainer: {
    marginBottom: 40,
    zIndex: 10,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(108, 99, 255, 0.1)",
    borderWidth: 2,
    borderColor: "#6C63FF",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    fontSize: 60,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 40,
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.8,
    textAlign: "center",
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 8,
    zIndex: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#6C63FF",
  },
  dot1: {
    opacity: 0.3,
  },
  dot2: {
    opacity: 0.6,
  },
  dot3: {
    opacity: 1,
  },
});