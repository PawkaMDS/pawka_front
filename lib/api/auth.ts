import axios from 'axios';
import { api } from '@/lib/api/client';
import { tokenService } from '@/lib/auth/tokenService';
import { getCurrentUser } from '@/lib/api/users';
import type { User } from '@/types/user';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface LoginResult {
  token: string;
  user: User;
}

export async function login(credentials: LoginRequest): Promise<LoginResult> {
  try {
    // 1. Connexion et récupération du token
    const res = await api.post<LoginResponse>('/api/login', credentials);
    
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
      const details = body?.message || body?.error || (typeof body === 'string' ? body : undefined) || err.message;
      throw new Error(`Erreur de connexion ${status ?? 'inconnue'} - ${details}`);
    }
    throw err as Error;
  }
}

export async function logout(): Promise<void> {
  await tokenService.removeToken();
}
