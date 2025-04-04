import { create } from "zustand";
import { BrandSettings } from "../../types";
import { getLocalStorage, setLocalStorage } from "../utils";

interface BrandSettingsState {
  settings: BrandSettings;
  
  // Actions
  updateSettings: (settings: Partial<BrandSettings>) => void;
  resetSettings: () => void;
  loadSettings: () => void;
  saveSettings: () => void;
}

const defaultSettings: BrandSettings = {
  name: "Fashion Brand",
  logo: "",
  primaryColor: "#3b82f6", // blue-500
  secondaryColor: "#f97316", // orange-500
  accentColor: "#10b981", // emerald-500
  fontFamily: "Inter, sans-serif",
};

export const useBrandSettings = create<BrandSettingsState>((set, get) => ({
  settings: { ...defaultSettings },
  
  updateSettings: (newSettings) => {
    set((state) => ({
      settings: {
        ...state.settings,
        ...newSettings
      }
    }));
    
    // Save to localStorage
    get().saveSettings();
  },
  
  resetSettings: () => {
    set({ settings: { ...defaultSettings } });
    get().saveSettings();
  },
  
  loadSettings: () => {
    const savedSettings = getLocalStorage("brandSettings");
    
    if (savedSettings) {
      set({ settings: { ...defaultSettings, ...savedSettings } });
    }
  },
  
  saveSettings: () => {
    const { settings } = get();
    setLocalStorage("brandSettings", settings);
  }
}));
