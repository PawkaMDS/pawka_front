import { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Image,
  ViewabilityConfig,
  ViewToken,
} from "react-native";
import { Text } from "@/components/ui/Text";
import { Colors } from "@/constants/theme";
import { FontFamilies, FontSizes } from "@/constants/typography";


const { width } = Dimensions.get("window");

export interface SlideData {
  id: string;
  image?: any;
  title: string;
  description: string;
}

interface SliderProps {
  slides: SlideData[];
  onComplete?: () => void;
}

export default function Slider({ slides, onComplete }: SliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  const viewabilityConfig: ViewabilityConfig = {
    viewAreaCoveragePercentThreshold: 50,
  };

  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
  }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setCurrentIndex(viewableItems[0].index);
    }
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      setIsScrolling(true);
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      // Petit délai pour laisser l'animation se finir avant de refaire l'index
      setTimeout(() => setIsScrolling(false), 300);
    } else {
      // Dernier slide, appeler onComplete
      onComplete?.();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setIsScrolling(true);
      flatListRef.current?.scrollToIndex({
        index: prevIndex,
        animated: true,
      });
      setTimeout(() => setIsScrolling(false), 300);
    }
  };

  return (
    <View style={styles.container}>
      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        scrollEnabled={true}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.slideContainer}>
            <View style={styles.slideContent}>
              <View style={styles.imageContainer}>
                {item.image ? (
                  <Image
                    source={item.image}
                    style={styles.image}
                    resizeMode="contain"
                  />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Text style={styles.placeholderText}>📷</Text>
                    <Text style={styles.placeholderSubtext}>Image à venir</Text>
                  </View>
                )}
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </View>
            </View>
          </View>
        )}
      />

      {/* Navigation Dots */}
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navigation}>
        {/* Bouton Précédent */}
        {currentIndex > 0 && (
          <TouchableOpacity
            style={styles.navButton}
            onPress={handlePrevious}
            activeOpacity={0.8}
          >
            <Text style={styles.navButtonText}>← Précédent</Text>
          </TouchableOpacity>
        )}

        <View style={{ flex: 1 }} />

        {/* Bouton Suivant / Terminer */}
        <TouchableOpacity
          style={[styles.navButton, styles.navButtonPrimary]}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.navButtonTextPrimary}>
            {currentIndex === slides.length - 1 ? "Terminer" : "Suivant →"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.secondary.base,
  },
  slideContainer: {
    width,
  },
  slideContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  imageContainer: {
    width: "100%",
    height: 300,
    marginBottom: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    width: "100%",
    height: 300,
    backgroundColor: Colors.light.greyscale[20],
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.light.greyscale[30],
    borderStyle: "dashed",
  },
  placeholderText: {
    fontSize: 60,
    marginBottom: 12,
  },
  placeholderSubtext: {
    fontFamily: FontFamilies.text.regular,
    fontSize: FontSizes.bodyBase,
    color: Colors.light.greyscale[60],
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 12,
  },
  title: {
    fontFamily: FontFamilies.display.bold,
    fontSize: FontSizes.h3,
    color: Colors.light.primary.base,
    textAlign: "center",
  },
  description: {
    fontFamily: FontFamilies.text.regular,
    fontSize: FontSizes.bodyBase,
    color: Colors.light.greyscale[70],
    textAlign: "center",
  },

  /* PAGINATION */
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 20,
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

  /* NAVIGATION */
  navigation: {
    flexDirection: "row",
    paddingHorizontal: 32,
    paddingBottom: 40,
    gap: 16,
  },
  navButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: Colors.light.greyscale[20],
  },
  navButtonPrimary: {
    backgroundColor: Colors.light.primary.base,
  },
  navButtonText: {
    fontFamily: FontFamilies.text.medium,
    fontSize: 16,
    color: Colors.light.greyscale[70],
  },
  navButtonTextPrimary: {
    fontFamily: FontFamilies.text.medium,
    fontSize: 16,
    color: Colors.light.supportBase,
  },
});