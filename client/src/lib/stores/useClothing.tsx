import { create } from "zustand";
import { ClothingItem } from "../../types";

interface ClothingState {
  catalog: ClothingItem[];
  selectedItems: ClothingItem[];
  
  // Actions
  addSelectedItem: (item: ClothingItem) => void;
  removeSelectedItem: (itemId: string) => void;
  clearSelectedItems: () => void;
  loadCatalog: () => Promise<void>;
}

// Initial demo catalog
const demoCatalog: ClothingItem[] = [
  {
    id: "shirt-1",
    name: "Classic White Shirt",
    type: "shirt",
    thumbnailUrl: "/textures/wood.jpg",
    modelUrl: "/models/shirt_white.glb",
    size: "M",
    color: "white",
    brand: "Eleganza",
    description: "A timeless white button-up shirt for any occasion",
    category: "formal"
  },
  {
    id: "shirt-2",
    name: "Blue Casual Tee",
    type: "shirt",
    thumbnailUrl: "/textures/sky.png",
    modelUrl: "/models/tshirt_blue.glb",
    size: "L",
    color: "blue",
    brand: "Urban Style",
    description: "Comfortable lightweight t-shirt for everyday wear",
    category: "casual"
  },
  {
    id: "pants-1",
    name: "Black Slim Pants",
    type: "pants",
    thumbnailUrl: "/textures/asphalt.png",
    modelUrl: "/models/pants_black.glb",
    size: "32",
    color: "black",
    brand: "Eleganza",
    description: "Slim fit black pants for a professional look",
    category: "formal"
  },
  {
    id: "pants-2",
    name: "Blue Denim Jeans",
    type: "pants",
    thumbnailUrl: "/textures/sky.png",
    modelUrl: "/models/jeans_blue.glb",
    size: "30",
    color: "blue",
    brand: "Urban Style",
    description: "Classic blue jeans with a comfortable fit",
    category: "casual"
  },
  {
    id: "dress-1",
    name: "Summer Floral Dress",
    type: "dress",
    thumbnailUrl: "/textures/grass.png",
    modelUrl: "/models/dress_floral.glb",
    size: "S",
    color: "floral",
    brand: "Eleganza",
    description: "Light summer dress with floral pattern",
    category: "casual"
  },
  {
    id: "jacket-1",
    name: "Black Blazer",
    type: "jacket",
    thumbnailUrl: "/textures/asphalt.png",
    modelUrl: "/models/blazer_black.glb",
    size: "M",
    color: "black",
    brand: "Eleganza",
    description: "Professional blazer for business attire",
    category: "formal"
  },
  {
    id: "jacket-2",
    name: "Denim Jacket",
    type: "jacket",
    thumbnailUrl: "/textures/sky.png",
    modelUrl: "/models/jacket_denim.glb",
    size: "L",
    color: "blue",
    brand: "Urban Style",
    description: "Classic denim jacket for casual wear",
    category: "casual"
  },
  {
    id: "skirt-1",
    name: "A-Line Skirt",
    type: "skirt",
    thumbnailUrl: "/textures/sand.jpg",
    modelUrl: "/models/skirt_beige.glb",
    size: "M",
    color: "beige",
    brand: "Eleganza",
    description: "A-line skirt for versatile styling",
    category: "casual"
  },
  {
    id: "shoes-1",
    name: "Black Leather Shoes",
    type: "shoes",
    thumbnailUrl: "/textures/asphalt.png",
    modelUrl: "/models/shoes_black.glb",
    size: "42",
    color: "black",
    brand: "Eleganza",
    description: "Formal leather shoes for professional settings",
    category: "formal"
  },
  {
    id: "shoes-2",
    name: "White Sneakers",
    type: "shoes",
    thumbnailUrl: "/textures/sand.jpg",
    modelUrl: "/models/sneakers_white.glb",
    size: "41",
    color: "white",
    brand: "Urban Style",
    description: "Comfortable casual sneakers",
    category: "casual"
  }
];

export const useClothing = create<ClothingState>((set) => ({
  catalog: [],
  selectedItems: [],
  
  addSelectedItem: (item) => {
    set((state) => {
      // Check if we already have an item of this type
      const existingItemIndex = state.selectedItems.findIndex(
        (i) => i.type === item.type
      );
      
      let newSelectedItems;
      
      if (existingItemIndex >= 0) {
        // Replace the existing item of the same type
        newSelectedItems = [...state.selectedItems];
        newSelectedItems[existingItemIndex] = item;
      } else {
        // Add new item
        newSelectedItems = [...state.selectedItems, item];
      }
      
      return { selectedItems: newSelectedItems };
    });
  },
  
  removeSelectedItem: (itemId) => {
    set((state) => ({
      selectedItems: state.selectedItems.filter((item) => item.id !== itemId)
    }));
  },
  
  clearSelectedItems: () => {
    set({ selectedItems: [] });
  },
  
  loadCatalog: async () => {
    try {
      // In a real app, this would fetch from an API
      // For demo purposes, we'll use the demo catalog directly
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set({ catalog: demoCatalog });
    } catch (error) {
      console.error("Failed to load catalog:", error);
    }
  }
}));
