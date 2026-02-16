import { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Image } from "react-native";
import { Text } from "@/components/ui/Text";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/theme";
import { FontFamilies } from "@/constants/typography";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Slider from "@/components/ui/Slider";

// Données des 4 slides
const SLIDES_DATA = [
  {
    id: "1",
    image: require("@/assets/images/onboarding/image1.png"),
    title: "Bienvenue sur Pawka",
    description:
      "Découvrez la meilleure façon de prendre soin de votre animal domestique",
  },
  {
    id: "2",
    image: require("@/assets/images/onboarding/image2.png"),
    title: "Scannez vos produits",
    description:
      "Analysez instantanément la composition et la qualité des produits pour vos animaux",
  },
  {
    id: "3",
    image: require("@/assets/images/onboarding/image3.png"),
    title: "Suivez la santé",
    description:
      "Gardez un œil sur le bien-être et la santé de votre compagnon",
  },
  {
    id: "4",
    image: require("@/assets/images/onboarding/image4.png"),
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
  const [showLogoAnimation, setShowLogoAnimation] = useState(false);
  const [showColorAnimation, setShowColorAnimation] = useState(false);
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  
  // Animation values
  const logoScale = useRef(new Animated.Value(1)).current;
  const logoTranslateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showLogoAnimation) {
      // Attendre 1 seconde avant de commencer l'animation
      setTimeout(() => {
        // Animation du logo qui monte et zoom sur le cousinet
        Animated.parallel([
          Animated.timing(logoScale, {
            toValue: 150, // Zoom encore plus énorme
            duration: 1800,
            useNativeDriver: true,
          }),
          Animated.timing(logoTranslateY, {
            toValue: -900, // Lève encore plus l'image pour avoir le cousinet au centre
            duration: 1800,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Une fois le zoom terminé, on passe à l'animation des couleurs
          setShowColorAnimation(true);
        });
      }, 1000); // Pause de 1 seconde avant le zoom
    }
  }, [showLogoAnimation]);

  useEffect(() => {
    if (showColorAnimation) {
      // Changement de couleur toutes les 500ms
      const colorInterval = setInterval(() => {
        setCurrentColorIndex((prev) => {
          const nextIndex = prev + 1;
          if (nextIndex >= COLOR_SEQUENCE.length) {
            // Dernier changement de couleur (marron) = redirection
            clearInterval(colorInterval);
            setTimeout(() => {
              AsyncStorage.removeItem("needsRegisterOnboarding");
              router.replace("/(tabs)/scan/scan");
            }, 1000); // Attendre 1 seconde sur la couleur marron avant de rediriger
            return prev;
          }
          return nextIndex;
        });
      }, 700); // 500ms entre chaque couleur

      return () => clearInterval(colorInterval);
    }
  }, [showColorAnimation]);

  const handleSliderComplete = () => {
    setShowLogoAnimation(true);
  };

  // Écran avec animation des couleurs
  if (showColorAnimation) {
    return (
      <View
        style={[
          styles.animationContainer,
          { backgroundColor: COLOR_SEQUENCE[currentColorIndex] },
        ]}
      >
        <View style={styles.pawContainer}>
        </View>
        <Text style={styles.brandName}>Pawka</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Slider slides={SLIDES_DATA} onComplete={handleSliderComplete} />
      
      {/* Logo qui apparaît et zoom par-dessus le slide 4 */}
      {showLogoAnimation && (
        <View style={styles.logoOverlay}>
          <Animated.View
            style={[
              styles.logoContainer,
              {
                transform: [
                  { translateY: logoTranslateY },
                  { scale: logoScale }
                ],
              },
            ]}
          >
            <Image
              source={require("@/assets/images/onboarding/Vector.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.supportBase,
  },

  /* LOGO OVERLAY SUR SLIDE 4 */
  logoOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 150,
    height: 150,
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
  brandName: {
    position: "absolute",
    fontFamily: FontFamilies.display.bold,
    fontSize: 48,
    color: Colors.light.supportBase,
    letterSpacing: 2,
  },
});