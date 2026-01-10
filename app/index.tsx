import { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Text } from "@/components/ui/Text";
import { Redirect } from "expo-router";
import { login } from "@/lib/api/auth";
import { useAuth } from "@/lib/auth/AuthContext";

export default function Index() {
  const { setUser } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await login({
        email: "user1@gmail.com",
        password: "123456",
      });

      setUser(response.user);

      Alert.alert(
        "Connexion réussie",
        `Bienvenue ${response.user.name} !\n${
          response.user.is_premium ? "⭐ Compte Premium" : "📱 Compte Standard"
        }`
      );
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert(
        "Erreur de connexion",
        error instanceof Error ? error.message : "Une erreur est survenue"
      );
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn) {
    return <Redirect href="/(tabs)/search" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur Pawka</Text>
      <Text style={styles.subtitle}>Scannez et découvrez vos produits</Text>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Connexion..." : "Se connecter"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
    minWidth: 200,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#A0A0A0",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
