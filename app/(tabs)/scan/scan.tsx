import { useCallback, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import {
  CameraView,
  useCameraPermissions,
  BarcodeScanningResult,
} from "expo-camera";
import * as Haptics from "expo-haptics";
import { scanProductByEAN } from "@/lib/api/scan";
import type { Product } from "@/types/product";
import { ProductScanResult } from "@/components/ProductScanResult";

export default function Scan() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isScanningRef = useRef(false);

  const reset = useCallback(() => {
    isScanningRef.current = false;
    setScannedCode(null);
    setProduct(null);
    setError(null);
  }, []);

  const onBarcodeScanned = useCallback(async (scan: BarcodeScanningResult) => {
    if (isScanningRef.current) return;

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

    isScanningRef.current = true;
    setScannedCode(code);
    setError(null);

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});

      const result = await scanProductByEAN(code);
      if (result) {
        setProduct(result);
      } else {
        setProduct(null);
        setError("Produit non disponible en base de données");
      }
    } catch (e) {
      setProduct(null);
      const message = e instanceof Error ? e.message : String(e);
      setError(`Erreur lors de la récupération du produit: ${message}`);
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
      <View style={styles.cameraWrapper}>
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e"],
          }}
          onBarcodeScanned={onBarcodeScanned}
        />

        <View style={styles.overlay} pointerEvents="none">
          <View style={styles.guide} />
        </View>
      </View>

      <View style={styles.panel}>
        {scannedCode && (
          <Text style={styles.code}>EAN scanné: {scannedCode}</Text>
        )}

        {product && (
          <ScrollView style={styles.resultScroll}>
            <ProductScanResult product={product} />
          </ScrollView>
        )}

        {error && <Text style={styles.error}>{error}</Text>}

        {(product || error) && (
          <TouchableOpacity
            style={[styles.button, styles.secondary]}
            onPress={reset}
          >
            <Text style={[styles.buttonText, styles.secondaryText]}>
              Scanner à nouveau
            </Text>
          </TouchableOpacity>
        )}

        {!product && !error && (
          <Text style={styles.hint}>
            Cadrez le code-barres EAN dans le carré
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  cameraWrapper: { flex: 2, backgroundColor: "#000" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  guide: {
    width: "70%",
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.8)",
    borderRadius: 12,
  },
  panel: { flex: 1, backgroundColor: "#fff", padding: 16, gap: 12 },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: { textAlign: "center", color: "#444", marginBottom: 16 },
  button: {
    backgroundColor: "#0A7EA4",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    alignSelf: "center",
  },
  buttonText: { color: "white", fontWeight: "600" },
  secondary: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#0A7EA4",
  },
  secondaryText: { color: "#0A7EA4" },
  resultScroll: {
    flex: 1,
  },
  code: { color: "#333" },
  error: { color: "#B00020", fontWeight: "600" },
  hint: { textAlign: "center", color: "#666" },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
});
