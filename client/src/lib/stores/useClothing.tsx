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
    thumbnailUrl: "/textures/wood.jpg", // Using available texture as placeholder
    size: "M",
    color: "white",
    brand: "Fashion Brand",
    description: "A classic white button-up shirt for any occasion",
    category: "casual"
  },
  {
    id: "pants-1",
    name: "Black Slim Pants",
    type: "pants",
    thumbnailUrl: "/textures/asphalt.png", // Using available texture as placeholder
    size: "32",
    color: "black",
    brand: "Fashion Brand",
    description: "Slim fit black pants for a professional look",
    category: "formal"
  },
  {
    id: "dress-1",
    name: "Summer Floral Dress",
    type: "dress",
    thumbnailUrl: "/textures/grass.png", // Using available texture as placeholder
    size: "S",
    color: "floral",
    brand: "Fashion Brand",
    description: "Light summer dress with floral pattern",
    category: "casual"
  },
  {
    id: "jacket-1",
    name: "Denim Jacket",
    type: "jacket",
    thumbnailUrl: "/textures/sky.png", // Using available texture as placeholder
    size: "L",
    color: "blue",
    brand: "Fashion Brand",
    description: "Classic denim jacket for casual wear",
    category: "casual"
  },
  {
    id: "skirt-1",
    name: "A-Line Skirt",
    type: "skirt",
    thumbnailUrl: "/textures/sand.jpg", // Using available texture as placeholder
    size: "M",
    color: "beige",
    brand: "Fashion Brand",
    description: "A-line skirt for versatile styling",
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
