export interface AnimalType {
  id: number;
  code: string;
  name: string;
}

export interface AnimalBreed {
  id: number;
  code: string;
  name: string;
}

export interface Animal {
  id: number;
  name: string;
  user_id: number;
  animal_type_id: number;
  breed_id: number;
  birth_date: string;
  weight?: number | null;
  is_sterilized: boolean;
  image_url?: string | null;
  createdAt?: string;
  updatedAt?: string;
  
  // Relations
  type?: AnimalType;
  breed?: AnimalBreed;
}
