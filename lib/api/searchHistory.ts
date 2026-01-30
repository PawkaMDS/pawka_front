import axios, {isAxiosError} from 'axios';
import { api } from '@/lib/api/client';
import type { Product } from '@/types/product';

export interface SearchHistoryItem {
    id: number;
    user_id: number;
    product_id: number;
    createdAt?: string;
    updatedAt?: string;
    product?: Product | null;
}

/**
 * Récupère l'historique de recherche de l'utilisateur authentifié.
 */
export async function getSearchHistory(): Promise<SearchHistoryItem[]> {
    try {
        const res = await api.get<{ message?: string; data: SearchHistoryItem[] }>(`/api/search-history`);
        return res.data.data || [];
    } catch (err) {
        if (axios.isAxiosError(err)) {
            const status = err.response?.status;
            const body = err.response?.data as any;
            const details = body?.message || body?.error || (typeof body === 'string' ? body : undefined) || err.message;
            throw new Error(`API error ${status ?? 'unknown'} - ${details}`);
        }
        throw err as Error;
    }
}

export default { getSearchHistory };
