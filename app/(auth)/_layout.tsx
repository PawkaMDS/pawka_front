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
      
      {/* Page de connexion */}
      <Stack.Screen 
        name="login"
        options={{
          title: 'Connexion',
        }}
      />
      
    </Stack>
  );
}