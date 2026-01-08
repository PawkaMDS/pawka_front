import axios from 'axios';
import { api } from '@/lib/api/client';
import type { Product, DetailedProduct } from '@/types/product';

export async function getProductByEAN(ean: string): Promise<Product | null> {
  try {
    const res = await api.get<Product>(`/api/products/ean/${encodeURIComponent(ean)}`);
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      if (status === 404) return null;
      const body = err.response?.data as any;
      const details = body?.message || body?.error || (typeof body === 'string' ? body : undefined) || err.message;
      throw new Error(`API error ${status ?? 'unknown'} - ${details}`);
    }
    throw err as Error;
  }
}

export async function getProductById(id: number): Promise<DetailedProduct | null> {
  try {
    // Le token est automatiquement ajouté par l'intercepteur
    const res = await api.get<DetailedProduct>(`/api/products/${id}`);
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      if (status === 404) return null;
      if (status === 401) throw new Error('Non autorisé. Veuillez vous connecter.');
      const body = err.response?.data as any;
      const details = body?.message || body?.error || (typeof body === 'string' ? body : undefined) || err.message;
      throw new Error(`API error ${status ?? 'unknown'} - ${details}`);
    }
    throw err as Error;
  }
}
