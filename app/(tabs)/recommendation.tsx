import { View } from 'react-native';
import { Text } from "@/components/ui/Text";
import { Heading } from '@/components/ui/Heading';
import PageLayout from '@/components/layout/PageLayout';

export default function Recommandation() {
  return (
    <PageLayout>
      <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
        <Heading as="h1">Favoris</Heading>
        <Text style={{ marginTop: 16 }}>Texte</Text>
      </View>
    </PageLayout>
  );
}
