import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Modal, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '@/components/ui/Text';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/lib/auth/AuthContext';
import { getUserAnimals } from '@/lib/api/animals';
import { getAnimalProductScore } from '@/lib/api/products';
import { ScoreCriteriaAccordionList } from '@/components/ui/ScoreCriteriaAccordionList';
import { formatAnimalAge } from '@/utils/animals';
import type { Animal } from '@/types/animal';
import type { ProductFood } from '@/types/product';
import { Ionicons } from '@expo/vector-icons';
import { ScoreCard } from '../ui/ScoreCard';

interface AnimalSelectorProps {
    onAnimalSelect?: (animal: Animal | null) => void;
    productId?: number;
}

/**
 * Composant pour afficher le sélecteur d'animal ou un message selon le statut
 * - Si non premium: affiche un message d'abonnement
 * - Si premium mais pas d'animaux: affiche un message pour ajouter un animal
 * - Si premium avec animaux: affiche une liste déroulante
 * - Si productId est fourni: charge et affiche le score du produit pour l'animal sélectionné
 */
export function AnimalSelector({ onAnimalSelect, productId }: AnimalSelectorProps) {
    const router = useRouter();
    const { user } = useAuth();
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productScore, setProductScore] = useState<ProductFood | null>(null);
    const [isLoadingScore, setIsLoadingScore] = useState(false);
    const [scoreError, setScoreError] = useState<string | null>(null);
    const [isProductNotSuitable, setIsProductNotSuitable] = useState(false);

    useEffect(() => {
        loadAnimals();
    }, [user?.id]);

    // Recharger le score quand productId ou selectedAnimal change
    useEffect(() => {
        if (selectedAnimal && productId) {
            console.log(`[AnimalSelector] Loading score for animal ${selectedAnimal.id} and product ${productId}`);
            loadProductScore(selectedAnimal.id, productId);
        }
    }, [productId, selectedAnimal?.id]);

    const loadAnimals = async () => {
        if (!user) return;

        setIsLoading(true);
        setError(null);

        try {
            const userAnimals = await getUserAnimals();
            setAnimals(userAnimals);
            if (userAnimals.length > 0) {
                setSelectedAnimal(userAnimals[0]);
                onAnimalSelect?.(userAnimals[0]);
                // IMPORTANT: Ne pas charger le score ici, attendre le useEffect de productId
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des animaux';
            setError(errorMessage);
            console.error('Error loading animals:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const loadProductScore = async (animalId: number, pId: number) => {
        setIsLoadingScore(true);
        setScoreError(null);
        setIsProductNotSuitable(false);
        setProductScore(null);

        try {
            console.log(`[AnimalSelector] Calling getAnimalProductScore(${animalId}, ${pId})`);
            const score = await getAnimalProductScore(animalId, pId);
            console.log(`[AnimalSelector] Score received:`, score);
            
            if (score === null) {
                // Le produit n'est pas adapté à cet animal
                console.log(`[AnimalSelector] Product not suitable for animal ${animalId}`);
                setIsProductNotSuitable(true);
            } else {
                console.log(`[AnimalSelector] Setting product score`);
                setProductScore(score);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement du score';
            console.error(`[AnimalSelector] Error loading product score:`, err);
            setScoreError(errorMessage);
        } finally {
            setIsLoadingScore(false);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="small" color={Colors.light.primary.base} />
            </View>
        );
    }

    // Si non premium
    if (!user?.is_premium) {
        return (
            <View style={styles.container}>
                <View style={styles.messageBox}>
                    <Text style={styles.messageText}>
                        Abonnez vous pour avoir un score personnalisé pour votre animal
                    </Text>
                </View>
                <TouchableOpacity
                    style={styles.subscribeButton}
                    onPress={() => router.push('/(screens)/subscription')}
                >
                    <Text style={styles.subscribeButtonText}>M'abonner</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Si premium mais pas d'animaux
    if (user.is_premium && animals.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.messageBox}>
                    <Text style={styles.messageText}>
                        Ajoutez votre premier animal
                    </Text>
                </View>
            </View>
        );
    }

    // Si premium avec animaux
    return (
        <View style={styles.container}>
            {error && (
                <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            <TouchableOpacity
                style={styles.selectButton}
                onPress={() => setIsModalOpen(true)}
            >
                <View style={styles.selectButtonContent}>
                    <View style={styles.selectButtonImageContainer}>
                        {selectedAnimal?.image_url ? (
                            <Image
                                source={{ uri: selectedAnimal.image_url }}
                                style={styles.selectButtonImage}
                            />
                        ) : (
                            <Ionicons
                                name="paw"
                                size={28}
                                color={Colors.light.secondary.base}
                            />
                        )}
                    </View>
                    <Text style={styles.selectButtonText}>
                        {selectedAnimal?.name || 'Sélectionnez un animal'}
                        {selectedAnimal?.birth_date && ` • ${formatAnimalAge(selectedAnimal.birth_date)}`}
                    </Text>
                </View>
                <Ionicons
                    name="chevron-down"
                    size={20}
                    color={Colors.light.primary.base}
                />
            </TouchableOpacity>

            {/* Affichage du score du produit si productId est fourni */}
            {productId && (
                <>
                    {isLoadingScore && (
                        <View style={styles.scoreContainer}>
                            <ActivityIndicator size="small" color={Colors.light.primary.base} />
                        </View>
                    )}

                    {scoreError && !isLoadingScore && (
                        <View style={styles.scoreErrorBox}>
                            <Text style={styles.scoreErrorText}>{scoreError}</Text>
                        </View>
                    )}

                    {isProductNotSuitable && !isLoadingScore && (
                        <View style={styles.notSuitableBox}>
                            <Ionicons
                                name="alert-circle"
                                size={20}
                                color={Colors.light.negativePrimary}
                            />
                            <Text style={styles.notSuitableText}>
                                Ce produit n'est pas adapté à {selectedAnimal?.name}
                            </Text>
                        </View>
                    )}

                    {productScore && !isLoadingScore && !isProductNotSuitable && (
                        <View style={styles.scoreSection}>
                            {/* Affichage du score total */}
                            {productScore.total_score !== null && productScore.total_score !== undefined && (
                                <ScoreCard score={productScore.total_score} variant="medium" />
                            )}
                            <ScoreCriteriaAccordionList productFood={productScore} />
                        </View>
                    )}
                </>
            )}

            <Modal
                visible={isModalOpen}
                transparent
                animationType="fade"
                onRequestClose={() => setIsModalOpen(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Sélectionner un animal</Text>
                            <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                                <Ionicons
                                    name="close"
                                    size={24}
                                    color={Colors.light.greyscale[90]}
                                />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalList}>
                            {animals.map((animal) => (
                                <TouchableOpacity
                                    key={animal.id}
                                    style={[
                                        styles.animalItem,
                                        selectedAnimal?.id === animal.id && styles.animalItemSelected,
                                    ]}
                                    onPress={() => {
                                        setSelectedAnimal(animal);
                                        onAnimalSelect?.(animal);
                                        // Charger le score si productId est disponible
                                        if (productId) {
                                            loadProductScore(animal.id, productId);
                                        }
                                        setIsModalOpen(false);
                                    }}
                                >
                                    <View style={styles.animalItemImageContainer}>
                                        {animal.image_url ? (
                                            <Image
                                                source={{ uri: animal.image_url }}
                                                style={styles.animalItemImage}
                                            />
                                        ) : (
                                            <Ionicons
                                                name="paw"
                                                size={24}
                                                color={Colors.light.secondary.base}
                                            />
                                        )}
                                    </View>
                                    <View style={styles.animalItemContent}>
                                        <Text
                                            style={[
                                                styles.animalItemText,
                                                selectedAnimal?.id === animal.id && styles.animalItemTextSelected,
                                            ]}
                                        >
                                            {animal.name}
                                        </Text>
                                        <View style={styles.animalItemMetaRow}>
                                            {animal.type && (
                                                <Text style={styles.animalItemSubtext}>
                                                    {animal.type.name}
                                                </Text>
                                            )}
                                            {animal.birth_date && (
                                                <Text style={styles.animalItemSubtext}>
                                                    • {formatAnimalAge(animal.birth_date)}
                                                </Text>
                                            )}
                                        </View>
                                    </View>
                                    {selectedAnimal?.id === animal.id && (
                                        <Ionicons
                                            name="checkmark"
                                            size={20}
                                            color={Colors.light.secondary.base}
                                        />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 6,
    },
    messageBox: {
        backgroundColor: Colors.light.secondary[100],
        borderRadius: 8,
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: Colors.light.primary.base,
    },
    messageText: {
        color: Colors.light.primary.base,
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '500',
    },
    errorBox: {
        backgroundColor: Colors.light.negativeTertiary,
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: Colors.light.negativePrimary,
    },
    errorText: {
        color: Colors.light.negativeText,
        fontSize: 13,
        lineHeight: 18,
    },
    selectButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.light.secondary[100],
        borderWidth: 1,
        borderColor: Colors.light.secondary.base,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginBottom: 12,
    },
    selectButtonContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    selectButtonImageContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: Colors.light.primary[200],
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    selectButtonImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    selectButtonText: {
        fontSize: 14,
        color: Colors.light.primary.base,
        fontWeight: '500',
        flex: 1,
    },
    scoreContainer: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    scoreErrorBox: {
        backgroundColor: Colors.light.negativeTertiary,
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: Colors.light.negativePrimary,
    },
    scoreErrorText: {
        color: Colors.light.negativeText,
        fontSize: 13,
        lineHeight: 18,
    },
    notSuitableBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light.negativeTertiary,
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: Colors.light.negativePrimary,
        gap: 10,
    },
    notSuitableText: {
        color: Colors.light.negativeText,
        fontSize: 13,
        lineHeight: 18,
        flex: 1,
    },
    scoreSection: {
        marginBottom: 12,
    },
    totalScoreBox: {
        backgroundColor: Colors.light.secondary[100],
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        alignItems: 'center',
        borderLeftWidth: 4,
        borderLeftColor: Colors.light.primary.base,
    },
    totalScoreLabel: {
        fontSize: 14,
        color: Colors.light.greyscale[60],
        fontWeight: '500',
        marginBottom: 8,
    },
    totalScoreValue: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.light.primary.base,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colors.light.greyscale[0],
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        maxHeight: '80%',
        paddingBottom: 24,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.greyscale[20],
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.primary.base,
    },
    modalList: {
        maxHeight: '100%',
    },
    animalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.greyscale[10],
        gap: 12,
    },
    animalItemSelected: {
        backgroundColor: Colors.light.secondary[100],
    },
    animalItemImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    animalItemImageContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: Colors.light.primary[200],
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    animalItemContent: {
        flex: 1,
    },
    animalItemMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 4,
        flexWrap: 'wrap',
    },
    animalItemText: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.light.primary[700],
    },
    animalItemTextSelected: {
        color: Colors.light.primary.base,
        fontWeight: '600',
    },
    animalItemSubtext: {
        fontSize: 12,
        color: Colors.light.greyscale[60],
    },
    subscribeButton: {
        backgroundColor: Colors.light.primary.base,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems: 'center',
        marginTop: 12,
    },
    subscribeButtonText: {
        color: Colors.light.greyscale[0],
        fontSize: 14,
        fontWeight: '600',
    },
});
