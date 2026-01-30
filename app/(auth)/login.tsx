import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { login } from '@/lib/api/auth';
import { useAuth } from '@/lib/auth/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { setUser } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    // Validation email
    if (!email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email invalide';
    }

    // Validation password
    if (!password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    // Reset errors
    setErrors({});

    // Validation
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await login({ email: email.trim(), password });
      
      // Mettre à jour le contexte auth
      setUser(result.user);
      
      // Redirection vers la page principale
      router.replace('/(tabs)/scan/scan');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion';
      Alert.alert('Erreur', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const goToRegister = () => {
    router.push('/(auth)/register');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.title}>Connexion</Text>
          <Text style={styles.subtitle}>Connectez-vous à votre compte</Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="votre@email.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              editable={!isLoading}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mot de passe</Text>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="••••••••"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
              editable={!isLoading}
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Se connecter</Text>
            )}
          </TouchableOpacity>

          {/* Register Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Pas encore de compte ? </Text>
            <TouchableOpacity onPress={goToRegister} disabled={isLoading}>
              <Text style={styles.link}>S'inscrire</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  inputError: {
    borderColor: '#ff4444',
    backgroundColor: '#fff5f5',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#99c9ff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  link: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
});