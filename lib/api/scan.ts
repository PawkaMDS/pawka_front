import { getProductByEAN } from './products';
import type { Product } from '@/types/product';

function normalizeEAN(ean: string): string {
  const cleanEan = ean.trim();
  
  // Si le code a 12 chiffres (UPC-A), ajouter un 0 devant pour le convertir en EAN-13
  if (cleanEan.length === 12 && /^\d{12}$/.test(cleanEan)) {
    return '0' + cleanEan;
  }
  
  return cleanEan;
}

export async function scanProductByEAN(ean: string): Promise<Product | null> {
  const normalizedEan = normalizeEAN(ean);
  
  if (!normalizedEan || !/^\d{8,14}$/.test(normalizedEan)) {
    throw new Error('Code EAN invalide. Doit contenir entre 8 et 14 chiffres.');
  }

  try {
    console.log(`[SCAN] Code scanné: ${ean} → Normalisé: ${normalizedEan}`);
    console.log(`[SCAN] Recherche du produit ${normalizedEan} dans la base de données...`);
    const dbProduct = await getProductByEAN(normalizedEan);
    
    if (dbProduct) {
      console.log(`[SCAN] ✓ Produit trouvé dans la base de données`);
      return dbProduct;
    }

    console.log(`[SCAN] ✗ Produit non trouvé dans la base de données`);
    return null;
  } catch (error) {
    console.error(`[SCAN] Erreur lors du scan du produit ${normalizedEan}:`, error);
    throw error;
  }
}
