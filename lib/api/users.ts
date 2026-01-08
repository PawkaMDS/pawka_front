import axios from 'axios';
import { api } from '@/lib/api/client';
import type { User } from '@/types/user';

export async function getCurrentUser(): Promise<User> {
  try {
    const res = await api.get<User>('/api/users/@me');
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      if (status === 401) throw new Error('Non autorisé. Veuillez vous connecter.');
      const body = err.response?.data as any;
      const details = body?.message || body?.error || (typeof body === 'string' ? body : undefined) || err.message;
      throw new Error(`Erreur API ${status ?? 'inconnue'} - ${details}`);
    }
    throw err as Error;
  }
}
