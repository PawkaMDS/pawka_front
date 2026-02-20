import { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Image,
  ViewabilityConfig,
  ViewToken,
} from "react-native";
import { Text } from "@/components/ui/Text";
import ArrowRightIcon from "@/assets/icons/arrow-right.svg";
import { Colors } from "@/constants/theme";
import { FontFamilies, FontSizes } from "@/constants/typography";


const { width } = Dimensions.get("window");

export interface SlideData {
  id: string;
  image?: any;
  title?: string;
  description?: string;
  descriptionStrong?: string;
}

interface SliderProps {
  slides: SlideData[];
  onComplete?: () => void;
}

export default function Slider({ slides, onComplete }: SliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

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
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }
  };

  const isLastSlide = currentIndex === slides.length - 1;
  const instructionText = isLastSlide
    ? "Commencer mon premier scan"
    : "Slider l'ecran pour continuer";

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
                <Text style={styles.description}>
                  {item.description?.trimEnd()}
                  {item.descriptionStrong ? (
                    <Text style={styles.descriptionStrong}>
                      {" "}
                      {item.descriptionStrong}
                    </Text>
                  ) : null}
                </Text>
              </View>
            </View>
          </View>
        )}
      />

      <View style={styles.guidanceContainer}>
        {isLastSlide ? (
          <TouchableOpacity
            onPress={onComplete}
            activeOpacity={0.8}
            accessibilityRole="button"
          >
            <Text style={styles.guidanceTextAction}>{instructionText}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.nextButtonRow}
            onPress={handleNext}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Aller au prochain slide"
          >
            <Text style={styles.guidanceText}>{instructionText}</Text>
            <ArrowRightIcon
              width={18}
              height={18}
              fill={Colors.light.primary.base}
            />
          </TouchableOpacity>
        )}
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
    height: 200,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 177,
    height: 177,
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
    minHeight: 190,
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
  descriptionStrong: {
    fontFamily: FontFamilies.text.bold,
    fontSize: FontSizes.bodyBase,
    color: Colors.light.greyscale[70],
  },

  /* GUIDANCE */
  guidanceContainer: {
    alignItems: "center",
    paddingBottom: 40,
    marginBottom: 100,
    gap: 10,
  },
  nextButtonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  guidanceText: {
    fontFamily: FontFamilies.text.medium,
    fontSize: 14,
    color: Colors.light.greyscale[70],
  },
  guidanceTextAction: {
    fontFamily: FontFamilies.text.medium,
    fontSize: 14,
    color: Colors.light.primary.base,
    textDecorationLine: "underline",
  },

  /* PAGINATION */
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingTop: 6,
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