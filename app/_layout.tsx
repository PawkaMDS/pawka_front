import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "@/lib/auth/AuthContext";

import { useEffect } from "react";
import { Platform } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as NavigationBar from "expo-navigation-bar";

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

  // Android: dark-style navigation bar buttons
  useEffect(() => {
    if (Platform.OS !== "android") return;
    NavigationBar.setButtonStyleAsync("dark");
  }, []);

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <AuthProvider>
      <StatusBar style="dark" />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AuthProvider>
  );
}
