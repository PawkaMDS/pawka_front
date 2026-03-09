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
export interface ScoreDetail {
  pt: number | null;
  pct: number | null;
  rationale: string;
}

export interface ProductScores {
  // ancien
  overall?: number;

  // nouveau format (scoring détaillé backend)
  protein_content?: ScoreDetail;
  fat_content?: ScoreDetail;
  carbohydrate_content?: ScoreDetail;
  fiber_content?: ScoreDetail;
  ingredient_quality?: ScoreDetail;
  protein_source_quality?: ScoreDetail;
  byproducts_presence?: ScoreDetail;
  chemical_additives?: ScoreDetail;
  beneficial_additives?: ScoreDetail;

  // si tu veux conserver d’anciens champs: (facultatif)
  nutritional_quality?: number;
  processing_level?: number;
  additives_score?: number;
}

// Interface pour le type de produit
export interface ProductType {
  id: number;
  code: string;
  name: string;
  icon_name?: string | null;
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
  total_score?: number | null;
  analyzed_at?: string | null;
  fediaf_conformity?: boolean;
  has_chemical_additives?: boolean;
  has_beneficial_additives?: boolean;
  sources?: string | null;
  score_version?: string | null;
  total_score?: number | null;

  // Relations
  animal_type?: AnimalType;
  food_type?: FoodType;
}

// Interface principale pour un produit
export interface Product {
  id: number;
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

export interface Alternative {
  id: number;
  code_ean: string;
  name: string;
  brand?: string | null;
  image: string | null;
  score_total: number;
}
