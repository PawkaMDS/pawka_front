import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from "@/components/ui/Text";
import { Heading } from '@/components/ui/Heading';
import PageLayout from '@/components/layout/PageLayout';
import { Colors } from '@/constants/theme';

export default function Recommandation() {
  return (
    <PageLayout>
      <Heading as="h3" style={styles.heading}>Mes favoris</Heading>

      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Vous n'avez pas encore de favoris.</Text>
        <Text style={styles.emptySubText}>
          Scannez un produit et ajoutez-le à vos favoris pour le retrouver ici.
        </Text>
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  heading: {
    marginTop: 32,
    color: Colors.light.primary.base,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  emptyText: {
    color: Colors.light.greyscale[70],
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubText: {
    color: Colors.light.greyscale[50],
    fontSize: 14,
    textAlign: 'center',
  },
});
