import { Request, Response } from "express";
import { storage } from "../storage";
import { ClothingItem } from "../../client/src/types";

// Sample clothing data (would be in database in production)
const sampleClothing: ClothingItem[] = [
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

export const getAllClothing = async (req: Request, res: Response) => {
  try {
    // In a real app, this would fetch from database
    res.json(sampleClothing);
  } catch (error) {
    console.error("Error fetching clothing:", error);
    res.status(500).json({ message: "Error fetching clothing items" });
  }
};

export const getClothingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const clothingItem = sampleClothing.find(item => item.id === id);
    
    if (!clothingItem) {
      return res.status(404).json({ message: "Clothing item not found" });
    }
    
    res.json(clothingItem);
  } catch (error) {
    console.error("Error fetching clothing item:", error);
    res.status(500).json({ message: "Error fetching clothing item" });
  }
};

export const getClothingByType = async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    const clothingItems = sampleClothing.filter(item => item.type === type);
    
    res.json(clothingItems);
  } catch (error) {
    console.error("Error fetching clothing by type:", error);
    res.status(500).json({ message: "Error fetching clothing items" });
  }
};

export const getClothingByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const clothingItems = sampleClothing.filter(item => item.category === category);
    
    res.json(clothingItems);
  } catch (error) {
    console.error("Error fetching clothing by category:", error);
    res.status(500).json({ message: "Error fetching clothing items" });
  }
};
