import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "@/lib/auth/AuthContext";

import { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "NewZen-Regular": require("@/assets/fonts/NewZen-Regular.otf"),
    "NewZen-Medium": require("@/assets/fonts/NewZen-Medium.otf"),
    "NewZen-Bold": require("@/assets/fonts/NewZen-Bold.otf"),

    "TommySoft-Regular": require("@/assets/fonts/MadeTommySoft-Regular.otf"),
    "TommySoft-Medium": require("@/assets/fonts/MadeTommySoft-Medium.otf"),
    "TommySoft-Bold": require("@/assets/fonts/MadeTommySoft-Bold.otf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AuthProvider>
  );
}
