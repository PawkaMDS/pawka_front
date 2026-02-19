import { Slot, Redirect } from "expo-router";
import { AuthProvider, useAuth } from "@/lib/auth/AuthContext";
import { View, ActivityIndicator, Platform, StatusBar } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as NavigationBar from "expo-navigation-bar";
import { useEffect, useState } from "react";
import * as SystemUI from "expo-system-ui";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

function RootNavigation() {
  const { isLoading, isAuthenticated } = useAuth();
  const [mustRegisterOnboard, setMustRegisterOnboard] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      const value = await AsyncStorage.getItem("needsRegisterOnboarding");
      setMustRegisterOnboard(value === "1");
    };
    checkOnboarding();
  }, [isAuthenticated]);

  if (isLoading || mustRegisterOnboard === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/loginRegister" />;
  }
  if (mustRegisterOnboard) {
    return <Redirect href="/(screens)/registerOnboarding" />;
  }
  return <Redirect href="/(tabs)/scan/scan" />;
}

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
    if (Platform.OS === "android") {
      StatusBar.setBarStyle("dark-content");
      NavigationBar.setButtonStyleAsync("dark");
      SystemUI.setBackgroundColorAsync("#FAFAFAFF");
    }
  }, []);

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <AuthProvider>
      <RootNavigation />
      <Slot />
    </AuthProvider>
  );
}
