import { View } from 'react-native';
import { Text } from "@/components/ui/Text";
import { Heading } from '@/components/ui/Heading';

export default function Search() {
  return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
      <Heading as="h1">Recherche</Heading>
      {/* <Heading as="h1" style={{ marginTop: 16 }}>Ingrédients h1</Heading>
      <Heading as="h2" style={{ marginTop: 16 }}>Ingrédients h2</Heading>
      <Heading as="h3" style={{ marginTop: 16 }}>Ingrédients h3</Heading>
      <Heading as="h4" style={{ marginTop: 16 }}>Ingrédients h4</Heading>
      <Heading as="h5" style={{ marginTop: 16 }}>Ingrédients h5</Heading> */}
      <Text style={{ marginTop: 16 }}>Texte ici</Text>
    </View>
  );
}
