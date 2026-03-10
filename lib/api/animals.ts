import axios from 'axios';
import { api } from '@/lib/api/client';
import type { Animal } from '@/types/animal';

/**
 * Récupère tous les animaux de l'utilisateur connecté
 */
export async function getUserAnimals(): Promise<Animal[]> {
    try {
        const res = await api.get<Animal[]>('/api/users/@me/animals');
        return res.data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            const status = err.response?.status;

            if (status === 401) {
                throw new Error('Non autorisé. Veuillez vous connecter.');
            }

            const body = err.response?.data as any;
            const details =
                body?.message ||
                body?.error ||
                (typeof body === 'string' ? body : undefined) ||
                err.message;
            throw new Error(`Erreur API ${status ?? 'inconnue'} - ${details}`);
        }
        throw err as Error;
    }
}

/**
 * Récupère un animal spécifique
 */
export async function getAnimal(animalId: number): Promise<Animal> {
    try {
        const res = await api.get<Animal>(`/api/animals/${animalId}`);
        return res.data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            const status = err.response?.status;

            if (status === 404) {
                throw new Error('Animal non trouvé.');
            }

            if (status === 401) {
                throw new Error('Non autorisé. Veuillez vous connecter.');
            }

            const body = err.response?.data as any;
            const details =
                body?.message ||
                body?.error ||
                (typeof body === 'string' ? body : undefined) ||
                err.message;
            throw new Error(`Erreur API ${status ?? 'inconnue'} - ${details}`);
        }
        throw err as Error;
    }
}
