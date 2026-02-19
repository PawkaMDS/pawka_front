import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Text } from "@/components/ui/Text";
import { Heading } from '@/components/ui/Heading';
import PageLayout from '@/components/layout/PageLayout';
import { Colors } from '@/constants/theme';
import { FontFamilies } from '@/constants/typography';
import { getProductTypes } from '@/lib/api/productTypes';
import { searchProducts, ProductSearchResult } from '@/lib/api/products';
import { ScoreCard } from '@/components/ui/ScoreCard';
import { useRouter } from 'expo-router';
import type { ProductType } from '@/types/product';
import { getCategoryIcon } from '@/constants/categoryIcons';
import ArrowRightIcon from '@/assets/icons/arrow-right.svg';
import SearchIcon from '@/assets/icons/search.svg';

export default function Search() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeTypeCode, setActiveTypeCode] = useState<string | null>(null);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [searchResults, setSearchResults] = useState<ProductSearchResult[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Charger les types de produits au montage
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const types = await getProductTypes();
        if (mounted) setProductTypes(types);
      } catch (err) {
        console.error('Erreur chargement types:', err);
      } finally {
        if (mounted) setLoadingTypes(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Recherche avec debounce
  useEffect(() => {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length === 0 && !activeTypeCode) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoadingSearch(true);
      setHasSearched(true);
      try {
        const results = await searchProducts(
          trimmedQuery || undefined,
          activeTypeCode ? { product_type_code: activeTypeCode } : undefined,
        );
        setSearchResults(results);
      } catch (err) {
        console.error('Erreur recherche:', err);
        setSearchResults([]);
      } finally {
        setLoadingSearch(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [query, activeTypeCode]);

  const getOverallScoreFromResult = (item: ProductSearchResult): number | null => {
    if (!item.scores) return null;
    const keys = [
      'protein_content', 'fat_content', 'carbohydrate_content',
      'fiber_content', 'ingredient_quality', 'protein_source_quality',
      'byproducts_presence', 'chemical_additives', 'beneficial_additives',
    ];
    let total = 0;
    for (const k of keys) {
      const entry = item.scores[k];
      if (!entry || typeof entry.pt !== 'number') return null;
      total += entry.pt;
    }
    return Math.max(0, Math.min(100, Math.round(total)));
  };

  const renderSearchResult = ({ item, index }: { item: ProductSearchResult; index: number }) => {
    const overall = getOverallScoreFromResult(item);
    const isLast = index === searchResults.length - 1;

    return (
      <TouchableOpacity
        style={[styles.resultItem, !isLast && styles.resultItemDivider]}
        onPress={() => router.push(`/(tabs)/product/${item.id}`)}
      >
        <View style={styles.resultImageCol}>
          {item.image_url ? (
            <Image source={{ uri: item.image_url }} style={styles.resultThumb} />
          ) : (
            <View style={styles.resultThumbPlaceholder} />
          )}
        </View>
        <View style={styles.resultInfoCol}>
          <Heading as="h5" numberOfLines={2} style={styles.resultTitle}>
            {item.name}
          </Heading>
          {item.brand && (
            <Text style={styles.resultBrand} numberOfLines={1}>{item.brand}</Text>
          )}
          {overall !== null && (
            <ScoreCard score={overall} variant="mini" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const handleCategoryPress = (typeCode: string) => {
    setActiveTypeCode(typeCode);
  };

  const clearCategoryFilter = () => {
    setActiveTypeCode(null);
    setSearchResults([]);
    setHasSearched(false);
  };

  const renderCategoryItem = ({ item }: { item: ProductType }) => {
    const CategoryIcon = getCategoryIcon(item.icon_name);
    return (
      <TouchableOpacity style={styles.categoryItem} onPress={() => handleCategoryPress(item.code)}>
        <View style={styles.categoryLeft}>
          <CategoryIcon width={20} height={20} fill={Colors.light.primary.base} />
          <Text style={styles.categoryName}>{item.name}</Text>
        </View>
        <ArrowRightIcon width={14} height={14} fill={Colors.light.primary.base} />
      </TouchableOpacity>
    );
  };

  const showResults = query.trim().length > 0 || activeTypeCode !== null;
  const activeCategoryName = activeTypeCode
    ? productTypes.find(t => t.code === activeTypeCode)?.name ?? null
    : null;

  return (
    <PageLayout>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* — Section recherche (fond blanc) — */}
        <View style={styles.searchSection}>
          <Heading as="h3" style={styles.searchHeading}>Rechercher</Heading>
          <Text style={styles.searchLabel}>
            Rechercher un produit, une marque ou un ingrédient
          </Text>
          <View style={styles.inputWrapper}>
            <SearchIcon width={16} height={16} fill={Colors.light.greyscale[50]} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Rechercher..."
              placeholderTextColor={Colors.light.greyscale[50]}
              value={query}
              onChangeText={setQuery}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
            />
          </View>
        </View>

        {/* — Filtre catégorie active — */}
        {activeTypeCode && activeCategoryName && (
          <View style={styles.activeFilterSection}>
            <TouchableOpacity style={styles.activeFilterPill} onPress={clearCategoryFilter}>
              <Text style={styles.activeFilterText}>{activeCategoryName}</Text>
              <Text style={styles.activeFilterClose}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* — Résultats de recherche — */}
        {showResults && (
          <View style={styles.resultsSection}>
            {loadingSearch ? (
              <View style={styles.center}>
                <ActivityIndicator color={Colors.light.primary.base} />
              </View>
            ) : searchResults.length > 0 ? (
              <FlatList
                data={searchResults}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderSearchResult}
                scrollEnabled={false}
              />
            ) : hasSearched ? (
              <Text style={styles.noResults}>Aucun résultat trouvé</Text>
            ) : null}
          </View>
        )}

        {/* — Section catégories (fond secondary.base) — */}
        {!showResults && (
          <View style={styles.categoriesSection}>
            <Heading as="h4" style={styles.categoriesHeading}>
              Rechercher par catégories
            </Heading>
            <View style={styles.categoriesList}>
              {loadingTypes ? (
                <View style={styles.center}>
                  <ActivityIndicator color={Colors.light.primary.base} />
                </View>
              ) : (
                productTypes.map((item) => (
                  <React.Fragment key={item.id}>
                    {renderCategoryItem({ item })}
                  </React.Fragment>
                ))
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    marginHorizontal: -20, // compense le padding du PageLayout
  },
  scrollContent: {
    flexGrow: 1,
  },

  // — Search section —
  searchSection: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 24,
  },
  searchHeading: {
    color: Colors.light.primary.base,
    marginBottom: 16,
  },
  searchLabel: {
    fontFamily: FontFamilies.text.medium,
    fontSize: 13,
    color: Colors.light.greyscale[80],
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.greyscale[0],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.greyscale[30],
    paddingHorizontal: 14,
    height: 48,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontFamily: FontFamilies.text.regular,
    fontSize: 14,
    color: Colors.light.greyscale[90],
    height: '100%',
  },

  // — Results section —
  resultsSection: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  resultItem: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 16,
    alignItems: 'flex-start',
  },
  resultItemDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.greyscale[30],
  },
  resultImageCol: {
    width: 72,
  },
  resultThumb: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: Colors.light.greyscale[20],
  },
  resultThumbPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: Colors.light.greyscale[20],
  },
  resultInfoCol: {
    flex: 1,
  },
  resultTitle: {
    color: Colors.light.greyscale[90],
  },
  resultBrand: {
    marginTop: 2,
    color: Colors.light.greyscale[60],
    marginBottom: 8,
  },
  noResults: {
    textAlign: 'center',
    color: Colors.light.greyscale[60],
    paddingVertical: 24,
  },
  center: {
    paddingVertical: 24,
    alignItems: 'center',
  },

  // — Active filter —
  activeFilterSection: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    flexDirection: 'row',
  },
  activeFilterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary.base,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  activeFilterText: {
    fontFamily: FontFamilies.text.medium,
    fontSize: 13,
    color: Colors.light.greyscale[0],
  },
  activeFilterClose: {
    fontSize: 12,
    color: Colors.light.greyscale[0],
  },

  // — Categories section —
  categoriesSection: {
    flex: 1,
    backgroundColor: Colors.light.secondary.base,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  categoriesHeading: {
    color: Colors.light.primary.base,
    marginBottom: 16,
  },
  categoriesList: {
    backgroundColor: Colors.light.greyscale[0],
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.greyscale[20],
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryName: {
    fontFamily: FontFamilies.text.medium,
    fontSize: 14,
    color: Colors.light.greyscale[90],
  },
});

