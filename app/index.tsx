import { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "@/lib/auth/AuthContext";

/**
 * Page racine de l'application
 * Redirige automatiquement vers :
 * - (auth)/welcome si l'utilisateur n'est PAS connecté
 * - (tabs) si l'utilisateur EST connecté
 */
export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  // Afficher un loader pendant la vérification de l'authentification
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Redirection automatique selon l'état de connexion
  if (isAuthenticated) {
    // Utilisateur connecté → aller dans l'app
    return <Redirect href="/(tabs)/scan/scan" />;
  }

  // Utilisateur non connecté → afficher la page de bienvenue
  return <Redirect href="/(auth)/loginRegister" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});