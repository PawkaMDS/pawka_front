import { useCallback, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  CameraView,
  useCameraPermissions,
  BarcodeScanningResult,
} from "expo-camera";
import * as Haptics from "expo-haptics";
import { getProductByEAN } from "../../../lib/api/products";
import { getOpenPetFoodFactsProductByEAN } from "../../../lib/api/external/openpetfoodfacts";
import type { Product } from "../../../types/product";

export default function Scan() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<"db" | "openpetfoodfacts" | null>(null);
  const isScanningRef = useRef(false);

  const reset = useCallback(() => {
    isScanningRef.current = false;
    setScannedCode(null);
    setProduct(null);
    setError(null);
    setSource(null);
  }, []);

  const onBarcodeScanned = useCallback(async (scan: BarcodeScanningResult) => {
    if (isScanningRef.current) return;

    const code = scan.data?.trim();
    const type = scan.type?.toLowerCase?.() ?? "";
    const isEAN13 = type.includes("ean13") || type.includes("ean-13");
    if (!code || !isEAN13) return;

    isScanningRef.current = true;
    setScannedCode(code);
    setError(null);

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});

      const found = await getProductByEAN(code);
      if (found) {
        setProduct(found);
        setSource("db");
      } else {
        // Fallback to OpenPetFoodFacts
        const ext = await getOpenPetFoodFactsProductByEAN(code);
        if (ext) {
          setProduct(ext);
          setSource("openpetfoodfacts");
        } else {
          setProduct(null);
          setSource(null);
          setError("Produit non disponible en base de données");
        }
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
          barcodeScannerSettings={{ barcodeTypes: ["ean13"] }}
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
          <View style={styles.result}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productCode}>
              Code barre: {product.code_ean}
            </Text>
            {source === "openpetfoodfacts" && (
              <Text style={styles.note}>
                (produit trouvé dans openpetfoodfacts)
              </Text>
            )}
          </View>
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
  result: { gap: 6 },
  productName: { fontSize: 18, fontWeight: "700" },
  productCode: { color: "#333" },
  code: { color: "#333" },
  error: { color: "#B00020", fontWeight: "600" },
  hint: { textAlign: "center", color: "#666" },
  note: { color: "#666", fontStyle: "italic" },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
});
