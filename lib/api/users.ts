import axios from 'axios';
import { api } from '@/lib/api/client';
import type { User } from '@/types/user';

/**
 * Récupère les informations de l'utilisateur connecté
 */
export async function getCurrentUser(): Promise<User> {
  try {
    const res = await api.get<User>('/api/users/@me');
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      
      if (status === 401) {
        throw new Error('Non autorisé. Veuillez vous connecter.');
      }
      
      const body = err.response?.data as any;
      const details = body?.message || body?.error || (typeof body === 'string' ? body : undefined) || err.message;
      throw new Error(`Erreur API ${status ?? 'inconnue'} - ${details}`);
    }
    throw err as Error;
  }
}

/**
 * Récupère tous les utilisateurs (admin uniquement)
 */
export async function getAllUsers(): Promise<User[]> {
  try {
    const res = await api.get<User[]>('/users');
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      
      if (status === 401) {
        throw new Error('Non autorisé. Veuillez vous connecter.');
      }
      
      if (status === 403) {
        throw new Error('Accès interdit. Vous n\'avez pas les permissions nécessaires.');
      }
      
      const body = err.response?.data as any;
      const details = body?.message || body?.error || (typeof body === 'string' ? body : undefined) || err.message;
      throw new Error(`Erreur API ${status ?? 'inconnue'} - ${details}`);
    }
    throw err as Error;
  }
}