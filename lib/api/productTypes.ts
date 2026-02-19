import axios from 'axios';
import { api } from '@/lib/api/client';
import type { ProductType } from '@/types/product';

/**
 * Récupère tous les types de produits disponibles.
 */
export async function getProductTypes(): Promise<ProductType[]> {
    try {
        const res = await api.get<ProductType[]>('/api/product-types');
        return res.data;
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
