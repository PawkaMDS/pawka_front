import { useCallback, useRef, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { Text } from "@/components/ui/Text";
import {
  CameraView,
  useCameraPermissions,
  BarcodeScanningResult,
} from "expo-camera";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { scanProductByEAN } from "@/lib/api/scan";

export default function Scan() {
  const [permission, requestPermission] = useCameraPermissions();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const lastScannedCodeRef = useRef<string | null>(null);
  const router = useRouter();

  const reset = useCallback(() => {
    lastScannedCodeRef.current = null;
    setError(null);
    setIsLoading(false);
    setLoadingMessage("");
  }, []);

  const onBarcodeScanned = useCallback(async (scan: BarcodeScanningResult) => {
    const code = scan.data?.trim();
    const type = scan.type?.toLowerCase?.() ?? "";

    // Accepter EAN-13, EAN-8, UPC-A et UPC-E
    const isValidBarcode =
      type.includes("ean13") ||
      type.includes("ean-13") ||
      type.includes("ean8") ||
      type.includes("ean-8") ||
      type.includes("upc_a") ||
      type.includes("upc-a") ||
      type.includes("upc_e") ||
      type.includes("upc-e");

    if (!code || !isValidBarcode) return;

    // Empêcher de rescanner le même code
    if (lastScannedCodeRef.current === code) return;

    lastScannedCodeRef.current = code;
    setError(null);
    setIsLoading(true);
    setLoadingMessage("Analyse du code-barres en cours...");

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});

      const result = await scanProductByEAN(code);

      setIsLoading(false);

      if (result && result.id) {
        router.push({
          pathname: "/(tabs)/scan/_result",
          params: { productId: String(result.id) },
        });
        // Reset pour permettre un nouveau scan au retour
        lastScannedCodeRef.current = null;
      } else {
        setError(
          "Produit non trouvé. Veuillez réessayer avec un autre code-barres."
        );
      }
    } catch (e) {
      setIsLoading(false);
      const message = e instanceof Error ? e.message : String(e);
      setError(`Erreur lors de l'analyse: ${message}`);
    }
  }, []);

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text>Chargement des permissions…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Accès à la caméra requis</Text>
        <Text style={styles.subtitle}>
          Nous avons besoin de votre permission pour scanner des codes-barres.
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Autoriser la caméra</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e"],
          }}
          onBarcodeScanned={onBarcodeScanned}
        />

        <View style={styles.overlay} pointerEvents="none">
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.cornerTopLeft]} />
            <View style={[styles.corner, styles.cornerTopRight]} />
            <View style={[styles.corner, styles.cornerBottomLeft]} />
            <View style={[styles.corner, styles.cornerBottomRight]} />
          </View>
        </View>

        {!error && !isLoading && (
          <View style={styles.hintContainer}>
            <Text style={styles.hint}>Scannez le code-barres d'un produit</Text>
          </View>
        )}

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>{loadingMessage}</Text>
            <Text style={styles.loadingSubtext}>
              Cela peut prendre quelques secondes...
            </Text>
          </View>
        )}

        {error && !isLoading && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={reset}>
              <Text style={styles.retryButtonText}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  scanFrame: {
    width: "80%",
    aspectRatio: 1.5, // Rectangle plus large que haut (adapté aux codes-barres)
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: "rgba(255,255,255,0.9)",
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  hintContainer: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 16,
    borderRadius: 12,
  },
  hint: {
    textAlign: "center",
    color: "#fff",
    fontSize: 14,
  },
  loadingContainer: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0, 122, 255, 0.95)",
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 16,
  },
  loadingSubtext: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
  },
  errorContainer: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: "rgba(211, 47, 47, 0.9)",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  errorText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#D32F2F",
    fontWeight: "600",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    color: "#444",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#0A7EA4",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
