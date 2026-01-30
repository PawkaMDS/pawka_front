import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: '#fff',
        },
        animation: 'slide_from_right', // Animation fluide entre les pages
      }}
    >
      {/* Page de bienvenue - première page */}
      <Stack.Screen 
        name="welcome"
        options={{
          title: 'Bienvenue',
        }}
      />
      
      {/* Page de connexion */}
      <Stack.Screen 
        name="login"
        options={{
          title: 'Connexion',
        }}
      />
      
      {/* Page d'inscription */}
      <Stack.Screen 
        name="register"
        options={{
          title: 'Inscription',
        }}
      />
    </Stack>
  );
}