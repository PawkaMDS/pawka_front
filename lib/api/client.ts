import axios from 'axios';
import { tokenService } from '@/lib/auth/tokenService';

export const getApiBaseUrl = (): string => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');
  if (envUrl) return envUrl;

  //TODO mettre l'URL de production ici
  return 'http://localhost:8081';
};

export const API_BASE_URL = getApiBaseUrl();

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
  },
});

// Intercepteur pour ajouter automatiquement le token à chaque requête
api.interceptors.request.use(
  async (config) => {
    const token = await tokenService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token invalide ou expiré, on le supprime
      await tokenService.removeToken();
    }
    return Promise.reject(error);
  }
);
