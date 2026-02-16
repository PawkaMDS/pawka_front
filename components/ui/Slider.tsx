import { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
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

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    } else {
      // Dernier slide, appeler onComplete
      onComplete?.();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
      setCurrentIndex(prevIndex);
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
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.slideContainer}>
            <View style={styles.slideContent}>
              <View style={styles.imagePlaceholder}>
                <Text style={styles.placeholderText}>📷</Text>
                <Text style={styles.placeholderSubtext}>Image à venir</Text>
              </View>
              <Text style={styles.slideTitle}>{item.title}</Text>
              <Text style={styles.slideDescription}>{item.description}</Text>
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
    backgroundColor: Colors.light.supportBase,
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
  imagePlaceholder: {
    width: "100%",
    height: 300,
    marginBottom: 40,
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
  slideTitle: {
    fontFamily: FontFamilies.display.bold,
    fontSize: 28,
    color: Colors.light.primary[800],
    textAlign: "center",
    marginBottom: 16,
  },
  slideDescription: {
    fontFamily: FontFamilies.text.regular,
    fontSize: FontSizes.bodyLarge,
    color: Colors.light.greyscale[70],
    textAlign: "center",
    lineHeight: 24,
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