import axios from 'axios';
import type { Product } from '@/types/product';

interface OFFProductLike {
  code?: string;
  product_name?: string;
  product_name_fr?: string;
  product_name_en?: string;
  generic_name?: string;
  brands?: string;
  categories?: string; // comma-separated categories
  categories_tags?: string[] | string; // array (v2) or string (v0)
}

interface OFFResponseV0 {
  code?: string;
  status?: number;
  product?: OFFProductLike;
}

interface OFFResponseV2 {
  product?: OFFProductLike;
  status?: number;
  status_verbose?: string;
}

function extractName(p?: OFFProductLike | null): string | null {
  if (!p) return null;
  return (
    p.product_name?.trim() ||
    p.product_name_fr?.trim() ||
    p.product_name_en?.trim() ||
    p.generic_name?.trim() ||
    null
  );
}

function isPetFood(p?: OFFProductLike | null): boolean {
  if (!p) return false;
  const tags: string[] = Array.isArray(p.categories_tags)
    ? (p.categories_tags as string[])
    : typeof p.categories_tags === 'string' && p.categories_tags
    ? (p.categories_tags as string).split(',').map(s => s.trim())
    : [];
  const catsStr = p.categories || '';
  const cats = catsStr.split(',').map(s => s.trim().toLowerCase());

  const haystack = [
    ...tags.map(t => t.toLowerCase()),
    ...cats,
  ].join(' ');

  const needles = [
    'pet-food',
    'dog-food',
    'cat-food',
    'chien',
    'chat',
    'animaux',
    'aliments-pour-chiens',
    'aliments-pour-chats',
    'aliments-pour-animaux',
  ];

  return needles.some(n => haystack.includes(n));
}

export async function getOpenPetFoodFactsProductByEAN(ean: string): Promise<Product | null> {
  const urls = [
    `https://world.openpetfoodfacts.org/api/v2/product/${encodeURIComponent(ean)}`,
    `https://world.openpetfoodfacts.org/api/v0/product/${encodeURIComponent(ean)}.json`,
  ];

  for (const url of urls) {
    try {
      const res = await axios.get(url, { timeout: 8000 });
      const data = res.data as OFFResponseV2 | OFFResponseV0 | any;
      const product: OFFProductLike | undefined = (data && (data.product || data.products?.[0])) || undefined;
      const name = extractName(product);
      if (name && isPetFood(product)) {
        const code = (product?.code || ean).toString();
        return {
          code_ean: code,
          name,
          brand: product?.brands?.split(',')[0]?.trim() || undefined,
        } as Product;
      }
    } catch (_e) {
    }
  }

  return null;
}
