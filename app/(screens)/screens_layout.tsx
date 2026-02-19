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
      
      {/* Onboarding après inscription */}
      <Stack.Screen 
        name="registerOnboarding"
        options={{
          title: 'Inscription',
        }}
      />
      
    </Stack>
  );
}