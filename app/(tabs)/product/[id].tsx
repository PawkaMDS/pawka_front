import React, { useEffect, useState } from 'react';
import { View, Image, ActivityIndicator, StyleSheet, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text } from '@/components/ui/Text';
import { getProductById } from '@/lib/api/products';
import type { DetailedProduct } from '@/types/product';
import { Ionicons } from '@expo/vector-icons';
import { ProductDetails } from '@/components/ProductDetails';

const getAnimalIcon = (product: DetailedProduct): string => {
    const animalTypeCode = product.product_foods?.[0]?.animal_type?.code;

    switch (animalTypeCode) {
        case 'cat':
            return 'paw-outline';
        case 'dog':
            return 'paw';
        case 'bird':
            return 'leaf-outline';
        case 'fish':
            return 'water-outline';
        case 'rodent':
        case 'rabbit':
            return 'paw-outline';
        default:
            return 'fast-food-outline';
    }
};

const getOverallScore = (product?: DetailedProduct) => {
    const productFood = product?.product_foods?.[0];
    if (!productFood?.scores?.overall) return null;
    return Math.round(productFood.scores.overall);
};

const getScoreColor = (score: number) => {
    if (score >= 81) return '#2E7D32';
    if (score >= 61) return '#689F38';
    if (score >= 41) return '#F9A825';
    if (score >= 21) return '#F57C00';
    return '#D32F2F';
};

export default function ProductPage() {
    const params = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [product, setProduct] = useState<DetailedProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            const id = params.id ? Number(params.id) : NaN;
            if (!id || Number.isNaN(id)) {
                if (mounted) {
                    setError('Identifiant produit invalide');
                    setLoading(false);
                }
                return;
            }

            try {
                const data = await getProductById(id);
                if (mounted) {
                    if (data) setProduct(data);
                    else setError('Produit introuvable');
                }
            } catch (err: any) {
                if (mounted) setError(err?.message || 'Erreur lors du chargement');
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, [params.id]);

    const overallScore = getOverallScore(product || undefined);
    const scoreColor = overallScore ? getScoreColor(overallScore) : '#999';

    if (loading) {
        return (
            <SafeAreaView style={styles.center}>
                <ActivityIndicator />
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.center}>
                <Text>{error}</Text>
            </SafeAreaView>
        );
    }

    if (!product) {
        return (
            <SafeAreaView style={styles.center}>
                <Text>Produit introuvable</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.peekContainer}>
                <View style={styles.peekContent}>
                    <View style={styles.peekImageContainer}>
                        {product.image_url ? (
                            <Image source={{ uri: product.image_url }} style={styles.peekImage} resizeMode="contain" />
                        ) : (
                            <View style={[styles.peekImage, styles.peekImagePlaceholder]}>
                                <Ionicons name={getAnimalIcon(product) as any} size={40} color="#CCC" />
                            </View>
                        )}
                    </View>

                    <View style={styles.peekInfo}>
                        <Text style={styles.peekTitle} numberOfLines={2}>{product.name}</Text>
                        {product.brand && <Text style={styles.peekBrand} numberOfLines={1}>{product.brand}</Text>}
                    </View>

                    {overallScore !== null && (
                        <View style={[styles.scoreBadge, { backgroundColor: scoreColor }]}>
                            <Text style={styles.scoreText}>{overallScore}</Text>
                            <Text style={styles.scoreMax}>/100</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.swipeHint}>Fiche produit</Text>
            </View>

            <View style={styles.contentContainer}>
                <ProductDetails product={product} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    peekContainer: { padding: 16, paddingTop: 8, backgroundColor: '#fff', marginBottom: 8 },
    peekContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
    peekImageContainer: { width: 80, height: 80 },
    peekImage: { width: 80, height: 80, borderRadius: 8, backgroundColor: '#F5F5F5' },
    peekImagePlaceholder: { justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E0E0E0', borderStyle: 'dashed' },
    peekInfo: { flex: 1, justifyContent: 'center', gap: 4, marginLeft: 12 },
    peekTitle: { fontSize: 16, fontWeight: '700', color: '#333' },
    peekBrand: { fontSize: 13, color: '#666', marginBottom: 4 },
    scoreBadge: { flexDirection: 'row', alignItems: 'baseline', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 2 },
    scoreText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
    scoreMax: { fontSize: 12, fontWeight: '600', color: '#fff', opacity: 0.9 },
    swipeHint: { fontSize: 12, color: '#999', textAlign: 'center', marginTop: 8 },
    contentContainer: { flex: 1 },
});
