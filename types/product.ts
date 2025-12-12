// Types pour les énumérations
export type LifeStage = 'puppy' | 'adult' | 'senior' | 'kitten';
export type BreedSize = 'toy' | 'small' | 'medium' | 'large' | 'giant';

// Interface pour la composition analytique
export interface AnalyticalComposition {
  proteins?: number;
  fats?: number;
  fibers?: number;
  ash?: number;
  calcium?: number;
  phosphorus?: number;
  [key: string]: number | undefined;
}

// Interface pour les scores
export interface ProductScores {
  overall?: number; // Score global sur 100
  nutritional_quality?: number;
  ingredient_quality?: number;
  processing_level?: number;
  additives_score?: number;
  [key: string]: number | undefined;
}

// Interface pour le type de produit
export interface ProductType {
  id: number;
  code: string;
  name: string;
}

// Interface pour le type d'animal
export interface AnimalType {
  id: number;
  code: string;
  name: string;
}

// Interface pour le type de nourriture
export interface FoodType {
  id: number;
  code: string;
  name: string;
  default_moisture?: number;
}

// Interface pour ProductFood (détails nutritionnels)
export interface ProductFood {
  id: number;
  product_id: number;
  animal_type_id: number;
  food_type_id: number;
  ingredients?: string | null;
  analytical_composition?: AnalyticalComposition | null;
  life_stage?: LifeStage | null;
  is_for_sterilised?: boolean;
  breed_size?: BreedSize | null;
  moisture_percent?: number | null;
  scores?: ProductScores | null;
  analyzed_at?: string | null;
  fediaf_conformity?: boolean;
  has_chemical_additives?: boolean;
  has_beneficial_additives?: boolean;
  sources?: string | null;
  score_version?: string | null;
  
  // Relations
  animal_type?: AnimalType;
  food_type?: FoodType;
}

// Interface principale pour un produit
export interface Product {
  id?: number;
  code_ean: string;
  name: string;
  brand?: string | null;
  is_verified?: boolean;
  image_url?: string | null;
  type_id?: number;
  
  // Relations
  type?: ProductType;
  product_foods?: ProductFood[];
}

// Type helper pour un produit avec tous ses détails
export type DetailedProduct = Required<Pick<Product, 'id' | 'code_ean' | 'name'>> & Product & {
  product_foods: ProductFood[];
};
