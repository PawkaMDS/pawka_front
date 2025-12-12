import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { getProductById } from "@/lib/api/products";
import { ProductDetails } from "@/components/ProductDetails";
import type { DetailedProduct } from "@/types/product";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const PEEK_HEIGHT = 200;
const MAX_TRANSLATE = SCREEN_HEIGHT * 0.9;

interface ProductBottomSheetProps {
  productId: number;
  token: string;
  onClose: () => void;
}

export function ProductBottomSheet({
  productId,
  token,
  onClose,
}: ProductBottomSheetProps) {
  const [product, setProduct] = useState<DetailedProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const translateY = useSharedValue(SCREEN_HEIGHT - PEEK_HEIGHT);
  const context = useSharedValue({ y: 0 });

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProductById(productId, token);
        if (data) {
          setProduct(data);
        } else {
          setError("Produit non trouvé");
        }
      } catch (err) {
        console.error("Erreur lors du chargement du produit:", err);
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId, token]);

  const scrollTo = (destination: number) => {
    "worklet";
    translateY.value = withSpring(destination, { damping: 50 });
  };

  const isExpanded = () => {
    "worklet";
    return translateY.value < SCREEN_HEIGHT - MAX_TRANSLATE + 50;
  };

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      const newY = context.value.y + event.translationY;
      // Limiter le déplacement
      if (newY >= SCREEN_HEIGHT - MAX_TRANSLATE && newY <= SCREEN_HEIGHT) {
        translateY.value = newY;
      }
    })
    .onEnd((event) => {
      if (event.velocityY > 500) {
        scrollTo(SCREEN_HEIGHT - PEEK_HEIGHT);
      } else if (event.velocityY < -500) {
        scrollTo(SCREEN_HEIGHT - MAX_TRANSLATE);
      } else {
        const middlePoint = SCREEN_HEIGHT - MAX_TRANSLATE / 2;
        if (translateY.value > middlePoint) {
          scrollTo(SCREEN_HEIGHT - PEEK_HEIGHT);
        } else {
          scrollTo(SCREEN_HEIGHT - MAX_TRANSLATE);
        }
      }
    });

  const rBottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const handlePeekPress = () => {
    if (isExpanded()) {
      scrollTo(SCREEN_HEIGHT - PEEK_HEIGHT);
    } else {
      scrollTo(SCREEN_HEIGHT - MAX_TRANSLATE);
    }
  };

  const getOverallScore = () => {
    const productFood = product?.product_foods?.[0];
    if (!productFood?.scores?.overall) return null;
    return Math.round(productFood.scores.overall);
  };

  const getScoreColor = (score: number) => {
    if (score >= 81) return "#2E7D32";
    if (score >= 61) return "#689F38";
    if (score >= 41) return "#F9A825";
    if (score >= 21) return "#F57C00";
    return "#D32F2F";
  };

  const overallScore = getOverallScore();
  const scoreColor = overallScore ? getScoreColor(overallScore) : "#999";

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
        <View style={styles.handle} />

        <TouchableOpacity
          style={styles.peekContainer}
          onPress={handlePeekPress}
          activeOpacity={0.9}
        >
          <View style={styles.peekContent}>
            {loading ? (
              <View style={styles.peekCentered}>
                <ActivityIndicator size="small" color="#0A7EA4" />
              </View>
            ) : error ? (
              <View style={styles.peekCentered}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : product ? (
              <>
                <View style={styles.peekImageContainer}>
                  {product.image_url ? (
                    <Image
                      source={{ uri: product.image_url }}
                      style={styles.peekImage}
                      resizeMode="contain"
                    />
                  ) : (
                    <View
                      style={[styles.peekImage, styles.peekImagePlaceholder]}
                    >
                      <Ionicons
                        name="fast-food-outline"
                        size={40}
                        color="#CCC"
                      />
                    </View>
                  )}
                </View>

                <View style={styles.peekInfo}>
                  <Text style={styles.peekTitle} numberOfLines={2}>
                    {product.name}
                  </Text>
                  {product.brand && (
                    <Text style={styles.peekBrand} numberOfLines={1}>
                      {product.brand}
                    </Text>
                  )}

                  {overallScore !== null && (
                    <View
                      style={[
                        styles.scoreBadge,
                        { backgroundColor: scoreColor },
                      ]}
                    >
                      <Text style={styles.scoreText}>{overallScore}</Text>
                      <Text style={styles.scoreMax}>/100</Text>
                    </View>
                  )}
                </View>

                <Ionicons name="chevron-up" size={24} color="#666" />
              </>
            ) : null}
          </View>
          <Text style={styles.swipeHint}>
            Swiper vers le haut pour plus de détails
          </Text>
        </TouchableOpacity>

        <View style={styles.contentContainer}>
          {loading ? (
            <View style={styles.centerContent}>
              <ActivityIndicator size="large" color="#0A7EA4" />
              <Text style={styles.loadingText}>Chargement...</Text>
            </View>
          ) : error ? (
            <View style={styles.centerContent}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : product ? (
            <ProductDetails product={product} />
          ) : null}
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  bottomSheetContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT,
    backgroundColor: "#F5F5F5",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: "#DDD",
    borderRadius: 3,
    alignSelf: "center",
    marginTop: 8,
  },
  peekContainer: {
    padding: 16,
    paddingTop: 8,
  },
  peekContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  peekCentered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  peekImageContainer: {
    width: 80,
    height: 80,
  },
  peekImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
  },
  peekImagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderStyle: "dashed",
  },
  peekInfo: {
    flex: 1,
    justifyContent: "center",
    gap: 4,
  },
  peekTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  peekBrand: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  scoreBadge: {
    flexDirection: "row",
    alignItems: "baseline",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 2,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  scoreMax: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
    opacity: 0.9,
  },
  swipeHint: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginTop: 8,
  },
  contentContainer: {
    flex: 1,
    marginTop: 8,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 14,
    color: "#D32F2F",
    textAlign: "center",
  },
});
