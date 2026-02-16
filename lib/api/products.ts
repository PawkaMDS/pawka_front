import axios from 'axios';
import { api } from '@/lib/api/client';
import type { Product, DetailedProduct } from '@/types/product';

export interface ProductSearchResult {
  id: number;
  name: string;
  brand?: string | null;
  image_url?: string | null;
  is_verified?: boolean;
  certification?: string | null;
  type?: { id: number; code: string; name: string } | null;
  animal_type?: { id: number; code: string; name: string } | null;
  food_type?: { id: number; code: string; name: string } | null;
  scores?: Record<string, { pt: number | null; pct: number | null }>;
  moisture_percent?: number | null;
  analytical_composition?: Record<string, number | null> | null;
}

export async function searchProducts(
  q?: string,
  filters?: { animal_type?: string; food_type?: string; product_type_code?: string }
): Promise<ProductSearchResult[]> {
  try {
    const params: Record<string, string> = {};
    if (q) params.q = q;
    if (filters?.animal_type) params.animal_type = filters.animal_type;
    if (filters?.food_type) params.food_type = filters.food_type;
    if (filters?.product_type_code) params.product_type_code = filters.product_type_code;
    const res = await api.get<ProductSearchResult[]>('/api/products/search', { params });
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
