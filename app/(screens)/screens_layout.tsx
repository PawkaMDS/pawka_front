import { Stack } from 'expo-router';

export default function ScreensLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: '#0A0A0F',
        },
        animation: 'fade',
      }}
    >
      {/* Écran d'onboarding - premier écran */}
      <Stack.Screen 
        name="onboarding"
        options={{
          title: 'Bienvenue',
        }}
      />
      
      {/* Écran de chargement après onboarding */}
      <Stack.Screen 
        name="loading"
        options={{
          title: 'Chargement',
        }}
      />
      
      {/* Écran de chargement après login */}
      <Stack.Screen 
        name="login-loading"
        options={{
          title: 'Connexion',
        }}
      />
    </Stack>
  );
}