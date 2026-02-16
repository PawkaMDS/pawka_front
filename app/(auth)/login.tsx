import { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image
} from "react-native";
import { Text } from "@/components/ui/Text";
import { useRouter } from "expo-router";
import { login } from "@/lib/api/auth";
import { register } from "@/lib/api/auth";
import { useAuth } from "@/lib/auth/AuthContext";
import { Colors } from "@/constants/theme";
import { FontFamilies, FontSizes } from "@/constants/typography";
import { Button } from "@/components/ui/Button";
import { Ionicons } from "@expo/vector-icons";
import LoadingComponent from "@/components/layout/LoadingComponent";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ONBOARDING_KEY = "hasSeenOnboarding";

export default function LoginScreen() {
  const router = useRouter();
  const { setUser } = useAuth();
  const insets = useSafeAreaInsets();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async () => {
    // Validation
    if (!email.trim()) {
      Alert.alert("Erreur", "L'email est requis");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Erreur", "Email invalide");
      return;
    }

    if (!password) {
      Alert.alert("Erreur", "Le mot de passe est requis");
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Erreur",
        "Le mot de passe doit contenir au moins 6 caractères"
      );
      return;
    }

    if (!isLogin) {
      if (!name.trim()) {
        Alert.alert("Erreur", "Le nom est requis");
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert("Erreur", "Les mots de passe ne correspondent pas");
        return;
      }
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        // Login
        const result = await login({ email: email.trim(), password });
        setUser(result.user);
      
      } else {
        // Register
        const result = await register({
          name: name.trim(),
          email: email.trim(),
          password,
        });
        setUser(result.user);
      
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : isLogin
          ? "Erreur de connexion"
          : "Erreur d'inscription";
      Alert.alert("Erreur", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToOnboarding = async () => {
    try {
      // Supprimer la clé pour revoir l'onboarding
      await AsyncStorage.removeItem(ONBOARDING_KEY);
      router.replace("/(screens)/onboarding");
    } catch (error) {
      console.error("Error resetting onboarding:", error);
      router.replace("/(screens)/onboarding");
    }
  };

  return (
    <>
      {isLoading ? (
        <LoadingComponent
          title="Chargement en cours"
          redirectTo="/(screens)/loading"
          duration={2500}
        />
      ) : (
        <View style={styles.outerContainer}>
      <SafeAreaView style={styles.container} edges={["top"]}>
        {/* Switch FIXE en haut */}
        <View style={styles.switchWrapper}>
        <View style={styles.switchContainer}>
          <TouchableOpacity
            style={[
              styles.switchButton,
              isLogin && styles.switchButtonActive,
            ]}
            onPress={() => setIsLogin(true)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.switchText,
                isLogin && styles.switchTextActive,
              ]}
            >
              Connexion
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.switchButton,
              !isLogin && styles.switchButtonActive,
            ]}
            onPress={() => setIsLogin(false)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.switchText,
                !isLogin && styles.switchTextActive,
              ]}
            >
              Créer un compte
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Formulaire scrollable */}
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={isLogin}
        >
          <View style={styles.formContainer}>
            {/* Nom (uniquement pour inscription) */}
            {!isLogin && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Nom complet</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Votre nom"
                  placeholderTextColor={Colors.light.greyscale[50]}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  editable={!isLoading}
                />
              </View>
            )}

            {/* Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Adresse E-mail</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.inputWithIcon}
                  placeholder="john-doe@gmail.com"
                  placeholderTextColor={Colors.light.greyscale[50]}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  editable={!isLoading}
                />
                {validateEmail(email) && (
                  <Ionicons
                    name="checkmark-circle"
                    size={22}
                    color={Colors.light.accent.base}
                  />
                )}
              </View>
            </View>

            {/* Mot de passe */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mot de passe</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.inputWithIcon}
                  placeholder="••••••••"
                  placeholderTextColor={Colors.light.greyscale[50]}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  editable={!isLoading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color={Colors.light.greyscale[60]}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirmer mot de passe (uniquement pour inscription) */}
            {!isLogin && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirmer le mot de passe</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.inputWithIcon}
                    placeholder="Renseignez votre mot de passe"
                    placeholderTextColor={Colors.light.greyscale[50]}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    editable={!isLoading}
                  />
                  <TouchableOpacity
                    onPress={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  >
                    <Ionicons
                      name={
                        showConfirmPassword
                          ? "eye-off-outline"
                          : "eye-outline"
                      }
                      size={22}
                      color={Colors.light.greyscale[60]}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Bouton principal */}
            <Button
              label={isLogin ? "Connexion" : "Créer mon compte"}
              variant="primary"
              fullWidth
              onPress={handleSubmit}
              disabled={isLoading}
              containerStyle={styles.primaryButton}
            />

            {/* Lien vers onboarding */}
            <TouchableOpacity
              onPress={handleGoToOnboarding}
              disabled={isLoading}
              style={styles.onboardingLink}
            >
              <Text style={styles.onboardingLinkText}>
                Revoir Onboarding
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Footer FIXE en bas avec safe area */}
      <View style={[styles.footerContainer, { bottom: insets.bottom }]}>
        <Image
          source={require("@/assets/images/footer-login.png")}
          style={styles.footerImage}
          resizeMode="cover"
        />
      </View>
        </View>
      )}
    </>
  );
} 
  

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: Colors.light.supportBase,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.light.supportBase,
    paddingHorizontal: 20,
  },

  /* SWITCH FIXE EN HAUT */
  switchWrapper: {
    paddingTop: Platform.OS === "ios" ? 40 : 20,
    marginTop: 30,
    paddingBottom: 20,
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  switchContainer: {
    flexDirection: "row",
    backgroundColor: Colors.light.primary.base,
    borderRadius: 30,
    padding: 2,
    height: 30,  
    overflow: "visible", 
  },
  switchButton: {
    flex: 1,
    paddingVertical: 5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 28,
  },
switchButtonActive: {
    backgroundColor: Colors.light.secondary.base,
    marginVertical: -9,  
    paddingVertical: 10, 
    elevation: 2,       

},
  switchText: {
    fontFamily: FontFamilies.text.regular,
    fontSize: FontSizes.bodyBase,
    color: Colors.light.supportBase,
  },
  switchTextActive: {
    fontFamily: FontFamilies.text.medium,
    color: Colors.light.primary.base,
  },

  /* ZONE SCROLLABLE */
  keyboardView: {
    flex: 1,
    marginBottom: 180,
  },
  scrollContent: {
    paddingBottom: 24,
  },

  /* FORMULAIRE - Espacements réduits */
  formContainer: {
    gap: 14,
    paddingBottom: 16,
    paddingHorizontal: 0,
  },
  inputContainer: {
    gap: 6,
  },
  label: {
    fontFamily: FontFamilies.text.medium,
    fontSize: FontSizes.bodySmall,
    color: Colors.light.primary[800],
  },
  input: {
    fontFamily: FontFamilies.text.regular,
    fontSize: FontSizes.bodyBase,
    color: Colors.light.greyscale[90],
    backgroundColor: Colors.light.supportBase,
    borderWidth: 1.5,
    borderColor: Colors.light.greyscale[30],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.supportBase,
    borderWidth: 1.5,
    borderColor: Colors.light.greyscale[30],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  inputWithIcon: {
    flex: 1,
    fontFamily: FontFamilies.text.regular,
    fontSize: FontSizes.bodyBase,
    color: Colors.light.greyscale[90],
    paddingVertical: 14,
  },

  /* BOUTON */
  primaryButton: {
    marginTop: 8,
  },

  /* LIEN ONBOARDING */
  onboardingLink: {
    alignItems: "center",
   
  },
  onboardingLinkText: {
    fontFamily: FontFamilies.text.regular,
    fontSize: FontSizes.bodySmall,
    color: Colors.light.primary.base,
    textDecorationLine: "underline",
  },

  /* FOOTER FIXE EN BAS AVEC SAFE AREA */
  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: 180,
    // Le footer prend en compte automatiquement les safe areas iOS
    paddingBottom: Platform.OS === "ios" ? 0 : 0,
  },
  footerImage: {
    width: "100%",
    height: "100%",
  },
});