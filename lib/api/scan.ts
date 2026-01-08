import axios from 'axios';
import { api } from '@/lib/api/client';
import type { Product } from '@/types/product';

function normalizeEAN(ean: string): string {
  const cleanEan = ean.trim();
  
  // Si le code a 12 chiffres (UPC-A), ajouter un 0 devant pour le convertir en EAN-13
  if (cleanEan.length === 12 && /^\d{12}$/.test(cleanEan)) {
    return '0' + cleanEan;
  }
  
  return cleanEan;
}

export interface ScanResponse {
  status: 'ok' | 'created' | 'already_exists' | 'not_found' | 'error';
  product?: Product;
  analysis?: any;
}

export async function scanProductByEAN(ean: string): Promise<Product | null> {
  const normalizedEan = normalizeEAN(ean);
  
  if (!normalizedEan || !/^\d{8,14}$/.test(normalizedEan)) {
    throw new Error('Code EAN invalide. Doit contenir entre 8 et 14 chiffres.');
  }

  try {
    console.log(`[SCAN] Code scanné: ${ean} → Normalisé: ${normalizedEan}`);
    console.log(`[SCAN] Analyse du produit ${normalizedEan}...`);
    
    const res = await api.post<ScanResponse>(`/api/products/scan/${encodeURIComponent(normalizedEan)}`);
    
    if (res.data.status === 'already_exists') {
      console.log(`[SCAN] ✓ Produit déjà existant en base de données`);
      return res.data.product || null;
    }
    
    if (res.data.status === 'created' || res.data.status === 'ok') {
      console.log(`[SCAN] ✓ Produit créé avec succès`);
      return res.data.product || null;
    }

    if (res.data.status === 'not_found') {
      console.log(`[SCAN] ✗ Produit non trouvé`);
      return null;
    }

    console.warn(`[SCAN] Statut inattendu: ${res.data.status}`);
    return null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const body = error.response?.data as any;
      const details = body?.error || body?.message || (typeof body === 'string' ? body : undefined) || error.message;
      console.error(`[SCAN] Erreur API ${status}:`, details);
      throw new Error(`Erreur lors du scan: ${details}`);
    }
    console.error(`[SCAN] Erreur lors du scan du produit ${normalizedEan}:`, error);
    throw error;
  }
}
