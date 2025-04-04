// Mannequin Types
export interface Measurements {
  chest: number;
  waist: number;
  hips: number;
  height: number;
  shoulders: number;
  inseam: number;
  neckCircumference: number;
  armLength: number;
}

export type Gender = "male" | "female";

export interface MannequinConfig {
  gender: Gender;
  measurements: Measurements;
}

// Clothing Types
export interface ClothingItem {
  id: string;
  name: string;
  type: ClothingType;
  thumbnailUrl: string;
  modelUrl?: string;
  size: string;
  color: string;
  brand: string;
  description: string;
  category: ClothingCategory;
}

export type ClothingType = 
  | "shirt" 
  | "pants" 
  | "dress" 
  | "jacket" 
  | "skirt" 
  | "shoes";

export type ClothingCategory = 
  | "casual" 
  | "formal" 
  | "athletic" 
  | "swimwear" 
  | "outerwear";

// Brand Settings
export interface BrandSettings {
  name: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
}

// Mannequin Customization Scale Factors
export interface ScaleFactors {
  chest: number;
  waist: number;
  hips: number;
  height: number;
  shoulders: number;
  limbs: number;
  neck: number;
}
