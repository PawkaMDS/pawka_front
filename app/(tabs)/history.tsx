import { View } from 'react-native';
import { Text } from "@/components/ui/Text";
import { Heading } from '@/components/ui/Heading';

export default function History() {
  return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
      <Heading as="h1">Historique</Heading>
      <Text style={{ marginTop: 16 }}>Ici les elements</Text>
    </View>
  );
}
