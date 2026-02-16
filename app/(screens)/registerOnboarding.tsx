import { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "@/components/ui/Text";
import { useRouter } from "expo-router";
import Slider from "@/components/ui/Slider";
import { Colors } from "@/constants/theme";
import { FontFamilies } from "@/constants/typography";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";

// Données des 4 slides
const SLIDES_DATA = [
  {
    id: "1",
    // image: require("@/assets/images/onboarding/slide1.png"), // À ajouter plus tard
    title: "Bienvenue sur Pawka",
    description:
      "Découvrez la meilleure façon de prendre soin de votre animal domestique",
  },
  {
    id: "2",
    // image: require("@/assets/images/onboarding/slide2.png"),
    title: "Scannez vos produits",
    description:
      "Analysez instantanément la composition et la qualité des produits pour vos animaux",
  },
  {
    id: "3",
    // image: require("@/assets/images/onboarding/slide3.png"),
    title: "Suivez la santé",
    description:
      "Gardez un œil sur le bien-être et la santé de votre compagnon",
  },
  {
    id: "4",
    // image: require("@/assets/images/onboarding/slide4.png"),
    title: "Rejoignez la communauté",
    description: "Partagez vos expériences avec d'autres propriétaires d'animaux",
  },
];

// Séquence de couleurs de la vidéo (en utilisant le thème)
const COLOR_SEQUENCE = [
  Colors.light.accent.base, // Vert
  Colors.light.secondary.base, // Jaune
  Colors.light.primary.base, // Marron - dernier = redirection
];

export default function RegisterOnboardingScreen() {
  const router = useRouter();
  const [showAnimation, setShowAnimation] = useState(false);
  const [currentColorIndex, setCurrentColorIndex] = useState(0);

  const scale = useSharedValue(1);

  useEffect(() => {
    if (showAnimation) {
      // Animation de zoom de la patte
      scale.value = withSequence(
        withTiming(1, { duration: 0 }),
        withTiming(50, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      );

      // Changement de couleur toutes les secondes
      const colorInterval = setInterval(() => {
        setCurrentColorIndex((prev) => {
          const nextIndex = prev + 1;
          if (nextIndex >= COLOR_SEQUENCE.length) {
            // Dernier changement de couleur (marron) = redirection
            clearInterval(colorInterval);
            setTimeout(() => {
              router.replace("/(tabs)/scan/scan");
            }, 1000); // Attendre 1 seconde sur la couleur marron avant de rediriger
            return prev;
          }
          return nextIndex;
        });
      }, 1000); // 1 seconde entre chaque couleur

      return () => clearInterval(colorInterval);
    }
  }, [showAnimation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleSliderComplete = () => {
    setShowAnimation(true);
  };

  if (showAnimation) {
    return (
      <View
        style={[
          styles.animationContainer,
          { backgroundColor: COLOR_SEQUENCE[currentColorIndex] },
        ]}
      >
        <Animated.View style={[styles.pawContainer, animatedStyle]}>
          <Text style={styles.pawEmoji}>🐾</Text>
        </Animated.View>
        <Text style={styles.brandName}>Pawka</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Slider slides={SLIDES_DATA} onComplete={handleSliderComplete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.supportBase,
  },

  /* ANIMATION */
  animationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pawContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  pawEmoji: {
    fontSize: 80,
  },
  brandName: {
    position: "absolute",
    fontFamily: FontFamilies.display.bold,
    fontSize: 48,
    color: Colors.light.supportBase,
    letterSpacing: 2,
  },
});