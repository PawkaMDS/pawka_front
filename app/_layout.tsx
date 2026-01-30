import { Slot, Redirect } from "expo-router";
import { AuthProvider, useAuth } from "@/lib/auth/AuthContext";
import { View, ActivityIndicator } from "react-native";

function RootNavigation() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/welcome" />;
  }
  return <Redirect href="/(tabs)/scan/scan" />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigation />
      <Slot />
    </AuthProvider>
  );
}
