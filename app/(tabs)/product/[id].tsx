import React, { useEffect, useState } from 'react';
import { View, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text } from '@/components/ui/Text';
import { getProductById } from '@/lib/api/products';
import type { DetailedProduct } from '@/types/product';
import { Ionicons } from '@expo/vector-icons';
import { ProductDetails } from '@/components/ProductDetails';
import PageLayout from '@/components/layout/PageLayout';

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

    if (loading) {
        return (
            <PageLayout>
                <View style={styles.center}>
                    <ActivityIndicator />
                </View>
            </PageLayout>
        );
    }

    if (error) {
        return (
            <PageLayout>
                <View style={styles.center}>
                    <Text>{error}</Text>
                </View>
            </PageLayout>
        );
    }

    if (!product) {
        return (
            <PageLayout>
                <View style={styles.center}>
                    <Text>Produit introuvable</Text>
                </View>
            </PageLayout>
        );
    }

    // If successfully loaded product, show details
    return (
        <PageLayout>
            <View style={styles.contentContainer}>
                
                <ProductDetails product={product} />
            </View>
        </PageLayout>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scoreBadge: { flexDirection: 'row', alignItems: 'baseline', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 2 },
    scoreText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
    scoreMax: { fontSize: 12, fontWeight: '600', color: '#fff', opacity: 0.9 },
    swipeHint: { fontSize: 12, color: '#999', textAlign: 'center', marginTop: 8 },
    contentContainer: { flex: 1 },
});
