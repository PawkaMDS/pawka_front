export interface Product {
  id?: number;
  code_ean: string;
  name: string;
  brand?: string | null;
  is_verified?: boolean;
  image_url?: string | null;
  type_id?: number;
}
