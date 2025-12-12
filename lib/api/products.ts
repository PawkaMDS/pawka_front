import axios from 'axios';
import { api } from '@/lib/api/client';
import type { Product } from '../../types/product';

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
