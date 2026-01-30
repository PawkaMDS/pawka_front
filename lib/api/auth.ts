import axios from 'axios';
import { api } from '@/lib/api/client';
import { tokenService } from '@/lib/auth/tokenService';
import { getCurrentUser } from '@/lib/api/users';
import type { User } from '@/types/user';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
}

export interface AuthResult {
  token: string;
  user: User;
}

/**
 * Connexion d'un utilisateur
 */
export async function login(credentials: LoginRequest): Promise<AuthResult> {
  try {
    // 1. Connexion et récupération du token
    const res = await api.post<AuthResponse>('/api/login', credentials);
    
    // 2. Sauvegarder le token
    if (res.data.accessToken) {
      await tokenService.saveToken(res.data.accessToken);
    }
    
    // 3. Récupérer les infos de l'utilisateur
    const user = await getCurrentUser();
    
    return {
      token: res.data.accessToken,
      user,
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const body = err.response?.data as any;
      
      // Gestion des erreurs spécifiques du backend
      if (body?.email) {
        throw new Error(body.email[0] || 'Email invalide');
      }
      if (body?.password) {
        throw new Error(body.password[0] || 'Mot de passe invalide');
      }
      
      const details = body?.message || body?.error || (typeof body === 'string' ? body : undefined) || err.message;
      throw new Error(`Erreur de connexion: ${details}`);
    }
    throw err as Error;
  }
}

/**
 * Inscription d'un nouvel utilisateur
 */
export async function register(credentials: RegisterRequest): Promise<AuthResult> {
  try {
    // 1. Inscription et récupération du token (le backend connecte automatiquement après l'inscription)
    const res = await api.post<AuthResponse>('/api/register', credentials);
    
    // 2. Sauvegarder le token
    if (res.data.accessToken) {
      await tokenService.saveToken(res.data.accessToken);
    }
    
    // 3. Récupérer les infos de l'utilisateur
    const user = await getCurrentUser();
    
    return {
      token: res.data.accessToken,
      user,
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const body = err.response?.data as any;
      
      // Gestion des erreurs spécifiques
      if (status === 400) {
        if (typeof body === 'string' && body === 'Bad Request') {
          throw new Error('Email déjà utilisé ou données invalides');
        }
        throw new Error(body?.message || 'Données invalides');
      }
      
      const details = body?.message || body?.error || (typeof body === 'string' ? body : undefined) || err.message;
      throw new Error(`Erreur d'inscription: ${details}`);
    }
    throw err as Error;
  }
}

/**
 * Déconnexion de l'utilisateur
 */
export async function logout(): Promise<void> {
  await tokenService.removeToken();
}
