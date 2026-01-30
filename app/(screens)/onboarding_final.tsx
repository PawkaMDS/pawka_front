import { useState, useRef, useEffect } from "react";
import LogoSvg from "@/assets/images/first-connection/logo.svg";
import ArrowRightIcon from "@/assets/icons/arrow-right.svg";
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Platform,
  StatusBar,
} from "react-native";
import { Text } from "@/components/ui/Text";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/theme";
import { Typography } from "@/constants/typographyPresets";
import { Button } from "@/components/ui/Button";
const { width, height } = Dimensions.get("window");

/* SAFE AREAS */
const SAFE_TOP = Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) : 44;
const SAFE_BOTTOM = Platform.OS === "ios" ? 24 : 16;

/* STORAGE */
const ONBOARDING_KEY = "hasSeenOnboarding";

/* TEXT */
const FIXED_TITLE = "Chaque animal est unique";
const FIXED_DESCRIPTION =
  "Fini le stress au rayon animalier, Pawka vous aide à trouver tous les meilleurs produits pour la santé de votre animal domestique.";

/* IMAGES */
const ONBOARDING_DATA = [
  { id: "1", image: require("@/assets/images/first-connection/image1.jpg") },
  { id: "2", image: require("@/assets/images/first-connection/image2.jpg") },
  { id: "3", image: require("@/assets/images/first-connection/image3.jpg") },
  { id: "4", image: require("@/assets/images/first-connection/image4.jpg") },
  { id: "5", image: require("@/assets/images/first-connection/image5.jpg") },
  { id: "6", image: require("@/assets/images/first-connection/image6.jpg") },
  { id: "7", image: require("@/assets/images/first-connection/image7.jpg") },
  { id: "8", image: require("@/assets/images/first-connection/image8.jpg") },
  { id: "9", image: require("@/assets/images/first-connection/image9.jpg") },
  { id: "10", image: require("@/assets/images/first-connection/image10.jpg") },
  { id: "11", image: require("@/assets/images/first-connection/image11.jpg") },
  { id: "12", image: require("@/assets/images/first-connection/image12.jpg") },
  { id: "13", image: require("@/assets/images/first-connection/image13.jpg") },
  { id: "14", image: require("@/assets/images/first-connection/image14.jpg") },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  /* AUTO SCROLL */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = (prev + 1) % ONBOARDING_DATA.length;
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleStart = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, "true");
      router.replace("/(screens)/loading");
    } catch {
      router.replace("/(screens)/loading");
    }
  };

  return (
    <View style={styles.container}>
      {/* LOGO */}
      <View style={styles.logoContainer}>
        {/* Icône de patte stylisée comme sur l'image */}
      <View style={styles.logoContainer}>
        <LogoSvg width={120} height={120} />
      </View>
      </View>

      {/* BACKGROUND SLIDER */}
      <FlatList
        ref={flatListRef}
        data={ONBOARDING_DATA}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image
              source={item.image}
              style={styles.image}
              resizeMode="cover"
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.6)"]}
              style={styles.gradient}
            />
          </View>
        )}
      />

      {/* BOTTOM PANEL AVEC ARC ET SHADOW */}
      <View style={styles.panelContainer}>
        {/* HALO ORANGER */}
        <LinearGradient
          colors={["transparent", "rgba(136,47,13,0.6)", "rgba(136,47,13,0.9)"]}
          style={styles.orangeGlow}
        />

        <View style={styles.arcBackground}>
          <View style={styles.pagination}>
            {ONBOARDING_DATA.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentIndex ? styles.dotActive : styles.dotInactive,
                ]}
              />
            ))}
          </View>

          <Text style={styles.panelTitle}>{FIXED_TITLE}</Text>
          <Text style={styles.panelDescription}>{FIXED_DESCRIPTION}</Text>
          
          <Button
          textColor={Colors.light.supportBase}
          label="Commencer maintenant"
          variant="primary"
          fullWidth
          icon={<ArrowRightIcon width={20} height={20} fill={Colors.light.supportBase} />}
          iconPosition="right"
          containerStyle={{ margin: 20 }} // ✅ mêmes marges que l'ancien bouton
          onPress={handleStart}
        />
        </View>
      </View>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  /* LOGO */
  logoContainer: {
    position: "absolute",
    top: SAFE_TOP + 40,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  iconCircle: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 5,
    marginBottom: 5,
  },
  logoText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.6,
  },

  /* SLIDES */
  slide: {
    width,
    height,
  },
  image: {
    width,
    height,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: height * 0.4,
  },

  /* PANEL & ARC */
  panelContainer: {
    position: "absolute",
    bottom: 0,
    width: width,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  orangeGlow: {
    position: "absolute",
    top: -120,
    width: width * 1.8,
    height: 250,
    opacity: 0.8,
  },
  arcBackground: {
    width: width * 1.8,
    backgroundColor: "#FAFAFA",
    borderTopLeftRadius: width * 0.9,
    borderTopRightRadius: width * 0.9,
    alignItems: "center",
    paddingHorizontal: width * 0.4, 
    paddingTop: 45,
    paddingBottom: SAFE_BOTTOM + 50,
  },

  /* TEXT */
  panelTitle: {
    ...Typography.h3,
    color: Colors.light.primary[800],
    textAlign: "center",
    marginTop: 10,
  },
  panelDescription: {
    ...Typography.body,
    color: Colors.light.greyscale[70],
    textAlign: "center",
    marginTop: 10,
    marginHorizontal: 32,
  },

  /* PAGINATION */
  pagination: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: Colors.light.primary.base,
    width: 24,
  },
  dotInactive: {
 backgroundColor: Colors.light.greyscale[30],
 
  },

});